// File: src/app/pages/renal-functions/renal-function-detail/renal-function-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RenalFunction } from '../../../../core/models/monitoring';
import { RenalFunctionService } from '../../../../core/services/monitoring/renal-function.service';

@Component({
  selector: 'app-renal-function-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './renal-function-detail.component.html',
  styleUrl: './renal-function-detail.component.css'
})
export class RenalFunctionDetailComponent implements OnInit {
  renalFunction: RenalFunction | null = null;
  renalFunctionId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private renalFunctionService: RenalFunctionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.renalFunctionId = +id;
      this.loadRenalFunction();
    } else {
      this.router.navigate(['/vital-signs']);
    }
  }

  loadRenalFunction(): void {
    if (!this.renalFunctionId) return;

    this.loading = true;
    this.error = null;

    this.renalFunctionService.getById(this.renalFunctionId).subscribe({
      next: (data) => {
        this.renalFunction = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load renal function data';
        this.loading = false;
        console.error('Error loading renal function:', err);
      }
    });
  }

  // GFR Status Classification
  getGFRStatus(): string {
    if (!this.renalFunction?.gfr) return 'Unknown';
    const gfr = this.renalFunction.gfr;
    
    if (gfr >= 90) return 'Normal';
    if (gfr >= 60) return 'Mildly Decreased';
    if (gfr >= 45) return 'Mild to Moderate';
    if (gfr >= 30) return 'Moderate to Severe';
    if (gfr >= 15) return 'Severely Decreased';
    return 'Kidney Failure';
  }

  getGFRStage(): string {
    if (!this.renalFunction?.gfr) return 'N/A';
    const gfr = this.renalFunction.gfr;
    
    if (gfr >= 90) return 'Stage 1 (Normal)';
    if (gfr >= 60) return 'Stage 2 (Mild)';
    if (gfr >= 45) return 'Stage 3a (Mild-Moderate)';
    if (gfr >= 30) return 'Stage 3b (Moderate-Severe)';
    if (gfr >= 15) return 'Stage 4 (Severe)';
    return 'Stage 5 (Kidney Failure)';
  }

  getGFRStatusClass(): string {
    if (!this.renalFunction?.gfr) return 'bg-gray-100 text-gray-800';
    const gfr = this.renalFunction.gfr;
    
    if (gfr >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (gfr >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (gfr >= 45) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (gfr >= 30) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    if (gfr >= 15) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  }

  getGFRIcon(): string {
    if (!this.renalFunction?.gfr) return '❓';
    const gfr = this.renalFunction.gfr;
    
    if (gfr >= 90) return '✅';
    if (gfr >= 60) return '🟢';
    if (gfr >= 45) return '🟡';
    if (gfr >= 30) return '🟠';
    if (gfr >= 15) return '🔴';
    return '🚨';
  }

  // Creatinine Status
  getCreatinineStatus(): string {
    if (!this.renalFunction?.creatinineLevel) return 'N/A';
    const creatinine = this.renalFunction.creatinineLevel;
    
    // Normal ranges (mg/dL): Children 0.3-0.7, Adolescents 0.5-1.0
    if (creatinine <= 1.0) return 'Normal';
    if (creatinine <= 1.5) return 'Mildly Elevated';
    if (creatinine <= 3.0) return 'Moderately Elevated';
    return 'Severely Elevated';
  }

  getCreatinineStatusClass(): string {
    const status = this.getCreatinineStatus();
    
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (status === 'Mildly Elevated') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Moderately Elevated') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }

  // Urine Output Assessment
  getUrineOutputStatus(): string {
    if (!this.renalFunction?.urineOutputRatio) return 'N/A';
    const ratio = this.renalFunction.urineOutputRatio;
    
    // Normal: 1-2 mL/kg/hr for children
    if (ratio >= 1.0 && ratio <= 2.0) return 'Normal';
    if (ratio < 0.5) return 'Oliguria (Low)';
    if (ratio < 1.0) return 'Decreased';
    if (ratio > 2.0) return 'Polyuria (High)';
    return 'Unknown';
  }

  getUrineOutputStatusClass(): string {
    const status = this.getUrineOutputStatus();
    
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (status === 'Decreased') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status.includes('Oliguria') || status.includes('Polyuria')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatNumber(value: number | undefined | null, decimals: number = 2): string {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(decimals);
  }
}