// src/app/core/services/transplant/transplant-timeline-event.service.ts

import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { KidneyTransplant } from '../../models/transplant/kidney-transplant.model';
import { Biopsy }           from '../../models/transplant/biopsy.model';
import { RejectionEpisode } from '../../models/transplant/rejection-episode.model';
import { Complication }     from '../../models/transplant/complication.model';
import { SurveillanceProtocol } from '../../models/transplant/surveillance-protocol.model';

import { KidneyTransplantService }    from './kidney-transplant.service';
import { BiopsyService }              from './biopsy.service';
import { RejectionService }    from './rejection.service';
import { ComplicationService }        from './complication.service';
import { SurveillanceProtocolService } from './surveillance-protocol.service';

// ── Types internes de la timeline ─────────────────────────────────────────────

export type TimelineEventCategory =
  | 'TRANSPLANT'
  | 'BIOPSY'
  | 'REJECTION'
  | 'COMPLICATION'
  | 'SURVEILLANCE';

export interface TimelineEvent {
  id:          string;
  title:       string;
  date:        string;          // ISO date 'YYYY-MM-DD'
  endDate?:    string;          // pour les événements avec durée
  category:    TimelineEventCategory;
  color:       string;          // couleur hex pour FullCalendar
  textColor:   string;
  icon:        string;          // emoji affiché dans le label
  severity?:   string;
  status?:     string;
  detail:      Record<string, string | number | undefined>; // champs à afficher dans le panel
  rawData:     unknown;         // objet original pour usage avancé
}

// Palette de couleurs par catégorie
export const CATEGORY_COLORS: Record<TimelineEventCategory, { bg: string; text: string; icon: string; label: string }> = {
  TRANSPLANT:    { bg: '#3B82F6', text: '#fff', icon: '🫘', label: 'Greffe'           },
  BIOPSY:        { bg: '#8B5CF6', text: '#fff', icon: '🔬', label: 'Biopsie'          },
  REJECTION:     { bg: '#EF4444', text: '#fff', icon: '⚠️', label: 'Rejet'            },
  COMPLICATION:  { bg: '#F59E0B', text: '#fff', icon: '🔶', label: 'Complication'     },
  SURVEILLANCE:  { bg: '#10B981', text: '#fff', icon: '📋', label: 'Surveillance'     },
};

@Injectable({ providedIn: 'root' })
export class TransplantTimelineEventService {

  constructor(
    private transplantService:   KidneyTransplantService,
    private biopsyService:        BiopsyService,
    private rejectionService:     RejectionService,
    private complicationService:  ComplicationService,
    private surveillanceService:  SurveillanceProtocolService,
  ) {}

  /**
   * Charge tous les événements d'un transplant et les convertit
   * en objets TimelineEvent homogènes pour FullCalendar.
   */
  loadEvents(transplantId: number): Observable<TimelineEvent[]> {
    return forkJoin({
      transplant:   this.transplantService.getById(transplantId).pipe(catchError(() => of(null))),
      biopsies:     this.biopsyService.getByTransplantId(transplantId).pipe(catchError(() => of([]))),
      rejections:   this.rejectionService.getByTransplantId(transplantId).pipe(catchError(() => of([]))),
      complications: this.complicationService.getByTransplantId(transplantId).pipe(catchError(() => of([]))),
      surveillance: this.surveillanceService.getByTransplantId(transplantId).pipe(catchError(() => of(null))),
    }).pipe(
      map(({ transplant, biopsies, rejections, complications, surveillance }) => {
        const events: TimelineEvent[] = [];

        if (transplant) events.push(this.mapTransplant(transplant));
        biopsies.forEach((b: Biopsy)             => events.push(this.mapBiopsy(b)));
        rejections.forEach((r: RejectionEpisode) => events.push(this.mapRejection(r)));
        complications.forEach((c: Complication)  => events.push(this.mapComplication(c)));
        if (surveillance) events.push(...this.mapSurveillance(surveillance));

        return events.sort((a, b) => a.date.localeCompare(b.date));
      })
    );
  }

  // ── Mappeurs par entité ───────────────────────────────────────────────────

  private mapTransplant(t: KidneyTransplant): TimelineEvent {
    const c = CATEGORY_COLORS.TRANSPLANT;
    return {
      id:       `transplant-${t.id}`,
      title:    `${c.icon} Greffe rénale`,
      date:     this.toDate(t.transplantDate),
      category: 'TRANSPLANT',
      color:    c.bg, textColor: c.text, icon: c.icon,
      status:   t.graftStatus,
      detail: {
        'Type de donneur':    t.donorType,
        'Groupe sanguin':     t.donorBloodGroup,
        'Ischémie froide':    t.coldIschemiaTime ? `${t.coldIschemiaTime} min` : undefined,
        'Statut du greffon':  t.graftStatus,
        'Jours post-greffe':  t.postTransplantDays,
      },
      rawData: t,
    };
  }

