import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { IUser } from './User';

@Component({
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {

  title: string = 'Usuários'
  errorMessage: string
  users: IUser[] = []
  filteredUsers: IUser[]
  _listFilter: string = ''
  perfis = [
    {id: 1, descricao: 'Analista'},
    {id: 2, descricao: 'Coordenador'},
    {id: 3, descricao: 'Gerente'},
    {id: 4, descricao: 'Cliente'}
  ];

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

  getPerfilDesc(id: number): string{
    let p = this.perfis.filter((perfil) =>{
      return perfil.id === id;
    });

    return p[0].descricao;
  }

}
