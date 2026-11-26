/* Domain 2.0 — course-aligned gap questions (organized by course section). Original wording. */

QS("2.1", "Threat Actors", [
  ["Which three ATTRIBUTES are used to describe threat actors?",
    ["Internal/external, resources/funding, and sophistication", "Motivation, target industry, and time of attack", "Tools used, malware family, and command-and-control IPs", "Nationality, language, and time zone of the attacker"], 0,
    "Threat actor attributes describe where the attacker is (inside or outside), how much money and resources they have, and how capable they are (running scripts vs writing custom malware)."],
  ["The Stuxnet worm that destroyed about 1,000 nuclear centrifuges is a famous example of which threat actor?",
    ["Nation state", "Hacktivist", "Unskilled attacker", "Shadow IT"], 0,
    "Stuxnet is attributed to the United States and Israel. Nation states have the highest sophistication and massive resources, and target military, utility, and financial control systems."],
  ["Which threat actor is typically described as having MEDIUM sophistication because of institutional knowledge rather than elite hacking skills?",
    ["Insider threat", "Nation state", "Organized crime", "Advanced persistent threat"], 0,
    "Insiders know what to hit and can use the organization's own resources against it. Their sophistication comes from inside knowledge."],
  ["An unskilled attacker is MOST often motivated by:",
    ["The thrill of the hunt, like disruption for its own sake", "Long-term espionage on behalf of a government", "Funding a professional criminal enterprise", "Advancing a philosophical or political cause"], 0,
    "Unskilled attackers run pre-made scripts, have little or no funding, and look for low-hanging fruit. They're usually external."],
  ["Which threat actor is described as 'almost always external' and organized like a business, with roles for hacking, managing exploits, selling data, and customer support?",
    ["Organized crime", "Insider threat", "Shadow IT", "Hacktivist"], 0,
    "Organized crime is motivated by money and well funded, with the best hacking money can buy."],
  ["Which list contains only threat actor MOTIVATIONS?",
    ["Data exfiltration, espionage, blackmail, revenge, and war", "Internal/external, resources, and sophistication", "Phishing, vishing, smishing, and whaling", "Ransomware, worms, trojans, and rootkits"], 0,
    "Common motivations include data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical or political beliefs, ethical reasons, revenge, disruption/chaos, and war."],
  ["What are shadow IT's typical resources and sophistication?",
    ["Limited resources (company budget) and medium sophistication", "Massive resources and the highest sophistication", "No resources and no technical ability", "Unlimited funding from organized crime"], 0,
    "Shadow IT works around internal IT, often using the cloud. It has a company budget and may lack formal IT or security training."],
]);

QS("2.2", "Common Threat Vectors", [
  ["Which file types are common file-based threat vectors because they can contain other objects or code?",
    ["PDFs, ZIP/RAR archives, and Office files with macros", "Plain text files, CSV exports, and log files", "Firmware images, BIOS settings, and drivers", "DNS records, DHCP leases, and ARP tables"], 0,
    "Malicious code can hide in many places: PDFs (a format that contains other objects), compressed archives (many files inside), and Office files with macros or add-ins."],
  ["Why can an SVG image file be a threat vector?",
    ["SVG is XML-based and can contain HTML injection or JavaScript", "SVG files are compiled executables disguised as images", "SVG images disable browser sandboxing when they load", "SVG files are too large for email gateways to scan"], 0,
    "Image threats are harder to spot than text. Because SVG is XML, it can carry script code, so browsers must validate input before rendering."],
  ["A USB device that looks like a flash drive actually acts as a keyboard and types commands when plugged in. Which vector is this?",
    ["Removable device", "Image-based", "Voice call", "Watering hole"], 0,
    "Removable devices get around the firewall, can infect air-gapped networks, can impersonate keyboards ('hacker on a chip'), and can carry terabytes of stolen data out the door using zero network bandwidth."],
  ["Automated large-scale spam phone calls made over VoIP are known as:",
    ["Spam over IP (SPIT)", "War dialing", "Call tampering", "Smishing"], 0,
    "Voice call vectors include vishing, spam over IP, war dialing (still happens), and call tampering that disrupts voice calls."],
  ["What is the difference between client-based and agentless vulnerable software vectors?",
    ["Client-based installs an executable; agentless runs from the server, so one compromise hits all users", "Agentless installs a lightweight agent; client-based runs from the server with nothing installed", "Client-based apps update themselves; agentless apps must be patched on each client", "Agentless apps run on mobile devices; client-based apps run on desktop systems"], 0,
    "Client-based apps may have vulnerabilities and need constant updates. Agentless apps run a new instance from the server each time, so one compromised server affects everyone."],
  ["A wired network port that lets any device connect without authentication is an unsecure network vector because it lacks:",
    ["802.1X port-based authentication", "Port mirroring for monitoring", "Spanning Tree BPDU guard", "DHCP snooping on the port"], 0,
    "Unsecure network vectors include outdated or open wireless, wired ports without 802.1X, and Bluetooth (recon and implementation vulnerabilities)."],
  ["The 2013 Target breach, where attackers got in using a heating and A/C vendor's stolen VPN credentials, is an example of which vector?",
    ["Supply chain (vendor/service provider)", "Removable media", "Default credentials on routers", "Image-based attack"], 0,
    "Attackers phished an HVAC supplier, stole its VPN credentials, then used Target's wide-open network to infect cash registers at about 1,800 stores. 40 million cards were stolen."],
  ["Counterfeit networking equipment sold as genuine brand-name switches is a supply chain risk because it may:",
    ["Contain backdoors and perform or last poorly", "Void the warranty on other network devices", "Require a different management protocol", "Use incompatible power supplies and cables"], 0,
    "Fake hardware (like the counterfeit Cisco products sold for years) can include backdoors, fail early, and even catch fire. Use trusted suppliers."],
  ["Which website lists default usernames and passwords, showing why default credentials are a major vector?",
    ["Publicly available router password lists", "The CVE database", "The OWASP Top 10", "A certificate revocation list"], 0,
    "Defaults for access points and routers are easy to find online, and the right credentials give full administrator control. Change them."],
]);

