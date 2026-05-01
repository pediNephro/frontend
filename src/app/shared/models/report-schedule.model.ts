export interface ReportScheduleRequest {
  scheduleName: string;
  scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  nextExecutionDate: string;
  active: boolean;
  userId: number;
  templateId: number;
  doctorId: number;
}
