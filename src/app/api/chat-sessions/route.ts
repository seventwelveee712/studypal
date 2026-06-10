import { NextResponse } from 'next/server';
import { 
  createChatSession, 
  getAllChatSessions, 
  getChatSessionById, 
  addMessageToSession, 
  deleteChatSession 
} from '@/lib/chatHistory';
import { callAI } from '@/lib/ai';
import { getDocumentById, getAllDocuments } from '@/lib/document';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const session = await getChatSessionById(id);
      if (!session) {
        return NextResponse.json({ error: '会话不存在' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }
    
    const sessions = await getAllChatSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: '获取会话失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, documentId } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: '请输入会话标题' }, { status: 400 });
    }

    const session = await createChatSession(title, documentId);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ error: '创建会话失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { sessionId, message } = await request.json();
    
    if (!sessionId || !message) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    await addMessageToSession(sessionId, message);
    
    let context = '';
    const session = await getChatSessionById(sessionId);
    
    if (session?.documentId) {
      const document = await getDocumentById(session.documentId);
      if (document) {
        context = document.content.substring(0, 8000);
      }
    } else {
      const documents = await getAllDocuments();
      if (documents.length > 0) {
        context = documents.map(d => d.content).join('\n\n').substring(0, 8000);
      }
    }

    const aiResponse = await callAI([{ role: 'user', content: message.content }], context);
    await addMessageToSession(sessionId, { role: 'assistant', content: aiResponse });
    
    const updatedSession = await getChatSessionById(sessionId);
    
    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    return NextResponse.json({ error: '发送消息失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: '缺少会话ID' }, { status: 400 });
    }

    const success = await deleteChatSession(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: '删除会话失败' }, { status: 500 });
  }
}
