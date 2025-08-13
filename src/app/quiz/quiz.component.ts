import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Answer, Question } from '../model/question';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute, Router, RouterLink, NavigationStart } from '@angular/router';
import { LoginService } from '../services/login.service';
import { forkJoin, interval, Subscription } from 'rxjs';
import { TimerPipe } from '../cutomtimerpipe/timer.pipe';
import { CanComponentDeactivate } from '../guards/can-deactivate.interface';
import { QuizModalComponent } from '../quiz-model/quiz-model.component';

@Component({
  selector: 'quiz',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TimerPipe, QuizModalComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  pendingNavigationResolve: ((value: boolean) => void) | null = null;

  protected quizForm = new FormGroup({
    category: new FormControl(),
    subCategory: new FormControl(),
    level: new FormControl(),
    questions: new FormArray<FormControl<Question>>([]),
  });

  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private loginService = inject(LoginService);

  modalType: 'unanswered' | 'confirmSubmit' | 'navigateAway' | 'timeUp' | null = null;
  unansweredCount = 0;
  @ViewChild(QuizModalComponent) quizModal!: QuizModalComponent;

  public currentUserFirstName: string = "";
  public currentQuestionIndex: number = 0;
  public progress: string = "0";
  protected isQuizCompleted: boolean = false;
  protected isQuizSubmitted: boolean = false;
  interval$: any;
  protected score = 0;
  protected correctAnswer = 0;
  protected incorrectAnswer = 0;



  private LEVEL_TIMES: Record<string, number> = {
    easy: 30,    // 5 minutes
    medium: 600,  // 10 minutes
    hard: 900     // 15 minutes
  };

  public timeLeft: number = 0;
  private timerSubscription!: Subscription;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const subCategory: string = params['subcategory'];
      const level = params['level'];
      this.setQuestionFormArray(category, subCategory, level);
    });

    this.quizForm.valueChanges.subscribe(v => {
      this.setProgessPercentage();
    });

    this.quizForm.get('level')?.valueChanges.subscribe(level => {
      this.startTimer(level)
    })
    this.startTimer(this.quizForm.get('level')?.value);
    this.getCurrentUserName();
  }

  private setQuestionFormArray(category: string, subCategory: string, level: string) {
    this.quizForm.get('category')?.setValue(category);
    this.quizForm.get('subCategory')?.setValue(subCategory);
    this.quizForm.get('level')?.setValue(level);

    this.quizService.getQuestionsByCategory(category, subCategory, level).subscribe(list => {
      const questionFA = this.getQuestionsFormArray()
      list.map(que => this.createQuestionFG(que))
        .forEach(val => questionFA.push(val))
    });
  }

  protected getQuestionsFormArray() {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionFG(question: Question) {
    return new FormGroup({
      questionId: new FormControl(question.questionId),
      question: new FormControl(question.question),
      options: new FormControl(question.options),
      selectedAnswer: new FormControl(null),
      correctAnswer: new FormControl(null)
    })
  }

  getOptions(index: number): string[] {
    const fg = this.getQuestionsFormArray().controls.at(index) as FormGroup;
    return fg.controls['options']?.value || [];
  }

  previouseQuestion() {
    this.currentQuestionIndex--;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.getQuestionsFormArray().length - 1) {
      this.currentQuestionIndex++;
    }
  }

  private setProgessPercentage() {
    this.progress = (((this.currentQuestionIndex + 1) / this.getQuestionsFormArray().length) * 100).toString();
  }

  protected onCalculateScore() {
    this.isQuizCompleted = true;
    const values = this.quizForm.getRawValue();
    const questionIdList = values.questions.map(q => q.questionId);
    const questionAnswer$ = this.quizService.getQuestionsAnswerByQuestionIds(questionIdList);
    forkJoin(questionAnswer$).subscribe(async answers => {
      values.questions.map(q => q.correctAnswer = this.findAnswerFromAnswerList(q.questionId, answers));
      this.correctAnswer = values.questions.reduce((acc, q) => {
        if (q.correctAnswer === q.selectedAnswer) {
          acc += 1;
        }
        return acc;
      }, 0);
      this.score = this.correctAnswer * 10;
      this.incorrectAnswer = values.questions.length - this.correctAnswer;
      const user = this.loginService.getCurrentUser();
      const quizResult = {
        ...values,
        score: this.score,
        incorrectAnswer: this.incorrectAnswer,
        correctAnswer: this.correctAnswer,
        userId: user?.id,
        name: user?.name
      };
      this.isQuizSubmitted = true;
      this.quizService.saveQuiz(quizResult);
    });

  }

  private findAnswerFromAnswerList(questionId: string, answerList: Answer[]) {
    return answerList.find(a => a.questionId == questionId)?.answer || "";
  }

  getCurrentUserName(): void {
    const user = this.loginService.getCurrentUser();
    if (user)
      this.currentUserFirstName = user.name;
  }

  startTimer(level: string): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timeLeft = this.LEVEL_TIMES[level];
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timerSubscription.unsubscribe();
        this.isQuizSubmitted = true;
        this.modalType = 'timeUp';
        this.quizModal.showModal();
        setTimeout(()=>{
          this.quizModal.close();
          this.onCalculateScore();
        },2000)

      }
    })
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (this.isQuizSubmitted) {
      return true;
    }
    return new Promise((resolve) => {
      this.pendingNavigationResolve = resolve;
      this.unansweredCount = this.getUnansweredCount();

      this.modalType = 'navigateAway';
      this.quizModal.showModal();
    });
  }

  getUnansweredCount(): number {
    const array = this.getQuestionsFormArray().value;
    return array.filter((q: { selectedAnswer: any; }) => !q.selectedAnswer).length;
  }

  handleModalConfirm(): void {
    if (this.modalType === 'navigateAway') {
      this.isQuizSubmitted = true;
      if (this.pendingNavigationResolve) {
        this.pendingNavigationResolve(true);
      }
    } else {
      this.isQuizSubmitted = true;
      this.onCalculateScore();
    }
    this.modalType = null;
    this.pendingNavigationResolve = null;
  }

  confirmNavigationAway(): void {
    this.modalType = 'navigateAway';
    this.quizModal.showModal();
  }

  onSubmit() {
    this.unansweredCount = this.getUnansweredCount();
    if (this.unansweredCount > 0) {
      this.modalType = 'unanswered';
    } else {
      this.modalType = 'confirmSubmit';
    }
    this.quizModal.showModal();
  }
}
