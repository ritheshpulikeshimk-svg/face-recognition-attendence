import { Student, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'faceguard_students',
  ATTENDANCE: 'faceguard_attendance',
};

// --- Students CRUD ---

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
};

export const saveStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const deleteStudent = (id: string): void => {
  const students = getStudents().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

// --- Attendance CRUD ---

export const getAttendance = (): AttendanceRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const markAttendance = (record: AttendanceRecord): void => {
  const records = getAttendance();
  // Check if already marked for today to prevent duplicates
  const alreadyMarked = records.some(
    r => r.studentId === record.studentId && r.date === record.date
  );
  
  if (!alreadyMarked) {
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }
};

export const clearDatabase = () => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
};