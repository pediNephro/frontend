// protocole-post-greffe.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugCardComponent } from './drug-card.component';
import { DrugSearchComponent } from './drug-search.component';
import { Immunosuppressant } from '../../../../core/models/transplant/immunosuppressant.model';

@Component({
  selector: 'app-protocole-post-greffe',
  standalone: true,
  imports: [CommonModule, DrugCardComponent, DrugSearchComponent],
  template: `
    <div class="space-y-10">
      
      <!-- Patient Protocol Section -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span class="w-2 h-8 bg-primary rounded-full"></span>
              Protocole Actif
            </h2>
            <p class="text-sm text-gray-500 mt-1">Traitement immunosuppresseur actuel du patient</p>
          </div>
          <div class="flex gap-2">
             <span class="text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30 uppercase tracking-widest">
              Live PubChem Sync
            </span>
          </div>
        </div>

        <div *ngIf="immunosuppressants && immunosuppressants.length > 0; else noDrugs" 
             class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div *ngFor="let drug of immunosuppressants" class="relative group">
            <!-- Dosage Badge -->
            <div class="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white/90 dark:bg-boxdark/90 backdrop-blur shadow-sm rounded-xl border border-gray-100 dark:border-strokedark flex flex-col items-end">
              <span class="text-[10px] uppercase font-black text-gray-400">Dose actuelle</span>
              <span class="text-sm font-bold text-primary">{{ drug.currentDose }} mg</span>
            </div>

            <app-drug-card [drugName]="drug.drugName" />
            
            <div class="mt-3 px-4 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Début: {{ drug.startDate | date:'dd MMM yyyy' }}</span>
              <span [class.text-green-500]="drug.isActive" [class.text-red-500]="!drug.isActive">
                {{ drug.isActive ? '● En cours' : '○ Arrêté' }}
              </span>
            </div>
          </div>
        </div>

        <ng-template #noDrugs>
          <div class="bg-gray-50 dark:bg-boxdark border-2 border-dashed border-gray-200 dark:border-strokedark rounded-3xl py-12 flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4">
              <span class="text-2xl">💊</span>
            </div>
            <p class="text-gray-900 dark:text-white font-bold">Aucun médicament enregistré</p>
            <p class="text-xs text-gray-500 mt-1">Le dossier patient ne contient aucun immunosuppresseur actif.</p>
            <!-- Debug info (remove in production) -->
            <p class="text-xs text-gray-400 mt-3 break-words">DEBUG: Array is {{ immunosuppressants === undefined ? 'UNDEFINED' : immunosuppressants === null ? 'NULL' : 'defined' }} | Length: {{ immunosuppressants.length || 0 }} | Value: {{ (immunosuppressants | json) || 'empty' }}</p>
          </div>
        </ng-template>
      </section>

      <!-- Search & Exploration Section -->
      <section class="pt-10 border-t border-gray-100 dark:border-strokedark">
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="text-2xl">🔍</span>
            Exploration Pharmacologique
          </h2>
          <p class="text-sm text-gray-500 mt-1">Recherchez d'autres molécules dans la base NIH PubChem</p>
        </div>
        
        <div class="bg-blue-50/30 dark:bg-primary/5 rounded-[40px] p-8 md:p-12 border border-blue-100/30 dark:border-primary/10">
          <app-drug-search />
        </div>
      </section>

    </div>
  `,
})
export class ProtocolePostGreffeComponent implements OnInit, OnChanges {
  @Input() immunosuppressants: Immunosuppressant[] = [];

  ngOnInit(): void {
    console.log('[ProtocolePostGreffe] ngOnInit - immunosuppressants:', this.immunosuppressants);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['immunosuppressants']) {
      console.log('[ProtocolePostGreffe] ngOnChanges - New value:', changes['immunosuppressants'].currentValue);
      console.log('[ProtocolePostGreffe] Array length:', this.immunosuppressants.length || 0);
      console.log('[ProtocolePostGreffe] Full array:', JSON.stringify(this.immunosuppressants, null, 2));
    }
  }
}