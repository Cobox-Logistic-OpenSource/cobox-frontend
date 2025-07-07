import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MileageRecord, MileageRecordDTO } from '../models/mileage-record.model';
import { MileagePurpose } from '../models/mileage-purpose.enum';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MileageRecordService {
  private apiUrl = `${environment.apiUrl}/mileage-records`;

  constructor(private http: HttpClient) { }

  getMileageRecords(startDate?: string, endDate?: string, vehicleId?: string): Observable<MileageRecord[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.append('startDate', startDate);
    }

    if (endDate) {
      params = params.append('endDate', endDate);
    }

    if (vehicleId) {
      params = params.append('vehicleId', vehicleId);
    }

    return this.http.get<MileageRecordDTO[]>(this.apiUrl, { params }).pipe(
      map(records => records.map(record => this.mapToMileageRecord(record))),
      catchError(this.handleError)
    );
  }

  getMileageRecordById(id: string): Observable<MileageRecord> {
    return this.http.get<MileageRecordDTO>(`${this.apiUrl}/${id}`).pipe(
      map(record => this.mapToMileageRecord(record)),
      catchError(this.handleError)
    );
  }

  createMileageRecord(record: MileageRecord): Observable<MileageRecord> {
    const recordDTO = this.mapToMileageRecordDTO(record);
    return this.http.post<MileageRecordDTO>(this.apiUrl, recordDTO).pipe(
      map(response => this.mapToMileageRecord(response)),
      catchError(this.handleError)
    );
  }

  updateMileageRecord(id: string, record: MileageRecord): Observable<MileageRecord> {
    const recordDTO = this.mapToMileageRecordDTO(record);
    return this.http.put<MileageRecordDTO>(`${this.apiUrl}/${id}`, recordDTO).pipe(
      map(response => this.mapToMileageRecord(response)),
      catchError(this.handleError)
    );
  }

  deleteMileageRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para calcular total de kilometraje por vehículo
  getVehicleTotalMileage(vehicleId: string, startDate?: string, endDate?: string): Observable<number> {
    let params = new HttpParams()
      .append('vehicleId', vehicleId)
      .append('_sort', 'date')
      .append('_order', 'desc');

    if (startDate) {
      params = params.append('startDate', startDate);
    }

    if (endDate) {
      params = params.append('endDate', endDate);
    }

    return this.http.get<MileageRecordDTO[]>(this.apiUrl, { params }).pipe(
      map(records => records.reduce((sum, record) => sum + record.distance, 0)),
      catchError(this.handleError)
    );
  }

  private mapToMileageRecord(dto: MileageRecordDTO): MileageRecord {
    return {
      id: dto.id,
      vehicleId: dto.vehicleId,
      date: new Date(dto.date),
      startOdometer: dto.startOdometer,
      endOdometer: dto.endOdometer,
      distance: dto.distance,
      purpose: dto.purpose as MileagePurpose,
      driverId: dto.driverId,
      route: dto.route,
      notes: dto.notes,
      createdBy: dto.createdBy,
      createdAt: new Date(dto.createdAt),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined
    };
  }

  private mapToMileageRecordDTO(record: MileageRecord): MileageRecordDTO {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    date: this.formatDateForBackend(record.date), 
    startOdometer: record.startOdometer,
    endOdometer: record.endOdometer,
    distance: record.distance,
    purpose: record.purpose.toString(),
    driverId: record.driverId,
    route: record.route,
    notes: record.notes,
    createdBy: record.createdBy,
    createdAt: this.formatDateForBackend(record.createdAt), 
    updatedAt: record.updatedAt ? this.formatDateForBackend(record.updatedAt) : undefined 
  };
}

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
