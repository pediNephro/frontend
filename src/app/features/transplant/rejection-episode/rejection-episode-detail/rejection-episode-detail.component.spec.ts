import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionEpisodeDetailComponent } from './rejection-episode-detail.component';

describe('RejectionEpisodeDetailComponent', () => {
  let component: RejectionEpisodeDetailComponent;
  let fixture: ComponentFixture<RejectionEpisodeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionEpisodeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionEpisodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
