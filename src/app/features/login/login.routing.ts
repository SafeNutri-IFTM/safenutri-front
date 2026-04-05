import { Routes } from '@angular/router';

import { LoginUserNutriComponent } from './login-user-nutri/login-user-nutri.component';

export const UserRoutes: Routes = [
    {
        path: 'user/login',
        component: LoginUserNutriComponent
    },
    // {
    //     path: 'login/cms',
    //     component: LoginCmsComponent
    // },
];