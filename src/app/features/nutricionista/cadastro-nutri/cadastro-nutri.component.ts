import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';

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
export class CadastroNutriComponent {
    nutriForm: FormGroup;
    hidePassword = true;

    dropdownCrn = false;
    dropdownGenero = false;

    opcoesCrn = [
        { label: 'CRN-1 (DF, GO, MT, TO)', value: 'CRN1' },
        { label: 'CRN-3 (SP, MS)', value: 'CRN3' },
        { label: 'CRN-9 (MG)', value: 'CRN9' }
    ];

    opcoesGenero = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' },
        { label: 'Outro', value: 'OUTRO' }
    ];

    @ViewChild('datePicker_nutri') datePicker_nutri!: ElementRef;

    constructor(private fb: FormBuilder, private router: Router) {
        this.nutriForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            dataNascimento: ['', Validators.required],
            crnEstado: ['', Validators.required],
            crnNumero: ['', Validators.required],
            genero: ['', Validators.required]
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

    selecionarOpcao(campo: string, valor: string, event: Event): void {
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

    onSubmit(): void {
        if (this.nutriForm.valid) {
            console.log('Payload Cadastro Nutricionista:', this.nutriForm.value);
        } else {
            this.nutriForm.markAllAsTouched();
        }
    }
}