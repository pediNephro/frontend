import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HLACompatibility, HLACompatibilityDTO } from '../../models/transplant/hla-compatibility.model';

@Injectable({ providedIn: 'root' })
export class HlaCompatibilityService {

  private apiUrl = `${environment.transplantApiUrl}/api/hla`;

  constructor(private http: HttpClient) {}

  create(dto: HLACompatibilityDTO): Observable<HLACompatibility> {
    return this.http.post<HLACompatibility>(this.apiUrl, dto);
  }

  getById(id: number): Observable<HLACompatibility> {
    return this.http.get<HLACompatibility>(`${this.apiUrl}/${id}`);
  }

  getByTransplant(transplantId: number): Observable<HLACompatibility[]> {
    return this.http.get<HLACompatibility[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  update(id: number, dto: Partial<HLACompatibilityDTO>): Observable<HLACompatibility> {
    return this.http.put<HLACompatibility>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}