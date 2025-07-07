import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MileageRecordDTO } from '../models/mileage-record.model';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MileageExternalApiService {
  private apiUrl = `${environment.apiUrl}/mileage-records`;

  constructor(private http: HttpClient) { }

  getMileageRecords(): Observable<MileageRecordDTO[]> {
    return this.http.get<MileageRecordDTO[]>(this.apiUrl);
  }

  getMileageRecordById(id: string): Observable<MileageRecordDTO> {
    return this.http.get<MileageRecordDTO>(`${this.apiUrl}/${id}`);
  }
}
