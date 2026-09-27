# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                 # only needed for validation (ajv)
npm run validate            # tools/validate-commands.js — schema + id/filename + duplicate-id + category checks
npm run build               # both build scripts — regenerates everything under site/ listed below
npm run build:pages         # tools/build-pages.js — SEO pages, sitemap and llms*.txt only (needs site/js/commands.js current)
npm run serve               # http.server on site/ at :8000 — site/index.html also works over file://
scripts/verify-syntax.sh [nxc|certipy|bloodyAD|impacket]  # diff long flags in command JSON against live --help in Docker
```

There is no test suite, no linter, and no bundler. `npm run validate` is the gate — it is what CI runs on every PR, and it exits non-zero with a per-file error list. To check a single command, run the full validator and grep for the filename; it is fast (285 files).

## Layout

Three top-level concerns, deliberately separated:

- **`site/`** — the published root, and the only thing GitHub Pages serves. Every URL is relative to it, so `site/index.html` is `/` and `site/c/<id>/index.html` is `/c/<id>/`. Moving a file in or out of `site/` changes whether it is public.
- **`commands/`, `schema/`** — the source data and its contract.
- **`tools/`** — the build and validation scripts. `scripts/` holds the Docker-based syntax drift checker.

Deployment is the GitHub Actions Pages flow (`upload-pages-artifact` + `deploy-pages`), **not** branch publishing — which is what allows the published directory to be `site/` rather than the repo root or `docs/`, the only two names branch publishing accepts. Consequence: every push to `main` must run the workflow, since nothing is served straight from the branch any more.

Most of what the build writes into `site/` is gitignored and exists only in the deploy artifact: `site/c/`, `site/category/`, `site/sitemap.xml`, `site/llms.txt`, `site/llms-full.txt`. The one generated file that stays tracked is `site/js/commands.js`, so a fresh clone can open `site/index.html` straight from disk.

## Architecture

Static single-page app, no backend, no framework, no build step at serve time.

**Data pipeline.** `commands/<category>/<subcategory>/<id>.json` → `tools/build-commands.js` → `site/js/commands.js` (committed, auto-generated, **never edit by hand**). The build walks exactly two directory levels: level 1 is the category, level 2 the subcategory, and those are injected into each command object — they are *not* stored in the JSON files. Deeper nesting is silently ignored by the build and rejected by the validator. `commands/_categories.json` is the registry both the validator and the UI read; a new directory without a matching entry there fails validation. `commands/_links.json` is a separate `id → [related ids]` map that drives the workflow-chaining UI.

`site/js/commands.js` defines two globals, `COMMAND_DATA` (`{ categories, commands }`) and `COMMAND_LINKS`. `site/index.html` loads it before `site/js/app.js`; `site/command-editor.html` also loads it so the editor's category dropdowns work offline.

**Static SEO pages.** `tools/build-pages.js` reads the built bundle via `require('../site/js/commands.js')` and writes everything relative to `site/` (`SITE_DIR`), emitting `c/<id>/index.html` (one crawlable page per command), `category/index.html`, `category/<cat>/index.html`, `category/<cat>/<sub>/index.html`, `sitemap.xml`, `llms.txt` and `llms-full.txt`. It wipes `c/` and `category/` first, so a renamed id never leaves a stale page. Everything it writes is generated output — **never edit by hand**. The page titles and meta descriptions are de-duplicated at build time (`pageTitle`/`pageDescription`), because two commands currently share a name and two share a description.

Command pages are directories, not flat files: GitHub Pages serves `/c/foo` for `/c/foo.html` at 200 with no redirect (a duplicate URL twin) but 301s `/c/foo` → `/c/foo/`, so a directory has exactly one canonical form. Canonical, `og:url` and sitemap `<loc>` are all `https://commandmgr.com/c/<id>/`. That puts command pages 2 levels deep — `layout()` and `breadcrumbHtml()` take a `depth` and prefix `../` accordingly (`CMD_DEPTH = 2`; category hubs are 1/2/3).

These pages load no JS. `site/css/page.css` is read at build time, comment-stripped, whitespace-collapsed and inlined into every `<head>` as a `<style>` block — it was the only render-blocking request. The file stays on disk as the single source of truth because `site/404.html`, which this script does not generate, still links it externally. Every page also carries the sitewide category tree (`categoryTreeHtml()`) in its footer: ~45 links, which is what takes a page from ~10 internal links to ~60.

