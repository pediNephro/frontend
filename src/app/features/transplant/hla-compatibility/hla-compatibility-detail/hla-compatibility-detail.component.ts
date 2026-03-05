import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HlaCompatibilityService } from '../../../../core/services/transplant/hla-compatibility.service';
import { HLACompatibility, CrossMatchResult } from '../../../../core/models/transplant/hla-compatibility.model';

@Component({
  selector: 'app-hla-compatibility-detail',
  standalone: true,
  templateUrl: './hla-compatibility-detail.component.html',
  imports: [CommonModule, RouterModule]
})
export class HlaCompatibilityDetailComponent implements OnInit {

  hlaCompatibility?: HLACompatibility;
  isLoading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private hlaCompatibilityService: HlaCompatibilityService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hlaCompatibilityService.getById(id).subscribe({
      next: (data) => { this.hlaCompatibility = data; this.isLoading = false; },
      error: () => { this.error = 'Failed to load HLA compatibility details.'; this.isLoading = false; }
    });
  }

  getCrossMatchClass(result?: string): string {
    switch (result) {
      case CrossMatchResult.POSITIVE: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case CrossMatchResult.NEGATIVE: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getCompatibilityScore(): string {
    if (!this.hlaCompatibility?.numberOfMismatches) return 'Not calculated';
    const score = 6 - this.hlaCompatibility.numberOfMismatches;
    return `${score}/6 (${this.hlaCompatibility.numberOfMismatches} mismatches)`;
  }
}