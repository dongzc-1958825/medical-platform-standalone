// src/shared/types/message/article.ts - 重新设计
import { MessageBase, MessageCategory } from './base';

/**
 * 文章类型 - 适合医患共享平台的文章分类
 */
export enum ArticleType {
  HEALTH_SCIENCE = 'health_science',      // 健康科普：医学知识普及
  DISEASE_GUIDE = 'disease_guide',       // 疾病指南：疾病防治知识
  MEDICATION_GUIDE = 'medication_guide', // 用药指导：药品使用说明
  LIFESTYLE = 'lifestyle',               // 生活方式：健康生活建议
  PATIENT_STORY = 'patient_story',       // 患者故事：真实经历分享
  DOCTOR_ADVICE = 'doctor_advice',       // 医生建议：专业医疗建议
  NEWS_REPORT = 'news_report',           // 新闻报道：医疗健康新闻
  POLICY_INTERPRETATION = 'policy_interpretation', // 政策解读：医疗政策分析
  TECH_SHARING = 'tech_sharing',         // 技术分享：实用医疗技巧
  Q_A_SUMMARY = 'q_a_summary'            // 问答精选：常见问题整理
}

/**
 * 文章难度级别 - 适合不同读者群体
 */
export enum ArticleDifficulty {
  BEGINNER = 'beginner',      // 入门级：普通患者易懂
  INTERMEDIATE = 'intermediate', // 中级：有一定医学基础
  ADVANCED = 'advanced'       // 高级：专业医务人员
}

/**
 * 文章来源类型
 */
export enum ArticleSourceType {
  ORIGINAL = 'original',              // 原创内容
  REPRINT = 'reprint',                // 转载文章
  TRANSLATION = 'translation',        // 翻译文章
  ADAPTATION = 'adaptation',          // 改编文章
  SUMMARY = 'summary'                 // 摘要整理
}

/**
 * 重新设计：专业文章消息类型 - 适合医患共享平台
 */
export interface ArticleMessage extends MessageBase {
  // 固定分类为专业文章
  category: MessageCategory.PROFESSIONAL_ARTICLE;
  
  // === 文章基本信息 ===
  articleInfo: {
    // 文章类型（适合平台定位）
    articleType: ArticleType;
    
    // 文章难度级别
    difficulty: ArticleDifficulty;
    
    // 来源类型
    sourceType: ArticleSourceType;
    
    // 原作者信息（如果是转载/翻译）
    originalInfo?: {
      title?: string;           // 原标题
      author?: string;          // 原作者
      source?: string;          // 来源（如：人民日报、健康报）
      url?: string;             // 原文链接
      publishedDate?: string;   // 原文发布时间
    };
    
    // 目标读者群体
    targetReaders: (
      | 'general_public'      // 普通公众
      | 'patients'           // 患者
      | 'family_members'     // 家属
      | 'doctors'            // 医生
      | 'nurses'             // 护士
      | 'pharmacists'        // 药师
      | 'medical_students'   // 医学生
  )[];
    
    // 适用疾病/症状（如果有）
    applicableConditions?: string[];
    
    // 文章结构（简化版）
    sections?: Array<{
      title: string;
      content: string;
      keyPoints?: string[];    // 本节要点
    }>;
    
    // 核心知识点（提炼关键信息）
    keyKnowledgePoints?: Array<{
      point: string;
      explanation?: string;
      importance: 'high' | 'medium' | 'low';
    }>;
    
    // 实用建议/行动指南
    practicalAdvice?: string[];
    
    // 常见误区/注意事项
    commonMistakes?: string[];
    precautions?: string[];
    
    // 相关资源推荐
    relatedResources?: Array<{
      type: 'article' | 'video' | 'website' | 'book' | 'tool';
      title: string;
      description?: string;
      url?: string;
    }>;
    
    // 问答摘要（如果是问答整理类型）
    qaSummary?: Array<{
      question: string;
      answer: string;
      askedBy?: string;  // 提问者类型：患者/医生等
    }>;
    
    // 患者故事特有字段
    patientStoryInfo?: {
      disease?: string;          // 疾病名称
      duration?: string;         // 病程
      treatment?: string;        // 治疗经历
      outcome?: string;          // 结果
      lessons?: string[];        // 经验教训
      anonymous: boolean;        // 是否匿名
    };
    
    // 微信分享优化字段
    wechatShare?: {
      // 文章金句（适合转发）
      goldenSentences?: string[];
      
      // 知识卡片（图片+文字形式）
      knowledgeCards?: Array<{
        title: string;
        content: string;
        imageSuggestion?: string; // 图片建议
      }>;
      
      // 一句话总结
      oneSentenceSummary?: string;
      
      // 行动号召
      callToAction?: string;
      
      // 适合转发的格式
      shareFormats?: {
        short: string;           // 短版本（朋友圈）
        long: string;           // 长版本（文章）
        imageText: string;      // 图文版
      };
    };
    
    // 互动引导
    interactionPrompts?: {
      discussionQuestions?: string[];   // 讨论问题
      voteOptions?: string[];          // 投票选项
      sharePrompts?: string[];         // 分享提示
    };
    
    // 更新信息
    updateInfo?: {
      originalVersion?: string;  // 原始版本号
      updateReason?: string;     // 更新原因
      changeLog?: string[];      // 更新内容
      nextReviewDate?: string;   // 下次审核日期
    };
  };
}

