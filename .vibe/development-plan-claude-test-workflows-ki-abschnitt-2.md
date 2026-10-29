# Development Plan: lernapps.github.io (claude/test-workflows-ki-abschnitt-2 branch)

*Generated on 2026-10-29 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Auf der Startseite (src/index.njk) einen Abschnitt zu KI einbauen. Inhalt und Umfang sind noch zu klären.
## Key Decisions
- Workflow epcc gewählt (mittelgroße Funktion, kein trivialer Fall).
- Platz auf der Startseite: nach "Was du davon hast" (forYou), vor "Fundament für Macher" (different).
- Neu entschieden (Nutzer, nach Rückfrage): Differenzieren wie `/tooling/`. Der Startseiten-Abschnitt hat die Sprungmarke `#ki` (en `#ai`) und führt zu `/tutor/` (en `/en/tutor/`: Lernbegleitung des Explainers, parallel zu `/tooling/` für KI beim Bauen). Header-Eintrag "Tutor" statt "KI". Wo unten noch `/ki/` oder `ki.njk` steht, gilt `/tutor/` und `tutor.njk`; die Seite beginnt mit "Dein Tutor, nicht unserer. Du bringst deinen KI-Assistenten mit."
- Folge-Aufgabe (nicht in diesem Umfang): Navigation neu denken (Kopfzeile wird lang, 8 Einträge). Optionen: A drei Gruppen (Lernen, Bauen, Plattform), B zwei Ebenen mit Unterleiste, C nach Rolle, D wenige Punkte plus Knopf; Handy: Burger per `<details>` ohne JavaScript; Landing und Detail: "Mehr"-Link je Abschnitt, Brotkrumen, Inhaltsverzeichnis, Weiter-Link, drei Türen. Empfehlung A plus Brotkrumen und Weiter-Link; Mock-ups (Desktop und 360 px) vor der Entscheidung. Betrifft den geteilten Rahmen `site-frame` und damit alle Sites.
- Entschieden (Nutzer, "mach das"): zwei Ebenen. Kurzer Abschnitt `ki` auf der Startseite (nach `forYou`) und Detailseite `/ki/` mit Eintrag "KI" im gemeinsamen Header (`site-frame/nav.js`), beide Sprachen gleichzeitig. Das bestätigt die Annahmen aus meiner letzten Rückfrage (Header-Eintrag gewollt, Englisch parallel). Nicht ausdrücklich beantwortet, daher Annahme: Dialog sagt "Assistent", Mistral nur in der Bildunterschrift und im Link; englischer Dialog bleibt das deutsche Original.
- Wortwahl: "KI-Assistent", Anbieter (Claude, ChatGPT, Mistral) nur als Beispiele. Der Tutor ist beim Einschätzen Guide, danach Tutor.
- Aussage "mit KI und für KI gebaut" stammt vom Nutzer ("Wir haben unsere Plattform mit KI und für KI gebaut. Vor allem aber für Menschen."): wörtlich übernehmen, nichts hinzuerfinden.
- Datenschutz ehrlich: Die App sendet nichts und lernapps.net erfährt nichts; was das Kind in den Assistenten einfügt, geht an dessen Anbieter. Nicht "Alle Daten bleiben bei dir".
- Mistral-Link (öffentliches Gespräch): als normaler Link, kein Einbetten, keine Anfrage beim Laden. Das erfüllt die Regel "keine externen Requests".
- Illustrationen: Inline-SVG, Text-Alternative, Tokens-Farben. Nur "Weg der Daten" auf der Startseite; auf `/ki/` zusätzlich "Fehler im Detail" (0,16 / 0,17) und die Route-Teilung. Kater Minka entfällt (YAGNI).
- Nicht im Umfang: Änderungen an der Mathe-Karte, am Tutor-Prompt oder am Tooling (andere Repos).
- Einordnung (Nutzer): Der KI-Tutor ist für das Plattform-Design nicht strukturgebend. Er ist ein Produkt-Feature des Explainers (Archetyp "Erklär-App"), das Inhalte vermittelt. Er gehört in die Architektur (arc42, Bausteinsicht) als Teil des Bausteins zum Archetyp "explainer", nicht ins pdt42-Modell. Folge für diese Arbeit: `/ki/` beschreibt ein Produkt-Feature, keine neue Rolle der Plattform; die Seite darf den Tutor nicht als eigenen Dienst der Plattform darstellen (es gibt keinen Server und keinen Chatbot). Mit dem arc42-CLI geprüft (lernapps/docs, Commit cb1fdd9, `npx arc42 --dir docs/arc42 get ...`): Der Tutor ist dort schon angelegt. Kapitel 8, Konzept `concept-assistants-as-readers`: "Learners' assistants are readers too: an explainer app gives a tutor the learner brings the very tasks on screen, without the app sending anything." Umgesetzt wird es vom Baustein `bb-app-templates` (Kapitel 5, Archetypen quiz, explainer, interactive; Repo lernapps/app-templates, dessen eigene Architektur den Baustein verfeinert). Evidenz: Intents i104 und i168 (Tutor, den der Lernende mitbringt; Aufgabennummern in der Adresse). Folge: Die Seite `/ki/` nutzt dieselben Begriffe ("Tutor, den du mitbringst") und widerspricht dem Konzept nicht. Nicht im Konzept erwähnt: Selbsteinschätzung als Guide, "Warum?" und "Zurück zum Tutor". Das gehört, falls gewünscht, in die Architektur von lernapps/app-templates, nicht in dieses Repo (Hinweis im Commit-Schritt).

