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

  private initializeCustomer(): ICustomer {
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
      razao_social: null,
      cnpj: null,
      nome_responsavel: null,
    };
  }

}