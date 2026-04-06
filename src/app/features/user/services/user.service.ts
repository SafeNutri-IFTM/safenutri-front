import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserInput } from '../../../interfaces/input/userInput';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlUser = `${environment.api}/user`;
  private urlGenero = `${environment.api}/genero`;
  private urlRestricao = `${environment.api}/restricao-alimentar`

  constructor(private http: HttpClient) { }

  createUser(userInput: UserInput): Observable<any> {
    return this.http.post<any>(this.urlUser, userInput);
  }

  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(this.urlGenero);
  }

  getRestricoes(): Observable<any[]> {
    return this.http.get<any[]>(this.urlRestricao);
  }

  createRestricao(payload: any): Observable<any> {
    return this.http.post<any>(this.urlRestricao, payload);
  }
}