import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';
import { LoginService } from '../services/login.service';
import { LoginInput } from '../../../interfaces/input/loginInput';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { NotifierService } from '../../../services/notifier.service';

@Component({
    selector: 'app-login-user-nutri',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
        FooterComponent,
        ButtonPrimaryComponent,
        SpinnerComponent,
        NavbarLoginComponent
    ],
    templateUrl: './login-user-nutri.component.html',
    styleUrl: './login-user-nutri.component.css'
})
export class LoginUserNutriComponent implements OnInit {
    private fb = inject(FormBuilder);
    private loginService = inject(LoginService);
    private router = inject(Router);
    private notifier = inject(NotifierService);


    loginForm!: FormGroup;
    showPasswordToggle = false;
    loading = false;

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

    efetuarLogin() {
        if (this.loginForm.invalid) {
            alert('Por favor, preencha os campos corretamente.');
            return;
        }

        this.loading = true;
        const dadosLogin: LoginInput = this.loginForm.value;

        this.loginService.login(dadosLogin).subscribe({
            next: (res) => {
                this.notifier.showSuccess('Login realizado com sucesso!');

                this.loginService.salvarToken(res.token);

                const claims = this.loginService.obterClaimsJwt();
                if (claims) {
                    this.redirecionarPorRole(claims.role);
                }
            },
            error: (err) => {
                this.loading = false;
                this.notifier.showError('Email ou senha incorretos.');
            }
        });
    }

    private redirecionarPorRole(role: string) {
        if (role === 'ADMIN') {
            this.router.navigate(['/cms/dashboard']);
        } else if (role === 'NUTRICIONISTA') {
            this.router.navigate(['/user/home']);
        } else {
            this.router.navigate(['/user/cadastro-receita']);
        }
    }

    togglePassword() {
        this.showPasswordToggle = !this.showPasswordToggle;
    }
}