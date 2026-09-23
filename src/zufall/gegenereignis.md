---
kompetenz: gegenereignis
beschreibung: 'Gegenereignis: P(nicht E) = 1 − P(E), und der Trick für „mindestens einmal“. Erklärung mit Baum, Beispiel und Übungsaufgaben mit Sofort-Feedback.'
warum: |
  <p>Manche Ereignisse haben sehr viele günstige Ergebnisse – „mindestens einmal eine 6 bei drei Würfen“ zum Beispiel. Die alle zu zählen dauert ewig. Das Gegenteil hat oft nur ein einziges Ergebnis. Wer den Umweg über das Gegenereignis kennt, spart Zeit und Fehler.</p>
regel: |
  <p>Das <strong>Gegenereignis</strong> „nicht E“ enthält alle Ergebnisse, die <em>nicht</em> zu E gehören. E und „nicht E“ zusammen sind sicher, also 1:</p>
  <div class="formel"><code>P(nicht E) = 1 − P(E)</code></div>
  <p>Der wichtigste Trick: <strong>„mindestens einmal“</strong> rechnet man über das Gegenereignis <strong>„kein einziges Mal“</strong>.</p>
beispiel: |
  <p><strong>Aufgabe:</strong> Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit, <em>keine</em> 6 zu würfeln?</p>
  <ol>
  <li>P(6) = 1/6.</li>
  <li>P(keine 6) = 1 − 1/6 = 5/6.</li>
  </ol>
  <p><strong>Der Trick mit „mindestens einmal“:</strong> Du würfelst dreimal. Wie groß ist P(mindestens eine 6)?</p>
  <ol>
  <li>Gegenereignis: <em>kein einziges Mal</em> eine 6. Das ist ein einziger Pfad: keine 6, keine 6, keine 6.</li>
  <li>P(keine 6, keine 6, keine 6) = 5/6 · 5/6 · 5/6 = (5/6)³ = 125/216.</li>
  <li>P(mindestens eine 6) = 1 − 125/216 = 91/216 ≈ 42 %.</li>
  </ol>
  <p>Ohne den Trick müsstest du 7 Pfade addieren. Mit dem Trick ist es eine Rechnung.</p>
ohneVideo: Zu dieser Frage gibt es kein Lehrerschmidt-Video; die Erklärung oben reicht.
bild:
  text: 'Der Baum zum dreimaligen Würfeln. Orange ist der einzige Pfad des Gegenereignisses „kein einziges Mal 6“: 5/6 · 5/6 · 5/6. Rechts stehen die Pfadwahrscheinlichkeiten.'
  funktion: zeichneGegenereignis
  seed: 1
  geloest: true
  vorgaben:
    experiment: wuerfel
    zuege: 3
    ereignis: mind1s
---
