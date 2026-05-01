import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabResultsApiService, PageResponse } from '../../../shared/services/lab-results-api.service';
import { LabReport } from '../../../shared/models/lab-report.model';

@Component({
  selector: 'app-lab-reports-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lab-reports-list.component.html',
})
export class LabReportsListComponent implements OnInit {
  patientId?: number;
  date?: string;
  page = 0;
  size = 10;
  pageData?: PageResponse<LabReport>;
  loading = false;
  error?: string;
  deletingId?: number;

  constructor(private api: LabResultsApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = undefined;
    this.api.getReports(this.patientId, this.date, this.page, this.size).subscribe({
      next: (res) => { this.pageData = res; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.error = 'Impossible de charger les rapports. Le service lab-results-service est-il démarré ?';
        console.error(err);
      }
    });
  }

  applyFilters(): void { this.page = 0; this.load(); }

  resetFilters(): void { this.patientId = undefined; this.date = undefined; this.applyFilters(); }

  nextPage(): void {
    if (!this.pageData || this.page + 1 >= this.pageData.totalPages) return;
    this.page++;
    this.load();
  }

  prevPage(): void {
    if (this.page <= 0) return;
    this.page--;
    this.load();
  }

  deleteReport(id: number): void {
    if (!confirm(`Supprimer le rapport #${id} ?`)) return;
    this.deletingId = id;
    this.api.deleteReport(id).subscribe({
      next: () => {
        this.deletingId = undefined;
        const currentCount = this.pageData?.content?.length ?? 0;
        if (currentCount === 1 && this.page > 0) this.page--;
        this.load();
      },
      error: () => { this.deletingId = undefined; this.error = 'Erreur lors de la suppression.'; }
    });
  }
}
