import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IAtendimento } from './Atendimento'


@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private atendimentosUrl = 'http://localhost:3000/atendimento'

  constructor(private http: HttpClient) { }

  getAtendimentos(): Observable<IAtendimento[]> {
    return this.http.get<IAtendimento[]>(this.atendimentosUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getAtendimento(id: number): Observable<IAtendimento> {
    if (id === 0) {
      return of(this.initializeAtendimento());
    }
    const url = `${this.atendimentosUrl}/${id}`;
    return this.http.get<IAtendimento>(url)
      .pipe(
        tap(data => console.log('getAtendimento: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createAtendimento(atendimento: IAtendimento): Observable<IAtendimento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    atendimento.id = null;
    console.log(atendimento);
    return this.http.post<IAtendimento>(this.atendimentosUrl, atendimento, { headers: headers })
      .pipe(
        tap(data => console.log('createAtendimento: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteAtendimento(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.atendimentosUrl}/${id}`;
    return this.http.delete<IAtendimento>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteAtendimento: ' + id)),
        catchError(this.handleError)
      );
  }

  updateAtendimento(atendimento: IAtendimento): Observable<IAtendimento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.atendimentosUrl}/${atendimento.id}`;
    return this.http.put<IAtendimento>(url, atendimento, { headers: headers })
      .pipe(
        tap(() => console.log('updateAtendimento: ' + atendimento.id)),
        map(() => atendimento),
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

  private initializeAtendimento(): IAtendimento {
    // Return an initialized object
    return {
      id: 0,
      usuario: null,
      assunto: null,
      descricao: null,
      data_sugerida: null,
      id_usuario: null,
      id_habilidade: null,
      habilidade: null
    };
  }

}