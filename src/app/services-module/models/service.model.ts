export interface Service {
  id: string;
  date: string;
  route: string;
  driver: string;
  plate: string;
  departureTime: string;
  status: ServiceStatus;
}

export enum ServiceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}