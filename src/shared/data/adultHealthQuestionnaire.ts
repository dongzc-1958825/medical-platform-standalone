/**
 * 成人综合健康问卷数据结构
 * ⚠️ 重要：这是纯数据文件，严禁包含任何 JSX/React 组件代码！
 * 所有 UI 组件代码必须在 AdultHealthQuestionnairePage.tsx 中
 */

import { 
  Gender, 
  SleepQuality, 
  ExerciseFrequency, 
  SmokingStatus, 
  DrinkingStatus,
  StressLevel,
  AnxietyFrequency,
  DepressionMood,
  SocialSupportLevel,
  FamilyRelationshipSatisfaction,
  WorkStress,
  SocialFrequency,
  RelationshipSatisfaction,
  DietHabit,
  CheckupFrequency,
  MedicationAdherence,
  HealthKnowledgeLevel,
  PreventiveMeasure,
  HealthConcern
} from '../types/health';

// 纯数据对象 - 没有任何函数、组件、JSX
export const adultHealthQuestionnaire = {
  id: 'adult-health-questionnaire',
  title: '成人综合健康问卷',
  description: '基于WHO健康标准，全面评估您的身心健康状况',
  version: '1.0.0',
  sections: [
    {
      id: 'basic-info',
      title: '基本信息',
      description: '让我们了解您的基本情况',
      order: 1,
      questions: [
        {
          id: 'name',
          text: '您的姓名',
          type: 'text',
          required: true,
          validation: { min: 2, max: 20 }
        },
        {
          id: 'age',
          text: '您的年龄',
          type: 'number',
          required: true,
          validation: { min: 18, max: 120 }
        },
        {
          id: 'gender',
          text: '您的性别',
          type: 'radio',
          required: true,
          options: [Gender.MALE, Gender.FEMALE, Gender.OTHER]
        },
        {
          id: 'height',
          text: '身高',
          type: 'number',
          required: true,
          validation: { min: 100, max: 250, step: 0.1 },
          description: '单位：厘米'
        },
        {
          id: 'weight',
          text: '体重',
          type: 'number',
          required: true,
          validation: { min: 30, max: 300, step: 0.1 },
          description: '单位：公斤'
        },
        {
          id: 'waistline',
          text: '腰围',
          type: 'number',
          required: false,
          validation: { min: 40, max: 200, step: 0.1 },
          description: '单位：厘米，可选填'
        }
      ]
    },
    {
      id: 'physical-health',
      title: '身体健康',
      description: '评估您的身体状况和生活方式',
      order: 2,
      questions: [
        {
          id: 'chronicDiseases',
          text: '您是否患有以下慢性病？（可多选）',
          type: 'checkbox',
          required: true,
          options: [
            '高血压', '糖尿病', '冠心病', '脑卒中', 
            '慢性阻塞性肺疾病', '哮喘', '关节炎', '癌症', 
            '抑郁症', '其他', '无慢性病'
          ]
        },
        {
          id: 'symptoms',
          text: '最近1个月，您是否有以下症状？（可多选）',
          type: 'checkbox',
          required: true,
          options: [
            '头痛', '头晕', '乏力', '失眠', '心悸', '胸痛',
            '腹痛', '恶心', '背痛', '关节痛', '肌肉酸痛',
            '咳嗽', '气短', '无不适症状'
          ]
        },
        {
          id: 'sleepQuality',
          text: '您的睡眠质量如何？',
          type: 'radio',
          required: true,
          options: [
            SleepQuality.VERY_GOOD, SleepQuality.GOOD, SleepQuality.FAIR,
            SleepQuality.POOR, SleepQuality.VERY_POOR
          ]
        },
        {
          id: 'exerciseFrequency',
          text: '您的运动频率是？',
          type: 'radio',
          required: true,
          options: [
            ExerciseFrequency.DAILY, ExerciseFrequency.WEEKLY_3_4,
            ExerciseFrequency.WEEKLY_1_2, ExerciseFrequency.OCCASIONALLY,
            ExerciseFrequency.NEVER
          ]
        },
        {
          id: 'smokingStatus',
          text: '您的吸烟情况是？',
          type: 'radio',
          required: true,
          options: [
            SmokingStatus.NEVER, SmokingStatus.QUIT, SmokingStatus.OCCASIONAL,
            SmokingStatus.DAILY_LIGHT, SmokingStatus.DAILY_HEAVY
          ]
        },
        {
          id: 'drinkingStatus',
          text: '您的饮酒情况是？',
          type: 'radio',
          required: true,
          options: [
            DrinkingStatus.NEVER, DrinkingStatus.QUIT, DrinkingStatus.OCCASIONAL,
            DrinkingStatus.WEEKLY_LIGHT, DrinkingStatus.WEEKLY_HEAVY,
            DrinkingStatus.DAILY
          ]
        }
      ]
    },
    {
      id: 'mental-health',
      title: '心理健康',
      description: '评估您的心理状态和情绪健康',
      order: 3,
      questions: [
        {
          id: 'stressLevel',
          text: '您最近2周感受到的压力程度？',
          type: 'radio',
          required: true,
          options: [
            StressLevel.NONE, StressLevel.MILD, StressLevel.MODERATE,
            StressLevel.SEVERE, StressLevel.EXTREME
          ]
        },
        {
          id: 'anxietyFrequency',
          text: '您最近2周感到焦虑或紧张的频率？',
          type: 'radio',
          required: true,
          options: [
            AnxietyFrequency.NEVER, AnxietyFrequency.RARELY,
            AnxietyFrequency.SOMETIMES, AnxietyFrequency.OFTEN,
            AnxietyFrequency.ALWAYS
          ]
        },
        {
          id: 'depressionMood',
          text: '您最近2周感到情绪低落或绝望的频率？',
          type: 'radio',
          required: true,
          options: [
            DepressionMood.NEVER, DepressionMood.RARELY,
            DepressionMood.SOMETIMES, DepressionMood.OFTEN,
            DepressionMood.ALWAYS
          ]
        },
        {
          id: 'copingStrategies',
          text: '您通常如何应对压力？（可多选）',
          type: 'checkbox',
          required: true,
          options: [
            '运动锻炼', '与亲友倾诉', '听音乐/看电影', '阅读',
            '冥想/放松', '寻求专业帮助', '吸烟/饮酒', '暴饮暴食',
            '回避问题', '其他'
          ]
        },
        {
          id: 'mentalHealthTreatment',
          text: '您是否正在接受心理治疗或服用相关药物？',
          type: 'radio',
          required: true,
          options: ['是', '否']
        }
      ]
    },
    {
      id: 'social-adaptation',
      title: '社会适应',
      description: '评估您的社会支持系统和适应能力',
      order: 4,
      questions: [
        {
          id: 'socialSupport',
          text: '您获得的社会支持程度？',
          type: 'radio',
          required: true,
          options: [
            SocialSupportLevel.VERY_STRONG, SocialSupportLevel.STRONG,
            SocialSupportLevel.MODERATE, SocialSupportLevel.WEAK,
            SocialSupportLevel.VERY_WEAK
          ]
        },
        {
          id: 'familyRelationship',
          text: '您对家庭关系的满意度？',
          type: 'radio',
          required: true,
          options: [
            FamilyRelationshipSatisfaction.VERY_SATISFIED,
            FamilyRelationshipSatisfaction.SATISFIED,
            FamilyRelationshipSatisfaction.NEUTRAL,
            FamilyRelationshipSatisfaction.DISSATISFIED,
            FamilyRelationshipSatisfaction.VERY_DISSATISFIED
          ]
        },
        {
          id: 'workStress',
          text: '您的工作/学习压力程度？',
          type: 'radio',
          required: true,
          options: [
            WorkStress.NONE, WorkStress.MILD, WorkStress.MODERATE,
            WorkStress.SEVERE, WorkStress.EXTREME
          ]
        },
        {
          id: 'socialFrequency',
          text: '您参与社交活动的频率？',
          type: 'radio',
          required: true,
          options: [
            SocialFrequency.VERY_OFTEN, SocialFrequency.OFTEN,
            SocialFrequency.SOMETIMES, SocialFrequency.RARELY,
            SocialFrequency.NEVER
          ]
        },
        {
          id: 'relationshipSatisfaction',
          text: '您对人际关系的满意度？',
          type: 'radio',
          required: true,
          options: [
            RelationshipSatisfaction.VERY_SATISFIED,
            RelationshipSatisfaction.SATISFIED,
            RelationshipSatisfaction.NEUTRAL,
            RelationshipSatisfaction.DISSATISFIED,
            RelationshipSatisfaction.VERY_DISSATISFIED
          ]
        }
      ]
    },
    {
      id: 'health-behavior',
      title: '健康行为与意识',
      description: '评估您的健康素养和行为习惯',
      order: 5,
      questions: [
        {
          id: 'dietHabit',
          text: '您的饮食习惯如何？',
          type: 'radio',
          required: true,
          options: [
            DietHabit.VERY_HEALTHY, DietHabit.HEALTHY, DietHabit.FAIR,
            DietHabit.UNHEALTHY, DietHabit.VERY_UNHEALTHY
          ]
        },
        {
          id: 'checkupFrequency',
          text: '您进行健康体检的频率？',
          type: 'radio',
          required: true,
          options: [
            CheckupFrequency.YEARLY, CheckupFrequency.BIYEARLY,
            CheckupFrequency.REGULAR, CheckupFrequency.IRREGULAR,
            CheckupFrequency.NEVER
          ]
        },
        {
          id: 'medicationAdherence',
          text: '您遵从医嘱用药的情况？',
          type: 'radio',
          required: true,
          options: [
            MedicationAdherence.ALWAYS, MedicationAdherence.OFTEN,
            MedicationAdherence.SOMETIMES, MedicationAdherence.RARELY,
            MedicationAdherence.NEVER
          ]
        },
        {
          id: 'healthKnowledge',
          text: '您对健康知识的了解程度？',
          type: 'radio',
          required: true,
          options: [
            HealthKnowledgeLevel.VERY_GOOD, HealthKnowledgeLevel.GOOD,
            HealthKnowledgeLevel.FAIR, HealthKnowledgeLevel.POOR,
            HealthKnowledgeLevel.VERY_POOR
          ]
        },
        {
          id: 'preventiveMeasures',
          text: '您采取了哪些预防保健措施？（可多选）',
          type: 'checkbox',
          required: true,
          options: [
            PreventiveMeasure.REGULAR_EXERCISE,
            PreventiveMeasure.BALANCED_DIET,
            PreventiveMeasure.ADEQUATE_SLEEP,
            PreventiveMeasure.STRESS_MANAGEMENT,
            PreventiveMeasure.SMOKING_CESSATION,
            PreventiveMeasure.ALCOHOL_LIMITATION,
            PreventiveMeasure.REGULAR_CHECKUP,
            PreventiveMeasure.VACCINATION,
            PreventiveMeasure.WEIGHT_CONTROL,
            PreventiveMeasure.BLOOD_PRESSURE_MONITOR,
            PreventiveMeasure.BLOOD_SUGAR_MONITOR,
            PreventiveMeasure.OTHER
          ]
        }
      ]
    },
    {
      id: 'self-assessment',
      title: '自我健康评估',
      description: '您对自身健康状况的主观评价',
      order: 6,
      questions: [
        {
          id: 'overallHealth',
          text: '您如何评价自己的整体健康状况？',
          type: 'scale',
          required: true,
          options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          description: '1分=非常差，10分=非常好'
        },
        {
          id: 'healthSatisfaction',
          text: '您对自己健康状况的满意度？',
          type: 'scale',
          required: true,
          options: ['1', '2', '3', '4', '5'],
          description: '1分=非常不满意，5分=非常满意'
        },
        {
          id: 'healthConcerns',
          text: '您最担心的健康问题是？（可多选）',
          type: 'checkbox',
          required: true,
          options: [
            HealthConcern.CARDIOVASCULAR,
            HealthConcern.DIABETES,
            HealthConcern.CANCER,
            HealthConcern.RESPIRATORY,
            HealthConcern.MENTAL_HEALTH,
            HealthConcern.AGING,
            HealthConcern.WEIGHT,
            HealthConcern.NONE,
            HealthConcern.OTHER
          ]
        }
      ]
    }
  ]
};

// 同时提供默认导出和命名导出
export default adultHealthQuestionnaire;