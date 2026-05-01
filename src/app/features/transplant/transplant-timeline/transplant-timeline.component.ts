// src/app/features/transplant/transplant-timeline/transplant-timeline.component.ts

import {
  Component, Input, OnInit, OnChanges,
  SimpleChanges, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

// FullCalendar — déjà installé dans ton projet
import { FullCalendarModule }  from '@fullcalendar/angular';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import listPlugin       from '@fullcalendar/list';
import dayGridPlugin    from '@fullcalendar/daygrid';
import timeGridPlugin   from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
  TransplantTimelineEventService,
  TimelineEvent,
  TimelineEventCategory,
  CATEGORY_COLORS,
} from '../../../core/services/transplant/transplant-timeline-event.service';

@Component({
  selector: 'app-transplant-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  template: `
    <div class="rounded-sm border border-stroke bg-white shadow-default
                dark:border-strokedark dark:bg-boxdark">

      <!-- ── En-tête ─────────────────────────────────────────────────────── -->
      <div class="border-b border-stroke px-6 py-4 dark:border-strokedark">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-black dark:text-white">
              Timeline post-greffe
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Transplant #{{ transplantId }} —
              {{ allEvents.length }} événement{{ allEvents.length > 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Sélecteur de vue -->
          <div class="flex items-center gap-2">
            <div class="flex rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
              <button *ngFor="let v of viewOptions"
                (click)="switchView(v.value)"
                [class.bg-primary]="currentView === v.value"
                [class.text-white]="currentView === v.value"
                [class.text-gray-600]="currentView !== v.value"
                class="px-3 py-1.5 text-xs font-medium transition-colors
                       dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4">
                {{ v.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Filtres par catégorie -->
        <div class="mt-3 flex flex-wrap gap-2">
          <button *ngFor="let cat of categoryKeys"
            (click)="toggleCategory(cat)"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs
                   font-medium border transition-all"
            [style.background-color]="activeCategories.has(cat) ? categoryMeta[cat].bg : 'transparent'"
            [style.color]="activeCategories.has(cat) ? '#fff' : categoryMeta[cat].bg"
            [style.border-color]="categoryMeta[cat].bg">
            <span>{{ categoryMeta[cat].icon }}</span>
            {{ categoryMeta[cat].label }}
            <span class="ml-1 rounded-full px-1.5 py-0.5 text-xs"
              [style.background-color]="activeCategories.has(cat) ? 'rgba(255,255,255,0.25)' : categoryMeta[cat].bg"
              [style.color]="activeCategories.has(cat) ? '#fff' : '#fff'">
              {{ countByCategory(cat) }}
            </span>
          </button>
        </div>
      </div>

      <!-- ── Corps : calendrier + panel latéral ──────────────────────────── -->
      <div class="flex">

        <!-- Calendrier FullCalendar -->
        <div class="flex-1 p-4" [class.pr-0]="selectedEvent">
          <div *ngIf="loading" class="flex h-64 items-center justify-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4
                        border-primary border-t-transparent"></div>
          </div>

          <div *ngIf="error" class="flex h-32 items-center justify-center">
            <p class="text-sm text-red-500">{{ error }}</p>
          </div>

          <full-calendar
            *ngIf="!loading && !error"
            #calendar
            [options]="calendarOptions"
          ></full-calendar>
        </div>

        <!-- Panel détail latéral (s'ouvre au clic) -->
        <div *ngIf="selectedEvent"
             class="w-72 shrink-0 border-l border-stroke dark:border-strokedark
                    p-5 transition-all">

          <!-- Header du panel -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ selectedEvent.icon }}</span>
              <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    [style.background-color]="selectedEvent.color">
                {{ categoryMeta[selectedEvent.category].label }}
              </span>
            </div>
            <button (click)="closePanel()"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <h4 class="mb-1 font-semibold text-black dark:text-white text-sm leading-snug">
            {{ selectedEvent.title }}
          </h4>
          <p class="mb-4 text-xs text-gray-500">
            {{ formatDate(selectedEvent.date) }}
            <span *ngIf="selectedEvent.endDate">
              → {{ formatDate(selectedEvent.endDate) }}
            </span>
          </p>

          <!-- Badge sévérité / statut -->
          <div *ngIf="selectedEvent.severity || selectedEvent.status"
               class="mb-4 flex flex-wrap gap-2">
            <span *ngIf="selectedEvent.severity"
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                  [class]="getSeverityClass(selectedEvent.severity)">
              {{ selectedEvent.severity }}
            </span>
            <span *ngIf="selectedEvent.status"
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
                         bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300">
              {{ selectedEvent.status }}
            </span>
          </div>

          <!-- Champs détail -->
          <div class="space-y-2.5">
            <div *ngFor="let entry of getDetailEntries(selectedEvent)"
                 class="border-b border-stroke dark:border-strokedark pb-2">
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ entry.key }}</p>
              <p class="text-sm font-medium text-black dark:text-white">
                {{ entry.value ?? '—' }}
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Vue liste ────────────────────────────────────────────────────── -->
      <div *ngIf="currentView === 'list'" class="border-t border-stroke dark:border-strokedark">
        <div class="divide-y divide-stroke dark:divide-strokedark">
          <div *ngFor="let event of filteredEvents"
               (click)="selectEvent(event)"
               class="flex cursor-pointer items-start gap-4 px-6 py-4
                      hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors"
               [class.bg-blue-50]="selectedEvent?.id === event.id"
               [class.dark:bg-meta-4]="selectedEvent?.id === event.id">

            <!-- Indicateur couleur -->
            <div class="mt-1 h-3 w-3 shrink-0 rounded-full"
                 [style.background-color]="event.color"></div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium text-black dark:text-white truncate">
                  {{ event.title }}
                </p>
                <span class="shrink-0 text-xs text-gray-400">
                  {{ formatDate(event.date) }}
                </span>
              </div>
              <div class="mt-1 flex flex-wrap gap-1.5">
                <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white"
                      [style.background-color]="categoryMeta[event.category].bg">
                  {{ categoryMeta[event.category].label }}
                </span>
                <span *ngIf="event.severity"
                      class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      [class]="getSeverityClass(event.severity)">
                  {{ event.severity }}
                </span>
              </div>
            </div>

            <!-- Flèche -->
            <svg class="mt-1 h-4 w-4 shrink-0 text-gray-300" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>

          <div *ngIf="filteredEvents.length === 0"
               class="flex h-32 items-center justify-center">
            <p class="text-sm text-gray-400">Aucun événement pour les filtres sélectionnés.</p>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class TransplantTimelineComponent implements OnInit, OnChanges, AfterViewInit {

  @Input({ required: true }) transplantId!: number;
  @ViewChild('calendar') calendarRef?: ElementRef;

  // ── État ──────────────────────────────────────────────────────────────────
  loading       = false;
  error         = '';
  allEvents:      TimelineEvent[] = [];
  filteredEvents: TimelineEvent[] = [];
  selectedEvent:  TimelineEvent | null = null;
  currentView   = 'list';   // 'list' | 'dayGridMonth' | 'dayGridYear'
  activeCategories = new Set<TimelineEventCategory>(
    ['TRANSPLANT', 'BIOPSY', 'REJECTION', 'COMPLICATION', 'SURVEILLANCE']
  );

  categoryMeta  = CATEGORY_COLORS;
  categoryKeys  = Object.keys(CATEGORY_COLORS) as TimelineEventCategory[];

  viewOptions = [
    { value: 'list',         label: 'Liste'    },
    { value: 'dayGridMonth', label: 'Mois'     },
    { value: 'dayGridYear',  label: 'Année'    },
  ];

  // ── Config FullCalendar ───────────────────────────────────────────────────
  calendarOptions: any = {
    plugins:      [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView:  'dayGridMonth',
    locale:       'fr',
    headerToolbar: {
      left:   'prev,next today',
      center: 'title',
      right:  '',
    },
    height:       'auto',
    events:       [],
    eventClick:   (info: EventClickArg) => this.onCalendarEventClick(info),
    eventDisplay: 'block',
    displayEventTime: false,
  };

  constructor(private timelineService: TransplantTimelineEventService) {}

  ngOnInit():     void { this.load(); }
  ngAfterViewInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transplantId'] && !changes['transplantId'].firstChange) this.load();
  }

  // ── Chargement ────────────────────────────────────────────────────────────

  load(): void {
    if (!this.transplantId) return;
    this.loading = true;
    this.error   = '';

    this.timelineService.loadEvents(this.transplantId).subscribe({
      next: (events) => {
        this.allEvents = events;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error   = 'Impossible de charger les événements du transplant.';
        this.loading = false;
      },
    });
  }

  // ── Filtres ───────────────────────────────────────────────────────────────

  toggleCategory(cat: TimelineEventCategory): void {
    if (this.activeCategories.has(cat)) {
      if (this.activeCategories.size > 1) this.activeCategories.delete(cat);
    } else {
      this.activeCategories.add(cat);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEvents = this.allEvents.filter(e => this.activeCategories.has(e.category));
    this.updateCalendarEvents();
  }

  private updateCalendarEvents(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.filteredEvents.map(e => ({
        id:              e.id,
        title:           e.title,
        start:           e.date,
        end:             e.endDate,
        backgroundColor: e.color,
        borderColor:     e.color,
        textColor:       e.textColor,
        extendedProps:   { eventData: e },
      })),
    };
  }

  // ── Interactions ──────────────────────────────────────────────────────────

  switchView(view: string): void {
    this.currentView = view;
    if (view !== 'list') {
      this.calendarOptions = { ...this.calendarOptions, initialView: view };
    }
  }

  onCalendarEventClick(info: EventClickArg): void {
    const data = info.event.extendedProps['eventData'] as TimelineEvent;
    this.selectEvent(data);
  }

  selectEvent(event: TimelineEvent): void {
    this.selectedEvent = this.selectedEvent?.id === event.id ? null : event;
  }

  closePanel(): void {
    this.selectedEvent = null;
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────

  countByCategory(cat: TimelineEventCategory): number {
    return this.allEvents.filter(e => e.category === cat).length;
  }

  getDetailEntries(event: TimelineEvent): { key: string; value: string | number | undefined }[] {
    return Object.entries(event.detail)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([key, value]) => ({ key, value: value as string | number }));
  }

  formatDate(d: string | undefined): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'MILD':             return 'bg-green-100 text-green-800';
      case 'MODERATE':         return 'bg-yellow-100 text-yellow-800';
      case 'SEVERE':           return 'bg-red-100 text-red-800';
      case 'LIFE_THREATENING': return 'bg-red-200 text-red-900 font-bold';
      case 'BORDERLINE':       return 'bg-yellow-100 text-yellow-800';
      case 'ACUTE_REJECTION':  return 'bg-red-100 text-red-800';
      case 'CHRONIC':          return 'bg-purple-100 text-purple-800';
      case 'NORMAL':           return 'bg-green-100 text-green-800';
      default:                 return 'bg-gray-100 text-gray-700';
    }
  }
}
