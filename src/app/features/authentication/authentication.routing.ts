import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
    {
        path: '',
        redirectTo: 'user-nutri',
        pathMatch: 'full'
    },
    {
        path: 'user/login',
        loadComponent: () =>
            import('../login/login-user-nutri/login-user-nutri.component')
                .then(c => c.LoginUserNutriComponent)
    },
    //   {
    //     path: 'cms/login',
    //     loadComponent: () => 
    //       import('./login/login-cms/login-cms.component')
    //         .then(c => c.LoginCmsComponent)
    //   }
];