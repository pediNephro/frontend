import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KidneyTransplantService } from '../../../../core/services/transplant/kidney-transplant.service';
import { KidneyTransplant, GraftStatus } from '../../../../core/models/transplant/kidney-transplant.model';
import { TransplantTimelineComponent } from '../../transplant-timeline/transplant-timeline.component';
import { ProtocolePostGreffeComponent } from '../../immunosuppressant/immunosuppressant-list/protocole-post-greffe.component';
import { SurveillanceProtocolListComponent } from '../../surveillance-protocol/surveillance-protocol-list/surveillance-protocol-list.component';
import { ImmunosuppressantService } from '../../../../core/services/transplant/immunosuppressant.service';
import { Immunosuppressant } from '../../../../core/models/transplant/immunosuppressant.model';

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
  imports: [CommonModule, RouterModule, TransplantTimelineComponent, ProtocolePostGreffeComponent, SurveillanceProtocolListComponent]
})
export class TransplantDetailComponent implements OnInit {

  transplant?: KidneyTransplant;
  transplantId!: number;
  isLoading = true;
  error?: string;
  immunosuppressants: Immunosuppressant[] = [];

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
    private transplantService: KidneyTransplantService,
    private immunosuppressantService: ImmunosuppressantService
  ) {}

  ngOnInit(): void {
    this.transplantId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(this.transplantId) || this.transplantId <= 0) {
      this.error = 'Invalid transplant ID.';
      this.isLoading = false;
      return;
    }

    // Listen for tab query parameter
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab && this.tabs.some(t => t.key === tab)) {
        this.activeTab = tab as TabKey;
      }
    });

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

    this.loadImmunosuppressants();
  }

  private loadImmunosuppressants(): void {
    console.log('[TransplantDetail] Loading immunosuppressants...');
    this.immunosuppressantService.getActiveByTransplantId(this.transplantId).subscribe({
      next: (data) => {
        console.log('[TransplantDetail] Loaded immunosuppressants:', data);
        this.immunosuppressants = data || [];
        console.log('[TransplantDetail] Final array assigned:', this.immunosuppressants);
      },
      error: (err) => {
        console.error('Failed to load immunosuppressants:', err);
        this.immunosuppressants = [];
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
