export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  age: number;
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  allergies?: string[];
  chronicDiseases?: string[];
}

export interface HealthRecord {
  id: string;
  type: 'blood_pressure' | 'blood_sugar' | 'heart_rate' | 'weight' | 'temperature';
  value: number;
  unit: string;
  measuredAt: string;
  note?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  hospital: string;
  department: string;
  doctor: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescription?: string;
  followUp?: string;
}

export interface PhysicalExam {
  id: string;
  date: string;
  hospital: string;
  items: ExamItem[];
  summary?: string;
  doctor: string;
}

export interface ExamItem {
  name: string;
  result: string;
  normalRange: string;
  unit?: string;
  isNormal: boolean;
}

export interface KeyInformation {
  id: string;
  type: 'allergy' | 'chronic_disease' | 'surgery_history' | 'family_history' | 'medication';
  title: string;
  content: string;
  severity?: 'mild' | 'moderate' | 'severe';
  startDate?: string;
  note?: string;
}

export interface Collection {
  id: string;
  type: 'article' | 'medicine' | 'case' | 'doctor';
  title: string;
  content: string;
  source?: string;
  collectedAt: string;
}