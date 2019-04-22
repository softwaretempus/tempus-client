import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IUser } from './User';
import { UserService } from './user.service';
import { ISkill } from '../skill/Skill';
import { SkillService } from '../skill/skill.service';

import { GenericValidator } from '../shared/generic.validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'User Edit';
  errorMessage: string;
  userForm: FormGroup;
  perfis = [
    {id: 1, descricao: 'Analista'},
    {id: 2, descricao: 'Coordenador'},
    {id: 3, descricao: 'Gerente'},
    {id: 4, descricao: 'Cliente'}
  ];
  skills: any[] = [];
  userSkills: any[] = [];  

  user: IUser;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return <FormArray>this.userForm.get('tags');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private skillService: SkillService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      nome: {
        required: 'Informe seu nome.',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      },
      email: {
        required: 'Informe seu e-mail.',
        email: 'Informe um Email válido.'
      },
      endereco: {
        required: 'Informe seu endereço completo',
        minlength: 'Informe um endereço válido.',
      },
      cpf: {
        required: 'Informe o CPF ou CNPJ'
      },
      perfil: {
        required: 'Informe o perfil.',
        min: 'Informe um número entre 1 e 5.',
        max: 'Informe um número entre 1 e 5.',
      }
    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      endereco: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', Validators.required],
      status: [true, null],
      cpf: ['', Validators.required],
      perfil: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    // Lê o id do usuário do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getUser(id);
      }
    );

    this.skillService.getSkills().subscribe(
      skills => {        
        this.skills = [...skills];
        this.skills = this.skills.map((s) =>{
          s.selected = false;
          return s;
        });        
      },
      error => this.errorMessage = <any>error
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.userForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.userForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getUser(id: number): void {
    this.userService.getUser(id)
      .subscribe(
        (user: IUser) => this.displayUser(user),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayUser(user: IUser): void {
    if (this.userForm) {
      this.userForm.reset();
    }
    this.user = user;

    if (this.user.id === 0) {
      this.title = `Formulário de cadastro`;
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do formulário
    this.userForm.patchValue({
      nome: this.user.nome,
      endereco: this.user.endereco,
      email: this.user.email,
      status: this.user.status,
      cpf: this.user.cpf,
      perfil: this.user.perfil
    });
    // this.userForm.setControl('tags', this.fb.array(this.user.tags || []));
  }

  deleteUser(): void {
    if (this.user.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir o usuário: ${this.user.nome}?`)) {
        this.userService.deleteUser(this.user.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      if (this.userForm.dirty) {
        const p = { ...this.user, ...this.userForm.value };

        if (p.id === 0) {
          this.userService.createUser(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.userService.updateUser(p)
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
    this.userForm.reset();
    this.router.navigate(['/usuarios']);
  }

  getSkills(): Observable<ISkill[]>{    
    return this.skillService.getSkills();    
  }

  addSkill(event): void{
    event.preventDefault();        
    let skill = this.skills.filter((s) => s.selected);
    if(skill.length > 0)       
      this.userSkills.push(skill[0]);    
  }

  onChangeSkill(newSkill): void{
    this.skills = this.skills.map((s) => {      
      if(s.nome === newSkill) // pode melhorar....
        s.selected = true;
      else
        s.selected = false;      
      return s;        
    });        
  }

}
