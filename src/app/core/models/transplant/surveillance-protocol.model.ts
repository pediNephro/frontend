export enum TransplantPhase {
  IMMEDIATE = 'IMMEDIATE',      // J0-J15
  EARLY = 'EARLY',               // J15-M3
  LONG_TERM = 'LONG_TERM'        // >M3
}

export interface SurveillanceProtocol {
  id?: number;
  transplantId: number;
  currentPhase: TransplantPhase;
  nextConsultationDate?: Date;
  nextLabTestDate?: Date;
  consultationFrequency: number;  // days
  labTestFrequency: number;       // days
  completionPercentage?: number;  // calculated
  isModified?: boolean;
  modificationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SurveillanceProtocolDTO {
  transplantId: number;
  currentPhase: TransplantPhase;
  nextConsultationDate?: string;
  nextLabTestDate?: string;
  consultationFrequency: number;
  labTestFrequency: number;
}