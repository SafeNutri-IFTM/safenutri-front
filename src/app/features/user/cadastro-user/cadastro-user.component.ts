import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; 
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';

@Component({
    selector: 'app-cadastro-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NavbarLoginComponent,
        FooterComponent
    ],
    templateUrl: './cadastro-user.component.html',
    styles: [`
        input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; -webkit-appearance: none !important; }
        input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none !important; }
    `]
})
export class CadastroUserComponent {
    userForm: FormGroup;
    hidePassword = true;

    dropdownRestricao = false;
    dropdownGenero = false;

    opcoesRestricao = [
        { label: 'Intolerância à Lactose', value: 'INTOLERANCIA_LACTOSE' },
        { label: 'Doença Celíaca (Sem Glúten)', value: 'CELIACO' },
        { label: 'Alergia a Amendoim', value: 'AMENDOIM' }
    ];

    opcoesGenero = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' },
        { label: 'Outro', value: 'OUTRO' }
    ];

    @ViewChild('datePicker') datePicker!: ElementRef;

    constructor(private fb: FormBuilder, private router: Router) {
        this.userForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            dataNascimento: ['', Validators.required],
            restricaoAlimentar: ['', Validators.required],
            genero: ['', Validators.required]
        });
    }

    get labelRestricao() {
        const val = this.userForm.get('restricaoAlimentar')?.value;
        return this.opcoesRestricao.find(op => op.value === val)?.label || 'Restrição alimentar';
    }

    get labelGenero() {
        const val = this.userForm.get('genero')?.value;
        return this.opcoesGenero.find(op => op.value === val)?.label || 'Gênero';
    }

    // Passamos o Evento para evitar que o clique se espalhe
    toggleDropdown(tipo: string, event: Event): void {
        event.stopPropagation();
        if (tipo === 'restricao') {
            this.dropdownRestricao = !this.dropdownRestricao;
            this.dropdownGenero = false;
        } else if (tipo === 'genero') {
            this.dropdownGenero = !this.dropdownGenero;
            this.dropdownRestricao = false;
        }
    }

    fecharDropdowns(): void {
        this.dropdownRestricao = false;
        this.dropdownGenero = false;
    }

    selecionarOpcao(campo: string, valor: string, event: Event): void {
        event.stopPropagation();
        this.userForm.get(campo)?.setValue(valor);
        this.fecharDropdowns();
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    irParaNutricionista(): void {
        this.router.navigate(['/nutri/register']); 
    }

    onSubmit(): void {
        if (this.userForm.valid) {
            console.log('Payload Cadastro Cliente:', this.userForm.value);
        } else {
            this.userForm.markAllAsTouched();
        }
    }
}