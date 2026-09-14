import React, { useState } from 'react';
import { BookOpen, Search, Globe, Sparkles, Volume2 } from 'lucide-react';
import { LEGAL_GLOSSARY } from '../data/sampleDocuments';
import { LegalTermGlossaryItem } from '../types';

export const GlossaryEngine: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<LegalTermGlossaryItem>(LEGAL_GLOSSARY[0]);

  const filteredTerms = LEGAL_GLOSSARY.filter((item) =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plainMeaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakPronunciation = (term: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 3: Legal Terminology & Glossary Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">ARIA Accessible</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Interactive Plain-Language Legal Glossary</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Searchable legal dictionary demystifying complex Latin maxims, boilerplate jargon, and jurisdictional nuances.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search legal terms (e.g. Indemnification, Force Majeure, Subrogation)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 glass-panel p-3 rounded-2xl border border-slate-800 space-y-1.5 max-h-[500px] overflow-y-auto">
          {filteredTerms.map((item) => {
            const isSelected = item.term === selectedTerm.term;
            return (
              <button
                key={item.term}
                onClick={() => setSelectedTerm(item)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-glow-indigo'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <span>{item.term}</span>
                {item.latinOrigin && (
                  <span className="text-[10px] text-cyan-400 font-serif italic">Latin</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold font-display text-white">{selectedTerm.term}</h3>
                <button
                  onClick={() => speakPronunciation(selectedTerm.term)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
              {selectedTerm.pronunciation && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">/{selectedTerm.pronunciation}/</p>
              )}
            </div>

            {selectedTerm.latinOrigin && (
              <span className="text-xs font-serif italic px-3 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {selectedTerm.latinOrigin}
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Plain English Meaning:
              </h4>
              <p className="text-slate-200 leading-relaxed text-sm bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                {selectedTerm.plainMeaning}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Contextual Example in Contracts:
              </h4>
              <p className="text-slate-300 font-mono text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                "{selectedTerm.exampleContext}"
              </p>
            </div>

            {selectedTerm.jurisdictionNotes && (
              <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-indigo-200">
                <strong className="text-white flex items-center gap-1 mb-0.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Jurisdiction & Enforceability Nuance:
                </strong>
                <p className="text-slate-300">{selectedTerm.jurisdictionNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
