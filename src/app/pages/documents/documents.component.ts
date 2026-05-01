import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentMedicalService, DocumentMedical, CompletudeDossier } from '../../services/document-medical.service';
import { PatientService, Patient } from '../../services/patient.service';
import Tesseract from 'tesseract.js';

type TabType = 'list' | 'add';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {

  activeTab: TabType = 'list';
  documents: DocumentMedical[] = [];
  patients: Patient[] = [];
  loading = false;
  errorMessage = '';
  formError = '';
  // Risk: backend returns [{risk: "FAIBLE"|"MODERE"|"CRITIQUE"}, ...]
  riskLevel: string | null = null;

  // Pagination
  page = 0;
  totalPages = 0;
  filterDate = '';

  newDocument: DocumentMedical = this.initDocument();
  isEditMode = false;
  editingId?: number;

  showDeleteModal = false;
  deletingId?: number;

  filterPatientId = 0;
  filterType = '';

  // Upload + OCR
  selectedFile: File | null = null;
  ocrLoading = false;
  ocrSaved = false;

  // Complétude
  completudeResult: CompletudeDossier | null = null;
  completudeLoading = false;

  // Classification IA
  classificationEnCours = false;
  classificationResult: any = null;

  searchQuery = '';

  readonly typesDocument = [
    'PDF', 'COMPTE_RENDU', 'COURRIER', 'ORDONNANCE',
    'BILAN', 'RADIO', 'CONSENTEMENT', 'AUTRE'
  ];

  readonly categories = [
    'HOSPITALISATION', 'CONSULTATION', 'URGENCE',
    'CHIRURGIE', 'BIOLOGIE', 'IMAGERIE', 'AUTRE'
  ];

  constructor(
    private service: DocumentMedicalService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadPatients();
  }

  switchTab(tab: TabType) {
    if (tab !== 'add') {
      this.isEditMode = false;
      this.editingId = undefined;
      this.formError = '';
      this.resetFileState();
      this.classificationResult = null;
    }
    this.activeTab = tab;
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data) => { this.documents = data; this.loading = false; },
      error: (err) => {
        this.errorMessage = 'Erreur chargement : ' + (err.status || err.message);
        this.loading = false;
      }
    });
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Erreur patients', err)
    });
  }

  // =========================================================
  // UPLOAD + OCR
  // =========================================================

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile = file;
    this.newDocument.nomFichier = file.name;
    this.formError = '';
    this.classificationResult = null;

    if (file.type === 'application/pdf') {
      this.formError = 'OCR non supporté pour PDF — utiliser une image JPG/PNG';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError = 'Format non supporté pour OCR';
      return;
    }

    this.ocrLoading = true;

    Tesseract.recognize(file, 'eng+fra+ara')
      .then(({ data: { text } }) => {
        this.newDocument.contenuOcr = text;
        this.ocrLoading = false;
        this.classifierTexte(text);
      })
      .catch((err) => {
        console.error(err);
        this.formError = 'Erreur OCR';
        this.ocrLoading = false;
      });
  }

  classifierTexte(texte: string) {
    if (!texte || texte.trim().length < 10) return;
    this.classificationEnCours = true;
    this.service.classifier(texte).subscribe({
      next: (result) => {
        this.classificationResult = result;
        this.classificationEnCours = false;
        if (result.confiance !== 'FAIBLE') {
          this.newDocument.type = result.type;
        }
      },
      error: () => { this.classificationEnCours = false; }
    });
  }

  removeFile() {
    this.resetFileState();
    this.newDocument.nomFichier = '';
    this.newDocument.contenuOcr = '';
    this.classificationResult = null;
  }

  private resetFileState() {
    this.selectedFile = null;
    this.ocrLoading = false;
    this.ocrSaved = false;
  }

  // =========================================================
  // COMPLÉTUDE DOSSIER
  // =========================================================

  verifierCompletude() {
    if (this.filterPatientId === 0) return;
    this.completudeLoading = true;
    this.completudeResult = null;
    this.service.verifierCompletude(this.filterPatientId).subscribe({
      next: (data) => { this.completudeResult = data; this.completudeLoading = false; },
      error: (err) => { console.error(err); this.completudeLoading = false; }
    });
  }

  // =========================================================
  // EXPORT PDF
  // =========================================================

  exporterPdf() {
    if (this.filterPatientId === 0) return;
    this.service.exporterPdf(this.filterPatientId);
  }

  // =========================================================
  // FILTRES ET RECHERCHE
  // =========================================================

  appliquerFiltres() {
    this.completudeResult = null;
    this.loading = true;
    this.service.filter(this.filterPatientId, this.filterType, this.filterDate, this.page, 5)
      .subscribe({
        next: (res) => { this.documents = res.content; this.totalPages = res.totalPages; this.loading = false; },
        error: (err) => { console.error(err); this.loading = false; }
      });
  }

  resetFiltres() {
    this.filterPatientId = 0;
    this.filterType = '';
    this.filterDate = '';
    this.page = 0;
    this.completudeResult = null;
    this.riskLevel = null;
    this.load();
  }

  searchOCR() {
    if (!this.searchQuery.trim()) { this.load(); return; }
    this.service.searchOCR(this.searchQuery).subscribe({
      next: (data) => { this.documents = data; },
      error: (err) => console.error(err)
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) { this.page++; this.appliquerFiltres(); }
  }

  prevPage() {
    if (this.page > 0) { this.page--; this.appliquerFiltres(); }
  }

  onPatientChange() {
    if (!this.filterPatientId || this.filterPatientId === 0) return;
    this.loadIntelligence();
  }

  loadIntelligence() {
    this.riskLevel = null;
    this.service.getRisk(this.filterPatientId).subscribe({
      next: (res) => {
        // res = [{risk: "FAIBLE"|"MODERE"|"CRITIQUE"}, ...] — pick the highest
        const order: Record<string, number> = { CRITIQUE: 3, MODERE: 2, FAIBLE: 1 };
        const max = res.reduce((best: { risk: string }, cur: { risk: string }) =>
          (order[cur.risk] ?? 0) > (order[best.risk] ?? 0) ? cur : best,
          { risk: 'FAIBLE' }
        );
        this.riskLevel = max.risk;
      },
      error: () => {}
    });
  }

  // =========================================================
  // SAVE / EDIT / DELETE
  // =========================================================

  saveDocument() {
    this.formError = '';
    this.newDocument.patientId = Number(this.newDocument.patientId);
    this.newDocument.dateUpload = new Date(this.newDocument.dateUpload).toISOString().split('T')[0];

    if (this.isEditMode && this.editingId) {
      this.service.update(this.editingId, this.newDocument).subscribe({
        next: (updated) => {
          if (this.newDocument.contenuOcr && updated.id) {
            this.service.saveOcr(updated.id, this.newDocument.contenuOcr).subscribe({
              next: () => this.reset(), error: () => this.reset()
            });
          } else { this.reset(); }
        },
        error: (err) => { this.formError = err.error?.message || 'Erreur mise à jour.'; }
      });
    } else {
      this.service.create(this.newDocument).subscribe({
        next: (created) => {
          if (created.id && this.newDocument.contenuOcr) {
            this.service.saveOcr(created.id, this.newDocument.contenuOcr).subscribe({
              next: () => this.reset(), error: () => this.reset()
            });
          } else { this.reset(); }
        },
        error: (err) => { this.formError = err.error?.message || 'Erreur enregistrement.'; }
      });
    }
  }

  editDocument(doc: DocumentMedical) {
    this.newDocument = {
      nomFichier: doc.nomFichier,
      type: doc.type,
      dateUpload: new Date(doc.dateUpload).toISOString().split('T')[0],
      categorie: doc.categorie || '',
      patientId: Number(doc.patientId),
      contenuOcr: doc.contenuOcr || ''
    };
    this.editingId = doc.id;
    this.isEditMode = true;
    this.formError = '';
    this.classificationResult = null;
    this.activeTab = 'add';
  }

  cancelEdit() {
    this.newDocument = this.initDocument();
    this.isEditMode = false;
    this.editingId = undefined;
    this.formError = '';
    this.resetFileState();
    this.classificationResult = null;
    this.activeTab = 'list';
  }

  openDeleteModal(id: number) { this.deletingId = id; this.showDeleteModal = true; }

  confirmDelete() {
    if (!this.deletingId) return;
    this.service.delete(this.deletingId).subscribe({
      next: () => { this.load(); this.showDeleteModal = false; this.deletingId = undefined; },
      error: (err) => console.error('Erreur suppression', err)
    });
  }

  cancelDelete() { this.showDeleteModal = false; this.deletingId = undefined; }

  reset() {
    this.newDocument = this.initDocument();
    this.isEditMode = false;
    this.editingId = undefined;
    this.formError = '';
    this.resetFileState();
    this.classificationResult = null;
    this.load();
    this.activeTab = 'list';
  }

  // =========================================================
  // HELPERS
  // =========================================================

  getPatientName(id: number): string {
    const p = this.patients.find(x => x.id === id);
    return p ? `${p.nom} ${p.prenom}` : '—';
  }

  getConfianceBadgeClass(niveau: string | undefined): string {
    if (niveau === 'HAUTE') return 'bg-green-100 text-green-700';
    if (niveau === 'MOYENNE') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }

  getConfianceLabel(niveau: string | undefined): string {
    if (niveau === 'HAUTE') return 'Sûr';
    if (niveau === 'MOYENNE') return 'Incertain';
    return 'À vérifier';
  }

  private initDocument(): DocumentMedical {
    return { nomFichier: '', type: '', dateUpload: '', categorie: '', patientId: 0, contenuOcr: '' };
  }
}
