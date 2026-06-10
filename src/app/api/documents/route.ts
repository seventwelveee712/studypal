import { NextResponse } from 'next/server';
import { getAllDocuments, deleteDocument, getDocumentById } from '@/lib/document';

export async function GET(request: Request) {
  console.log('[API/documents] GET request received');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('[API/documents] GET request params:', { id });
    
    if (id) {
      console.log('[API/documents] Fetching document by id:', id);
      const document = await getDocumentById(id);
      if (!document) {
        console.log('[API/documents] Document not found:', id);
        return NextResponse.json({ error: '文档不存在' }, { status: 404 });
      }
      console.log('[API/documents] Document found:', { id, name: document.name });
      return NextResponse.json({ document });
    }
    
    console.log('[API/documents] Fetching all documents');
    const documents = await getAllDocuments();
    console.log('[API/documents] Documents fetched successfully, count:', documents.length);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('[API/documents] GET request failed:', error);
    return NextResponse.json({ error: '获取文档列表失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  console.log('[API/documents] DELETE request received');
  try {
    const { id } = await request.json();
    console.log('[API/documents] DELETE request params:', { id });
    
    const success = await deleteDocument(id);
    console.log('[API/documents] DELETE result:', { id, success });
    return NextResponse.json({ success });
  } catch (error) {
    console.error('[API/documents] DELETE request failed:', error);
    return NextResponse.json({ error: '删除文档失败' }, { status: 500 });
  }
}
