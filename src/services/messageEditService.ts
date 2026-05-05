// src/services/messageEditService.ts
/**
 * 消息编辑服务
 * 版本: 1.1.0 (权限检查修复版)
 * 功能: 提供消息编辑相关功能
 */

import { MessageItem, MessageUpdateData } from '../types/message';

/**
 * 检查用户是否有权限编辑消息
 * @param message 要检查的消息对象
 * @param user 用户对象
 * @returns 是否有编辑权限
 */
export const canEditMessage = (message: any, user: any): boolean => {
  try {
    // 基本检查
    if (!user || !message) {
      console.warn("权限检查：用户或消息为空");
      return false;
    }
    
    console.log("🔍 消息编辑权限检查:", {
      消息ID: message.id,
      消息标题: message.title?.substring(0, 30) + (message.title?.length > 30 ? "..." : ""),
      消息发布者ID: message.publisherId,
      消息作者: message.author,
      消息来源: message.source,
      消息类型: message.type,
      当前用户ID: user.id,
      当前用户名: user.username || user.email,
      用户对象: user // 完整用户对象用于调试
    });
    
    // ========== 权限检查规则（按优先级） ==========
    
    // 规则1：用户是消息的发布者（publisherId 精确匹配）
    if (message.publisherId && message.publisherId === user.id) {
      console.log("✅ 权限通过：用户是消息发布者 (publisherId 匹配)");
      return true;
    }
    
    // 规则2：消息来源为用户创建（source === "user"）
    if (message.source === "user") {
      console.log("✅ 权限通过：用户创建的消息 (source === 'user')");
      return true;
    }
    
    // 规则3：微信导入的消息（source === "wechat"）
    if (message.source === "wechat") {
      console.log("✅ 权限通过：微信导入的消息 (source === 'wechat')");
      return true;
    }
    
    // 规则4：作者名称匹配（fallback，如果上述都不匹配）
    const userName = user.username || user.email?.split('@')[0];
    if (message.author && userName && message.author === userName) {
      console.log("✅ 权限通过：作者名称匹配 (author 匹配)");
      return true;
    }
    
    // 规则5：对于没有 publisherId 的旧消息，检查是否是"用户"发布的测试数据
    // 这是为了兼容性，允许编辑作者为"用户"的旧消息
    if (!message.publisherId && message.author === "用户") {
      console.log("⚠️ 权限通过（兼容模式）：允许编辑作者为'用户'的旧消息");
      return true;
    }
    
    // 规则6：用户ID在消息的某些字段中（扩展检查）
    if (user.id && JSON.stringify(message).includes(user.id)) {
      console.log("⚠️ 权限通过（扩展检查）：消息中包含用户ID");
      return true;
    }
    
    console.log("❌ 权限拒绝：用户无权编辑此消息");
    console.log("📊 拒绝详情:", {
      匹配情况: {
        publisherId匹配: message.publisherId === user.id,
        source为user: message.source === "user",
        source为wechat: message.source === "wechat",
        author匹配: message.author === userName,
        作者为用户: message.author === "用户"
      },
      用户ID: user.id,
      消息发布者ID: message.publisherId,
      消息来源: message.source,
      消息作者: message.author,
      用户名: userName
    });
    
    return false;
    
  } catch (error) {
    console.error('❌ 检查编辑权限失败:', error);
    return false;
  }
};

/**
 * 从localStorage获取消息列表
 * @returns 消息列表
 */
const getMessagesFromStorage = (): MessageItem[] => {
  try {
    const messagesData = localStorage.getItem('medical_messages');
    if (!messagesData) return [];
    
    return JSON.parse(messagesData) as MessageItem[];
  } catch (error) {
    console.error('从localStorage读取消息失败:', error);
    return [];
  }
};

/**
 * 保存消息列表到localStorage
 * @param messages 消息列表
 */
const saveMessagesToStorage = (messages: MessageItem[]): void => {
  try {
    localStorage.setItem('medical_messages', JSON.stringify(messages));
    
    // 触发自定义事件，通知其他组件数据已更新
    window.dispatchEvent(new CustomEvent('messages-updated', {
      detail: { timestamp: new Date().toISOString() }
    }));
  } catch (error) {
    console.error('保存消息到localStorage失败:', error);
  }
};

