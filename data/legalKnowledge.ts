export interface EmergencyHelpline {
  number: string;
  name: string;
  authority: string;
  description: string;
  verifiedOfficialUrl: string;
  is24x7: boolean;
  priority: number;
}

export interface LegalDomainKnowledge {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  keyStatutes: {
    act: string;
    sections: string[];
    description: string;
  }[];
  criticalClarifyingQuestions: {
    id: string;
    question: string;
    hindiQuestion: string;
    options: string[];
    whyNeeded: string;
  }[];
  standardProcedures: {
    stepNumber: number;
    title: string;
    action: string;
    statutoryBacking?: string;
  }[];
  officialPortals: {
    name: string;
    url: string;
    description: string;
  }[];
  limitationOrTimelines: string;
  emergencyHelplines?: EmergencyHelpline[];
  draftTemplate?: {
    title: string;
    templateText: string;
  };
}

export const VERIFIED_HELPLINES: Record<string, EmergencyHelpline> = {
  nationalEmergency: {
    number: "112",
    name: "National Emergency Response Support System (ERSS)",
    authority: "Ministry of Home Affairs (MHA), Government of India",
    description: "Single unified 24x7 emergency number for immediate Police, Fire, and Ambulance dispatch across all Indian States/UTs.",
    verifiedOfficialUrl: "https://112.gov.in",
    is24x7: true,
    priority: 1,
  },
  womenHelpline: {
    number: "181",
    name: "Women Helpline (WHL)",
    authority: "Ministry of Women & Child Development (MWCD), Govt of India",
    description: "24x7 toll-free emergency response and rescue for women affected by violence, harassment, or domestic abuse; linked to One Stop Sakhi Centres and Protection Officers.",
    verifiedOfficialUrl: "https://wcd.nic.in/schemes/women-helpline-scheme-0",
    is24x7: true,
    priority: 2,
  },
  ncwHelpline: {
    number: "7827170170",
    name: "National Commission for Women 24x7 Helpline",
    authority: "National Commission for Women (NCW)",
    description: "Dedicated round-the-clock helpline for women facing domestic violence, sexual harassment, or physical danger.",
    verifiedOfficialUrl: "http://ncw.nic.in",
    is24x7: true,
    priority: 3,
  },
  womenPolice: {
    number: "1091",
    name: "Police Women in Distress Helpline",
    authority: "State Police Departments",
    description: "Rapid police intervention for women facing eve-teasing, stalking, domestic threat, or street harassment.",
    verifiedOfficialUrl: "https://112.gov.in",
    is24x7: true,
    priority: 4,
  },
  cyberCrime: {
    number: "1930",
    name: "National Cyber Crime Helpline (Citizen Financial Cyber Fraud Reporting System)",
    authority: "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs",
    description: "Official Golden-Hour helpline for immediate reporting of financial fraud, UPI scams, and card theft to block funds in transit.",
    verifiedOfficialUrl: "https://cybercrime.gov.in",
    is24x7: true,
    priority: 5,
  },
  legalAid: {
    number: "15100",
    name: "NALSA Free Legal Aid Helpline",
    authority: "National Legal Services Authority (NALSA)",
    description: "Toll-free helpline providing free legal counsel and government-assigned legal aid advocates under the Legal Services Authorities Act, 1987.",
    verifiedOfficialUrl: "https://nalsa.gov.in",
    is24x7: true,
    priority: 6,
  },
  consumerHelpline: {
    number: "1915",
    name: "National Consumer Helpline (NCH)",
    authority: "Department of Consumer Affairs, Ministry of Consumer Affairs, GoI",
    description: "National helpline for consumer grievances, defective goods, unfair trade practices, and refund disputes.",
    verifiedOfficialUrl: "https://consumerhelpline.gov.in",
    is24x7: false,
    priority: 7,
  },
  childline: {
    number: "1098",
    name: "Childline Emergency Support",
    authority: "Ministry of Women & Child Development",
    description: "24x7 emergency helpline for children in need of care, protection, or reporting child abuse.",
    verifiedOfficialUrl: "https://wcd.nic.in",
    is24x7: true,
    priority: 8,
  },
};

