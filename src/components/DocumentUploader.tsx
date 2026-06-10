import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader2, FolderPlus, Folder, ChevronDown, ChevronRight, Search, X, Eye, File } from 'lucide-react';
import { Document } from '@/lib/document';
import { Folder as FolderType } from '@/lib/folder';

interface DocumentUploaderProps {
  documents: Document[];
  onDocumentsChange: () => void;
}

export default function DocumentUploader({ documents, onDocumentsChange }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (error) {
      console.error('获取文件夹失败:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateFolder(false);
        setNewFolderName('');
        fetchFolders();
      }
    } catch (error) {
      console.error('创建文件夹失败:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchFolders();
      }
    } catch (error) {
      console.error('删除文件夹失败:', error);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadStatus(null);
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (selectedFolder) {
          formData.append('folderId', selectedFolder);
        }
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          const folderMsg = selectedFolder ? `到文件夹` : '';
          setUploadStatus({ success: true, message: `${file.name} 上传${folderMsg}成功` });
          onDocumentsChange();
          fetchFolders();
        } else {
          setUploadStatus({ success: false, message: `${file.name} 上传失败: ${data.error}` });
        }
      } catch (error) {
        setUploadStatus({ success: false, message: `${file.name} 上传失败: 网络错误` });
      }
    }
    setUploading(false);
  }, [onDocumentsChange, selectedFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        onDocumentsChange();
        fetchFolders();
        if (selectedDocumentId === id) {
          setSelectedDocumentId(null);
        }
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handlePreview = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents?id=${doc.id}`);
      const data = await response.json();
      if (data.document) {
        setPreviewDocument(data.document);
      }
    } catch (error) {
      console.error('获取文档内容失败:', error);
    }
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
  };

  const handleFileClick = (doc: Document) => {
    handlePreview(doc);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'TXT';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      pdf: '📄',
      txt: '📝',
      md: '📑',
      docx: '📘',
    };
    return icons[ext || ''] || '📄';
  };

  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden fade-in">
      <div className="px-6 py-4 border-b bg-[#F5F7FA]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#3D4A5C]">文档管理</h2>
            <p className="text-sm text-[#8A9BB2]">支持 PDF、TXT、MD 格式文件</p>
          </div>
          <button
            onClick={() => setShowCreateFolder(!showCreateFolder)}
            className="flex items-center gap-2 px-3 py-2 bg-[#A5C9FF]/20 text-[#3D4A5C] rounded-lg hover:bg-[#A5C9FF]/30 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="text-sm">新建文件夹</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9BB2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文档..."
              className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] border-none rounded-xl text-[#3D4A5C] placeholder:text-[#8A9BB2]"
            />
          </div>
        </div>

        {showCreateFolder && (
          <div className="mb-4 p-4 bg-[#F5F7FA] rounded-xl">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="输入文件夹名称..."
              className="w-full px-4 py-2 bg-white border-none rounded-lg text-[#3D4A5C] focus:ring-2 focus:ring-[#A5C9FF]"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 py-2 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#A5C9FF]/80 disabled:bg-[#D1E0FF] transition-colors"
              >
                创建
              </button>
              <button
                onClick={() => { setShowCreateFolder(false); setNewFolderName(''); }}
                className="px-4 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 space-y-2">
          {folders.map(folder => {
            const isExpanded = expandedFolders.includes(folder.id);
            const isSelected = selectedFolder === folder.id;
            const folderDocs = documents.filter(doc => folder.documentIds.includes(doc.id));
            
            return (
              <div key={folder.id} className="border border-[#E8EEF4] rounded-xl overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#A5C9FF]/20' : 'bg-[#F5F7FA] hover:bg-[#EDF1F7]'
                  }`}
                  onClick={() => toggleFolder(folder.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#8A9BB2]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#8A9BB2]" />
                    )}
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'ring-2 ring-[#A5C9FF]' : ''
                      }`}
                      style={{ backgroundColor: `${folder.color}30` }}
                    >
                      <Folder className="w-4 h-4" style={{ color: folder.color }} />
                    </div>
                    <span className="font-medium text-[#3D4A5C]">{folder.name}</span>
                    <span className="text-xs text-[#8A9BB2]">({folderDocs.length})</span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-full">已选择</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFolder(isSelected ? null : folder.id); }}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        isSelected 
                          ? 'bg-[#FFB08A]/20 text-[#B85C38]' 
                          : 'bg-[#7ED6B0]/20 text-[#2E7D58] hover:bg-[#7ED6B0]/30'
                      }`}
                    >
                      {isSelected ? '取消选择' : '选择'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                      className="p-1 text-[#8A9BB2] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 bg-white border-t border-[#E8EEF4]">
                    {folderDocs.length > 0 ? (
                      <div className="space-y-2">
                        {folderDocs.map(doc => (
                          <div 
                            key={doc.id}
                            className={`flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg cursor-pointer hover:bg-[#EDF1F7] transition-colors group ${
                              selectedDocumentId === doc.id ? 'ring-2 ring-[#A5C9FF]' : ''
                            }`}
                            onClick={() => handleFileClick(doc)}
                            onMouseEnter={() => setHoveredDocument(doc.id)}
                            onMouseLeave={() => setHoveredDocument(null)}
                          >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-xl">{getFileIcon(doc.name)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#3D4A5C] truncate">{doc.name}</p>
                              <p className="text-xs text-[#8A9BB2]">
                                {getFileExtension(doc.name)} | {new Date(doc.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}
                                className="p-1.5 text-[#8A9BB2] hover:text-[#3D6B9E] hover:bg-white rounded-lg transition-colors"
                                title="预览文档"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                className="p-1.5 text-[#8A9BB2] hover:text-red-400 hover:bg-white rounded-lg transition-colors"
                                title="删除文档"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-[#8A9BB2]">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">文件夹为空</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedFolder && (
          <div className="mb-4 p-3 bg-[#A5C9FF]/10 border border-[#A5C9FF] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#3D4A5C]" />
              <span className="text-sm text-[#3D4A5C]">
                已选择文件夹：<span className="font-medium">{folders.find(f => f.id === selectedFolder)?.name}</span>
              </span>
            </div>
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          {...getRootProps({
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive 
                ? 'border-[#A5C9FF] bg-[#A5C9FF]/10' 
                : 'border-[#E8EEF4] hover:border-[#A5C9FF] hover:bg-[#F5F7FA]'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDragActive ? 'bg-[#A5C9FF]/20' : 'bg-[#EDF1F7]'
            }`}>
              {uploading ? (
                <Loader2 className="w-8 h-8 text-[#A5C9FF] animate-spin" />
              ) : (
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-[#A5C9FF]' : 'text-[#8A9BB2]'}`} />
              )}
            </div>
            <p className="text-lg font-medium text-[#3D4A5C] mb-2">
              {uploading ? '上传中...' : '拖拽文件到此处'}
            </p>
            <p className="text-sm text-[#8A9BB2]">
              或点击选择文件 {selectedFolder && '（将上传到选中的文件夹）'}
            </p>
          </div>
        </div>

        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus.success ? 'bg-[#7ED6B0]/10 text-[#2E7D58]' : 'bg-[#FFB08A]/10 text-[#B85C38]'
          }`}>
            {uploadStatus.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium text-[#8A9BB2] mb-3">全部文档</h3>
          
          {documents.length === 0 ? (
            <div className="text-center py-8 text-[#8A9BB2]">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无文档</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className={`p-4 bg-[#F5F7FA] rounded-xl hover:bg-white hover:card-shadow-hover transition-all cursor-pointer group ${
                    selectedDocumentId === doc.id ? 'ring-2 ring-[#A5C9FF] bg-white card-shadow' : ''
                  }`}
                  onClick={() => handleFileClick(doc)}
                  onMouseEnter={() => setHoveredDocument(doc.id)}
                  onMouseLeave={() => setHoveredDocument(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-xl">{getFileIcon(doc.name)}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}
                        className="p-1 text-[#8A9BB2] hover:text-[#3D6B9E] transition-colors"
                        title="预览文档"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                        className="p-1 text-[#8A9BB2] hover:text-red-400 transition-colors"
                        title="删除文档"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-medium text-[#3D4A5C] truncate">{doc.name}</p>
                  <p className="text-xs text-[#8A9BB2] mt-1">
                    {getFileExtension(doc.name)} | {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#F5F7FA]">
              <div>
                <h3 className="font-semibold text-[#3D4A5C]">{previewDocument.name}</h3>
                <p className="text-sm text-[#8A9BB2]">
                  {getFileExtension(previewDocument.name)} | {new Date(previewDocument.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="whitespace-pre-wrap text-[#3D4A5C] leading-relaxed">
                {previewDocument.content.length > 0 ? (
                  previewDocument.content
                ) : (
                  <p className="text-[#8A9BB2] text-center py-8">文档内容为空</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
