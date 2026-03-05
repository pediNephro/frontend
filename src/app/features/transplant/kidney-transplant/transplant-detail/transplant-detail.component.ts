import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KidneyTransplantService } from '../../../../core/services/transplant/kidney-transplant.service';
import { KidneyTransplant, GraftStatus } from '../../../../core/models/transplant/kidney-transplant.model';

/* ✅ Tab type */
type TabKey =
  | 'overview'
  | 'rejections'
  | 'biopsies'
  | 'drugs'
  | 'complications'
  | 'protocol';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-transplant-detail',
  standalone: true,
  templateUrl: './transplant-detail.component.html',
  imports: [CommonModule, RouterModule]
})
export class TransplantDetailComponent implements OnInit {

  transplant?: KidneyTransplant;
  transplantId!: number;
  isLoading = true;
  error?: string;

  /* ✅ Tabs config */
  tabs: TabItem[] = [
    { key: 'overview',      label: 'Overview',      icon: '📋' },
    { key: 'rejections',    label: 'Rejections',    icon: '🚨' },
    { key: 'biopsies',      label: 'Biopsies',      icon: '🔬' },
    { key: 'drugs',         label: 'Drugs',         icon: '💊' },
    { key: 'complications', label: 'Complications', icon: '⚠️' },
    { key: 'protocol',      label: 'Protocol',      icon: '📅' }
  ];

  /* ✅ Active tab */
  activeTab: TabKey = 'overview';

  constructor(
    private route: ActivatedRoute,
    private transplantService: KidneyTransplantService
  ) {}

  ngOnInit(): void {
    this.transplantId = Number(this.route.snapshot.paramMap.get('id'));

    this.transplantService.getById(this.transplantId).subscribe({
      next: (data) => {
        this.transplant = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load transplant record.';
        this.isLoading = false;
      }
    });
  }

  /* ✅ Switch tab */
  setTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  /* ✅ UI helpers */
  getGraftStatusClass(status: string): string {
    switch (status) {
      case GraftStatus.ACTIVE:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

      case GraftStatus.REJECTED:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

      case GraftStatus.LOST:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getDonorTypeClass(type: string): string {
    return type === 'LIVING'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
  }
}
