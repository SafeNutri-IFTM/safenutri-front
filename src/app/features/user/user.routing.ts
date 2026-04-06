import { Routes } from '@angular/router';
import { CadastroUserComponent } from './cadastro-user/cadastro-user.component';
import { CadastroRestricaoComponent } from './cadastro-restricao/cadastro-restricao.component';
import { CadastroReceitaComponent } from './cadastro-receita/cadastro-receita.component';
import { authGuard } from '../../guards/login-guard.service';
import { FeedUserComponent } from './feed/feed-user.component';

export const UserRoutes: Routes = [
    {
        path: 'register',
        component: CadastroUserComponent
    },
    {
        path: 'cadastro-receita',
        component: CadastroReceitaComponent,
        canActivate: [authGuard],
    },
    {
        path: 'cadastro-restricao',
        component: CadastroRestricaoComponent,
        canActivate: [authGuard],
    },
    {
        path: 'feed',
        component: FeedUserComponent,
        canActivate: [authGuard],
    }
];