// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Header principal -->
    <header class="main-header">
      <div class="container-fluid d-flex">
        <a routerLink="/" class="navbar-brand">
          <i class="bi bi-building me-1"></i>Cobox-Logistic
        </a>

        <div class="navbar-nav me-auto">
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/servicios" routerLinkActive="active">
              <i class="bi bi-gear-fill me-1"></i> Servicios
            </a>
          </div>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/mileage" routerLinkActive="active">
              <i class="bi bi-speedometer2 me-1"></i> Kilometraje
            </a>
          </div>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/fleet" routerLinkActive="active">
              <i class="bi bi-truck me-1"></i> Flota
            </a>
          </div>

          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/registros" routerLinkActive="active">
              <i class="bi bi-journal-text me-1"></i> Registros
            </a>
          </div>

          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/gestion" routerLinkActive="active">
              <i class="bi bi-sliders me-1"></i> Gestión
            </a>
          </div>

          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" routerLink="/usuarios" routerLinkActive="active">
              <i class="bi bi-people-fill me-1"></i> Usuarios
            </a>
          </div>
        </div>

        <div class="navbar-nav">
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle">
              <i class="bi bi-person-circle me-1"></i> Administrador Sistema
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-header {
      background-color: #0d6efd;
      padding: 0.5rem 1rem;
      color: white;
    }

    .navbar-brand {
      color: white;
      font-weight: 500;
      font-size: 1.25rem;
      text-decoration: none;
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      padding: 0.5rem 1rem;
      text-decoration: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .nav-link:hover, .nav-link{
      color: white;
    }

    .dropdown-toggle::after {
      display: inline-block;
      margin-left: 0.255em;
      vertical-align: 0.255em;
      content: "";
      border-top: 0.3em solid;
      border-right: 0.3em solid transparent;
      border-bottom: 0;
      border-left: 0.3em solid transparent;
    }

    .container-fluid {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }

    .d-flex {
      display: flex;
      align-items: center;
    }

    .navbar-nav {
      display: flex;
      flex-direction: row;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
    }

    .nav-item {
      margin-right: 0.5rem;
    }

    .me-auto {
      margin-right: auto;
    }

    .me-1 {
      margin-right: 0.25rem;
    }

    main {
      padding: 0;
    }
  `]
})
export class AppComponent {
  title = 'co-box-logistic-frontend';
}
