import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NOTES_DIR = path.join(process.cwd(), 'data', 'notes');

if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR, { recursive: true });
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  const newNote: Note = {
    ...note,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const filePath = path.join(NOTES_DIR, `${newNote.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(newNote, null, 2));
  
  return newNote;
}

export async function getAllNotes(): Promise<Note[]> {
  try {
    const files = await fs.promises.readdir(NOTES_DIR);
    const notes: Note[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(NOTES_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const note = JSON.parse(content);
        notes.push(note);
      }
    }

    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('读取笔记失败:', error);
    return [];
  }
}

export async function getNoteById(id: string): Promise<Note | null> {
  try {
    const filePath = path.join(NOTES_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取笔记失败:', error);
    return null;
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  try {
    const note = await getNoteById(id);
    if (!note) return null;

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date(),
    };

    const filePath = path.join(NOTES_DIR, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(updatedNote, null, 2));
    
    return updatedNote;
  } catch (error) {
    console.error('更新笔记失败:', error);
    return null;
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    const filePath = path.join(NOTES_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除笔记失败:', error);
    return false;
  }
}

export async function searchNotes(query: string): Promise<Note[]> {
  const allNotes = await getAllNotes();
  return allNotes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
}

export async function getAllTags(): Promise<string[]> {
  const notes = await getAllNotes();
  const tags = new Set<string>();
  notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
