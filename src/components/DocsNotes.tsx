'use client';

import { useState } from 'react';
import { FileText, FileEdit, Upload, Plus, Search, Grid, List, X, FolderOpen, FolderPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { Document } from '@/lib/document';
import { Note } from '@/lib/notes';

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  documentIds: string[];
}

interface DocsNotesProps {
  documents: Document[];
  notes: Note[];
  folders: Folder[];
  onDocumentSelect: (doc: Document) => void;
  onNoteSelect: (note: Note) => void;
  onAddDocument: () => void;
  onAddNote: () => void;
  onAddFolder: (name: string) => void;
}

export default function DocsNotes({ 
  documents, 
  notes, 
  folders,
  onDocumentSelect, 
  onNoteSelect,
  onAddDocument,
  onAddNote,
  onAddFolder
}: DocsNotesProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'notes'>('documents');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  console.log('[DocsNotes] Component initialized:', {
    documentCount: documents.length,
    noteCount: notes.length,
    folderCount: folders.length,
    activeTab
  });

  const toggleFolder = (folderId: string) => {
    console.log('[DocsNotes] toggleFolder called with folderId:', folderId);
    setExpandedFolders(prev => {
      const isExpanded = prev.includes(folderId);
      const updated = isExpanded 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId];
      console.log('[DocsNotes] toggleFolder result:', { folderId, isExpanded: !isExpanded, expandedCount: updated.length });
      return updated;
    });
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(note => 
    (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#A5C9FF]/20 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-[#3D6B9E]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#3D4A5C]">文档笔记</h1>
            <p className="text-sm text-[#8A9BB2]">管理你的学习文档和笔记</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'documents'
                  ? 'bg-white shadow-sm text-[#3D4A5C]'
                  : 'text-[#8A9BB2] hover:text-[#3D4A5C]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">文档</span>
              <span className="text-xs px-2 py-0.5 bg-[#E1E7F0] rounded-full">{documents.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'notes'
                  ? 'bg-white shadow-sm text-[#3D4A5C]'
                  : 'text-[#8A9BB2] hover:text-[#3D4A5C]'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">笔记</span>
              <span className="text-xs px-2 py-0.5 bg-[#E1E7F0] rounded-full">{notes.length}</span>
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7ED6B0] text-white rounded-xl hover:bg-[#2E7D58] transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">新建文件夹</span>
          </button>
          
          <button
            onClick={activeTab === 'documents' ? onAddDocument : onAddNote}
            className="flex items-center gap-2 px-4 py-2 bg-[#3D6B9E] text-white rounded-xl hover:bg-[#2E5A8A] transition-colors"
          >
            {activeTab === 'documents' ? <Upload className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">{activeTab === 'documents' ? '上传文档' : '新建笔记'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9BB2]" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]/50"
          />
        </div>
        
        <div className="flex items-center gap-1 bg-[#F5F7FA] rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-[#3D4A5C]' : 'text-[#8A9BB2]'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm text-[#3D4A5C]' : 'text-[#8A9BB2]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'documents' ? (
        <div className="space-y-4">
          {folders.map(folder => {
            const isExpanded = expandedFolders.includes(folder.id);
            const folderDocs = documents.filter(doc => folder.documentIds.includes(doc.id));
            return (
              <div key={folder.id} className="bg-white rounded-xl border border-[#E1E7F0] overflow-hidden">
                <div 
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F5F7FA] transition-colors"
                  onClick={() => toggleFolder(folder.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-[#8A9BB2]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#8A9BB2]" />
                  )}
                  <div className="w-10 h-10 bg-[#7ED6B0]/20 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-[#2E7D58]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#3D4A5C]">{folder.name}</h3>
                    <p className="text-xs text-[#8A9BB2]">{folderDocs.length} 个文件</p>
                  </div>
                  <p className="text-xs text-[#8A9BB2]">
                    {new Date(folder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isExpanded && folderDocs.length > 0 && (
                  <div className="p-4 pt-0 space-y-2">
                    {folderDocs.map(doc => (
                      <div
                        key={doc.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentSelect(doc);
                        }}
                        className={`flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg cursor-pointer hover:bg-[#EDF1F7] transition-colors ${
                          viewMode === 'list' ? '' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-[#A5C9FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[#3D6B9E]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#3D4A5C] truncate">{doc.name}</h4>
                          <p className="text-xs text-[#8A9BB2] truncate">
                            {doc.content.substring(0, 30)}...
                          </p>
                        </div>
                        <p className="text-xs text-[#8A9BB2] flex-shrink-0">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {isExpanded && folderDocs.length === 0 && (
                  <div className="p-4 pt-0 text-center">
                    <p className="text-sm text-[#8A9BB2]">文件夹为空</p>
                  </div>
                )}
              </div>
            );
          })}

          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredDocuments.filter(doc => 
              !folders.some(folder => folder.documentIds.includes(doc.id))
            ).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onDocumentSelect(doc)}
                className={`p-4 bg-white rounded-xl border border-[#E1E7F0] cursor-pointer hover-lift ${
                  viewMode === 'list' ? 'flex items-center gap-4' : ''
                }`}
              >
                <div className="w-12 h-12 bg-[#A5C9FF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#3D6B9E]" />
                </div>
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className="font-medium text-[#3D4A5C] truncate">{doc.name}</h3>
                  <p className="text-sm text-[#8A9BB2] truncate mt-1">
                    {doc.content.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-[#8A9BB2] mt-2">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredDocuments.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-[#E1E7F0]" />
                <p className="text-[#8A9BB2] mt-4">暂无文档</p>
                <button
                  onClick={onAddDocument}
                  className="mt-4 px-4 py-2 bg-[#A5C9FF] text-white rounded-xl hover:bg-[#3D6B9E] transition-colors"
                >
                  上传文档
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className={`p-4 bg-white rounded-xl border border-[#E1E7F0] cursor-pointer hover-lift ${
                viewMode === 'list' ? 'flex items-center gap-4' : ''
              }`}
            >
              <div className="w-12 h-12 bg-[#7ED6B0]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileEdit className="w-6 h-6 text-[#2E7D58]" />
              </div>
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <h3 className="font-medium text-[#3D4A5C] truncate">{note.title || '无标题笔记'}</h3>
                <p className="text-sm text-[#8A9BB2] truncate mt-1">
                  {note.content.substring(0, 50)}...
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-[#7ED6B0]/20 text-[#2E7D58] rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileEdit className="w-16 h-16 mx-auto text-[#E1E7F0]" />
              <p className="text-[#8A9BB2] mt-4">暂无笔记</p>
              <button
                onClick={onAddNote}
                className="mt-4 px-4 py-2 bg-[#7ED6B0] text-white rounded-xl hover:bg-[#2E7D58] transition-colors"
              >
                新建笔记
              </button>
            </div>
          )}
        </div>
      )}

      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-[#3D4A5C]">新建文件夹</h3>
              <button
                onClick={() => { setShowCreateFolder(false); setNewFolderName(''); }}
                className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-[#3D4A5C] mb-2">文件夹名称</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F5F7FA] border-none rounded-lg text-[#3D4A5C] focus:ring-2 focus:ring-[#A5C9FF]"
                  placeholder="输入文件夹名称"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => { setShowCreateFolder(false); setNewFolderName(''); }}
                className="px-4 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    onAddFolder(newFolderName.trim());
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }
                }}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-[#7ED6B0] text-white rounded-lg font-medium hover:bg-[#2E7D58] disabled:bg-[#B8E6D0] transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}