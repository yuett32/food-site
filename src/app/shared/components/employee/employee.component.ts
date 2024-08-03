import { Component } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  orders:any = [];
  deliveryStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
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
    })
  }
  onStatusChange(order: any) {
    // Handle the status change logic here
    this.mainService.updateStatus(order.id,order.status)
  }
}