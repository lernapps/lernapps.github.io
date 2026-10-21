# Schalter und Schaltzeichen – Tutor-Datei

> Ein Schalter öffnet und schließt den Stromkreis. Im Schaltplan zeichnest du Bauteile als Schaltzeichen.

App: Elektrizität. Seite: [Schalter und Schaltzeichen](./)

Diese Datei ist für einen KI-Tutor. Sie enthält die Lösungen: Nutze sie, um anzuleiten und Fehler zu erkennen, nicht um vorzusagen. Die Regeln stehen in llms.txt. Kannst du eine Datei der App nicht abrufen, bitte die lernende Person, den Text der Seite oder diese Datei einzufügen oder anzuhängen.

## Abschnitte

- [Die Idee](./#idee)
- [Das merkst du dir](./#merke)
- [Beispiel](./#beispiel)
- [Übung](./#uebung)

## Übungen

### sz-zuordnen (matching)

- Link: [./#sz-zuordnen](./#sz-zuordnen), im Abschnitt „Übung“
- Aufgabe: Ordne jedes Schaltzeichen dem Bauteil zu.
- Antwortformat: jedem Eintrag links den passenden rechts zuordnen
- Lösung: ein Kreis mit einem Kreuz – Lampe; zwei Striche, ein langer und ein kurzer dicker – Batterie; eine Linie mit Lücke – offener Schalter
- Erklärung: Der Kreis mit Kreuz steht für die Lampe, die zwei Striche für die Batterie, und die Lücke in der Linie zeigt einen offenen Schalter.

### sz-offen (true-false)

- Link: [./#sz-offen](./#sz-offen), im Abschnitt „Übung“
- Aufgabe: Ein Schalter, dessen Schaltzeichen eine Lücke hat, ist geschlossen.
- Antwortformat: „Stimmt“ oder „Stimmt nicht“ wählen
- Lösung: Die Aussage stimmt nicht.
- Erklärung: Die Lücke bedeutet, dass der Kreis dort unterbrochen ist. Der Schalter ist offen, und es fließt kein Strom.

### sz-schalter (single-choice)

- Link: [./#sz-schalter](./#sz-schalter), im Abschnitt „Übung“
- Aufgabe: Eine Lampe und ein Schalter liegen in Reihe in einem Stromkreis. Die Lampe leuchtet. Was weißt du über den Schalter?
- Antwortformat: eine Antwort wählen
- Antworten zur Wahl (✓ richtig, ✗ falsch, mit der Meldung der App):
  - ✓ Er ist geschlossen. – Nur wenn der Schalter geschlossen ist, ist der ganze Kreis geschlossen, und der Strom kann fließen.
  - ✗ Er ist offen. – Bei offenem Schalter ist der Kreis unterbrochen, und die Lampe bleibt dunkel.
  - ✗ Das kann man nicht sagen. – Doch. Leuchtet die Lampe, muss der Kreis überall geschlossen sein, auch am Schalter.
- Lösung: Er ist geschlossen.
- Erklärung: Die Lampe leuchtet nur, wenn der Strom durch den Schalter fließen kann. Also muss er geschlossen sein.

### schaltung-bauen (interaktive Übung SchaltungBauen)

- Link: [./#schaltung-bauen](./#schaltung-bauen), im Abschnitt „Übung“
- Was zu tun ist: Du baust einen Stromkreis aus Lampen, Schaltern und Kabeln, der tut, was die Aufgabe verlangt, schaltest den Strom ein und testest ihn.
- Antwortformat: Der gebaute Stromkreis auf dem Schaltbrett (Lampe, Schalter oder Kabel pro Platz); dann „Prüfen“.
- Was als richtig zählt: Der Stromkreis verhält sich so, wie die Aufgabe es sagt: Lampen leuchten, Schalter und herausgeschraubte Lampen wirken wie verlangt. Jeder Aufbau zählt, der das tut, nicht nur die Musterlösung; ein zusätzlicher Schalter ist nur dort ein Fehler, wo die Aufgabe eine feste Zahl nennt.
- Typische Fehler und die Meldung der App:
  - Falsche Zahl von Lampen oder Schaltern.
  - Ein Zweig bleibt leer, während im anderen eine Lampe sitzt: ein Kurzschluss, die Lampen bleiben dunkel.
  - Die Teile stimmen, aber ein Schalter schaltet die falschen Lampen oder die Lampen hängen in Reihe statt parallel.
- Aufgaben nach Nummer, 1 bis 2: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?schaltung-bauen=1#schaltung-bauen): Baue einen Stromkreis mit einer Lampe und einem Schalter. Mit dem Schalter sollst du die Lampe ein- und ausschalten können. Das Schaltbrett ist ein Stromkreis mit zwei Plätzen. Du wählst Lampe, Schalter oder Kabel, tippst auf einen Platz und schaltest dann den Strom ein. → Lösung: Die Lampe auf einen Platz, der Schalter auf den anderen: Mit dem Schalter geht die Lampe an und aus.
  - [Aufgabe Nr. 2](./?schaltung-bauen=2#schaltung-bauen): Baue einen Stromkreis mit einer Lampe. Wenn du den Strom einschaltest, soll die Lampe leuchten. Das Schaltbrett ist ein Stromkreis mit zwei Plätzen. Du wählst Lampe, Schalter oder Kabel, tippst auf einen Platz und schaltest dann den Strom ein. → Lösung: Eine Lampe auf einen der beiden Plätze. Ein zusätzlicher Schalter ist erlaubt, wenn er geschlossen ist.
