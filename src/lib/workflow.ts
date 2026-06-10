export interface LearningStep {
  id: string;
  type: 'read' | 'quiz' | 'summary' | 'practice' | 'reflection';
  title: string;
  content?: string;
  documentId?: string;
  nextStepId?: string;
  condition?: {
    type: 'score' | 'time' | 'completion';
    threshold: number;
    passStepId: string;
    failStepId: string;
  };
}

export interface LearningWorkflow {
  id: string;
  name: string;
  description: string;
  steps: LearningStep[];
  createdAt: Date;
  completedCount: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  currentStepId: string;
  progress: number;
  completedSteps: string[];
  results: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
}

export const stepTypeLabels: Record<string, string> = {
  read: '📖 阅读',
  quiz: '📝 测验',
  summary: '✍️ 总结',
  practice: '🎯 练习',
  reflection: '💭 反思'
};

export const sampleWorkflows: LearningWorkflow[] = [
  {
    id: 'wf1',
    name: 'AI基础概念学习',
    description: '从LLM基础到RAG应用的完整学习路径',
    steps: [
      {
        id: 's1',
        type: 'read',
        title: '阅读LLM基础文档',
        documentId: 'doc-llm-basics'
      },
      {
        id: 's2',
        type: 'quiz',
        title: 'LLM知识测验',
        nextStepId: 's3'
      },
      {
        id: 's3',
        type: 'summary',
        title: '总结学习要点',
        nextStepId: 's4'
      },
      {
        id: 's4',
        type: 'practice',
        title: '尝试构建简单Prompt',
        nextStepId: 's5'
      },
      {
        id: 's5',
        type: 'reflection',
        title: '学习反思与计划'
      }
    ],
    createdAt: new Date('2024-01-15'),
    completedCount: 128
  },
  {
    id: 'wf2',
    name: 'RAG实战学习',
    description: '文档检索增强生成技术实战',
    steps: [
      {
        id: 'r1',
        type: 'read',
        title: 'RAG原理介绍',
        documentId: 'doc-rag-intro'
      },
      {
        id: 'r2',
        type: 'practice',
        title: '上传文档进行检索测试',
        nextStepId: 'r3'
      },
      {
        id: 'r3',
        type: 'quiz',
        title: 'RAG配置优化测验',
        condition: {
          type: 'score',
          threshold: 80,
          passStepId: 'r4',
          failStepId: 'r1'
        }
      },
      {
        id: 'r4',
        type: 'summary',
        title: 'RAG实战总结'
      }
    ],
    createdAt: new Date('2024-01-20'),
    completedCount: 89
  }
];

export function executeWorkflowStep(workflow: LearningWorkflow, currentStepId: string, result?: unknown): {
  nextStep: LearningStep | null;
  isComplete: boolean;
} {
  const currentStep = workflow.steps.find(s => s.id === currentStepId);
  if (!currentStep) {
    return { nextStep: null, isComplete: true };
  }

  if (currentStep.condition && result !== undefined) {
    const score = typeof result === 'number' ? result : 0;
    const targetStepId = score >= currentStep.condition.threshold 
      ? currentStep.condition.passStepId 
      : currentStep.condition.failStepId;
    const nextStep = workflow.steps.find(s => s.id === targetStepId);
    return { nextStep: nextStep || null, isComplete: !nextStep };
  }

  if (currentStep.nextStepId) {
    const nextStep = workflow.steps.find(s => s.id === currentStep.nextStepId);
    return { nextStep: nextStep || null, isComplete: !nextStep };
  }

  return { nextStep: null, isComplete: true };
}