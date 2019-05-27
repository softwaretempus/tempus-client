import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IProjeto } from './Projeto'


@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private projetosUrl = 'http://localhost:3000/projeto'

  constructor(private http: HttpClient) { }

  getProjetos(): Observable<IProjeto[]> {
    return this.http.get<IProjeto[]>(this.projetosUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getProjeto(id: number): Observable<IProjeto> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.projetosUrl}/${id}`;
    return this.http.get<IProjeto>(url)
      .pipe(
        tap(data => console.log('getProjeto: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createProjeto(atendimento: IProjeto): Observable<IProjeto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    atendimento.id = null;
    return this.http.post<IProjeto>(this.projetosUrl, atendimento, { headers: headers })
      .pipe(
        tap(data => console.log('createProjeto: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteProjeto(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.projetosUrl}/${id}`;
    return this.http.delete<IProjeto>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteProjeto: ' + id)),
        catchError(this.handleError)
      );
  }

  updateProjeto(atendimento: IProjeto): Observable<IProjeto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.projetosUrl}/${atendimento.id}`;
    console.log(url)
    console.log(atendimento)
    console.log({headers: headers})
    return this.http.put<IProjeto>(url, atendimento, { headers: headers })
      .pipe(
        tap(() => console.log('updateProjeto: ' + atendimento.id)),
        map(() => atendimento),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeUser(): IProjeto {
    // Return an initialized object
    return {
      id: 0,
      nome: null,
      descricao_atividades: null,
      horas_estimadas: null,
      horas_realizadas: null,
      id_atendimento: null
    };
  }

}