import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { TimerPipe } from '../cutomtimerpipe/timer.pipe';
import { Question } from '../model/question';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'quiz-form',
  imports: [ReactiveFormsModule, CommonModule, TimerPipe, RouterLink],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.css'
})
export class QuizFormComponent implements OnInit, OnDestroy {
  @Input() isViewMode = false;
  @Input() category = "";
  @Input() subCategory = "";
  @Input() level = "";
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onTimeout = new EventEmitter<any>();

  @Input()
  public set questionList(list: Question[] | null) {
    this.setQuestionFormArray(list || []);
  }

  protected quizForm = new FormGroup({
    category: new FormControl(),
    subCategory: new FormControl(),
    level: new FormControl(),
    questions: new FormArray<FormControl<Question>>([]),
  });

  private loginService = inject(LoginService);
  private route = inject(ActivatedRoute);

  public currentUserFirstName: string = "";
  public currentQuestionIndex: number = 0;
  public progress: string = "0";

  interval$: any;

  private LEVEL_TIMES: Record<string, number> = {
    easy: 30,    // 5 minutes
    medium: 600,  // 10 minutes
    hard: 900     // 15 minutes
  };

  public timeLeft: number = 0;
  private timerSubscription!: Subscription;

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    this.isViewMode = !!quizId;

    this.quizForm.valueChanges.subscribe(() => this.setProgessPercentage());

    if(!this.isViewMode){
      this.quizForm.get('level')?.valueChanges.subscribe(level => {
        this.startTimer(level)
      });
    }
    this.getCurrentUserName();
  }

  private setQuestionFormArray(list: Question[]) {
    this.quizForm.get('category')?.setValue(this.category);
    this.quizForm.get('subCategory')?.setValue(this.subCategory);
    this.quizForm.get('level')?.setValue(this.level);
    const questionFA = this.getQuestionsFormArray();
    list.map(que => this.createQuestionFG(que)).forEach(val => questionFA.push(val));
  }
  
  protected getQuestionsFormArray() {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionFG(question: Question): FormGroup {
    return new FormGroup({
      questionId: new FormControl({ value: question.questionId, disabled: this.isViewMode }),
      question: new FormControl({ value: question.question, disabled: this.isViewMode }),
      options: new FormControl({ value: question.options, disabled: this.isViewMode }),
      selectedAnswer: new FormControl({ value: question.selectedAnswer, disabled: this.isViewMode }),
      correctAnswer: new FormControl({ value: question.correctAnswer, disabled: this.isViewMode })
    });
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
        this.onTimeout.emit(this.quizForm.getRawValue());
      }
    })
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  submit() {
    this.onSubmit.emit(this.quizForm.getRawValue());
  }
}
