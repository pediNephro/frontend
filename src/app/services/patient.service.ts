import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://localhost:8082/api/patients';

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(list => list.map(p => ({
        id: p.id,
        nom: p.nom || p.lastName || p.firstname || '',
        prenom: p.prenom || p.firstName || p.lastname || '',
      })))
    );
  }
}
