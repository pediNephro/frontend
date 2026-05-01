import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RejectionService } from './rejection.service';
import {
  RejectionEpisode, RejectionEpisodeDTO,
  RejectionType, RejectionSeverity, RejectionStatus
} from '../../models/transplant/rejection-episode.model';
import { environment } from '../../../../environments/environment';

describe('RejectionService', () => {
  let service: RejectionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.transplantApiUrl}/api/rejections`;

  const mockRejection: RejectionEpisode = {
    id: 1,
    transplantId: 10,
    startDate: new Date('2026-01-15'),
    rejectionType: RejectionType.ACUTE,
    severity: RejectionSeverity.MODERATE,
    creatinineIncrease: 25,
    gfrAtRejection: 35,
    status: RejectionStatus.SUSPECTED
  };

  const mockDTO: RejectionEpisodeDTO = {
    transplantId: 10,
    startDate: '2026-01-15',
    rejectionType: RejectionType.ACUTE,
    severity: RejectionSeverity.MODERATE,
    creatinineIncrease: 25,
    gfrAtRejection: 35,
    status: RejectionStatus.SUSPECTED
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RejectionService]
    });
    service = TestBed.inject(RejectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── rejectionDetected$ ────────────────────────────────────

  it('rejectionDetected$ - should emit when emitRejectionDetected called', (done) => {
    service.rejectionDetected$.subscribe(r => {
      expect(r.id).toBe(1);
      expect(r.status).toBe(RejectionStatus.SUSPECTED);
      done();
    });
    service.emitRejectionDetected(mockRejection);
  });

  // ── create ────────────────────────────────────────────────

  it('create - should POST rejection episode', () => {
    service.create(mockDTO).subscribe(r => {
      expect(r.id).toBe(1);
      expect(r.rejectionType).toBe(RejectionType.ACUTE);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockRejection);
  });

  it('create - should wrap transplantId into transplant object', () => {
    service.create(mockDTO).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.transplant).toEqual({ id: 10 });
    req.flush(mockRejection);
  });

  // ── getById ───────────────────────────────────────────────

  it('getById - should GET /1', () => {
    service.getById(1).subscribe(r => {
      expect(r.severity).toBe(RejectionSeverity.MODERATE);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRejection);
  });

  // ── getByTransplantId ─────────────────────────────────────

  it('getByTransplantId - should GET /transplant/10', () => {
    service.getByTransplantId(10).subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].transplantId).toBe(10);
    });
    const req = httpMock.expectOne(`${apiUrl}/transplant/10`);
    expect(req.request.method).toBe('GET');
    req.flush([mockRejection]);
  });

  it('getByTransplantId - should return empty for unknown transplant', () => {
    service.getByTransplantId(99).subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(`${apiUrl}/transplant/99`).flush([]);
  });

  // ── update ────────────────────────────────────────────────

  it('update - should PUT /1 with updated status', () => {
    const updated = { ...mockRejection, status: RejectionStatus.CONFIRMED };
    service.update(1, { status: RejectionStatus.CONFIRMED }).subscribe(r => {
      expect(r.status).toBe(RejectionStatus.CONFIRMED);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  // ── delete ────────────────────────────────────────────────

  it('delete - should DELETE /1', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  // ── detectRejection ───────────────────────────────────────

  it('detectRejection - should POST to /detect/10', () => {
    service.detectRejection(10).subscribe(r => {
      expect(r).toBeTruthy();
    });
    const req = httpMock.expectOne(`${apiUrl}/detect/10`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRejection);
  });

  it('detectRejection - should handle null response (no rejection detected)', () => {
    service.detectRejection(10).subscribe(r => {
      expect(r).toBeNull();
    });
    httpMock.expectOne(`${apiUrl}/detect/10`).flush(null);
  });

  // ── getSuspectedRejections ────────────────────────────────

  it('getSuspectedRejections - should GET /suspected', () => {
    service.getSuspectedRejections().subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].status).toBe(RejectionStatus.SUSPECTED);
    });
    const req = httpMock.expectOne(`${apiUrl}/suspected`);
    expect(req.request.method).toBe('GET');
    req.flush([mockRejection]);
  });

  // ── updateStatus ──────────────────────────────────────────

  it('updateStatus - should PATCH /1/status with new status', () => {
    const confirmed = { ...mockRejection, status: RejectionStatus.CONFIRMED };
    service.updateStatus(1, RejectionStatus.CONFIRMED).subscribe(r => {
      expect(r.status).toBe(RejectionStatus.CONFIRMED);
    });
    const req = httpMock.expectOne(`${apiUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: RejectionStatus.CONFIRMED });
    req.flush(confirmed);
  });

  // ── linkBiopsy ────────────────────────────────────────────

  it('linkBiopsy - should PATCH /1/link-biopsy/7', () => {
    service.linkBiopsy(1, 7).subscribe(r => expect(r).toBeTruthy());
    const req = httpMock.expectOne(`${apiUrl}/1/link-biopsy/7`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockRejection);
  });
});
