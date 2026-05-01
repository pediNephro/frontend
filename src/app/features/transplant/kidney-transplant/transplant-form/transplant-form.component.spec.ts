import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransplantFormComponent } from './transplant-form.component';

describe('TransplantFormComponent', () => {
  let component: TransplantFormComponent;
  let fixture: ComponentFixture<TransplantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransplantFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransplantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
