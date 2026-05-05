// src/shared/types/content/base.ts - 鍏紑鍐呭鍩虹被
import { Identifiable, Timestamped, DataVisibility } from '../base';

/**
 * 鍏紑鍐呭鍩虹被 - 鐢ㄤ簬鍥涘ぇ鍏紑鍔熻兘
 * 鍖绘鍒嗕韩銆佸鍖婚棶鑽€佷笓鐥呯ぞ鍖恒€佹秷鎭姛鑳?
 */
export interface PublicContent extends Identifiable, Timestamped {
  // 鍩虹淇℃伅
  title: string;
  content: string;
  summary?: string;
  
  // 浣滆€呬俊鎭紙鏂囪矗鑷礋锛?
  authorId: string;
  authorName: string;
  authorRole: string;
  authorCredentials?: string;
  institution?: string;
  
  // 鍒嗙被鏍囩
  tags: string[];
  keywords: string[];
  
  // 鏃堕棿淇℃伅
  publishedAt?: string;
  updatedAt?: string;
  
  // 浜掑姩鏁版嵁
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // 鐘舵€佺鐞?
  status: string; // 内容状态
  isVerified?: boolean;
  isFeatured?: boolean;
  
  // 鍙鎬э紙榛樿鍏紑锛?
  visibility: DataVisibility.PUBLIC | DataVisibility.PROTECTED;
  
  // 鏉ユ簮淇℃伅锛堢敤浜庡井淇′簰閫氾級
  sourceType?: 'original' | 'wechat' | 'import';
  originalSourceContent?: string;
}
