/* Network Foundations (bonus warm-up) — networking knowledge Security+ assumes you have. Original questions. */

QB("N.1", "Ports & Protocols", [
  ["Which port does SSH use?", ["TCP 22", "TCP 23", "TCP 21", "UDP 53"], 0, "SSH is TCP 22. Telnet is 23, FTP control is 21, and DNS is 53 (UDP for most queries, TCP for zone transfers and large responses)."],
  ["Which port is used by HTTPS?", ["TCP 443", "TCP 80", "TCP 8080", "TCP 3389"], 0, "HTTPS uses TCP 443. HTTP uses 80, 8080 is a common alternate HTTP port, and RDP uses 3389."],
  ["Which protocol and port is used for Remote Desktop Protocol?", ["TCP 3389", "TCP 445", "TCP 25", "UDP 161"], 0, "RDP uses TCP 3389. Exposing RDP to the internet is a common ransomware entry point, so put it behind a VPN or gateway with MFA."],
  ["Which port does DNS primarily use for queries?", ["UDP 53", "TCP 443", "UDP 67", "TCP 110"], 0, "DNS queries use UDP 53 (TCP 53 for zone transfers and large responses). DHCP uses UDP 67/68, and POP3 uses TCP 110."],
  ["SMB file sharing on Windows uses which port?", ["TCP 445", "TCP 389", "TCP 143", "TCP 22"], 0, "SMB uses TCP 445. Block it at the internet edge, since worms like WannaCry spread over SMB."],
  ["Which port is used by SMTP for sending email between servers?", ["TCP 25", "TCP 110", "TCP 143", "TCP 993"], 0, "SMTP uses TCP 25 (587 is submission with STARTTLS). POP3 is 110, IMAP is 143, and IMAPS is 993."],
  ["Which protocol uses UDP 161 for polling network devices?", ["SNMP", "Syslog", "NTP", "TFTP"], 0, "SNMP uses UDP 161 for queries and UDP 162 for traps. Syslog is UDP 514, NTP is UDP 123, and TFTP is UDP 69."],
  ["Which protocol, using UDP 123, synchronizes clocks across devices, which is critical for accurate log timestamps?", ["NTP", "SNMP", "LDAP", "SIP"], 0, "NTP keeps time in sync. Without consistent time, correlating logs during an investigation is very difficult. Kerberos also depends on accurate time."],
  ["Which port does LDAP use by default (unencrypted)?", ["TCP 389", "TCP 636", "TCP 88", "TCP 1812"], 0, "LDAP is 389, LDAPS is 636, Kerberos is 88, and RADIUS authentication is UDP 1812."],
  ["What is the main difference between TCP and UDP?", ["TCP is connection-oriented with guaranteed delivery; UDP is connectionless", "UDP encrypts all traffic by default, while TCP sends data in clear text", "TCP is used only for DNS lookups, while UDP carries all web traffic", "UDP uses a three-way handshake, while TCP sends without any setup"], 0, "TCP sets up a connection (SYN, SYN/ACK, ACK) and retransmits lost data. UDP is faster with no handshake or delivery guarantee, which suits streaming, VoIP, and DNS."],
]);

QB("N.2", "OSI Model, Switching & Routing", [
  ["At which OSI layer do routers operate, making decisions based on IP addresses?", ["Layer 3 – Network", "Layer 2 – Data Link", "Layer 4 – Transport", "Layer 7 – Application"], 0, "Routers forward packets using IP addresses at Layer 3. Switches use MAC addresses at Layer 2."],
  ["MAC addresses are used at which OSI layer?", ["Layer 2 – Data Link", "Layer 3 – Network", "Layer 1 – Physical", "Layer 5 – Session"], 0, "The data link layer handles frames and MAC addresses. Switches build MAC address tables to forward frames."],
  ["TCP and UDP port numbers belong to which OSI layer?", ["Layer 4 – Transport", "Layer 3 – Network", "Layer 6 – Presentation", "Layer 2 – Data Link"], 0, "The transport layer handles end-to-end delivery and ports. Mnemonic for Layers 1 through 7: Please Do Not Throw Sausage Pizza Away."],
  ["Which technology divides one physical switch into multiple separate broadcast domains?", ["VLANs", "NAT", "DHCP", "STP"], 0, "VLANs logically separate networks on the same switch hardware. Traffic between VLANs must go through a router or Layer 3 switch, where it can be filtered."],
  ["Which protocol prevents switching loops in a network with redundant links?", ["Spanning Tree Protocol (STP)", "Address Resolution Protocol (ARP)", "Open Shortest Path First (OSPF)", "Network Address Translation (NAT)"], 0, "STP blocks redundant paths to stop broadcast storms and loops, and re-enables them if the primary link fails. BPDU Guard protects STP from rogue switches."],
  ["Which protocol maps an IP address to a MAC address on a local network, and can be abused for on-path attacks?", ["ARP", "DNS", "DHCP", "ICMP"], 0, "ARP resolves IP to MAC. ARP poisoning sends fake replies so traffic goes to the attacker. Dynamic ARP Inspection helps prevent it."],
  ["Which feature translates private internal IP addresses to a public IP address for internet access?", ["NAT", "VLAN", "STP", "QoS"], 0, "Network Address Translation lets many private addresses share public IPs. PAT (port address translation) maps many hosts to one IP using ports."],
  ["An attacker sends traffic tagged for a different VLAN to reach networks they shouldn't access. This is:", ["VLAN hopping", "ARP spoofing", "MAC flooding", "DNS poisoning"], 0, "VLAN hopping (switch spoofing or double tagging) escapes VLAN isolation. Disable auto-trunking and don't use the native VLAN for user traffic."],
  ["Flooding a switch with fake MAC addresses so it starts broadcasting all frames like a hub is called:", ["MAC flooding", "VLAN hopping", "DHCP starvation", "Smurf attack"], 0, "When the MAC table fills up, the switch floods frames out all ports, letting an attacker sniff traffic. Port security limits MACs per port."],
]);

