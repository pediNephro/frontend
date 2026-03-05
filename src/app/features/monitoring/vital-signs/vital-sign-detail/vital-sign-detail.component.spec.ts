import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSignDetailComponent } from './vital-sign-detail.component';

describe('VitalSignDetailComponent', () => {
  let component: VitalSignDetailComponent;
  let fixture: ComponentFixture<VitalSignDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSignDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalSignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
