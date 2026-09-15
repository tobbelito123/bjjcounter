# BJJ Submissions Counter — content automation pipeline

This file drives the automated content-page generator. It runs unattended and pushes straight
to `main` (GitHub Pages deploys automatically from the repo root on push, no build step,
`CNAME` sets the custom domain), so there is no human review step. Follow this exactly — don't
improvise structure, and don't invent facts.

## What BJJ Submissions Counter is

A free, no-account Brazilian Jiu-Jitsu submission tracker (installable PWA). Log a submission,
pick the opponent's belt, and it tracks totals, a day streak, and a "belt journey" progress bar
per technique. All data is stored locally in the browser (`localStorage`) — no backend, no
accounts, no analytics. Plain static HTML/CSS/JS site, no build step, no framework, no
`package.json`. Full product context is in `index.html` itself if needed.

## The task, each run

1. Read `content-topics.md`. Take the topmost item with `status: pending`.
2. Write one new page at `<slug>.html` in the **repo root**, using the template below.
3. Add a `<url>` entry to `sitemap.xml` (`lastmod` = today, `priority` 0.7-0.8 depending on
   `Type`, `changefreq` monthly), matching the existing entries. Note URLs keep the `.html`
   extension here (this is GitHub Pages, not Cloudflare Pages — no clean-URL rewriting).
4. Add a line under the matching heading in `llms.txt` (`## Guides` / `## Comparisons` /
   `## Articles` — add a new heading if the topic's `Type` doesn't match an existing one).
5. **Internal linking, both directions** (inline in the prose, not a bare list):
   - **Forward:** add 1 contextual link from the new page to a genuinely related *existing*
     page.
   - **Backward:** also edit 1 existing page to add a link *to* the new page. Right now none of
     the content pages link to each other at all (only "← Back to app"), so use your judgment
     on the most topically-related existing page for both directions — this step is what
     starts building that link graph, so don't skip it just because there's no precedent yet.
6. Flip that topic's status in `content-topics.md` to `published: YYYY-MM-DD`.
7. **Self-growing backlog:** if fewer than 5 `pending` topics remain in `content-topics.md`
   after this run, add 5-8 more before finishing, following the existing format (see that
   file's own instructions at the top). Never let the queue run dry — this pipeline has no
   human checking in to refill it.
8. Commit all of it in one commit, push to `origin main`.

## Page template

Copy the structure of `bjj-glossary.html` for Guides/Articles, or `bjj-counter-vs-bjjbuddy.html`
for Comparisons, exactly: same `<head>` boilerplate (CSS custom properties block, light/dark
via `prefers-color-scheme`, same `.wrap`/`header`/`.card` pattern), same header with the
"← Back to app" link. Only change per page:

- `<title>` — specific, includes the target phrase, under ~60 characters.
- `<meta name="description">` — natural length (~150-160 chars), reads like a person wrote it.
- `<link rel="canonical">` and `og:url` — `https://www.bjjcounter.com/<slug>.html`.
- `og:title` / `og:description`.
- The `Article` JSON-LD block (see `bjj-counter-vs-bjjbuddy.html` for the shape): `headline`,
  `datePublished` = `dateModified` = today's date.
- Body content (see style rules below), plus the 2 internal links from step 5.

## Writing style — required

This content must not read as AI-written. Concretely:

- No em dashes as clause connectors. Use periods, commas, or restructure the sentence.
- No AI-cliché phrasing: "unlock", "seamless", "game-changer", "whether you're X or Y", "it's
  not just A, it's B", "thrilled to", "dive into", "in today's fast-paced world".
- Vary sentence length and rhythm. Don't default to three-item lists everywhere.
- **Do not invent specific facts about real people, real gyms/academies, real competitions, or
  real events** (the existing `jonah-hill-bjj-annihilate.html` piece is grounded in an already
  publicly known, verifiable moment — don't add new pages that make claims about specific real
  individuals or events unless a topic entry explicitly says otherwise and gives verified
  facts to work from). Ground technique/training advice in general, well-established BJJ
  practice instead, and don't claim universal rules for things that vary by academy (belt
  promotion timelines, competition rules nuance) — say so explicitly where relevant.
- Length: roughly 400-600 words per Guide/Article page; Comparison pages follow the existing
  table-plus-short-prose format (see `bjj-counter-vs-bjjbuddy.html`), not a long-form article.
- Keep the same direct, plain-spoken voice as the existing pages — for beginners who don't want
  to feel talked down to.

## Git

Commit message: short, describes the topic, e.g. `Add guide: common white belt mistakes`.
Push directly to `main` — this is expected and intentional, that's what triggers the GitHub
Pages deploy. No PR, no branch.

## Do not touch

Don't modify `index.html`, `desktop.html`, `sw.js`, `manifest.webmanifest`, `privacy.html`, or
`CNAME` as part of this pipeline. This automation adds one new HTML file per run at the repo
root, makes the one backward-link edit to an existing page (step 5 above), and updates
`sitemap.xml`, `llms.txt`, and `content-topics.md`.
