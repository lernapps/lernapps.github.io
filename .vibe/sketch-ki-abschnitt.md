# Sketch: Abschnitt "KI" auf der Startseite

Stand: Entwurf zur Diskussion. Texte in einfachem Deutsch (ISO 24495-1, "du"). Noch nichts in `de.js`, `en.js` oder `index.njk`.

## Entscheidung nach Rückmeldung (zwei Ebenen)

Die Story ist für die Startseite zu verzweigt. Die KI-Funktionen im Explainer sind aber so wertvoll, dass sie im Detail gezeigt werden sollen. Darum zwei Ebenen:

1. **Startseite: kurzer Abschnitt `ki`** (eine Aussage, ein Beweis): Überschrift "KI ist überall. Auch hier. Und trotzdem geht alles ohne.", zwei Sätze ("dank KI gebaut, für KI, vor allem für Menschen"), der Dialog mit einem Satz davor, Datenschutz in zwei Sätzen, ein Link "Alles über KI bei lernapps" → Detailseite. Das Bauen: ein Satz mit Link auf `/tooling/`.
2. **Detailseite `/ki/`** (Nav-Eintrag "KI"): zeigt die Funktionen, wie sie in der Mathe-Karte laufen (selbst geprüft am 2026-10-29):
   - **Selbsteinschätzung und Guide.** 12 Aufgaben, kein Feedback je Aufgabe, am Ende je Seite "Kannst du wahrscheinlich schon" / "Schau sie dir noch einmal an" / "Lies sie genau" / "nicht abgefragt". Ein Klick gibt das Ergebnis und die Eingaben weiter; der Assistent schickt als Guide zur nächsten Seite.
   - **Tutor auf jeder Seite.** Oben auf der Seite "Mit einem KI-Tutor lernen": Assistent wählen (Claude, ChatGPT, Mistral Vibe oder Text kopieren), "Einschalten". Die Wahl gilt für alle Seiten, nur auf diesem Gerät. Der Tutor erklärt die Seite und hilft bei den Übungen.
   - **"Warum?" nach einer falschen Antwort.** Gibt dem Tutor Aufgabe, Eingabe und Meldung der App. Die Meldung der App steht auch ohne KI da ("Leider nicht richtig. Zähle zuerst alle möglichen Ergebnisse...").
   - **"Zurück zum Tutor".** Kopiert, was auf der Seite geübt wurde: je Aufgabe, wie es lief, bei falschen mit Eingabe und Meldung.
   - **Alles lesbar: "Ansehen, was dein Tutor bekommt".** Auf jeder Seite und bei der Selbsteinschätzung. Eltern und Lehrkräfte sehen vorher den ganzen Auftrag.
   - **Regeln des Tutors** (aus der Tutor-Seite): Leitfragen statt Lösung; die Idee hinter dem Fehler benennen; zuerst "Was siehst du?" am Bild; gerechnet wird auf Papier; eine Seite ist geschafft nach drei richtigen Aufgaben und einer Erklärung; auf Wunsch eine Aufgabe von Hand, Foto nur vom Blatt, ohne Namen; Video erst, wenn die Erklärung zweimal nicht gelingt.
   - **Anbieterfrei und freiwillig.** Eigenes Konto beim Anbieter; die App sendet selbst nichts; Datenschutzkasten wie auf der Startseite, ehrlich zu dem, was der Anbieter erhält.
   - **Grenzen.** Ein Assistent kann sich irren, ersetzt keine Menschen; Lernen ist auch sozial; die geprüfte Quelle sind die Seiten.
   - **Für Macher.** Erklär-Apps bringen den Tutor aus dem Grundgerüst mit; Link auf Tooling.
   - **Der Dialog** (Mistral) mit dem Link zum öffentlichen Gespräch; ein weiterer Dialog zu "Warum?" wäre denkbar.
3. Die Aufteilung "mit, für, für Menschen" bleibt als zwei Sätze auf der Startseite; die Langfassung (llms.txt, Gründungsgeschichte) gehört auf die Detailseite oder "Über uns".

