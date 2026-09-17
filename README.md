# ⚖️ LexiGuard AI — GenAI Legal Intelligence & Document Assistance Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-magical--gumption--e400d1.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://magical-gumption-e400d1.netlify.app/)
[![Tests Passing](https://img.shields.io/badge/Tests-100%25%20Passing-059669?style=for-the-badge&logo=vitest&logoColor=white)](PROMPT_ALIGNMENT.md)
[![Netlify Ready](https://img.shields.io/badge/Netlify-Configured-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](netlify.toml)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Compliance](https://img.shields.io/badge/GDPR%20%7C%20SOC%202%20Ready-059669?style=for-the-badge&logo=shield&logoColor=white)](SECURITY.md)
[![WCAG](https://img.shields.io/badge/WCAG%202.1%20AA-Compliant-8b5cf6?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **LexiGuard AI** is an enterprise-grade, end-to-end GenAI legal intelligence assistant designed to democratize complex contract comprehension, identify asymmetric liability traps, and prepare users for licensed attorney consultations.

🌐 **Live Application:** [https://magical-gumption-e400d1.netlify.app/](https://magical-gumption-e400d1.netlify.app/)  
📂 **Source Code:** [https://github.com/tarun215/promptwars](https://github.com/tarun215/promptwars)  
🎯 **Problem Statement Alignment Matrix:** [PROMPT_ALIGNMENT.md](PROMPT_ALIGNMENT.md)  
🔒 **Security & Cryptography Policy:** [SECURITY.md](SECURITY.md)

---

## 📜 Official Problem Statement Alignment

> *"Legal information can often be complex, difficult to understand, and challenging to navigate without professional assistance. Build a GenAI-powered solution that makes legal information and basic legal assistance more accessible by helping users understand, compare, and navigate legal documents and information."*

### 🎯 7-Use-Case Implementation Matrix:
1. **Simplifying complex legal documents**: Multi-persona plain English translation (Layperson / Executive / Junior Counsel) + Flesch-Kincaid NLP scoring (`PlainLanguageSimplifier.tsx`).
2. **Comparing contracts, agreements, or policies**: Automated side-by-side redline diffs and missing clause inconsistency alerts (`ContractComparator.tsx`).
3. **Highlighting important clauses, obligations, risks, or inconsistencies**: 5-factor weighted risk engine with critical liability flags and counter-amendment advice (`ClauseHighlighter.tsx`, `RiskScoringEngine.tsx`).
4. **Answering questions based on provided legal documents**: 256-dim L2-normalized vector RAG with exact clause citation backlinks and hallucination barriers (`RagChatInterface.tsx`, `vectorStore.ts`).
5. **Helping users understand their options and potential next steps**: Generative "What-If" breach & late payment dispute simulation sandbox with financial exposure modeling (`ScenarioExplorer.tsx`).
6. **Generating summaries, checklists, or other actionable outputs**: Structured executive briefs, milestone timelines, and actionable party obligation checklists (`SummaryGenerator.tsx`).
7. **Helping users prepare information or questions for a legal professional**: Automated attorney briefing dossiers, targeted counsel inquiry questions, and client-side PDF export (`LawyerPrepKit.tsx`, `pdfExporter.ts`).

*Note: Solutions provide informational assistance rather than replacing licensed attorney legal advice.*

---

## 🏗️ Architecture & Engineering Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            LEXIGUARD AI PLATFORM                            │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ Phase 1: Foundation  │ Phase 2: Core AI     │ Phase 3: Advanced Intel       │
│ • Document Ingestion │ • Plain Simplifier   │ • Redline Comparator          │
│ • Clause Breakdown   │ • RAG Q&A (pgvector) │ • Scenario Sandbox Explorer   │
│ • Flesch-Kincaid NLP │ • Executive Summary  │ • Legal Glossary Engine       │
├──────────────────────┴──────────────────────┴───────────────────────────────┤
│ Phase 4: Production, Enterprise Audit & Scale                                │
│ • GDPR PII Scrubber • Web Crypto AES-GCM • Lawyer Prep PDF Kit • Telemetry   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Enterprise Security & Compliance

- **GenAI Prompt Injection Defense**: LexiGuard Security Gateway detects and filters adversarial prompts, system prompt extractions, and instruction override jailbreaks.
- **GDPR Article 17 PII Scrubber**: Redacts Credit Cards (with Luhn check), SSN/TINs, IBANs, Passports, Emails, Phones, and IP addresses.
- **Client-Side Web Crypto API**: AES-GCM 256-bit encryption with PBKDF2 key derivation for confidential contract clauses.
- **Tamper-Proof Audit Ledger**: Cryptographic SHA-256 block chain (`hash` + `prevHash`) tracking all actions.
- **Granular RBAC**: 8 permission scopes across 4 enterprise roles (`standard_user`, `legal_reviewer`, `compliance_auditor`, `admin`).

---

## ⚡ High-Performance Efficiency & Caching

- **Float32Array Vector Mathematics**: Sub-millisecond cosine similarity calculations across 256-dimensional unit spheres.
- **LRU Cache Service**: Dual-layer in-memory LRU caching with TTL for vector embeddings and RAG answers, achieving 0ms query responses on cached prompts.
- **Prompt Caching Telemetry**: Real-time tracking of simulated 68% token reductions and latency savings.

---

## 🧪 Comprehensive Automated Test Matrix

Run automated Vitest test suites:
```bash
npm test
```

### Verified Test Suites:
- ✅ `src/test/problemStatementAlignment.test.ts`: Verification of all 7 problem statement use cases.
- ✅ `src/test/security.test.ts`: Prompt injection scanner, Luhn CC scrubber, IBAN redaction, AES-GCM crypto, SHA-256 block ledger, and RBAC matrix.
- ✅ `src/test/efficiency.test.ts`: LRU cache eviction, Float32Array vector math latency (<50ms), and repeated query caching.
- ✅ `src/test/legalAiEngine.test.ts`: Readability NLP, risk scoring engine, multi-contract comparator, lawyer prep kit, and scenario explorer.
- ✅ `src/test/vectorStore.test.ts`: 256-dim vector indexing, cosine similarity, keyword boosting, and empty query safety.
- ✅ `src/test/components.test.tsx`: WCAG 2.1 AA landmark roles, disclaimers, and UI accessibility.

---

## 🚀 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/tarun215/promptwars.git
cd promptwars

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