QS("2.2", "Phishing", [
  ["Which red flags usually reveal a phishing email?",
    ["Something not quite right: the URL, spelling, fonts, or graphics", "An email that arrives outside of normal business hours", "An email that greets you by your first name", "An email that includes the company's real logo"], 0,
    "Well-done phishing is remarkable, but there's usually a tell. Always check the URL and look for odd spelling, fonts, or images."],
  ["A caller says, 'Hi, we're calling from Visa regarding an automated payment to your utility service,' to get account details. This is:",
    ["Pretexting", "Typosquatting", "Spraying", "Bluesnarfing"], 0,
    "Pretexting means lying to get information. The attacker plays a character in a situation they created."],
  ["Which describes how business email compromise usually commits financial fraud?",
    ["Spoofed emails change bank details or wire transfer instructions", "Malware encrypts the mail server and demands a ransom", "Attackers flood the mail server until it stops responding", "A rootkit on the mail server copies all outbound messages"], 0,
    "BEC abuses the trust we place in email sources. Attackers impersonate executives or vendors and redirect payments."],
  ["Which is a common smishing or vishing technique?",
    ["Caller ID or sender spoofing", "Sending a malicious USB drive", "Defacing the company website", "ARP poisoning the local switch"], 0,
    "Spoofing is common in both voice and SMS phishing: fake security checks, bank updates, and requests for personal information or links."],
  ["Which of these is a well-known phishing scam variation?",
    ["The phone verification code scam", "The DNS amplification scam", "The RAID rebuild scam", "The certificate pinning scam"], 0,
    "Variations include the fake check scam, phone verification code scam, boss/CEO scam, and advance-fee scam."],
]);

QS("2.2", "Impersonation", [
  ["An attacker throws around confusing technical jargon so the victim feels unqualified to question them. Which impersonation tactic is this?",
    ["Overwhelming the victim with technical details", "Being a friendly buddy to build rapport", "Claiming to be someone higher in rank", "Pretending to call from the help desk"], 0,
    "Impersonators pretend to be from the help desk or someone higher in rank, use details from reconnaissance, bury victims in technical terms, or act friendly ('How about those Cubs?')."],
  ["Extracting information from a victim through conversation, without the victim realizing it, is called:",
    ["Eliciting information", "Pharming", "Shoulder surfing", "Dumpster diving"], 0,
    "Eliciting uses well-documented psychological techniques. It's often done over the phone, where it can be easier to get information. Attackers can't just ask for your password."],
  ["An attacker uses stolen personal details to open a new loan in the victim's name. This type of identity fraud is:",
    ["Loan fraud", "Government benefits fraud", "Watering hole fraud", "Domain hijacking"], 0,
    "Identity fraud includes credit card fraud, bank fraud (access or new accounts), loan/lease fraud, and government benefits fraud."],
  ["What is the BEST way for an employee to protect against impersonation?",
    ["Verify first, such as calling back on a known number", "Answer quickly so the caller doesn't escalate", "Share only partial details to stay helpful", "Trust callers who know internal terminology"], 0,
    "Never volunteer information, don't disclose personal details, and verify through callbacks or third parties. Organizations should encourage verification."],
]);

QS("2.2", "Watering Hole Attacks", [
  ["In the 2017 watering hole attack against financial regulators, the malicious JavaScript was only delivered to:",
    ["IP addresses of banks and financial institutions", "Visitors using outdated web browsers", "Mobile devices running older Android versions", "Users who logged in to the regulator's portal"], 0,
    "The attackers poisoned regulator websites but targeted only visitors from specific financial institutions. Watering holes infect all visitors but are aimed at specific victims."],
  ["How was the 2017 Polish Financial Supervision Authority watering hole attack code caught?",
    ["Generic antivirus signatures recognized and stopped it", "An IPS blocked the site's outbound connections", "The regulator's web team found the injected script", "DNS filtering blocked the malicious domain"], 0,
    "That outcome shows why defense in depth matters: firewalls, IPS, and up-to-date antivirus signatures together, because no single control does it all."],
  ["What is the FIRST step an attacker takes when planning a watering hole attack?",
    ["Determine which websites the victim group uses", "Send phishing emails to every employee", "Brute force the VPN", "Plug a USB drive into the victim's PC"], 0,
    "The attacker researches where the targets go (industry sites, local shops), infects one of those third-party sites, and waits for the victims to come."],
]);

QS("2.2", "Other Social Engineering Attacks", [
  ["Attackers create tens of thousands of fake sites impersonating a famous brand, then show visitors pop-ups saying 'You won!' This is:",
    ["Brand impersonation", "Domain hijacking", "Bluejacking", "Credential stuffing"], 0,
    "Brand impersonation gets fake sites into search results and ads. Clicking the 'special offer' almost guarantees malware, tracking, or data theft."],
  ["Nation-state influence campaigns that use social media to 'divide, distract, and persuade' rely on:",
    ["Creating, sharing, liking, and amplifying disinformation", "Encrypting the victim's files", "Exploiting buffer overflows", "Compromising routers with default passwords"], 0,
    "Misinformation and disinformation campaigns sway public opinion on political and social issues. Advertising can also be used to amplify them."],
]);

QS("2.3", "Memory Injections", [
  ["Which is one of the MOST popular memory injection methods on Windows?",
    ["DLL injection", "SQL injection", "LDAP injection", "Header injection"], 0,
    "Attackers inject the path to a malicious Dynamic-Link Library into a target process, so the code runs as part of that process. It's relatively easy to implement."],
  ["Besides hiding, what does malware gain by injecting itself into a legitimate process's memory?",
    ["The process's data and its rights and permissions", "A dedicated CPU core and higher scheduling priority", "A new network interface and IP address", "Kernel-level persistence across reboots"], 0,
    "Memory injection can lead to privilege escalation. Memory forensics can still find the injected code among processes, DLLs, threads, and buffers."],
]);

QS("2.3", "Buffer Overflows", [
  ["What makes a buffer overflow exploit truly dangerous to attackers' targets?",
    ["When it's repeatable and reliably compromises a system", "When it crashes the application on the first attempt", "When it only works in a debugger or test system", "When it requires local console access to trigger"], 0,
    "Buffer overflows aren't simple: attackers spend time avoiding crashes and making the overflow do what they want. A repeatable overflow means reliable compromise."],
  ["Which developer practice prevents buffer overflows?",
    ["Bounds checking on input", "Using longer variable names", "Adding more comments to the code", "Compressing input data"], 0,
    "Developers must check that input fits the allocated buffer so it can't spill into adjacent memory."],
]);

