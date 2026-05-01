import { Routes } from '@angular/router';

import { TransplantFormComponent } from './kidney-transplant/transplant-form/transplant-form.component';
import { RejectionEpisodeFormComponent } from './rejection-episode/rejection-episode-form/rejection-episode-form.component';
import { RejectionEpisodeListComponent } from './rejection-episode/rejection-episode-list/rejection-episode-list.component';
import { RejectionEpisodeDetailComponent } from './rejection-episode/rejection-episode-detail/rejection-episode-detail.component';
import { TransplantListComponent } from './kidney-transplant/transplant-list/transplant-list.component';
import { TransplantDetailComponent } from './kidney-transplant/transplant-detail/transplant-detail.component';
import { BiopsyFormComponent } from './biopsy/biopsy-form/biopsy-form.component';
import { BiopsyListComponent } from './biopsy/biopsy-list/biopsy-list.component';
import { BiopsyDetailComponent } from './biopsy/biopsy-detail/biopsy-detail.component';
// New transplant features
import { ComplicationListComponent } from './complication/complication-list/complication-list.component';
import { ComplicationFormComponent } from './complication/complication-form/complication-form.component';
import { ComplicationDetailComponent } from './complication/complication-detail/complication-detail.component';
import { HlaCompatibilityListComponent } from './hla-compatibility/hla-compatibility-list/hla-compatibility-list.component';
import { HlaCompatibilityFormComponent } from './hla-compatibility/hla-compatibility-form/hla-compatibility-form.component';
import { HlaCompatibilityDetailComponent } from './hla-compatibility/hla-compatibility-detail/hla-compatibility-detail.component';
import { SurveillanceProtocolListComponent } from './surveillance-protocol/surveillance-protocol-list/surveillance-protocol-list.component';
import { SurveillanceProtocolFormComponent } from './surveillance-protocol/surveillance-protocol-form/surveillance-protocol-form.component';
import { SurveillanceProtocolDetailComponent } from './surveillance-protocol/surveillance-protocol-detail/surveillance-protocol-detail.component';
import { ImmunosuppressantListComponent } from './immunosuppressant/immunosuppressant-list/immunosuppressant-list.component';
import { ImmunosuppressantFormComponent } from './immunosuppressant/immunosuppressant-form/immunosuppressant-form.component';
import { ImmunosuppressantDetailComponent } from './immunosuppressant/immunosuppressant-detail/immunosuppressant-detail.component';
import { ProtocolePostGreffeComponent } from './immunosuppressant/immunosuppressant-list/protocole-post-greffe.component';

export const transplantRoutes: Routes = [
  {
    path: 'transplant',
    component: TransplantListComponent,
    title: 'Kidney Transplants | Pediatric Nephrology System'
  },
    {
    path: 'transplant/new',
    component: TransplantFormComponent,
    title: 'Add Kidney Transplant | Pediatric Nephrology System'
  },
 
  {
    path: 'transplant/:id',
    component: TransplantDetailComponent,
    title: 'Kidney Transplant Details | Pediatric Nephrology System'
  },
  {
    path: 'transplant/:id/edit',
    component: TransplantFormComponent,
    title: 'Edit Kidney Transplant | Pediatric Nephrology System'
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
    path: 'biopsy/:id/edit',
    component: BiopsyFormComponent,
    title: 'Edit Biopsy | Pediatric Nephrology System'
  },
  // Biopsy routes under transplant
  {
    path: 'kidney-transplants/:transplantId/biopsies',
    component: BiopsyListComponent,
    title: 'Biopsies | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/biopsies/new',
    component: BiopsyFormComponent,
    title: 'Add Biopsy | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/biopsies/:id',
    component: BiopsyDetailComponent,
    title: 'Biopsy Details | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/biopsies/:id/edit',
    component: BiopsyFormComponent,
    title: 'Edit Biopsy | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/rejection-episodes',
    component: RejectionEpisodeListComponent,
    title: 'Rejection Episodes | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/rejection-episodes/new',
    component: RejectionEpisodeFormComponent,
    title: 'Add Rejection Episode | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/rejection-episodes/:id',
    component: RejectionEpisodeDetailComponent,
    title: 'Rejection Episode Details | Pediatric Nephrology System'
  },
  // Complications routes
  {
    path: 'kidney-transplants/:transplantId/complications',
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
  // Immunosuppressant routes
  {
    path: 'kidney-transplants/:transplantId/immunosuppressants',
    component: ImmunosuppressantListComponent,
    title: 'Drug Monitoring | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/immunosuppressants/new',
    component: ImmunosuppressantFormComponent,
    title: 'Add Drug Record | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/immunosuppressants/:id',
    component: ImmunosuppressantDetailComponent,
    title: 'Drug Record Details | Pediatric Nephrology System'
  },
  {
    path: 'kidney-transplants/:transplantId/immunosuppressants/:id/edit',
    component: ImmunosuppressantFormComponent,
    title: 'Edit Drug Record | Pediatric Nephrology System'
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
  },
  {
    path: 'protocole-post-greffe',
    component: ProtocolePostGreffeComponent,
    title: 'Protocole Post Greffe | Pediatric Nephrology System'
  }
];