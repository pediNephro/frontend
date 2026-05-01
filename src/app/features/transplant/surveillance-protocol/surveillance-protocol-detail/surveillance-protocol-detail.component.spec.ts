import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillanceProtocolDetailComponent } from './surveillance-protocol-detail.component';

describe('SurveillanceProtocolDetailComponent', () => {
  let component: SurveillanceProtocolDetailComponent;
  let fixture: ComponentFixture<SurveillanceProtocolDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveillanceProtocolDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveillanceProtocolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});