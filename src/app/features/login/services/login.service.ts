import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Claims } from '../../../interfaces/dto/claims';
import { LoginInput } from '../../../interfaces/input/loginInput';
import { Token } from '../../../interfaces/dto/token';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private cachedClaims: Claims | null = null;
    private cachedToken: string | null = null;

    login(login: LoginInput) {
        return this.http.post<Token>(`${environment.api}/auth/login`, login);
    }

    obterToken(): string | null {
        return sessionStorage.getItem('token');
    }

    salvarToken(token: string) {
        sessionStorage.setItem('token', token);
    }

    obterClaimsJwt(): Claims | null {
        const token = this.obterToken();
        if (!token) {
            this.limparCache();
            return null;
        }

        if (this.cachedClaims && this.cachedToken === token) {
            return this.cachedClaims;
        }

        try {
            const claims = jwtDecode<Claims>(token);
            this.cachedClaims = claims;
            this.cachedToken = token;
            return claims;
        } catch {
            this.logout();
            return null;
        }
    }

    verificarTokenNoServidor(): Observable<boolean> {
        return this.http.post<boolean>(`${environment.api}/auth/verify-token`, {});
    }

    isLogin(): boolean {
        const token = this.obterToken();

        if (!token || token === 'null' || token === 'undefined') {
            return false;
        }

        try {
            const claims = jwtDecode<Claims>(token);

            if (claims.exp && (claims.exp * 1000 < Date.now())) {
                console.warn('Token expirado. Limpando sessão...');
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token inválido ou corrompido.', error);
            this.logout();
            return false;
        }
    }

    logout() {
        this.limparCache();

        sessionStorage.clear();

        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach((name) => caches.delete(name));
            });
        }

        this.router.navigate(['/user/login']);
    }

    private limparCache() {
        this.cachedClaims = null;
        this.cachedToken = null;
    }
}