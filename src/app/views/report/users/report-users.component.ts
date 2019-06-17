import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericValidator } from '../../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

import { ReportUsersService } from './report-users.service';
import * as jsPDF from 'jspdf'

import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report-users.component.html'
})
export class ReportUsersComponent implements OnInit {

  title: string = 'Relatorios'
  errorMessage: string
  reportsForm: FormGroup
  reports: any = []

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportUsersService,
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      data_inicio: {
        required: 'Selecione a data inicial.',
      },
      data_fim: {
        required: 'Selecione a data final.',
      },
    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit() {

    this.reportsForm = this.fb.group({
      data_inicio: ['', Validators.required],
      data_fim: ['', Validators.required]
    });

  }

  getReports(): void {
    const data_inicio = this.reportsForm.get('data_inicio').value
    const data_fim = this.reportsForm.get('data_fim').value
    this.reportService.getReports(data_inicio, data_fim).subscribe(
      reports => this.reports = reports,
      error => this.errorMessage = <any>error
    )
  }

  convertDate(data: Date): string {
    return moment(data).format('DD/MM/YYYY HH:mm')
  }

  getPDF(){
    
    const data_inicio = moment(this.reportsForm.get('data_inicio').value).format('DD/MM/YYYY');
    const data_fim = moment(this.reportsForm.get('data_fim').value).format('DD/MM/YYYY');

    let doc = new jsPDF()

    let linha = 10;
    
    // Cabeçalho
    doc.setLineWidth(0.5);
    doc.line(20, linha, 200, linha);
    linha += 10;
    
    doc.setFontSize(14);
    doc.text(`Relatório de Horas por Usuário`, 105 , linha, null, null, 'center');
    linha += 5;
    
    doc.setFontSize(10);
    doc.text(`Período: ${data_inicio} a ${data_fim}`, 105 , linha, null, null, 'center');
    linha += 5;
    
    doc.setLineWidth(0.5);
    doc.line(20, linha, 200, linha);
    
    linha += 10;
    doc.setFontSize(10);
    let cols = [20, 40, 140];
    let headers = ['Código', 'Nome', 'Total de Horas'];

    for(let h = 0; h < headers.length; h++){
      doc.text(headers[h], cols[h], linha);
    }

    linha += 10;
    
    this.reports.body.forEach(r =>{
      doc.text(r.id.toString(), cols[0], linha);
      doc.text(r.nome, cols[1], linha);
      doc.text(r.total.toString(), cols[2], linha);
      linha += 10;
    })
    
    doc.save('report.pdf')

  }

}
