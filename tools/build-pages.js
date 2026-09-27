#!/usr/bin/env node
// Build script: generates crawlable static HTML pages + sitemap.xml from the
// command bundle. Run after build-commands.js.
// Usage: node tools/build-pages.js
//
// Output (all auto-generated, all gitignored — the Pages workflow builds them
// at deploy time). Paths are relative to site/, the published root:
//   c/<id>/index.html                  one page per command
//   category/index.html                all categories
//   category/<cat>/index.html          one page per category
//   category/<cat>/<sub>/index.html    one page per subcategory
//   sitemap.xml
//   llms.txt                           llmstxt.org index of every command
//   llms-full.txt                      the whole corpus as one Markdown file

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'site');
const SITE = 'https://commandmgr.com';
const { COMMAND_DATA, COMMAND_LINKS } = require('../site/js/commands.js');

const { categories, commands } = COMMAND_DATA;

// ---------------------------------------------------------------- helpers

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Category display names carry a leading emoji; titles and headings want it gone.
function plainName(name) {
  return String(name).replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function truncate(s, n) {
  const t = String(s).replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
}

function catName(cat) {
  return categories[cat] ? plainName(categories[cat].name) : cat;
}

function subName(cat, sub) {
  const c = categories[cat];
  return (c && c.subcategories && c.subcategories[sub]) || sub;
}

const REQUIRES_LABEL = {
  'no-creds': 'no credentials',
  password: 'password',
  hash: 'NTLM hash',
  ticket: 'Kerberos ticket',
  'aes-key': 'AES key',
  shell: 'shell access',
  'local-admin': 'local admin',
};

// First token of the command line, minus any path — "impacket-getST", "nxc".
function toolOf(cmd) {
  const first = String(cmd).trim().split(/\s+/)[0] || '';
  return first.split(/[\\/]/).pop();
}

// Title/description are computed up front so collisions between two commands
// can be resolved deterministically — duplicate <title> or <meta description>
// across pages is a real SEO cost, and the command data does contain a few
// same-named entries.
function baseTitle(cmd) {
  const sName = subName(cmd.category, cmd.subcategory);
  const withSub = `${cmd.name} — ${sName}`;
  return `${withSub.length <= 44 ? withSub : cmd.name} | Command Manager`;
}

function baseDescription(cmd) {
  let d = truncate(cmd.description, 158);
  const labels = (cmd.variations || []).map((v) => v.label);
  if (d.length < 105 && labels.length) {
    d = truncate(`${d} Variants: ${labels.join(', ')}.`, 158);
  }
  return d;
}

function countBy(fn) {
  const m = new Map();
  for (const c of commands) m.set(fn(c), (m.get(fn(c)) || 0) + 1);
  return m;
}

const TITLE_COUNTS = countBy(baseTitle);
const DESC_COUNTS = countBy(baseDescription);

function pageTitle(cmd) {
  const t = baseTitle(cmd);
  if (TITLE_COUNTS.get(t) === 1) return t;
  return `${cmd.name} — ${cmd.id} | Command Manager`;
}

function pageDescription(cmd) {
  const d = baseDescription(cmd);
  if (DESC_COUNTS.get(d) === 1) return d;
  return truncate(`${d} Uses ${toolOf(cmd.command)}.`, 170);
}

// Command pages are directories, not flat .html files: GitHub Pages serves
// /c/foo for /c/foo.html at 200 with no redirect, which is a duplicate URL twin,
// while it 301s /c/foo to /c/foo/. A directory therefore has exactly one
// canonical form. Depth is 2 for command pages as a consequence.
const cmdUrl = (id) => `/c/${id}/`;
const catUrl = (cat) => `/category/${cat}/`;
const subUrl = (cat, sub) => `/category/${cat}/${sub}/`;
const CMD_DEPTH = 2;

// ------------------------------------------------------- git lastmod dates

// One git pass over commands/ builds a path -> newest-commit-date map, so we
// can emit honest <lastmod> values without spawning git 288 times.
function gitDates() {
  const map = new Map();
  try {
    const out = execFileSync(
      'git',
      ['log', '--pretty=format:@%cI', '--name-only', '--', 'commands'],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
    let date = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) date = line.slice(1);
      else if (line && date && !map.has(line)) map.set(line, date);
    }
  } catch (e) {
    console.warn('build-pages: git log unavailable, falling back to mtime');
  }
  return map;
}

