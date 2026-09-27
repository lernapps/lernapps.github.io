# lernapps.github.io

Home page of the lernapps organisation, served at <https://lernapps.github.io/>.

It holds the home page and the navigation between the common sites. It does **not** list apps; that is the job of the map (planned). See [ORGANIZATION.md](https://github.com/lernapps/.github/blob/main/ORGANIZATION.md) for the target structure.

## Layout

| Path | Purpose |
|---|---|
| `site/` | Published as is. Static HTML/CSS, readable without JS, no external requests |
| `site/404.html` | Forwards old addresses of the Mathe-Karte (see below), otherwise a plain "not found" page |
| `site/{binom,prozent,zufall,karte}/*.{md,txt}`, `site/llms.txt` | "Moved" notes for AI tutors that fetch the old `tutor.md`/`llms.txt` addresses (fetchers don't run the JS in `404.html`) |
| `scripts/check.mjs` | CI check: no external resources, no broken relative links |
| `.github/workflows/pages.yml` | Check on every PR and push; deploy from `main` |

## Old addresses of the Mathe-Karte

Until 2026-09-27 the Mathe-Karte lived at the root (`lernapps.github.io/binom/…`). It now lives at `/mathe-karte/`. Tutor links with that old prefix are already in learners' chats, so this repo keeps them working:

- **Browsers:** `404.html` forwards `/binom/`, `/prozent/`, `/zufall/`, `/karte/`, `/kern/` and the favicons to `/mathe-karte/…`, keeping query and hash (e.g. `?seed=42&von=tutor`).
- **AI tutors fetching files:** the stubs at the old `tutor.md`/`llms.txt` paths name the new address. The root `llms.txt` describes lernapps and points to the Mathe-Karte; it stays.
- The old root `index.html` is now the lernapps home page, which links to the Mathe-Karte.

Remove both once the old links have died out. Old `/docs/…` links are forwarded by the `404.html` of [lernapps/docs](https://github.com/lernapps/docs), which owns `/docs/` since 2026-09-27.

## Local preview

Any static server works, e.g. `npx serve site` or `python3 -m http.server -d site`. Run `node scripts/check.mjs` before pushing.
