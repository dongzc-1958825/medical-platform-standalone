// src/shared/data/drugDatabase.ts
// 数据来源：国家药监局公开数据 + 中国药典免费版

export const drugDatabase = [
  // 痛风相关药品
  {
    id: 'drug-001',
    name: '秋水仙碱',
    category: '西药',
    indications: ['痛风急性发作', '痛风性关节炎'],
    contraindications: ['严重肾功能不全', '孕妇', '哺乳期妇女'],
    sideEffects: ['恶心', '呕吐', '腹泻', '腹痛'],
    dosage: {
      adult: '急性期：首剂1.0mg，以后0.5mg/次，每2小时1次',
      max: '24小时内不超过6mg'
    },
    price: '约15-30元/盒',
    manufacturer: '多家生产',
    description: '痛风急性发作的特效药，越早使用效果越好'
  },
  {
    id: 'drug-002',
    name: '非布司他',
    category: '西药',
    indications: ['高尿酸血症', '痛风慢性期'],
    contraindications: ['严重肝损伤', '孕妇'],
    sideEffects: ['肝功能异常', '皮疹', '关节痛'],
    dosage: {
      adult: '起始剂量40mg/日，2周后可根据情况调整',
      max: '不超过80mg/日'
    },
    price: '约50-100元/盒',
    manufacturer: '多家生产',
    description: '降低尿酸的常用药，需长期服用'
  },
  {
    id: 'drug-003',
    name: '苯溴马隆',
    category: '西药',
    indications: ['高尿酸血症', '痛风慢性期'],
    contraindications: ['严重肾功能不全', '尿路结石'],
    sideEffects: ['肝功能异常', '胃肠道反应'],
    dosage: {
      adult: '起始剂量25mg/日，可逐渐增至100mg/日'
    },
    price: '约30-60元/盒',
    manufacturer: '多家生产',
    description: '促进尿酸排泄的药物，需多饮水'
  },
  {
    id: 'drug-004',
    name: '别嘌醇',
    category: '西药',
    indications: ['高尿酸血症', '痛风慢性期'],
    contraindications: ['严重过敏史'],
    sideEffects: ['皮疹', '肝功能异常', '胃肠道反应'],
    dosage: {
      adult: '起始剂量100mg/日，可逐渐调整'
    },
    price: '约20-40元/盒',
    manufacturer: '多家生产',
    description: '经典降尿酸药物，价格便宜'
  },
  
  // 感冒相关药品
  {
    id: 'drug-005',
    name: '布洛芬',
    category: '西药',
    indications: ['发热', '头痛', '关节痛', '痛经'],
    contraindications: ['胃溃疡', '严重肝肾功能不全', '孕妇晚期'],
    sideEffects: ['胃肠道不适', '恶心', '头晕'],
    dosage: {
      adult: '200-400mg/次，每日3-4次',
      max: '不超过2400mg/日'
    },
    price: '约10-25元/盒',
    manufacturer: '多家生产',
    description: '常用的解热镇痛药'
  },
  {
    id: 'drug-006',
    name: '对乙酰氨基酚',
    category: '西药',
    indications: ['发热', '头痛', '轻中度疼痛'],
    contraindications: ['严重肝损伤'],
    sideEffects: ['肝功能异常（长期大剂量）'],
    dosage: {
      adult: '500mg/次，每日3-4次',
      max: '不超过2000mg/日'
    },
    price: '约5-15元/盒',
    manufacturer: '多家生产',
    description: '安全性较高的退烧药'
  },
  
  // 中成药
  {
    id: 'drug-007',
    name: '痛风舒胶囊',
    category: '中成药',
    indications: ['湿热瘀阻所致的痛风'],
    contraindications: ['孕妇', '过敏体质'],
    sideEffects: ['尚不明确'],
    dosage: {
      adult: '2-4粒/次，每日3次'
    },
    price: '约30-60元/盒',
    manufacturer: '多家药厂',
    description: '清热利湿，活血通络'
  },
  {
    id: 'drug-008',
    name: '金匮肾气丸',
    category: '中成药',
    indications: ['肾虚水肿', '腰膝酸软'],
    contraindications: ['孕妇', '感冒发热'],
    sideEffects: ['尚不明确'],
    dosage: {
      adult: '6g/次，每日2次'
    },
    price: '约15-30元/瓶',
    manufacturer: '同仁堂等',
    description: '温补肾阳，化气行水'
  },
  {
    id: 'drug-009',
    name: '六味地黄丸',
    category: '中成药',
    indications: ['肾阴虚', '头晕耳鸣', '腰膝酸软'],
    contraindications: ['感冒发热'],
    sideEffects: ['尚不明确'],
    dosage: {
      adult: '8丸/次，每日3次'
    },
    price: '约10-25元/瓶',
    manufacturer: '多家生产',
    description: '滋阴补肾的经典方'
  },
  {
    id: 'drug-010',
    name: '小柴胡颗粒',
    category: '中成药',
    indications: ['感冒', '发热', '恶心', '食欲不振'],
    contraindications: ['过敏体质'],
    sideEffects: ['尚不明确'],
    dosage: {
      adult: '1-2袋/次，每日3次'
    },
    price: '约8-18元/盒',
    manufacturer: '多家生产',
    description: '解表散热，疏肝和胃'
  }
];