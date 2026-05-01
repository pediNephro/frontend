import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HospitalisationService } from './hospitalisation.service';

describe('HospitalisationService', () => {
  let service: HospitalisationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HospitalisationService]
    });
    service = TestBed.inject(HospitalisationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch hospitalisations', () => {
    const mockData = [
      { id: 1, patientId: 1, service: 'Cardiologie', motif: 'Infarctus', statut: 'actif' }
    ];

    service.getAll().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].service).toBe('Cardiologie');
    });

    const req = httpMock.expectOne(req => req.url.includes('/hospitalisation'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
