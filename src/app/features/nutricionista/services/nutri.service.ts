import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NutricionistaInput } from '../../../interfaces/input/NutricionistaInput';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private UrlNutri = `${environment.api}/nutri`;

  constructor(private http: HttpClient) { }

  create(NutriInput: NutricionistaInput): Observable<any> {
    return this.http.post<any>(this.UrlNutri, NutriInput);
  }
}