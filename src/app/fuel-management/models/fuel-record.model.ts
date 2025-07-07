// fuel-record.model.ts
import { FuelType } from './fuel-type.enum';

export interface FuelRecord {
  id: string;  // Changed from number to string
  vehicleId: number;
  vehiclePlate: string;
  date: Date;
  fuelType: FuelType;
  quantity: number;
  totalCost: number;
  currentMileage: number;
  station: string;
  location: string;
  invoiceNumber: string;
  notes: string;
  // Calculated fields
  previousMileage?: number;
  distance?: number;
  efficiency?: number;
}

export interface FuelRecordDTO {
  id: string;  // Changed from number to string
  vehicleId: number;
  vehiclePlate: string;
  date: string; // ISO string
  fuelType: string;
  quantity: number;
  totalCost: number;
  currentMileage: number;
  station: string;
  location: string;
  invoiceNumber: string;
  notes: string;
}

export interface FuelRecordFilter {
  startDate?: Date;
  endDate?: Date;
  vehiclePlate?: string;
  vehicleId?: number;
}
