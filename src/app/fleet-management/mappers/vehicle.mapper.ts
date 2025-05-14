// src/app/fleet-management/mappers/vehicle.mapper.ts
import { Injectable } from '@angular/core';
import { Vehicle, VehicleDTO } from '../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../models/vehicle-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VehicleMapper {
  toDomain(dto: VehicleDTO): Vehicle {
    // Validate enum values
    const vehicleType = this.validateVehicleType(dto.type);
    const vehicleStatus = this.validateVehicleStatus(dto.status);

    return {
      id: dto.id,
      plate: dto.plate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      type: vehicleType,
      loadCapacity: dto.loadCapacity,
      tankCapacity: dto.tankCapacity,
      status: vehicleStatus,
      currentMileage: dto.currentMileage,
      lastMaintenance: dto.lastMaintenance ? new Date(dto.lastMaintenance) : undefined,
      active: dto.active
    };
  }

  toDto(domain: Vehicle): VehicleDTO {
    return {
      id: domain.id,
      plate: domain.plate,
      brand: domain.brand,
      model: domain.model,
      year: domain.year,
      type: domain.type.toString(),
      loadCapacity: domain.loadCapacity,
      tankCapacity: domain.tankCapacity,
      status: domain.status.toString(),
      currentMileage: domain.currentMileage,
      lastMaintenance: domain.lastMaintenance?.toISOString(),
      active: domain.active
    };
  }

  private validateVehicleType(type: string): VehicleType {
    const validTypes = Object.values(VehicleType);
    if (validTypes.includes(type as VehicleType)) {
      return type as VehicleType;
    }
    console.warn(`Invalid vehicle type: ${type}, defaulting to TRUCK`);
    return VehicleType.TRUCK;
  }

  private validateVehicleStatus(status: string): VehicleStatus {
    const validStatuses = Object.values(VehicleStatus);
    if (validStatuses.includes(status as VehicleStatus)) {
      return status as VehicleStatus;
    }
    console.warn(`Invalid vehicle status: ${status}, defaulting to AVAILABLE`);
    return VehicleStatus.AVAILABLE;
  }
}
