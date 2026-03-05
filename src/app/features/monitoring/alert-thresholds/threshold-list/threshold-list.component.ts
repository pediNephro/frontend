// File: src/app/pages/alert-thresholds/threshold-list/threshold-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertThreshold } from '../../../../core/models/monitoring';
import { AlertThresholdService } from '../../../../core/services/monitoring/alert-threshold.service';

@Component({
  selector: 'app-threshold-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './threshold-list.component.html',
  styleUrl: './threshold-list.component.css'
})
export class ThresholdListComponent implements OnInit {
  thresholds: AlertThreshold[] = [];
  filteredThresholds: AlertThreshold[] = [];
  
  loading = false;
  error: string | null = null;
  
  // Filters
  searchTerm = '';
  filterPatientId: number | null = null;
  filterParameter: string = '';
  filterSeverity: string = '';
  filterActive: string = ''; // 'all', 'active', 'inactive'
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Delete modal
  showDeleteModal = false;
  thresholdToDelete: AlertThreshold | null = null;
  
  successMessage: string | null = null;

  constructor(private thresholdService: AlertThresholdService) {}

  ngOnInit(): void {
    this.loadThresholds();
  }

  loadThresholds(): void {
    this.loading = true;
    this.error = null;

    this.thresholdService.getAll(this.filterPatientId || undefined).subscribe({
      next: (data) => {
        this.thresholds = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load alert thresholds. Please try again.';
        this.loading = false;
        console.error('Error loading thresholds:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.thresholds];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.patientId.toString().includes(term) ||
        t.parameter.toLowerCase().includes(term) ||
        t.customMessage?.toLowerCase().includes(term)
      );
    }

    // Parameter filter
    if (this.filterParameter) {
      filtered = filtered.filter(t => t.parameter === this.filterParameter);
    }

    // Severity filter
    if (this.filterSeverity) {
      filtered = filtered.filter(t => t.severity === this.filterSeverity);
    }

    // Active filter
    if (this.filterActive === 'active') {
      filtered = filtered.filter(t => t.active);
    } else if (this.filterActive === 'inactive') {
      filtered = filtered.filter(t => !t.active);
    }

    this.filteredThresholds = filtered;
    this.totalPages = Math.ceil(this.filteredThresholds.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedThresholds(): AlertThreshold[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredThresholds.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterPatientId = null;
    this.filterParameter = '';
    this.filterSeverity = '';
    this.filterActive = '';
    this.loadThresholds();
  }

  toggleActive(threshold: AlertThreshold): void {
    if (!threshold.id) return;

    this.thresholdService.toggleActive(threshold.id).subscribe({
      next: () => {
        this.successMessage = `Threshold ${threshold.active ? 'deactivated' : 'activated'} successfully`;
        this.loadThresholds();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to toggle threshold status';
        console.error('Toggle error:', err);
      }
    });
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

  openDeleteModal(threshold: AlertThreshold): void {
    this.thresholdToDelete = threshold;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.thresholdToDelete = null;
  }

  confirmDelete(): void {
    if (this.thresholdToDelete?.id) {
      this.thresholdService.deleteById(this.thresholdToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Alert threshold deleted successfully';
          this.closeDeleteModal();
          this.loadThresholds();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete threshold';
          console.error('Delete error:', err);
          this.closeDeleteModal();
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

  formatParameter(parameter: string): string {
    return parameter.replace(/_/g, ' ');
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

  get activeCount(): number {
    return this.thresholds.filter(t => t.active).length;
  }

  get inactiveCount(): number {
    return this.thresholds.filter(t => !t.active).length;
  }
}