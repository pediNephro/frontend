import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Episode {
  id: number;
  hospitalisationId: number;
  patientId: number;
  dateDebut: Date;
  dateFin?: Date;
  description: string;
  statut: 'en-cours' | 'termine' | 'en-attente';
}

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private apiUrl = 'http://localhost:8085/episodedesoin';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Episode[]> {
    return this.http.get<Episode[]>(this.apiUrl);
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${id}`);
  }

  getByHospitalisation(hospitalisationId: number): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/hospitalisation/${hospitalisationId}`);
  }

  add(data: Episode): Observable<Episode> {
    return this.http.post<Episode>(this.apiUrl, data);
  }

  update(id: number, data: Episode): Observable<Episode> {
    return this.http.put<Episode>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFileAttente(service: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/file-attente/${service}`);
  }

  getTimeline(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/timeline/${patientId}`);
  }
}
