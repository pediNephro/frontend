import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DocumentMedicalService } from './document-medical.service';

describe('DocumentMedicalService', () => {
  let service: DocumentMedicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentMedicalService]
    });
    service = TestBed.inject(DocumentMedicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
