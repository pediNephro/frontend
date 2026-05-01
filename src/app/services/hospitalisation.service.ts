import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HospitalisationSoin {
  id?: number;
  service: string;
  nomPatient?: string;
  prenomPatient?: string;
  dateEntree?: string;
  dateAdmission?: string;
  motif?: string;
  statut?: string;
}

@Injectable({ providedIn: 'root' })
export class HospitalisationSoinService {
  private apiUrl = 'http://localhost:8085/hospitalisation';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HospitalisationSoin[]> {
    return this.http.get<HospitalisationSoin[]>(this.apiUrl);
  }
}