QB("N.3", "IP Addressing & Subnetting", [
  ["Which is a private IPv4 address range (RFC 1918)?", ["192.168.0.0/16", "8.8.8.0/24", "172.32.0.0/16", "11.0.0.0/8"], 0, "Private ranges are 10.0.0.0/8, 172.16.0.0/12 (172.16 to 172.31), and 192.168.0.0/16. They aren't routed on the internet."],
  ["How many usable host addresses are in a /24 IPv4 subnet?", ["254", "256", "255", "128"], 0, "A /24 leaves 8 host bits: 2^8 = 256 addresses, minus the network and broadcast addresses = 254 usable."],
  ["What subnet mask corresponds to /26?", ["255.255.255.192", "255.255.255.128", "255.255.255.224", "255.255.255.0"], 0, "/26 means 26 network bits, so the last octet has 2 network bits: 128 + 64 = 192. That gives 64 addresses per subnet (62 usable)."],
  ["A host has an IP address of 169.254.10.5. What does this MOST likely indicate?", ["It couldn't reach a DHCP server (APIPA)", "It was assigned a public IP by the ISP", "It's using an IPv6 link-local address", "It's configured as the default gateway"], 0, "169.254.x.x is an APIPA/link-local address that Windows assigns itself when DHCP fails."],
  ["How many bits long is an IPv6 address?", ["128", "32", "64", "48"], 0, "IPv6 addresses are 128 bits, written as 8 groups of 4 hex digits. IPv4 addresses are 32 bits, and MAC addresses are 48 bits."],
  ["What is the loopback address in IPv4?", ["127.0.0.1", "0.0.0.0", "255.255.255.255", "10.0.0.1"], 0, "127.0.0.1 refers to the local host itself. The IPv6 loopback is ::1."],
  ["Which /CIDR notation gives exactly 2 usable host addresses, often used for point-to-point links?", ["/30", "/24", "/29", "/32"], 0, "/30 has 4 addresses, minus network and broadcast = 2 usable hosts. /31 can also be used on point-to-point links."],
]);

QB("N.4", "Wireless & Cellular", [
  ["Which wireless standard is also known as Wi-Fi 6?", ["802.11ax", "802.11ac", "802.11n", "802.11g"], 0, "802.11ax = Wi-Fi 6/6E, 802.11ac = Wi-Fi 5, and 802.11n = Wi-Fi 4."],
  ["Which wireless encryption protocol is outdated and can be cracked in minutes?", ["WEP", "WPA3", "WPA2 with AES", "802.1X"], 0, "WEP has fundamental flaws in how it uses RC4 and IVs. Never use it. WPA2-AES is the minimum, and WPA3 is preferred."],
  ["Which encryption does WPA2 use for strong security?", ["AES with CCMP", "RC4 with TKIP", "DES", "MD5"], 0, "WPA2 uses AES-CCMP. TKIP/RC4 was a transitional WPA design and is deprecated. WPA3 uses GCMP in its enterprise 192-bit mode."],
  ["An unauthorized access point plugged into the corporate network by an employee is a:", ["Rogue access point", "Evil twin", "Captive portal", "Wireless controller"], 0, "A rogue AP is unauthorized and creates a backdoor into the network. An evil twin specifically imitates a legitimate SSID. Wireless IDS and NAC help detect both."],
  ["Which short-range technology is used for tap-to-pay and can be relayed or skimmed at close distances?", ["NFC", "Bluetooth Class 1", "LTE", "802.11ac"], 0, "Near-field communication works within a few centimeters. It's convenient for payments and access but still vulnerable to relay attacks and eavesdropping."],
]);

