import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSignFormComponent } from './vital-sign-form.component';

describe('VitalSignFormComponent', () => {
  let component: VitalSignFormComponent;
  let fixture: ComponentFixture<VitalSignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSignFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalSignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
