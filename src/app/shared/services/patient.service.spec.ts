import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { PatientDTO } from '../models/patient.models';

describe('PatientService (shared)', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8085/api/patients';

  const mockPatient: PatientDTO = {
    id: 1, firstName: 'Mohamed', lastName: 'Ben Ali',
    birthDate: '2010-05-15', gender: 'MALE', phoneNumber: '+21623456789'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getAllPatients ─────────────────────────────────────────

  it('getAllPatients - should GET all patients', () => {
    service.getAllPatients().subscribe(patients => {
      expect(patients.length).toBe(2);
      expect(patients[0].firstName).toBe('Mohamed');
    });
    const http = httpMock.expectOne(baseUrl);
    expect(http.request.method).toBe('GET');
    http.flush([mockPatient, { id: 2, firstName: 'Sara', lastName: 'Mejri', birthDate: '2008-11-03', gender: 'FEMALE', phoneNumber: '+21611112222' }]);
  });

  it('getAllPatients - should return empty list when no patients', () => {
    service.getAllPatients().subscribe(patients => {
      expect(patients).toEqual([]);
    });
    httpMock.expectOne(baseUrl).flush([]);
  });

  // ── getPatientById ────────────────────────────────────────

  it('getPatientById - should GET /1 and return patient', () => {
    service.getPatientById(1).subscribe(p => {
      expect(p.id).toBe(1);
      expect(p.lastName).toBe('Ben Ali');
    });
    const http = httpMock.expectOne(`${baseUrl}/1`);
    expect(http.request.method).toBe('GET');
    http.flush(mockPatient);
  });

  // ── createPatient ─────────────────────────────────────────

  it('createPatient - should POST patient and return created', () => {
    const newPatient: PatientDTO = {
      firstName: 'Fatima', lastName: 'Zouari',
      birthDate: '2015-03-20', gender: 'FEMALE', phoneNumber: '+21698765432'
    };
    service.createPatient(newPatient).subscribe(p => {
      expect(p.id).toBe(3);
      expect(p.firstName).toBe('Fatima');
    });
    const http = httpMock.expectOne(baseUrl);
    expect(http.request.method).toBe('POST');
    expect(http.request.body).toEqual(newPatient);
    http.flush({ ...newPatient, id: 3 });
  });

  // ── updatePatient ─────────────────────────────────────────

  it('updatePatient - should PUT /1 with updated data', () => {
    const updated: PatientDTO = { ...mockPatient, firstName: 'Mohammed' };
    service.updatePatient(1, updated).subscribe(p => {
      expect(p.firstName).toBe('Mohammed');
    });
    const http = httpMock.expectOne(`${baseUrl}/1`);
    expect(http.request.method).toBe('PUT');
    http.flush(updated);
  });

  // ── deletePatient ─────────────────────────────────────────

  it('deletePatient - should DELETE /1', () => {
    service.deletePatient(1).subscribe();
    const http = httpMock.expectOne(`${baseUrl}/1`);
    expect(http.request.method).toBe('DELETE');
    http.flush(null);
  });
});
