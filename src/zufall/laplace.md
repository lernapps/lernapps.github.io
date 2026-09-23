---
kompetenz: laplace
beschreibung: 'Laplace-Formel: P(E) = günstige durch mögliche Ergebnisse. Erklärung mit Bild, Beispiel, Video und Übungsaufgaben mit Würfel, Urne, Glücksrad, Karten und Losen.'
warum: |
  <p>Fast jede Wahrscheinlichkeitsaufgabe beginnt mit dieser Frage: Wie viele Ergebnisse gibt es überhaupt, und wie viele davon sind „gut“ für mich? Wer das sauber zählt, hat den ersten Schritt jeder Aufgabe geschafft. Alles Weitere – Baumdiagramme, Pfadregeln – baut darauf auf.</p>
regel: |
  <p>Wenn alle Ergebnisse eines Zufallsversuchs <strong>gleich wahrscheinlich</strong> sind (Laplace-Versuch), gilt:</p>
  <div class="formel"><code>P(E) = Anzahl der günstigen Ergebnisse / Anzahl aller möglichen Ergebnisse</code></div>
  <p><strong>Günstig</strong> heißt: Das Ergebnis gehört zum Ereignis E. <strong>Möglich</strong> heißt: alles, was passieren kann.</p>
  <p>Die Wahrscheinlichkeit ist immer eine Zahl zwischen 0 (unmöglich) und 1 (sicher). Du kannst sie als Bruch, als Dezimalzahl oder in Prozent schreiben: 1/4 = 0,25 = 25 %.</p>
beispiel: |
  <p><strong>Aufgabe:</strong> Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine gerade Zahl?</p>
  <ol>
  <li>Mögliche Ergebnisse: 1, 2, 3, 4, 5, 6 – das sind <strong>6</strong>.</li>
  <li>Günstige Ergebnisse (gerade Zahl): 2, 4, 6 – das sind <strong>3</strong>.</li>
  <li>P(gerade Zahl) = 3/6 = 1/2 = 0,5 = 50 %.</li>
  </ol>
  <p><strong>Zweites Beispiel:</strong> In einer Urne liegen 3 rote, 2 blaue und 1 gelbe Kugel. Du ziehst blind eine Kugel. P(blau) = 2/6 = 1/3 ≈ 33,3 %.</p>
  <p class="merke">Achtung: Die Farben sind nicht die Ergebnisse! Jede einzelne Kugel ist ein Ergebnis. Es gibt 6 Kugeln, nicht 3 Farben – sonst würdest du 1/3 für jede Farbe rechnen, und das ist falsch.</p>
video:
  id: rkLmLaFHodo
  titel: einstufiger Zufallsversuch | Wahrscheinlichkeitsrechnung - einfach erklärt | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Die Urne aus dem zweiten Beispiel: 6 Kugeln, die zwei blauen sind orange umrandet. P(blau) = 2/6. Im Video heißt es nicht „Laplace“, gemeint ist dasselbe. In der Übung zeigt das Bild die aktuelle Aufgabe.'
  funktion: zeichneLaplace
  seed: 1
  vorgaben:
    experiment: urne
    urne: 3r2b1g
    ereignis: b
---
