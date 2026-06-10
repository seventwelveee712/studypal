import { useState, useEffect } from 'react';
import { Compass, Target, CheckCircle2, Circle, BookOpen, Clock, Zap, ChevronRight, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { LearningGoal, LearningPath, LearningStep } from '@/lib/learningPath';

type ViewMode = 'goals' | 'paths';

export default function LearningPathPlanner() {
  const [viewMode, setViewMode] = useState<ViewMode>('goals');
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/learning-path');
      const data = await response.json();
      setGoals(data.goals || []);
      setPaths(data.paths || []);
    } catch (error) {
      console.error('获取学习路径数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePath = async (goalId: string) => {
    try {
      const response = await fetch('/api/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId })
      });
      const data = await response.json();
      if (data.path) {
        setPaths(prev => [data.path, ...prev]);
        setSelectedPath(data.path);
        setViewMode('paths');
      }
    } catch (error) {
      console.error('创建学习路径失败:', error);
    }
  };

  const handleToggleStep = async (pathId: string, stepId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/learning-path', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId, stepId, completed: !completed })
      });
      const data = await response.json();
      if (data.path) {
        setPaths(prev => prev.map(p => p.id === pathId ? data.path : p));
        if (selectedPath?.id === pathId) {
          setSelectedPath(data.path);
        }
      }
    } catch (error) {
      console.error('更新步骤状态失败:', error);
    }
  };

  const handleDeletePath = async (pathId: string) => {
    if (!confirm('确定要删除这条学习路径吗？')) return;
    
    try {
      await fetch('/api/learning-path', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId })
      });
      setPaths(prev => prev.filter(p => p.id !== pathId));
      if (selectedPath?.id === pathId) {
        setSelectedPath(null);
      }
    } catch (error) {
      console.error('删除学习路径失败:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      case 'expert':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'beginner':
        return '入门';
      case 'intermediate':
        return '进阶';
      case 'advanced':
        return '高级';
      case 'expert':
        return '专家';
      default:
        return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '📈';
      case 'advanced':
        return '⚡';
      case 'expert':
        return '🏆';
      default:
        return '📚';
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-700';
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'course':
        return 'bg-green-100 text-green-700';
      case 'book':
        return 'bg-purple-100 text-purple-700';
      case 'tool':
        return 'bg-orange-100 text-orange-700';
      case 'documentation':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📄';
      case 'video':
        return '🎬';
      case 'course':
        return '📚';
      case 'book':
        return '📖';
      case 'tool':
        return '🛠️';
      case 'documentation':
        return '📋';
      default:
        return '🔗';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#A5C9FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F7FA] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-[#E1E7F0]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#A5C9FF] to-[#7ED6B0] rounded-xl">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#3D4A5C]">学习路径规划</h2>
            <p className="text-sm text-[#8A9BB2]">选择目标，开启你的学习之旅</p>
          </div>
        </div>
        <div className="flex bg-[#E8EEF4] rounded-xl p-1">
          <button
            onClick={() => setViewMode('goals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'goals' ? 'bg-white text-[#3D4A5C] shadow-sm' : 'text-[#8A9BB2]'}`}
          >
            学习目标
          </button>
          <button
            onClick={() => setViewMode('paths')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'paths' ? 'bg-white text-[#3D4A5C] shadow-sm' : 'text-[#8A9BB2]'}`}
          >
            我的路径
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <div
                key={goal.id}
                className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] p-6 hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                    {getCategoryLabel(goal.category)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-[#3D4A5C] mb-2">{goal.title}</h3>
                <p className="text-sm text-[#8A9BB2] mb-4 line-clamp-2">{goal.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-[#8A9BB2] mb-4">
                  <Clock className="w-4 h-4" />
                  <span>预计学习时长: {goal.estimatedHours}小时</span>
                </div>

                {goal.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#8A9BB2] mb-2">前置要求:</p>
                    <div className="flex flex-wrap gap-2">
                      {goal.prerequisites.map(preReqId => {
                        const preReq = goals.find(g => g.id === preReqId);
                        return preReq ? (
                          <span key={preReqId} className="px-2 py-1 bg-[#FFF5F5] text-[#E87D4E] text-xs rounded-full">
                            {preReq.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs text-[#8A9BB2] mb-2">技能标签:</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-[#F5F7FA] text-[#3D4A5C] text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCreatePath(goal.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  开始学习
                </button>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'paths' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {paths.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] p-8 text-center">
                  <Compass className="w-12 h-12 text-[#D1DBE9] mx-auto mb-4" />
                  <h3 className="font-semibold text-[#3D4A5C] mb-2">暂无学习路径</h3>
                  <p className="text-sm text-[#8A9BB2] mb-4">从学习目标页面选择一个目标开始</p>
                  <button
                    onClick={() => setViewMode('goals')}
                    className="px-4 py-2 bg-[#A5C9FF] text-[#1E3A5F] rounded-xl hover:bg-[#8BB8E8] font-medium"
                  >
                    浏览目标
                  </button>
                </div>
              ) : (
                paths.map(path => (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPath(path)}
                    className={`bg-white rounded-2xl shadow-sm border cursor-pointer transition-all p-5 ${selectedPath?.id === path.id ? 'border-[#A5C9FF] bg-[#EFF6FF]' : 'border-[#E1E7F0] hover:shadow-md'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[#3D4A5C]">{path.goalTitle}</h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePath(path.id); }}
                        className="p-1 text-[#8A9BB2] hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#8A9BB2]">学习进度</span>
                        <span className="font-medium text-[#3D4A5C]">{path.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#E8EEF4] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] rounded-full transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8A9BB2]">
                      <Target className="w-3 h-3" />
                      <span>{path.steps.filter(s => s.completed).length}/{path.steps.length} 步骤完成</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedPath ? (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] overflow-hidden">
                  <div className="p-6 border-b border-[#E1E7F0]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#3D4A5C]">{selectedPath.goalTitle}</h2>
                        <p className="text-sm text-[#8A9BB2] mt-1">
                          已完成 {selectedPath.steps.filter(s => s.completed).length} / {selectedPath.steps.length} 个步骤
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-[#A5C9FF]">{selectedPath.progress}%</span>
                        <span className="text-sm text-[#8A9BB2]">完成</span>
                      </div>
                    </div>
                    <div className="mt-4 h-3 bg-[#E8EEF4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] rounded-full transition-all duration-500"
                        style={{ width: `${selectedPath.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      学习步骤
                    </h3>
                    
                    <div className="space-y-3">
                      {selectedPath.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`border rounded-xl overflow-hidden transition-all ${step.completed ? 'border-[#7ED6B0] bg-[#F7FFFA]' : 'border-[#E1E7F0] bg-white'}`}
                        >
                          <div
                            className="flex items-center gap-4 p-4 cursor-pointer"
                            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-[#7ED6B0] text-white' : 'bg-[#E8EEF4] text-[#8A9BB2]'}`}>
                                {step.completed ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <span className="font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${step.completed ? 'text-[#2E7D58]' : 'text-[#3D4A5C]'}`}>
                                  {step.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="flex items-center gap-1 text-xs text-[#8A9BB2]">
                                    <Clock className="w-3 h-3" />
                                    {step.estimatedHours}小时
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleStep(selectedPath.id, step.id, step.completed); }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${step.completed ? 'bg-[#FFF5F5] text-[#E87D4E] hover:bg-red-50' : 'bg-[#A5C9FF]/10 text-[#3D6B9E] hover:bg-[#A5C9FF]/20'}`}
                            >
                              {step.completed ? '标记未完成' : '标记完成'}
                            </button>

                            <ChevronRight className={`w-5 h-5 text-[#8A9BB2] transition-transform ${expandedStep === step.id ? 'rotate-90' : ''}`} />
                          </div>

                          {expandedStep === step.id && (
                            <div className="px-4 pb-4 pt-0">
                              <div className="ml-13 pl-13">
                                <p className="text-sm text-[#8A9BB2] mt-2 mb-4">{step.description}</p>
                                
                                {step.resources.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-[#3D4A5C] mb-3">推荐资源:</p>
                                    <div className="space-y-2">
                                      {step.resources.map((resource) => (
                                        <a
                                          key={resource.id}
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-start gap-3 p-3 bg-[#F5F7FA] rounded-xl hover:bg-[#EDF1F7] transition-colors group cursor-pointer"
                                        >
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getResourceTypeColor(resource.type)}`}>
                                            <span className="text-sm">{getResourceTypeIcon(resource.type)}</span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#3D4A5C] group-hover:text-[#3D6B9E] truncate">
                                              {resource.title}
                                            </p>
                                            <p className="text-xs text-[#8A9BB2] mt-1 line-clamp-2">
                                              {resource.description}
                                            </p>
                                          </div>
                                          <ArrowRight className="w-4 h-4 text-[#8A9BB2] group-hover:text-[#3D6B9E] flex-shrink-0" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedPath.progress === 100 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF5F5] to-[#F7FFFA] rounded-xl text-center">
                        <Zap className="w-12 h-12 text-[#FFD700] mx-auto mb-2" />
                        <h4 className="font-bold text-[#3D4A5C]">🎉 恭喜完成!</h4>
                        <p className="text-sm text-[#8A9BB2]">你已经完成了这条学习路径的所有步骤</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] p-12 text-center">
                  <Target className="w-16 h-16 text-[#D1DBE9] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#3D4A5C] mb-2">选择一个学习路径</h3>
                  <p className="text-[#8A9BB2]">从左侧列表选择一条学习路径查看详情</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}