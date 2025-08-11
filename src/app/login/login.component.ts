import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  protected loginForm!: FormGroup;
  protected hasError: string | null = null;

  constructor(private loginService: LoginService, private router:Router) {
     this.loginForm = new FormGroup({
      username: new FormControl('alicej', [Validators.required]),
      password: new FormControl('pass1234', [Validators.required]),
    });
   }

  protected onSubmit() {
    const { username = null, password = null } = this.loginForm.value;
    this.loginService.login(username, password).subscribe({
      next: user => this.handleSuccess(user),
      error: error => this.handleFailed(error)
    });
  }

  private handleSuccess(user: User): void{
    this.hasError = null;
    this.router.navigate(['/dashboard']);
  }

  private handleFailed(error: Error){
    this.hasError = error.message;
  }

  get username(){
   return  this.loginForm.get('username')!;
  }

  get password(){
   return  this.loginForm.get('password')!;
  }


}

