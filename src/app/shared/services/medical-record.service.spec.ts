import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordDTO } from '../models/patient.models';

describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8085/api/medical-records';

  const mockRecord: MedicalRecordDTO = {
    id: 10, patientId: 1, doctorId: 5,
    diagnosis: 'Insuffisance rénale chronique',
    treatment: 'Dialyse 3x/semaine',
    notes: 'Contrôle mensuel requis',
    isArchived: false,
    createdAt: '2026-01-10T09:00:00'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalRecordService]
    });
    service = TestBed.inject(MedicalRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getAllRecords ──────────────────────────────────────────

  it('getAllRecords - should GET all records', () => {
    service.getAllRecords().subscribe(records => {
      expect(records.length).toBe(1);
      expect(records[0].diagnosis).toBe('Insuffisance rénale chronique');
    });
    const http = httpMock.expectOne(baseUrl);
    expect(http.request.method).toBe('GET');
    http.flush([mockRecord]);
  });

  // ── getRecordById ─────────────────────────────────────────

  it('getRecordById - should GET /10 and return record', () => {
    service.getRecordById(10).subscribe(r => {
      expect(r.id).toBe(10);
      expect(r.patientId).toBe(1);
    });
    const http = httpMock.expectOne(`${baseUrl}/10`);
    expect(http.request.method).toBe('GET');
    http.flush(mockRecord);
  });

  // ── createRecord ──────────────────────────────────────────

  it('createRecord - should POST and return created record', () => {
    const newRecord: MedicalRecordDTO = {
      patientId: 1, doctorId: 5,
      diagnosis: 'Hypertension', treatment: 'Antihypertenseurs',
      notes: 'Suivi mensuel', isArchived: false
    };
    service.createRecord(newRecord).subscribe(r => {
      expect(r.id).toBe(11);
      expect(r.diagnosis).toBe('Hypertension');
    });
    const http = httpMock.expectOne(baseUrl);
    expect(http.request.method).toBe('POST');
    http.flush({ ...newRecord, id: 11 });
  });

  // ── updateRecord ──────────────────────────────────────────

  it('updateRecord - should PUT /10 with updated data', () => {
    const updated: MedicalRecordDTO = { ...mockRecord, isArchived: true };
    service.updateRecord(10, updated).subscribe(r => {
      expect(r.isArchived).toBeTrue();
    });
    const http = httpMock.expectOne(`${baseUrl}/10`);
    expect(http.request.method).toBe('PUT');
    http.flush(updated);
  });

  // ── deleteRecord ──────────────────────────────────────────

  it('deleteRecord - should DELETE /10', () => {
    service.deleteRecord(10).subscribe();
    const http = httpMock.expectOne(`${baseUrl}/10`);
    expect(http.request.method).toBe('DELETE');
    http.flush(null);
  });

  // ── getRecordsByPatientId ─────────────────────────────────

  it('getRecordsByPatientId - should GET /patient/1', () => {
    service.getRecordsByPatientId(1).subscribe(records => {
      expect(records.length).toBe(1);
      expect(records[0].patientId).toBe(1);
    });
    const http = httpMock.expectOne(`${baseUrl}/patient/1`);
    expect(http.request.method).toBe('GET');
    http.flush([mockRecord]);
  });

  it('getRecordsByPatientId - should return empty for unknown patient', () => {
    service.getRecordsByPatientId(99).subscribe(records => {
      expect(records).toEqual([]);
    });
    httpMock.expectOne(`${baseUrl}/patient/99`).flush([]);
  });

  // ── getRecordsByDoctorId ──────────────────────────────────

  it('getRecordsByDoctorId - should GET /doctor/5', () => {
    service.getRecordsByDoctorId(5).subscribe(records => {
      expect(records[0].doctorId).toBe(5);
    });
    httpMock.expectOne(`${baseUrl}/doctor/5`).flush([mockRecord]);
  });

  // ── getRecordsByArchiveStatus ─────────────────────────────

  it('getRecordsByArchiveStatus(false) - should GET /archived/false', () => {
    service.getRecordsByArchiveStatus(false).subscribe(records => {
      expect(records[0].isArchived).toBeFalse();
    });
    httpMock.expectOne(`${baseUrl}/archived/false`).flush([mockRecord]);
  });

  it('getRecordsByArchiveStatus(true) - should GET /archived/true', () => {
    service.getRecordsByArchiveStatus(true).subscribe(records => {
      expect(records[0].isArchived).toBeTrue();
    });
    httpMock.expectOne(`${baseUrl}/archived/true`).flush([{ ...mockRecord, isArchived: true }]);
  });

  // ── analyzeRecord ─────────────────────────────────────────

  it('analyzeRecord - should POST /10/analyze and return analysis', () => {
    service.analyzeRecord(10).subscribe(res => {
      expect(res.analysis).toBe('Risque modéré détecté');
    });
    const http = httpMock.expectOne(`${baseUrl}/10/analyze`);
    expect(http.request.method).toBe('POST');
    http.flush({ analysis: 'Risque modéré détecté' });
  });

  // ── downloadAnalysisPdf ───────────────────────────────────

  it('downloadAnalysisPdf - should GET /10/analyze/pdf as blob', () => {
    service.downloadAnalysisPdf(10).subscribe(blob => {
      expect(blob).toBeTruthy();
    });
    const http = httpMock.expectOne(`${baseUrl}/10/analyze/pdf`);
    expect(http.request.method).toBe('GET');
    expect(http.request.responseType).toBe('blob');
    http.flush(new Blob(['PDF'], { type: 'application/pdf' }));
  });
});