export const LEGAL_KNOWLEDGE_BASE: Record<string, LegalDomainKnowledge> = {
  DOMESTIC_VIOLENCE: {
    id: "DOMESTIC_VIOLENCE",
    name: "Domestic Violence & Women Safety",
    hindiName: "घरेलू हिंसा एवं महिला सुरक्षा",
    description: "Protection for women facing physical, emotional, economic, or verbal abuse in a domestic or matrimonial relationship.",
    keyStatutes: [
      {
        act: "Protection of Women from Domestic Violence Act, 2005 (PWDVA)",
        sections: ["Section 3", "Section 12", "Section 18", "Section 19", "Section 20", "Section 22", "Section 31"],
        description: "Section 3 defines domestic violence broadly (physical, sexual, verbal, emotional, economic). Section 12 allows filing before Magistrate. Section 18 grants protection orders. Section 19 secures residence rights (cannot be evicted from shared household). Section 31 makes violation of protection order cognizable and non-bailable.",
      },
      {
        act: "Bharatiya Nyaya Sanhita, 2023 (BNS) / Indian Penal Code (IPC)",
        sections: ["Section 85 & 86 BNS (formerly 498A IPC)", "Section 74 & 75 BNS (formerly 354 IPC)", "Section 78 BNS (formerly 354D IPC)"],
        description: "Criminal provisions penalizing cruelty by husband or in-laws, outraging modesty, and physical/online stalking.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "immediate_safety",
        question: "Are you or any dependents currently in immediate physical danger or confined in the house?",
        hindiQuestion: "क्या आप या आपके बच्चे इस समय किसी शारीरिक खतरे या घर में कैद की स्थिति में हैं?",
        options: ["Yes, immediate danger", "Safe for now, but facing ongoing threats", "Safe, seeking legal remedies"],
        whyNeeded: "Determines whether to trigger emergency police dispatch (112/181) before legal advisory.",
      },
      {
        id: "shared_household",
        question: "Are you currently residing in the shared marital household, or have you been forced out?",
        hindiQuestion: "क्या आप अभी भी साझा घर में रह रही हैं या आपको घर से निकाल दिया गया है?",
        options: ["Still in the shared household", "Forced out / at parents or shelter", "Planning to leave safely"],
        whyNeeded: "Invokes Section 19 PWDVA Residence Order protection against wrongful eviction.",
      },
      {
        id: "prior_reports",
        question: "Have you previously reported this to the police, a Protection Officer, or an NGO?",
        hindiQuestion: "क्या आपने पहले पुलिस, संरक्षण अधिकारी (Protection Officer) या किसी संस्था में शिकायत दर्ज की है?",
        options: ["No, this is the first step", "Written complaint submitted, no FIR yet", "FIR already registered", "Approached Protection Officer"],
        whyNeeded: "Determines if Section 12 direct Magistrate application or SP escalation is needed.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "Ensure Immediate Safety & Preserve Evidence",
        action: "Move to a safe place. Preserve medical prescriptions, injury photos, threatening WhatsApp messages/call recordings, and keep key personal identification documents (Aadhaar, passport, jewelry bills, bank passbook) accessible.",
        statutoryBacking: "Evidentiary requirements under Indian Evidence Act / BSA 2023",
      },
      {
        stepNumber: 2,
        title: "Contact Protection Officer / One Stop Sakhi Centre",
        action: "Approach the designated District Protection Officer or local One Stop Centre (OSC). They are mandated by law to prepare a Domestic Incident Report (DIR) free of cost.",
        statutoryBacking: "Section 9 & 10, PWDVA 2005",
      },
      {
        stepNumber: 3,
        title: "File Application before Judicial Magistrate (Section 12)",
        action: "Submit an application under Section 12 PWDVA seeking immediate interim protection order (Sec 18), right to reside in shared home (Sec 19), and maintenance/monetary relief (Sec 20). Free legal counsel can be availed via DLSA / NALSA.",
        statutoryBacking: "Section 12 & 23, PWDVA 2005",
      },
      {
        stepNumber: 4,
        title: "Criminal Complaint (Cognizable Offense)",
        action: "If physical harm occurred, lodge an FIR at the nearest Police Station or Women Police Cell under BNS Sections 85/86/115. A 'Zero FIR' must be registered even if outside territorial jurisdiction.",
        statutoryBacking: "Lalita Kumari v. Govt. of UP (2014) & Sec 173 BNSS",
      },
    ],
    officialPortals: [
      {
        name: "National Commission for Women (NCW) Online Portal",
        url: "http://ncwapps.nic.in/onlinecomplaintsv2/",
        description: "File online complaints directly with NCW for monitoring and intervention.",
      },
      {
        name: "NALSA Free Legal Services Portal",
        url: "https://nalsa.gov.in",
        description: "Request a free government-appointed advocate through State/District Legal Services Authority (DLSA).",
      },
    ],
    limitationOrTimelines: "No strict limitation period for ongoing domestic abuse; Magistrate hearing mandated within 3 days of filing under Section 12(4) PWDVA.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.nationalEmergency,
      VERIFIED_HELPLINES.womenHelpline,
      VERIFIED_HELPLINES.ncwHelpline,
      VERIFIED_HELPLINES.womenPolice,
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Sample Section 12 PWDVA Protection Application Intimation",
      templateText: `TO: The Protection Officer / Station House Officer,\n[Police Station / District Name, State]\n\nSUBJECT: Formal Complaint of Domestic Violence and Urgent Request for Domestic Incident Report (DIR) under Section 9/12 of the Protection of Women from Domestic Violence Act, 2005.\n\nRespected Officer,\n\nI, [Your Name], residing at [Address], hereby submit this formal complaint against [Name of Respondent(s), Relationship].\n\n1. I am in a domestic relationship with the Respondent(s) and have been residing at the shared household.\n2. On [Date] and continuing thereafter, the Respondent(s) subjected me to [physical/emotional/economic abuse, describe specific incidents].\n3. I have reason to apprehend imminent danger to my life, bodily integrity, and right to residence.\n\nPRAYER:\nI request you to immediately record my Domestic Incident Report (DIR) under Section 9 of the PWDVA 2005, forward the same to the Hon'ble Judicial Magistrate, and provide immediate protection from dispossession from the shared household under Section 19.\n\nDate: [Date]\nPlace: [City, State]\nApplicant Signature: ______________\nPhone: [Your Phone Number]`,
    },
  },

  TENANT_RIGHTS: {
    id: "TENANT_RIGHTS",
    name: "Tenant Rights, Security Deposit & Eviction Protection",
    hindiName: "किरायेदार अधिकार, सुरक्षा जमा एवं बेदखली सुरक्षा",
    description: "Protection against unlawful eviction, forceful disconnection of electricity/water, security deposit retention, and arbitrary rent hikes.",
    keyStatutes: [
      {
        act: "Model Tenancy Act, 2021 (MTA) & State Rent Control Legislation",
        sections: ["Section 13 MTA", "Section 20 MTA", "Section 21 & 22 MTA", "Section 106 Transfer of Property Act 1882"],
        description: "Section 13 caps residential security deposit at a maximum of 2 months rent. Section 20 strictly prohibits landlords from cutting off essential services (water, power, sanitation). Section 21/22 mandates eviction exclusively through Rent Authority adjudication; self-help lockouts are illegal civil and criminal trespass.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "state_jurisdiction",
        question: "Which State/UT is the rented property located in?",
        hindiQuestion: "किराये की संपत्ति किस राज्य/केंद्र शासित प्रदेश में स्थित है?",
        options: ["Delhi NCR", "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Other State"],
        whyNeeded: "Tenancy laws have state-specific Rent Control Acts and designated Rent Authorities.",
      },
      {
        id: "agreement_status",
        question: "Do you have an active, written rent agreement (registered or notarized)?",
        hindiQuestion: "क्या आपके पास एक वैध, लिखित किराया समझौता (रजिस्टर्ड या नोटरीकृत) है?",
        options: ["Yes, registered agreement", "Yes, notarized 11-month agreement", "Expired agreement / continuing tenancy", "Oral agreement (no written document)"],
        whyNeeded: "Governs notice period enforceability under Section 106 Transfer of Property Act.",
      },
      {
        id: "dispute_type",
        question: "What is the primary nature of the dispute?",
        hindiQuestion: "विवाद का मुख्य कारण क्या है?",
        options: ["Threatened eviction / locks changed", "Refusal to refund security deposit", "Disconnection of water/electricity", "Arbitrary mid-tenure rent increase"],
        whyNeeded: "Pins down the statutory remedy: Rent Controller petition, police complaint for trespass, or civil recovery.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "Demand Written Notice & Gather Proof",
        action: "Landlords cannot orally demand instant vacating. Insist on written notice as specified in agreement (or minimum 15-30 days statutory period). Preserve rent receipts, bank transfer records, and written communications.",
        statutoryBacking: "Section 106, Transfer of Property Act, 1882",
      },
      {
        stepNumber: 2,
        title: "Immediate Action Against Disconnection of Utilities",
        action: "If water or electricity is cut off, lodge an immediate grievance with the local Rent Authority / Rent Controller or file a police complaint under Section 430/441 IPC (or BNS 329/324) for criminal mischief and wrongful confinement.",
        statutoryBacking: "Section 20, Model Tenancy Act, 2021",
      },
      {
        stepNumber: 3,
        title: "Security Deposit Recovery Process",
        action: "Issue a formal Legal Demand Notice giving 15 days to return the security deposit after deducting documented damages. If unresolved, file before the Rent Court or Consumer Forum / Small Causes Court.",
        statutoryBacking: "Section 13, Model Tenancy Act & Indian Contract Act, 1872",
      },
    ],
    officialPortals: [
      {
        name: "e-Courts India Portal",
        url: "https://services.ecourts.gov.in",
        description: "Track status of Rent Control cases and civil court filings.",
      },
      {
        name: "National Legal Services Authority (Free Legal Aid)",
        url: "https://nalsa.gov.in",
        description: "Get legal aid assistance for low-income tenants facing predatory eviction.",
      },
    ],
    limitationOrTimelines: "Notice period: 15–30 days as per contract or Section 106 TP Act; Security deposit refund required within 30 days of handing over vacant possession.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.nationalEmergency,
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Legal Notice for Refund of Security Deposit & Prevention of Unlawful Eviction",
      templateText: `FORMAL LEGAL DEMAND NOTICE\n(Without Prejudice)\n\nTO: [Landlord's Full Name]\n[Landlord's Address]\n\nFROM: [Tenant's Full Name]\n[Rented Premises Address]\n\nSUBJECT: Final Demand Notice for Refund of Security Deposit of Rs. [Amount] and Cease-and-Desist Unlawful Eviction Actions.\n\nSir/Madam,\n\nUnder instructions and on behalf of myself, tenant of premises situated at [Address]:\n\n1. A tenancy agreement was executed between us on [Date], pursuant to which an interest-free security deposit of Rs. [Amount] was deposited via [Cheque/NEFT/UPI Ref: _____].\n2. I have fulfilled all tenant obligations including timely monthly rent payments up to [Month, Year].\n3. You have wrongfully threatened eviction without statutory notice and/or withheld the security deposit without justification.\n\nDEMAND:\nYou are hereby called upon to refund the full security deposit sum of Rs. [Amount] within 15 days of receipt of this notice, failing which I shall initiate proceedings before the Rent Authority / Competent Court for recovery along with 18% p.a. interest, damages, and legal costs entirely at your risk.\n\nDate: [Date]\nTenant Signature: ______________`,
    },
  },

  CONSUMER_PROTECTION: {
    id: "CONSUMER_PROTECTION",
    name: "Consumer Protection & E-Commerce Disputes",
    hindiName: "उपभोक्ता संरक्षण एवं ई-कॉमर्स विवाद",
    description: "Legal recourse against defective products, deficient services, misleading ads, and refusal of warranty or refunds.",
    keyStatutes: [
      {
        act: "Consumer Protection Act, 2019 (CPA 2019)",
        sections: ["Section 2(7)", "Section 2(47)", "Section 35", "Section 38", "Section 72", "Consumer Protection (E-Commerce) Rules, 2020"],
        description: "Section 2(7) defines consumer rights. Section 2(47) defines unfair trade practices. Section 35 provides direct complaint mechanism before the District Consumer Disputes Redressal Commission (DCDRC). Section 72 penalizes non-compliance with up to 3 years imprisonment.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "claim_amount",
        question: "What is the approximate value of the disputed product/service or monetary compensation claimed?",
        hindiQuestion: "विवादित उत्पाद/सेवा का अनुमानित मूल्य या दावे की राशि कितनी है?",
        options: ["Under ₹50,000", "₹50,000 to ₹5 Lakhs", "₹5 Lakhs to ₹50 Lakhs (District Commission)", "Above ₹50 Lakhs (State/National Commission)"],
        whyNeeded: "Sets pecuniary jurisdiction (District Commission handles claims up to ₹50 Lakhs under revised 2021 rules).",
      },
      {
        id: "purchase_proof",
        question: "Do you have the tax invoice, order confirmation, and proof of payment?",
        hindiQuestion: "क्या आपके पास टैक्स इनवॉइस, ऑर्डर कन्फर्मेशन और भुगतान का प्रमाण है?",
        options: ["Yes, full invoice and payment receipt available", "Only digital order ID / email receipt", "Missing invoice, have bank transaction statement", "No receipt"],
        whyNeeded: "Mandatory documentary proof required to establish consumer relationship under Section 2(7).",
      },
      {
        id: "merchant_response",
        question: "Have you already raised a formal ticket with customer care, and did they reject or ignore it?",
        hindiQuestion: "क्या आपने ग्राहक सेवा में औपचारिक टिकट दर्ज किया है, और क्या उन्होंने इसे खारिज या अनदेखा किया?",
        options: ["Ticket raised, refund explicitly denied", "Ticket open for over 15 days with no resolution", "Seller is completely unreachable/blocked", "Not raised yet"],
        whyNeeded: "Establishes 'cause of action' and deficiency of service under Section 2(11) CPA 2019.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "File Grievance on National Consumer Helpline (NCH - 1915)",
        action: "Call toll-free 1915 or register on consumerhelpline.gov.in. NCH serves as an official pre-litigation resolution mechanism with 80%+ corporate convergence rate.",
        statutoryBacking: "Department of Consumer Affairs Grievance Redressal Mechanism",
      },
      {
        stepNumber: 2,
        title: "Send Formal Pre-Litigation Legal Notice",
        action: "Serve a 15-day formal legal notice to the manufacturer/seller via Registered Post / Email demanding replacement, full refund, and compensation for mental agony.",
        statutoryBacking: "Section 35 pre-filing protocol",
      },
      {
        stepNumber: 3,
        title: "File Online Consumer Complaint on e-Daakhil",
        action: "If unresolved, file an e-complaint on edaakhil.nic.in directly before the District Consumer Commission. No advocate is compulsory; consumers can argue their case in person.",
        statutoryBacking: "Section 35, Consumer Protection Act, 2019",
      },
    ],
    officialPortals: [
      {
        name: "National Consumer Helpline (NCH)",
        url: "https://consumerhelpline.gov.in",
        description: "Official Central Government consumer grievance redressal portal.",
      },
      {
        name: "e-Daakhil Portal",
        url: "https://edaakhil.nic.in",
        description: "Online filing of consumer cases before District, State, and National Consumer Commissions.",
      },
    ],
    limitationOrTimelines: "Complaint must be filed within 2 years from the date on which the cause of action arose (Section 69, CPA 2019).",
    emergencyHelplines: [
      VERIFIED_HELPLINES.consumerHelpline,
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Pre-Litigation Consumer Dispute Notice",
      templateText: `PRE-LITIGATION LEGAL NOTICE\n(Under the Consumer Protection Act, 2019)\n\nTO:\nThe Grievance Officer / Managing Director,\n[Company / Seller Name]\n[Company Address / Official Email]\n\nFROM: [Consumer Name]\n[Consumer Address & Contact Details]\n\nSUBJECT: Formal Notice for Deficiency of Service / Defective Product and Demand for Immediate Refund / Replacement.\n\nOrder / Invoice Reference: [Invoice Number]\nDate of Purchase: [Date]\nTotal Amount Paid: Rs. [Amount]\n\nSir/Madam,\n\n1. I purchased [Product/Service description] from your platform/store on [Date] against invoice number [Number].\n2. The product delivered suffered from severe defects / deficiency of service, specifically: [Explain defect].\n3. Despite multiple grievances raised under Ticket #[Ticket Number], your company has failed/refused to rectify the defect or refund the amount.\n\nDEMAND:\nYou are hereby called upon to process a 100% refund of Rs. [Amount] along with Rs. [Compensation Amount] towards compensation for mental agony within 15 days of this notice, failing which a consumer complaint will be instituted before the District Consumer Disputes Redressal Commission via e-Daakhil at your sole risk, cost, and consequence.\n\nYours faithfully,\n[Consumer Name]\n[Date]`,
    },
  },

  CYBER_CRIME: {
    id: "CYBER_CRIME",
    name: "Cyber Crime, Digital Fraud & Online Harassment",
    hindiName: "साइबर अपराध, डिजिटल धोखाधड़ी एवं ऑनलाइन उत्पीड़न",
    description: "Immediate action for financial cyber fraud, UPI/credit card theft, blackmail, identity theft, sextortion, and unauthorized data leakage.",
    keyStatutes: [
      {
        act: "Information Technology Act, 2000 (Amended 2008)",
        sections: ["Section 43", "Section 66C", "Section 66D", "Section 66E", "Section 67 & 67A"],
        description: "Section 66C punishes identity theft. Section 66D punishes cheating by personation via digital devices (UPI fraud, fake calls). Section 66E and 67/67A punish non-consensual sharing of intimate images or harassment.",
      },
      {
        act: "RBI Customer Protection Circular (DBR.No.Leg.BC.78/09.07.005/2017-18)",
        sections: ["Zero Liability Clause (Reporting within 3 days)"],
        description: "Mandates zero customer liability if unauthorized electronic banking transaction is reported to the bank within 3 working days.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "time_elapsed",
        question: "How long ago did the fraudulent transaction or cyber incident occur?",
        hindiQuestion: "धोखाधड़ी वाला लेन-देन या साइबर घटना कितनी देर पहले हुई?",
        options: ["Within the last 2 hours (Golden Hour!)", "Within the last 24 hours", "2 to 3 days ago", "More than 3 days ago"],
        whyNeeded: "Immediate Golden-Hour reporting to 1930 freezes money before fraudsters withdraw it through mule accounts.",
      },
      {
        id: "financial_vs_personal",
        question: "Is this a financial theft (money lost) or personal harassment/blackmail/stalking?",
        hindiQuestion: "क्या यह वित्तीय नुकसान (पैसे की चोरी) है या व्यक्तिगत उत्पीड़न/ब्लैकमेल/स्टॉकिंग?",
        options: ["Financial fraud (UPI, Netbanking, Credit Card)", "Blackmail / Extortion / Morphing threat", "Account hacked / Identity theft", "Phishing / fake investment scheme"],
        whyNeeded: "Determines whether to trigger the financial freeze protocol (1930) or Cyber Crime Women/Children Cell.",
      },
      {
        id: "bank_notified",
        question: "Have you already called your bank to block your debit/credit card or netbanking?",
        hindiQuestion: "क्या आपने अपने बैंक को फोन करके कार्ड या नेटबैंकिंग ब्लॉक करवाई है?",
        options: ["Yes, cards and accounts are blocked", "Not yet, need urgent steps", "Bank ticket opened"],
        whyNeeded: "Immediate card/account freeze prevents ongoing unauthorized debit transactions.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "CRITICAL: Dial 1930 (Golden Hour Protocol)",
        action: "Dial national helpline 1930 immediately. Provide transaction ID, debiting bank, sender/receiver UPI IDs, and date/time. 1930 automatically triggers inter-bank API alerts to freeze the funds across intermediary accounts.",
        statutoryBacking: "Ministry of Home Affairs / I4C Financial Cyber Fraud System",
      },
      {
        stepNumber: 2,
        title: "Block Bank Accounts & Dispute Transaction",
        action: "Call your bank's 24x7 emergency fraud line. Ask for immediate hotlisting of cards/accounts and obtain an acknowledgment / complaint reference number.",
        statutoryBacking: "RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18",
      },
      {
        stepNumber: 3,
        title: "File Formal Cyber Crime Complaint on Portal",
        action: "Log on to cybercrime.gov.in and file a detailed complaint with transaction screenshots, bank statements, SMS alerts, and suspect phone numbers.",
        statutoryBacking: "Section 66D, Information Technology Act, 2000",
      },
    ],
    officialPortals: [
      {
        name: "National Cyber Crime Reporting Portal",
        url: "https://cybercrime.gov.in",
        description: "Official portal by MHA to register financial cyber fraud and cyber crimes against women/children.",
      },
      {
        name: "RBI Banking Ombudsman (CMS Portal)",
        url: "https://cms.rbi.org.in",
        description: "Escalate to RBI Ombudsman if your bank fails to resolve unauthorized transaction liability within 30 days.",
      },
    ],
    limitationOrTimelines: "Zero liability under RBI rules if reported within 3 working days; Golden Hour window is within 2-4 hours for maximum fund recovery.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.cyberCrime,
      VERIFIED_HELPLINES.nationalEmergency,
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Bank Dispute Letter for Unauthorized Electronic Transaction (Zero Liability)",
      templateText: `TO: The Branch Manager / Nodal Fraud Officer,\n[Bank Name, Branch Address]\n\nSUBJECT: Formal Dispute and Claim of Zero Liability for Unauthorized Electronic Transaction under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18.\n\nAccount Holder: [Your Full Name]\nAccount Number: [Account Number]\nRegistered Mobile: [Mobile Number]\n\nSir/Madam,\n\n1. I maintain the above-referenced savings/current account with your branch.\n2. On [Date] at [Time], an unauthorized electronic transaction of Rs. [Amount] was debited from my account without my authorization/consent (Transaction Ref: [Txn ID]).\n3. Neither did I share my OTP/PIN nor was there any negligence on my part.\n4. I immediately notified your helpline on [Date/Time] under Complaint #[Ticket Number] and lodged a report on cybercrime.gov.in (Ack #[Ack Number]).\n\nPRAYER:\nIn terms of RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, since this incident has been notified within 3 working days, I am entitled to ZERO LIABILITY. Kindly credit the disputed sum of Rs. [Amount] shadow-reversal into my account within 10 working days.\n\nYours faithfully,\n[Your Name]\nDate: [Date]`,
    },
  },

  LABOUR_EMPLOYMENT: {
    id: "LABOUR_EMPLOYMENT",
    name: "Labour Rights, Unpaid Wages & Illegal Termination",
    hindiName: "श्रम अधिकार, बकाया वेतन एवं अवैध बर्खास्तगी",
    description: "Recourse for wrongful termination, salary non-payment, gratuity denial, maternity rights, and workplace harassment (POSH).",
    keyStatutes: [
      {
        act: "Industrial Disputes Act, 1947 / Industrial Relations Code",
        sections: ["Section 25F", "Section 33C(2)"],
        description: "Section 25F establishes statutory retrenchment conditions: 1 month written notice or salary in lieu + 15 days severance pay per year of service. Section 33C(2) provides recovery of money due from employer.",
      },
      {
        act: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)",
        sections: ["Section 4", "Section 9", "Section 11"],
        description: "Mandatory Internal Committee (IC) in establishments with 10+ employees. Section 9 permits filing complaints within 3 months.",
      },
      {
        act: "Payment of Gratuity Act, 1972 & Maternity Benefit Act, 1961",
        sections: ["Section 4 Gratuity Act", "Section 5 & 12 Maternity Benefit Act"],
        description: "Gratuity mandatory upon completing 5 years continuous service. 26 weeks paid maternity leave; terminating a pregnant employee is strictly illegal.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "employment_contract",
        question: "Do you have an appointment letter / employment contract, and what was your role?",
        hindiQuestion: "क्या आपके पास नियुक्ति पत्र / अनुबंध है, और आपका पद क्या था?",
        options: ["Formal contract / IT / Corporate role", "Factory / Industrial / Workman role", "Gig worker / Freelancer / Contractual", "No written letter"],
        whyNeeded: "Determines applicability between Industrial Disputes Act (workman) and State Shops & Establishments Act / Civil recovery.",
      },
      {
        id: "unpaid_duration",
        question: "How many months of salary, severance, or benefits are unpaid?",
        hindiQuestion: "कितने महीने का वेतन, नोटिस पे या ग्रेच्युटी बकाया है?",
        options: ["1 to 2 months unpaid salary", "3+ months salary & full and final pending", "Wrongfully terminated without notice pay", "Gratuity denied after 5+ years"],
        whyNeeded: "Specifies exact monetary claim for Labour Commissioner demand notice.",
      },
      {
        id: "company_status",
        question: "Is the company still active, or has it shut down / laid off the team?",
        hindiQuestion: "क्या कंपनी अभी भी चालू है या बंद हो गई है / टीम को हटा दिया है?",
        options: ["Company active, management ignoring emails", "Company shutting down / insolvent", "Threatened with absconding letter"],
        whyNeeded: "Guides whether Labour Commissioner conciliation or NCLT/civil claim is required.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "Send Formal Demand Notice for Full & Final Settlement",
        action: "Send a registered email/letter demanding payment of unpaid wages, notice pay, and accumulated leave encashment within 15 days.",
        statutoryBacking: "Section 15, Payment of Wages Act, 1936",
      },
      {
        stepNumber: 2,
        title: "File Grievance before Labour Commissioner / SAMADHAAN",
        action: "Lodge a dispute before the Deputy Labour Commissioner or online on the Ministry of Labour SAMADHAAN portal for conciliation proceedings.",
        statutoryBacking: "Section 12, Industrial Disputes Act, 1947",
      },
      {
        stepNumber: 3,
        title: "Workplace Harassment / POSH Redressal",
        action: "If facing sexual harassment, submit a written complaint to the company's Internal Committee (IC) within 3 months. If no IC exists, approach the District Local Committee (LC).",
        statutoryBacking: "Section 9, POSH Act, 2013",
      },
    ],
    officialPortals: [
      {
        name: "SAMADHAAN Portal (Ministry of Labour & Employment)",
        url: "https://samadhaan.labour.gov.in",
        description: "Government conciliation portal for industrial and wage disputes.",
      },
      {
        name: "e-Shram Portal",
        url: "https://eshram.gov.in",
        description: "National database and social security access for unorganized workers.",
      },
    ],
    limitationOrTimelines: "POSH complaint must be submitted within 3 months; wage claims before Labour Authority within 1 year from the date of default.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.legalAid,
      VERIFIED_HELPLINES.womenHelpline,
    ],
    draftTemplate: {
      title: "Legal Demand Notice for Unpaid Wages and Full & Final Settlement",
      templateText: `TO: The Managing Director / HR Head,\n[Company Name]\n[Company Registered Address]\n\nSUBJECT: Formal Demand Notice for Release of Unpaid Salary and Full & Final (F&F) Settlement Dues.\n\nEmployee Name: [Your Name]\nEmployee ID: [Emp ID]\nDesignation: [Designation]\nLast Working Day: [Date]\n\nSir/Madam,\n\n1. I was employed with your organization from [Start Date] until [Last Date].\n2. Following my resignation/release, my lawful dues including salary for the period [Month] amounting to Rs. [Amount], along with Notice Pay and Encashment have not been disbursed.\n3. The statutory period for Full & Final settlement under labour regulations has expired.\n\nDEMAND:\nYou are hereby requested to release the total outstanding amount of Rs. [Amount] directly to my bank account within 15 days of this notice, failing which I will be constrained to initiate conciliation proceedings before the Labour Commissioner under the Industrial Disputes Act / Payment of Wages Act at your cost and consequence.\n\nYours faithfully,\n[Your Name]`,
    },
  },

  RTI: {
    id: "RTI",
    name: "Right to Information (RTI) Procedures",
    hindiName: "सूचना का अधिकार (RTI)",
    description: "Filing RTI applications, tracking government responses, first appeals, and handling denials by Public Information Officers (PIOs).",
    keyStatutes: [
      {
        act: "Right to Information Act, 2005",
        sections: ["Section 6", "Section 7(1)", "Section 19(1)", "Section 19(3)", "Section 20"],
        description: "Section 6 governs applications. Section 7(1) mandates 30-day response timeline (and 48-hour timeline if life or liberty is involved). Section 19 provides for First and Second Appeals. Section 20 imposes ₹250/day penalty on defaulting PIO.",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "public_authority_type",
        question: "Is the government department Central (e.g. Railways, Passport, Income Tax) or State-level (e.g. Police, Municipal, Land Records)?",
        hindiQuestion: "क्या सरकारी विभाग केंद्र सरकार का है या राज्य सरकार का?",
        options: ["Central Government Public Authority", "State Government Department / Municipal Corporation", "Public Sector Bank / PSU", "Unsure which department holds the record"],
        whyNeeded: "Central departments use rtionline.gov.in; state departments use state-specific RTI portals or physical postal orders.",
      },
      {
        id: "life_and_liberty",
        question: "Does this information concern an immediate threat to the life or personal liberty of any person?",
        hindiQuestion: "क्या यह जानकारी किसी व्यक्ति के जीवन या व्यक्तिगत स्वतंत्रता से जुड़ी है?",
        options: ["No, standard public record / governance query", "Yes, life/liberty at stake (Urgent 48-Hour mandate!)"],
        whyNeeded: "Section 7(1) proviso legally obligates PIO to respond within 48 hours instead of 30 days if life/liberty is at stake.",
      },
      {
        id: "rti_stage",
        question: "What stage is your query in?",
        hindiQuestion: "आपकी सूचना मांगने की प्रक्रिया किस चरण में है?",
        options: ["Drafting initial RTI application (Section 6)", "30 days expired, no reply received (First Appeal)", "Reply received but information withheld/incomplete", "First Appeal dismissed (Second Appeal to CIC/SIC)"],
        whyNeeded: "Determines whether to draft a Section 6 application, Section 19(1) First Appeal, or Section 19(3) Commission petition.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "Draft Specific, Precise Questions (Section 6)",
        action: "Formulate specific point-wise requests for records, certified copies, or memos. Avoid asking speculative questions ('Why did you not do this?'); ask for existing records ('Provide certified copy of file noting...').",
        statutoryBacking: "Section 6(1), RTI Act 2005",
      },
      {
        stepNumber: 2,
        title: "Submit Online or via Indian Postal Order (IPO)",
        action: "For Central bodies, apply via rtionline.gov.in with ₹10 fee (exempt for BPL). For State bodies, submit physically or on state portal with ₹10 IPO payable to Accounts Officer.",
        statutoryBacking: "RTI Rules, 2012",
      },
      {
        stepNumber: 3,
        title: "File First Appeal within 30 Days (Section 19)",
        action: "If no reply within 30 days or if information is improperly denied, file a First Appeal to the First Appellate Authority (FAA) of the department.",
        statutoryBacking: "Section 19(1), RTI Act 2005",
      },
    ],
    officialPortals: [
      {
        name: "Central RTI Online Portal",
        url: "https://rtionline.gov.in",
        description: "Official portal for submitting RTI applications and First Appeals to Central Government ministries.",
      },
      {
        name: "Central Information Commission (CIC)",
        url: "https://cic.gov.in",
        description: "Apex second-appeal body for Central RTI disputes.",
      },
    ],
    limitationOrTimelines: "30 days standard disposal; 48 hours for life and liberty; First appeal within 30 days of deadline expiry.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Sample Point-Wise RTI Application under Section 6(1)",
      templateText: `APPLICATION UNDER SECTION 6(1) OF THE RTI ACT, 2005\n\nTO:\nThe Central / State Public Information Officer (CPIO/SPIO),\n[Department Name]\n[Office Address]\n\n1. Full Name of Applicant: [Your Name]\n2. Address for Correspondence: [Address]\n3. Particulars of Information Sought:\n   (a) Certified copies of all documents/notes relating to [Topic/File Ref].\n   (b) Exact current status and timeline of [Application/Scheme].\n   (c) Names and designations of officials responsible for processing said application.\n4. Application Fee: Rs. 10 paid via [Online Payment Ref / IPO No: _____].\n5. The information does not fall under exemptions specified in Section 8 or 9.\n\nDate: [Date]\nPlace: [City]\nApplicant Signature: ______________`,
    },
  },

  POLICE_FIR: {
    id: "POLICE_FIR",
    name: "Police Procedures, FIR & Bail",
    hindiName: "पुलिस प्रक्रिया, प्राथमिकी (FIR) एवं जमानत",
    description: "Guidance on registering an FIR, Zero FIR mandate, remedies if police refuse an FIR, arrest protections, and bail procedures.",
    keyStatutes: [
      {
        act: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) / CrPC",
        sections: ["Section 173 BNSS (formerly 154 CrPC)", "Section 175(3) BNSS (formerly 156(3) CrPC)", "Section 35(3) BNSS (formerly 41A CrPC)"],
        description: "Section 173 BNSS mandates FIR registration in cognizable offenses. Supreme Court in Lalita Kumari held FIR mandatory upon disclosure of cognizable offense. Section 35(3) BNSS mandates notice before arrest for offenses punishable under 7 years (Arnesh Kumar guidelines).",
      },
    ],
    criticalClarifyingQuestions: [
      {
        id: "fir_status",
        question: "Has an FIR or Daily Diary (GD/NCR) entry been registered by the police yet?",
        hindiQuestion: "क्या पुलिस द्वारा प्राथमिकी (FIR) या डीडी/एनसीआर दर्ज कर ली गई है?",
        options: ["Police refused to register FIR", "Given written complaint, awaiting FIR copy", "FIR registered, seeking legal defense/bail", "Threatened with false FIR"],
        whyNeeded: "Determines whether to trigger Section 173(4) SP escalation or bail/quashing guidance.",
      },
      {
        id: "arrest_apprehension",
        question: "Is there an imminent risk of arrest or detention?",
        hindiQuestion: "क्या गिरफ्तारी या हिरासत का तुरंत खतरा है?",
        options: ["Yes, police visited or issued arrest threat", "Received Section 35(3) BNSS / 41A CrPC notice to appear", "No arrest threat, seeking investigation progress"],
        whyNeeded: "Triggers urgent anticipatory bail (Section 482 BNSS / 438 CrPC) advice.",
      },
      {
        id: "offense_type",
        question: "What is the general nature of the alleged offense?",
        hindiQuestion: "कथित अपराध किस प्रकार का है?",
        options: ["Theft / Cheating / Property dispute", "Assault / Physical altercation", "Cyber offense / Social media dispute", "Domestic / Matrimonial dispute"],
        whyNeeded: "Clarifies cognizable vs non-cognizable categorization.",
      },
    ],
    standardProcedures: [
      {
        stepNumber: 1,
        title: "Demand Free Copy of FIR / Zero FIR",
        action: "Whenever an FIR is lodged, Section 173(2) BNSS / 154(2) CrPC strictly mandates that a certified copy be provided to the complainant FREE OF COST immediately.",
        statutoryBacking: "Section 173(2) BNSS / Section 154(2) CrPC",
      },
      {
        stepNumber: 2,
        title: "Remedy if Police Refuse FIR (Escalation to SP)",
        action: "Send the substance of information in writing by registered post to the Superintendent of Police (SP / DCP) under Section 173(4) BNSS / Section 154(3) CrPC.",
        statutoryBacking: "Section 173(4) BNSS / Section 154(3) CrPC",
      },
      {
        stepNumber: 3,
        title: "Section 175(3) BNSS / 156(3) CrPC Application to Magistrate",
        action: "If the SP fails to order investigation, file an application before the Judicial Magistrate having jurisdiction, praying for directions to police to register an FIR and investigate.",
        statutoryBacking: "Section 175(3) BNSS / Section 156(3) CrPC",
      },
    ],
    officialPortals: [
      {
        name: "National Legal Services Authority (NALSA)",
        url: "https://nalsa.gov.in",
        description: "Free legal representation for arrested persons, undertrials, and victims.",
      },
      {
        name: "e-Courts Case Status Portal",
        url: "https://services.ecourts.gov.in",
        description: "Check bail applications and FIR remands across Indian trial courts.",
      },
    ],
    limitationOrTimelines: "FIR should be filed promptly; Zero FIR must be accepted without territorial restriction.",
    emergencyHelplines: [
      VERIFIED_HELPLINES.nationalEmergency,
      VERIFIED_HELPLINES.legalAid,
    ],
    draftTemplate: {
      title: "Written Complaint to Superintendent of Police for Refusal to Register FIR",
      templateText: `TO:\nThe Superintendent of Police / Deputy Commissioner of Police,\n[District Name, State]\n\nSUBJECT: Representation under Section 173(4) BNSS, 2023 (formerly Section 154(3) CrPC) regarding refusal by Station House Officer [Police Station Name] to register FIR in a cognizable offense.\n\nRespected Sir/Madam,\n\n1. I, [Your Name], residing at [Address], approached Police Station [Name] on [Date] with a written complaint regarding [Briefly describe cognizable offense].\n2. The Station House Officer refused to register an FIR in gross contravention of the binding directions of the Hon'ble Supreme Court of India in Lalita Kumari v. Govt. of UP (2014) 2 SCC 1.\n3. The offenses disclosed are cognizable and warrant immediate investigation.\n\nPRAYER:\nI request you to investigate this matter or direct registration of an FIR and investigation by a competent officer under Section 173(4) BNSS, 2023.\n\nDate: [Date]\nComplainant: [Your Name]\nPhone: [Contact Details]`,
    },
  },
};
