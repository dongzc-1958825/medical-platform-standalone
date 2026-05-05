// src/shared/services/consultService.ts

import { 
  Consultation, 
  Reply, 
  ConsultationVersion,
  PatientBasicInfo,
  SymptomDetail,
  MedicalHistory,
  DiagnosisInfo,
  TreatmentInfo,
  CourseInfo,
  EfficacyInfo,
  UploadedFile 
} from '../types/consultation';

class ConsultService {
  private readonly CONSULT_KEY = 'medical_consultations';
  private readonly REPLIES_KEY = 'consult_replies';

  /**
   * 获取所有咨询
   */
  getAllConsultations(): Consultation[] {
    try {
      const saved = localStorage.getItem(this.CONSULT_KEY);
      console.log('📖 读取咨询列表:', saved);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('❌ 获取咨询列表失败:', error);
      return [];
    }
  }

  /**
   * 获取单个咨询详情（包含回复）
   */
  getConsultation(id: string): Consultation | null {
    try {
      console.log('🔍 getConsultation 被调用, id:', id);
      
      const consultations = this.getAllConsultations();
      console.log('📋 所有咨询:', consultations);
      
      const consultation = consultations.find(c => c.id === id);
      console.log('🎯 找到的咨询:', consultation);
      
      if (consultation) {
        const replies = this.getReplies(id);
        console.log('💬 回复数:', replies.length);
        return {
          ...consultation,
          replies
        };
      }
      
      console.log('❌ 未找到咨询:', id);
      return null;
      
    } catch (error) {
      console.error('❌ 获取咨询详情失败:', error);
      return null;
    }
  }

  /**
   * 创建咨询（支持新表单的完整数据）
   */
  createConsultation(
    data: Partial<Consultation>, 
    authorId: string, 
    author: string,
    completeData?: {
      patientInfo?: PatientBasicInfo;
      symptomDetails?: SymptomDetail[];
      medicalHistory?: MedicalHistory;
      diagnosis?: DiagnosisInfo;
      treatment?: TreatmentInfo;
      course?: CourseInfo;
      efficacy?: EfficacyInfo;
      uploadedFiles?: UploadedFile[];
      additionalInfo?: string;
    }
  ): Consultation {
    const consultations = this.getAllConsultations();
    
    const completeness = this.calculateCompleteness(completeData);
    const referenceLevel = this.getReferenceLevel(completeness);
    
    const newConsultation: Consultation = {
      id: Date.now().toString(),
      symptoms: data.symptoms || '',
      description: data.description || '',
      request: data.request || '',
      urgency: data.urgency || 'normal',
      status: 'pending',
      author,
      authorId,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replyCount: 0,
      
      ...(completeData?.patientInfo && { patientInfo: completeData.patientInfo }),
      ...(completeData?.symptomDetails && { symptomDetails: completeData.symptomDetails }),
      ...(completeData?.medicalHistory && { medicalHistory: completeData.medicalHistory }),
      ...(completeData?.diagnosis && { diagnosis: completeData.diagnosis }),
      ...(completeData?.treatment && { treatment: completeData.treatment }),
      ...(completeData?.course && { course: completeData.course }),
      ...(completeData?.efficacy && { efficacy: completeData.efficacy }),
      ...(completeData?.uploadedFiles && { uploadedFiles: completeData.uploadedFiles }),
      ...(completeData?.additionalInfo && { additionalInfo: completeData.additionalInfo }),
      
      completeness,
      referenceLevel,
      
      // ========== 新增版本控制字段 ==========
      versions: [],
      currentVersion: 1,
      editable: true
    };
    
    consultations.unshift(newConsultation);
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    console.log('✅ 创建新咨询（完整版）:', newConsultation.id);
    
    return newConsultation;
  }

