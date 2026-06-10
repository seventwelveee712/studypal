'use client';

import { useState } from 'react';
import { Play, ChevronRight, CheckCircle, Circle, Clock, Users, Target } from 'lucide-react';
import { LearningWorkflow, LearningStep, stepTypeLabels, sampleWorkflows, executeWorkflowStep } from '@/lib/workflow';

export default function LearningWorkflowPanel() {
  const [workflows] = useState<LearningWorkflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<LearningWorkflow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectWorkflow = (workflow: LearningWorkflow) => {
    setSelectedWorkflow(workflow);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsExecuting(false);
  };

  const handleStartWorkflow = () => {
    if (!selectedWorkflow) return;
    setIsExecuting(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  const handleCompleteStep = (stepId: string, result?: unknown) => {
    if (!selectedWorkflow) return;
    
    const updatedCompleted = [...completedSteps, stepId];
    setCompletedSteps(updatedCompleted);
    
    const { nextStep, isComplete } = executeWorkflowStep(selectedWorkflow, stepId, result);
    
    if (isComplete) {
      setIsExecuting(false);
      return;
    }
    
    if (nextStep) {
      const index = selectedWorkflow.steps.findIndex(s => s.id === nextStep.id);
      setCurrentStepIndex(index);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsExecuting(false);
  };

  const currentStep = selectedWorkflow?.steps[currentStepIndex];

  return (
    <div className="bg-white dark:bg-[#252A33] rounded-2xl border border-[#E8EEF4] dark:border-[#303841] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8EEF4] dark:border-[#303841]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">🎯 学习工作流编排</h3>
          <div className="flex items-center gap-2 text-sm text-[#8A9BB2]">
            <Users className="w-4 h-4" />
            <span>智能学习路径</span>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-72 border-r border-[#E8EEF4] dark:border-[#303841] p-4">
          <h4 className="text-sm font-medium text-[#8A9BB2] mb-3">可用工作流</h4>
          <div className="space-y-2">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                onClick={() => handleSelectWorkflow(workflow)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id
                    ? 'bg-[#A5C9FF]/20 border border-[#A5C9FF]'
                    : 'bg-[#F5F7FA] dark:bg-[#2A3039] hover:bg-[#EDF1F7] dark:hover:bg-[#303841]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-[#3D4A5C] dark:text-[#E8EEF4] text-sm">
                      {workflow.name}
                    </h5>
                    <p className="text-xs text-[#8A9BB2] mt-1 line-clamp-2">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8A9BB2]">
                    <Clock className="w-3 h-3" />
                    <span>{workflow.steps.length}步</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-[#E1E7F0] dark:bg-[#303841] rounded-full text-[#8A9BB2]">
                    完成 {workflow.completedCount} 次
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6">
          {!selectedWorkflow ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Target className="w-12 h-12 text-[#E1E7F0] dark:text-[#303841]" />
              <p className="text-[#8A9BB2] mt-4">请选择一个学习工作流开始学习</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">
                    {selectedWorkflow.name}
                  </h4>
                  <p className="text-sm text-[#8A9BB2]">{selectedWorkflow.description}</p>
                </div>
                {!isExecuting ? (
                  <button
                    onClick={handleStartWorkflow}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7ED6B0] text-white rounded-lg font-medium hover:bg-[#2E7D58] transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    开始学习
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFB08A] text-white rounded-lg font-medium hover:bg-[#B56C00] transition-colors"
                  >
                    重置流程
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                {selectedWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        completedSteps.includes(step.id)
                          ? 'bg-[#7ED6B0] text-white'
                          : currentStepIndex === index && isExecuting
                          ? 'bg-[#A5C9FF] text-white'
                          : 'bg-[#E1E7F0] dark:bg-[#303841] text-[#8A9BB2]'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : currentStepIndex === index && isExecuting ? (
                        <span>{index + 1}</span>
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    {index < selectedWorkflow.steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-[#E1E7F0] dark:text-[#303841] mx-1" />
                    )}
                  </div>
                ))}
              </div>

              {isExecuting && currentStep && (
                <div className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{stepTypeLabels[currentStep.type].split(' ')[0]}</span>
                    <div>
                      <h5 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">
                        {currentStep.title}
                      </h5>
                      <span className="text-sm text-[#8A9BB2]">
                        {stepTypeLabels[currentStep.type].split(' ')[1]}
                      </span>
                    </div>
                  </div>
                  
                  {currentStep.type === 'read' && (
                    <div className="bg-white dark:bg-[#252A33] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#8A9BB2]">
                        📖 正在阅读文档：{currentStep.documentId || '学习材料'}
                      </p>
                    </div>
                  )}
                  
                  {currentStep.type === 'quiz' && (
                    <div className="bg-white dark:bg-[#252A33] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                        📝 请完成以下测验题：
                      </p>
                      <div className="space-y-2">
                        {['A. 选项一', 'B. 选项二', 'C. 选项三', 'D. 选项四'].map((option, i) => (
                          <div
                            key={i}
                            className="p-3 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg cursor-pointer hover:bg-[#EDF1F7] dark:hover:bg-[#303841] transition-colors"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentStep.type === 'summary' && (
                    <div className="bg-white dark:bg-[#252A33] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4] mb-3">
                        ✍️ 请总结本次学习内容：
                      </p>
                      <textarea
                        className="w-full p-3 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg border-none text-[#3D4A5C] dark:text-[#E8EEF4] focus:ring-2 focus:ring-[#A5C9FF] resize-none"
                        rows={3}
                        placeholder="输入你的总结..."
                      />
                    </div>
                  )}
                  
                  {currentStep.type === 'practice' && (
                    <div className="bg-white dark:bg-[#252A33] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                        🎯 实践练习：{currentStep.title}
                      </p>
                    </div>
                  )}
                  
                  {currentStep.type === 'reflection' && (
                    <div className="bg-white dark:bg-[#252A33] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                        💭 反思问题：请回顾今天的学习内容并思考...
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleCompleteStep(currentStep.id, 85)}
                    className="w-full py-3 bg-[#A5C9FF] text-[#3D4A5C] rounded-lg font-medium hover:bg-[#8BB8E8] transition-colors"
                  >
                    完成此步骤 →
                  </button>
                </div>
              )}

              {!isExecuting && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-[#8A9BB2]">学习步骤</h5>
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg">
                      <span className="text-lg">{stepTypeLabels[step.type].split(' ')[0]}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#3D4A5C] dark:text-[#E8EEF4]">
                          {step.title}
                        </p>
                        <p className="text-xs text-[#8A9BB2]">
                          第 {index + 1} 步 · {stepTypeLabels[step.type].split(' ')[1]}
                        </p>
                      </div>
                      {step.condition && (
                        <span className="text-xs px-2 py-1 bg-[#FFF4E8] dark:bg-[#3D2E24] text-[#B56C00] rounded">
                          条件分支
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}