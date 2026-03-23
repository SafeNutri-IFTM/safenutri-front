import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { roles } from '../../../const/roles';
import { NutricionistaService } from '../services/nutri.service';
import { UserService } from '../../user/services/user.service';
import { NutricionistaInput } from '../../../interfaces/input/NutricionistaInput';
import { NotifierService } from '../../../services/notifier.service';

@Component({
    selector: 'app-cadastro-nutricionista',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NavbarLoginComponent,
        FooterComponent
    ],
    templateUrl: './cadastro-nutri.component.html',
    styles: [`
        input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; -webkit-appearance: none !important; }
        input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none !important; }
    `]
})
export class CadastroNutriComponent implements OnInit {
    nutriForm: FormGroup;
    hidePassword = true;

    dropdownCrn = false;
    dropdownGenero = false;

    opcoesCrn = [
        { label: 'CRN-1 (DF, GO, MT, TO)', value: 'CRN1' },
        { label: 'CRN-2 (RS)', value: 'CRN2' },
        { label: 'CRN-3 (SP, MS)', value: 'CRN3' },
        { label: 'CRN-4 (ES, RJ)', value: 'CRN4' },
        { label: 'CRN-5 (BA, SE)', value: 'CRN5' },
        { label: 'CRN-6 (AL, PB, PE, RN)', value: 'CRN6' },
        { label: 'CRN-7 (AC, AM, AP, PA, RO, RR)', value: 'CRN7' },
        { label: 'CRN-8 (PR)', value: 'CRN8' },
        { label: 'CRN-9 (MG)', value: 'CRN9' },
        { label: 'CRN-10 (SC)', value: 'CRN10' },
        { label: 'CRN-11 (CE, MA, PI)', value: 'CRN11' },
    ];

    opcoesGenero: any[] = []; // Agora inicia vazio para ser preenchido pela API

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private nutricionistaService: NutricionistaService,
        private userService: UserService, // Injetado para buscar os gêneros
        private notifier: NotifierService
    ) {
        this.nutriForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required]],
            dataNascimento: ['', Validators.required],
            crnEstado: ['', Validators.required],
            crnNumero: ['', Validators.required],
            genero: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Busca os gêneros da API para pegar o ID correto (Ex: 1) ao invés da string
        this.userService.getGeneros().subscribe({
            next: (generos: any) => {
                this.opcoesGenero = generos.map((g: any) => ({
                    label: g.genero, 
                    value: g.id
                }));
            },
            error: (err) => console.error('Erro ao carregar gêneros', err)
        });
    }

    get labelCrn() {
        const val = this.nutriForm.get('crnEstado')?.value;
        return this.opcoesCrn.find(op => op.value === val)?.label || 'CRN (Estado)';
    }

    get labelGenero() {
        const val = this.nutriForm.get('genero')?.value;
        return this.opcoesGenero.find(op => op.value === val)?.label || 'Gênero';
    }

    toggleDropdown(tipo: string, event: Event): void {
        event.stopPropagation();
        if (tipo === 'crn') {
            this.dropdownCrn = !this.dropdownCrn;
            this.dropdownGenero = false;
        } else if (tipo === 'genero') {
            this.dropdownGenero = !this.dropdownGenero;
            this.dropdownCrn = false;
        }
    }

    fecharDropdowns(): void {
        this.dropdownCrn = false;
        this.dropdownGenero = false;
    }

    // Adicionado "| number" para aceitar o ID numérico do gênero
    selecionarOpcao(campo: string, valor: string | number, event: Event): void {
        event.stopPropagation();
        this.nutriForm.get(campo)?.setValue(valor);
        this.fecharDropdowns();
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    irParaCliente(): void {
        this.router.navigate(['/user/register']);
    }

    save(): void {
        if (this.nutriForm.valid) {
            const formValues = this.nutriForm.value;

            const payload = new NutricionistaInput({
                userInput: {
                    nome: formValues.nome,
                    email: formValues.email,
                    senha: formValues.senha,
                    dtNascimento: formValues.dataNascimento,
                    genero: formValues.genero,
                    role: roles.ID_NUTRICIONISTA
                },
                CRN: formValues.crnEstado,
                inscricao: formValues.crnNumero
            });

            this.nutricionistaService.create(payload).subscribe({
                next: () => {
                    this.notifier.showSuccess("Nutricionista cadastrado com sucesso!");
                    this.router.navigate(['/login']);
                },
                error: (erro) => {
                    console.error('Erro ao cadastrar nutricionista', erro);
                    this.notifier.showError("Erro ao cadastrar: Verifique os dados ou o CRN.");
                }
            });

        } else {
            this.nutriForm.markAllAsTouched();
        }
    }
}