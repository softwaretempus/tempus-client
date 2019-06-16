import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IUser } from './User'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:3000/usuario'

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.usersUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getUser(id: number): Observable<IUser> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<IUser>(url)
      .pipe(
        tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createUser(user: IUser): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    user.id = null;
    return this.http.post<IUser>(this.usersUrl, user, { headers: headers })
      .pipe(
        tap(data => console.log('createUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<IUser>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteUser: ' + id)),
        catchError(this.handleError)
      );
  }

  updateUser(user: IUser): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}`;
    return this.http.put<IUser>(url, user, { headers: headers })
      .pipe(
        tap(() => console.log('updateUser: ' + user)),
        map(() => user),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Ocorreu um erro: ${err.error.message}`;
    } else {
      
      if(err.error && err.error.error)
        errorMessage = err.error.error;
      else
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    
    return throwError(errorMessage);
  }

  private initializeUser(): IUser {
    // Return an initialized object
    return {
      id: 0,
      nome: null,
      endereco: null,
      numero: null,
      complemento: null,
      bairro: null,
      cidade: null,
      uf: null,
      cep: null,
      telefone: null,
      email: null,
      status: null,
      cpf: null,
      perfil: null,
      senha: null,
      id_cliente: null,
      id_coordenador: null,
      cliente: null
    };
  }

}