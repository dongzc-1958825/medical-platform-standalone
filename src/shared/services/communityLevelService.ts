/**
 * 社区发展等级服务
 * 基于社区发展指数自动评定社区等级
 */

export type CommunityLevel = 'A' | 'B' | 'C' | 'D' | 'E';

export interface CommunityLevelInfo {
  level: CommunityLevel;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  range: [number, number];
  description: string;
  nextLevel?: string;
}

class CommunityLevelService {
  private readonly LEVELS: Record<CommunityLevel, CommunityLevelInfo> = {
    'A': {
      level: 'A',
      name: '繁荣社区',
      icon: '🌟',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      range: [85, 100],
      description: '万人社区，日均百帖，影响力广泛'
    },
    'B': {
      level: 'B',
      name: '活跃社区',
      icon: '💫',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      range: [70, 84],
      description: '千人社区，互动频繁，氛围活跃'
    },
    'C': {
      level: 'C',
      name: '成长社区',
      icon: '⭐',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      range: [55, 69],
      description: '百人社区，开始活跃，潜力巨大'
    },
    'D': {
      level: 'D',
      name: '萌芽社区',
      icon: '🌱',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      range: [40, 54],
      description: '几十人，初步形成社区氛围'
    },
    'E': {
      level: 'E',
      name: '初创社区',
      icon: '🌰',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      range: [0, 39],
      description: '刚刚起步，需要更多参与'
    }
  };

  /**
   * 根据发展指数获取社区等级
   */
  getLevel(score: number): CommunityLevelInfo {
    const level = Object.values(this.LEVELS).find(
      level => score >= level.range[0] && score <= level.range[1]
    );
    
    return level || this.LEVELS['E'];
  }

  /**
   * 获取所有等级信息
   */
  getAllLevels(): CommunityLevelInfo[] {
    return Object.values(this.LEVELS);
  }

  /**
   * 获取下一等级信息
   */
  getNextLevel(level: CommunityLevel): CommunityLevelInfo | null {
    const levels: CommunityLevel[] = ['E', 'D', 'C', 'B', 'A'];
    const currentIndex = levels.indexOf(level);
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      return this.LEVELS[nextLevel];
    }
    
    return null;
  }

  /**
   * 计算升级进度
   */
  getUpgradeProgress(score: number, currentLevel: CommunityLevel): number {
    const current = this.LEVELS[currentLevel];
    const next = this.getNextLevel(currentLevel);
    
    if (!next) return 100; // 已经是最高级
    
    const range = next.range[0] - current.range[0];
    const progress = ((score - current.range[0]) / range) * 100;
    
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  /**
   * 获取等级对应的样式类
   */
  getLevelClasses(level: CommunityLevel): string {
    const info = this.LEVELS[level];
    return `${info.bgColor} ${info.textColor} border border-${info.color.split('-')[1]}-200`;
  }

  /**
   * 获取等级徽章组件
   */
  getLevelBadge(level: CommunityLevel): string {
    const info = this.LEVELS[level];
    return `${info.icon} ${info.name}`;
  }
}

export const communityLevelService = new CommunityLevelService();