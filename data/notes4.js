/* SecPlus Quest — Drive Mode audio lessons, Domain 5 plus an exam-day track. Original study notes. */
window.LESSONS = window.LESSONS || [];
window.LESSON = window.LESSON || function (o, t, parts) { window.LESSONS.push({ o: o, t: t, parts: parts }); };

LESSON("5.1", "Security Governance", [
  "Objective five point one: elements of effective security governance. Governance is how leadership directs and controls security. Policies are high-level statements of intent. Key ones: the acceptable use policy, AUP, which says what users can and can't do with company systems. Information security policies. Business continuity, disaster recovery, and incident response policies. The software development lifecycle policy. And change management policy.",
  "Standards are specific mandatory requirements that support policies, like password standards, access control standards, physical security standards, and encryption standards. Procedures are step-by-step instructions, like change management steps, onboarding and offboarding, and playbooks. Guidelines are recommendations, not mandatory.",
  "Exam tip: policy is the why and the what, high level. Standard is the specific requirement. Procedure is the step by step how. Guideline is a suggestion.",
  "External considerations: regulatory, legal, industry, and local, regional, national, and global requirements. Monitoring and revision keep governance current. Governance structures include boards, committees, government entities, and centralized or decentralized models.",
  "Roles and responsibilities for systems and data. The owner is accountable for the data, usually a senior business leader, and decides classification. The controller decides why and how personal data is processed. The processor handles data on the controller's behalf. The custodian, or steward, handles the day to day care of the data, like backups and access, and is often in IT. Exam tip: owner decides, custodian carries it out. Controller decides the purpose, processor does the processing.",
]);

LESSON("5.2", "Risk Management", [
  "Objective five point two: elements of the risk management process. Risk identification finds the risks. Risk assessments can be ad hoc, recurring, one-time, or continuous. Risk analysis can be qualitative, which uses ratings like high, medium, and low, or quantitative, which uses numbers and dollar amounts.",
  "Quantitative formulas, which you need to know. Single loss expectancy, SLE, is the cost of one event. It equals asset value times exposure factor. Exposure factor is the percentage of the asset lost. Annualized rate of occurrence, ARO, is how many times per year you expect the event. Annualized loss expectancy, ALE, equals SLE times ARO.",
  "Let's do one example. A server is worth ten thousand dollars. A flood would destroy half of it, so the exposure factor is fifty percent. SLE is ten thousand times point five, which is five thousand dollars. If a flood is expected once every five years, the ARO is point two. ALE is five thousand times point two, which is one thousand dollars per year. If a control costs more than a thousand dollars a year, it may not be worth it.",
  "Probability and likelihood describe how likely a risk is. Impact describes how bad it would be. A risk register lists the risks, their owners, key risk indicators, and thresholds. Risk tolerance is how much variation from the goal the organization accepts. Risk appetite describes how much risk it's willing to take on: expansionary, conservative, or neutral.",
  "Risk management strategies. Transfer the risk to someone else, like buying cybersecurity insurance. Accept the risk, either normally or with an exemption or exception. Avoid the risk by stopping the risky activity. Mitigate the risk by adding controls to reduce it. Exam tip: insurance means transfer. Stopping the activity means avoid. Adding a control means mitigate. Doing nothing on purpose means accept.",
  "Business impact analysis, BIA. Recovery time objective, RTO, is how fast you need to be back up. Recovery point objective, RPO, is how much data loss is acceptable, measured in time, so it tells you how often to back up. Mean time to repair, MTTR, is the average time to fix something. Mean time between failures, MTBF, is the average time a system runs before it fails. Higher MTBF is better. Lower MTTR is better.",
  "Memory trick: RTO is time to recover. RPO is the point you can roll back to, which drives backup frequency.",
]);

