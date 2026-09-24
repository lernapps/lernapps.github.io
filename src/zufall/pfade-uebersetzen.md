---
kompetenz: pfade-uebersetzen
beschreibung: '„Genau einmal“, „beide gleich“ und „mindestens einmal“ in Pfade übersetzen: Pfade im Baum anklicken und P(E) berechnen. Übungsaufgaben mit Sofort-Feedback.'
warum: |
  <p>Die Pfadregeln sind leicht – schwer ist die Frage davor: Welche Pfade gehören überhaupt zum Ereignis? „Genau einmal rot“ klingt nach einem Pfad, sind aber zwei. „Beide gleich“ sind so viele Pfade, wie es Farben gibt. Wer diese Übersetzung sicher kann, löst die meisten Aufgaben zu Baumdiagrammen.</p>
regel: |
  <table>
  <thead><tr><th scope="col">Ereignis in Worten (2 Züge)</th><th scope="col">Welche Pfade?</th></tr></thead>
  <tbody>
  <tr><th scope="row">genau einmal rot</th><td>rot-nicht rot <em>und</em> nicht rot-rot – die Reihenfolge zählt.</td></tr>
  <tr><th scope="row">beide gleich</th><td>ein Pfad pro Farbe: rot-rot, blau-blau, …</td></tr>
  <tr><th scope="row">mindestens einmal rot</th><td>alle Pfade mit rot – oder 1 − P(kein rot).</td></tr>
  </tbody>
  </table>
  <p>Dann: jeden Pfad multiplizieren, die Pfade addieren.</p>
beispiel: |
  <p>Urne mit 3 roten, 2 blauen und 1 gelben Kugel, zweimal ziehen <strong>mit Zurücklegen</strong>. Wie groß ist P(beide gleich)?</p>
  <ol>
  <li>Pfade: rot-rot, blau-blau, gelb-gelb.</li>
  <li>Produkte: 3/6 · 3/6 = 9/36, 2/6 · 2/6 = 4/36, 1/6 · 1/6 = 1/36.</li>
  <li>Summe: 14/36 = 7/18.</li>
  </ol>
video:
  id: Pi1M1F2l024
  titel: Summenregel | Wahrscheinlichkeitsrechnung | Mathematik | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Der Baum aus dem Beispiel. Orange sind die drei Pfade von „beide gleich“, unter den Enden stehen die Pfadwahrscheinlichkeiten.'
  uebung: 'Fragt die Aufgabe nach Pfaden, klick auf das Ende eines Pfades.'
  funktion: zeichnePfadeUebersetzen
  modul: pfadregel-2
  seed: 1
  geloest: true
  vorgaben:
    urne: 3r2b1g
    zuege: 2
    modus: mit
    ereignis: beidegleich
---
