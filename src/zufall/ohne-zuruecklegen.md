---
kompetenz: ohne-zuruecklegen
serlo: { url: 'https://de.serlo.org/mathe/189811/pfadregeln', titel: 'Pfadregeln' }
beschreibung: 'Ziehen ohne Zurücklegen: Nenner und Zähler ändern sich. Vergleich mit und ohne Zurücklegen, mit Urnenbild, Baum und Übungsaufgaben.'
warum: |
  <p>Ob eine gezogene Kugel zurück in die Urne kommt oder nicht, ändert die ganze Rechnung. Genau hier passieren die meisten Fehler: Der Nenner bleibt 6, obwohl nur noch 5 Kugeln drin sind. Wer den Unterschied einmal gesehen hat, vergisst ihn nicht mehr.</p>
regel: |
  <p><strong>Mit Zurücklegen:</strong> Jeder Zug ist wie der erste. Die Wahrscheinlichkeiten bleiben auf allen Stufen gleich.</p>
  <p><strong>Ohne Zurücklegen:</strong> Nach jedem Zug ist eine Kugel weniger in der Urne.</p>
  <ul>
  <li>Der <strong>Nenner</strong> wird bei jedem Zug um 1 kleiner (6 → 5 → 4).</li>
  <li>Der <strong>Zähler</strong> wird nur dann um 1 kleiner, wenn genau diese Farbe gezogen wurde.</li>
  </ul>
  <p>Die Zweige der zweiten Stufe hängen also davon ab, was in der ersten Stufe passiert ist.</p>
beispiel: |
  <p>Urne mit 3 roten, 2 blauen und 1 gelben Kugel (6 Kugeln). Die erste gezogene Kugel ist <strong>rot</strong>.</p>
  <table>
  <thead><tr><th scope="col">2. Kugel</th><th scope="col">mit</th><th scope="col">ohne</th></tr></thead>
  <tbody>
  <tr><th scope="row">rot</th><td>3/6</td><td><strong>2/5</strong></td></tr>
  <tr><th scope="row">blau</th><td>2/6</td><td><strong>2/5</strong></td></tr>
  <tr><th scope="row">gelb</th><td>1/6</td><td><strong>1/5</strong></td></tr>
  </tbody>
  </table>
  <p>Ohne Zurücklegen fehlt eine rote Kugel: Bei rot werden Zähler und Nenner kleiner, bei blau und gelb nur der Nenner.</p>
  <p>Damit wird zum Beispiel P(rot, dann rot) mit Zurücklegen 3/6 · 3/6 = 9/36 = 1/4, aber ohne Zurücklegen 3/6 · 2/5 = 6/30 = 1/5.</p>
ohneVideo: 'Zu dieser Frage gibt es kein Lehrerschmidt-Video; die Erklärung oben reicht. Das Video auf der Seite „Baumdiagramm“ zeigt den Aufbau eines Baums; die Änderung der Brüche übt die Aufgabe hier.'
bild:
  text: 'Oben die Urne vor und nach dem ersten Zug (rot gezogen), darunter beide Bäume. Der Pfad rot-blau ist orange: mit Zurücklegen 3/6 · 2/6, ohne Zurücklegen 3/6 · 2/5.'
  funktion: zeichneOhneZuruecklegen
  seed: 1
  geloest: true
  vorgaben:
    urne: 3r2b1g
    erster: r
    zweiter: b
    art: pfad
---
