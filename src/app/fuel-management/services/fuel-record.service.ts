// fuel-record.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FuelRecord, FuelRecordDTO, FuelRecordFilter } from '../models/fuel-record.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuelRecordService {
  private apiUrl = `${environment.apiUrl}/fuel-records`;

  constructor(private http: HttpClient) {}

  /**
   * Get all fuel records with optional filtering
   */
  getRecords(filter?: FuelRecordFilter): Observable<FuelRecord[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) {
        params = params.set('startDate', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params = params.set('endDate', filter.endDate.toISOString());
      }
      if (filter.vehiclePlate) {
        params = params.set('vehiclePlate', filter.vehiclePlate);
      }
      if (filter.vehicleId) {
        params = params.set('vehicleId', filter.vehicleId.toString());
      }
    }

    return this.http.get<FuelRecordDTO[]>(this.apiUrl, { params })
      .pipe(
        map(records => records.map(record => this.mapToFuelRecord(record)))
      );
  }

  /**
   * Get a specific fuel record by ID
   */
  getRecordById(id: number): Observable<FuelRecord> {
    return this.http.get<FuelRecordDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        map(record => this.mapToFuelRecord(record))
      );
  }

  /**
   * Create a new fuel record
   */
  createRecord(record: FuelRecord): Observable<FuelRecord> {
    const recordDTO = this.mapToFuelRecordDTO(record);
    return this.http.post<FuelRecordDTO>(this.apiUrl, recordDTO)
      .pipe(
        map(response => this.mapToFuelRecord(response))
      );
  }

  /**
   * Update an existing fuel record
   */
  updateRecord(id: number, record: FuelRecord): Observable<FuelRecord> {
    const recordDTO = this.mapToFuelRecordDTO(record);
    return this.http.put<FuelRecordDTO>(`${this.apiUrl}/${id}`, recordDTO)
      .pipe(
        map(response => this.mapToFuelRecord(response))
      );
  }

  /**
   * Delete a fuel record
   */
  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Calculate fuel efficiency if possible
   */
  calculateEfficiency(record: FuelRecord, previousRecord?: FuelRecord): number | undefined {
    if (!previousRecord || !record.currentMileage || !previousRecord.currentMileage) {
      return undefined;
    }

    const distance = record.currentMileage - previousRecord.currentMileage;
    if (distance <= 0 || !record.quantity) {
      return undefined;
    }

    // Calculate kilometers per liter
    return parseFloat((distance / record.quantity).toFixed(2));
  }

  /**
   * Map DTO from API to FuelRecord model
   */
  private mapToFuelRecord(dto: FuelRecordDTO): FuelRecord {
    return {
      id: dto.id,
      vehicleId: dto.vehicleId,
      vehiclePlate: dto.vehiclePlate,
      date: new Date(dto.date),
      fuelType: dto.fuelType as any, // Convert string to enum
      quantity: dto.quantity,
      totalCost: dto.totalCost,
      currentMileage: dto.currentMileage,
      station: dto.station,
      location: dto.location,
      invoiceNumber: dto.invoiceNumber,
      notes: dto.notes
    };
  }

  /**
   * Map FuelRecord model to DTO for API
   */
  private mapToFuelRecordDTO(record: FuelRecord): FuelRecordDTO {
    return {
      id: record.id,
      vehicleId: record.vehicleId,
      vehiclePlate: record.vehiclePlate,
      date: record.date.toISOString(),
      fuelType: record.fuelType.toString(),
      quantity: record.quantity,
      totalCost: record.totalCost,
      currentMileage: record.currentMileage,
      station: record.station,
      location: record.location,
      invoiceNumber: record.invoiceNumber,
      notes: record.notes
    };
  }
}
