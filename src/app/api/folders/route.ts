import { NextResponse } from 'next/server';
import { 
  createFolder, 
  getAllFolders, 
  getFolderById, 
  updateFolder, 
  deleteFolder,
  addDocumentToFolder,
  removeDocumentFromFolder
} from '@/lib/folder';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const folder = await getFolderById(id);
      if (!folder) {
        return NextResponse.json({ error: '文件夹不存在' }, { status: 404 });
      }
      return NextResponse.json({ folder });
    }
    
    const folders = await getAllFolders();
    return NextResponse.json({ folders });
  } catch (error) {
    return NextResponse.json({ error: '获取文件夹失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: '请输入文件夹名称' }, { status: 400 });
    }

    const folder = await createFolder(name);
    return NextResponse.json({ success: true, folder });
  } catch (error) {
    return NextResponse.json({ error: '创建文件夹失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: '缺少文件夹ID' }, { status: 400 });
    }

    const folder = await updateFolder(id, updates);
    if (!folder) {
      return NextResponse.json({ error: '文件夹不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, folder });
  } catch (error) {
    return NextResponse.json({ error: '更新文件夹失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: '缺少文件夹ID' }, { status: 400 });
    }

    const success = await deleteFolder(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: '删除文件夹失败' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { folderId, documentId, action } = await request.json();
    
    if (!folderId || !documentId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    let success = false;
    if (action === 'add') {
      success = await addDocumentToFolder(folderId, documentId);
    } else if (action === 'remove') {
      success = await removeDocumentFromFolder(folderId, documentId);
    }
    
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
