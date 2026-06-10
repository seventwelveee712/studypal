import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Trash2, Tag, Edit2, Save, Calendar, Hash, Sparkles, Lightbulb, List, Link2, Loader2 } from 'lucide-react';

interface Note { id: string; title: string; content: string; tags: string[]; createdAt: Date; updatedAt: Date; }
interface NotesProps { initialNote?: Note | null; onNotesChange?: () => void; }

interface NoteSuggestion {
  tags: string[];
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
}

export default function Notes({ initialNote, onNotesChange }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<NoteSuggestion | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => { fetchNotes(); fetchTags(); }, []);
  useEffect(() => { if (initialNote) handleSelectNote(initialNote); }, [initialNote]);

  useEffect(() => {
    if (isEditing && editContent.length > 50) {
      generateSuggestions();
    }
  }, [editContent]);

  const fetchNotes = async () => {
    const url = searchQuery ? `/api/notes?q=${encodeURIComponent(searchQuery)}` : '/api/notes';
    const response = await fetch(url);
    const data = await response.json();
    let filteredNotes = data.notes || [];
    if (selectedTags.length > 0) filteredNotes = filteredNotes.filter((note: Note) => selectedTags.some(tag => note.tags.includes(tag)));
    setNotes(filteredNotes);
  };

  const fetchTags = async () => {
    const response = await fetch('/api/notes', { method: 'PATCH' });
    const data = await response.json();
    setAllTags(data.tags || []);
  };

  const generateSuggestions = async () => {
    if (editContent.length < 50 || isGeneratingSuggestions) return;
    
    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch('/api/note-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent, existingTags: editTags })
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('获取笔记建议失败:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note); setIsEditing(false); setEditTitle(note.title); setEditContent(note.content); setEditTags([...note.tags]); setSuggestions(null);
  };

  const handleCreateNote = () => { setSelectedNote(null); setIsEditing(true); setEditTitle(''); setEditContent(''); setEditTags([]); setSuggestions(null); };

  const handleSaveNote = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    if (selectedNote) {
      await fetch('/api/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedNote.id, updates: { title: editTitle, content: editContent, tags: editTags } }) });
    } else {
      await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: editTitle, content: editContent, tags: editTags }) });
    }
    setIsEditing(false); setSuggestions(null); await fetchNotes(); await fetchTags(); onNotesChange?.();
  };

  const handleDeleteNote = async (noteId: string) => {
    await fetch('/api/notes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: noteId }) });
    if (selectedNote?.id === noteId) { setSelectedNote(null); setIsEditing(false); setSuggestions(null); }
    await fetchNotes(); await fetchTags(); onNotesChange?.();
  };

  const toggleTag = (tag: string) => { setEditTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };
  const addNewTag = () => { if (newTagInput.trim() && !editTags.includes(newTagInput.trim())) { setEditTags([...editTags, newTagInput.trim()]); setNewTagInput(''); } };
  const toggleSelectedTag = (tag: string) => { setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };

  useEffect(() => { fetchNotes(); }, [selectedTags]);

  const formatDate = (dateString: Date) => { return new Date(dateString).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };
  const truncateContent = (content: string) => { return content.length > 100 ? content.slice(0, 100) + '...' : content; };

  return (<div className="h-full flex flex-col bg-[#F5F7FA] rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-[#E1E7F0]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#A5C9FF]/20 rounded-xl"><FileText className="w-6 h-6 text-[#3D6B9E]" /></div>
        <div><h2 className="text-lg font-semibold text-[#3D4A5C]">我的笔记</h2><p className="text-sm text-[#8A9BB2]">记录学习心得与思考</p></div>
      </div>
      <button onClick={handleCreateNote} className="flex items-center gap-2 px-4 py-2 bg-[#A5C9FF] text-[#1E3A5F] rounded-xl hover:bg-[#8BB8E8]">
        <Plus className="w-4 h-4" /><span className="text-sm font-medium">新建笔记</span>
      </button>
    </div>

    <div className="flex flex-1 overflow-hidden">
      <div className="w-80 border-r border-[#E1E7F0] flex flex-col">
        <div className="p-4 border-b border-[#E1E7F0]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9BB2]" />
            <input type="text" placeholder="搜索笔记..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-[#E1E7F0] rounded-xl text-sm text-[#3D4A5C] placeholder:text-[#8A9BB2] focus:outline-none focus:border-[#A5C9FF]" />
          </div>
        </div>

        {allTags.length > 0 && (<div className="p-4 border-b border-[#E1E7F0]">
          <div className="flex items-center gap-2 mb-3"><Tag className="w-4 h-4 text-[#8A9BB2]" /><span className="text-xs font-medium text-[#8A9BB2]">标签筛选</span></div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (<button key={tag} onClick={() => toggleSelectedTag(tag)} className={`px-3 py-1 rounded-full text-xs font-medium ${selectedTags.includes(tag) ? 'bg-[#A5C9FF] text-[#1E3A5F]' : 'bg-white border border-[#E1E7F0] text-[#8A9BB2] hover:border-[#A5C9FF]'}`}>
              <Hash className="w-3 h-3 inline mr-1" />{tag}
            </button>))}
          </div>
        </div>)}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.length === 0 ? (<div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#D1DBE9] mx-auto mb-3" />
            <p className="text-[#8A9BB2] text-sm">暂无笔记</p>
            <button onClick={handleCreateNote} className="mt-4 text-[#3D6B9E] text-sm font-medium hover:underline">创建第一篇笔记</button>
          </div>) : (notes.map(note => (<div key={note.id} onClick={() => handleSelectNote(note)} className={`p-4 rounded-xl cursor-pointer transition-all ${selectedNote?.id === note.id ? 'bg-[#A5C9FF]/10 border-2 border-[#A5C9FF]' : 'bg-white border border-transparent hover:border-[#E1E7F0]'}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-[#3D4A5C] line-clamp-1">{note.title}</h3>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="p-1 text-[#8A9BB2] opacity-0 hover:opacity-100 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-[#8A9BB2] line-clamp-2 mb-3">{truncateContent(note.content)}</p>
            <div className="flex items-center justify-between">
              {note.tags.length > 0 && (<div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map(tag => (<span key={tag} className="px-2 py-0.5 bg-[#7ED6B0]/20 text-[#2E7D58] text-xs rounded-full">{tag}</span>))}
                {note.tags.length > 2 && (<span className="px-2 py-0.5 bg-[#E1E7F0] text-[#8A9BB2] text-xs rounded-full">+{note.tags.length - 2}</span>)}
              </div>)}
              <div className="flex items-center gap-1 text-xs text-[#8A9BB2]"><Calendar className="w-3 h-3" />{formatDate(note.updatedAt)}</div>
            </div>
          </div>)))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {selectedNote || isEditing ? (<div className="max-w-4xl mx-auto">
          {isEditing ? (<div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] overflow-hidden">
            <div className="p-4 border-b border-[#E1E7F0] flex items-center justify-between">
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="输入笔记标题..." className="flex-1 text-lg font-semibold text-[#3D4A5C] bg-transparent border-none outline-none" />
              <button onClick={handleSaveNote} className="flex items-center gap-2 px-4 py-2 bg-[#7ED6B0] text-white rounded-xl hover:bg-[#5EC79A]"><Save className="w-4 h-4" /><span className="text-sm font-medium">保存</span></button>
            </div>
            
            {suggestions && (<div className="p-4 border-b border-[#E1E7F0] bg-gradient-to-r from-[#FFF5F5] to-[#F7FFFA]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="font-medium text-[#3D4A5C]">AI 智能建议</span>
                {isGeneratingSuggestions && <Loader2 className="w-4 h-4 text-[#A5C9FF] animate-spin ml-auto" />}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.tags.length > 0 && (<div>
                  <div className="flex items-center gap-2 mb-2"><Tag className="w-4 h-4 text-[#8A9BB2]" /><span className="text-sm font-medium text-[#8A9BB2]">标签建议</span></div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags.map(tag => (<button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${editTags.includes(tag) ? 'bg-[#A5C9FF] text-[#1E3A5F]' : 'bg-white border border-[#E1E7F0] text-[#8A9BB2] hover:border-[#A5C9FF]'}`}>
                      <Hash className="w-3 h-3 inline mr-1" />{tag}
                    </button>))}
                  </div>
                </div>)}
                
                {suggestions.summary && (<div>
                  <div className="flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-[#8A9BB2]" /><span className="text-sm font-medium text-[#8A9BB2]">内容摘要</span></div>
                  <p className="text-sm text-[#3D4A5C] line-clamp-2">{suggestions.summary}</p>
                </div>)}
                
                {suggestions.relatedTopics.length > 0 && (<div>
                  <div className="flex items-center gap-2 mb-2"><Link2 className="w-4 h-4 text-[#8A9BB2]" /><span className="text-sm font-medium text-[#8A9BB2]">相关话题</span></div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.relatedTopics.map(topic => (<span key={topic} className="px-3 py-1 bg-[#F5F7FA] text-[#8A9BB2] text-sm rounded-full">{topic}</span>))}
                  </div>
                </div>)}
              </div>
              
              {suggestions.keyPoints.length > 0 && (<div className="mt-4 pt-4 border-t border-[#E1E7F0]">
                <div className="flex items-center gap-2 mb-2"><List className="w-4 h-4 text-[#8A9BB2]" /><span className="text-sm font-medium text-[#8A9BB2]">要点提取</span></div>
                <ul className="space-y-2">
                  {suggestions.keyPoints.map((point, index) => (<li key={index} className="flex items-start gap-2 text-sm text-[#3D4A5C]">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#7ED6B0]/20 text-[#2E7D58] rounded-full text-xs flex-shrink-0">{index + 1}</span>
                    {point}
                  </li>))}
                </ul>
              </div>)}
            </div>)}

            <div className="p-4 border-b border-[#E1E7F0]">
              <div className="flex items-center gap-2 mb-3"><Tag className="w-4 h-4 text-[#8A9BB2]" /><span className="text-sm font-medium text-[#8A9BB2]">已有标签</span></div>
              <div className="flex flex-wrap gap-2 mb-2">
                {allTags.map(tag => (<button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${editTags.includes(tag) ? 'bg-[#A5C9FF] text-[#1E3A5F]' : 'bg-[#F5F7FA] text-[#8A9BB2] hover:bg-[#E1E7F0]'}`}>{tag}</button>))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())} placeholder="添加新标签..." className="flex-1 px-3 py-2 bg-[#F5F7FA] border border-[#E1E7F0] rounded-xl text-sm focus:outline-none focus:border-[#A5C9FF]" />
                <button onClick={addNewTag} className="px-3 py-2 bg-white border border-[#E1E7F0] rounded-xl hover:bg-[#F5F7FA]"><Plus className="w-4 h-4 text-[#8A9BB2]" /></button>
              </div>
            </div>
            <div className="p-4"><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="开始记录你的学习心得..." className="w-full h-80 resize-none bg-transparent border-none outline-none text-[#3D4A5C] placeholder:text-[#8A9BB2]" /></div>
          </div>) : (<div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] overflow-hidden">
            <div className="p-6 border-b border-[#E1E7F0] flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#3D4A5C]">{selectedNote?.title || '未命名笔记'}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#8A9BB2]">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />创建于 {selectedNote?.createdAt ? formatDate(selectedNote.createdAt) : '-'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />更新于 {selectedNote?.updatedAt ? formatDate(selectedNote.updatedAt) : '-'}</span>
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F5F7FA] text-[#3D4A5C] rounded-xl hover:bg-[#E1E7F0]"><Edit2 className="w-4 h-4" /><span className="text-sm font-medium">编辑</span></button>
            </div>
            {selectedNote?.tags.length && selectedNote.tags.length > 0 && (<div className="p-4 border-b border-[#E1E7F0]">
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map(tag => (<span key={tag} className="px-3 py-1 bg-[#7ED6B0]/20 text-[#2E7D58] text-sm rounded-full"><Hash className="w-3 h-3 inline mr-1" />{tag}</span>))}
              </div>
            </div>)}
            <div className="p-6"><p className="text-[#3D4A5C] leading-relaxed whitespace-pre-wrap">{selectedNote?.content || ''}</p></div>
          </div>)}
        </div>) : (<div className="h-full flex flex-col items-center justify-center text-center">
          <div className="p-6 bg-[#A5C9FF]/10 rounded-full mb-4"><FileText className="w-16 h-16 text-[#A5C9FF]" /></div>
          <h3 className="text-xl font-semibold text-[#3D4A5C] mb-2">选择或创建笔记</h3>
          <p className="text-[#8A9BB2] mb-6">从左侧列表选择一篇笔记查看，或点击上方按钮创建新笔记</p>
          <button onClick={handleCreateNote} className="flex items-center gap-2 px-6 py-3 bg-[#A5C9FF] text-[#1E3A5F] rounded-xl hover:bg-[#8BB8E8]"><Plus className="w-5 h-5" /><span className="font-medium">创建新笔记</span></button>
        </div>)}
      </div>
    </div>
  </div>);
}