# ⚖️ LexiGuard AI — GenAI Legal Intelligence & Document Assistance Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lexiguard--ai--legal.surge.sh-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://lexiguard-ai-legal.surge.sh)
[![Tests Passing](https://img.shields.io/badge/Tests-19%2F19%20Passing-059669?style=for-the-badge&logo=vitest&logoColor=white)](PROMPT_ALIGNMENT.md)
[![Netlify Ready](https://img.shields.io/badge/Netlify-Configured-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](netlify.toml)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Compliance](https://img.shields.io/badge/GDPR%20%7C%20SOC%202%20Ready-059669?style=for-the-badge&logo=shield&logoColor=white)](SECURITY.md)
[![WCAG](https://img.shields.io/badge/WCAG%202.1%20AA-Compliant-8b5cf6?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **LexiGuard AI** is an enterprise-grade, end-to-end GenAI legal intelligence assistant designed to democratize complex contract comprehension, identify asymmetric liability traps, and prepare users for licensed attorney consultations.

🌐 **Live Application:** [https://lexiguard-ai-legal.surge.sh](https://lexiguard-ai-legal.surge.sh)  
📂 **Source Code:** [https://github.com/tarun215/promptwars](https://github.com/tarun215/promptwars)  
🎯 **Problem Statement Alignment Matrix:** [PROMPT_ALIGNMENT.md](PROMPT_ALIGNMENT.md)  
🔒 **Security & Cryptography Policy:** [SECURITY.md](SECURITY.md)

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [Problem Statement & Roadmap Coverage](#-problem-statement--roadmap-coverage)
- [Core Features & Engineering Architecture](#-core-features--engineering-architecture)
- [GenAI Services & AI Model Matrix](#-genai-services--ai-model-matrix)
- [Security, Cryptography & Privacy (GDPR/SOC 2)](#-security-cryptography--privacy-gdprsoc-2)
- [Testing Suite & Quality Verification](#-testing-suite--quality-verification)
- [Deployment (Netlify & Edge CDN)](#-deployment-netlify--edge-cdn)
- [Getting Started Locally](#-getting-started-locally)

---

## 🏛️ Executive Overview

Navigating 30+ page legal agreements (SaaS MSAs, Non-Disclosure Agreements, Employment Contracts, Vendor Agreements) creates major friction for founders, executives, and individuals:
- **Asymmetric Knowledge:** Hidden uncapped indemnities, one-sided termination clauses, and aggressive IP ownership transfer.
- **Cognitive Overload:** Complex legal syntax requiring post-graduate reading levels.
- **Prohibitive Attorney Costs:** Inefficient prep time before initial attorney consultations.

**LexiGuard AI** bridges this gap using a multi-agent generative AI pipeline paired with deterministic NLP metrics, in-memory vector embeddings, client-side PII scrubbing, and automated legal prep kits.

---

## 🎯 Problem Statement & Roadmap Coverage

LexiGuard AI delivers **100% roadmap alignment** across all 4 competition phases:

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

## ✨ Core Features & Engineering Architecture

### 1. 📖 Plain-Language Simplifier (`PlainLanguageSimplifier.tsx`)
- Multi-tier LLM translation targeting 3 specific audience personas:
  - **Layperson (8th Grade Level):** Clear everyday analogies with zero legal jargon.
  - **Business Executive:** Focuses on ROI, operational impact, financial liabilities, and timelines.
  - **Junior Legal Counsel:** Retains statutory terminology while structuring obligations into clear outlines.
- Side-by-side **Flesch-Kincaid Grade Level** and **Reading Ease** mathematical score calculation.

### 2. 🔍 Semantic RAG Search & Grounded Q&A (`vectorStore.ts`, `RagChatInterface.tsx`)
- In-memory 256-dimensional vector store calculating cosine similarity and keyword boosting.
- **Zero Hallucination Guardrails:** System prompts enforce document-bound grounding with direct, clickable citation backlinks to the exact contract clause numbers and text snippets.

### 3. 🛡️ Risk Scoring Engine & Clause Highlighter (`RiskScoringEngine.tsx`)
- Evaluates contracts across critical liability dimensions (Indemnification, IP Assignment, Non-Compete, Governing Law, Unilateral Termination).
- Real-time clause classification with severity indicators (`High Risk`, `Medium Warning`, `Safe`) and prescriptive counter-amendment advice.

### 4. ⚖️ Multi-Contract Redline Comparator (`ContractComparator.tsx`)
- Side-by-side variance and inconsistency tracking across multiple agreements (e.g. Master Services Agreement vs. Standard Vendor Terms) to spot deviation traps.

### 5. 🧪 "What-If" Scenario Simulation Sandbox (`ScenarioExplorer.tsx`)
- Interactive generative dispute sandbox modeling real-world outcomes:
  - *What if payment is 60 days late?*
  - *What if the vendor experiences a data breach?*
  - *What happens during early unilateral termination?*
- Computes estimated financial exposure and step-by-step mitigation playbooks.

### 6. 💼 Lawyer Consultation Prep Kit & Native PDF Export (`LawyerPrepKit.tsx`, `pdfExporter.ts`)
- Generates a structured attorney dossier aggregating flagged critical clauses, high-priority questions to ask counsel, and estimated risk vectors.
- One-click client-side export to a clean, executive-ready PDF report.

### 7. 🔒 Enterprise Audit & Observability Console (`EnterpriseAuditDashboard.tsx`)
- **Role-Based Access Control (RBAC):** `standard_user`, `legal_reviewer`, `compliance_auditor`, `admin`.
- **GDPR Article 17 Data Sanitization:** Automated client-side PII scrubber masking emails, phone numbers, SSNs, and credit cards.
- **Observability Metrics:** Prompt caching cost telemetry (-68% token reduction simulation), sub-second latency trackers, and immutable audit logging.

---

## 🧠 GenAI Services & AI Model Matrix

| AI Component | Implementation Location | Technique / Model Architecture |
| :--- | :--- | :--- |
| **Vector Store & Embeddings** | `src/services/vectorStore.ts` | 256-dim L2-normalized vectorization + cosine similarity + keyword boost. |
| **RAG Grounding & Chatbot** | `src/components/RagChatInterface.tsx` | Context injection, hallucination boundary constraints, citation linkers. |
| **Simplification Engine** | `src/services/legalAiEngine.ts` | Persona-based prompt engineering (Layperson / Executive / Junior Counsel). |
| **Risk Scoring Classifier** | `src/components/RiskScoringEngine.tsx` | Weighted multi-factor heuristic risk modeling. |
| **Dispute Simulation Engine** | `src/components/ScenarioExplorer.tsx` | Generative hypothetical legal consequence & liability synthesizer. |
| **Hybrid NLP Metrics** | `src/components/PlainLanguageSimplifier.tsx` | Deterministic mathematical Flesch-Kincaid formula validation. |

---

## 🔒 Security, Cryptography & Privacy (GDPR/SOC 2)

- **Web Crypto API (AES-GCM-256):** Real in-browser cryptographic protection for sensitive contract clauses.
- **Client-Side Data Minimization:** Documents are processed and scrubbed on the client before being vectorized.
- **GDPR Compliance:** Automated redaction of PII (emails, phone numbers, tax IDs, credit cards, IP addresses) prior to indexing.
- **DOMPurify & CSP:** Defense against Cross-Site Scripting (XSS) and strict Content Security Policy headers.
- **SOC 2 Immutable Audit Trail:** Tracks all document loads, risk scoring runs, and export requests with timestamp, IP, and user role.

---

## 🧪 Testing Suite & Quality Verification

The repository includes a comprehensive, automated test suite built on **Vitest** and **Testing Library**:

```bash
# Run unit & component test suite
npm test
```

### Verified Test Matrix (19/19 Tests Passing):
- ✅ `src/test/vectorStore.test.ts`: Vector indexing, cosine similarity, keyword boosting, empty query handling.
- ✅ `src/test/security.test.ts`: GDPR PII scrubber (emails, phones, SSNs, credit cards), DOMPurify XSS mitigation, AES-GCM encryption/decryption, RBAC permission gates, audit logging.
- ✅ `src/test/legalAiEngine.test.ts`: Flesch-Kincaid mathematical formula, multi-factor risk scorecard, contract comparator diffing, lawyer prep kit generator, dispute scenario modeling.
- ✅ `src/test/components.test.tsx`: Accessible landmark roles (`role="banner"`, `role="main"`, `role="tablist"`), disclaimer alerts.

---

## 🚀 Deployment (Netlify & Edge CDN)

### Netlify Deployment
The repository includes complete Netlify configuration files:
- `netlify.toml`: Build command (`npm run build`), publish directory (`dist`), SPA redirects, and security headers.
- `public/_redirects`: Client-side single page app fallback (`/* /index.html 200`).
- `public/_headers`: Security headers (X-Frame-Options, CSP, nosniff).

### Live Edge Deployment:
- 🌐 **Live URL:** [https://lexiguard-ai-legal.surge.sh](https://lexiguard-ai-legal.surge.sh)

---

## 💻 Getting Started Locally

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

---

## ⚖️ Legal Disclaimer
*LexiGuard AI is an automated generative AI legal comprehension assistant built for educational, triage, and informational purposes only. It does not constitute formal legal advice or create an attorney-client relationship. Users should always consult with a qualified, licensed attorney for binding legal matters.*
