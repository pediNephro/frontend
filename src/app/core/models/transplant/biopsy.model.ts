export enum BiopsyIndication {
  PROTOCOL = 'PROTOCOL',
  SUSPECTED_REJECTION = 'SUSPECTED_REJECTION',
  FOLLOW_UP = 'FOLLOW_UP'
}

export enum BanffCategory {
  NORMAL = 'NORMAL',
  BORDERLINE = 'BORDERLINE',
  ACUTE_REJECTION = 'ACUTE_REJECTION',
  CHRONIC = 'CHRONIC'
}

export interface Biopsy {
  id?: number;
  transplantId: number;
  biopsyDate: Date;
  indication: BiopsyIndication;
  banffScoreT?: number;  // 0-3
  banffScoreI?: number;  // 0-3
  banffScoreG?: number;  // 0-3
  banffCategory?: BanffCategory;
  conclusion?: string;
  reportPath?: string;
  histologicalImagesPath?: string;
  createdAt?: Date;
}

export interface BiopsyDTO {
  transplantId: number;
  biopsyDate: string;
  indication: BiopsyIndication;
  banffScoreT?: number;
  banffScoreI?: number;
  banffScoreG?: number;
  conclusion?: string;
}