const DATES = gitDates();
const TODAY = new Date().toISOString();

function lastmodFor(cmd) {
  const rel = `commands/${cmd.category}/${cmd.subcategory}/${cmd.id}.json`;
  if (DATES.has(rel)) return DATES.get(rel);
  try {
    return fs.statSync(path.join(ROOT, rel)).mtime.toISOString();
  } catch {
    return TODAY;
  }
}

const day = (iso) => String(iso).slice(0, 10);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// Human-readable twin of day() for the visible <time> text. Built by hand rather
// than via toLocaleDateString so the generated pages do not change with the
// locale of whatever machine ran the build.
function prettyDay(iso) {
  const [y, m, d] = day(iso).split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

const AUTHOR = 'Ahmad Alawneh';
const AUTHOR_URL = 'https://github.com/AhmadAlawneh3';
const REPO_URL = 'https://github.com/AhmadAlawneh3/Command-Manager';

// --------------------------------------------------------------- page shell

// css/page.css is the only render-blocking request these pages make, so it is
// inlined into every <head> instead of linked — one fewer round trip on the LCP
// path. The file stays on disk as the single source of truth; 404.html, which
// this script does not generate, still links it externally.
const PAGE_CSS = fs
  .readFileSync(path.join(SITE_DIR, 'css', 'page.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .trim();

// Sitewide category tree, repeated in every page's footer. It takes a page from
// ~10 internal links to ~55 and gives every hub an inbound link from every
// other page. Only categories and subcategories that actually have commands are
// listed, because those are the only ones with a generated page.
function categoryTreeHtml(depth) {
  const up = '../'.repeat(depth) || './';
  const cols = Object.keys(categories)
    .map((cat) => {
      const list = commands.filter((c) => c.category === cat);
      if (!list.length) return '';
      const subs = Object.keys(categories[cat].subcategories || {}).filter((s) =>
        list.some((c) => c.subcategory === s)
      );
      return `<div class="tree-col">
<a class="tree-cat" href="${up}category/${esc(cat)}/">${esc(catName(cat))}</a>
<ul>${subs
        .map(
          (s) =>
            `<li><a href="${up}category/${esc(cat)}/${esc(s)}/">${esc(subName(cat, s))}</a></li>`
        )
        .join('')}</ul>
</div>`;
    })
    .filter(Boolean)
    .join('\n');
  return `<nav class="site-tree" aria-label="All command categories">
<p class="tree-head"><a href="${up}category/">Browse every category</a></p>
<div class="tree-cols">
${cols}
</div>
</nav>`;
}

function layout({ url, title, description, body, jsonld, depth }) {
  const up = '../'.repeat(depth) || './';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:site_name" content="Command Manager">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<link rel="icon" href="${up}favicon.svg">
<style>${PAGE_CSS}</style>
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
</head>
<body>
<header class="site-header">
  <a class="brand" href="${up}">Command&nbsp;Manager</a>
  <nav class="site-nav">
    <a href="${up}category/">Categories</a>
    <a href="${up}">Open the app</a>
    <a href="https://github.com/AhmadAlawneh3/Command-Manager">GitHub</a>
  </nav>
</header>
<main class="page">
${body}
</main>
<footer class="site-footer">
${categoryTreeHtml(depth)}
  <p><a href="${up}">Command Manager</a> is a searchable, copy-pasteable library of
  Active Directory penetration testing commands. It runs entirely in your browser —
  no install, no backend, no telemetry.</p>
  <p>These pages are generated from a hand-curated command database maintained by
  <a href="${AUTHOR_URL}" rel="author noopener">${AUTHOR}</a>: every entry is a
  reviewed JSON file, and both the database and the generator are
  <a href="${REPO_URL}" rel="noopener">open source on GitHub</a>.</p>
  <p>Commands are documented for authorised security testing only.</p>
</footer>
</body>
</html>
`;
}

function breadcrumbHtml(trail, depth) {
  const up = '../'.repeat(depth) || './';
  const parts = trail.map((t, i) =>
    i === trail.length - 1
      ? `<span aria-current="page">${esc(t.name)}</span>`
      : `<a href="${t.url === '/' ? up : up + t.url.replace(/^\//, '')}">${esc(t.name)}</a>`
  );
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts.join('<span class="sep">/</span>')}</nav>`;
}

function breadcrumbLd(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.url}`,
    })),
  };
}

// --------------------------------------------------------- command page

function commandPage(cmd) {
  const url = cmdUrl(cmd.id);
  const up = '../'.repeat(CMD_DEPTH);
  const cName = catName(cmd.category);
  const sName = subName(cmd.category, cmd.subcategory);
  const tool = toolOf(cmd.command);
  const modified = lastmodFor(cmd);

  const trail = [
    { name: 'Home', url: '/' },
    { name: cName, url: catUrl(cmd.category) },
    { name: sName, url: subUrl(cmd.category, cmd.subcategory) },
    { name: cmd.name, url },
  ];

  const title = pageTitle(cmd);
  const description = pageDescription(cmd);

  const facts = [];
  facts.push(['Tool', esc(tool)]);
  facts.push(['Category', `<a href="${up}${catUrl(cmd.category).replace(/^\//, '')}">${esc(cName)}</a> / <a href="${up}${subUrl(cmd.category, cmd.subcategory).replace(/^\//, '')}">${esc(sName)}</a>`]);
  facts.push(['Platform', esc(cmd.platform)]);
  if (cmd.requires && cmd.requires.length) {
    facts.push([
      'Requires',
      esc(cmd.requires.map((r) => REQUIRES_LABEL[r] || r).join(', ')),
    ]);
  }
  if (cmd.protocols && cmd.protocols.length) {
    facts.push(['Protocols', esc(cmd.protocols.join(', ').toUpperCase())]);
  }

  const sections = [];

  sections.push(`<h2 id="syntax">Syntax</h2>
<p>Angle-bracket tokens are placeholders — replace them with your target's values,
or <a href="${up}#${esc(cmd.id)}">open this command in the app</a> to fill them in and copy the result.</p>
<pre><code>${esc(cmd.command)}</code></pre>`);

  if (cmd.variations && cmd.variations.length) {
    const rows = cmd.variations
      .map((v) => {
        const req = v.requires ? ` <span class="req">requires ${esc(REQUIRES_LABEL[v.requires] || v.requires)}</span>` : '';
        return `<h3>${esc(v.label)}${req}</h3>\n<pre><code>${esc(v.command)}</code></pre>`;
      })
      .join('\n');
    sections.push(`<h2 id="variants">Credential variants</h2>
<p>The same attack using a different authentication material.</p>
${rows}`);
  }

  if (cmd.examples && cmd.examples.length) {
    sections.push(`<h2 id="examples">Examples</h2>
${cmd.examples.map((e) => `<pre><code>${esc(e)}</code></pre>`).join('\n')}`);
  }

  if (cmd.tags && cmd.tags.length) {
    sections.push(`<h2 id="tags">Tags</h2>
<p class="tags">${cmd.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join(' ')}</p>`);
  }

  if (cmd.references && cmd.references.length) {
    sections.push(`<h2 id="references">References</h2>
<ul>${cmd.references
      .map(
        (r) =>
          `<li><a href="${esc(r.url)}" rel="noopener">${esc(r.title)}</a></li>`
      )
      .join('')}</ul>`);
  }

  // Related: explicit chain links first, then siblings in the same subcategory.
  const byId = new Map(commands.map((c) => [c.id, c]));
  const related = [];
  const seen = new Set([cmd.id]);
  for (const id of COMMAND_LINKS[cmd.id] || []) {
    const c = byId.get(id);
    if (c && !seen.has(id)) {
      seen.add(id);
      related.push(c);
    }
  }
  const siblings = commands.filter(
    (c) =>
      c.category === cmd.category &&
      c.subcategory === cmd.subcategory &&
      !seen.has(c.id)
  );
  for (const c of siblings.slice(0, Math.max(0, 8 - related.length))) {
    seen.add(c.id);
    related.push(c);
  }
  if (related.length) {
    sections.push(`<h2 id="related">Related commands</h2>
<ul class="cmd-list">${related
      .map(
        (c) =>
          `<li><a href="../${esc(c.id)}/">${esc(c.name)}</a> <span class="muted">${esc(truncate(c.description, 90))}</span></li>`
      )
      .join('')}</ul>`);
  }

  const body = `${breadcrumbHtml(trail, CMD_DEPTH)}
<article>
<h1>${esc(cmd.name)}</h1>
<p class="lede">${esc(cmd.description)}</p>
<p class="byline">Curated and verified by
<a href="${AUTHOR_URL}" rel="author noopener">${AUTHOR}</a>, penetration tester
(OSCP+, CRTE) · Last updated
<time datetime="${day(modified)}">${esc(prettyDay(modified))}</time></p>
<dl class="facts">${facts
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join('')}</dl>
<p class="cta"><a class="btn" href="${up}#${esc(cmd.id)}">Open in Command Manager</a></p>
${sections.join('\n\n')}
</article>`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${SITE}${url}#article`,
        headline: cmd.name,
        name: cmd.name,
        description: cmd.description,
        url: `${SITE}${url}`,
        articleSection: `${cName} / ${sName}`,
        keywords: (cmd.tags || []).join(', '),
        dateModified: modified,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'Command Manager', url: `${SITE}/` },
        author: { '@type': 'Person', name: AUTHOR, url: AUTHOR_URL },
        proficiencyLevel: 'Expert',
      },
      breadcrumbLd(trail),
    ],
  };

  return layout({ url, title, description, body, jsonld, depth: CMD_DEPTH });
}

