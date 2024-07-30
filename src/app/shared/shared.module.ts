import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchPipe } from './pipe/search.pipe';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    NavbarComponent,
    ProfileComponent,
    ModalComponent,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule  
  ],
  exports:[
    FooterComponent,
    NavbarComponent,
    ProfileComponent,
    ModalComponent,
    SearchPipe
  ]
})
export class SharedModule { }
