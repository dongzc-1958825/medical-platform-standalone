// src/shared/types/community.ts

// 社区类型
export type CommunityType = 'disease' | 'other';

// 社区分类
export interface CommunityCategory {
  id: string;
  name: string;
  pinyin: string;
  description: string;
  type: CommunityType;
  icon?: string;
  color?: string;
  bgColor?: string;
  memberCount?: number;
  postCount?: number;
  createdAt?: string;
}

// 社区动态
export interface CommunityActivity {
  id: string;
  communityId: string;
  communityName: string;
  type: 'new_member' | 'new_post' | 'new_comment' | 'new_event';
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// 社区统计数据
export interface CommunityStats {
  totalCommunities: number;
  totalMembers: number;
  totalPosts: number;
  totalComments: number;
  todayActive: number;
  todayNewPosts: number;
  todayNewMembers: number;
}
