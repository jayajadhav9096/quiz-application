import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesDropdownComponent } from './categories-dropdown.component';

describe('CategoriesDropdownComponent', () => {
  let component: CategoriesDropdownComponent;
  let fixture: ComponentFixture<CategoriesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