QS("2.3", "Race Conditions", [
  ["Two users transfer $50 from Account A at the same moment, and both transfers succeed because each checked the balance before the other's withdrawal posted. What vulnerability is this?",
    ["A race condition (TOCTOU)", "An SQL injection", "A replay attack", "An integer overflow"], 0,
    "The classic TOCTOU example: something changes between the check and the use. Proper validation and locking prevent it."],
  ["In 2023, researchers gained root access to a Tesla Model 3's infotainment system through Bluetooth using which type of attack?",
    ["A TOCTOU race condition", "A watering hole", "A DNS poisoning attack", "A rainbow table"], 0,
    "At Pwn2Own Vancouver 2023, a time-of-check to time-of-use attack elevated privileges to root. The researchers won a $100,000 prize and the car."],
]);

QS("2.3", "Malicious Updates", [
  ["In the SolarWinds Orion attack reported in December 2020, how did attackers reach hundreds of government agencies and companies?",
    ["They added malicious code to legitimate updates on the developer's system", "They brute forced each agency's VPN with a password spraying tool", "They phished each agency's administrators with fake update emails", "They exploited a zero-day in each agency's perimeter firewall"], 0,
    "Attackers compromised SolarWinds' development system. Customers (18,000 of them) installed the trojaned updates through the normal update process."],
  ["A random pop-up during web browsing says your software needs an update. What's the BEST practice?",
    ["Visit the developer's site directly instead of trusting the pop-up", "Click the pop-up immediately", "Disable antivirus so the update installs smoothly", "Forward it to coworkers to update too"], 0,
    "Confirm the source. Don't trust random update buttons or downloads, keep a known-good backup, and don't disable OS controls that only allow signed apps."],
]);

QS("2.3", "Operating System Vulnerabilities", [
  ["Microsoft's monthly security update release, on the second Tuesday of each month, is known as:",
    ["Patch Tuesday", "Zero-day Tuesday", "Out-of-band Tuesday", "Rollback Tuesday"], 0,
    "A typical Patch Tuesday fixes dozens of vulnerabilities (elevation of privilege, remote code execution, information disclosure, DoS, and more). Other vendors have similar schedules."],
  ["Why might an organization test OS patches before deploying them?",
    ["A patch might break something else", "Patches can't be rolled back once installed", "Untested patches void the OS license", "Testing makes the patch install faster"], 0,
    "It's a race against attackers, but patches can cause problems. Test first, save data before reboots, and have a fallback plan (backups)."],
]);

QS("2.3", "SQL Injection", [
  ["Which data types can be targeted by code injection attacks?",
    ["HTML, SQL, XML, and LDAP", "SQL only", "JavaScript only", "Compiled binaries only"], 0,
    "Code injection adds attacker data into a data stream. It's possible because applications don't properly handle input and output, and it applies to many data types."],
  ["An attacker enters Professor' OR '1'='1 into a name field. Why does this return every record?",
    ["The added condition is always true, so every row matches", "The quote character crashes the database and dumps its contents", "The query is rewritten to drop the users table", "The input overflows the buffer and runs as code"], 0,
    "Appending OR '1'='1' changes the query logic. SQL injection can also delete data, add users, or cause denial of service."],
]);

QS("2.3", "Cross-site Scripting", [
  ["Which website feature is a common source of reflected (non-persistent) XSS?",
    ["A search box that echoes input back in results", "A login form that uses parameterized queries", "A static page served from a CDN", "A download link protected by a hash"], 0,
    "In reflected XSS, the attacker emails a link with a script in the URL. The script runs in the victim's browser as if it came from the trusted server, sending cookies or session IDs to the attacker."],
  ["Why can stored XSS on a social network spread so quickly?",
    ["Every viewer runs the payload, which can repost itself", "Each victim must click a link the attacker emails them", "The script runs on the server rather than in browsers", "Each victim must first install a browser extension"], 0,
    "Persistent XSS has no specific target. All viewers get the payload, and it can self-propagate."],
  ["In 2017, a researcher found Subaru's authentication tokens never expired and its web front end had an XSS flaw. What could the combination allow?",
    ["Stealing a token via a malicious link for full access to a car", "Encrypting the vehicles' storage and demanding a ransom", "Taking down the manufacturer's DNS with a DDoS", "Downgrading the car's connection to an older TLS version"], 0,
    "A clicked malicious link leaked the token, and a token that never expires allowed any service request, including adding the attacker's email to someone else's account."],
  ["Which is the MOST effective developer-side protection against XSS?",
    ["Validating input so users can't add scripts", "Forcing all traffic to use HTTPS", "Using a wildcard TLS certificate", "Shortening the session timeout"], 0,
    "Users can be careful with links, disable or control JavaScript (limited protection), and stay updated, but input validation in the application is the key fix."],
]);

QS("2.3", "Hardware Vulnerabilities", [
  ["What is the difference between end of life (EOL) and end of service life (EOSL)?",
    ["EOL: no longer sold but may be supported; EOSL: no support or patches", "EOL: no patches at all; EOSL: patches continue for a premium", "EOL applies to hardware; EOSL applies only to software", "EOL and EOSL both mean patches end on the same date"], 0,
    "At EOL, sales stop but support may continue. At EOSL, there are no ongoing security patches, though a premium support option sometimes exists. EOSL technology is a significant concern."],
  ["Why are firmware vulnerabilities especially challenging?",
    ["The hardware vendor has to fix them, if they know and care", "Antivirus can't scan firmware, so patches can't be verified", "Firmware fixes usually require replacing the device", "Firmware flaws affect devices that lack an operating system"], 0,
    "Firmware is the hardware's operating system. In one real case, a smart thermostat maker took up to two years to patch reported vulnerabilities."],
  ["A legacy system running an old OS must stay in production. Which compensating protections are appropriate?",
    ["Extra firewall rules and IPS signatures for older OSes", "Moving it to the guest network to reduce exposure", "Giving it a public IP so the vendor can support it", "Disabling its logging to reduce attack surface"], 0,
    "Compare the risk to the return. If it must stay, wrap it with extra protections."],
]);

