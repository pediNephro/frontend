export enum CrossMatchResult {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE'
}

export interface HLACompatibility {
  id?: number;
  transplantId: number;
  donorHlaA: string;
  donorHlaB: string;
  donorHlaDr: string;
  recipientHlaA: string;
  recipientHlaB: string;
  recipientHlaDr: string;
  crossMatchResult: CrossMatchResult;
  numberOfMismatches?: number;  // calculated (0-6)
  compatibilityScore?: number;  // calculated
}

export interface HLACompatibilityDTO {
  transplantId: number;
  donorHlaA: string;
  donorHlaB: string;
  donorHlaDr: string;
  recipientHlaA: string;
  recipientHlaB: string;
  recipientHlaDr: string;
  crossMatchResult: CrossMatchResult;
}