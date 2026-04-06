import { Routes } from '@angular/router';
import { CadastroUserComponent } from './cadastro-user/cadastro-user.component';
import { CadastroRestricaoUserComponent } from './cadastro-restricao/cadastro-restricao-user.component';
import { CadastroReceitaUserComponent } from './cadastro-receita/cadastro-receita-user.component';
import { authGuard } from '../../guards/login-guard.service';
import { FeedUserComponent } from './feed/feed-user.component';

export const UserRoutes: Routes = [
    {
        path: 'register',
        component: CadastroUserComponent
    },
    {
        path: 'cadastro-receita',
        component: CadastroReceitaUserComponent,
        canActivate: [authGuard],
    },
    {
        path: 'cadastro-restricao',
        component: CadastroRestricaoUserComponent,
        canActivate: [authGuard],
    },
    {
        path: 'feed',
        component: FeedUserComponent,
        canActivate: [authGuard],
    }
];