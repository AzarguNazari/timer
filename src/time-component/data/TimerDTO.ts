export interface TimerDTO {
  id: number;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  projectId: number;
  taskId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}