// ------------------------------------------------------------- hub pages

function cmdListHtml(list, depth) {
  const up = '../'.repeat(depth) || './';
  return `<ul class="cmd-list">${list
    .map(
      (c) =>
        `<li><a href="${up}c/${esc(c.id)}/">${esc(c.name)}</a> <span class="muted">${esc(truncate(c.description, 110))}</span></li>`
    )
    .join('')}</ul>`;
}

function subcategoryPage(cat, sub, list) {
  const url = subUrl(cat, sub);
  const cName = catName(cat);
  const sName = subName(cat, sub);
  const trail = [
    { name: 'Home', url: '/' },
    { name: cName, url: catUrl(cat) },
    { name: sName, url },
  ];
  const title = `${sName} Commands — ${cName} | Command Manager`;
  const description = truncate(
    `${list.length} copy-pasteable ${sName} commands for Active Directory penetration testing, with password, NTLM hash and Kerberos ticket variants.`,
    158
  );

  const tools = [...new Set(list.map((c) => toolOf(c.command)))].sort();

  const body = `${breadcrumbHtml(trail, 3)}
<h1>${esc(sName)} Commands</h1>
<p class="lede">${esc(list.length)} ${esc(sName)} commands from the
<a href="../">${esc(cName)}</a> category, each with its placeholders, supported
authentication methods and upstream references.</p>
${tools.length ? `<p class="muted">Tools covered: ${tools.map((t) => `<code>${esc(t)}</code>`).join(', ')}</p>` : ''}
${cmdListHtml(list, 3)}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE}${url}#page`,
        name: `${sName} Commands`,
        description,
        url: `${SITE}${url}`,
        isPartOf: { '@type': 'WebSite', name: 'Command Manager', url: `${SITE}/` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: list.length,
          itemListElement: list.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            url: `${SITE}${cmdUrl(c.id)}`,
          })),
        },
      },
      breadcrumbLd(trail),
    ],
  };

  return layout({ url, title, description, body, jsonld, depth: 3 });
}

