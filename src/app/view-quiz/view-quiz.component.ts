import { Component, inject } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'qc-view-quiz',
  imports: [CommonModule,],
  templateUrl: './view-quiz.component.html',
  styleUrl: './view-quiz.component.css'
})
export class ViewQuizComponent {
  quizService = inject(QuizService);
  activatedRoute = inject(ActivatedRoute);
  quiz: any = null;

  constructor(){
    this.activatedRoute.params.subscribe(obj => {
      const quizId = obj['id'];
      this.quiz = this.quizService.getQuizById(quizId);
    });
  }

  getOptionClasses(option: string, question: any): { [key: string]: boolean } {
    return {
      'border': option === question.correctAnswer || (option === question.selectedAnswer && option !== question.correctAnswer),
      'border-success border-3 text-success': option === question.correctAnswer,
      'border-danger border-2 text-danger': option === question.selectedAnswer && option !== question.correctAnswer
    };
  }
  
  
}
