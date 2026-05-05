import { 
  QuestionnaireResult, 
  HealthLevel, 
  HealthWarning,
  QuestionnaireAnswer
} from '../types/health';

export class QuestionnaireScoringService {
  // 计算总分并确定健康等级
  calculateHealthLevel(totalScore: number, maxScore: number): HealthLevel {
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'moderate';
    if (percentage >= 40) return 'poor';
    return 'critical';
  }

  // 生成健康预警信息
  generateHealthWarning(level: HealthLevel): HealthWarning {
    const warnings: Record<HealthLevel, HealthWarning> = {
      excellent: {
        level: 'excellent',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '💚',
        title: '健康状况优秀',
        description: '您的整体健康状况非常好，请继续保持良好的生活习惯和定期检查。',
        actions: [
          '继续保持当前健康生活方式',
          '建议每年进行一次全面体检',
          '保持适量运动和均衡饮食'
        ]
      },
      good: {
        level: 'good',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '💙',
        title: '健康状况良好',
        description: '您的健康状况良好，但有些方面可以进一步优化。',
        actions: [
          '注意工作与生活平衡',
          '建议增加适量有氧运动',
          '关注压力管理'
        ]
      },
      moderate: {
        level: 'moderate',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '💛',
        title: '健康状况中等',
        description: '您的健康状况需要关注，建议调整生活习惯并加强健康管理。',
        actions: [
          '建议咨询医生进行详细评估',
          '调整饮食结构和作息时间',
          '开始规律运动计划',
          '减少不良生活习惯'
        ]
      },
      poor: {
        level: 'poor',
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: '🧡',
        title: '健康状况较差',
        description: '您的健康状况需要立即关注，可能存在健康风险。',
        actions: [
          '建议立即预约专业医生咨询',
          '进行全面的健康检查',
          '制定健康改善计划',
          '密切监测关键指标'
        ]
      },
      critical: {
        level: 'critical',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '❤️',
        title: '健康危险信号',
        description: '您的健康状况存在较高风险，需要立即采取行动。',
        actions: [
          '立即就医进行全面检查',
          '遵医嘱进行治疗和管理',
          '保持紧急联系人畅通',
          '避免高风险活动'
        ]
      }
    };

    return warnings[level];
  }

  // 分析答案并生成个性化建议
  analyzeAnswers(answers: QuestionnaireAnswer[], sectionId: string): string[] {
    const recommendations: string[] = [];
    
    // 根据不同的section和答案生成建议
    answers.forEach(answer => {
      // 这里可以根据具体的questionId和answer内容生成针对性建议
      // 例如：
      if (sectionId === 'lifestyle') {
        if (answer.questionId === 'smoking' && answer.answer === 'yes') {
          recommendations.push('建议制定戒烟计划，逐步减少吸烟量');
        }
        if (answer.questionId === 'exercise_frequency' && Number(answer.answer) < 3) {
          recommendations.push('建议增加运动频率，每周至少3次30分钟中等强度运动');
        }
      }
    });

    return recommendations;
  }

  // 计算问卷结果
  calculateResult(
    sections: Record<string, {
      score: number;
      maxScore: number;
      answers: QuestionnaireAnswer[];
    }>
  ): QuestionnaireResult {
    let totalScore = 0;
    let maxTotalScore = 0;
    const allRecommendations: string[] = [];

    // 计算总分和最大分
    Object.entries(sections).forEach(([sectionId, section]) => {
      totalScore += section.score;
      maxTotalScore += section.maxScore;
      
      // 为每个部分生成建议
      const sectionRecs = this.analyzeAnswers(section.answers, sectionId);
      allRecommendations.push(...sectionRecs);
    });

    // 确定健康等级
    const healthLevel = this.calculateHealthLevel(totalScore, maxTotalScore);
    
    // 生成预警
    const warning = healthLevel === 'poor' || healthLevel === 'critical';

    // 如果建议为空，使用通用建议
    if (allRecommendations.length === 0) {
      const warningInfo = this.generateHealthWarning(healthLevel);
      allRecommendations.push(...warningInfo.actions);
    }

    return {
      id: `result_${Date.now()}`,
      userId: 'current-user', // 实际使用时从context获取
      completedAt: new Date(),
      sections,
      totalScore,
      maxTotalScore,
      healthLevel,
      recommendations: allRecommendations,
      warning
    };
  }
}