import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { 
  RejectionEpisode, 
  RejectionEpisodeDTO,
  RejectionStatus 
} from '../../models/transplant/rejection-episode.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RejectionService {
  private apiUrl = `${environment.transplantApiUrl}/api/rejections`;
  private rejectionDetectedSubject = new Subject<RejectionEpisode>();
  
  rejectionDetected$ = this.rejectionDetectedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // CRUD
  create(rejection: RejectionEpisodeDTO): Observable<RejectionEpisode> {
    return this.http.post<RejectionEpisode>(this.apiUrl, rejection);
  }

  getById(id: number): Observable<RejectionEpisode> {
    return this.http.get<RejectionEpisode>(`${this.apiUrl}/${id}`);
  }

  getByTransplantId(transplantId: number): Observable<RejectionEpisode[]> {
    return this.http.get<RejectionEpisode[]>(`${this.apiUrl}/transplant/${transplantId}`);
  }

  update(id: number, rejection: Partial<RejectionEpisodeDTO>): Observable<RejectionEpisode> {
    return this.http.put<RejectionEpisode>(`${this.apiUrl}/${id}`, rejection);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Automatic rejection detection
  detectRejection(transplantId: number): Observable<RejectionEpisode | null> {
    return this.http.post<RejectionEpisode | null>(
      `${this.apiUrl}/detect/${transplantId}`,
      {}
    );
  }

  // Get suspected rejections
  getSuspectedRejections(): Observable<RejectionEpisode[]> {
    return this.http.get<RejectionEpisode[]>(`${this.apiUrl}/suspected`);
  }

  // Update rejection status
  updateStatus(id: number, status: RejectionStatus): Observable<RejectionEpisode> {
    return this.http.patch<RejectionEpisode>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Link biopsy to rejection
  linkBiopsy(rejectionId: number, biopsyId: number): Observable<RejectionEpisode> {
    return this.http.patch<RejectionEpisode>(
      `${this.apiUrl}/${rejectionId}/link-biopsy/${biopsyId}`,
      {}
    );
  }

  // Emit rejection event (for real-time notifications)
  emitRejectionDetected(rejection: RejectionEpisode): void {
    this.rejectionDetectedSubject.next(rejection);
  }
}