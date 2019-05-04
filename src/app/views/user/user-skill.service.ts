import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { IUserSkill } from './UserSkill';
import { IUser } from './User';
import { ISkill } from '../skill/Skill';


@Injectable({
  providedIn: 'root'
})
export class UserSkillService {

  private usersUrl = 'http://localhost:3000/usuario'

  constructor(private http: HttpClient) { }

  getUserSkills(id: number): Observable<IUserSkill[]> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.usersUrl}/${id}/habilidade`;
    return this.http.get<IUserSkill[]>(url)
      .pipe(
        tap(data => console.log('getUserSkills: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  associateUserSkill(user: IUser, skill: ISkill, nivel: number): Observable<IUserSkill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}/habilidade`;
    const usk = { usuario: user, habilidade: skill, nivel: nivel }
    
    return this.http.post<IUserSkill>(url, usk, { headers: headers })
      .pipe(
        tap(data => console.log('associateUserSkill: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  associateUserSkills(user: IUser, skills: any[]): Observable<IUserSkill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}/habilidades`;
    const usk = { usuario: user, habilidades: skills }
    
    return this.http.post<IUserSkill>(url, usk, { headers: headers })
      .pipe(
        tap(data => console.log('associateUserSkill: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteUserSkill(user: IUser, skill: ISkill): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}/habilidade/${skill.id}`;
    return this.http.delete<IUserSkill>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteUser: ' + user.id)),
        catchError(this.handleError)
      );
  }

  deleteUserSkills(user: IUser): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}/habilidades`;
    return this.http.delete<IUserSkill>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteUserSkills: ' + user.id)),
        catchError(this.handleError)
      );
  }

  updateUserSkill(user: IUser, skill: ISkill, nivel: number): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}/habilidade/${skill.id}`;
    const usk = { usuario: user, habilidade: skill, nivel: nivel }
    //console.log(url)
    //console.log(user)
    //console.log({headers: headers})
    return this.http.put<IUser>(url, usk, { headers: headers })
      .pipe(
        tap(() => console.log('updateUser: ' + user.id)),
        map(() => user),
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

  private initializeUser(): IUserSkill[] {
    // Return an initialized object
    return [];
  }

}