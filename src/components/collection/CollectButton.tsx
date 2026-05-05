// src/components/collection/CollectButton.tsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface CollectButtonProps {
  itemId: string;
  itemType: string;
  itemData?: {
    title: string;
    description?: string;
    date?: string;
    imageUrl?: string;
  };
  initialCollected?: boolean;
  onToggle?: (collected: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const CollectButton: React.FC<CollectButtonProps> = ({
  itemId,
  itemType,
  itemData,
  initialCollected = false,
  onToggle,
  size = 'md',
  showCount = false
}) => {
  const [collected, setCollected] = useState(initialCollected);

  // 收藏/取消收藏
  const handleToggle = () => {
    const newCollected = !collected;
    setCollected(newCollected);
    
    try {
      // 读取现有收藏
      const stored = localStorage.getItem('medical_collections');
      let collections = [];
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            collections = parsed;
          }
        } catch (e) {
          console.error('解析收藏数据失败，将创建新数组');
        }
      }
      
      if (newCollected) {
        // 添加收藏 - 保存完整数据
        collections.push({
          id: `${itemType}-${itemId}-${Date.now()}`,
          itemId,
          itemType,
          itemData: itemData || { title: '未知项目' },
          collectedAt: new Date().toISOString()
        });
      } else {
        // 取消收藏
        collections = collections.filter(
          (c: any) => !(c.itemId === itemId && c.itemType === itemType)
        );
      }
      
      localStorage.setItem('medical_collections', JSON.stringify(collections));
      
      // 触发收藏变更事件，通知其他组件更新
      window.dispatchEvent(new CustomEvent('collection-change', {
        detail: { itemId, itemType, collected: newCollected }
      }));
      
      onToggle?.(newCollected);
      
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  // 监听收藏变更事件（用于多标签页同步）
  useEffect(() => {
    const handleCollectionChange = (e: CustomEvent) => {
      if (e.detail?.itemId === itemId && e.detail?.itemType === itemType) {
        setCollected(e.detail.collected);
      }
    };
    
    window.addEventListener('collection-change', handleCollectionChange as EventListener);
    return () => {
      window.removeEventListener('collection-change', handleCollectionChange as EventListener);
    };
  }, [itemId, itemType]);

  // 初始化时检查收藏状态
  useEffect(() => {
    try {
      const stored = localStorage.getItem('medical_collections');
      console.log('📦 读取收藏数据:', stored);
      
      // 确保 collections 是数组
      let collections: any[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            collections = parsed;
          } else {
            console.warn('收藏数据不是数组，重置为空数组');
            localStorage.setItem('medical_collections', '[]');
          }
        } catch (e) {
          console.error('解析收藏数据失败，重置为空数组');
          localStorage.setItem('medical_collections', '[]');
        }
      }
      
      const isCollected = collections.some(
        (c: any) => c.itemId === itemId && c.itemType === itemType
      );
      setCollected(isCollected);
      
    } catch (error) {
      console.error('读取收藏状态失败:', error);
      setCollected(false);
    }
  }, [itemId, itemType]);

  // 根据 size 设置样式
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1 rounded-lg transition-colors ${
        sizeClasses[size]
      } ${
        collected
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-gray-500'
      }`}
      title={collected ? '取消收藏' : '收藏'}
    >
      <Star className={`w-5 h-5 ${collected ? 'fill-yellow-500' : ''}`} />
      {showCount && <span>{collected ? 1 : 0}</span>}
    </button>
  );
};

export default CollectButton;