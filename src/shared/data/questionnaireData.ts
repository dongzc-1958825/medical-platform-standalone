import { QuestionnaireSection } from '../types/health';

export const healthQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'basic_info',
    title: '基本信息',
    description: '请填写您的基本健康信息',
    questions: [
      {
        id: 'age',
        type: 'input',
        question: '您的年龄',
        required: true,
        category: 'physical'
      },
      {
        id: 'gender',
        type: 'single',
        question: '您的性别',
        options: [
          { value: 'male', label: '男性', score: 0 },
          { value: 'female', label: '女性', score: 0 }
        ],
        required: true,
        category: 'physical'
      },
      {
        id: 'height',
        type: 'input',
        question: '身高 (cm)',
        required: true,
        category: 'physical'
      },
      {
        id: 'weight',
        type: 'input',
        question: '体重 (kg)',
        required: true,
        category: 'physical'
      }
    ]
  },
  {
    id: 'lifestyle',
    title: '生活习惯',
    description: '评估您的生活习惯对健康的影响',
    questions: [
      {
        id: 'smoking',
        type: 'single',
        question: '您是否吸烟？',
        options: [
          { value: 'never', label: '从不吸烟', score: 10 },
          { value: 'quit', label: '已戒烟', score: 8 },
          { value: 'occasional', label: '偶尔吸烟', score: 5 },
          { value: 'regular', label: '经常吸烟', score: 2 }
        ],
        required: true,
        category: 'lifestyle'
      },
      {
        id: 'alcohol',
        type: 'single',
        question: '饮酒频率',
        options: [
          { value: 'never', label: '不饮酒', score: 10 },
          { value: 'rarely', label: '很少饮酒', score: 8 },
          { value: 'moderate', label: '适度饮酒', score: 6 },
          { value: 'frequent', label: '经常饮酒', score: 3 },
          { value: 'heavy', label: '大量饮酒', score: 1 }
        ],
        required: true,
        category: 'lifestyle'
      },
      {
        id: 'exercise_frequency',
        type: 'single',
        question: '每周运动频率',
        options: [
          { value: 0, label: '不运动', score: 2 },
          { value: 1, label: '1-2次', score: 5 },
          { value: 3, label: '3-4次', score: 8 },
          { value: 5, label: '5次或以上', score: 10 }
        ],
        required: true,
        category: 'lifestyle'
      },
      {
        id: 'sleep_hours',
        type: 'single',
        question: '平均每晚睡眠时间',
        options: [
          { value: '<5', label: '少于5小时', score: 2 },
          { value: '5-6', label: '5-6小时', score: 5 },
          { value: '7-8', label: '7-8小时', score: 10 },
          { value: '>8', label: '超过8小时', score: 6 }
        ],
        required: true,
        category: 'lifestyle'
      },
      {
        id: 'diet_habit',
        type: 'multiple',
        question: '您的饮食习惯（可多选）',
        options: [
          { value: 'balanced', label: '均衡饮食', score: 3 },
          { value: 'vegetables', label: '经常吃蔬菜水果', score: 3 },
          { value: 'high_salt', label: '高盐饮食', score: -2 },
          { value: 'high_sugar', label: '高糖饮食', score: -2 },
          { value: 'fast_food', label: '经常吃快餐', score: -2 },
          { value: 'regular_meals', label: '规律三餐', score: 2 }
        ],
        required: true,
        category: 'lifestyle'
      }
    ]
  },
  {
    id: 'physical_health',
    title: '身体状况',
    description: '评估您当前的身体状况',
    questions: [
      {
        id: 'chronic_disease',
        type: 'multiple',
        question: '是否患有以下慢性疾病（可多选）',
        options: [
          { value: 'none', label: '无', score: 10 },
          { value: 'hypertension', label: '高血压', score: -3 },
          { value: 'diabetes', label: '糖尿病', score: -3 },
          { value: 'heart_disease', label: '心脏病', score: -4 },
          { value: 'asthma', label: '哮喘', score: -2 },
          { value: 'other', label: '其他慢性病', score: -2 }
        ],
        required: true,
        category: 'medical'
      },
      {
        id: 'symptoms',
        type: 'multiple',
        question: '近期是否有以下症状（可多选）',
        options: [
          { value: 'none', label: '无不适症状', score: 10 },
          { value: 'headache', label: '经常头痛', score: -2 },
          { value: 'fatigue', label: '持续疲劳', score: -2 },
          { value: 'sleep_problem', label: '睡眠障碍', score: -2 },
          { value: 'digestive', label: '消化问题', score: -2 },
          { value: 'pain', label: '持续性疼痛', score: -3 }
        ],
        required: true,
        category: 'medical'
      },
      {
        id: 'blood_pressure',
        type: 'single',
        question: '最近测量的血压情况',
        options: [
          { value: 'normal', label: '正常 (<120/80)', score: 10 },
          { value: 'elevated', label: '偏高 (120-129/<80)', score: 6 },
          { value: 'high1', label: '高血压1级 (130-139/80-89)', score: 4 },
          { value: 'high2', label: '高血压2级 (≥140/≥90)', score: 2 }
        ],
        required: true,
        category: 'medical'
      }
    ]
  },
  {
    id: 'mental_health',
    title: '心理状况',
    description: '评估您的心理健康状态',
    questions: [
      {
        id: 'stress_level',
        type: 'scale',
        question: '近期压力水平 (1-10分，1为无压力，10为极大压力)',
        scale: {
          min: 1,
          max: 10,
          step: 1,
          labels: {
            1: '无压力',
            5: '中等压力',
            10: '极大压力'
          },
          scoreMapping: {
            1: 10, 2: 9, 3: 8, 4: 7, 5: 6,
            6: 5, 7: 4, 8: 3, 9: 2, 10: 1
          }
        },
        required: true,
        category: 'mental'
      },
      {
        id: 'mood',
        type: 'single',
        question: '近期情绪状态',
        options: [
          { value: 'very_good', label: '非常好', score: 10 },
          { value: 'good', label: '良好', score: 8 },
          { value: 'normal', label: '一般', score: 6 },
          { value: 'low', label: '较低落', score: 3 },
          { value: 'depressed', label: '抑郁', score: 1 }
        ],
        required: true,
        category: 'mental'
      },
      {
        id: 'work_life_balance',
        type: 'single',
        question: '工作与生活平衡情况',
        options: [
          { value: 'excellent', label: '非常平衡', score: 10 },
          { value: 'good', label: '较好', score: 8 },
          { value: 'fair', label: '一般', score: 5 },
          { value: 'poor', label: '较差', score: 3 },
          { value: 'terrible', label: '严重失衡', score: 1 }
        ],
        required: true,
        category: 'mental'
      }
    ]
  }
];