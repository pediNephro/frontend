export interface RenalFunction {
  id?: number;
  creatinineLevel?: number;
  gfr?: number;
  gfrFormula?: string;
  coefficientK?: number;
  urineOutputRatio?: number;
  creatinineClearance?: number;
  calculationDate?: Date | string;
  vitalSignId?: number;
}

export interface RenalFunctionCreateDTO {
  creatinineLevel: number;
  gfrFormula: string;
  vitalSignId: number;
}