import { Routes } from '@angular/router';

import { CadastroUserComponent } from './cadastro-user/cadastro-user.component';

import { CadastroReceitaComponent } from './cadastro-receita/cadastro-receita.component';
import { authGuard } from '../../guards/login-guard.service';

export const UserRoutes: Routes = [
    {
        path: 'register',
        component: CadastroUserComponent
    },
    {
        path: 'cadastro-receita',
        component: CadastroReceitaComponent,
        canActivate: [authGuard]
    }
];