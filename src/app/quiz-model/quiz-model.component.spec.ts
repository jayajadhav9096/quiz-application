import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizModelComponent } from './quiz-model.component';

describe('QuizModelComponent', () => {
  let component: QuizModelComponent;
  let fixture: ComponentFixture<QuizModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