## Notes
- Startseite: `src/index.njk` (Nunjucks, ohne eigene Texte). Texte in `src/_data/de.js` und `en.js` unter `landing`, gleiche Struktur. Sprache: einfaches Deutsch nach ISO 24495-1, "du".
- Aufbau heute: hero, showcase, forYou, different, platform, join, founder, cta. Jeder Abschnitt hat `aria-labelledby`, wechselnde Hintergründe (weiß, slate-50, slate-800).
- KI kommt schon vor, aber nirgends als eigener Abschnitt: forYou (Arbeit-Karte: Assistent baut Übungs-App), join ("Dein KI-Assistent hilft dir beim Bauen"), features (KI-Tutor freiwillig, llms.txt, Anleitungen für Assistenten).
- Regeln: keine externen Requests, alle Inhalte ohne JavaScript lesbar, WCAG 2.1 AA, kein horizontales Scrollen bei 360 px. Prüfung: `npm run build && npm run check`.
- `README.md` beschreibt die Geschichte der Startseite und müsste um den neuen Abschnitt ergänzt werden.

## Story-Entwurf "KI beim Lernen" (Stand Explore)
- Beleg 1, Selbsteinschätzung: Eine App-Seite (Mathe-Karte, Wahrscheinlichkeit) lässt dich dein Wissen einschätzen. Das Ergebnis bleibt im Browser (localStorage, siehe Datenschutzerklärung). Danach bespricht man es mit dem eigenen KI-Assistenten.
- Beleg 2, KI-Tutor: Die App gibt dem Assistenten Aufgabe, Lösung und typische Fehler (Erklär-App, freiwillig). Beispiel: ein Chat-Verlauf (Nutzer nennt ChatGPT-Link; Inhalt für mich nicht abrufbar, Auszug nötig).
- Pointe Datenschutz: Die App sendet nichts. Was an den Assistenten geht, entscheidet das Kind oder die Eltern selbst. "Alle Daten bleiben bei dir."
- Ton: Kein Leistungsdruck; es geht um individuelles Verständnis, nicht um Prahlerei oder Scham. Zitat des Nutzers: "KI-Agenten sind sehr geduldige Lehrer."
- Grenze (ehrlich): KI löst nicht alles; Lernen ist auch sozial.
- Abgrenzung: KI beim Bauen = /tooling.

## Konzept "KI beim Lernen" (aus dem Beispiel-Chat "Binomische Formeln üben")
Ablauf, wie das Beispiel ihn zeigt:
1. Selbsteinschätzung in der App (Mathe-Karte, Kapitel Binomische Formeln: 12 Aufgaben, Ergebnis je Seite). Alles bleibt im Browser.
2. "Zum Tutor": ein Knopf kopiert einen Auftrag. Er enthält die Links der App-Seiten (`?via=tutor`), das Ergebnis je Seite und die Eingaben der Lernenden. Die Lernenden fügen ihn in den eigenen Assistenten ein (ChatGPT, Claude, Mistral, ...).
3. Der Assistent lädt die Seiten und wird Tutor: Er sieht 11 von 12 richtig, fokussiert die eine Auffälligkeit (zweite binomische Formel, A6), liest die Eingabe `9a2-24ab+16b^2` und vermutet einen Eingabefehler statt Rechenfehler. Er fragt nach, stellt eine Kontrollaufgabe ((5x−3y)²), bestätigt und schlägt den nächsten Schritt vor.
4. Rückweg: "Zurück zum Tutor" auf der App-Seite kopiert den Stand wieder in den Chat.

