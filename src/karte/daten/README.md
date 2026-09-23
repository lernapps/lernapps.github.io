# Datenmodell der Mathe-Karte

Die Daten der Karte liegen als Markdown mit flachem YAML-Frontmatter unter `src/karte/daten/` (edugo-kompatibel: nur Strings, Zahlen und `[a, b]`-Listen, keine verschachtelten Maps). Eleventy liest sie beim Build als Daten der Karte (`src/karte/karte.11tydata.js` → `lib/karte/laden.js`), prüft Referenzen und Enums und rendert daraus `data.json` (ohne Zeitstempel, deterministisch) und die statischen Seiten. Jeder Datenfehler bricht `npm run build` ab. Die Felder je Typ beschreibt `src/karte/schemas/<typ>.schema.json`.

Einträge (Apps) stehen nicht mehr als Markdown hier: eine App des Repositorys trägt sie in ihrer Konfiguration `src/<app>/js/app.config.js` – `APP.kartenEintrag` mit den edugo-Feldern und je Kompetenz `kartenKnoten` (Liste von Knoten-ids). id, Titel, Adresse, Quellcode und Beschreibung kommen aus `APP`, `jahrgaenge` fehlt → `[APP.klasse]`. Apps außerhalb des Repositorys (und übergangsweise noch nicht migrierte) stehen in `externe-eintraege.js`.

## Typen und Ablage

| Typ | Datei | Kern |
|---|---|---|
| Leitidee | `leitideen/<id>.md` | eine der fünf KMK-Leitideen (`reihenfolge`) |
| Kompetenz | `kompetenzen/<id>.md` | Knoten der Karte; `leitidee`, optional `parent` (nur eine Ebene), `kmk-standard` (Wortlaut oder `""` bei Landes-Verfeinerung), `schluesselwoerter` |
| Lehrplan | `lehrplaene/<land>-<schulform>.md` | Dokument eines Landes; `erfasst: nein / teilweise / vollstaendig` |
| Zuordnung | `zuordnungen/<lehrplan-id>.md` | Frontmatter `lehrplan`, Body eine Tabelle `kompetenz \| jahrgang \| einheit \| pflicht` |
| Eintrag | `src/<app>/js/app.config.js` oder `externe-eintraege.js` | App; Knoten (`kartenKnoten` bzw. `kompetenzen`), `aktiv-level` 1–5, `backend`, `external-requests`, `dsgvo`, `evidence`, `jahrgaenge`, `lizenz`, `stand` |

Knoten stehen nicht für Lehrplaneinheiten, sondern für Inhalte: welche Einheit sie in welchem Jahrgang behandelt, steht ausschließlich in der Zuordnung (`einheit` = G9-Nummer wie `7.1`, `pflicht: nein` = fakultativ, `jahrgang: 5/6` mit `einheit: -` = nur im KC-Doppeljahrgang).

## Abdeckung

Der Build (`lib/karte/daten.js`) berechnet je Kompetenz `abdeckung` (Liste der Eintrags-ids, die den Knoten nennen) und `status`: `keine` (kein Eintrag), `ungeprueft` (Einträge vorhanden, keiner mit `dsgvo: green`), `gruen` (mindestens ein Eintrag mit `dsgvo: green`). Grün vergibt kein Eintrag selbst, sondern erst eine Prüfung (edugo: `backend: none`, `external-requests: none` und Netzwerk-Audit).

## Zwei verschiedene Arten von "nichts"

- **Noch nicht erfasst** ist eine Aussage über ein *Land*: `erfasst: nein` im Lehrplan-Stub heißt, niemand hat den Lehrplan bisher auf Knoten abgebildet. Die Karte weiß nichts, nicht "es gibt nichts".
- **Keine Abdeckung** ist eine Aussage über eine *Kompetenz*: `status: keine` heißt, der Knoten ist erfasst und im Lehrplan verortet, aber keine eingetragene App übt ihn. Das ist die Lücke, die die Karte sichtbar machen soll.

## Erweitern

- **Land erfassen:** `lehrplaene/<land>-gymnasium.md` auf `erfasst: vollstaendig` setzen und `zuordnungen/<land>-gymnasium.md` mit der Tabelle anlegen (bei nur teilweise erfassten Jahrgängen `teilweise`). Fehlt ein Inhalt als Knoten, neuen Knoten anlegen und in Offene Punkte begründen. Ein PR, zwei Dateien.
- **App eintragen:** App des Repositorys: `APP.kartenEintrag` und `kartenKnoten` in ihrer `app.config.js`. Fremde App: Eintrag nach `schemas/eintrag.schema.json` in `externe-eintraege.js`. Jede Knoten-id muss existieren, sonst bricht der Build ab.

## Offene Punkte

- KMK-Grundlage sind die Bildungsstandards ESA/MSA in der Fassung vom 23.06.2022 (kmk.org, `2022_06_23-Bista-ESA-MSA-Mathe.pdf`); die Leitidee heißt dort "Strukturen und funktionaler Zusammenhang", die id bleibt `funktionaler-zusammenhang`.
- Das KC Hessen (2011) und der G9-Lehrplan (Übersicht 5.1–10.5) setzen einige Inhalte in verschiedene Jahrgänge; die Zuordnung folgt dem G9-Lehrplan: negative Zahlen (KC 5/6, G9 7.2), Satz des Pythagoras, Ähnlichkeit und reelle Zahlen (KC 7/8, G9 9.x), Potenzen mit rationalen Exponenten (KC 7/8, G9 10.1), Zuordnungen (KC 5/6, G9 7.1).
- Ohne G9-Einheit: "Einfache Prozentangaben" (KC 5/6, Zeile `5/6 | -`), Winkelgrößen in Minuten und Sekunden, Boxplot (nur im Knotentext vermerkt).
- Zusammengelegte KC-Punkte: die Raum-und-Form-Punkte "Beschreibung von Volumen und Oberflächeninhalt" stecken in den Größen-und-Messen-Knoten; die drei "Modelle, Schrägbilder und Netze"-Punkte in einem Knoten; "Runden" (Größen) in `runden`; die Koordinatensystem-Punkte aus Zahl und Operation und Raum und Form in `koordinatensystem`.
- Ohne KMK-Standard (landesspezifisch): `logarithmen`, `prozent-vergleich`, `zufall-ergebnisform`; `quadratische-funktionen` stammt aus G9 9.3.
- 85 Knoten liegen über der Zielgröße von 40–70, weil jede KC-Zeile genau einen Knoten braucht und 15 feingranulare App-Knoten vorgegeben sind. Kandidaten zum Zusammenlegen: die vier Messvorgänge, die Prozent-Grundaufgaben.
