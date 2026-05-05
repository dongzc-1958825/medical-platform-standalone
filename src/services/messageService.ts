// src/services/messageService.ts
import { MessageItem, MessageCategory, MessageComment } from '../types/message';

class MessageService {
  private readonly MESSAGES_KEY = 'medical-platform-messages';
 
  // 获取所有分类
  getCategories(): MessageCategory[] {
    return [
      {
        id: 'new_medicine',
        name: '新药信息',
        icon: '💊',
        description: '最新药品信息和临床应用',
        count: 12
      },
      {
        id: 'professional_article',
        name: '专业文章',
        icon: '📚',
        description: '医学专业文献和研究成果',
        count: 8
      },
      {
        id: 'announcement',
        name: '公告发布',
        icon: '📢',
        description: '平台公告和重要通知',
        count: 5
      },
      {
        id: 'special_effect',
        name: '特效分享',
        icon: '✨',
        description: '特效治疗方案和经验分享',
        count: 15
      },
      {
        id: 'lesson_learned',
        name: '前车之鉴',
        icon: '⚠️',
        description: '医疗教训和风险警示',
        count: 7
      }
    ];
  }

  // 获取某个分类下的消息列表
  getMessagesByCategory(categoryId: string): MessageItem[] {
    const allMessages = this.getAllMessages();
    return allMessages.filter(msg => msg.type === categoryId);
  }

  // 获取所有消息
  getAllMessages(): MessageItem[] {
    try {
      const stored = localStorage.getItem(this.MESSAGES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // 首次使用，初始化模拟数据
      const initialData = this.getInitialMessages();
      this.saveAllMessages(initialData);
      return initialData;
    } catch (error) {
      console.error('获取消息失败:', error);
      return this.getInitialMessages();
    }
  }

  // 添加新消息
  addMessage(message: Omit<MessageItem, 'id' | 'viewCount' | 'likeCount' | 'commentCount' | 'comments'>): MessageItem {
    const messages = this.getAllMessages();
    const newMessage: MessageItem = {
      ...message,
      id: `msg_${Date.now()}`,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      comments: []
    };
    
    messages.unshift(newMessage);
    this.saveAllMessages(messages);
    return newMessage;
  }

  // 添加评论
  addComment(messageId: string, comment: Omit<MessageComment, 'id'>): MessageComment {
    const messages = this.getAllMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      throw new Error('消息不存在');
    }

    const newComment: MessageComment = {
      ...comment,
      id: `comment_${Date.now()}`
    };

    messages[messageIndex].comments.push(newComment);
    messages[messageIndex].commentCount += 1;
    this.saveAllMessages(messages);
    
    return newComment;
  }

  // 点赞消息
  likeMessage(messageId: string): void {
    const messages = this.getAllMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      messages[messageIndex].likeCount += 1;
      this.saveAllMessages(messages);
    }
  }

  // 增加浏览数
  incrementViewCount(messageId: string): void {
    const messages = this.getAllMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      messages[messageIndex].viewCount += 1;
      this.saveAllMessages(messages);
    }
  }

  private saveAllMessages(messages: MessageItem[]): void {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  private getInitialMessages(): MessageItem[] {
    return [
      // 新药信息
      {
        id: '1',
        type: 'new_medicine',
        title: '新型降糖药物XX正式上市',
        content: '经过三期临床试验，新型降糖药物XX已获得国家药监局批准上市。该药物在控制血糖的同时，对心血管具有保护作用...',
        author: '药监局',
        publishTime: '2025-01-15 09:00',
        viewCount: 234,
        likeCount: 45,
        commentCount: 12,
        tags: ['新药', '糖尿病', '心血管'],
        comments: [
          {
            id: 'c1',
            author: '李医生',
            content: '期待在临床中的应用效果！',
            time: '2025-01-15 10:30',
            likes: 5
          }
        ],
        isPinned: true
      },
      // 专业文章
      {
        id: '2',
        type: 'professional_article',
        title: '中医治疗慢性胃炎的临床研究',
        content: '本研究通过对300例慢性胃炎患者的中医治疗观察，发现中药组方在改善症状和胃镜表现方面显著优于对照组...',
        author: '王教授',
        publishTime: '2025-01-14 14:20',
        viewCount: 156,
        likeCount: 32,
        commentCount: 8,
        tags: ['中医', '胃炎', '临床研究'],
        comments: []
      },
      // 公告发布
      {
        id: '3',
        type: 'announcement',
        title: '平台系统维护通知',
        content: '为了提供更好的服务，平台将于本周六凌晨2:00-4:00进行系统维护，期间可能无法正常访问，敬请谅解。',
        author: '系统管理员',
        publishTime: '2025-01-13 16:45',
        viewCount: 189,
        likeCount: 12,
        commentCount: 3,
        comments: [],
        isPinned: true
      },
      // 特效分享
      {
        id: '4',
        type: 'special_effect',
        title: '针灸治疗偏头痛的特效穴位',
        content: '通过多年临床实践，发现太阳穴配合风池穴的针灸治疗对偏头痛有显著效果，有效率可达85%以上...',
        author: '张针灸师',
        publishTime: '2025-01-12 11:30',
        viewCount: 278,
        likeCount: 67,
        commentCount: 15,
        tags: ['针灸', '偏头痛', '特效'],
        comments: []
      },
      // 前车之鉴
      {
        id: '5',
        type: 'lesson_learned',
        title: '中药配伍禁忌案例分享',
        content: '近期接诊一例因不当中药配伍导致的肝功能异常患者，特此提醒各位同行注意相关药物的配伍禁忌...',
        author: '赵医生',
        publishTime: '2025-01-11 08:15',
        viewCount: 312,
        likeCount: 89,
        commentCount: 24,
        tags: ['中药', '配伍禁忌', '案例'],
        comments: []
      }
    ];
  }
}

export const messageService = new MessageService();
