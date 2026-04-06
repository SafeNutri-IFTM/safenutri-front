import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NutricionistaInput } from '../../../interfaces/input/nutricionistaInput';
import { LoginService } from '../../login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class NutricionistaService {
  private UrlNutri = `${environment.api}/nutricionista`;
  private urlRestricao = `${environment.api}/restricao-alimentar`;
  private urlReceita = `${environment.api}/receita`;
  private urlTipoReceita = `${environment.api}/tipo-receita`;

  constructor(
    private http: HttpClient, 
    private loginService: LoginService
  ) { }

  create(NutriInput: NutricionistaInput): Observable<any> {
    return this.http.post<any>(this.UrlNutri, NutriInput);
  }

  getTipoReceita(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.loginService.obterToken()
    });
    return this.http.get<any[]>(this.urlTipoReceita, {headers: headers});
  }

  createRestricao(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.loginService.obterToken()
    });
    return this.http.post<any>(this.urlRestricao, payload, {headers: headers});
  }

  createReceita(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.loginService.obterToken()
    });
    return this.http.post<any>(this.urlReceita, payload, {headers: headers});
  }
}