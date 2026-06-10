'use client';

import { useState, useEffect } from 'react';
import { Trophy, Lock, Share2, ChevronRight, Sparkles } from 'lucide-react';
import { Achievement, AchievementProgress } from '@/lib/achievements';

interface AchievementsPanelProps {
  onRefresh?: () => void;
}

export default function AchievementsPanel({ onRefresh }: AchievementsPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, [onRefresh]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const [achievementsRes, progressRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/achievements?type=progress'),
      ]);
      const achievementsData = await achievementsRes.json();
      const progressData = await progressRes.json();
      setAchievements(achievementsData.achievements || []);
      setProgress(progressData.progress || []);
    } catch (error) {
      console.error('获取成就数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (achievementId: string): AchievementProgress | undefined => {
    return progress.find(p => p.achievementId === achievementId);
  };

  const getProgressPercentage = (achievementId: string): number => {
    const p = getProgress(achievementId);
    if (!p) return 0;
    return Math.min(100, Math.round((p.current / p.threshold) * 100));
  };

  const handleShare = async (achievement: Achievement) => {
    const shareText = `我在 StudyPal 获得了「${achievement.title}」成就！${achievement.description}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StudyPal 学习成就',
          text: shareText,
        });
      } catch (error) {
        console.log('分享取消');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const overallProgress = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl card-shadow">
        <div className="flex items-center justify-center py-12">
          <div className="shimmer w-32 h-32 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden fade-in">
      <div className="p-6 bg-gradient-to-r from-[#FFD700]/10 to-[#FFB08A]/10 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="font-semibold text-[#3D4A5C]">学习成就</h2>
            <p className="text-sm text-[#8A9BB2]">展示你的学习成果</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#8A9BB2]">成就解锁进度</span>
            <span className="text-sm font-medium text-[#3D4A5C]">{unlockedCount} / {totalCount}</span>
          </div>
          <div className="h-3 bg-[#F5F7FA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFB08A] rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => {
            const progressData = getProgress(achievement.id);
            const percentage = getProgressPercentage(achievement.id);
            const isUnlocked = achievement.unlocked;
            
            return (
              <div 
                key={achievement.id}
                className={`relative p-4 rounded-xl border-2 transition-all-300 hover-lift ${
                  isUnlocked 
                    ? 'bg-[#FFFBEB] border-[#FFD700]/30' 
                    : 'bg-[#F5F7FA] border-transparent'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <Lock className={`w-4 h-4 flex-shrink-0 ${isUnlocked ? 'opacity-0' : 'opacity-50'}`} />
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => handleShare(achievement)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      title="分享成就"
                    >
                      <Share2 className="w-4 h-4 text-[#8A9BB2] hover:text-[#3D4A5C]" />
                    </button>
                  )}
                </div>
                
                <h3 className={`font-medium text-sm ${isUnlocked ? 'text-[#3D4A5C]' : 'text-[#8A9BB2]'}`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-[#8A9BB2] mt-1 line-clamp-2">
                  {achievement.description}
                </p>
                
                {!isUnlocked && progressData && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#8A9BB2]">进度</span>
                      <span className="text-[#3D4A5C]">{progressData.current} / {progressData.threshold}</span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#A5C9FF] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-[#FFD700] animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#3D4A5C] text-white px-6 py-3 rounded-xl shadow-lg fade-in flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          成就信息已复制到剪贴板
        </div>
      )}
    </div>
  );
}