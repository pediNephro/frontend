import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalisationService, Hospitalisation } from '../../core/services/hospitalisation.service';

type TabType = 'list' | 'add' | 'lits' | 'historique' | 'prediction' | 'recherche' | 'heatmap' | 'profil';

@Component({
  selector: 'app-hospitalisations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">🏥 Gestion des Hospitalisations</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez et suivez les hospitalisations des patients</p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          *ngFor="let tab of tabs"
          (click)="onTabClick(tab.value)"
          [class.border-b-2]="activeTab === tab.value"
          [class.border-blue-500]="activeTab === tab.value"
          [class.text-blue-600]="activeTab === tab.value"
          [class.text-gray-600]="activeTab !== tab.value"
          class="px-4 py-2 font-medium text-sm transition-colors hover:text-blue-500">
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

        <!-- LIST Tab -->
        <div *ngIf="activeTab === 'list'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Liste des Hospitalisations</h2>
          <div *ngIf="loading" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">⏳ Chargement...</p>
          </div>
          <div *ngIf="!loading && hospitalisations.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Patient ID</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Service</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Motif</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date Admission</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of hospitalisations" class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.id }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.patientId }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.service }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.motif }}</td>
                  <td class="px-4 py-3">
                    <span class="px-3 py-1 rounded-full text-sm font-medium"
                      [class.bg-green-100]="item.statut === 'actif'" [class.text-green-800]="item.statut === 'actif'"
                      [class.bg-gray-100]="item.statut === 'archive'" [class.text-gray-800]="item.statut === 'archive'"
                      [class.bg-yellow-100]="item.statut === 'planifie'" [class.text-yellow-800]="item.statut === 'planifie'">
                      {{ item.statut }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.dateAdmission | date:'dd/MM/yyyy' }}</td>
                  <td class="px-4 py-3 text-center">
                    <button (click)="deleteItem(item.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="!loading && hospitalisations.length === 0" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400 text-lg">Aucune hospitalisation trouvée</p>
          </div>
        </div>

        <!-- ADD Tab -->
        <div *ngIf="activeTab === 'add'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ajouter une Hospitalisation</h2>
          <form [formGroup]="hospitalisationForm" (ngSubmit)="onSubmit()" class="space-y-4 max-w-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Patient ID</label>
                <input type="number" formControlName="patientId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: 1">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Service</label>
                <input type="text" formControlName="service"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Cardiologie">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Motif</label>
              <input type="text" formControlName="motif"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Motif de l'hospitalisation">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Date Admission</label>
                <input type="date" formControlName="dateAdmission"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Statut</label>
                <select formControlName="statut"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="actif">Actif</option>
                  <option value="archive">Archive</option>
                  <option value="planifie">Planifié</option>
                </select>
              </div>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Ajouter
              </button>
              <button type="button" (click)="resetForm()"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 font-medium">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        <!-- LITS Tab -->
        <div *ngIf="activeTab === 'lits'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🛏️ Gestion des Lits</h2>
          <div class="flex gap-2 mb-6 max-w-sm">
            <input type="text" [(ngModel)]="statsService"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nom du service">
            <button (click)="loadStats()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Voir Stats
            </button>
          </div>
          <div *ngIf="loadingStats" class="text-center py-8">
            <p class="text-gray-500">⏳ Chargement...</p>
          </div>
          <div *ngIf="stats && !loadingStats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold text-blue-700 dark:text-blue-300">{{ stats.litsOccupes ?? stats.lits_occupes ?? '-' }}</p>
              <p class="text-sm text-blue-600 dark:text-blue-400 mt-1">Lits occupés</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold text-green-700 dark:text-green-300">{{ stats.capacite ?? stats.total ?? '-' }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-1">Capacité totale</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {{ stats.tauxOccupation ?? stats.taux_occupation ?? '-' }}%
              </p>
              <p class="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Taux d'occupation</p>
            </div>
          </div>
          <div *ngIf="stats && !loadingStats" class="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ stats | json }}</pre>
          </div>
        </div>

        <!-- HISTORIQUE Tab -->
        <div *ngIf="activeTab === 'historique'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📱 Historique (Archives)</h2>
          <div *ngIf="loading" class="text-center py-8">
            <p class="text-gray-500">⏳ Chargement...</p>
          </div>
          <div *ngIf="!loading && historique.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Patient ID</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Service</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Motif</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Date Admission</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Date Sortie</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of historique" class="border-t border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-3 text-sm">{{ item.patientId }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.service }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.motif }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.dateAdmission | date:'dd/MM/yyyy' }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.dateSortie ? (item.dateSortie | date:'dd/MM/yyyy') : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="!loading && historique.length === 0" class="text-center py-12">
            <p class="text-gray-500">Aucun historique d'hospitalisation trouvé</p>
          </div>
        </div>

        <!-- PREDICTION Tab -->
        <div *ngIf="activeTab === 'prediction'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🔮 Prédiction d'Occupation</h2>
          <div class="space-y-6">
            <!-- Prédiction Occupation -->
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Prédiction d'occupation par service</h3>
              <div class="flex gap-2 mb-4 max-w-sm">
                <input type="text" [(ngModel)]="predictionService"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Nom du service">
                <button (click)="loadPredictionOccupation()"
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                  Prédire
                </button>
              </div>
              <div *ngIf="loadingPrediction" class="text-center py-4">
                <p class="text-gray-500">⏳ Calcul en cours...</p>
              </div>
              <div *ngIf="predictionOccupation && !loadingPrediction" class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <pre class="text-sm text-purple-800 dark:text-purple-200 whitespace-pre-wrap">{{ predictionOccupation | json }}</pre>
              </div>
            </div>
            <!-- Prédiction Durée -->
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Prédiction de durée de séjour</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 max-w-md">
                <input type="text" [(ngModel)]="predictionDureeService"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Service">
                <input type="text" [(ngModel)]="predictionDureeMotif"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Motif">
              </div>
              <button (click)="loadPredictionDuree()"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Prédire Durée
              </button>
              <div *ngIf="predictionDuree" class="mt-4 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg">
                <pre class="text-sm text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap">{{ predictionDuree | json }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- RECHERCHE Tab -->
        <div *ngIf="activeTab === 'recherche'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🔍 Recherche Avancée</h2>
          <div class="space-y-3 max-w-lg mb-6">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Service</label>
                <input type="text" [(ngModel)]="filtres.service"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Service">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Motif</label>
                <input type="text" [(ngModel)]="filtres.motif"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Motif">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Statut</label>
                <select [(ngModel)]="filtres.statut"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm">
                  <option value="">Tous</option>
                  <option value="actif">Actif</option>
                  <option value="archive">Archive</option>
                  <option value="planifie">Planifié</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Patient ID</label>
                <input type="number" [(ngModel)]="filtres.patientId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Patient ID">
              </div>
            </div>
            <button (click)="loadRecherche()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Rechercher
            </button>
          </div>
          <div *ngIf="loadingRecherche" class="text-center py-8">
            <p class="text-gray-500">⏳ Chargement...</p>
          </div>
          <div *ngIf="rechercheResults.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Patient ID</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Service</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Motif</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of rechercheResults" class="border-t border-gray-200 dark:border-gray-700">
                  <td class="px-4 py-3 text-sm">{{ item.patientId }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.service }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.motif }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.statut }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- HEATMAP Tab -->
        <div *ngIf="activeTab === 'heatmap'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🗺️ Carte de Chaleur des Admissions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-lg">
            <input type="text" [(ngModel)]="heatmapService"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Service">
            <input type="number" [(ngModel)]="heatmapAnnee"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Année (ex: 2024)">
            <button (click)="loadHeatmap()"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
              Générer
            </button>
          </div>
          <div *ngIf="loadingHeatmap" class="text-center py-8">
            <p class="text-gray-500">⏳ Génération en cours...</p>
          </div>
          <div *ngIf="heatmapData && !loadingHeatmap" class="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
            <pre class="text-sm text-orange-800 dark:text-orange-200 whitespace-pre-wrap">{{ heatmapData | json }}</pre>
          </div>
        </div>

        <!-- PROFIL Tab -->
        <div *ngIf="activeTab === 'profil'">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">👤 Profil Médical Patient</h2>
          <div class="flex gap-2 mb-6 max-w-sm">
            <input type="number" [(ngModel)]="profilPatientId"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Patient ID">
            <button (click)="loadProfil()"
              class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
              Voir Profil
            </button>
          </div>
          <div *ngIf="loadingProfil" class="text-center py-8">
            <p class="text-gray-500">⏳ Chargement...</p>
          </div>
          <div *ngIf="profilData && !loadingProfil" class="bg-teal-50 dark:bg-teal-900 p-4 rounded-lg">
            <pre class="text-sm text-teal-800 dark:text-teal-200 whitespace-pre-wrap">{{ profilData | json }}</pre>
          </div>
        </div>

      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
        {{ error }}
      </div>
    </div>
  `,
  styles: []
})
export class HospitalisationsComponent implements OnInit {
  activeTab: TabType = 'list';
  hospitalisations: Hospitalisation[] = [];
  historique: Hospitalisation[] = [];
  loading = false;
  error = '';
  hospitalisationForm: FormGroup;

  // Lits
  statsService = '';
  stats: any = null;
  loadingStats = false;

  // Prediction
  predictionService = '';
  predictionOccupation: any = null;
  loadingPrediction = false;
  predictionDureeService = '';
  predictionDureeMotif = '';
  predictionDuree: any = null;

  // Recherche
  filtres: any = { service: '', motif: '', statut: '', patientId: null };
  rechercheResults: Hospitalisation[] = [];
  loadingRecherche = false;

  // Heatmap
  heatmapService = '';
  heatmapAnnee: number = new Date().getFullYear();
  heatmapData: any = null;
  loadingHeatmap = false;

  // Profil
  profilPatientId: number | null = null;
  profilData: any = null;
  loadingProfil = false;

  tabs = [
    { value: 'list', label: 'Liste', icon: '📋' },
    { value: 'add', label: 'Ajouter', icon: '➕' },
    { value: 'lits', label: 'Gestion Lits', icon: '🛏️' },
    { value: 'historique', label: 'Historique', icon: '📱' },
    { value: 'prediction', label: 'Prédiction', icon: '🔮' },
    { value: 'recherche', label: 'Recherche', icon: '🔍' },
    { value: 'heatmap', label: 'Heatmap', icon: '🗺️' },
    { value: 'profil', label: 'Profil', icon: '👤' },
  ];

  constructor(
    private hospitalisationService: HospitalisationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.hospitalisationForm = this.fb.group({
      patientId: ['', Validators.required],
      service: ['', Validators.required],
      motif: ['', Validators.required],
      dateAdmission: ['', Validators.required],
      statut: ['actif', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tab = params.get('tab') as TabType | null;
      const validTabs: TabType[] = ['list', 'add', 'lits', 'historique', 'prediction', 'recherche', 'heatmap', 'profil'];
      if (tab && validTabs.includes(tab)) {
        this.activeTab = tab;
      }
    });
    this.loadHospitalisations();
  }

  onTabClick(tabValue: any): void {
    const validTabs: TabType[] = ['list', 'add', 'lits', 'historique', 'prediction', 'recherche', 'heatmap', 'profil'];
    if (validTabs.includes(tabValue)) {
      this.activeTab = tabValue as TabType;
      this.router.navigate(['/hospitalisations', tabValue], { replaceUrl: true });
      if (tabValue === 'historique') this.loadHistorique();
    }
  }

  loadHospitalisations(): void {
    this.loading = true;
    this.error = '';
    this.hospitalisationService.getAll().subscribe({
      next: (data) => { this.hospitalisations = data; this.loading = false; },
      error: (err) => { this.error = 'Erreur lors du chargement'; this.loading = false; console.error(err); }
    });
  }

  loadHistorique(): void {
    this.loading = true;
    this.hospitalisationService.getAll().subscribe({
      next: (data) => {
        this.historique = data.filter(h => h.statut === 'archive');
        this.loading = false;
      },
      error: (err) => { this.loading = false; console.error(err); }
    });
  }

  loadStats(): void {
    if (!this.statsService) return;
    this.loadingStats = true;
    this.stats = null;
    this.hospitalisationService.getStats(this.statsService).subscribe({
      next: (data) => { this.stats = data; this.loadingStats = false; },
      error: (err) => { this.loadingStats = false; console.error(err); }
    });
  }

  loadPredictionOccupation(): void {
    if (!this.predictionService) return;
    this.loadingPrediction = true;
    this.predictionOccupation = null;
    this.hospitalisationService.predireOccupation(this.predictionService).subscribe({
      next: (data) => { this.predictionOccupation = data; this.loadingPrediction = false; },
      error: (err) => { this.loadingPrediction = false; console.error(err); }
    });
  }

  loadPredictionDuree(): void {
    if (!this.predictionDureeService || !this.predictionDureeMotif) return;
    this.hospitalisationService.predireDuree(this.predictionDureeService, this.predictionDureeMotif).subscribe({
      next: (data) => { this.predictionDuree = data; },
      error: (err) => console.error(err)
    });
  }

  loadRecherche(): void {
    this.loadingRecherche = true;
    this.rechercheResults = [];
    const filtresClean: any = {};
    if (this.filtres.service) filtresClean.service = this.filtres.service;
    if (this.filtres.motif) filtresClean.motif = this.filtres.motif;
    if (this.filtres.statut) filtresClean.statut = this.filtres.statut;
    if (this.filtres.patientId) filtresClean.patientId = this.filtres.patientId;
    this.hospitalisationService.rechercheAvancee(filtresClean).subscribe({
      next: (data) => { this.rechercheResults = data; this.loadingRecherche = false; },
      error: (err) => { this.loadingRecherche = false; console.error(err); }
    });
  }

  loadHeatmap(): void {
    if (!this.heatmapService || !this.heatmapAnnee) return;
    this.loadingHeatmap = true;
    this.heatmapData = null;
    this.hospitalisationService.getCarteDeChалeur(this.heatmapService, this.heatmapAnnee).subscribe({
      next: (data) => { this.heatmapData = data; this.loadingHeatmap = false; },
      error: (err) => { this.loadingHeatmap = false; console.error(err); }
    });
  }

  loadProfil(): void {
    if (!this.profilPatientId) return;
    this.loadingProfil = true;
    this.profilData = null;
    this.hospitalisationService.getProfilMedical(this.profilPatientId).subscribe({
      next: (data) => { this.profilData = data; this.loadingProfil = false; },
      error: (err) => { this.loadingProfil = false; console.error(err); }
    });
  }

  onSubmit(): void {
    if (this.hospitalisationForm.invalid) { this.error = 'Veuillez remplir tous les champs'; return; }
    const data: Hospitalisation = this.hospitalisationForm.value;
    this.hospitalisationService.add(data).subscribe({
      next: () => { this.error = ''; this.resetForm(); this.loadHospitalisations(); this.activeTab = 'list'; },
      error: (err) => { this.error = "Erreur lors de l'ajout"; console.error(err); }
    });
  }

  deleteItem(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer?')) {
      this.hospitalisationService.delete(id).subscribe({
        next: () => this.loadHospitalisations(),
        error: (err) => console.error(err)
      });
    }
  }

  resetForm(): void {
    this.hospitalisationForm.reset({ statut: 'actif' });
  }
}
