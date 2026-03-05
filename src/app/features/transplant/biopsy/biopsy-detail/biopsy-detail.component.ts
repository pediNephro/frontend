import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BiopsyService } from '../../../../core/services/transplant/biopsy.service';
import { Biopsy, BanffCategory } from '../../../../core/models/transplant/biopsy.model';

@Component({
  selector: 'app-biopsy-detail',
  standalone: true,
  templateUrl: './biopsy-detail.component.html',
  imports: [CommonModule, RouterModule]
})
export class BiopsyDetailComponent implements OnInit {

  biopsy?: Biopsy;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private biopsyService: BiopsyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.biopsyService.getById(id).subscribe({
      next: (data) => { this.biopsy = data; this.isLoading = false; },
      error: () => { this.error = 'Failed to load biopsy details.'; this.isLoading = false; }
    });
  }

  getBanffClass(category?: string): string {
    switch (category) {
      case BanffCategory.NORMAL: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case BanffCategory.BORDERLINE: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case BanffCategory.ACUTE_REJECTION: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getScoreColor(score?: number): string {
    if (score === 0) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score === 1) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (score === 2) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
}