// =============================================
// Microservice 2 — Patient / Medical Record Models
// =============================================

export interface PatientDTO {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;    // ISO date string "YYYY-MM-DD"
  gender: string;       // 'MALE' | 'FEMALE' | 'OTHER'
  phoneNumber?: string;
}

export interface MedicalRecordDTO {
  id?: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  treatment?: string;
  notes?: string;
  isArchived?: boolean;
  imageUrl?: string;
  createdAt?: string;   // ISO datetime
}
