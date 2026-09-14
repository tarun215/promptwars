import { AuditLogEntry, Role } from '../types';

export class SecurityService {
  private static auditLogs: AuditLogEntry[] = [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString().replace('T', ' ').substring(0, 19),
      userRole: 'legal_reviewer',
      userEmail: 'sarah.counsel@enterprise.legal',
      action: 'DOCUMENT_LOAD',
      documentId: 'doc-saas-msa-2025',
      documentName: 'Enterprise_MSA_ApexCloud_2025.pdf',
      ipAddress: '192.168.1.104',
      status: 'ENCRYPTED'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19),
      userRole: 'standard_user',
      userEmail: 'alex.ops@enterprise.legal',
      action: 'RISK_SCORECARD_GENERATE',
      documentId: 'doc-saas-msa-2025',
      documentName: 'Enterprise_MSA_ApexCloud_2025.pdf',
      ipAddress: '192.168.1.108',
      status: 'SUCCESS'
    }
  ];

  /**
   * AES-256 Client-Side Mock Encryption
   */
  static encryptText(text: string): string {
    const b64 = btoa(encodeURIComponent(text));
    return `AES256-GCM::IV_7f8a9e::${b64}::TAG_4a1b8c`;
  }

  static decryptText(cipher: string): string {
    if (!cipher.startsWith('AES256-GCM::')) {
      return cipher;
    }
    try {
      const parts = cipher.split('::');
      if (parts.length >= 3) {
        return decodeURIComponent(atob(parts[2]));
      }
      return cipher;
    } catch {
      return cipher;
    }
  }

  /**
   * PII Scrubber for GDPR Article 17 / Data Minimization
   */
  static scrubPII(text: string): { scrubbedText: string; scrubbedCount: number } {
    let scrubbed = text;
    let count = 0;

    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    scrubbed = scrubbed.replace(emailRegex, () => {
      count++;
      return '[REDACTED_EMAIL]';
    });

    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
    scrubbed = scrubbed.replace(phoneRegex, (match) => {
      if (match.trim().length >= 7) {
        count++;
        return '[REDACTED_PHONE]';
      }
      return match;
    });

    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    scrubbed = scrubbed.replace(ssnRegex, () => {
      count++;
      return '[REDACTED_SSN/TIN]';
    });

    return { scrubbedText: scrubbed, scrubbedCount: count };
  }

  /**
   * Audit Logging
   */
  static logAction(
    userRole: Role,
    userEmail: string,
    action: string,
    documentId?: string,
    documentName?: string,
    status: 'SUCCESS' | 'ENCRYPTED' | 'FLAGGED' = 'SUCCESS'
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userRole,
      userEmail,
      action,
      documentId,
      documentName,
      ipAddress: '10.0.4.' + (Math.floor(Math.random() * 200) + 10),
      status
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  static getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  static clearAuditLogs(): void {
    this.auditLogs = [];
  }

  static canExportFullLegalPacket(role: Role): boolean {
    return ['admin', 'legal_reviewer'].includes(role);
  }

  static canDeleteDataUnderGdpr(role: Role): boolean {
    return ['admin', 'compliance_auditor'].includes(role);
  }

  static canViewAuditTrail(role: Role): boolean {
    return ['admin', 'compliance_auditor'].includes(role);
  }
}
