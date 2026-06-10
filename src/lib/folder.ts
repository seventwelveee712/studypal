import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface Folder {
  id: string;
  name: string;
  documentIds: string[];
  createdAt: Date;
  color?: string;
}

const FOLDERS_DIR = path.join(process.cwd(), 'data', 'folders');

if (!fs.existsSync(FOLDERS_DIR)) {
  fs.mkdirSync(FOLDERS_DIR, { recursive: true });
}

const COLORS = ['#A5C9FF', '#7ED6B0', '#FFB08A', '#FFD3B6', '#DDA0DD', '#98D8C8'];

export async function createFolder(name: string): Promise<Folder> {
  const folder: Folder = {
    id: uuidv4(),
    name,
    documentIds: [],
    createdAt: new Date(),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };

  const filePath = path.join(FOLDERS_DIR, `${folder.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(folder, null, 2));
  
  return folder;
}

export async function getAllFolders(): Promise<Folder[]> {
  try {
    const files = await fs.promises.readdir(FOLDERS_DIR);
    const folders: Folder[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(FOLDERS_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const folder = JSON.parse(content);
        folders.push(folder);
      }
    }

    return folders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    console.error('读取文件夹失败:', error);
    return [];
  }
}

export async function getFolderById(id: string): Promise<Folder | null> {
  try {
    const filePath = path.join(FOLDERS_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取文件夹失败:', error);
    return null;
  }
}

export async function updateFolder(id: string, updates: Partial<Folder>): Promise<Folder | null> {
  try {
    const folder = await getFolderById(id);
    if (!folder) return null;

    const updatedFolder: Folder = {
      ...folder,
      ...updates,
    };

    const filePath = path.join(FOLDERS_DIR, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(updatedFolder, null, 2));
    
    return updatedFolder;
  } catch (error) {
    console.error('更新文件夹失败:', error);
    return null;
  }
}

export async function addDocumentToFolder(folderId: string, documentId: string): Promise<boolean> {
  const folder = await getFolderById(folderId);
  if (!folder) return false;
  
  if (!folder.documentIds.includes(documentId)) {
    folder.documentIds.push(documentId);
    await updateFolder(folderId, { documentIds: folder.documentIds });
  }
  
  return true;
}

export async function removeDocumentFromFolder(folderId: string, documentId: string): Promise<boolean> {
  const folder = await getFolderById(folderId);
  if (!folder) return false;
  
  folder.documentIds = folder.documentIds.filter(id => id !== documentId);
  await updateFolder(folderId, { documentIds: folder.documentIds });
  
  return true;
}

export async function deleteFolder(id: string): Promise<boolean> {
  try {
    const filePath = path.join(FOLDERS_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除文件夹失败:', error);
    return false;
  }
}
