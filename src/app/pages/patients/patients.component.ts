import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PatientService } from '../../shared/services/patient.service';
import { MedicalRecordService } from '../../shared/services/medical-record.service';
import { AuthService } from '../../shared/services/auth.service';
import { PatientDTO, MedicalRecordDTO } from '../../shared/models/patient.models';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, FormsModule, PageBreadcrumbComponent, ComponentCardComponent],
  templateUrl: './patients.component.html',
})
export class PatientsComponent implements OnInit {
  searchTerm = '';

  // Modal state
  showModal = false;
  showDeleteModal = false;
  showRecordsModal = false;
  isEditing = false;
  patientToDelete: PatientDTO | null = null;
  isNurse = false;

  formPatient: PatientDTO = this.emptyPatient();
  formSubmitted = false;

  patients: PatientDTO[] = [];

  // Sort state
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Medical records for selected patient
  selectedPatient: PatientDTO | null = null;
  patientRecords: MedicalRecordDTO[] = [];
  loadingRecords = false;

  constructor(
    private patientService: PatientService,
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isNurse = role === 'NURSE';
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('Erreur chargement patients:', err)
    });
  }

  get filteredPatients(): PatientDTO[] {
    let result = this.patients;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(term) ||
          p.lastName.toLowerCase().includes(term) ||
          (p.phoneNumber && p.phoneNumber.includes(term))
      );
    }

    if (this.sortColumn) {
      result = [...result].sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (this.sortColumn) {
          case 'patient':
            valA = `${a.lastName} ${a.firstName}`.toLowerCase();
            valB = `${b.lastName} ${b.firstName}`.toLowerCase();
            break;
          case 'birthDate':
            valA = a.birthDate ? new Date(a.birthDate).getTime() : 0;
            valB = b.birthDate ? new Date(b.birthDate).getTime() : 0;
            break;
          case 'gender':
            valA = a.gender.toLowerCase();
            valB = b.gender.toLowerCase();
            break;
          case 'phone':
            valA = (a.phoneNumber || '').toLowerCase();
            valB = (b.phoneNumber || '').toLowerCase();
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

  emptyPatient(): PatientDTO {
    return {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'MALE',
      phoneNumber: '',
    };
  }

  openAddModal() {
    this.isEditing = false;
    this.formPatient = this.emptyPatient();
    this.formSubmitted = false;
    this.showModal = true;
  }

  openEditModal(patient: PatientDTO) {
    this.isEditing = true;
    this.formPatient = { ...patient };
    this.formSubmitted = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePatient(form: any) {
    this.formSubmitted = true;

    if (
      form.invalid ||
      !this.formPatient.lastName.trim() ||
      !this.formPatient.firstName.trim() ||
      !this.formPatient.birthDate ||
      !this.formPatient.phoneNumber?.trim() ||
      this.formPatient.phoneNumber.trim().length !== 8
    ) {
      return;
    }

    if (this.isEditing && this.formPatient.id) {
      this.patientService.updatePatient(this.formPatient.id, this.formPatient).subscribe({
        next: (updated) => {
          const idx = this.patients.findIndex((p) => p.id === updated.id);
          if (idx !== -1) this.patients[idx] = updated;
          this.showModal = false;
        },
        error: (err) => console.error('Erreur mise à jour patient:', err)
      });
    } else {
      this.patientService.createPatient(this.formPatient).subscribe({
        next: (created) => {
          this.patients.push(created);
          this.showModal = false;
        },
        error: (err) => console.error('Erreur création patient:', err)
      });
    }
  }

  confirmDelete(patient: PatientDTO) {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  deletePatient() {
    if (this.patientToDelete && this.patientToDelete.id) {
      this.patientService.deletePatient(this.patientToDelete.id).subscribe({
        next: () => {
          this.patients = this.patients.filter((p) => p.id !== this.patientToDelete!.id);
          this.showDeleteModal = false;
          this.patientToDelete = null;
        },
        error: (err) => console.error('Erreur suppression patient:', err)
      });
    }
  }

  // ── Medical Records ───────────────────────────────────────
  viewRecords(patient: PatientDTO) {
    this.selectedPatient = patient;
    this.patientRecords = [];
    this.loadingRecords = true;
    this.showRecordsModal = true;

    this.medicalRecordService.getRecordsByPatientId(patient.id!).subscribe({
      next: (records) => {
        this.patientRecords = records;
        this.loadingRecords = false;
      },
      error: (err) => {
        console.error('Erreur chargement dossiers:', err);
        this.loadingRecords = false;
      }
    });
  }

  closeRecordsModal() {
    this.showRecordsModal = false;
    this.selectedPatient = null;
    this.patientRecords = [];
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      case 'OTHER': return 'Other';
      default: return gender;
    }
  }
}
