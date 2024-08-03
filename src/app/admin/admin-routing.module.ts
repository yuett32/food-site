import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/products/product.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {path : '', component: DashboardComponent},
  {path : 'product', component: MainComponent},
  {path:'user',component: MainComponent },
  {path:'employee',component:UsersComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
