// src/app/services-module/components/service-list/service-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service, ServiceStatus } from '../../models/service.model';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe(data => {
      this.services = data;
    });
  }

  startService(service: Service): void {
    const newStatus = service.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
    this.serviceService.updateServiceStatus(service.id, newStatus).subscribe(() => {
      this.loadServices();
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'PENDIENTE';
      case 'IN_PROGRESS': return 'EN PROGRESO';
      case 'COMPLETED': return 'FINALIZADO';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'pending-badge';
      case 'IN_PROGRESS': return 'progress-badge';
      case 'COMPLETED': return 'completed-badge';
      default: return '';
    }
  }
}