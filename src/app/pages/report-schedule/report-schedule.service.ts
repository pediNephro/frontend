import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../../shared/models/template.model';
import { SchedulingUser } from '../../shared/models/scheduling-user.model';
import { ReportScheduleRequest } from '../../shared/models/report-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ReportScheduleService {
  private baseUrl = 'http://localhost:8085/api/schedules';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.baseUrl}/templates`);
  }

  getUsers(): Observable<SchedulingUser[]> {
    return this.http.get<SchedulingUser[]>(`${this.baseUrl}/users`);
  }

  getUsersByRole(role: string): Observable<SchedulingUser[]> {
    return this.http.get<SchedulingUser[]>(`${this.baseUrl}/users/role/${role}`);
  }

  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getScheduleById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createSchedule(data: ReportScheduleRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updateSchedule(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
