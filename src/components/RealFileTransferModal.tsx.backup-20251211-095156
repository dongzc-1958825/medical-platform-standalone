import React, { useState, useEffect } from 'react';
import { RealFileService, FileExportPackage, ExportDataType } from '../services/realFileService';

interface RealFileTransferModalProps {
  data: any;
  dataType: ExportDataType;
  onClose: () => void;
}

const RealFileTransferModal: React.FC<RealFileTransferModalProps> = ({ 
  data, 
  dataType, 
  onClose 
}) => {
  const [filePackage, setFilePackage] = useState<FileExportPackage | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileFormat, setFileFormat] = useState<'json' | 'html'>('html');

  useEffect(() => {
    // 根据选择的格式生成文件包
    let packageData;
    if (fileFormat === 'html') {
      packageData = RealFileService.generateMobileFriendlyFile(data, dataType);
    } else {
      packageData = RealFileService.generateFilePackage(data, dataType);
    }
    setFilePackage(packageData);

    // 清理函数
    return () => {
      if (packageData) {
        RealFileService.revokeFileUrl(packageData.fileUrl);
      }
    };
  }, [data, dataType, fileFormat]);

  const handleCopyInstructions = async () => {
    if (!filePackage) return;
    
    const instructionsText = filePackage.instructions.join('\n');
    try {
      await navigator.clipboard.writeText(instructionsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleWeChatSimulation = () => {
    if (!filePackage) return;
    
    const simulationText = `
【微信文件传输助手 - 模拟】
您收到一个来自"众创医案平台"的文件：

📎 ${filePackage.fileName}
📊 ${filePackage.fileSize}
⏰ ${new Date(filePackage.timestamp).toLocaleString('zh-CN')}

文件类型: ${fileFormat === 'html' ? 'HTML网页文件' : 'JSON数据文件'}
数据内容: ${getTypeDisplayName(filePackage.type)}

💡 提示：${
  fileFormat === 'html' 
    ? '这是一个HTML文件，请在浏览器中打开以获得最佳显示效果' 
    : '这是一个JSON数据文件，适合程序处理和分析'
}
    `;
    
    alert(simulationText);
  };

  if (!filePackage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在生成数据文件...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">📲 真实文件传输</h2>
              <p className="text-blue-100">将医疗数据通过微信传输到手机</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 格式选择器 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">📁 选择文件格式</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setFileFormat('html')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  fileFormat === 'html' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">🌐</div>
                <div className="font-medium">HTML网页格式</div>
                <div className="text-xs mt-1">推荐：手机直接查看</div>
              </button>
              <button
                onClick={() => setFileFormat('json')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  fileFormat === 'json' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">📊</div>
                <div className="font-medium">JSON数据格式</div>
                <div className="text-xs mt-1">开发：程序处理</div>
              </button>
            </div>
          </div>

          {/* 文件信息卡片 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">
                  {fileFormat === 'html' ? '🌐' : '📊'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {fileFormat === 'html' ? '手机优化网页文件' : '标准数据文件'}
                </h3>
                <p className="text-sm text-gray-600">
                  {fileFormat === 'html' 
                    ? '在手机浏览器中完美显示' 
                    : '适合程序处理和导入'
                  }
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">文件名:</span>
                <p className="font-medium truncate" title={filePackage.fileName}>
                  {filePackage.fileName}
                </p>
              </div>
              <div>
                <span className="text-gray-600">文件格式:</span>
                <p className="font-medium">
                  {fileFormat === 'html' ? 'HTML网页' : 'JSON数据'}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    {fileFormat === 'html' ? '推荐' : '开发'}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600">文件大小:</span>
                <p className="font-medium">{filePackage.fileSize}</p>
              </div>
              <div>
                <span className="text-gray-600">生成时间:</span>
                <p className="font-medium">
                  {new Date(filePackage.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* 下载按钮 */}
          <div className="text-center">
            <a
              href={filePackage.fileUrl}
              download={filePackage.fileName}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              onClick={() => {
                console.log('文件下载:', filePackage.fileName);
              }}
            >
              <span>📥</span>
              <span>
                {fileFormat === 'html' ? '下载HTML文件' : '下载JSON文件'}
              </span>
            </a>
            <p className="text-sm text-gray-600 mt-2">
              下载后通过微信文件传输助手发送到手机
            </p>
          </div>

          {/* 传输指引 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">📋 传输步骤指引</h3>
              <button
                onClick={handleCopyInstructions}
                className="flex items-center space-x-1 bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50"
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? '已复制' : '复制指引'}</span>
              </button>
            </div>
            
            <ol className="space-y-3">
              {filePackage.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 微信模拟测试 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">
              🧪 测试文件接收
            </h3>
            <p className="text-orange-700 mb-4">
              模拟在手机微信中接收文件的效果（无需实际下载）
            </p>
            <button
              onClick={handleWeChatSimulation}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              模拟微信文件接收
            </button>
          </div>

          {/* 数据预览 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              🔍 数据内容预览
            </h3>
            <div className="bg-white rounded border border-purple-100 p-4 max-h-40 overflow-y-auto">
              <pre className="text-xs text-purple-700">
                {JSON.stringify(filePackage.data, null, 2)}
              </pre>
            </div>
            <p className="text-purple-600 text-sm mt-2">
              这是标准化后的数据结构，包含完整的元数据信息
            </p>
          </div>

          {/* 技术支持信息 */}
          <div className="text-center text-sm text-gray-500">
            <p>💡 技术支持: 此功能生成真实的数据文件，可通过任何文件传输方式共享</p>
            <p>🔄 数据格式: {fileFormat === 'html' ? 'HTML网页，手机友好' : '标准化JSON，程序可读'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 获取类型显示名称
const getTypeDisplayName = (type: ExportDataType): string => {
  const typeMap: Record<ExportDataType, string> = {
    'medical_case': '医案数据',
    'physical_exam': '体检报告', 
    'drug_info': '药品信息',
    'consultation': '咨询记录'
  };
  return typeMap[type];
};

export default RealFileTransferModal;