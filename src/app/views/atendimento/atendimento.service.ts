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
    console.log(url)
    console.log(atendimento)
    console.log({headers: headers})
    return this.http.put<IAtendimento>(url, atendimento, { headers: headers })
      .pipe(
        tap(() => console.log('updateAtendimento: ' + atendimento.id)),
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

  private initializeAtendimento(): IAtendimento {
    // Return an initialized object
    return {
      id: 0,
      usuario: null,
      assunto: null,
      descricao: null,
      data_sugerida: null,
      habilidade: null
    };
  }

}