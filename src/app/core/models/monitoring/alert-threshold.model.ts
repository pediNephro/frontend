export interface AlertThreshold {
  id?: number;
  patientId: number;
  parameter: string; // SYSTOLIC_BP, GFR, SPO2
  minThreshold?: number;
  maxThreshold?: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  
  active: boolean;
  customMessage?: string;
  createdBy: number;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface AlertThresholdCreateDTO {
  patientId: number;
  parameter: string;
  minThreshold?: number;
  maxThreshold?: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  customMessage?: string;
  createdBy: number;
}