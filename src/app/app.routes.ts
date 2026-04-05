import { Routes } from '@angular/router';
import { authGuard } from './guards/login-guard.service'; // Ajuste o caminho se necessário

export const routes: Routes = [
  {
    // Tela inicial do site (Pública)
    path: '',
    loadComponent: () => import('./features/home/home-page/home-page.component').then(c => c.HomeComponent),
    pathMatch: 'full'
  },
  {
    // Rota de Login/Autenticação (Pública)
    path: '',
    loadChildren: () => import('./features/authentication/authentication.routing').then(m => m.AuthRoutes)
  },
  {
    // Área do Usuário (Protegida)
    path: 'user',
    canActivate: [authGuard], // 🔒 Bloqueia o acesso se não tiver token
    loadChildren: () => import('./features/user/user.routing').then(m => m.UserRoutes)
  },
  {
    // Área do Nutricionista (Protegida)
    path: 'nutri',
    canActivate: [authGuard], // 🔒 Bloqueia o acesso se não tiver token
    loadChildren: () => import('./features/nutricionista/nutri.routing').then(m => m.NutriRoutes)
  },
  {
    // Rota coringa para links quebrados
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];