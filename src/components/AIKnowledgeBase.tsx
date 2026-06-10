'use client';

import { useState } from 'react';
import { 
  BookOpen, ChevronRight, Lightbulb, Rocket, AlertTriangle, 
  Link2, ExternalLink, Brain, Search, Bot, PenTool, BarChart3, 
  Settings, Sparkles, ChevronDown, ChevronUp, Tag, Plus, X, Save,
  Edit3, Check, Users, Target, CheckCircle, XCircle, 
  AlertCircle, Zap, ListChecks, Quote, Cpu
} from 'lucide-react';
import { aiConcepts, aiCapabilities, aiUseCases, aiCaseStudies, AIConcept, AICapability, AIUseCase, AICaseStudy } from '@/lib/aiKnowledge';

const categoryIconMap: Record<string, typeof Brain> = {
  llm: Brain,
  rag: Search,
  agent: Bot,
  prompt: PenTool,
  embedding: BarChart3,
  'fine-tuning': Settings,
};

const difficultyLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  beginner: { label: '入门', color: 'text-green-600', bgColor: 'bg-green-100' },
  intermediate: { label: '进阶', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  advanced: { label: '高级', color: 'text-purple-600', bgColor: 'bg-purple-100' },
};

const rankColors: Record<string, string> = {
  excellent: 'bg-green-500',
  good: 'bg-blue-500',
  average: 'bg-yellow-500',
  poor: 'bg-red-500',
};

type TabType = 'concepts' | 'capabilities' | 'useCases' | 'caseStudies';

interface NewConceptForm {
  title: string;
  category: string;
  summary: string;
  description: string;
}

interface NewUseCaseForm {
  title: string;
  industry: string;
  description: string;
  problem: string;
  solution: string;
  difficulty: string;
}

interface NewCaseStudyForm {
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  technology: string;
}

