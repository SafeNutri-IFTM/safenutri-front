import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentosLegaisService {
    private UrlDocumentos = `${environment.api}/public/documentos-legais`;

    constructor(private http: HttpClient) { }

    getAtualPorTipo(tipo: string): Observable<any> {
        const params = new HttpParams().set('tipo', tipo);
        return this.http.get<any>(`${this.UrlDocumentos}/atual`, { params });
    }
}