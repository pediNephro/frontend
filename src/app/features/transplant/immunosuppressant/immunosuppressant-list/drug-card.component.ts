// drug-card.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PubchemService, DrugInfo } from '../../../../core/services/transplant/pubchem.service';

// Effets rénaux statiques par médicament (Hardcoded knowledge base)
const RENAL_NOTES: Record<string, string> = {
  tacrolimus: 'Néphrotoxicité dose-dépendante. Surveillance étroite de la créatinine et des taux résiduels obligatoire.',
  cyclosporine: 'Vasoconstriction aiguë de l\'artériole afférente. Risque de fibrose interstitielle à long terme.',
  'mycophenolate mofetil': 'Excellente tolérance rénale. Aucun effet néphrotoxique direct documenté.',
  prednisone: 'Peut entraîner une rétention hydrosodée. Surveillance de la pression artérielle recommandée.',
  azathioprine: 'Accumulation possible si le débit de filtration glomérulaire (DFG) est très bas (< 30 ml/min).',
  sirolimus: 'Peut aggraver une protéinurie préexistante. Surveillance du ratio protéine/créatinine.',
  everolimus: 'Risque de protéinurie dé novo. Souvent utilisé pour minimiser l\'exposition aux anticalcineurines.',
};

@Component({
  selector: 'app-drug-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative overflow-hidden bg-white dark:bg-boxdark border border-gray-100 dark:border-strokedark rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 max-w-2xl mx-auto">
      
      <!-- État chargement (Premium Skeleton) -->
      <div *ngIf="loading" class="animate-pulse p-0">
        <div class="h-64 bg-gray-50 dark:bg-gray-800 shimmer"></div>
        <div class="p-8 space-y-6">
          <div class="space-y-3">
             <div class="h-8 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3 shimmer"></div>
             <div class="h-4 bg-gray-50 dark:bg-gray-800 rounded w-full shimmer"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shimmer"></div>
            <div class="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shimmer"></div>
            <div class="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shimmer"></div>
          </div>
          <div class="h-24 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl shimmer"></div>
        </div>
      </div>

      <!-- Erreur -->
      <div *ngIf="error && !loading" class="flex flex-col items-center justify-center p-12 text-center bg-red-50/30 dark:bg-red-900/10">
        <div class="w-16 h-16 bg-white dark:bg-boxdark shadow-xl text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 class="text-xl font-black text-gray-900 dark:text-gray-100">Données Introuvables</h4>
        <p class="text-sm text-gray-500 mt-2">Nous n'avons pas pu charger les spécifications NIH pour "{{ drugName }}"</p>
      </div>

      <!-- Contenu Redessiné -->
      <ng-container *ngIf="drug && !loading">
        
        <!-- LARGE VISUAL HEADER -->
        <div class="relative h-72 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-strokedark transition-transform duration-700">
          <div class="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" 
               style="background-image: radial-gradient(#3b82f6 1px, transparent 1px); background-size: 20px 20px;"></div>
          
          <img
            [src]="drug.imageUrl"
            [alt]="drug.name"
            class="w-60 h-60 object-contain drop-shadow-2xl z-10 transition-transform duration-700 group-hover:scale-110"
          />
          
          <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            <span class="px-4 py-2 bg-white/80 dark:bg-boxdark/80 backdrop-blur-md border border-white/50 dark:border-strokedark rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shadow-sm">
              Molecular Structure
            </span>
            <span class="px-4 py-2 bg-primary dark:bg-primary shadow-lg shadow-primary/30 rounded-full text-xs font-bold text-white">
              CID #{{ drug.cid }}
            </span>
          </div>
        </div>

        <div class="p-8 md:p-10">
          <!-- Identity -->
          <div class="mb-8">
            <h3 class="text-3xl font-black text-gray-900 dark:text-white capitalize tracking-tight mb-3">
              {{ drug.name }}
            </h3>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 leading-relaxed max-w-lg italic">
              {{ drug.iupacName }}
            </p>
          </div>

          <!-- Bio-Impact (Impact Rénal) -->
          <div *ngIf="renalNote" class="mb-10 relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] p-[1px] shadow-lg shadow-orange-500/10">
            <div class="bg-white dark:bg-boxdark rounded-[1.95rem] p-6 flex items-start gap-5">
              <div class="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Impact Rénal & Surveillance</h5>
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ renalNote }}
                </p>
              </div>
            </div>
          </div>

          <!-- Molecular Profile Grid -->
          <div class="mb-10">
            <h5 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1 flex items-center gap-4">
              Pharmacological Specs
              <span class="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800"></span>
            </h5>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-transparent hover:border-blue-100 dark:hover:border-primary/20 transition-all">
                <p class="text-[10px] text-gray-400 mb-2 font-black uppercase">Weight</p>
                <p class="text-lg font-black text-gray-900 dark:text-gray-100">{{ drug.molecularWeight }}</p>
                <p class="text-[9px] text-gray-500 -mt-0.5">g/mol</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-transparent hover:border-blue-100 dark:hover:border-primary/20 transition-all">
                <p class="text-[10px] text-gray-400 mb-2 font-black uppercase">LogP</p>
                <p class="text-lg font-black text-gray-900 dark:text-gray-100">{{ drug.xLogP ?? 'N/A' }}</p>
                <p class="text-[9px] text-gray-500 -mt-0.5">Lipophilicity</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-transparent hover:border-blue-100 dark:hover:border-primary/20 transition-all">
                <p class="text-[10px] text-gray-400 mb-2 font-black uppercase">TPSA</p>
                <p class="text-lg font-black text-gray-900 dark:text-gray-100">{{ drug.tpsa ?? 'N/A' }}</p>
                <p class="text-[9px] text-gray-500 -mt-0.5">Polarity Å²</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-5 border border-transparent hover:border-blue-100 dark:hover:border-primary/20 transition-all">
                <p class="text-[10px] text-gray-400 mb-2 font-black uppercase">Complexity</p>
                <p class="text-lg font-black text-gray-900 dark:text-gray-100">{{ drug.complexity ?? 'N/A' }}</p>
                <p class="text-[9px] text-gray-500 -mt-0.5">Rating</p>
              </div>
            </div>
          </div>

          <!-- Chemical Character Section -->
          <div class="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-primary/5 rounded-2xl border border-blue-100/50 dark:border-primary/10">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <div>
                  <p class="text-[9px] text-blue-600 dark:text-primary font-black uppercase tracking-wider">H-Bond Donors</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ drug.hBondDonorCount ?? 0 }}</p>
                </div>
             </div>
             <div class="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/10">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                <div>
                  <p class="text-[9px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider">H-Bond Acceptors</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ drug.hBondAcceptorCount ?? 0 }}</p>
                </div>
             </div>
             <div class="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-900/10">
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                <div>
                  <p class="text-[9px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-wider">Rotatable Bonds</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ drug.rotatableBondCount ?? 0 }}</p>
                </div>
             </div>
          </div>

          <!-- SMILES -->
          <div class="mb-8">
            <h5 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-1">Canonical SMILES</h5>
            <div class="bg-gray-900 dark:bg-black rounded-2xl p-4 relative group/code overflow-hidden">
               <code class="text-[10px] text-green-400 block font-mono break-all whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                 {{ drug.canonicalSmiles }}
               </code>
               <div class="absolute bottom-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <span class="text-[8px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md font-bold uppercase">Pharmacological Signature</span>
               </div>
            </div>
          </div>

          <!-- Tags/Synonyms -->
          <div class="mb-10">
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let s of drug.synonyms" 
                    class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-strokedark text-[9px] font-black text-gray-500 dark:text-gray-400 rounded-lg hover:shadow-md transition-all uppercase tracking-tighter">
                {{ s }}
              </span>
            </div>
          </div>

          <!-- Footer Action -->
          <div class="pt-8 border-t border-gray-100 dark:border-strokedark">
            <a
              [href]="'https://pubchem.ncbi.nlm.nih.gov/compound/' + drug.cid"
              target="_blank"
              class="flex items-center justify-center gap-3 w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2rem] text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gray-200 dark:shadow-none"
            >
              Consulter le Dossier NIH Intégral
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .shimmer {
      background: linear-gradient(90deg, transparent, rgba(230, 230, 230, 0.4), transparent);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #374151;
      border-radius: 10px;
    }
  `]
})
export class DrugCardComponent implements OnInit, OnChanges {
  @Input() drugName!: string;

  drug: DrugInfo | null = null;
  loading = true;
  error = false;
  renalNote: string | null = null;

  constructor(private pubchem: PubchemService) {}

  ngOnInit() {
    this.loadDrugData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['drugName'] && !changes['drugName'].firstChange) {
      this.loadDrugData();
    }
  }

  private loadDrugData() {
    if (!this.drugName) return;
    
    this.loading = true;
    this.error = false;
    
    this.pubchem.getDrugInfo(this.drugName).subscribe({
      next: (data) => {
        this.drug = data;
        const lowerName = this.drugName.toLowerCase();
        // Fallback matching if exact match not found
        this.renalNote = RENAL_NOTES[lowerName] || 
                         this.findPartialMatch(lowerName) || 
                         null;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private findPartialMatch(name: string): string | null {
    const keys = Object.keys(RENAL_NOTES);
    const match = keys.find(k => name.includes(k) || k.includes(name));
    return match ? RENAL_NOTES[match] : null;
  }
}
