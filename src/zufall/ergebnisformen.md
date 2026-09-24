---
kompetenz: ergebnisformen
beschreibung: 'Wahrscheinlichkeiten als Produkt, Summe oder Potenz angeben: den passenden Term zu einem Ereignis im Baumdiagramm erkennen. Übungsaufgaben mit typischen Fehlern.'
warum: |
  <p>Wer jede Wahrscheinlichkeit bis zum gekürzten Bruch ausrechnet, verliert Zeit und macht Rechenfehler. Oft reicht der Term: 3/6 · 2/5. Frag deine Lehrerin oder deinen Lehrer, ob du in der Klassenarbeit ausrechnen musst. Wichtig ist, dass der Term stimmt – und genau das übst du hier: Du erkennst, welcher Term zu einem Ereignis passt und welcher einen typischen Fehler enthält.</p>
regel: |
  <p>Ein Term für P(E) hat immer denselben Aufbau:</p>
  <ul>
  <li>Jeder passende Pfad wird ein <strong>Produkt</strong> seiner Zweige (1. Pfadregel).</li>
  <li>Die Produkte aller passenden Pfade werden <strong>addiert</strong> (2. Pfadregel).</li>
  <li>Kommt derselbe Faktor mehrmals vor, darfst du eine <strong>Potenz</strong> schreiben: 5/6 · 5/6 · 5/6 = (5/6)³.</li>
  </ul>
  <p class="merke">Typische falsche Terme: nur ein Pfad statt aller, entlang des Pfades addiert statt multipliziert, die Pfade des Gegenereignisses oder mit statt ohne Zurücklegen gerechnet.</p>
beispiel: |
  <p>Urne mit 3 roten und 2 blauen Kugeln, zweimal ziehen <strong>ohne Zurücklegen</strong>. Ereignis: genau einmal rot.</p>
  <table>
  <tbody>
  <tr><th scope="row">Richtig</th><td><code>3/5 · 2/4 + 2/5 · 3/4</code> = 12/20 = 3/5</td></tr>
  <tr><th scope="row">Nur ein Pfad</th><td><code>3/5 · 2/4</code> – blau-rot fehlt</td></tr>
  <tr><th scope="row">Mit Zurücklegen</th><td><code>3/5 · 2/5 + 2/5 · 3/5</code> – der Nenner muss kleiner werden</td></tr>
  </tbody>
  </table>
video:
  id: Pi1M1F2l024
  titel: Summenregel | Wahrscheinlichkeitsrechnung | Mathematik | Lehrerschmidt
  kanal: Lehrerschmidt
bild:
  text: 'Der Baum aus dem Beispiel: 3 rote und 2 blaue Kugeln, zweimal ohne Zurücklegen. Orange sind die zwei Pfade von „genau einmal rot“.'
  uebung: 'Welcher Term passt dazu?'
  funktion: zeichneErgebnisformen
  modul: pfadregel-2
  seed: 2
  geloest: true
  vorgaben:
    urne: 3r2b
    zuege: 2
    modus: ohne
    ereignis: genau1r
---
