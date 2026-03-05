import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BiopsyService } from '../../../../core/services/transplant/biopsy.service';
import { Biopsy, BanffCategory } from '../../../../core/models/transplant/biopsy.model';

@Component({
  selector: 'app-biopsy-list',
  standalone: true,
  templateUrl: './biopsy-list.component.html',
  imports: [CommonModule, RouterModule]
})
export class BiopsyListComponent implements OnInit {
  @Input() transplantId!: number;

  biopsies: Biopsy[] = [];
  isLoading = true;
  error?: string;

  constructor(private biopsyService: BiopsyService) {}

  ngOnInit(): void {
    this.biopsyService.getByTransplant(this.transplantId).subscribe({
      next: (data) => { this.biopsies = data; this.isLoading = false; },
      error: () => { this.error = 'Failed to load biopsies.'; this.isLoading = false; }
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
}