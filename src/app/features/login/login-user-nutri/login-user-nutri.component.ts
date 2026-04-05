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

@Component({
    selector: 'app-login-user-nutri',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
        NavbarComponent,
        FooterComponent,
        // ButtonPrimaryComponent
    ],
    templateUrl: './login-user-nutri.component.html',
    styleUrl: './login-user-nutri.component.css'
})
export class LoginUserNutriComponent implements OnInit {
    // Injeções modernas
    private fb = inject(FormBuilder);
    private loginService = inject(LoginService);
    private router = inject(Router);

    loginForm!: FormGroup;
    showPasswordToggle = false;
    loading = false;

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
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
                // 1. Salva o token no LocalStorage
                this.loginService.salvarToken(res.token);

                // 2. Pega as Claims para saber quem logou (User ou Nutri)
                const claims = this.loginService.obterClaimsJwt();

                if (claims) {
                    this.redirecionarPorRole(claims.role);
                }

                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                console.error('Erro no login', err);
                alert('E-mail ou senha incorretos.');
            }
        });
    }

    private redirecionarPorRole(role: string) {
        // Lógica de redirecionamento inteligente
        if (role === 'ADMIN') {
            this.router.navigate(['/cms/dashboard']);
        } else if (role === 'NUTRICIONISTA') {
            this.router.navigate(['/nutri/home']);
        } else {
            // Padrão para USER
            this.router.navigate(['/user/home']);
        }
    }

    togglePassword() {
        this.showPasswordToggle = !this.showPasswordToggle;
    }
}