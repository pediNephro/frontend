import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillanceProtocolListComponent } from './surveillance-protocol-list.component';

describe('SurveillanceProtocolListComponent', () => {
  let component: SurveillanceProtocolListComponent;
  let fixture: ComponentFixture<SurveillanceProtocolListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveillanceProtocolListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveillanceProtocolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});