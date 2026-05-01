import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ImageMedicaleService, ImageMedicale, ComparaisonTemporelle, AnalyseIAResult } from '../../core/services/image-medicale.service';
import { PatientService, Patient } from '../../services/patient.service';
import Chart from 'chart.js/auto';

type TabType = 'list' | 'add';

@Component({
  selector: 'app-imaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imaging.component.html'
})
export class ImagingComponent implements OnInit {

  activeTab: TabType = 'list';
  images: ImageMedicale[] = [];
  patients: Patient[] = [];
  loading = false;
  errorMessage = '';
  formError = '';

  chart: Chart | null = null;

  newImage: ImageMedicale = this.initImage();
  isEditMode = false;
  editingId?: number;

  showDeleteModal = false;
  deletingId?: number;

  filterPatientId: number = 0;
  filterType: string = '';

  selectedImage: File | null = null;
  imagePreview: string = '';

  showViewer = false;
  viewerImage: ImageMedicale | null = null;
  zoom = 1;
  rotation = 0;

  showComparaison = false;
  comparaisonData: ComparaisonTemporelle | null = null;
  comparaisonLoading = false;

  analyseIAResult: string = '';
  alertesIA: string[] = [];
  analyseIALoading = false;

  evolutionIA: AnalyseIAResult | null = null;

  comparaisonsDetail: any[] = [];
  activeComparaisonIndex: number = 0;

  readonly typesImagerie = [
    'ECHOGRAPHIE', 'SCANNER', 'IRM', 'RADIO',
    'SCINTIGRAPHIE', 'ANGIOGRAPHIE', 'MAMMOGRAPHIE', 'AUTRE'
  ];

