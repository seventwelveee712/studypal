import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  documentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SESSIONS_DIR = path.join(process.cwd(), 'data', 'chatSessions');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

export async function createChatSession(title: string, documentId?: string): Promise<ChatSession> {
  const session: ChatSession = {
    id: uuidv4(),
    title,
    messages: [],
    documentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const filePath = path.join(SESSIONS_DIR, `${session.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(session, null, 2));
  
  return session;
}

export async function getAllChatSessions(): Promise<ChatSession[]> {
  try {
    const files = await fs.promises.readdir(SESSIONS_DIR);
    const sessions: ChatSession[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(SESSIONS_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const session = JSON.parse(content);
        sessions.push(session);
      }
    }

    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('读取聊天会话失败:', error);
    return [];
  }
}

export async function getChatSessionById(id: string): Promise<ChatSession | null> {
  try {
    const filePath = path.join(SESSIONS_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取聊天会话失败:', error);
    return null;
  }
}

export async function addMessageToSession(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatSession | null> {
  const session = await getChatSessionById(sessionId);
  if (!session) return null;

  const newMessage: ChatMessage = {
    ...message,
    id: uuidv4(),
    timestamp: new Date(),
  };

  session.messages.push(newMessage);
  session.updatedAt = new Date();

  const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(session, null, 2));
  
  return session;
}

export async function deleteChatSession(id: string): Promise<boolean> {
  try {
    const filePath = path.join(SESSIONS_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除聊天会话失败:', error);
    return false;
  }
}