Was das Beispiel zeigt (Kernaussagen für die Seite):
- Der Assistent liest nicht nur ein Ergebnis, sondern die Eingabe: Er unterscheidet Tippfehler von Denkfehler. Das kann eine Punktzahl allein nicht.
- Es ist die *eigene* KI: Sie erfährt von der eigenen (Un-)Fähigkeit, die Plattform nicht. Wer nicht weiß, wo er steht, muss es keinem Fremden zeigen. Datenschutz ist hier gerade beim Nicht-Wissen ein Produkt-Feature. Es gehört nicht nur zu KI (Selbsteinschätzung bleibt auch ohne KI im Browser).
- Geduldig, individuell, jederzeit verfügbar. Kein Leistungsdruck, keine Scham.
- Die App funktioniert ohne KI; der Tutor ist freiwillig und die App sendet selbst nichts.
- Grenze: Ersetzt nicht Menschen. Lernen ist auch sozial. Der Assistent kann sich irren; die App-Seiten sind die geprüfte Quelle.

Vorschlag Aufbau des Startseiten-Abschnitts (nach `forYou`, id `ki`, Nav-Eintrag als Anker):
- Überschrift: zwei KI-Strategien, zwei Spalten: "KI beim Lernen" (Hauptteil) und "KI beim Bauen" (kurz, Link `/tooling/`).
- Lernen: 3 Schritte (Einschätzen → Tutor → Üben) und ein kurzer, gekürzter Chat-Auszug als Beispiel (Tippfehler statt Denkfehler erkannt). Datenschutz-Hinweis im blauen Kasten wie bei `forYou`. Ehrliche Grenze als ein Satz.
- Texte de.js und en.js, Layout in `index.njk`, README und Nav ergänzen.
- Offen: Gesprächsauszug auf der Startseite als Text (barrierefrei, ohne JavaScript). Eigene Seite `/ki/` erst, wenn der Umfang es verlangt.

## Korrektur nach Test der echten Selbsteinschätzung (Mathe-Karte, Kapitel Wahrscheinlichkeit)
Ich habe die Selbsteinschätzung selbst durchgespielt (12 Aufgaben, 4 Seiten, Ergebnis 7 von 12; absichtlich typische Fehler: Pfad vergessen, "ohne Zurücklegen" nicht beachtet). Der Blick in die App ändert das Konzept:
- Das Ergebnis zeigt je Seite eine Einstufung ("Kannst du wahrscheinlich schon" / "Schau sie dir noch einmal an" / "Lies sie genau") und bietet "Mit einem KI-Tutor weiterlernen". Man wählt Claude, ChatGPT, Mistral Vibe oder "Text kopieren". Die App sagt dabei: "Dein Klick gibt ihm das Ergebnis und deine Eingaben; sonst schickt die App nichts weg." Die Nutzung läuft über das eigene Konto beim Anbieter, der Assistent ist kein Angebot von lernapps.net.
- Der Tutor ist ein *Wegweiser*, kein Lehrer (Anweisung auf der Tutor-Seite `/mathe-karte/zufall/einschaetzung/tutor/`, öffentlich einsehbar für Eltern und Lehrkräfte): höchstens drei Sätze und eine Frage, genau ein Link je Antwort; er erklärt keinen Stoff und verrät keine Lösung. Erklärt und geübt wird auf den Seiten der App. Nur wenn das Kind mit falschen Aufgaben zurückkommt ("Zurück zum Tutor"), coacht er: Er benennt die Idee hinter dem Fehler und stellt Warum-Fragen statt zu verbessern.
- Kreislauf: Selbsteinschätzung, Tutor schickt zur Seite, Üben, "Zurück zum Tutor", neue Runde, bis alle Seiten sitzen. Erst nach zwei Runden ohne Erfolg verweist er auf den seitenbezogenen KI-Tutor "Mit einem KI-Tutor lernen".
- Datenschutz konkret: Die Prompt-Daten (Ergebnis je Aufgabe, Eingaben) stehen in der Adresse und im kopierten Text; sie gehen nur dorthin, wohin das Kind sie einfügt. Eltern und Lehrkräfte können vorher alles lesen ("Ansehen, was dein Tutor bekommt").
- Folge für die Startseite: Nicht "KI erklärt dir Stoff", sondern "Die App weiß, wo du stehst; dein eigener Assistent führt dich durch". Der Chat-Auszug des Nutzers (Binomische Formeln) war kein gutes Beispiel; der Nutzer schickt einen Ablauf mit meinem Wahrscheinlichkeits-Ergebnis.
- Material liegt im Scratchpad (Screenshots, Prompt `tutor-prompt-chatgpt.txt`). Echte Chatgpt-Antwort steht aus.

