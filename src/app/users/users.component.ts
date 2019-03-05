import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { IUser } from 'src/app/users/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  title: string = 'Usuários'
  errorMessage: string
  users: IUser[] = []

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => this.errorMessage = <any>error
    )
  }

}
