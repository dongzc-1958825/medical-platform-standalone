// src/shared/types/message/announcement.ts
import { MessageBase, MessageCategory } from './base';

/**
 * 公告类型 - 适合医患共享平台的公告分类
 */
export enum AnnouncementType {
  PLATFORM_UPDATE = 'platform_update',       // 平台更新：功能优化、系统维护
  COMMUNITY_NOTICE = 'community_notice',     // 社区通知：活动、讨论、征集
  HEALTH_ALERT = 'health_alert',             // 健康提醒：疾病预警、健康提示
  POLICY_CHANGE = 'policy_change',           // 政策变动：医疗政策变化
  RESOURCE_SHARING = 'resource_sharing',     // 资源共享：资料、工具分享
  EXPERT_INVITATION = 'expert_invitation',   // 专家邀请：医生入驻、专家答疑
  USER_GUIDE = 'user_guide',                 // 使用指南：平台功能使用说明
  FEEDBACK_COLLECTION = 'feedback_collection', // 意见征集：用户反馈收集
  SUCCESS_STORY = 'success_story',           // 成功案例：平台上的成功故事
  SAFETY_REMINDER = 'safety_reminder'        // 安全提醒：用药安全、就医提醒
}

/**
 * 公告重要性级别
 */
export enum AnnouncementPriority {
  ROUTINE = 'routine',      // 常规：普通通知
  IMPORTANT = 'important',  // 重要：需要关注
  URGENT = 'urgent',        // 紧急：需要立即关注
  EMERGENCY = 'emergency'   // 紧急：安全相关，必须关注
}

/**
 * 公告发布范围
 */
export enum AnnouncementScope {
  ALL_USERS = 'all_users',          // 所有用户
  PATIENTS_ONLY = 'patients_only',  // 仅患者
  DOCTORS_ONLY = 'doctors_only',    // 仅医生
  SPECIFIC_GROUP = 'specific_group', // 特定用户组
  NEW_USERS = 'new_users',          // 新用户
  VERIFIED_USERS = 'verified_users' // 认证用户
}

/**
 * 公告发布类型 - 适合医患共享平台
 */
export interface AnnouncementMessage extends MessageBase {
  // 固定分类为公告发布
  category: MessageCategory.ANNOUNCEMENT;
  
