import fs from 'fs';
import path from 'path';

export interface QuizRecord {
  id: string;
  documentIds: string[];
  documentNames: string[];
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  score: number;
  percentage: number;
  createdAt: string;
  type: 'document' | 'evaluation';
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'choice' | 'fill' | 'essay';
  options?: string[];
  correctAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'quizHistory');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function saveQuizRecord(record: Omit<QuizRecord, 'id' | 'createdAt'>): Promise<QuizRecord> {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newRecord: QuizRecord = {
    ...record,
    id,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(newRecord, null, 2));

  return newRecord;
}

export async function getAllQuizRecords(): Promise<QuizRecord[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const records: QuizRecord[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          const record = JSON.parse(content);
          records.push(record);
        } catch {
          continue;
        }
      }
    }

    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function getQuizRecordById(id: string): Promise<QuizRecord | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function deleteQuizRecord(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}