QS("2.3", "Virtualization Vulnerabilities", [
  ["At Pwn2Own 2017, researchers chained a browser bug, a Windows kernel bug, and a VMware hardware simulation bug. What was the final result?",
    ["Escape from the guest VM to the host", "Decryption of BitLocker drives", "A DDoS against the hypervisor vendor", "Theft of the CA's private key"], 0,
    "The chain went from browser code execution to guest OS compromise to VM escape. Patches came soon after, but it showed VM escape is possible."],
  ["A hypervisor with 4 GB of RAM runs three VMs that each have 2 GB assigned. What risk does this create?",
    ["Resource reuse: shared memory could leak data between VMs", "VM sprawl: too many unmanaged VMs on one host", "VM escape: a guest breaks out to the hypervisor", "Race condition: VMs compete for the same CPU"], 0,
    "Overcommitted resources are shared and reused between VMs. Memory management features and security patches mitigate data leakage."],
  ["Which vulnerability types are common in virtualization platforms?",
    ["Privilege escalation, command injection, and info disclosure", "Physical theft, tailgating, and dumpster diving", "Phishing, vishing, and smishing", "Certificate expiration and CRL failures"], 0,
    "Virtualization adds complexity, and complexity gives attackers opportunity."],
]);

QS("2.3", "Cloud-specific Vulnerabilities", [
  ["Which basic best practice do surveys show MANY organizations still skip for cloud management console users?",
    ["Multi-factor authentication", "Using a web browser", "Having a username", "Paying their cloud bill"], 0,
    "Research cited in the course found about three-quarters of organizations weren't using MFA for cloud console users, and much production code had unpatched high or critical vulnerabilities (CVSS 7.0 or higher)."],
  ["Log4j and Spring Cloud Function are examples of which kind of cloud attack?",
    ["Easy-to-exploit web application attacks", "Physical data center intrusions", "Bluetooth and wireless jamming attacks", "Supply chain hardware tampering"], 0,
    "Cloud attack types include DoS, authentication bypass, directory traversal, remote code execution, XSS, out-of-bounds writes, and SQL injection."],
  ["Writing data to unauthorized memory areas, which can cause corruption, crashes, or code execution, is called:",
    ["An out-of-bounds write", "Authentication bypass", "Directory traversal", "Session riding"], 0,
    "Out-of-bounds writes are a common memory safety bug in cloud and other applications."],
]);

QS("2.3", "Supply Chain Vulnerabilities", [
  ["Which of these could be a supply chain risk through a SERVICE provider?",
    ["A cleaning or payroll company with internal access", "A customer browsing the public website", "A competitor publishing a press release", "An employee's personal smartwatch at home"], 0,
    "Many providers (network, utilities, cleaning, payroll, cloud, sysadmin) have internal access. Ongoing security audits should be written into contracts."],
  ["Which practice helps reduce HARDWARE supply chain risk?",
    ["Using a small supplier base with tight vendor controls", "Buying from the cheapest unknown reseller", "Skipping inspection of new equipment", "Allowing vendors unrestricted network access"], 0,
    "Fewer, trusted suppliers plus strict policies and security built into the overall design limit supply chain exposure."],
  ["When installing new software, what should be confirmed to address software supply chain trust?",
    ["The digital signature", "The file's icon", "The installer's color scheme", "The size of the download only"], 0,
    "Confirm signatures at install and consider how secure automatic updates are. Open source isn't immune either, since the source code itself can be compromised."],
]);

QS("2.3", "Misconfiguration Vulnerabilities", [
  ["In 2017, a third party exposed millions of a telecom company's customer records. What was the cause?",
    ["An S3 storage bucket was left with open permissions", "A zero-day in the company's perimeter firewall", "An insider copied records to a USB drive", "Ransomware encrypted the customer database"], 0,
    "Open permissions are easy to leave behind and increasingly common in cloud storage. Attackers (and researchers) scan for them."],
  ["What is the recommended way to protect the Linux root account?",
    ["Disable direct root login and use su or sudo", "Set the root password to something easy to remember", "Share the root password with all admins", "Rename root to 'admin'"], 0,
    "Unsecured admin accounts (root, Administrator) with weak passwords are dangerous misconfigurations. Disable direct login and limit privileged accounts."],
  ["How can you verify whether a protocol is sending data in the clear?",
    ["Capture packets and inspect the traffic", "Check the protocol's default port number", "Ping the server and check the response", "Review the vendor's security datasheet"], 0,
    "Packet captures reveal everything sent unencrypted, which is the case for Telnet, FTP, SMTP, and IMAP. Use SSH, SFTP, IMAPS, and other encrypted versions."],
  ["The Mirai botnet took over cameras, routers, and doorbells by exploiting:",
    ["Default configurations on IoT devices", "A buffer overflow in Windows", "Expired TLS certificates", "SQL injection in banking apps"], 0,
    "Mirai tried 60+ default credential sets on IoT devices. Its code was released as open source, spawning many variants."],
  ["Why should firewall rulesets be regularly tested and audited?",
    ["They're complex, and a mistake can open a port", "Firewall rules expire if they aren't audited", "Audits are needed to keep firmware licensed", "Auditing improves the firewall's throughput"], 0,
    "Services open ports, and firewalls manage access by port or application. Complex rulesets need double and triple checking."],
]);

QS("2.3", "Mobile Device Vulnerabilities", [
  ["Why does jailbreaking or rooting make an MDM relatively useless?",
    ["Custom firmware replaces the OS and bypasses security", "It removes the device from the MDM server's inventory", "It upgrades the OS to a version MDM doesn't support", "It encrypts the MDM profile so it can't be read"], 0,
    "Rooting or jailbreaking gives uncontrolled access and can bypass the controls the MDM relies on, including allowing sideloading."],
  ["Which characteristics make mobile devices hard to secure?",
    ["They're small, mobile, full of sensitive data, and always connected", "They use different CPU architectures than desktops", "They can't run endpoint security software at all", "They connect only through cellular, not Wi-Fi"], 0,
    "Mobile devices need additional policies and systems (like MDM) because of these traits."],
]);

