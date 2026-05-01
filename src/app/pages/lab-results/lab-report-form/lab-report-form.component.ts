import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LabResultsApiService } from '../../../shared/services/lab-results-api.service';
import { LabReport } from '../../../shared/models/lab-report.model';

@Component({
  selector: 'app-lab-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lab-report-form.component.html',
})
export class LabReportFormComponent implements OnInit {
  id?: number;
  isEditMode = false;

  form: Partial<LabReport> = {
    patientId: 0,
    reportDate: '',
    analysisType: '',
    laboratoryName: '',
    comment: ''
  };

  loading = false;
  error?: string;

  constructor(
    private api: LabResultsApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.isEditMode = true;
      this.loadForEdit(this.id);
    }
  }

  private loadForEdit(id: number): void {
    this.loading = true;
    this.api.getReportById(id).subscribe({
      next: (report) => { this.form = { ...report }; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Erreur lors du chargement du rapport.'; }
    });
  }

  save(): void {
    this.loading = true;
    this.error = undefined;

    if (this.isEditMode && this.id != null) {
      this.api.updateReport(this.id, this.form as LabReport).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/lab-reports', this.id]); },
        error: () => { this.loading = false; this.error = 'Erreur lors de la mise à jour.'; }
      });
    } else {
      this.api.createReport(this.form as LabReport).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/lab-reports']); },
        error: () => { this.loading = false; this.error = 'Erreur lors de la création.'; }
      });
    }
  }
}
