import { NextResponse } from 'next/server';
import { 
  saveNote, 
  getAllNotes, 
  getNoteById, 
  updateNote, 
  deleteNote,
  searchNotes,
  getAllTags
} from '@/lib/notes';

export async function GET(request: Request) {
  console.log('[API/notes] GET request received');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const query = searchParams.get('q');
    console.log('[API/notes] GET request params:', { id, query });
    
    if (id) {
      console.log('[API/notes] Fetching note by id:', id);
      const note = await getNoteById(id);
      if (!note) {
        console.log('[API/notes] Note not found:', id);
        return NextResponse.json({ error: '笔记不存在' }, { status: 404 });
      }
      console.log('[API/notes] Note found:', { id, title: note.title });
      return NextResponse.json({ note });
    }
    
    if (query) {
      console.log('[API/notes] Searching notes with query:', query);
      const notes = await searchNotes(query);
      console.log('[API/notes] Search completed, found:', notes.length, 'notes');
      return NextResponse.json({ notes });
    }
    
    console.log('[API/notes] Fetching all notes');
    const notes = await getAllNotes();
    console.log('[API/notes] Notes fetched successfully, count:', notes.length);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('[API/notes] GET request failed:', error);
    return NextResponse.json({ error: '获取笔记失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('[API/notes] POST request received');
  try {
    const { title, content, tags } = await request.json();
    console.log('[API/notes] POST request body:', { title, tags: tags?.length });
    
    if (!title || !content) {
      console.log('[API/notes] POST validation failed: missing title or content');
      return NextResponse.json({ error: '请输入标题和内容' }, { status: 400 });
    }

    const note = await saveNote({
      title,
      content,
      tags: tags || [],
    });
    console.log('[API/notes] Note created successfully:', { id: note.id, title: note.title });
    
    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('[API/notes] POST request failed:', error);
    return NextResponse.json({ error: '创建笔记失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  console.log('[API/notes] PUT request received');
  try {
    const { id, updates } = await request.json();
    console.log('[API/notes] PUT request body:', { id, updates: Object.keys(updates) });
    
    if (!id) {
      console.log('[API/notes] PUT validation failed: missing id');
      return NextResponse.json({ error: '缺少笔记ID' }, { status: 400 });
    }

    const note = await updateNote(id, updates);
    if (!note) {
      console.log('[API/notes] PUT failed: note not found:', id);
      return NextResponse.json({ error: '笔记不存在' }, { status: 404 });
    }
    console.log('[API/notes] Note updated successfully:', { id, title: note.title });
    
    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('[API/notes] PUT request failed:', error);
    return NextResponse.json({ error: '更新笔记失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  console.log('[API/notes] DELETE request received');
  try {
    const { id } = await request.json();
    console.log('[API/notes] DELETE request body:', { id });
    
    if (!id) {
      console.log('[API/notes] DELETE validation failed: missing id');
      return NextResponse.json({ error: '缺少笔记ID' }, { status: 400 });
    }

    const success = await deleteNote(id);
    console.log('[API/notes] DELETE result:', { id, success });
    return NextResponse.json({ success });
  } catch (error) {
    console.error('[API/notes] DELETE request failed:', error);
    return NextResponse.json({ error: '删除笔记失败' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  console.log('[API/notes] PATCH request received (get all tags)');
  try {
    const response = await getAllTags();
    console.log('[API/notes] Tags fetched successfully, count:', response.length);
    return NextResponse.json({ tags: response });
  } catch (error) {
    console.error('[API/notes] PATCH request failed:', error);
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 });
  }
}
