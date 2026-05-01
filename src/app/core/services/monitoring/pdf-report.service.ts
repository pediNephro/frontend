// src/app/features/monitoring/services/pdf-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

export interface PdfReportParams {
  patientId: number;
  patientName?: string;
  from?: string;  // format : 'YYYY-MM-DD'
  to?: string;    // format : 'YYYY-MM-DD'
}

@Injectable({ providedIn: 'root' })
export class PdfReportService {

  // URL Gateway : stripPrefix(1) supprime "vital-signs" et route vers le microservice
  private readonly BASE_URL = `${environment.apiUrl}/api/vital-signs/report`;

  constructor(private http: HttpClient) {}

  /**
   * Télécharge le rapport PDF pour un patient.
   * Retourne un Blob (fichier binaire) que l'on force en téléchargement.
   */
  downloadMonitoringReport(params: PdfReportParams): Observable<Blob> {
    let httpParams = new HttpParams().set('patientId', params.patientId.toString());

    if (params.patientName) {
      httpParams = httpParams.set('patientName', params.patientName);
    }
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }

    return this.http.get(`${this.BASE_URL}/pdf`, {
      params: httpParams,
      responseType: 'blob'   // indispensable pour recevoir un fichier binaire
    });
  }

  /**
   * Méthode utilitaire : déclenche le téléchargement navigateur
   * à partir d'un Blob PDF reçu du back-end.
   */
  triggerDownload(blob: Blob, patientId: number): void {
    const url      = window.URL.createObjectURL(blob);
    const link     = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', 'h');
    link.href     = url;
    link.download = `rapport_monitoring_patient_${patientId}_${timestamp}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);  // libère la mémoire
  }
}
