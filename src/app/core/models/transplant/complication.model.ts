export enum ComplicationType {
  INFECTIOUS = 'INFECTIOUS',
  VASCULAR = 'VASCULAR',
  UROLOGICAL = 'UROLOGICAL',
  NEOPLASTIC = 'NEOPLASTIC',
  METABOLIC = 'METABOLIC',
  OTHER = 'OTHER'
}

export enum ComplicationSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
}

export enum ComplicationStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  CHRONIC = 'CHRONIC'
}

export interface Complication {
  id?: number;
  transplantId: number;
  complicationType: ComplicationType;
  subType?: string;  // CMV, BKV, UTI...
  appearanceDate: Date;
  resolutionDate?: Date;
  severity: ComplicationSeverity;
  description: string;
  treatment?: string;
  status: ComplicationStatus;
  createdAt?: Date;
}

export interface ComplicationDTO {
  transplantId: number;
  complicationType: ComplicationType;
  subType?: string;
  appearanceDate: string;
  severity: ComplicationSeverity;
  description: string;
  treatment?: string;
  status: ComplicationStatus;
}