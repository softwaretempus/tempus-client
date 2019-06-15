import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IUser } from './User';
import { UserService } from './user.service';
import { ISkill } from '../skill/Skill';
import { SkillService } from '../skill/skill.service';
import { UserSkillService } from './user-skill.service';

import { ICustomer } from '../customer/Customer';
import { CustomerService } from '../customer/customer.service';

import { GenericValidator } from '../shared/generic.validator';
import { ToastrService } from 'ngx-toastr';
import { CepService } from '../shared/cep.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'User Edit';
  errorMessage: string;
  userForm: FormGroup;
  
  isClientSelected: boolean;

  perfis = [
    { id: 1, descricao: 'Analista' },
    { id: 2, descricao: 'Coordenador' },
    { id: 3, descricao: 'Gerente' },
    { id: 4, descricao: 'Cliente' }
  ];
  users: IUser[] = [];
  superiores: IUser[] = [];
  skills: any[] = [];
  userSkills: any[] = [];

  customers: ICustomer[] = [];
  customer: ICustomer;

  user: IUser;
  superior: any;
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
    private customerService: CustomerService,
    private skillService: SkillService,
    private userSkillService: UserSkillService,
    private cepService: CepService,
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      nome: {
        required: 'Informe seu nome.',
        minLength: 'O nome não pode ter menos que 3 caracteres.',
        maxLength: 'O nome não pode ter mais que 50 caracteres.'
      },
      email: {
        required: 'Informe seu e-mail.',
        email: 'Informe um Email válido.'
      },
      endereco: {
        required: 'Informe seu endereço completo',
        minLength: 'Informe um endereço válido.',
      },
      numero: {
        required: 'Informe o numero',
      },
      complemento: {
        required: 'Informe o complemento',
      },
      bairro: {
        required: 'Informe o bairro',
      },
      cidade: {
        required: 'Informe a cidade',
      },
      uf: {
        required: 'Informe a uf',
      },
      cep: {
        required: 'Informe o cep',
      },
      telefone: {
        required: 'Informe seu telefone',
        minLength: 'Informe um telefone valido.',
      },
      cpf: {
        required: 'Informe um CPF válido',
        minLength: 'Seu CPF deve conter 11 caracteres',
        invalido: 'CPF inválido'
      },
      perfil: {
        required: 'Informe o perfil.',
        min: 'Informe um número entre 1 e 5.',
        max: 'Informe um número entre 1 e 5.',
      },
      senha: {
        required: 'Informe a senha do usuário.',
        minLength: 'Deve conter pelo meno 4 caracteres',
      }
    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cepService = cepService;
  }

  ngOnInit(): void {
    this.getUserForm()
    this.getUserId()
    this.getUsers()
    this.getSelectSkill()
    this.getCustomers()
    this.getSuperiores()
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
        (user: IUser) => {
          this.userSkillService.getUserSkills(user.id)
            .subscribe((userSkills) => {
              let skills = userSkills.map((us) => {
                let s = { ...us.habilidade, nivel: us.nivel }
                return s;
              });
              this.userSkills = skills;
              this.displayUser(user);
            },
              (error: any) => this.errorMessage = <any>error
            )
        },
        (error: any) => this.errorMessage = <any>error
      );
  }

  getUserId(): void {
    // Lê o id do usuário do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getUser(id);
      }
    );
  }

  getUserForm(): void {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      endereco: ['', [Validators.required, Validators.minLength(7)]],
      numero: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['',Validators.required],
      uf: ['', Validators.required],
      cep: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', Validators.required],
      status: [true, null],
      cpf: ['', [Validators.required, Validators.minLength(11), this.cpfValidator]],
      perfil: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(4)]],
      id_cliente: [''],
      id_coordenador: [''],
    });
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
      numero: this.user.numero,
      complemento: this.user.complemento,
      bairro: this.user.bairro,
      cidade: this.user.cidade,
      uf: this.user.uf,
      cep: this.user.cep,
      telefone: this.user.telefone,
      email: this.user.email,
      status: this.user.status,
      cpf: this.user.cpf,
      perfil: this.user.perfil,
      senha: this.user.senha,
      id_cliente: this.user.id_cliente,
      id_coordenador: this.user.id_coordenador
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
          if (p.perfil === 4 || p.perfil === '4') {
            p.cliente = this.getCliente(p.id_cliente);                        
          }
          if(p.id_coordenador){
            p.id_coordenador = parseInt(p.id_coordenador);
            p.coordenador = {};
            p.coordenador.id = p.id_coordenador;
          }
          this.userService.createUser(p)
            .subscribe((result) => {
              this.user.id = result.id;
              if (this.userSkills.length > 0) {
                this.userSkillService
                  .associateUserSkills(this.user, this.userSkills)
                  .subscribe(() => this.onSaveComplete(),
                    (error: any) => this.showError(error))
                this.showSuccess('Usuário inserido na base de dados.')
              } else {
                this.onSaveComplete()
                this.showSuccess('Usuário inserido na base de dados.')
              }
            },
              (error: any) => this.showError(error)
            );
        } else {
          if (p.perfil === 4 || p.perfil === '4') {
            p.cliente = this.getCliente(p.id_cliente);
          }
          if(p.id_coordenador){
            p.id_coordenador = parseInt(p.id_coordenador);
            p.coordenador = {};
            p.coordenador.id = p.id_coordenador;
          }
          this.userService.updateUser(p)
            .subscribe(
              () => {
                this.userSkillService.deleteUserSkills(this.user)
                  .subscribe(() => {
                    this.userSkillService
                      .associateUserSkills(this.user, this.userSkills)
                      .subscribe(() => this.onSaveComplete(),
                        (error: any) => this.errorMessage = <any>error)
                    this.showSuccess('Dados do usuário foram atualizados.')
                  },
                    (error: any) => this.showError('Tente novamente mais tarde')
                  )
              },
              (error: any) => this.showError('Tente novamente mais tarde')
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

  getSelectSkill() {
    this.skillService.getSkills().subscribe(
      skills => {
        this.skills = [...skills];
        this.skills = this.skills.map((s) => {
          s.selected = false;
          s.nivel = 1;
          return s;
        });
      },
      error => this.errorMessage = <any>error
    )
  }

  getSkills(): Observable<ISkill[]> {
    return this.skillService.getSkills();
  }

  addSkill(event): void {
    event.preventDefault();
    let skill = this.skills.filter((s) => s.selected);
    if (skill.length > 0 &&
      this.userSkills.filter((s) => s.id === skill[0].id).length === 0)
      this.userSkills.push(skill[0]);
    this.userForm.markAsDirty();
  }

  onChangeUserProfile(event) {
    let selected = event.target.value;
    if (selected == '4') {
      this.isClientSelected = true;
    } else {
      this.isClientSelected = false;
    }
  }
  
  getSuperiores() {
    this.userService.getUsers().subscribe(
      usuarios => {
        this.superiores = usuarios.filter(u => {
          if(u.perfil > 1 && u.perfil < 4)
            return u;
        });
      },
      error => this.errorMessage = <any>error
    )
  }  

  onChangeUserSuperior(event): void {
    let selected = parseInt(event.target.value)
    this.superior = this.superiores.map((superior) => {
      if (superior.id === selected) {
        this.user.id_coordenador = superior.id
        return superior
      }
    });
  }

  onChangeSkill(newSkill): void {
    this.skills = this.skills.map((s) => {
      if (s.nome === newSkill) // pode melhorar....
        s.selected = true;
      else
        s.selected = false;
      return s;
    });
  }

  onSelectNivel(habNivel) {
    this.userSkills = this.userSkills.map((s) => {
      if (s.id === habNivel.id_habilidade)
        s.nivel = habNivel.nivel;
      return s;
    });
    this.userForm.markAsDirty();

  }

  removeSkill(id) {

    let newSkills = [];

    for (let n = 0; n < this.userSkills.length; n++) {
      if (this.userSkills[n].id !== id)
        newSkills.push(this.userSkills[n]);
    }

    this.userSkills = newSkills;
    this.userForm.markAsDirty();

  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

  phonemask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength > 10) {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
  }

  cpfcnpjmask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 11) {
      return [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
    } else {
      return [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
    }
  }

  cpfmask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    return [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]
  }

  cnpjmask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    return [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users
      },
      error => this.errorMessage = <any>error
    )
  }

  getCustomers(): void {
    this.customerService.getCustomers().subscribe(
      customers => {
        this.customers = customers
      },
      error => this.errorMessage = <any>error
    )
  }

  getCliente(id: number) {
    let cliente = null;

    this.customers.forEach(c => {
      if (c.id === id) {
        cliente = c;
      }
    })
    return cliente;
  }

  cpfValidator(control: FormControl){
    let cpf = control.value;        
    if(cpf){      
      cpf = removeMascaraCPF(cpf);      
      if(!validaCPF(cpf)){
        return {invalido: true}
      }else{
        return null;
      }

    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid);
  }

  buscaCEP(cep: string){
    
    this.cepService.getCep(cep).subscribe(cep => {
      
      this.userForm.patchValue({
       endereco : cep.street,
       bairro : cep.neighborhood,
       cidade : cep.city,
       uf : cep.state,
      });
    });
   }

}

function removeMascaraCPF(cpf){
  
  cpf = replaceAll(cpf, '_', '');      
  cpf = replaceAll(cpf, '-', '');
  cpf = cpf.replace('.', '');
  cpf = cpf.replace('.', '');

  return cpf;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function validaCPF(cpf)
  {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
          return false;
    for (i = 0; i < cpf.length - 1; i++)
          if (cpf.charAt(i) != cpf.charAt(i + 1))
                {
                digitos_iguais = 0;
                break;
                }
    if (!digitos_iguais)
          {
          numeros = cpf.substring(0,9);
          digitos = cpf.substring(9);
          soma = 0;
          for (i = 10; i > 1; i--)
                soma += numeros.charAt(10 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(0))
                return false;
          numeros = cpf.substring(0,10);
          soma = 0;
          for (i = 11; i > 1; i--)
                soma += numeros.charAt(11 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(1))
                return false;
          return true;
          }
    else
        return false;
  }