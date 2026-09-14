# 🔒 Security Policy & Architecture

## Security Overview
LexiGuard AI is architected with enterprise-grade defense-in-depth principles, strict client-side data minimization, and automated compliance controls.

## 1. GDPR Article 17 Data Minimization & PII Scrubbing
- **Automatic Client-Side Masking**: All documents, inputs, and search queries pass through the multi-layer regular expression and token scrubber before being vectorized or processed.
- **Redacted Entities**:
  - Email addresses (`[REDACTED_EMAIL]`)
  - Phone numbers in international & US formats (`[REDACTED_PHONE]`)
  - Social Security Numbers & Tax IDs (`[REDACTED_SSN/TIN]`)
  - Credit Card Numbers (`[REDACTED_CREDIT_CARD]`)
  - IPv4 / IPv6 addresses (`[REDACTED_IP_ADDRESS]`)

## 2. Cryptographic Architecture
- **Web Crypto API (AES-GCM-256)**: Real in-browser cryptographic subsystem using 256-bit keys and 96-bit initialization vectors (IV) for local document confidentiality.
- **Fallback Cipher Support**: Graceful encryption for headless and restricted browser contexts.

## 3. Input Sanitization & XSS Mitigation
- **DOMPurify Integration**: All user-rendered HTML and markdown snippets are sanitized to neutralize malicious script injections, inline handlers, and cross-site scripting vectors.
- **Content Security Policy (CSP)**: Explicit CSP restrictions preventing unapproved script sources and frame injections.

## 4. Role-Based Access Control (RBAC)
- Strict permission gates enforcing principle of least privilege across user personas:
  - `standard_user`: View, simplify, and run RAG search.
  - `legal_reviewer`: Full lawyer prep kit generation and attorney packet export.
  - `compliance_auditor`: View immutable audit trails and trigger GDPR Article 17 data erasure.
  - `admin`: Super-admin capabilities across all subsystems.

## 5. Vulnerability Reporting
If you discover a security vulnerability, please open a security advisory or report directly to the repository maintainer.
