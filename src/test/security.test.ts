import { describe, it, expect } from 'vitest';
import { SecurityService } from '../services/security';

describe('SecurityService', () => {
  describe('GDPR PII Scrubber', () => {
    it('should scrub email addresses correctly', () => {
      const input = 'Contact john.doe@example.com or support@lawfirm.co.uk for inquiries.';
      const result = SecurityService.scrubPII(input);
      expect(result.scrubbedText).toBe('Contact [REDACTED_EMAIL] or [REDACTED_EMAIL] for inquiries.');
      expect(result.scrubbedCount).toBe(2);
    });

    it('should scrub phone numbers in various international and US formats', () => {
      const input = 'Call +1 (555) 234-5678 or 415-888-9999 immediately.';
      const result = SecurityService.scrubPII(input);
      expect(result.scrubbedText).toContain('[REDACTED_PHONE]');
      expect(result.scrubbedCount).toBeGreaterThanOrEqual(2);
    });

    it('should scrub SSNs and Tax IDs', () => {
      const input = 'Taxpayer identification number is 123-45-6789.';
      const result = SecurityService.scrubPII(input);
      expect(result.scrubbedText).toBe('Taxpayer identification number is [REDACTED_SSN/TIN].');
      expect(result.scrubbedCount).toBe(1);
    });

    it('should scrub credit card numbers', () => {
      const input = 'Billing card: 4111 2222 3333 4444 on file.';
      const result = SecurityService.scrubPII(input);
      expect(result.scrubbedText).toContain('[REDACTED_CREDIT_CARD]');
    });
  });

  describe('DOMPurify HTML Sanitizer', () => {
    it('should neutralize malicious script tags and XSS vectors', () => {
      const malicious = '<p>Legal text</p><script>alert("hacked")</script><img src="x" onerror="alert(1)">';
      const clean = SecurityService.sanitizeHtml(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onerror=');
      expect(clean).toContain('Legal text');
    });
  });

  describe('Encryption & Decryption', () => {
    it('should encrypt and decrypt strings symmetrically', () => {
      const plaintext = 'Confidential Settlement Agreement $500,000';
      const encrypted = SecurityService.encryptText(plaintext);
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain('AES-GCM-256');

      const decrypted = SecurityService.decryptText(encrypted);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('Role-Based Access Control (RBAC)', () => {
    it('should strictly enforce permissions by role', () => {
      expect(SecurityService.canExportFullLegalPacket('admin')).toBe(true);
      expect(SecurityService.canExportFullLegalPacket('legal_reviewer')).toBe(true);
      expect(SecurityService.canExportFullLegalPacket('standard_user')).toBe(false);

      expect(SecurityService.canDeleteDataUnderGdpr('compliance_auditor')).toBe(true);
      expect(SecurityService.canDeleteDataUnderGdpr('standard_user')).toBe(false);

      expect(SecurityService.canViewAuditTrail('compliance_auditor')).toBe(true);
      expect(SecurityService.canViewAuditTrail('legal_reviewer')).toBe(false);
    });
  });

  describe('Audit Logging', () => {
    it('should append and retrieve structured immutable audit entries', () => {
      const entry = SecurityService.logAction(
        'legal_reviewer',
        'counsel@legal.corp',
        'TEST_EXPORT',
        'doc-100',
        'Contract.pdf'
      );
      expect(entry.id).toBeDefined();
      expect(entry.action).toBe('TEST_EXPORT');
      expect(entry.userEmail).toBe('[REDACTED_EMAIL]');

      const logs = SecurityService.getAuditLogs();
      expect(logs[0].id).toBe(entry.id);
    });
  });
});
