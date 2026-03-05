import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { VitalSign, VitalSignCreateDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class VitalSignService extends BaseHttpService {
  private endpoint = '/api/vital-signs';

  getAll(patientId?: number, timeSeries?: { from?: string; to?: string; limit?: number }): Observable<VitalSign[]> {
    const params: Record<string, string | number> = {};
    if (patientId) params['patientId'] = patientId;
    if (timeSeries?.['from']) params['from'] = timeSeries['from'];
    if (timeSeries?.['to']) params['to'] = timeSeries['to'];
    if (timeSeries?.['limit'] != null) params['limit'] = timeSeries['limit'] as number;
    return this.get<VitalSign[]>(this.endpoint, Object.keys(params).length ? params : undefined);
  }

  getById(id: number): Observable<VitalSign> {
    return this.get<VitalSign>(`${this.endpoint}/${id}`);
  }

  getByPatient(patientId: number, timeSeries?: { from?: string; to?: string; limit?: number }): Observable<VitalSign[]> {
    return this.getAll(patientId, timeSeries);
  }

  create(vitalSign: VitalSignCreateDTO): Observable<VitalSign> {
    return this.post<VitalSign>(this.endpoint, vitalSign);
  }

  update(id: number, vitalSign: Partial<VitalSign>): Observable<VitalSign> {
    return this.put<VitalSign>(`${this.endpoint}/${id}`, vitalSign);
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}