import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from '../features/login/services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  if (loginService.isLogin()) {
    return true;
  }

  // Se cair aqui, significa que isLogin() retornou false. Antes de expulsar, tentamos limpar resquícios para evitar loops.
  loginService.logout();

  // Redireciona para o login passando a URL que o usuário tentou acessar. Desse jeito, após o login, podemos mandá-lo de volta para onde ele queria.
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });

  return false;
};