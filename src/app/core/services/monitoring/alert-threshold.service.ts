import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { AlertThreshold, AlertThresholdCreateDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class AlertThresholdService extends BaseHttpService {
  private endpoint = '/api/alert-thresholds';

  getAll(patientId?: number): Observable<AlertThreshold[]> {
    const params = patientId ? { patientId } : {};
    return this.get<AlertThreshold[]>(this.endpoint, params);
  }

  getById(id: number): Observable<AlertThreshold> {
    return this.get<AlertThreshold>(`${this.endpoint}/${id}`);
  }

  getByPatient(patientId: number): Observable<AlertThreshold[]> {
    return this.get<AlertThreshold[]>(`${this.endpoint}/patient/${patientId}`);
  }

  create(threshold: AlertThresholdCreateDTO): Observable<AlertThreshold> {
    return this.post<AlertThreshold>(this.endpoint, threshold);
  }

  update(id: number, threshold: Partial<AlertThreshold>): Observable<AlertThreshold> {
    return this.put<AlertThreshold>(`${this.endpoint}/${id}`, threshold);
  }

  toggleActive(id: number): Observable<AlertThreshold> {
    return this.put<AlertThreshold>(`${this.endpoint}/${id}/toggle`, {});
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}