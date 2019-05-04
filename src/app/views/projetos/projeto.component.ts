import { Component, OnInit } from '@angular/core';

import { ProjetoService } from './projeto.service';
import { IProjeto } from './Projeto';

@Component({
  templateUrl: 'projeto.component.html'
})
export class ProjetoComponent implements OnInit {

  title: string = 'Projeto'
  errorMessage: string
  projetos: IProjeto[] = []
  filteredUsers: IProjeto[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.projetos
  }

  constructor(private projetoService: ProjetoService) { }

  ngOnInit() {
    this.projetoService.getProjetos().subscribe(
      projetos => {
        this.projetos = projetos
        this.filteredUsers = this.projetos
      },
      error => this.errorMessage = <any>error
    )
  }

  performFilter(filterBy: string): IProjeto[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.projetos.filter((projeto: IProjeto) =>
    projeto.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

}
