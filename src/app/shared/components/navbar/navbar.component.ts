import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isMain : boolean = false; 
  @Input() isAdmin: boolean = false
  @Input() cartItemCount = 0;
  @Input() isEmployee : boolean = false;
  userId:any;
  constructor(private mainService : MainService,private route: Router) {
    this.userId = localStorage.getItem('user_id');
  }
  ngOnInit(): void {
    this.getItems()
  }

  getItems(){
    this.mainService.getAllCartItems(this.userId).subscribe((res:any)=>{
      console.log(res)
      if (res) {
        this.cartItemCount = res.length 
      }
    })
  }
  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accountType');
    this.route.navigate(['/login'])
  }
}
