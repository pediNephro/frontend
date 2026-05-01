import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hospitalisation {
  id: number;
  patientId: number;
  service: string;
  motif: string;
  dateAdmission: Date;
  dateSortie?: Date;
  statut: 'actif' | 'archive' | 'planifie';
  litsOccupes?: number;
  capacite?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalisationService {
  private apiUrl = 'http://localhost:8085/hospitalisation';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hospitalisation[]> {
    return this.http.get<Hospitalisation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Hospitalisation> {
    return this.http.get<Hospitalisation>(`${this.apiUrl}/${id}`);
  }

  add(data: Hospitalisation): Observable<Hospitalisation> {
    return this.http.post<Hospitalisation>(this.apiUrl, data);
  }

  update(id: number, data: Hospitalisation): Observable<Hospitalisation> {
    return this.http.put<Hospitalisation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(service: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/${service}`);
  }

  getCarteDeChалeur(service: string, annee: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/heatmap`, {
      params: new HttpParams().set('service', service).set('annee', annee.toString())
    });
  }

  predireOccupation(service: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prediction/occupation/${service}`);
  }

  predireDuree(service: string, motif: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prediction/duree`, {
      params: new HttpParams().set('service', service).set('motif', motif)
    });
  }

  getProfilMedical(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profil/${patientId}`);
  }

  rechercheAvancee(filtres: any): Observable<Hospitalisation[]> {
    return this.http.post<Hospitalisation[]>(`${this.apiUrl}/recherche`, filtres);
  }
}
