import { Component, Input, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { UserService } from '../../features/user/services/user.service'; 

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
export class RestricaoAlimentarComponent implements OnInit {
    @Input() control!: AbstractControl | null;

    opcoes: any[] = [];
    dropdownAberto = false;
    termoBusca: string = '';
    opcoesFiltradas: any[] = [];

    constructor(
        private eRef: ElementRef,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.buscarOpcoes();
    }

    buscarOpcoes(): void {
        this.userService.getRestricoes().subscribe({
            next: (restricoes: any) => {
                this.opcoes = restricoes.map((r: any) => ({
                    label: r.restricao,
                    value: r.id
                }));
                this.opcoesFiltradas = [...this.opcoes];
            },
            error: (err) => {
                console.error('Erro ao carregar restrições', err);
            }
        });
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