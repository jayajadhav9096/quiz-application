import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { CanComponentDeactivate } from '../guards/can-deactivate.interface';
import { Answer, Question } from '../model/question';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { QuizModalComponent } from '../quiz-model/quiz-model.component';
import { LoginService } from '../services/login.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'qc-take-quiz',
  imports: [QuizFormComponent, AsyncPipe, NgIf, RouterLink, QuizModalComponent],
  templateUrl: './take-quiz.component.html',
  styleUrl: './take-quiz.component.css'
})
export class TakeQuizComponent implements OnInit, CanComponentDeactivate {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private loginService = inject(LoginService);

  protected category = "";
  protected subCategory = "";
  protected level = "";
  protected questionList$!: Observable<Question[] | null>;
  protected showResult = false;

  protected correctAnswerCount = 0;
  protected inCorrectAnswerCount = 0;
  protected totalQuestionCount = 0;
  protected score = 0;
  protected unansweredCount = 0;

  private formValues = null;

  modalType: 'unanswered' | 'confirmSubmit' | 'navigateAway' | 'timeUp' | null = 'confirmSubmit';
  showModel = false;
  pendingNavigationResolve: Function = () => {};

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      this.subCategory = params['subcategory'];
      this.level = params['level'];
      this.questionList$ = this.quizService.getQuestionsByCategory(this.category, this.subCategory, this.level);
    });
  }

  protected onTimeout(values: any) {
    this.formValues = values;
    if(this.showModel) {
      this.showModel = false;
    }
    this.modalType = 'timeUp';
    this.showModel = true;
    setTimeout(() => {
      this.onCalculateScore(this.formValues);
      this.showModel = false;
    }, 2000);
  }

  protected onQuizSubmit(values: any) {
    this.unansweredCount = this.getUnansweredCount(values.questions);
    this.modalType = this.unansweredCount > 0 ? 'unanswered' : 'confirmSubmit';
    this.showModel = true;
    this.formValues = values;
  }

  protected onCalculateScore(values: any) {
    const questionList = values.questions as Question[];
    const questionIdList = questionList.map((q: Question) => q.questionId);

    const questionAnswer$ = this.quizService.getQuestionsAnswerByQuestionIds(questionIdList);

    forkJoin(questionAnswer$).subscribe(answers => {
      questionList.map(q => q.correctAnswer = this.findAnswerFromAnswerList(q.questionId, answers));

      this.updateResultCounts(questionList);

      const user = this.loginService.getCurrentUser();

      const quizResult = {
        ...values,
        score: this.score,
        incorrectAnswer: this.inCorrectAnswerCount,
        correctAnswer: this.correctAnswerCount,
        userId: user?.id,
        name: user?.name
      };
      this.quizService.saveQuiz(quizResult);
      this.showResult = true;
    });
  }

  private updateResultCounts(questionList: Question[]){
    this.correctAnswerCount = questionList.reduce((acc, q) => {
      if (q.correctAnswer === q.selectedAnswer) {
        acc += 1;
      }
      return acc;
    }, 0);

    this.score = this.correctAnswerCount * 10;

    this.totalQuestionCount = questionList.length;

    this.inCorrectAnswerCount = this.totalQuestionCount - this.correctAnswerCount;

  }

  private findAnswerFromAnswerList(questionId: string, answerList: Answer[]) {
    return answerList.find(a => a.questionId == questionId)?.answer || "";
  }

  private getUnansweredCount(questionList: Question[]): number {
    return questionList.filter((q: { selectedAnswer: any; }) => !q.selectedAnswer).length;
  }

  protected onModalConfirm(){
    this.showModel = false;
    if(this.modalType === 'navigateAway'){
      setTimeout(() => this.pendingNavigationResolve(), 0);
      return;
    }
    this.onCalculateScore(this.formValues);
  }

  protected onModalHide(){
    this.showModel = false;
  }

  canDeactivate(): Promise<boolean> | boolean {
    if(this.formValues) {
      return true;
    }
    return new Promise((resolve) => {
      this.showModel = true;
      this.modalType = 'navigateAway';
      this.pendingNavigationResolve = resolve;
    });
  }
}
