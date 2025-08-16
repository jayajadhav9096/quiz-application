import { Component } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../model/categories';
import {  CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  map } from 'rxjs';

@Component({
  selector: 'qc-categories-dropdown',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories-dropdown.component.html',
  styleUrl: './categories-dropdown.component.css'
})
export class CategoriesDropdownComponent {
  categoriesForm!: FormGroup;
  categoryList: Category[] = [];
  subCategoryList: string[] = [];
  difficultyLevels: string[] = ['easy', 'medium', 'hard'];

  constructor(private fb: FormBuilder, private categoryService: CategoriesService,
    private router: Router
  ) {
    this.initForm();
    this.loadCategories();
    this.onCategoryChanges();
  }

  private initForm() {
    this.categoriesForm = this.fb.group({
      category: ['Programming Language', Validators.required],
      subcategory: ['CSS', Validators.required],
      level: ['easy', Validators.required]
    })
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe(list => this.categoryList = list);
  }

  private onCategoryChanges() {
    this.categoriesForm.get('category')?.valueChanges.pipe(
      map(selectedCategory => this.categoryList.find(item => item.category == selectedCategory)?.subcategories ?? []),
    ).subscribe(list => this.subCategoryList = list);

  }

  protected startQuizz() {
    const { category, subcategory, level } = this.categoriesForm.value;
    this.router.navigate(['/take-quiz'], {
      queryParams: { category, subcategory, level }
    })
    console.log('Start test with:', category, subcategory, level);
  }

}
