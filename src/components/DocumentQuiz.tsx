'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Document } from '@/lib/document';

export default function DocumentQuiz() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => setDocuments(data.documents || []));
  }, []);

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#A5C9FF]/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#3D4A5C]" />
          </div>
          <h2 className="font-semibold text-[#3D4A5C]">文档测验</h2>
        </div>
        <div className="bg-white rounded-2xl card-shadow p-6">
          <p className="text-[#8A9BB2]">选择文档开始生成测验</p>
          <div className="mt-4 space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="p-3 bg-[#F5F7FA] rounded-xl">
                {doc.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}