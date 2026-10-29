# Development Plan: lernapps.github.io (claude/navigation branch)

*Generated on 2026-10-29 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Die Navigation neu denken. Die Kopfzeile hat 8 Einträge (Lernen, Üben, App bauen, Tooling, Tutor, Features, Plattform, Mitmachen) und bricht auf dem Handy bei 360 px in drei Zeilen um. Weniger Einträge, ohne die Komponenten (Tooling, Tutor, Plattform) zu verstecken, und Startseite und Detailseiten besser verbinden.

Der Rahmen `site-frame/` (npm-Paket `@lernapps/site`, Quelle in diesem Repository) ist für alle Sites geteilt (Apps, Doku, Tooling, Practice, Mathe-Karte). Ein Umbau erreicht sie über Renovate-PRs.

## Key Decisions
- Neuer Branch `claude/navigation` von `main` (nach PR #89, gemergt als `c6a7e08`).
- Ausgangsplan stammt aus `.vibe/development-plan-claude-test-workflows-ki-abschnitt-2.md`, Abschnitt „Folge-Aufgabe: Navigation neu denken“. Empfehlung dort: Option A plus Brotkrumen und Weiter-Link, vorher Mock-ups (Desktop und 360 px) von A und B, dann Entscheidung des Nutzers.

- Entscheidung (Nutzer, 2026-10-29): Desktop-Kopfzeile bleibt, wie sie ist. Handy: Variante A (Burger mit gruppiertem Menü). Beides im selben PR, in zwei Commits: (1) Handy-Menü, (2) Dunkelmodus des Rahmens. Gruppennamen: Lernen / Bauen / Verstehen (en: Learn / Build / Understand; Vorschlag von mir, vom Nutzer nicht widersprochen).
- Annahme: „Beides“ meint Handy-Menü und Dunkelmodus des Rahmens. Brotkrumen, Weiter-Link und „Mehr“-Links sind nicht Teil dieses PR.
- Technik Handy-Menü: Zwei Ausgaben in `header()`: das bisherige `<nav class="la-nav la-nav--bar">` (Desktop, unverändert) und `<details class="la-menu">` mit `<nav class="la-nav la-nav--menu">` (Handy). Per CSS ab 40 rem eines ausgeblendet (`display: none`, damit Hilfstechnik nur eines sieht). Datenquelle `nav.groups` in `nav.js`; `nav.links` bleibt als abgeleitete flache Liste für den Desktop und für `currentHref()`. Burger nur per CSS gezeichnet, Text „Menü“/„Menu“ in `texts`.
- Technik Dunkelmodus Rahmen: Nur Token-Überschreibung in `tokens.css` unter `prefers-color-scheme: dark` (`--la-surface`, `--la-text`, `--la-muted`, `--la-border`, `--la-link`), kein `color-scheme` (das bleibt Sache jeder Site, sonst werden Formularfelder dunkel auf heller Seite). `.la-skip` bekommt feste Farben, weil sein Weiß sonst mit dem hellen Link-Ton kollidiert. Die anderen Sites sehen es erst mit ihrem Renovate-Update und müssen dann ihren Dunkelmodus selbst prüfen (Hinweis in `site-frame/README.md` und im PR).

## Notes
Aus dem Ausgangsplan:
- Optionen für die Kopfzeile: A drei Gruppen (Lernen: Apps, Üben, Tutor; Bauen: App bauen, Tooling; Plattform: Features, Plattform, Mitmachen); B zwei Ebenen mit Unterleiste je Bereich; C nach Rolle (lernen, bauen, mitmachen); D wenige Hauptpunkte plus Knopf, Sekundäres in der Fußzeile.
- Handy: Burger per `<details>` ohne JavaScript; Gruppen als aufklappbare Blöcke.
- Landing und Detail: „Mehr“-Link je Abschnitt auf genau eine Detailseite, Brotkrumen („Start › Tutor“) mit `aria-current`, Inhaltsverzeichnis „Auf dieser Seite“ auf langen Detailseiten, Weiter-Link am Ende („Weiter: Tooling“), optional drei „Türen“ am Anfang der Startseite.
- Rahmenbedingungen: kein JavaScript nötig, WCAG 2.1 AA, kein waagerechtes Scrollen bei 360 px, beide Sprachen, `test/language.test.mjs` bleibt grün.

Zusätzlich aus dem Dunkelmodus-PR (#89):
- Der Dunkelmodus gilt bisher nur für die Seiten dieses Repositories. `site-frame/tokens.css` und `frame.css` sind unverändert. Ein Dunkelmodus für den Rahmen gehört zu dieser Aufgabe, damit Doku und Apps nur einmal nachziehen müssen. Die Tokens (`--la-surface`, `--la-text`, `--la-muted`, `--la-border`, `--la-link`) sind schon als Variablen angelegt.
- `/privacy/` läuft bei 360 px waagerecht über (H1 „Datenschutzerklärung“ 401 px), besteht schon auf `main`.
- Hinweis für `lernapps/app-templates` (andere Repos): Die Architektur nennt Selbsteinschätzung als Guide, „Warum?“ und „Zurück zum Tutor“ noch nicht.

Befund Rahmen heute (`site-frame/`):
- `nav.js`: `nav.links` ist eine flache Liste von acht Einträgen (`label` je Sprache, `href` als Pfad ab Wurzel); die aktuelle Seite markiert `currentHref()` in `frame.js` mit dem längsten passenden Pfad.
- `frame.js`: `header()` rendert Skip-Link, Marke, `<nav class="la-nav">` mit `<ul>` und Sprachwahl; `frame.css`: Klassen `.la-nav`, `.la-header__inner`; die Liste bricht per Flex um, kein Burger, kein JavaScript außer der Sprachwahl im `<head>`.

Befund Mock-ups (Scratchpad `nav/`, Tokens und `frame.css` des Rahmens, Seite „Tutor“):
- Heute passen die acht Einträge am Desktop noch in eine Zeile (Breite 56 rem); das Problem ist das Handy mit drei Zeilen. Es wird mit jedem weiteren Eintrag auch am Desktop eines.
- Ohne JavaScript kann man ein `<details>` nicht nur auf dem Handy schließen: Ein geschlossenes `<details>` verbirgt seinen Inhalt auch am Desktop. Lösung in den Mock-ups: zwei Ausgaben, ein `<nav>` für den Desktop und ein `<details>` fürs Handy, je eins per CSS (`display: none`) ausgeblendet; so sieht die Hilfstechnik nur eines. Die Links stehen zweimal im HTML.
- A (Gruppen mit kleinen Überschriften, alle acht Links sichtbar): Kopf am Desktop zweizeilig (ca. 52 px statt 41 px), am Handy einzeilig mit „Menü“, geöffnet drei Gruppen untereinander. Problem: Die Gruppe „Plattform“ enthält den Link „Plattform“; Vorschlag „Verstehen“ oder „Mehr“ für die Gruppe.
- B (Bereiche oben, Unterleiste je Bereich): Kopf am Desktop zweizeilig (Hauptleiste und Unterleiste), am Handy Hauptleiste mit „Menü“ plus Unterleiste. Bereiche brauchen ein Ziel (erste Seite der Gruppe); auf Seiten ohne Bereich (Startseite, Datenschutz) fehlt die Unterleiste. Geschwister sind nur über die Unterleiste erreichbar.

## Explore
### Tasks
- [x] Ausgangsplan gelesen und hier zusammengefasst
- [x] `site-frame/nav.js` und `frame.js` gelesen
- [ ] `frame.css` und den Aufbau von `header()` genauer lesen; Tests des Rahmens (`test/language.test.mjs`) ansehen
- [x] Mock-ups Ist, A und B (Desktop und 360 px, geschlossen und geöffnet) gebaut und dem Nutzer gezeigt (Englisch noch nicht)
- [ ] Mit dem Nutzer klären: Umfang des ersten PR (nur Kopfzeile oder auch Brotkrumen, „Mehr“-Links, Weiter-Link) und ob der Dunkelmodus des Rahmens mit hinein soll

### Completed
- [x] Created development plan file

## Plan
### Tasks
- [x] Entscheidungen des Nutzers festgehalten (siehe Key Decisions)
- [x] Entwurf: Daten (`nav.groups`), Markup (`la-nav--bar`, `la-menu`, `la-nav--menu`), CSS (≤ 40 rem), Tokens (Dunkel), Tests

### Completed
- [x] Mock-ups Ist, A, B gebaut und besprochen

## Code
### Tasks
Commit 1: Handy-Menü
- [x] `site-frame/nav.js`: `nav.groups` (Lernen/Bauen/Verstehen, de und en), `nav.links` daraus ableiten, `texts.menu`
- [x] `site-frame/frame.js`: `header()` gibt Desktop-`<nav>` und Handy-`<details>` aus (aria-current, Sprachwahl in beiden); Desktop-HTML sonst unverändert
- [x] `site-frame/frame.css`: `.la-menu` und `.la-nav--menu` (Burger per CSS, Panel unter dem Kopf, scrollbar bei wenig Höhe, Fokus sichtbar); ab 40 rem Desktop-`nav` aus und Menü an; alte Umbruch-Regeln für das Handy entfallen
- [x] `test/nav.test.mjs`: alle Links in beiden Ausgaben, Gruppen decken alle Links ab, beide Sprachen, `aria-current`, Sprachwahl, zwei `<nav>`
- [x] `site-frame/README.md` ergänzen; Prüfen: Build, Check, Tests, Playwright (360 px zu und auf, Tastatur, de und en, Desktop unverändert bei 1280 px, kein Überlauf)
Commit 2: Dunkelmodus des Rahmens
- [ ] `site-frame/tokens.css`: dunkle Tokens; `site-frame/frame.css`: `.la-skip` feste Farben
- [ ] Test: dunkle Tokens überschreiben nur vorhandene Tokens, Kontrast der Paare ≥ 4,5:1
- [ ] README: Hinweis für die anderen Sites; Prüfen: Kontrast und Ansicht in Dunkel
- [ ] Mitnehmen, falls klein: `/privacy/` läuft bei 360 px waagerecht über

### Completed
- Commit 1 (Handy-Menü) umgesetzt. Abweichung vom Plan: Die Gruppen heißen „Für Lernende“, „Für Macher“, „Verstehen und mitmachen“ (en: For learners, For makers, Understand and join in), weil der erste Link der Gruppe „Lernen“ heißt und eine Gruppe nicht wie einer ihrer Links heißen soll. `nav.links` bleibt die flache Liste in der alten Reihenfolge, die Gruppen verweisen per `hrefs` darauf, damit der Desktop unverändert bleibt. Geprüft: Desktop-Kopf pixelgleich zur Live-Seite (1280 px), Handy zu und auf (de, en), Tastatur (Tab, Enter), 31 Tests, `npm run check`, alle 15 Seiten bei 360 px ohne Überlauf, außer `/privacy/` (schon vorher).

## Commit
### Tasks
- [ ] Zwei Commits sauber, PR gegen `main` (nur auf Anweisung), CI abwarten

### Completed
*None yet*


---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
