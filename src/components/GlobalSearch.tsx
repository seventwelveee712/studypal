'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, FileEdit, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { SearchResult } from '@/lib/search';
import { Document } from '@/lib/document';
import { Note } from '@/lib/notes';

interface GlobalSearchProps {
  documents: Document[];
  notes: Note[];
  onDocumentSelect: (doc: Document) => void;
  onNoteSelect: (note: Note) => void;
}

const SEARCH_SUGGESTIONS = [
  'React Hooks',
  'TypeScript 教程',
  '机器学习入门',
  '算法学习',
  '数据结构',
  'Python 编程',
  '前端面试',
  '系统设计',
];

const TRENDING_SEARCHES = [
  { query: 'React 18 新特性', count: 128 },
  { query: 'TypeScript 类型体操', count: 96 },
  { query: 'AI 大模型', count: 89 },
];

export default function GlobalSearch({ documents, notes, onDocumentSelect, onNoteSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const keywords = query.toLowerCase().split(' ').filter(k => k.length > 0);
      const newResults: SearchResult[] = [];

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
          newResults.push({
            id: doc.id,
            type: 'document',
            title: doc.name,
            snippet,
            score,
          });
        }
      }

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
          newResults.push({
            id: note.id,
            type: 'note',
            title: note.title || '无标题笔记',
            snippet,
            score,
          });
        }
      }

      setResults(newResults.sort((a, b) => b.score - a.score).slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query, documents, notes]);

  const getSnippet = (content: string, query: string, maxLength: number): string => {
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
  };

  const handleSelect = (result: SearchResult) => {
    saveToHistory(query);
    
    if (result.type === 'document') {
      const doc = documents.find(d => d.id === result.id);
      if (doc) onDocumentSelect(doc);
    } else {
      const note = notes.find(n => n.id === result.id);
      if (note) onNoteSelect(note);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleSearchQuery = (searchQuery: string) => {
    saveToHistory(searchQuery);
    setQuery(searchQuery);
  };

  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = searchHistory.filter(h => h !== searchQuery);
    newHistory.unshift(searchQuery);
    const trimmed = newHistory.slice(0, 10);
    setSearchHistory(trimmed);
    localStorage.setItem('searchHistory', JSON.stringify(trimmed));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const getSuggestions = () => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(lowerQuery)).slice(0, 5);
  };

  const suggestions = getSuggestions();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#F5F7FA] rounded-xl hover:bg-[#EDF1F7] transition-colors w-64 hover-lift"
      >
        <Search className="w-4 h-4 text-[#8A9BB2]" />
        <span className="text-sm text-[#8A9BB2]">搜索文档、笔记...</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] fade-in">
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => { setIsOpen(false); setQuery(''); }}
          />
          
          <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl card-shadow overflow-hidden scale-in">
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <Search className="w-5 h-5 text-[#8A9BB2]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索文档、笔记..."
                className="flex-1 bg-transparent border-none text-[#3D4A5C] placeholder:text-[#8A9BB2] focus:outline-none"
              />
              <button
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="p-1 hover:bg-[#F5F7FA] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#8A9BB2]" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-[#8A9BB2]">搜索结果 ({results.length})</div>
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full p-3 text-left hover:bg-[#F5F7FA] rounded-xl transition-colors flex items-start gap-3"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        result.type === 'document' ? 'bg-[#A5C9FF]/20' : 'bg-[#7ED6B0]/20'
                      }`}>
                        {result.type === 'document' ? (
                          <FileText className="w-5 h-5 text-[#A5C9FF]" />
                        ) : (
                          <FileEdit className="w-5 h-5 text-[#7ED6B0]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#3D4A5C] truncate">{result.title}</p>
                        <p className="text-sm text-[#8A9BB2] truncate">{result.snippet}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.type === 'document' ? 'bg-[#A5C9FF]/20 text-[#3D6B9E]' : 'bg-[#7ED6B0]/20 text-[#2E7D58]'
                      }`}>
                        {result.type === 'document' ? '文档' : '笔记'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  {query && suggestions.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8A9BB2]">
                        <Sparkles className="w-3 h-3" />
                        搜索建议
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchQuery(suggestion)}
                          className="w-full p-2 text-left hover:bg-[#F5F7FA] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-[#FFD700]" />
                          <span className="text-[#3D4A5C]">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!query && searchHistory.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#8A9BB2]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          搜索历史
                        </div>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-[#A5C9FF] hover:text-[#3D6B9E]"
                        >
                          清空
                        </button>
                      </div>
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchQuery(item)}
                          className="w-full p-2 text-left hover:bg-[#F5F7FA] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-[#8A9BB2]" />
                          <span className="text-[#3D4A5C]">{item}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!query && searchHistory.length === 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8A9BB2]">
                        <TrendingUp className="w-3 h-3" />
                        热门搜索
                      </div>
                      {TRENDING_SEARCHES.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchQuery(item.query)}
                          className="w-full p-2 text-left hover:bg-[#F5F7FA] rounded-lg transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#FFB08A]" />
                            <span className="text-[#3D4A5C]">{item.query}</span>
                          </div>
                          <span className="text-xs text-[#8A9BB2]">{item.count}次</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {query && suggestions.length === 0 && (
                    <div className="text-center py-8 text-[#8A9BB2]">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>未找到相关结果</p>
                      <p className="text-sm mt-1">尝试其他关键词</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}