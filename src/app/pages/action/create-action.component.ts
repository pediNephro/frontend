import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Action, ActionService } from './action.service';

@Component({
  selector: 'app-create-action',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-action.component.html'
})
export class CreateActionComponent implements OnInit {
  actionForm!: FormGroup;
  isEditMode = false;
  actionId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.actionId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.actionId) {
      this.isEditMode = true;
      this.loadActionById();
    }
  }

  initForm(): void {
    this.actionForm = this.fb.group({
      categoryAct: ['', Validators.required],
      nomAct: ['', Validators.required],
      prixAct: [null, [Validators.required, Validators.min(0)]]
    });
  }

  loadActionById(): void {
    this.actionService.getActionById(this.actionId).subscribe({
      next: (data: Action) => {
        this.actionForm.patchValue({
          categoryAct: data.categoryAct,
          nomAct: data.nomAct,
          prixAct: data.prixAct
        });
      },
      error: (err) => {
        console.error('Erreur chargement action :', err);
      }
    });
  }

  onSubmit(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    const payload: Action = {
      ...this.actionForm.value,
      prixAct: Number(this.actionForm.value.prixAct)
    };

    if (this.isEditMode) {
      this.actionService.updateAction(this.actionId, payload).subscribe({
        next: () => this.router.navigate(['/actions']),
        error: (err) => console.error('Erreur update :', err)
      });
    } else {
      this.actionService.createAction(payload).subscribe({
        next: () => this.router.navigate(['/actions']),
        error: (err) => console.error('Erreur create :', err)
      });
    }
  }
}
