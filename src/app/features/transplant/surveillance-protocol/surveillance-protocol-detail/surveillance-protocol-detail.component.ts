// surveillance-protocol-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SurveillanceProtocolService } from '../../../../core/services/transplant/surveillance-protocol.service';
import { SurveillanceProtocol, TransplantPhase } from '../../../../core/models/transplant/surveillance-protocol.model';

@Component({
  selector: 'app-surveillance-protocol-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './surveillance-protocol-detail.component.html',
  styleUrls: ['./surveillance-protocol-detail.component.css']
})
export class SurveillanceProtocolDetailComponent implements OnInit {
  protocol: SurveillanceProtocol | null = null;
  isLoading = false;
  error: string | null = null;
  transplantId: number;
  protocolId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveillanceProtocolService: SurveillanceProtocolService
  ) {
    this.transplantId = +this.route.snapshot.params['transplantId'];
    this.protocolId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadProtocol();
  }

  loadProtocol(): void {
    this.isLoading = true;
    this.error = null;

    this.surveillanceProtocolService.getById(this.protocolId).subscribe({
      next: (protocol) => {
        this.protocol = protocol;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load surveillance protocol';
        this.isLoading = false;
        console.error('Error loading protocol:', error);
      }
    });
  }

  getPhaseDisplayName(phase: TransplantPhase): string {
    switch (phase) {
      case TransplantPhase.IMMEDIATE:
        return 'Immediate (J0-J15)';
      case TransplantPhase.EARLY:
        return 'Early (J15-M3)';
      case TransplantPhase.LONG_TERM:
        return 'Long Term (>M3)';
      default:
        return phase;
    }
  }

  getPhaseDescription(phase: TransplantPhase): string {
    switch (phase) {
      case TransplantPhase.IMMEDIATE:
        return 'Immediate post-transplant period (0-15 days) with intensive monitoring';
      case TransplantPhase.EARLY:
        return 'Early post-transplant period (15 days - 3 months) with regular follow-up';
      case TransplantPhase.LONG_TERM:
        return 'Long-term follow-up (>3 months) with routine surveillance';
      default:
        return '';
    }
  }

  getPhaseColor(phase: TransplantPhase): string {
    switch (phase) {
      case TransplantPhase.IMMEDIATE:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case TransplantPhase.EARLY:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case TransplantPhase.LONG_TERM:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleDateString();
  }

  isDateOverdue(date: Date | string | undefined): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  getDaysUntil(date: Date | string | undefined): number | null {
    if (!date) return null;
    const targetDate = new Date(date);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCompletionPercentage(): number {
    if (!this.protocol) return 0;
    // This would typically be calculated based on completed tasks vs total tasks
    // For now, return a placeholder calculation
    return this.protocol.completionPercentage || 0;
  }

  getCompletionColor(): string {
    const percentage = this.getCompletionPercentage();
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }
}