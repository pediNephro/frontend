import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { RenalFunction, RenalFunctionCreateDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class RenalFunctionService extends BaseHttpService {
  private endpoint = '/api/renal-functions';

  getAll(timeSeries?: { from?: string; to?: string; limit?: number }): Observable<RenalFunction[]> {
    const params: Record<string, string | number> = {};
    if (timeSeries?.['from']) params['from'] = timeSeries['from'];
    if (timeSeries?.['to']) params['to'] = timeSeries['to'];
    if (timeSeries?.['limit'] != null) params['limit'] = timeSeries['limit'] as number;
    return this.get<RenalFunction[]>(this.endpoint, Object.keys(params).length ? params : undefined);
  }

  getById(id: number): Observable<RenalFunction> {
    return this.get<RenalFunction>(`${this.endpoint}/${id}`);
  }

  getByVitalSign(vitalSignId: number): Observable<RenalFunction> {
    return this.get<RenalFunction>(`${this.endpoint}/vital-sign/${vitalSignId}`);
  }

  create(renalFunction: RenalFunctionCreateDTO): Observable<RenalFunction> {
    return this.post<RenalFunction>(this.endpoint, renalFunction);
  }

  update(id: number, renalFunction: Partial<RenalFunction>): Observable<RenalFunction> {
    return this.put<RenalFunction>(`${this.endpoint}/${id}`, renalFunction);
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}