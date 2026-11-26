/* SecPlus Quest — exam blueprint, ranks, and question-bank loader.
 * Objectives follow the official CompTIA Security+ SY0-701 exam objectives. */

window.EXAM = {
  name: "CompTIA Security+ SY0-701",
  questions: 90,
  minutes: 90,
  passScaled: 750, // on a 100–900 scale
};

window.DOMAINS = [
  { id: 1, key: "d1", name: "General Security Concepts", weight: 0.12, icon: "🛡️", color: "#2dd4bf" },
  { id: 2, key: "d2", name: "Threats, Vulnerabilities & Mitigations", weight: 0.22, icon: "🐛", color: "#f87171" },
  { id: 3, key: "d3", name: "Security Architecture", weight: 0.18, icon: "🏗️", color: "#60a5fa" },
  { id: 4, key: "d4", name: "Security Operations", weight: 0.28, icon: "🛰️", color: "#fbbf24" },
  { id: 5, key: "d5", name: "Security Program Management & Oversight", weight: 0.20, icon: "📜", color: "#c084fc" },
  { id: 0, key: "net", name: "Network Foundations (warm-up)", weight: 0, icon: "🌐", color: "#94a3b8", bonus: true },
];

window.OBJECTIVES = {
  "1.1": "Compare and contrast various types of security controls",
  "1.2": "Summarize fundamental security concepts",
  "1.3": "Explain the importance of change management processes",
  "1.4": "Explain the importance of using appropriate cryptographic solutions",
  "2.1": "Compare and contrast common threat actors and motivations",
  "2.2": "Explain common threat vectors and attack surfaces",
  "2.3": "Explain various types of vulnerabilities",
  "2.4": "Given a scenario, analyze indicators of malicious activity",
  "2.5": "Explain the purpose of mitigation techniques used to secure the enterprise",
  "3.1": "Compare and contrast security implications of different architecture models",
  "3.2": "Given a scenario, apply security principles to secure enterprise infrastructure",
  "3.3": "Compare and contrast concepts and strategies to protect data",
  "3.4": "Explain the importance of resilience and recovery in security architecture",
  "4.1": "Given a scenario, apply common security techniques to computing resources",
  "4.2": "Explain the security implications of hardware, software, and data asset management",
  "4.3": "Explain various activities associated with vulnerability management",
  "4.4": "Explain security alerting and monitoring concepts and tools",
  "4.5": "Given a scenario, modify enterprise capabilities to enhance security",
  "4.6": "Given a scenario, implement and maintain identity and access management",
  "4.7": "Explain the importance of automation and orchestration in secure operations",
  "4.8": "Explain appropriate incident response activities",
  "4.9": "Given a scenario, use data sources to support an investigation",
  "5.1": "Summarize elements of effective security governance",
  "5.2": "Explain elements of the risk management process",
  "5.3": "Explain the processes associated with third-party risk assessment and management",
  "5.4": "Summarize elements of effective security compliance",
  "5.5": "Explain types and purposes of audits and assessments",
  "5.6": "Given a scenario, implement security awareness practices",
  "N.1": "Ports and protocols",
  "N.2": "OSI model, switching, and routing",
  "N.3": "IP addressing and subnetting",
  "N.4": "Wireless and cellular",
  "N.5": "Network services (DNS, DHCP, NTP)",
  "N.6": "Infrastructure, devices, and cloud",
  "N.7": "Troubleshooting and tools",
};

window.RANKS = [
  { xp: 0, title: "Recruit", badge: "🔰" },
  { xp: 150, title: "Help Desk Hero", badge: "🎧" },
  { xp: 400, title: "SOC Analyst I", badge: "🖥️" },
  { xp: 800, title: "Threat Hunter", badge: "🔎" },
  { xp: 1400, title: "Incident Responder", badge: "🚒" },
  { xp: 2200, title: "Security Engineer", badge: "🛠️" },
  { xp: 3300, title: "GRC Guardian", badge: "⚖️" },
  { xp: 4800, title: "Security Architect", badge: "🏛️" },
  { xp: 7000, title: "CISO", badge: "👑" },
];

/* Question bank.
 * Each data file calls QB(objective, topic, rows) where each row is
 *   [question, [choiceA, choiceB, choiceC, choiceD], correctIndex, explanation]
 * Choices are shuffled at runtime, so the authored position of the answer never matters. */
window.QBANK = [];
(function () {
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  window.QB = function (objective, topic, rows) {
    const domain = objective.startsWith("N") ? 0 : Number(objective[0]);
    rows.forEach(function (r) {
      window.QBANK.push({
        id: objective + "-" + hash(r[0]),
        d: domain,
        o: objective,
        t: topic,
        q: r[0],
        a: r[1],
        c: r[2],
        e: r[3],
      });
    });
  };
  window.hashText = hash;
})();
