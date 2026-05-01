import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EpisodesComponent } from './episodes.component';

describe('EpisodesComponent', () => {
  let component: EpisodesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesComponent, HttpClientTestingModule]
    }).compileComponents();
    component = TestBed.createComponent(EpisodesComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
