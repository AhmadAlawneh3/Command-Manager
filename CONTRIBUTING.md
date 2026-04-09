# Contributing

Thanks for considering a contribution. The library grows by people adding the commands they actually use, so even a single PR with one well-formed command is welcome.

## The 3-step flow

1. **Draft the command in the editor.** Open `command-editor.html` in any browser. Fill in the form: id, name, category, subcategory, platform, the command template, a short description, examples, and any auth-method variations. Click *Generate JavaScript* to preview, then copy the JSON.
2. **Save it as a file.** Place it at `commands/<category>/<subcategory>/<id>.json`. The filename (without `.json`) must match the `id` field.
3. **Validate, then open a PR.**
   ```bash
   npm install
   npm run validate
   ```
   If validation passes, push and open a PR. CI will revalidate; on merge to `main` the bundle (`js/commands.js`) is rebuilt automatically.

## Schema

Every command file is validated against [`schema/command.schema.json`](schema/command.schema.json).

| Field | Required | Type | Notes |
|---|---|---|---|
| `id` | yes | string | Unique, kebab-case, must match the filename |
| `name` | yes | string | Display name |
| `command` | yes | string | Use `<PLACEHOLDER>` for substitutable values |
| `description` | yes | string | One or two sentences |
| `platform` | yes | enum | `linux`, `windows`, or `cross-platform` |
| `requires` | no | array | Subset of `no-creds`, `password`, `hash`, `ticket`, `aes-key`, `shell`, `local-admin` |
| `protocols` | no | array | Subset of `smb`, `ldap`, `kerberos`, `winrm`, `rdp`, `rpc`, `mssql`, `ftp`, `ssh`, `http`, `dns`, `wmi`, `nfs`, `vnc`, `ntlm` |
| `tags` | no | array | Free-form keywords for search |
| `references` | no | array | `[{ "title": "...", "url": "..." }]` |
| `examples` | no | array | Real, paste-ready usage strings |
| `variations` | no | array | Same command with a different auth method — see below |

### Variations

A `variation` is the same attack run with a different credential type. Use it instead of creating a second command file when the only thing that changes is `-H <hash>` vs. `-k -no-pass` etc.

```json
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
]
```

## Categories and subcategories

The category and subcategory of a command are determined by the directory it lives in. Both must already exist in [`commands/_categories.json`](commands/_categories.json) — if you need a new one, add it there in the same PR and explain why in the description.

## Style guidelines

- **One command per file.** Use `variations` for auth-method variants of the same attack, not separate files.
- **Use placeholders consistently.** `<ip>`, `<user>`, `<password>`, `<hash>`, `<domain>`, `<dc-ip>`, `<file>`. Prefer existing placeholder names where they make sense so the target context bar can auto-fill them.
- **Examples should be pasteable.** Use realistic-looking values (`CORP/administrator:Password123!@10.10.10.10`), not `<example>`.
- **Reference your sources.** If a command came from a tool's official docs, The Hacker Recipes, HackTricks, etc., add a `references` entry. It helps future readers verify and learn.
- **Test before you submit.** Run the command in a lab against a target you control. Don't submit something you've only seen in a blog post.
- **No Windows-only PowerShell tooling.** This project targets a Linux-based attacker workstation. Windows-side commands are welcome when they're meant to be executed on a compromised host (e.g. from a beacon), but flag them with `"platform": "windows"`.

## PR checklist

- [ ] `npm run validate` passes locally
- [ ] Filename matches `id`
- [ ] Category and subcategory exist in `commands/_categories.json`
- [ ] At least one realistic example
- [ ] Reference link if the command is non-obvious or copied from a known source
- [ ] Tested in a lab

## Keeping commands fresh

Tools rename flags, deprecate modules, and ship new ones. When adding or auditing a command, use this 5-step workflow to stay anchored to upstream truth instead of cached blog posts:

1. **Read the official docs first.** NetExec → [netexec.wiki](https://www.netexec.wiki), Certipy → repo wiki, bloodyAD → repo wiki, Impacket → `--help`. Copy flag names verbatim.
2. **Pull `--help` from a fresh container.** `docker run --rm ghcr.io/pennyw0rth/netexec:latest nxc smb --help` is faster than installing the tool and guarantees you're seeing the latest released flags.
3. **Track upstream releases.** Watch the GitHub release feeds for nxc, Certipy, Impacket, bloodyAD. Each minor release is a chance for drift — skim the changelog when adding related commands.
4. **Run the verification harness.** `scripts/verify-syntax.sh [tool]` greps every long flag in the matching command JSON files against the live `--help` output and reports drift. Run it before opening a PR that touches multiple files for one tool.
5. **Cite the source in `references`.** A link to the upstream wiki / release notes / commit is the audit trail — it lets the next contributor verify the command in 30 seconds instead of guessing.

If a command in the repo turns out to be stale, fixing it counts as a contribution — open a PR with the corrected JSON and a reference link to the upstream change.

## Reporting bugs / suggesting features

Open a GitHub issue. For UI bugs, please include browser, OS, and a screenshot if you can.
