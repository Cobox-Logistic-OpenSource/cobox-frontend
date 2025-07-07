// src/app/fleet-management/services/vehicle-internal-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO } from '../models/vehicle.model';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleInternalApiService {
  // Usar la URL de api que ya tienes en environment
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(this.apiUrl);
  }

}
