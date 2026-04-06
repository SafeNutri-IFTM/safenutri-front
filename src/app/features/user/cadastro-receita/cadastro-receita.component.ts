import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 

// Componentes
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RestricaoAlimentarComponent } from '../../../components/restricao-alimentar/restricao-alimentar.component';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';
import { ButtonSecundaryComponent } from '../../../components/button-secundary/button-secundary.component';

@Component({
  selector: 'app-cadastro-receita',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NavbarLoginComponent, 
    FooterComponent, 
    RestricaoAlimentarComponent,
    ButtonPrimaryComponent,
    ButtonSecundaryComponent
  ],
  templateUrl: './cadastro-receita.component.html',
  styleUrl: './cadastro-receita.component.css',
  styles: [`
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  `]
})
export class CadastroReceitaComponent implements OnInit {
  
  // === VARIÁVEIS GERAIS ===
  receitaForm!: FormGroup;

  // === VARIÁVEIS DO DROPDOWN (TIPO DE RECEITA) ===
  dropdownTipo = false;
  opcoesTipo = [
    { label: 'Salgada', value: 'SALGADA' },
    { label: 'Doce', value: 'DOCE' },
    { label: 'Agridoce', value: 'AGRIDOCE' },
    { label: 'Molho', value: 'MOLHO' },
    { label: 'Bebida', value: 'BEBIDA' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.receitaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      tipoReceita: ['', Validators.required],
      porcoes: ['', [Validators.required, Validators.min(1)]],
      tempoPreparo: ['', Validators.required],     
      restricao: [[]],
      calorias: ['', Validators.required],
      ingredientes: this.fb.array([this.criarIngrediente()]),
      passos: this.fb.array([this.criarPasso()])
    });
  }

  // ==========================================
  //      MÉTODOS DE CONTROLE DO FORMULÁRIO
  // ==========================================

  salvar(): void {
    if (this.receitaForm.valid) {
      console.log('Formulário válido! Pronto para enviar para a API:', this.receitaForm.value);
    } else {
      this.receitaForm.markAllAsTouched();
    }
  }

  voltar(): void {
    this.router.navigate(['/']); 
  }

  isInvalid(campo: string): boolean {
    const control = this.receitaForm.get(campo);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  isFieldInvalidInArray(arrayName: string, index: number, fieldName: string): boolean {
    const array = this.receitaForm.get(arrayName) as FormArray;
    const control = array.at(index).get(fieldName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  // ==========================================
  //      MÉTODOS DO DROPDOWN (TIPO DE RECEITA)
  // ==========================================

  get labelTipo() {
    const val = this.receitaForm.get('tipoReceita')?.value;
    return this.opcoesTipo.find(op => op.value === val)?.label || 'Tipo';
  }

  toggleDropdownTipo(event: Event): void {
    event.stopPropagation();
    this.dropdownTipo = !this.dropdownTipo;
  }

  fecharDropdowns(): void {
    this.dropdownTipo = false;
  }

  selecionarOpcaoTipo(valor: string, event: Event): void {
    event.stopPropagation();
    const controle = this.receitaForm.get('tipoReceita');
    controle?.setValue(valor);
    controle?.markAsTouched();
    this.fecharDropdowns();
  }

  // ==========================================
  //      MÉTODOS DE PORÇÕES
  // ==========================================

  incrementarPorcao(): void {
    const controle = this.receitaForm.get('porcoes');
    const valorAtual = Number(controle?.value) || 0;
    controle?.setValue(valorAtual + 1);
    
    // Força a validação visual
    controle?.markAsTouched();
    controle?.markAsDirty();
  }

  decrementarPorcao(): void {
    const controle = this.receitaForm.get('porcoes');
    const valorAtual = Number(controle?.value) || 0;
    if (valorAtual > 0) {
      controle?.setValue(valorAtual - 1);
    }
    
    // Força a validação visual
    controle?.markAsTouched();
    controle?.markAsDirty();
  }

  // ==========================================
  //      MÉTODOS DE INGREDIENTES
  // ==========================================

  get ingredientes(): FormArray {
    return this.receitaForm.get('ingredientes') as FormArray;
  }

  criarIngrediente(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      unidade: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(1)]]
    });
  }

  adicionarIngrediente(): void {
    this.ingredientes.push(this.criarIngrediente());
  }

  removerIngrediente(index: number): void {
    if (this.ingredientes.length > 1) {
      this.ingredientes.removeAt(index);
    }
  }

  incrementarQuantidade(index: number): void {
    const controle = this.ingredientes.at(index).get('quantidade');
    const valorAtual = Number(controle?.value) || 0;
    controle?.setValue(valorAtual + 1);
    
    // Força a validação visual
    controle?.markAsTouched();
    controle?.markAsDirty();
  }

  decrementarQuantidade(index: number): void {
    const controle = this.ingredientes.at(index).get('quantidade');
    const valorAtual = Number(controle?.value) || 0;
    if (valorAtual > 0) {
      controle?.setValue(valorAtual - 1);
    }
    
    // Força a validação visual
    controle?.markAsTouched();
    controle?.markAsDirty();
  }

  // ==========================================
  //      MÉTODOS DE PASSOS DE PREPARO
  // ==========================================

  get passos(): FormArray {
    return this.receitaForm.get('passos') as FormArray;
  }

  criarPasso(): FormGroup {
    return this.fb.group({
      tituloEtapa: ['', Validators.required],
      descricaoEtapa: ['', Validators.required]
    });
  }

  adicionarPasso(): void {
    this.passos.push(this.criarPasso());
  }

  removerPasso(index: number): void {
    if (this.passos.length > 1) {
      this.passos.removeAt(index);
    }
  }
}