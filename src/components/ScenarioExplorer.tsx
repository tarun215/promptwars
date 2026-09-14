import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ShieldAlert
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { ScenarioSimulation } from '../types';
import { LegalAiEngine } from '../services/legalAiEngine';

export const ScenarioExplorer: React.FC = () => {
  const { activeDocument, recordTokenUsage, addAuditLog } = useLegalApp();
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeSimulation, setActiveSimulation] = useState<ScenarioSimulation>(() =>
    LegalAiEngine.simulateScenario(activeDocument, 'What if customer payment is delayed by 45 days?')
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const presetScenarios = [
    {
      title: 'Late Payment (45 Days)',
      prompt: 'What if customer payment is delayed by 45 days due to an internal accounting glitch?'
    },
    {
      title: 'Vendor Unilateral Termination',
      prompt: 'What happens if the vendor cancels the agreement with 30 days notice? Can we retrieve all our data?'
    },
    {
      title: 'Cloud Outage / $200k Loss',
      prompt: 'What if the vendor platform goes down for 24 hours causing our business $200,000 in lost customer revenue?'
    },
    {
      title: 'Post-Contract Side Project (IP)',
      prompt: 'What if an engineer develops an independent weekend app while under this agreement?'
    }
  ];

  const runSimulation = async (promptText: string) => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 450));
    
    const result = LegalAiEngine.simulateScenario(activeDocument, promptText);
    setActiveSimulation(result);
    recordTokenUsage('SCENARIO', 150, 280, 420);
    addAuditLog(`SCENARIO_SIMULATION: ${promptText.substring(0, 30)}...`);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Phase 3: "What-If" Scenario Simulation Sandbox
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">{activeDocument.title}</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Interactive Scenario & Impact Explorer</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test hypothetical breach events, outage disasters, or delayed payments to preview contract enforcement before signing.
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 mb-2">Select Prebuilt Scenario:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetScenarios.map((scen, idx) => (
            <button
              key={idx}
              onClick={() => runSimulation(scen.prompt)}
              className="text-left p-3.5 rounded-xl glass-card hover:border-indigo-500/40 text-xs transition-all flex flex-col justify-between group"
            >
              <span className="font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                {scen.title}
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </span>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scen.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customPrompt.trim()) {
              runSimulation(customPrompt);
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your own 'What If' scenario (e.g. What if client disputes deliverable quality?)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim() || isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-glow-indigo disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Simulate'}</span>
          </button>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Simulation Results</span>
            <h3 className="text-base font-bold text-white mt-0.5">{activeSimulation.title}</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Scenario: "{activeSimulation.scenarioPrompt}"</p>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            activeSimulation.riskShift === 'increases'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            Risk {activeSimulation.riskShift}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Contractual & Legal Consequence
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeSimulation.likelyOutcome}
            </p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-xl border border-rose-500/20 space-y-2">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Financial & Operational Exposure
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeSimulation.financialExposureImpact}
            </p>
          </div>
        </div>

        <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            AI Recommended Protective Counter-Draft (Redline Clause):
          </span>
          <p className="text-xs font-mono text-cyan-200 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
            "{activeSimulation.suggestedCounterClause}"
          </p>
        </div>
      </div>
    </div>
  );
};
