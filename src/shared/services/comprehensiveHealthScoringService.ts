import { 
  HealthAssessmentLevel,
  BMICategory,
  HEALTH_LEVEL_THRESHOLDS,  // ✅ 修正：从 HEALTH_LEVELS 改为 HEALTH_LEVEL_THRESHOLDS
  SECTION_MAX_SCORES,
  QUESTIONNAIRE_TOTAL_SCORE
} from '../types/health';

import type { 
  AdultHealthQuestionnaire,
  SectionScores,
  QuestionnaireResult 
} from '../types/health';

export class ComprehensiveHealthScoringService {
  /**
   * 计算问卷总分
   */
  calculateScore(questionnaireData: AdultHealthQuestionnaire): QuestionnaireResult {
    // 计算各部分得分
    const sectionScores = this.calculateSectionScores(questionnaireData);
    
    // 计算总分
    const totalScore = this.calculateTotalScore(sectionScores);
    
    // 确定健康等级
    const healthLevel = this.determineHealthLevel(totalScore);
    
    // 生成建议
    const recommendations = this.generateRecommendations(sectionScores, totalScore);
    
    // 计算BMI
    const bmiData = this.calculateBMI(questionnaireData);
    
    return {
      id: questionnaireData.id,
      userId: questionnaireData.userId,
      assessmentDate: questionnaireData.assessmentDate,
      totalScore,
      healthLevel,
      sectionScores,
      recommendations,
      bmi: bmiData.value,
      bmiCategory: bmiData.category,
      questionnaireData
    };
  }

  /**
   * 计算各部分得分
   */
  private calculateSectionScores(questionnaireData: AdultHealthQuestionnaire): SectionScores {
    // 获取各部分答案
    const basicInfoAnswers = this.getSectionAnswers(questionnaireData, 'basic-info');
    const physicalHealthAnswers = this.getSectionAnswers(questionnaireData, 'physical-health');
    const mentalHealthAnswers = this.getSectionAnswers(questionnaireData, 'mental-health');
    const socialAdaptationAnswers = this.getSectionAnswers(questionnaireData, 'social-adaptation');
    const healthBehaviorAnswers = this.getSectionAnswers(questionnaireData, 'health-behavior');
    const selfAssessmentAnswers = this.getSectionAnswers(questionnaireData, 'self-assessment');

    return {
      basicInfo: {
        score: this.scoreBasicInfo(basicInfoAnswers),
        max: SECTION_MAX_SCORES.basicInfo,
        percentage: 0
      },
      physicalHealth: {
        score: this.scorePhysicalHealth(physicalHealthAnswers),
        max: SECTION_MAX_SCORES.physicalHealth,
        percentage: 0
      },
      mentalHealth: {
        score: this.scoreMentalHealth(mentalHealthAnswers),
        max: SECTION_MAX_SCORES.mentalHealth,
        percentage: 0
      },
      socialAdaptation: {
        score: this.scoreSocialAdaptation(socialAdaptationAnswers),
        max: SECTION_MAX_SCORES.socialAdaptation,
        percentage: 0
      },
      healthBehavior: {
        score: this.scoreHealthBehavior(healthBehaviorAnswers),
        max: SECTION_MAX_SCORES.healthBehavior,
        percentage: 0
      },
      selfAssessment: {
        score: this.scoreSelfAssessment(selfAssessmentAnswers),
        max: SECTION_MAX_SCORES.selfAssessment,
        percentage: 0
      }
    };
  }

  /**
   * 获取指定部分的答案
   */
  private getSectionAnswers(questionnaireData: AdultHealthQuestionnaire, sectionId: string): Record<string, any> {
    const section = questionnaireData.sections.find(s => s.sectionId === sectionId);
    if (!section) return {};
    
    const answers: Record<string, any> = {};
    section.answers.forEach(a => {
      answers[a.questionId] = a.answer;
    });
    return answers;
  }

