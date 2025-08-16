import { Component, inject } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { Question } from '../model/question';

@Component({
  selector: 'qc-view-quiz',
  imports: [CommonModule, QuizFormComponent],
  templateUrl: './view-quiz.component.html',
  styleUrl: './view-quiz.component.css'
})
export class ViewQuizComponent {
  quizService = inject(QuizService);
  activatedRoute = inject(ActivatedRoute);

  protected category = "";
  protected subCategory = "";
  protected level = "";
  protected questionList: Question[] =[];
  protected score : number = 0;
  protected inCorrectQuestion : number = 0;
  protected correctQuestion : number = 0;

  constructor() {
    this.activatedRoute.params.subscribe(obj => {
      const quizId = obj['id'];
      const quiz = this.quizService.getQuizById(quizId);
      if (quiz) {
        console.log("scoreo",quiz)
        this.questionList = quiz.questions;
        this.category = quiz.category;
        this.subCategory =  quiz.subCategory;
        this.level = quiz.level;
        this.score = quiz.score
      }
      this.correctQuestionCount(quiz)
    });
  }

  correctQuestionCount(quiz:any):void{
    const totalQuestion = quiz.questions.length
    this.correctQuestion = this.score /10;
    this.inCorrectQuestion = totalQuestion - this.correctQuestion
  }
}
