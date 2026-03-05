import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { GrowthChart, GrowthChartCreateDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class GrowthChartService extends BaseHttpService {
  private endpoint = '/api/growth-charts';

  getAll(patientId?: number, chartType?: string, timeSeries?: { from?: string; to?: string; limit?: number }): Observable<GrowthChart[]> {
    const params: any = {};
    if (patientId) params.patientId = patientId;
    if (chartType) params.chartType = chartType;
    if (timeSeries?.from) params.from = timeSeries.from;
    if (timeSeries?.to) params.to = timeSeries.to;
    if (timeSeries?.limit != null) params.limit = timeSeries.limit;
    return this.get<GrowthChart[]>(this.endpoint, params);
  }

  getById(id: number): Observable<GrowthChart> {
    return this.get<GrowthChart>(`${this.endpoint}/${id}`);
  }

  getByPatient(patientId: number, timeSeries?: { from?: string; to?: string; limit?: number }): Observable<GrowthChart[]> {
    return this.getAll(patientId, undefined, timeSeries);
  }

  create(chart: GrowthChartCreateDTO): Observable<GrowthChart> {
    return this.post<GrowthChart>(this.endpoint, chart);
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}