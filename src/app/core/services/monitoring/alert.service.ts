import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { Alert, AlertAcknowledgeDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class AlertService extends BaseHttpService {
  private endpoint = '/api/alerts';

  getAll(patientId?: number, acknowledged?: boolean, timeSeries?: { from?: string; to?: string; limit?: number }): Observable<Alert[]> {
    const params: any = {};
    if (patientId) params.patientId = patientId;
    if (acknowledged !== undefined) params.acknowledged = acknowledged;
    if (timeSeries?.from) params.from = timeSeries.from;
    if (timeSeries?.to) params.to = timeSeries.to;
    if (timeSeries?.limit != null) params.limit = timeSeries.limit;
    return this.get<Alert[]>(this.endpoint, params);
  }

  getById(id: number): Observable<Alert> {
    return this.get<Alert>(`${this.endpoint}/${id}`);
  }

  getUnacknowledged(patientId?: number): Observable<Alert[]> {
    return this.getAll(patientId, false);
  }

  acknowledge(id: number, dto: AlertAcknowledgeDTO): Observable<Alert> {
    return this.put<Alert>(`${this.endpoint}/${id}/acknowledge`, dto);
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}