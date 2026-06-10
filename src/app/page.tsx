'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import DocumentUploader from '@/components/DocumentUploader';
import StudyPlan from '@/components/StudyPlan';
import Dashboard from '@/components/Dashboard';
import Notes from '@/components/Notes';
import Evaluation from '@/components/Evaluation';
import DocumentQuiz from '@/components/DocumentQuiz';
import LearningPathPlanner from '@/components/LearningPathPlanner';
import DocsNotes, { Folder } from '@/components/DocsNotes';
import AIKnowledgeBase from '@/components/AIKnowledgeBase';
import LearningWorkflowPanel from '@/components/LearningWorkflow';
import PromptTemplatesPanel from '@/components/PromptTemplates';
import { Document } from '@/lib/document';
import { Note } from '@/lib/notes';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchDocuments();
    fetchNotes();
  }, []);

  const fetchDocuments = async () => {
    console.log('[Home] fetchDocuments called');
    try {
      const response = await fetch('/api/documents');
      console.log('[Home] fetchDocuments response status:', response.status);
      const data = await response.json();
      console.log('[Home] fetchDocuments success, document count:', (data.documents || []).length);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('[Home] fetchDocuments failed:', error);
    }
  };

  const fetchNotes = async () => {
    console.log('[Home] fetchNotes called');
    try {
      const response = await fetch('/api/notes');
      console.log('[Home] fetchNotes response status:', response.status);
      const data = await response.json();
      console.log('[Home] fetchNotes success, note count:', (data.notes || []).length);
      setNotes(data.notes || []);
    } catch (error) {
      console.error('[Home] fetchNotes failed:', error);
    }
  };

  const handleDocumentSelect = (doc: Document) => {
    console.log('[Home] handleDocumentSelect called:', { id: doc.id, name: doc.name });
    setSelectedDocument(doc);
    setActiveTab('chat');
  };

  const handleNoteSelect = (note: Note) => {
    console.log('[Home] handleNoteSelect called:', { id: note.id, title: note.title });
    setSelectedNote(note);
    setActiveTab('notes');
  };

  const handleDocsNoteSelect = (doc: Document) => {
    console.log('[Home] handleDocsNoteSelect called:', { id: doc.id, name: doc.name });
    setSelectedDocument(doc);
    setActiveTab('chat');
  };

  const handleDocsNoteSelectFromNotes = (note: Note) => {
    console.log('[Home] handleDocsNoteSelectFromNotes called:', { id: note.id, title: note.title });
    setSelectedNote(note);
    setActiveTab('notes');
  };

  const handleNotesChange = () => {
    console.log('[Home] handleNotesChange called, refreshing notes');
    fetchNotes();
  };

  const handleAddDocument = () => {
    console.log('[Home] handleAddDocument called, switching to upload tab');
    setActiveTab('upload');
  };

  const handleAddNote = () => {
    console.log('[Home] handleAddNote called, switching to notes tab with new note');
    setSelectedNote(null);
    setActiveTab('notes');
  };

  const handleAddFolder = (name: string) => {
    console.log('[Home] handleAddFolder called with name:', name);
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: new Date(),
      documentIds: []
    };
    setFolders(prev => [...prev, newFolder]);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        documents={documents}
        notes={notes}
        onDocumentSelect={handleDocumentSelect}
        onNoteSelect={handleNoteSelect}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === 'chat' && (
            <>
              <div className="lg:col-span-2 h-[calc(100vh-180px)]">
                <ChatInterface 
                  documents={documents}
                  selectedDocument={selectedDocument}
                  onSelectDocument={setSelectedDocument}
                />
              </div>
              <div className="lg:col-span-1">
                <DocumentUploader 
                  documents={documents} 
                  onDocumentsChange={fetchDocuments} 
                />
              </div>
            </>
          )}
          
          {activeTab === 'upload' && (
            <div className="lg:col-span-3">
              <DocumentUploader 
                documents={documents} 
                onDocumentsChange={fetchDocuments} 
              />
            </div>
          )}
          
          {activeTab === 'docs' && (
            <div className="lg:col-span-3">
              <DocsNotes
                documents={documents}
                notes={notes}
                folders={folders}
                onDocumentSelect={handleDocsNoteSelect}
                onNoteSelect={handleDocsNoteSelectFromNotes}
                onAddDocument={handleAddDocument}
                onAddNote={handleAddNote}
                onAddFolder={handleAddFolder}
              />
            </div>
          )}
          
          {activeTab === 'plan' && (
            <div className="lg:col-span-3">
              <StudyPlan />
            </div>
          )}
          
          {activeTab === 'learningPath' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <LearningPathPlanner />
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div className="lg:col-span-3">
              <Dashboard 
                documents={documents}
                plans={[]}
                sessions={[]}
                onDocumentSelect={(docId) => {
                  const doc = documents.find(d => d.id === docId);
                  if (doc) handleDocumentSelect(doc);
                }}
                onPlanSelect={() => setActiveTab('plan')}
                onStartJournal={() => setActiveTab('plan')}
              />
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <Notes 
                initialNote={selectedNote}
                onNotesChange={handleNotesChange}
              />
            </div>
          )}
          
          {activeTab === 'evaluation' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <Evaluation />
            </div>
          )}
          
          {activeTab === 'documentQuiz' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <DocumentQuiz />
            </div>
          )}
          
          {activeTab === 'aiKnowledge' && (
            <div className="lg:col-span-3">
              <AIKnowledgeBase />
            </div>
          )}
          
          {activeTab === 'workflow' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <LearningWorkflowPanel />
            </div>
          )}
          
          {activeTab === 'prompt' && (
            <div className="lg:col-span-3 h-[calc(100vh-180px)]">
              <PromptTemplatesPanel />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-[#8A9BB2] text-sm">
          <p>StudyPal - AI 智能学习助手 | 助力你的学习之旅</p>
        </div>
      </footer>
    </div>
  );
}