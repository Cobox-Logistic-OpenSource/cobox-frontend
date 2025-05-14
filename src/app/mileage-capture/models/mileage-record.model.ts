export enum MileagePurpose {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  MAINTENANCE = 'MAINTENANCE',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER'
}

export interface MileageRecord {
  id: string;
  vehicleId: string;
  date: Date;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  purpose: MileagePurpose;
  driverId?: string;
  route?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MileageRecordDTO {
  id: string;
  vehicleId: string;
  date: string; // ISO string para la API
  startOdometer: number;
  endOdometer: number;
  distance: number;
  purpose: string;
  driverId?: string;
  route?: string;
  notes?: string;
  createdBy: string;
  createdAt: string; // ISO string para la API
  updatedAt?: string; // ISO string para la API
}
