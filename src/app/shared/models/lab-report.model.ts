export interface LabReport {
  id?: number;
  patientId: number;
  reportDate: string;
  analysisType?: string;
  laboratoryName?: string;
  comment?: string;
}