## Platz und Form

- Nach "Was du davon hast" (`forYou`), vor "Ein solides Fundament für Macher" (`different`). Hintergrund weiß, damit die Folge slate-50, weiß, slate-800 wechselt.
- id `ki`, `aria-labelledby`, eigener Nav-Eintrag "KI" als Anker `/#ki`. Der Header liegt in `site-frame/nav.js` und gilt für alle Seiten von lernapps.net; ein Eintrag dort ist eine Änderung für alle Sites (zu klären im Plan).
- Ein Abschnitt, keine eigene Seite. Umfang: etwa 250 Wörter plus Dialog.

## Texte

Ton (neu): selbstverständlich statt Strategie-Sprache. KI ist überall; wir tun nicht so, als wäre sie es nicht. Die Spannung ist die Frage "Wie kann das sein?", die Antwort ist der Rahmen für beide Karten.

**Überschrift:** KI ist überall. Auch hier. Und trotzdem geht alles ohne.

**Frage:** lernapps.net gibt es nur dank KI. Und es funktioniert ganz ohne. Wie kann das sein?

**Antwort:** Wir haben die Plattform mit KI gebaut und für KI. Vor allem aber für Menschen.

Drei kurze Zeilen darunter (Liste, je ein Satz; Platz für je ein Symbol):

- **Mit KI gebaut.** Ohne KI-Assistenten hätten wenige Menschen in kurzer Zeit nicht so viel bauen können. (Zu bestätigen: Formulierung muss für das Projekt stimmen, siehe Gründertext "kaum noch Zeit und Geld".)
- **Für KI gebaut.** Jeder Bereich von lernapps.net hat eine `llms.txt`. Ein Assistent findet damit die passende App, versteht die Plattform oder baut selbst eine. [`/llms.txt`]
- **Für Menschen gebaut.** Jede App läuft im Browser, ohne Konto und ohne KI. Wer KI nicht will, verpasst nichts, was die App kann.

**Übergang:** Menschen kommen bei lernapps.net an zwei Stellen mit KI in Kontakt:

### Karte 1 (breit): Beim Lernen. Dein eigener Assistent wird dein Tutor.

Kurz und ehrlich: Lernen ist mehr als ein Gespräch mit einer Maschine. Aber ein Assistent ist geduldig, passt sich dir an und ist immer da. Wer nicht weiß, wo er steht, fragt ihn lieber als eine Klasse.

Vier Schritte:

1. **Einschätzen.** Du machst die Selbsteinschätzung einer App. Das Ergebnis bleibt auf deinem Gerät.
2. **Weitergeben.** Ein Klick kopiert dein Ergebnis und deine Eingaben. Du fügst sie bei deinem Assistenten ein: Claude, ChatGPT, Mistral oder einem anderen.
3. **Gezielt üben.** Der Assistent führt dich als Guide: Er schickt dich zu den Seiten, die noch nicht sitzen. Erklärt und geübt wird auf den Seiten der App.
4. **Nachfragen lassen.** Kommst du mit einer falschen Aufgabe zurück, wird er dein Tutor. Er sieht, was du eingegeben hast, und fragt nach, statt die Lösung zu sagen.

**Dialog (gekürzt, echtes Gespräch mit Mistral):**

> **Kind:** Ich habe auf „Laplace-Formel“ geübt. Aufgabe 56 noch nicht gelöst, meine Eingabe war 0,16.
> **Assistent:** Deine Zahl liegt knapp daneben. Vermutlich hast du abgeschnitten, statt auf zwei Stellen zu runden. Wie viele Kugeln liegen insgesamt in der Urne, und wie viele davon sind blau?
> **Kind:** Ah, 0,17 – ich habe falsch gerundet.

