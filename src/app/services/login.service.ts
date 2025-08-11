import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = "sample-data/login-credentials.json";
  private loginUser = new BehaviorSubject<User | null>(null);
  public loggedInUserDetils$ = this.loginUser.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public getUserList(): Observable<User[]> {
    return this.http.get<User[]>(this.loginUrl).pipe(
      catchError((error: any) => {
        console.error('Failed to fetch user list:', error);
        return throwError(() => new Error('Unable to fetch user data'));
      })
    );
  }

  public login(username: string | null, password: string | null): Observable<User> {
    return this.getUserList().pipe(
      map(users => this.findUser(username, password, users)),
    );
  }

  private findUser(username: string | null, password: string | null, userList: User[]): User {
    const user = userList.find(u => u.username === username && u.password === password);
    if (user) {
      this.loginUser.next(user);
      return user;
    }
    this.loginUser.next(null);
    throw new Error("User not found");
  }

  public logout(): void {
    this.loginUser.next(null)
  }

  getCurrentUser():User | null{
    return this.loginUser.value;
  }

  getCurrentUserFirstName(){
    return this.getCurrentUser()?.name;
  }
   
}