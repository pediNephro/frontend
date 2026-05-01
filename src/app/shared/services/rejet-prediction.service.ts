import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RejetPredictionRequest {
  creatinine_umoll: number;
  uree_mmoll: number;
  proteinurie_24h: number;
  tacrolimus_taux_ngml: number;
  pression_arterielle_sys: number;
  pression_arterielle_dia: number;
  score_banff: number;
  age_mois: number;
  poids_kg: number;
  jours_post_greffe: number;
  dfg_ml_min: number;
  hemoglobine_gdl: number;
  crp_mgl: number;
  variation_creatinine: number;
}

export interface FacteurCle {
  feature: string;
  impact: number;
  direction: string;
}

export interface RejetPredictionResponse {
  risque_rejet_pct: number;
  classe_risque: string;
  facteurs_cles: FacteurCle[];
  alerte: string | null;
  modele_utilise: string;
}

@Injectable({
  providedIn: 'root',
})
export class RejetPredictionService {
  private baseUrl = 'http://127.0.0.1:8001';

  constructor(private http: HttpClient) {}

  predict(request: RejetPredictionRequest): Observable<RejetPredictionResponse> {
    return this.http.post<RejetPredictionResponse>(`${this.baseUrl}/predict/rejet`, request);
  }

  getMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics`);
  }

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`);
  }
}
