export interface User {
  id: number;
  name: string;
  dni: string;
  level: UserLevel;
  createdAt: string;
}

export enum UserLevel {
  CONDUCTOR = 'Conductor',
  ADMINISTRADOR = 'Administrador'
}