  /**
   * 评分：基本信息
   */
  private scoreBasicInfo(answers: Record<string, any>): number {
    let score = 0;
    
    // 年龄评分（年龄越大风险越高，但完全评分需要更复杂的逻辑）
    if (answers.age) {
      const age = Number(answers.age);
      if (age < 30) score += 2;
      else if (age < 45) score += 1.5;
      else if (age < 60) score += 1;
      else if (age < 75) score += 0.5;
    }
    
    // 腰围评分
    if (answers.waistline) {
      const waistline = Number(answers.waistline);
      const gender = answers.gender;
      
      if (gender === 'male') {
        if (waistline < 85) score += 2;
        else if (waistline < 90) score += 1.5;
        else if (waistline < 95) score += 1;
        else score += 0.5;
      } else {
        if (waistline < 80) score += 2;
        else if (waistline < 85) score += 1.5;
        else if (waistline < 90) score += 1;
        else score += 0.5;
      }
    }
    
    // BMI评分（通过BMI计算器单独处理，这里只给基础分）
    score += 2; // 基础分
    
    return Math.min(score, SECTION_MAX_SCORES.basicInfo);
  }

  /**
   * 评分：身体健康
   */
  private scorePhysicalHealth(answers: Record<string, any>): number {
    let score = SECTION_MAX_SCORES.physicalHealth;
    
    // 慢性病扣分
    if (answers.chronicDiseases && Array.isArray(answers.chronicDiseases)) {
      const diseaseCount = answers.chronicDiseases.length;
      score -= diseaseCount * 3;
    }
    
    // 症状扣分
    if (answers.symptoms && Array.isArray(answers.symptoms)) {
      const symptomCount = answers.symptoms.length;
      score -= symptomCount * 1.5;
    }
    
    // 睡眠质量
    if (answers.sleepQuality) {
      switch (answers.sleepQuality) {
        case '很好': score += 3; break;
        case '好': score += 2; break;
        case '一般': score += 1; break;
        case '差': score -= 1; break;
        case '很差': score -= 2; break;
      }
    }
    
    // 运动频率
    if (answers.exerciseFrequency) {
      switch (answers.exerciseFrequency) {
        case '每天': score += 4; break;
        case '每周3-4次': score += 3; break;
        case '每周1-2次': score += 2; break;
        case '偶尔': score += 1; break;
        case '从不': score -= 1; break;
      }
    }
    
    // 吸烟
    if (answers.smokingStatus) {
      switch (answers.smokingStatus) {
        case '从不吸烟': score += 2; break;
        case '已戒烟': score += 1; break;
        case '偶尔吸烟': score -= 1; break;
        case '每天吸烟（≤10支）': score -= 2; break;
        case '每天吸烟（>10支）': score -= 3; break;
      }
    }
    
    // 饮酒
    if (answers.drinkingStatus) {
      switch (answers.drinkingStatus) {
        case '从不饮酒': score += 1; break;
        case '已戒酒': score += 0.5; break;
        case '偶尔饮酒': score -= 0.5; break;
        case '每周饮酒（≤3次）': score -= 1; break;
        case '每周饮酒（>3次）': score -= 2; break;
        case '每天饮酒': score -= 3; break;
      }
    }
    
    return Math.max(0, Math.min(score, SECTION_MAX_SCORES.physicalHealth));
  }

  /**
   * 评分：心理健康
   */
  private scoreMentalHealth(answers: Record<string, any>): number {
    let score = SECTION_MAX_SCORES.mentalHealth;
    
    // 压力水平
    if (answers.stressLevel) {
      switch (answers.stressLevel) {
        case '无压力': score += 2; break;
        case '轻度压力': score += 1; break;
        case '中度压力': score -= 1; break;
        case '重度压力': score -= 2; break;
        case '极度压力': score -= 3; break;
      }
    }
    
    // 焦虑频率
    if (answers.anxietyFrequency) {
      switch (answers.anxietyFrequency) {
        case '从不': score += 2; break;
        case '很少': score += 1; break;
        case '有时': score -= 1; break;
        case '经常': score -= 2; break;
        case '总是': score -= 3; break;
      }
    }
    
    // 抑郁情绪
    if (answers.depressionMood) {
      switch (answers.depressionMood) {
        case '从不': score += 2; break;
        case '很少': score += 1; break;
        case '有时': score -= 1; break;
        case '经常': score -= 2; break;
        case '总是': score -= 3; break;
      }
    }
    
    // 应对策略
    if (answers.copingStrategies && Array.isArray(answers.copingStrategies)) {
      score += Math.min(answers.copingStrategies.length, 3);
    }
    
    return Math.max(0, Math.min(score, SECTION_MAX_SCORES.mentalHealth));
  }

