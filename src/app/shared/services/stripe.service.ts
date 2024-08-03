import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/app/enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('your-publishable-key');
  }
  async getStripe() {
    return await this.stripePromise;
  }
  createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`, { amount })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server-side error: ${error.status} - ${error.error.error}`;
    }

    return throwError(errorMessage);
  }
}
