import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders:any = [];
  deliveryStatuses = ['Delivered', 'On the way', 'Food preparing', 'Order Cancelled'];
  constructor(private mainService : MainService) {}
  ngOnInit(): void {
    this.getAllOrders()
  }

  getAllOrders() {
    this.mainService.getAllOrders().subscribe((res:any)=>{
      this.orders = res.map((item: any) => {
        item.date = item.date.toDate(); // Convert Firestore Timestamp to Date
        return item;
      });
      console.log(this.orders)
    })
  }
  onStatusChange(order: any) {
    // Handle the status change logic here
    this.mainService.updateStatus(order.id,order.status)
    console.log(`Order ID: ${order.id}, New Status: ${order.status}`);
    // You can also update the order status in your backend/database if necessary
  }
  getProductTitlesAndQuantities(products:any) {
    return products.map((product:any) => {
        const { productTitle, quantity } = product;
        return `Product Title: ${productTitle}, Quantity: ${quantity}`;
    });
}
}
