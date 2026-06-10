'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, Award, Clock, Target, Play, RotateCcw, ChevronLeft, ChevronRight, Star, Shuffle, Brain } from 'lucide-react';
import { TestQuestion, EvaluationResult } from '@/lib/evaluation';
import { QuizRecord } from '@/lib/quizHistory';

export default function Evaluation() {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchQuestions = async (count: number = 10) => {
    const response = await fetch(`/api/evaluation?count=${count}`);
    const data = await response.json();
    setQuestions(data.questions || []);
    setCurrentIndex(0);
    setUserAnswers({});
    setResults([]);
    setShowResults(false);
    setShowSettings(false);
  };

  const fetchHistory = async () => {
    const response = await fetch('/api/evaluation?action=history');
    const data = await response.json();
    setHistory(data.history || []);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswers = async () => {
    setIsEvaluating(true);
    
    const newResults: EvaluationResult[] = [];
    
    for (const question of questions) {
      const userAnswer = userAnswers[question.id] || '';
      const aiAnswer = question.expectedAnswer;
      
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'evaluate', 
          data: { question, userAnswer, aiAnswer } 
        }),
      });
      
      const data = await response.json();
      if (data.result) {
        newResults.push(data.result);
      }
    }
    
    setResults(newResults);
    setIsEvaluating(false);
    setShowResults(true);
    
    await fetch('/api/evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveSession', data: newResults }),
    });
    
    await fetch('/api/quiz-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentIds: [],
        documentNames: ['AI知识评测'],
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          type: 'choice' as const,
          options: q.options,
          correctAnswer: q.expectedAnswer,
          category: q.category,
          difficulty: q.difficulty,
        })),
        userAnswers: newResults.map(r => ({
          questionId: r.questionId,
          answer: r.userAnswer,
          isCorrect: r.score >= 70,
        })),
        score: newResults.filter(r => r.score >= 70).length,
        percentage: Math.round(newResults.reduce((sum, r) => sum + r.score, 0) / questions.length),
        type: 'evaluation' as const,
      }),
    });
    
    await fetchHistory();
  };

  const handleRestart = () => {
    setShowSettings(true);
  };

  const handleStartQuiz = () => {
    fetchQuestions(questionCount);
  };

  const currentQuestion = questions[currentIndex];
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;
  const correctCount = results.filter(r => r.score >= 70).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-[#7ED6B0]/20 text-[#2E7D58]';
      case 'medium': return 'bg-[#FFB08A]/20 text-[#C76B39]';
      case 'hard': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-[#7ED6B0]';
    if (score >= 30) return 'text-[#FFB08A]';
    return 'text-red-500';
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="h-full flex flex-col bg-[#F5F7FA] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-[#E1E7F0]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#A5C9FF]/20 rounded-xl">
            <Brain className="w-6 h-6 text-[#3D6B9E]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#3D4A5C]">知识评测</h2>
            <p className="text-sm text-[#8A9BB2]">测试你的AI知识掌握程度</p>
          </div>
        </div>
        {!showSettings && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8A9BB2]">已答 {answeredCount}/{questions.length}</span>
          </div>
        )}
      </div>

      {showSettings && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] overflow-hidden">
              <div className="p-6 border-b border-[#E1E7F0] text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A5C9FF] to-[#7ED6B0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#3D4A5C] mb-2">AI知识评测</h2>
                <p className="text-[#8A9BB2]">测试您对人工智能相关知识的掌握程度</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8A9BB2] mb-2">
                    <Shuffle className="w-4 h-4 inline mr-1" />
                    题目数量
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E8EEF4] rounded-lg appearance-none cursor-pointer accent-[#A5C9FF]"
                  />
                  <div className="flex justify-between text-xs text-[#8A9BB2] mt-1">
                    <span>5题</span>
                    <span className="font-medium text-[#3D4A5C]">{questionCount}题</span>
                    <span>20题</span>
                  </div>
                </div>

                <div className="bg-[#F5F7FA] rounded-xl p-4">
                  <h4 className="font-medium text-[#3D4A5C] mb-2">题库说明</h4>
                  <ul className="space-y-1 text-sm text-[#8A9BB2]">
                    <li>• 共 48 道精选AI相关题目</li>
                    <li>• 涵盖 AI基础、机器学习、深度学习、AI应用</li>
                    <li>• 题目难度：简单/中等/困难</li>
                    <li>• 随机抽取，每次测验题目不同</li>
                  </ul>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full py-3 bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] text-white rounded-xl font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    开始评测
                  </span>
                </button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-[#E1E7F0] p-4">
                <h3 className="font-semibold text-[#3D4A5C] mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FFB08A]" />
                  最近评测记录
                </h3>
                <div className="space-y-2">
                  {history.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                      <span className="text-sm text-[#8A9BB2]">
                        {new Date(session.timestamp).toLocaleDateString('zh-CN')}
                      </span>
                      <span className={`font-bold ${
                        session.totalScore >= 70 ? 'text-[#7ED6B0]' :
                        session.totalScore >= 60 ? 'text-[#FFB08A]' : 'text-red-500'
                      }`}>
                        {session.totalScore}分
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showResults ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] p-8 text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                averageScore >= 80 ? 'bg-[#7ED6B0]/20' :
                averageScore >= 60 ? 'bg-[#FFB08A]/20' : 'bg-red-100'
              }`}>
                <Award className={`w-10 h-10 ${
                  averageScore >= 80 ? 'text-[#7ED6B0]' :
                  averageScore >= 60 ? 'text-[#FFB08A]' : 'text-red-500'
                }`} />
              </div>
              <h2 className="text-2xl font-bold text-[#3D4A5C] mb-2">评测完成！</h2>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div>
                  <p className="text-4xl font-bold text-[#A5C9FF]">{averageScore}</p>
                  <p className="text-sm text-[#8A9BB2]">平均分</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#7ED6B0]">{correctCount}</p>
                  <p className="text-sm text-[#8A9BB2]">正确题数</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#FFB08A]">{questions.length}</p>
                  <p className="text-sm text-[#8A9BB2]">总题数</p>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A5C9FF] to-[#7ED6B0] text-white rounded-xl hover:opacity-90 transition-all hover:scale-105 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">再测一次</span>
              </button>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => {
                const question = questions.find(q => q.id === result.questionId);
                return (
                  <div key={result.id} className="bg-white rounded-xl shadow-sm border border-[#E1E7F0] overflow-hidden">
                    <div className="p-4 border-b border-[#E1E7F0] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${
                          result.score >= 70 ? 'bg-[#7ED6B0]/20 text-[#2E7D58]' : 'bg-red-100 text-red-600'
                        }`}>
                          {index + 1}
                        </span>
                        {question && (
                          <>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
                            </span>
                            <span className="px-2 py-1 bg-[#E8EEF4] rounded-full text-xs text-[#8A9BB2]">
                              {question.category}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {result.score >= 70 ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7ED6B0]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                          {result.score}分
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-[#3D4A5C] mb-3">{question?.question}</p>
                      {question?.options && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {question.options.map((option, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            const isCorrect = letter === question.expectedAnswer;
                            const isUserAnswer = letter === result.userAnswer;
                            return (
                              <div key={letter} className={`p-3 rounded-lg text-sm ${
                                isCorrect ? 'bg-[#7ED6B0]/20 text-[#2E7D58]' :
                                isUserAnswer ? 'bg-red-100 text-red-600' : 'bg-[#F5F7FA] text-[#3D4A5C]'
                              }`}>
                                <span className="font-medium">{letter}.</span> {option}
                                {isCorrect && <span className="ml-2">✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#FFB08A]" />
                        <span className="text-sm text-[#3D4A5C]">{result.feedback}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : !showSettings && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7F0] overflow-hidden">
              <div className="p-4 border-b border-[#E1E7F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#A5C9FF]/20 rounded-xl flex items-center justify-center font-bold text-[#3D6B9E]">
                    {currentIndex + 1}
                  </span>
                  {currentQuestion && (
                    <>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                        {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                      <span className="px-3 py-1 bg-[#E8EEF4] rounded-full text-sm text-[#8A9BB2]">
                        {currentQuestion.category}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8A9BB2]">
                  <Clock className="w-4 h-4" />
                  <span>{currentIndex + 1}/{questions.length}</span>
                </div>
              </div>

              <div className="p-6">
                {currentQuestion && (
                  <>
                    <h3 className="text-lg font-semibold text-[#3D4A5C] mb-6">
                      {currentQuestion.question}
                    </h3>
                    {currentQuestion.options ? (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                          const letter = String.fromCharCode(65 + index);
                          const isSelected = userAnswers[currentQuestion.id] === letter;
                          return (
                            <button
                              key={letter}
                              onClick={() => handleAnswerChange(currentQuestion.id, letter)}
                              className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-[#A5C9FF]/30 border-2 border-[#A5C9FF]'
                                  : 'bg-[#F5F7FA] hover:bg-white border-2 border-transparent'
                              }`}
                            >
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                isSelected ? 'bg-[#A5C9FF] text-white' : 'bg-white text-[#8A9BB2]'
                              }`}>
                                {letter}
                              </span>
                              <span className="text-[#3D4A5C]">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        value={userAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="请输入你的回答..."
                        className="w-full h-40 p-4 bg-[#F5F7FA] border border-[#E1E7F0] rounded-xl text-[#3D4A5C] placeholder:text-[#8A9BB2] resize-none focus:outline-none focus:border-[#A5C9FF] transition-colors"
                      />
                    )}
                  </>
                )}
              </div>

              <div className="p-4 border-t border-[#E1E7F0] flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5F7FA] text-[#3D4A5C] rounded-xl hover:bg-[#E1E7F0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">上一题</span>
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitAnswers}
                    disabled={isEvaluating}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#7ED6B0] to-[#5EC79A] text-white rounded-xl hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{isEvaluating ? '评测中...' : '提交评测'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                    className="flex items-center gap-2 px-4 py-2 bg-[#A5C9FF] text-[#1E3A5F] rounded-xl hover:bg-[#8BB8E8] transition-all hover:scale-105"
                  >
                    <span className="text-sm font-medium">下一题</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-1">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    index === currentIndex
                      ? 'bg-[#A5C9FF] text-white'
                      : userAnswers[questions[index]?.id]
                        ? 'bg-[#7ED6B0] text-white'
                        : 'bg-white text-[#8A9BB2] hover:bg-[#E8EEF4]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}