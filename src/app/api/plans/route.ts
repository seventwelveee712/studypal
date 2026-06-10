import { NextResponse } from 'next/server';
import { 
  saveStudyPlan, 
  getAllStudyPlans, 
  getStudyPlanById, 
  updateStudyPlan, 
  deleteStudyPlan, 
  toggleTask,
  parsePlanContent 
} from '@/lib/studyPlan';
import { generateStudyPlan } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const plan = await getStudyPlanById(id);
      if (!plan) {
        return NextResponse.json({ error: '学习计划不存在' }, { status: 404 });
      }
      return NextResponse.json({ plan });
    }
    
    const plans = await getAllStudyPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: '获取学习计划失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { topic, level, hoursPerDay } = await request.json();
    
    if (!topic) {
      return NextResponse.json({ error: '请输入学习主题' }, { status: 400 });
    }

    const content = await generateStudyPlan(topic, level, hoursPerDay);
    const tasks = parsePlanContent(content);
    
    const plan = await saveStudyPlan({
      topic,
      level,
      hoursPerDay,
      content,
      tasks,
      status: 'generated',
    });
    
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    return NextResponse.json({ error: '生成学习计划失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: '缺少学习计划ID' }, { status: 400 });
    }

    const plan = await updateStudyPlan(id, updates);
    if (!plan) {
      return NextResponse.json({ error: '学习计划不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    return NextResponse.json({ error: '更新学习计划失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: '缺少学习计划ID' }, { status: 400 });
    }

    const success = await deleteStudyPlan(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: '删除学习计划失败' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { planId, taskId } = await request.json();
    
    if (!planId || !taskId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const plan = await toggleTask(planId, taskId);
    if (!plan) {
      return NextResponse.json({ error: '操作失败' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
