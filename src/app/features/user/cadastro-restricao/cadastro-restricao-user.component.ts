import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { UserService } from '../services/user.service';
import { NotifierService } from '../../../services/notifier.service';
import { LoadingService } from '../../../services/loading.service';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';
import { ButtonSecundaryComponent } from '../../../components/button-secundary/button-secundary.component';

@Component({
    selector: 'app-cadastro-restricao',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NavbarLoginComponent,
        FooterComponent,
        SpinnerComponent,
        ButtonPrimaryComponent,
        ButtonSecundaryComponent
    ],
    templateUrl: './cadastro-restricao-user.component.html'
})
export class CadastroRestricaoUserComponent implements OnInit {
    restricaoForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private notifier: NotifierService,
        private loadingService: LoadingService,
        private router: Router
    ) {
        this.restricaoForm = this.fb.group({
            restricao: ['', [Validators.required, Validators.minLength(3)]],
            // Adicionado Validators.required aqui para a validação funcionar
            descricao: ['', Validators.required] 
        });
    }

    ngOnInit(): void { }

    // A função que o Angular estava sentindo falta para pintar as bordas de vermelho
    isInvalid(campo: string): boolean {
        const control = this.restricaoForm.get(campo);
        return control ? control.invalid && (control.touched || control.dirty) : false;
    }

    voltar(): void {
        this.router.navigate(['/']);
    }

    save(): void {
        if (this.restricaoForm.valid) {
            this.loadingService.show();

            const payload = {
                restricao: this.restricaoForm.value.restricao,
                descricao: this.restricaoForm.value.descricao
            };

            this.userService.createRestricao(payload)
                .pipe(finalize(() => this.loadingService.hide()))
                .subscribe({
                    next: () => {
                        this.notifier.showSuccess("Solicitação enviada! Aguarde a aprovação por e-mail.");
                        this.restricaoForm.reset();
                    },
                    error: (erro: any) => {
                        const msg = erro?.error?.message || "Erro ao cadastrar restrição.";
                        this.notifier.showError(msg);
                    }
                });
        } else {
            this.restricaoForm.markAllAsTouched();
        }
    }
}