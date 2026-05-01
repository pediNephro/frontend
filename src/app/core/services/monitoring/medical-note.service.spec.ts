import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalNoteService } from './medical-note.service';

describe('MedicalNoteService', () => {
  let service: MedicalNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalNoteService]
    });
    service = TestBed.inject(MedicalNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
