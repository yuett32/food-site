import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  @Input() isMain = false;
  filter : any = 'all';
  searchQuery = '';
  allfoodItem : any = []
  foodItem:any = [];
  cartItemCount : any = 0
  userId: any
  constructor(private mainService : MainService,private toastr: ToastrService) {
    this.userId = localStorage.getItem('user_id')
  }
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
  addToCart(item:any) {

    let payload = {
      ...item
    }
    payload.userId = this.userId;
    payload.orderDate = new Date();
    payload.quantity = 1;
    this.mainService.getAllItems(this.userId,payload);
  }
  getAllProducts() {
    this.mainService.getAllProducts().subscribe((res:any) =>{
      console.log(res)
      this.allfoodItem = res;
      this.foodItem = res;
    })
  }
}
