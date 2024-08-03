import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { authGuard } from './shared/Guards/auth.guard';
import { EmployeeComponent } from './shared/components/employee/employee.component';
import { employeeGuard } from './shared/Guards/employee.guard';

const routes: Routes = [
  {path: '', redirectTo:'login',pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'employee', component: EmployeeComponent, canActivate:[employeeGuard]},
  {path: 'employee/profile', component: EmployeeComponent, canActivate:[employeeGuard]},
  {path: 'home', loadChildren:()=>import('./client/client.module').then(m=>m.ClientModule), canActivate:[authGuard]},
  {path: 'admin', loadChildren:()=>import('./admin/admin.module').then(m=>m.AdminModule), canActivate:[authGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
