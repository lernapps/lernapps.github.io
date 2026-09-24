---
kompetenz: pfadregel-2
serlo: { url: 'https://de.serlo.org/mathe/189811/pfadregeln', titel: 'Pfadregeln' }
beschreibung: 'Zweite Pfadregel (Summenregel): Pfade eines Ereignisses addieren. Mit anklickbarem Baum, Beispiel, Video und Übungsaufgaben.'
warum: |
  <p>Viele Fragen passen nicht zu einem einzigen Pfad: „genau einmal rot“ kann rot-blau oder blau-rot sein. Die zweite Pfadregel sagt, wie du solche Pfade zusammenrechnest. Und darauf kommt es an: das Ereignis in Worten richtig in Pfade zu übersetzen.</p>
regel: |
  <p><strong>2. Pfadregel (Summenregel):</strong> Gehören mehrere Pfade zu einem Ereignis, dann <strong>addierst</strong> du ihre Pfadwahrscheinlichkeiten.</p>
  <div class="formel"><code>P(E) = P(Pfad 1) + P(Pfad 2) + …</code></div>
  <p>Merkhilfe: <strong>entlang</strong> des Pfades <strong>mal</strong>, <strong>über</strong> mehrere Pfade <strong>plus</strong>.</p>
  <p>Mehr dazu: <a id="formen" href="ergebnisformen.html">Wahrscheinlichkeiten als Produkt, Summe oder Potenz angeben</a> und <a id="uebersetzen" href="pfade-uebersetzen.html">Ereignisse in Pfade übersetzen</a>.</p>
beispiel: |
  <p>Urne mit 3 roten, 2 blauen und 1 gelben Kugel, zweimal ziehen <strong>ohne Zurücklegen</strong>. Wie groß ist P(genau einmal rot)?</p>
  <ol>
  <li>Pfade finden: rot-blau, rot-gelb, blau-rot, gelb-rot. (rot-rot ist <em>zweimal</em> rot, gehört nicht dazu.)</li>
  <li>Jeden Pfad multiplizieren: 3/6 · 2/5, 3/6 · 1/5, 2/6 · 3/5, 1/6 · 3/5.</li>
  <li>Addieren: 6/30 + 3/30 + 6/30 + 3/30 = 18/30 = 3/5.</li>
  </ol>
  <p>Kürzer: „genau einmal rot“ = rot-nicht rot + nicht rot-rot = 3/6 · 3/5 + 3/6 · 3/5 = 2 · 9/30 = 3/5.</p>
video:
  id: Pi1M1F2l024
  titel: Summenregel | Wahrscheinlichkeitsrechnung | Mathematik | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Der Baum aus dem Beispiel. Orange sind die vier Pfade von „genau einmal rot“, unter den Enden stehen alle Pfadwahrscheinlichkeiten.'
  uebung: 'Fragt die Aufgabe nach Pfaden, klick auf das Ende eines Pfades.'
  funktion: zeichnePfadregel2
  seed: 3
  geloest: true
  vorgaben:
    urne: 3r2b1g
    zuege: 2
    modus: ohne
    ereignis: genau1r
    art: pfade
---
