import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IOs } from './Os';
import { OsService } from './os.service';

import { IAgendamento } from '../agendamento/Agendamento';
import { AgendamentoService } from '../agendamento/agendamento.service';

import { IAtendimento } from '../atendimento/Atendimento';
import { AtendimentoService } from '../atendimento/atendimento.service';

import { GenericValidator } from '../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

@Component({
  selector: 'app-os-edit',
  templateUrl: './os-edit.component.html',
})
export class OsEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Os Edit';
  errorMessage: string;
  osForm: FormGroup;

  os: IOs;
  agendamentos: any[];
  agendamento: any;
  private sub: Subscription;
  horaInicioStr : string;
  horaFimStr: string;
  atendimentos: IAtendimento[];

  status: any = [
    { id: 1, descricao: 'Aberta' },
    { id: 2, descricao: 'Em execução' },
    { id: 3, descricao: 'Em aprovação' },
    { id: 4, descricao: 'Aprovada' },
    { id: 5, descricao: 'Rejeitada' },
    { id: 6, descricao: 'Concluída' },
    { id: 7, descricao: 'Cancelada' }
  ];

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private osService: OsService,
    private agendamentoService: AgendamentoService,
    private toastr: ToastrService,
    private atendimentoService: AtendimentoService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      status: {
        required: 'Selecione um status.',
      },
      descricao: {
        required: 'Informe a descrição do serviço.',
        maxlength: 'A descrição não pode ter mais que 255 caracteres.'
      },
      data: {
        required: 'Informe a data.'
      },
      hora_inicio: {
        required: 'Informe o horário de inicio do servico.'
      },
      hora_fim: {
        required: 'Informe o horário do termino do servico.'
      },
      agendamento_id: {
        required: 'Selecione um agendamento.'
      }
    };

    // Define uma instância do validador para os neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.osForm = this.fb.group({
      status: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
      data: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_final: ['', Validators.required],
      agendamento_id: ['', Validators.required]
    });

    // Lê o id do usuário do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getOs(id);
      }
    );
    
    this.getAgendamentos()


  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.osForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.osForm);
    });
  }

  getOs(id: number): void {
    this.osService.getOs(id)
      .subscribe(
        (os: IOs) => this.displayOs(os),
        (error: any) => this.errorMessage = <any>error
      );
  }

  getAgendamentos(): void {
    this.agendamentoService.getAgendamentos().subscribe(
      agendamentos => {
        this.agendamentos = agendamentos;
        if(this.os.id > 0){
          this.atendimentoService.getAtendimento(this.os.agendamento.id_atendimento).subscribe(
            atend => {
              this.os.agendamento.atendimento = atend;
            }
          )
        }
      },
      error => this.errorMessage = <any>error
    )
  }

  displayOs(os: IOs): void {
    if (this.osForm) {
      this.osForm.reset();
    }
    this.os = os;

    if (this.os.id === 0) {
      this.title = `Formulário de cadastro`;
      this.osForm.get('agendamento_id').setValidators(Validators.required);
    } else {
      this.title = `Formulário de edição`;
      this.osForm.get('agendamento_id').setValidators(null);
    }

    // Atualiza os dados do formulário
    this.atualizaForm(1);
  }

  atualizaForm(opc: number){
    
    if(opc === 1){ // todo
    
      this.osForm.patchValue({
        status: this.os.status,
        descricao: this.os.descricao,
        data: moment(this.os.data_hora_inicio).format('YYYY-MM-DD'),
        hora_inicio: moment(this.os.data_hora_inicio).format('HH:mm'),
        hora_final: moment(this.os.data_hora_final).format('HH:mm'),
      });

    }else{ // so data e horas
      this.osForm.patchValue({
        data: moment(this.os.data_hora_inicio).format('YYYY-MM-DD'),
        hora_inicio: moment(this.os.data_hora_inicio).format('HH:mm'),
        hora_final: moment(this.os.data_hora_final).format('HH:mm'),
      });
    }
  }

  onChangeData(data: any){
    this.os.data_hora_inicio = moment(data,'YYYY-MM-DD').toDate();
    this.os.data_hora_final  = moment(data,'YYYY-MM-DD').toDate();
    this.atualizaForm(2);
    console.log(this.os.data_hora_inicio);
    console.log(this.os.data_hora_final);
  }

  onChangeHoraIni(hora: any){
    let data = moment(this.os.data_hora_inicio).format('DD/MM/YYYY');
    this.os.data_hora_inicio = moment(`${data} ${hora}`, "DD/MM/YYYY HH:mm").toDate();
    this.atualizaForm(2);
    console.log(this.os.data_hora_inicio);
  }

  onChangeHoraFim(hora: any){
    let data = moment(this.os.data_hora_final).format('DD/MM/YYYY');
    this.os.data_hora_final = moment(`${data} ${hora}`, "DD/MM/YYYY HH:mm").toDate();
    this.atualizaForm(2);
    console.log(this.os.data_hora_final);
  }

  selecionado(agendamento: IAgendamento){
    let ret = false;
    if(this.os && this.os.id){
      if(agendamento.id === this.os.agendamento.id)
        ret = true;
    }
    return ret;
  }

  deleteOs(): void {
    if (this.os.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir a ordem de serviço "${this.os.descricao}"?`)) {
        this.osService.deleteOs(this.os.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.showError('Algo está errado. Tente mais tarde.')
          );
        this.showSuccess('Ordem de serviço removida da base de dados.')
      }
    }
  }

  saveOs(): void {
    if (this.osForm.valid) {
      if (this.osForm.dirty) {
        const p = { ...this.os, ...this.osForm.value };

        if (p.id === 0) {
          this.osService.createOs(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError('Algo está errado. Tente mais tarde.')
            );
        } else {
          this.osService.updateOs(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError('Algo está errado. Tente mais tarde.')
            );
          this.showSuccess('Ordem de serviço alterada na base de dados.')
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Por favor, corrija os erros de validação.';
    }
  }

  onChangeAgendamento(id): void {
    this.agendamentos.forEach(a => {
      if( parseInt(id) === a.id){
        this.os.agendamento = a;
      }
    })
  }

  onChangeStatus(e): void {
    this.status = this.status.map((u) => {
      if (u.descricao === e) {
        u.selected = true;
        this.os.status = u;
      }
      else
        u.selected = false;
      return u;
    });
  }

  filtrarStatus(status: any){
    let filtered = [];
    this.status.forEach(s => {
      if(this.os && this.os.id){ // Ediçao
        if(s.id <= 3 || s.id === 7) // Aberta, em execucao, em aprovacao, cancelada
          filtered.push(s);
      }else{ // inclusao
        if(s.id === 1) // Aberta ou Em execucao
          filtered.push(s);
      }
    });
    return filtered;
  }

  onSaveComplete(): void {
    this.osForm.reset();
    this.router.navigate(['/os']);
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
