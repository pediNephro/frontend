import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BiopsyService } from './biopsy.service';
import { Biopsy, BiopsyDTO, BiopsyIndication, BanffCategory } from '../../models/transplant/biopsy.model';
import { environment } from '../../../../environments/environment';

describe('BiopsyService', () => {
  let service: BiopsyService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.transplantApiUrl}/api/biopsies`;

  const mockBiopsy: Biopsy = {
    id: 1,
    transplantId: 10,
    biopsyDate: new Date('2026-02-01'),
    indication: BiopsyIndication.SUSPECTED_REJECTION,
    banffScoreT: 2,
    banffScoreI: 1,
    banffCategory: BanffCategory.ACUTE_REJECTION,
    conclusion: 'Rejet aigu confirmé'
  };

  const mockDTO: BiopsyDTO = {
    transplantId: 10,
    biopsyDate: '2026-02-01',
    indication: BiopsyIndication.SUSPECTED_REJECTION,
    banffScoreT: 2,
    banffScoreI: 1,
    conclusion: 'Rejet aigu confirmé'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BiopsyService]
    });
    service = TestBed.inject(BiopsyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── create ────────────────────────────────────────────────

  it('create - should POST biopsy and return created', () => {
    service.create(mockDTO).subscribe(b => {
      expect(b.id).toBe(1);
      expect(b.indication).toBe(BiopsyIndication.SUSPECTED_REJECTION);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockBiopsy);
  });

  it('create - should wrap transplantId into transplant object in body', () => {
    service.create(mockDTO).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.transplant).toEqual({ id: 10 });
    req.flush(mockBiopsy);
  });

  // ── getAll ────────────────────────────────────────────────

  it('getAll - should GET all biopsies', () => {
    service.getAll().subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].banffCategory).toBe(BanffCategory.ACUTE_REJECTION);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockBiopsy]);
  });

  it('getAll - should return empty array', () => {
    service.getAll().subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(apiUrl).flush([]);
  });

  // ── getById ───────────────────────────────────────────────

  it('getById - should GET /1', () => {
    service.getById(1).subscribe(b => {
      expect(b.conclusion).toBe('Rejet aigu confirmé');
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBiopsy);
  });

  // ── getByTransplant & getByTransplantId ───────────────────

  it('getByTransplant - should GET /transplant/10', () => {
    service.getByTransplant(10).subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].transplantId).toBe(10);
    });
    const req = httpMock.expectOne(`${apiUrl}/transplant/10`);
    expect(req.request.method).toBe('GET');
    req.flush([mockBiopsy]);
  });

  it('getByTransplantId - should GET /transplant/10 (alias)', () => {
    service.getByTransplantId(10).subscribe(list => {
      expect(list.length).toBe(1);
    });
    httpMock.expectOne(`${apiUrl}/transplant/10`).flush([mockBiopsy]);
  });

  it('getByTransplant - should return empty for unknown transplant', () => {
    service.getByTransplant(99).subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(`${apiUrl}/transplant/99`).flush([]);
  });

  // ── update ────────────────────────────────────────────────

  it('update - should PUT /1 with partial data', () => {
    const updated = { ...mockBiopsy, banffScoreT: 3 };
    service.update(1, { banffScoreT: 3 }).subscribe(b => {
      expect(b.banffScoreT).toBe(3);
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

  // ── uploadReport ──────────────────────────────────────────

  it('uploadReport - should POST FormData to /1/report', () => {
    const file = new File(['pdf'], 'report.pdf', { type: 'application/pdf' });
    service.uploadReport(1, file).subscribe(url => {
      expect(url).toBe('https://storage/report.pdf');
    });
    const req = httpMock.expectOne(`${apiUrl}/1/report`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush('https://storage/report.pdf');
  });

  // ── uploadImages ──────────────────────────────────────────

  it('uploadImages - should POST FormData to /1/images', () => {
    const file = new File(['img'], 'scan.jpg', { type: 'image/jpeg' });
    service.uploadImages(1, file).subscribe(url => {
      expect(url).toBe('https://storage/scan.jpg');
    });
    const req = httpMock.expectOne(`${apiUrl}/1/images`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush('https://storage/scan.jpg');
  });
});
