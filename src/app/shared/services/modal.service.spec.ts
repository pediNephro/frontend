import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ModalService] });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isOpen - should be false by default', () => {
    expect(service.isOpen).toBeFalse();
  });

  it('openModal - should set isOpen to true', (done) => {
    service.openModal();
    service.isOpen$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  it('closeModal - should set isOpen to false', (done) => {
    service.openModal();
    service.closeModal();
    service.isOpen$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('toggleModal - should switch from false to true', (done) => {
    service.toggleModal();
    service.isOpen$.subscribe(val => { expect(val).toBeTrue(); done(); });
  });

  it('toggleModal - should switch from true to false', (done) => {
    service.openModal();
    service.toggleModal();
    service.isOpen$.subscribe(val => { expect(val).toBeFalse(); done(); });
  });

  it('isOpen getter - should reflect current state after openModal', () => {
    service.openModal();
    expect(service.isOpen).toBeTrue();
  });

  it('isOpen getter - should reflect current state after closeModal', () => {
    service.openModal();
    service.closeModal();
    expect(service.isOpen).toBeFalse();
  });
});
