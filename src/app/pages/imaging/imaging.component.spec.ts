import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImagingComponent } from './imaging.component';

describe('ImagingComponent', () => {
  let component: ImagingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagingComponent, HttpClientTestingModule]
    }).compileComponents();
    component = TestBed.createComponent(ImagingComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
