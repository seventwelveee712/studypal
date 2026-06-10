import { useState, useEffect } from 'react';
import { BarChart3, BookOpen, Clock, TrendingUp, Target, Award, FileText, MessageSquare, CheckCircle2, ChevronRight, Brain, Calendar, Clock4, Trophy, Sparkles } from 'lucide-react';
import { Document } from '@/lib/document';
import { StudyPlan } from '@/lib/studyPlan';
import { ChatSession } from '@/lib/chatHistory';
import { QuizRecord } from '@/lib/quizHistory';
import { DailyRecord } from '@/lib/studyJournal';
import { Achievement } from '@/lib/achievements';
import { Note } from '@/lib/notes';
import Recommendations from './Recommendations';
import AchievementsPanel from './AchievementsPanel';

interface Activity {
  id: string;
  type: 'upload' | 'chat' | 'plan' | 'task' | 'note' | 'quiz' | 'journal';
  title: string;
  detail: string;
  time: string;
}

interface DashboardProps {
  documents: Document[];
  plans: StudyPlan[];
  sessions: ChatSession[];
  onDocumentSelect?: (documentId: string) => void;
  onPlanSelect?: (planId: string) => void;
  onStartJournal?: () => void;
}

export default function Dashboard({ onDocumentSelect, onPlanSelect, onStartJournal }: DashboardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    documents: 0,
    plans: 0,
    completedTasks: 0,
    chatMessages: 0,
    notes: 0,
    quizzes: 0,
    journalDays: 0,
    totalStudyHours: 0,
    achievements: 0,
    maxStreak: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState<{ dailyData: { date: string; dayName: string; studyHours: number; completedTasks: number; totalTasks: number }[]; totalStudyHours: number; totalCompletedTasks: number; totalTasks: number } | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsRes, plansRes, sessionsRes, notesRes, quizRes, journalRes, weeklyRes, achievementRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/plans'),
        fetch('/api/chat-sessions'),
        fetch('/api/notes'),
        fetch('/api/quiz-history'),
        fetch('/api/study-journal'),
        fetch('/api/study-journal?action=weeklyStats'),
        fetch('/api/achievements'),
      ]);

      const docs: Document[] = (await docsRes.json()).documents || [];
      const plans: StudyPlan[] = (await plansRes.json()).plans || [];
      const sessions: ChatSession[] = (await sessionsRes.json()).sessions || [];
      const notes: Note[] = (await notesRes.json()).notes || [];
      const quizRecords: QuizRecord[] = (await quizRes.json()).records || [];
      const journalRecords: DailyRecord[] = (await journalRes.json()).records || [];
      const weeklyData = (await weeklyRes.json()).stats || null;
      const userAchievements: Achievement[] = (await achievementRes.json()).achievements || [];

      const completedTasks = plans.reduce((sum: number, plan: StudyPlan) => 
        sum + plan.tasks.filter(t => t.completed).length, 0
      );

      const chatMessages = sessions.reduce((sum: number, session: ChatSession) => 
        sum + session.messages.length, 0
      );

      const totalStudyHours = journalRecords.reduce((sum: number, record: DailyRecord) => 
        sum + record.studyHours, 0
      );

      const maxStreak = calculateStreak(journalRecords);

      setWeeklyStats(weeklyData);
      setAchievements(userAchievements);

      setStats({
        documents: docs.length,
        plans: plans.length,
        completedTasks,
        chatMessages,
        notes: notes.length,
        quizzes: quizRecords.length,
        journalDays: journalRecords.length,
        totalStudyHours,
        achievements: userAchievements.length,
        maxStreak,
      });

      checkNewAchievements(docs.length, quizRecords.length, journalRecords.length, plans.length, maxStreak, totalStudyHours, userAchievements);

      const newActivities: Activity[] = [];

      docs.slice(-3).forEach(doc => {
        newActivities.push({
          id: `doc-${doc.id}`,
          type: 'upload',
          title: '上传了文档',
          detail: doc.name,
          time: formatTime(new Date(doc.createdAt)),
        });
      });

      plans.slice(-3).forEach(plan => {
        newActivities.push({
          id: `plan-${plan.id}`,
          type: 'plan',
          title: '创建了学习计划',
          detail: plan.topic,
          time: formatTime(new Date(plan.createdAt)),
        });
      });

      sessions.slice(-3).forEach(session => {
        newActivities.push({
          id: `chat-${session.id}`,
          type: 'chat',
          title: '进行了对话',
          detail: session.title,
          time: formatTime(new Date(session.updatedAt || session.createdAt)),
        });
      });

      notes.slice(-3).forEach(note => {
        newActivities.push({
          id: `note-${note.id}`,
          type: 'note',
          title: '创建了笔记',
          detail: note.title,
          time: formatTime(new Date(note.createdAt)),
        });
      });

      quizRecords.slice(-3).forEach((record: QuizRecord) => {
        newActivities.push({
          id: `quiz-${record.id}`,
          type: 'quiz',
          title: '完成了文档测验',
          detail: `${record.documentNames.join('、')} (得分: ${record.percentage}%)`,
          time: formatTime(new Date(record.createdAt)),
        });
      });

      journalRecords.slice(-3).forEach((record: DailyRecord) => {
        const completedCount = record.tasks.filter(t => t.completed).length;
        const totalCount = record.tasks.length;
        newActivities.push({
          id: `journal-${record.id}`,
          type: 'journal',
          title: '完成了每日记录',
          detail: `${record.planTitle} · ${record.studyHours}h · ${completedCount}/${totalCount}任务`,
          time: formatTime(new Date(record.createdAt)),
        });
      });

      setActivities(newActivities.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8));
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  const calculateStreak = (records: DailyRecord[]): number => {
    if (records.length === 0) return 0;
    
    const dates = records.map(r => r.date).sort((a, b) => b.localeCompare(a));
    let streak = 1;
    
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }
    
    return streak;
  };

  const checkNewAchievements = async (
    documentCount: number,
    quizCount: number,
    journalDays: number,
    planCount: number,
    maxStreak: number,
    totalStudyHours: number,
    existingAchievements: Achievement[]
  ) => {
    const allAchievements = [
      { id: 'first_doc', title: '初入知识海洋', description: '上传第一个文档', icon: '📚', threshold: 1 },
      { id: 'doc_collector', title: '文档收藏家', description: '累计上传10个文档', icon: '📖', threshold: 10 },
      { id: 'quiz_master', title: '测验达人', description: '完成5次测验', icon: '🏆', threshold: 5 },
      { id: 'journal_keeper', title: '记录者', description: '坚持记录7天', icon: '📝', threshold: 7 },
      { id: 'journal_pro', title: '记录专家', description: '累计记录30天', icon: '📔', threshold: 30 },
      { id: 'plan_maker', title: '规划师', description: '创建第一个学习计划', icon: '🎯', threshold: 1 },
      { id: 'plan_expert', title: '计划大师', description: '完成3个学习计划', icon: '🌟', threshold: 3 },
      { id: 'streak_7', title: '七日连续', description: '连续学习7天', icon: '🔥', threshold: 7 },
      { id: 'streak_30', title: '月度坚持', description: '连续学习30天', icon: '🔥', threshold: 30 },
      { id: 'study_hours', title: '时间管理者', description: '累计学习100小时', icon: '⏰', threshold: 100 },
    ];

    for (const achievement of allAchievements) {
      if (existingAchievements.find(a => a.id === achievement.id)) continue;

      let shouldUnlock = false;
      switch (achievement.id) {
        case 'first_doc':
          shouldUnlock = documentCount >= 1;
          break;
        case 'doc_collector':
          shouldUnlock = documentCount >= 10;
          break;
        case 'quiz_master':
          shouldUnlock = quizCount >= 5;
          break;
        case 'journal_keeper':
          shouldUnlock = journalDays >= 7;
          break;
        case 'journal_pro':
          shouldUnlock = journalDays >= 30;
          break;
        case 'plan_maker':
          shouldUnlock = planCount >= 1;
          break;
        case 'plan_expert':
          shouldUnlock = planCount >= 3;
          break;
        case 'streak_7':
          shouldUnlock = maxStreak >= 7;
          break;
        case 'streak_30':
          shouldUnlock = maxStreak >= 30;
          break;
        case 'study_hours':
          shouldUnlock = totalStudyHours >= 100;
          break;
      }

      if (shouldUnlock) {
        const newAch: Achievement = {
          ...achievement,
          type: 'document',
          threshold: achievement.threshold,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        setNewAchievement(newAch);
        setShowAchievementModal(true);
        
        await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAch),
        });
        
        break;
      }
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  const chartData = weeklyStats?.dailyData || [
    { date: '', dayName: '周一', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周二', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周三', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周四', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周五', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周六', studyHours: 0, completedTasks: 0, totalTasks: 0 },
    { date: '', dayName: '周日', studyHours: 0, completedTasks: 0, totalTasks: 0 },
  ];

  const maxHours = Math.max(...chartData.map(d => d.studyHours), 1);

  const statsArray = [
    { icon: BookOpen, label: '已学习文档', value: stats.documents, color: '#A5C9FF', bgColor: 'bg-[#A5C9FF]/10' },
    { icon: FileText, label: '学习笔记', value: stats.notes, color: '#7ED6B0', bgColor: 'bg-[#7ED6B0]/10' },
    { icon: Target, label: '完成任务', value: stats.completedTasks, color: '#FFB08A', bgColor: 'bg-[#FFB08A]/10' },
    { icon: Brain, label: '完成测验', value: stats.quizzes, color: '#9B8AFB', bgColor: 'bg-[#9B8AFB]/10' },
    { icon: Calendar, label: '记录天数', value: stats.journalDays, color: '#FFB08A', bgColor: 'bg-[#FFB08A]/10' },
    { icon: Clock4, label: '累计学时', value: `${stats.totalStudyHours.toFixed(1)}h`, color: '#A5C9FF', bgColor: 'bg-[#A5C9FF]/10' },
    { icon: Trophy, label: '获得成就', value: stats.achievements, color: '#FFD700', bgColor: 'bg-yellow-100' },
    { icon: Sparkles, label: '连续学习', value: `${stats.maxStreak}天`, color: '#FF6B6B', bgColor: 'bg-red-50' },
  ];

  const handleActivityClick = (activity: Activity) => {
    console.log('Clicked activity:', activity);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#A5C9FF]/20 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#3D4A5C]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#3D4A5C]">学习统计</h2>
            <p className="text-sm text-[#8A9BB2]">学习概览</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {statsArray.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-[#F5F7FA] rounded-xl p-4 hover-lift hover:shadow-md cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110`}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-[#3D4A5C] transition-all duration-200">{stat.value}</p>
                <p className="text-sm text-[#8A9BB2]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
          <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            我的成就
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.slice(0, 6).map(achievement => (
              <div key={achievement.id} className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <p className="text-3xl mb-2">{achievement.icon}</p>
                <p className="font-medium text-[#3D4A5C] text-sm">{achievement.title}</p>
                <p className="text-xs text-[#8A9BB2] mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Recommendations 
          onDocumentSelect={onDocumentSelect}
          onPlanSelect={onPlanSelect}
          onStartJournal={onStartJournal}
        />
        <AchievementsPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
          <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#7ED6B0]" />
            本周学习时长
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-end gap-1">
                  <span className="text-xs text-[#8A9BB2]">{data.studyHours}h</span>
                  <div className="w-full bg-[#E8EEF4] rounded-t-lg transition-all duration-500" style={{ height: '160px' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-[#A5C9FF] to-[#7ED6B0] rounded-t-lg transition-all duration-500"
                      style={{ height: `${(data.studyHours / maxHours) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-[#8A9BB2] mt-2">{data.dayName}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
          <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#7ED6B0]" />
            任务完成情况
          </h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-[#8A9BB2] w-12">{data.dayName}</span>
                <div className="flex-1 h-2 bg-[#E8EEF4] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7ED6B0] rounded-full transition-all duration-500"
                    style={{ width: data.totalTasks > 0 ? `${(data.completedTasks / data.totalTasks) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm font-medium text-[#3D4A5C]">{data.completedTasks}/{data.totalTasks}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
        <h3 className="font-semibold text-[#3D4A5C] mb-4 flex items-center justify-between">
          <span>最近活动</span>
          <button className="text-sm text-[#A5C9FF] hover:text-[#3D6B9E] flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-[#8A9BB2]">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无活动记录</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="flex items-center gap-3 p-4 bg-[#F5F7FA] rounded-xl hover:bg-white hover:card-shadow-hover transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'upload' ? 'bg-[#A5C9FF]/20' :
                  activity.type === 'chat' ? 'bg-[#7ED6B0]/20' :
                  activity.type === 'plan' ? 'bg-[#FFB08A]/20' :
                  activity.type === 'note' ? 'bg-[#9B8AFB]/20' :
                  activity.type === 'quiz' ? 'bg-purple-100' :
                  activity.type === 'journal' ? 'bg-[#7ED6B0]/20' :
                  'bg-[#DDA0DD]/20'
                }`}>
                  {activity.type === 'upload' && <FileText className="w-5 h-5 text-[#A5C9FF]" />}
                  {activity.type === 'chat' && <MessageSquare className="w-5 h-5 text-[#7ED6B0]" />}
                  {activity.type === 'plan' && <Target className="w-5 h-5 text-[#FFB08A]" />}
                  {activity.type === 'note' && <FileText className="w-5 h-5 text-[#9B8AFB]" />}
                  {activity.type === 'quiz' && <Brain className="w-5 h-5 text-purple-500" />}
                  {activity.type === 'journal' && <Calendar className="w-5 h-5 text-[#7ED6B0]" />}
                  {activity.type === 'task' && <CheckCircle2 className="w-5 h-5 text-[#DDA0DD]" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3D4A5C]">{activity.title}</p>
                  <p className="text-sm text-[#8A9BB2] truncate">{activity.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A9BB2]">{activity.time}</span>
                  <ChevronRight className="w-4 h-4 text-[#8A9BB2] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAchievementModal && newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAchievementModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in">
            <div className="text-6xl mb-4">{newAchievement.icon}</div>
            <h3 className="text-xl font-bold text-[#3D4A5C] mb-2">恭喜解锁成就!</h3>
            <p className="text-lg text-[#3D4A5C] mb-1">{newAchievement.title}</p>
            <p className="text-sm text-[#8A9BB2] mb-6">{newAchievement.description}</p>
            <button
              onClick={() => setShowAchievementModal(false)}
              className="px-6 py-2 bg-[#7ED6B0] text-[#2E7D58] rounded-xl font-medium hover:bg-[#7ED6B0]/80 transition-colors"
            >
              太棒了!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}