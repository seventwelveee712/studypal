import axios from 'axios';
import { DEEPSEEK_API_KEY, API_PROVIDER, API_BASE_URLS } from './env';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(messages: Message[], context?: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    return '请先配置 API 密钥';
  }

  const systemPrompt = context 
    ? `你是一个智能学习助手。用户提供了一些参考文档，请优先根据这些文档内容回答问题。\n\n参考文档：\n${context}\n\n如果文档中有相关信息，请基于文档内容进行详细回答；如果文档中没有相关信息，你可以根据自己的知识进行回答，并说明这是你的知识。`
    : '你是一个专业的AI产品经理和技术顾问，精通AI产品设计、AI Agent开发、Prompt工程、学习规划等领域。请详细回答用户的问题，提供实用的建议和方案。';

  const allMessages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  try {
    const response = await axios.post(
      `${API_BASE_URLS.deepseek}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return response.data.choices[0]?.message?.content || '未获取到回答';
  } catch (error) {
    console.error('AI API 调用失败:', error);
    return '抱歉，回答失败，请稍后重试';
  }
}

export async function generateStudyPlan(topic: string, level: string, hoursPerDay: number): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    return '请先配置 API 密钥';
  }

  const prompt = `
请为学习「${topic}」生成一个完整的学习计划。

学习者水平：${level}
每日学习时间：${hoursPerDay}小时

请按照以下结构输出：
1. 学习目标（明确可量化）
2. 学习路径（分阶段）
3. 推荐资源（书籍、视频、网站）
4. 进度追踪方法

请给出具体、可执行的计划。
  `;

  try {
    const response = await axios.post(
      `${API_BASE_URLS.deepseek}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个专业的学习规划师，擅长为不同水平的学习者制定学习计划。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return response.data.choices[0]?.message?.content || '未生成学习计划';
  } catch (error) {
    console.error('AI API 调用失败:', error);
    return '抱歉，生成学习计划失败，请稍后重试';
  }
}
