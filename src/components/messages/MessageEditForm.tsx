import React, { useState, useEffect } from 'react';

interface MessageEditFormProps {
  message?: any;
  onSave?: (updatedData: any) => void;
  onCancel?: () => void;
}

const MessageEditForm: React.FC<MessageEditFormProps> = ({ message, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (message) {
      setTitle(message.title || '');
      setContent(message.content || '');
      setType(message.type || '');
      setTags((message.tags || []).join(', '));
    }
  }, [message]);

  const handleSubmit = () => {
    if (onSave) {
      onSave({
        title,
        content,
        type,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">编辑消息</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="标题"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none"
            rows={8}
            placeholder="内容"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="例如：中医, 养生"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditForm;
