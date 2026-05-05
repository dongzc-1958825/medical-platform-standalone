import React from 'react';

interface MessageEditFormProps {
  initialContent?: string;
  onSubmit?: (content: string) => void;
  onCancel?: () => void;
}

const MessageEditForm: React.FC<MessageEditFormProps> = ({ initialContent = '', onSubmit, onCancel }) => {
  const [content, setContent] = React.useState(initialContent);

  const handleSubmit = () => {
    if (onSubmit && content.trim()) {
      onSubmit(content);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="编辑内容..."
        className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        rows={6}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default MessageEditForm;
