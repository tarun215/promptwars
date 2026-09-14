import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  BookmarkCheck, 
  RotateCcw, 
  Square, 
  ArrowRight
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { ChatMessage, CitationReference } from '../types';
import { LegalAiEngine } from '../services/legalAiEngine';

export const RagChatInterface: React.FC = () => {
  const { activeDocument, jurisdiction, addAuditLog, recordTokenUsage } = useLegalApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Hello! I am your **LexiGuard AI Legal Co-Pilot**. I have parsed and indexed **"${activeDocument.title}"** (Governing Law: ${activeDocument.metadata.governingLaw}).\n\nAsk me anything about liability caps, payment penalties, termination rules, or obligations, and I will cite the exact clauses.`,
      timestamp: new Date().toLocaleTimeString(),
      suggestedFollowUps: [
        'What is our maximum liability exposure under this agreement?',
        'What are the payment deadlines and late penalty fees?',
        'Can the other party cancel this contract without cause?'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeCitationPreview, setActiveCitationPreview] = useState<CitationReference | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<boolean>(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isStreaming) return;

    abortControllerRef.current = false;
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const startTime = Date.now();
    const result = LegalAiEngine.answerQuestion(activeDocument, query, jurisdiction);

    const assistantMsgId = `asst-${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      citations: result.citations,
      suggestedFollowUps: result.suggestedFollowUps,
      isStreaming: true
    };

    setMessages((prev) => [...prev, placeholderMsg]);

    const fullText = result.answer;
    const tokens = fullText.split(' ');
    let accumulated = '';

    for (let i = 0; i < tokens.length; i++) {
      if (abortControllerRef.current) {
        break;
      }
      accumulated += (i === 0 ? '' : ' ') + tokens[i];
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg
        )
      );
      await new Promise((r) => setTimeout(r, 24));
    }

    const latency = Date.now() - startTime;
    recordTokenUsage('RAG_QA', Math.round(query.length * 1.5), Math.round(fullText.length * 1.2), latency);
    addAuditLog(`RAG_QA_QUERY: ${query.substring(0, 40)}...`);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
      )
    );
    setIsStreaming(false);
  };

  const handleStopStreaming = () => {
    abortControllerRef.current = true;
    setIsStreaming(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-reset-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. Ready to analyze **"${activeDocument.title}"**. How can I assist you?`,
        timestamp: new Date().toLocaleTimeString(),
        suggestedFollowUps: [
          'What are the key risks in this document?',
          'Summarize party obligations and deadlines',
          'What happens if we terminate early?'
        ]
      }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[720px]">
      <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col h-full border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                RAG Legal Document Assistant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Vector Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Active Target: <span className="text-slate-300 font-medium">{activeDocument.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-glow-indigo rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-1.5 font-sans">
                  {msg.content || (msg.isStreaming ? 'Analyzing document clauses...' : '')}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3" /> Cited Document References:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setActiveCitationPreview(cite)}
                          className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-indigo-500/50 transition-colors"
                        >
                          <span className="text-cyan-400 font-bold">[{cIdx + 1}]</span>
                          <span>{cite.clauseTitle}</span>
                          <span className="text-slate-500 font-mono">({Math.round(cite.relevanceScore * 100)}%)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && !msg.isStreaming && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Suggested Inquiries:
                    </span>
                    <div className="flex flex-col gap-1">
                      {msg.suggestedFollowUps.map((suggest, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(suggest)}
                          className="text-left text-[11px] text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg flex items-center justify-between group transition-colors"
                        >
                          <span>{suggest}</span>
                          <ArrowRight className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask any legal question about "${activeDocument.title}"...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isStreaming}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
            />

            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopStreaming}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-glow-indigo disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-4 flex flex-col h-full">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              Source Citation Inspector
            </h4>
            <span className="text-[10px] font-mono text-slate-400">pgvector Semantic</span>
          </div>

          {activeCitationPreview ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">MATCHED CLAUSE:</span>
                <p className="text-xs font-bold text-white mt-0.5">{activeCitationPreview.clauseTitle}</p>
                <p className="text-[11px] font-mono text-slate-300 mt-2 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
                  "{activeCitationPreview.snippet}"
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Confidence: {Math.round(activeCitationPreview.relevanceScore * 100)}%</span>
                  <span className="text-emerald-400">Verified Grounding</span>
                </div>
              </div>

              <button
                onClick={() => setActiveCitationPreview(null)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1"
              >
                Clear Preview
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs flex-1 flex flex-col items-center justify-center">
              <BookmarkCheck className="w-8 h-8 text-slate-700 mb-2" />
              <p>Click on any citation tag in the chat to inspect the raw clause and verification score.</p>
            </div>
          )}
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Governing Law:</span>
            <span className="text-slate-200 font-medium">{activeDocument.metadata.governingLaw}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Parties:</span>
            <span className="text-slate-200 font-medium">{activeDocument.metadata.partyA.substring(0, 16)}...</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Jurisdiction Scope:</span>
            <span className="text-cyan-400 font-mono">{jurisdiction} Standards</span>
          </div>
        </div>
      </div>
    </div>
  );
};
