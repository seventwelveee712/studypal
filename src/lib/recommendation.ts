import fs from 'fs';
import path from 'path';
import { Document } from './document';
import { StudyPlan } from './studyPlan';
import { DailyRecord } from './studyJournal';
import { QuizRecord } from './quizHistory';

export interface Recommendation {
  id: string;
  type: 'document' | 'plan' | 'review' | 'skill' | 'practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  score: number;
  relatedDocumentId?: string;
  relatedPlanId?: string;
  icon: string;
}

export interface UserProfile {
  interests: string[];
  weakAreas: string[];
  learningGoals: string[];
  preferredTime: string;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
}

const DATA_DIR = path.join(process.cwd(), 'data', 'recommendations');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function generateRecommendations(
  documents: Document[],
  plans: StudyPlan[],
  journalRecords: DailyRecord[],
  quizRecords: QuizRecord[]
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const studyHours = journalRecords.reduce((sum, record) => sum + record.studyHours, 0);
  const completedTasks = journalRecords.reduce((sum, record) => 
    sum + record.tasks.filter(t => t.completed).length, 0
  );
  const totalTasks = journalRecords.reduce((sum, record) => sum + record.tasks.length, 0);

  const recentRecords = journalRecords.filter(r => {
    const recordDate = new Date(r.date);
    return now.getTime() - recordDate.getTime() < 7 * 24 * 60 * 60 * 1000;
  });
  const weeklyStudyHours = recentRecords.reduce((sum, r) => sum + r.studyHours, 0);

  if (weeklyStudyHours < 5) {
    recommendations.push({
      id: `rec-${Date.now()}-1`,
      type: 'skill',
      title: '增加学习时长',
      description: `本周学习时长为${weeklyStudyHours.toFixed(1)}小时，建议每天至少学习1小时以保持学习节奏`,
      priority: 'high',
      score: 95,
      icon: '⏰',
    });
  }

  if (totalTasks > 0 && completedTasks / totalTasks < 0.7) {
    recommendations.push({
      id: `rec-${Date.now()}-2`,
      type: 'practice',
      title: '提高任务完成率',
      description: `任务完成率为${Math.round((completedTasks / totalTasks) * 100)}%，建议优先完成计划中的核心任务`,
      priority: 'medium',
      score: 85,
      icon: '✅',
    });
  }

  const unreadDocs = documents.filter(d => !d.lastReadAt || new Date(d.lastReadAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  if (unreadDocs.length > 0) {
    const doc = unreadDocs[0];
    recommendations.push({
      id: `rec-${Date.now()}-3`,
      type: 'document',
      title: `继续阅读「${doc.name}」`,
      description: `您有${unreadDocs.length}个文档待阅读，建议优先完成这些内容`,
      priority: 'high',
      score: 90,
      relatedDocumentId: doc.id,
      icon: '📚',
    });
  }

  const overduePlans = plans.filter(p => {
    if (!p.endDate) return false;
    return new Date(p.endDate) < now && p.status !== 'completed';
  });
  if (overduePlans.length > 0) {
    const plan = overduePlans[0];
    recommendations.push({
      id: `rec-${Date.now()}-4`,
      type: 'plan',
      title: `完成过期计划「${plan.topic}」`,
      description: `您有${overduePlans.length}个计划已过期，请及时处理`,
      priority: 'high',
      score: 88,
      relatedPlanId: plan.id,
      icon: '🎯',
    });
  }

  const lowScoreQuizzes = quizRecords.filter(q => q.percentage < 70);
  if (lowScoreQuizzes.length > 0) {
    const quiz = lowScoreQuizzes[lowScoreQuizzes.length - 1];
    recommendations.push({
      id: `rec-${Date.now()}-5`,
      type: 'review',
      title: '复习薄弱知识点',
      description: `最近测验得分${quiz.percentage}%，建议回顾「${quiz.documentNames.join('、')}」中的相关内容`,
      priority: 'high',
      score: 92,
      icon: '🔄',
    });
  }

  const streak = calculateStreak(journalRecords);
  if (streak > 0 && streak < 7) {
    recommendations.push({
      id: `rec-${Date.now()}-6`,
      type: 'skill',
      title: '保持学习连续性',
      description: `已连续学习${streak}天，再坚持${7 - streak}天即可解锁「七日连续」成就!`,
      priority: 'medium',
      score: 80,
      icon: '🔥',
    });
  }

  const avgDailyHours = studyHours / Math.max(journalRecords.length, 1);
  if (avgDailyHours > 3) {
    recommendations.push({
      id: `rec-${Date.now()}-7`,
      type: 'skill',
      title: '注意学习休息',
      description: `日均学习${avgDailyHours.toFixed(1)}小时，建议适当休息，保持高效学习状态`,
      priority: 'low',
      score: 60,
      icon: '😴',
    });
  }

  const todayRecord = journalRecords.find(r => r.date === today);
  if (!todayRecord) {
    recommendations.push({
      id: `rec-${Date.now()}-8`,
      type: 'practice',
      title: '记录今日学习',
      description: '今天还没有记录学习情况，点击下方按钮开始记录',
      priority: 'high',
      score: 85,
      icon: '📝',
    });
  }

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 6);
}

function calculateStreak(records: DailyRecord[]): number {
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
}

export async function saveRecommendations(recommendations: Recommendation[]): Promise<void> {
  const filePath = path.join(DATA_DIR, `recommendations-${Date.now()}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(recommendations, null, 2));
}

export async function getRecentRecommendations(): Promise<Recommendation[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const recFiles = files.filter(f => f.startsWith('recommendations-')).sort().reverse();
    
    if (recFiles.length === 0) return [];
    
    const latestFile = recFiles[0];
    const filePath = path.join(DATA_DIR, latestFile);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    
    return JSON.parse(content);
  } catch {
    return [];
  }
}