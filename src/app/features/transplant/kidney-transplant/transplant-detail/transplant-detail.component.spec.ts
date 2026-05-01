import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransplantDetailComponent } from './transplant-detail.component';

describe('TransplantDetailComponent', () => {
  let component: TransplantDetailComponent;
  let fixture: ComponentFixture<TransplantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransplantDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransplantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
