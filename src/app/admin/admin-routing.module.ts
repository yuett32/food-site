import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/products/product.component';

const routes: Routes = [
  {path : '', redirectTo:'home', pathMatch:'full'},
  {path : 'home', component: DashboardComponent},
  {path : 'product', component: MainComponent},
  {path:'user',component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
