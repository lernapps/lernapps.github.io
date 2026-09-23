---
kompetenz: veraenderung
serlo: { url: 'https://de.serlo.org/mathe/116824/der-verminderte-und-vermehrte-grundwert', titel: 'Der verminderte und vermehrte Grundwert' }
beschreibung: 'Neuer Wert bei Erhöhung oder Senkung um p %, und rückwärts der alte Wert. Faktor-Methode, Beispiele, Balken-Bild und Übungen.'
warum: |
  <p>Preise steigen, Rabatte senken, Gehälter wachsen, die Mehrwertsteuer kommt obendrauf: Fast jede Prozentaufgabe im Alltag ist eine Veränderung. Der Trick ist der Faktor – mit ihm rechnest du eine Erhöhung oder Senkung in einem Schritt, und du kannst sie auch rückwärts rechnen.</p>
regel: |
  <div id="formel">
  <div class="formel"><code>neuer Wert = alter Wert · (1 + p/100)</code> bei Erhöhung<br><code>neuer Wert = alter Wert · (1 − p/100)</code> bei Senkung</div>
  <p>Der alte Wert ist der Grundwert (100 %). Nach einer Erhöhung um 25 % sind es 125 %, also Faktor 1,25. Nach einer Senkung um 25 % sind es 75 %, also Faktor 0,75.</p>
  <p><strong>Rückwärts</strong> (alter Wert gesucht): <code>alter Wert = neuer Wert : Faktor</code>. Das nennt man vermehrten oder verminderten Grundwert.</p>
  <p class="merke">Typischer Fehler: Die Prozente auf den neuen Wert beziehen. Die 25 % Rabatt beziehen sich immer auf den alten Preis – der neue Preis ist nicht 100 %.</p>
  </div>
beispiel: |
  <h3>Neuer Wert gesucht</h3>
  <p>Eine Hose kostet 80 €. Im Ausverkauf gibt es 25 % Rabatt. Was kostet sie jetzt?</p>
  <table>
    <tbody>
      <tr><th scope="row">Alter Wert</th><td>80 € = 100 %</td></tr>
      <tr><th scope="row">Faktor</th><td><code>1 − 25/100 = 0,75</code></td></tr>
      <tr><th scope="row">Neuer Wert</th><td><code>80 · 0,75 = </code><strong>60 €</strong></td></tr>
    </tbody>
  </table>
  <h3>Alter Wert gesucht</h3>
  <p>Nach einer Preiserhöhung um 25 % kostet ein Ticket 100 €. Was hat es vorher gekostet?</p>
  <table>
    <tbody>
      <tr><th scope="row">Neuer Wert</th><td>100 € = 125 % des alten Preises</td></tr>
      <tr><th scope="row">Faktor</th><td><code>1 + 25/100 = 1,25</code></td></tr>
      <tr><th scope="row">Alter Wert</th><td><code>100 : 1,25 = </code><strong>80 €</strong></td></tr>
    </tbody>
  </table>
  <p>Falsch wäre: 100 € − 25 % von 100 € = 75 €. Die 25 % beziehen sich auf den alten Preis, nicht auf 100 €.</p>
  <section id="video-2" class="video-karte" data-youtube-id="hyKgJKGCjHc" data-titel="Preiserhöhung, Aufschlag berechnen | Prozentrechnung - einfach erklärt | Lehrerschmidt" data-kanal="Lehrerschmidt">
  <h2>Video: Preiserhöhung</h2>
  <p><a href="https://www.youtube.com/watch?v=hyKgJKGCjHc" rel="noopener">Preiserhöhung, Aufschlag berechnen | Prozentrechnung - einfach erklärt | Lehrerschmidt</a></p>
  <p class="video-kanal">Lehrerschmidt · YouTube</p>
  <p class="video-hinweis">Beim Start werden Daten (u. a. deine IP-Adresse) an YouTube/Google übertragen.</p>
  </section>
video:
  id: 7qPr-ik4wp8
  titel: 'Rabatt, Nachlass, Preissenkung berechnen | Prozentrechnung - einfach erklärt | Lehrerschmidt'
  kanal: Lehrerschmidt
bild:
  text: 'Der obere Balken ist der alte Wert (100 %), der untere der neue Wert.'
  funktion: zeichneVeraenderung
  seed: 3
  geloest: true
  vorgaben:
    'alt': 80
    'p': 25
    'richtung': "minus"
---
