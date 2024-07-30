import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  itemId:any
  constructor(public bsModalRef: BsModalRef,private mainService: MainService){}
  onDelete(){
    this.mainService.deleteProduct(this.itemId)
    this.onClose()

  }
  onClose(){
    this.bsModalRef.hide();
  }
}
