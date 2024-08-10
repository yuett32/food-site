import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormGroup and Validators
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
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  amount!: number;
  cartItems: any = [];
  totalAmount: any;
  userinfo: any;
  paymentForm: FormGroup;
  addressType = 'Home';
  COD = false;
  paymentMethod: string = 'Card';
  constructor(
    private fb: FormBuilder,
    private paymentService: StripeService,
    private toastr: ToastrService,
    private mainService: MainService,
    private route: Router
  ) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], // Add Validators
      building: ['', Validators.required],
      unit: ['', Validators.required],
      company: ['United States', Validators.required],
      address: ['', [Validators.required]],
      country: ['Singapore']
    });
  }

  async ngOnInit() {
    this.getAllItems();
    this.getUserInfo();
    this.loadStripe()
  }
  async loadStripe () {
    this.stripe = await loadStripe(environment.PUBLISHABLE_KEY);
    const elements = this.stripe!.elements();
    this.cardNumber = elements.create('cardNumber');
    this.cardExpiry = elements.create('cardExpiry');
    this.cardCvc = elements.create('cardCvc');
    this.cardNumber.mount('#card-number-element');
    this.cardExpiry.mount('#card-expiry-element');
    this.cardCvc.mount('#card-cvc-element');
  }
  async pay() {
    if (this.paymentForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      return;
    }
    if (this.paymentMethod == 'Card') {
      const response = await this.paymentService.createPaymentIntent(this.totalAmount + 100).toPromise();
      if (response && response.clientSecret) {
        const result = await this.stripe!.confirmCardPayment(response.clientSecret, {
          payment_method: {
            card: this.cardNumber,
            billing_details: {
              name: this.paymentForm.value.name,
              email: this.paymentForm.value.email,
            }
          }
        });

        if (result.error) {
          if (result.error.message?.includes('Your request was in test mode')) {
            this.placeOrder(true);
            this.toastr.info(result.error.message + ' Although order is placed.');
            this.route.navigateByUrl('/home');
          } else {
            this.toastr.error(result.error.message);
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            this.placeOrder(true);
            this.toastr.success('Payment successful! Your Order is placed.');
            this.route.navigateByUrl('/home');
            console.log('Payment successful!');
          }
        }
      } else {
        console.error('Failed to create payment intent.');
      }
    }
    else {
      this.placeOrder(false);
      this.toastr.success('Payment successful! Your Order is placed.');
      this.route.navigateByUrl('/home');
      console.log('Payment successful!');
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
    if (this.totalAmount == 0 ) {
      this.route.navigateByUrl('/home');
    }
    this.totalAmount = this.totalAmount + 5;
  }

  placeOrder(paymentStatus:any) {
    let payload = {
      userId: localStorage.getItem('user_id'),
      user_name: this.userinfo.displayName,
      customer_name: this.paymentForm.value.name,
      email: this.paymentForm.value.email,
      order: this.cartItems,
      status: 'Food preparing',
      date: new Date(),
      amount: this.totalAmount,
      location: localStorage.getItem('location'),
      paymentStatus : paymentStatus,
      address: {
          building: this.paymentForm.value.building,
          unit: this.paymentForm.value.unit,
          company: this.paymentForm.value.company,
          address: this.paymentForm.value.address,
        }
    };
    this.mainService.placeOrder(payload);
    let user_id = localStorage.getItem('user_id') as any;
    this.clearCart(user_id);
  }

  clearCart(userId: string): void {
    this.mainService.deleteAllCartItems(userId).subscribe(() => {
      console.log('All cart items deleted for user:', userId);
    }, error => {
      console.error('Error deleting cart items:', error);
    });
  }
  onSubmit(): void {
    console.log();
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
    if (method == 'Card')
      this.loadStripe();
  }
}
