import { NextResponse } from 'next/server';
import { generateNoteSuggestions, saveSuggestion } from '@/lib/aiNoteHelper';

export async function POST(request: Request) {
  try {
    const { content, existingTags = [], noteId } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '请提供笔记内容' }, { status: 400 });
    }

    const suggestions = await generateNoteSuggestions(content, existingTags);
    
    if (noteId) {
      await saveSuggestion(noteId, suggestions);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('生成笔记建议失败:', error);
    return NextResponse.json({ suggestions: { tags: [], summary: '', keyPoints: [], relatedTopics: [] } }, { status: 500 });
  }
}