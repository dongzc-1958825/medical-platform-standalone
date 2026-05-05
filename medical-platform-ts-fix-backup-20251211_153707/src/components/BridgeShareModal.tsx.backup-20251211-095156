import React, { useState } from 'react';
import { BridgeService, SharePackage } from '../services/bridgeService';

interface BridgeShareModalProps {
  data: any;
  dataType: BridgeDataType;
  onClose: () => void;
}

const BridgeShareModal: React.FC<BridgeShareModalProps> = ({ 
  data, 
  dataType, 
  onClose 
}) => {
  const [sharePackage, setSharePackage] = useState<SharePackage | null>(null);
  const [activeTab, setActiveTab] = useState<'qr' | 'link' | 'copy'>('qr');

  // 生成分享包
  const generateSharePackage = () => {
    const packageData = BridgeService.generateSharePackage(data, dataType);
    setSharePackage(packageData);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!sharePackage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">生成数据分享包</h2>
          <p className="text-gray-600 mb-6">
            将生成一个30分钟内有效的分享包，可通过二维码、链接或复制文本方式发送到手机。
          </p>
          <div className="flex space-x-3">
            <button
              onClick={generateSharePackage}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              生成分享包
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">分享到手机</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* 标签页导航 */}
        <div className="flex border-b border-gray-200 mb-4">
          {[
            { id: 'qr', name: '二维码', icon: '📱' },
            { id: 'link', name: '分享链接', icon: '🔗' },
            { id: 'copy', name: '复制文本', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-center flex items-center justify-center space-x-1 ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="mb-4">
          {activeTab === 'qr' && (
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-lg inline-block mb-3">
                {/* 这里实际应该用二维码生成库 */}
                <div className="w-48 h-48 bg-white flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-xs text-gray-500">二维码图片</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {sharePackage.packageId}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                使用手机扫描二维码获取数据
              </p>
            </div>
          )}

          {activeTab === 'link' && (
            <div>
              <div className="bg-gray-100 p-3 rounded-lg mb-3">
                <p className="text-sm break-all">{sharePackage.shareLink}</p>
              </div>
              <button
                onClick={() => copyToClipboard(sharePackage.shareLink)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                复制链接
              </button>
            </div>
          )}

          {activeTab === 'copy' && (
            <div>
              <div className="bg-gray-100 p-3 rounded-lg mb-3">
                <p className="text-sm whitespace-pre-wrap">{sharePackage.copyText}</p>
              </div>
              <button
                onClick={() => copyToClipboard(sharePackage.copyText)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                复制文本
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          有效期至: {new Date(sharePackage.expiresAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default BridgeShareModal;