export default function AIKnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  const [selectedConcept, setSelectedConcept] = useState<AIConcept | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<AICapability | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<AIUseCase | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  console.log('[AIKnowledgeBase] Component initialized, activeTab:', activeTab);
  
  const [showAddConcept, setShowAddConcept] = useState(false);
  const [showAddUseCase, setShowAddUseCase] = useState(false);
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);
  
  const [customConcepts, setCustomConcepts] = useState<AIConcept[]>([]);
  const [customUseCases, setCustomUseCases] = useState<AIUseCase[]>([]);
  const [customCaseStudies, setCustomCaseStudies] = useState<AICaseStudy[]>([]);
  
  const [editingConcept, setEditingConcept] = useState<AIConcept | null>(null);
  const [editingUseCase, setEditingUseCase] = useState<AIUseCase | null>(null);

  const [newConceptForm, setNewConceptForm] = useState<NewConceptForm>({
    title: '',
    category: 'llm',
    summary: '',
    description: ''
  });

  const [newUseCaseForm, setNewUseCaseForm] = useState<NewUseCaseForm>({
    title: '',
    industry: '',
    description: '',
    problem: '',
    solution: '',
    difficulty: 'beginner'
  });

  const [newCaseStudyForm, setNewCaseStudyForm] = useState<NewCaseStudyForm>({
    title: '',
    company: '',
    industry: '',
    challenge: '',
    solution: '',
    technology: ''
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddConcept = () => {
    console.log('[AIKnowledgeBase] handleAddConcept called with form:', newConceptForm);
    if (!newConceptForm.title.trim()) {
      console.log('[AIKnowledgeBase] handleAddConcept failed: title is empty');
      return;
    }
    const newConcept: AIConcept = {
      id: `custom-${Date.now()}`,
      title: newConceptForm.title,
      category: newConceptForm.category as AIConcept['category'],
      categoryLabel: getCategoryLabel(newConceptForm.category),
      summary: newConceptForm.summary,
      description: newConceptForm.description,
      keyPoints: [],
      applications: [],
      advantages: [],
      challenges: [],
      resources: []
    };
    setCustomConcepts(prev => {
      const updated = [...prev, newConcept];
      console.log('[AIKnowledgeBase] handleAddConcept success: new concept added, total concepts:', updated.length);
      return updated;
    });
    setShowAddConcept(false);
    setNewConceptForm({ title: '', category: 'llm', summary: '', description: '' });
  };

  const handleAddUseCase = () => {
    console.log('[AIKnowledgeBase] handleAddUseCase called with form:', newUseCaseForm);
    if (!newUseCaseForm.title.trim()) {
      console.log('[AIKnowledgeBase] handleAddUseCase failed: title is empty');
      return;
    }
    const newUseCase: AIUseCase = {
      id: `custom-${Date.now()}`,
      title: newUseCaseForm.title,
      industry: newUseCaseForm.industry,
      description: newUseCaseForm.description,
      problem: newUseCaseForm.problem,
      solution: newUseCaseForm.solution,
      benefits: [],
      technologies: [],
      difficulty: newUseCaseForm.difficulty as AIUseCase['difficulty'],
      targetUsers: [],
      userNeeds: [],
      painPoints: [],
      productFeatures: [],
      successMetrics: [],
      implementationSteps: [],
      challenges: [],
      caseExamples: []
    };
    setCustomUseCases(prev => {
      const updated = [...prev, newUseCase];
      console.log('[AIKnowledgeBase] handleAddUseCase success: new use case added, total use cases:', updated.length);
      return updated;
    });
    setShowAddUseCase(false);
    setNewUseCaseForm({ title: '', industry: '', description: '', problem: '', solution: '', difficulty: 'beginner' });
  };

  const handleAddCaseStudy = () => {
    console.log('[AIKnowledgeBase] handleAddCaseStudy called with form:', newCaseStudyForm);
    if (!newCaseStudyForm.title.trim()) {
      console.log('[AIKnowledgeBase] handleAddCaseStudy failed: title is empty');
      return;
    }
    const newCase: AICaseStudy = {
      id: `custom-${Date.now()}`,
      title: newCaseStudyForm.title,
      company: newCaseStudyForm.company,
      industry: newCaseStudyForm.industry,
      challenge: newCaseStudyForm.challenge,
      solution: newCaseStudyForm.solution,
      technology: newCaseStudyForm.technology,
      results: [],
      lessons: []
    };
    setCustomCaseStudies(prev => {
      const updated = [...prev, newCase];
      console.log('[AIKnowledgeBase] handleAddCaseStudy success: new case study added, total case studies:', updated.length);
      return updated;
    });
    setShowAddCaseStudy(false);
    setNewCaseStudyForm({ title: '', company: '', industry: '', challenge: '', solution: '', technology: '' });
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      llm: '基础模型',
      rag: '检索增强',
      agent: '智能代理',
      prompt: '工程方法',
      embedding: '基础技术',
      'fine-tuning': '优化方法'
    };
    return labels[category] || category;
  };

  const tabs = [
    { id: 'concepts' as TabType, label: 'AI技术科普', icon: BookOpen },
    { id: 'capabilities' as TabType, label: '模型能力对比', icon: BarChart3 },
    { id: 'useCases' as TabType, label: '应用场景库', icon: Rocket },
    { id: 'caseStudies' as TabType, label: '产品案例库', icon: Sparkles },
  ];

  const allConcepts = [...aiConcepts, ...customConcepts];
  const allUseCases = [...aiUseCases, ...customUseCases];
  const allCaseStudies = [...aiCaseStudies, ...customCaseStudies];

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#1A1D24]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] rounded-2xl mb-4">
            <Brain className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">AI产品能力知识库</h1>
          </div>
          <p className="text-[#8A9BB2] dark:text-[#8A9BB2] max-w-2xl mx-auto">
            深入了解AI技术原理、模型能力对比、应用场景和实际案例，提升您的AI产品专业知识
          </p>
        </div>

        <div className="bg-white dark:bg-[#252A33] rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-[#E8EEF4] dark:border-[#303841]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedConcept(null);
                    setSelectedCapability(null);
                    setSelectedUseCase(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#3D6B9E] dark:text-[#7EB4FF] border-b-2 border-[#A5C9FF] bg-[#EFF6FF] dark:bg-[#1E232B]'
                      : 'text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] hover:bg-[#F5F7FA] dark:hover:bg-[#2A3039]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'concepts' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      AI技术概念
                    </h3>
                    <button
                      onClick={() => setShowAddConcept(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg text-sm font-medium hover:bg-[#8BB8E8] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      添加
                    </button>
                  </div>
                  {allConcepts.map(concept => {
                    const Icon = categoryIconMap[concept.category] || Brain;
                    const isCustom = concept.id.startsWith('custom-');
                    return (
                      <button
                        key={concept.id}
                        onClick={() => setSelectedConcept(concept)}
                        className={`w-full p-4 rounded-xl text-left transition-all group ${
                          selectedConcept?.id === concept.id
                            ? 'bg-[#A5C9FF]/20 border-2 border-[#A5C9FF] dark:border-[#7EB4FF]'
                            : 'bg-[#F5F7FA] dark:bg-[#2A3039] hover:bg-white dark:hover:bg-[#303841] border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedConcept?.id === concept.id 
                              ? 'bg-[#A5C9FF] text-white' 
                              : 'bg-[#E8EEF4] dark:bg-[#303841] text-[#8A9BB2]'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-[#3D4A5C] dark:text-[#E8EEF4]">{concept.title}</h4>
                              {isCustom && <span className="text-xs px-1.5 py-0.5 bg-[#7ED6B0]/20 text-[#2E7D58] rounded">自定义</span>}
                            </div>
                            <p className="text-xs text-[#8A9BB2] mt-1">{concept.summary}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#8A9BB2] group-hover:text-[#3D6B9E]" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-2">
                  {selectedConcept ? (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const Icon = categoryIconMap[selectedConcept.category] || Brain;
                            return (
                              <div className="w-12 h-12 bg-gradient-to-br from-[#A5C9FF] to-[#7ED6B0] rounded-xl flex items-center justify-center">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                            );
                          })()}
                          <div>
                            <h2 className="text-xl font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedConcept.title}</h2>
                            <span className="inline-flex items-center px-3 py-1 bg-[#E8EEF4] dark:bg-[#303841] rounded-full text-xs text-[#8A9BB2]">
                              {selectedConcept.categoryLabel}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingConcept(selectedConcept)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#8A9BB2] hover:text-[#3D6B9E] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            编辑
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-5">
                        <p className="text-[#3D4A5C] dark:text-[#E8EEF4] leading-relaxed">{selectedConcept.description}</p>
                      </div>

                      {selectedConcept.keyPoints.length > 0 && (
                        <div>
                          <button
                            onClick={() => toggleSection(`keyPoints-${selectedConcept.id}`)}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#252A33] rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-[#2A3039] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-[#FFB08A]" />
                              <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">核心要点</h3>
                            </div>
                            {expandedSections[`keyPoints-${selectedConcept.id}`] ? (
                              <ChevronUp className="w-5 h-5 text-[#8A9BB2]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#8A9BB2]" />
                            )}
                          </button>
                          {expandedSections[`keyPoints-${selectedConcept.id}`] && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                              {selectedConcept.keyPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg">
                                  <span className="w-6 h-6 flex items-center justify-center bg-[#A5C9FF]/20 text-[#3D6B9E] rounded-full text-sm font-medium flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span className="text-[#3D4A5C] dark:text-[#E8EEF4] text-sm">{point}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedConcept.applications.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <button
                              onClick={() => toggleSection(`applications-${selectedConcept.id}`)}
                              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#252A33] rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-[#2A3039] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-[#7ED6B0]" />
                                <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">应用场景</h3>
                              </div>
                              {expandedSections[`applications-${selectedConcept.id}`] ? (
                                <ChevronUp className="w-5 h-5 text-[#8A9BB2]" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#8A9BB2]" />
                              )}
                            </button>
                            {expandedSections[`applications-${selectedConcept.id}`] && (
                              <div className="mt-2 flex flex-wrap gap-2 animate-fade-in">
                                {selectedConcept.applications.map((app, index) => (
                                  <span key={index} className="px-3 py-1.5 bg-[#7ED6B0]/20 text-[#2E7D58] rounded-lg text-sm">
                                    {app}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              onClick={() => toggleSection(`prosAndCons-${selectedConcept.id}`)}
                              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#252A33] rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-[#2A3039] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-[#FFB08A]" />
                                <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">优缺点分析</h3>
                              </div>
                              {expandedSections[`prosAndCons-${selectedConcept.id}`] ? (
                                <ChevronUp className="w-5 h-5 text-[#8A9BB2]" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#8A9BB2]" />
                              )}
                            </button>
                            {expandedSections[`prosAndCons-${selectedConcept.id}`] && (
                              <div className="mt-2 space-y-4 animate-fade-in">
                                {selectedConcept.advantages.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-[#2E7D58] mb-2">优势</p>
                                    <ul className="space-y-1">
                                      {selectedConcept.advantages.map((adv, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                                          <span className="w-1.5 h-1.5 bg-[#7ED6B0] rounded-full" />
                                          {adv}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedConcept.challenges.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-[#E87D4E] mb-2">挑战</p>
                                    <ul className="space-y-1">
                                      {selectedConcept.challenges.map((chal, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                                          <span className="w-1.5 h-1.5 bg-[#FFB08A] rounded-full" />
                                          {chal}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedConcept.resources.length > 0 && (
                        <div>
                          <button
                            onClick={() => toggleSection(`resources-${selectedConcept.id}`)}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#252A33] rounded-xl hover:bg-[#F5F7FA] dark:hover:bg-[#2A3039] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Link2 className="w-5 h-5 text-[#9B8AFB]" />
                              <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">推荐资源</h3>
                            </div>
                            {expandedSections[`resources-${selectedConcept.id}`] ? (
                              <ChevronUp className="w-5 h-5 text-[#8A9BB2]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#8A9BB2]" />
                            )}
                          </button>
                          {expandedSections[`resources-${selectedConcept.id}`] && (
                            <div className="mt-2 space-y-3 animate-fade-in">
                              {selectedConcept.resources.map(resource => (
                                <a
                                  key={resource.id}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg hover:bg-white dark:hover:bg-[#303841] transition-colors group"
                                >
                                  <div className="w-8 h-8 bg-[#9B8AFB]/20 rounded-lg flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4 text-[#9B8AFB]" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] group-hover:text-[#3D6B9E] dark:group-hover:text-[#7EB4FF]">
                                      {resource.title}
                                    </p>
                                    {resource.author && (
                                      <p className="text-xs text-[#8A9BB2]">{resource.author} | {resource.source}</p>
                                    )}
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-[#8A9BB2] group-hover:text-[#3D6B9E]" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-[#8A9BB2]">
                      <Brain className="w-16 h-16 opacity-50 mb-4" />
                      <p className="text-lg font-medium text-[#3D4A5C] dark:text-[#E8EEF4]">选择一个AI概念</p>
                      <p className="text-sm">从左侧列表选择一个AI技术概念来了解详情</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'capabilities' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setSelectedCapability(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !selectedCapability
                        ? 'bg-[#A5C9FF] text-[#1E3A5F]'
                        : 'bg-[#F5F7FA] dark:bg-[#2A3039] text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4]'
                    }`}
                  >
                    全部模型
                  </button>
                  {['通用模型', '开源模型', '国产模型'].map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        const filtered = aiCapabilities.filter(c => c.category === category);
                        if (filtered.length > 0) {
                          setSelectedCapability(filtered[0]);
                        }
                      }}
                      className="px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg text-sm font-medium text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {!selectedCapability ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiCapabilities.map(capability => (
                      <button
                        key={capability.id}
                        onClick={() => setSelectedCapability(capability)}
                        className="text-left p-5 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl hover:bg-white dark:hover:bg-[#303841] transition-all hover-lift group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] group-hover:text-[#3D6B9E] dark:group-hover:text-[#7EB4FF]">
                            {capability.name}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-[#8A9BB2] group-hover:text-[#3D6B9E]" />
                        </div>
                        <p className="text-sm text-[#8A9BB2] mb-4 line-clamp-2">{capability.description}</p>
                        <div className="space-y-2">
                          {capability.metrics.slice(0, 3).map(metric => (
                            <div key={metric.name} className="flex items-center justify-between">
                              <span className="text-xs text-[#8A9BB2]">{metric.name}</span>
                              <span className="text-xs font-medium text-[#3D4A5C] dark:text-[#E8EEF4]">
                                {metric.value}{metric.unit === '支持' ? '' : metric.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#E8EEF4] dark:border-[#303841]">
                          <span className="text-xs text-[#8A9BB2]">{capability.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <button
                      onClick={() => setSelectedCapability(null)}
                      className="flex items-center gap-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] mb-4"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      返回列表
                    </button>
                    <div className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedCapability.name}</h2>
                          <p className="text-[#8A9BB2] mt-1">{selectedCapability.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-[#E8EEF4] dark:bg-[#303841] rounded-full text-sm text-[#8A9BB2]">
                          {selectedCapability.category}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {selectedCapability.metrics.map(metric => (
                          <div key={metric.name} className="bg-white dark:bg-[#252A33] rounded-xl p-4">
                            <p className="text-xs text-[#8A9BB2] mb-2">{metric.name}</p>
                            <p className="text-2xl font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">
                              {metric.value}
                              <span className="text-sm font-normal text-[#8A9BB2] ml-1">
                                {metric.unit === '支持' ? '✓' : metric.unit}
                              </span>
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${rankColors[metric.rank]}`} />
                              <span className="text-xs text-[#8A9BB2] capitalize">
                                {metric.rank === 'excellent' ? '优秀' : 
                                 metric.rank === 'good' ? '良好' : 
                                 metric.rank === 'average' ? '一般' : '较差'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-white dark:bg-[#252A33] rounded-xl">
                        <h4 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] mb-4">能力雷达图</h4>
                        <div className="flex items-center justify-around">
                          {selectedCapability.metrics.map((metric, index) => {
                            const maxValue = Math.max(...selectedCapability.metrics.map(m => m.value));
                            const percentage = Math.min((metric.value / maxValue) * 100, 100);
                            return (
                              <div key={metric.name} className="flex flex-col items-center">
                                <div className="relative w-24 h-24">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                      cx="48"
                                      cy="48"
                                      r="40"
                                      fill="none"
                                      stroke="#E8EEF4"
                                      strokeWidth="8"
                                    />
                                    <circle
                                      cx="48"
                                      cy="48"
                                      r="40"
                                      fill="none"
                                      stroke={rankColors[metric.rank]}
                                      strokeWidth="8"
                                      strokeLinecap="round"
                                      strokeDasharray={`${percentage * 2.51} 251`}
                                      style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">
                                      {Math.round(percentage)}%
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs text-[#8A9BB2] mt-2 text-center">{metric.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'useCases' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">应用场景库</h3>
                  <button
                    onClick={() => setShowAddUseCase(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg text-sm font-medium hover:bg-[#8BB8E8] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加场景
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allUseCases.map(useCase => {
                    const isCustom = useCase.id.startsWith('custom-');
                    return (
                      <div
                        key={useCase.id}
                        className={`bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-5 hover:bg-white dark:hover:bg-[#303841] transition-all hover-lift cursor-pointer relative ${
                          selectedUseCase?.id === useCase.id ? 'ring-2 ring-[#A5C9FF]' : ''
                        }`}
                        onClick={() => setSelectedUseCase(useCase)}
                      >
                        {isCustom && <span className="absolute top-3 right-3 text-xs px-1.5 py-0.5 bg-[#7ED6B0]/20 text-[#2E7D58] rounded">自定义</span>}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyLabels[useCase.difficulty].bgColor} ${difficultyLabels[useCase.difficulty].color}`}>
                            {difficultyLabels[useCase.difficulty].label}
                          </span>
                          <span className="text-xs text-[#8A9BB2]">{useCase.industry}</span>
                        </div>
                        <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">{useCase.title}</h3>
                        <p className="text-sm text-[#8A9BB2] mb-4 line-clamp-2">{useCase.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {useCase.technologies.length > 0 ? (
                            useCase.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-white dark:bg-[#252A33] rounded-lg text-xs text-[#3D4A5C] dark:text-[#E8EEF4]">
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#8A9BB2]">暂无技术标签</span>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#E1E7F0] dark:border-[#303841]">
                          <p className="text-xs text-[#8A9BB2] flex items-center gap-1">
                            <ChevronRight className="w-4 h-4" />
                            点击查看详细分析
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'caseStudies' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">产品案例库</h3>
                  <button
                    onClick={() => setShowAddCaseStudy(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg text-sm font-medium hover:bg-[#8BB8E8] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加案例
                  </button>
                </div>
                <div className="space-y-6">
                  {allCaseStudies.map((caseStudy, index) => {
                    const isCustom = caseStudy.id.startsWith('custom-');
                    return (
                      <div key={caseStudy.id} className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">{caseStudy.title}</h3>
                                {isCustom && <span className="text-xs px-1.5 py-0.5 bg-[#7ED6B0]/20 text-[#2E7D58] rounded">自定义</span>}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-[#8A9BB2]">{caseStudy.company}</span>
                                <span className="px-2 py-0.5 bg-[#E8EEF4] dark:bg-[#303841] rounded-full text-xs text-[#8A9BB2]">
                                  {caseStudy.industry}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                                <AlertTriangle className="w-4 h-4 text-[#FFB08A]" />
                                挑战
                              </h4>
                              <p className="text-sm text-[#8A9BB2]">{caseStudy.challenge}</p>
                            </div>
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                                <Rocket className="w-4 h-4 text-[#7ED6B0]" />
                                解决方案
                              </h4>
                              <p className="text-sm text-[#8A9BB2]">{caseStudy.solution}</p>
                            </div>
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                                <Tag className="w-4 h-4 text-[#9B8AFB]" />
                                技术栈
                              </h4>
                              <p className="text-sm text-[#8A9BB2]">{caseStudy.technology}</p>
                            </div>
                          </div>

                          {caseStudy.results.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-[#E8EEF4] dark:border-[#303841]">
                              <h4 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] mb-4">量化结果</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {caseStudy.results.map((result, idx) => (
                                  <div key={idx} className="bg-white dark:bg-[#252A33] rounded-lg p-4">
                                    <p className="text-xs text-[#8A9BB2] mb-1">{result.metric}</p>
                                    <p className="text-xl font-bold text-[#7ED6B0]">{result.value}</p>
                                    {result.comparison && (
                                      <p className="text-xs text-[#8A9BB2]">{result.comparison}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {caseStudy.lessons.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">经验总结</h4>
                              <div className="flex flex-wrap gap-2">
                                {caseStudy.lessons.map((lesson, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-[#A5C9FF]/20 text-[#3D6B9E] rounded-lg text-sm">
                                    {lesson}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {showAddConcept && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#252A33] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">添加AI概念</h3>
                <button
                  onClick={() => { setShowAddConcept(false); setNewConceptForm({ title: '', category: 'llm', summary: '', description: '' }); }}
                  className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">标题</label>
                  <input
                    type="text"
                    value={newConceptForm.title}
                    onChange={(e) => setNewConceptForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="输入概念名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">分类</label>
                  <select
                    value={newConceptForm.category}
                    onChange={(e) => setNewConceptForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                  >
                    <option value="llm">基础模型 (LLM)</option>
                    <option value="rag">检索增强 (RAG)</option>
                    <option value="agent">智能代理 (Agent)</option>
                    <option value="prompt">工程方法 (Prompt)</option>
                    <option value="embedding">基础技术 (Embedding)</option>
                    <option value="fine-tuning">优化方法 (Fine-tuning)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">简介</label>
                  <textarea
                    value={newConceptForm.summary}
                    onChange={(e) => setNewConceptForm(prev => ({ ...prev, summary: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="简要描述这个概念"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">详细描述</label>
                  <textarea
                    value={newConceptForm.description}
                    onChange={(e) => setNewConceptForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="详细描述这个概念的定义和特点"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  onClick={() => { setShowAddConcept(false); setNewConceptForm({ title: '', category: 'llm', summary: '', description: '' }); }}
                  className="px-4 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddConcept}
                  disabled={!newConceptForm.title.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#8BB8E8] disabled:bg-[#D1E0FF] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddUseCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#252A33] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">添加应用场景</h3>
                <button
                  onClick={() => { setShowAddUseCase(false); setNewUseCaseForm({ title: '', industry: '', description: '', problem: '', solution: '', difficulty: 'beginner' }); }}
                  className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">场景名称</label>
                  <input
                    type="text"
                    value={newUseCaseForm.title}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="输入场景名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">所属行业</label>
                  <input
                    type="text"
                    value={newUseCaseForm.industry}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="如：教育、医疗、金融"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">难度级别</label>
                  <select
                    value={newUseCaseForm.difficulty}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                  >
                    <option value="beginner">入门</option>
                    <option value="intermediate">进阶</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">场景描述</label>
                  <textarea
                    value={newUseCaseForm.description}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="描述这个应用场景"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">问题描述</label>
                  <textarea
                    value={newUseCaseForm.problem}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, problem: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="这个场景要解决什么问题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">解决方案</label>
                  <textarea
                    value={newUseCaseForm.solution}
                    onChange={(e) => setNewUseCaseForm(prev => ({ ...prev, solution: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="AI如何解决这个问题"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  onClick={() => { setShowAddUseCase(false); setNewUseCaseForm({ title: '', industry: '', description: '', problem: '', solution: '', difficulty: 'beginner' }); }}
                  className="px-4 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddUseCase}
                  disabled={!newUseCaseForm.title.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#8BB8E8] disabled:bg-[#D1E0FF] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddCaseStudy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#252A33] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">添加产品案例</h3>
                <button
                  onClick={() => { setShowAddCaseStudy(false); setNewCaseStudyForm({ title: '', company: '', industry: '', challenge: '', solution: '', technology: '' }); }}
                  className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">案例标题</label>
                  <input
                    type="text"
                    value={newCaseStudyForm.title}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="输入案例标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">公司名称</label>
                  <input
                    type="text"
                    value={newCaseStudyForm.company}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="输入公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">所属行业</label>
                  <input
                    type="text"
                    value={newCaseStudyForm.industry}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="如：金融、教育、医疗"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">业务挑战</label>
                  <textarea
                    value={newCaseStudyForm.challenge}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, challenge: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="描述遇到的业务挑战"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">解决方案</label>
                  <textarea
                    value={newCaseStudyForm.solution}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, solution: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                    placeholder="描述AI解决方案"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">技术栈</label>
                  <input
                    type="text"
                    value={newCaseStudyForm.technology}
                    onChange={(e) => setNewCaseStudyForm(prev => ({ ...prev, technology: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] border-none rounded-lg text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF]"
                    placeholder="如：GPT-4 + RAG + 意图识别"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  onClick={() => { setShowAddCaseStudy(false); setNewCaseStudyForm({ title: '', company: '', industry: '', challenge: '', solution: '', technology: '' }); }}
                  className="px-4 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCaseStudy}
                  disabled={!newCaseStudyForm.title.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#8BB8E8] disabled:bg-[#D1E0FF] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedUseCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#252A33] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedUseCase.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyLabels[selectedUseCase.difficulty].bgColor} ${difficultyLabels[selectedUseCase.difficulty].color}`}>
                    {difficultyLabels[selectedUseCase.difficulty].label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUseCase(null)}
                  className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-[#8A9BB2] mb-2">所属行业</h4>
                  <span className="px-3 py-1 bg-[#A5C9FF]/20 text-[#3D6B9E] rounded-lg text-sm">{selectedUseCase.industry}</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[#8A9BB2] mb-2">场景描述</h4>
                  <p className="text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedUseCase.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FFF4E8] dark:bg-[#3D2E24] rounded-xl p-4">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-[#B56C00] mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      问题分析
                    </h4>
                    <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedUseCase.problem}</p>
                  </div>
                  <div className="bg-[#E8F5ED] dark:bg-[#243D2E] rounded-xl p-4">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-[#2E7D58] mb-3">
                      <Rocket className="w-4 h-4" />
                      解决方案
                    </h4>
                    <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">{selectedUseCase.solution}</p>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <Users className="w-4 h-4 text-[#7ED6B0]" />
                    目标用户
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.targetUsers.map((user, index) => (
                      <span key={index} className="px-3 py-1.5 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <Target className="w-4 h-4 text-[#9B8AFB]" />
                    用户需求
                  </h4>
                  <ul className="space-y-2">
                    {selectedUseCase.userNeeds.map((need, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#8A9BB2]">
                        <CheckCircle className="w-4 h-4 text-[#7ED6B0] mt-0.5 flex-shrink-0" />
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <AlertCircle className="w-4 h-4 text-[#FFB08A]" />
                    痛点分析
                  </h4>
                  <ul className="space-y-2">
                    {selectedUseCase.painPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#8A9BB2]">
                        <XCircle className="w-4 h-4 text-[#FFB08A] mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                    核心功能
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedUseCase.productFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg">
                        <Zap className="w-4 h-4 text-[#A5C9FF]" />
                        <span className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <BarChart3 className="w-4 h-4 text-[#7ED6B0]" />
                    成功指标
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.successMetrics.map((metric, index) => (
                      <span key={index} className="px-3 py-1.5 bg-[#E8F5ED] dark:bg-[#243D2E] text-[#2E7D58] rounded-lg text-sm">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <ListChecks className="w-4 h-4 text-[#A5C9FF]" />
                    实施步骤
                  </h4>
                  <ol className="space-y-2">
                    {selectedUseCase.implementationSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#8A9BB2]">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#A5C9FF] text-[#3D4A5C] rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#FFB08A]" />
                    潜在挑战
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.challenges.map((challenge, index) => (
                      <span key={index} className="px-3 py-1.5 bg-[#FFF4E8] dark:bg-[#3D2E24] text-[#B56C00] rounded-lg text-sm">
                        {challenge}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <BookOpen className="w-4 h-4 text-[#9B8AFB]" />
                    案例示例
                  </h4>
                  <ul className="space-y-2">
                    {selectedUseCase.caseExamples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#8A9BB2]">
                        <Quote className="w-4 h-4 text-[#9B8AFB] mt-0.5 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E8EEF4] dark:border-[#303841]">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                    <Cpu className="w-4 h-4 text-[#A5C9FF]" />
                    技术栈
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUseCase.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white dark:bg-[#252A33] text-[#3D4A5C] dark:text-[#E8EEF4] rounded-lg text-sm border border-[#E8EEF4] dark:border-[#303841]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  onClick={() => setSelectedUseCase(null)}
                  className="px-4 py-2 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#8BB8E8] transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
