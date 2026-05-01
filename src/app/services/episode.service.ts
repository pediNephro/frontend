import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EpisodeSoin {
  id?: number;
  type: string;
  date: string;
  description: string;
  hospitalisationId: number;
  service?: string;
  nomPatient?: string;
  prenomPatient?: string;
}

@Injectable({ providedIn: 'root' })
export class EpisodeSoinService {
  private apiUrl = 'http://localhost:8085/episodedesoin';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EpisodeSoin[]> {
    return this.http.get<EpisodeSoin[]>(this.apiUrl);
  }

  getById(id: number): Observable<EpisodeSoin> {
    return this.http.get<EpisodeSoin>(`${this.apiUrl}/${id}`);
  }

  create(data: EpisodeSoin): Observable<EpisodeSoin> {
    return this.http.post<EpisodeSoin>(this.apiUrl, data);
  }

  update(id: number, data: EpisodeSoin): Observable<EpisodeSoin> {
    return this.http.put<EpisodeSoin>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFileAttente(service: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/file-attente/${service}`);
  }

  getTimeline(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/timeline/${patientId}`);
  }
}
