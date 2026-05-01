import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EpisodeSoinService, EpisodeSoin } from '../../services/episode.service';
import { PatientService, Patient } from '../../services/patient.service';
import { HospitalisationSoinService, HospitalisationSoin } from '../../services/hospitalisation.service';

type TabType = 'list' | 'add' | 'fileattente' | 'timeline';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episodes.component.html',
})
export class EpisodesComponent implements OnInit {

  activeTab: TabType = 'list';
  episodes: EpisodeSoin[] = [];
  patients: Patient[] = [];
  hospitalisations: HospitalisationSoin[] = [];
  loading = false;
  formError = '';

  newEpisode: EpisodeSoin = this.initEpisode();
  isEditMode = false;
  editingId?: number;

  showDeleteModal = false;
  deletingId?: number;

  // File d'attente
  selectedServiceFile = 'Nephrologie';
  fileAttente: any = null;
  fileAttenteLoading = false;

  // Timeline
  selectedPatientTimeline = 0;
  timeline: any = null;
  timelineLoading = false;
  timelineError = '';

  constructor(
    private episodeService: EpisodeSoinService,
    private patientService: PatientService,
    private hospitalisationService: HospitalisationSoinService
  ) {}

  ngOnInit(): void {
    this.loadEpisodes();
    this.loadPatients();
    this.loadHospitalisations();
  }

  switchTab(tab: TabType) {
    if (tab !== 'add') {
      this.isEditMode = false;
      this.editingId = undefined;
      this.formError = '';
    }
    this.activeTab = tab;
  }

  loadEpisodes() {
    this.loading = true;
    this.episodeService.getAll().subscribe({
      next: (data) => { this.episodes = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error(err)
    });
  }

  loadHospitalisations() {
    this.hospitalisationService.getAll().subscribe({
      next: (data) => this.hospitalisations = data,
      error: (err) => console.error(err)
    });
  }

  // =========================================================
  // FILE D'ATTENTE
  // =========================================================

  loadFileAttente() {
    if (!this.selectedServiceFile) return;
    this.fileAttenteLoading = true;
    this.fileAttente = null;
    this.episodeService.getFileAttente(this.selectedServiceFile).subscribe({
      next: (data) => { this.fileAttente = data; this.fileAttenteLoading = false; },
      error: (err) => { console.error(err); this.fileAttenteLoading = false; }
    });
  }

  // =========================================================
  // TIMELINE
  // =========================================================

  loadTimeline() {
    if (!this.selectedPatientTimeline || this.selectedPatientTimeline === 0) return;
    this.timelineLoading = true;
    this.timeline = null;
    this.timelineError = '';
    this.episodeService.getTimeline(this.selectedPatientTimeline).subscribe({
      next: (data) => { this.timeline = data; this.timelineLoading = false; },
      error: (err) => {
        this.timelineError = 'Erreur chargement timeline : ' + (err.status || err.message);
        this.timelineLoading = false;
      }
    });
  }

  // =========================================================
  // SAVE / EDIT / DELETE
  // =========================================================

  saveEpisode() {
    this.formError = '';
    if (!this.newEpisode.type || !this.newEpisode.date || !this.newEpisode.description) {
      this.formError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.isEditMode && this.editingId) {
      this.episodeService.update(this.editingId, this.newEpisode).subscribe({
        next: () => this.reset(),
        error: (err) => { this.formError = err.error?.message || 'Erreur mise à jour.'; }
      });
    } else {
      this.episodeService.create(this.newEpisode).subscribe({
        next: () => this.reset(),
        error: (err) => { this.formError = err.error?.message || 'Erreur enregistrement.'; }
      });
    }
  }

  editEpisode(e: EpisodeSoin) {
    this.newEpisode = {
      type: e.type,
      date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
      description: e.description,
      hospitalisationId: e.hospitalisationId,
    };
    this.editingId = e.id;
    this.isEditMode = true;
    this.formError = '';
    this.activeTab = 'add';
  }

  deleteEpisode(id: number) {
    this.deletingId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.deletingId) return;
    this.episodeService.delete(this.deletingId).subscribe({
      next: () => { this.loadEpisodes(); this.showDeleteModal = false; this.deletingId = undefined; },
      error: (err) => console.error(err)
    });
  }

  cancelDelete() { this.showDeleteModal = false; this.deletingId = undefined; }

  cancelEdit() {
    this.newEpisode = this.initEpisode();
    this.isEditMode = false;
    this.editingId = undefined;
    this.formError = '';
    this.activeTab = 'list';
  }

  reset() {
    this.newEpisode = this.initEpisode();
    this.isEditMode = false;
    this.editingId = undefined;
    this.formError = '';
    this.loadEpisodes();
    this.activeTab = 'list';
  }

  // =========================================================
  // HELPERS
  // =========================================================

  getPrioriteClass(niveau: string): string {
    if (niveau === 'CRITIQUE') return 'border-red-300 bg-red-50';
    if (niveau === 'NORMAL') return 'border-yellow-300 bg-yellow-50';
    return 'border-gray-200 bg-gray-50';
  }

  getTimelineColor(type: string): string {
    const colors: Record<string, string> = {
      'Consultation': 'bg-blue-500',
      'Chirurgie': 'bg-red-500',
      'Analyse': 'bg-green-500',
      'Radiologie': 'bg-purple-500',
      'Urgence': 'bg-orange-500',
      'Dialyse': 'bg-cyan-500',
    };
    return colors[type] || 'bg-gray-400';
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  private initEpisode(): EpisodeSoin {
    return { type: '', date: '', description: '', hospitalisationId: 0 };
  }
}
