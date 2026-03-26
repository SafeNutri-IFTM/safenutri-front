import { Component, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
    public loadService = inject(LoadingService);

    constructor() {
        this.loadService.loading$
            .pipe(takeUntilDestroyed())
            .subscribe((loading: boolean) => {
                if (loading) {
                    this.removeFocus();
                }
            });
    }

    removeFocus() {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
            activeElement.blur();
        }
    }
}