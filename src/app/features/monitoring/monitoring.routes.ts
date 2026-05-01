import { Routes } from '@angular/router';

// Vital Signs
import { VitalSignListComponent } from './vital-signs/vital-sign-list/vital-sign-list.component';
import { VitalSignFormComponent } from './vital-signs/vital-sign-form/vital-sign-form.component';
import { VitalSignDetailComponent } from './vital-signs/vital-sign-detail/vital-sign-detail.component';
import { VitalSignsTrendComponent } from './vital-signs/vital-signs-trend/vital-signs-trend.component';

// Alerts (rename to avoid conflict with UI AlertsComponent)
import { AlertListComponent } from './alerts/alert-list/alert-list.component';
import { AlertDetailComponent } from './alerts/alert-detail/alert-detail.component';

// Alert Thresholds
import { ThresholdListComponent } from './alert-thresholds/threshold-list/threshold-list.component';
import { ThresholdFormComponent } from './alert-thresholds/threshold-form/threshold-form.component';

// Growth Charts
import { GrowthChartListComponent } from './growth-charts/growth-chart-list/growth-chart-list.component';
import { GrowthChartFormComponent } from './growth-charts/growth-chart-form/growth-chart-form.component';
import { GrowthCurveComponent } from './growth-charts/growth-curve/growth-curve.component';

// Renal Functions
import { RenalFunctionDetailComponent } from './renal-functions/renal-function-detail/renal-function-detail.component';
import { RenalFunctionFormComponent } from './renal-functions/renal-function-form/renal-function-form.component';
import { RenalFunctionListComponent } from './renal-functions/renal-function-list/renal-function-list.component';
import { MonitoringDashboardComponent } from './dashboard/monitoring-dashboard.component';

// Medical Notes
import { NoteListComponent } from './medical-notes/note-list/note-list.component';
import { NoteFormComponent } from './medical-notes/note-form/note-form.component';

export const monitoringRoutes: Routes = [
  // Monitoring dashboard
  {
    path: 'monitoring',
    component: MonitoringDashboardComponent,
    title: 'Monitoring Dashboard | Pediatric Nephrology System'
  },
  // Vital Signs routes
  {
    path: 'vital-signs',
    component: VitalSignListComponent,
    title: 'Vital Signs | Pediatric Nephrology System'
  },
  {
    path: 'vital-signs/new',
    component: VitalSignFormComponent,
    title: 'Add Vital Sign | Pediatric Nephrology System'
  },
  {
    path: 'vital-signs/trends',
    component: VitalSignsTrendComponent,
    title: 'Vital Signs Trends | Pediatric Nephrology System'
  },
  {
    path: 'vital-signs/:id',
    component: VitalSignDetailComponent,
    title: 'Vital Sign Details | Pediatric Nephrology System'
  },
  {
    path: 'vital-signs/:id/edit',
    component: VitalSignFormComponent,
    title: 'Edit Vital Sign | Pediatric Nephrology System'
  },
  // Patient Alerts routes (different from UI alerts)
  {
    path: 'patient-alerts',
    component: AlertListComponent,
    title: 'Patient Alerts | Pediatric Nephrology System'
  },
  {
    path: 'patient-alerts/:id',
    component: AlertDetailComponent,
    title: 'Alert Details | Pediatric Nephrology System'
  },
  // Alert Thresholds routes
  {
    path: 'thresholds',
    component: ThresholdListComponent,
    title: 'Alert Thresholds | Pediatric Nephrology System'
  },
  {
    path: 'thresholds/new',
    component: ThresholdFormComponent,
    title: 'Add Threshold | Pediatric Nephrology System'
  },
  {
    path: 'thresholds/:id/edit',
    component: ThresholdFormComponent,
    title: 'Edit Threshold | Pediatric Nephrology System'
  },
  // Growth Charts routes
  {
    path: 'growth-charts',
    component: GrowthChartListComponent,
    title: 'Growth Charts | Pediatric Nephrology System'
  },
  {
    path: 'growth-charts/curve',
    component: GrowthCurveComponent,
    title: 'Growth Curve | Pediatric Nephrology System'
  },
  {
    path: 'growth-charts/new',
    component: GrowthChartFormComponent,
    title: 'Add Growth Chart | Pediatric Nephrology System'
  },
  // Renal Functions routes
  {
    path: 'renal-functions',
    component: RenalFunctionListComponent,
    title: 'Renal Functions | Pediatric Nephrology System'
  },
  {
    path: 'renal-functions/new',
    component: RenalFunctionFormComponent,
    title: 'Add Renal Function | Pediatric Nephrology System'
  },
  {
    path: 'renal-functions/:id',
    component: RenalFunctionDetailComponent,
    title: 'Renal Function | Pediatric Nephrology System'
  },
  {
    path: 'renal-functions/:id/edit',
    component: RenalFunctionFormComponent,
    title: 'Edit Renal Function | Pediatric Nephrology System'
  },
  // Medical Notes routes
  {
    path: 'medical-notes',
    component: NoteListComponent,
    title: 'Medical Notes | Pediatric Nephrology System'
  },
  {
    path: 'medical-notes/new',
    component: NoteFormComponent,
    title: 'Add Medical Note | Pediatric Nephrology System'
  },
  {
    path: 'medical-notes/:id/edit',
    component: NoteFormComponent,
    title: 'Edit Medical Note | Pediatric Nephrology System'
  },
];