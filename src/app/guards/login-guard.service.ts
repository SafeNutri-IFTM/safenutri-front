import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Ajuste o caminho de importação para onde o seu LoginService real está localizado agora
import { LoginService } from '../features/login/services/login.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {

  // No Angular moderno, usamos inject() em vez de declarar no construtor
  const loginService = inject(LoginService);
  const router = inject(Router);

  // 1. Verifica localmente se existe um token
  if (!loginService.isLogin()) {
    loginService.logout();
    router.navigate(['/auth/login']); // Redireciona o usuário para o login
    return of(false);
  }

  // 2. Valida o token no backend (sua rota /auth/verify-token)
  return loginService.verificarTokenNoServidor().pipe(
    map((isValid: boolean) => {
      if (isValid) {
        return true; // Token válido, acesso liberado!
      } else {
        loginService.logout();
        router.navigate(['/auth/login']);
        return false; // Token inválido, bloqueia
      }
    }),
    catchError(() => {
      // Se a API retornar erro (ex: 401 Unauthorized ou servidor fora do ar)
      loginService.logout();
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};