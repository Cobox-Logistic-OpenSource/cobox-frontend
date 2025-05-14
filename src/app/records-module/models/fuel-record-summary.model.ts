export interface FuelRecordSummary {
  serviceId: string;
  totalRecords: number;
  initialDate: string;
  finalDate: string;
  totalFuel: number;
  plates: string;
}

export interface FuelRecordFilter {
  serviceId?: string;
  plate?: string;
  startDate?: string;
  endDate?: string;
}