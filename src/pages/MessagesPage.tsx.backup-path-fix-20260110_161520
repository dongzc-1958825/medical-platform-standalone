import React, { useState, useEffect } from 'react';
import { messageService } from '../services/messageService';
import { MessageItem, MessageCategory } from '../types/message';

const MessagesPage: React.FC = () => {
  const [categories, setCategories] = useState<MessageCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('new_medicine');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  useEffect(() => {
    loadCategories();
    loadMessages();
  }, [selectedCategory]);

  const loadCategories = () => {
    const data = messageService.getCategories();
    setCategories(data);
  };

  const loadMessages = () => {
    const data = messageService.getMessagesByCategory(selectedCategory);
    setMessages(data);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedMessage(null);
  };

  const handleMessageSelect = (message: MessageItem) => {
    setSelectedMessage(message);
    messageService.incrementViewCount(message.id);
  };

  const handleLike = (messageId: string) => {
    messageService.likeMessage(messageId);
    loadMessages();
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({
        ...selectedMessage,
        likeCount: selectedMessage.likeCount + 1
      });
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 消息详情页面
  if (selectedMessage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4">
          <button 
            onClick={() => setSelectedMessage(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 返回列表
          </button>
          <h1 className="text-xl font-bold text-gray-800">{selectedMessage.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span>{selectedMessage.author}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(selectedMessage.publishTime)}</span>
            <span className="mx-2">•</span>
            <span>浏览 {selectedMessage.viewCount}</span>
          </div>
        </div>

        <div className="p-4 bg-white">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
          </div>
          
          {/* 标签 */}
          {selectedMessage.tags && selectedMessage.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedMessage.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleLike(selectedMessage.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <span>❤️</span>
              <span>{selectedMessage.likeCount}</span>
            </button>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📝 {selectedMessage.commentCount} 评论</span>
              <span>👁️ {selectedMessage.viewCount} 浏览</span>
            </div>
          </div>
        </div>

        {/* 评论区 */}
        <div className="mt-4 bg-white p-4">
          <h3 className="font-semibold text-gray-800 mb-4">评论 ({selectedMessage.commentCount})</h3>
          {selectedMessage.comments.length > 0 ? (
            <div className="space-y-4">
              {selectedMessage.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">{comment.author}</span>
                    <span className="text-sm text-gray-500">{formatTime(comment.time)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="text-sm text-gray-500 hover:text-red-600">
                      ❤️ {comment.likes}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-blue-600">
                      回复
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无评论，快来抢沙发吧~</p>
          )}
        </div>
      </div>
    );
  }

  // 消息列表页面
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 分类导航 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">消息</h1>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-sm opacity-80">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            onClick={() => handleMessageSelect(message)}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 flex-1 pr-2">{message.title}</h3>
              {message.isPinned && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">置顶</span>
              )}
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{message.content}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{message.author}</span>
                <span>{formatTime(message.publishTime)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{message.likeCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>{message.commentCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{message.viewCount}</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-6xl mb-4">📝</div>
            <p className="text-gray-500">暂无内容</p>
            <p className="text-sm text-gray-400 mt-1">该分类下还没有发布内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;