---
kompetenz: dritte-binomische
serlo: { url: 'https://de.serlo.org/mathe/1499/binomische-formeln', titel: 'Binomische Formeln' }
beschreibung: 'Dritte binomische Formel: (a + b)(a − b) = a² − b². Erklärung mit Flächenbild zum Umlegen, Beispiel, Video und Übungsaufgaben mit Sofort-Feedback.'
warum: |
  <p>Die dritte Formel ist die kürzeste: Aus (x + 4)(x − 4) wird sofort x² − 16, ganz ohne Mittelglied. Du brauchst sie ständig, um Terme zu vereinfachen und später, um Differenzen wie x² − 16 wieder in Klammern zu zerlegen. Und sie ist ein starker Kopfrechentrick: 21 · 19 = 20² − 1² = 399.</p>
regel: |
  <div class="formel"><code>(a + b)(a − b) = a² − b²</code></div>
  <p>Zwei Klammern mit denselben Gliedern, einmal mit Plus, einmal mit Minus. Beim Ausmultiplizieren entstehen + ab und − ab. Sie <strong>heben sich auf</strong>, deshalb gibt es kein Mittelglied. Übrig bleiben a² und − b².</p>
  <p>Die Reihenfolge der Klammern ist egal: (a − b)(a + b) ergibt genauso a² − b².</p>
  <p class="merke">Merke: Kein Mittelglied – und das Minus bleibt: a² <strong>−</strong> b², nicht a² + b².</p>
beispiel: |
  <p>Multipliziere aus: (x + 4)(x − 4).</p>
  <table>
  <tbody>
  <tr><th scope="row">Glieder</th><td>a = x, b = 4</td></tr>
  <tr><th scope="row">Vier Produkte</th><td><code>x² − 4x + 4x − 16</code> – die Mittelglieder heben sich auf</td></tr>
  <tr><th scope="row">Formel</th><td><code>x² − 4²</code></td></tr>
  <tr><th scope="row">Ausgerechnet</th><td><strong>x² − 16</strong></td></tr>
  </tbody>
  </table>
  <p>Mit Zahlen davor: (3a + 2b)(3a − 2b) = 9a² − 4b².</p>
video:
  id: 6ySWeEhTOt4
  titel: 3.binomische Formel - ganz einfach erklärt mit Beispielen! | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Oben: das Quadrat x², aus dem die Ecke 4² = 16 fehlt. Der Rest besteht aus zwei Teilen. Unten: Das gelbe Teil ist gedreht und rechts angelegt – jetzt ist es ein Rechteck mit den Seiten x + 4 und x − 4. Gleiche Teile, gleiche Fläche: (x + 4)(x − 4) = x² − 16.'
  funktion: zeichneDritteBinomische
  seed: 1
  geloest: true
  vorgaben:
    m: 1
    'n': 4
    var: x
---