Bildunterschrift: Der Assistent erkennt den Fehler an der Eingabe, nicht nur am Wort „falsch“. [Das ganze Gespräch lesen →](https://chat.mistral.ai/work/8d08a4d7-65ce-4a23-80b4-5ed9a581988d) (öffentlicher Link auf Mistral; öffnet eine fremde Seite).

**Datenschutz-Kasten (blau, wie bei `forYou`):**
Deine eigene KI, nicht unsere. lernapps.net hat keinen Chatbot und erfährt nichts von deinem Ergebnis. Was ein Klick weitergibt, kannst du vorher lesen. Was du bei deinem Assistenten einfügst, geht an dessen Anbieter, und du nutzt dein eigenes Konto. Entscheide selbst, ob du das willst. Ohne KI geht alles auch. [Ansehen, was dein Tutor bekommt →]

> Anmerkung: Der Satz "Alle Daten bleiben bei dir" aus der Mathe-Karte stimmt für die App, aber nicht mehr, sobald man das Ergebnis in einen Assistenten einfügt. Auf der Startseite deshalb die zwei Sätze oben, nicht die Kurzform.

**Grenze (ein Satz):** Ein Assistent kann sich irren, und er ersetzt keine Menschen. Lernen geht auch gemeinsam: mit Freunden, Eltern, Lehrkräften. Die geprüfte Quelle sind die Seiten der App.

**Knopf:** Selbsteinschätzung ausprobieren → `/mathe-karte/einschaetzung/`

### Karte 2 (schmal): Beim Bauen. Dein Assistent baut mit dir.

Eltern und Lehrkräfte bauen Apps mit ihrem KI-Assistenten. Skills, ein Plan und feste Regeln führen ihn durch Fragen, Planen, Bauen und Prüfen. Du entscheidest an festen Punkten mit.

Links: [Eine App bauen →](/apps/build/) · [Das Tooling →](/tooling/)

## Illustrationen (alle als Inline-SVG, mit Text-Alternative, ohne externe Anfragen)

1. **Drei Zeilen "mit, für, für Menschen".** Drei Symbole zur Antwort (Zahnrad oder Funke für "mit KI gebaut", Dokument `llms.txt` für "für KI", Mensch am Gerät für "für Menschen"). Das letzte ist größer und blau: Es ist der Punkt. Danach teilt sich die Linie der Marke ("l" als Route) in zwei Pfade, "Lernen" und "Bauen", und führt zu den zwei Karten.
2. **Der Weg der Daten.** Vier Symbole in einer Reihe: Selbsteinschätzung (Gerät) → Kopieren (Klemmbrett) → dein Assistent (Sprechblase) → zurück zur Seite (Pfeil). Darunter ein durchgestrichenes Server-Symbol mit "kein Server dazwischen". Der Pfeil trägt die Beschriftung "du fügst ein". Das ist die Datenschutz-Pointe als Bild.
3. **Der Fehler im Detail.** Zwei Eingabefelder nebeneinander: "0,16" (rot umrandet, Beschriftung "abgeschnitten") und "0,17" (grün, "gerundet"). Zeigt, warum die Eingabe mehr sagt als ein Punktestand. Kann den Dialog ergänzen, nicht ersetzen.
4. **Dialog als HTML, nicht als Bild.** Die Sprechblasen sind Text (lesbar ohne JavaScript, mit Screenreader und in `en.js` übersetzbar).
5. **Optional, ein Augenzwinkern:** Kater Minka (aus dem Katzenvideo) sitzt neben dem Dialog und schaut auf das Handy. Nur wenn es zum Ton der Seite passt; steht nicht im Weg.

Gestaltung: Farben aus den Tokens (Blau `#60a5fa`/`#2563eb`, Slate), mindestens 4,5:1 Kontrast, bei 360 px Breite eine Spalte, Illustration 2 wird dann hochkant gestapelt.

## Offen

- Name im Dialog: "Mistral" oder neutral "dein Assistent"? (Vorschlag: Bildunterschrift nennt Mistral wegen des Links, der Dialog sagt "Assistent".)
- Header-Eintrag "KI" gilt für alle Sites; Anker `/#ki` reicht für die Startseite.
- Englische Fassung: Dialog bleibt deutsch (Original), Rahmen übersetzt, oder neu gesprochen? Der Link führt ohnehin auf ein deutsches Gespräch.
