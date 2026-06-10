import { NextResponse } from 'next/server';
import { callAI, Message } from '@/lib/ai';
import { getDocumentById, getAllDocuments } from '@/lib/document';

interface ChatRequest {
  messages: Message[];
  documentId?: string;
}

export async function POST(request: Request) {
  try {
    const { messages, documentId } = await request.json() as ChatRequest;
    
    let context = '';
    
    if (documentId) {
      const document = await getDocumentById(documentId);
      if (document) {
        context = document.content.substring(0, 8000);
      }
    } else {
      const documents = await getAllDocuments();
      if (documents.length > 0) {
        context = documents.map(d => d.content).join('\n\n').substring(0, 8000);
      }
    }

    const response = await callAI(messages, context);
    
    return NextResponse.json({ success: true, answer: response });
  } catch (error) {
    console.error('聊天接口失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '聊天失败' 
    }, { status: 500 });
  }
}
