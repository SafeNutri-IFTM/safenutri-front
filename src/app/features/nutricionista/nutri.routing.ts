import { Routes } from '@angular/router';
import { authGuard } from '../../guards/login-guard.service';

import { CadastroNutriComponent } from './cadastro-nutri/cadastro-nutri.component';
import { FeedNutriComponent } from './feed/feed-nutri.component';
import { CadastroRestricaoNutriComponent } from './cadastro-restricao/cadastro-restricao-nutri.component';
import { CadastroReceitaNutriComponent } from './cadastro-receita/cadastro-receita-nutri.component';

export const NutriRoutes: Routes = [
    {
        path: 'register',
        component: CadastroNutriComponent
    },
    {
        path: 'cadastro-receita',
        component: CadastroReceitaNutriComponent,
        canActivate: [authGuard],
    },
    {
        path: 'cadastro-restricao',
        component: CadastroRestricaoNutriComponent,
        canActivate: [authGuard],
    },
    {
        path: 'feed',
        component: FeedNutriComponent,
        canActivate: [authGuard],
    }
];