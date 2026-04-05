import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment'; // Ajuste o caminho se necessário
import { Claims } from '../../../interfaces/dto/claims';
import { LoginInput } from '../../../interfaces/input/loginInput';
import { Token } from '../../../interfaces/dto/token';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    // Injeção moderna
    private http = inject(HttpClient);
    private router = inject(Router);

    private cachedClaims: Claims | null = null;
    private cachedToken: string | null = null;

    login(login: LoginInput) {
        return this.http.post<Token>(`${environment.api}/auth/login`, login);
    }

    obterToken(): string | null {
        return localStorage.getItem('token');
    }

    salvarToken(token: string) {
        localStorage.setItem('token', token);
    }

    obterClaimsJwt(): Claims | null {
        const token = this.obterToken();
        if (!token) {
            this.limparCache();
            return null;
        }

        // Retorna do cache se o token for o mesmo
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
        // 💡 Note que tirei os "headers" manuais daqui! O Interceptor vai cuidar disso.
        return this.http.post<boolean>(`${environment.api}/auth/verify-token`, {});
    }

    isLogin(): boolean {
        return this.obterToken() !== null;
    }

    logout() {
        this.limparCache();
        localStorage.clear(); // Limpa tudo do storage

        // Opcional: Limpar caches do navegador (mantive do seu código antigo)
        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach((name) => caches.delete(name));
            });
        }

        // 💡 Forma moderna do Angular de redirecionar sem recarregar a página inteira:
        this.router.navigate(['/auth/login']);
    }

    private limparCache() {
        this.cachedClaims = null;
        this.cachedToken = null;
    }
}