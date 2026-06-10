'use client';

import { GraduationCap, BookOpen, Target, BarChart3, FileText, Award, Brain, Search, Compass, ChevronDown, FolderOpen, Notebook, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlobalSearch from './GlobalSearch';
import { useTheme } from '@/contexts/ThemeContext';
import { Document } from '@/lib/document';
import { Note } from '@/lib/notes';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  documents: Document[];
  notes: Note[];
  onDocumentSelect: (doc: Document) => void;
  onNoteSelect: (note: Note) => void;
}

const navGroups = [
  {
    id: 'learning',
    label: '学习中心',
    icon: BookOpen,
    items: [
      { id: 'chat', label: '智能问答', icon: Brain },
      { id: 'docs', label: '文档笔记', icon: FolderOpen },
    ],
    defaultItem: 'chat'
  },
  {
    id: 'planning',
    label: '学习规划',
    icon: Target,
    items: [
      { id: 'plan', label: '学习计划', icon: Target },
      { id: 'learningPath', label: '学习路径', icon: Compass },
    ],
    defaultItem: 'plan'
  },
  {
    id: 'assessment',
    label: '学习评测',
    icon: Award,
    items: [
      { id: 'evaluation', label: '知识评测', icon: Award },
      { id: 'documentQuiz', label: '文档测验', icon: Brain },
    ],
    defaultItem: 'evaluation'
  },
];

const standaloneTabs = [
  { id: 'dashboard', label: '学习统计', icon: BarChart3 },
  { id: 'aiKnowledge', label: 'AI知识库', icon: Brain },
  { id: 'workflow', label: '学习工作流', icon: Target },
  { id: 'prompt', label: 'Prompt模板', icon: Notebook },
];

const getAllTabs = () => {
  const tabs: { id: string; label: string }[] = [];
  navGroups.forEach(group => {
    group.items.forEach(item => {
      tabs.push({ id: item.id, label: item.label });
    });
  });
  standaloneTabs.forEach(tab => {
    tabs.push({ id: tab.id, label: tab.label });
  });
  return tabs;
};

const getActiveTabLabel = (activeTabId: string): string => {
  const allTabs = getAllTabs();
  const tab = allTabs.find(t => t.id === activeTabId);
  return tab?.label || '智能问答';
};

export default function Header({ activeTab, onTabChange, documents, notes, onDocumentSelect, onNoteSelect }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  const handleGroupClick = (groupId: string) => {
    if (openDropdown === groupId) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(groupId);
    }
  };

  const handleItemClick = (itemId: string, groupId: string) => {
    onTabChange(itemId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const getActiveGroup = () => {
    for (const group of navGroups) {
      if (group.items.some(item => item.id === activeTab)) {
        return group.id;
      }
    }
    return null;
  };

  const activeGroup = getActiveGroup();

  return (
    <>
      <header className="bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] text-[#3D4A5C] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm hover-lift cursor-pointer transition-transform duration-300 hover:scale-105">
                <GraduationCap className="w-6 h-6 text-[#3D4A5C]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">StudyPal</h1>
                <p className="text-[#5A6B7D] text-sm hidden sm:block">{getActiveTabLabel(activeTab)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 hover-lift sm:hidden"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSearch(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 hover-lift"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">搜索文档、笔记...</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 hover-lift"
                title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-300 hover-lift md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="hidden md:flex items-center gap-1">
              {navGroups.map((group) => {
                const Icon = group.icon;
                const isActive = activeGroup === group.id;
                
                return (
                  <div key={group.id} className="dropdown-container relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupClick(group.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/30 font-medium'
                          : 'hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{group.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === group.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdown === group.id && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#252A33] rounded-xl shadow-lg py-1 z-50 min-w-40 animate-fade-in">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isItemActive = activeTab === item.id;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.id, group.id)}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${
                                isItemActive
                                  ? 'bg-[#A5C9FF]/20 text-[#3D6B9E] dark:bg-[#7EB4FF]/10'
                                  : 'hover:bg-[#F5F7FA] dark:hover:bg-[#303841]'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                              <span className="text-[#3D4A5C] dark:text-[#E8EEF4]">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              
              {standaloneTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover-lift ${
                      isActive
                        ? 'bg-white/30 font-medium'
                        : 'hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {mobileMenuOpen && (
              <div className="md:hidden bg-white dark:bg-[#252A33] rounded-xl mt-2 p-2 shadow-lg animate-fade-in">
                {navGroups.map((group) => {
                  const Icon = group.icon;
                  const isActive = activeGroup === group.id;
                  
                  return (
                    <div key={group.id} className="mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGroupClick(group.id);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isActive ? 'bg-[#A5C9FF]/20' : 'hover:bg-[#F5F7FA] dark:hover:bg-[#303841]'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-[#3D4A5C] dark:text-[#E8EEF4]" />
                        <span className="flex-1 text-left text-[#3D4A5C] dark:text-[#E8EEF4]">{group.label}</span>
                        <ChevronDown className={`w-4 h-4 text-[#8A9BB2] transition-transform ${openDropdown === group.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openDropdown === group.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isItemActive = activeTab === item.id;
                            
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id, group.id)}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                                  isItemActive
                                    ? 'bg-[#A5C9FF]/20 text-[#3D6B9E]'
                                    : 'hover:bg-[#F5F7FA] dark:hover:bg-[#303841] text-[#3D4A5C] dark:text-[#E8EEF4]'
                                }`}
                              >
                                <ItemIcon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                <div className="border-t border-[#E8EEF4] dark:border-[#303841] pt-2">
                  {standaloneTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-[#A5C9FF]/20 text-[#3D6B9E]'
                            : 'hover:bg-[#F5F7FA] dark:hover:bg-[#303841] text-[#3D4A5C] dark:text-[#E8EEF4]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {showSearch && (
        <GlobalSearch
          documents={documents}
          notes={notes}
          onDocumentSelect={onDocumentSelect}
          onNoteSelect={onNoteSelect}
        />
      )}
    </>
  );
}
