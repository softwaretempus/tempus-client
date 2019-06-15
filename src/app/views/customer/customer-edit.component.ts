import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ICustomer } from './Customer';
import { CustomerService } from './customer.service';
import { CepService } from '../shared/cep.service';

import { GenericValidator } from '../shared/generic.validator';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
})
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = '';
  errorMessage: string;
  customerForm: FormGroup;

  customers: ICustomer[] = [];
  customer: ICustomer;

  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private cepService: CepService,
    private toastr: ToastrService) {

    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      nome: {
        required: 'Informe seu nome.',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      },
      endereco: {
        required: 'Informe seu endereço',
        minlength: 'Informe um endereço válido.',
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
        minlength: 'Informe um telefone válido.',
      },
      email: {
        required: 'Informe seu e-mail.',
        email: 'Informe um Email válido.'
      },
      nome_responsavel: {
        required: 'Informe o nome da pessoa responsável',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      },
      cnpj: {
        required: 'Informe o CNPJ',
        minlength: 'O CNPJ deve conter 14 caracteres',
      },
    };

    // Define uma instância do validador para customer neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cepService = cepService;

  }

  ngOnInit(): void {
    this.getCustomerForm()
    this.getCustomerId()
    this.getCustomers()
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(
      customers => {
        this.customers = customers
      },
      error => this.errorMessage = <any>error
    )
  }

  getCustomer(id: number): void {
    this.customerService.getCustomer(id)
      .subscribe(
        (customer: ICustomer) => this.displayCustomer(customer),
        (error: any) => this.errorMessage = <any>error
      );
  }

  getCustomerId(): void {
    // Lê o id do usuário do parâmetro da rota,
    // e retorna dados da api
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getCustomer(id);
      }
    );
  }

  getCustomerForm(): void {
    this.customerForm = this.fb.group({
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
      razao_social: [''],
      nome_responsavel: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
    });
  }

  displayCustomer(customer: ICustomer): void {
    if (this.customerForm) {
      this.customerForm.reset();
    }
    this.customer = customer;

    if (this.customer.id === 0) {
      this.title = `Formulário de cadastro`;
    } else {
      this.title = `Formulário de edição`;
    }

    // Atualiza os dados do formulário
    this.customerForm.patchValue({
      nome: this.customer.nome,
      endereco: this.customer.endereco,
      numero: this.customer.numero,
      complemento: this.customer.complemento,
      bairro: this.customer.bairro,
      cidade: this.customer.cidade,
      uf: this.customer.uf,
      cep: this.customer.cep,
      telefone: this.customer.telefone,
      email: this.customer.email,
      status: this.customer.status,
      razao_social: this.customer.razao_social,
      nome_responsavel: this.customer.nome_responsavel,
      cnpj: this.customer.cnpj,
    });
  }

  deleteCustomer(): void {
    if (this.customer.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Deseja realmente excluir o cliente "${this.customer.nome}"?`)) {
        this.customerService.deleteCustomer(this.customer.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.showError('Algo está errado. Tente mais tarde.')
          );
        this.showSuccess('Cliente removido da base de dados.')
      }
    }
  }

  saveCustomer(): void {
    if (this.customerForm.valid) {
      if (this.customerForm.dirty) {
        const p = { ...this.customer, ...this.customerForm.value };

        if (p.id === 0) {
          this.customerService.createCustomer(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError('Algo está errado. Tente mais tarde.')
            );
          this.showSuccess('Cliente inserido na base de dados.')
        } else {
          this.customerService.updateCustomer(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.showError('Algo está errado. Tente mais tarde.')
            );
          this.showSuccess('Cliente alterado na base de dados.')
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Por favor, corrija os erros de validação.';
    }
  }

  onSaveComplete(): void {
    this.customerForm.reset();
    this.router.navigate(['/clientes']);
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

  cnpjmask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    return [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]
  }

  cepmask(rawValue) {
    var numbers = rawValue.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    return [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/]
  }

  buscaCEP(cep: string){
    
   this.cepService.getCep(cep).subscribe(cep => {
     
     this.customerForm.patchValue({
      endereco : cep.street,
      bairro : cep.neighborhood,
      cidade : cep.city,
      uf : cep.state,
     });
   });
  }

  // Interfaces
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.customerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.customerForm);
    });
  }

}