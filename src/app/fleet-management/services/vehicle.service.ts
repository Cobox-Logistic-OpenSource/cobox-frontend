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

  // Los métodos de mapeo y manejo de errores se mantienen igual
  private mapToVehicle(dto: any): Vehicle {
    return {
      id: dto.id,
      plate: dto.plate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      type: dto.type as VehicleType,
      loadCapacity: dto.loadCapacity,
      tankCapacity: dto.tankCapacity,
      status: dto.status as VehicleStatus,
      currentMileage: dto.currentMileage,
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
      lastMaintenance: vehicle.lastMaintenance?.toISOString(),
      active: vehicle.active
    };
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
