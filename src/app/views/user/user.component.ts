import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { IUser } from './User';

@Component({
  templateUrl: 'user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  title: string = 'Usuários'
  errorMessage: string
  users: IUser[] = []
  filteredUsers: IUser[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users
  }

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users
        this.filteredUsers = this.users
      },
      error => this.errorMessage = <any>error
    )
  }

  performFilter(filterBy: string): IUser[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: IUser) =>
      user.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

}
