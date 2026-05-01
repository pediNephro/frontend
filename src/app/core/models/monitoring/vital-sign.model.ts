import { Alert } from "./alert.model";
import { MedicalNote } from "./medical-note.model";
import { RenalFunction } from "./renal-function.model";

export interface VitalSign {
  id?: number;
  patientId: number;
  enteredBy: number;
  measurementDate: Date | string;
  
  // Anthropometric measurements
  weight?: number;
  height?: number;
  headCircumference?: number;
  bmi?: number;
  
  // Vital signs
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  urineOutput?: number;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
  
  // Relationships
  renalFunction?: RenalFunction;
  alerts?: Alert[];
  medicalNotes?: MedicalNote[];
}

export interface VitalSignCreateDTO {
  patientId: number;
  enteredBy: number;
  measurementDate: string;
  weight?: number;
  height?: number;
  headCircumference?: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  urineOutput?: number;
}