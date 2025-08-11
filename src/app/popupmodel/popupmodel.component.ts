import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'BsModalRef',
  imports: [],
  templateUrl: './popupmodel.component.html',
  styleUrl: './popupmodel.component.css'
})
export class PopupmodelComponent {
  public title = '';
  public message = '';
  public isConfirm = false;

  constructor(public modalRef: BsModalRef){}

  confirm(): void {
    this.isConfirm = true;
    this.modalRef?.hide();
  }
  
  close(): void {
    this.isConfirm = false;
    this.modalRef?.hide();
  }
}