  // === 公告特定信息 ===
  announcementInfo: {
    // 公告类型
    announcementType: AnnouncementType;
    
    // 重要性级别
    priority: AnnouncementPriority;
    
    // 发布范围
    scope: AnnouncementScope | AnnouncementScope[];
    
    // 特定用户组（如果scope是specific_group）
    specificGroups?: string[];
    
    // 有效时间
    effectiveDate: string;          // 生效时间
    expirationDate?: string;        // 失效时间（可选）
    
    // 是否需要确认
    requiresAcknowledgment: boolean;
    acknowledgmentDeadline?: string; // 确认截止时间
    
    // 关联内容
    relatedContent?: {
      type: 'article' | 'case' | 'consultation' | 'external_link';
      id?: string;                  // 关联内容ID
      title?: string;               // 关联内容标题
      url?: string;                 // 外部链接
    }[];
    
    // 行动指南（针对不同类型的公告）
    actionGuide?: {
      // 平台更新类公告
      updateSteps?: string[];       // 更新步骤
      newFeatures?: string[];       // 新功能
      knownIssues?: string[];       // 已知问题
      
      // 健康提醒类公告
      preventionMeasures?: string[]; // 预防措施
      warningSigns?: string[];      // 危险信号
      whenToSeeDoctor?: string[];   // 何时就医
      
      // 政策变动类公告
      policySummary?: string;       // 政策摘要
      impactAnalysis?: string;      // 影响分析
      actionItems?: string[];       // 行动项
      
      // 资源分享类公告
      resourceDescription?: string; // 资源描述
      usageInstructions?: string;   // 使用说明
      accessMethod?: string;        // 获取方式
    };
    
    // 互动选项
    interactionOptions?: {
      // 确认方式
      acknowledgmentMethods?: Array<'click' | 'comment' | 'share' | 'vote'>;
      
      // 投票选项（如果有投票）
      voteOptions?: Array<{
        id: string;
        text: string;
        description?: string;
      }>;
      
      // 反馈收集
      feedbackTopics?: string[];    // 反馈主题
      feedbackDeadline?: string;    // 反馈截止时间
      
      // 讨论引导
      discussionQuestions?: string[]; // 讨论问题
    };
    
    // 参与信息
    participationInfo?: {
      // 专家邀请类公告
      expertDetails?: {
        name: string;
        specialty: string;
        availableTimes?: string[];
        consultationMethod?: 'online' | 'offline' | 'both';
      };
      
      // 活动类公告
      eventDetails?: {
        date: string;
        time?: string;
        location?: string;
        format?: 'online' | 'offline' | 'hybrid';
        registrationRequired: boolean;
        registrationLink?: string;
        maxParticipants?: number;
      };
      
      // 征集类公告
      collectionDetails?: {
        topic: string;
        submissionDeadline: string;
        submissionMethod: string;
        rewardInfo?: string;        // 奖励信息
        selectionCriteria?: string; // 评选标准
      };
    };
    
    // 确认统计
    acknowledgmentStats?: {
      totalUsers: number;           // 总用户数
      acknowledgedUsers: number;    // 已确认用户数
      acknowledgedPercentage: number; // 确认百分比
      lastUpdated: string;          // 统计更新时间
    };
    
    // 微信分享优化字段
    wechatShare?: {
      // 公告摘要（适合快速阅读）
      briefSummary?: string;
      
      // 关键时间点
      keyTimeline?: Array<{
        time: string;
        event: string;
      }>;
      
      // 行动提醒
      actionReminders?: string[];
      
      // 二维码（用于活动报名等）
      qrCode?: {
        text: string;              // 二维码内容
        description?: string;      // 描述
      };
      
      // 联系人信息（如果需要）
      contactInfo?: {
        person: string;
        role: string;
        contactMethod: string;
      };
    };
    
    // 后续跟进
    followUp?: {
      planned: boolean;            // 是否有后续跟进
      followUpDate?: string;       // 跟进时间
      followUpContent?: string;    // 跟进内容
      autoReminder?: boolean;      // 自动提醒
    };
  };
}

/**
 * 公告查询选项
 */
export interface AnnouncementQueryOptions {
  // 公告类型筛选
  announcementType?: AnnouncementType | AnnouncementType[];
  
  // 重要性级别筛选
  priority?: AnnouncementPriority;
  
  // 发布范围筛选
  scope?: AnnouncementScope;
  
  // 时间筛选
  isActive?: boolean;              // 是否在有效期内
  upcoming?: boolean;              // 即将生效的公告
  expired?: boolean;               // 已过期的公告
  
  // 互动状态筛选
  requiresAcknowledgment?: boolean;
  acknowledged?: boolean;          // 是否已确认（需要用户上下文）
  
  // 用户参与相关
  hasEvent?: boolean;              // 有活动信息的公告
  hasVote?: boolean;               // 有投票选项的公告
  hasFeedback?: boolean;           // 有反馈收集的公告
}

/**
 * 公告统计信息
 */
export interface AnnouncementStats {
  // 总量统计
  totalAnnouncements: number;
  activeAnnouncements: number;     // 有效期内公告
  expiredAnnouncements: number;    // 已过期公告
  
  // 分类统计
  byType: Record<AnnouncementType, number>;
  byPriority: Record<AnnouncementPriority, number>;
  byScope: Record<AnnouncementScope, number>;
  
  // 时效性统计
  todayExpiring: number;           // 今天到期的公告
  weekExpiring: number;            // 本周到期的公告
  
