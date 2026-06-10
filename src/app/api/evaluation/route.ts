import { NextResponse } from 'next/server';
import { 
  getTestQuestions, 
  evaluateAnswer, 
  saveEvaluationSession, 
  getEvaluationHistory,
  TestQuestion 
} from '@/lib/evaluation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'history') {
      const history = await getEvaluationHistory();
      return NextResponse.json({ history });
    }

    const questions = await getTestQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();

    if (action === 'evaluate') {
      const { question, userAnswer, aiAnswer } = data;
      const result = await evaluateAnswer(question as TestQuestion, userAnswer, aiAnswer);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'saveSession') {
      const session = await saveEvaluationSession(data);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ error: '无效的操作' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
