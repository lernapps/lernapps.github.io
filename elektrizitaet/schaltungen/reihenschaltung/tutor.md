# Reihenschaltung – Tutor-Datei

> Bei der Reihenschaltung hängen die Lampen hintereinander. Fällt eine aus, gehen alle aus.

App: Elektrizität. Seite: [Reihenschaltung](./)

Diese Datei ist für einen KI-Tutor. Sie enthält die Lösungen: Nutze sie, um anzuleiten und Fehler zu erkennen, nicht um vorzusagen. Die Regeln stehen in llms.txt. Kannst du eine Datei der App nicht abrufen, bitte die lernende Person, den Text der Seite oder diese Datei einzufügen oder anzuhängen.

## Abschnitte

- [Die Idee](./#idee)
- [Das merkst du dir](./#merke)
- [Beispiel](./#beispiel)
- [Übung](./#uebung)

## Übungen

### rs-ausfall (true-false)

- Link: [./#rs-ausfall](./#rs-ausfall), im Abschnitt „Übung“
- Aufgabe: Bei einer Reihenschaltung von zwei Lampen leuchtet die zweite weiter, wenn die erste herausgeschraubt wird.
- Antwortformat: „Stimmt“ oder „Stimmt nicht“ wählen
- Lösung: Die Aussage stimmt nicht.
- Erklärung: Bei der Reihenschaltung gibt es nur einen Weg für den Strom. Fehlt eine Lampe, ist der Kreis offen, und die andere geht auch aus.

### rs-wege (single-choice)

- Link: [./#rs-wege](./#rs-wege), im Abschnitt „Übung“
- Aufgabe: Wie viele Wege hat der Strom bei einer Reihenschaltung?
- Antwortformat: eine Antwort wählen
- Antworten zur Wahl (✓ richtig, ✗ falsch, mit der Meldung der App):
  - ✓ Genau einen. – Die Bauteile hängen hintereinander, also kommt der Strom nur auf einem Weg durch den Kreis.
  - ✗ Einen für jede Lampe. – Eigene Wege für jede Lampe gibt es bei der Parallelschaltung, nicht bei der Reihenschaltung.
  - ✗ Keinen, die Lampen leuchten durch die Batterie. – Ohne Weg für den Strom leuchtet keine Lampe. Der Kreis muss geschlossen sein.
- Lösung: Genau einen.
- Erklärung: In der Reihenschaltung gibt es nur einen Stromweg, auf dem der Strom nacheinander durch alle Bauteile fließt.

### rs-schalterplatz (true-false)

- Link: [./#rs-schalterplatz](./#rs-schalterplatz), im Abschnitt „Übung“
- Aufgabe: In einer Reihenschaltung mit Batterie, Schalter und zwei Lampen ist es egal, ob der Schalter vor, zwischen oder hinter den Lampen sitzt.
- Antwortformat: „Stimmt“ oder „Stimmt nicht“ wählen
- Lösung: Die Aussage stimmt.
- Erklärung: Der Strom läuft nacheinander durch alle Bauteile. Wo der Schalter sitzt, ändert nichts: Öffnest du ihn, ist der Kreis unterbrochen, und alle Lampen gehen aus.

### schaltung-bauen (interaktive Übung SchaltungBauen)

- Link: [./#schaltung-bauen](./#schaltung-bauen), im Abschnitt „Übung“
- Was zu tun ist: Du baust einen Stromkreis aus Lampen, Schaltern und Kabeln, der tut, was die Aufgabe verlangt, schaltest den Strom ein und testest ihn.
- Antwortformat: Der gebaute Stromkreis auf dem Schaltbrett (Lampe, Schalter oder Kabel pro Platz); dann „Prüfen“.
- Was als richtig zählt: Der Stromkreis verhält sich so, wie die Aufgabe es sagt: Lampen leuchten, Schalter und herausgeschraubte Lampen wirken wie verlangt. Jeder Aufbau zählt, der das tut, nicht nur die Musterlösung; ein zusätzlicher Schalter ist nur dort ein Fehler, wo die Aufgabe eine feste Zahl nennt.
- Typische Fehler und die Meldung der App:
  - Falsche Zahl von Lampen oder Schaltern.
  - Ein Zweig bleibt leer, während im anderen eine Lampe sitzt: ein Kurzschluss, die Lampen bleiben dunkel.
  - Die Teile stimmen, aber ein Schalter schaltet die falschen Lampen oder die Lampen hängen in Reihe statt parallel.
- Aufgaben nach Nummer, 1 bis 1: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?schaltung-bauen=1#schaltung-bauen): Baue einen Stromkreis mit zwei Lampen hintereinander, also in Reihe. Wenn du eine Lampe herausschraubst, soll auch die andere ausgehen. Das Schaltbrett ist ein Stromkreis mit zwei Plätzen. Du wählst Lampe, Schalter oder Kabel, tippst auf einen Platz und schaltest dann den Strom ein. → Lösung: Eine Lampe auf jeden der beiden Plätze, ein Schalter ist erlaubt. Schraubst du eine heraus, geht die andere aus.
