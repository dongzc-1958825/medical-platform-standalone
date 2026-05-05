// src/components/BridgeShareModal.tsx（修复版�?
import React from 'react';
 // 只导入存在的

// 定义本地类型（修复错�?�?�?
type BridgeDataType = 'medical-case' | 'article' | 'question';

interface SharePackage {
  type: BridgeDataType;
  data: any;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface BridgeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  dataType: BridgeDataType; // 现在类型已定�?
  title: string;
}

const BridgeShareModal: React.FC<BridgeShareModalProps> = ({
  isOpen,
  onClose,
  data,
  dataType,
  title
}) => {
  const [isSharing, setIsSharing] = React.useState(false);

  // 创建本地生成函数（修复错�?�?
  const generateSharePackage = (data: any, type: BridgeDataType): SharePackage => {
    return {
      type,
      data,
      title,
      description: `分享${type}�?{title}`,
      imageUrl: data.imageUrl || data.thumbnail || undefined
    };
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // 使用本地函数代替不存在的服务方法
      const packageData = generateSharePackage(data, dataType);
      
      // 这里调用实际的分享逻辑
      // await BridgeService.share(packageData);
      
      console.log('分享数据:', packageData);
      alert('分享功能待实现');
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请重试');
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">分享</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            �?
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
          <p className="text-sm text-gray-500">
            分享类型: {dataType}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isSharing ? '分享�?..' : '确认分享'}
          </button>

          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default BridgeShareModal;