function categoryPage(cat, list) {
  const url = catUrl(cat);
  const cName = catName(cat);
  const trail = [
    { name: 'Home', url: '/' },
    { name: cName, url },
  ];
  const title = `${cName} Commands — AD Pentesting | Command Manager`;
  const description = truncate(
    `${list.length} ${cName.toLowerCase()} commands for Active Directory penetration testing — searchable, copy-pasteable, with credential variants.`,
    158
  );

  const subs = Object.keys(categories[cat].subcategories || {});
  const groups = subs
    .map((sub) => ({ sub, items: list.filter((c) => c.subcategory === sub) }))
    .filter((g) => g.items.length);

  const body = `${breadcrumbHtml(trail, 2)}
<h1>${esc(cName)} Commands</h1>
<p class="lede">${esc(list.length)} commands across ${groups.length}
${groups.length === 1 ? 'subcategory' : 'subcategories'}. Every entry lists the
authentication material it needs, the protocols it speaks and links to upstream
tool documentation.</p>
${groups
    .map(
      (g) => `<section>
<h2 id="${esc(g.sub)}"><a href="${esc(g.sub)}/">${esc(subName(cat, g.sub))}</a>
<span class="muted">${g.items.length}</span></h2>
${cmdListHtml(g.items, 2)}
</section>`
    )
    .join('\n')}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE}${url}#page`,
        name: `${cName} Commands`,
        description,
        url: `${SITE}${url}`,
        isPartOf: { '@type': 'WebSite', name: 'Command Manager', url: `${SITE}/` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: list.length,
          itemListElement: list.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            url: `${SITE}${cmdUrl(c.id)}`,
          })),
        },
      },
      breadcrumbLd(trail),
    ],
  };

  return layout({ url, title, description, body, jsonld, depth: 2 });
}

