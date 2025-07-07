import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule, ScheduleFilter } from '../models/schedule.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) { }

  getSchedules(filter?: ScheduleFilter): Observable<Schedule[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.id) params = params.set('id', filter.id);
      if (filter.plate) params = params.set('plate', filter.plate);
      if (filter.startDate) params = params.set('serviceDate_gte', filter.startDate);
      if (filter.endDate) params = params.set('serviceDate_lte', filter.endDate);
    }
    
    return this.http.get<Schedule[]>(this.apiUrl, { params });
  }

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
  }

  createSchedule(schedule: Omit<Schedule, 'id'>): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule);
  }

  updateSchedule(id: string, schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${id}`, schedule);
  }

  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  importSchedules(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/import`, formData);
  }
}