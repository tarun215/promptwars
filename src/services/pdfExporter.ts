import { jsPDF } from 'jspdf';
import { ComparisonReport, LawyerPrepKitData, LegalDocument, RiskScorecard } from '../types';

export class PdfExportService {
  /**
   * Export Annotated Document Analysis PDF
   */
  static exportDocumentReport(doc: LegalDocument, scorecard: RiskScorecard): void {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    let y = 40;

    // Header / Title
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.rect(0, 0, 612, 70, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LexiGuard AI — Legal Intelligence Report', 40, 36);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Generated: ${new Date().toLocaleDateString()} | Confidential Legal Assistance Analysis`, 40, 52);

    y = 90;

    // Document Metadata Block
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Document: ${doc.title}`, 40, y);
    y += 18;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Parties: ${doc.metadata.partyA}  vs  ${doc.metadata.partyB}`, 40, y);
    y += 14;
    pdf.text(`Governing Law: ${doc.metadata.governingLaw} | Effective Date: ${doc.metadata.effectiveDate}`, 40, y);
    y += 24;

    // Risk Scorecard Summary Banner
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(40, y, 532, 45, 4, 4, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(scorecard.overallTier === 'critical' ? 225 : 79, 29, 72);
    pdf.text(`Overall Risk Rating: ${scorecard.overallTier.toUpperCase()} (${scorecard.overallScore}/100)`, 52, y + 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    const splitSummary = pdf.splitTextToSize(scorecard.summary, 508);
    pdf.text(splitSummary, 52, y + 34);

    y += 65;

    // Clauses Breakdown
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Key Clause Analyses & Plain Language Translations', 40, y);
    y += 16;

    doc.clauses.forEach((cl, index) => {
      if (y > 700) {
        pdf.addPage();
        y = 40;
      }

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${index + 1}. ${cl.clauseNumber} — ${cl.title} [Risk: ${cl.riskLevel.toUpperCase()}]`, 40, y);
      y += 14;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 116, 139);
      const originalLines = pdf.splitTextToSize(`Original: "${cl.originalText.substring(0, 180)}..."`, 532);
      pdf.text(originalLines, 40, y);
      y += originalLines.length * 11 + 4;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(2, 132, 199);
      pdf.text('Plain Language Meaning:', 40, y);
      y += 12;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(30, 41, 59);
      const plainLines = pdf.splitTextToSize(cl.simplifiedText.plain, 532);
      pdf.text(plainLines, 40, y);
      y += plainLines.length * 11 + 6;

      if (cl.actionRequired) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(180, 83, 9);
        pdf.text(`Action Required: ${cl.actionRequired}`, 40, y);
        y += 14;
      }

      y += 10;
    });

    // Disclaimer Footer
    if (y > 720) {
      pdf.addPage();
      y = 40;
    }
    y += 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(148, 163, 184);
    const disclaimer = 'DISCLAIMER: This document was prepared by LexiGuard AI for informational and educational purposes only and does not constitute formal legal advice. Consult a qualified, licensed attorney in your jurisdiction for binding legal decisions.';
    pdf.text(pdf.splitTextToSize(disclaimer, 532), 40, y);

    pdf.save(`LexiGuard_Analysis_${doc.fileName.replace('.pdf', '')}.pdf`);
  }

  /**
   * Export Lawyer Consultation Prep Kit PDF
   */
  static exportLawyerPrepKitPdf(doc: LegalDocument, prepKit: LawyerPrepKitData): void {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    let y = 40;

    // Header
    pdf.setFillColor(30, 41, 59);
    pdf.rect(0, 0, 612, 70, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lawyer Consultation Briefing Kit', 40, 36);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(203, 213, 225);
    pdf.text(`Target Document: ${doc.title} | Prepared for Counsel Review`, 40, 52);

    y = 90;

    // Key Facts Table
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('1. Key Contract Facts & Parties', 40, y);
    y += 16;

    prepKit.keyFacts.forEach((fact) => {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(71, 85, 105);
      pdf.text(`${fact.label}:`, 40, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(15, 23, 42);
      pdf.text(fact.value, 150, y);
      y += 14;
    });

    y += 12;

    // Prioritized Questions for Attorney
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('2. Recommended Consultation Questions for Your Attorney', 40, y);
    y += 16;

    prepKit.criticalQuestions.forEach((q, idx) => {
      if (y > 700) {
        pdf.addPage();
        y = 40;
      }
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(q.priority === 'high' ? 225 : 51, q.priority === 'high' ? 29 : 65, 85);
      pdf.text(`Q${idx + 1} [${q.priority.toUpperCase()} PRIORITY - ${q.category}]: ${q.question}`, 40, y);
      y += 13;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      const whyLines = pdf.splitTextToSize(`Strategic Context: ${q.contextWhyAsk}`, 532);
      pdf.text(whyLines, 40, y);
      y += whyLines.length * 11 + 8;
    });

    y += 10;
    // Obligation Matrix
    if (y > 660) {
      pdf.addPage();
      y = 40;
    }
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('3. Core Party Obligations Matrix', 40, y);
    y += 16;

    prepKit.obligationsMatrix.forEach((ob, idx) => {
      if (y > 700) {
        pdf.addPage();
        y = 40;
      }
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 41, 59);
      pdf.text(`${idx + 1}. [${ob.party}]: ${ob.obligation}`, 40, y);
      y += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Deadline: ${ob.frequencyOrDeadline} | Penalty for Default: ${ob.penaltyForNonCompliance}`, 55, y);
      y += 15;
    });

    pdf.save(`Lawyer_Prep_Kit_${doc.fileName.replace('.pdf', '')}.pdf`);
  }

  /**
   * Export Contract Comparison Report PDF
   */
  static exportComparisonPdf(report: ComparisonReport): void {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    let y = 40;

    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 612, 70, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contract Comparison & Redline Report', 40, 36);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(203, 213, 225);
    pdf.text(`Alignment: ${report.similarityScore}% | Doc A: ${report.docATitle} vs Doc B: ${report.docBTitle}`, 40, 52);

    y = 90;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Executive Comparison Summary:', 40, y);
    y += 14;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    const summaryLines = pdf.splitTextToSize(report.executiveSummary, 532);
    pdf.text(summaryLines, 40, y);
    y += summaryLines.length * 11 + 16;

    // Diff details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text('Clause Comparison Details', 40, y);
    y += 16;

    report.diffs.forEach((diff, idx) => {
      if (y > 700) {
        pdf.addPage();
        y = 40;
      }
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${idx + 1}. ${diff.clauseTitle} [Status: ${diff.status.toUpperCase()}]`, 40, y);
      y += 13;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      const diffLines = pdf.splitTextToSize(`Analysis: ${diff.analysis}`, 532);
      pdf.text(diffLines, 40, y);
      y += diffLines.length * 11 + 10;
    });

    pdf.save(`Comparison_Report_${report.docAId}_vs_${report.docBId}.pdf`);
  }
}
