import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BiopsyService } from '../../../../core/services/transplant/biopsy.service';
import { KidneyTransplantService } from '../../../../core/services/transplant/kidney-transplant.service';
import {
  Biopsy,
  BiopsyDTO,
  BiopsyIndication,
  BanffCategory
} from '../../../../core/models/transplant/biopsy.model';
import { KidneyTransplant } from '../../../../core/models/transplant/kidney-transplant.model';

@Component({
  selector: 'app-biopsy-form',
  standalone: true,
  templateUrl: './biopsy-form.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class BiopsyFormComponent implements OnInit {

  @Input() transplantId?: number;
  @Output() saved = new EventEmitter<Biopsy>();

  form!: FormGroup;
  isLoading = false;
  error?: string;
  successMessage?: string;
  transplants: KidneyTransplant[] = [];
  isEdit = false;
  biopsyId?: number;

  indications = Object.values(BiopsyIndication);
  banffCategories = Object.values(BanffCategory);
  scoreRange = [0, 1, 2, 3];

  constructor(
    private fb: FormBuilder,
    private biopsyService: BiopsyService,
    private transplantService: KidneyTransplantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransplants();
    const routeTransplantId = this.route.snapshot.params['transplantId'];
    const effectiveTransplantId = this.transplantId || (routeTransplantId ? +routeTransplantId : undefined);
    this.biopsyId = +this.route.snapshot.params['id'];
    this.isEdit = !!this.biopsyId;

    this.form = this.fb.group({
      transplantId: [effectiveTransplantId || '', effectiveTransplantId ? [] : Validators.required],
      biopsyDate: ['', Validators.required],
      indication: ['', Validators.required],
      banffScoreT: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffScoreI: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffScoreG: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      banffCategory: ['', Validators.required],
      conclusion: ['', Validators.required],
      reportPath: ['']
    });

    if (this.isEdit) {
      this.loadBiopsy();
    }
  }

  loadTransplants(): void {
    this.transplantService.getAll().subscribe({
      next: (data) => this.transplants = data,
      error: () => this.error = 'Failed to load transplants.'
    });
  }

  loadBiopsy(): void {
    if (!this.biopsyId) return;
    this.biopsyService.getById(this.biopsyId).subscribe({
      next: (biopsy) => {
        this.form.patchValue({
          transplantId: biopsy.transplantId,
          biopsyDate: biopsy.biopsyDate ? new Date(biopsy.biopsyDate).toISOString().split('T')[0] : '',
          indication: biopsy.indication,
          banffScoreT: biopsy.banffScoreT,
          banffScoreI: biopsy.banffScoreI,
          banffScoreG: biopsy.banffScoreG,
          banffCategory: biopsy.banffCategory,
          conclusion: biopsy.conclusion,
          reportPath: biopsy.reportPath
        });
      },
      error: () => this.error = 'Failed to load biopsy.'
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getFieldError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['min']) return 'Minimum value is 0';
    if (c.errors['max']) return 'Maximum value is 3';
    return 'Invalid value';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.form.patchValue({ reportPath: file.name });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const dto: Partial<BiopsyDTO> = {
      ...this.form.value,
      biopsyDate: new Date(this.form.value.biopsyDate).toISOString()
    };

    if (this.isEdit && this.biopsyId) {
      this.biopsyService.update(this.biopsyId, dto).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.successMessage = 'Biopsy record updated successfully.';
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Failed to update biopsy record.';
        }
      });
    } else {
      this.biopsyService.create(dto as BiopsyDTO).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.successMessage = 'Biopsy record saved successfully.';
          this.saved.emit(result);
          this.form.reset({ transplantId: this.transplantId });
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Failed to save biopsy record.';
        }
      });
    }
  }
}