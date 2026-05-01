import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionEpisodeFormComponent } from './rejection-episode-form.component';

describe('RejectionEpisodeFormComponent', () => {
  let component: RejectionEpisodeFormComponent;
  let fixture: ComponentFixture<RejectionEpisodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionEpisodeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionEpisodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
