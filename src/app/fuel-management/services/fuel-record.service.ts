// fuel-record.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, map, catchError, throwError} from 'rxjs';
import { FuelRecord, FuelRecordDTO, FuelRecordFilter } from '../models/fuel-record.model';
import { environment } from '../../environments/environment';
import { FuelUiService } from './fuel-ui.service';
import { FuelType } from '../models/fuel-type.enum';

@Injectable({
  providedIn: 'root'
})
export class FuelRecordService {
  private apiUrl = `${environment.apiUrl}/fuel-records`;

  constructor(
    private http: HttpClient,
    private uiService: FuelUiService
  ) {}

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
        map(records => records.map(record => this.mapToFuelRecord(record))),
        map(records => this.calculateEfficiencies(records)),
        catchError(error => {
          this.uiService.showError('Error al cargar los registros');
          return throwError(() => error);
        })
      );
  }

  /**
   * Get records for a specific vehicle with efficiency calculations
   */
  getRecordsByVehicleId(vehicleId: number): Observable<FuelRecord[]> {
    const params = new HttpParams().set('vehicleId', vehicleId.toString());

    return this.http.get<FuelRecordDTO[]>(this.apiUrl, { params })
      .pipe(
        map(records => records.map(record => this.mapToFuelRecord(record))),
        map(records => this.calculateEfficiencies(records)),
        catchError(error => {
          this.uiService.showError('Error al cargar los registros del vehículo');
          return throwError(() => error);
        })
      );
  }


  /**
   * Get a specific fuel record by ID
   */
  getRecordById(id: string): Observable<FuelRecord> {  // Changed from number to string
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<FuelRecordDTO>(url).pipe(
      map(record => this.mapToFuelRecord(record)),
      catchError(error => {
        console.error(`Error fetching record with ID ${id}:`, error);
        this.uiService.showError(`Error al cargar el registro #${id}`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get vehicle records with calculated statistics
   * Renamed from getVehicleRecordsWithStats to fix the "unused method" warning
   */
  getVehicleStats(vehicleId: number): Observable<{
    records: FuelRecord[],
    averageEfficiency: number,
    totalCost: number,
    totalQuantity: number
  }> {
    return this.getRecordsByVehicleId(vehicleId).pipe(
      map(records => {
        // Calculate statistics
        const enhancedRecords = this.calculateEfficiencies(records);

        const validEfficiencyRecords = enhancedRecords.filter(r => r.efficiency !== undefined);
        const totalEfficiency = validEfficiencyRecords.reduce(
          (sum, record) => sum + (record.efficiency || 0), 0
        );
        const averageEfficiency = validEfficiencyRecords.length > 0
          ? totalEfficiency / validEfficiencyRecords.length
          : 0;

        const totalCost = enhancedRecords.reduce((sum, record) => sum + record.totalCost, 0);
        const totalQuantity = enhancedRecords.reduce((sum, record) => sum + record.quantity, 0);

        return {
          records: enhancedRecords,
          averageEfficiency: parseFloat(averageEfficiency.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalQuantity: parseFloat(totalQuantity.toFixed(2))
        };
      })
    );
  }

  /**
   * Create a new fuel record
   */
  // En fuel-record.service.ts
  createRecord(record: any): Observable<FuelRecord> {
    // Crea una copia y elimina el id si existe
    const recordDTO = { ...record };
    delete recordDTO.id;

    // Si la fecha es un objeto Date, conviértela a string
    if (recordDTO.date instanceof Date) {
      recordDTO.date = recordDTO.date.toISOString();
    }

    return this.http.post<FuelRecordDTO>(this.apiUrl, recordDTO)
      .pipe(
        map(response => this.mapToFuelRecord(response)),
        catchError(error => {
          this.uiService.showError('Error al crear el registro');
          return throwError(() => error);
        })
      );
  }

  /**
   * Update an existing fuel record
   */
  updateRecord(id: string, record: FuelRecord): Observable<FuelRecord> {  // Changed from number to string
    const recordDTO = this.mapToFuelRecordDTO(record);
    return this.http.put<FuelRecordDTO>(`${this.apiUrl}/${id}`, recordDTO)
      .pipe(
        map(response => this.mapToFuelRecord(response)),
        catchError(error => {
          this.uiService.showError('Error al actualizar el registro');
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a fuel record
   */
  deleteRecord(id: string): Observable<void> {  // Changed from number to string
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          this.uiService.showError('Error al eliminar el registro');
          return throwError(() => error);
        })
      );
  }

  /**
   * Process array of records and calculate efficiency for each
   */
  private calculateEfficiencies(records: FuelRecord[]): FuelRecord[] {
    if (!records || records.length === 0) {
      return [];
    }

    // Group records by vehicle
    const vehicleRecords: { [key: number]: FuelRecord[] } = {};
    records.forEach(record => {
      if (!vehicleRecords[record.vehicleId]) {
        vehicleRecords[record.vehicleId] = [];
      }
      vehicleRecords[record.vehicleId].push(record);
    });

    // Calculate efficiency for each vehicle's records
    const enhancedRecords: FuelRecord[] = [];

    Object.values(vehicleRecords).forEach(vehicleGroup => {
      // Sort by date (oldest first) for calculation
      vehicleGroup.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Process each record with knowledge of the previous one
      for (let i = 0; i < vehicleGroup.length; i++) {
        const currentRecord = vehicleGroup[i];
        const previousRecord = i > 0 ? vehicleGroup[i - 1] : undefined;

        if (previousRecord && currentRecord.currentMileage && previousRecord.currentMileage) {
          const distance = currentRecord.currentMileage - previousRecord.currentMileage;

          enhancedRecords.push({
            ...currentRecord,
            previousMileage: previousRecord.currentMileage,
            distance: distance > 0 ? distance : undefined,
            efficiency: this.calculateEfficiency(currentRecord, previousRecord)
          });
        } else {
          enhancedRecords.push(currentRecord);
        }
      }
    });

    // Sort by date (newest first) for display
    enhancedRecords.sort((a, b) => b.date.getTime() - a.date.getTime());

    return enhancedRecords;
  }

  /**
   * Calculate fuel efficiency if possible
   */
  private calculateEfficiency(record: FuelRecord, previousRecord?: FuelRecord): number | undefined {
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
      fuelType: dto.fuelType as FuelType,
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
