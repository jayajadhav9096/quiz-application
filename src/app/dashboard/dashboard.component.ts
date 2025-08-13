import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgIf } from '@angular/common';
import { QuizModalComponent } from '../quiz-model/quiz-model.component';

@Component({
  selector: 'dashboard',
  imports: [FormsModule, RouterLink, RouterLinkActive, NgIf, RouterOutlet, QuizModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  @ViewChild(QuizModalComponent) quizModal!: QuizModalComponent;


  currentUserFirstName: string = "";
  protected isAdmin: boolean = false;
  modalType: 'logout' | null = null;


  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUserName();
    const user = this.loginService.getCurrentUser()?.role;
    this.isAdmin = user === 'admin';
  }

  private getCurrentUserName() {
    const user = this.loginService.getCurrentUser();
    if (user)
      this.currentUserFirstName = user.name;
  }

  
  onLogout(): void {
    this.modalType = 'logout';
    this.quizModal.showModal();
  }

  handleConfirmLogout(): void {
    if (this.modalType === 'logout') {
      this.loginService.logout();
      this.router.navigate(['/login']);
    }
    this.cleanupModal();
  }

  cleanupModal(): void {
    this.modalType = null;
    this.quizModal.hideModal();

  }


}
