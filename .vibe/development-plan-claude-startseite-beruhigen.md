# Development Plan: lernapps.github.io (claude/startseite-beruhigen branch)

*Generated on 2026-10-29 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Die Startseite (`src/index.njk`, Texte in `landing` in `src/_data/de.js` und `en.js`) beruhigen: optisch (vor allem am Desktop) und sprachlich. Sie unterbricht sich oft selbst, und Absprungmarken (Links, Buttons) unterbrechen den Lesefluss. Beide Sprachen im Gleichschritt.

Basis: Branch `claude/test-workflows-ki-abschnitt-2` (PR #88), weil die Startseite dort den KI-Abschnitt `#ki` enthält. Die Änderung baut auf PR #88 auf.

## Key Decisions
- Neuer Branch `claude/startseite-beruhigen`, abgezweigt von PR #88 (nicht von `main`), damit `#ki` dabei ist.

- Umfang A: nur Stil und Text, die Abschnitte bleiben (Nutzer, 2026-10-29).
- Absprungmarken: weniger stören, auf dem Desktop neben den Block legen (Nutzer-Idee). Eine Anzeige erst bei Scrollen, Hover oder Fokus verwerfe ich: auf Touch und für Tastatur und Screenreader nicht verlässlich, und ohne JavaScript nicht möglich. Vorschlag: Schmale Spalte links mit Überschrift und dem einen Link, der Inhalt rechts (ab lg); auf dem Handy der Link unter dem Text. Karten werden als Ganzes zum Link, die Buttons darunter entfallen. Zu entscheiden in der Plan-Phase mit Mock-up.

- Die Seite wirkt steril, nicht wie „hier gibt es mehr als Vaporware“. Entscheidung: Galerie mit Screenshots. Immer eine App groß (Browserfenster und Handy), die anderen als Vorrat daneben, zum Wechseln per Klick und Tastatur. Kein automatisches Durchwechseln. Keine Namen der Macher (Nutzer, 2026-10-29).
- Screenshots: acht Aufnahmen (4 Apps, je Desktop 1280×800 und Handy 390×780 bei 2×) von den laufenden Apps unter `lernapps.net/apps/start/…`, als WebP ca. 394 KB zusammen. Liegen im Scratchpad (`apps/webp/`), noch nicht im Repository. Zustände: Mathe-Karte „Prozentsatz“ mit Bild, Kniffel im Erklärmodus mit Spielblock, Textcheck Stufe 1 mit Text, Naturwunder-Quiz mit Everest-Frage.

- Texte: Der Wert muss erkennbar sein, kein Gelaber. Jeder Abschnitt hat eine Überschrift, einen Satz mit dem Nutzen und höchstens einen Link. Details stehen auf den Unterseiten (Nutzer, 2026-10-29).
- Verspielt, aber nicht lächerlich: Textmarker auf besonders wichtigen Begriffen (Nutzer). Er erscheint beim Hineinscrollen, aber nur, wenn Bewegung erlaubt ist. Umsetzung ohne JavaScript: Der Marker ist standardmäßig fertig sichtbar. Nur unter `@media (prefers-reduced-motion: no-preference)` und `@supports (animation-timeline: view())` läuft er als scrollgesteuerte Animation (`background-size` von 0 auf 100 %, `animation-range: entry 10% cover 30%`). Browser ohne die Funktion und Nutzer mit „Bewegung reduzieren“ sehen den Marker also sofort und vollständig. Der Marker nutzt eine helle Farbe, die Textkontrast bleibt nach WCAG 2.1 AA (dunkler Text auf Gelb). Pro Abschnitt höchstens ein Begriff.
- Rotstift-Haken im Hero und Heftkaro hinter der Galerie: bestätigt (Nutzer, 2026-10-29). Bewegte Effekte wie das Hineingleiten des Handys oder die Aufgabe im Hero: nicht aufgenommen.

- Dunkelmodus jetzt, in diesem PR (Nutzer, 2026-10-29): Die Apps der Screenshots (außer Kniffel, das schon dunkelgrün ist) haben einen Dunkelmodus aus den Vorlagen (Erklär-App, Quiz). Umsetzung nur für die Seiten dieses Repositories, ohne Schalter und ohne JavaScript, per `prefers-color-scheme: dark`:
  - Die hellen Abschnitte bekommen dunkle Werte über eine Überschreibung der verwendeten Tailwind-Klassen (`bg-white`, `bg-slate-50`, `text-slate-*`, `border-slate-*`, `text-blue-*`, …), ausgeliefert als Preflight in `uno.config.js`, damit alle Seiten sie erhalten. Dunkle Abschnitte (Hero, Regeln, Schluss) bleiben, wie sie sind.
  - `color-scheme: light dark` auf `:root`.
  - Galerie: `home.css` bekommt dunkle Werte (Bühne, Vorschauen), die Screenshots wechseln über `<picture>` mit `prefers-color-scheme: dark` zu dunklen Aufnahmen (Mathe-Karte, Textcheck, Naturwunder-Quiz); Kniffel bleibt.
  - Nicht angefasst: `site-frame/tokens.css` und `frame.css`. Sie gelten für alle Sites (Doku, Apps) und bekommen einen Dunkelmodus erst zusammen mit der Navigation. Header und Footer sind schon dunkel.
  - Prüfen: Playwright mit `colorScheme: 'dark'`, Kontrast aller Text-Flächen-Paare auf allen Seiten dieses Repositories (de und en, 1440 und 360 px).

## Notes
Befund Explore (Desktop 1440 px, 9 Abschnitte, Seite ca. 6500 px hoch):

Optisch
- Der Hintergrund wechselt in jedem Abschnitt: dunkel, weiß, grau, weiß, dunkel, weiß, grau, weiß, blau, dunkel. Drei dunkle oder blaue Blöcke unterbrechen die helle Mitte.
- Vier verschiedene Breiten (max-w-3xl, 4xl, 5xl) und mehrere Überschriftengrößen (1.5 bis 3 rem).
- Karten in fast jedem Abschnitt (4 Apps, 3 Zielgruppen, Datenschutz-Box, KI-Karte, 2 dunkle Karten), jede mit eigenem Aufbau: Icon, Kicker in Großbuchstaben, Titel, Text, Button.
- Sieben gefüllte blaue Buttons, dazu Umrandete und Textlinks: nichts ist wichtiger als anderes.

Sprachlich
- Über jeder Gruppe steht ein Einleitungssatz, darunter Karten, darunter ein Hinweis: Überschrift, Intro, Inhalt, Fußnote, Link. Das wiederholt sich neunmal.
- Viele kurze Sätze und Parolen als Überschriften („Lern-Apps ohne Haken.“, „Lernen, im eigenen Tempo.“, „Stimmt. Aber diese gehört keiner Firma.“, „KI ist überall. Auch hier. Und trotzdem geht alles ohne.“).
- „Zwei Wege für dein Kind“ in der Einleitung, aber drei Karten darunter.
- Abschnitt „Was du davon hast“ endet mit einem Satz, der den Rest der Seite abwertet („Mehr musst du nicht wissen. Der Rest … “).
- Showcase: nach den Karten folgen drei Textebenen (Link, „early“, „lasting“ und „honest“ als Kleingedrucktes).

Absprungmarken im Lesefluss (ca. 16 Links im Hauptteil)
- Hero: 2 Buttons plus Katzenbutton.
- Showcase: „Alle Apps“ plus vier Kartenlinks.
- Was du davon hast: 3 Buttons, Datenschutzlink, „Zu den Apps“ mitten im Satz.
- KI: Button. Fundament: Button. Plattform: „Mehr dazu“ im Punkt 1 plus 2 Buttons. Mitmachen: Button. Gründer: Link. Schluss: 2 Buttons.

## Explore
### Tasks
- [x] Startseite und Texte gelesen, Desktop-Screenshot gemacht (`shots/home-desktop-before.png` im Scratchpad)
- [x] Befund in Notes festgehalten
- [ ] Mit dem Nutzer klären, wie weit die Beruhigung gehen soll (Umfang, siehe Notes)

### Completed
- [x] Created development plan file

## Plan
### Entwurf
Leitregeln für die ganze Seite:
- Hintergründe: Hero dunkel, Schluss blau, alles dazwischen im Wechsel weiß und `slate-50`. Der dunkle Block „Fundament für Macher“ wird hell.
- Eine Breite (`max-w-5xl`) und eine Überschriftengröße (H2) für alle Abschnitte außer Hero.
- Pro Abschnitt: H2, ein zusammenhängender Text (kein eigener Einleitungssatz plus Hinweiszeile), der Inhalt, höchstens ein Link, immer am Ende des Abschnitts. Kein Link mitten im Satz.
- Gefüllte Buttons nur im Hero (2) und im Schluss (2). Überall sonst Textlinks.
- Keine Karten, wo es nur Text gibt: „Was du davon hast“ und „Fundament“ werden offene Spalten mit dünner Trennlinie (Variante v3). Auch die KI-Karte wird ein offener Block. Karten gibt es nur noch in der Galerie.
- Texte: ganze Sätze statt Parolen, keine Fußnoten, „Mehr musst du nicht wissen“ entfällt, „Zwei Wege“ wird „Drei Wege“ oder entfällt. Beide Sprachen im Gleichschritt.

Galerie (neuer Abschnitt `#beispiele`, ersetzt „Ein paar Apps aus dem Katalog“):
- Aufbau wie im Mockup `mocks3/gallery.html` im Scratchpad: links die große Bühne (Browserfenster mit Desktop-Screenshot, davor ein Handy mit dem Handy-Screenshot), darunter Bereich, App-Name, ein Satz, „App öffnen →“. Rechts (ab 960 px) die anderen Apps als Vorrat, auf dem Handy eine waagerechte Leiste unter der Bühne.
- Ohne JavaScript: Optionsfelder (`input type=radio`) mit `label`, die Bühne wird per CSS (`:checked ~`) gewechselt. Pfeiltasten wechseln die App, Fokus ist sichtbar. Alle vier Bühnen stehen im HTML (nur eine sichtbar), damit Suchmaschinen und KI-Assistenten alles lesen können.
- Die Bilder: `src/media/apps/<app>-desktop.webp` und `-phone.webp`, `loading="lazy"`, `width`/`height` gesetzt, Alt-Text beschreibt die App („Textcheck: Stufe 1 mit markiertem Wort“).
- Kein automatisches Wechseln, keine Namen der Macher.
- Überarbeitet nach Rückmeldung (Nutzer, 2026-10-29): Kein Einleitungstext, auch nicht „Apps liegen bei den Machern“. Überschrift „Aus dem Katalog“ (nicht „Beispiele aus dem Katalog“, sonst doppelt mit dem Label). Unter dem Bild nur eine Zeile: App-Name als Link und ein Einzeiler (Mathe-Karte: „Mathe Schritt für Schritt erklärt, mit Bild und Aufgaben.“, Kniffel-Trainer: „Wahrscheinlichkeit spielerisch verstehen beim Kniffeln.“, Textcheck: „Aufmerksam lesen: Fehler im Text finden.“, Naturwunder-Quiz: „Erdkunde-Quiz mit einer Erklärung zu jeder Antwort.“). Der Vorrat daneben trägt die Überschrift „Beispiele“, damit niemand denkt, es gäbe nur vier Apps. Darunter der Button „Mehr im App-Katalog →“ (umrandet, kein gefüllter Button). Der Link „Alle Apps ansehen“ entfällt.
- UnoCSS erzeugt nur Klassen aus dem gebauten HTML. Für `:checked ~` und Fokus brauche ich entweder Varianten wie `peer-checked:` oder eine kleine Stilregel in `src/_includes` (Inline-`<style>` nur für die Galerie). Entscheidung in der Code-Phase nach Test.
- Hero: die fünf Pillen werden eine ruhige Zeile mit Punkten.

Offen, aber nicht blockierend: Everest-Foto in der Naturwunder-Aufnahme. Die Quelle steht im Screenshot selbst (Nutzer, 2026-10-29), das reicht.

### Texte (Entwurf, Deutsch; Englisch folgt nach Freigabe)
Marker = Begriff mit Textmarker. Jeder Abschnitt: Wert, Satz, ein Link.

| Abschnitt | Hauptwert | Text |
|---|---|---|
| Hero | Gratis und sofort startklar, ohne Haken | H1 „Lern-Apps **ohne Haken**.“ (Marker, dazu Rotstift-Haken vor den Merkmalen). Untertitel: „Kostenlos im Browser, sofort startklar.“ Merkmale mit Haken: Kein Konto · Keine Werbung · Kein Abo · Eingaben bleiben auf dem Gerät · Auch auf dem Handy. Buttons: App finden, Selbst bauen. Katzenknopf bleibt. |
| Aus dem Katalog | Es gibt echte, laufende Apps | Galerie ohne Text (siehe oben). Button „Mehr im App-Katalog →“. |
| Was du davon hast | Schnell die passende Hilfe, ohne Konto | Spalte 1 „Vertretungsstunde in der 7b?“: „Fach und Klasse wählen, Link teilen oder QR-Code zeigen. Jedes Kind bekommt Rückmeldung, niemand braucht ein Konto.“ → Apps für den Unterricht. Spalte 2 „Dein Kind hängt in einem Thema?“: „Apps erklären Schritt für Schritt, mit Übungen und Rückmeldung. Kostenlos und jederzeit wieder.“ → Apps zum Lernen. Spalte 3 „Nächste Woche ist die Arbeit?“: „Dein KI-Assistent macht aus den Arbeitsblättern eine Übungs-App. In Minuten, ohne Fachwissen.“ → Zum Üben. Darunter eine Zeile: „Kein Konto, keine Cookies, kein Tracking.“ → Datenschutzerklärung. Entfällt: Zwischentext „Zwei Wege …“, „Mehr musst du nicht wissen …“. |
| Dein Tutor | Eigene KI lernt mit dir, lernapps.net erfährt nichts | H2 „Dein eigener **Tutor**.“ (Marker). „Jede Erklär-App gibt deinem KI-Assistenten die Aufgabe. Er begleitet dich geduldig, und lernapps.net erfährt nichts davon.“ → So funktioniert der Tutor. Entfällt: „KI ist überall …“ und der Satz „mit KI und für KI gebaut“. |
| Für Macher | Eine App bauen ist einfach | H2 „Du bringst die **Idee**. Wir bringen das Fundament.“ (Marker auf „Idee“). Zwei kurze Zeilen: „Du: Idee, Fachwissen, Erfahrung aus Klasse und Küchentisch.“ „Wir: Grundgerüste, Methodik, Werkzeuge zum Bauen, Prüfen und Eintragen.“ Dazu: „Dein KI-Assistent hilft beim Bauen, und die App bleibt deine.“ Ein gefüllter Button „Eine App bauen“ (`/apps/build/`) und der Textlink „Was die Apps können“. Der Schlussblock behält seine zwei Buttons. |
| Mitmachen | (entfällt) | Zusammengelegt mit „Für Macher“ (Nutzer, 2026-10-29). Die `id` `mitmachen` wandert an „Für Macher“, weil Hero-Button und Header darauf verweisen. Der Satz „mit KI und für KI gebaut“ entfällt auf der Startseite ganz. |
| Plattform | Gehört keiner Firma | H2 „Noch eine Plattform? Diese gehört **keiner Firma**.“ Drei Punkte, je eine Zeile: „Niemand verdient daran: kein Abo, keine Werbung, kein Datenverkauf.“ / „Ein Ort zum Austausch: Rückmeldung und Danke kommen bei den Machern an.“ / „Offen: Regeln, Plan und Quellcode sind öffentlich.“ → Alle Prinzipien. Entfällt: Einwand-Zitat, Einleitungsabsatz, zweiter Link, „Mehr dazu“. |
| Gründer | Ein Mensch steht dahinter | Zitat ohne Überschrift: „Es fehlt nicht an Tablets und WLAN. Es fehlt ein Ökosystem, das gute Ideen dorthin bringt, wo sie gebraucht werden.“ Oliver Jägle, Gründer von lernapps.net. → Mehr über uns. |
| Schluss | Nächster Schritt | „Finde eine App für morgen. Oder bau die, die fehlt.“ Buttons: App finden, Eine App bauen. Entfällt: „Lebt von Leidenschaft …“ und der Untertitel. |

Gestrichen insgesamt: Fußnoten („früh“, „lasting“, „honest“), Rollenkicker in Großbuchstaben, Emoji-Icons, der blaue Datenschutzkasten.

### Tasks
- [x] Mockup der Galerie (Desktop und 360 px, Tastatur) gebaut und vom Nutzer gesehen
- [x] Nutzer bestätigt den Entwurf (Galerie, Leitregeln, deutsche Texte, 2026-10-29)
- [x] Deutsche Texte für alle Abschnitte entworfen. Die englische Fassung entsteht in der Code-Phase (siehe dort).

### Completed
- [x] Entwurf der Leitregeln und der Galerie

## Code
### Tasks
- [x] Bilder: acht WebP nach `src/media/apps/` kopieren, prüfen, dass der Build sie in `_site/media/apps/` ausliefert (Passthrough für `src/media` besteht)
- [x] Texte: `landing` in `de.js` und `en.js` anpassen (Struktur: `gallery` statt `showcase`, weniger Felder; `maker` ersetzt `different` und `join`, `id` `mitmachen`/`get-involved` wandert dorthin). Englisch aus der deutschen Fassung ableiten.
- [x] Textmarker (`.mark`), Rotstift-Haken (SVG, `aria-hidden`) und Heftkaro als kleine Stilregeln; Marker-Animation nur mit `prefers-reduced-motion: no-preference` und `@supports (animation-timeline: view())`
- [x] `src/index.njk`: Galerie, ruhige Abschnitte, Hintergründe, Buttons, Links nach den Leitregeln
- [x] Kommentar in `index.njk` und `README.md` (Abschnittsliste, Beschreibung der Galerie) nachziehen
- [x] Neuer Test `test/home.test.mjs` (läuft nach dem Build gegen `_site/index.html` und `_site/en/index.html`, überspringt sich mit Hinweis, wenn `_site` fehlt):
  - Galerie: so viele Optionsfelder wie Bühnen und Vorschauen, genau eines vorausgewählt, jedes `label for` trifft ein Feld.
  - Jedes Bild hat `alt`, `width`, `height`, und die Datei liegt in `_site/media/apps/`.
  - Keine externen Adressen auf der Seite (`src`/`href` mit `http`, außer `chat.mistral.ai` gibt es nur auf `/tutor/`).
  - Gleichschritt: de und en haben gleich viele Abschnitte, Links, Bilder und gefüllte Buttons (höchstens 4 gefüllte blaue Buttons).
  - Alle Anker `#…` auf der Seite führen zu einer vorhandenen `id`.
- [x] Von Hand mit Playwright (nicht im Repository, Playwright ist keine Abhängigkeit): Screenshots Desktop 1440 px und 360 px, beide Sprachen, mit abgeschaltetem JavaScript; kein waagerechter Überlauf; Tastatur durch die Galerie (Tab, Pfeiltasten); Kontraste (WCAG 2.1 AA) der neuen Texte und Buttons.
- [x] Prüfen: `npm run build`, `npm run check`, `npm test`; Screenshots Desktop 1440 px und 360 px, beide Sprachen, ohne JavaScript; kein waagerechter Überlauf; Tastatur durch die Galerie; Kontraste (WCAG 2.1 AA)
- [x] Ankerlinks prüfen: `#beispiele`, `#fuer-dich`, `#ki`, `#mitmachen`, `#plattform` (Header, Footer und andere Seiten verweisen darauf)

### Completed
*None yet*


Ergebnis Code (2026-10-29): Seite von 6492 auf 3960 px Höhe (Desktop). Geprüft mit Playwright in de und en, bei 1440 und 360 px, mit und ohne JavaScript: kein waagerechter Überlauf, keine kaputten Bilder, keine Konsolenfehler; Pfeiltasten wechseln die App (Fokus sichtbar); `prefers-reduced-motion: reduce` zeigt den Marker sofort vollständig, `no-preference` startet ihn bei 0 % und lässt ihn einlaufen. `npm run build`, `npm run check` und `npm test` (21 Tests, davon 11 neu in `test/home.test.mjs`) grün. Die Anker `#mitmachen`/`#get-involved` bleiben erhalten; die übrigen Anker der Startseite werden von keiner anderen Seite verlinkt.

### Dunkelmodus (2026-10-29)
- [x] Sechs dunkle Screenshots (Mathe-Karte, Textcheck, Naturwunder-Quiz; Desktop und Handy, 332 KB) nach `src/media/apps/*-dark.webp`, `<picture>` mit `prefers-color-scheme: dark`; Kniffel bleibt.
- [x] Überschreibung der hellen Abschnitte als Preflight in `uno.config.js`, nur für Nachfahren von `.bg-white` und `.bg-slate-50`; `color-scheme: light dark`; dunkle Galerie in `home.css`.
- [x] Kontrastscan (Playwright, alle 15 Seiten, hell und dunkel, 1440 px): 0 Fehler (WCAG 2.1 AA: 4,5:1, großer Text 3:1). Ein erster Lauf fand 12 Fehler auf 404, Datenschutz und Impressum, weil die Fläche nur an `section` und `div` hing; jetzt an jedem Element außer Link und Knopf.
- [x] Test: die dunklen Bilder liegen im Build; Struktur de/en gleich (jetzt auch `<source>`).
- [x] Marker natürlicher (Nutzer): Strich mit schrägen, weichen Enden, ungleichen Ecken, zweitem Strich und feinem Korn (SVG als Data-URI, keine Anfrage), 82 % der Zeilenhöhe; im Dunkelmodus ein weicheres Gelb (`#facc15`). Das Browser-Gelb von `<mark>` wird mit `background-color: transparent` abgestellt. Kontrastscan weiter 0 Fehler; ohne Bewegung fertig, mit Bewegung startet er bei 0.
- [x] Rahmen der Bedienelemente auf mindestens 3:1 (WCAG 1.4.11): Vorschauen hell `#7c8ba1` (3,5:1 auf Weiß), dunkel `#5d6d87` (3,6:1 auf `#0b1220`); die umrandeten Knöpfe („Mehr im App-Katalog“, „Eine App bauen“) von `border-slate-400` auf `border-slate-500` (4,8:1 hell, 3,9:1 dunkel). Die ersten Vorschlagswerte (`#94a3b8`, `#475569`) erreichten nur 2,5:1; die Werte stehen jetzt gerechnet im Plan.
- [x] Zwei Kleinigkeiten (Nutzer): Die große Vorschau der Galerie ist ein Link zur Katalogseite der App (dasselbe Ziel wie die Bildunterschrift; der Vorschau-Link ist für Hilfstechnik und Tab-Reihenfolge ausgeblendet, damit niemand zwei gleiche Links trifft). Das GitHub-Avatar des Nutzers (Konto `mrsimpson`, abgeleitet vom PR-Autor) steht als lokale Datei `src/media/oliver-jaegle.webp` (192×192, 3 KB) neben dem Gründerzitat; `alt=""`, weil der Name daneben steht.
- [x] Avatar im Dunkelmodus abgedunkelt statt invertiert (Nutzer wählte C): `filter: brightness(.78) contrast(1.08)`; Invertieren macht aus einem Gesichtsfoto ein Negativ.
- [x] Icons statt Emoji (Nutzer): 24 Lucide-Icons (ISC) als eingebettetes SVG in `src/_data/icons.js`, Shortcodes `icon` und `iconDefs` in `eleventy.config.js`; mildes Wackeln per SVG-Filter `rough` (`baseFrequency` 0,08, `scale` 1,2), gesetzt auf einer Gruppe im SVG, nicht im Stylesheet, damit jeder Browser den Filter findet. Emoji in den Texten (`de.js`, `en.js`) durch Icon-Namen ersetzt; Templates features, join, tutor, cat-player und ki-flow angepasst. Neue Tests: kein Emoji im gebauten HTML, jede Seite mit Icons definiert den Filter. Doodle Icons nicht verwendet (Lizenz nicht sicher geklärt).
- [x] Katzenvideo unauffälliger (Nutzer): kein Knopf mehr, sondern eine Zeile „Lieber Katzenvideos“ mit Katzen-Icon (rot wie die Haken) unter den Eigenschaften; ohne JavaScript ein Link auf das MP4 mit der Videobeschreibung als versteckter Text. Dialog und Endkarte getestet.
- Folgeaufgabe: Dunkelmodus für `site-frame/tokens.css` und `frame.css`, zusammen mit der Navigation, damit Doku und Apps nachziehen.

## Commit
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
