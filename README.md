# Command-Manager

A searchable, copy-pasteable library of pentesting commands focused on Active Directory. Runs entirely in your browser. No install, no backend, no telemetry.


https://github.com/user-attachments/assets/a32179d3-e898-4860-81ec-8f4b297cfef5


## What it is

Command-Manager is a single-page web app that wraps a curated database of pentesting commands. Each command carries its description, the auth methods it supports (password / NTLM hash / Kerberos ticket), usage examples, and links to upstream documentation. You search, you fill in the placeholders for your target, you copy, you paste into your shell.

The database lives as plain JSON files under `commands/`, organized by category and subcategory. A small Node script bundles them into `js/commands.js`, which the front-end loads. That's the whole architecture.

## Why

During an engagement you do not want to dig through five different note files to remember the exact `impacket-getST` invocation for an RBCD chain, or which `nxc smb` flag dumps SAM via the right method. This is the reference you keep open in a second tab so the syntax is one search away — with the auth-method variants already laid out side by side.

## Coverage

284 commands across 7 categories, drawn from tools the community already trusts (NetExec, Impacket, BloodHound, bloodyAD, Certipy, Coercer, Rubeus, mimikatz, hashcat, and more).

| Category | Commands |
|---|---:|
| Credential Attacks (hash dumping, kerberoasting, AS-REP roasting, NTLM relay, ADCS, ticket forgery, gMSA/LAPS) | 110 |
| Enumeration (network, SMB, LDAP, Kerberos, DNS, WinRM, MSSQL, SSH, FTP, NFS, BloodHound Cypher) | 80 |
| Privilege Escalation (ACL abuse, delegation, GPO, trust attacks) | 33 |
| Post-Exploitation (AD object manipulation, persistence, data collection) | 25 |
| Lateral Movement (remote shells, MSSQL, pass-the-hash, RDP/SSH) | 20 |
| Authentication (credential testing across SMB/WinRM/RDP/SSH/FTP, brute force, spraying) | 9 |
| Utilities (file transfer, network setup, shell helpers) | 7 |

The library is actively growing. See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to add the commands you reach for daily.

## Use it

```bash
git clone https://github.com/<your-fork>/Command-Manager.git
cd Command-Manager
# open index.html directly in your browser, or:
python3 -m http.server 8000
```

That is the entire setup. There is nothing to build before running it — `js/commands.js` is committed.

## Features

- Weighted search across name, description, tags, and command body
- Filter by platform, required access level, and protocol
- Per-command auth-method variations (password / hash / ticket / AES key) shown inline
- Placeholder substitution with a target context bar (IP, user, domain, etc.) that pre-fills every command
- Saved lists for IPs, users, passwords, and custom asset types — pick from a dropdown instead of retyping
- Engagement profiles so contexts and favorites stay separated between clients
- Bulk import / export of lists
- Workflow links between related commands (e.g. `secretsdump` → `hashcat` → `evil-winrm`)
- Favorites and a custom-command modal for the one-offs you want to save without forking

## Adding a command

Open `command-editor.html` in your browser, fill in the form, save the generated JSON to `commands/<category>/<subcategory>/<id>.json`, run `node validate-commands.js` locally, and open a PR. CI revalidates and rebuilds the bundle on merge.

Full instructions, schema reference, and examples are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Commands have been collected and refined from a number of excellent public resources. If your daily workflow benefits from this project, the people who wrote these deserve a star too:

- [The Hacker Recipes](https://www.thehacker.recipes/) — Charlie Bromberg & contributors
- [NetExec](https://www.netexec.wiki/) — the NetExec maintainers
- [Impacket](https://github.com/fortra/impacket) — Fortra
- [BloodHound](https://github.com/SpecterOps/BloodHound) and [bloodyAD](https://github.com/CravateRouge/bloodyAD)
- [Certipy](https://github.com/ly4k/Certipy) — Oliver Lyak
- [HackTricks](https://book.hacktricks.xyz/) — Carlos Polop & contributors

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

This project is intended for authorized security testing, training, and research only. You are responsible for complying with all applicable laws and for having explicit permission before running any of these commands against systems you do not own.
