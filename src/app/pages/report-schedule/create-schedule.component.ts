import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportScheduleService } from './report-schedule.service';
import { Template } from '../../shared/models/template.model';
import { SchedulingUser } from '../../shared/models/scheduling-user.model';

@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-schedule.component.html'
})
export class CreateScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;
  templates: Template[] = [];
  doctors: SchedulingUser[] = [];
  patients: SchedulingUser[] = [];
  isEditMode = false;
  scheduleId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reportScheduleService: ReportScheduleService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.scheduleId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.scheduleId) {
      this.isEditMode = true;
      this.reportScheduleService.getScheduleById(this.scheduleId)
        .subscribe(data => this.scheduleForm.patchValue(data));
    }

    this.loadTemplates();
    this.loadDoctors();
    this.loadPatients();
  }

  initForm(): void {
    this.scheduleForm = this.fb.group({
      scheduleName: ['', Validators.required],
      scheduleType: ['DAILY', Validators.required],
      nextExecutionDate: ['', Validators.required],
      active: [true],
      userId: ['', Validators.required],
      templateId: ['', Validators.required],
      doctorId: ['', Validators.required]
    });
  }

  loadTemplates(): void {
    this.reportScheduleService.getTemplates().subscribe({
      next: (data) => {
        this.templates = data.filter(t => t.active);
      },
      error: (err) => {
        console.error('Erreur chargement templates :', err);
      }
    });
  }

  loadDoctors(): void {
    this.reportScheduleService.getUsersByRole('DOCTOR').subscribe({
      next: (data) => {
        this.doctors = data.filter(u => u.active);
      },
      error: (err) => console.error(err)
    });
  }

  loadPatients(): void {
    this.reportScheduleService.getUsersByRole('PATIENT').subscribe({
      next: (data) => {
        this.patients = data.filter(u => u.active);
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (!this.scheduleForm.valid) return;

    if (this.isEditMode) {
      this.reportScheduleService.updateSchedule(this.scheduleId, this.scheduleForm.value)
        .subscribe(() => this.router.navigate(['/schedules']));
    } else {
      this.reportScheduleService.createSchedule(this.scheduleForm.value)
        .subscribe(() => this.router.navigate(['/schedules']));
    }
  }
}
