import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentsComponent } from './documents.component';
import { DocumentMedicalService, DocumentMedical } from '../../services/document-medical.service';
import { PatientService } from '../../services/patient.service';
import { of, throwError } from 'rxjs';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  let mockDocService: jasmine.SpyObj<DocumentMedicalService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;

  const mockDocuments: DocumentMedical[] = [
    { id: 1, nomFichier: 'ordonnance.pdf', type: 'ORDONNANCE', dateUpload: '2026-01-10', patientId: 1 },
    { id: 2, nomFichier: 'bilan.jpg', type: 'BILAN', dateUpload: '2026-02-05', patientId: 2 }
  ];

  const mockPatients = [
    { id: 1, nom: 'Ben Ali', prenom: 'Mohamed' },
    { id: 2, nom: 'Mejri', prenom: 'Sara' }
  ];

  beforeEach(async () => {
    mockDocService = jasmine.createSpyObj('DocumentMedicalService', [
      'getAll', 'create', 'update', 'delete', 'filter', 'verifierCompletude',
      'classifier', 'saveOcr', 'searchOCR', 'exporterPdf', 'getRisk'
    ]);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getAllPatients']);

    mockDocService.getAll.and.returnValue(of(mockDocuments));
    mockPatientService.getAllPatients.and.returnValue(of(mockPatients));

    await TestBed.configureTestingModule({
      imports: [DocumentsComponent, HttpClientTestingModule],
      providers: [
        { provide: DocumentMedicalService, useValue: mockDocService },
        { provide: PatientService, useValue: mockPatientService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──────────────────────────────────────────────

  it('ngOnInit - should load documents and patients', () => {
    expect(mockDocService.getAll).toHaveBeenCalled();
    expect(mockPatientService.getAllPatients).toHaveBeenCalled();
    expect(component.documents.length).toBe(2);
    expect(component.patients.length).toBe(2);
  });

  it('load - should set loading to false after success', () => {
    component.load();
    expect(component.loading).toBeFalse();
    expect(component.documents).toEqual(mockDocuments);
  });

  it('load - should set errorMessage on failure', () => {
    mockDocService.getAll.and.returnValue(throwError(() => ({ status: 500 })));
    component.load();
    expect(component.errorMessage).toContain('500');
    expect(component.loading).toBeFalse();
  });

  // ── switchTab ─────────────────────────────────────────────

  it('switchTab("add") - should switch active tab to add', () => {
    component.switchTab('add');
    expect(component.activeTab).toBe('add');
  });

  it('switchTab("list") - should reset editMode and formError', () => {
    component.isEditMode = true;
    component.formError = 'some error';
    component.switchTab('list');
    expect(component.activeTab).toBe('list');
    expect(component.isEditMode).toBeFalse();
    expect(component.formError).toBe('');
  });

  // ── editDocument ──────────────────────────────────────────

  it('editDocument - should enter edit mode and switch to add tab', () => {
    component.editDocument(mockDocuments[0]);
    expect(component.isEditMode).toBeTrue();
    expect(component.editingId).toBe(1);
    expect(component.activeTab).toBe('add');
    expect(component.newDocument.type).toBe('ORDONNANCE');
  });

  // ── cancelEdit ────────────────────────────────────────────

  it('cancelEdit - should reset form and go back to list', () => {
    component.editDocument(mockDocuments[0]);
    component.cancelEdit();
    expect(component.isEditMode).toBeFalse();
    expect(component.editingId).toBeUndefined();
    expect(component.activeTab).toBe('list');
  });

  // ── openDeleteModal / cancelDelete ────────────────────────

  it('openDeleteModal - should set deletingId and show modal', () => {
    component.openDeleteModal(5);
    expect(component.deletingId).toBe(5);
    expect(component.showDeleteModal).toBeTrue();
  });

  it('cancelDelete - should hide modal and clear deletingId', () => {
    component.openDeleteModal(5);
    component.cancelDelete();
    expect(component.showDeleteModal).toBeFalse();
    expect(component.deletingId).toBeUndefined();
  });

  // ── confirmDelete ─────────────────────────────────────────

  it('confirmDelete - should call delete and reload', () => {
    mockDocService.delete.and.returnValue(of(undefined));
    component.openDeleteModal(1);
    component.confirmDelete();
    expect(mockDocService.delete).toHaveBeenCalledWith(1);
    expect(component.showDeleteModal).toBeFalse();
  });

  // ── getPatientName ────────────────────────────────────────

  it('getPatientName - should return full name for known patient', () => {
    const name = component.getPatientName(1);
    expect(name).toBe('Ben Ali Mohamed');
  });

  it('getPatientName - should return "—" for unknown patient', () => {
    const name = component.getPatientName(99);
    expect(name).toBe('—');
  });

  // ── getConfianceBadgeClass ────────────────────────────────

  it('getConfianceBadgeClass("HAUTE") - should return green class', () => {
    expect(component.getConfianceBadgeClass('HAUTE')).toContain('green');
  });

  it('getConfianceBadgeClass("MOYENNE") - should return yellow class', () => {
    expect(component.getConfianceBadgeClass('MOYENNE')).toContain('yellow');
  });

  it('getConfianceBadgeClass("FAIBLE") - should return red class', () => {
    expect(component.getConfianceBadgeClass('FAIBLE')).toContain('red');
  });

  // ── getConfianceLabel ─────────────────────────────────────

  it('getConfianceLabel("HAUTE") - should return "Sûr"', () => {
    expect(component.getConfianceLabel('HAUTE')).toBe('Sûr');
  });

  it('getConfianceLabel("MOYENNE") - should return "Incertain"', () => {
    expect(component.getConfianceLabel('MOYENNE')).toBe('Incertain');
  });

  it('getConfianceLabel("FAIBLE") - should return "À vérifier"', () => {
    expect(component.getConfianceLabel('FAIBLE')).toBe('À vérifier');
  });

  // ── verifierCompletude ────────────────────────────────────

  it('verifierCompletude - should not call service when filterPatientId is 0', () => {
    component.filterPatientId = 0;
    component.verifierCompletude();
    expect(mockDocService.verifierCompletude).not.toHaveBeenCalled();
  });

  it('verifierCompletude - should call service when filterPatientId > 0', () => {
    const mockResult = { complet: true, pourcentage: 100, score: 'A', presents: [], manquants: [], typesRequis: [], totalDocuments: 5 };
    mockDocService.verifierCompletude.and.returnValue(of(mockResult));
    component.filterPatientId = 1;
    component.verifierCompletude();
    expect(mockDocService.verifierCompletude).toHaveBeenCalledWith(1);
    expect(component.completudeResult).toEqual(mockResult);
  });

  // ── pagination ────────────────────────────────────────────

  it('nextPage - should increment page and apply filters', () => {
    mockDocService.filter.and.returnValue(of({ content: [], totalPages: 3 }));
    component.totalPages = 3;
    component.page = 0;
    component.nextPage();
    expect(component.page).toBe(1);
  });

  it('prevPage - should not go below page 0', () => {
    component.page = 0;
    component.prevPage();
    expect(component.page).toBe(0);
  });

  it('prevPage - should decrement page when page > 0', () => {
    mockDocService.filter.and.returnValue(of({ content: [], totalPages: 3 }));
    component.page = 2;
    component.totalPages = 3;
    component.prevPage();
    expect(component.page).toBe(1);
  });

  // ── resetFiltres ──────────────────────────────────────────

  it('resetFiltres - should reset all filters and reload', () => {
    component.filterPatientId = 5;
    component.filterType = 'PDF';
    component.filterDate = '2026-01-01';
    component.resetFiltres();
    expect(component.filterPatientId).toBe(0);
    expect(component.filterType).toBe('');
    expect(component.filterDate).toBe('');
    expect(component.page).toBe(0);
    expect(mockDocService.getAll).toHaveBeenCalled();
  });

  // ── searchOCR ─────────────────────────────────────────────

  it('searchOCR - should call getAll when query is empty', () => {
    component.searchQuery = '   ';
    component.searchOCR();
    expect(mockDocService.getAll).toHaveBeenCalled();
  });

  it('searchOCR - should call searchOCR service when query is set', () => {
    mockDocService.searchOCR.and.returnValue(of(mockDocuments));
    component.searchQuery = 'ordonnance';
    component.searchOCR();
    expect(mockDocService.searchOCR).toHaveBeenCalledWith('ordonnance');
    expect(component.documents).toEqual(mockDocuments);
  });

  // ── removeFile ────────────────────────────────────────────

  it('removeFile - should reset file state and clear document fields', () => {
    component.selectedFile = new File([''], 'test.jpg');
    component.newDocument.nomFichier = 'test.jpg';
    component.removeFile();
    expect(component.selectedFile).toBeNull();
    expect(component.newDocument.nomFichier).toBe('');
    expect(component.newDocument.contenuOcr).toBe('');
  });
});
