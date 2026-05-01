import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientsComponent } from './patients.component';
import { PatientService } from '../../shared/services/patient.service';
import { MedicalRecordService } from '../../shared/services/medical-record.service';
import { AuthService } from '../../shared/services/auth.service';
import { PatientDTO, MedicalRecordDTO } from '../../shared/models/patient.models';
import { of, throwError } from 'rxjs';

describe('PatientsComponent', () => {
  let component: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockMedicalRecordService: jasmine.SpyObj<MedicalRecordService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockPatients: PatientDTO[] = [
    { id: 1, firstName: 'Mohamed', lastName: 'Ben Ali', birthDate: '2010-05-15', gender: 'MALE', phoneNumber: '+21623456789' },
    { id: 2, firstName: 'Sara', lastName: 'Mejri', birthDate: '2008-11-03', gender: 'FEMALE', phoneNumber: '+21611112222' }
  ];

  const mockRecords: MedicalRecordDTO[] = [
    { id: 10, patientId: 1, doctorId: 5, diagnosis: 'Insuffisance rénale', isArchived: false }
  ];

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', [
      'getAllPatients', 'createPatient', 'updatePatient', 'deletePatient'
    ]);
    mockMedicalRecordService = jasmine.createSpyObj('MedicalRecordService', ['getRecordsByPatientId']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserRole']);

    mockPatientService.getAllPatients.and.returnValue(of(mockPatients));
    mockAuthService.getUserRole.and.returnValue('DOCTOR');

    await TestBed.configureTestingModule({
      imports: [PatientsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: MedicalRecordService, useValue: mockMedicalRecordService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──────────────────────────────────────────────

  it('ngOnInit - should load patients on init', () => {
    expect(mockPatientService.getAllPatients).toHaveBeenCalled();
    expect(component.patients.length).toBe(2);
  });

  it('ngOnInit - should set isNurse to false for DOCTOR role', () => {
    expect(component.isNurse).toBeFalse();
  });

  it('ngOnInit - should set isNurse to true for NURSE role', async () => {
    mockAuthService.getUserRole.and.returnValue('NURSE');
    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isNurse).toBeTrue();
  });

  // ── filteredPatients ──────────────────────────────────────

  it('filteredPatients - should return all patients when no search term', () => {
    component.searchTerm = '';
    expect(component.filteredPatients.length).toBe(2);
  });

  it('filteredPatients - should filter by firstName', () => {
    component.searchTerm = 'Mohamed';
    expect(component.filteredPatients.length).toBe(1);
    expect(component.filteredPatients[0].firstName).toBe('Mohamed');
  });

  it('filteredPatients - should filter by lastName (case insensitive)', () => {
    component.searchTerm = 'mejri';
    expect(component.filteredPatients.length).toBe(1);
    expect(component.filteredPatients[0].lastName).toBe('Mejri');
  });

  it('filteredPatients - should filter by phoneNumber', () => {
    component.searchTerm = '+21611112222';
    expect(component.filteredPatients.length).toBe(1);
    expect(component.filteredPatients[0].phoneNumber).toBe('+21611112222');
  });

  it('filteredPatients - should return empty list when no match', () => {
    component.searchTerm = 'XXXXX';
    expect(component.filteredPatients.length).toBe(0);
  });

  // ── toggleSort ────────────────────────────────────────────

  it('toggleSort - should set sortColumn and direction asc initially', () => {
    component.toggleSort('patient');
    expect(component.sortColumn).toBe('patient');
    expect(component.sortDirection).toBe('asc');
  });

  it('toggleSort - should switch to desc when same column clicked twice', () => {
    component.toggleSort('patient');
    component.toggleSort('patient');
    expect(component.sortDirection).toBe('desc');
  });

  it('toggleSort - should reset direction to asc when new column selected', () => {
    component.toggleSort('patient');
    component.toggleSort('patient'); // desc
    component.toggleSort('gender');  // new column → asc
    expect(component.sortColumn).toBe('gender');
    expect(component.sortDirection).toBe('asc');
  });

  // ── openAddModal / openEditModal / closeModal ─────────────

  it('openAddModal - should reset form and show modal', () => {
    component.openAddModal();
    expect(component.showModal).toBeTrue();
    expect(component.isEditing).toBeFalse();
    expect(component.formPatient.firstName).toBe('');
  });

  it('openEditModal - should set editing mode with patient data', () => {
    component.openEditModal(mockPatients[0]);
    expect(component.showModal).toBeTrue();
    expect(component.isEditing).toBeTrue();
    expect(component.formPatient.firstName).toBe('Mohamed');
  });

  it('closeModal - should hide modal', () => {
    component.openAddModal();
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  // ── savePatient ───────────────────────────────────────────

  it('savePatient (create) - should call createPatient and push to list', () => {
    const newPatient: PatientDTO = { id: 3, firstName: 'Ali', lastName: 'Trabelsi', birthDate: '2012-06-01', gender: 'MALE', phoneNumber: '12345678' };
    mockPatientService.createPatient.and.returnValue(of(newPatient));
    component.isEditing = false;
    component.formPatient = { firstName: 'Ali', lastName: 'Trabelsi', birthDate: '2012-06-01', gender: 'MALE', phoneNumber: '12345678' };
    const form = { invalid: false } as any;
    component.savePatient(form);
    expect(mockPatientService.createPatient).toHaveBeenCalled();
    expect(component.patients.length).toBe(3);
    expect(component.showModal).toBeFalse();
  });

  it('savePatient (edit) - should call updatePatient and update list', () => {
    const updated = { ...mockPatients[0], firstName: 'Mohammed' };
    mockPatientService.updatePatient.and.returnValue(of(updated));
    component.isEditing = true;
    component.formPatient = { ...mockPatients[0], firstName: 'Mohammed' };
    const form = { invalid: false } as any;
    component.savePatient(form);
    expect(mockPatientService.updatePatient).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(component.patients[0].firstName).toBe('Mohammed');
  });

  it('savePatient - should not save when form invalid', () => {
    const form = { invalid: true } as any;
    component.savePatient(form);
    expect(mockPatientService.createPatient).not.toHaveBeenCalled();
    expect(mockPatientService.updatePatient).not.toHaveBeenCalled();
  });

  // ── confirmDelete / cancelDelete / deletePatient ──────────

  it('confirmDelete - should open delete modal with patient', () => {
    component.confirmDelete(mockPatients[0]);
    expect(component.showDeleteModal).toBeTrue();
    expect(component.patientToDelete).toEqual(mockPatients[0]);
  });

  it('cancelDelete - should hide delete modal', () => {
    component.confirmDelete(mockPatients[0]);
    component.cancelDelete();
    expect(component.showDeleteModal).toBeFalse();
    expect(component.patientToDelete).toBeNull();
  });

  it('deletePatient - should remove patient from list', () => {
    mockPatientService.deletePatient.and.returnValue(of(undefined));
    component.patientToDelete = mockPatients[0];
    component.deletePatient();
    expect(mockPatientService.deletePatient).toHaveBeenCalledWith(1);
    expect(component.patients.find(p => p.id === 1)).toBeUndefined();
    expect(component.showDeleteModal).toBeFalse();
  });

  // ── viewRecords / closeRecordsModal ──────────────────────

  it('viewRecords - should load records for patient', () => {
    mockMedicalRecordService.getRecordsByPatientId.and.returnValue(of(mockRecords));
    component.viewRecords(mockPatients[0]);
    expect(component.showRecordsModal).toBeTrue();
    expect(component.selectedPatient).toEqual(mockPatients[0]);
    expect(component.patientRecords.length).toBe(1);
    expect(component.loadingRecords).toBeFalse();
  });

  it('closeRecordsModal - should reset modal state', () => {
    mockMedicalRecordService.getRecordsByPatientId.and.returnValue(of(mockRecords));
    component.viewRecords(mockPatients[0]);
    component.closeRecordsModal();
    expect(component.showRecordsModal).toBeFalse();
    expect(component.selectedPatient).toBeNull();
    expect(component.patientRecords.length).toBe(0);
  });

  // ── getGenderLabel ────────────────────────────────────────

  it('getGenderLabel("MALE") - should return "Male"', () => {
    expect(component.getGenderLabel('MALE')).toBe('Male');
  });

  it('getGenderLabel("FEMALE") - should return "Female"', () => {
    expect(component.getGenderLabel('FEMALE')).toBe('Female');
  });

  it('getGenderLabel("OTHER") - should return "Other"', () => {
    expect(component.getGenderLabel('OTHER')).toBe('Other');
  });

  it('getGenderLabel(unknown) - should return raw value', () => {
    expect(component.getGenderLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});