/**
 * 适合平台的查询选项
 */
export interface ArticleQueryOptions {
  // 文章类型筛选
  articleType?: ArticleType | ArticleType[];
  
  // 难度级别筛选
  difficulty?: ArticleDifficulty;
  
  // 读者群体筛选
  targetReader?: string;
  
  // 适用疾病筛选
  applicableCondition?: string;
  
  // 来源类型筛选
  sourceType?: ArticleSourceType;
  
  // 实用性和互动性筛选
  hasPracticalAdvice?: boolean;
  hasQASummary?: boolean;
  hasPatientStory?: boolean;
  
  // 时间筛选
  daysSincePublished?: number; // 发布天数
  isRecentlyUpdated?: boolean; // 最近更新
}

/**
 * 适合平台的统计信息
 */
export interface ArticleStats {
  // 总量统计
  totalArticles: number;
  totalReadable: number;      // 可读性高的文章数
  
  // 分类统计
  byArticleType: Record<ArticleType, number>;
  byDifficulty: Record<ArticleDifficulty, number>;
  bySourceType: Record<ArticleSourceType, number>;
  
  // 读者群体覆盖
  readerCoverage: {
    generalPublic: number;
    patients: number;
    doctors: number;
    others: number;
  };
  
  // 实用性统计
  articlesWithAdvice: number;      // 含实用建议的文章
  articlesWithResources: number;   // 含相关资源的文章
  articlesWithQASummary: number;   // 含问答摘要的文章
  
  // 互动统计
  averageReadingTime: number;      // 平均阅读时长（分钟）
  shareToWechatRate: number;       // 分享到微信比例
  discussionRate: number;          // 讨论参与率
}

/**
 * 重新设计：适合平台的工具函数
 */
