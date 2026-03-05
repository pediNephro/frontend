import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSignListComponent } from './vital-sign-list.component';

describe('VitalSignListComponent', () => {
  let component: VitalSignListComponent;
  let fixture: ComponentFixture<VitalSignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSignListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalSignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
