---
kompetenz: pfadregel-1
serlo: { url: 'https://de.serlo.org/mathe/189811/pfadregeln', titel: 'Pfadregeln' }
beschreibung: 'Erste Pfadregel (Produktregel): entlang eines Pfades multiplizieren. Erklärung mit Baum, Beispiel, Video und Übungsaufgaben.'
warum: |
  <p>Der Baum zeigt dir alle Wege – aber wie wahrscheinlich ist ein bestimmter Weg? Die erste Pfadregel beantwortet genau das. Sie ist die Rechenregel hinter jeder mehrstufigen Aufgabe, und sie ist kurz: multiplizieren.</p>
regel: |
  <p><strong>1. Pfadregel (Produktregel):</strong> Die Wahrscheinlichkeit eines Pfades ist das <strong>Produkt</strong> der Wahrscheinlichkeiten aller Zweige auf diesem Pfad.</p>
  <div class="formel"><code>P(Pfad) = P(1. Zweig) · P(2. Zweig) · …</code></div>
  <p>Merkhilfe: <strong>Entlang</strong> des Pfades wird <strong>mal</strong> gerechnet. „Erst rot <em>und dann</em> blau“ heißt multiplizieren.</p>
beispiel: |
  <p>Urne mit 3 roten, 2 blauen und 1 gelben Kugel. Du ziehst zweimal <strong>mit Zurücklegen</strong>. Wie groß ist P(rot, dann blau)?</p>
  <ol>
  <li>1. Zweig: P(rot) = 3/6.</li>
  <li>2. Zweig: P(blau) = 2/6 (mit Zurücklegen ist die Urne wieder voll).</li>
  <li>P(rot, blau) = 3/6 · 2/6 = 6/36 = 1/6.</li>
  </ol>
  <p class="merke">Häufiger Fehler: 3/6 + 2/6 = 5/6. Das wäre größer als jede der beiden einzelnen Wahrscheinlichkeiten – unmöglich für „erst das eine <em>und</em> dann das andere“. Ein Pfad ist immer <em>unwahrscheinlicher</em> als seine einzelnen Zweige.</p>
video:
  id: fLPxMfgUxVk
  titel: Produktregel | Wahrscheinlichkeitsrechnung - einfach erklärt | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Der Baum aus dem Beispiel, der Pfad rot-blau ist orange. Rechts stehen die Pfadwahrscheinlichkeiten: rot-blau = 1/6.'
  funktion: zeichnePfadregel1
  seed: 1
  geloest: true
  vorgaben:
    urne: 3r2b1g
    zuege: 2
    modus: mit
    ereignis: rb
---
