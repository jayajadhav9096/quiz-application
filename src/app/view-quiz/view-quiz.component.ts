import { Component, inject } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'qc-view-quiz',
  imports: [CommonModule, DashboardComponent],
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
}
