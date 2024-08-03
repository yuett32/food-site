import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MainService } from '../../services/main.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  itemId:any
  constructor(public bsModalRef: BsModalRef,private mainService: MainService, private toastr: ToastrService){}
  onDelete(){
    this.mainService.deleteProduct(this.itemId);
    this.toastr.success('This item is deleted Successfully.')
    this.onClose()

  }
  onClose(){
    this.bsModalRef.hide();
  }
}
