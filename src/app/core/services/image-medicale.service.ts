import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Matches ImageMedicaleResponseDTO
export interface ImageMedicale {
  id?: number;
  patientId: number;
  typeImagerie: string;
  dateExamen: string;
  urlStockage?: string;
  description?: string;
  nomFichier?: string;
}

// Matches backend /patient/{id}/comparaison response
export interface ImageTimeline {
  id: number;
  typeImagerie: string;
  dateExamen: string;
  urlStockage: string;
  description: string;
  nomFichier: string;
}

export interface ComparaisonTemporelle {
  patientId: number;
  totalImages: number;
  typesDisponibles: string[];
  timeline: ImageTimeline[];
}

// Matches backend /patient/{id}/analyse-ia response
export interface ComparaisonPaire {
  evolution: string;
  variation: number;
  heatmap: string;
  from_index: number;
  to_index: number;
  from_url: string;
  to_url: string;
  from_date?: string;
  from_type?: string;
  to_date?: string;
  to_type?: string;
}

export interface AnalyseIAResult {
  global_evolution: string;
  variation_moyenne: number;
  variation_max: number;
  total_comparaisons?: number;
  interpretation: string;
  comparaisons: ComparaisonPaire[];
  // convenience fields (first pair)
  heatmap?: string;
  evolution?: string;
  variation?: number;
}

@Injectable({ providedIn: 'root' })
export class ImageMedicaleService {
  private apiUrl = 'http://localhost:8085/api/images-medicales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ImageMedicale[]> {
    return this.http.get<ImageMedicale[]>(this.apiUrl);
  }

  getById(id: number): Observable<ImageMedicale> {
    return this.http.get<ImageMedicale>(`${this.apiUrl}/${id}`);
  }

  getByPatient(patientId: number): Observable<ImageMedicale[]> {
    return this.http.get<ImageMedicale[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(data: Partial<ImageMedicale>): Observable<ImageMedicale> {
    return this.http.post<ImageMedicale>(this.apiUrl, data);
  }

  add(data: Partial<ImageMedicale>): Observable<ImageMedicale> {
    return this.http.post<ImageMedicale>(this.apiUrl, data);
  }

  update(id: number, data: Partial<ImageMedicale>): Observable<ImageMedicale> {
    return this.http.put<ImageMedicale>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByPatientAndType(patientId: number, type: string): Observable<ImageMedicale[]> {
    return this.http.get<ImageMedicale[]>(`${this.apiUrl}/patient/${patientId}/type/${type}`);
  }

  // Uses backend endpoint — returns chronological image timeline
  comparaisonTemporelle(patientId: number): Observable<ComparaisonTemporelle> {
    return this.http.get<ComparaisonTemporelle>(
      `${this.apiUrl}/patient/${patientId}/comparaison`
    );
  }

  // Uses backend endpoint — backend calls Python AI internally
  analyseIA(patientId: number): Observable<AnalyseIAResult> {
    return this.http.get<AnalyseIAResult>(
      `${this.apiUrl}/patient/${patientId}/analyse-ia`
    );
  }
}
