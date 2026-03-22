import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserInput } from '../../../interfaces/input/UserInput';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private UrlUser = `${environment.api}/user`;

  constructor(private http: HttpClient) {}

  create(UserInput: UserInput): Observable<any> {
    return this.http.post<any>(this.UrlUser, UserInput);
  }
}