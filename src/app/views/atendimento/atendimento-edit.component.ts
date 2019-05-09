import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IAtendimento } from './Atendimento';
import { AtendimentoService } from './atendimento.service';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';

import { GenericValidator } from '../shared/generic.validator';

@Component({
  selector: 'app-atendimento-edit',
  templateUrl: './atendimento-edit.component.html',
})
export class AtendimentoEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Atendimento Edit';
  errorMessage: string;
  atendimentoForm: FormGroup;

  atendimento: IAtendimento;
  usuarios: any[];
  habilidades: any[];
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return <FormArray>this.atendimentoForm.get('tags');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private atendimentoService: AtendimentoService,
    private userService: UserService,
    private skillService: SkillService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      assunto: {
        required: 'Informe o Assunto.',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      },
      descricao: {
        required: 'Informe a  descrição.',
        descricao: 'Informe um Email válido.'
      },
      dataSugerida: {
        required: 'Informe a data',
        minlength: 'Informe um endereço válido.',
      },

    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.atendimentoForm = this.fb.group({
      assunto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descricao: ['', [Validators.required, Validators.minLength(7)]],
      dataSugerida: ['', Validators.required],    
    });

    this.userService.getUsers().subscribe(
      users => {
        this.usuarios = [...users];
        this.usuarios = this.usuarios.map((u) => {
          u.selected = false;
          return u;
        }).filter((u) => u.perfil === 4);
      },
      error => this.errorMessage = <any>error
    )

    this.skillService.getSkills().subscribe(
      skills => {
        this.habilidades = [...skills];
        this.habilidades = this.habilidades.map((s) => {
          s.selected = false;
          return s;
        });
      },
      error => this.errorMessage = <any>error
    )

    // Lê o id do atendimento do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getAtendimento(id);
      }
    );

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.atendimentoForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.atendimentoForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getAtendimento(id: number): void {
    this.atendimentoService.getAtendimento(id)
      .subscribe(
        (atendimento: IAtendimento) => this.displayAtendimento(atendimento),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayAtendimento(atendimento: IAtendimento): void {
    if (this.atendimentoForm) {
      this.atendimentoForm.reset();
    }
    this.atendimento = atendimento;

    if (this.atendimento.id === 0) {
      this.title = `Formulário de Atendimento`;
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do atendimento
    this.atendimentoForm.patchValue({
      usuario: this.atendimento.usuario,
      assunto: this.atendimento.assunto,
      descricao: this.atendimento.descricao,
      dataSugerida: this.atendimento.dataSugerida
    });
    // this.userForm.setControl('tags', this.fb.array(this.user.tags || []));
  }

  deleteUser(): void {
    if (this.atendimento.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir o atendimento: ${this.atendimento.assunto}?`)) {
        this.atendimentoService.deleteAtendimento(this.atendimento.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveUser(): void {
    if (this.atendimentoForm.valid) {
      if (this.atendimentoForm.dirty) {
        const p = { ...this.atendimento, ...this.atendimentoForm.value };

        if (p.id === 0) {
          this.atendimentoService.createAtendimento(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.atendimentoService.updateAtendimento(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Por favor, corrija os erros de validação.';
    }
  }

  onSaveComplete(): void {
    this.atendimentoForm.reset();
    this.router.navigate(['/atendimento']);
  }

  onChangeUser(userSel): void {
    this.usuarios = this.usuarios.map((u) => {
      if (u.nome === userSel) // pode melhorar....
        u.selected = true;
      else
        u.selected = false;
      return u;
    });
  }

}