QS("2.3", "Zero-day Vulnerabilities", [
  ["Why do attackers keep newly discovered vulnerabilities to themselves?",
    ["To exploit them for personal gain before a patch exists", "To sell them back to the vendor for a bug bounty", "To keep them for later responsible disclosure", "To test them in a lab before reporting"], 0,
    "Good guys share findings with developers. Attackers hoard them as zero-days, creating a race between exploitation and patching."],
  ["Who maintains the public CVE list?",
    ["MITRE", "The NSA only", "Each individual software vendor privately", "The Internet Engineering Task Force"], 0,
    "MITRE manages the Common Vulnerabilities and Exposures program, which assigns IDs to publicly known vulnerabilities."],
]);

QS("2.4", "An Overview of Malware", [
  ["During a ransomware attack, why does the operating system usually remain available?",
    ["The attackers want you running but not working, so you can pay", "Ransomware can't encrypt files used by the operating system", "BitLocker protects the OS volume from being encrypted", "The OS is restored automatically from a recovery partition"], 0,
    "Ransomware encrypts data files (documents, pictures, music) but leaves the OS so you can read the ransom note and pay for the decryption key, an unfortunate use of public-key cryptography."],
  ["Which is the single MOST important protection against ransomware?",
    ["An offline backup", "A longer Wi-Fi password", "A faster CPU", "A wildcard certificate"], 0,
    "Always have a backup, ideally offline. Also keep the OS, applications, and anti-malware signatures up to date."],
  ["Malware installed simply by visiting a compromised website, without clicking anything else, is called:",
    ["A drive-by download", "A watering hole lure", "A trojan installer", "A logic bomb"], 0,
    "Your computer must run a program to get infected: email links, web pop-ups, drive-by downloads, or worms exploiting vulnerabilities."],
]);

QS("2.4", "Viruses and Worms", [
  ["A virus that infects the code that runs before the operating system loads is a:",
    ["Boot sector virus", "Macro virus", "Script virus", "Program virus"], 0,
    "Virus types: program viruses (part of an application), boot sector viruses, script viruses (OS and browser-based), and macro viruses (common in Microsoft Office)."],
  ["Why is a fileless virus considered a stealth attack?",
    ["It runs in memory and is never installed as a file", "It encrypts itself with a new key on each infection", "It hides in the boot sector before the OS loads", "It deletes its own files after it finishes running"], 0,
    "Fileless malware avoids writing to disk, which defeats traditional file-scanning antivirus."],
  ["Which controls can mitigate many worm infestations, though they help less once a worm is inside?",
    ["Firewalls and IDS/IPS", "Data masking", "Key escrow", "Code signing only"], 0,
    "Worms self-propagate across the network. Perimeter controls can stop them at the edge, but internal spread needs segmentation and patching."],
]);

QS("2.4", "Spyware and Bloatware", [
  ["Which is a common way spyware tricks users into installing it?",
    ["Fake security software or peer-to-peer downloads", "Signed OS updates from Microsoft", "Hardware firmware updates from the vendor", "Encrypted VPN connections"], 0,
    "Spyware is used for advertising, identity theft, and affiliate fraud. Know what you install and watch the options during installation."],
  ["What is the FIRST recommended method for removing bloatware?",
    ["The built-in uninstaller", "Reformatting the entire drive", "A third-party cleaner from an unknown site", "Deleting system files manually"], 0,
    "Most apps can be removed with the built-in uninstaller. Some have their own uninstaller. Third-party cleaners probably aren't the first option, and always have a backup."],
]);

QS("2.4", "Other Malware Types", [
  ["Why can a keylogger circumvent encryption protections?",
    ["It captures keystrokes before they're encrypted", "It brute forces the AES key used by the browser", "It steals the server's TLS private key", "It downgrades connections to unencrypted HTTP"], 0,
    "Keyloggers capture input at the source. Many also log the clipboard, screen, instant messages, and search queries."],
  ["What's the difference between a time bomb and other logic bombs?",
    ["A time bomb triggers on a time or date; other logic bombs trigger on a user event", "Time bombs are hardware, logic bombs are software", "Time bombs can be detected by signatures, logic bombs can't", "There's no difference at all"], 0,
    "Both wait for a predefined trigger, are often left by someone with a grudge, are hard to identify, and are hard to recover from."],
  ["Which practices help PREVENT logic bombs?",
    ["Change control, monitoring like HIDS or Tripwire, and auditing", "Signature-based antivirus updated daily on all servers", "Full-disk encryption on every development workstation", "Network segmentation between dev and production"], 0,
    "Each logic bomb is unique with no predefined signature, so processes and monitoring for changes are key."],
  ["A 2016 attack on a high-voltage substation began disabling electrical circuits at a predetermined time. This was a:",
    ["Logic bomb targeting SCADA", "Worm spreading through SCADA", "Watering hole against utilities", "DDoS against the substation"], 0,
    "The malware mapped the control network and triggered at a set time, showing logic bombs targeting industrial control systems."],
  ["Which feature helps prevent rootkits from loading during startup?",
    ["Secure Boot with UEFI", "Disk defragmentation", "A screen saver password", "Wildcard certificates"], 0,
    "Rootkits modify core system files (part of the kernel) and can be invisible in Task Manager and to antivirus. Secure Boot verifies boot components. Removal often needs a rootkit-specific tool."],
]);

QS("2.4", "Physical Attacks", [
  ["Why do physical attacks matter even with strong digital security?",
    ["Physical access gives full control; the OS can't stop an in-person attack", "Physical attacks bypass encryption, so encrypted servers are at more risk", "Firewalls don't log physical attacks, so they go undetected", "Servers must be moved to the cloud to be physically secure"], 0,
    "Door locks keep out honest people. Check windows and doors and prepare for brute-force physical entry."],
  ["Cheap RFID duplicators can copy an access badge in seconds. What's the recommended defense?",
    ["Require another factor with the card", "Switch to higher-frequency RFID badges", "Add a photo and hologram to each badge", "Reissue badges to all employees yearly"], 0,
    "Because cloning is easy, require another factor (PIN, biometric) along with the card."],
  ["An attacker disables a data center's cooling system to make servers overheat. This is a(n):",
    ["Environmental attack", "Brute force attack", "Replay attack", "Watering hole attack"], 0,
    "Environmental attacks target what supports the technology: power, HVAC and humidity controls, and fire suppression."],
]);