  /**
   * 评分：社会适应
   */
  private scoreSocialAdaptation(answers: Record<string, any>): number {
    let score = SECTION_MAX_SCORES.socialAdaptation;
    
    // 社会支持
    if (answers.socialSupport) {
      switch (answers.socialSupport) {
        case '非常强': score += 3; break;
        case '强': score += 2; break;
        case '一般': score += 1; break;
        case '弱': score -= 1; break;
        case '非常弱': score -= 2; break;
      }
    }
    
    // 家庭关系
    if (answers.familyRelationship) {
      switch (answers.familyRelationship) {
        case '非常满意': score += 2; break;
        case '满意': score += 1; break;
        case '一般': score += 0; break;
        case '不满意': score -= 1; break;
        case '非常不满意': score -= 2; break;
      }
    }
    
    // 工作压力
    if (answers.workStress) {
      switch (answers.workStress) {
        case '无压力': score += 2; break;
        case '轻度压力': score += 1; break;
        case '中度压力': score -= 1; break;
        case '重度压力': score -= 2; break;
        case '极度压力': score -= 3; break;
      }
    }
    
    // 社交频率
    if (answers.socialFrequency) {
      switch (answers.socialFrequency) {
        case '非常频繁': score += 2; break;
        case '经常': score += 1; break;
        case '有时': score += 0; break;
        case '很少': score -= 1; break;
        case '从不': score -= 2; break;
      }
    }
    
    return Math.max(0, Math.min(score, SECTION_MAX_SCORES.socialAdaptation));
  }

  /**
   * 评分：健康行为
   */
  private scoreHealthBehavior(answers: Record<string, any>): number {
    let score = SECTION_MAX_SCORES.healthBehavior;
    
    // 饮食习惯
    if (answers.dietHabit) {
      switch (answers.dietHabit) {
        case '非常健康': score += 3; break;
        case '健康': score += 2; break;
        case '一般': score += 0; break;
        case '不健康': score -= 2; break;
        case '非常不健康': score -= 3; break;
      }
    }
    
    // 体检频率
    if (answers.checkupFrequency) {
      switch (answers.checkupFrequency) {
        case '每年1次': score += 2; break;
        case '每2年1次': score += 1; break;
        case '定期': score += 1; break;
        case '不定期': score -= 1; break;
        case '从未体检': score -= 2; break;
      }
    }
    
    // 用药依从性
    if (answers.medicationAdherence) {
      switch (answers.medicationAdherence) {
        case '总是遵医嘱': score += 2; break;
        case '经常遵医嘱': score += 1; break;
        case '有时遵医嘱': score += 0; break;
        case '很少遵医嘱': score -= 1; break;
        case '从不遵医嘱': score -= 2; break;
      }
    }
    
    // 健康知识
    if (answers.healthKnowledge) {
      switch (answers.healthKnowledge) {
        case '非常了解': score += 2; break;
        case '了解': score += 1; break;
        case '一般': score += 0; break;
        case '不了解': score -= 1; break;
        case '完全不了解': score -= 2; break;
      }
    }
    
    // 预防措施
    if (answers.preventiveMeasures && Array.isArray(answers.preventiveMeasures)) {
      score += Math.min(answers.preventiveMeasures.length, 3);
    }
    
    return Math.max(0, Math.min(score, SECTION_MAX_SCORES.healthBehavior));
  }

  /**
   * 评分：自我评估
   */
  private scoreSelfAssessment(answers: Record<string, any>): number {
    let score = 0;
    
    // 整体健康评分（1-10分）
    if (answers.overallHealth) {
      score += Number(answers.overallHealth) * 0.5;
    }
    
    // 健康满意度（1-5分）
    if (answers.healthSatisfaction) {
      score += Number(answers.healthSatisfaction);
    }
    
    return Math.min(score, SECTION_MAX_SCORES.selfAssessment);
  }

