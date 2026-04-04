import { Routes } from '@angular/router';
import { CadastroUserComponent } from './cadastro-user/cadastro-user.component';
import { CadastroRestricaoComponent } from './cadastro-restricao/cadastro-restricao.component'; // Certifique-se que o nome aqui bate com a classe acima

export const UserRoutes: Routes = [
    {
        path: 'register',
        component: CadastroUserComponent
    },
    {
        path: 'restricoes',
        component: CadastroRestricaoComponent // Esta linha deve funcionar agora
    }
];