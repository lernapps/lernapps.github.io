---
kompetenz: sachaufgaben
serlo: { url: 'https://de.serlo.org/mathe/174159/mehrschrittige-anwendungsaufgaben-zur-prozentrechnung', titel: 'Mehrschrittige Anwendungsaufgaben zur Prozentrechnung' }
beschreibung: 'Sachaufgaben zur Prozentrechnung in eine Gleichung oder einen Dreisatz übersetzen: Gleichung wählen, Dreisatz-Tabelle ausfüllen, Sofort-Feedback.'
warum: |
  <p>In der Klassenarbeit und im Alltag steht nie „Berechne W“, sondern eine Geschichte mit Zahlen. Die eigentliche Kunst ist die Übersetzung: aus dem Text eine Gleichung oder einen Dreisatz machen. Danach ist es nur noch Rechnen. Beide Wege führen zum Ziel – der Dreisatz ist sicher, die Gleichung ist schnell.</p>
regel: |
  <div id="formel">
  <h3>Weg 1: Gleichung</h3>
  <p>Bestimme, was gesucht ist, und wähle die passende Formel:</p>
  <div class="formel">Teil gesucht: <code>W = G · p / 100</code><br>Ganzes gesucht: <code>G = W · 100 / p</code><br>Prozentsatz gesucht: <code>p = W / G · 100</code></div>
  <h3>Weg 2: Dreisatz</h3>
  <p>Immer über 1&nbsp;%: Von 100&nbsp;% zu 1&nbsp;% teilst du durch 100, von 1&nbsp;% zu p&nbsp;% nimmst du mal p.</p>
  <table>
    <tbody>
      <tr><th scope="row">100&nbsp;%</th><td class="zahl">250&nbsp;€</td></tr>
      <tr><th scope="row">1&nbsp;%</th><td class="zahl">250&nbsp;€ : 100 = 2,50&nbsp;€</td></tr>
      <tr><th scope="row">12&nbsp;%</th><td class="zahl">2,50&nbsp;€ · 12 = 30&nbsp;€</td></tr>
    </tbody>
  </table>
  <p class="merke">Merkhilfe: Erst durch 100, dann mal p. Das funktioniert auch rückwärts: von p&nbsp;% zu 1&nbsp;% teilst du durch p, von 1&nbsp;% zu 100&nbsp;% nimmst du mal 100.</p>
  </div>
beispiel: |
  <p>„Ein Skateboard kostet 250&nbsp;€. Es gibt 12&nbsp;% Rabatt. Wie viel Euro Rabatt sind das?“</p>
  <table>
    <thead><tr><th scope="col">Gleichung</th><th scope="col">Passt sie?</th></tr></thead>
    <tbody>
      <tr><td><code>W = 250 · 12 / 100</code></td><td><strong>Ja.</strong> Gesucht ist der Teil (Rabatt in €), also W = G · p / 100.</td></tr>
      <tr><td><code>W = 250 · 100 / 12</code></td><td>Nein – das ist die Grundwert-Formel, ergibt 2083&nbsp;€ und ist größer als der Preis.</td></tr>
      <tr><td><code>W = 12 / 250 · 100</code></td><td>Nein – das wäre ein Prozentsatz, ergibt 4,8 und hat keine Einheit.</td></tr>
    </tbody>
  </table>
  <p>Ergebnis: W = 30&nbsp;€. Probe mit dem Dreisatz: 1&nbsp;% = 2,50&nbsp;€, 12&nbsp;% = 30&nbsp;€. Passt.</p>
video:
  id: fvzgrNy9S0Q
  titel: 'Prozentrechnung - Prozentsatz berechnen mit Formel / mit Dreisatz | Lehrerschmidt'
  kanal: Lehrerschmidt
bild:
  text: 'Hunderterfeld: 100 Kästchen = Grundwert, ein Kästchen = 1 %.'
  funktion: zeichneSachaufgaben
  seed: 1
  geloest: true
  vorgaben:
    'typ': "dreisatz"
    'g': 300
    'p': 12
---
