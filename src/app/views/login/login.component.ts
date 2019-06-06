import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';

import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

import { GenericValidator } from '../shared/generic.validator';

import { debounceTime, debounce } from 'rxjs/operators';

import { IUser } from '../user/User'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorMessage: string;
  loginForm: FormGroup;

  private user: IUser
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) {
    // Define todas as mensagens de validação para este formulários.
    // TODO: Melhor se for instanciado de um outro arquivo.
    this.validationMessages = {
      email: {
        required: 'Informe seu e-mail.',
        email: 'Informe um Email válido.'
      },
      senha: {
        required: 'Informe a senha do usuário.',
        minLength: 'Deve conter pelo meno 4 caracteres',
      }
    };

    // Define uma instância do validador para user neste form,
    // passando as mensagens de validação.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.loginForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm);
    });
  }

  login() {
    this.authService.userAuthentication(this.loginForm.value).pipe(
    ).subscribe(res => {
      if (res.status_code == 200) {
        localStorage.setItem("token", res.token);
        this.router.navigate(['/usuarios'])
        this.toastr.success('Autenticação realizada com sucesso', 'Tudo Pronto!');
      }
      if (res.status_code == 400) {
        this.toastr.error('Preencha os campos obrogatórios', 'Erro!');
      }
      if (res.status_code == 401) {
        this.toastr.error('Acesso não autorizado', 'Atenção!');
      }
      if (res.status_code == 404) {
        this.toastr.error('Usuário não cadastrado em nossa base de dados', 'Erro!');
      }
    })
  }

}
