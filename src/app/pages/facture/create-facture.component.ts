import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  Action,
  FactureRequestDTO,
  FactureService,
  FactureUser
} from './facture.service';

@Component({
  selector: 'app-create-facture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-facture.component.html'
})
export class CreateFactureComponent implements OnInit {
  factureForm!: FormGroup;
  patients: FactureUser[] = [];
  actions: Action[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadActions();
  }

  initForm(): void {
    this.factureForm = this.fb.group({
      idPatient: ['', Validators.required],
      actionIds: [[], Validators.required]
    });
  }

  loadPatients(): void {
    this.factureService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Erreur chargement patients :', err);
      }
    });
  }

  loadActions(): void {
    this.factureService.getActions().subscribe({
      next: (data) => {
        this.actions = data;
      },
      error: (err) => {
        console.error('Erreur chargement actions :', err);
      }
    });
  }

  onActionToggle(actionId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current: number[] = [...this.factureForm.value.actionIds];

    if (checked) {
      if (!current.includes(actionId)) {
        current.push(actionId);
      }
    } else {
      const index = current.indexOf(actionId);
      if (index > -1) {
        current.splice(index, 1);
      }
    }

    this.factureForm.patchValue({ actionIds: current });
    this.factureForm.get('actionIds')?.updateValueAndValidity();
  }

  isChecked(actionId: number): boolean {
    return this.factureForm.value.actionIds.includes(actionId);
  }

  get selectedActions(): Action[] {
    const ids: number[] = this.factureForm.value.actionIds || [];
    return this.actions.filter(a => ids.includes(a.id));
  }

  get totalPreview(): number {
    return this.selectedActions.reduce((sum, action) => sum + action.prixAct, 0);
  }

  onSubmit(): void {
    if (this.factureForm.invalid) {
      this.factureForm.markAllAsTouched();
      return;
    }

    const payload: FactureRequestDTO = {
      idPatient: Number(this.factureForm.value.idPatient),
      actionIds: this.factureForm.value.actionIds
    };

    this.factureService.createFacture(payload).subscribe({
      next: () => this.router.navigate(['/factures']),
      error: (err) => console.error('Erreur création facture :', err)
    });
  }
}
