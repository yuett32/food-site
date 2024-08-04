import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { MainComponent } from './components/main/main.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { TrackOrderComponent } from './components/track-order/track-order.component';


@NgModule({
  declarations: [
    MainComponent,
    AboutComponent,
    MenuComponent,
    CartComponent,
    TrackOrderComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ClientModule { }
