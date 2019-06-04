import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IUser } from '../user/User'
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:3000/login'
  private usuarioAutenticado: boolean = false

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  userAuthentication(usuario: IUser) {

    if (usuario.email === 'admin' && usuario.senha === 'admin') {
      this.usuarioAutenticado = true
      this.router.navigate(['/'])
      this.toastr.success('Usuário autenticado.', 'Sucesso!');
    } else {
      this.usuarioAutenticado = false
      this.toastr.warning('Erro de autenticação. Confira seus dados cadastrais.', 'Erro!');
    }

  }

}