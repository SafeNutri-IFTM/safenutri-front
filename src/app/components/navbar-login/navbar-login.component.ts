import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './navbar-login.component.html',
    styleUrl: './navbar-login.component.css'
})
export class NavbarLoginComponent {

    get rotaDoLogo(): string {
        const isLogged = !!sessionStorage.getItem('token');

        // Se estiver logado, vai pro feed. Se não, vai pra home
        return isLogged ? '/user/feed' : '/home/home';
    }
}

