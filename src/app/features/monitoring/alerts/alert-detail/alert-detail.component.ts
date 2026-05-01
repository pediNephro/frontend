import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Alert } from '../../../../core/models/monitoring';
import { AlertService } from '../../../../core/services/monitoring/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, RouterModule ,FormsModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.css'
})
export class AlertDetailComponent implements OnInit {
  alert: Alert | null = null;
  alertId: number | null = null;
  loading = false;
  error: string | null = null;
  
  showDeleteModal = false;
  showAcknowledgeModal = false;
  acknowledgmentComment = '';
  acknowledgedBy: number = 1; // Should come from auth service

  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alertId = +id;
      this.loadAlert();
    } else {
      this.router.navigate(['/patient-alerts']);
    }
  }

  loadAlert(): void {
    if (!this.alertId) return;

    this.loading = true;
    this.error = null;

    this.alertService.getById(this.alertId).subscribe({
      next: (data) => {
        this.alert = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load alert details';
        this.loading = false;
        console.error('Error loading alert:', err);
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.alertId) return;

    this.alertService.deleteById(this.alertId).subscribe({
      next: () => {
        this.router.navigate(['/patient-alerts']);
      },
      error: (err) => {
        this.error = 'Failed to delete alert';
        this.closeDeleteModal();
        console.error('Delete error:', err);
      }
    });
  }

  openAcknowledgeModal(): void {
    this.showAcknowledgeModal = true;
  }

  closeAcknowledgeModal(): void {
    this.showAcknowledgeModal = false;
    this.acknowledgmentComment = '';
  }

  confirmAcknowledge(): void {
    if (!this.alertId) return;

    const dto = {
      acknowledgedBy: this.acknowledgedBy,
      acknowledgmentComment: this.acknowledgmentComment || undefined
    };

    this.alertService.acknowledge(this.alertId, dto).subscribe({
      next: () => {
        this.loadAlert();
        this.closeAcknowledgeModal();
      },
      error: (err) => {
        this.error = 'Failed to acknowledge alert';
        this.closeAcknowledgeModal();
        console.error('Acknowledge error:', err);
      }
    });
  }

  getSeverityClass(): string {
    if (!this.alert) return 'bg-gray-500';
    switch (this.alert.severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'WARNING': return 'bg-yellow-500';
      case 'INFO': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  getSeverityIcon(): string {
    if (!this.alert) return '📌';
    switch (this.alert.severity) {
      case 'CRITICAL': return '🔴';
      case 'WARNING': return '⚠️';
      case 'INFO': return 'ℹ️';
      default: return '📌';
    }
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
}