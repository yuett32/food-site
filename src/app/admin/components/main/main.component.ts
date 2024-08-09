import { Component, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductComponent } from '../products/product.component';
import { MainService } from 'src/app/shared/services/main.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @Input() isMain = false;
  filter : any = 'all';
  searchQuery = '';
  allfoodItem : any = []
  foodItem:any = []
  modalRef?: BsModalRef;
  constructor(private modalService: BsModalService, private mainService: MainService) {}
  ngOnInit(): void {
    this.getAllProducts()
  }
  filterItem(filter :any){
    this.filter = filter
    if (this.filter == 'all') {
      this.foodItem = this.allfoodItem
    }
    else
      this.foodItem = this.allfoodItem.filter((item:any) => item.category == this.filter)
  }
  addProduct() {
    this.modalRef = this.modalService.show(ProductComponent);
  }
  getAllProducts() {
    this.mainService.getAllProducts().subscribe((res:any) =>{
      console.log(res)
      this.allfoodItem = res;
      this.foodItem = res;
    })
  }

  deleteProduct(item:any) {
    const initialState = {
      itemId : item.id
    }
    this.modalRef = this.modalService.show(ModalComponent , {initialState});
     
  }
  editProduct(item:any) {
    const initialState = {
      formData : item
    }
    this.modalRef = this.modalService.show(ProductComponent , {initialState});
  }
}
