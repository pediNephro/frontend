// drug-search.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PubchemService } from '../../../../core/services/transplant/pubchem.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { DrugCardComponent } from './drug-card.component';

@Component({
  selector: 'app-drug-search',
  standalone: true,
  imports: [CommonModule, FormsModule, DrugCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Search Input Section -->
      <div class="relative group">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange($event)"
          placeholder="Rechercher un médicament (ex: Tacrolimus, Aspirin...)"
          class="w-full pl-12 pr-4 py-4 bg-white dark:bg-boxdark border-2 border-gray-100 dark:border-strokedark rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-gray-900 dark:text-white font-medium"
        />

        <!-- Results Dropdown -->
        <div *ngIf="suggestions.length > 0 && searchTerm.length > 1 && !selectedDrug" 
             class="absolute z-50 w-full mt-2 bg-white dark:bg-boxdark border border-gray-100 dark:border-strokedark rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div class="p-2 space-y-1">
            <button
              *ngFor="let s of suggestions"
              (click)="selectDrug(s)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center justify-between group"
            >
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary capitalize">{{ s }}</span>
              <span class="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Explorer &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div *ngIf="selectedDrug" class="animate-in zoom-in-95 duration-300">
        <div class="flex items-center justify-between mb-4 px-2">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Aperçu de la recherche
          </h4>
          <button (click)="clearSelection()" class="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg font-bold transition-colors">
            Effacer
          </button>
        </div>
        <app-drug-card [drugName]="selectedDrug" />
      </div>

      <!-- Empty State -->
      <div *ngIf="!selectedDrug && searchTerm.length === 0" class="py-12 flex flex-col items-center text-center opacity-40">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <p class="text-sm font-medium">Commencez à taper pour explorer la base PubChem</p>
      </div>
    </div>
  `,
})
export class DrugSearchComponent implements OnInit {
  searchTerm: string = '';
  suggestions: string[] = [];
  selectedDrug: string | null = null;
  private searchSubject = new Subject<string>();

  @Output() drugSelected = new EventEmitter<string>();

  constructor(private pubchem: PubchemService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) return of([]);
        return this.pubchem.searchDrug(term).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(results => {
      this.suggestions = results;
    });
  }

  onSearchChange(value: string) {
    this.selectedDrug = null;
    this.searchSubject.next(value);
  }

  selectDrug(name: string) {
    this.selectedDrug = name;
    this.searchTerm = name;
    this.suggestions = [];
    this.drugSelected.emit(name);
  }

  clearSelection() {
    this.selectedDrug = null;
    this.searchTerm = '';
    this.suggestions = [];
  }
}
