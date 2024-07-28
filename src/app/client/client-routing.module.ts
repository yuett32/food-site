import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MenuComponent } from './components/menu/menu.component';
import { BooktableComponent } from './components/booktable/booktable.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';

const routes: Routes = [
  {path:'', component: MainComponent},
  {path:'menu', component: MenuComponent},
  {path:'about', component: AboutComponent},
  {path:'booktable', component: BooktableComponent},
  {path:'profile', component: ProfileComponent},
  {path:'cart', component: CartComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
