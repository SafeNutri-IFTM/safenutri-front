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
import { LoadingService } from '../../../services/loading.service';
import { finalize } from 'rxjs';
import { NutricionistaService } from '../services/nutri.service';

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
  templateUrl: './cadastro-receita-nutri.component.html',
  styleUrl: './cadastro-receita-nutri.component.css',
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
export class CadastroReceitaNutriComponent implements OnInit {

  // === VARIÁVEIS GERAIS ===
  receitaForm!: FormGroup;

  // === VARIÁVEIS DO DROPDOWN (TIPO DE RECEITA) ===
  dropdownTipo = false;
  opcoesTipo: { label: string, value: string }[] = [];

  selectedFile: File | null = null;
  imagePreview!: string | null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private loadingService: LoadingService,
    private nutriService: NutricionistaService,
  ) { }

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

    this.buscarOpcoes();
  }

  buscarOpcoes(): void {
    this.nutriService.getTipoReceita().subscribe({
      next: (res: any) => {
        this.opcoesTipo = res.map((r: any) => ({
          label: r.tipoReceita,
          value: r.id
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar tipo de Receita', err);
      }
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

      // === ATIVA O LOADING AQUI ===
      this.loadingService.show();

      this.selectedFile = file;
      this.receitaForm.patchValue({ imagem: file.name });
      this.receitaForm.get('imagem')?.updateValueAndValidity();

      // Preview da imagem
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.loadingService.hide();
      };

      // Adiciona um tratamento de erro só para garantir que o loading não fique travado na tela
      reader.onerror = () => {
        this.loadingService.hide();
        this.notifier.showError("Erro ao carregar a pré-visualização da imagem.");
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
      this.notifier.showError("Insira uma imagem");
      return null;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      initialQuality: 0.8,
    };

    try {
      const file = this.selectedFile;
      const compressedFile = await imageCompression(file, options);
      return compressedFile;

    } catch (error) {
      this.notifier.showError("Erro ao processar a imagem. Tente outro arquivo.");
      return null;
    }
  }

  async save(): Promise<void> {
    if (this.receitaForm.valid) {
      const formValues = this.receitaForm.value;
      const formData = new FormData();

      const receitaData = {
        tipoReceitaId: formValues.tipoReceita,
        titulo: formValues.titulo,
        descricao: formValues.descricao,
        tempoPreparo: formValues.tempoPreparo,
        porcao: formValues.porcoes,
        calorias: formValues.calorias,
        restricoes: formValues.restricao || [],
        ingredientes: formValues.ingredientes,
        passos: formValues.passos
      };

      formData.append('receita', new Blob([JSON.stringify(receitaData)], { type: 'application/json' }));

      const imagemCompressed = await this.redimensionarImagem()
      if (imagemCompressed) {
        formData.append('imagem', imagemCompressed);
      } else {
        return;
      }

      this.loadingService.show();

      this.nutriService.createReceita(formData)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe({
          next: (resposta) => {
            this.notifier.showSuccess("Receita cadastrada com sucesso!");
            this.router.navigate(['/nutri/feed']);
          },
          error: (erro) => {
            console.error('Erro ao cadastrar receita', erro);

            const mensagemBackend = erro?.error?.message || erro?.error || "Erro ao cadastrar receita. Verifique os dados.";

            this.notifier.showError(mensagemBackend);
          }
        });

    } else {
      this.receitaForm.markAllAsTouched();
    }
  }
}