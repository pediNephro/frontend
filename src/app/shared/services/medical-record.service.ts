import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecordDTO } from '../models/patient.models';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  private baseUrl = 'http://localhost:8085/api/medical-records';

  constructor(private http: HttpClient) {}

  // ── Create ────────────────────────────────────────────────
  createRecord(record: MedicalRecordDTO): Observable<MedicalRecordDTO> {
    return this.http.post<MedicalRecordDTO>(this.baseUrl, record);
  }

  // ── Get all ───────────────────────────────────────────────
  getAllRecords(): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(this.baseUrl);
  }

  // ── Get by ID ─────────────────────────────────────────────
  getRecordById(id: number): Observable<MedicalRecordDTO> {
    return this.http.get<MedicalRecordDTO>(`${this.baseUrl}/${id}`);
  }

  // ── Update ────────────────────────────────────────────────
  updateRecord(id: number, record: MedicalRecordDTO): Observable<MedicalRecordDTO> {
    return this.http.put<MedicalRecordDTO>(`${this.baseUrl}/${id}`, record);
  }

  // ── Delete ────────────────────────────────────────────────
  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ── Get by patient ────────────────────────────────────────
  getRecordsByPatientId(patientId: number): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(`${this.baseUrl}/patient/${patientId}`);
  }

  // ── Get by doctor ─────────────────────────────────────────
  getRecordsByDoctorId(doctorId: number): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(`${this.baseUrl}/doctor/${doctorId}`);
  }

  // ── Get by archive status ─────────────────────────────────
  getRecordsByArchiveStatus(isArchived: boolean): Observable<MedicalRecordDTO[]> {
    return this.http.get<MedicalRecordDTO[]>(`${this.baseUrl}/archived/${isArchived}`);
  }

  // ── Upload image ───────────────────────────────────────────
  uploadImage(id: number, file: File): Observable<MedicalRecordDTO> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MedicalRecordDTO>(`${this.baseUrl}/${id}/image`, formData);
  }

  // ── Analyze with Gemini ────────────────────────────────────
  analyzeRecord(id: number): Observable<{ analysis: string }> {
    return this.http.post<{ analysis: string }>(`${this.baseUrl}/${id}/analyze`, {});
  }

  // ── Download analysis as PDF ───────────────────────────────
  downloadAnalysisPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/analyze/pdf`, { responseType: 'blob' });
  }
}