export const ArticleUtils = {
  /**
   * 获取文章类型中文名称
   */
  getArticleTypeName(type: ArticleType): string {
    const names: Record<ArticleType, string> = {
      [ArticleType.HEALTH_SCIENCE]: '健康科普',
      [ArticleType.DISEASE_GUIDE]: '疾病指南',
      [ArticleType.MEDICATION_GUIDE]: '用药指导',
      [ArticleType.LIFESTYLE]: '生活方式',
      [ArticleType.PATIENT_STORY]: '患者故事',
      [ArticleType.DOCTOR_ADVICE]: '医生建议',
      [ArticleType.NEWS_REPORT]: '新闻报道',
      [ArticleType.POLICY_INTERPRETATION]: '政策解读',
      [ArticleType.TECH_SHARING]: '技术分享',
      [ArticleType.Q_A_SUMMARY]: '问答精选'
    };
    return names[type] || type;
  },
  
  /**
   * 获取难度级别描述
   */
  getDifficultyDescription(difficulty: ArticleDifficulty): string {
    const descriptions: Record<ArticleDifficulty, string> = {
      [ArticleDifficulty.BEGINNER]: '适合普通患者阅读，语言通俗易懂',
      [ArticleDifficulty.INTERMEDIATE]: '需要一定医学常识，适合家属和医学生',
      [ArticleDifficulty.ADVANCED]: '专业内容，适合医务人员'
    };
    return descriptions[difficulty];
  },
  
  /**
   * 生成适合患者阅读的摘要
   */
  generatePatientFriendlySummary(article: ArticleMessage): string {
    const { articleInfo } = article;
    
    let summary = '';
    
    // 如果有患者故事信息
    if (articleInfo.patientStoryInfo) {
      const { disease, duration, outcome, lessons } = articleInfo.patientStoryInfo;
      summary = `这是一位${disease ? disease + '患者' : '患者'}的亲身经历。`;
      if (duration) summary += `病程${duration}。`;
      if (outcome) summary += `治疗结果：${outcome}。`;
      if (lessons && lessons.length > 0) {
        summary += `主要经验：${lessons[0]}`;
      }
    }
    // 如果是疾病指南或用药指导
    else if ([ArticleType.DISEASE_GUIDE, ArticleType.MEDICATION_GUIDE].includes(articleInfo.articleType)) {
      if (articleInfo.keyKnowledgePoints && articleInfo.keyKnowledgePoints.length > 0) {
        const importantPoints = articleInfo.keyKnowledgePoints
          .filter(p => p.importance === 'high')
          .slice(0, 2);
        summary = importantPoints.map(p => p.point).join('；');
      }
    }
    // 其他类型文章
    else {
      summary = article.content.length > 150 
        ? article.content.substring(0, 150) + '...' 
        : article.content;
    }
    
    return summary;
  },
  
  /**
   * 生成微信朋友圈分享内容
   */
  generateWechatMomentsShare(article: ArticleMessage): string {
    const { articleInfo } = article;
    
    let content = '';
    
    // 标题和类型
    content += `${this.getArticleTypeName(articleInfo.articleType)} | ${article.title}\n\n`;
    
    // 一句话总结（如果有）
    if (articleInfo.wechatShare?.oneSentenceSummary) {
      content += `💡 ${articleInfo.wechatShare.oneSentenceSummary}\n\n`;
    }
    
    // 关键知识点（最多2个）
    if (articleInfo.keyKnowledgePoints) {
      const keyPoints = articleInfo.keyKnowledgePoints
        .filter(p => p.importance === 'high')
        .slice(0, 2);
      if (keyPoints.length > 0) {
        content += `📌 关键知识点：\n`;
        keyPoints.forEach(point => {
          content += `  • ${point.point}\n`;
        });
        content += '\n';
      }
    }
    
    // 实用建议（如果有）
    if (articleInfo.practicalAdvice && articleInfo.practicalAdvice.length > 0) {
      content += `🎯 实用建议：${articleInfo.practicalAdvice[0]}\n`;
      if (articleInfo.practicalAdvice.length > 1) {
        content += `（还有${articleInfo.practicalAdvice.length - 1}条建议）\n`;
      }
      content += '\n';
    }
    
    // 结尾
    content += `👨‍⚕️ 作者：${article.authorName}`;
    if (article.authorCredentials) content += ` (${article.authorCredentials})`;
    content += `\n`;
    content += `📚 来源：众创医案平台\n`;
    content += `🔗 点击阅读全文`;
    
    // 限制长度（朋友圈分享建议不超过200字）
    const maxLength = 400;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
    }
    
    return content;
  },
  
  /**
   * 生成微信公众号文章分享内容
   */
  generateWechatArticleShare(article: ArticleMessage): string {
    const { articleInfo } = article;
    
    let content = `<h2>${article.title}</h2>\n\n`;
    
    // 文章信息
    content += `<p><strong>文章类型：</strong>${this.getArticleTypeName(articleInfo.articleType)}</p>\n`;
    content += `<p><strong>适合人群：</strong>${articleInfo.targetReaders.map(r => this.getReaderName(r)).join('、')}</p>\n\n`;
    
    // 作者信息
    content += `<div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">\n`;
    content += `<p><strong>作者：</strong>${article.authorName}`;
    if (article.authorCredentials) content += ` (${article.authorCredentials})`;
    if (article.institution) content += `，${article.institution}`;
    content += `</p>\n`;
    content += `<p><strong>发布时间：</strong>${new Date(article.createdAt).toLocaleDateString('zh-CN')}</p>\n`;
    content += `</div>\n\n`;
    
    // 引言
    if (article.summary) {
      content += `<blockquote style="border-left: 4px solid #1890ff; padding-left: 10px; color: #666;">\n`;
      content += `<p>${article.summary}</p>\n`;
      content += `</blockquote>\n\n`;
    }
    
    // 正文开头（限制长度）
    const contentPreview = article.content.length > 500 
      ? article.content.substring(0, 500) + '...' 
      : article.content;
    content += `<p>${contentPreview.replace(/\n/g, '</p><p>')}</p>\n\n`;
    
    // 行动号召
    if (articleInfo.wechatShare?.callToAction) {
      content += `<div style="background-color: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">\n`;
      content += `<p style="text-align: center; font-weight: bold;">${articleInfo.wechatShare.callToAction}</p>\n`;
      content += `</div>\n`;
    }
    
    // 版权信息
    content += `<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">\n`;
    content += `<p style="text-align: center; color: #999; font-size: 12px;">\n`;
    content += `本文来自众创医案平台，转载请注明出处<br>\n`;
    content += `分享医案知识，共建健康社区\n`;
    content += `</p>`;
    
    return content;
  },
  
  /**
   * 获取读者群体名称
   */
  getReaderName(readerType: string): string {
    const names: Record<string, string> = {
      'general_public': '普通公众',
      'patients': '患者',
      'family_members': '家属',
      'doctors': '医生',
      'nurses': '护士',
      'pharmacists': '药师',
      'medical_students': '医学生'
    };
    return names[readerType] || readerType;
  },
  
  /**
   * 检查文章的可读性
   */
  checkReadability(article: ArticleMessage): {
    score: number; // 0-100分
    level: 'excellent' | 'good' | 'fair' | 'poor';
    suggestions?: string[];
  } {
    const suggestions: string[] = [];
    let score = 100;
    
    // 内容长度检查
    if (article.content.length < 300) {
      score -= 20;
      suggestions.push('内容较短，建议补充更多详细信息');
    } else if (article.content.length > 5000) {
      score -= 10;
      suggestions.push('内容较长，建议分章节或添加摘要');
    }
    
    // 段落结构检查
    const paragraphCount = (article.content.match(/\n\s*\n/g) || []).length + 1;
    if (paragraphCount < 3) {
      score -= 15;
      suggestions.push('段落较少，建议合理分段');
    }
    
    // 标题明确性检查
    if (article.title.length < 5 || article.title.length > 50) {
      score -= 10;
      suggestions.push('标题长度建议在5-50字之间');
    }
    
    // 是否有实用内容检查
    const { articleInfo } = article;
    if (!articleInfo.practicalAdvice || articleInfo.practicalAdvice.length === 0) {
      score -= 10;
      suggestions.push('建议添加实用建议或行动指南');
    }
    
    // 难度匹配检查
    if (articleInfo.difficulty === ArticleDifficulty.ADVANCED && 
        articleInfo.targetReaders.includes('general_public')) {
      score -= 15;
      suggestions.push('高级别内容可能不适合普通公众阅读');
    }
    
    // 确定等级
    let level: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) level = 'excellent';
    else if (score >= 75) level = 'good';
    else if (score >= 60) level = 'fair';
    else level = 'poor';
    
    return {
      score,
      level,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  },
  
  /**
   * 验证文章信息（平台适用性验证）
   */
  validateArticleForPlatform(articleInfo: ArticleMessage['articleInfo']): {
    suitable: boolean;
    reasons: string[];
    improvements: string[];
  } {
    const reasons: string[] = [];
    const improvements: string[] = [];
    
    // 必须有的字段
    if (!articleInfo.articleType) {
      improvements.push('请选择文章类型');
    }
    
    if (!articleInfo.targetReaders || articleInfo.targetReaders.length === 0) {
      improvements.push('请指定目标读者群体');
    }
    
    // 内容质量检查
    if (!articleInfo.practicalAdvice || articleInfo.practicalAdvice.length === 0) {
      improvements.push('建议添加实用建议，提高文章价值');
    }
    
    // 患者故事的特殊检查
    if (articleInfo.articleType === ArticleType.PATIENT_STORY) {
      if (!articleInfo.patientStoryInfo) {
        improvements.push('患者故事需要填写疾病和治疗经历');
      } else if (!articleInfo.patientStoryInfo.anonymous) {
        improvements.push('患者故事建议匿名发布保护隐私');
      }
    }
    
    // 转载文章的检查
    if (articleInfo.sourceType === ArticleSourceType.REPRINT && 
        !articleInfo.originalInfo?.source) {
      improvements.push('转载文章需要注明来源');
    }
    
    // 判断是否适合平台
    const suitable = improvements.length === 0;
    if (suitable) {
      reasons.push('文章符合医患共享平台定位');
    }
    
    return {
      suitable,
      reasons,
      improvements
    };
  }
};

/**
 * 类型守卫 - 检查是否为ArticleMessage
 */
export function isArticleMessage(message: MessageBase): message is ArticleMessage {
  return message.category === MessageCategory.PROFESSIONAL_ARTICLE;
}