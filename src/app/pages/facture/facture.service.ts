import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FactureUser {
  id: number;
  firstName: string;
  lastName: string;
  active?: boolean;
}

export interface Action {
  id: number;
  nomAct: string;
  categoryAct: string;
  prixAct: number;
}

export interface Facture {
  id?: number;
  patient: FactureUser;
  nomAct: string;
  prixTotal: number;
  dateCreation: string;
}

export interface FactureRequestDTO {
  idPatient: number;
  actionIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8085/api/factures';
  private userUrl = 'http://localhost:8085/api/factures/users';
  private actionUrl = 'http://localhost:8085/api/actions';

  constructor(private http: HttpClient) {}

  getAllFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl);
  }

  getFactureById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  createFacture(payload: FactureRequestDTO): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, payload);
  }

  deleteFacture(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getPatients(): Observable<FactureUser[]> {
    return this.http.get<FactureUser[]>(`${this.userUrl}/role/PATIENT`);
  }

  getActions(): Observable<Action[]> {
    return this.http.get<Action[]>(this.actionUrl);
  }

  getFacturePdf(id: number, download: boolean = false): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf?download=${download}`, {
      responseType: 'blob'
    });
  }
}
