import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HlaCompatibilityFormComponent } from './hla-compatibility-form.component';

describe('HlaCompatibilityFormComponent', () => {
  let component: HlaCompatibilityFormComponent;
  let fixture: ComponentFixture<HlaCompatibilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HlaCompatibilityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HlaCompatibilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});