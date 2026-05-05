// src/shared/services/aiMedicalService.ts

/**
 * AI医疗问答服务 - 调用DeepSeek API
 * 免费额度：500万tokens/月
 */

export interface AIMedicalAnswer {
  summary: string;
  drugs: Array<{
    name: string;
    category: string;
    indications: string;
    contraindications: string;
    usage: string;
    sideEffects: string;
  }>;
  lifestyle: string[];
  whenToSeeDoctor: string;
}

class AIMedicalService {
  
  private apiKey = 'sk-4f144818175a4d55957010e4c1fcd57b';
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  /**
   * 获取用药指导
   */
  async getDrugAdvice(question: string, patientInfo?: any): Promise<AIMedicalAnswer> {
    console.log(`🤖 AI用药指导: ${question}`);
    
    // 构建患者信息文本
    let patientInfoText = '';
    if (patientInfo) {
      const info = [];
      if (patientInfo.age) info.push(`年龄${patientInfo.age}岁`);
      if (patientInfo.isChild) info.push('儿童');
      if (patientInfo.isElderly) info.push('老年人');
      if (patientInfo.conditions?.length) info.push(`基础病：${patientInfo.conditions.join('、')}`);
      if (patientInfo.allergies?.length) info.push(`过敏史：${patientInfo.allergies.join('、')}`);
      if (info.length) {
        patientInfoText = `\n患者信息：${info.join('、')}`;
      }
    }
    
    // 专业提示词
    const prompt = `请提供关于"${question}"的专业用药指导。${patientInfoText}

请按以下格式回答，结构清晰，专业准确：

一、核心分类与特点
列出主要药物类别，每类包括：代表药物、作用机制、镇痛强度、核心优势、主要风险

二、各类药物的详细比较
每类药物的适用场景、具体药物特点、注意事项

三、特殊人群用药建议
老年人、儿童、孕妇/哺乳期妇女、慢性病患者

四、安全用药提示
阶梯用药原则、药物相互作用、不良反应监测

五、总结：如何正确选择
评估疼痛程度、明确病因、考虑个体情况、遵循医嘱

请用中文回答，内容专业、准确、全面。`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的药学顾问。请根据用户的问题，提供准确、专业、全面的用药指导。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })
      });
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // 返回完整内容
      return {
        summary: content,
        drugs: [],
        lifestyle: [],
        whenToSeeDoctor: '症状持续或加重请及时就医'
      };
      
    } catch (error) {
      console.error('AI调用失败:', error);
      return this.getFallbackAdvice(question);
    }
  }

  private getFallbackAdvice(question: string): AIMedicalAnswer {
    return {
      summary: `关于"${question}"的问题，建议咨询医生或药师。`,
      drugs: [],
      lifestyle: ['保持健康生活方式', '规律作息', '均衡饮食'],
      whenToSeeDoctor: '症状持续或加重请及时就医'
    };
  }
}

export const aiMedicalService = new AIMedicalService();