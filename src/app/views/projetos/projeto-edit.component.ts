import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IProjeto } from './Projeto';
import { ProjetoService } from './projeto.service';

import { IAtendimento } from '../atendimento/Atendimento';
import { AtendimentoService } from '../atendimento/atendimento.service';

import { GenericValidator } from '../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projeto-edit',
  templateUrl: './projeto-edit.component.html',
})
export class ProjetoEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Atendimento Edit';
  errorMessage: string;
  projetoForm: FormGroup;

  projeto: IProjeto;
  atendimentos: IAtendimento[] = [];
  atendimentoSelected: number
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private atendimentoService: AtendimentoService,
    private projetoService: ProjetoService,
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      nome: {
        required: 'Informe o nome.',
        minLength: 'O nome não pode ter menos que 3 caracteres.',
        maxLength: 'O nome não pode ter mais que 50 caracteres.'
      },
      descricao_atividades: {
        required: 'Informe a descrição das atividades.',
        minLength: 'A descrição não pode ter menos que 3 caracteres.',
        maxLength: 'A descrição não pode ter mais que 50 caracteres.'
      },
      id_atendimento: {
        required: 'Informe o atendimento a ser vinculado ao projeto.'
      },
      horas_estimadas: {
        required: 'Informe as horas estimadas.',
        min: 'Quantidade mínima de horas: 1.',
      },
      horas_realizadas: {
        required: 'Informe as horas realizadas.'
      },

    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.projetoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descricao_atividades: ['', [Validators.required, Validators.minLength(7)]],
      id_atendimento: ['', Validators.required],
      horas_estimadas: ['', [Validators.required, Validators.min(1)]],
      horas_realizadas: ['', Validators.required],
    });

    this.getProjetoId()
    this.getAtendimentos()

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.projetoForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.projetoForm);
    });
  }

  getProjetoId() {
    // Lê o id do atendimento do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getProjeto(id);
      }
    );
  }

  getAtendimentos(): void {
    this.atendimentoService.getAtendimentos().subscribe(
      atendimentos => {
        this.atendimentos = atendimentos
      },
      error => this.errorMessage = <any>error
    )
  }

  getProjeto(id: number): void {
    this.projetoService.getProjeto(id)
      .subscribe(
        (atendimento: IProjeto) => this.displayProjeto(atendimento),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayProjeto(projeto: IProjeto): void {
    if (this.projetoForm) {
      this.projetoForm.reset();
    }
    this.projeto = projeto;

    if (this.projeto.id === 0) {
      this.title = `Formulário de Projeto`;
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do atendimento
    this.projetoForm.patchValue({
      nome: this.projeto.nome,
      descricao_atividades: this.projeto.descricao_atividades,
      id_atendimento: this.projeto.id_atendimento,
      horas_estimadas: this.projeto.horas_estimadas,
      horas_realizadas: this.projeto.horas_realizadas
    });
    // this.userForm.setControl('tags', this.fb.array(this.user.tags || []));
  }

  deleteUser(): void {
    if (this.projeto.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir o projeto: ${this.projeto.nome}?`)) {
        this.projetoService.deleteProjeto(this.projeto.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveProjeto(): void {
    if (this.projetoForm.valid) {
      if (this.projetoForm.dirty) {
        const p = { ...this.projeto, ...this.projetoForm.value };

        if (p.id === 0) {
          this.projetoService.createProjeto(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError(error)
            );
          this.showSuccess('Projeto inserido na base de dados.')
        } else {
          this.projetoService.updateProjeto(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError(error)
            );
          this.showSuccess('Dados do projeto foram atualizados.')
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.showError("Por favor, corrija os erros de validação.")
    }
  }

  deleteProjeto(): void {
    if (this.projeto.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir o projeto "${this.projeto.nome}"?`)) {
        this.projetoService.deleteProjeto(this.projeto.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.showError('Algo está errado. Tente mais tarde.')
          );
        this.showSuccess('Projeto removida da base de dados.')
      }
    }
  }

  onChangeSelect(event) {
    this.atendimentoSelected = event.target.value
  }

  onSaveComplete(): void {
    this.projetoForm.reset();
    this.router.navigate(['/projetos']);
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
