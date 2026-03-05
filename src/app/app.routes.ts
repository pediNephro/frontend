import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';

// ========== YOUR NEW MEDICAL SYSTEM IMPORTS ==========
// Vital Signs
import { VitalSignListComponent } from './features/monitoring/vital-signs/vital-sign-list/vital-sign-list.component';
import { VitalSignFormComponent } from './features/monitoring/vital-signs/vital-sign-form/vital-sign-form.component';
import { VitalSignDetailComponent } from './features/monitoring/vital-signs/vital-sign-detail/vital-sign-detail.component';
import { VitalSignsTrendComponent } from './features/monitoring/vital-signs/vital-signs-trend/vital-signs-trend.component';

// Alerts (rename to avoid conflict with UI AlertsComponent)
import { AlertListComponent } from './features/monitoring//alerts/alert-list/alert-list.component';
import { AlertDetailComponent } from './features/monitoring/alerts/alert-detail/alert-detail.component';

// Alert Thresholds
import { ThresholdListComponent } from './features/monitoring/alert-thresholds/threshold-list/threshold-list.component';
import { ThresholdFormComponent } from './features/monitoring/alert-thresholds/threshold-form/threshold-form.component';

// Growth Charts
import { GrowthChartListComponent } from './features/monitoring/growth-charts/growth-chart-list/growth-chart-list.component';
import { GrowthChartFormComponent } from './features/monitoring/growth-charts/growth-chart-form/growth-chart-form.component';
import { GrowthCurveComponent } from './features/monitoring/growth-charts/growth-curve/growth-curve.component';

// Renal Functions
import { RenalFunctionDetailComponent } from './features/monitoring/renal-functions/renal-function-detail/renal-function-detail.component';
import { RenalFunctionFormComponent } from './features/monitoring/renal-functions/renal-function-form/renal-function-form.component';
import { RenalFunctionListComponent } from './features/monitoring/renal-functions/renal-function-list/renal-function-list.component';
import { MonitoringDashboardComponent } from './features/monitoring/dashboard/monitoring-dashboard.component';

