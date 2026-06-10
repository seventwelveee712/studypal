import fs from 'fs';
import path from 'path';

export interface DocumentSummary {
  id: string;
  documentId: string;
  documentName: string;
  summary: string;
  keyPoints: string[];
  keywords: string[];
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'summaries');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function generateSummary(documentId: string, documentName: string, content: string): Promise<DocumentSummary> {
  const summary = await simulateAISummary(content);
  
  const id = `${documentId}-${Date.now()}`;
  const summaryData: DocumentSummary = {
    id,
    documentId,
    documentName,
    summary: summary.summary,
    keyPoints: summary.keyPoints,
    keywords: summary.keywords,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(summaryData, null, 2));

  return summaryData;
}

async function simulateAISummary(content: string): Promise<{ summary: string; keyPoints: string[]; keywords: string[] }> {
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 10);
  
  const summary = sentences.slice(0, 3).join('。') + '。';
  
  const keyPoints: string[] = [];
  for (let i = 0; i < Math.min(5, sentences.length); i++) {
    keyPoints.push(sentences[i].trim().substring(0, 50) + '...');
  }
  
  const words = content.toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z]{3,}/g) || [];
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    if (!['的', '是', '在', '有', '和', '了', '我', '你', '他', '她', '它', '这', '那'].includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  const keywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { summary, keyPoints, keywords };
}

export async function getSummary(documentId: string): Promise<DocumentSummary | null> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const summaryFiles = files.filter(f => f.startsWith(documentId));
    
    if (summaryFiles.length === 0) return null;
    
    const latestFile = summaryFiles.sort().reverse()[0];
    const filePath = path.join(DATA_DIR, latestFile);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function getAllSummaries(): Promise<DocumentSummary[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const summaries: DocumentSummary[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          summaries.push(JSON.parse(content));
        } catch {
          continue;
        }
      }
    }

    return summaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function deleteSummary(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}