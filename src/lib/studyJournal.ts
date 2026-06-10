import fs from 'fs';
import path from 'path';

export interface DailyRecord {
  id: string;
  planId: string;
  planTitle: string;
  date: string;
  tasks: JournalTask[];
  notes: string;
  studyHours: number;
  createdAt: string;
}

export interface JournalTask {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  planTaskId?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'studyJournal');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function saveDailyRecord(record: Omit<DailyRecord, 'id' | 'createdAt'>): Promise<DailyRecord> {
  const id = `${record.date}-${record.planId}-${Date.now()}`;
  const newRecord: DailyRecord = {
    ...record,
    id,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(newRecord, null, 2));

  return newRecord;
}

export async function getDailyRecords(planId?: string): Promise<DailyRecord[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const records: DailyRecord[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          const record = JSON.parse(content);
          if (!planId || record.planId === planId) {
            records.push(record);
          }
        } catch {
          continue;
        }
      }
    }

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getDailyRecordByDate(planId: string, date: string): Promise<DailyRecord | null> {
  try {
    const records = await getDailyRecords(planId);
    return records.find(r => r.date === date) || null;
  } catch {
    return null;
  }
}

export async function updateDailyRecord(id: string, updates: Partial<DailyRecord>): Promise<DailyRecord | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const record = JSON.parse(content);
    
    const updatedRecord = { ...record, ...updates };
    await fs.promises.writeFile(filePath, JSON.stringify(updatedRecord, null, 2));
    
    return updatedRecord;
  } catch {
    return null;
  }
}

export async function deleteDailyRecord(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getWeeklyStats(planId?: string): Promise<WeeklyStats> {
  const records = await getDailyRecords(planId);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const weeklyRecords = records.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate >= startOfWeek;
  });

  const dailyData: DayStats[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const record = weeklyRecords.find(r => r.date === dateStr);
    
    dailyData.push({
      date: dateStr,
      dayName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      studyHours: record?.studyHours || 0,
      completedTasks: record?.tasks.filter(t => t.completed).length || 0,
      totalTasks: record?.tasks.length || 0,
    });
  }

  return {
    totalStudyHours: weeklyRecords.reduce((sum, r) => sum + r.studyHours, 0),
    totalCompletedTasks: weeklyRecords.reduce((sum, r) => sum + r.tasks.filter(t => t.completed).length, 0),
    totalTasks: weeklyRecords.reduce((sum, r) => sum + r.tasks.length, 0),
    dailyData,
  };
}

export interface DayStats {
  date: string;
  dayName: string;
  studyHours: number;
  completedTasks: number;
  totalTasks: number;
}

export interface WeeklyStats {
  totalStudyHours: number;
  totalCompletedTasks: number;
  totalTasks: number;
  dailyData: DayStats[];
}