import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Biopsy, BiopsyDTO } from '../../models/transplant/biopsy.model';

@Injectable({ providedIn: 'root' })
export class BiopsyService {

  private apiUrl = `${environment.transplantApiUrl}/api/biopsies`;

  constructor(private http: HttpClient) {}

  create(dto: BiopsyDTO): Observable<Biopsy> {
    return this.http.post<Biopsy>(this.apiUrl, dto);
  }

  getById(id: number): Observable<Biopsy> {
    return this.http.get<Biopsy>(`${this.apiUrl}/${id}`);
  }

  getByTransplant(transplantId: number): Observable<Biopsy[]> {
    return this.http.get<Biopsy[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  update(id: number, dto: Partial<BiopsyDTO>): Observable<Biopsy> {
    return this.http.put<Biopsy>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadReport(id: number, file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/report`, form);
  }

  uploadImages(id: number, file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/${id}/images`, form);
  }
}