  // 互动统计
  averageAcknowledgmentRate: number; // 平均确认率
  mostAcknowledged: Array<{
    announcementId: string;
    title: string;
    acknowledgmentRate: number;
  }>;
  
  // 用户参与统计
  eventsHeld: number;              // 已举办活动数
  votesCompleted: number;          // 已完成投票数
  feedbackCollected: number;       // 已收集反馈数
}

/**
 * 公告工具函数
 */
export const AnnouncementUtils = {
  /**
   * 获取公告类型中文名称
   */
  getAnnouncementTypeName(type: AnnouncementType): string {
    const names: Record<AnnouncementType, string> = {
      [AnnouncementType.PLATFORM_UPDATE]: '平台更新',
      [AnnouncementType.COMMUNITY_NOTICE]: '社区通知',
      [AnnouncementType.HEALTH_ALERT]: '健康提醒',
      [AnnouncementType.POLICY_CHANGE]: '政策变动',
      [AnnouncementType.RESOURCE_SHARING]: '资源共享',
      [AnnouncementType.EXPERT_INVITATION]: '专家邀请',
      [AnnouncementType.USER_GUIDE]: '使用指南',
      [AnnouncementType.FEEDBACK_COLLECTION]: '意见征集',
      [AnnouncementType.SUCCESS_STORY]: '成功案例',
      [AnnouncementType.SAFETY_REMINDER]: '安全提醒'
    };
    return names[type] || type;
  },
  
  /**
   * 获取重要性级别描述
   */
  getPriorityDescription(priority: AnnouncementPriority): string {
    const descriptions: Record<AnnouncementPriority, string> = {
      [AnnouncementPriority.ROUTINE]: '常规通知，建议了解',
      [AnnouncementPriority.IMPORTANT]: '重要通知，建议关注',
      [AnnouncementPriority.URGENT]: '紧急通知，请及时处理',
      [AnnouncementPriority.EMERGENCY]: '紧急通知，必须立即处理'
    };
    return descriptions[priority];
  },
  
  /**
   * 获取发布范围描述
   */
  getScopeDescription(scope: AnnouncementScope): string {
    const descriptions: Record<AnnouncementScope, string> = {
      [AnnouncementScope.ALL_USERS]: '所有用户',
      [AnnouncementScope.PATIENTS_ONLY]: '仅患者用户',
      [AnnouncementScope.DOCTORS_ONLY]: '仅医生用户',
      [AnnouncementScope.SPECIFIC_GROUP]: '特定用户组',
      [AnnouncementScope.NEW_USERS]: '新注册用户',
      [AnnouncementScope.VERIFIED_USERS]: '认证用户'
    };
    return descriptions[scope];
  },
  
  /**
   * 检查公告是否在有效期内
   */
  isAnnouncementActive(announcement: AnnouncementMessage): {
    active: boolean;
    reason?: string;
    timeLeft?: string;
  } {
    const now = new Date();
    const effectiveDate = new Date(announcement.announcementInfo.effectiveDate);
    const expirationDate = announcement.announcementInfo.expirationDate 
      ? new Date(announcement.announcementInfo.expirationDate)
      : null;
    
    // 尚未生效
    if (now < effectiveDate) {
      const daysLeft = Math.ceil((effectiveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        active: false,
        reason: `将于${daysLeft}天后生效`,
        timeLeft: `${daysLeft}天`
      };
    }
    
    // 已过期
    if (expirationDate && now > expirationDate) {
      return {
        active: false,
        reason: '已超过有效期限'
      };
    }
    
    // 即将过期（7天内）
    if (expirationDate) {
      const daysToExpire = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToExpire <= 7) {
        return {
          active: true,
          reason: `将于${daysToExpire}天后过期`,
          timeLeft: `${daysToExpire}天`
        };
      }
    }
    
    return {
      active: true,
      reason: '在有效期内'
    };
  },
  
  /**
   * 生成微信通知内容
   */
  generateWechatNotification(announcement: AnnouncementMessage): {
    title: string;
    content: string;
    emphasis?: string;
  } {
    const { announcementInfo } = announcement;
    const { priority, announcementType } = announcementInfo;
    
    // 标题根据重要性添加前缀
    let titlePrefix = '';
    switch (priority) {
      case AnnouncementPriority.URGENT:
        titlePrefix = '【紧急】';
        break;
      case AnnouncementPriority.EMERGENCY:
        titlePrefix = '【紧急】';
        break;
      case AnnouncementPriority.IMPORTANT:
        titlePrefix = '【重要】';
        break;
    }
    
    const title = `${titlePrefix}${announcement.title}`;
    
    // 内容根据公告类型优化
    let content = `${title}\n\n`;
    
    // 添加公告类型和重要性
    content += `📢 公告类型：${this.getAnnouncementTypeName(announcementType)}\n`;
    content += `⭐ 重要性：${this.getPriorityDescription(priority)}\n\n`;
    
    // 有效时间
    const status = this.isAnnouncementActive(announcement);
    content += `⏰ 状态：${status.reason}\n`;
    if (announcementInfo.expirationDate) {
      const expDate = new Date(announcementInfo.expirationDate).toLocaleDateString('zh-CN');
      content += `📅 有效期至：${expDate}\n`;
    }
    
    // 正文摘要
    const summary = announcement.summary || announcement.content.substring(0, 200);
    content += `\n📝 摘要：${summary}\n\n`;
    
    // 行动指南（如果有）
    if (announcementInfo.actionGuide) {
      const { updateSteps, preventionMeasures, actionItems } = announcementInfo.actionGuide;
      
      if (updateSteps && updateSteps.length > 0) {
        content += `🔄 更新内容：\n`;
        updateSteps.slice(0, 2).forEach(step => {
          content += `  • ${step}\n`;
        });
      }
      
      if (preventionMeasures && preventionMeasures.length > 0) {
        content += `🛡️ 预防措施：\n`;
        preventionMeasures.slice(0, 2).forEach(measure => {
          content += `  • ${measure}\n`;
        });
      }
      
      if (actionItems && actionItems.length > 0) {
        content += `🎯 行动建议：${actionItems[0]}\n`;
      }
    }
    
    // 是否需要确认
    if (announcementInfo.requiresAcknowledgment) {
      content += `\n✅ 请点击确认已阅读\n`;
    }
    
    // 参与信息（如果是活动类）
    if (announcementInfo.participationInfo?.eventDetails) {
      const event = announcementInfo.participationInfo.eventDetails;
      content += `\n📅 活动时间：${new Date(event.date).toLocaleDateString('zh-CN')}`;
      if (event.time) content += ` ${event.time}`;
      content += `\n`;
      if (event.registrationRequired) {
        content += `🎟️ 需要报名：是\n`;
      }
    }
    
    // 强调内容（根据重要性）
    let emphasis: string | undefined;
    if (priority === AnnouncementPriority.URGENT || priority === AnnouncementPriority.EMERGENCY) {
      emphasis = '请立即处理';
    } else if (announcementInfo.requiresAcknowledgment) {
      emphasis = '请及时确认';
    }
    
    return {
      title,
      content,
      emphasis
    };
  },
  
  /**
   * 生成公告摘要卡片
   */
  generateSummaryCard(announcement: AnnouncementMessage): {
    type: AnnouncementType;
    title: string;
    priority: AnnouncementPriority;
    status: string;
    timeInfo: string;
    actionRequired: boolean;
  } {
    const { announcementInfo } = announcement;
    const status = this.isAnnouncementActive(announcement);
    
    // 时间信息
    let timeInfo = '';
    if (announcementInfo.expirationDate) {
      const expDate = new Date(announcementInfo.expirationDate);
      timeInfo = `有效期至 ${expDate.toLocaleDateString('zh-CN')}`;
    } else {
      const createDate = new Date(announcement.createdAt);
      timeInfo = `发布于 ${createDate.toLocaleDateString('zh-CN')}`;
    }
    
    return {
      type: announcementInfo.announcementType,
      title: announcement.title,
      priority: announcementInfo.priority,
      status: status.active ? '进行中' : '已结束',
      timeInfo,
      actionRequired: announcementInfo.requiresAcknowledgment
    };
  },
  
  /**
   * 验证公告信息
   */
  validateAnnouncement(announcementInfo: AnnouncementMessage['announcementInfo']): {
    valid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // 必填字段检查
    if (!announcementInfo.announcementType) {
      errors.push('必须选择公告类型');
    }
    
    if (!announcementInfo.priority) {
      errors.push('必须设置重要性级别');
    }
    
    if (!announcementInfo.scope) {
      errors.push('必须设置发布范围');
    }
    
    if (!announcementInfo.effectiveDate) {
      errors.push('必须设置生效时间');
    }
    
    // 时间逻辑检查
    if (announcementInfo.effectiveDate && announcementInfo.expirationDate) {
      const effective = new Date(announcementInfo.effectiveDate);
      const expiration = new Date(announcementInfo.expirationDate);
      
      if (expiration <= effective) {
        errors.push('失效时间必须晚于生效时间');
      }
    }
    
    // 特定用户组检查
    if (announcementInfo.scope === AnnouncementScope.SPECIFIC_GROUP && 
        (!announcementInfo.specificGroups || announcementInfo.specificGroups.length === 0)) {
      errors.push('选择特定用户组时，必须指定具体用户组');
    }
    
    // 确认截止时间检查
    if (announcementInfo.requiresAcknowledgment && announcementInfo.acknowledgmentDeadline) {
      const deadline = new Date(announcementInfo.acknowledgmentDeadline);
      const effective = new Date(announcementInfo.effectiveDate);
      
      if (deadline < effective) {
        warnings.push('确认截止时间早于生效时间，可能无法确认');
      }
    }
    
    // 活动类公告检查
    if (announcementInfo.participationInfo?.eventDetails) {
      const event = announcementInfo.participationInfo.eventDetails;
      
      if (event.registrationRequired && !event.registrationLink) {
        warnings.push('需要报名的活动建议提供报名链接');
      }
      
      if (event.date) {
        const eventDate = new Date(event.date);
        const effective = new Date(announcementInfo.effectiveDate);
        
        if (eventDate < effective) {
          warnings.push('活动时间早于公告生效时间');
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      warnings,
      errors
    };
  },
  
  /**
   * 根据用户角色过滤公告
   */
  filterByUserRole(announcements: AnnouncementMessage[], userRole: string): AnnouncementMessage[] {
    return announcements.filter(announcement => {
      const { scope, specificGroups } = announcement.announcementInfo;
      
      // 所有用户可见
      if (scope === AnnouncementScope.ALL_USERS) return true;
      
      // 仅患者可见
      if (scope === AnnouncementScope.PATIENTS_ONLY && userRole === 'patient') return true;
      
      // 仅医生可见
      if (scope === AnnouncementScope.DOCTORS_ONLY && userRole === 'doctor') return true;
      
      // 新用户可见（需要额外判断）
      if (scope === AnnouncementScope.NEW_USERS) {
        // 这里需要用户注册时间信息，暂时返回true
        return true;
      }
      
      // 认证用户可见
      if (scope === AnnouncementScope.VERIFIED_USERS) {
        // 需要用户认证状态，暂时返回true
        return true;
      }
      
      // 特定用户组
      if (scope === AnnouncementScope.SPECIFIC_GROUP && specificGroups) {
        // 需要用户所属组信息，暂时返回true
        return true;
      }
      
      return false;
    });
  }
};

/**
 * 类型守卫 - 检查是否为AnnouncementMessage
 */
export function isAnnouncementMessage(message: MessageBase): message is AnnouncementMessage {
  return message.category === MessageCategory.ANNOUNCEMENT;
}