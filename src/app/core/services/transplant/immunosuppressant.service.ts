import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Immunosuppressant, 
  ImmunosuppressantDTO,
  TroughLevelUpdate,
  DrugName 
} from '../../models/transplant/immunosuppressant.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImmunosuppressantService {
  private apiUrl = `${environment.apiUrl}/immunosuppressants`;

  constructor(private http: HttpClient) {}

  // CRUD
  create(immunosuppressant: ImmunosuppressantDTO): Observable<Immunosuppressant> {
    return this.http.post<Immunosuppressant>(this.apiUrl, immunosuppressant);
  }

  getById(id: number): Observable<Immunosuppressant> {
    return this.http.get<Immunosuppressant>(`${this.apiUrl}/${id}`);
  }

  getByTransplantId(transplantId: number): Observable<Immunosuppressant[]> {
    return this.http.get<Immunosuppressant[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  getActiveByTransplantId(transplantId: number): Observable<Immunosuppressant[]> {
    return this.http.get<Immunosuppressant[]>(`${this.apiUrl}/transplant/${transplantId}/active`);
  }

  update(id: number, immunosuppressant: Partial<ImmunosuppressantDTO>): Observable<Immunosuppressant> {
    return this.http.put<Immunosuppressant>(`${this.apiUrl}/${id}`, immunosuppressant);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Trough level management
  updateTroughLevel(id: number, update: TroughLevelUpdate): Observable<Immunosuppressant> {
    return this.http.post<Immunosuppressant>(`${this.apiUrl}/${id}/trough-level`, update);
  }

  // Dose adjustment
  suggestDoseAdjustment(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/suggest-adjustment`);
  }

  adjustDose(id: number, newDose: number): Observable<Immunosuppressant> {
    return this.http.patch<Immunosuppressant>(`${this.apiUrl}/${id}/adjust-dose`, { newDose });
  }

  // Drug interactions
  checkInteractions(transplantId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/transplant/${transplantId}/interactions`);
  }

  // Get drugs out of range
  getOutOfRangeDrugs(): Observable<Immunosuppressant[]> {
    return this.http.get<Immunosuppressant[]>(`${this.apiUrl}/out-of-range`);
  }
}