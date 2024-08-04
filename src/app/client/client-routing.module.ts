import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { PaymentComponent } from '../shared/components/payment/payment.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';

const routes: Routes = [
  {path:'', component: MainComponent},
  {path:'checkout', component: PaymentComponent},
  {path:'menu', component: MenuComponent},
  {path:'about', component: AboutComponent},
  {path:'profile', component: ProfileComponent},
  {path:'cart', component: CartComponent},
  {path:'order', component: TrackOrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
