import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenalFunctionDetailComponent } from './renal-function-detail.component';

describe('RenalFunctionDetailComponent', () => {
  let component: RenalFunctionDetailComponent;
  let fixture: ComponentFixture<RenalFunctionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenalFunctionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenalFunctionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
