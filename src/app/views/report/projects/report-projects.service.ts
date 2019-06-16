import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IReportProjects } from './ReportProjects'


@Injectable({
  providedIn: 'root'
})
export class ReportProjectsService {

  private reportsUrl = 'http://localhost:3000/relatorio/os'

  constructor(private http: HttpClient) { }

  getReports(status: string, data_inicio: string, data_fim: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.reportsUrl}/${status}/${data_inicio}/${data_fim}`;
    console.log(url)
    return this.http.get<any>(url)
      .pipe(
        tap(data => console.log('Reports: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getReport(id: number): Observable<IReportProjects> {
    if (id === 0) {
      return of(this.initializeReport());
    }
    const url = `${this.reportsUrl}/${id}`;
    return this.http.get<IReportProjects>(url)
      .pipe(
        tap(data => console.log('getReport: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createReport(report: IReportProjects): Observable<IReportProjects> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    report.id = null;
    return this.http.post<IReportProjects>(this.reportsUrl, report, { headers: headers })
      .pipe(
        tap(data => console.log('createReport: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteReport(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.reportsUrl}/${id}`;
    return this.http.delete<IReportProjects>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteReport: ' + id)),
        catchError(this.handleError)
      );
  }

  updateReport(report: IReportProjects): Observable<IReportProjects> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.reportsUrl}/${report.id}`;
    return this.http.put<IReportProjects>(url, report, { headers: headers })
      .pipe(
        tap(() => console.log('updateReport: ' + report.id)),
        map(() => report),
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