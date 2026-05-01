import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentMedical {
  id: number;
  patientId: number;
  type: string;
  titre: string;
  dateCreation: Date;
  contenu?: string;
}

export interface CompletudeDossier {
  total: number;
  remplis: number;
  pourcentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentMedicalService {
  private apiUrl = 'http://localhost:8085/api/documents-medicaux';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocumentMedical[]> {
    return this.http.get<DocumentMedical[]>(this.apiUrl);
  }

  getById(id: number): Observable<DocumentMedical> {
    return this.http.get<DocumentMedical>(`${this.apiUrl}/${id}`);
  }

  getByPatient(patientId: number): Observable<DocumentMedical[]> {
    return this.http.get<DocumentMedical[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByPatientAndType(patientId: number, type: string): Observable<DocumentMedical[]> {
    return this.http.get<DocumentMedical[]>(`${this.apiUrl}/patient/${patientId}/type/${type}`);
  }

  getCompletude(patientId: number): Observable<CompletudeDossier> {
    return this.http.get<CompletudeDossier>(`${this.apiUrl}/completude/${patientId}`);
  }

  add(data: DocumentMedical): Observable<DocumentMedical> {
    return this.http.post<DocumentMedical>(this.apiUrl, data);
  }

  update(id: number, data: DocumentMedical): Observable<DocumentMedical> {
    return this.http.put<DocumentMedical>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