## Präzisierung nach dem Mistral-Beispiel (Laplace-Formel üben)
Der Tutor hat zwei Rollen (Nutzer): Bei der Selbsteinschätzung ist er *Guide* (Wegweiser), danach auf der einzelnen Seite *echter Tutor*. Die frühere Formulierung "Wegweiser, kein Lehrer" gilt nur für die erste Rolle.
- Stufe 2 im Beispiel: Das Kind kommt von der Seite "Laplace-Formel" mit "Ich habe auf .../laplace/tutor/?laplace-zaehlen=54&laplace-urne=56 geübt" zurück: Nr. 54 richtig im 1. Versuch, Nr. 56 noch nicht gelöst (Eingabe 0,16, Meldung der App "Lies dazu noch einmal den Text über der Aufgabe", 1 von 2 richtig).
- Der Assistent (Mistral Vibe) öffnet die Aufgabe selbst, lobt Nr. 54 knapp, erkennt aus der Eingabe 0,16 das Abschneiden statt Runden und stellt eine Leitfrage (Wie viele Kugeln insgesamt, wie viele blau?), ohne die Lösung zu nennen. Das Kind tippt 0,17 und sagt selbst: "habe falsch gerundet".
- Wirkung: Die Eingabe des Kindes macht den Unterschied. Die App liefert sie mit; ein Assistent ohne diese Information würde nur "falsch" sagen.
- Mistral, ChatGPT und Claude können das nach Nutzer (Mistral getestet, die anderen erwartet). Das ist ein Beleg, dass der Ablauf nicht an einen Anbieter gebunden ist. Der Auswahlkasten der App bietet alle drei und "Text kopieren".
- Folge für den Abschnitt: Der Auszug zeigt am besten dieses Beispiel (kurz, ein Fehler, eine Leitfrage, Selbstkorrektur). Zeigt Rolle 1 (Guide) als Satz, Rolle 2 (Tutor) als Dialog.

## Explore
### Tasks
- [x] Mit dem Nutzer klären: Inhalt, Zielgruppe und Platz des KI-Abschnitts
- [ ] Vor dem Plan klären: Reicht ein Abschnitt mit Nav-Eintrag (Anker), oder eine eigene Seite `/ki/`?

### Completed
- [x] Created development plan file
- [x] Startseite, Texte (de/en) und README gesichtet

## Plan
*Entrance criteria: Explore abgeschlossen (Startseite, Sprachdateien de/en, Skills pdt/arc42-language gesichtet); Nutzer hat Fortfahren bestätigt.*
### Tasks
- [x] Dateien und Muster gesichtet: `index.njk`, `features.njk` (Seite pro Sprache per Pagination, `l.t.<key>`), `nav.js`, `languages.js`, `llms.txt`, README-Tabelle, `site-frame/check.mjs` (defekte Links)
- [x] Einordnung geprüft (docs/overview.md) und mit dem Nutzer geklärt: Feature des Explainers, Architektur statt Plattform-Design (siehe Key Decisions)
- [x] Nutzer bestätigt den Plan (Phasengrenze): "Weiter mit code"

### Completed
*None yet*

