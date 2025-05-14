import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  updateServiceStatus(id: string, status: string): Observable<Service> {
    return this.http.patch<Service>(`${this.apiUrl}/${id}`, { status });
  }

  createService(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(id: string, service: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}