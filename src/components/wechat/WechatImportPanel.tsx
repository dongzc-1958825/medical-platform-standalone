// src/components/wechat/WechatImportPanel.tsx
import React, { useState } from "react";
import { MessageCircle, Copy, Check, X, Upload } from "lucide-react";

interface WechatImportPanelProps {
  onImport: (content: { title: string; content: string; tags: string[] }) => void;
  onClose: () => void;
}

const WechatImportPanel: React.FC<WechatImportPanelProps> = ({ onImport, onClose }) => {
  const [wechatContent, setWechatContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [importing, setImporting] = useState(false);

  // 从微信内容中提取标题
  const extractTitleFromContent = (content: string) => {
    if (!content) return "";
    
    // 尝试提取第一行作为标题
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // 如果第一行不太长，作为标题
      if (firstLine.length > 5 && firstLine.length < 100) {
        return firstLine;
      }
    }
    
    return "微信导入内容";
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWechatContent(text);
      
      // 自动提取标题
      const extractedTitle = extractTitleFromContent(text);
      setTitle(extractedTitle);
    } catch (error) {
      console.error("无法读取剪贴板:", error);
      alert("请手动粘贴微信内容");
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImport = () => {
    if (!wechatContent.trim()) {
      alert("请输入微信内容");
      return;
    }

    setImporting(true);
    
    const importedContent = {
      title: title.trim() || "微信导入内容",
      content: wechatContent.trim(),
      tags: [...tags]
    };

    // 模拟导入过程
    setTimeout(() => {
      onImport(importedContent);
      setImporting(false);
      alert("导入成功！内容已保存到消息中心");
      onClose();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-cyan-600" />
          <h2 className="text-xl font-bold text-gray-900">导入微信内容</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* 内容粘贴区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            微信内容
          </label>
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
          >
            <Copy className="w-4 h-4" />
            从剪贴板粘贴
          </button>
        </div>
        <textarea
          value={wechatContent}
          onChange={(e) => setWechatContent(e.target.value)}
          placeholder="将微信文章、聊天记录等内容粘贴到这里..."
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          支持粘贴微信文章、聊天记录、公众号内容等
        </p>
      </div>

      {/* 标题设置 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入标题（可选，将自动从内容提取）"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      {/* 标签管理 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="输入标签后按Enter添加"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200"
          >
            添加
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-cyan-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          onClick={handleImport}
          disabled={importing || !wechatContent.trim()}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {importing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              导入中...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              导入到消息中心
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WechatImportPanel;