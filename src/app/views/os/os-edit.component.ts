import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IOs } from './Os';
import { OsService } from './os.service';

import { IAgendamento } from '../agendamento/Agendamento';
import { AgendamentoService } from '../agendamento/agendamento.service';

import { GenericValidator } from '../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      status: {
        required: 'Selecione um status.',
      },
      descricao: {
        required: 'Informe a descrição do serviço.',
        minlength: 'A descrição não pode ter menos que 3 caracteres.',
        maxlength: 'A descrição não pode ter mais que 50 caracteres.'
      },
      data_hora_inicio: {
        required: 'Informe a data e horário de início do serviço.'
      },
      data_hora_final: {
        required: 'Informe a data e horário de término do serviço.'
      },
      agendamento: {
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
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      data_hora_inicio: ['', Validators.required],
      data_hora_final: ['', Validators.required],
      data_exclusao: [''],
      agendamento: ['', Validators.required]
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
        this.agendamentos = agendamentos
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
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do formulário
    this.osForm.patchValue({
      status: this.os.status,
      descricao: this.os.descricao,
      data_hora_inicio: this.os.data_hora_inicio,
      data_hora_final: this.os.data_hora_final,
      data_exclusao: this.os.data_exclusao,
      agendamento: this.os.agendamento
    });
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

  onChangeAgendamento(elementSelected): void {
    elementSelected = parseInt(elementSelected)
    this.agendamentos = this.agendamentos.map((agendamento) => {
      if (agendamento.id === elementSelected) {
        this.os.agendamento = agendamento;
      }
      else
        agendamento.selected = false;
      return agendamento;
    });
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
