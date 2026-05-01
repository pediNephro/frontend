import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HospitalisationsComponent } from './hospitalisations.component';

describe('HospitalisationsComponent', () => {
  let component: HospitalisationsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalisationsComponent, HttpClientTestingModule]
    }).compileComponents();
    component = TestBed.createComponent(HospitalisationsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
