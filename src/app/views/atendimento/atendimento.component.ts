import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AtendimentoService } from './atendimento.service';
import { IAtendimento } from './Atendimento';

@Component({
  templateUrl: 'atendimento.component.html'
})
export class AtendimentoComponent implements OnInit {

  title: string = 'Atendimento'
  errorMessage: string
  atendimentos: IAtendimento[] = []
  filtered: IAtendimento[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filtered = this.listFilter ? this.performFilter(this.listFilter) : this.atendimentos
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atendimentoService: AtendimentoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getAtendimentos()
  }

  async deleteAtendimento(atendimento: IAtendimento) {
    if (confirm(`Deseja realmente excluir o atendimento "${atendimento.assunto}"?`)) {
      await this.atendimentoService.deleteAtendimento(atendimento.id)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.showError('Algo está errado. Tente mais tarde.')
        );
      this.showSuccess('Atendimento removido da base de dados.')
      this.atendimentos.splice(atendimento.id, 1);
      console.log(this.atendimentos)
    }
  }

  performFilter(filterBy: string): IAtendimento[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.atendimentos.filter((atendimento: IAtendimento) =>
      atendimento.assunto.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  onSaveComplete(): void {
    this.router.navigate(['/atendimentos']);
    this.getAtendimentos()
  }

  getAtendimentos(): void {
    this.atendimentoService.getAtendimentos().subscribe(
      atendimentos => {

        this.atendimentos = atendimentos
        this.filtered = this.atendimentos
      },
      error => this.errorMessage = <any>error
    );
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
