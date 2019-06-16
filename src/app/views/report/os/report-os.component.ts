import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericValidator } from '../../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

import { ReportOsService } from './report-os.service';
import { IReportOs } from './ReportOs';

import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report-os.component.html'
})
export class ReportOsComponent implements OnInit {

  title: string = 'Relatorios'
  errorMessage: string
  reportsForm: FormGroup
  reports: any[] = []
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
    const teste = this.reportsForm.get('status').value
    const data_inicio = this.reportsForm.get('data_inicio').value
    const data_fim = this.reportsForm.get('data_fim').value
    this.reportService.getReports(teste, data_inicio, data_fim).subscribe(
      reports => this.reports = reports,
      error => this.errorMessage = <any>error
    )
  }

  convertDate(data: Date): string {
    return moment(data).format('DD/MM/YYYY HH:mm')
  }

}