function categoryIndexPage() {
  const url = '/category/';
  const trail = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url },
  ];
  const title = 'All Command Categories — AD Pentesting | Command Manager';
  const description = truncate(
    `Browse ${commands.length} Active Directory penetration testing commands across ${Object.keys(categories).length} categories — enumeration, credential attacks, privilege escalation, lateral movement and more.`,
    158
  );

  const body = `${breadcrumbHtml(trail, 1)}
<h1>All Command Categories</h1>
<p class="lede">${commands.length} commands, grouped the way an engagement
actually runs — from first-contact enumeration through credential attacks to
lateral movement and post-exploitation.</p>
${Object.keys(categories)
    .map((cat) => {
      const list = commands.filter((c) => c.category === cat);
      const subs = Object.keys(categories[cat].subcategories || {}).filter((s) =>
        list.some((c) => c.subcategory === s)
      );
      return `<section>
<h2><a href="${esc(cat)}/">${esc(catName(cat))}</a> <span class="muted">${list.length}</span></h2>
<ul class="sub-list">${subs
        .map(
          (s) =>
            `<li><a href="${esc(cat)}/${esc(s)}/">${esc(subName(cat, s))}</a> <span class="muted">${list.filter((c) => c.subcategory === s).length}</span></li>`
        )
        .join('')}</ul>
</section>`;
    })
    .join('\n')}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE}${url}#page`,
        name: 'All Command Categories',
        description,
        url: `${SITE}${url}`,
        isPartOf: { '@type': 'WebSite', name: 'Command Manager', url: `${SITE}/` },
      },
      breadcrumbLd(trail),
    ],
  };

  return layout({ url, title, description, body, jsonld, depth: 1 });
}

// ------------------------------------------------------------------ write

// Every generated path is relative to site/, the published root.
function rmrf(p) {
  fs.rmSync(path.join(SITE_DIR, p), { recursive: true, force: true });
}

