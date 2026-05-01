import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HlaCompatibilityListComponent } from './hla-compatibility-list.component';

describe('HlaCompatibilityListComponent', () => {
  let component: HlaCompatibilityListComponent;
  let fixture: ComponentFixture<HlaCompatibilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HlaCompatibilityListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HlaCompatibilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});