export interface MedicalNote {
  id?: number;
  authorId: number;
  content: string;
  creationDate: Date | string;
  vitalSignId?: number;
}

export interface MedicalNoteCreateDTO {
  authorId: number;
  content: string;
  vitalSignId?: number;
}
