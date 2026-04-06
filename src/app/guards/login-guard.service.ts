import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../features/login/services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // 1. O usuário está logado? (Tem um token válido?)
  if (!loginService.isLogin()) {
    return router.createUrlTree(['/user/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // 2. A rota exige alguma role específica?
  const expectedRole = route.data?.['role'];

  if (expectedRole) {
    const claims = loginService.obterClaimsJwt();

    if (claims && claims.role !== expectedRole) {
      console.warn(`Acesso negado! O usuário não tem a role: ${expectedRole}`);

      // Redireciona para o feed correto baseado na role real do usuário
      if (claims.role === 'USER') {
        return router.createUrlTree(['/user/feed']);
      }
      else if (claims.role === 'NUTRI') { // Lembre-se de checar se o nome exato é NUTRI, ROLE_NUTRI, etc.
        return router.createUrlTree(['/nutri/feed']);
      }
      else {
        // Fallback caso a role seja desconhecida
        return router.createUrlTree(['/']);
      }
    }
  }

  // Se passou na verificação de login E na verificação de role, pode entrar!
  return true;
};