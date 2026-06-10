import { NextResponse } from 'next/server';
import { parseFile, saveDocument } from '@/lib/document';
import { addDocumentToFolder } from '@/lib/folder';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderId = formData.get('folderId') as string | null;

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = await parseFile(buffer, file.name);
    const document = await saveDocument(content, file.name);

    if (folderId) {
      await addDocumentToFolder(folderId, document.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: '文件上传成功',
      document: { id: document.id, name: document.name }
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '文件上传失败' 
    }, { status: 500 });
  }
}
