// fuel-record.model.ts
import { FuelType } from './fuel-type.enum';

export interface FuelRecord {
  id: number;
  vehicleId: number;
  vehiclePlate?: string;
  date: Date;
  fuelType: FuelType;
  quantity: number;
  totalCost: number;
  currentMileage: number;
  station?: string;
  location?: string;
  invoiceNumber?: string;
  notes?: string;
  // Campos calculados
  previousMileage?: number;
  distance?: number;
  efficiency?: number;
}

export interface FuelRecordDTO {
  id: number;
  vehicleId: number;
  vehiclePlate?: string;
  date: string; // ISO string
  fuelType: string;
  quantity: number;
  totalCost: number;
  currentMileage: number;
  station?: string;
  location?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface FuelRecordFilter {
  startDate?: Date;
  endDate?: Date;
  vehiclePlate?: string;
  vehicleId?: number;
}
