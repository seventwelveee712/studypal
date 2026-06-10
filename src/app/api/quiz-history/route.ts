import { NextResponse } from 'next/server';
import { saveQuizRecord, getAllQuizRecords, getQuizRecordById, deleteQuizRecord, QuizRecord } from '@/lib/quizHistory';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const record = await getQuizRecordById(id);
      if (!record) {
        return NextResponse.json({ error: '记录不存在' }, { status: 404 });
      }
      return NextResponse.json({ success: true, record });
    }

    const records = await getAllQuizRecords();
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('获取测验记录失败:', error);
    return NextResponse.json({ error: '获取记录失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<QuizRecord, 'id' | 'createdAt'> = await request.json();
    const record = await saveQuizRecord(body);
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('保存测验记录失败:', error);
    return NextResponse.json({ error: '保存记录失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = await deleteQuizRecord(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('删除测验记录失败:', error);
    return NextResponse.json({ error: '删除记录失败' }, { status: 500 });
  }
}