## Code
*Entrance criteria: Plan liegt vor und der Nutzer hat ihn bestätigt.*
### Tasks
Reihenfolge so, dass nach jedem Schritt `npm run build && npm run check` grün bleibt.
- [x] 1. Texte: `de.js` und `en.js` bekommen `landing.ki` (Abschnitt: Überschrift, Frage, Antwort, Dialog, Datenschutz, Links zu `/tutor/` und `/tooling/`) und einen neuen Schlüssel `tutor` (Seite: meta, hero, Funktionen, Regeln des Tutors, Grenzen, für Macher, cta). Gleiche Struktur in beiden Dateien, einfaches Deutsch (ISO 24495-1), "du". Grundlage: `.vibe/sketch-ki-abschnitt.md`
- [x] 2. Partial `src/_includes/ki-dialog.njk` (drei Sprechblasen als Text, `role="group"` mit Beschriftung) und `ki-flow.njk` (SVG "Weg der Daten" mit `<title>` und `<desc>`); beide von Startseite und `/ki/` genutzt
- [x] 3. `src/index.njk`: Abschnitt 3b `ki` zwischen `forYou` und `different`, weißer Hintergrund, `aria-labelledby`; Kopfkommentar aktualisieren
- [x] 4. `src/tutor.njk`: Seite pro Sprache, Permalink `{{ l.root }}tutor/index.html`, Aufbau wie `features.njk` (Hero mit Sprungmarken, Abschnitte mit `id` und `scroll-mt-16`)
- [x] 5. `site-frame/nav.js`: Eintrag "Tutor" / "Tutor" (neben "Tooling") mit Kommentar; prüfen, wie viele Einträge der Header bei 360 px verträgt (`frame.css`) und dass `test/language.test.mjs` grün bleibt
- [x] 6. `src/llms.txt`: Zeile zu `/tutor/`; README: Tabelle (Templates), Beschreibung der Startseite und der Seiten
- [x] 7. `src/privacy.njk` geprüft: Es erwähnt KI-Assistenten und die Weitergabe von Ergebnissen nirgends. Nicht geändert (Rechtstext, nur nach Rückfrage); der Nutzer entscheidet, ob ein Satz zur Weitergabe an den Anbieter eines Assistenten in die Datenschutzerklärung soll
- [x] 8. Prüfen: `npm ci`, `npm run build`, `npm run check`, `npm test`; Seiten mit Playwright bei 360 px und 1280 px ansehen (kein horizontales Scrollen, Kontrast, ohne JavaScript lesbar); Screenshots in den Scratchpad
- [ ] 9. Selbstkorrektur lesen: Texte gegen Sketch und Beispiele; keine erfundenen Aussagen (insb. "mit KI gebaut"); englische Fassung lesen

### Completed
- Startseite noch ruhiger (Entwurf B, Nutzer: "wir haben bauen schon weiter unten"): nur Überschrift, ein Satz ("Wir haben die Plattform mit KI und für KI gebaut, vor allem aber für Menschen.") und eine Tutor-Karte im Stil von "Was du davon hast". Entfernt: die Frage "Wie kann das sein?", der Satz "gibt es nur dank KI und funktioniert ganz ohne", der llms.txt-Nebensatz, die Zwischenzeile und die Karte "Beim Bauen". Das Bauen mit KI deckt "Fundament für Macher" und das Tooling ab.
- Überarbeitung nach Rückmeldung des Nutzers (2026-10-29): Startseite nur noch die zwei Karten (Dialog, Weg der Daten und Datenschutz-Kasten entfernt; ein Satz "lernapps.net erfährt davon nichts" in der Lern-Karte). `/tutor/`: neue Überschrift "Ein persönlicher Tutor auf deinem Weg" (en "A personal tutor who can help you on your journey") mit dem Kernargument, dass Lerninhalte lesbar und referenzierbar sind, der eigene Agent begleitet, führt und unterstützt und lernapps.net nichts erfährt; Abschnitt "Für Macher" entfernt (Nutzer verstand ihn nicht); Dialog ohne Titel und Erklärungen, Adressen als gerenderte Links mit Marke, Schritt "Seite geöffnet"; kleine Überschriften neu formuliert, "Guide" als Wort entfernt. Datenschutzerklärung (de und en) um den Abschnitt "KI-Assistenten" ergänzt (keine KI in lernapps.net; Lerninhalte lesbar für Assistenten der Nutzer, vollständig im Rahmen dieser Anwendung, separat zugestimmt, freiwillig), `legal.updated` auf 29. Oktober 2026.
- Beobachtung, nicht von dieser Arbeit: `/privacy/` läuft bei 360 px horizontal über, weil die Überschrift "Datenschutzerklärung" (H1) 401 px breit ist; besteht auch ohne meine Änderungen.
- Umsetzung weicht in zwei Punkten vom Plan ab: Der "Weg der Daten" ist HTML/CSS statt SVG (`ki-flow.njk`, vier nummerierte Kästen plus Hinweis "Kein Server dazwischen"; lesbar mit Screenreader, übersetzbar, bricht bei 360 px sauber um). Auf `/tutor/` steht er im Abschnitt Datenschutz, nicht im Ablauf (sonst zwei nummerierte Listen untereinander).
- Geprüft (2026-10-29): `npm run build`, `npm run check` (ok), `npm test` (10 von 10), kein horizontales Scrollen bei 360 und 1280 px auf `/`, `/tutor/`, `/en/`, `/en/tutor/`; Screenshots im Scratchpad (`shots/build/`). Der Browser leitet nach seiner Sprache auf `/en/` um (frame.js); beide Sprachen sind gebaut.
- Offen für Schritt 9: Texte noch einmal vom Nutzer lesen lassen (insb. "mit KI und für KI gebaut", der gekürzte Dialog, die Regeln des Tutors).

