// File: src/app/pages/vital-signs/vital-sign-detail/vital-sign-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { VitalSign, Alert, MedicalNote, RenalFunction } from '../../../../core/models/monitoring';
import { VitalSignService } from '../../../../core/services/monitoring/vital-sign.service';

@Component({
  selector: 'app-vital-sign-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vital-sign-detail.component.html',
  styleUrl: './vital-sign-detail.component.css'
})
export class VitalSignDetailComponent implements OnInit {
  vitalSign: VitalSign | null = null;
  vitalSignId: number | null = null;
  loading = false;
  error: string | null = null;
  
  // Delete modal
  showDeleteModal = false;

  constructor(
    private vitalSignService: VitalSignService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vitalSignId = +id;
      this.loadVitalSign();
    } else {
      this.router.navigate(['/vital-signs']);
    }
  }

  loadVitalSign(): void {
    if (!this.vitalSignId) return;

    this.loading = true;
    this.error = null;

    this.vitalSignService.getById(this.vitalSignId).subscribe({
      next: (data) => {
        this.vitalSign = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load vital sign details';
        this.loading = false;
        console.error('Error loading vital sign:', err);
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.vitalSignId) return;

    this.vitalSignService.deleteById(this.vitalSignId).subscribe({
      next: () => {
        this.router.navigate(['/vital-signs']);
      },
      error: (err) => {
        this.error = 'Failed to delete vital sign';
        this.closeDeleteModal();
        console.error('Delete error:', err);
      }
    });
  }

  // Helper methods for display
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateBMI(): string {
    if (!this.vitalSign?.weight || !this.vitalSign?.height) return 'N/A';
    
    const heightInMeters = this.vitalSign.height / 100;
    const bmi = this.vitalSign.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  }

  getBMICategory(): string {
    const bmiValue = parseFloat(this.calculateBMI());
    if (isNaN(bmiValue)) return 'N/A';
    
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  }

  getBMICategoryClass(): string {
    const category = this.getBMICategory();
    
    if (category === 'Underweight') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (category === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (category === 'Overweight') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    if (category === 'Obese') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getBPStatus(): string {
    if (!this.vitalSign?.systolicBP || !this.vitalSign?.diastolicBP) return 'N/A';
    
    const systolic = this.vitalSign.systolicBP;
    const diastolic = this.vitalSign.diastolicBP;
    
    if (systolic >= 140 || diastolic >= 90) return 'Hypertension';
    if (systolic < 90 || diastolic < 60) return 'Hypotension';
    if (systolic >= 120 && systolic < 140) return 'Elevated';
    return 'Normal';
  }

  getBPStatusClass(): string {
    const status = this.getBPStatus();
    
    if (status === 'Hypertension') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status === 'Hypotension') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Elevated') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getHeartRateStatus(): string {
    if (!this.vitalSign?.heartRate) return 'N/A';
    
    const hr = this.vitalSign.heartRate;
    
    if (hr < 60) return 'Bradycardia';
    if (hr > 100) return 'Tachycardia';
    return 'Normal';
  }

  getHeartRateStatusClass(): string {
    const status = this.getHeartRateStatus();
    
    if (status === 'Bradycardia' || status === 'Tachycardia') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getTemperatureStatus(): string {
    if (!this.vitalSign?.temperature) return 'N/A';
    
    const temp = this.vitalSign.temperature;
    
    if (temp < 36.1) return 'Hypothermia';
    if (temp > 37.2 && temp < 38) return 'Low Fever';
    if (temp >= 38) return 'Fever';
    return 'Normal';
  }

  getTemperatureStatusClass(): string {
    const status = this.getTemperatureStatus();
    
    if (status === 'Hypothermia') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (status === 'Low Fever') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Fever') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getSpo2Status(): string {
    if (!this.vitalSign?.spo2) return 'N/A';
    
    const spo2 = this.vitalSign.spo2;
    
    if (spo2 < 90) return 'Critical';
    if (spo2 < 95) return 'Low';
    return 'Normal';
  }

  getSpo2StatusClass(): string {
    const status = this.getSpo2Status();
    
    if (status === 'Critical') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (status === 'Low') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (status === 'Normal') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  get hasAlerts(): boolean {
    return !!this.vitalSign?.alerts && this.vitalSign.alerts.length > 0;
  }

  get hasMedicalNotes(): boolean {
    return !!this.vitalSign?.medicalNotes && this.vitalSign.medicalNotes.length > 0;
  }

  get hasRenalFunction(): boolean {
    return !!this.vitalSign?.renalFunction;
  }
}