import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../../shared/models/template.model';

@Injectable({
  providedIn: 'root'
})
export class ReportTemplateService {
  private baseUrl = 'http://localhost:8085/api/schedules/templates';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Template[]> {
    return this.http.get<Template[]>(this.baseUrl);
  }

  getById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/${id}`);
  }

  create(template: Partial<Template>): Observable<Template> {
    return this.http.post<Template>(this.baseUrl, template);
  }

  update(id: number, template: Partial<Template>): Observable<Template> {
    return this.http.put<Template>(`${this.baseUrl}/${id}`, template);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
