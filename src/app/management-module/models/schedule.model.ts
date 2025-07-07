export interface Schedule {
  id: string;
  scheduleDate: string;
  serviceDate: string;
  origin: string;
  destination: string;
  driver: string;
  plate: string;
  departureTime: string;
  finalCost: number;
}

export interface ScheduleFilter {
  id?: string;
  plate?: string;
  startDate?: string;
  endDate?: string;
}