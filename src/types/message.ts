// src/types/message.ts
// 独立的消息类型定义 - 不依赖共享类型
// 版本: 1.3.0 (添加编辑功能支持)

export interface MessageComment {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
  replies?: MessageComment[];
  // 新增：编辑相关字段
  isEdited?: boolean;
  updatedAt?: string;
}

export interface MessageItem {
  id: string;
  type: 'new_medicine' | 'professional_article' | 'announcement' | 'special_effect' | 'lesson_learned';
  title: string;
  content: string;
  author: string;
  publishTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: string[];
  comments: MessageComment[];
  isPinned?: boolean;
  
  // 新增：编辑功能支持字段
  updatedAt?: string;           // 最后更新时间
  isEdited?: boolean;           // 是否被编辑过
  canEdit?: boolean;            // 当前用户是否有编辑权限
  originalTitle?: string;       // 原始标题（用于微信导入）
  source?: 'user' | 'wechat' | 'system';   // 消息来源
  editHistory?: string[];       // 编辑历史记录（未来扩展）
}

export interface MessageCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  // 新增：分类顺序和类型关联
  order?: number;               // 显示顺序
  messageType?: string;         // 关联的消息类型
}

// 新增：消息更新数据类型（用于编辑功能）
export interface MessageUpdateData {
  id: string;
  title?: string;
  content?: string;
  type?: MessageItem['type'];
  tags?: string[];
  updatedAt?: string;
  isEdited?: boolean;
}

// 新增：编辑表单数据类型
export interface MessageEditFormData {
  title: string;
  content: string;
  type: MessageItem['type'];
  tags: string[];
}

// 新增：消息发布表单数据类型
export interface MessagePublishFormData {
  title: string;
  content: string;
  type: MessageItem['type'];
  tags?: string[];
  source?: 'user' | 'wechat';
  originalTitle?: string;
}

// 新增：消息类型显示配置
export const MESSAGE_TYPE_CONFIG = {
  new_medicine: { 
    name: '新药信息', 
    color: '#1890ff', 
    icon: '💊',
    description: '最新药品信息和研发进展'
  },
  professional_article: { 
    name: '专业文章', 
    color: '#52c41a', 
    icon: '📚',
    description: '医学专业文章和研究报告'
  },
  announcement: { 
    name: '公告发布', 
    color: '#722ed1', 
    icon: '📢',
    description: '平台公告和重要通知'
  },
  special_effect: { 
    name: '特效分享', 
    color: '#fa8c16', 
    icon: '✨',
    description: '特效治疗方法和经验分享'
  },
  lesson_learned: { 
    name: '前车之鉴', 
    color: '#ff4d4f', 
    icon: '⚠️',
    description: '医疗经验和教训总结'
  },
  wechat_content: { 
    name: '微信内容', 
    color: '#13c2c2', 
    icon: '💬',
    description: '从微信导入的内容'
  }
} as const;

// 新增：消息分类配置（与MobileMessagesPage保持一致）
export const MESSAGE_CATEGORIES: MessageCategory[] = [
  {
    id: 'all',
    name: '全部消息',
    icon: '📨',
    description: '查看所有类型的消息',
    count: 0,
    order: 0
  },
  {
    id: 'new_medicine',
    name: '新药信息',
    icon: '💊',
    description: '最新药品信息和研发进展',
    count: 0,
    order: 1,
    messageType: 'new_medicine'
  },
  {
    id: 'professional_article',
    name: '专业文章',
    icon: '📚',
    description: '医学专业文章和研究报告',
    count: 0,
    order: 2,
    messageType: 'professional_article'
  },
  {
    id: 'announcement',
    name: '公告发布',
    icon: '📢',
    description: '平台公告和重要通知',
    count: 0,
    order: 3,
    messageType: 'announcement'
  },
  {
    id: 'special_effect',
    name: '特效分享',
    icon: '✨',
    description: '特效治疗方法和经验分享',
    count: 0,
    order: 4,
    messageType: 'special_effect'
  },
  {
    id: 'lesson_learned',
    name: '前车之鉴',
    icon: '⚠️',
    description: '医疗经验和教训总结',
    count: 0,
    order: 5,
    messageType: 'lesson_learned'
  }
];

// 新增：检查是否是有效的消息类型
export const isValidMessageType = (type: string): type is MessageItem['type'] => {
  const validTypes: MessageItem['type'][] = [
    'new_medicine',
    'professional_article',
    'announcement',
    'special_effect',
    'lesson_learned'
  ];
  return validTypes.includes(type as MessageItem['type']);
};

// 新增：获取消息类型显示信息
export const getMessageTypeInfo = (type: string) => {
  return MESSAGE_TYPE_CONFIG[type as keyof typeof MESSAGE_TYPE_CONFIG] || {
    name: '未知类型',
    color: '#999',
    icon: '❓',
    description: '未知消息类型'
  };
};

// 新增：用户权限检查结果类型
export interface MessagePermission {
  canEdit: boolean;
  canDelete: boolean;
  canLike: boolean;
  canComment: boolean;
  canPin?: boolean;      // 是否可置顶（管理员权限）
  reason?: string;       // 权限原因说明
}

// 新增：消息操作结果类型
export interface MessageOperationResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}