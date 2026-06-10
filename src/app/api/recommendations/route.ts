import { NextResponse } from 'next/server';
import { generateRecommendations, saveRecommendations } from '@/lib/recommendation';
import { getAllDocuments } from '@/lib/document';
import { getAllStudyPlans } from '@/lib/studyPlan';
import { getDailyRecords } from '@/lib/studyJournal';
import { getAllQuizRecords } from '@/lib/quizHistory';

export async function GET() {
  try {
    const [documents, plans, journalRecords, quizRecords] = await Promise.all([
      getAllDocuments(),
      getAllStudyPlans(),
      getDailyRecords(),
      getAllQuizRecords(),
    ]);

    const recommendations = await generateRecommendations(
      documents,
      plans,
      journalRecords,
      quizRecords
    );

    await saveRecommendations(recommendations);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('生成推荐失败:', error);
    return NextResponse.json({ recommendations: [] }, { status: 500 });
  }
}