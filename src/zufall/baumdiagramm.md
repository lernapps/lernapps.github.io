---
kompetenz: baumdiagramm
serlo: { url: 'https://de.serlo.org/mathe/156048/mehrstufige-zufallsexperimente', titel: 'Mehrstufige Zufallsexperimente' }
beschreibung: 'Baumdiagramm zu einem mehrstufigen Zufallsversuch zeichnen: Zweige, Wahrscheinlichkeiten, mit und ohne Zurücklegen. Mit Baum-Bauer und Übungsaufgaben.'
seitenSkript: js/seiten/baum-bauen.js
warum: |
  <p>Sobald du zweimal ziehst, wirfst oder würfelst, wird es unübersichtlich: Was kann beim ersten Mal passieren, was danach? Das Baumdiagramm ordnet alle Möglichkeiten Stufe für Stufe. Mit einem sauberen Baum lösen sich die Pfadregeln fast von allein – ohne Baum verliert man schnell einen Fall.</p>
regel: |
  <p>Ein <strong>mehrstufiger Zufallsversuch</strong> besteht aus mehreren Zügen (Stufen). Für jede Stufe zeichnest du <strong>Zweige</strong> zu allen möglichen Ergebnissen.</p>
  <ul>
  <li>An jeden Zweig schreibst du seine <strong>Wahrscheinlichkeit</strong> (Laplace: günstig/möglich).</li>
  <li>Die Zweige an einem Knoten ergeben zusammen immer <strong>1</strong>.</li>
  <li>Ein Weg von links nach rechts bis zum Ende heißt <strong>Pfad</strong>.</li>
  <li><strong>Ohne Zurücklegen</strong> ändern sich ab der zweiten Stufe Zähler und Nenner (siehe Kompetenz 5).</li>
  </ul>
beispiel: |
  <p>In einer Urne liegen 3 rote und 2 blaue Kugeln. Du ziehst zweimal <strong>ohne Zurücklegen</strong>. Das Bild unten zeigt den fertigen Baum.</p>
  <ol>
  <li><strong>1. Stufe:</strong> 5 Kugeln. P(rot) = 3/5, P(blau) = 2/5. Zusammen 1.</li>
  <li><strong>2. Stufe nach rot:</strong> nur noch 4 Kugeln, davon 2 rote. P(rot) = 2/4, P(blau) = 2/4.</li>
  <li><strong>2. Stufe nach blau:</strong> 4 Kugeln, 3 rote, 1 blaue. P(rot) = 3/4, P(blau) = 1/4.</li>
  <li>Rechts stehen schon die Pfadwahrscheinlichkeiten (Kompetenz 4). Ihre Summe ist 1 – ein guter Test für jeden Baum.</li>
  </ol>
video:
  id: mBknBnww5fA
  titel: Baumdiagramm | mehrstufiger Zufallsversuch | Wahrscheinlichkeit | Stochastik | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Der Baum aus dem Beispiel: Urne mit 3 roten und 2 blauen Kugeln, zweimal ohne Zurücklegen. Erst alle Zweige, dann die Kugeln, dann die Brüche.'
  uebung: 'Einige Zweige fehlen (a, b, …).'
  funktion: zeichneBaumdiagramm
  seed: 2
  geloest: true
  vorgaben:
    urne: 3r2b
    zuege: 2
    modus: ohne
---