QS("2.4", "Denial of Service", [
  ["Why might an attacker launch a DoS attack that isn't their main goal?",
    ["As a smokescreen, such as a precursor to DNS spoofing", "To measure the victim's maximum bandwidth capacity", "To force the victim to apply emergency patches", "To test whether the victim's IPS is in passive mode"], 0,
    "DoS can be for competitive advantage, a smokescreen, or simply turning off the power. It doesn't have to be complicated."],
  ["A network loop is accidentally created on a switch network without Spanning Tree Protocol, taking the network down. This is:",
    ["An unintentional (friendly) DoS", "A DDoS reflection attack", "A deliberate amplification attack", "A replay attack"], 0,
    "Not all DoS is malicious: Layer 2 loops, huge downloads over a slow link, or even a broken water line can cause outages."],
  ["Why is a DDoS called an asymmetric threat?",
    ["The attacker may have fewer resources but still overwhelms the victim", "It targets services that rely on asymmetric encryption", "It needs the attacker and victim to have equal bandwidth", "Its traffic flows in one direction and isn't acknowledged"], 0,
    "Botnets (like Zeus, which infected over 3.6 million PCs at its peak) let attackers with modest resources coordinate massive traffic."],
  ["Which protocols are commonly abused for DDoS reflection and amplification because they have little or no authentication?",
    ["NTP, DNS, and ICMP", "SSH, TLS, and IPsec", "Kerberos and LDAPS", "SFTP and HTTPS"], 0,
    "Reflection plus amplification turns a small attack into a big one by bouncing spoofed requests off internet services."],
]);

QS("2.4", "DNS Attacks", [
  ["Why can modifying a computer's local hosts file redirect users even if DNS is correct?",
    ["The hosts file takes precedence over DNS queries", "The hosts file encrypts DNS", "DNS servers read from each client's hosts file", "The hosts file disables HTTPS"], 0,
    "DNS poisoning can target the DNS server, the client's hosts file, or responses in transit (an on-path attack)."],
  ["In 2016, attackers changed the registrations for 36 of a Brazilian bank's domains and controlled its traffic for about 6 hours. This was:",
    ["Domain hijacking", "Typosquatting", "Bluesnarfing", "ARP poisoning"], 0,
    "Domain hijacking takes over the domain registration account (by brute force, social engineering, or compromising the managing email), so attackers control DNS without touching the servers."],
  ["Registering professormesser.org to catch users of the real .com site is which type of URL hijacking?",
    ["Different top-level domain", "Outright misspelling", "Typing error", "Different phrase"], 0,
    "URL hijacking types: outright misspelling, typing errors, different phrases (adding an 's'), and different TLDs. Uses include ads, reselling the domain, redirecting to competitors, phishing, and drive-by downloads."],
]);

QS("2.4", "Wireless Attacks", [
  ["Which IEEE standard protects important 802.11 management frames such as deauthenticate and disassociate?",
    ["802.11w", "802.11ac", "802.3af", "802.1Q"], 0,
    "802.11w (2014) encrypts key management frames. Beacons, probes, authentication, and association frames still aren't encrypted. It's required for 802.11ac compliance."],
  ["A jammer that only transmits when someone else tries to communicate is using:",
    ["Reactive jamming", "Constant random-bit jamming", "Interference from a microwave", "Deauthentication"], 0,
    "Jamming types include constant random bits, constant legitimate frames, data at random times, and reactive jamming. Jamming lowers the signal-to-noise ratio so receivers can't hear good signals."],
  ["What's the difference between wireless interference and jamming?",
    ["Interference is unintentional; jamming is intentional", "Jamming is accidental; interference is deliberate", "Interference affects only 5 GHz; jamming only 2.4 GHz", "They're the same, measured with different tools"], 0,
    "Finding a jammer ('fox hunting') requires equipment like a directional antenna and an attenuator. Jammers must be fairly close to be effective."],
]);

QS("2.4", "On-path Attacks", [
  ["Malware on the victim's own computer proxies browser traffic, waiting for the user to log in to their bank. This is a(n):",
    ["On-path browser attack", "ARP poisoning attack", "Evil twin access point", "Session replay attack"], 0,
    "When the attacker is on the same computer, encrypted traffic is easy to proxy and everything looks normal to the victim."],
  ["ARP poisoning works as an on-path attack because:",
    ["ARP has no security, so fake replies are accepted", "ARP uses weak encryption that's easy to crack", "ARP traffic is routed across the internet", "ARP depends on DNS, which can be poisoned"], 0,
    "ARP poisoning is an on-path attack on the local IP subnet: the attacker tells hosts that their MAC is the gateway's, so traffic is redirected through the attacker."],
]);

QS("2.4", "Replay Attacks", [
  ["Why is a replay attack NOT considered an on-path attack?",
    ["The replay doesn't need the original workstation or a live position in the conversation", "Replay attacks forge new data rather than capturing anything from the network", "Replay attacks work on wireless networks that lack WPA3 encryption", "Replay attacks need physical access to the server being targeted"], 0,
    "The attacker first captures data (network tap, ARP poisoning, malware), then later replays it on their own to appear as someone else."],
  ["An attacker captures a username and password hash during authentication and sends their own authentication request using that hash. This is:",
    ["Pass the hash", "Password spraying", "A birthday attack", "Rainbow table cracking"], 0,
    "Pass the hash uses the captured hash directly, so the attacker never needs to crack the actual password."],
  ["An attacker intercepts a victim's session ID and uses it to access a web server as the victim. This is:",
    ["Session hijacking (sidejacking)", "Pass the hash", "Credential stuffing", "Cross-site request forgery"], 0,
    "Session IDs are often stored in cookies. Steal the session ID and you are the user. Tools can also modify headers and cookies."],
  ["What's the BEST way to prevent session hijacking?",
    ["Encrypt end-to-end so session IDs can't be captured", "Store session IDs in local storage instead of cookies", "Increase the session ID length to 128 characters", "Require users to log out at the end of each session"], 0,
    "If they can't see it, they can't capture it. At minimum, encrypt end-to-somewhere (like a personal VPN on public Wi-Fi)."],
  ["Which statement about browser cookies is TRUE?",
    ["They aren't executable and are generally safe unless someone steals them", "They're executable scripts that run each time the page loads", "They're encrypted by the browser and can't hold session IDs", "They're stored on the web server, not on the user's computer"], 0,
    "Cookies support tracking, personalization, and session management. They can be a privacy risk, and stolen session cookies enable hijacking."],
]);

