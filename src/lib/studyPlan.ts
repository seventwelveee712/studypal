import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface PlanTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface StudyPlan {
  id: string;
  topic: string;
  level: string;
  hoursPerDay: number;
  content: string;
  tasks: PlanTask[];
  status: 'generated' | 'executing' | 'paused' | 'completed' | 'summary';
  createdAt: Date;
  updatedAt: Date;
  endDate?: Date;
}

const PLANS_DIR = path.join(process.cwd(), 'data', 'plans');

if (!fs.existsSync(PLANS_DIR)) {
  fs.mkdirSync(PLANS_DIR, { recursive: true });
}

export async function saveStudyPlan(plan: Omit<StudyPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudyPlan> {
  const newPlan: StudyPlan = {
    ...plan,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const filePath = path.join(PLANS_DIR, `${newPlan.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(newPlan, null, 2));
  
  return newPlan;
}

export async function getAllStudyPlans(): Promise<StudyPlan[]> {
  try {
    const files = await fs.promises.readdir(PLANS_DIR);
    const plans: StudyPlan[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(PLANS_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const plan = JSON.parse(content);
        plans.push(plan);
      }
    }

    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('读取学习计划失败:', error);
    return [];
  }
}

export async function getStudyPlanById(id: string): Promise<StudyPlan | null> {
  try {
    const filePath = path.join(PLANS_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取学习计划失败:', error);
    return null;
  }
}

export async function updateStudyPlan(id: string, updates: Partial<StudyPlan>): Promise<StudyPlan | null> {
  try {
    const plan = await getStudyPlanById(id);
    if (!plan) return null;

    const updatedPlan: StudyPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date(),
    };

    const filePath = path.join(PLANS_DIR, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(updatedPlan, null, 2));
    
    return updatedPlan;
  } catch (error) {
    console.error('更新学习计划失败:', error);
    return null;
  }
}

export async function toggleTask(planId: string, taskId: string): Promise<StudyPlan | null> {
  const plan = await getStudyPlanById(planId);
  if (!plan) return null;

  const updatedTasks = plan.tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : undefined,
      };
    }
    return task;
  });

  const completedCount = updatedTasks.filter(t => t.completed).length;
  let newStatus: StudyPlan['status'] = plan.status;
  
  if (completedCount === 0) {
    newStatus = 'generated';
  } else if (completedCount === updatedTasks.length) {
    newStatus = 'completed';
  } else {
    newStatus = 'executing';
  }

  return updateStudyPlan(planId, { tasks: updatedTasks, status: newStatus });
}

export async function deleteStudyPlan(id: string): Promise<boolean> {
  try {
    const filePath = path.join(PLANS_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除学习计划失败:', error);
    return false;
  }
}

export function parsePlanContent(content: string): PlanTask[] {
  const lines = content.split('\n');
  const tasks: PlanTask[] = [];
  
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s+(.+)/);
    if (match) {
      tasks.push({
        id: uuidv4(),
        title: match[1].trim(),
        completed: false,
      });
    }
  });

  return tasks;
}
