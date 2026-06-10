export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'summary' | 'question' | 'explain' | 'practice' | 'reflection' | 'quiz';
  description: string;
  template: string;
  variables: TemplateVariable[];
  examples: string[];
  performance: {
    usageCount: number;
    avgRating: number;
  };
}

export const promptCategories: Record<string, { label: string; icon: string; color: string }> = {
  summary: { label: '总结', icon: '📝', color: '#3D6B9E' },
  question: { label: '提问', icon: '❓', color: '#9B8AFB' },
  explain: { label: '解释', icon: '💡', color: '#2E7D58' },
  practice: { label: '练习', icon: '🎯', color: '#B56C00' },
  reflection: { label: '反思', icon: '💭', color: '#7C3AED' },
  quiz: { label: '测验', icon: '📋', color: '#0891B2' }
};

export const samplePromptTemplates: PromptTemplate[] = [
  {
    id: 'pt1',
    name: '智能总结',
    category: 'summary',
    description: '将长文档内容提炼为简洁要点',
    template: '请用3-5句话总结以下内容的核心要点：\n\n{{content}}\n\n要求：\n1. 突出关键信息\n2. 保持逻辑清晰\n3. 语言简洁明了',
    variables: [
      { name: 'content', description: '需要总结的内容' }
    ],
    examples: ['总结一篇关于LLM的技术文章', '提炼会议纪要要点'],
    performance: { usageCount: 156, avgRating: 4.8 }
  },
  {
    id: 'pt2',
    name: '深度提问',
    category: 'question',
    description: '基于内容生成高质量思考问题',
    template: '基于以下学习内容，生成5个深入思考的问题：\n\n{{content}}\n\n问题类型要求：\n- 2个概念理解类问题\n- 2个应用场景类问题\n- 1个批判性思考问题',
    variables: [
      { name: 'content', description: '学习内容' }
    ],
    examples: ['为RAG技术文档生成思考问题', '为编程教程设计讨论问题'],
    performance: { usageCount: 89, avgRating: 4.6 }
  },
  {
    id: 'pt3',
    name: '通俗解释',
    category: 'explain',
    description: '将复杂概念用简单语言解释',
    template: '请用通俗易懂的方式解释{{concept}}：\n\n要求：\n1. 用日常生活中的例子类比\n2. 避免使用专业术语\n3. 适合初学者理解\n\n可以从以下角度解释：\n- 它是什么\n- 它能解决什么问题\n- 实际应用场景',
    variables: [
      { name: 'concept', description: '要解释的概念', defaultValue: '大语言模型' }
    ],
    examples: ['解释什么是Transformer', '解释RAG工作原理'],
    performance: { usageCount: 234, avgRating: 4.9 }
  },
  {
    id: 'pt4',
    name: '代码练习',
    category: 'practice',
    description: '根据学习内容生成编程练习题',
    template: '请根据以下概念{{concept}}，设计3个编程练习题：\n\n难度分布：\n- 基础题：检验基本概念理解\n- 进阶题：综合应用能力\n- 挑战题：创造性应用\n\n每个题目要求：\n1. 清晰的题目描述\n2. 输入输出示例\n3. 预期的解题思路提示',
    variables: [
      { name: 'concept', description: '编程概念', defaultValue: 'Python函数' }
    ],
    examples: ['为机器学习概念设计练习题', '为数据结构知识设计题目'],
    performance: { usageCount: 67, avgRating: 4.7 }
  },
  {
    id: 'pt5',
    name: '学习反思',
    category: 'reflection',
    description: '引导深度反思学习内容',
    template: '请帮助我反思今天的学习内容：\n\n学习内容：{{content}}\n\n请回答以下问题：\n1. 今天学到的最重要的知识点是什么？\n2. 哪些内容理解起来比较困难？\n3. 如何将学到的知识应用到实际中？\n4. 下一步的学习计划是什么？\n5. 有哪些问题需要进一步研究？',
    variables: [
      { name: 'content', description: '今日学习内容' }
    ],
    examples: ['反思AI学习收获', '总结编程学习心得'],
    performance: { usageCount: 45, avgRating: 4.5 }
  },
  {
    id: 'pt6',
    name: '知识测验',
    category: 'quiz',
    description: '根据学习内容生成测验题目',
    template: '请根据以下学习内容生成一套测验题：\n\n学习内容：{{content}}\n\n题目要求：\n- 5道单选题\n- 3道多选题\n- 2道判断题\n- 1道简答题\n\n请提供每道题的正确答案和解析。',
    variables: [
      { name: 'content', description: '学习内容' }
    ],
    examples: ['为LLM知识生成测验', '为数据库知识设计考题'],
    performance: { usageCount: 78, avgRating: 4.6 }
  }
];

export function renderPrompt(template: PromptTemplate, variables: Record<string, string>): string {
  let result = template.template;
  template.variables.forEach(variable => {
    const value = variables[variable.name] || variable.defaultValue || '';
    result = result.replace(new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g'), value);
  });
  return result;
}

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  if (category === 'all') return samplePromptTemplates;
  return samplePromptTemplates.filter(t => t.category === category);
}