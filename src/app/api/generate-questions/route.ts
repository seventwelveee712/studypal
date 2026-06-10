import { NextResponse } from 'next/server';
import { getDocumentById } from '@/lib/document';

export async function POST(request: Request) {
  try {
    const { documentId, questionCount = 5 } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: '请选择文档' }, { status: 400 });
    }

    const document = await getDocumentById(documentId);
    if (!document) {
      return NextResponse.json({ error: '文档不存在' }, { status: 404 });
    }

    const content = document.content.substring(0, 3000);

    const prompt = `
基于以下文档内容，生成${questionCount}道测验题目，涵盖选择题、填空题和问答题。

文档内容：
${content}

请按照以下JSON格式输出：
{
  "questions": [
    {
      "id": "q1",
      "question": "题目内容",
      "type": "choice|fill|essay",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": "正确答案",
      "category": "知识点分类",
      "difficulty": "easy|medium|hard"
    }
  ]
}

注意：
- type字段：choice表示选择题，fill表示填空题，essay表示问答题
- options字段只在type为choice时需要
- correctAnswer对于选择题是选项字母（如"A"），对于填空题和问答题是完整答案
- category是从文档中提取的知识点分类
- difficulty根据题目难度设置为easy、medium或hard
    `.trim();

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ error: '生成题目失败' }, { status: 500 });
    }

    let result;
    try {
      const content = data.choices[0].message.content;
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch {
      return NextResponse.json({ error: '解析结果失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions: result.questions || [], documentName: document.name });
  } catch (error) {
    console.error('生成题目失败:', error);
    return NextResponse.json({ error: '生成题目失败' }, { status: 500 });
  }
}