## Commit
*Entrance criteria: Implementierung fertig, Build und Tests laufen grün; Nutzer hat Fortfahren bestätigt.*
### Tasks
- [x] Aufräumen: keine Debug-Ausgaben, TODOs oder auskommentierten Blöcke in `tutor.njk`, `index.njk`, `ki-*.njk`, `nav.js`; Mock-ups liegen nur im Scratchpad
- [x] Dokumentation: README beschreibt den Endzustand (Abschnitt `#ki`, Seite `/tutor/`, Partials); `llms.txt` und Datenschutzerklärung (de, en) ergänzt
- [x] Rebase auf `origin/main`: Die fünf ersten Commits des Branches (668eb07 bis cde7878, Agent-Anweisungen) sind in `main` schon als Squash `8923abd` (PR "guide agent work through the workflows MCP server"); sie fallen beim Rebase weg
- [x] Squash der eigenen Commits zu einem Commit nach dem Commit-Skill (Intent, Key changes, Dependencies and side effects), `.vibe` im selben Commit (Regel in AGENTS.md auf `main`)
- [x] Prüfen nach dem Rebase: `npm ci`, `npm run build`, `npm run check`, `npm test`
- [x] Force-Push mit `--force-with-lease` auf `claude/test-workflows-ki-abschnitt-2`; PR #88 (Titel und Beschreibung) aktualisiert
- [x] Folge-Aufgabe "Navigation" eintragen (unten)

### Folge-Aufgabe: Navigation neu denken (eigener Branch, nach diesem PR)
Anlass: Die Kopfzeile hat mit "Tutor" 8 Einträge (Lernen, Üben, App bauen, Tooling, Tutor, Features, Plattform, Mitmachen); auf dem Handy bricht sie in drei Zeilen um. Der Rahmen `site-frame` ist für alle Sites geteilt (`@lernapps/site`), ein Umbau betrifft Apps, Docs, Tooling, Practice und Mathe-Karte.
- Ziel: weniger Einträge ohne die Komponenten (Tooling, Tutor, Plattform) zu verstecken; Landingpage und Detailseiten besser verbinden.
- Optionen für die Kopfzeile: A drei Gruppen (Lernen: Apps, Üben, Tutor; Bauen: App bauen, Tooling; Plattform: Features, Plattform, Mitmachen); B zwei Ebenen mit Unterleiste je Bereich; C nach Rolle (lernen, bauen, mitmachen); D wenige Hauptpunkte plus Knopf, Sekundäres in der Fußzeile.
- Handy: Burger per `<details>` ohne JavaScript (der Rahmen braucht heute keins); Gruppen als aufklappbare Blöcke.
- Landing und Detail: "Mehr"-Link je Abschnitt auf genau eine Detailseite (Reihenfolge wie in der Kopfzeile), Brotkrumen ("Start › Tutor") mit markiertem Bereich (`aria-current`), Inhaltsverzeichnis "Auf dieser Seite" auf langen Detailseiten, Weiter-Link am Ende ("Weiter: Tooling"), optional drei "Türen" (Lernen, Bauen, Verstehen) am Anfang der Startseite.
- Empfehlung: A plus Brotkrumen und Weiter-Link. Vorher Mock-ups (Desktop und 360 px) von A und B und Entscheidung des Nutzers.
- Rahmenbedingungen: kein JavaScript nötig, WCAG 2.1 AA, kein horizontales Scrollen bei 360 px, beide Sprachen, Tests in `test/language.test.mjs` bleiben grün; Änderung am geteilten Paket muss in den anderen Sites ankommen (Renovate-PRs).
- Mitnehmen: `/privacy/` läuft bei 360 px horizontal über (H1 "Datenschutzerklärung" 401 px breit), besteht schon auf `main`.
- Hinweis für `lernapps/app-templates` (andere Repos, hier nicht geändert): Die Architektur (arc42, Baustein `bb-app-templates`, Konzept `concept-assistants-as-readers`) erwähnt noch nicht die Selbsteinschätzung als Guide, "Warum?" und "Zurück zum Tutor".

### Completed
*None yet*


---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