  /**
   * ========== 新增：更新咨询信息 ==========
   */
  updateConsultation(
    id: string, 
    userId: string, 
    updates: Partial<Consultation>,
    changeDescription: string
  ): boolean {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    if (consultations[index].authorId !== userId) return false;
    
    const oldConsult = consultations[index];
    
    // 创建新版本
    const newVersion: ConsultationVersion = {
      id: `ver-${Date.now()}`,
      version: (oldConsult.versions?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      changes: [changeDescription],
      data: { ...oldConsult }
    };
    
    // 更新咨询
    consultations[index] = {
      ...oldConsult,
      ...updates,
      versions: [...(oldConsult.versions || []), newVersion],
      currentVersion: (oldConsult.versions?.length || 0) + 1,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: userId
    };
    
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    console.log('✅ 更新咨询:', id);
    
    return true;
  }

  /**
   * ========== 新增：添加追问 ==========
   */
  addFollowUp(consultationId: string, replyId: string, question: string, userId: string, userName: string): Reply {
    const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
    
    const followUp: Reply = {
      id: `followup-${Date.now()}`,
      consultationId,
      content: `【补充信息】${question}`,
      author: userName,
      authorId: userId,
      identity: 'patient',
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isFollowUp: true,
      inReplyTo: replyId
    };
    
    allReplies.push(followUp);
    localStorage.setItem(this.REPLIES_KEY, JSON.stringify(allReplies));
    
    // 更新咨询状态
    this.updateConsultationAfterReply(consultationId);
    
    console.log('✅ 添加追问:', followUp);
    return followUp;
  }

  /**
   * ========== 新增：获取版本历史 ==========
   */
  getVersionHistory(consultationId: string): ConsultationVersion[] {
    const consultation = this.getConsultation(consultationId);
    return consultation?.versions || [];
  }

  /**
   * ========== 新增：恢复到指定版本 ==========
   */
  restoreVersion(consultationId: string, versionId: string, userId: string): boolean {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === consultationId);
    
    if (index === -1) return false;
    if (consultations[index].authorId !== userId) return false;
    
    const consultation = consultations[index];
    const targetVersion = consultation.versions?.find(v => v.id === versionId);
    
    if (!targetVersion) return false;
    
    // 创建新版本（当前状态）
    const newVersion: ConsultationVersion = {
      id: `ver-${Date.now()}`,
      version: (consultation.versions?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      changes: [`恢复到版本 ${targetVersion.version}`],
      data: { ...consultation }
    };
    
    // 恢复到目标版本的数据
    consultations[index] = {
      ...consultation,
      ...targetVersion.data,
      versions: [...(consultation.versions || []), newVersion],
      currentVersion: (consultation.versions?.length || 0) + 1,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: userId
    };
    
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    console.log('✅ 恢复到版本:', versionId);
    
    return true;
  }

  /**
   * 添加诊疗记录到咨询
   */
  addMedicalRecords(consultationId: string, recordIds: string[]): boolean {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === consultationId);
    
    if (index === -1) return false;
    
    if (!consultations[index].medicalRecords) {
      consultations[index].medicalRecords = [];
    }
    
    const existing = new Set(consultations[index].medicalRecords);
    recordIds.forEach(id => existing.add(id));
    consultations[index].medicalRecords = Array.from(existing);
    consultations[index].hasMedicalRecords = consultations[index].medicalRecords.length > 0;
    
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    console.log('✅ 添加诊疗记录到咨询:', consultationId, recordIds);
    
    return true;
  }

  /**
   * 删除咨询
   */
  deleteConsultation(id: string, userId: string): boolean {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    if (consultations[index].authorId !== userId) return false;
    
    consultations.splice(index, 1);
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    
    this.deleteAllReplies(id);
    
    console.log('✅ 删除咨询:', id);
    return true;
  }

  /**
   * 点赞咨询
   */
  likeConsultation(id: string, userId: string): boolean {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    const consultation = consultations[index];
    const hasLiked = consultation.likedBy?.includes(userId);
    
    if (hasLiked) {
      consultation.likes = (consultation.likes || 0) - 1;
      consultation.likedBy = consultation.likedBy?.filter(uid => uid !== userId) || [];
      console.log('👎 取消点赞咨询:', id);
    } else {
      consultation.likes = (consultation.likes || 0) + 1;
      consultation.likedBy = [...(consultation.likedBy || []), userId];
      console.log('👍 点赞咨询:', id);
    }
    
    consultations[index] = consultation;
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    
    return true;
  }

  /**
   * 获取回复列表
   */
  getReplies(consultationId: string): Reply[] {
    try {
      const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
      const replies = allReplies
        .filter((r: Reply) => r.consultationId === consultationId)
        .sort((a: Reply, b: Reply) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      console.log(`💬 获取回复, consultationId: ${consultationId}, 数量: ${replies.length}`);
      return replies;
    } catch {
      return [];
    }
  }

  /**
   * 添加回复
   */
  addReply(
    consultationId: string,
    content: string,
    authorId: string,
    author: string,
    identity?: string,
    contact?: string
  ): Reply {
    const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
    
    const newReply: Reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      consultationId,
      content,
      author,
      authorId,
      identity,
      contact,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };
    
    allReplies.push(newReply);
    localStorage.setItem(this.REPLIES_KEY, JSON.stringify(allReplies));
    
    this.updateConsultationAfterReply(consultationId);
    
    console.log('✅ 添加回复:', newReply);
    return newReply;
  }

