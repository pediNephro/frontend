import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientDTO } from '../models/patient.models';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'http://localhost:8085/api/patients';

  constructor(private http: HttpClient) {}

  // ── Create ────────────────────────────────────────────────
  createPatient(patient: PatientDTO): Observable<PatientDTO> {
    return this.http.post<PatientDTO>(this.baseUrl, patient);
  }

  // ── Get all ───────────────────────────────────────────────
  getAllPatients(): Observable<PatientDTO[]> {
    return this.http.get<PatientDTO[]>(this.baseUrl);
  }

  // ── Get by ID ─────────────────────────────────────────────
  getPatientById(id: number): Observable<PatientDTO> {
    return this.http.get<PatientDTO>(`${this.baseUrl}/${id}`);
  }

  // ── Update ────────────────────────────────────────────────
  updatePatient(id: number, patient: PatientDTO): Observable<PatientDTO> {
    return this.http.put<PatientDTO>(`${this.baseUrl}/${id}`, patient);
  }

  // ── Delete ────────────────────────────────────────────────
  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
