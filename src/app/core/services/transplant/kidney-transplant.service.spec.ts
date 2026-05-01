import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KidneyTransplantService } from './kidney-transplant.service';
import { KidneyTransplant, KidneyTransplantDTO, DonorType, GraftStatus } from '../../models/transplant/kidney-transplant.model';
import { environment } from '../../../../environments/environment';

describe('KidneyTransplantService', () => {
  let service: KidneyTransplantService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.transplantApiUrl}/api/transplants`;

  const mockTransplant: KidneyTransplant = {
    id: 1,
    patientId: 10,
    transplantDate: new Date('2024-03-15'),
    donorType: DonorType.LIVING,
    donorBloodGroup: 'A+',
    coldIschemiaTime: 180,
    graftStatus: GraftStatus.ACTIVE
  };

  const mockDTO: KidneyTransplantDTO = {
    patientId: 10,
    transplantDate: '2024-03-15',
    donorType: DonorType.LIVING,
    donorBloodGroup: 'A+',
    coldIschemiaTime: 180,
    graftStatus: GraftStatus.ACTIVE
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KidneyTransplantService]
    });
    service = TestBed.inject(KidneyTransplantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── create ────────────────────────────────────────────────

  it('create - should POST transplant and return created', () => {
    service.create(mockDTO).subscribe(t => {
      expect(t.id).toBe(1);
      expect(t.donorType).toBe(DonorType.LIVING);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDTO);
    req.flush(mockTransplant);
  });

  // ── getAll ────────────────────────────────────────────────

  it('getAll - should GET all transplants', () => {
    service.getAll().subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].graftStatus).toBe(GraftStatus.ACTIVE);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockTransplant]);
  });

  it('getAll - should return empty array when none', () => {
    service.getAll().subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(apiUrl).flush([]);
  });

  // ── getById ───────────────────────────────────────────────

  it('getById - should GET /1 and return transplant', () => {
    service.getById(1).subscribe(t => {
      expect(t.id).toBe(1);
      expect(t.patientId).toBe(10);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransplant);
  });

  // ── getByPatientId ────────────────────────────────────────

  it('getByPatientId - should GET /patient/10', () => {
    service.getByPatientId(10).subscribe(t => {
      expect(t.patientId).toBe(10);
    });
    const req = httpMock.expectOne(`${apiUrl}/patient/10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransplant);
  });

  // ── update ────────────────────────────────────────────────

  it('update - should PUT /1 with partial data', () => {
    const updated = { ...mockTransplant, graftStatus: GraftStatus.FUNCTIONING };
    service.update(1, { graftStatus: GraftStatus.FUNCTIONING }).subscribe(t => {
      expect(t.graftStatus).toBe(GraftStatus.FUNCTIONING);
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

  // ── uploadSurgicalReport ──────────────────────────────────

  it('uploadSurgicalReport - should POST multipart to /1/surgical-report', () => {
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    service.uploadSurgicalReport(1, file).subscribe(url => {
      expect(url).toBe('https://storage/report.pdf');
    });
    const req = httpMock.expectOne(`${apiUrl}/1/surgical-report`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush('https://storage/report.pdf');
  });

  // ── HLA Compatibility ─────────────────────────────────────

  it('createHLACompatibility - should POST to /1/hla-compatibility', () => {
    const hlaDTO = { transplantId: 1, donorHLA_A: 'A1', recipientHLA_A: 'A2', compatibilityScore: 85 } as any;
    const hlaResult = { id: 5, transplantId: 1, compatibilityScore: 85 } as any;
    service.createHLACompatibility(hlaDTO).subscribe(h => {
      expect(h.id).toBe(5);
    });
    const req = httpMock.expectOne(`${apiUrl}/1/hla-compatibility`);
    expect(req.request.method).toBe('POST');
    req.flush(hlaResult);
  });

  it('getHLACompatibility - should GET /1/hla-compatibility', () => {
    const hlaResult = { id: 5, transplantId: 1 } as any;
    service.getHLACompatibility(1).subscribe(h => expect(h.id).toBe(5));
    httpMock.expectOne(`${apiUrl}/1/hla-compatibility`).flush(hlaResult);
  });

  it('updateHLACompatibility - should PUT /hla-compatibility/5', () => {
    const updated = { id: 5, compatibilityScore: 90 } as any;
    service.updateHLACompatibility(5, { compatibilityScore: 90 } as any).subscribe(h => {
      expect(h.compatibilityScore).toBe(90);
    });
    httpMock.expectOne(`${apiUrl}/hla-compatibility/5`).flush(updated);
  });

  // ── Surveillance Protocol ─────────────────────────────────

  it('createSurveillanceProtocol - should POST to /surveillance-protocol', () => {
    const protocol = { transplantId: 1, followUpIntervalDays: 30 } as any;
    service.createSurveillanceProtocol(protocol).subscribe(p => {
      expect(p).toBeTruthy();
    });
    const req = httpMock.expectOne(`${apiUrl}/surveillance-protocol`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, ...protocol });
  });

  it('getSurveillanceProtocol - should GET /1/surveillance-protocol', () => {
    service.getSurveillanceProtocol(1).subscribe(p => expect(p).toBeTruthy());
    httpMock.expectOne(`${apiUrl}/1/surveillance-protocol`).flush({ id: 1 });
  });

  it('generateDefaultProtocol - should POST to /1/surveillance-protocol/generate', () => {
    service.generateDefaultProtocol(1).subscribe(p => expect(p).toBeTruthy());
    const req = httpMock.expectOne(`${apiUrl}/1/surveillance-protocol/generate`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 2 });
  });

  // ── Statistics ────────────────────────────────────────────

  it('getActiveGraftsCount - should GET /statistics/active-grafts', () => {
    service.getActiveGraftsCount().subscribe(count => expect(count).toBe(42));
    const req = httpMock.expectOne(`${apiUrl}/statistics/active-grafts`);
    expect(req.request.method).toBe('GET');
    req.flush(42);
  });

  it('getRejectionCount - should GET /statistics/rejections without params', () => {
    service.getRejectionCount().subscribe(count => expect(count).toBe(5));
    const req = httpMock.expectOne(r => r.url.includes('/statistics/rejections'));
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });

  it('getRejectionCount - should include period param when provided', () => {
    service.getRejectionCount('month').subscribe(count => expect(count).toBe(3));
    const req = httpMock.expectOne(r =>
      r.url.includes('/statistics/rejections') && r.params.get('period') === 'month'
    );
    req.flush(3);
  });
});
