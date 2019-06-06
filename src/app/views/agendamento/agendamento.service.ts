import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IAgendamento} from './Agendamento';


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private agendamentoUrl = 'http://localhost:3000/agendamento'

  constructor(private http: HttpClient) { }

  getAgendamentos(): Observable<IAgendamento[]> {
    return this.http.get<IAgendamento[]>(this.agendamentoUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getAgendamento(id: number): Observable<IAgendamento> {
    if (id === 0) {
      return of(this.initializeAgendamento());
    }
    const url = `${this.agendamentoUrl}/${id}`;
    return this.http.get<IAgendamento>(url)
      .pipe(
        tap(data => console.log('getAgendamento: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createAgendamento(agendamento: IAgendamento): Observable<IAgendamento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    agendamento.id = null;
    return this.http.post<IAgendamento>(this.agendamentoUrl, agendamento, { headers: headers })
      .pipe(
        tap(data => console.log('createAgendamento: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteAgendamento(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.agendamentoUrl}/${id}`;
    return this.http.delete<IAgendamento>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteAgendamento: ' + id)),
        catchError(this.handleError)
      );
  }

  updateAgendamento(agendamento: IAgendamento): Observable<IAgendamento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.agendamentoUrl}/${agendamento.id}`;
    return this.http.put<IAgendamento>(url, agendamento, { headers: headers })
      .pipe(
        tap(() => console.log('updateAgendamento: ' + agendamento.id)),
        map(() => agendamento),
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

  private initializeAgendamento(): IAgendamento {
    // Return an initialized object
    return {
      id: 0,
      usuario: null,
      data_hora_agendamento: null,
      atendimento: null,
      id_atendimento: null
    };
  }

}