import React, { useState } from 'react';
import { 
  Lock, 
  Trash2, 
  Download, 
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useLegalApp } from '../context/LegalAppContext';
import { SecurityService } from '../services/security';

export const EnterpriseAuditDashboard: React.FC = () => {
  const { 
    auditLogs, 
    userRole, 
    activeDocument, 
    deleteDocument, 
    addAuditLog 
  } = useLegalApp();

  const [piiInput, setPiiInput] = useState('Contact Sarah at sarah.smith@acme.corp or call +1 (555) 234-5678 regarding SSN 000-12-3456.');
  const [scrubbedResult, setScrubbedResult] = useState<{ scrubbedText: string; scrubbedCount: number } | null>(null);

  const handleScrubPII = () => {
    const res = SecurityService.scrubPII(piiInput);
    setScrubbedResult(res);
    addAuditLog('GDPR_PII_SCRUB');
  };

  const handleExportAuditCSV = () => {
    const headers = 'ID,Timestamp,UserRole,UserEmail,Action,DocumentName,IPAddress,Status\n';
    const rows = auditLogs
      .map((l) => `${l.id},${l.timestamp},${l.userRole},${l.userEmail},${l.action},${l.documentName || 'N/A'},${l.ipAddress},${l.status}`)
      .join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LexiGuard_Audit_Trail_${Date.now()}.csv`;
    a.click();
    addAuditLog('EXPORT_AUDIT_CSV');
  };

  const handleDataTakeout = () => {
    const takeoutData = {
      userRole,
      exportTimestamp: new Date().toISOString(),
      activeDocumentMetadata: activeDocument.metadata,
      clausesCount: activeDocument.clauses.length,
      auditRecords: auditLogs
    };

    const blob = new Blob([JSON.stringify(takeoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LexiGuard_Data_Takeout_GDPR_${Date.now()}.json`;
    a.click();
    addAuditLog('GDPR_DATA_TAKEOUT_EXPORT');
  };

  const handleExecuteErasure = () => {
    if (confirm(`Are you sure you want to permanently erase "${activeDocument.title}" under GDPR Article 17 Right to Erasure? This cannot be undone.`)) {
      deleteDocument(activeDocument.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Phase 4: Enterprise Scale, Security & GDPR Compliance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">SOC 2 Type II / GDPR Controls</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Enterprise RBAC & Security Audit Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable audit logs, cryptographic document protections, and GDPR Article 17 Right-to-Erasure workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDataTakeout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>GDPR Data Takeout (JSON)</span>
          </button>
          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Active RBAC Role
            </h4>
            <span className="font-mono text-[11px] text-cyan-400 font-bold uppercase">{userRole}</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>View Encrypted Documents:</span>
              <span className="text-emerald-400 font-bold">✓ Granted</span>
            </div>
            <div className="flex justify-between">
              <span>Export Full Legal Packets:</span>
              <span className={SecurityService.canExportFullLegalPacket(userRole) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {SecurityService.canExportFullLegalPacket(userRole) ? '✓ Granted' : '✗ Restricted'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GDPR Deletion Authority:</span>
              <span className={SecurityService.canDeleteDataUnderGdpr(userRole) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {SecurityService.canDeleteDataUnderGdpr(userRole) ? '✓ Granted' : '✗ Restricted'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              AES-256 Document Vault
            </h4>
            <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            All ingested legal agreements and embeddings are cryptographically encrypted in transit and at rest with zero persistence without user consent.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                GDPR Right-to-Erasure
              </h4>
              <span className="text-[10px] font-mono text-rose-400">Art. 17</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Instantly purge active document, embeddings, and chat telemetry from local storage.
            </p>
          </div>
          <button
            onClick={handleExecuteErasure}
            className="w-full py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Current Document</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Automated PII Redaction & Data Minimization Scrubber
        </h3>
        <p className="text-xs text-slate-400">
          Removes emails, phone numbers, tax IDs, and credit accounts before sending prompts to LLMs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Input Text with Sensitive PII</label>
            <textarea
              rows={3}
              value={piiInput}
              onChange={(e) => setPiiInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleScrubPII}
              className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Run PII Scrubber
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Redacted Output ({scrubbedResult?.scrubbedCount || 0} Entities Scrubbed)</label>
            <div className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 font-mono min-h-[72px] leading-relaxed">
              {scrubbedResult ? scrubbedResult.scrubbedText : 'Click "Run PII Scrubber" to preview sanitized output.'}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            Full Audit Trail Dashboard ({auditLogs.length} Events Logged)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Real-Time Event Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">User Email</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Target Document</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-indigo-300 uppercase">{log.userRole}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.userEmail}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{log.documentName || 'Global'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'ENCRYPTED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : log.status === 'FLAGGED'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