  /**
   * 删除回复
   */
  deleteReply(replyId: string, userId: string): boolean {
    const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
    const index = allReplies.findIndex((r: Reply) => r.id === replyId);
    
    if (index === -1) return false;
    if (allReplies[index].authorId !== userId) return false;
    
    const consultationId = allReplies[index].consultationId;
    allReplies.splice(index, 1);
    localStorage.setItem(this.REPLIES_KEY, JSON.stringify(allReplies));
    
    this.updateConsultationAfterReply(consultationId);
    
    console.log('✅ 删除回复:', replyId);
    return true;
  }

  /**
   * 点赞回复
   */
  likeReply(replyId: string, userId: string): boolean {
    const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
    const index = allReplies.findIndex((r: Reply) => r.id === replyId);
    
    if (index === -1) return false;
    
    const reply = allReplies[index];
    const hasLiked = reply.likedBy?.includes(userId);
    
    if (hasLiked) {
      reply.likes = (reply.likes || 0) - 1;
      reply.likedBy = reply.likedBy?.filter(uid => uid !== userId) || [];
      console.log('👎 取消点赞回复:', replyId);
    } else {
      reply.likes = (reply.likes || 0) + 1;
      reply.likedBy = [...(reply.likedBy || []), userId];
      console.log('👍 点赞回复:', replyId);
    }
    
    allReplies[index] = reply;
    localStorage.setItem(this.REPLIES_KEY, JSON.stringify(allReplies));
    
    return true;
  }

  /**
   * 更新咨询的回复数和状态
   */
  private updateConsultationAfterReply(consultationId: string): void {
    const consultations = this.getAllConsultations();
    const index = consultations.findIndex(c => c.id === consultationId);
    
    if (index === -1) return;
    
    const replies = this.getReplies(consultationId);
    consultations[index].replyCount = replies.length;
    consultations[index].status = replies.length > 0 ? 'answered' : 'pending';
    
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(consultations));
    console.log('🔄 更新咨询状态:', consultations[index]);
  }

  /**
   * 删除咨询的所有回复
   */
  private deleteAllReplies(consultationId: string): void {
    const allReplies = JSON.parse(localStorage.getItem(this.REPLIES_KEY) || '[]');
    const filtered = allReplies.filter((r: Reply) => r.consultationId !== consultationId);
    localStorage.setItem(this.REPLIES_KEY, JSON.stringify(filtered));
    console.log('🗑️ 删除所有回复, consultationId:', consultationId);
  }

  /**
   * 计算信息完整度
   */
  private calculateCompleteness(data?: any): number {
    if (!data) return 0;
    
    let total = 0;
    let filled = 0;

    if (data.patientInfo) {
      if (data.patientInfo.name) filled += 5;
      if (data.patientInfo.age) filled += 5;
      if (data.patientInfo.gender) filled += 5;
      if (data.patientInfo.height && data.patientInfo.weight) filled += 5;
      if (data.patientInfo.location) filled += 5;
      if (data.patientInfo.occupation) filled += 5;
    }
    total += 30;

    if (data.symptomDetails?.length) {
      data.symptomDetails.forEach((s: SymptomDetail) => {
        if (s.name) filled += 5;
        if (s.characteristic?.length) filled += 3;
        if (s.duration) filled += 2;
        if (s.description) filled += 5;
      });
    }
    total += 30;

    if (data.medicalHistory) {
      if (data.medicalHistory.baselineDiseases?.length) filled += 5;
      if (data.medicalHistory.allergies?.drug?.length) filled += 3;
      if (data.medicalHistory.allergies?.food?.length) filled += 2;
      if (data.medicalHistory.familyHistory?.length) filled += 5;
    }
    total += 15;

    if (data.diagnosis?.hospitals?.length) filled += 8;
    if (data.treatment?.records?.length) filled += 7;
    total += 15;

    if (data.request) filled += 10;
    total += 10;

    return Math.min(Math.round((filled / total) * 100), 100);
  }

  /**
   * 获取参考意义级别
   */
  private getReferenceLevel(completeness: number): string {
    if (completeness >= 90) return 'Ⅰ级';
    if (completeness >= 70) return 'Ⅱ级';
    if (completeness >= 50) return 'Ⅲ级';
    if (completeness >= 30) return 'Ⅳ级';
    return 'Ⅴ级';
  }
}

export const consultService = new ConsultService();