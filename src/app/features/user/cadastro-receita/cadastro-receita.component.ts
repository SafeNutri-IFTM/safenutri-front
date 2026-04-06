import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import imageCompression from 'browser-image-compression';

// Componentes
import { NavbarLoginComponent } from '../../../components/navbar-login/navbar-login.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RestricaoAlimentarComponent } from '../../../components/restricao-alimentar/restricao-alimentar.component';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';
import { ButtonSecundaryComponent } from '../../../components/button-secundary/button-secundary.component';
import { NotifierService } from '../../../services/notifier.service';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { ReceitaInput } from '../../../interfaces/input/receitaInput';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../services/user.service';
import { finalize } from 'rxjs';

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
    ButtonSecundaryComponent,
    SpinnerComponent,
    FormsModule
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

  selectedFile: File | null = null;
  imagePreview!: string | null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private notifier: NotifierService,
    private loadingService: LoadingService,
    private userService: UserService,
  ) {}

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

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      // Validar tipo de arquivo
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!validTypes.includes(file.type)) {
        this.notifier.showWarning(
          'Formato de imagem não suportado. Use JPG, PNG, GIF ou WEBP.',
        );
        return;
      }

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.notifier.showWarning('Imagem muito grande. Tamanho máximo: 5MB');
        return;
      }

      this.selectedFile = file;
      this.receitaForm.patchValue({ imagem: file.name });
      this.receitaForm.get('imagem')?.updateValueAndValidity();

      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changeImage() {
    this.removeImage();
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.receitaForm.get('imagem')?.updateValueAndValidity();
  }

  async redimensionarImagem(): Promise<File | null> {
    if (!this.selectedFile) {
      this.notifier.showWarning('Selecione uma imagem antes de enviar.');
      return null;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      initialQuality: 0.8,
    };

    const file = this.selectedFile;
    const compressedFile = await imageCompression(file, options);

    return compressedFile;
  }

  save(): void {
    if (this.receitaForm.valid) {
      const formValues = this.receitaForm.value;

      const formData = new FormData();
      const imagemCompressed = this.redimensionarImagem()

      formData.append("tipoReceitaId", formValues.tipoReceita,)
      formData.append("titulo", formValues.titulo,)
      formData.append("descricao", formValues.descricao,)
      formData.append("tempoPreparo", formValues.tempoPreparo,)
      formData.append("porcao", formValues.porcao,)
      formData.append("calorias", formValues.calorias,)
      formData.append("imagem", imagemCompressed.toString())
      formData.append("restricoes", formValues.restricoes,)

      this.loadingService.show();

      this.userService.createReceita(formData)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe({
          next: (resposta) => {
            this.notifier.showSuccess("Usuário cadastrado com sucesso!");
            this.router.navigate(['/user/login']);
          },
          error: (erro) => {
            console.error('Erro ao cadastrar usuário', erro);
      
            const mensagemBackend = erro?.error?.message || erro?.error || "Erro ao cadastrar usuário. Verifique os dados.";
      
            this.notifier.showError(mensagemBackend);
          }
        });

    } else {
      this.receitaForm.markAllAsTouched();
    }
  }
}