Sitemap `<lastmod>` comes from one `git log --name-only` pass over `commands/`, so CI checks out with `fetch-depth: 0`. The same date is shown on each command page as a visible `<time>` next to the byline. `<priority>`/`<changefreq>` are deliberately absent — Google ignores both.

`llms.txt` (llmstxt.org index) and `llms-full.txt` (the whole corpus as one Markdown file) are for retrieval clients. There are deliberately **no** per-command `.md` twins: they would be crawlable duplicates of the HTML pages and GitHub Pages cannot serve a `noindex` header for them. Neither file appears in `sitemap.xml`. `site/<key>.txt` is the IndexNow key referenced by the workflow; the key is public by design.

The crawlable homepage copy lives in the `.empty-state` block in `site/index.html` **and** in `renderCommandBuilder()`'s no-selection branch in `site/js/app.js` — the JS copy overwrites the static one once the app renders, so the two must stay in sync.

**Who builds and deploys.** `.github/workflows/deploy.yml` validates on every PR. On push to `main` it runs both build scripts, uploads `site/` as the Pages artifact and deploys it, then refreshes the tracked `site/js/commands.js` with `chore: rebuild site/js/commands.js [skip ci]` — in that order, so a push race can never block a deploy. So a PR touching only `commands/` does not need a rebuilt bundle, but running `npm run build` locally is harmless and lets you test the change in the browser. Never commit a hand-edited `site/js/commands.js`. Last, the workflow POSTs the command URLs changed in that push to IndexNow (Bing, which feeds Copilot; Google does not participate) — best effort, `continue-on-error: true`, and a no-op when no command JSON changed.

**Front end.** `site/js/app.js` is one ~2700-line `CommandManager` class instantiated on load; all state lives on the instance and all persistence goes through `localStorage`. There is no virtual DOM — methods render HTML strings into containers and re-bind listeners afterwards, so any render method that emits interactive markup has a matching `setup*EventListeners` call. Static buttons use `data-action="..."` dispatched through the `handleAction` switch; dynamically rendered ones get listeners attached in the paired setup method.

**Profiles and storage.** Every per-user key is namespaced through `_storageKey(suffix)` → `command-manager-<profileId>-<suffix>`. The only unnamespaced key is `command-manager-profiles` (profile list + `activeProfileId`). Switching profiles calls `reloadProfileData()`, which resets state and re-renders *without* re-binding listeners. `_migrateOldData()` moves pre-profile keys into the default profile on first run — keep it working when touching storage.

**Placeholders.** Commands use `<placeholder>` tokens. `getListTypeForPlaceholder()` maps a token name to a saved list (`ip`/`ips`, `user`/`username`→`users`, `password`/`pass`, `domain`, `hash`, `wordlist`, `port`), falling back to fuzzy matching against user-defined asset types. Reusing these names in a new command is what makes the target-context bar and the autocomplete dropdown pre-fill it; a novel placeholder name gets a plain text field.

**Search.** `calculateSearchScore()` is a hand-rolled weighted scorer over name (100/50 exact/partial, 25 subsequence-fuzzy), description (30), tags (20/8), id (15), command body (10), with a −50 penalty per non-matching word. Multi-word queries are ANDed by that penalty rather than by filtering.

**Deep links.** `location.hash` is a command id; `handleInitialHash()` selects it on load and on `hashchange`.

## Adding or editing commands

`CONTRIBUTING.md` is the source of truth; the schema is `schema/command.schema.json` (`additionalProperties: false` — an unknown key is an error). Non-obvious constraints:

- Filename without `.json` must equal `id`, and `id` must be globally unique.
- Do not put `category`/`subcategory` in the file; the directory supplies them.
- Same attack with a different credential type belongs in `variations` (`label` + `command`, optional `requires`), not a second file.
- `requires` and `protocols` are closed enums in the schema — extend the schema in the same PR if a new value is genuinely needed.
- `command-editor.html` is a standalone browser form that emits conformant JSON; it is the intended authoring path.
- Project targets a Linux attacker workstation; Windows-side commands are allowed but must carry `"platform": "windows"`.
