import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoginService } from '../../features/login/services/login.service';

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

  // Injeta o serviço de login
  private loginService = inject(LoginService);

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cria a função que o HTML vai chamar
  sair(): void {
    this.loginService.logout();
  }
}