/**
 * 更新消息
 * @param messageId 消息ID
 * @param updates 更新数据
 * @returns 更新后的消息，如果失败返回null
 */
export const updateMessage = (
  messageId: string,
  updates: MessageUpdateData
): MessageItem | null => {
  try {
    const messages = getMessagesFromStorage();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      console.warn(`未找到ID为 ${messageId} 的消息`);
      return null;
    }
    
    // 检查权限（这里需要用户信息，但函数签名不支持）
    // 注意：这个函数在实际中可能无法检查权限，因为缺少user参数
    // 权限检查应该在调用此函数之前进行
    
    // 创建更新后的消息
    const originalMessage = messages[messageIndex];
    const updatedMessage: MessageItem = {
      ...originalMessage,
      ...updates,
      // 确保必要的字段不被覆盖
      id: originalMessage.id,
      author: originalMessage.author,
      publishTime: originalMessage.publishTime,
      viewCount: originalMessage.viewCount,
      likeCount: originalMessage.likeCount,
      commentCount: originalMessage.commentCount,
      comments: originalMessage.comments,
      isPinned: originalMessage.isPinned,
      // 设置编辑相关字段
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
    
    // 更新消息列表
    messages[messageIndex] = updatedMessage;
    
    // 保存到storage
    saveMessagesToStorage(messages);
    
    console.log(`消息 ${messageId} 更新成功`);
    return updatedMessage;
  } catch (error) {
    console.error('更新消息失败:', error);
    return null;
  }
};

/**
 * 获取可编辑的消息字段
 * 用于确定哪些字段允许用户编辑
 */
export const getEditableFields = (): Array<keyof MessageUpdateData> => {
  return ['title', 'content', 'type', 'tags'];
};

/**
 * 验证编辑数据
 * @param data 编辑数据
 * @returns 验证结果
 */
export const validateEditData = (data: Partial<MessageUpdateData>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // 标题验证
  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      errors.push('标题不能为空');
    }
    if (data.title.trim().length > 100) {
      errors.push('标题不能超过100个字符');
    }
  }
  
  // 内容验证
  if (data.content !== undefined) {
    if (data.content.trim().length === 0) {
      errors.push('内容不能为空');
    }
    if (data.content.trim().length > 5000) {
      errors.push('内容不能超过5000个字符');
    }
  }
  
  // 标签验证
  if (data.tags !== undefined) {
    if (data.tags.length > 5) {
      errors.push('标签数量不能超过5个');
    }
    
    data.tags.forEach(tag => {
      if (tag.length > 20) {
        errors.push(`标签"${tag}"不能超过20个字符`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 准备消息编辑表单的初始数据
 * @param message 原始消息
 * @returns 编辑表单初始数据
 */
export const prepareEditFormData = (message: MessageItem): {
  title: string;
  content: string;
  type: MessageItem['type'];
  tags: string[];
} => {
  return {
    title: message.title,
    content: message.content,
    type: message.type,
    tags: message.tags || []
  };
};

/**
 * 获取消息编辑历史（模拟数据，未来可扩展）
 */
export const getMessageEditHistory = (messageId: string): Array<{
  timestamp: string;
  editor: string;
  changes: string[];
}> => {
  // 模拟编辑历史
  return [
    {
      timestamp: new Date().toISOString(),
      editor: '系统',
      changes: ['消息已编辑']
    }
  ];
};

/**
 * 增强版权限检查（专为众创医案平台设计）
 * 针对平台特定的数据结构进行优化
 */
export const canEditMessageEnhanced = (message: any, user: any): boolean => {
  // 如果标准检查通过，直接返回
  if (canEditMessage(message, user)) {
    return true;
  }
  
  // 特殊规则：对于没有明确标识的消息，尝试更多匹配
  if (!message.publisherId && !message.source) {
    // 检查消息是否在用户的"我的消息"分类中
    const userName = user.username || user.email?.split('@')[0] || "用户";
    const isLikelyUserMessage = 
      message.author === userName ||
      message.author === "用户" ||
      message.author === user.email;
    
    if (isLikelyUserMessage) {
      console.log("✅ 权限通过（增强检查）：可能是用户的消息");
      return true;
    }
  }
  
  return false;
};