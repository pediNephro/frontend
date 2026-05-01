import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComplicationService } from './complication.service';
import {
  Complication, ComplicationDTO,
  ComplicationType, ComplicationSeverity, ComplicationStatus
} from '../../models/transplant/complication.model';
import { environment } from '../../../../environments/environment';

describe('ComplicationService', () => {
  let service: ComplicationService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.transplantApiUrl}/api/complications`;

  const mockComplication: Complication = {
    id: 1,
    transplantId: 10,
    complicationType: ComplicationType.INFECTIOUS,
    subType: 'CMV',
    appearanceDate: new Date('2026-03-01'),
    severity: ComplicationSeverity.MODERATE,
    description: 'Infection à CMV post-greffe',
    treatment: 'Valganciclovir',
    status: ComplicationStatus.ACTIVE
  };

  const mockDTO: ComplicationDTO = {
    transplantId: 10,
    complicationType: ComplicationType.INFECTIOUS,
    subType: 'CMV',
    appearanceDate: '2026-03-01',
    severity: ComplicationSeverity.MODERATE,
    description: 'Infection à CMV post-greffe',
    treatment: 'Valganciclovir',
    status: ComplicationStatus.ACTIVE
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComplicationService]
    });
    service = TestBed.inject(ComplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── create ────────────────────────────────────────────────

  it('create - should POST to /transplant/10 and return created', () => {
    service.create(mockDTO).subscribe(c => {
      expect(c.id).toBe(1);
      expect(c.complicationType).toBe(ComplicationType.INFECTIOUS);
      expect(c.subType).toBe('CMV');
    });
    const req = httpMock.expectOne(`${apiUrl}/transplant/10`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDTO);
    req.flush(mockComplication);
  });

  // ── getById ───────────────────────────────────────────────

  it('getById - should GET /1 and return complication', () => {
    service.getById(1).subscribe(c => {
      expect(c.severity).toBe(ComplicationSeverity.MODERATE);
      expect(c.status).toBe(ComplicationStatus.ACTIVE);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComplication);
  });

  // ── getByTransplant & getByTransplantId ───────────────────

  it('getByTransplant - should GET /transplant/10', () => {
    service.getByTransplant(10).subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].transplantId).toBe(10);
    });
    const req = httpMock.expectOne(`${apiUrl}/transplant/10`);
    expect(req.request.method).toBe('GET');
    req.flush([mockComplication]);
  });

  it('getByTransplantId - should GET /transplant/10 (alias)', () => {
    service.getByTransplantId(10).subscribe(list => {
      expect(list.length).toBe(1);
    });
    httpMock.expectOne(`${apiUrl}/transplant/10`).flush([mockComplication]);
  });

  it('getByTransplant - should return empty list for unknown transplant', () => {
    service.getByTransplant(99).subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(`${apiUrl}/transplant/99`).flush([]);
  });

  // ── update ────────────────────────────────────────────────

  it('update - should PUT /1 with status RESOLVED', () => {
    const resolved: Complication = { ...mockComplication, status: ComplicationStatus.RESOLVED };
    service.update(1, { status: ComplicationStatus.RESOLVED }).subscribe(c => {
      expect(c.status).toBe(ComplicationStatus.RESOLVED);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(resolved);
  });

  it('update - should PUT /1 with severity change', () => {
    const updated: Complication = { ...mockComplication, severity: ComplicationSeverity.SEVERE };
    service.update(1, { severity: ComplicationSeverity.SEVERE }).subscribe(c => {
      expect(c.severity).toBe(ComplicationSeverity.SEVERE);
    });
    httpMock.expectOne(`${apiUrl}/1`).flush(updated);
  });

  // ── delete ────────────────────────────────────────────────

  it('delete - should DELETE /1', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
