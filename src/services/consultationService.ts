import { Consultation, ConsultationGroup, ConsultationFormData, ConsultationReply, ConsultationDetail, ConsultationExample } from '../types/consultation';

// 模拟咨询数据
const mockConsultations: Consultation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '王先生',
    mainSymptoms: '持续头痛3天，伴有恶心呕吐',
    mainRequests: '希望了解可能的病因和应急处理措施',
    description: '3天前开始出现头痛，最初轻微后逐渐加重。今天早晨开始恶心，呕吐两次。',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    status: 'answered',
    urgency: 'medium',
    replyCount: 2
  },
  {
    id: '2',
    userId: 'user2',
    userName: '李女士',
    mainSymptoms: '持续头痛3天，伴有恶心呕吐',
    mainRequests: '希望了解可能的病因和应急处理措施',
    description: '3天前开始出现头痛，最初轻微后逐渐加重。今天早晨开始恶心，呕吐两次。',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    status: 'pending',
    urgency: 'medium',
    replyCount: 0
  },
  {
    id: '3',
    userId: 'user3',
    userName: '赵先生',
    mainSymptoms: '咳嗽发烧两天，体温38.5℃',
    mainRequests: '需要用药建议和就医指导',
    description: '两天前开始咳嗽，今天发烧到38.5℃，喉咙痛，流鼻涕。',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
    status: 'answered',
    urgency: 'high',
    replyCount: 1
  }
];

// 模拟回复数据
const mockReplies: ConsultationReply[] = [
  {
    id: 'reply1',
    consultationId: '1',
    doctorId: 'doc1',
    doctorName: '张医生',
    content: '根据您的描述，持续头痛伴有恶心呕吐可能是偏头痛或紧张性头痛。建议您先测量血压，如果血压正常，可以尝试休息并服用布洛芬缓解症状。如果症状持续或加重，建议尽快就医。',
    createdAt: '2024-01-15T14:30:00Z',
    isProfessional: true
  },
  {
    id: 'reply2',
    consultationId: '1',
    doctorId: 'doc2',
    doctorName: '李医生',
    content: '除了张医生的建议，我还要补充一点：请观察是否有视力模糊、颈部僵硬等症状。如果出现这些症状，需要立即就医排除颅内压增高的情况。',
    createdAt: '2024-01-15T16:45:00Z',
    isProfessional: true
  },
  {
    id: 'reply3',
    consultationId: '3',
    doctorId: 'doc1',
    doctorName: '张医生',
    content: '咳嗽发烧伴有喉咙痛，很可能是上呼吸道感染。建议多休息、多喝水，可以服用一些清热解毒的中成药。如果体温超过38.5℃，可以使用退烧药。密切观察病情变化。',
    createdAt: '2024-01-17T11:20:00Z',
    isProfessional: true
  }
];

// 咨询范例数据
export const consultationExamples: ConsultationExample[] = [
  {
    mainSymptoms: '持续头痛3天，伴有恶心呕吐，体温38.5℃',
    mainRequests: '希望了解可能的病因和应急处理措施，是否需要立即就医',
    description: '3天前开始出现头痛，最初轻微后逐渐加重。今天早晨开始恶心，呕吐两次。无外伤史，有高血压家族史。平时血压正常，最近工作压力较大。'
  },
  {
    mainSymptoms: '咳嗽发烧两天，喉咙痛，流鼻涕',
    mainRequests: '需要用药建议和就医指导，是否感染传染性疾病',
    description: '两天前开始咳嗽，干咳无痰。今天发烧到38.5℃，喉咙痛，流清鼻涕。无接触过确诊患者，家庭成员无类似症状。'
  },
  {
    mainSymptoms: '腹部疼痛伴腹泻一天',
    mainRequests: '判断是否食物中毒，推荐止泻药物和饮食建议',
    description: '昨天晚餐后开始腹部绞痛，今天已腹泻5次，水样便。伴有轻微恶心但无呕吐。昨晚在外就餐，食用过海鲜。'
  }
];

