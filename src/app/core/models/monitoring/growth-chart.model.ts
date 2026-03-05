export interface GrowthChart {
  id?: number;
  patientId: number;
  chartType: 'WEIGHT' | 'HEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE';
  
  ageMonths: number;
  value: number;
  percentile?: number;
  zScore?: number;
  
  dataPoints?: string; // JSON string
  abnormal: boolean;
  chartBreak: boolean;
  generationDate: Date | string;
}

export interface GrowthChartCreateDTO {
  patientId: number;
  chartType: 'WEIGHT' | 'HEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE';
  ageMonths: number;
  value: number;
}