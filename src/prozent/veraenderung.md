---
kompetenz: veraenderung
serlo: { url: 'https://de.serlo.org/mathe/116824/der-verminderte-und-vermehrte-grundwert', titel: 'Der verminderte und vermehrte Grundwert' }
beschreibung: 'Neuer Wert bei Erhöhung oder Senkung um p %, und rückwärts der alte Wert. Faktor-Methode, Beispiele, Balken-Bild und Übungen.'
warum: |
  <p>Preise steigen, Rabatte senken, Gehälter wachsen, die Mehrwertsteuer kommt obendrauf: Fast jede Prozentaufgabe im Alltag ist eine Veränderung. Der Trick ist der Faktor – mit ihm rechnest du eine Erhöhung oder Senkung in einem Schritt, und du kannst sie auch rückwärts rechnen.</p>
regel: |
  <div id="formel">
  <div class="formel"><code>neuer Wert = alter Wert · (1 + p/100)</code> bei Erhöhung<br><code>neuer Wert = alter Wert · (1 − p/100)</code> bei Senkung</div>
  <p>Der alte Wert ist der Grundwert (100&nbsp;%). Nach einer Erhöhung um 25&nbsp;% sind es 125&nbsp;%, also Faktor 1,25. Nach einer Senkung um 25&nbsp;% sind es 75&nbsp;%, also Faktor 0,75.</p>
  <p>Den neuen Wert nennt man <strong>vermehrten Grundwert</strong> (bei Erhöhung) oder <strong>verminderten Grundwert</strong> (bei Senkung).</p>
  <p><strong>Rückwärts</strong> (alter Wert gesucht): <code>alter Wert = neuer Wert : Faktor</code>.</p>
  <p class="merke">Typischer Fehler: Die Prozente auf den neuen Wert beziehen. Die 25&nbsp;% Rabatt beziehen sich immer auf den alten Preis – der neue Preis ist nicht 100&nbsp;%.</p>
  </div>
beispiel: |
  <h3>Neuer Wert gesucht</h3>
  <p>Eine Hose kostet 80&nbsp;€. Im Ausverkauf gibt es 25&nbsp;% Rabatt. Was kostet sie jetzt?</p>
  <div class="tabelle-rahmen">
  <table>
    <tbody>
      <tr><th scope="row">Alter Wert</th><td>80&nbsp;€ = 100&nbsp;%</td></tr>
      <tr><th scope="row">Faktor</th><td><code>1 − 25/100 = 0,75</code></td></tr>
      <tr><th scope="row">Neuer Wert</th><td><code>80 · 0,75 = </code><strong>60&nbsp;€</strong></td></tr>
    </tbody>
  </table>
  </div>
  <h3>Alter Wert gesucht</h3>
  <p>Nach einer Preiserhöhung um 25&nbsp;% kostet ein Ticket 100&nbsp;€. Was hat es vorher gekostet?</p>
  <div class="tabelle-rahmen">
  <table>
    <tbody>
      <tr><th scope="row">Neuer Wert</th><td>100&nbsp;€ = 125&nbsp;% des alten Preises</td></tr>
      <tr><th scope="row">Faktor</th><td><code>1 + 25/100 = 1,25</code></td></tr>
      <tr><th scope="row">Alter Wert</th><td><code>100 : 1,25 = </code><strong>80&nbsp;€</strong></td></tr>
    </tbody>
  </table>
  </div>
  <p>Falsch wäre: 100&nbsp;€ − 25&nbsp;% von 100&nbsp;€ = 75&nbsp;€. Die 25&nbsp;% beziehen sich auf den alten Preis, nicht auf 100&nbsp;€.</p>
videos:
  - ueberschrift: Senkung
    id: 7qPr-ik4wp8
    titel: 'Rabatt, Nachlass, Preissenkung berechnen | Prozentrechnung - einfach erklärt | Lehrerschmidt'
    kanal: Lehrerschmidt
  - ueberschrift: Erhöhung
    id: hyKgJKGCjHc
    titel: 'Preiserhöhung, Aufschlag berechnen | Prozentrechnung - einfach erklärt | Lehrerschmidt'
    kanal: Lehrerschmidt
bild:
  text: 'Der obere Balken ist der alte Preis 80 € (100 %), der untere der neue Preis 60 € (75 %).'
  funktion: zeichneVeraenderung
  seed: 4
  geloest: true
  vorgaben:
    'alt': 80
    'p': 25
    'richtung': "minus"
---
