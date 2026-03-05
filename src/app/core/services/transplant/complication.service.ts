import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Complication, ComplicationDTO } from '../../models/transplant/complication.model';

@Injectable({ providedIn: 'root' })
export class ComplicationService {

  private apiUrl = `${environment.transplantApiUrl}/api/complications`;

  constructor(private http: HttpClient) {}

  create(dto: ComplicationDTO): Observable<Complication> {
    return this.http.post<Complication>(this.apiUrl, dto);
  }

  getById(id: number): Observable<Complication> {
    return this.http.get<Complication>(`${this.apiUrl}/${id}`);
  }

  getByTransplant(transplantId: number): Observable<Complication[]> {
    return this.http.get<Complication[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  update(id: number, dto: Partial<ComplicationDTO>): Observable<Complication> {
    return this.http.put<Complication>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}