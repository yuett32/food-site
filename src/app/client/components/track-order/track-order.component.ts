import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent {
  orderId!: string;
  orders: any;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private mainService: MainService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.fetchOrderStatus();
    });
  }

  fetchOrderStatus() {
    this.isLoading = true;
    let user_id = localStorage.getItem('user_id') as any;
    this.mainService.getOrdersByUserId(user_id).subscribe((order:any) => {
      this.orders = order;
      this.orders.sort((a:any, b:any) => {
        const dateA = a.date.seconds * 1000 + a.date.nanoseconds / 1000000;
        const dateB = b.date.seconds * 1000 + b.date.nanoseconds / 1000000;
        return dateB - dateA; // For descending order
      });
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
}
