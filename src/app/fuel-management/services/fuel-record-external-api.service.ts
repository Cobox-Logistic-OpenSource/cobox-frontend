import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FuelRecord, FuelRecordFilter } from '../models/fuel-record.model';
import { FuelRecordMapper } from '../mappers/fuel-record.mapper';

@Injectable({
  providedIn: 'root'
})
export class FuelRecordExternalApiService {
  private apiUrl = 'api/fuelRecords';

  constructor(private http: HttpClient) {}

  /**
   * Get all fuel records with optional filtering
   */
  getAll(filter?: FuelRecordFilter): Observable<FuelRecord[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) {
        params = params.set('date_gte', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params = params.set('date_lte', filter.endDate.toISOString());
      }
      if (filter.vehiclePlate) {
        params = params.set('vehiclePlate', filter.vehiclePlate);
      }
    }

    return this.http.get<any[]>(this.apiUrl, { params })
      .pipe(
        map(records => records.map(record => FuelRecordMapper.toFuelRecord(record)))
      );
  }

  /**
   * Get a specific fuel record by ID
   */
  getById(id: number): Observable<FuelRecord> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(record => FuelRecordMapper.toFuelRecord(record))
      );
  }

  /**
   * Get fuel records for a specific vehicle
   */
  getByVehicleId(vehicleId: number): Observable<FuelRecord[]> {
    const params = new HttpParams().set('vehicleId', vehicleId.toString());

    return this.http.get<any[]>(this.apiUrl, { params })
      .pipe(
        map(records => records.map(record => FuelRecordMapper.toFuelRecord(record)))
      );
  }

  /**
   * Create a new fuel record
   */
  create(record: FuelRecord): Observable<FuelRecord> {
    const apiRecord = FuelRecordMapper.toApiRequest(record);

    return this.http.post<any>(this.apiUrl, apiRecord)
      .pipe(
        map(record => FuelRecordMapper.toFuelRecord(record))
      );
  }

  /**
   * Update an existing fuel record
   */
  update(record: FuelRecord): Observable<FuelRecord> {
    const apiRecord = FuelRecordMapper.toApiRequest(record);

    return this.http.put<any>(`${this.apiUrl}/${record.id}`, apiRecord)
      .pipe(
        map(record => FuelRecordMapper.toFuelRecord(record))
      );
  }

  /**
   * Delete a fuel record
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
