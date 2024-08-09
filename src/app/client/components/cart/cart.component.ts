import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  cartItems:any = [];
  totalAmount:any;
  constructor(private mainService: MainService,private route:Router, private toastr: ToastrService){}
  ngOnInit(): void {
    this.getAllItems()
  }
  getAllItems(){
    let user_id = localStorage.getItem('user_id') as any
    // this.cartItems = this.mainService.getAllItems(user_id) || [];
    // if (this.cartItems){
    //   this.totalAmount = this.cartItems.reduce((total:any, item:any) => {
    //     const itemPrice = parseFloat(item.price); // Convert price to number
    //     return total + (isNaN(itemPrice) ? 0 : itemPrice); // Handle NaN values
    //   }, 0);
    // }

    this.mainService.getAllCartItems(user_id).subscribe((res:any)=>{
      this.cartItems = res
      this.calculateAmount()
    })
  }
  calculateAmount(){
    this.totalAmount = this.cartItems.reduce((total:any, item:any) => {
      const itemPrice = parseFloat(item.price); // Convert price to number
      return total + (isNaN(itemPrice) ? 0 : itemPrice); // Handle NaN values
    }, 0);
  }
  changeQuantity(action:any,item:any) {
    if(action) {
      item.quantity = item.quantity + 1;
      this.calculateAmount();
    } 
    else if (item.quantity != 1) {
      item.quantity = item.quantity - 1;
      this.calculateAmount();
    }
  }
  deleteItem(item:any){
    this.mainService.deleteItem(item.docId)
  }

  calculatTotal(item: any): number {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity, 10);
  
    // Handle potential NaN values if conversion fails
    if (isNaN(price) || isNaN(quantity)) {
      return 0; // or some default value or error handling
    }
  
    return price * quantity;
  }
  checkout(){
    if (this.cartItems.length > 0) {
      this.route.navigateByUrl('/home/checkout')
    }
    else {
      this.toastr.info('Please add items in the cart first.')
    }
  }
}
