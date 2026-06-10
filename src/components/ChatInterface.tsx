import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, Trash2, MessageSquare, Check, ChevronDown } from 'lucide-react';
import { Document } from '@/lib/document';
import { ChatSession } from '@/lib/chatHistory';

interface ChatInterfaceProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (doc: Document | null) => void;
}

export default function ChatInterface({ documents, selectedDocument, onSelectDocument }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/chat-sessions');
      const data = await response.json();
      setSessions(data.sessions || []);
      if (data.sessions?.length > 0 && !currentSession) {
        setCurrentSession(data.sessions[0]);
      }
    } catch (error) {
      console.error('获取会话失败:', error);
    }
  };

  const createNewSession = async () => {
    if (!newSessionTitle.trim()) return;

    try {
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newSessionTitle.trim(), 
          documentId: selectedDocument?.id 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.session);
        setShowNewSessionModal(false);
        setNewSessionTitle('');
        fetchSessions();
      }
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };

  const selectSession = async (session: ChatSession) => {
    setCurrentSession(session);
    onSelectDocument(null);
    setSelectedDocIds([]);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/chat-sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId }),
      });

      const data = await response.json();
      if (data.success) {
        fetchSessions();
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
        }
      }
    } catch (error) {
      console.error('删除会话失败:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !currentSession) return;

    const userMessage = { 
      id: `temp-${Date.now()}`,
      role: 'user' as const, 
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setIsLoading(true);
    setInputValue('');

    try {
      const response = await fetch('/api/chat-sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          message: { role: 'user' as const, content: userMessage.content },
          documentIds: selectedDocIds,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.session);
        fetchSessions();
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: prev.messages.slice(0, -1)
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(doc => doc.id));
    }
  };

  const selectedDocs = documents.filter(doc => selectedDocIds.includes(doc.id));

  const formatAnswer = (content: string): string => {
    let formatted = content;
    formatted = formatted.replace(/###\s+/g, '');
    formatted = formatted.replace(/##\s+/g, '');
    formatted = formatted.replace(/\*\*/g, '');
    formatted = formatted.replace(/\*/g, '');
    formatted = formatted.replace(/`/g, '');
    formatted = formatted.replace(/^\s*\n/gm, '');
    formatted = formatted.trim();
    return formatted;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl card-shadow overflow-hidden">
      <div className="flex h-full">
        <div className="w-64 border-r border-[#E8EEF4] bg-[#F5F7FA] flex flex-col">
          <div className="p-4 border-b border-[#E8EEF4]">
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="w-full py-2.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-xl font-medium hover:bg-[#A5C9FF]/80 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新对话
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-[#8A9BB2]">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无对话</p>
                <p className="text-xs">点击上方按钮开始新对话</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    currentSession?.id === session.id
                      ? 'bg-[#A5C9FF]/30 border border-[#A5C9FF]'
                      : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-[#3D4A5C] truncate max-w-[140px]">
                      {session.title}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      className="p-1 text-[#8A9BB2] opacity-0 hover:opacity-100 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-[#8A9BB2] mt-1">
                    {session.messages.length} 条消息
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b bg-[#F5F7FA]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowSessionDropdown(!showSessionDropdown)}
                      className="px-3 py-2 bg-white border border-[#E8EEF4] rounded-lg text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#A5C9FF] min-w-[200px] justify-between"
                    >
                      <span className="text-left truncate">{currentSession.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSessionDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showSessionDropdown && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-[#E8EEF4] rounded-xl shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                        {sessions.map(session => (
                          <button
                            key={session.id}
                            onClick={() => { selectSession(session); setShowSessionDropdown(false); }}
                            className={`w-full px-4 py-3 text-left hover:bg-[#F5F7FA] transition-colors ${
                              currentSession.id === session.id ? 'bg-[#A5C9FF]/10' : ''
                            }`}
                          >
                            <p className="font-medium text-[#3D4A5C] truncate">{session.title}</p>
                            <p className="text-xs text-[#8A9BB2] mt-1">{session.messages.length} 条消息</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[#8A9BB2]">
                      {selectedDocs.length > 0 
                        ? `基于 ${selectedDocs.length} 个文档` 
                        : '通用问答'
                      }
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowDocDropdown(!showDocDropdown)}
                    className="px-3 py-2 bg-white border border-[#E8EEF4] rounded-lg text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#A5C9FF] min-w-[160px] justify-between"
                  >
                    <span>
                      {selectedDocs.length > 0 
                        ? `${selectedDocs.length} 个文档已选` 
                        : '选择参考文档'
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDocDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDocDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E8EEF4] rounded-xl shadow-lg z-10 overflow-hidden">
                      <div className="p-2 border-b border-[#E8EEF4]">
                        <button
                          onClick={toggleSelectAll}
                          className="w-full px-3 py-2 text-sm text-[#8A9BB2] hover:bg-[#F5F7FA] rounded-lg flex items-center gap-2"
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedDocIds.length === documents.length ? 'bg-[#A5C9FF] border-[#A5C9FF]' : 'border-[#D1E0FF]'
                          }`}>
                            {selectedDocIds.length === documents.length && <Check className="w-3 h-3 text-white" />}
                          </div>
                          全选
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {documents.map(doc => (
                          <button
                            key={doc.id}
                            onClick={() => toggleDocSelection(doc.id)}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-[#F5F7FA] flex items-center gap-3 ${
                              selectedDocIds.includes(doc.id) ? 'bg-[#A5C9FF]/10' : ''
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedDocIds.includes(doc.id) ? 'bg-[#A5C9FF] border-[#A5C9FF]' : 'border-[#D1E0FF]'
                            }`}>
                              {selectedDocIds.includes(doc.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="truncate text-[#3D4A5C]">{doc.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentSession.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#8A9BB2]">
                    <Bot className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium text-[#3D4A5C]">开始对话</p>
                    <p className="text-sm mt-2">选择文档后可以基于文档内容提问</p>
                    <p className="text-sm">或者直接向我提问学习相关问题</p>
                  </div>
                ) : (
                  currentSession.messages.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-[#A5C9FF] text-white' : 'bg-[#EDF1F7] text-[#8A9BB2]'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-[#A5C9FF] text-[#3D4A5C] rounded-br-md' 
                          : 'bg-[#F5F7FA] text-[#3D4A5C] rounded-bl-md'
                      }`}>
                        <p className="whitespace-pre-wrap">{formatAnswer(message.content)}</p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#EDF1F7] rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#8A9BB2]" />
                    </div>
                    <div className="bg-[#F5F7FA] px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#A5C9FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#A5C9FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-[#A5C9FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4 bg-[#F5F7FA]">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入您的问题..."
                      className="w-full px-4 py-3 bg-white border border-[#E8EEF4] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex-shrink-0 w-12 h-12 bg-[#A5C9FF] text-[#3D4A5C] rounded-xl flex items-center justify-center hover:bg-[#A5C9FF]/80 disabled:bg-[#D1E0FF] transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-[#8A9BB2]">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-[#3D4A5C]">选择或创建一个对话</p>
                <p className="text-sm mt-2">开始您的学习之旅</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewSessionModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#3D4A5C] mb-4">新建对话</h3>
            <input
              type="text"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="输入对话标题..."
              className="w-full px-4 py-3 border border-[#E8EEF4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && createNewSession()}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowNewSessionModal(false); setNewSessionTitle(''); }}
                className="flex-1 py-2.5 text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
              >
                取消
              </button>
              <button
                onClick={createNewSession}
                disabled={!newSessionTitle.trim()}
                className="flex-1 py-2.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-xl font-medium hover:bg-[#A5C9FF]/80 disabled:bg-[#D1E0FF] transition-colors"
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
