export interface Alert {
  id?: number;
  patientId: number;
  type: string; // HYPERTENSION, CRITICAL_GFR, OLIGURIA
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  
  measuredValue?: number;
  threshold?: number;
  parameter?: string;
  
  acknowledged: boolean;
  acknowledgedBy?: number;
  acknowledgmentDate?: Date | string;
  acknowledgmentComment?: string;
  
  generationDate: Date | string;
  vitalSignId?: number;
}

export interface AlertAcknowledgeDTO {
  acknowledgedBy: number;
  acknowledgmentComment?: string;
}