import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';
import { environment } from 'src/app/enviroment/environment';
import { ToastrService } from 'ngx-toastr';
import { MainService } from '../../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  card: any;
  amount!: number;
  cartItems: any = [];
  totalAmount: any;
  userinfo: any;

  constructor(
    private paymentService: StripeService,
    private toastr: ToastrService,
    private mainService: MainService,
    private route : Router
  ) {}

  async ngOnInit() {
    this.getAllItems();
    this.getUserInfo();
    this.stripe = await loadStripe(environment.PUBLISHABLE_KEY);
    const elements = this.stripe!.elements();
    this.card = elements.create('card', {
      hidePostalCode: true
    });
    this.card.mount('#card-element');
    this.getAllItems();
  }

  async pay() {
    const response = await this.paymentService.createPaymentIntent(this.totalAmount + 100).toPromise();
    if (response && response.clientSecret) {
      const result = await this.stripe!.confirmCardPayment(response.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Customer Name'
          }
        }
      });

      if (result.error) {
        if (result.error.message?.includes('Your request was in test mode')) {
          this.placeOrder()
          this.toastr.info(result.error.message + ' Although order is placed.');
          this.route.navigateByUrl('/home')
        } else {
          this.toastr.error(result.error.message);
        }
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          this.placeOrder();
          this.toastr.success('Payment successful! Your Order is placed.');
          this.route.navigateByUrl('/home')
          console.log('Payment successful!');
        }
      }
    } else {
      console.error('Failed to create payment intent.');
    }
  }

  getUserInfo() {
    let user_id = localStorage.getItem('user_id') as any;
    this.mainService.getUserInfo(user_id).subscribe((info) => {
      this.userinfo = info;
    });
  }

  getAllItems() {
    let user_id = localStorage.getItem('user_id') as any;
    this.mainService.getAllCartItems(user_id).subscribe((res: any) => {
      this.cartItems = res;
      this.calculateAmount();
    });
  }

  calculateAmount() {
    this.totalAmount = this.cartItems.reduce((total: any, item: any) => {
      const itemPrice = parseFloat(item.price);
      return total + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0);

    this.totalAmount = this.totalAmount + 5;
  }

  placeOrder() {
    let payload = {
      customer_name: this.userinfo.displayName,
      order: this.cartItems,
      status: 'Pending',
      date: new Date(),
      amount: this.totalAmount,
      location: localStorage.getItem('location')
    };
    this.mainService.placeOrder(payload);
    let user_id = localStorage.getItem('user_id') as any;
    this.clearCart(user_id)
  }
  clearCart(userId: string): void {
    this.mainService.deleteAllCartItems(userId).subscribe(() => {
      console.log('All cart items deleted for user:', userId);
    }, error => {
      console.error('Error deleting cart items:', error);
    });
  }
}
