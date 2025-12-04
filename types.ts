export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  photoUrl: string; // Base64 string of the registered face
  registeredAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  date: string; // ISO Date string YYYY-MM-DD
  timestamp: string; // ISO Full string
  status: 'Present' | 'Late' | 'Absent'; // Simplified for this app
  confidence: number; // Simulated matching confidence
}

export interface DailyReport {
  date: string;
  totalPresent: number;
  totalStudents: number;
  attendanceRate: number;
}

export type ViewState = 'DASHBOARD' | 'REGISTER' | 'ATTENDANCE' | 'REPORTS';