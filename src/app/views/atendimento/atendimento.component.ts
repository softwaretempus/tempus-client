import { Component, OnInit } from '@angular/core';

import { AtendimentoService } from './atendimento.service';
import { IAtendimento } from './Atendimento';

@Component({
  templateUrl: 'atendimento.component.html'
})
export class AtendimentoComponent implements OnInit {

  title: string = 'Atendimento'
  errorMessage: string
  atendimentos: IAtendimento[] = []
  filteredUsers: IAtendimento[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.atendimentos
  }

  constructor(private atendimentoService: AtendimentoService) { }

  ngOnInit() {
    this.atendimentoService.getAtendimentos().subscribe(
      atendimentos => {
        this.atendimentos = atendimentos
        this.filteredUsers = this.atendimentos
      },
      error => this.errorMessage = <any>error
    )
  }

  performFilter(filterBy: string): IAtendimento[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.atendimentos.filter((atendimento: IAtendimento) =>
    atendimento.assunto.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

}
