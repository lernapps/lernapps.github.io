---
kompetenz: zweite-binomische
serlo: { url: 'https://de.serlo.org/mathe/1499/binomische-formeln', titel: 'Binomische Formeln' }
beschreibung: 'Zweite binomische Formel: (a − b)² = a² − 2ab + b². Erklärung mit Flächenbild, Beispiel, Video und Übungsaufgaben mit Sofort-Feedback.'
warum: |
  <p>Die zweite Formel ist die Schwester der ersten – nur mit Minus in der Klammer. Genau dieses Minus macht sie tückisch: Beim Ausmultiplizieren von (x − 5)² passieren die meisten Vorzeichenfehler. Wer die Formel kennt, schreibt das Ergebnis in einer Zeile hin. Und wer weiß, <em>warum</em> am Ende + b² steht, verwechselt die Vorzeichen nicht mehr.</p>
regel: |
  <div class="formel"><code>(a − b)² = a² − 2ab + b²</code></div>
  <p>a ist das erste Glied, b das zweite (ohne das Minus). Du quadrierst beide Glieder, das <strong>Mittelglied − 2ab</strong> ist negativ, das letzte Glied <strong>+ b²</strong> ist positiv.</p>
  <p>Warum plus? (a − b)² = (a − b)(a − b). Das letzte Produkt ist (−b) · (−b) = + b²: Minus mal Minus gibt Plus. Im Bild ziehst du von a² zwei Streifen a · b ab; die Ecke b² steckt in beiden Streifen, ist also doppelt weg und kommt einmal zurück.</p>
  <p class="merke">Merke: (a − b)² ist nicht a² − b². Das Mittelglied − 2ab fehlt sonst, und das b² ist immer plus.</p>
beispiel: |
  <p>Multipliziere aus: (x − 5)².</p>
  <table>
  <tbody>
  <tr><th scope="row">Glieder</th><td>a = x, b = 5</td></tr>
  <tr><th scope="row">Formel</th><td><code>x² − 2 · x · 5 + 5²</code></td></tr>
  <tr><th scope="row">Ausgerechnet</th><td><strong>x² − 10x + 25</strong></td></tr>
  </tbody>
  </table>
  <p>Mit Zahlen davor: (2a − 3b)² = 4a² − 12ab + 9b².</p>
video:
  id: P9Moh6nUSI8
  titel: 2.binomische Formel - ganz einfach erklärt mit Beispielen! | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: Vom Quadrat x² werden zwei Streifen 5x abgezogen (rot). Die grüne Ecke 25 steckt in beiden Streifen, ist also doppelt abgezogen und kommt einmal zurück. Übrig bleibt das Quadrat (x − 5)².
  funktion: zeichneZweiteBinomische
  seed: 1
  geloest: true
  vorgaben:
    m: 1
    'n': 5
    var: x
---
