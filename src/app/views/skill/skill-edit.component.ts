import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ISkill } from './Skill';
import { SkillService } from './skill.service';

import { GenericValidator } from '../shared/generic.validator';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
})
export class SkillEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Skill Edit';
  errorMessage: string;
  skillForm: FormGroup;

  skill: ISkill;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return <FormArray>this.skillForm.get('tags');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      nome: {
        required: 'Informe seu nome.',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      }
    };

    // Define uma instância do validador para skill neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descricao: ''
    });

    // Lê o id do usuário do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getSkill(id);
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
    merge(this.skillForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.skillForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getSkill(id: number): void {
    this.skillService.getSkill(id)
      .subscribe(
        (skill: ISkill) => this.displaySkill(skill),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displaySkill(skill: ISkill): void {
    if (this.skillForm) {
      this.skillForm.reset();
    }
    this.skill = skill;

    if (this.skill.id === 0) {
      this.title = `Formulário de cadastro`;
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do formulário
    this.skillForm.patchValue({
      nome: this.skill.nome,
      descricao: this.skill.descricao,
    });
    // this.skillForm.setControl('tags', this.fb.array(this.skill.tags || []));
  }

  deleteSkill(): void {
    if (this.skill.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir a habilidade ${this.skill.nome}?`)) {
        this.skillService.deleteSkill(this.skill.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveSkill(): void {
    if (this.skillForm.valid) {
      if (this.skillForm.dirty) {
        const p = { ...this.skill, ...this.skillForm.value };

        if (p.id === 0) {
          this.skillService.createSkill(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.skillService.updateSkill(p)
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
    this.skillForm.reset();
    this.router.navigate(['/habilidades']);
  }

}
