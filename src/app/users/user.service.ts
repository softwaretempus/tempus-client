import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IUser } from './user'

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

  // getUser(id: number): Observable<IUser | undefined> {
  //   return this.getUsers().pipe(
  //     map((users: IUser[]) => users.find(p => p.id === id))
  //   );
  // }

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

  //
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
        tap(() => console.log('updateUser: ' + user.id)),
        // Return the user on an update
        map(() => user),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private initializeUser(): IUser {
    // Return an initialized object
    return {
      id: 0,
      nome: null,
      endereco: null,
      email: null,
      status: null,
      cpf: null,
      perfil: null
    };
  }

}