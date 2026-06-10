import { NextResponse } from 'next/server';
import { getAllGoals, getGoalById, generatePath, getPaths, getPathById, updateStep, deletePath } from '@/lib/learningPath';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get('goalId');
  const pathId = searchParams.get('pathId');

  if (goalId) {
    const goal = getGoalById(goalId);
    if (goal) {
      return NextResponse.json({ goal });
    }
    return NextResponse.json({ error: '目标不存在' }, { status: 404 });
  }

  if (pathId) {
    const path = await getPathById(pathId);
    if (path) {
      return NextResponse.json({ path });
    }
    return NextResponse.json({ error: '学习路径不存在' }, { status: 404 });
  }

  const goals = getAllGoals();
  const paths = await getPaths();
  
  return NextResponse.json({ goals, paths });
}

export async function POST(request: Request) {
  try {
    const { goalId } = await request.json();
    
    if (!goalId) {
      return NextResponse.json({ error: '请提供目标ID' }, { status: 400 });
    }

    const path = await generatePath(goalId);
    return NextResponse.json({ path });
  } catch (error) {
    console.error('创建学习路径失败:', error);
    return NextResponse.json({ error: '创建学习路径失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { pathId, stepId, completed } = await request.json();
    
    if (!pathId || !stepId) {
      return NextResponse.json({ error: '请提供路径ID和步骤ID' }, { status: 400 });
    }

    const path = await updateStep(pathId, stepId, completed);
    if (path) {
      return NextResponse.json({ path });
    }
    return NextResponse.json({ error: '更新失败' }, { status: 404 });
  } catch (error) {
    console.error('更新步骤失败:', error);
    return NextResponse.json({ error: '更新步骤失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathId } = await request.json();
    
    if (!pathId) {
      return NextResponse.json({ error: '请提供路径ID' }, { status: 400 });
    }

    const success = await deletePath(pathId);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: '删除失败' }, { status: 404 });
  } catch (error) {
    console.error('删除路径失败:', error);
    return NextResponse.json({ error: '删除路径失败' }, { status: 500 });
  }
}