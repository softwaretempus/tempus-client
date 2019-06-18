import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericValidator } from '../../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

import { ReportOsService } from './report-os.service';
import { IReportOs } from './ReportOs';
import * as moment from 'moment';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-report',
  templateUrl: './report-os.component.html'
})
export class ReportOsComponent implements OnInit {

  title: string = 'Relatorios'
  errorMessage: string
  reportsForm: FormGroup
  reports: any = []
  filteredList: IReportOs[]
  _listFilter: string = ''

  statusOs: any = [
    { id: 1, value: 'Aberta' },
    { id: 2, value: 'Em execução' },
    { id: 3, value: 'Em aprovação' },
    { id: 4, value: 'Aprovada' },
    { id: 5, value: 'Rejeitada' },
    { id: 6, value: 'Concluída' },
    { id: 7, value: 'Cancelada'  }
  ]

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportOsService,
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      status: {
        required: 'Selecione o status da ordem a ser gerada.',
      },
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
      status: ['', Validators.required],
      data_inicio: ['', Validators.required],
      data_fim: ['', Validators.required]
    });

  }

  getReports(): void {
    const status = this.reportsForm.get('status').value
    const data_inicio = this.reportsForm.get('data_inicio').value
    const data_fim = this.reportsForm.get('data_fim').value
    this.reportService.getReports(status, data_inicio, data_fim).subscribe(
      reports => this.reports = reports,
      error => this.errorMessage = <any>error
    )
  }

  convertDate(data: Date): string {
    return moment(data).format('DD/MM/YYYY HH:mm')
  }

  getDescricao(report: any){
    let max = 35;
    if(report.descricao.length <= max){
      return report.descricao;
    }else{
      return report.descricao.substr(0,max) + '...';
    }
  }

  getPDF(){

    const status = this.reportsForm.get('status').value
    const data_inicio = moment(this.reportsForm.get('data_inicio').value).format('DD/MM/YYYY');
    const data_fim = moment(this.reportsForm.get('data_fim').value).format('DD/MM/YYYY');

    let logo = new Image();
    logo.src = 'assets/img/brand/logo.png';
    
    let doc = new jsPDF()

    let linha = 10;
    
    // Cabeçalho
    doc.setLineWidth(0.5);
    doc.line(20, linha, 200, linha);
    linha += 10;
    
    // logo
    doc.addImage(logo, 'PNG', 25, 13, 30, 13)
    
    doc.setFontSize(13);
    doc.text(`Relatório de Ordens de Serviço ${status}s`, 105 , linha, null, null, 'center');
    linha += 5;
    
    doc.setFontSize(10);
    doc.text(`Período: ${data_inicio} a ${data_fim}`, 105 , linha, null, null, 'center');
    linha += 5;
    
    doc.setLineWidth(0.5);
    doc.line(20, linha, 200, linha);
    
    linha += 10;
    doc.setFontSize(10);
    let cols = [20, 40, 120, 140, 170];
    let headers = ['Número', 'Descrição', 'Data', 'Hora Início', 'Hora Fim'];

    for(let h = 0; h < headers.length; h++){
      doc.text(headers[h], cols[h], linha);
    }

    linha += 10;
    
    this.reports.body.forEach(r =>{
      doc.text(r.id.toString(), cols[0], linha);
      doc.text(this.getDescricao(r), cols[1], linha);
      let data = moment(r.data_hora_inicio).format('DD/MM/YYYY');
      doc.text(data, cols[2], linha);
      let hora_inicio = moment(r.data_hora_inicio).format('HH:mm');
      doc.text(hora_inicio, cols[3], linha);
      let hora_fim = moment(r.data_hora_final).format('HH:mm');
      doc.text(hora_fim, cols[4], linha);
      linha += 10;
    })
    
    doc.save('report.pdf')

  }

}
