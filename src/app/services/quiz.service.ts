import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable, shareReplay, tap } from 'rxjs';
import { Answer, Question } from '../model/question';


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizQueOption = "sample-data/quiz-question.json";
  private quizAns = "sample-data/quiz-answer.json";

  constructor(private http: HttpClient) { }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.quizQueOption);
  }

  public getQuestionsByCategory(category: string, subCategory: string, level: string) {
    return this.getAllQuestions().pipe(
      map(questionList =>
        questionList.filter(q => q.category === category && q.subCategory === subCategory && q.level === level)
      )
    )
  }

  public getAnswerByQuestionId(questionId: string) {
    return this.getAllAnswers().pipe(
      map(answers => answers.find(a => a.questionId === questionId) || { questionId, answer: "" })
    );
  }

  public getQuestionsAnswerByQuestionIds(questionList: string[]) {
    return questionList.map(questionId => this.getAnswerByQuestionId(questionId));
  }

  private getAllAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.quizAns).pipe(
      shareReplay()
    );
  }

  public saveQuiz(quizResult: any) {
    const quizId = this.generateNanoTimestampId();
    quizResult.id = quizId;
    const existingResults = localStorage.getItem("quizResult");
    const newResults = existingResults ? [...JSON.parse(existingResults), quizResult] : [quizResult]
    localStorage.setItem("quizResult", JSON.stringify(newResults));
  }

  public getAllQuiz() {
    const result = localStorage.getItem("quizResult");
    if (result) {
      return JSON.parse(result) as any[];
    }
    return [];
  }

  public deleteQuizById(quizId: string){
    const list = this.getAllQuiz().filter(quiz => quiz.id !== quizId);
    localStorage.setItem('quizResult', JSON.stringify(list));
  }

  public getQuizByUserId(userId: string | undefined){
    const list = this.getAllQuiz();
    return list.filter(quiz =>quiz.userId == userId);
  }

  public getQuizById(quizId: string | undefined){
    const list = this.getAllQuiz();
    // console.log(list, quizId);
    return list.find(quiz =>quiz.id == quizId);
  }

  private generateNanoTimestampId() {
    const now = Date.now();
    const perf = Math.floor(performance.now() * 1000000);
    return `${now}${perf}`;
  }
}
