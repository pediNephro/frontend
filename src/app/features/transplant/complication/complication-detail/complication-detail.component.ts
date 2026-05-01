import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComplicationService } from '../../../../core/services/transplant/complication.service';
import { Complication, ComplicationSeverity, ComplicationStatus } from '../../../../core/models/transplant/complication.model';

@Component({
  selector: 'app-complication-detail',
  standalone: true,
  templateUrl: './complication-detail.component.html',
  imports: [CommonModule, RouterModule]
})
export class ComplicationDetailComponent implements OnInit {

  complication?: Complication;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private complicationService: ComplicationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.complicationService.getById(id).subscribe({
      next: (data) => { this.complication = data; this.isLoading = false; },
      error: () => { this.error = 'Failed to load complication details.'; this.isLoading = false; }
    });
  }

  getSeverityClass(severity?: string): string {
    switch (severity) {
      case ComplicationSeverity.MILD: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case ComplicationSeverity.MODERATE: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case ComplicationSeverity.SEVERE: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case ComplicationSeverity.LIFE_THREATENING: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case ComplicationStatus.ACTIVE: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case ComplicationStatus.RESOLVED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case ComplicationStatus.CHRONIC: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}