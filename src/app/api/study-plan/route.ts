import { NextResponse } from 'next/server';
import { generateStudyPlan } from '@/lib/ai';

interface StudyPlanRequest {
  topic: string;
  level: string;
  hoursPerDay: number;
}

export async function POST(request: Request) {
  try {
    const { topic, level, hoursPerDay } = await request.json() as StudyPlanRequest;
    
    if (!topic) {
      return NextResponse.json({ error: '请输入学习主题' }, { status: 400 });
    }

    const plan = await generateStudyPlan(topic, level, hoursPerDay);
    
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('生成学习计划失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '生成学习计划失败' 
    }, { status: 500 });
  }
}
