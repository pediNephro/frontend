import { Injectable, signal, computed } from '@angular/core';
import { AlertService } from './alert.service';
import { Alert } from '../../models/monitoring';

/** Provides unacknowledged alert count and recent alerts for header badge and notification dropdown. */
@Injectable({
  providedIn: 'root'
})
export class AlertNotificationService {
  private readonly unacknowledgedAlerts = signal<Alert[]>([]);
  private readonly loading = signal(false);

  readonly alerts = this.unacknowledgedAlerts.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly count = computed(() => this.unacknowledgedAlerts().length);
  readonly criticalCount = computed(() =>
    this.unacknowledgedAlerts().filter(a => a.severity === 'CRITICAL').length
  );
  readonly hasCritical = computed(() => this.criticalCount() > 0);

  constructor(private alertService: AlertService) {}

  /** Load unacknowledged alerts (call on init and when opening notification panel). */
  refresh(): void {
    this.loading.set(true);
    this.alertService.getAll(undefined, false, { limit: 50 }).subscribe({
      next: (list) => {
        this.unacknowledgedAlerts.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'WARNING': return 'bg-yellow-500 text-white';
      case 'INFO': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}
