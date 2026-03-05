import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillanceProtocolFormComponent } from './surveillance-protocol-form.component';

describe('SurveillanceProtocolFormComponent', () => {
  let component: SurveillanceProtocolFormComponent;
  let fixture: ComponentFixture<SurveillanceProtocolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveillanceProtocolFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveillanceProtocolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});