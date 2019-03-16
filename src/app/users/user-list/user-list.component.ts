import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '../user';

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

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
