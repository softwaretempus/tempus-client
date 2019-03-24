import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'

import { ISkill } from './Skill'


@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private skillsUrl = 'http://localhost:3000/habilidade'

  constructor(private http: HttpClient) { }

  getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(this.skillsUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      )
  }

  getSkill(id: number): Observable<ISkill> {
    if (id === 0) {
      return of(this.initializeSkill());
    }
    const url = `${this.skillsUrl}/${id}`;
    return this.http.get<ISkill>(url)
      .pipe(
        tap(data => console.log('getSkill: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createSkill(skill: ISkill): Observable<ISkill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    skill.id = null;
    return this.http.post<ISkill>(this.skillsUrl, skill, { headers: headers })
      .pipe(
        tap(data => console.log('createSkill: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteSkill(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.skillsUrl}/${id}`;
    return this.http.delete<ISkill>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteSkill: ' + id)),
        catchError(this.handleError)
      );
  }

  updateSkill(skill: ISkill): Observable<ISkill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.skillsUrl}/${skill.id}`;
    console.log(url)
    console.log(skill)
    console.log({headers: headers})
    return this.http.put<ISkill>(url, skill, { headers: headers })
      .pipe(
        tap(() => console.log('updateSkill: ' + skill.id)),
        map(() => skill),
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

  private initializeSkill(): ISkill {
    // Return an initialized object
    return {
      id: 0,
      nome: null,
      descricao: null
    };
  }

}