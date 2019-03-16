import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IUser } from '../user';
import { UserService } from '../user.service';

import { GenericValidator } from '../../shared/generic.validator';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'User Edit';
  errorMessage: string;
  userForm: FormGroup;

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
    private userService: UserService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      userName: {
        required: 'Preenchimento do nome é obrigatório.',
        minlength: 'O nome não pode ter menos que 3 caracteres.',
        maxlength: 'O nome não pode ter mais que 50 caracteres.'
      },
      userCode: {
        required: 'Informe o CPF ou CNPJ.'
      },
      userProfile: {
        required: 'Informe um perfil.',
        min: 'Informe um número entre 1 e 5.',
        max: 'Informe um número entre 1 e 5.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      userAddress: ['', Validators.required],
      userEmail: ['', Validators.required],
      userStatus: ['', Validators.required],
      userCode: ['', Validators.required],
      userProfile: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    // Read the user Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getUser(id);
      }
    );

    console.log(this.sub)

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
      this.title = `Add User`;
    } else {
      this.title = `Edit User: ${this.user.nome}`;
    }

    // Update the data on the form
    this.userForm.patchValue({
      userName: this.user.nome,
      userAddress: this.user.endereco,
      userEmail: this.user.email,
      userStatus: this.user.status,
      userCode: this.user.cpf,
      userProfile: this.user.perfil
    });
    // this.userForm.setControl('tags', this.fb.array(this.user.tags || []));
  }

  deleteUser(): void {
    if (this.user.id === 0) {
      // Don't delete, it was never saved.
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
      this.errorMessage = 'Por favor, corrige os erros de validação.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/users']);
  }

}
