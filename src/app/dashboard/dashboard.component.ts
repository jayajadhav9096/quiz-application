import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'dashboard',
  imports: [FormsModule, RouterLink, RouterLinkActive,NgIf,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUserFirstName: string = "";
  protected isAdmin:boolean = false; 

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUserName();
    const user = this.loginService.getCurrentUser()?.role;
    this.isAdmin = user === 'admin';
  }

  onLogout(): void {
    alert("Are you sure you want logout?");
    this.loginService.logout();
    this.router.navigate(['/login'])
  }

  private getCurrentUserName() {
    const user = this.loginService.getCurrentUser();
    if (user)
      this.currentUserFirstName = user.name;
  }

}
