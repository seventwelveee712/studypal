import { Document } from './document';
import { Note } from './notes';

export interface SearchResult {
  id: string;
  type: 'document' | 'note';
  title: string;
  snippet: string;
  score: number;
}

export function searchDocuments(documents: Document[], query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const keywords = query.toLowerCase().split(' ').filter(k => k.length > 0);
  
  for (const doc of documents) {
    let score = 0;
    const content = (doc.content || '').toLowerCase();
    const name = doc.name.toLowerCase();
    
    for (const keyword of keywords) {
      if (name.includes(keyword)) score += 3;
      if (content.includes(keyword)) score += 1;
    }
    
    if (score > 0) {
      const snippet = getSnippet(content, query, 100);
      results.push({
        id: doc.id,
        type: 'document',
        title: doc.name,
        snippet,
        score,
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

export function searchNotes(notes: Note[], query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const keywords = query.toLowerCase().split(' ').filter(k => k.length > 0);
  
  for (const note of notes) {
    let score = 0;
    const content = (note.content || '').toLowerCase();
    const title = (note.title || '').toLowerCase();
    
    for (const keyword of keywords) {
      if (title.includes(keyword)) score += 3;
      if (content.includes(keyword)) score += 1;
    }
    
    if (score > 0) {
      const snippet = getSnippet(content, query, 100);
      results.push({
        id: note.id,
        type: 'note',
        title: note.title || '无标题笔记',
        snippet,
        score,
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

function getSnippet(content: string, query: string, maxLength: number): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) {
    return content.substring(0, Math.min(maxLength, content.length)) + '...';
  }
  
  const start = Math.max(0, index - 20);
  const end = Math.min(content.length, index + query.length + 80);
  
  let snippet = content.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet += '...';
  
  return snippet;
}

export function searchAll(documents: Document[], notes: Note[], query: string): SearchResult[] {
  const docResults = searchDocuments(documents, query);
  const noteResults = searchNotes(notes, query);
  
  return [...docResults, ...noteResults].sort((a, b) => b.score - a.score);
}