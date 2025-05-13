// src/app/fleet-management/services/vehicle-external-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO} from '../models/vehicle.model';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleExternalApiService {
  // Usar la URL de api que ya tienes en environment
  private apiUrl = `${environment.apiUrl}/external/vehicles`;

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(this.apiUrl);
  }

  getVehicleById(id: string): Observable<VehicleDTO> {
    return this.http.get<VehicleDTO>(`${this.apiUrl}/${id}`);
  }

}
