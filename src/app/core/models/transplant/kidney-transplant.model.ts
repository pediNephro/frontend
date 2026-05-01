import { Biopsy } from "./biopsy.model";
import { Complication } from "./complication.model";
import { HLACompatibility } from "./hla-compatibility.model";
import { Immunosuppressant } from "./immunosuppressant.model";
import { RejectionEpisode } from "./rejection-episode.model";
import { SurveillanceProtocol } from "./surveillance-protocol.model";

export enum DonorType {
  LIVING = 'LIVING',
  DECEASED = 'DECEASED'
}

export enum GraftStatus {
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  LOST = 'LOST',
  FUNCTIONING = 'FUNCTIONING'
}

export interface KidneyTransplant {
  id?: number;
  patientId: number;
  transplantDate: Date;
  donorType: DonorType;
  donorBloodGroup: string;
  coldIschemiaTime: number;  // minutes
  graftStatus: GraftStatus;
  surgicalReportPath?: string;
  postTransplantDays?: number;  // calculated
  createdAt?: Date;
  updatedAt?: Date;
  
  // Relations
  hlaCompatibility?: HLACompatibility;
  surveillanceProtocol?: SurveillanceProtocol;
  rejectionEpisodes?: RejectionEpisode[];
  biopsies?: Biopsy[];
  immunosuppressants?: Immunosuppressant[];
  complications?: Complication[];
  //patient?: Patient;
}

export interface KidneyTransplantDTO {
  patientId: number;
  transplantDate: string;  // ISO string
  donorType: DonorType;
  donorBloodGroup: string;
  coldIschemiaTime: number;
  graftStatus: GraftStatus;
  surgicalReportPath?: string;
}