import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Achievement } from '@/lib/achievements';

const DATA_DIR = path.join(process.cwd(), 'data', 'achievements');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET() {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const achievements: Achievement[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          achievements.push(JSON.parse(content));
        } catch {
          continue;
        }
      }
    }
    
    achievements.sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime());
    
    return NextResponse.json({ success: true, achievements });
  } catch (error) {
    console.error('获取成就失败:', error);
    return NextResponse.json({ error: '获取成就失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const achievement: Achievement = await request.json();
    
    const filePath = path.join(DATA_DIR, `${achievement.id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(achievement, null, 2));
    
    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    console.error('保存成就失败:', error);
    return NextResponse.json({ error: '保存成就失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除成就失败:', error);
    return NextResponse.json({ error: '删除成就失败' }, { status: 500 });
  }
}