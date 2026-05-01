import { Biopsy } from "./biopsy.model";

export enum RejectionType {
  ACUTE = 'ACUTE',
  CHRONIC = 'CHRONIC'
}

export enum RejectionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE'
}

export enum RejectionStatus {
  SUSPECTED = 'SUSPECTED',
  CONFIRMED = 'CONFIRMED',
  RESOLVED = 'RESOLVED',
  ONGOING = 'ONGOING'
}

export interface RejectionEpisode {
  id?: number;
  transplantId: number;
  startDate: Date;
  endDate?: Date;
  rejectionType: RejectionType;
  severity: RejectionSeverity;
  creatinineIncrease: number;  // percentage
  gfrAtRejection: number;
  treatment?: string;
  status: RejectionStatus;
  biopsyId?: number;
  notes?: string;
  createdAt?: Date;
  
  // Relations
  biopsy?: Biopsy;
}

export interface RejectionEpisodeDTO {
  transplantId: number;
  startDate: string;
  rejectionType: RejectionType;
  severity: RejectionSeverity;
  creatinineIncrease: number;
  gfrAtRejection: number;
  treatment?: string;
  status: RejectionStatus;
  biopsyId?: number;
  notes?: string;
}