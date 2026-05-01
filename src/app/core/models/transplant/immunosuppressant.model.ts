export enum DrugName {
  TACROLIMUS = 'TACROLIMUS',
  CYCLOSPORINE = 'CYCLOSPORINE',
  MMF = 'MMF',
  PREDNISONE = 'PREDNISONE',
  SIROLIMUS = 'SIROLIMUS',
  EVEROLIMUS = 'EVEROLIMUS'
}

export enum LevelStatus {
  IN_RANGE = 'IN_RANGE',
  BELOW = 'BELOW',
  ABOVE = 'ABOVE'
}

export interface Immunosuppressant {
  id?: number;
  transplantId: number;
  patientId: number;
  drugName: DrugName;
  currentDose: number;  // mg
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetTroughMin: number;  // ng/ml
  targetTroughMax: number;  // ng/ml
  lastTroughLevel?: number;
  lastMeasurementDate?: Date;
  levelStatus?: LevelStatus;
  adjustmentSuggestion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImmunosuppressantDTO {
  transplantId: number;
  patientId: number;
  drugName: DrugName;
  currentDose: number;
  startDate: string;
  isActive: boolean;
  targetTroughMin: number;
  targetTroughMax: number;
}

export interface TroughLevelUpdate {
  troughLevel: number;
  measurementDate: string;
}