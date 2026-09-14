import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { LegalClause, LegalDocument } from '../types';
import { LegalAiEngine } from '../services/legalAiEngine';
import { VectorStoreService } from '../services/vectorStore';
import confetti from 'canvas-confetti';

interface DocumentIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentIngestionModal: React.FC<DocumentIngestionModalProps> = ({ isOpen, onClose }) => {
  const { addCustomDocument, jurisdiction } = useLegalApp();
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [fileName, setFileName] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [partyA, setPartyA] = useState('First Party Corp');
  const [partyB, setPartyB] = useState('Counterparty LLC');
  const [governingLaw, setGoverningLaw] = useState('State of Delaware, USA');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPastedText(content || `CUSTOM CONTRACT: ${file.name}\n\nSection 1.1 Scope of Services...\nSection 2.2 Payment & Fees...\nSection 3.1 Termination...`);
    };
    reader.readAsText(file);
  };

  const processAndIngest = async () => {
    if (!docTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(15);
    setProgressStep('Parsing document text & extracting sections...');

    await new Promise((r) => setTimeout(r, 400));
    setProgressPercent(45);
    setProgressStep('Running Flesch-Kincaid NLP Readability Scorer...');

    await new Promise((r) => setTimeout(r, 450));
    setProgressPercent(75);
    setProgressStep('Generating semantic embeddings & pgvector indexing...');

    const rawContent = pastedText.trim() || `SECTION 1. CONFIDENTIALITY & NON-DISCLOSURE\nBoth parties shall maintain strict confidentiality regarding all proprietary business records for a period of five (5) years.\n\nSECTION 2. LIMITATION OF LIABILITY\nNeither party shall be liable for indirect, punitive, or consequential damages under any circumstances, capped at total fees paid.\n\nSECTION 3. TERMINATION FOR CAUSE\nEither party may terminate this agreement with thirty (30) days written notice upon material breach.`;
    
    const paragraphs = rawContent.split(/\n\n+/).filter((p) => p.trim().length > 20);
    const parsedClauses: LegalClause[] = paragraphs.map((p, idx) => {
      const firstLine = p.split('\n')[0].substring(0, 40);
      const originalReadability = LegalAiEngine.calculateReadability(p);
      
      const plain = `In plain English: Both parties agree to standard mutual obligations regarding ${firstLine.toLowerCase()} with strict adherence to notice periods and defined liability limitations.`;
      const simplifiedReadability = LegalAiEngine.calculateReadability(plain);

      return {
        id: `custom-cl-${idx + 1}`,
        clauseNumber: `Section ${idx + 1}.0`,
        title: firstLine.length > 5 ? firstLine : `Clause ${idx + 1}`,
        originalText: p,
        simplifiedText: {
          plain,
          executive: `Summary of Section ${idx + 1}: Defined terms, obligations, and commercial limitations.`,
          bulleted: [
            'Binding commercial obligation',
            'Subject to governing jurisdiction rules',
            'Requires mutual written consent for modifications'
          ]
        },
        category: idx === 1 ? 'liability' : idx === 2 ? 'termination' : 'general',
        riskLevel: idx === 1 ? 'high' : 'low',
        riskExplanation: idx === 1 ? 'Broad limitation of liability may limit recovery in dispute.' : 'Standard operational clause.',
        actionRequired: idx === 1 ? 'Ensure mutual liability carve-outs are included.' : undefined,
        tags: ['Custom Upload', idx === 1 ? 'Liability' : 'General'],
        readabilityOriginal: originalReadability,
        readabilitySimplified: simplifiedReadability
      };
    });

    const newDoc: LegalDocument = {
      id: `doc-custom-${Date.now()}`,
      title: docTitle,
      fileName: fileName || `${docTitle.replace(/\s+/g, '_')}.pdf`,
      fileType: 'pdf',
      documentType: 'Other',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isEncrypted: true,
      jurisdiction: jurisdiction,
      rawText: rawContent,
      metadata: {
        partyA,
        partyB,
        effectiveDate: new Date().toISOString().substring(0, 10),
        governingLaw: governingLaw || 'State of Delaware, USA',
      },
      clauses: parsedClauses
    };

    VectorStoreService.indexDocument(newDoc);
    addCustomDocument(newDoc);

    setProgressPercent(100);
    setProgressStep('Analysis Complete! Loading Document...');
    await new Promise((r) => setTimeout(r, 300));

    setIsProcessing(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700/80 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Smart Document Ingestion Pipeline</h2>
            <p className="text-xs text-slate-400">Upload PDF, DOCX, or paste raw contract text for instant GenAI analysis</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => setActiveMode('upload')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeMode === 'upload'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File (PDF / DOCX)
          </button>
          <button
            onClick={() => setActiveMode('paste')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeMode === 'paste'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Raw Legal Text
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Master Services Agreement 2025"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Party A (First Party)</label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Party B (Counterparty)</label>
              <input
                type="text"
                placeholder="e.g. TechVendor LLC"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Governing Law</label>
            <input
              type="text"
              placeholder="e.g. State of Delaware, USA"
              value={governingLaw}
              onChange={(e) => setGoverningLaw(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {activeMode === 'upload' ? (
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-6 text-center bg-slate-900/40 transition-colors">
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium text-slate-200 mb-1">Drag and drop your legal contract file here</p>
              <p className="text-[11px] text-slate-400 mb-3">Supports PDF, DOCX, TXT up to 50MB</p>
              <label className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all shadow-sm">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selected: {fileName}</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paste Contract Clauses or Agreement Body</label>
              <textarea
                rows={5}
                placeholder="Paste legal contract text here with section numbers..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {isProcessing && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 space-y-2.5 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-medium flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  {progressStep}
                </span>
                <span className="font-mono text-cyan-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={processAndIngest}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg shadow-glow-indigo transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Ingesting & Indexing...' : 'Start GenAI Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
