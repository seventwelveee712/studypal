import { NextResponse } from 'next/server';
import { saveDailyRecord, getDailyRecords, getDailyRecordByDate, updateDailyRecord, deleteDailyRecord, getWeeklyStats, DailyRecord } from '@/lib/studyJournal';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');
    const date = searchParams.get('date');
    const action = searchParams.get('action');

    if (action === 'weeklyStats') {
      const stats = await getWeeklyStats(planId || undefined);
      return NextResponse.json({ success: true, stats });
    }

    if (planId && date) {
      const record = await getDailyRecordByDate(planId, date);
      return NextResponse.json({ success: true, record });
    }

    const records = await getDailyRecords(planId || undefined);
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('获取学习日记失败:', error);
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<DailyRecord, 'id' | 'createdAt'> = await request.json();
    const record = await saveDailyRecord(body);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('保存学习日记失败:', error);
    return NextResponse.json({ error: '保存记录失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    const record = await updateDailyRecord(id, updates);
    if (!record) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 });
    }
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('更新学习日记失败:', error);
    return NextResponse.json({ error: '更新记录失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = await deleteDailyRecord(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('删除学习日记失败:', error);
    return NextResponse.json({ error: '删除记录失败' }, { status: 500 });
  }
}