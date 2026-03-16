import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Tela inicial do site
    path: '', 
    loadComponent: () => import('./features/home/home-page/home-page.component').then(c => c.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routing').then(m => m.UserRoutes)
  },
  {
    path: 'nutri',
    loadChildren: () => import('./features/nutricionista/nutri.routing').then(m => m.NutriRoutes)
  },
  {
    // path: '**' é a Rota coringa para links quebrados
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];