import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserInput } from '../../../interfaces/input/userInput';
import { LoginService } from '../../login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlUser = `${environment.api}/user`;
  private urlGenero = `${environment.api}/genero`;
  private urlRestricao = `${environment.api}/restricao-alimentar`;
   private urlReceita = `${environment.api}/receita`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

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

  createReceita(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.loginService.obterToken()
    });
    return this.http.post<any>(this.urlReceita, payload, {headers: headers});
  }
}