QS("2.4", "Malicious Code", [
  ["The WannaCry ransomware spread by exploiting a vulnerability in:",
    ["Windows SMBv1", "Apple FileVault", "Linux sudo", "Cisco IOS SSH"], 0,
    "WannaCry used an SMBv1 flaw for arbitrary code execution and spread worm-like across networks."],
  ["Attackers placed 22 lines of malicious JavaScript on an airline's checkout pages and stole payment data from hundreds of thousands of customers. Which attack was used?",
    ["Cross-site scripting", "SQL injection", "Buffer overflow", "VLAN hopping"], 0,
    "The British Airways breach showed how a small script injection can skim payment data at scale."],
  ["A national health database breach that exposed healthcare information for an entire country was caused by:",
    ["SQL injection", "A rootkit", "RFID cloning", "Bluejacking"], 0,
    "The Estonian Central Health Database breach shows how damaging SQL injection can be."],
  ["Which methods let attackers in WITHOUT technical exploitation skills?",
    ["Social engineering, default credentials, and misconfigurations", "Kernel exploits, memory injection, and buffer overflows", "Custom zero-days, rootkits, and firmware implants", "Hash collisions, downgrade attacks, and SSL stripping"], 0,
    "When the door is already unlocked, no skill is required. Protection comes from anti-malware, firewalls, patching, and secure habits."],
]);

QS("2.4", "Application Attacks", [
  ["Which two OS protections help mitigate privilege escalation and buffer overflow exploits?",
    ["DEP and ASLR", "SPF and DKIM", "HIPS and NAC", "OCSP and CRL"], 0,
    "DEP only lets code run from executable memory areas, and ASLR randomizes memory addresses so attackers can't rely on known locations. Also patch quickly and keep anti-malware updated."],
  ["User A exploits a flaw to access User B's files at the same permission level. This is:",
    ["Horizontal privilege escalation", "Vertical privilege escalation", "Lateral movement", "Directory traversal"], 0,
    "Horizontal escalation accesses another user's resources. Vertical escalation goes to higher privileges, like SYSTEM or admin."],
  ["Cross-site request forgery is also known as:",
    ["One-click attack or session riding", "Sidejacking or pass the hash", "Typosquatting or brandjacking", "Bluejacking or bluesnarfing"], 0,
    "CSRF (XSRF, 'sea surf') abuses the trust a web app has in the user's browser. Apps should use anti-forgery cryptographic tokens."],
  ["Which statement about cross-site requests is TRUE?",
    ["Cross-site requests are normal; forged ones are the problem", "Modern browsers block cross-site requests by default", "Cross-site requests happen during XSS attacks", "Cross-site requests require the user to be logged out"], 0,
    "Pages routinely load content from other sites. CSRF becomes an attack when requests are made without the user's consent or knowledge."],
  ["Directory traversal can be caused by which two types of vulnerabilities?",
    ["Web server software flaws and badly written app code", "Weak Wi-Fi passwords and expired certificates", "Missing SPF records and open mail relays", "Misconfigured VLANs and missing STP"], 0,
    "Either the server software fails to keep users within the web root, or the application code lets them browse outside it."],
]);

QS("2.4", "Cryptographic Attacks", [
  ["In a room of 23 people, there's about a 50% chance two share a birthday. How does this apply to security?",
    ["Hash collisions can be found much faster than expected", "Encryption keys should change on a yearly schedule", "Two passwords rarely end up with the same salt", "Longer passwords produce longer hash values"], 0,
    "The birthday attack generates many plaintexts to find matching hashes. Defend with larger hash output sizes."],
  ["In 2008, researchers used MD5 collisions to create a CA certificate that appeared legitimate. What did this allow?",
    ["Forging certificates that appeared to come from a trusted CA", "Decrypting TLS traffic protected by that CA's certificates", "Disabling OCSP checks for that CA's customers", "Shortening the CA's RSA keys so they could be cracked"], 0,
    "Collisions break trust in signatures. That's why MD5 (published 1992, collisions found 1996) must not be used for security."],
  ["The 2014 POODLE vulnerability forced clients to fall back to which insecure protocol?",
    ["SSL 3.0", "TLS 1.3", "SSH 2", "IPsec IKEv2"], 0,
    "POODLE was an on-path downgrade attack. Because of it, modern browsers won't fall back to SSL 3.0."],
  ["An attacker on-path rewrites HTTPS links so the victim talks to the attacker over HTTP while the attacker talks HTTPS to the server. This is:",
    ["SSL stripping", "Pass the hash", "Bluesnarfing", "Domain hijacking"], 0,
    "SSL stripping is a downgrade-style on-path attack: the victim sends credentials in the clear without realizing it. HSTS and HTTPS-only sites defend against it."],
]);

QS("2.4", "Password Attacks", [
  ["An application stores user passwords in plaintext. What's the recommended response?",
    ["Get a better application", "Add a longer password policy", "Store the file in a different folder", "Compress the password file"], 0,
    "Anyone with access to a plaintext password file has every credential. Passwords should be stored as salted hashes."],
  ["What's the key difference between ONLINE and OFFLINE brute force attacks?",
    ["Online is slow and triggers lockouts; offline cracks stolen hashes with no lockouts", "Online attacks are faster because the server does the hashing work", "Offline attacks need the user logged in to capture each attempt", "Online attacks crack hashes; offline attacks guess at the login page"], 0,
    "Offline attacks need large computational resources but aren't limited by account lockouts, which is why strong, slow hashing matters."],
  ["A spraying attack typically tries how many passwords per account before moving on?",
    ["A few of the most common passwords", "Every possible character combination", "Words from a large dictionary file", "The user's previously breached passwords"], 0,
    "Staying under the lockout threshold avoids lockouts, alarms, and alerts."],
]);

