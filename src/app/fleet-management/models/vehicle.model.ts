import { VehicleType, VehicleStatus } from './vehicle-type.enum';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  loadCapacity: number;
  tankCapacity: number;
  status: VehicleStatus;
  currentMileage: number;
  lastMaintenance?: Date;
  active: boolean;
}

export interface VehicleDTO {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: string; // Tipo como string para API
  loadCapacity: number;
  tankCapacity: number;
  status: string; // Estado como string para API
  currentMileage: number;
  lastMaintenance?: string; // Fecha como string para API
  active: boolean;
}