LESSON("5.3", "Third-party Risk", [
  "Objective five point three: third-party risk assessment and management. Vendor assessment can include penetration testing, the right to audit clause, which lets you audit the vendor, evidence of internal audits, independent assessments, and supply chain analysis. Vendor selection involves due diligence, which is researching the vendor before you sign, and checking for conflicts of interest.",
  "Agreement types. An SLA, service level agreement, defines the level of service, like uptime and response times. An MOA, memorandum of agreement, is a formal agreement with specific responsibilities. An MOU, memorandum of understanding, is a less formal statement of intent. An MSA, master service agreement, sets the general terms for future work. A work order or statement of work, SOW, defines a specific project. An NDA, non-disclosure agreement, protects confidential information. A BPA, business partners agreement, defines a partnership, including how profits and decisions are shared.",
  "Exam tip: uptime guarantees, SLA. Keep it secret, NDA. A specific project's deliverables, SOW. The umbrella contract for future work, MSA.",
  "Vendor monitoring continues after the contract is signed. Questionnaires collect security info. Rules of engagement define what's allowed during testing.",
]);

LESSON("5.4", "Security Compliance", [
  "Objective five point four: elements of effective security compliance. Compliance reporting can be internal or external. Consequences of non-compliance include fines, sanctions, reputational damage, loss of license, and contractual impacts. Compliance monitoring includes due diligence and due care, attestation and acknowledgement, internal and external reviews, and automation.",
  "Due diligence is investigating and understanding the risks. Due care is acting on that and doing what a reasonable organization would do. A way to remember: diligence is doing your homework, care is taking action.",
  "Privacy. Legal implications can be local, regional, national, and global. GDPR, the European Union's general data protection regulation, is the big one. It gives people rights over their personal data, including the right to be forgotten, which means having their data deleted.",
  "Data subject means the person the data is about. The controller decides how data is used, and the processor processes it on the controller's behalf. Ownership, data inventory, and retention are part of privacy compliance too.",
]);

LESSON("5.5", "Audits and Assessments", [
  "Objective five point five: types and purposes of audits and assessments. Attestation is a formal statement that something is true, often from an auditor. Internal audits are done by the organization's own team, often reporting to an audit committee. They include compliance checks and self-assessments. External audits are done by outside, independent parties, like regulators or independent third-party auditors.",
  "Penetration testing. Physical pen tests try to get into buildings. Offensive testing is red team: attacking. Defensive is blue team: defending. Integrated means both sides working together, sometimes called purple team.",
  "Know your environment levels. Known environment means testers get full information, formerly called white box. Partially known environment means some information, formerly gray box. Unknown environment means no information, formerly black box, which is the most realistic simulation of an outside attacker.",
  "Reconnaissance. Passive reconnaissance gathers info without touching the target, like searching public records and social media. Active reconnaissance interacts with the target directly, like port scanning. Exam tip: if it touches the target's systems, it's active.",
]);

LESSON("5.6", "Security Awareness", [
  "Objective five point six: implementing security awareness practices. Phishing campaigns test users with fake phishing emails, then train the people who click. Teach people to recognize phishing attempts and how to respond and report them.",
  "Anomalous behavior recognition. Risky behavior, unexpected behavior, and unintentional behavior. Users should report anything unusual. User guidance and training covers policies and handbooks, situational awareness, insider threats, password management, removable media and cables, social engineering, operational security, and hybrid and remote work environments.",
  "Reporting and monitoring. Track results, both initial and recurring. Development and execution of the training program. The goal is a security-aware culture where people know what to watch for and feel comfortable reporting.",
  "Exam tip: the best way to measure whether phishing training is working is a simulated phishing campaign, then compare click rates over time.",
]);

LESSON("X.1", "Exam Day Strategy", [
  "Exam day strategy for Security+ S Y zero seven oh one. You get up to ninety questions in ninety minutes. Passing is seven fifty on a scale of one hundred to nine hundred.",
  "Performance-based questions usually come first. Many people flag them, answer the multiple choice first to bank time, then come back. Don't let one tough simulation eat twenty minutes.",
  "Read every question for the key words: BEST, FIRST, MOST likely, and LEAST. Several answers may be technically true. The question wants the best one for that exact scenario. Eliminate the clearly wrong answers first.",
  "Watch for scenario clues. Many accounts with a few common passwords, that's password spraying. Isolate before you clean. Insurance means transfer. Labels and clearances mean mandatory access control. The step after fixing is validating.",
  "Breathe, pace yourself at about one minute per question, and trust your preparation. You've got this.",
]);
