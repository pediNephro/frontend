import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { MedicalRecordService } from '../../shared/services/medical-record.service';
import { PatientService } from '../../shared/services/patient.service';
import { AuthService } from '../../shared/services/auth.service';
import { RejetPredictionService, RejetPredictionRequest, RejetPredictionResponse } from '../../shared/services/rejet-prediction.service';
import { MedicalRecordDTO, PatientDTO } from '../../shared/models/patient.models';
import { UserResponse } from '../../shared/models/auth.models';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  selector: 'app-dossiers',
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, ComponentCardComponent, NgApexchartsModule],
  templateUrl: './dossiers.component.html',
})
export class DossiersComponent implements OnInit {
  searchTerm = '';

  // Modal state
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  dossierToDelete: MedicalRecordDTO | null = null;
  isNurse = false;

  formDossier: MedicalRecordDTO = this.emptyDossier();

  dossiers: MedicalRecordDTO[] = [];
  patients: PatientDTO[] = [];
  doctors: UserResponse[] = [];

  isAnalyzing = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  formSubmitted = false;

  // Prediction state
  showPredictionModal = false;
  isPredicting = false;
  predictionResult: RejetPredictionResponse | null = null;
  predictionForm: RejetPredictionRequest = this.emptyPredictionForm();

  // Sort state
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Chart
  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'donut',
    height: 310,
    fontFamily: 'Outfit, sans-serif',
  };
  chartLabels: string[] = ['Active', 'Archived'];
  chartColors: string[] = ['#34D399', '#94A3B8'];
  chartLegend: ApexLegend = {
    position: 'bottom',
    fontSize: '14px',
    markers: { strokeWidth: 0 },
  };
  chartDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: { fontSize: '13px', fontWeight: 600 },
  };
  chartPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '16px',
            fontWeight: 600,
          },
        },
      },
    },
  };
  chartResponsive: ApexResponsive[] = [
    { breakpoint: 480, options: { chart: { height: 280 } } },
  ];

  constructor(
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService,
    private authService: AuthService,
    private rejetPredictionService: RejetPredictionService
  ) { }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isNurse = role === 'NURSE';
    this.loadDossiers();
    this.loadPatients();
    this.loadDoctors();
  }

  loadDossiers(): void {
    this.medicalRecordService.getAllRecords().subscribe({
      next: (data) => {
        this.dossiers = data;
        this.updateChart();
      },
      error: (err) => console.error('Erreur chargement dossiers:', err)
    });
  }

  updateChart(): void {
    const active = this.dossiers.filter(d => !d.isArchived).length;
    const archived = this.dossiers.filter(d => d.isArchived).length;
    this.chartSeries = [active, archived];
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Erreur chargement patients:', err)
    });
  }

  loadDoctors(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.doctors = users.filter(u => u.roleName === 'DOCTOR');
      },
      error: (err) => console.error('Erreur chargement médecins:', err)
    });
  }

  get filteredDossiers(): MedicalRecordDTO[] {
    let result = this.dossiers;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.diagnosis.toLowerCase().includes(term) ||
          (d.treatment && d.treatment.toLowerCase().includes(term)) ||
          (d.notes && d.notes.toLowerCase().includes(term)) ||
          this.getPatientName(d.patientId).toLowerCase().includes(term)
      );
    }

    if (this.sortColumn) {
      result = [...result].sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (this.sortColumn) {
          case 'patient':
            valA = this.getPatientName(a.patientId).toLowerCase();
            valB = this.getPatientName(b.patientId).toLowerCase();
            break;
          case 'doctor':
            valA = this.getDoctorName(a.doctorId).toLowerCase();
            valB = this.getDoctorName(b.doctorId).toLowerCase();
            break;
          case 'diagnosis':
            valA = a.diagnosis.toLowerCase();
            valB = b.diagnosis.toLowerCase();
            break;
          case 'treatment':
            valA = (a.treatment || '').toLowerCase();
            valB = (b.treatment || '').toLowerCase();
            break;
          case 'date':
            valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;
          case 'status':
            valA = a.isArchived ? 1 : 0;
            valB = b.isArchived ? 1 : 0;
            break;
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  emptyDossier(): MedicalRecordDTO {
    return {
      patientId: 0,
      doctorId: 0,
      diagnosis: '',
      treatment: '',
      notes: '',
      isArchived: false,
    };
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : `Patient #${patientId}`;
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : `Méd. #${doctorId}`;
  }

  openAddModal() {
    this.isEditing = false;
    this.formDossier = this.emptyDossier();
    this.formSubmitted = false;
    this.selectedImage = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(dossier: MedicalRecordDTO) {
    this.isEditing = true;
    this.formDossier = { ...dossier };
    this.formSubmitted = false;
    this.selectedImage = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDossier(form: any) {
    this.formSubmitted = true;

    // Validate required fields
    const hasImage = this.selectedImage !== null || !!this.formDossier.imageUrl;
    if (
      form.invalid ||
      this.formDossier.patientId === 0 ||
      this.formDossier.doctorId === 0 ||
      !this.formDossier.diagnosis.trim() ||
      !this.formDossier.treatment?.trim() ||
      !this.formDossier.notes?.trim() ||
      !hasImage
    ) {
      return;
    }

    if (this.isEditing && this.formDossier.id) {
      this.medicalRecordService.updateRecord(this.formDossier.id, this.formDossier).subscribe({
        next: (updated) => {
          const idx = this.dossiers.findIndex((d) => d.id === updated.id);
          if (idx !== -1) this.dossiers[idx] = updated;

          // Upload image if selected
          if (this.selectedImage && this.formDossier.id) {
            this.medicalRecordService.uploadImage(this.formDossier.id, this.selectedImage).subscribe({
              next: (updatedWithImage) => {
                const imageIdx = this.dossiers.findIndex((d) => d.id === updatedWithImage.id);
                if (imageIdx !== -1) this.dossiers[imageIdx] = updatedWithImage;
                this.showModal = false;
                this.selectedImage = null;
                this.imagePreview = null;
              },
              error: (err) => console.error('Erreur upload image:', err)
            });
          } else {
            this.showModal = false;
          }
        },
        error: (err) => console.error('Erreur mise à jour dossier:', err)
      });
    } else {
      this.medicalRecordService.createRecord(this.formDossier).subscribe({
        next: (created) => {
          this.dossiers.push(created);

          // Upload image if selected
          if (this.selectedImage && created.id) {
            this.medicalRecordService.uploadImage(created.id, this.selectedImage).subscribe({
              next: (createdWithImage) => {
                const idx = this.dossiers.findIndex((d) => d.id === createdWithImage.id);
                if (idx !== -1) this.dossiers[idx] = createdWithImage;
                this.showModal = false;
                this.selectedImage = null;
                this.imagePreview = null;
              },
              error: (err) => console.error('Erreur upload image:', err)
            });
          } else {
            this.showModal = false;
          }
        },
        error: (err) => console.error('Erreur création dossier:', err)
      });
    }
  }

  confirmDelete(dossier: MedicalRecordDTO) {
    this.dossierToDelete = dossier;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.dossierToDelete = null;
  }

  deleteDossier() {
    if (this.dossierToDelete && this.dossierToDelete.id) {
      this.medicalRecordService.deleteRecord(this.dossierToDelete.id).subscribe({
        next: () => {
          this.dossiers = this.dossiers.filter((d) => d.id !== this.dossierToDelete!.id);
          this.showDeleteModal = false;
          this.dossierToDelete = null;
        },
        error: (err) => console.error('Erreur suppression dossier:', err)
      });
    }
  }

  getStatutColor(isArchived: boolean): string {
    return isArchived
      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
      : 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  analyzeDossier(dossier: MedicalRecordDTO): void {
    if (!dossier.id) return;

    this.isAnalyzing = true;
    this.medicalRecordService.analyzeRecord(dossier.id).subscribe({
      next: (response) => {
        console.log('Analyse terminée:', response.analysis);
        this.isAnalyzing = false;
        // Optional: show in a modal or alert
        alert('Analyse complétée! Téléchargez le PDF pour voir les détails.');
      },
      error: (err) => {
        console.error('Erreur analyse:', err);
        this.isAnalyzing = false;
      }
    });
  }

  downloadAnalysisPdf(dossier: MedicalRecordDTO): void {
    if (!dossier.id) return;

    this.medicalRecordService.downloadAnalysisPdf(dossier.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analyse-dossier-${dossier.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erreur téléchargement PDF:', err)
    });
  }

  // --- Rejection Prediction ---

  emptyPredictionForm(): RejetPredictionRequest {
    return {
      creatinine_umoll: 80,
      uree_mmoll: 6,
      proteinurie_24h: 100,
      tacrolimus_taux_ngml: 8,
      pression_arterielle_sys: 110,
      pression_arterielle_dia: 70,
      score_banff: 0,
      age_mois: 120,
      poids_kg: 30,
      jours_post_greffe: 365,
      dfg_ml_min: 90,
      hemoglobine_gdl: 12,
      crp_mgl: 3,
      variation_creatinine: 5,
    };
  }

  openPredictionModal(): void {
    this.predictionForm = this.emptyPredictionForm();
    this.predictionResult = null;
    this.showPredictionModal = true;
  }

  closePredictionModal(): void {
    this.showPredictionModal = false;
    this.predictionResult = null;
  }

  submitPrediction(): void {
    this.isPredicting = true;
    this.predictionResult = null;
    this.rejetPredictionService.predict(this.predictionForm).subscribe({
      next: (result) => {
        this.predictionResult = result;
        this.isPredicting = false;
      },
      error: (err) => {
        console.error('Prediction error:', err);
        this.isPredicting = false;
        alert('ML service unavailable. Make sure the Python API is running on port 8001.');
      }
    });
  }

  getRiskColor(classe: string): string {
    switch (classe) {
      case 'FAIBLE': return 'text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-400';
      case 'MODERE': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/15 dark:text-yellow-400';
      case 'ELEVE': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/15 dark:text-orange-400';
      case 'CRITIQUE': return 'text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  getRiskProgressColor(classe: string): string {
    switch (classe) {
      case 'FAIBLE': return 'bg-green-500';
      case 'MODERE': return 'bg-yellow-500';
      case 'ELEVE': return 'bg-orange-500';
      case 'CRITIQUE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

}
