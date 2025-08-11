import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { QuizService } from '../services/quiz.service';
import { User } from '../model/user';
import { ActivatedRoute, Data, RouterLink } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'qc-quiz-list',
  imports: [CommonModule, RouterLink, DashboardComponent],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css'
})
export class QuizListComponent {
  protected currentUser: User | null = null;
  protected quizList: any[] = [];
  private loginService = inject(LoginService);
  private quizService = inject(QuizService);
  private activatedRoute = inject(ActivatedRoute);
  private mode: string | undefined = "";

  ngOnInit(): void {
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.getAttemptedTest();
  }

  private getAttemptedTest() {
    this.currentUser = this.loginService.getCurrentUser();
    if (this.mode === 'admin-view') {
      this.quizList = this.quizService.getAllQuiz();
    } else {
      this.quizList = this.quizService.getQuizByUserId(this.currentUser?.id);
    }
  }

  deleteQuizResult(quizId: string): void {
    this.quizService.deleteQuizById(quizId);
    this.getAttemptedTest();
  }
}
