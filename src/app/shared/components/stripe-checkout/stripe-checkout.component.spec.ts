import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCheckoutComponent } from './stripe-checkout.component';

describe('StripeCheckoutComponent', () => {
  let component: StripeCheckoutComponent;
  let fixture: ComponentFixture<StripeCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StripeCheckoutComponent]
    });
    fixture = TestBed.createComponent(StripeCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
