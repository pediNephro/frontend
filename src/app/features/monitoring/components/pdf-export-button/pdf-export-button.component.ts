// src/app/features/monitoring/components/pdf-export-button/pdf-export-button.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfReportService } from '../../../../core/services/monitoring/pdf-report.service';

@Component({
  selector: 'app-pdf-export-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-3">

      <!-- Filtres de période (optionnels) -->
      <div *ngIf="showFilters" class="flex flex-wrap items-center gap-3 p-3
           bg-blue-50 border border-blue-100 rounded-xl">
        <span class="text-xs font-medium text-blue-700 shrink-0">Période :</span>

        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500">Du</label>
          <input
            type="date"
            [(ngModel)]="fromDate"
            class="text-xs border border-slate-200 rounded-lg px-2 py-1
                   focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500">Au</label>
          <input
            type="date"
            [(ngModel)]="toDate"
            class="text-xs border border-slate-200 rounded-lg px-2 py-1
                   focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          />
        </div>

        <button
          (click)="clearFilters()"
          class="text-xs text-slate-400 hover:text-slate-600 underline"
        >Effacer</button>
      </div>

      <!-- Bouton principal -->
      <button
        (click)="exportPdf()"
        [disabled]="isLoading"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
               transition-all duration-200 select-none
               bg-blue-600 text-white hover:bg-blue-700 active:scale-95
               disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <!-- Spinner chargement -->
        <svg *ngIf="isLoading"
             class="animate-spin h-4 w-4 text-white"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
        </svg>

        <!-- Icône PDF -->
        <svg *ngIf="!isLoading"
             xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5
                   a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414
                   a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>

        <span>{{ isLoading ? 'Génération en cours...' : 'Exporter le rapport PDF' }}</span>
      </button>

      <!-- Message d'erreur -->
      <div *ngIf="errorMessage"
           class="flex items-center gap-2 text-xs text-red-600
                  bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
                   1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0
                   L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Message succès -->
      <div *ngIf="successMessage"
           class="flex items-center gap-2 text-xs text-green-700
                  bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>

    </div>
  `
})
export class PdfExportButtonComponent {

  /** ID du patient — obligatoire, fourni par le composant parent */
  @Input({ required: true }) patientId!: number;

  /** Nom du patient affiché dans l'en-tête du PDF */
  @Input() patientName?: string;

  /** Affiche ou masque les filtres de période */
  @Input() showFilters = true;

  isLoading      = false;
  errorMessage   = '';
  successMessage = '';
  fromDate       = '';
  toDate         = '';

  constructor(private pdfReportService: PdfReportService) {}

  exportPdf(): void {
    this.isLoading      = true;
    this.errorMessage   = '';
    this.successMessage = '';

    this.pdfReportService.downloadMonitoringReport({
      patientId:   this.patientId,
      patientName: this.patientName,
      from:        this.fromDate || undefined,
      to:          this.toDate   || undefined
    }).subscribe({
      next: (blob: Blob) => {
        this.pdfReportService.triggerDownload(blob, this.patientId);
        this.successMessage = 'Rapport téléchargé avec succès.';
        this.isLoading = false;
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: (err) => {
        console.error('Erreur export PDF', err);
        this.errorMessage = 'Échec de la génération du rapport. Vérifiez la connexion au serveur.';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.fromDate = '';
    this.toDate   = '';
  }
}
