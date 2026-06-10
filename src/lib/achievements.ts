import fs from 'fs';
import path from 'path';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'document' | 'quiz' | 'journal' | 'plan' | 'streak';
  threshold: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserAchievements {
  unlocked: Achievement[];
  progress: AchievementProgress[];
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  threshold: number;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'achievements');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_doc', title: '初入知识海洋', description: '上传第一个文档', icon: '📚', type: 'document', threshold: 1, unlocked: false },
  { id: 'doc_collector', title: '文档收藏家', description: '累计上传10个文档', icon: '📖', type: 'document', threshold: 10, unlocked: false },
  { id: 'quiz_master', title: '测验达人', description: '完成5次测验', icon: '🏆', type: 'quiz', threshold: 5, unlocked: false },
  { id: 'perfect_score', title: '满分学霸', description: '测验获得满分', icon: '💯', type: 'quiz', threshold: 100, unlocked: false },
  { id: 'journal_keeper', title: '记录者', description: '坚持记录7天', icon: '📝', type: 'journal', threshold: 7, unlocked: false },
  { id: 'journal_pro', title: '记录专家', description: '累计记录30天', icon: '📔', type: 'journal', threshold: 30, unlocked: false },
  { id: 'plan_maker', title: '规划师', description: '创建第一个学习计划', icon: '🎯', type: 'plan', threshold: 1, unlocked: false },
  { id: 'plan_expert', title: '计划大师', description: '完成3个学习计划', icon: '🌟', type: 'plan', threshold: 3, unlocked: false },
  { id: 'streak_7', title: '七日连续', description: '连续学习7天', icon: '🔥', type: 'streak', threshold: 7, unlocked: false },
  { id: 'streak_30', title: '月度坚持', description: '连续学习30天', icon: '🔥', type: 'streak', threshold: 30, unlocked: false },
  { id: 'study_hours', title: '时间管理者', description: '累计学习100小时', icon: '⏰', type: 'journal', threshold: 100, unlocked: false },
];

export function getAllAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS;
}

export async function checkAndUnlockAchievements(
  documentCount: number,
  quizCount: number,
  journalDays: number,
  planCount: number,
  maxStreak: number,
  totalStudyHours: number,
  perfectScore?: boolean
): Promise<Achievement[]> {
  const unlockedAchievements: Achievement[] = [];
  const existing = await getUnlockedAchievements();
  
  for (const achievement of ALL_ACHIEVEMENTS) {
    if (existing.find(a => a.id === achievement.id)) continue;
    
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
      case 'perfect_score':
        shouldUnlock = perfectScore === true;
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
      const unlocked = { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
      unlockedAchievements.push(unlocked);
      await saveAchievement(unlocked);
    }
  }
  
  return unlockedAchievements;
}

async function saveAchievement(achievement: Achievement): Promise<void> {
  const filePath = path.join(DATA_DIR, `${achievement.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(achievement, null, 2));
}

export async function getUnlockedAchievements(): Promise<Achievement[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const achievements: Achievement[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          achievements.push(JSON.parse(content));
        } catch {
          continue;
        }
      }
    }
    
    return achievements.sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime());
  } catch {
    return [];
  }
}

export async function calculateProgress(
  documentCount: number,
  quizCount: number,
  journalDays: number,
  planCount: number,
  maxStreak: number,
  totalStudyHours: number
): Promise<AchievementProgress[]> {
  const existing = await getUnlockedAchievements();
  const progress: AchievementProgress[] = [];
  
  for (const achievement of ALL_ACHIEVEMENTS) {
    if (existing.find(a => a.id === achievement.id)) continue;
    
    let current = 0;
    switch (achievement.id) {
      case 'first_doc':
      case 'doc_collector':
        current = documentCount;
        break;
      case 'quiz_master':
        current = quizCount;
        break;
      case 'journal_keeper':
      case 'journal_pro':
        current = journalDays;
        break;
      case 'plan_maker':
      case 'plan_expert':
        current = planCount;
        break;
      case 'streak_7':
      case 'streak_30':
        current = maxStreak;
        break;
      case 'study_hours':
        current = totalStudyHours;
        break;
      case 'perfect_score':
        current = 0;
        break;
    }
    
    progress.push({
      achievementId: achievement.id,
      current,
      threshold: achievement.threshold,
    });
  }
  
  return progress;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}