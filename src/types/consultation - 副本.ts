export interface Consultation {
  id: string;
  userId: string;
  userName?: string;
  mainSymptoms: string;
  mainRequests: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'answered' | 'closed';
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
  replyCount?: number;
}

export interface ConsultationGroup {
  contentHash: string;
  count: number;
  latestConsultation: Consultation;
  consultations: Consultation[];
}

export interface ConsultationFormData {
  mainSymptoms: string;
  mainRequests: string;
  description: string;
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface ConsultationExample {
  mainSymptoms: string;
  mainRequests: string;
  description: string;
}

export interface ConsultationReply {
  id: string;
  consultationId: string;
  doctorId: string;
  doctorName: string;
  content: string;
  createdAt: string;
  isProfessional: boolean;
}

export interface ConsultationDetail {
  consultation: Consultation;
  replies: ConsultationReply[];
}