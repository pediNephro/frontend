import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  KidneyTransplant, 
  KidneyTransplantDTO 
} from '../../models/transplant/kidney-transplant.model';
import { 
  HLACompatibility, 
  HLACompatibilityDTO 
} from '../../models/transplant/hla-compatibility.model';
import { 
  SurveillanceProtocol, 
  SurveillanceProtocolDTO 
} from '../../models/transplant/surveillance-protocol.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KidneyTransplantService {
  private apiUrl = `${environment.transplantApiUrl}/api/transplants`;

  constructor(private http: HttpClient) {}

  // Kidney Transplant CRUD
  create(transplant: KidneyTransplantDTO): Observable<KidneyTransplant> {
    return this.http.post<KidneyTransplant>(this.apiUrl, transplant);
  }

  getById(id: number): Observable<KidneyTransplant> {
    return this.http.get<KidneyTransplant>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: number): Observable<KidneyTransplant> {
    return this.http.get<KidneyTransplant>(`${this.apiUrl}/patient/${patientId}`);
  }

  getAll(): Observable<KidneyTransplant[]> {
    return this.http.get<KidneyTransplant[]>(this.apiUrl);
  }

  update(id: number, transplant: Partial<KidneyTransplantDTO>): Observable<KidneyTransplant> {
    return this.http.put<KidneyTransplant>(`${this.apiUrl}/${id}`, transplant);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Upload surgical report
  uploadSurgicalReport(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/surgical-report`, formData);
  }

  // HLA Compatibility
  createHLACompatibility(hla: HLACompatibilityDTO): Observable<HLACompatibility> {
    return this.http.post<HLACompatibility>(`${this.apiUrl}/hla-compatibility`, hla);
  }

  getHLACompatibility(transplantId: number): Observable<HLACompatibility> {
    return this.http.get<HLACompatibility>(`${this.apiUrl}/${transplantId}/hla-compatibility`);
  }

  updateHLACompatibility(id: number, hla: Partial<HLACompatibilityDTO>): Observable<HLACompatibility> {
    return this.http.put<HLACompatibility>(`${this.apiUrl}/hla-compatibility/${id}`, hla);
  }

  // Surveillance Protocol
  createSurveillanceProtocol(protocol: SurveillanceProtocolDTO): Observable<SurveillanceProtocol> {
    return this.http.post<SurveillanceProtocol>(`${this.apiUrl}/surveillance-protocol`, protocol);
  }

  getSurveillanceProtocol(transplantId: number): Observable<SurveillanceProtocol> {
    return this.http.get<SurveillanceProtocol>(`${this.apiUrl}/${transplantId}/surveillance-protocol`);
  }

  updateSurveillanceProtocol(id: number, protocol: Partial<SurveillanceProtocolDTO>): Observable<SurveillanceProtocol> {
    return this.http.put<SurveillanceProtocol>(`${this.apiUrl}/surveillance-protocol/${id}`, protocol);
  }

  generateDefaultProtocol(transplantId: number): Observable<SurveillanceProtocol> {
    return this.http.post<SurveillanceProtocol>(
      `${this.apiUrl}/${transplantId}/surveillance-protocol/generate`,
      {}
    );
  }

  // Statistics
  getActiveGraftsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/statistics/active-grafts`);
  }

  getRejectionCount(period?: 'month' | 'year'): Observable<number> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<number>(`${this.apiUrl}/statistics/rejections`, { params });
  }
}