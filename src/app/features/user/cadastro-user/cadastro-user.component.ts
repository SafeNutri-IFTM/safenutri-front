import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { UserService } from '../services/user.service';
import { UserInput } from '../../../interfaces/input/UserInput';
import { NotifierService } from '../../../services/notifier.service';
import { LoadingService } from '../../../services/loading.service';
import { roles } from '../../../const/roles';
import { RestricaoAlimentarComponent } from '../../../components/restricao-alimentar/restricao-alimentar.component';

@Component({
    selector: 'app-cadastro-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NavbarLoginComponent,
        FooterComponent,
        SpinnerComponent,
        RestricaoAlimentarComponent,
    ],
    templateUrl: './cadastro-user.component.html',
    styles: [`
        input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; -webkit-appearance: none !important; }
        input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none !important; }
    `]
})
export class CadastroUserComponent implements OnInit {
    userForm: FormGroup;
    hidePassword = true;

    dropdownGenero = false;

    opcoesRestricao: any[] = [];
    opcoesGenero: any[] = [];

    @ViewChild('datePicker') datePicker!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private notifier: NotifierService,
        private loadingService: LoadingService
    ) {
        this.userForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(5)]],
            dataNascimento: ['', Validators.required],
            restricaoAlimentar: [[], Validators.required],
            genero: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        forkJoin({
            generos: this.userService.getGeneros(),
            restricoes: this.userService.getRestricao()
        }).subscribe({
            next: (retorno: any) => {
                this.opcoesGenero = retorno.generos.map((g: any) => ({
                    label: g.genero,
                    value: g.id
                }));

                this.opcoesRestricao = retorno.restricoes.map((r: any) => ({
                    label: r.restricao,
                    value: r.id
                }));
            },
            error: (err) => {
                console.error('Erro ao carregar dados de domínio', err);
            }
        });
    }

    isInvalid(campo: string): boolean {
        const control = this.userForm.get(campo);
        return control ? control.invalid && (control.touched || control.dirty) : false;
    }

    get labelGenero() {
        const val = this.userForm.get('genero')?.value;
        return this.opcoesGenero.find(op => op.value === val)?.label || 'Gênero';
    }

    toggleDropdown(tipo: string, event: Event): void {
        event.stopPropagation();
        if (tipo === 'genero') {
            this.dropdownGenero = !this.dropdownGenero;
        }
    }

    fecharDropdowns(): void {
        this.dropdownGenero = false;
    }

    selecionarOpcao(campo: string, valor: string | number, event: Event): void {
        event.stopPropagation();
        const controle = this.userForm.get(campo);

        controle?.setValue(valor);
        controle?.markAsTouched();
        this.fecharDropdowns();
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    irParaNutricionista(): void {
        this.router.navigate(['/nutri/register']);
    }

    save(): void {
        if (this.userForm.valid) {
            const formValues = this.userForm.value;

            const payload = new UserInput({
                nome: formValues.nome,
                email: formValues.email,
                senha: formValues.senha,
                dtNascimento: formValues.dataNascimento,
                genero: formValues.genero,
                restricoes: formValues.restricaoAlimentar,
                role: roles.ID_USER
            });

            this.loadingService.show();

            this.userService.create(payload)
                .pipe(finalize(() => this.loadingService.hide()))
                .subscribe({
                    next: (resposta) => {
                        this.notifier.showSuccess("Usuário cadastrado com sucesso!");
                        this.router.navigate(['/login']);
                    },
                    error: (erro) => {
                        console.error('Erro ao cadastrar usuário', erro);

                        const mensagemBackend = erro?.error?.message || erro?.error || "Erro ao cadastrar usuário. Verifique os dados.";

                        this.notifier.showError(mensagemBackend);
                    }
                });

        } else {
            this.userForm.markAllAsTouched();
        }
    }
}