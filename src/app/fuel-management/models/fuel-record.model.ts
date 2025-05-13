import { FuelType } from './fuel-type.enum';

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: Date;
  fuelType: FuelType;
  quantity: number;
  cost: number;
  currentOdometer: number;
  stationName?: string;
  location?: string;
  invoiceNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface FuelRecordDTO {
  id: string;
  vehicleId: string;
  date: string; // ISO string para la API
  fuelType: string;
  quantity: number;
  cost: number;
  currentOdometer: number;
  stationName?: string;
  location?: string;
  invoiceNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string; // ISO string para la API
  updatedAt?: string; // ISO string para la API
}
