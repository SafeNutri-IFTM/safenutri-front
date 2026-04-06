import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';

@Component({
    selector: 'app-documentos-legais-modal',
    standalone: true,
    imports: [
        CommonModule,
        ButtonPrimaryComponent
    ],
    templateUrl: './documentos-legais-modal.component.html',
    styleUrl: './documentos-legais-modal.component.css'
})
export class DocumentosLegaisModalComponent {
    @Input() isOpen: boolean = false;
    @Input() titulo: string = '';
    @Input() texto: string = '';
    @Output() fechar = new EventEmitter<void>();

    onClose() {
        this.fechar.emit();
    }

    formatarTexto(texto: string): string {
        if (!texto) return '';

        return texto
            .replace(/\r\n/g, '\n')
            .replace(/###\s*([^\n]+)/g, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-800">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\*\s+([^\n]+)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br>');
    }
}