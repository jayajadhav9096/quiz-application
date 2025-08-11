import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupmodelComponent } from './popupmodel.component';

describe('PopupmodelComponent', () => {
  let component: PopupmodelComponent;
  let fixture: ComponentFixture<PopupmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
