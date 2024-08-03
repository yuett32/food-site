import { Component } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any[] = [];

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getUsersWithAccountType(2).subscribe((users:any) => {
      this.users = users;
    });
  }

  approveUser(userId: string,action:boolean): void {
    this.mainService.approveUser(userId,action);
  }

  deleteUser(userId: string): void {
    this.mainService.deleteUser(userId)
  }
}
