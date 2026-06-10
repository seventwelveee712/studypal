'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, BookOpen, ChevronRight, Loader2, Check, Trash2, Edit3, Plus, Play, Pause, CheckCircle2, FileText, Calendar, BarChart3, X } from 'lucide-react';
import { StudyPlan as StudyPlanType, PlanTask } from '@/lib/studyPlan';
import { DailyRecord, JournalTask, WeeklyStats } from '@/lib/studyJournal';

type ViewMode = 'list' | 'detail';

export default function StudyPlan() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [plans, setPlans] = useState<StudyPlanType[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlanType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [journalTasks, setJournalTasks] = useState<JournalTask[]>([]);
  const [journalNotes, setJournalNotes] = useState('');
  const [studyHours, setStudyHours] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'journal' | 'stats'>('tasks');

  const levels = [
    { value: 'beginner', label: '零基础' },
    { value: 'intermediate', label: '有一定基础' },
    { value: 'advanced', label: '进阶水平' },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchDailyRecords();
      fetchWeeklyStats();
      loadTodayRecord();
    }
  }, [selectedPlan]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('获取学习计划失败:', error);
    }
  };

  const fetchDailyRecords = async () => {
    try {
      const response = await fetch(`/api/study-journal?planId=${selectedPlan?.id}`);
      const data = await response.json();
      if (data.success) {
        setDailyRecords(data.records);
      }
    } catch (error) {
      console.error('获取学习记录失败:', error);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch(`/api/study-journal?planId=${selectedPlan?.id}&action=weeklyStats`);
      const data = await response.json();
      if (data.success) {
        setWeeklyStats(data.stats);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const loadTodayRecord = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/study-journal?planId=${selectedPlan?.id}&date=${today}`);
      const data = await response.json();
      if (data.success && data.record) {
        setTodayRecord(data.record);
        setJournalTasks(data.record.tasks);
        setJournalNotes(data.record.notes);
        setStudyHours(data.record.studyHours);
      } else {
        setTodayRecord(null);
        setJournalTasks([]);
        setJournalNotes('');
        setStudyHours(0);
      }
    } catch (error) {
      console.error('加载今日记录失败:', error);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, hoursPerDay }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
        fetchPlans();
        setViewMode('detail');
      }
    } catch (error) {
      console.error('生成学习计划失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = async (planId: string, taskId: string) => {
    try {
      const response = await fetch('/api/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, taskId }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
        fetchPlans();
      }
    } catch (error) {
      console.error('打卡失败:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const response = await fetch('/api/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchPlans();
        if (selectedPlan?.id === id) {
          setSelectedPlan(null);
          setViewMode('list');
        }
      }
    } catch (error) {
      console.error('删除计划失败:', error);
    }
  };

  const startEditTask = (task: PlanTask) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditTask = async () => {
    if (!selectedPlan || !editingTaskId || !editingTaskTitle.trim()) return;
    const updatedTasks = selectedPlan.tasks.map(task =>
      task.id === editingTaskId ? { ...task, title: editingTaskTitle.trim() } : task
    );
    try {
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlan.id, updates: { tasks: updatedTasks } }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
      }
    } catch (error) {
      console.error('更新任务失败:', error);
    } finally {
      setEditingTaskId(null);
      setEditingTaskTitle('');
    }
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const addNewTask = async () => {
    if (!selectedPlan || !newTaskTitle.trim()) return;
    const newTask: PlanTask = {
      id: `new-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
    };
    const updatedTasks = [...selectedPlan.tasks, newTask];
    try {
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlan.id, updates: { tasks: updatedTasks } }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
        setNewTaskTitle('');
        setShowNewTaskInput(false);
      }
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!selectedPlan) return;
    const updatedTasks = selectedPlan.tasks.filter(task => task.id !== taskId);
    try {
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlan.id, updates: { tasks: updatedTasks } }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
      }
    } catch (error) {
      console.error('删除任务失败:', error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated': return '已生成';
      case 'executing': return '执行中';
      case 'paused': return '已暂停';
      case 'completed': return '已完成';
      case 'summary': return '已总结';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-[#FFB08A]/20 text-[#B85C38]';
      case 'executing': return 'bg-[#A5C9FF]/20 text-[#3D6B9E]';
      case 'paused': return 'bg-[#FFB08A]/20 text-[#B85C38]';
      case 'completed': return 'bg-[#7ED6B0]/20 text-[#2E7D58]';
      case 'summary': return 'bg-[#DDA0DD]/20 text-[#6B4E8E]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const addJournalTask = () => {
    const newTask: JournalTask = {
      id: `journal-${Date.now()}`,
      title: '',
      completed: false,
      category: '学习',
    };
    setJournalTasks([...journalTasks, newTask]);
  };

  const addPlanTaskToJournal = (planTask: PlanTask) => {
    if (!journalTasks.some(t => t.title === planTask.title)) {
      const newTask: JournalTask = {
        id: `journal-${Date.now()}`,
        title: planTask.title,
        completed: planTask.completed,
        category: '学习',
        planTaskId: planTask.id,
      };
      setJournalTasks([...journalTasks, newTask]);
    }
  };

  const syncJournalTaskToPlan = async (journalTask: JournalTask) => {
    if (!selectedPlan || !journalTask.planTaskId) return;
    
    const updatedTasks = selectedPlan.tasks.map(task =>
      task.id === journalTask.planTaskId 
        ? { ...task, completed: journalTask.completed }
        : task
    );
    
    try {
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlan.id, updates: { tasks: updatedTasks } }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPlan(data.plan);
      }
    } catch (error) {
      console.error('同步任务状态失败:', error);
    }
  };

  const updateJournalTask = (taskId: string, field: keyof JournalTask, value: string | boolean) => {
    const task = journalTasks.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    setJournalTasks(journalTasks.map(task =>
      task.id === taskId ? { ...task, [field]: value } : task
    ));
    
    if (field === 'completed' && wasCompleted !== value && task?.planTaskId) {
      syncJournalTaskToPlan({ ...task, completed: value as boolean });
    }
  };

  const deleteJournalTask = (taskId: string) => {
    setJournalTasks(journalTasks.filter(task => task.id !== taskId));
  };

  const saveDailyRecord = async () => {
    if (!selectedPlan) return;
    const recordData = {
      planId: selectedPlan.id,
      planTitle: selectedPlan.topic,
      date: selectedDate,
      tasks: journalTasks.filter(t => t.title.trim()),
      notes: journalNotes,
      studyHours,
    };
    try {
      if (todayRecord) {
        await fetch('/api/study-journal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: todayRecord.id, updates: recordData }),
        });
      } else {
        await fetch('/api/study-journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recordData),
        });
      }
      fetchDailyRecords();
      fetchWeeklyStats();
      loadTodayRecord();
    } catch (error) {
      console.error('保存每日记录失败:', error);
    }
  };

  const selectDateRecord = async (date: string) => {
    setSelectedDate(date);
    try {
      const response = await fetch(`/api/study-journal?planId=${selectedPlan?.id}&date=${date}`);
      const data = await response.json();
      if (data.success && data.record) {
        setJournalTasks(data.record.tasks);
        setJournalNotes(data.record.notes);
        setStudyHours(data.record.studyHours);
      } else {
        setJournalTasks([]);
        setJournalNotes('');
        setStudyHours(0);
      }
    } catch (error) {
      console.error('加载记录失败:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays: { date: string; day: number; currentMonth: boolean; hasRecord: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ date: '', day: 0, currentMonth: false, hasRecord: false });
    }
    for (let i = 1; i <= days; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasRecord = dailyRecords.some(r => r.date === dateStr);
      calendarDays.push({ date: dateStr, day: i, currentMonth: true, hasRecord });
    }
    return calendarDays;
  };

  const maxStudyHours = weeklyStats?.dailyData.reduce((max, d) => Math.max(max, d.studyHours), 0) || 1;

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden fade-in">
          <div className="px-6 py-4 border-b bg-[#F5F7FA]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A5C9FF]/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-[#3D4A5C]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#3D4A5C]">学习计划生成器</h2>
                <p className="text-sm text-[#8A9BB2]">AI 为您定制专属学习路径</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#8A9BB2] mb-2">学习主题</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：Python 编程、机器学习"
                  className="w-full px-4 py-3 bg-[#F5F7FA] border-none rounded-xl text-[#3D4A5C] placeholder:text-[#8A9BB2]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A9BB2] mb-2">当前水平</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F7FA] border-none rounded-xl text-[#3D4A5C] focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                >
                  {levels.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A9BB2] mb-2">每日学习时间（小时）</label>
                <input
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Math.max(0.5, Math.min(8, parseFloat(e.target.value) || 0)))}
                  min="0.5"
                  max="8"
                  step="0.5"
                  className="w-full px-4 py-3 bg-[#F5F7FA] border-none rounded-xl text-[#3D4A5C] focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full py-3 bg-[#A5C9FF] text-[#3D4A5C] rounded-xl font-medium hover:bg-[#A5C9FF]/80 disabled:bg-[#D1E0FF] transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  生成学习计划
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {(viewMode === 'list' || viewMode === 'detail') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl card-shadow p-6 fade-in">
            {viewMode === 'detail' && (
              <button
                onClick={() => { setViewMode('list'); setSelectedPlan(null); }}
                className="mb-4 flex items-center gap-2 text-[#8A9BB2] hover:text-[#3D4A5C] transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                返回列表
              </button>
            )}
            <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#A5C9FF]" />
              {viewMode === 'list' ? '我的学习计划' : '其他计划'}
            </h3>

            {plans.length === 0 ? (
              <div className="text-center py-8 text-[#8A9BB2]">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无学习计划</p>
                {viewMode === 'list' && <p className="text-sm">点击上方按钮生成</p>}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => { setSelectedPlan(plan); setViewMode('detail'); }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'bg-[#A5C9FF]/20 border-2 border-[#A5C9FF]'
                        : 'bg-[#F5F7FA] hover:bg-white hover:card-shadow-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-[#3D4A5C] truncate">{plan.topic}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(plan.status)}`}>
                            {getStatusText(plan.status)}
                          </span>
                          <span className="text-xs text-[#8A9BB2]">
                            {plan.tasks.filter(t => t.completed).length}/{plan.tasks.length} 完成
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                        className="p-1 text-[#8A9BB2] opacity-0 hover:opacity-100 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPlan && viewMode === 'detail' && (
            <div className="lg:col-span-2 bg-white rounded-2xl card-shadow overflow-hidden fade-in">
              <div className="px-6 py-4 border-b bg-[#F5F7FA]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#3D4A5C]">{selectedPlan.topic}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedPlan.status)}`}>
                        {getStatusText(selectedPlan.status)}
                      </span>
                      <span className="text-xs text-[#8A9BB2]">
                        <Clock className="w-3 h-3 inline mr-1" />
                        每日 {selectedPlan.hoursPerDay} 小时
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPlan.status === 'generated' && (
                      <button
                        onClick={() => {
                          fetch('/api/plans', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedPlan.id, updates: { status: 'executing' } }),
                          }).then(() => {
                            setSelectedPlan({ ...selectedPlan, status: 'executing' });
                            fetchPlans();
                          });
                        }}
                        className="px-4 py-2 bg-[#7ED6B0] text-[#2E7D58] rounded-lg font-medium hover:bg-[#7ED6B0]/80 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        开始执行
                      </button>
                    )}
                    {selectedPlan.status === 'executing' && (
                      <>
                        <button
                          onClick={() => {
                            fetch('/api/plans', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedPlan.id, updates: { status: 'paused' } }),
                            }).then(() => {
                              setSelectedPlan({ ...selectedPlan, status: 'paused' });
                              fetchPlans();
                            });
                          }}
                          className="px-4 py-2 bg-[#FFB08A] text-[#B85C38] rounded-lg font-medium hover:bg-[#FFB08A]/80 transition-colors flex items-center gap-2"
                        >
                          <Pause className="w-4 h-4" />
                          暂停
                        </button>
                        <button
                          onClick={() => {
                            fetch('/api/plans', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedPlan.id, updates: { status: 'completed' } }),
                            }).then(() => {
                              setSelectedPlan({ ...selectedPlan, status: 'completed' });
                              fetchPlans();
                            });
                          }}
                          className="px-4 py-2 bg-[#7ED6B0] text-[#2E7D58] rounded-lg font-medium hover:bg-[#7ED6B0]/80 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          结束计划
                        </button>
                      </>
                    )}
                    {selectedPlan.status === 'paused' && (
                      <button
                        onClick={() => {
                          fetch('/api/plans', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedPlan.id, updates: { status: 'executing' } }),
                          }).then(() => {
                            setSelectedPlan({ ...selectedPlan, status: 'executing' });
                            fetchPlans();
                          });
                        }}
                        className="px-4 py-2 bg-[#7ED6B0] text-[#2E7D58] rounded-lg font-medium hover:bg-[#7ED6B0]/80 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        继续执行
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 py-3 text-center font-medium transition-colors ${
                      activeTab === 'tasks' ? 'text-[#3D4A5C] border-b-2 border-[#A5C9FF]' : 'text-[#8A9BB2] hover:text-[#3D4A5C]'
                    }`}
                  >
                    学习任务
                  </button>
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`flex-1 py-3 text-center font-medium transition-colors ${
                      activeTab === 'journal' ? 'text-[#3D4A5C] border-b-2 border-[#A5C9FF]' : 'text-[#8A9BB2] hover:text-[#3D4A5C]'
                    }`}
                  >
                    每日记录
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-3 text-center font-medium transition-colors ${
                      activeTab === 'stats' ? 'text-[#3D4A5C] border-b-2 border-[#A5C9FF]' : 'text-[#8A9BB2] hover:text-[#3D4A5C]'
                    }`}
                  >
                    学习统计
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'tasks' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-[#8A9BB2]">学习任务</h4>
                        <button
                          onClick={() => setShowNewTaskInput(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#7ED6B0] text-[#2E7D58] rounded-lg text-sm font-medium hover:bg-[#7ED6B0]/80 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          新建任务
                        </button>
                      </div>

                      {selectedPlan.tasks.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-[#8A9BB2]" />
                          </div>
                          <p className="text-[#8A9BB2] mb-2">暂无学习任务</p>
                          <p className="text-sm text-[#B8C4D4]">点击上方"新建任务"按钮添加学习任务</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedPlan.tasks.map(task => (
                            <div
                              key={task.id}
                              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                                task.completed ? 'bg-[#7ED6B0]/10' : 'bg-[#F5F7FA]'
                              }`}
                            >
                              <button
                                onClick={() => handleTaskToggle(selectedPlan.id, task.id)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                  task.completed
                                    ? 'bg-[#7ED6B0] text-white'
                                    : 'border-2 border-[#D1E0FF] text-[#8A9BB2] hover:border-[#A5C9FF]'
                                }`}
                                title={task.completed ? '标记为未完成' : '标记为完成'}
                              >
                                {task.completed && <Check className="w-4 h-4" />}
                              </button>

                              {editingTaskId === task.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingTaskTitle}
                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white border border-[#A5C9FF] rounded-lg text-[#3D4A5C] focus:outline-none"
                                    autoFocus
                                    onKeyPress={(e) => e.key === 'Enter' && saveEditTask()}
                                  />
                                  <button
                                    onClick={saveEditTask}
                                    className="p-2 text-[#7ED6B0] hover:bg-[#7ED6B0]/10 rounded-lg transition-colors"
                                    title="保存"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditTask}
                                    className="p-2 text-[#FFB08A] hover:bg-[#FFB08A]/10 rounded-lg transition-colors"
                                    title="取消"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className={`flex-1 ${task.completed ? 'line-through text-[#8A9BB2]' : 'text-[#3D4A5C]'}`}>
                                    {task.title}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => addPlanTaskToJournal(task)}
                                      className="p-2 text-[#7ED6B0] hover:text-[#2E7D58] hover:bg-[#7ED6B0]/10 rounded-lg transition-colors"
                                      title="添加到今日清单"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => startEditTask(task)}
                                      className="p-2 text-[#8A9BB2] hover:text-[#3D4A5C] hover:bg-[#EDF1F7] rounded-lg transition-colors"
                                      title="编辑"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="p-2 text-[#8A9BB2] hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                      title="删除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {showNewTaskInput && (
                        <div className="mt-4 p-4 bg-[#F5F7FA] rounded-xl border-2 border-dashed border-[#A5C9FF]">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              placeholder="输入新任务标题..."
                              className="flex-1 px-3 py-2 bg-white border border-[#E8EEF4] rounded-lg text-[#3D4A5C] placeholder:text-[#8A9BB2] focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                            />
                            <button
                              onClick={addNewTask}
                              disabled={!newTaskTitle.trim()}
                              className="px-4 py-2 bg-[#7ED6B0] text-white rounded-lg font-medium hover:bg-[#7ED6B0]/80 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              确定
                            </button>
                            <button
                              onClick={() => { setShowNewTaskInput(false); setNewTaskTitle(''); }}
                              className="px-3 py-2 text-[#8A9BB2] hover:text-[#3D4A5C] hover:bg-white rounded-lg transition-colors"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-[#F5F7FA] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#8A9BB2]">完成进度</span>
                        <span className="text-sm font-medium text-[#3D4A5C]">
                          {selectedPlan.tasks.filter(t => t.completed).length} / {selectedPlan.tasks.length}
                        </span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] rounded-full transition-all duration-500"
                          style={{ width: `${selectedPlan.tasks.length > 0 ? (selectedPlan.tasks.filter(t => t.completed).length / selectedPlan.tasks.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'journal' && (
                  <div>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {getDaysInMonth().map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day.currentMonth && selectDateRecord(day.date)}
                          disabled={!day.currentMonth}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                            !day.currentMonth ? 'bg-transparent text-transparent' :
                            selectedDate === day.date ? 'bg-[#A5C9FF] text-white' :
                            day.hasRecord ? 'bg-[#7ED6B0]/20 text-[#2E7D58]' :
                            'bg-[#F5F7FA] text-[#8A9BB2] hover:bg-white'
                          }`}
                        >
                          {day.day}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#8A9BB2]">今日学习清单</h4>
                        <button
                          onClick={addJournalTask}
                          className="flex items-center gap-1 text-sm text-[#A5C9FF] hover:text-[#3D6B9E]"
                        >
                          <Plus className="w-4 h-4" />
                          添加任务
                        </button>
                      </div>

                      <div className="space-y-2">
                        {journalTasks.map(task => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-xl">
                            <button
                              onClick={() => updateJournalTask(task.id, 'completed', !task.completed)}
                              className={`w-6 h-6 rounded flex items-center justify-center ${
                                task.completed ? 'bg-[#7ED6B0] text-white' : 'bg-white border-2 border-[#D1E0FF]'
                              }`}
                            >
                              {task.completed ? <Check className="w-4 h-4" /> : null}
                            </button>
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => updateJournalTask(task.id, 'title', e.target.value)}
                              placeholder="输入学习任务..."
                              className="flex-1 bg-transparent border-none text-[#3D4A5C] placeholder:text-[#8A9BB2] focus:outline-none"
                            />
                            <button
                              onClick={() => deleteJournalTask(task.id)}
                              className="p-1 text-[#8A9BB2] hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8A9BB2] mb-2">学习时长（小时）</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={studyHours}
                            onChange={(e) => setStudyHours(Math.max(0, parseFloat(e.target.value) || 0))}
                            min="0"
                            step="0.5"
                            className="w-24 px-3 py-2 bg-[#F5F7FA] border-none rounded-lg text-[#3D4A5C] focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                          />
                          <span className="text-sm text-[#8A9BB2]">小时</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#8A9BB2] mb-2">学习笔记</label>
                        <textarea
                          value={journalNotes}
                          onChange={(e) => setJournalNotes(e.target.value)}
                          placeholder="记录今天的学习心得..."
                          className="w-full h-24 p-3 bg-[#F5F7FA] border-none rounded-xl text-[#3D4A5C] placeholder:text-[#8A9BB2] resize-none focus:outline-none focus:ring-2 focus:ring-[#A5C9FF]"
                        />
                      </div>

                      <button
                        onClick={saveDailyRecord}
                        className="w-full py-3 bg-[#7ED6B0] text-[#2E7D58] rounded-xl font-medium hover:bg-[#7ED6B0]/80 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        保存今日记录
                      </button>
                    </div>

                    {dailyRecords.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-[#8A9BB2] mb-3">历史记录</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {dailyRecords.slice(0, 5).map(record => (
                            <button
                              key={record.id}
                              onClick={() => selectDateRecord(record.date)}
                              className="w-full p-3 bg-[#F5F7FA] rounded-xl text-left hover:bg-white transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[#3D4A5C]">{record.date}</span>
                                <span className="text-sm text-[#8A9BB2]">
                                  {record.studyHours}h · {record.tasks.filter(t => t.completed).length}/{record.tasks.length}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && weeklyStats && (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#A5C9FF]">{weeklyStats.totalStudyHours.toFixed(1)}</p>
                        <p className="text-sm text-[#8A9BB2]">本周学习时长</p>
                      </div>
                      <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#7ED6B0]">{weeklyStats.totalCompletedTasks}</p>
                        <p className="text-sm text-[#8A9BB2]">完成任务数</p>
                      </div>
                      <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#FFB08A]">
                          {weeklyStats.totalTasks > 0 ? Math.round((weeklyStats.totalCompletedTasks / weeklyStats.totalTasks) * 100) : 0}%
                        </p>
                        <p className="text-sm text-[#8A9BB2]">完成率</p>
                      </div>
                    </div>

                    <div className="bg-[#F5F7FA] rounded-xl p-4">
                      <h4 className="text-sm font-medium text-[#8A9BB2] mb-4">每日学习时长</h4>
                      <div className="flex items-end justify-between h-40 gap-2">
                        {weeklyStats.dailyData.map((day, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <span className="text-xs text-[#8A9BB2] mb-1">{day.studyHours}h</span>
                            <div className="w-full bg-white rounded-t-lg transition-all duration-500" style={{ height: '120px' }}>
                              <div
                                className="w-full bg-gradient-to-t from-[#A5C9FF] to-[#7ED6B0] rounded-t-lg transition-all duration-500"
                                style={{ height: maxStudyHours > 0 ? `${(day.studyHours / maxStudyHours) * 100}%` : '0%' }}
                              />
                            </div>
                            <span className="text-xs text-[#8A9BB2] mt-2">{day.dayName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}