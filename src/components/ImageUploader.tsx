import React, { useRef, useState } from 'react';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesChange, 
  maxImages = 5 
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (images.length + newImages.length >= maxImages) {
        alert(`最多只能上传 ${maxImages} 张图片`);
        return;
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      // 检查文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          previewUrl: e.target?.result as string,
          name: file.name,
          size: file.size
        };
        newImages.push(imageFile);

        // 当所有图片都处理完成时更新状态
        if (newImages.length === Math.min(files.length, maxImages - images.length)) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理拖放事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 删除图片
  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📸</div>
          <h3 className="font-semibold text-gray-900">
            上传病历照片
          </h3>
          <p className="text-sm text-gray-600">
            点击或拖拽图片到此区域上传
          </p>
          <p className="text-xs text-gray-500">
            支持 JPG、PNG 格式，每张图片不超过 5MB
          </p>
          <p className="text-xs text-gray-500">
            最多可上传 {maxImages} 张图片（已上传 {images.length} 张）
          </p>
        </div>
      </div>

      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group border rounded-lg overflow-hidden bg-white"
            >
              <img
                src={image.previewUrl}
                alt={image.name}
                className="w-full h-24 object-cover"
              />
              
              {/* 图片信息遮罩 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs mb-1 truncate px-2">
                    {image.name}
                  </div>
                  <div className="text-xs">
                    {formatFileSize(image.size)}
                  </div>
                </div>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 使用示例图片的选项 */}
      {images.length === 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">或者使用示例图片进行测试</p>
          <button
            type="button"
            onClick={() => {
              // 这里可以添加示例图片的逻辑
              alert('在实际应用中，这里会加载示例图片供测试使用');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            使用示例图片
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;