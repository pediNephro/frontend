import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SurveillanceProtocol, SurveillanceProtocolDTO } from '../../models/transplant/surveillance-protocol.model';

@Injectable({ providedIn: 'root' })
export class SurveillanceProtocolService {

  private apiUrl = `${environment.transplantApiUrl}/api/surveillance`;

  constructor(private http: HttpClient) { }

  create(dto: SurveillanceProtocolDTO): Observable<SurveillanceProtocol> {
    const { transplantId, ...body } = dto as any;
    return this.http.post<SurveillanceProtocol>(`${this.apiUrl}/transplant/${transplantId}`, body);
  }

  getById(id: number): Observable<SurveillanceProtocol> {
    return this.http.get<SurveillanceProtocol>(`${this.apiUrl}/${id}`);
  }

  getByTransplant(transplantId: number): Observable<SurveillanceProtocol[]> {
    return this.http.get<SurveillanceProtocol[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  update(id: number, dto: Partial<SurveillanceProtocolDTO>): Observable<SurveillanceProtocol> {
    const { transplantId, ...rest } = dto as any;
    const body = transplantId ? { ...rest, transplant: { id: transplantId } } : rest;
    return this.http.put<SurveillanceProtocol>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getByTransplantId(transplantId: number): Observable<SurveillanceProtocol> {
    return this.http.get<SurveillanceProtocol>(
      `${this.apiUrl}/transplant/${transplantId}`
    );
  }
}