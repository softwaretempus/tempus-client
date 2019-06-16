import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericValidator } from '../../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

import { ReportProjectsService } from './report-projects.service';
import { IReportProjects } from './ReportProjects';

import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report-projects.component.html'
})
export class ReportProjectsComponent implements OnInit {

  title: string = 'Relatorios'
  errorMessage: string
  reportsForm: FormGroup
  reports: any[] = []

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportProjectsService,
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

}
