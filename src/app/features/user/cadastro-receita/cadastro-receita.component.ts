import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Importamos o Router aqui
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RestricaoAlimentarComponent } from '../../../components/restricao-alimentar/restricao-alimentar.component';

@Component({
  selector: 'app-cadastro-receita',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NavbarLoginComponent, 
    FooterComponent, 
    RestricaoAlimentarComponent
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
  receitaForm!: FormGroup;

  // 2. Injetamos o Router no construtor (e removemos o Location)
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.receitaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      restricao: [[]],
      calorias: ['', Validators.required],
      ingredientes: this.fb.array([this.criarIngrediente()]),
      passos: this.fb.array([this.criarPasso()])
    });
  }

  // === MÉTODO PARA VOLTAR DIRETO PARA A TELA INICIAL ===
  voltar(): void {
    // Aqui usamos '/' que geralmente é a rota inicial do Angular. 
    // Se a sua rota de home tiver outro nome, basta mudar para ['/home'], por exemplo.
    this.router.navigate(['/']); 
  }

  // === VALIDAÇÕES ===
  isInvalid(campo: string): boolean {
    const control = this.receitaForm.get(campo);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  isFieldInvalidInArray(arrayName: string, index: number, fieldName: string): boolean {
    const array = this.receitaForm.get(arrayName) as FormArray;
    const control = array.at(index).get(fieldName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  salvar(): void {
    if (this.receitaForm.valid) {
      console.log('Formulário válido! Pronto para enviar para a API:', this.receitaForm.value);
    } else {
      this.receitaForm.markAllAsTouched();
    }
  }

  // === MÉTODOS PARA INGREDIENTES ===
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
  }

  decrementarQuantidade(index: number): void {
    const controle = this.ingredientes.at(index).get('quantidade');
    const valorAtual = Number(controle?.value) || 0;
    if (valorAtual > 0) {
      controle?.setValue(valorAtual - 1);
    }
  }

  // === MÉTODOS PARA PASSOS ===
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