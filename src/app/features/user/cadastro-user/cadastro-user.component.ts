import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';

@Component({
    selector: 'app-cadastro-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
        NavbarLoginComponent,
        FooterComponent
    ],
    templateUrl: './cadastro-user.component.html',
    styleUrl: './cadastro-user.component.css'
})
export class CadastroUserComponent {

}