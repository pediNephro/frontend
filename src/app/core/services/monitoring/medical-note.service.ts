import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { MedicalNote, MedicalNoteCreateDTO } from '../../models/monitoring';

@Injectable({
  providedIn: 'root'
})
export class MedicalNoteService extends BaseHttpService {
  private endpoint = '/api/medical-notes';

  getAll(vitalSignId?: number): Observable<MedicalNote[]> {
    const params = vitalSignId ? { vitalSignId } : {};
    return this.get<MedicalNote[]>(this.endpoint, params);
  }

  getById(id: number): Observable<MedicalNote> {
    return this.get<MedicalNote>(`${this.endpoint}/${id}`);
  }

  getByVitalSign(vitalSignId: number): Observable<MedicalNote[]> {
    return this.get<MedicalNote[]>(`${this.endpoint}/vital-sign/${vitalSignId}`);
  }

  create(note: MedicalNoteCreateDTO): Observable<MedicalNote> {
    return this.post<MedicalNote>(this.endpoint, note);
  }

  update(id: number, note: Partial<MedicalNote>): Observable<MedicalNote> {
    return this.put<MedicalNote>(`${this.endpoint}/${id}`, note);
  }

  deleteById(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}