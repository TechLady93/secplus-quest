/* Exam-style scenario questions: longer stems and BEST/FIRST/MOST wording, like CompTIA's style. Original. */
(function () {
  const T = "Exam-style scenario";
  const S = (o, rows) => QB(o, T, rows);

  S("1.1", [
    ["A company cannot patch a legacy manufacturing controller for six months because the vendor no longer exists. The security team places the controller on an isolated VLAN and allows only the HMI workstation to reach it. Which of the following BEST describes this control?",
      ["Compensating", "Corrective", "Deterrent", "Directive"], 0,
      "Isolation is used because the preferred control, patching, isn't available. That's the definition of a compensating control."],
  ]);
  S("1.2", [
    ["A security architect is designing access to an internal application. Every request must be evaluated using the user's identity, device health, and location, even when the user is on the corporate LAN. Which of the following concepts is the architect applying?",
      ["Zero trust", "Defense in depth", "Implicit trust zones", "Perimeter security"], 0,
      "Zero trust removes implicit trust based on network location and continuously verifies each request using adaptive signals."],
    ["After a breach, an investigator must prove that a specific employee sent a contract by email and that it was not altered afterward. Which of the following provides this assurance?",
      ["A digital signature on the message", "Encrypting the message with TLS", "Hashing the message with SHA-256", "Storing the message in a WORM archive"], 0,
      "A signature made with the sender's private key provides integrity and non-repudiation. A hash alone proves integrity but doesn't tie the message to a person."],
  ]);
  S("1.3", [
    ["A network engineer is approved to upgrade firewall firmware during Saturday's maintenance window. During the change, the engineer notices an unrelated routing issue and fixes it at the same time. Which of the following change management principles did the engineer MOST likely violate?",
      ["Approved scope", "Backout plan", "Maintenance window", "Impact analysis"], 0,
      "Approval covers only the documented scope. Unrelated fixes need their own change request, even if they seem helpful."],
  ]);
  S("1.4", [
    ["A company wants to store customer credit card numbers so that its billing system can charge returning customers, but it wants to reduce PCI DSS scope as much as possible. Which of the following is the BEST solution?",
      ["Tokenization", "Hashing with a salt", "Data masking", "Full-disk encryption"], 0,
      "Tokens replace card numbers in internal systems, so most of the environment never stores real card data. Hashing can't be reversed for charging, and masking only hides the data on screen."],
    ["A web server's private key may have been exposed in a breach. Which of the following should the administrator do FIRST?",
      ["Revoke the certificate and reissue with a new key pair", "Renew the current certificate using the same key pair", "Enable OCSP stapling and shorten the certificate lifetime", "Replace it with a wildcard certificate from the same CA"], 0,
      "A compromised key means the certificate can't be trusted. Revoke it so clients reject it, then issue a new certificate with a fresh key pair."],
  ]);
  S("2.1", [
    ["An organization discovers a highly sophisticated intrusion that went undetected for 14 months, used custom malware, and targeted research data on a defense program. Which of the following threat actors is MOST likely responsible?",
      ["Nation-state", "Hacktivist", "Organized crime", "Unskilled attacker"], 0,
      "A long dwell time, custom tools, and an espionage target point to an advanced persistent threat backed by a nation-state."],
  ]);
  S("2.2", [
    ["The accounts payable team receives an email that appears to come from a long-time supplier, asking them to update the bank account for future payments. The email domain is spelled correctly, and the tone matches previous emails. Which of the following should the team do FIRST?",
      ["Call the supplier using a phone number already on file", "Reply to the email and request written confirmation", "Check the email headers for SPF and DKIM pass results", "Forward the request to the CFO for payment approval"], 0,
      "This is classic business email compromise. The sender's mailbox may itself be compromised, so verify out-of-band using contact details you already have."],
    ["Several employees at a small engineering firm were infected after visiting a regional industry association's website that they use daily. No phishing emails were found. Which of the following attacks MOST likely occurred?",
      ["Watering hole", "Typosquatting", "Drive-by pharming", "Spear phishing"], 0,
      "Attackers compromised a site the targets already trusted and visited, which is a watering hole."],
  ]);
  S("2.3", [
    ["A developer's code stores a user's balance, checks it, and then deducts a withdrawal in two separate database operations. An attacker sends many simultaneous withdrawal requests and overdraws the account. Which of the following vulnerabilities was exploited?",
      ["Race condition", "Integer overflow", "SQL injection", "Insecure direct object reference"], 0,
      "The gap between checking and using the balance (TOCTOU) let parallel requests pass the same check."],
    ["A security analyst finds that a cloud storage bucket containing HR documents allows public read access. No exploit was required to access the files. Which of the following BEST describes this vulnerability?",
      ["Misconfiguration", "Zero-day", "Resource reuse", "Supply chain compromise"], 0,
      "Public permissions on cloud storage are a configuration mistake, one of the most common causes of cloud data exposure."],
  ]);
  S("2.4", [
    ["A user reports that their workstation is slow. The analyst sees an unknown process using high CPU and making regular connections to a mining pool on port 3333. Which of the following is the MOST likely cause?",
      ["Cryptomining malware", "Ransomware staging", "A remote access Trojan", "A fileless keylogger"], 0,
      "High CPU combined with connections to a mining pool indicates cryptojacking malware using the system's resources."],
    ["An IDS alerts on many outbound DNS queries from one host to random-looking subdomains of a single unfamiliar domain, each carrying long encoded strings. Which of the following is MOST likely happening?",
      ["Data exfiltration using DNS tunneling", "A DNS amplification attack in progress", "DNS cache poisoning of the local resolver", "Domain generation algorithm (DGA) beaconing"], 0,
      "Encoding data into subdomain labels and sending it out through DNS queries is DNS tunneling, a covert exfiltration channel."],
  ]);
  S("2.5", [
    ["A company wants to ensure that only approved applications can run on point-of-sale terminals, including blocking new malware that has no known signature. Which of the following is the BEST control?",
      ["Application allow list", "Signature-based antivirus", "Host-based firewall", "Full-disk encryption"], 0,
      "An allow list blocks everything not explicitly approved, including unknown malware. Signature-based antivirus misses new threats."],
  ]);
  S("3.1", [
    ["A startup is moving its application to IaaS. The CTO assumes the cloud provider will patch the virtual machines' operating systems. Which of the following BEST explains why this assumption is incorrect?",
      ["In IaaS, the customer is responsible for patching the guest OS", "In IaaS, the provider patches only the guest OS kernel", "IaaS providers patch VMs only when using a managed image", "Patching responsibility in IaaS is set by the SLA uptime tier"], 0,
      "In IaaS the provider secures the physical hosts and hypervisor, and the customer is responsible for the OS, applications, and data."],
    ["A hospital uses medical devices that run a real-time operating system and can't install endpoint agents. Which of the following is the BEST way to reduce risk to these devices?",
      ["Segment them on an isolated network with strict access controls", "Deploy an EDR agent through the vendor's update portal", "Enable automatic firmware updates from the internet", "Require MFA on each device's local console"], 0,
      "When devices can't be patched or run agents, network segmentation is the primary compensating control."],
  ]);
  S("3.2", [
    ["A company needs to give remote employees secure access to internal applications from managed laptops, while also inspecting their internet traffic regardless of location. Which of the following solutions BEST meets these requirements?",
      ["SASE", "Site-to-site IPsec VPN", "A jump server", "Port security"], 0,
      "SASE delivers ZTNA, a secure web gateway, CASB, and firewall services from the cloud, close to users wherever they are."],
    ["During an outage, the company's inline IPS failed and all network traffic stopped until it was replaced. Management wants business traffic to continue if the IPS fails again, accepting the risk. Which configuration should be used?",
      ["Fail-open", "Fail-closed", "Active/passive clustering", "Port mirroring"], 0,
      "Fail-open lets traffic pass when the device fails, prioritizing availability over security."],
  ]);
  S("3.3", [
    ["A multinational company must ensure that data about EU customers is stored and processed only in EU data centers. Which of the following concepts drives this requirement?",
      ["Data sovereignty", "Data masking", "Data retention", "Data classification"], 0,
      "Data sovereignty means data is subject to the laws of the country or region where it resides, such as GDPR in the EU."],
  ]);
  S("3.4", [
    ["A company performs a full backup every Sunday and differential backups Monday through Saturday. The server fails on Thursday afternoon. Which backups are required to restore it?",
      ["Sunday's full and Wednesday's differential", "Sunday's full and all three differentials", "Wednesday's differential and Tuesday's", "Sunday's full and Monday's differential"], 0,
      "A differential contains everything changed since the last full backup, so you need the full backup plus only the most recent differential."],
    ["An e-commerce company cannot tolerate more than 10 minutes of downtime. Which of the following recovery sites BEST meets this requirement?",
      ["Hot site", "Warm site", "Cold site", "Mobile site with delivered equipment"], 0,
      "Only a hot site has current data and running systems ready to take over within minutes."],
  ]);
  S("4.1", [
    ["A company is deploying 300 new Windows laptops and needs every device to start with the same hardened configuration. Which of the following is the MOST efficient approach?",
      ["Apply a secure baseline through Group Policy or MDM", "Image each laptop manually from a hardening checklist", "Deploy the laptops and run a vulnerability scan weekly", "Enable a host-based firewall and EDR on each laptop"], 0,
      "Centrally deploying a secure baseline gives consistent, automated, and auditable hardening at scale."],
  ]);
  S("4.2", [
    ["A company is retiring solid-state drives that contained classified data. Policy requires that the data be unrecoverable. Which of the following is the BEST method?",
      ["Shredding the drives", "Degaussing the drives", "A seven-pass overwrite", "Quick-formatting the drives"], 0,
      "Degaussing doesn't work on SSDs, overwrites can miss cells because of wear leveling, and formatting leaves recoverable data. Shredding or pulverizing ensures destruction, and you should keep a certificate of destruction."],
  ]);
  S("4.3", [
    ["A vulnerability scan reports a critical vulnerability on a server. The administrator confirms the patch was installed last week and the reported version string is outdated. Which of the following BEST describes this finding?",
      ["False positive", "False negative", "True positive", "Zero-day"], 0,
      "The scanner reported a vulnerability that doesn't exist. Running a credentialed scan often reduces these."],
    ["An organization learns that a critical vulnerability in its internet-facing VPN appliance is being actively exploited, but the vendor patch won't be available for three days. Which of the following should the security team do FIRST?",
      ["Apply the vendor's mitigations and increase monitoring", "Accept the risk until the vendor patch is released", "Run a credentialed scan to confirm the finding", "File an exception and schedule the patch for later"], 0,
      "Until a patch exists, apply compensating mitigations (workarounds, restricting access, disabling the affected feature) and watch closely for exploitation."],
  ]);
  S("4.4", [
    ["Analysts are overwhelmed by thousands of low-value alerts each day and recently missed a real intrusion. Which of the following should the SOC do to BEST address this?",
      ["Tune SIEM correlation rules and alert thresholds", "Disable the low-severity log sources", "Add more tier 1 analysts to triage", "Shorten SIEM log retention periods"], 0,
      "Alert fatigue is solved by tuning rules to reduce false positives so meaningful alerts stand out. Automation (SOAR) also helps."],
  ]);
  S("4.5", [
    ["Users report that phishing emails appear to come from the company's own domain. Which of the following should the email administrator implement to allow receiving servers to REJECT these spoofed messages?",
      ["DMARC with a reject policy", "SPF alone", "S/MIME on executive mailboxes", "A larger email attachment limit"], 0,
      "DMARC builds on SPF and DKIM and tells receivers what to do with failures. A reject policy blocks the spoofed mail."],
    ["A Linux web server was compromised, and the attacker replaced several system binaries. Which of the following controls would have BEST detected this change?",
      ["File integrity monitoring", "Data loss prevention", "A web proxy", "Port security"], 0,
      "FIM compares file hashes against a baseline and alerts when critical files change."],
  ]);
  S("4.6", [
    ["A company wants employees to sign in once and access its SaaS applications without separate passwords, and it wants to disable access centrally when someone leaves. Which of the following BEST meets these goals?",
      ["SSO through a federated identity provider using SAML or OIDC", "A password manager that syncs each application's password", "Directory sync that copies accounts into each application", "RADIUS authentication configured on each application"], 0,
      "Federated SSO centralizes authentication and deprovisioning. Disable the account at the identity provider and access to every connected app ends."],
    ["An administrator needs domain admin rights only occasionally to perform maintenance. The security team wants to eliminate standing privileged access. Which of the following is the BEST solution?",
      ["Just-in-time access through privileged access management", "Give the administrator a separate permanent admin account", "Add the administrator to Domain Admins with auditing on", "Store the domain admin password in a shared vault"], 0,
      "PAM grants time-limited, approved, and logged elevation only when it's needed. That's just-in-time, least-privilege access."],
  ]);
  S("4.7", [
    ["The SOC repeatedly performs the same steps when phishing is reported: extract URLs, check reputation, block the sender, and open a ticket. Which of the following would BEST improve response time?",
      ["A SOAR playbook to automate these steps", "A SIEM correlation rule for phishing", "A secure email gateway sandbox", "A threat intelligence feed subscription"], 0,
      "SOAR orchestrates and automates repetitive response tasks, which speeds response and reduces analyst workload."],
  ]);
  S("4.8", [
    ["During an incident, the team identifies that a workstation is beaconing to a command-and-control server. The team has already preserved volatile memory. Which of the following should the team do NEXT?",
      ["Isolate the workstation from the network", "Reimage the workstation from a gold image", "Hold the lessons-learned meeting", "Notify customers that a breach occurred"], 0,
      "After detection and evidence preservation, contain the threat. Eradication, recovery, and lessons learned follow."],
    ["Legal counsel informs IT that the company expects to be sued over a product defect. Which of the following should IT do to ensure relevant emails are NOT deleted by retention policies?",
      ["Place the relevant mailboxes on legal hold", "Export the mailboxes to an offline archive", "Take full backups of the email server", "Apply a 7-year retention policy to them"], 0,
      "A legal hold suspends normal deletion and preserves data for litigation."],
  ]);
  S("4.9", [
    ["An analyst needs to determine which internal hosts communicated with a malicious IP address over the past 30 days, but full packet captures are kept for only 24 hours. Which data source is BEST?",
      ["NetFlow records", "Packet captures", "Vulnerability scan reports", "Application crash logs"], 0,
      "Flow data is compact enough to keep for long periods and shows who talked to whom, and when."],
  ]);
  S("5.1", [
    ["A new regulation requires that all customer data be encrypted with AES-256 at rest. Which governance document should be updated to specify this exact technical requirement?",
      ["A standard", "A guideline", "A procedure", "An acceptable use policy"], 0,
      "Standards define mandatory, specific technical requirements that support higher-level policies."],
  ]);
  S("5.2", [
    ["A company determines that the cost to fully mitigate a low-likelihood risk exceeds the potential loss. Management documents the decision and takes no further action. Which risk response is this?",
      ["Acceptance", "Avoidance", "Transference", "Mitigation"], 0,
      "When mitigation costs more than the expected loss, organizations may formally accept the risk."],
    ["A server is valued at $40,000. A fire would destroy 50% of its value and is expected once every 10 years. What is the ALE?",
      ["$2,000", "$20,000", "$4,000", "$200,000"], 0,
      "SLE = $40,000 × 0.5 = $20,000. ARO = 0.1. ALE = $20,000 × 0.1 = $2,000."],
  ]);
  S("5.3", [
    ["A company is outsourcing payroll processing. Before signing, the security team wants assurance about the vendor's controls and the right to verify them later. Which of the following BEST meets these needs?",
      ["Review a SOC 2 Type II report and add a right-to-audit clause", "Sign an NDA and complete a vendor security questionnaire", "Review a SOC 2 Type I report and sign a service-level agreement", "Require a memorandum of understanding and an annual attestation"], 0,
      "A SOC 2 Type II report tests that controls actually worked over a period of time (Type I covers only a single point in time), and a right-to-audit clause lets you verify them later."],
  ]);
  S("5.4", [
    ["A healthcare organization suffers a breach of patient records. Which of the following regulations MOST directly applies?",
      ["HIPAA", "PCI DSS", "SOX", "GLBA"], 0,
      "HIPAA governs protected health information in the U.S. PCI DSS covers cards, SOX covers financial reporting, and GLBA covers financial institutions."],
  ]);
  S("5.5", [
    ["A penetration tester is given network diagrams, source code, and administrator credentials before testing begins. Which type of test is this?",
      ["Known environment", "Unknown environment", "Partially known environment", "Passive reconnaissance"], 0,
      "Full disclosure of internal details is a known-environment (white box) test."],
  ]);
  S("5.6", [
    ["After six months of security awareness training, the phishing simulation click rate dropped from 22% to 6% and reporting rose from 10% to 45%. What do these metrics MOST likely indicate?",
      ["The awareness program is effective", "The simulations have become too easy to spot", "The email filter is blocking the simulations", "Users are reporting all emails as phishing"], 0,
      "Fewer clicks and more reports are the key indicators of an effective awareness program. Keep training, since threats keep evolving."],
  ]);
})();
