import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionEpisodeListComponent } from './rejection-episode-list.component';

describe('RejectionEpisodeListComponent', () => {
  let component: RejectionEpisodeListComponent;
  let fixture: ComponentFixture<RejectionEpisodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionEpisodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionEpisodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
