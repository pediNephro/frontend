import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VitalSignService } from './vital-sign.service';
import { VitalSign, VitalSignCreateDTO } from '../../models/monitoring/vital-sign.model';
import { environment } from '../../../../environments/environment';

describe('VitalSignService', () => {
  let service: VitalSignService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/vital-signs`;

  const mockSign: VitalSign = {
    id: 1,
    patientId: 5,
    enteredBy: 2,
    measurementDate: '2026-04-01T09:00:00',
    weight: 22.5,
    height: 115,
    systolicBP: 120,
    diastolicBP: 75,
    heartRate: 80,
    temperature: 36.8,
    spo2: 98,
    urineOutput: 600
  };

  const mockDTO: VitalSignCreateDTO = {
    patientId: 5,
    enteredBy: 2,
    measurementDate: '2026-04-01T09:00:00',
    weight: 22.5,
    height: 115,
    systolicBP: 120,
    diastolicBP: 75,
    heartRate: 80,
    temperature: 36.8,
    spo2: 98,
    urineOutput: 600
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VitalSignService]
    });
    service = TestBed.inject(VitalSignService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getAll - sans paramètres ──────────────────────────────

  it('getAll - should GET /api/vital-signs without params', () => {
    service.getAll().subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].temperature).toBe(36.8);
      expect(list[0].heartRate).toBe(80);
    });
    const req = httpMock.expectOne(r => r.url.includes('/api/vital-signs') && !r.params.has('patientId'));
    expect(req.request.method).toBe('GET');
    req.flush([mockSign]);
  });

  it('getAll - should return empty array when none', () => {
    service.getAll().subscribe(list => expect(list).toEqual([]));
    httpMock.expectOne(r => r.url.includes('/api/vital-signs')).flush([]);
  });

  // ── getAll - avec patientId ───────────────────────────────

  it('getAll(patientId) - should include patientId param', () => {
    service.getAll(5).subscribe(list => {
      expect(list[0].patientId).toBe(5);
    });
    const req = httpMock.expectOne(r =>
      r.url.includes('/api/vital-signs') && r.params.get('patientId') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockSign]);
  });

  // ── getAll - avec timeSeries ──────────────────────────────

  it('getAll(patientId, timeSeries) - should include from/to/limit params', () => {
    service.getAll(5, { from: '2026-01-01', to: '2026-04-01', limit: 10 }).subscribe();
    const req = httpMock.expectOne(r =>
      r.url.includes('/api/vital-signs') &&
      r.params.get('patientId') === '5' &&
      r.params.get('from') === '2026-01-01' &&
      r.params.get('to') === '2026-04-01' &&
      r.params.get('limit') === '10'
    );
    req.flush([mockSign]);
  });

  // ── getById ───────────────────────────────────────────────

  it('getById - should GET /api/vital-signs/1', () => {
    service.getById(1).subscribe(s => {
      expect(s.id).toBe(1);
      expect(s.spo2).toBe(98);
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSign);
  });

  // ── getByPatient ──────────────────────────────────────────

  it('getByPatient - should delegate to getAll with patientId', () => {
    service.getByPatient(5).subscribe(list => {
      expect(list.length).toBe(1);
    });
    const req = httpMock.expectOne(r =>
      r.url.includes('/api/vital-signs') && r.params.get('patientId') === '5'
    );
    req.flush([mockSign]);
  });

  it('getByPatient - should pass timeSeries params', () => {
    service.getByPatient(5, { from: '2026-01-01', limit: 5 }).subscribe();
    const req = httpMock.expectOne(r =>
      r.url.includes('/api/vital-signs') &&
      r.params.get('patientId') === '5' &&
      r.params.get('from') === '2026-01-01' &&
      r.params.get('limit') === '5'
    );
    req.flush([]);
  });

  // ── create ────────────────────────────────────────────────

  it('create - should POST vital sign and return created', () => {
    service.create(mockDTO).subscribe(s => {
      expect(s.id).toBe(1);
      expect(s.weight).toBe(22.5);
      expect(s.systolicBP).toBe(120);
    });
    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDTO);
    req.flush(mockSign);
  });

  // ── update ────────────────────────────────────────────────

  it('update - should PUT /api/vital-signs/1 with partial data', () => {
    const updated: VitalSign = { ...mockSign, temperature: 37.2, heartRate: 85 };
    service.update(1, { temperature: 37.2, heartRate: 85 }).subscribe(s => {
      expect(s.temperature).toBe(37.2);
      expect(s.heartRate).toBe(85);
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('update - should PUT weight update', () => {
    const updated: VitalSign = { ...mockSign, weight: 23.0 };
    service.update(1, { weight: 23.0 }).subscribe(s => {
      expect(s.weight).toBe(23.0);
    });
    httpMock.expectOne(`${baseUrl}/1`).flush(updated);
  });

  // ── deleteById ────────────────────────────────────────────

  it('deleteById - should DELETE /api/vital-signs/1', () => {
    service.deleteById(1).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
