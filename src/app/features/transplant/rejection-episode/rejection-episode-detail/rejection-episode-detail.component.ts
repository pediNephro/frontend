import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RejectionService } from '../../../../core/services/transplant/rejection.service';
import { RejectionEpisode, RejectionSeverity, RejectionStatus } from '../../../../core/models/transplant/rejection-episode.model';

@Component({
  selector: 'app-rejection-episode-detail',
  standalone: true,
  templateUrl: './rejection-episode-detail.component.html',
  imports: [CommonModule, RouterModule]
})
export class RejectionEpisodeDetailComponent implements OnInit {

  episode?: RejectionEpisode;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private rejectionService: RejectionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rejectionService.getById(id).subscribe({
      next: (data) => { this.episode = data; this.isLoading = false; },
      error: () => { this.error = 'Failed to load episode details.'; this.isLoading = false; }
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case RejectionSeverity.MILD: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case RejectionSeverity.MODERATE: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case RejectionSeverity.SEVERE: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case RejectionStatus.RESOLVED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case RejectionStatus.CONFIRMED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case RejectionStatus.SUSPECTED: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}