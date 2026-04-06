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
    // Pega as informações de dentro do JWT
    const claims = loginService.obterClaimsJwt();

    // ATENÇÃO: Dependendo de como o seu Spring Boot gera o token,
    // a propriedade da role pode se chamar 'role', 'roles', ou 'authorities'.
    // Altere 'claims?.role' abaixo para bater com o nome exato da sua interface Claims.
    if (claims && claims.role !== expectedRole) {
      console.warn(`Acesso negado! O usuário não tem a role: ${expectedRole}`);

      // Se ele não tem permissão, manda ele de volta pra home (ou outra página de erro)
      return router.createUrlTree(['/']);
    }
  }

  // Se passou na verificação de login E na verificação de role, pode entrar!
  return true;
};