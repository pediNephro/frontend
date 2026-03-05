import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransplantListComponent } from './transplant-list.component';

describe('TransplantListComponent', () => {
  let component: TransplantListComponent;
  let fixture: ComponentFixture<TransplantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransplantListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransplantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
