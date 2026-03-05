// File: src/app/pages/medical-notes/note-list/note-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicalNote } from '../../../../core/models/monitoring';
import { MedicalNoteService } from '../../../../core/services/monitoring/medical-note.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent implements OnInit {
  notes: MedicalNote[] = [];
  filteredNotes: MedicalNote[] = [];
  
  loading = false;
  error: string | null = null;
  
  // Filters
  searchTerm = '';
  filterAuthorId: number | null = null;
  filterVitalSignId: number | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Delete modal
  showDeleteModal = false;
  noteToDelete: MedicalNote | null = null;
  
  successMessage: string | null = null;

  constructor(private noteService: MedicalNoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.error = null;

    this.noteService.getAll(this.filterVitalSignId || undefined).subscribe({
      next: (data) => {
        this.notes = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load medical notes. Please try again.';
        this.loading = false;
        console.error('Error loading notes:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.notes];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(term) ||
        note.authorId.toString().includes(term)
      );
    }

    // Author filter
    if (this.filterAuthorId) {
      filtered = filtered.filter(note => note.authorId === this.filterAuthorId);
    }

    this.filteredNotes = filtered;
    this.totalPages = Math.ceil(this.filteredNotes.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedNotes(): MedicalNote[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredNotes.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterAuthorId = null;
    this.filterVitalSignId = null;
    this.loadNotes();
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

  openDeleteModal(note: MedicalNote): void {
    this.noteToDelete = note;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.noteToDelete = null;
  }

  confirmDelete(): void {
    if (this.noteToDelete?.id) {
      this.noteService.deleteById(this.noteToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Medical note deleted successfully';
          this.closeDeleteModal();
          this.loadNotes();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete note';
          console.error('Delete error:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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

  getUniqueAuthors(): number[] {
    const authors = new Set(this.notes.map(n => n.authorId));
    return Array.from(authors).sort((a, b) => a - b);
  }
}