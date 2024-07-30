import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders = [
    { id: 1, customer: 'John Doe', date: new Date(), status: 'Completed', total: 120.00 },
    { id: 2, customer: 'Jane Smith', date: new Date(), status: 'Pending', total: 75.50 },
    // Add more orders here
  ];
  deliveryStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  constructor(private mainService : MainService) {}
  ngOnInit(): void {
    this.getAllOrders()
  }

  getAllOrders() {
    this.mainService.getAllOrders().subscribe((res:any)=>{

    })
  }
  onStatusChange(order: any) {
    // Handle the status change logic here
    console.log(`Order ID: ${order.id}, New Status: ${order.status}`);
    // You can also update the order status in your backend/database if necessary
  }
}
