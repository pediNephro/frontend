// src/app/features/monitoring/growth-charts/growth-chart-view/growth-chart-view.component.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrowthChart } from '../../../../core/models/monitoring';
import { GrowthChartService } from '../../../../core/services/monitoring/growth-chart.service';
import {
  WHO_DATA,
  GenderType,
  WhoPercentileRow,
  calculatePercentile,
} from '../who-growth-data';

// ApexCharts — déjà installé dans ton projet
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexAnnotations,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartType = 'WEIGHT' | 'HEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE';

@Component({
  selector: 'app-growth-chart-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white shadow-default
                dark:border-strokedark dark:bg-boxdark p-6">

      <!-- ── En-tête ── -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-black dark:text-white">
            Courbes de croissance OMS
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Patient #{{ patientId }} — percentiles P3, P15, P50, P85, P97
          </p>
        </div>

        <!-- Contrôles -->
        <div class="flex flex-wrap items-center gap-3">

          <!-- Type de mesure -->
          <div class="flex rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
            <button *ngFor="let t of chartTypes"
              (click)="selectChartType(t.value)"
              [class.bg-primary]="selectedType === t.value"
              [class.text-white]="selectedType === t.value"
              [class.text-gray-600]="selectedType !== t.value"
              class="px-3 py-1.5 text-xs font-medium transition-colors
                     dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4">
              {{ t.label }}
            </button>
          </div>

          <!-- Sexe -->
          <select [(ngModel)]="selectedGender" (ngModelChange)="buildChart()"
            class="rounded-lg border border-stroke dark:border-strokedark px-3 py-1.5
                   text-xs bg-white dark:bg-boxdark text-black dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="MALE">Garçon</option>
            <option value="FEMALE">Fille</option>
          </select>

        </div>
      </div>

      <!-- ── Alerte si hors percentiles ── -->
      <div *ngIf="alertMessage"
           class="mb-4 flex items-start gap-3 rounded-lg border px-4 py-3"
           [class.border-red-200]="alertLevel === 'danger'"
           [class.bg-red-50]="alertLevel === 'danger'"
           [class.border-yellow-200]="alertLevel === 'warning'"
           [class.bg-yellow-50]="alertLevel === 'warning'">
        <svg class="mt-0.5 h-5 w-5 shrink-0"
             [class.text-red-500]="alertLevel === 'danger'"
             [class.text-yellow-500]="alertLevel === 'warning'"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0
                   001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <p class="text-sm font-medium"
           [class.text-red-700]="alertLevel === 'danger'"
           [class.text-yellow-700]="alertLevel === 'warning'">
          {{ alertMessage }}
        </p>
      </div>

      <!-- ── Graphique ApexCharts ── -->
      <div *ngIf="!loading && series.length > 0">
        <apx-chart
          [series]="series"
          [chart]="chartConfig"
          [xaxis]="xaxis"
          [yaxis]="yaxis"
          [stroke]="stroke"
          [markers]="markers"
          [tooltip]="tooltip"
          [legend]="legend"
          [annotations]="annotations"
          [colors]="colors"
        ></apx-chart>
      </div>

      <!-- ── Loading ── -->
      <div *ngIf="loading" class="flex h-64 items-center justify-center">
        <div class="h-10 w-10 animate-spin rounded-full border-4
                    border-primary border-t-transparent"></div>
      </div>

      <!-- ── Vide ── -->
      <div *ngIf="!loading && series.length === 0"
           class="flex h-64 flex-col items-center justify-center text-center">
        <svg class="mb-3 h-12 w-12 text-gray-300" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2
                   0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002
                   2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0
                   01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-sm text-gray-500">Aucune mesure disponible pour ce type.</p>
      </div>

      <!-- ── Tableau récapitulatif ── -->
      <div *ngIf="!loading && patientPoints.length > 0" class="mt-6">
        <h4 class="mb-3 text-sm font-medium text-black dark:text-white">
          Récapitulatif des mesures
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-meta-4">
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Âge (mois)</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Valeur</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Percentile estimé</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of patientPoints; let i = index"
                  [class.bg-white]="i % 2 === 0"
                  [class.bg-gray-50]="i % 2 !== 0"
                  class="border-t border-stroke dark:border-strokedark dark:bg-boxdark">
                <td class="px-4 py-2 font-medium text-black dark:text-white">
                  {{ p.ageMonths }} mois
                </td>
                <td class="px-4 py-2 text-black dark:text-white">
                  {{ p.value }} {{ unitLabel }}
                </td>
                <td class="px-4 py-2">
                  <span *ngIf="p.computedPercentile !== null"
                        class="font-semibold"
                        [class.text-red-600]="p.computedPercentile! < 3"
                        [class.text-yellow-600]="p.computedPercentile! >= 3 && p.computedPercentile! < 15"
                        [class.text-green-600]="p.computedPercentile! >= 15 && p.computedPercentile! <= 85"
                        [class.text-blue-600]="p.computedPercentile! > 85 && p.computedPercentile! <= 97"
                        [class.text-purple-600]="p.computedPercentile! > 97">
                    P{{ p.computedPercentile! | number:'1.0-0' }}
                  </span>
                  <span *ngIf="p.computedPercentile === null" class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-2">
                  <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-red-100]="p.computedPercentile !== null && p.computedPercentile! < 3"
                    [class.text-red-800]="p.computedPercentile !== null && p.computedPercentile! < 3"
                    [class.bg-yellow-100]="p.computedPercentile !== null && p.computedPercentile! >= 3 && p.computedPercentile! < 15"
                    [class.text-yellow-800]="p.computedPercentile !== null && p.computedPercentile! >= 3 && p.computedPercentile! < 15"
                    [class.bg-green-100]="p.computedPercentile !== null && p.computedPercentile! >= 15 && p.computedPercentile! <= 85"
                    [class.text-green-800]="p.computedPercentile !== null && p.computedPercentile! >= 15 && p.computedPercentile! <= 85"
                    [class.bg-blue-100]="p.computedPercentile !== null && p.computedPercentile! > 85 && p.computedPercentile! <= 97"
                    [class.text-blue-800]="p.computedPercentile !== null && p.computedPercentile! > 85 && p.computedPercentile! <= 97"
                    [class.bg-purple-100]="p.computedPercentile !== null && p.computedPercentile! > 97"
                    [class.text-purple-800]="p.computedPercentile !== null && p.computedPercentile! > 97"
                    [class.bg-gray-100]="p.computedPercentile === null"
                    [class.text-gray-800]="p.computedPercentile === null">
                    {{ getPercentileLabel(p.computedPercentile) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
})
export class GrowthChartViewComponent implements OnInit, OnChanges {

  @Input({ required: true }) patientId!: number;

  // ── État ──────────────────────────────────────────────────────────────────
  loading        = false;
  selectedType: ChartType = 'WEIGHT';
  selectedGender: GenderType = 'MALE';
  alertMessage   = '';
  alertLevel: 'danger' | 'warning' | '' = '';

  chartTypes = [
    { value: 'WEIGHT'           as ChartType, label: 'Poids'    },
    { value: 'HEIGHT'           as ChartType, label: 'Taille'   },
    { value: 'BMI'              as ChartType, label: 'IMC'      },
    { value: 'HEAD_CIRCUMFERENCE' as ChartType, label: 'P. crânien' },
  ];

  patientPoints: { ageMonths: number; value: number; computedPercentile: number | null }[] = [];

  // ── Config ApexCharts ─────────────────────────────────────────────────────
  series:      ApexAxisChartSeries = [];
  colors:      string[]            = [];
  chartConfig: ApexChart           = {
    type: 'line', height: 380, toolbar: { show: true },
    animations: { enabled: true, speed: 400 },
    fontFamily: 'inherit',
  };
  xaxis: ApexXAxis   = { type: 'numeric', title: { text: 'Âge (mois)' }, min: 0, max: 60 };
  yaxis: ApexYAxis   = { title: { text: '' } };
  stroke: ApexStroke = {
    curve: 'smooth',
    width: [],
    dashArray: [],
  };
  markers: ApexMarkers = { size: [] };
  tooltip: ApexTooltip = {
    shared: false,
    x: { formatter: (v: number) => `${v} mois` },
    y: { formatter: (v: number) => `${v.toFixed(1)}` },
  };
  legend: ApexLegend = { show: true, position: 'top' };
  annotations: ApexAnnotations = {};

  constructor(private growthChartService: GrowthChartService) {}

  ngOnInit(): void { this.loadAndBuild(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] && !changes['patientId'].firstChange) {
      this.loadAndBuild();
    }
  }

  selectChartType(type: ChartType): void {
    this.selectedType = type;
    this.buildChart();
  }

  // ── Chargement des données patient ────────────────────────────────────────

  private allCharts: GrowthChart[] = [];

  loadAndBuild(): void {
    if (!this.patientId) return;
    this.loading = true;

    this.growthChartService.getAll(this.patientId).subscribe({
      next: (data) => {
        this.allCharts = data;
        this.loading = false;
        this.buildChart();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // ── Construction du graphique ─────────────────────────────────────────────

  buildChart(): void {
    const whoRows: WhoPercentileRow[] =
      WHO_DATA[this.selectedType]?.[this.selectedGender] ?? [];

    // Courbes OMS — lignes fines en pointillés
    const p3Series  = whoRows.map(r => [r.age, r.p3]);
    const p15Series = whoRows.map(r => [r.age, r.p15]);
    const p50Series = whoRows.map(r => [r.age, r.p50]);
    const p85Series = whoRows.map(r => [r.age, r.p85]);
    const p97Series = whoRows.map(r => [r.age, r.p97]);

    // Points patient filtrés par type
    const patientData = this.allCharts
      .filter(c => c.chartType === this.selectedType)
      .sort((a, b) => a.ageMonths - b.ageMonths);

    this.patientPoints = patientData.map(c => ({
      ageMonths: c.ageMonths,
      value: c.value,
      computedPercentile: calculatePercentile(
        c.ageMonths, c.value, this.selectedType, this.selectedGender
      ),
    }));

    const patientSeries = patientData.map(c => [c.ageMonths, c.value]);

    // Alerte si dernier point hors normes
    this.computeAlert();

    // Unité Y
    this.yaxis = {
      title: { text: this.unitLabel },
      labels: { formatter: (v: number) => v.toFixed(1) },
    };

    // Assemblage des séries
    this.series = [
      { name: 'P3',       data: p3Series  as any },
      { name: 'P15',      data: p15Series as any },
      { name: 'P50',      data: p50Series as any },
      { name: 'P85',      data: p85Series as any },
      { name: 'P97',      data: p97Series as any },
      { name: 'Patient',  data: patientSeries as any },
    ];

    // Couleurs : gris dégradé pour OMS, rouge vif pour patient
    this.colors = [
      '#CBD5E1', // P3  — gris clair
      '#94A3B8', // P15 — gris moyen
      '#3B82F6', // P50 — bleu médian
      '#94A3B8', // P85 — gris moyen
      '#CBD5E1', // P97 — gris clair
      '#EF4444', // Patient — rouge
    ];

    // Épaisseurs et pointillés
    this.stroke = {
      curve: 'smooth',
      width:     [1.5, 1.5, 2,   1.5, 1.5, 3],
      dashArray: [4,   2,   0,   2,   4,   0],
    };

    // Marqueurs : visibles seulement sur la courbe patient
    this.markers = {
      size:        [0, 0, 0, 0, 0, 6],
      strokeColors: ['#fff'],
      strokeWidth:  2,
      hover:        { size: 8 },
    };
  }

  // ── Alerte clinique ───────────────────────────────────────────────────────

  private computeAlert(): void {
    this.alertMessage = '';
    this.alertLevel   = '';

    if (this.patientPoints.length === 0) return;

    const last = this.patientPoints[this.patientPoints.length - 1];
    if (last.computedPercentile === null) return;

    const p = last.computedPercentile;
    if (p < 3) {
      this.alertLevel   = 'danger';
      this.alertMessage = `⚠️ Dernière mesure sous le P3 (P${p.toFixed(0)}) — croissance insuffisante, consultation recommandée.`;
    } else if (p > 97) {
      this.alertLevel   = 'danger';
      this.alertMessage = `⚠️ Dernière mesure au-dessus du P97 (P${p.toFixed(0)}) — valeur élevée, à surveiller.`;
    } else if (p < 15) {
      this.alertLevel   = 'warning';
      this.alertMessage = `Dernière mesure entre P3 et P15 (P${p.toFixed(0)}) — à surveiller lors du prochain contrôle.`;
    }
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────

  get unitLabel(): string {
    switch (this.selectedType) {
      case 'WEIGHT':            return 'kg';
      case 'HEIGHT':            return 'cm';
      case 'BMI':               return 'kg/m²';
      case 'HEAD_CIRCUMFERENCE': return 'cm';
    }
  }

  getPercentileLabel(p: number | null): string {
    if (p === null) return 'N/A';
    if (p < 3)   return 'Sous P3';
    if (p < 15)  return 'P3 – P15';
    if (p <= 85) return 'P15 – P85';
    if (p <= 97) return 'P85 – P97';
    return 'Au-dessus P97';
  }
}