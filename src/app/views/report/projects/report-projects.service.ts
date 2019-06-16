import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IReportProjects } from './ReportProjects'


@Injectable({
  providedIn: 'root'
})
export class ReportProjectsService {

  private reportsUrl = 'http://localhost:3000/relatorio/projeto'

  constructor(private http: HttpClient) { }

  getReports(data_inicio: string, data_fim: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.reportsUrl}/${data_inicio}/${data_fim}`;
    console.log(url)
    return this.http.get<any>(url)
      .pipe(
        tap(data => console.log('Reports: ' + JSON.stringify(data))),
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

  private initializeReport(): IReportProjects {
    // Return an initialized object
    return {
      id: 0,
      data_inicio: null,
      data_fim: null,
    };
  }

}