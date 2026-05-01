// File: src/app/pages/alerts/alert-list/alert-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Alert } from '../../../../core/models/monitoring';
import { AlertService } from '../../../../core/services/monitoring/alert.service';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.css'
})
export class AlertListComponent implements OnInit {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  
  loading = false;
  error: string | null = null;
  
  // Filters
  searchTerm = '';
  filterPatientId: number | null = null;
  filterSeverity: string = '';
  filterAcknowledged: string = ''; // 'all', 'acknowledged', 'unacknowledged'
  dateFrom = '';
  dateTo = '';
  limit = 100;
  limitOptions = [25, 50, 100, 250, 500];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Delete modal
  showDeleteModal = false;
  alertToDelete: Alert | null = null;
  
  // Acknowledge modal
  showAcknowledgeModal = false;
  alertToAcknowledge: Alert | null = null;
  acknowledgmentComment = '';
  acknowledgedBy: number = 1; // Should come from auth service
  
  successMessage: string | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    this.error = null;

    const acknowledged = this.filterAcknowledged === 'acknowledged' ? true : 
                        this.filterAcknowledged === 'unacknowledged' ? false : 
                        undefined;

    const timeSeries: { from?: string; to?: string; limit?: number } = { limit: this.limit };
    if (this.dateFrom) timeSeries.from = new Date(this.dateFrom + 'T00:00:00').toISOString();
    if (this.dateTo) timeSeries.to = new Date(this.dateTo + 'T23:59:59.999').toISOString();

    this.alertService.getAll(this.filterPatientId || undefined, acknowledged, timeSeries).subscribe({
      next: (data) => {
        this.alerts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load alerts. Please try again.';
        this.loading = false;
        console.error('Error loading alerts:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.alerts];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.patientId.toString().includes(term) ||
        alert.type.toLowerCase().includes(term) ||
        alert.message.toLowerCase().includes(term)
      );
    }

    // Severity filter
    if (this.filterSeverity) {
      filtered = filtered.filter(alert => alert.severity === this.filterSeverity);
    }

    this.filteredAlerts = filtered;
    this.totalPages = Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedAlerts(): Alert[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAlerts.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterPatientId = null;
    this.filterSeverity = '';
    this.filterAcknowledged = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.limit = 100;
    this.loadAlerts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  openDeleteModal(alert: Alert): void {
    this.alertToDelete = alert;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.alertToDelete = null;
  }

  confirmDelete(): void {
    if (this.alertToDelete?.id) {
      this.alertService.deleteById(this.alertToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Alert deleted successfully';
          this.closeDeleteModal();
          this.loadAlerts();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete alert';
          console.error('Delete error:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  openAcknowledgeModal(alert: Alert): void {
    this.alertToAcknowledge = alert;
    this.acknowledgmentComment = '';
    this.showAcknowledgeModal = true;
  }

  closeAcknowledgeModal(): void {
    this.showAcknowledgeModal = false;
    this.alertToAcknowledge = null;
    this.acknowledgmentComment = '';
  }

  confirmAcknowledge(): void {
    if (this.alertToAcknowledge?.id) {
      const dto = {
        acknowledgedBy: this.acknowledgedBy,
        acknowledgmentComment: this.acknowledgmentComment || undefined
      };

      this.alertService.acknowledge(this.alertToAcknowledge.id, dto).subscribe({
        next: () => {
          this.successMessage = 'Alert acknowledged successfully';
          this.closeAcknowledgeModal();
          this.loadAlerts();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to acknowledge alert';
          console.error('Acknowledge error:', err);
          this.closeAcknowledgeModal();
        }
      });
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'WARNING':
        return 'bg-yellow-500 text-white';
      case 'INFO':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return '🔴';
      case 'WARNING':
        return '⚠️';
      case 'INFO':
        return 'ℹ️';
      default:
        return '📌';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get unacknowledgedCount(): number {
    return this.alerts.filter(a => !a.acknowledged).length;
  }

  get criticalCount(): number {
    return this.alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;
  }
}