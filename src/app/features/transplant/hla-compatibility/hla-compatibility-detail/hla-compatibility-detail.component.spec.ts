import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HlaCompatibilityDetailComponent } from './hla-compatibility-detail.component';

describe('HlaCompatibilityDetailComponent', () => {
  let component: HlaCompatibilityDetailComponent;
  let fixture: ComponentFixture<HlaCompatibilityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HlaCompatibilityDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HlaCompatibilityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});