  private mapBiopsy(b: Biopsy): TimelineEvent {
    const c = CATEGORY_COLORS.BIOPSY;
    const banff = b.banffCategory ?? '—';
    return {
      id:       `biopsy-${b.id}`,
      title:    `${c.icon} Biopsie — ${banff}`,
      date:     this.toDate(b.biopsyDate),
      category: 'BIOPSY',
      color:    b.banffCategory === 'ACUTE_REJECTION' ? '#DC2626' : c.bg,
      textColor: c.text, icon: c.icon,
      severity: b.banffCategory,
      detail: {
        'Indication':       b.indication,
        'Catégorie Banff':  b.banffCategory ?? '—',
        'Score T':          b.banffScoreT,
        'Score I':          b.banffScoreI,
        'Score G':          b.banffScoreG,
        'Conclusion':       b.conclusion ?? '—',
      },
      rawData: b,
    };
  }

  private mapRejection(r: RejectionEpisode): TimelineEvent {
    const c = CATEGORY_COLORS.REJECTION;
    const severityColors: Record<string, string> = {
      MILD: '#F59E0B', MODERATE: '#EF4444', SEVERE: '#DC2626'
    };
    return {
      id:       `rejection-${r.id}`,
      title:    `${c.icon} Rejet ${r.rejectionType} — ${r.severity}`,
      date:     this.toDate(r.startDate),
      endDate:  r.endDate ? this.toDate(r.endDate) : undefined,
      category: 'REJECTION',
      color:    severityColors[r.severity] ?? c.bg,
      textColor: c.text, icon: c.icon,
      severity: r.severity,
      status:   r.status,
      detail: {
        'Type':               r.rejectionType,
        'Sévérité':           r.severity,
        'Statut':             r.status,
        'DFG au rejet':       r.gfrAtRejection ? `${r.gfrAtRejection} mL/min` : undefined,
        '↑ Créatinine':       r.creatinineIncrease ? `+${r.creatinineIncrease}%` : undefined,
        'Traitement':         r.treatment ?? '—',
        'Notes':              r.notes ?? '—',
      },
      rawData: r,
    };
  }

  private mapComplication(c: Complication): TimelineEvent {
    const col = CATEGORY_COLORS.COMPLICATION;
    const severityColors: Record<string, string> = {
      MILD: '#10B981', MODERATE: '#F59E0B',
      SEVERE: '#EF4444', LIFE_THREATENING: '#DC2626'
    };
    return {
      id:       `complication-${c.id}`,
      title:    `${col.icon} ${c.complicationType}${c.subType ? ' — ' + c.subType : ''}`,
      date:     this.toDate(c.appearanceDate),
      endDate:  c.resolutionDate ? this.toDate(c.resolutionDate) : undefined,
      category: 'COMPLICATION',
      color:    severityColors[c.severity] ?? col.bg,
      textColor: col.text, icon: col.icon,
      severity: c.severity,
      status:   c.status,
      detail: {
        'Type':           c.complicationType,
        'Sous-type':      c.subType ?? '—',
        'Sévérité':       c.severity,
        'Statut':         c.status,
        'Description':    c.description,
        'Traitement':     c.treatment ?? '—',
        'Résolution':     c.resolutionDate ? this.toDate(c.resolutionDate) : 'En cours',
      },
      rawData: c,
    };
  }

  private mapSurveillance(s: SurveillanceProtocol): TimelineEvent[] {
    const c   = CATEGORY_COLORS.SURVEILLANCE;
    const events: TimelineEvent[] = [];

    if (s.nextConsultationDate) {
      events.push({
        id: `surv-consult-${s.id}`,
        title: `${c.icon} Consultation — ${s.currentPhase}`,
        date:  this.toDate(s.nextConsultationDate),
        category: 'SURVEILLANCE',
        color: c.bg, textColor: c.text, icon: c.icon,
        detail: {
          'Phase':           s.currentPhase,
          'Fréquence':       `Tous les ${s.consultationFrequency} jours`,
          'Avancement':      s.completionPercentage ? `${s.completionPercentage}%` : '—',
        },
        rawData: s,
      });
    }

    if (s.nextLabTestDate) {
      events.push({
        id: `surv-lab-${s.id}`,
        title: `${c.icon} Bilan biologique prévu`,
        date:  this.toDate(s.nextLabTestDate),
        category: 'SURVEILLANCE',
        color: '#059669', textColor: c.text, icon: '🧪',
        detail: {
          'Phase':      s.currentPhase,
          'Fréquence':  `Tous les ${s.labTestFrequency} jours`,
        },
        rawData: s,
      });
    }

    return events;
  }

  // ── Utilitaire date ───────────────────────────────────────────────────────

  private toDate(d: Date | string | undefined): string {
    if (!d) return new Date().toISOString().slice(0, 10);
    return new Date(d).toISOString().slice(0, 10);
  }
}