function write(rel, content) {
  const full = path.join(SITE_DIR, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// Wipe first so renamed or deleted commands do not leave stale pages behind.
rmrf('c');
rmrf('category');

let pages = 0;
const urls = [];

for (const cmd of commands) {
  write(`c/${cmd.id}/index.html`, commandPage(cmd));
  urls.push({ loc: cmdUrl(cmd.id), lastmod: lastmodFor(cmd) });
  pages++;
}

const newest = urls.length
  ? urls.map((u) => u.lastmod).sort().slice(-1)[0]
  : TODAY;

write('category/index.html', categoryIndexPage());
urls.push({ loc: '/category/', lastmod: newest });
pages++;

for (const cat of Object.keys(categories)) {
  const list = commands.filter((c) => c.category === cat);
  if (!list.length) continue;
  write(`category/${cat}/index.html`, categoryPage(cat, list));
  const catNewest = list.map(lastmodFor).sort().slice(-1)[0];
  urls.push({ loc: catUrl(cat), lastmod: catNewest });
  pages++;

  for (const sub of Object.keys(categories[cat].subcategories || {})) {
    const sl = list.filter((c) => c.subcategory === sub);
    if (!sl.length) continue;
    write(`category/${cat}/${sub}/index.html`, subcategoryPage(cat, sub, sl));
    urls.push({
      loc: subUrl(cat, sub),
      lastmod: sl.map(lastmodFor).sort().slice(-1)[0],
    });
    pages++;
  }
}

urls.unshift({ loc: '/', lastmod: newest });

// <priority> and <changefreq> are documented as ignored by Google, so only
// <loc> and <lastmod> are emitted.
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- AUTO-GENERATED by build-pages.js — do not edit manually. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${day(u.lastmod)}</lastmod>\n  </url>`
    )
    .join('\n')}
</urlset>
`
);

// ------------------------------------------------------------- llms.txt
//
// Two plain-Markdown files for retrieval clients: llms.txt is the llmstxt.org
// index, llms-full.txt is the whole corpus in one fetch. Deliberately NOT one
// .md twin per command — those would be crawlable duplicates of the HTML pages
// and GitHub Pages cannot serve them with a noindex header. Neither file goes
// in sitemap.xml.

const byCategory = Object.keys(categories)
  .map((cat) => ({ cat, list: commands.filter((c) => c.category === cat) }))
  .filter((g) => g.list.length);

const LLMS_SUMMARY =
  `${commands.length} copy-pasteable Active Directory penetration testing commands ` +
  `across ${byCategory.length} categories, each with its placeholders, the ` +
  `authentication material it needs (password, NTLM hash, Kerberos ticket, AES key), ` +
  `the protocols it speaks and links to upstream tool documentation.`;

write(
  'llms.txt',
  `# Command Manager

> ${LLMS_SUMMARY}

Command Manager is a static, browser-only reference at ${SITE}/ — no install, no
backend, no telemetry. Every command below has its own page. The full corpus in a
single file is at ${SITE}/llms-full.txt. Commands are documented for authorised
security testing only.

${byCategory
    .map(
      (g) => `## ${catName(g.cat)}

${g.list
        .map(
          (c) =>
            `- [${c.name}](${SITE}${cmdUrl(c.id)}): ${truncate(c.description, 160)}`
        )
        .join('\n')}`
    )
    .join('\n\n')}
`
);

function llmsFullEntry(cmd) {
  const out = [];
  out.push(`### ${cmd.name}`);
  out.push('');
  out.push(cmd.description);
  out.push('');
  out.push(`- URL: ${SITE}${cmdUrl(cmd.id)}`);
  out.push(`- Category: ${catName(cmd.category)} / ${subName(cmd.category, cmd.subcategory)}`);
  out.push(`- Platform: ${cmd.platform}`);
  if (cmd.requires && cmd.requires.length) {
    out.push(`- Requires: ${cmd.requires.map((r) => REQUIRES_LABEL[r] || r).join(', ')}`);
  }
  if (cmd.protocols && cmd.protocols.length) {
    out.push(`- Protocols: ${cmd.protocols.join(', ').toUpperCase()}`);
  }
  if (cmd.tags && cmd.tags.length) out.push(`- Tags: ${cmd.tags.join(', ')}`);
  out.push(`- Last updated: ${day(lastmodFor(cmd))}`);
  out.push('');
  out.push('```bash');
  out.push(cmd.command);
  out.push('```');
  for (const v of cmd.variations || []) {
    out.push('');
    const req = v.requires ? ` (requires ${REQUIRES_LABEL[v.requires] || v.requires})` : '';
    out.push(`Variant — ${v.label}${req}:`);
    out.push('');
    out.push('```bash');
    out.push(v.command);
    out.push('```');
  }
  if (cmd.examples && cmd.examples.length) {
    out.push('');
    out.push('Examples:');
    out.push('');
    out.push('```bash');
    out.push(cmd.examples.join('\n'));
    out.push('```');
  }
  if (cmd.references && cmd.references.length) {
    out.push('');
    out.push('References:');
    out.push('');
    for (const r of cmd.references) out.push(`- [${r.title}](${r.url})`);
  }
  return out.join('\n');
}

write(
  'llms-full.txt',
  `# Command Manager — full command reference

> ${LLMS_SUMMARY}

Source: ${SITE}/ · Database and generator: ${REPO_URL} · Curated by ${AUTHOR}
(penetration tester, OSCP+/CRTE), ${AUTHOR_URL}. Angle-bracket tokens such as
\`<ip>\` or \`<user>\` are placeholders. Commands are documented for authorised
security testing only.

${byCategory
    .map(
      (g) => `## ${catName(g.cat)}

${g.list.map(llmsFullEntry).join('\n\n')}`
    )
    .join('\n\n')}
`
);

console.log(`Built ${pages} static pages and sitemap.xml (${urls.length} URLs)`);
console.log('Built llms.txt and llms-full.txt');
