import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FuelRecordSummary, FuelRecordFilter } from '../models/fuel-record-summary.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuelRecordSummaryService {
  private apiUrl = `${environment.apiUrl}/fuel-records-summary`;

  constructor(private http: HttpClient) { }

  getFuelRecordSummaries(filter?: FuelRecordFilter): Observable<FuelRecordSummary[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.serviceId) params = params.set('serviceId', filter.serviceId);
      if (filter.plate) params = params.set('plates', filter.plate);
      if (filter.startDate) params = params.set('initialDate_gte', filter.startDate);
      if (filter.endDate) params = params.set('finalDate_lte', filter.endDate);
    }
    
    return this.http.get<FuelRecordSummary[]>(this.apiUrl, { params });
  }

  getFuelRecordSummaryById(serviceId: string): Observable<FuelRecordSummary> {
    return this.http.get<FuelRecordSummary>(`${this.apiUrl}?serviceId=${serviceId}`);
  }

  exportToExcel(): Observable<Blob> {
    // Simulación para json-server
    const mockExcelData = new Blob(['Datos simulados de Excel'], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    return of(mockExcelData);
  }
}