// surveillance-protocol-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SurveillanceProtocolService } from '../../../../core/services/transplant/surveillance-protocol.service';
import { SurveillanceProtocol, SurveillanceProtocolDTO, TransplantPhase } from '../../../../core/models/transplant/surveillance-protocol.model';

@Component({
  selector: 'app-surveillance-protocol-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './surveillance-protocol-form.component.html',
  styleUrls: ['./surveillance-protocol-form.component.css']
})
export class SurveillanceProtocolFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  isEditMode = false;
  transplantId: number;
  protocolId: number | null = null;
  protocol: SurveillanceProtocol | null = null;

  transplantPhases = Object.values(TransplantPhase);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private surveillanceProtocolService: SurveillanceProtocolService
  ) {
    this.form = this.fb.group({
      currentPhase: ['', Validators.required],
      nextConsultationDate: [''],
      nextLabTestDate: [''],
      consultationFrequency: [30, [Validators.required, Validators.min(1)]],
      labTestFrequency: [7, [Validators.required, Validators.min(1)]]
    });

    this.transplantId = +this.route.snapshot.params['transplantId'];
    this.protocolId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEditMode = !!this.protocolId;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.protocolId) {
      this.loadProtocol();
    }
  }

  loadProtocol(): void {
    if (!this.protocolId) return;

    this.isLoading = true;
    this.error = null;

    this.surveillanceProtocolService.getById(this.protocolId).subscribe({
      next: (protocol) => {
        this.protocol = protocol;
        this.populateForm(protocol);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load surveillance protocol';
        this.isLoading = false;
        console.error('Error loading protocol:', error);
      }
    });
  }

  populateForm(protocol: SurveillanceProtocol): void {
    this.form.patchValue({
      currentPhase: protocol.currentPhase,
      nextConsultationDate: protocol.nextConsultationDate ? this.formatDateForInput(protocol.nextConsultationDate) : '',
      nextLabTestDate: protocol.nextLabTestDate ? this.formatDateForInput(protocol.nextLabTestDate) : '',
      consultationFrequency: protocol.consultationFrequency,
      labTestFrequency: protocol.labTestFrequency
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.form.value;
    const dto: SurveillanceProtocolDTO = {
      transplantId: this.transplantId,
      currentPhase: formValue.currentPhase,
      nextConsultationDate: formValue.nextConsultationDate || undefined,
      nextLabTestDate: formValue.nextLabTestDate || undefined,
      consultationFrequency: formValue.consultationFrequency,
      labTestFrequency: formValue.labTestFrequency
    };

    const operation = this.isEditMode && this.protocolId
      ? this.surveillanceProtocolService.update(this.protocolId, dto)
      : this.surveillanceProtocolService.create(dto);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        const successMessage = this.isEditMode ? 'Surveillance protocol updated successfully' : 'Surveillance protocol created successfully';
        this.router.navigate(['/kidney-transplants', this.transplantId, 'surveillance-protocols'], {
          queryParams: { success: successMessage }
        });
      },
      error: (error) => {
        this.error = this.isEditMode ? 'Failed to update surveillance protocol' : 'Failed to create surveillance protocol';
        this.isSubmitting = false;
        console.error('Error saving protocol:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/kidney-transplants', this.transplantId, 'surveillance-protocols']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getPhaseDisplayName(phase: TransplantPhase): string {
    switch (phase) {
      case TransplantPhase.IMMEDIATE:
        return 'Immediate (J0-J15)';
      case TransplantPhase.EARLY:
        return 'Early (J15-M3)';
      case TransplantPhase.LONG_TERM:
        return 'Long Term (>M3)';
      default:
        return phase;
    }
  }

  getPhaseDescription(phase: TransplantPhase): string {
    switch (phase) {
      case TransplantPhase.IMMEDIATE:
        return 'Immediate post-transplant period (0-15 days) with intensive monitoring';
      case TransplantPhase.EARLY:
        return 'Early post-transplant period (15 days - 3 months) with regular follow-up';
      case TransplantPhase.LONG_TERM:
        return 'Long-term follow-up (>3 months) with routine surveillance';
      default:
        return '';
    }
  }
}