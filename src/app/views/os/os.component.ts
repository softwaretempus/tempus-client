import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OsService } from './os.service';
import { IOs } from './Os';
import * as moment from 'moment';

@Component({
  selector: 'app-os',
  templateUrl: './os.component.html'
})
export class OsComponent implements OnInit {

  title: string = 'Ordens de Serviços'
  errorMessage: string
  oss: IOs[] = []
  filteredOss: IOs[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredOss = this.listFilter ? this.performFilter(this.listFilter) : this.oss
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private osService: OsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getOss()
  }

  convertDate(data: Date): string{
    return moment(data).format('DD/MM/YYYY HH:mm')
  }

  performFilter(filterBy: string): IOs[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.oss.filter((os: IOs) =>
      os.descricao.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  editOs(os: IOs){
    if(os.status === 'Aprovada' || os.status === 'Cancelada'){
      this.toastr.error(`Esta OS está ${os.status} e não pode ser alterada!`, 'Atenção!');
      return;
    }else{
      this.router.navigate(['/os', os.id, 'edicao']);
    }
  }

  async deleteOs(os: IOs) {

    if(os.status === 'Aprovada' || os.status === 'Cancelada'){
      this.toastr.error(`Esta OS está ${os.status} e não pode ser excluída!`, 'Atenção!');
      return;
    }

    if (confirm(`Deseja realmente excluir a ordem de serviço "${os.id}"?`)) {
      await this.osService.deleteOs(os.id)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.showError('Algo está errado. Tente mais tarde.')
        );
      this.showSuccess('Ordem de Serviço removida da base de dados.')
      this.oss.splice(os.id, 1);
      console.log(this.oss)
    }
  }

  onSaveComplete(): void {
    this.router.navigate(['/os'])
    this.getOss()
  }

  getOss(): void {
    this.osService.getOss().subscribe(
      oss => {
        this.oss = oss
        this.filteredOss = this.oss
      },
      error => this.errorMessage = <any>error
    )
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