QB("N.5", "DNS, DHCP & Network Services", [
  ["Which DNS record maps a hostname to an IPv4 address?", ["A record", "AAAA record", "MX record", "PTR record"], 0, "A maps to IPv4, and AAAA maps to IPv6. MX identifies mail servers, and PTR does reverse lookups (IP to name)."],
  ["Which DNS record type identifies a domain's mail servers?", ["MX", "CNAME", "TXT", "NS"], 0, "MX records point to mail servers. TXT records hold text data like SPF, DKIM, and DMARC policies. CNAME creates an alias."],
  ["Which DNS record type stores SPF and DMARC email security policies?", ["TXT", "A", "PTR", "SRV"], 0, "TXT records hold arbitrary text and are used for SPF, DKIM public keys, DMARC, and domain verification."],
  ["Which extension adds digital signatures to DNS records so resolvers can verify they weren't tampered with?", ["DNSSEC", "DHCP snooping", "DoH only", "NAT"], 0, "DNSSEC signs DNS data to prevent spoofing and cache poisoning. DNS over HTTPS (DoH) encrypts queries for privacy but doesn't validate record authenticity."],
  ["An attacker sets up a fake DHCP server that hands out their own IP as the default gateway. Which switch feature prevents this?", ["DHCP snooping", "Port mirroring", "STP", "PoE"], 0, "DHCP snooping only allows DHCP server responses from trusted ports, which blocks rogue DHCP servers used for on-path attacks."],
  ["An attacker requests every available DHCP address using spoofed MACs so legitimate clients can't get one. This is:", ["DHCP starvation", "DNS poisoning", "ARP poisoning", "VLAN hopping"], 0, "DHCP starvation exhausts the address pool (a DoS). It's often followed by a rogue DHCP server. Port security and DHCP snooping help."],
]);

QB("N.6", "Infrastructure, Devices & Cloud", [
  ["Which device forwards traffic between different networks based on IP addresses?", ["Router", "Hub", "Switch (Layer 2)", "Repeater"], 0, "Routers connect networks at Layer 3. Hubs repeat to all ports (Layer 1), and Layer 2 switches forward by MAC address."],
  ["Which connectivity option creates an encrypted tunnel for remote users across the internet?", ["VPN", "VLAN", "NAT", "PoE"], 0, "A VPN encrypts traffic over untrusted networks. Common VPN protocols are IPsec and SSL/TLS."],
  ["Which device provides power to IP phones and cameras over the Ethernet cable?", ["PoE switch", "Load balancer", "Proxy server", "Modem"], 0, "Power over Ethernet (802.3af/at/bt) delivers power and data on one cable."],
  ["Which cable type is immune to electromagnetic interference and hard to tap?", ["Fiber optic", "Unshielded twisted pair", "Coaxial", "Shielded twisted pair"], 0, "Fiber carries light, not electricity, so it's immune to EMI and very difficult to tap without detection."],
  ["Which network topology connects every device to a central switch?", ["Star", "Bus", "Ring", "Full mesh"], 0, "Star is the most common LAN topology. If the central device fails, though, everything connected to it loses connectivity."],
  ["Which storage technology provides a dedicated, high-speed network of block-level storage for servers?", ["SAN", "NAS", "USB drive", "Tape"], 0, "A SAN (storage area network) presents block storage to servers. A NAS shares files over the network (SMB/NFS)."],
]);

QB("N.7", "Troubleshooting & Tools", [
  ["Which command shows the path packets take to a destination, listing each router hop?", ["tracert / traceroute", "ipconfig / ifconfig", "nslookup / dig", "netstat / ss"], 0, "tracert (Windows) and traceroute (Linux/macOS) show each hop, which helps find where traffic fails or slows."],
  ["Which command displays active network connections and listening ports on a host?", ["netstat", "ping", "arp -a", "tracert"], 0, "netstat (or ss on Linux) shows connections and listening ports, which helps spot unexpected services or connections to suspicious IPs."],
  ["Which tool queries DNS servers to look up records for a domain?", ["nslookup / dig", "ping / pathping", "netstat / ss", "route / ip route"], 0, "nslookup and dig query DNS, which is useful for verifying records and investigating suspicious domains."],
  ["Which tool captures and analyzes network packets in a graphical interface?", ["Wireshark", "Nmap", "Netcat", "Ping"], 0, "Wireshark captures and decodes packets for deep analysis. tcpdump is the command-line equivalent."],
  ["Which tool scans a network to discover hosts, open ports, and running services?", ["Nmap", "Wireshark", "Ipconfig", "Tracert"], 0, "Nmap is the classic port and service scanner, used by both defenders and attackers for reconnaissance."],
  ["What is the FIRST step of the CompTIA troubleshooting methodology?", ["Identify the problem", "Implement the solution", "Document findings", "Establish a theory"], 0, "The steps: identify the problem, establish a theory, test the theory, establish a plan, implement, verify functionality, then document findings."],
  ["Which command shows a Windows computer's IP address, subnet mask, and default gateway?", ["ipconfig", "ifconfig on Windows", "netstat -r only", "dig"], 0, "ipconfig (add /all for details like DNS and MAC) on Windows. Linux uses ip addr or ifconfig."],
]);
