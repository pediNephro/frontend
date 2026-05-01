import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Action {
  id?: number;
  categoryAct: string;
  nomAct: string;
  prixAct: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private apiUrl = 'http://localhost:8085/api/actions';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<Action[]> {
    return this.http.get<Action[]>(this.apiUrl);
  }

  getActionById(id: number): Observable<Action> {
    return this.http.get<Action>(`${this.apiUrl}/${id}`);
  }

  createAction(payload: Action): Observable<Action> {
    return this.http.post<Action>(this.apiUrl, payload);
  }

  updateAction(id: number, payload: Action): Observable<Action> {
    return this.http.put<Action>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAction(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
