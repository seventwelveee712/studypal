import fs from 'fs';
import path from 'path';

export interface NoteSuggestion {
  tags: string[];
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
}

const DATA_DIR = path.join(process.cwd(), 'data', 'note-suggestions');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const commonTags = [
  '学习笔记', '重要', '待复习', '概念', '技巧', '总结',
  '编程', '前端', '后端', '算法', '数据结构', '设计模式',
  'Python', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js',
  '数据库', 'SQL', 'MongoDB', 'Redis', '网络', 'HTTP',
  '面试', '笔试', '项目经验', '读书笔记', '思考', '灵感'
];

export async function generateNoteSuggestions(content: string, existingTags: string[] = []): Promise<NoteSuggestion> {
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 10);
  
  const summary = sentences.length > 0 
    ? sentences.slice(0, 2).join('。') + '。'
    : '内容过短，无法生成摘要';

  const keyPoints: string[] = [];
  for (let i = 0; i < Math.min(4, sentences.length); i++) {
    keyPoints.push(sentences[i].trim().substring(0, 60) + '...');
  }

  const words = content.toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z]{3,}/g) || [];
  const wordCount: { [key: string]: number } = {};
  const stopWords = ['的', '是', '在', '有', '和', '了', '我', '你', '他', '她', '它', '这', '那', '就', '都', '而', '及', '与', '着', '或', '一个', '没有', '我们', '你们', '他们', '这个', '那个', '什么', '怎么', '为什么', '因为', '所以', '但是', '如果', '可以', '可能', '应该', '需要', '已经', '正在', '将会', '曾经', '一直', '总是', '经常', '偶尔', '很少', '从不'];
  
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  const suggestedTags: string[] = [];
  
  for (const tag of commonTags) {
    if (!existingTags.includes(tag)) {
      const tagWords = tag.split('');
      const matches = tagWords.filter(tw => 
        topWords.some(w => w.includes(tw) || tw.includes(w))
      );
      if (matches.length >= 2) {
        suggestedTags.push(tag);
      }
    }
    if (suggestedTags.length >= 5) break;
  }

  for (const word of topWords) {
    if (!existingTags.includes(word) && !suggestedTags.includes(word) && word.length >= 2) {
      suggestedTags.push(word);
    }
    if (suggestedTags.length >= 5) break;
  }

  const relatedTopics = topWords.slice(0, 5);

  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    tags: suggestedTags.slice(0, 5),
    summary,
    keyPoints,
    relatedTopics
  };
}

export async function saveSuggestion(noteId: string, suggestion: NoteSuggestion): Promise<void> {
  const filePath = path.join(DATA_DIR, `${noteId}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(suggestion, null, 2));
}

export async function getSuggestion(noteId: string): Promise<NoteSuggestion | null> {
  try {
    const filePath = path.join(DATA_DIR, `${noteId}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function suggestTitle(content: string): string {
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 5);
  if (sentences.length === 0) return '无标题笔记';
  
  const firstSentence = sentences[0].trim();
  return firstSentence.length <= 20 ? firstSentence : firstSentence.substring(0, 20) + '...';
}

export function extractQuestions(content: string): string[] {
  const questionRegex = /[？?]([^？?]+)[？?]/g;
  const matches = content.match(questionRegex) || [];
  return matches.map(m => m.trim()).slice(0, 5);
}