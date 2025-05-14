// src/app/shared/components/header/header.component.ts
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <mat-toolbar color="primary">
      <div class="logo">
        <img src="assets/images/logo.png" alt="Co-Box Logistics" height="40">
        <span>Co-Box Logistics</span>
      </div>
      <div class="nav-links">
        <a mat-button routerLink="/fleet" routerLinkActive="active">
          <mat-icon>directions_car</mat-icon>
          Gestión de Flota
        </a>
        <a mat-button routerLink="/fuel" routerLinkActive="active">
          <mat-icon>local_gas_station</mat-icon>
          Combustible
        </a>
        <a mat-button routerLink="/mileage" routerLinkActive="active">
          <mat-icon>speed</mat-icon>
          Kilometraje
        </a>
      </div>
      <div class="user-menu">
        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="User menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Perfil</span>
          </button>
          <button mat-menu-item>
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-links {
      display: flex;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class HeaderComponent {}
