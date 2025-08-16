import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Modal } from 'bootstrap';


@Component({
  selector: 'quiz-model',
  templateUrl: './quiz-model.component.html',
  imports: [CommonModule],
  styleUrls: ['./quiz-model.component.css'],
})
export class QuizModalComponent {
  @Input() modalType: 'unanswered' | 'confirmSubmit' | 'navigateAway' | 'timeUp' | 'logout' | null = null;
  @Input() unansweredCount = 0;
  @Output() confirm = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  @Input()
  public set show(show: boolean){
    if(show){
      this.showModal();
    } else{
      this.hideModal();
    }
  }

  private showModal(): void {
    const modalElement = document.getElementById('quizModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  hideModal(): void {
    const modalElement = document.getElementById('quizModal') as Element;
    const modal = Modal.getInstance(modalElement);
    modal?.hide();
  }

  onCancel(){
    this.onHide.emit();
  }

  onConfirm(): void {
    this.confirm.emit();  
  }

  close(): void {
    this.hideModal();
  }
}
