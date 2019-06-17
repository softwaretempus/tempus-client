import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IOs } from './Os'


@Injectable({
  providedIn: 'root'
})
export class OsService {

  private ossUrl = 'http://localhost:3000/os'

  constructor(private http: HttpClient) { }

  getOss(): Observable<IOs[]> {
    return this.http.get<IOs[]>(this.ossUrl)
      .pipe(
        tap(data => console.log('Os\'s: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getOs(id: number): Observable<IOs> {
    if (id === 0) {
      return of(this.initializeOs());
    }
    const url = `${this.ossUrl}/${id}`;
    return this.http.get<IOs>(url)
      .pipe(
        tap(data => console.log('Os: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  solicitarAprovacao(id: number): Observable<IOs> {
    
    const url = `http://localhost:3000/email/os/${id}`;
    return this.http.get<IOs>(url)
      .pipe(
        tap(data => console.log('Os: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createOs(os: IOs): Observable<IOs> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    os.id = null;
    return this.http.post<IOs>(this.ossUrl, os, { headers: headers })
      .pipe(
        tap(data => console.log('createOs: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteOs(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.ossUrl}/${id}`;
    return this.http.delete<IOs>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteOs: ' + id)),
        catchError(this.handleError)
      );
  }

  updateOs(os: IOs): Observable<IOs> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.ossUrl}/${os.id}`;
    return this.http.put<IOs>(url, os, { headers: headers })
      .pipe(
        tap(() => console.log('updateOs: ' + os.id)),
        map(() => os),
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

  private initializeOs(): IOs {
    // Return an initialized object
    return {
      id: 0,
      status: null,
      descricao: null,
      data_hora_inicio: null,
      data_hora_final: null,
      data_exclusao: null,
      agendamento: null
    };
  }

}