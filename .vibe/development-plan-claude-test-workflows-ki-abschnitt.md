# Development Plan: lernapps.github.io (claude/test-workflows-ki-abschnitt branch)

*Generated on 2026-10-29 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Auf der Startseite (`src/index.njk`) einen Abschnitt zu KI einbauen.

## Key Decisions
- Alle Texte stehen in `src/_data/de.js` und `en.js` (Struktur identisch); `src/index.njk` enthält keinen Text.
- Neuer Datenblock `landing.ai` in beiden Sprachen; neuer Abschnitt in `index.njk` mit eigenem `id="ki"`.
- Position: nach "different" (Fundament für Macher), vor "platform". Dort ist die KI-Rolle (Assistent baut mit) schon angelegt; der Abschnitt macht sie sichtbar. Hintergrund `bg-slate-50`, damit sich die Abfolge weiß/grau/dunkel/weiß fortsetzt.
- Inhalt (Annahme): Wie KI auf lernapps.net vorkommt, ehrlich und ohne Werbesprache: (1) Dein KI-Assistent baut die App mit dir, (2) optionaler KI-Tutor, die App funktioniert ohne KI und sendet nichts, (3) jeder Bereich hat eine `llms.txt`. Quelle: bestehende Texte in `forYou`, `features.users`, `features.platform.unique.ki`.
- Sprache: einfaches Deutsch nach ISO 24495-1, "du", kurze Sätze; Englisch entsprechend.
- Links nur auf bestehende Ziele: `/features/#entwickler`, `/features/#ki`, `/apps/build/` (en: `#developers`, `#ai`, `/apps/en/build/`).

## Notes
- Build: `npm run build`; Tests: `npm test`; Prüfung: `npm run check` (braucht `_site`). `node_modules` fehlt, `npm ci` nötig.
- Das Anchor-Ziel `#ki` auf der Features-Seite existiert als `unique`-Eintrag mit `id: "ki"`, in en `id: "ai"` (zu prüfen, ob `features.njk` die id rendert).
- Annahme zur Unklarheit "Abschnitt zu KI": kein Chat-Widget, keine externe KI-Funktion, nur Information.

## Explore
*Eintritt: Plan-Datei existiert.*
### Tasks

### Completed
- [x] Created development plan file
- [x] Startseite `src/index.njk`, Daten `src/_data/de.js`/`en.js` und Features-Anker erkundet
- [x] Inhalt des KI-Abschnitts geklärt (Annahmen unter Key Decisions)

## Plan
*Eintritt: Struktur der Startseite und Übersetzungsmechanismus sind verstanden.*
### Tasks

### Completed
- [x] Dateiliste: `src/_data/de.js`, `src/_data/en.js` (Block `landing.ai`), `src/index.njk` (Abschnitt 4b), Kommentar im Kopf von `index.njk` und `de.js` anpassen
- [x] Aufbau des Abschnitts: Überschrift, Einleitung, drei Karten (Icon, Titel, Text), Hinweis-Kasten "Freiwillig", Link auf `/features/#ki`
- [x] Texte (de): Überschrift "KI hilft beim Bauen. Lernen musst du nicht damit." Karten: "Dein Assistent baut mit", "Ein Tutor, wenn du willst", "Lesbar für Assistenten". Hinweis: "Jede App funktioniert ohne KI und sendet selbst nichts."
- [x] Texte (en) entsprechend; gleiche Struktur
- [x] Prüfung: `npm ci`, `npm run build`, `npm test`, `npm run check`

## Code
*Eintritt: Plan mit Abschnittsinhalt und Dateiliste liegt vor.*
### Tasks

### Completed
- [x] Block `landing.ai` in `de.js` und `en.js` eingefügt
- [x] Abschnitt in `index.njk` eingefügt, Kopfkommentare aktualisiert
- [x] `npm ci`, Build, Tests (10 pass), Check ok; `id="ki"` und `id="ai"` in den gebauten Seiten vorhanden

### Completed
*None yet*

## Commit
*Eintritt: Abschnitt umgesetzt, Build und Tests laufen durch.*
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
