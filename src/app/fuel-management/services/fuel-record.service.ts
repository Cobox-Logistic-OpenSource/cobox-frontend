import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root',
    })
    export class FuelRecordService {
      private apiUrl = 'http://localhost:3000/fuelRecords';

      constructor(private http: HttpClient) {}

      getRecords(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
      }

      getRecordById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
      }

      createRecord(record: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, record);
      }

      updateRecord(id: number, record: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, record);
      }

      deleteRecord(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
      }
    }
