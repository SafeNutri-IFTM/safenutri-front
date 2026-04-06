import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ButtonPrimaryComponent } from '../../../components/button-primary/button-primary.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        RouterModule,
        NavbarComponent,
        FooterComponent,
        ButtonPrimaryComponent
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css'
})
export class HomeComponent {

}