import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { MainComponent } from './components/main/main.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './components/menu/menu.component';
import { BooktableComponent } from './components/booktable/booktable.component';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './components/cart/cart.component';


@NgModule({
  declarations: [
    MainComponent,
    AboutComponent,
    MenuComponent,
    BooktableComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