  /**
   * 计算总分
   */
  private calculateTotalScore(sectionScores: SectionScores): number {
    const total = 
      sectionScores.basicInfo.score +
      sectionScores.physicalHealth.score +
      sectionScores.mentalHealth.score +
      sectionScores.socialAdaptation.score +
      sectionScores.healthBehavior.score +
      sectionScores.selfAssessment.score;
    
    // 计算百分比并更新各部分百分比
    sectionScores.basicInfo.percentage = (sectionScores.basicInfo.score / sectionScores.basicInfo.max) * 100;
    sectionScores.physicalHealth.percentage = (sectionScores.physicalHealth.score / sectionScores.physicalHealth.max) * 100;
    sectionScores.mentalHealth.percentage = (sectionScores.mentalHealth.score / sectionScores.mentalHealth.max) * 100;
    sectionScores.socialAdaptation.percentage = (sectionScores.socialAdaptation.score / sectionScores.socialAdaptation.max) * 100;
    sectionScores.healthBehavior.percentage = (sectionScores.healthBehavior.score / sectionScores.healthBehavior.max) * 100;
    sectionScores.selfAssessment.percentage = (sectionScores.selfAssessment.score / sectionScores.selfAssessment.max) * 100;
    
    return Math.round(total);
  }

  /**
   * 确定健康等级
   */
  private determineHealthLevel(totalScore: number): HealthAssessmentLevel {
    if (totalScore >= HEALTH_LEVEL_THRESHOLDS.EXCELLENT) {
      return HealthAssessmentLevel.EXCELLENT;
    } else if (totalScore >= HEALTH_LEVEL_THRESHOLDS.GOOD) {
      return HealthAssessmentLevel.GOOD;
    } else if (totalScore >= HEALTH_LEVEL_THRESHOLDS.MODERATE) {
      return HealthAssessmentLevel.MODERATE;
    } else if (totalScore >= HEALTH_LEVEL_THRESHOLDS.POOR) {
      return HealthAssessmentLevel.POOR;
    } else {
      return HealthAssessmentLevel.DANGER;
    }
  }

  /**
   * 计算BMI
   */
  private calculateBMI(questionnaireData: AdultHealthQuestionnaire): { value: number; category: BMICategory } {
    const answers = this.getSectionAnswers(questionnaireData, 'basic-info');
    const height = answers.height;
    const weight = answers.weight;
    
    if (!height || !weight || height <= 0 || weight <= 0) {
      return { value: 0, category: BMICategory.NORMAL };
    }
    
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    
    let category: BMICategory;
    if (bmiValue < 18.5) {
      category = BMICategory.UNDERWEIGHT;
    } else if (bmiValue < 24) {
      category = BMICategory.NORMAL;
    } else if (bmiValue < 28) {
      category = BMICategory.OVERWEIGHT;
    } else {
      category = BMICategory.OBESE;
    }
    
    return { value: parseFloat(bmiValue.toFixed(1)), category };
  }

  /**
   * 生成个性化建议
   */
  private generateRecommendations(sectionScores: SectionScores, totalScore: number): string[] {
    const recommendations: string[] = [];
    
    // 根据各部分得分生成建议
    if (sectionScores.physicalHealth.percentage < 60) {
      recommendations.push('建议增加规律运动，每周至少150分钟中等强度有氧运动');
      recommendations.push('注意饮食均衡，减少高盐、高脂、高糖食物摄入');
    }
    
    if (sectionScores.mentalHealth.percentage < 60) {
      recommendations.push('学习压力管理技巧，如深呼吸、冥想等放松方法');
      recommendations.push('保持规律作息，确保充足睡眠');
    }
    
    if (sectionScores.socialAdaptation.percentage < 60) {
      recommendations.push('主动参与社交活动，维持良好的人际关系');
      recommendations.push('与家人朋友保持经常性沟通，寻求社会支持');
    }
    
    if (sectionScores.healthBehavior.percentage < 60) {
      recommendations.push('养成定期体检习惯，关注自身健康指标');
      recommendations.push('戒烟限酒，培养健康生活方式');
    }
    
    // 根据总分添加总体建议
    if (totalScore < 60) {
      recommendations.push('建议咨询专业医生，进行全面的健康评估');
    }
    
    return recommendations.slice(0, 5); // 最多返回5条建议
  }
}