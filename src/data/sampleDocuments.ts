import { LegalDocument } from '../types';

export const SAMPLE_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-saas-msa-2025',
    title: 'Enterprise Master Services Agreement (SaaS)',
    fileName: 'Enterprise_MSA_ApexCloud_2025.pdf',
    fileType: 'pdf',
    documentType: 'Master Services Agreement',
    uploadedAt: '2025-05-14 09:30:00',
    isEncrypted: true,
    jurisdiction: 'US',
    metadata: {
      partyA: 'Apex Cloud Solutions Inc. (Vendor)',
      partyB: 'Global Omnimedia LLC (Customer)',
      effectiveDate: '2025-06-01',
      governingLaw: 'State of Delaware, USA',
      contractValue: '$180,000 / annum',
    },
    rawText: `MASTER SERVICES AGREEMENT\n\nThis Master Services Agreement ("Agreement") is made effective as of June 1, 2025, between Apex Cloud Solutions Inc., a Delaware corporation ("Vendor"), and Global Omnimedia LLC ("Customer")...`,
    clauses: [
      {
        id: 'cl-1',
        clauseNumber: 'Section 4.2',
        title: 'Payment Terms & Late Penalty Surcharges',
        category: 'payment',
        riskLevel: 'medium',
        tags: ['Payment', 'Interest', 'Deadline: 15 Days'],
        originalText: `Customer shall pay all undisputed invoiced fees within fifteen (15) calendar days from receipt of invoice. Any delinquent amounts not received by the due date shall immediately accrue interest at the compound rate of 1.5% per month (or the maximum allowable rate by Delaware law), along with full reimbursement for all collection and attorney fees incurred by Vendor.`,
        simplifiedText: {
          plain: `You must pay all invoices within 15 days of receiving them. If you are late, you will be charged 1.5% monthly compound interest plus all of the vendor's legal collection fees.`,
          executive: `15-day strict payment window with 1.5%/month compounded late fee plus collection/legal cost indemnity.`,
          bulleted: [
            'Payment due: 15 calendar days',
            'Late fee: 1.5% monthly compounded interest',
            'Customer pays vendor legal/collection costs on late dues'
          ]
        },
        riskExplanation: `A 15-day payment window is unusually short for enterprise procurement (standard is 30-45 days net). The compound interest combined with legal cost shifting creates asymmetric financial risk.`,
        actionRequired: `Request amendment to 'Net 45 days' and limit late fees to simple 1.0% interest without mandatory attorney fee shifting.`,
        deadline: '15 calendar days from invoice',
        keyParties: ['Customer (Payer)', 'Vendor (Payee)'],
        readabilityOriginal: {
          gradeLevel: 15.4,
          gradeLabel: 'College Senior / Professional',
          readingEase: 32.1,
          readingTimeMinutes: 1.2,
          wordCount: 52,
          sentenceCount: 2,
          complexWordsPercentage: 28.8
        },
        readabilitySimplified: {
          gradeLevel: 7.8,
          gradeLabel: '8th Grade (General Public)',
          readingEase: 74.5,
          readingTimeMinutes: 0.4,
          wordCount: 31,
          sentenceCount: 2,
          complexWordsPercentage: 6.4
        }
      },
      {
        id: 'cl-2',
        clauseNumber: 'Section 8.1',
        title: 'Unilateral Limitation of Liability & Consequential Damages Cap',
        category: 'liability',
        riskLevel: 'critical',
        tags: ['Liability Cap', 'High Risk', 'Exclusion of Damages'],
        originalText: `IN NO EVENT SHALL VENDOR BE LIABLE UNDER ANY LEGAL THEORY, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR INDEMNITY, FOR ANY INDIRECT, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES. VENDOR'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL UNDER NO CIRCUMSTANCES EXCEED THE FEES ACTUALLY PAID BY CUSTOMER IN THE PRECEDING THREE (3) MONTHS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH LOSS.`,
        simplifiedText: {
          plain: `The vendor is completely protected against any consequential or indirect damages (such as lost profits or business downtime). If something catastrophic happens due to the vendor's software, the maximum money you can ever recover is limited to the last 3 months of fees you paid.`,
          executive: `Vendor caps total liability to trailing 3 months fees and disclaims all consequential damages; highly one-sided.`,
          bulleted: [
            'No recovery for lost profits or data loss',
            'Maximum payout capped at 3 months of subscription fees',
            'Applies even if the vendor acted negligently'
          ]
        },
        riskExplanation: `The liability cap is pegged to 3 months of fees rather than standard 12 months or insurance coverage limits. If a data breach or catastrophic outage halts your business, your recovery is severely limited.`,
        actionRequired: `Negotiate a 12-month trailing fee cap or a specific super-cap ($1M–$2M) for data privacy breaches and gross negligence.`,
        keyParties: ['Vendor (Protected)', 'Customer (Restricted)'],
        readabilityOriginal: {
          gradeLevel: 16.8,
          gradeLabel: 'Graduate Level / Legal Specialist',
          readingEase: 21.4,
          readingTimeMinutes: 1.5,
          wordCount: 64,
          sentenceCount: 2,
          complexWordsPercentage: 35.9
        },
        readabilitySimplified: {
          gradeLevel: 8.2,
          gradeLabel: '8th Grade (General Public)',
          readingEase: 71.2,
          readingTimeMinutes: 0.5,
          wordCount: 46,
          sentenceCount: 2,
          complexWordsPercentage: 8.7
        }
      },
      {
        id: 'cl-3',
        clauseNumber: 'Section 11.3',
        title: 'Broad Customer Indemnification & Defense Obligation',
        category: 'indemnity',
        riskLevel: 'high',
        tags: ['Indemnification', 'Third-Party Claims', 'Legal Exposure'],
        originalText: `Customer agrees to defend, indemnify, and hold harmless Vendor, its affiliates, directors, officers, and employees against any and all third-party claims, regulatory investigations, fines, losses, damages, and legal expenses arising directly or indirectly out of Customer's data, Customer's misuse of the platform, or alleged infringement of any third-party intellectual property rights.`,
        simplifiedText: {
          plain: `You are legally required to hire lawyers, pay all legal costs, and pay any court damages on behalf of the vendor if anyone sues the vendor over the data you uploaded or how you used their system.`,
          executive: `Unilateral customer indemnity for third-party claims, regulatory penalties, and IP infringement tied to customer data.`,
          bulleted: [
            'Customer pays vendor legal defense costs upfront',
            'Covers fines and regulatory investigations',
            'No reciprocal indemnity from vendor for software flaws'
          ]
        },
        riskExplanation: `This indemnity is one-way. While the customer indemnifies the vendor broadly, the vendor provides no mutual indemnity if their own software infringes a third-party patent or leaks customer data.`,
        actionRequired: `Demand mutual indemnification: Vendor must indemnify Customer against IP infringement claims arising from the Vendor's platform.`,
        keyParties: ['Customer (Indemnitor)', 'Vendor (Indemnitee)'],
        readabilityOriginal: {
          gradeLevel: 16.2,
          gradeLabel: 'Graduate Level',
          readingEase: 24.8,
          readingTimeMinutes: 1.3,
          wordCount: 52,
          sentenceCount: 1,
          complexWordsPercentage: 34.6
        },
        readabilitySimplified: {
          gradeLevel: 8.0,
          gradeLabel: '8th Grade (General Public)',
          readingEase: 72.8,
          readingTimeMinutes: 0.4,
          wordCount: 35,
          sentenceCount: 1,
          complexWordsPercentage: 8.5
        }
      },
      {
        id: 'cl-4',
        clauseNumber: 'Section 13.2',
        title: 'Termination for Convenience & Post-Termination Data Retention',
        category: 'termination',
        riskLevel: 'medium',
        tags: ['Termination', 'Data Deletion', 'Deadline: 30 Days'],
        originalText: `Vendor may terminate this Agreement without cause upon thirty (30) days prior written notice. Upon termination, Vendor shall have no obligation to maintain Customer Data and may permanently delete all databases after forty-five (45) days unless Customer requests export within fifteen (15) days of termination at Vendor's then-prevailing hourly consulting fees.`,
        simplifiedText: {
          plain: `The vendor can cancel your account at any time with 30 days notice. After cancellation, they will permanently erase all your business data unless you request a data export within 15 days and pay extra hourly fees for it.`,
          executive: `Vendor 30-day termination for convenience; customer data deleted at 45 days unless export purchased within 15 days.`,
          bulleted: [
            'Vendor can cancel with 30 days notice',
            'Customer has only 15 days to request data export',
            'Vendor charges extra consulting fees to give back your own data'
          ]
        },
        riskExplanation: `Short 15-day window to salvage company data before deletion, plus charging extra fees to export customer-owned data, creates significant operational hostage risk.`,
        actionRequired: `Require free, self-serve automated data export for 90 days following termination, and mutual termination notice of 60-90 days.`,
        deadline: '15 days to request export, 45 days to permanent deletion',
        keyParties: ['Vendor (Terminating Party)', 'Customer (Data Owner)'],
        readabilityOriginal: {
          gradeLevel: 14.9,
          gradeLabel: 'College Junior / Senior',
          readingEase: 35.0,
          readingTimeMinutes: 1.1,
          wordCount: 53,
          sentenceCount: 2,
          complexWordsPercentage: 26.4
        },
        readabilitySimplified: {
          gradeLevel: 7.5,
          gradeLabel: '7th/8th Grade (Clear & Accessible)',
          readingEase: 76.2,
          readingTimeMinutes: 0.4,
          wordCount: 39,
          sentenceCount: 2,
          complexWordsPercentage: 5.1
        }
      },
      {
        id: 'cl-5',
        clauseNumber: 'Section 16.4',
        title: 'Mandatory Binding Arbitration & Waiver of Class Action',
        category: 'risk',
        riskLevel: 'high',
        tags: ['Arbitration', 'Dispute Resolution', 'Waiver of Jury'],
        originalText: `All disputes arising out of or in connection with this Agreement shall be resolved exclusively through final and binding confidential individual arbitration administered by the American Arbitration Association in Wilmington, Delaware. Customer irrevocably waives any right to a trial by jury or to participate in any class action lawsuit or consolidated dispute proceedings.`,
        simplifiedText: {
          plain: `You give up your right to sue in an open court, you give up your right to a jury trial, and you cannot join with other customers in a class-action lawsuit. All disputes must be handled in private arbitration in Delaware.`,
          executive: `Mandatory binding AAA arbitration in Wilmington, DE with complete waiver of jury trial and class action rights.`,
          bulleted: [
            'No public court trials',
            'No jury trial',
            'No class action lawsuits',
            'Must travel/arbitrate in Wilmington, Delaware'
          ]
        },
        riskExplanation: `Private arbitration in Delaware increases expense for out-of-state customers and eliminates public legal precedent and class collective bargaining.`,
        actionRequired: `If located elsewhere, negotiate venue in Customer's home state or mutual jurisdiction, and retain rights to injunctive relief in local court.`,
        keyParties: ['Customer', 'Vendor', 'AAA Arbitrator'],
        readabilityOriginal: {
          gradeLevel: 15.8,
          gradeLabel: 'College Senior',
          readingEase: 28.6,
          readingTimeMinutes: 1.2,
          wordCount: 56,
          sentenceCount: 2,
          complexWordsPercentage: 30.3
        },
        readabilitySimplified: {
          gradeLevel: 7.9,
          gradeLabel: '8th Grade (General Public)',
          readingEase: 73.4,
          readingTimeMinutes: 0.4,
          wordCount: 38,
          sentenceCount: 2,
          complexWordsPercentage: 5.2
        }
      }
    ]
  },
  {
    id: 'doc-comm-lease-2025',
    title: 'Commercial Real Estate Lease Agreement',
    fileName: 'Commercial_Office_Lease_Metropolitan_Tower.pdf',
    fileType: 'pdf',
    documentType: 'Commercial Lease',
    uploadedAt: '2025-05-18 14:15:00',
    isEncrypted: true,
    jurisdiction: 'US',
    metadata: {
      partyA: 'Metropolitan Real Estate Trust LLC (Landlord)',
      partyB: 'Apex Ventures Digital Studio (Tenant)',
      effectiveDate: '2025-07-01',
      governingLaw: 'State of New York, USA',
      contractValue: '$14,500 / month ($174,000 / year)',
    },
    rawText: `COMMERCIAL LEASE AGREEMENT\n\nThis Lease is made as of July 1, 2025 between Metropolitan Real Estate Trust LLC ("Landlord") and Apex Ventures Digital Studio ("Tenant")...`,
    clauses: [
      {
        id: 'cl-lease-1',
        clauseNumber: 'Section 3.1',
        title: 'Triple Net (NNN) Operating Expenses & Uncapped Pass-Throughs',
        category: 'obligation',
        riskLevel: 'high',
        tags: ['NNN Lease', 'Operating Expenses', 'Financial Risk'],
        originalText: `Tenant agrees to pay Landlord as Additional Rent its Proportionate Share (14.2%) of all Operating Expenses incurred in the operation, maintenance, security, property taxes, capital improvements, and structural management of the Building without any annual ceiling or cap. Landlord shall provide an estimated annual budget and reconciliation statement within one hundred twenty (120) days following fiscal year end.`,
        simplifiedText: {
          plain: `On top of your monthly rent, you must pay 14.2% of all building costs (taxes, repairs, staff, and even major building upgrades) with NO maximum spending limit. If the landlord decides on expensive upgrades, your bill will increase without limitation.`,
          executive: `Uncapped 14.2% NNN operating expense pass-through including structural capital expenditures.`,
          bulleted: [
            'Additional rent: 14.2% of total building costs',
            'No annual cap on expense increases (unlimited exposure)',
            'Includes capital building improvements'
          ]
        },
        riskExplanation: `Uncapped NNN expenses can lead to unexpected 20-50% rent spikes if the landlord undertakes major roof repairs, HVAC overhauls, or property tax assessments.`,
        actionRequired: `Demand an annual cap (e.g. max 5% increase per year on controllable operating expenses) and exclude capital structural repairs.`,
        deadline: 'Annual reconciliation within 120 days of fiscal year end',
        keyParties: ['Landlord (Billing)', 'Tenant (Paying)'],
        readabilityOriginal: {
          gradeLevel: 15.6,
          gradeLabel: 'College Senior',
          readingEase: 30.5,
          readingTimeMinutes: 1.1,
          wordCount: 56,
          sentenceCount: 2,
          complexWordsPercentage: 32.1
        },
        readabilitySimplified: {
          gradeLevel: 7.6,
          gradeLabel: '7th/8th Grade',
          readingEase: 75.8,
          readingTimeMinutes: 0.4,
          wordCount: 39,
          sentenceCount: 2,
          complexWordsPercentage: 7.6
        }
      },
      {
        id: 'cl-lease-2',
        clauseNumber: 'Section 9.4',
        title: 'Holdover Penalty Surcharge (200% Rent Multiplier)',
        category: 'penalty',
        riskLevel: 'medium',
        tags: ['Holdover', '200% Rent', 'Eviction'],
        originalText: `If Tenant remains in possession of the Premises following expiration or earlier termination of this Lease without Landlord's express written consent, Tenant shall be deemed a tenant-at-sufferance and shall pay Base Rent at two hundred percent (200%) of the rate in effect immediately prior to expiration, calculated on a daily basis.`,
        simplifiedText: {
          plain: `If you do not move out on the exact date your lease ends, your rent doubles (200%) immediately for every extra day you remain in the building.`,
          executive: `200% daily holdover penalty upon lease expiration without prior written extension.`,
          bulleted: [
            'Holdover rent: 200% of previous base rent',
            'Billed on a daily basis immediately',
            'Tenant loses tenant rights and becomes tenant-at-sufferance'
          ]
        },
        riskExplanation: `200% holdover is aggressive (commercial market standard is 125% to 150% for the first 30-60 days). Delays in moving or finding new space could double occupancy costs instantly.`,
        actionRequired: `Propose 125% for the first 30 days of holdover, increasing to 150% thereafter.`,
        deadline: 'Effective immediately upon lease expiry',
        keyParties: ['Tenant (Subject to penalty)', 'Landlord'],
        readabilityOriginal: {
          gradeLevel: 14.8,
          gradeLabel: 'College Junior',
          readingEase: 36.2,
          readingTimeMinutes: 1.0,
          wordCount: 48,
          sentenceCount: 1,
          complexWordsPercentage: 25.0
        },
        readabilitySimplified: {
          gradeLevel: 7.2,
          gradeLabel: '7th Grade',
          readingEase: 78.4,
          readingTimeMinutes: 0.3,
          wordCount: 29,
          sentenceCount: 1,
          complexWordsPercentage: 3.4
        }
      },
      {
        id: 'cl-lease-3',
        clauseNumber: 'Section 14.2',
        title: 'Security Deposit Forfeiture & Unlimited Replenishment',
        category: 'obligation',
        riskLevel: 'high',
        tags: ['Security Deposit', 'Cash Reserve', 'Replenishment: 5 Days'],
        originalText: `Tenant shall maintain a Security Deposit equal to three (3) months Base Rent ($43,500). If Landlord applies any portion of the Security Deposit to remedy Tenant defaults, Tenant shall immediately upon five (5) business days written demand replenish said deposit to its full initial amount. Failure to replenish within five days constitutes an incurable material breach.`,
        simplifiedText: {
          plain: `You must keep $43,500 deposited with the landlord. If the landlord ever takes money out to fix a problem, you have only 5 days to pay the money back in full, or you face immediate lease default and eviction.`,
          executive: `3-month security deposit ($43,500) with 5-day strict mandatory replenishment upon drawdown.`,
          bulleted: [
            'Deposit amount: $43,500 (3 months rent)',
            'Replenishment timeline: 5 business days',
            'Failure to replenish is an immediate incurable breach'
          ]
        },
        riskExplanation: `A 5-day turnaround to replenish tens of thousands of dollars is extremely tight and risks sudden lease termination.`,
        actionRequired: `Request 15-20 business days cure period for deposit replenishment.`,
        deadline: '5 business days following written notice',
        keyParties: ['Tenant', 'Landlord'],
        readabilityOriginal: {
          gradeLevel: 15.1,
          gradeLabel: 'College Senior',
          readingEase: 33.4,
          readingTimeMinutes: 1.1,
          wordCount: 54,
          sentenceCount: 2,
          complexWordsPercentage: 27.7
        },
        readabilitySimplified: {
          gradeLevel: 7.4,
          gradeLabel: '7th/8th Grade',
          readingEase: 77.0,
          readingTimeMinutes: 0.4,
          wordCount: 38,
          sentenceCount: 2,
          complexWordsPercentage: 5.2
        }
      }
    ]
  },
  {
    id: 'doc-nda-freelance-2025',
    title: 'Independent Contractor IP & NDA Agreement',
    fileName: 'Contractor_IP_Assignment_InnovateTech.pdf',
    fileType: 'pdf',
    documentType: 'Independent Contractor NDA',
    uploadedAt: '2025-05-20 11:00:00',
    isEncrypted: true,
    jurisdiction: 'US',
    metadata: {
      partyA: 'InnovateTech Inc. (Company)',
      partyB: 'Jane Doe (Contractor)',
      effectiveDate: '2025-06-15',
      governingLaw: 'State of California, USA',
      contractValue: '$120 / hour',
    },
    rawText: `INDEPENDENT CONTRACTOR AGREEMENT\n\nThis Independent Contractor and Proprietary Rights Agreement is entered into by InnovateTech Inc. and Jane Doe...`,
    clauses: [
      {
        id: 'cl-nda-1',
        clauseNumber: 'Section 2.1',
        title: 'Perpetual & Worldwide Inventions Assignment (Work-for-Hire)',
        category: 'intellectual_property',
        riskLevel: 'high',
        tags: ['IP Assignment', 'Work For Hire', 'Inventions'],
        originalText: `Contractor hereby unconditionally and irrevocably assigns to Company all right, title, and interest throughout the universe in and to all inventions, software code, designs, algorithms, and works of authorship conceived, developed, or reduced to practice during the term of this Agreement, whether or not created during normal working hours or using Company equipment.`,
        simplifiedText: {
          plain: `Everything you create, code, or invent while under this contract—even in your free time, on your own laptop, on weekends—automatically belongs 100% to the company forever worldwide.`,
          executive: `Broad 24/7 IP assignment capturing all contractor inventions during contract term regardless of equipment or work hours.`,
          bulleted: [
            'All inventions assigned to company',
            'Applies to work done outside company hours',
            'Applies to personal laptop and home projects'
          ]
        },
        riskExplanation: `Capturing inventions made outside working hours and without company equipment violates California Labor Code Section 2870 principles and steals contractor's pre-existing and personal side projects.`,
        actionRequired: `Carve out personal projects: Limit IP assignment strictly to deliverables created specifically for Company using Company resources. Add an 'Excluded Prior Inventions' schedule.`,
        keyParties: ['Company (Assignee)', 'Contractor (Assignor)'],
        readabilityOriginal: {
          gradeLevel: 16.4,
          gradeLabel: 'Graduate Level',
          readingEase: 22.8,
          readingTimeMinutes: 1.2,
          wordCount: 52,
          sentenceCount: 1,
          complexWordsPercentage: 36.5
        },
        readabilitySimplified: {
          gradeLevel: 7.7,
          gradeLabel: '7th/8th Grade',
          readingEase: 74.9,
          readingTimeMinutes: 0.3,
          wordCount: 30,
          sentenceCount: 1,
          complexWordsPercentage: 6.6
        }
      },
      {
        id: 'cl-nda-2',
        clauseNumber: 'Section 6.3',
        title: '24-Month Post-Termination Non-Compete Restriction',
        category: 'risk',
        riskLevel: 'critical',
        tags: ['Non-Compete', 'Enforceability', 'Restraint of Trade'],
        originalText: `For a period of twenty-four (24) months following termination of this Agreement for any reason, Contractor shall not directly or indirectly provide consulting, engineering, or advisory services to any business entity that engages in any software development competing with Company's actual or planned products globally.`,
        simplifiedText: {
          plain: `For 2 whole years after you stop working for this company, you are forbidden from working for, consulting with, or advising any company that makes software similar to what this company does or plans to do anywhere in the world.`,
          executive: `24-month worldwide non-compete against all actual or prospective competitor software products.`,
          bulleted: [
            '2-year ban on working in the same field',
            'Worldwide scope',
            'Often unenforceable in CA under BPC §16600, but creates intimidation & litigation risk'
          ]
        },
        riskExplanation: `In many jurisdictions (e.g. California BPC §16600, FTC rule), non-competes are void as a matter of law. In other states, a 2-year worldwide ban can destroy your livelihood.`,
        actionRequired: `Strike Section 6.3 entirely or replace with a narrow non-solicitation of clients/employees clause.`,
        deadline: '24 months post-termination',
        keyParties: ['Contractor (Restricted)', 'Company'],
        readabilityOriginal: {
          gradeLevel: 15.9,
          gradeLabel: 'College Senior',
          readingEase: 27.4,
          readingTimeMinutes: 1.1,
          wordCount: 46,
          sentenceCount: 1,
          complexWordsPercentage: 32.6
        },
        readabilitySimplified: {
          gradeLevel: 7.8,
          gradeLabel: '8th Grade',
          readingEase: 73.1,
          readingTimeMinutes: 0.4,
          wordCount: 37,
          sentenceCount: 1,
          complexWordsPercentage: 5.4
        }
      }
    ]
  }
];

