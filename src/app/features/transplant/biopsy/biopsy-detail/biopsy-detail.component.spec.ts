import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiopsyDetailComponent } from './biopsy-detail.component';

describe('BiopsyDetailComponent', () => {
  let component: BiopsyDetailComponent;
  let fixture: ComponentFixture<BiopsyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiopsyDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiopsyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
