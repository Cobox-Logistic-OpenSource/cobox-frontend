// src/app/fleet-management/services/vehicle-ui.service.ts
import { Injectable } from '@angular/core';
import { VehicleType, VehicleStatus } from '../models/vehicle-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VehicleUIService {

  getStatusClass(status: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'status-available';
      case VehicleStatus.IN_ROUTE:
        return 'status-in-route';
      case VehicleStatus.IN_MAINTENANCE:
        return 'status-maintenance';
      case VehicleStatus.OUT_OF_SERVICE:
        return 'status-out-of-service';
      default:
        return '';
    }
  }

  getVehicleTypeLabel(type: VehicleType): string {
    switch (type) {
      case VehicleType.TRUCK:
        return 'Camión';
      case VehicleType.VAN:
        return 'Furgoneta';
      case VehicleType.REFRIGERATED:
        return 'Refrigerado';
      case VehicleType.PICKUP:
        return 'Pickup';
      default:
        return String(type);
    }
  }

  getVehicleStatusLabel(status: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'Disponible';
      case VehicleStatus.IN_ROUTE:
        return 'En Ruta';
      case VehicleStatus.IN_MAINTENANCE:
        return 'En Mantenimiento';
      case VehicleStatus.OUT_OF_SERVICE:
        return 'Fuera de Servicio';
      default:
        return String(status);
    }
  }
}
