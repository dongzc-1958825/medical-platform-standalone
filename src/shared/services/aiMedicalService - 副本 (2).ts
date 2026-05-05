// src/shared/services/aiMedicalService.ts

/**
 * AI医疗问答服务 - 调用DeepSeek API
 * 返回结构化JSON数据，用于卡片展示
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
   * AI用药指导 - 返回结构化JSON（用于卡片展示）
   * 根据症状和患者信息提供个性化用药推荐
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
    
    // 要求AI返回JSON格式
    const prompt = `请提供关于"${question}"的专业用药指导。${patientInfoText}

请严格按照以下JSON格式返回，不要输出任何其他内容：

{
  "summary": "病情简介和治疗原则（1-2句话）",
  "drugs": [
    {
      "name": "药品名称",
      "category": "药物类别",
      "indications": "适应症",
      "contraindications": "禁忌症",
      "usage": "用法用量",
      "sideEffects": "常见副作用"
    }
  ],
  "lifestyle": ["生活方式建议1", "生活方式建议2", "生活方式建议3"],
  "whenToSeeDoctor": "何时需要就医"
}`;

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
              content: '你是一个专业的药学顾问。请始终返回JSON格式，不要输出任何其他文字。'
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
      
      // 解析JSON
      let result;
      try {
        result = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析AI返回');
        }
      }
      
      return {
        summary: result.summary || `关于${question}的用药指导`,
        drugs: result.drugs || [],
        lifestyle: result.lifestyle || [],
        whenToSeeDoctor: result.whenToSeeDoctor || '症状持续请及时就医'
      };
      
    } catch (error) {
      console.error('AI调用失败:', error);
      return this.getFallbackAdvice(question);
    }
  }

  /**
   * AI药品问答 - 返回专业详实的Markdown格式
   * 用于宽泛的药品问题：药物对比、特殊人群用药、癌症晚期止痛等
   * 返回像临床指南一样详细全面的回答
   */
  async askDrugQuestion(question: string): Promise<string> {
    console.log(`🤖 AI药品问答: ${question}`);

    const systemPrompt = `你是一位资深临床药师，擅长肿瘤疼痛、慢性病用药等复杂药品咨询。你的回答必须专业、详实、结构化，像临床指南一样全面。

【核心要求】
1. 专业准确：基于最新临床指南和循证医学证据（如2025版指南）
2. 结构清晰：使用Markdown格式，包含一、二、三、四...章节
3. 内容详实：涵盖药物分类、作用机制、用法用量、不良反应管理、医保报销、注意事项
4. 全面系统：根据问题类型，包含核心药物、使用原则、不良反应处理、误区澄清等
5. 实用性强：给出具体药物名称、用法、剂量参考、预防措施

【回答格式】
- 使用 **一、核心药物** 这样的加粗标题作为章节
- 使用表格进行药物对比（| 药物 | 特点 | 用法 | 注意事项 |）
- 使用 - 或 1. 列表说明要点
- 重要内容用 **加粗** 强调

【必须包含的内容结构】
1. 开头总结：直接回应用户问题
2. 核心药物分类及特点（用表格）
3. 使用原则/选择策略
4. 不良反应管理与预防
5. 注意事项/误区澄清
6. 结尾安全提醒

【风格】
专业详实，像给患者看的临床指南，让患者能全面了解并正确使用药物。`;

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          temperature: 0.3,
          max_tokens: 8000
        })
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content;
      console.log('🤖 AI药品问答完成，回答长度:', answer.length);
      return answer;
      
    } catch (error) {
      console.error('AI药品问答失败:', error);
      return `关于"${question}"的问题，建议咨询医生或药师。`;
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