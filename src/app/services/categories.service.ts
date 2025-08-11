import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { find, Observable } from 'rxjs';
import { Category } from '../model/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private jsonUrl = 'sample-data/categeries.json';

  constructor(private http:HttpClient) { }

  public getCategories() {
    return this.http.get<Category[]>(this.jsonUrl);
  }
}
