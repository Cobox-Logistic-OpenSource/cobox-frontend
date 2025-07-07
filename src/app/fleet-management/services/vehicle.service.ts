// src/app/fleet-management/services/vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { VehicleType, VehicleStatus } from '../models/vehicle-type.enum';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(vehicles => vehicles.map(vehicle => this.mapToVehicle(vehicle))),
      catchError(this.handleError)
    );
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(vehicle => this.mapToVehicle(vehicle)),
      catchError(this.handleError)
    );
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const vehicleDTO = this.mapToVehicleDTO(vehicle);
    return this.http.post<any>(this.apiUrl, vehicleDTO).pipe(
      map(response => this.mapToVehicle(response)),
      catchError(this.handleError)
    );
  }

  updateVehicle(id: string, vehicle: Vehicle): Observable<Vehicle> {
    const vehicleDTO = this.mapToVehicleDTO(vehicle);
    return this.http.put<any>(`${this.apiUrl}/${id}`, vehicleDTO).pipe(
      map(response => this.mapToVehicle(response)),
      catchError(this.handleError)
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateVehicleStatus(id: string, status: VehicleStatus): Observable<Vehicle> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { status: status.toString() }).pipe(
      map(response => this.mapToVehicle(response)),
      catchError(this.handleError)
    );
  }

  // MÉTODOS DE MAPEO CORREGIDOS
  private mapToVehicle(dto: any): Vehicle {
    return {
      id: dto.id,
      plate: dto.plate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      type: dto.type as VehicleType,
      loadCapacity: dto.loadCapacity || 0,
      tankCapacity: dto.tankCapacity || 0,
      status: dto.status as VehicleStatus,
      currentMileage: dto.currentMileage || 0,
      lastMaintenance: dto.lastMaintenance ? new Date(dto.lastMaintenance) : undefined,
      active: dto.active
    };
  }

  private mapToVehicleDTO(vehicle: Vehicle): any {
    return {
      id: vehicle.id,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type.toString(),
      loadCapacity: vehicle.loadCapacity,
      tankCapacity: vehicle.tankCapacity,
      status: vehicle.status.toString(),
      currentMileage: vehicle.currentMileage,
      // ✅ FORMATO CORREGIDO: Sin Z y sin milisegundos
      lastMaintenance: vehicle.lastMaintenance ? this.formatDateForBackend(vehicle.lastMaintenance) : null,
      active: vehicle.active
    };
  }

  // ✅ NUEVO MÉTODO: Formato de fecha compatible con Spring Boot
  private formatDateForBackend(date: Date): string {
    // Formato: yyyy-MM-ddTHH:mm:ss (sin Z, sin milisegundos)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}