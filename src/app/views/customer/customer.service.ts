import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { ICustomer } from './Customer'


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customersUrl = 'http://localhost:3000/cliente'

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(this.customersUrl)
      .pipe(
        tap(data => console.log('Customers: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getCustomer(id: number): Observable<ICustomer> {
    if (id === 0) {
      return of(this.initializeCustomer());
    }
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<ICustomer>(url)
      .pipe(
        tap(data => console.log('Customer: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createCustomer(customer: ICustomer): Observable<ICustomer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    customer.id = null;
    return this.http.post<ICustomer>(this.customersUrl, customer, { headers: headers })
      .pipe(
        tap(data => console.log('createCustomer: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteCustomer(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.customersUrl}/${id}`;
    return this.http.delete<ICustomer>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteCustomer: ' + id)),
        catchError(this.handleError)
      );
  }

  updateCustomer(customer: ICustomer): Observable<ICustomer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.customersUrl}/${customer.id}`;
    return this.http.put<ICustomer>(url, customer, { headers: headers })
      .pipe(
        tap(() => console.log('updateCustomer: ' + customer)),
        map(() => customer),
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

  private initializeCustomer(): ICustomer {
    // Return an initialized object
    return {
      id: 0,
      nome: null,
      endereco: null,
      telefone: null,
      email: null,
      status: null,
      razao_social: null,
      cnpj: null,
      nome_responsavel: null,
    };
  }

}