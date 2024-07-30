import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() isMain : boolean = false; 
  @Input() isAdmin: boolean = false
  @Input() cartItemCount = 0;
  userId:any;
  constructor(private mainService : MainService) {
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
}
