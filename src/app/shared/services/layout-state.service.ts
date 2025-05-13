// src/app/shared/services/layout-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  private mobileViewSubject = new BehaviorSubject<boolean>(window.innerWidth < 768);
  mobileView$ = this.mobileViewSubject.asObservable();

  constructor() {
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.mobileViewSubject.next(window.innerWidth < 768);
    });
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(isOpen: boolean): void {
    this.sidebarOpenSubject.next(isOpen);
  }
}