  constructor(
    private service: ImageMedicaleService,
    private patientService: PatientService,
    private http: HttpClient
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
      this.selectedImage = null;
      this.imagePreview = '';
    }
    this.activeTab = tab;
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data) => { this.images = data; this.loading = false; },
      error: (err) => { this.errorMessage = 'Erreur : ' + (err.status || err.message); this.loading = false; }
    });
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Erreur patients', err)
    });
  }

  // ============================================
  // UPLOAD CLOUDINARY
  // ============================================
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.formError = 'Seules les images sont autorisées';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.formError = 'Image trop grande (max 5MB)';
      return;
    }

    this.selectedImage = file;
    this.newImage.nomFichier = file.name;
    this.loading = true;
    this.formError = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset');

    this.http.post<any>(
      'https://api.cloudinary.com/v1_1/dwehbywnm/image/upload',
      formData
    ).subscribe({
      next: (res) => {
        this.newImage.urlStockage = res.secure_url;
        this.imagePreview = res.secure_url;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.formError = 'Erreur upload image';
        this.loading = false;
      }
    });
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = '';
    this.newImage.urlStockage = '';
    this.newImage.nomFichier = '';
  }

  // ============================================
  // VISIONNEUSE
  // ============================================
  openViewer(img: ImageMedicale) {
    this.viewerImage = img;
    this.zoom = 1;
    this.rotation = 0;
    this.showViewer = true;
  }

  closeViewer() { this.showViewer = false; this.viewerImage = null; }
  zoomIn() { if (this.zoom < 4) this.zoom += 0.25; }
  zoomOut() { if (this.zoom > 0.25) this.zoom -= 0.25; }
  rotateLeft() { this.rotation = (this.rotation - 90 + 360) % 360; }
  rotateRight() { this.rotation = (this.rotation + 90) % 360; }
  resetView() { this.zoom = 1; this.rotation = 0; }

  openViewerFromTimeline(img: any) {
    this.viewerImage = {
      id: img.id,
      typeImagerie: img.typeImagerie,
      dateExamen: img.dateExamen,
      urlStockage: img.urlStockage,
      description: img.description,
      nomFichier: img.nomFichier,
      patientId: this.filterPatientId
    };
    this.zoom = 1;
    this.rotation = 0;
    this.showViewer = true;
  }

  // ============================================
  // COMPARAISON + IA MULTI-IMAGES
  // ============================================
  ouvrirComparaison() {
    if (this.filterPatientId === 0) return;

    this.comparaisonLoading = true;
    this.analyseIALoading = true;
    this.comparaisonsDetail = [];
    this.activeComparaisonIndex = 0;
    this.evolutionIA = null;
    this.analyseIAResult = '';
    this.alertesIA = [];

    this.service.comparaisonTemporelle(this.filterPatientId).subscribe({
      next: (data) => {
        this.comparaisonData = data;
        this.showComparaison = true;
        this.comparaisonLoading = false;

        this.service.analyseIA(this.filterPatientId).subscribe({
          next: (iaData) => {
            this.evolutionIA = iaData;
            this.analyseIAResult = iaData.interpretation || '';
            this.alertesIA = (iaData as any).alertes || [];
            this.comparaisonsDetail = iaData.comparaisons || [];
            this.analyseIALoading = false;
            setTimeout(() => this.generateChart(data.timeline), 100);
          },
          error: () => {
            this.analyseIALoading = false;
            setTimeout(() => this.generateChart(data.timeline), 100);
          }
        });
      },
      error: () => {
        this.comparaisonLoading = false;
        this.analyseIALoading = false;
      }
    });
  }

  selectComparaison(index: number) {
    this.activeComparaisonIndex = index;
  }

  getEvolutionColor(evolution: string): string {
    switch (evolution) {
      case 'AGGRAVATION': return '#dc2626';
      case 'MODIFICATION': return '#d97706';
      case 'STABLE': return '#16a34a';
      default: return '#6b7280';
    }
  }

  getEvolutionIcon(evolution: string): string {
    switch (evolution) {
      case 'AGGRAVATION': return '⚠️';
      case 'MODIFICATION': return '🔍';
      case 'STABLE': return '✅';
      default: return '❓';
    }
  }

  // ============================================
  // GRAPHIQUE
  // ============================================
  generateChart(timeline: any[]) {
    if (!timeline || timeline.length < 2) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const canvas = document.getElementById('evolutionChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    if (this.comparaisonsDetail.length > 0) {
      this.comparaisonsDetail.forEach((comp, i) => {
        const fromDate = comp.from_date
          ? new Date(comp.from_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
          : `Exam ${i + 1}`;
        const toDate = comp.to_date
          ? new Date(comp.to_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
          : `Exam ${i + 2}`;
        labels.push(`${fromDate} → ${toDate}`);
        values.push(comp.variation || 0);
        const color = this.getChartColor(comp.evolution);
        backgroundColors.push(color.bg);
        borderColors.push(color.border);
      });
    } else {
      for (let i = 1; i < timeline.length; i++) {
        labels.push(String(timeline[i].dateExamen));
        values.push(0);
        backgroundColors.push('rgba(59, 130, 246, 0.5)');
        borderColors.push('rgb(59, 130, 246)');
      }
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Variation (%)',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 6,
            type: 'bar'
          },
          {
            label: 'Tendance',
            data: values,
            borderColor: 'rgba(99, 102, 241, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: borderColors,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false,
            tension: 0.4,
            type: 'line'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const val = ctx.parsed.y;
                const comp = this.comparaisonsDetail[ctx.dataIndex];
                if (comp) return [` Variation : ${val}%`, ` Évolution : ${comp.evolution}`];
                return ` Variation : ${val}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Variation (%)', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            title: { display: true, text: 'Comparaisons successives', font: { size: 11 } },
            ticks: { maxRotation: 30, font: { size: 10 } }
          }
        }
      }
    });
  }

  private getChartColor(evolution: string): { bg: string; border: string } {
    switch (evolution) {
      case 'AGGRAVATION': return { bg: 'rgba(220, 38, 38, 0.6)', border: 'rgb(220, 38, 38)' };
      case 'MODIFICATION': return { bg: 'rgba(217, 119, 6, 0.6)', border: 'rgb(217, 119, 6)' };
      case 'STABLE': return { bg: 'rgba(22, 163, 74, 0.6)', border: 'rgb(22, 163, 74)' };
      default: return { bg: 'rgba(107, 114, 128, 0.5)', border: 'rgb(107, 114, 128)' };
    }
  }

  // ============================================
  // FILTRES
  // ============================================
  appliquerFiltres() {
    this.loading = true;
    if (this.filterPatientId && this.filterType) {
      this.service.getByPatientAndType(this.filterPatientId, this.filterType)
        .subscribe({ next: (d: ImageMedicale[]) => { this.images = d; this.loading = false; }, error: () => { this.loading = false; } });
    } else if (this.filterPatientId) {
      this.service.getByPatient(this.filterPatientId)
        .subscribe({ next: (d: ImageMedicale[]) => { this.images = d; this.loading = false; }, error: () => { this.loading = false; } });
    } else {
      this.load();
    }
  }

  resetFiltres() {
    this.filterPatientId = 0;
    this.filterType = '';
    this.load();
  }

  // ============================================
  // FORMULAIRE
  // ============================================
  saveImage() {
    this.formError = '';

    if (!this.isEditMode && !this.newImage.urlStockage) {
      this.formError = 'Veuillez uploader une image.';
      return;
    }

    this.newImage.patientId = Number(this.newImage.patientId);
    this.newImage.dateExamen = new Date(this.newImage.dateExamen).toISOString().split('T')[0];

    if (this.isEditMode && this.editingId) {
      this.service.update(this.editingId, this.newImage).subscribe({
        next: () => this.reset(),
        error: (err: any) => { this.formError = err.error?.message || 'Erreur mise à jour.'; }
      });
    } else {
      this.service.create(this.newImage).subscribe({
        next: () => this.reset(),
        error: (err: any) => { this.formError = err.error?.message || 'Erreur enregistrement.'; }
      });
    }
  }

  editImage(img: ImageMedicale) {
    this.newImage = { ...img };
    this.imagePreview = img.urlStockage || '';
    this.editingId = img.id;
    this.isEditMode = true;
    this.activeTab = 'add';
  }

  cancelEdit() { this.reset(); }

  openDeleteModal(id: number) { this.deletingId = id; this.showDeleteModal = true; }

  confirmDelete() {
    if (!this.deletingId) return;
    this.service.delete(this.deletingId).subscribe({
      next: () => { this.showDeleteModal = false; this.deletingId = undefined; this.reset(); },
      error: (err) => console.error('Erreur suppression', err)
    });
  }

  cancelDelete() { this.showDeleteModal = false; this.deletingId = undefined; }

  reset() {
    this.newImage = this.initImage();
    this.selectedImage = null;
    this.imagePreview = '';
    this.isEditMode = false;
    this.editingId = undefined;
    this.formError = '';
    this.load();
    this.activeTab = 'list';
  }

  getPatientName(id: number): string {
    const p = this.patients.find(x => x.id === id);
    return p ? `${p.nom} ${p.prenom}` : '—';
  }

  private initImage(): ImageMedicale {
    return { typeImagerie: '', dateExamen: '', description: '', patientId: 0, urlStockage: '', nomFichier: '' };
  }
}