// 生成内容哈希用于分组
const generateContentHash = (consultation: Consultation): string => {
  const content = `${consultation.mainSymptoms}-${consultation.mainRequests}-${consultation.description}`;
  return btoa(encodeURIComponent(content));
};

export const consultationService = {
  // 获取所有咨询
  getConsultations: async (): Promise<Consultation[]> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...mockConsultations]);
        }, 500);
      });
    } catch (error) {
      console.error('获取咨询列表失败:', error);
      return [];
    }
  },

  // 获取分组后的咨询列表
  getGroupedConsultations: async (): Promise<ConsultationGroup[]> => {
    try {
      const consultations = await consultationService.getConsultations();
      
      const groups = consultations.reduce((acc, consultation) => {
        const contentHash = generateContentHash(consultation);
        
        if (!acc[contentHash]) {
          acc[contentHash] = {
            contentHash,
            count: 0,
            consultations: [],
            latestConsultation: consultation
          };
        }
        
        acc[contentHash].count++;
        acc[contentHash].consultations.push(consultation);
        
        // 更新最新咨询
        if (new Date(consultation.createdAt) > new Date(acc[contentHash].latestConsultation.createdAt)) {
          acc[contentHash].latestConsultation = consultation;
        }
        
        return acc;
      }, {} as Record<string, ConsultationGroup>);
      
      return Object.values(groups).sort((a, b) => 
        new Date(b.latestConsultation.createdAt).getTime() - 
        new Date(a.latestConsultation.createdAt).getTime()
      );
    } catch (error) {
      console.error('获取分组咨询失败:', error);
      return [];
    }
  },

  // 创建新咨询
  createConsultation: async (formData: ConsultationFormData): Promise<Consultation | null> => {
    try {
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        userId: 'current-user',
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        replyCount: 0
      };

      return new Promise((resolve) => {
        setTimeout(() => {
          mockConsultations.unshift(newConsultation);
          resolve(newConsultation);
        }, 500);
      });
    } catch (error) {
      console.error('创建咨询失败:', error);
      return null;
    }
  },

  // 获取咨询范例
  getExamples: async (): Promise<ConsultationExample[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(consultationExamples);
      }, 300);
    });
  },

  // 获取咨询详情（包含回复）
  getConsultationDetail: async (consultationId: string): Promise<ConsultationDetail | null> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const consultation = mockConsultations.find(c => c.id === consultationId);
          if (!consultation) {
            resolve(null);
            return;
          }

          const replies = mockReplies.filter(reply => reply.consultationId === consultationId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          resolve({
            consultation,
            replies
          });
        }, 500);
      });
    } catch (error) {
      console.error('获取咨询详情失败:', error);
      return null;
    }
  },

  // 添加回复
  addReply: async (consultationId: string, content: string, doctorInfo: { id: string; name: string }): Promise<ConsultationReply | null> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newReply: ConsultationReply = {
            id: `reply${Date.now()}`,
            consultationId,
            doctorId: doctorInfo.id,
            doctorName: doctorInfo.name,
            content,
            createdAt: new Date().toISOString(),
            isProfessional: true
          };

          mockReplies.push(newReply);
          
          // 更新咨询状态和回复数量
          const consultation = mockConsultations.find(c => c.id === consultationId);
          if (consultation) {
            consultation.status = 'answered';
            consultation.replyCount = (consultation.replyCount || 0) + 1;
            consultation.updatedAt = new Date().toISOString();
          }

          resolve(newReply);
        }, 500);
      });
    } catch (error) {
      console.error('添加回复失败:', error);
      return null;
    }
  },

  // 获取单个咨询
  getConsultation: async (consultationId: string): Promise<Consultation | null> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const consultation = mockConsultations.find(c => c.id === consultationId);
          resolve(consultation || null);
        }, 300);
      });
    } catch (error) {
      console.error('获取咨询失败:', error);
      return null;
    }
  }
};