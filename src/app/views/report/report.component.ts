import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ReportService } from './report.service';
import { IReport } from './Report';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  title: string = 'Relatorios'
  errorMessage: string
  reports: IReport[] = []
  filteredList: IReport[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredList = this.listFilter ? this.performFilter(this.listFilter) : this.reports
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getReports()
  }

  performFilter(filterBy: string): IReport[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.reports.filter((report: IReport) =>
      report.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  async deleteReport(report: IReport) {
    if (confirm(`Deseja realmente excluir a relatorio "${report.nome}"?`)) {
      await this.reportService.deleteReport(report.id)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.showError('Algo está errado. Tente mais tarde.')
        );
      this.showSuccess('Relatorio removida da base de dados.')
      this.reports.splice(report.id, 1);
      console.log(this.reports)
    }
  }

  onSaveComplete(): void {
    this.router.navigate(['/relatorios'])
    this.getReports()
  }

  getReports(): void {
    this.reportService.getReports().subscribe(
      reports => {
        this.reports = reports
        this.filteredList = this.reports
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
