import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VitalSign } from '../../../../core/models/monitoring';
import { VitalSignService } from '../../../../core/services/monitoring/vital-sign.service';

@Component({
  selector: 'app-vital-sign-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vital-sign-list.component.html',
  styleUrl: './vital-sign-list.component.css'
})
export class VitalSignListComponent implements OnInit {
  vitalSigns: VitalSign[] = [];
  filteredVitalSigns: VitalSign[] = [];
  
  // Loading & Error states
  loading = false;
  error: string | null = null;
  
  // Filter & Search
  searchTerm = '';
  filterPatientId: number | null = null;
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
  vitalSignToDelete: VitalSign | null = null;
  
  // Success message
  successMessage: string | null = null;

  constructor(private vitalSignService: VitalSignService) {}

  ngOnInit(): void {
    this.loadVitalSigns();
  }

  loadVitalSigns(): void {
    this.loading = true;
    this.error = null;

    const timeSeries: { from?: string; to?: string; limit?: number } = { limit: this.limit };
    if (this.dateFrom) timeSeries.from = new Date(this.dateFrom + 'T00:00:00').toISOString();
    if (this.dateTo) timeSeries.to = new Date(this.dateTo + 'T23:59:59.999').toISOString();

    this.vitalSignService.getAll(this.filterPatientId || undefined, timeSeries).subscribe({
      next: (data) => {
        this.vitalSigns = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vital signs. Please try again.';
        this.loading = false;
        console.error('Error loading vital signs:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.vitalSigns];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vs => 
        vs.patientId.toString().includes(term) ||
        vs.id?.toString().includes(term)
      );
    }

    this.filteredVitalSigns = filtered;
    this.totalPages = Math.ceil(this.filteredVitalSigns.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedVitalSigns(): VitalSign[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredVitalSigns.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterPatientId = null;
    this.dateFrom = '';
    this.dateTo = '';
    this.limit = 100;
    this.loadVitalSigns();
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

  openDeleteModal(vitalSign: VitalSign): void {
    this.vitalSignToDelete = vitalSign;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.vitalSignToDelete = null;
  }

  confirmDelete(): void {
    if (this.vitalSignToDelete?.id) {
      this.vitalSignService.deleteById(this.vitalSignToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Vital sign deleted successfully';
          this.closeDeleteModal();
          this.loadVitalSigns();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete vital sign';
          console.error('Delete error:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  getBPStatus(systolic?: number, diastolic?: number): string {
    if (!systolic || !diastolic) return 'N/A';
    
    if (systolic >= 140 || diastolic >= 90) return 'High';
    if (systolic < 90 || diastolic < 60) return 'Low';
    return 'Normal';
  }

  getBPStatusClass(systolic?: number, diastolic?: number): string {
    const status = this.getBPStatus(systolic, diastolic);
    
    if (status === 'High') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status === 'Low') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
}
