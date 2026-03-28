import { Component, Input, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-restricao-alimentar',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './restricao-alimentar.component.html',
    styleUrl: './restricao-alimentar.component.css'
})
export class RestricaoAlimentarComponent implements OnChanges {
    @Input() control!: AbstractControl | null;
    @Input() opcoes: any[] = [];

    dropdownAberto = false;
    termoBusca: string = '';
    opcoesFiltradas: any[] = [];

    constructor(private eRef: ElementRef) { }

    // quando receber as opções da API, alimenta a lista filtrada
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['opcoes']) {
            this.opcoesFiltradas = [...this.opcoes];
        }
    }

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.dropdownAberto = false;
        }
    }

    get labelRestricao() {
        const val = this.control?.value || [];
        if (val.length === 0) return 'Buscar restrições alimentares...';

        return this.opcoes
            .filter(op => val.includes(op.value))
            .map(op => op.label)
            .join(', ');
    }

    isInvalid(): boolean {
        return !!this.control && this.control.invalid && (this.control.touched || this.control.dirty);
    }

    buscar(event?: Event): void {
        if (event) {
            event.stopPropagation();
        }

        this.dropdownAberto = true;

        // Se o campo estiver vazio, mostra todas as opções
        if (!this.termoBusca || this.termoBusca.trim() === '') {
            this.opcoesFiltradas = [...this.opcoes];
            return;
        }

        const termoNormalizado = this.removerAcentos(this.termoBusca.toLowerCase().trim());

        this.opcoesFiltradas = this.opcoes.filter(op => {
            const labelNormalizado = this.removerAcentos(op.label.toLowerCase());

            return labelNormalizado.startsWith(termoNormalizado) ||
                labelNormalizado.includes(' ' + termoNormalizado);
        });
    }

    removerAcentos(texto: string): string {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    selecionarOpcao(valor: string | number, event: Event): void {
        event.stopPropagation();

        const valoresAtuais = this.control?.value || [];
        const index = valoresAtuais.indexOf(valor);

        if (index > -1) {
            valoresAtuais.splice(index, 1); // remove
        } else {
            valoresAtuais.push(valor); // adiciona
        }

        this.control?.setValue([...valoresAtuais]);
        this.control?.markAsTouched();
    }
}