---
kompetenz: binome-rueckwaerts
beschreibung: 'Binome rückwärts: x² + 6x + 9 = (x + 3)², x² − 16 = (x + 4)(x − 4). Faktorisieren und Lücken ergänzen, mit Flächenbild und Übungsaufgaben mit Sofort-Feedback.'
warum: |
  <p>Bisher hast du Klammern aufgelöst. Oft brauchst du den umgekehrten Weg: Aus x² + 6x + 9 wird wieder (x + 3)². Das nennt man faktorisieren. Ein Produkt verrät mehr als eine Summe – zum Beispiel, wann ein Term null wird, oder wie sich ein Bruch kürzen lässt. Später beim Lösen quadratischer Gleichungen („quadratische Ergänzung“) ist genau dieser Blick der entscheidende Schritt.</p>
regel: |
  <div class="formel"><code>a² + 2ab + b² = (a + b)²</code></div>
  <div class="formel"><code>a² − 2ab + b² = (a − b)²</code></div>
  <div class="formel"><code>a² − b² = (a + b)(a − b)</code></div>
  <p>So erkennst du die Formel: Such zwei <strong>Quadrate</strong> (erstes und letztes Glied). Daraus liest du a und b ab. Steht dazwischen ein <strong>Mittelglied</strong>, prüfst du, ob es 2 · a · b ist – sein Vorzeichen entscheidet zwischen (a + b)² und (a − b)². Gibt es <strong>kein Mittelglied</strong> und steht ein Minus zwischen den Quadraten, ist es die dritte Formel.</p>
  <p>Bei Lückenaufgaben rechnest du genauso: Das Mittelglied ist 2 · a · b, das letzte Glied ist b².</p>
  <p class="merke">Merke: Das Mittelglied halbieren! Bei x² + 6x + 9 ist b = 3 (denn 2 · 3 = 6), nicht 6.</p>
beispiel: |
  <p>Schreib als Produkt: x² + 6x + 9.</p>
  <table>
  <tbody>
  <tr><th scope="row">Quadrate</th><td>x² = x², 9 = 3², also a = x, b = 3</td></tr>
  <tr><th scope="row">Mittelglied</th><td><code>2 · x · 3 = 6x</code> ✓, Vorzeichen + → 1. Formel</td></tr>
  <tr><th scope="row">Ergebnis</th><td><strong>x² + 6x + 9 = (x + 3)²</strong></td></tr>
  </tbody>
  </table>
  <p>Genauso: x² − 10x + 25 = (x − 5)² und x² − 16 = (x + 4)(x − 4). Lücken: x² + □x + 25 → 10, denn 2 · x · 5 = 10x; x² + 8x + □ → 16, denn b = 8 : 2 = 4 und 4² = 16.</p>
ohneVideo: Zu diesem Schritt gibt es kein passendes Video von Lehrerschmidt.
bild:
  text: 'Das Flächenbild der ersten Formel, rückwärts gelesen: Die Teilflächen x², 3x, 3x und 9 sind gegeben, gesucht ist die Seite des Quadrats. Sie ist x + 3. In der Übung zeigt das Bild die aktuelle Aufgabe – mit „?“ an der gesuchten Stelle.'
  funktion: zeichneBinomeRueckwaerts
  seed: 1
  geloest: true
  vorgaben:
    formel: 1
    m: 1
    'n': 3
    var: x
---
