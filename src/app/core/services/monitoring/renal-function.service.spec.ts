import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RenalFunctionService } from './renal-function.service';

describe('RenalFunctionService', () => {
  let service: RenalFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RenalFunctionService]
    });
    service = TestBed.inject(RenalFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
