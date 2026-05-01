import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SidebarService] });
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── isExpanded$ ───────────────────────────────────────────

  it('isExpanded$ - should default to true', (done) => {
    service.isExpanded$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  it('setExpanded(false) - should emit false', (done) => {
    service.setExpanded(false);
    service.isExpanded$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('toggleExpanded - should switch from true to false', (done) => {
    service.toggleExpanded();
    service.isExpanded$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('toggleExpanded twice - should return to true', (done) => {
    service.toggleExpanded();
    service.toggleExpanded();
    service.isExpanded$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  // ── isMobileOpen$ ─────────────────────────────────────────

  it('isMobileOpen$ - should default to false', (done) => {
    service.isMobileOpen$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('setMobileOpen(true) - should emit true', (done) => {
    service.setMobileOpen(true);
    service.isMobileOpen$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  it('toggleMobileOpen - should switch from false to true', (done) => {
    service.toggleMobileOpen();
    service.isMobileOpen$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  // ── isHovered$ ────────────────────────────────────────────

  it('isHovered$ - should default to false', (done) => {
    service.isHovered$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('setHovered(true) - should emit true', (done) => {
    service.setHovered(true);
    service.isHovered$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  it('setHovered(false) after true - should revert to false', (done) => {
    service.setHovered(true);
    service.setHovered(false);
    service.isHovered$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });
});
