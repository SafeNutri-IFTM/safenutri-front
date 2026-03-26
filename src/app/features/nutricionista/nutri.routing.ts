import { Routes } from '@angular/router';

import { CadastroNutriComponent } from './cadastro-nutri/cadastro-nutri.component';

export const NutriRoutes: Routes = [
    {
        path: 'register',
        component: CadastroNutriComponent
    }
];