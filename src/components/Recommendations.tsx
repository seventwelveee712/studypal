import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, AlertCircle, TrendingUp, BookOpen, Target, RotateCcw, Zap } from 'lucide-react';
import { Recommendation } from '@/lib/recommendation';

interface RecommendationsProps {
  onDocumentSelect?: (documentId: string) => void;
  onPlanSelect?: (planId: string) => void;
  onStartJournal?: () => void;
}

export default function Recommendations({ onDocumentSelect, onPlanSelect, onStartJournal }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('获取推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (rec: Recommendation) => {
    if (rec.type === 'document' && rec.relatedDocumentId && onDocumentSelect) {
      onDocumentSelect(rec.relatedDocumentId);
    } else if (rec.type === 'plan' && rec.relatedPlanId && onPlanSelect) {
      onPlanSelect(rec.relatedPlanId);
    } else if (rec.type === 'practice' && rec.title.includes('记录今日学习') && onStartJournal) {
      onStartJournal();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-[#FF6B6B] bg-[#FFF5F5]';
      case 'medium':
        return 'border-l-[#FFB08A] bg-[#FFFBF7]';
      case 'low':
      default:
        return 'border-l-[#7ED6B0] bg-[#F7FFFA]';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#FF6B6B]';
      case 'medium':
        return 'bg-[#FFB08A]';
      case 'low':
      default:
        return 'bg-[#7ED6B0]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <BookOpen className="w-5 h-5" />;
      case 'plan':
        return <Target className="w-5 h-5" />;
      case 'review':
        return <RotateCcw className="w-5 h-5" />;
      case 'skill':
        return <Zap className="w-5 h-5" />;
      case 'practice':
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-[#3D6B9E] bg-[#A5C9FF]/20';
      case 'plan':
        return 'text-[#E87D4E] bg-[#FFB08A]/20';
      case 'review':
        return 'text-[#9B8AFB] bg-[#EDE7F6]';
      case 'skill':
        return 'text-[#2E7D58] bg-[#7ED6B0]/20';
      case 'practice':
      default:
        return 'text-[#3D6B9E] bg-[#A5C9FF]/20';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#A5C9FF]/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#3D4A5C]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#3D4A5C]">智能推荐</h2>
            <p className="text-sm text-[#8A9BB2]">AI为您推荐学习内容</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-[#A5C9FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-6 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#A5C9FF] to-[#7ED6B0] rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-[#3D4A5C]">智能学习推荐</h2>
          <p className="text-sm text-[#8A9BB2]">AI根据您的学习情况为您定制建议</p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-[#D1DBE9] mx-auto mb-3" />
          <p className="text-[#8A9BB2]">暂无推荐建议</p>
          <p className="text-sm text-[#8A9BB2] mt-1">继续学习，AI会为您生成个性化建议</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={rec.id}
              onClick={() => handleRecommendationClick(rec)}
              className={`p-4 rounded-xl border-l-4 ${getPriorityColor(rec.priority)} cursor-pointer hover:shadow-md transition-all group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(rec.type)}`}>
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#3D4A5C]">{rec.title}</h3>
                    <span className={`w-2 h-2 rounded-full ${getPriorityDot(rec.priority)}`} />
                  </div>
                  <p className="text-sm text-[#8A9BB2]">{rec.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#8A9BB2] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}