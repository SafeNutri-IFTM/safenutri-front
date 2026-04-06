import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-feed',
  standalone: true,
    imports: [
        CommonModule
    ],
  templateUrl: './navbar-feed.component.html'
})
export class NavbarFeedComponent {
  isMenuOpen: boolean = false; 

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}