// Medical Notes
import { NoteListComponent } from './features/monitoring/medical-notes/note-list/note-list.component';
import { NoteFormComponent } from './features/monitoring/medical-notes/note-form/note-form.component';
import { TransplantFormComponent } from './features/transplant/kidney-transplant/transplant-form/transplant-form.component';
import { RejectionEpisodeFormComponent } from './features/transplant/rejection-episode/rejection-episode-form/rejection-episode-form.component';
import { RejectionEpisodeListComponent } from './features/transplant/rejection-episode/rejection-episode-list/rejection-episode-list.component';
import { RejectionEpisodeDetailComponent } from './features/transplant/rejection-episode/rejection-episode-detail/rejection-episode-detail.component';
import { TransplantListComponent } from './features/transplant/kidney-transplant/transplant-list/transplant-list.component';
import { TransplantDetailComponent } from './features/transplant/kidney-transplant/transplant-detail/transplant-detail.component';
import { BiopsyFormComponent } from './features/transplant/biopsy/biopsy-form/biopsy-form.component';
import { BiopsyListComponent } from './features/transplant/biopsy/biopsy-list/biopsy-list.component';
import { BiopsyDetailComponent } from './features/transplant/biopsy/biopsy-detail/biopsy-detail.component';
// New transplant features
import { ComplicationListComponent } from './features/transplant/complication/complication-list/complication-list.component';
import { ComplicationFormComponent } from './features/transplant/complication/complication-form/complication-form.component';
import { ComplicationDetailComponent } from './features/transplant/complication/complication-detail/complication-detail.component';
import { HlaCompatibilityListComponent } from './features/transplant/hla-compatibility/hla-compatibility-list/hla-compatibility-list.component';
import { HlaCompatibilityFormComponent } from './features/transplant/hla-compatibility/hla-compatibility-form/hla-compatibility-form.component';
import { HlaCompatibilityDetailComponent } from './features/transplant/hla-compatibility/hla-compatibility-detail/hla-compatibility-detail.component';
import { SurveillanceProtocolListComponent } from './features/transplant/surveillance-protocol/surveillance-protocol-list/surveillance-protocol-list.component';
import { SurveillanceProtocolFormComponent } from './features/transplant/surveillance-protocol/surveillance-protocol-form/surveillance-protocol-form.component';
import { SurveillanceProtocolDetailComponent } from './features/transplant/surveillance-protocol/surveillance-protocol-detail/surveillance-protocol-detail.component';
// =====================================================

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template',
      },
      {
        path: 'calendar',
        component: CalenderComponent,
        title: 'Angular Calender | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'form-elements',
        component: FormElementsComponent,
        title: 'Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'basic-tables',
        component: BasicTablesComponent,
        title: 'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'blank',
        component: BlankComponent,
        title: 'Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'invoice',
        component: InvoicesComponent,
        title: 'Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'line-chart',
        component: LineChartComponent,
        title: 'Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'bar-chart',
        component: BarChartComponent,
        title: 'Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        title: 'Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'avatars',
        component: AvatarElementComponent,
        title: 'Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'badge',
        component: BadgesComponent,
        title: 'Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        title: 'Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'images',
        component: ImagesComponent,
        title: 'Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'videos',
        component: VideosComponent,
        title: 'Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },

      // ========== YOUR NEW MEDICAL SYSTEM ROUTES ==========
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
      // ====================================================
      { path: 'transplant/new',
        component: TransplantFormComponent,
        title: 'Add Kidney Transplant | Pediatric Nephrology System'

      },
      { path: 'transplant',
        component: TransplantListComponent,
        title: 'Kidney Transplants | Pediatric Nephrology System'

      },
      { path: 'transplant/:id',
        component: TransplantDetailComponent,
        title: 'Kidney Transplant Details | Pediatric Nephrology System'

      },
 
      {
        path: 'biopsy',
        component: BiopsyListComponent,
        title: 'Biopsies | Pediatric Nephrology System'
      },
     
      {
        path: 'biopsy/new',
        component: BiopsyFormComponent,
        title: 'Add Biopsy | Pediatric Nephrology System'
      },
      {
        path: 'biopsy/:id',
        component: BiopsyDetailComponent,
        title: 'Biopsy Details | Pediatric Nephrology System'
      },
      {
  path: 'kidney-transplants/:transplantId/rejection-episodes',
  component: RejectionEpisodeListComponent
},
{
  path: 'kidney-transplants/:transplantId/rejection-episodes/:id',
  component: RejectionEpisodeDetailComponent
},
{
  path: 'kidney-transplants/:transplantId/rejection-episodes/new',
  component: RejectionEpisodeFormComponent
},
// Complications routes
{
  path: 'transplant/:transplantId/complications',
  component: ComplicationListComponent,
  title: 'Complications | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/complications/new',
  component: ComplicationFormComponent,
  title: 'Add Complication | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/complications/:id',
  component: ComplicationDetailComponent,
  title: 'Complication Details | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/complications/:id/edit',
  component: ComplicationFormComponent,
  title: 'Edit Complication | Pediatric Nephrology System'
},
// HLA Compatibility routes
{
  path: 'kidney-transplants/:transplantId/hla-compatibilities',
  component: HlaCompatibilityListComponent,
  title: 'HLA Compatibilities | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/hla-compatibilities/new',
  component: HlaCompatibilityFormComponent,
  title: 'Add HLA Compatibility | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/hla-compatibilities/:id',
  component: HlaCompatibilityDetailComponent,
  title: 'HLA Compatibility Details | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/hla-compatibilities/:id/edit',
  component: HlaCompatibilityFormComponent,
  title: 'Edit HLA Compatibility | Pediatric Nephrology System'
},
// Surveillance Protocol routes
{
  path: 'kidney-transplants/:transplantId/surveillance-protocols',
  component: SurveillanceProtocolListComponent,
  title: 'Surveillance Protocols | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/surveillance-protocols/new',
  component: SurveillanceProtocolFormComponent,
  title: 'Add Surveillance Protocol | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/surveillance-protocols/:id',
  component: SurveillanceProtocolDetailComponent,
  title: 'Surveillance Protocol Details | Pediatric Nephrology System'
},
{
  path: 'kidney-transplants/:transplantId/surveillance-protocols/:id/edit',
  component: SurveillanceProtocolFormComponent,
  title: 'Edit Surveillance Protocol | Pediatric Nephrology System'
}
    ]
  },
  // Auth pages (outside the main layout)
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  // Error pages
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
];