QS("2.4", "Indicators of Compromise", [
  ["Which of these are common indicators of compromise?",
    ["Changed file hashes, irregular international traffic, and DNS changes", "Scheduled backups, routine patching, and certificate renewals", "New user accounts created by HR during onboarding", "Higher web traffic after a marketing campaign launch"], 0,
    "IOCs indicate intrusion with high confidence: unusual network activity, changed file hashes, odd international traffic, DNS changes, uncommon login patterns, and spikes of reads on certain files."],
  ["A single user account shows interactive logins from multiple locations at the same time. Which IOC is this?",
    ["Concurrent session usage", "Blocked content", "Resource inaccessibility", "Out-of-cycle patching"], 0,
    "It's hard to be in two places at once. This can be tricky to investigate because of multiple devices and automated processes."],
  ["A company discovers its confidential data posted on a public website. Which IOC is this?",
    ["Published/documented data", "Account lockout", "Concurrent sessions", "Impossible travel"], 0,
    "Attacks can go unnoticed until data is published, sometimes alongside ransomware extortion. Researchers may try to trace the source."],
  ["A server suddenly becomes unresponsive. How might this relate to an attack?",
    ["It could cover another exploit or be an exploit gone wrong", "It's caused by hardware failure rather than attacks", "It means the server is installing Windows updates", "It means the firewall is blocking an active attack"], 0,
    "Resource inaccessibility (server down, network disruption, encrypted data) can signal DoS, a smokescreen, ransomware, or brute force locking accounts."],
]);

QS("2.5", "Segmentation and Access Control", [
  ["What are the three main reasons to segment a network?",
    ["Performance, security, and compliance", "Cost, color, and size", "Speed, hashing, and salting", "Branding, marketing, and sales"], 0,
    "Segmentation isolates high-bandwidth apps (performance), keeps users from talking directly to database servers (security), and meets mandates like PCI DSS (compliance). It can be physical, logical (VLANs), or virtual."],
  ["What's a key caution when configuring access control lists on network devices?",
    ["You can accidentally lock yourself out", "ACLs encrypt all traffic", "ACLs can only filter by MAC address", "ACLs disable logging"], 0,
    "ACLs allow or deny by source/destination IP, port, time, application, and more. A mistake can block your own admin access."],
  ["An application allow list that only permits software from specific publishers is based on:",
    ["Publisher certificate", "Application hash", "Folder path", "Network zone"], 0,
    "OS allow/deny lists can use the app's hash (unique identifier), its signing certificate, its path (approved folders), or the network zone it runs from."],
  ["Which allow-list method breaks every time an application is updated, because the identifier changes?",
    ["Application hash", "Certificate-based rule", "Network zone rule", "Publisher name rule"], 0,
    "A hash uniquely identifies one exact file version. Any update changes the hash, so the rule must be updated too."],
]);

QS("2.5", "Mitigation Techniques", [
  ["A critical zero-day is announced, and the vendor releases a fix outside its normal monthly schedule. This is a(n):",
    ["Emergency out-of-band update", "Patch Tuesday update", "Service pack", "Auto-update rollback"], 0,
    "Patching includes monthly updates, third-party updates (apps, drivers), auto-update (not always the best option), and emergency out-of-band patches."],
  ["During a NAC posture assessment, which items are typically checked?",
    ["OS patch level, EDR status, firewall status, and certificate status", "User's job title, department, manager, and office location", "Monitor resolution, keyboard layout, and installed fonts", "Browser history, bookmarks, and saved passwords"], 0,
    "Configuration enforcement checks each device at connection. Non-compliant systems are quarantined on a private VLAN with limited access, then rechecked after fixes."],
  ["In security monitoring, what's the difference between sensors and collectors?",
    ["Sensors generate data (IPS, logs); collectors aggregate it (SIEM, syslog)", "Collectors generate data (IPS, logs); sensors aggregate it (SIEM, syslog)", "Sensors are physical motion detectors; collectors are guard stations", "Sensors block attacks inline; collectors alert on them passively"], 0,
    "Many SIEMs include a correlation engine to compare data from diverse sensors."],
  ["Why should decommissioning be a formal policy?",
    ["So devices holding data aren't discarded where someone finds them", "So devices can be resold quickly with their software intact", "So asset tags can be reused on replacement hardware", "So the vendor's warranty transfers to the next owner"], 0,
    "Decommissioning mostly concerns hard drives, SSDs, and USB drives. Devices can be sanitized and reused, or destroyed."],
]);

QS("2.5", "Hardening Techniques", [
  ["How does EDR respond to a detected threat?",
    ["It isolates the system, quarantines the threat, and rolls back, often automatically", "It emails the user and waits for them to run a manual scan", "It reimages the operating system and deletes the user's data", "It blocks the whole subnet until a technician investigates"], 0,
    "EDR uses behavioral analysis, machine learning, and process monitoring (not just signatures) via a lightweight agent, and supports root cause analysis."],
  ["How does a host-based intrusion prevention system (HIPS) identify attacks?",
    ["Signatures, heuristics, and behavior", "File names and extensions only", "Port numbers and protocols only", "User reports and help desk tickets"], 0,
    "HIPS watches for buffer overflows, registry changes, writes to the Windows folder, and access to non-encrypted data. It's often built into endpoint protection software."],
  ["Which tool should be used to verify which ports are actually open on a hardened server?",
    ["Nmap or similar port scanner", "Wireshark packet capture", "netstat on the local host", "The firewall's rule list"], 0,
    "Close everything except required ports, watch for apps that open broad port ranges, and keep monitoring."],
  ["Besides changing default passwords on management interfaces, what further hardening is recommended?",
    ["Require additional logon or third-party authentication", "Move the interface to a nonstandard port number", "Disable logging on the interface to hide it", "Share admin credentials only with trusted vendors"], 0,
    "Management and maintenance interfaces can expose sensitive data, so layer extra authentication on them."],
  ["Why is removing unnecessary software considered 'an easy fix'?",
    ["All software has bugs, and each app adds its own patching process", "Unused software slows boot times and fills disk space", "Unused software can't be exploited, so removal is cosmetic", "Removing software automatically updates the remaining apps"], 0,
    "Every app is attack surface and a patching burden. Removing unused software reduces risk immediately."],
]);