export const LEGAL_GLOSSARY = [
  {
    term: 'Indemnification',
    pronunciation: 'in-dem-nuh-fuh-KAY-shun',
    plainMeaning: 'A promise where one party agrees to pay for the legal costs, damages, or losses suffered by the other party if a third party sues them.',
    latinOrigin: 'From Latin "indemnis" meaning uninjured or free from penalty.',
    exampleContext: 'The Customer indemnifies the Vendor against copyright infringement claims regarding uploaded data.',
    jurisdictionNotes: 'Under US and UK law, indemnity clauses must be clear and unequivocal to cover negligence.'
  },
  {
    term: 'Limitation of Liability',
    pronunciation: 'lim-uh-TAY-shun of lye-uh-BIL-uh-tee',
    plainMeaning: 'A contractual cap that limits the maximum total amount of money one party can be forced to pay the other if something goes wrong or the contract is breached.',
    exampleContext: 'Liability is capped at the total amount paid by Customer in the preceding 12 months.',
    jurisdictionNotes: 'Most jurisdictions prohibit capping liability for gross negligence, willful misconduct, or death/personal injury.'
  },
  {
    term: 'Force Majeure',
    pronunciation: 'forss ma-ZHUR',
    latinOrigin: 'French for "superior force".',
    plainMeaning: 'A clause that frees both parties from liability or obligations when an extraordinary event or circumstance beyond their control occurs (such as war, earthquake, pandemic, or government shutdown).',
    exampleContext: 'Neither party is liable for delivery delays caused by hurricane or cyberwarfare under Force Majeure.',
    jurisdictionNotes: 'Civil law systems (EU) often have statutory force majeure, while Common Law (US/UK) requires explicit contractual definition.'
  },
  {
    term: 'Severability',
    pronunciation: 'sev-er-uh-BIL-uh-tee',
    plainMeaning: 'A rule stating that if a court finds one specific part of the contract illegal or invalid, the rest of the contract remains valid and in effect.',
    exampleContext: 'If the non-compete clause is declared void, the remaining confidentiality terms remain binding.',
    jurisdictionNotes: 'Standard boilerplate clause in US, UK, and EU commercial contracts.'
  },
  {
    term: 'Liquidated Damages',
    pronunciation: 'LIK-wih-day-tid DAM-ih-jiz',
    plainMeaning: 'A predetermined, agreed-upon monetary amount that one party pays if they breach a specific requirement (such as late delivery), avoiding the need to calculate actual losses in court.',
    exampleContext: 'Tenant pays $500 per day in liquidated damages for every day the construction handover is delayed.',
    jurisdictionNotes: 'Courts will strike down liquidated damages if they constitute a punitive penalty rather than a reasonable pre-estimate of loss.'
  },
  {
    term: 'Triple Net (NNN)',
    pronunciation: 'TRIP-uhl net',
    plainMeaning: 'A lease agreement where the tenant agrees to pay all real estate taxes, building insurance, and maintenance costs in addition to the normal monthly rent.',
    exampleContext: 'In an NNN office lease, the tenant is responsible for their share of building roof repairs and property taxes.',
    jurisdictionNotes: 'Common in commercial real estate across North America and Western Europe.'
  },
  {
    term: 'Work for Hire',
    pronunciation: 'wurk for hire',
    plainMeaning: 'A legal doctrine where the employer or hiring company automatically owns the copyright and intellectual property created by an employee or contractor from the moment of creation.',
    exampleContext: 'All code written under this contract is deemed a work for hire owned exclusively by InnovateTech.',
    jurisdictionNotes: 'US Copyright Act (17 U.S.C. § 101) requires a written instrument for independent contractors to assign work-for-hire rights.'
  },
  {
    term: 'Waiver of Subrogation',
    pronunciation: 'WAY-ver of sub-roh-GAY-shun',
    plainMeaning: 'An agreement where an insurance company gives up its right to sue the other contract party to recover money paid out for a claim.',
    exampleContext: 'Both landlord and tenant agree to a mutual waiver of subrogation for property fire insurance.',
    jurisdictionNotes: 'Standard requirement in commercial lease and construction insurance schedules.'
  }
];
