import pdf from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  type: string;
  lastReadAt?: Date;
}

const DOCUMENTS_DIR = path.join(process.cwd(), 'data', 'documents');

if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}

function cleanText(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
  cleaned = cleaned.replace(/[\u25A0-\u25FF]/g, '');
  cleaned = cleaned.replace(/\uFFFD/g, '');
  cleaned = cleaned.replace(/[□■▢▣▤▥▦▧▨▩]/g, '\n');
  cleaned = cleaned.replace(/\|+/g, ' ');
  cleaned = cleaned.replace(/([A-Za-z]) ([A-Za-z])/g, '$1$2');
  cleaned = cleaned.replace(/(\d)\.(\d)/g, '$1.$2 ');
  cleaned = cleaned.replace(/([一二三四五六七八九十]+)、/g, '\n$1、');
  cleaned = cleaned.replace(/([一二三四五六七八九十]+)、/g, '\n$1、');
  cleaned = cleaned.replace(/(\d+)\.(\d+)/g, '\n$1.$2');
  cleaned = cleaned.replace(/([。！？])\s*([\u4e00-\u9fa5])/g, '$1\n$2');
  cleaned = cleaned.replace(/(\d)\.(\u4e00-\u9fa5)/g, '\n$1.$2');
  cleaned = cleaned.replace(/([\u4e00-\u9fa5])(\d+\.)/g, '$1\n$2');
  cleaned = cleaned.replace(/([。！？])\s*(\d+\.)/g, '$1\n$2');
  cleaned = cleaned.replace(/\n{2,}/g, '\n\n');
  cleaned = cleaned.replace(/ {2,}/g, ' ');
  cleaned = cleaned.replace(/^ +/gm, '');
  cleaned = cleaned.replace(/ +$/gm, '');
  cleaned = cleaned.trim();
  return cleaned;
}

export async function parseFile(file: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  try {
    if (ext === 'pdf') {
      const data = await pdf(file);
      return cleanText(data.text);
    } else if (ext === 'txt' || ext === 'md') {
      return cleanText(file.toString('utf-8'));
    } else {
      return cleanText(file.toString('utf-8'));
    }
  } catch (error) {
    console.error('文件解析失败:', error);
    throw new Error('文件解析失败，请尝试其他文件');
  }
}

export async function saveDocument(content: string, filename: string): Promise<Document> {
  const document: Document = {
    id: uuidv4(),
    name: filename,
    content,
    createdAt: new Date(),
    type: filename.split('.').pop()?.toLowerCase() || 'unknown',
  };

  const filePath = path.join(DOCUMENTS_DIR, `${document.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(document, null, 2));
  
  return document;
}

export async function getAllDocuments(): Promise<Document[]> {
  try {
    const files = await fs.promises.readdir(DOCUMENTS_DIR);
    const documents: Document[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DOCUMENTS_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const doc = JSON.parse(content);
        documents.push(doc);
      }
    }

    return documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('读取文档列表失败:', error);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<Document | null> {
  try {
    const filePath = path.join(DOCUMENTS_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取文档失败:', error);
    return null;
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DOCUMENTS_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除文档失败:', error);
    return false;
  }
}

export function searchDocuments(query: string, documents: Document[]): Document[] {
  const lowerQuery = query.toLowerCase();
  return documents.filter(doc => 
    doc.name.toLowerCase().includes(lowerQuery) || 
    doc.content.toLowerCase().includes(lowerQuery)
  );
}
