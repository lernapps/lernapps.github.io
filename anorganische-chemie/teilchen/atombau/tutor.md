# Atombau – Tutor-Datei

> Atome bestehen aus Protonen, Neutronen und Elektronen. So baust du ein Atom.

App: Anorganische Chemie – Einstieg. Seite: [Atombau](./)

Diese Datei ist für einen KI-Tutor. Sie enthält die Lösungen: Nutze sie, um anzuleiten und Fehler zu erkennen, nicht um vorzusagen. Die Regeln stehen in llms.txt. Kannst du eine Datei der App nicht abrufen, bitte die lernende Person, den Text der Seite oder diese Datei einzufügen oder anzuhängen.

## Abschnitte

- [Warum](./#warum)
- [Regel](./#regel)
- [Beispiel](./#beispiel)
- [Übung](./#uebung)

## Übungen

### atom-bauen (interaktive Übung AtomBuilder)

- Link: [./#atom-bauen](./#atom-bauen), im Abschnitt „Übung“
- Was zu tun ist: Die Lernenden stellen für ein gegebenes Element mit Plus- und Minus-Tasten die Zahl der Protonen, Neutronen und Elektronen ein und prüfen ihr Atom.
- Antwortformat: Drei ganze Zahlen: Protonen, Neutronen, Elektronen.
- Was als richtig zählt: Die Protonenzahl ist die Ordnungszahl, die Elektronenzahl ist gleich der Protonenzahl (neutrales Atom), die Neutronenzahl ist Massenzahl minus Protonenzahl.
- Typische Fehler und die Meldung der App:
  - Die Elektronenzahl weicht von der Protonenzahl ab, das Atom wäre geladen.
  - Die Massenzahl wird als Neutronenzahl eingetragen.
  - Die Protonenzahl passt nicht zur Ordnungszahl des Elements.
- Aufgaben nach Nummer, 1 bis 10: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?atom-bauen=1#atom-bauen): Baue ein neutrales Atom von Wasserstoff (H) mit der Massenzahl 1. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Wasserstoff hat 1 Proton, 0 Neutronen und 1 Elektron.
  - [Aufgabe Nr. 2](./?atom-bauen=2#atom-bauen): Baue ein neutrales Atom von Helium (He) mit der Massenzahl 4. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Helium hat 2 Protonen, 2 Neutronen und 2 Elektronen.
  - [Aufgabe Nr. 3](./?atom-bauen=3#atom-bauen): Baue ein neutrales Atom von Lithium (Li) mit der Massenzahl 7. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Lithium hat 3 Protonen, 4 Neutronen und 3 Elektronen.
  - [Aufgabe Nr. 4](./?atom-bauen=4#atom-bauen): Baue ein neutrales Atom von Beryllium (Be) mit der Massenzahl 9. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Beryllium hat 4 Protonen, 5 Neutronen und 4 Elektronen.
  - [Aufgabe Nr. 5](./?atom-bauen=5#atom-bauen): Baue ein neutrales Atom von Bor (B) mit der Massenzahl 11. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Bor hat 5 Protonen, 6 Neutronen und 5 Elektronen.
  - [Aufgabe Nr. 6](./?atom-bauen=6#atom-bauen): Baue ein neutrales Atom von Kohlenstoff (C) mit der Massenzahl 12. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Kohlenstoff hat 6 Protonen, 6 Neutronen und 6 Elektronen.
  - [Aufgabe Nr. 7](./?atom-bauen=7#atom-bauen): Baue ein neutrales Atom von Stickstoff (N) mit der Massenzahl 14. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Stickstoff hat 7 Protonen, 7 Neutronen und 7 Elektronen.
  - [Aufgabe Nr. 8](./?atom-bauen=8#atom-bauen): Baue ein neutrales Atom von Sauerstoff (O) mit der Massenzahl 16. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Sauerstoff hat 8 Protonen, 8 Neutronen und 8 Elektronen.
  - [Aufgabe Nr. 9](./?atom-bauen=9#atom-bauen): Baue ein neutrales Atom von Fluor (F) mit der Massenzahl 19. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Fluor hat 9 Protonen, 10 Neutronen und 9 Elektronen.
  - [Aufgabe Nr. 10](./?atom-bauen=10#atom-bauen): Baue ein neutrales Atom von Neon (Ne) mit der Massenzahl 20. Stelle die Zahl der Protonen, Neutronen und Elektronen ein. → Lösung: Neon hat 10 Protonen, 10 Neutronen und 10 Elektronen.

### neutronen-berechnen (generated, number)

- Link: [./#neutronen-berechnen](./#neutronen-berechnen), im Abschnitt „Übung“
- Antwortformat: eine Zahl eintippen
- Tipp, den die App zeigt (Vorlage: {{…}} sind die Werte der Aufgabe): Neutronen = Massenzahl minus Ordnungszahl.
- Lösungsweg (Vorlage: {{…}} sind die Werte der Aufgabe):
  - $N = A - Z$
  - $N = {{e.massenzahl}} - {{e.ordnungszahl}} = {{answer}}$
- Aufgaben nach Nummer, 1 bis 20: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?neutronen-berechnen=1#neutronen-berechnen): Wie viele Neutronen hat ein Atom Phosphor mit der Massenzahl 31 und der Ordnungszahl 15? → Lösung: 16
    - ✗ 31: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 46: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 2](./?neutronen-berechnen=2#neutronen-berechnen): Wie viele Neutronen hat ein Atom Natrium mit der Massenzahl 23 und der Ordnungszahl 11? → Lösung: 12
    - ✗ 23: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 34: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 3](./?neutronen-berechnen=3#neutronen-berechnen): Wie viele Neutronen hat ein Atom Fluor mit der Massenzahl 19 und der Ordnungszahl 9? → Lösung: 10
    - ✗ 19: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 28: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 4](./?neutronen-berechnen=4#neutronen-berechnen): Wie viele Neutronen hat ein Atom Kohlenstoff mit der Massenzahl 12 und der Ordnungszahl 6? → Lösung: 6
    - ✗ 12: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 18: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 5](./?neutronen-berechnen=5#neutronen-berechnen): Wie viele Neutronen hat ein Atom Argon mit der Massenzahl 40 und der Ordnungszahl 18? → Lösung: 22
    - ✗ 40: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 58: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 6](./?neutronen-berechnen=6#neutronen-berechnen): Wie viele Neutronen hat ein Atom Bor mit der Massenzahl 11 und der Ordnungszahl 5? → Lösung: 6
    - ✗ 11: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 16: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 7](./?neutronen-berechnen=7#neutronen-berechnen): Wie viele Neutronen hat ein Atom Chlor mit der Massenzahl 35 und der Ordnungszahl 17? → Lösung: 18
    - ✗ 35: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 52: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 8](./?neutronen-berechnen=8#neutronen-berechnen): Wie viele Neutronen hat ein Atom Stickstoff mit der Massenzahl 14 und der Ordnungszahl 7? → Lösung: 7
    - ✗ 14: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 21: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 9](./?neutronen-berechnen=9#neutronen-berechnen): Wie viele Neutronen hat ein Atom Silicium mit der Massenzahl 28 und der Ordnungszahl 14? → Lösung: 14
    - ✗ 28: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 42: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 10](./?neutronen-berechnen=10#neutronen-berechnen): Wie viele Neutronen hat ein Atom Calcium mit der Massenzahl 40 und der Ordnungszahl 20? → Lösung: 20
    - ✗ 40: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 60: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 11](./?neutronen-berechnen=11#neutronen-berechnen): Wie viele Neutronen hat ein Atom Beryllium mit der Massenzahl 9 und der Ordnungszahl 4? → Lösung: 5
    - ✗ 9: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 13: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 12](./?neutronen-berechnen=12#neutronen-berechnen): Wie viele Neutronen hat ein Atom Aluminium mit der Massenzahl 27 und der Ordnungszahl 13? → Lösung: 14
    - ✗ 27: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 40: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 13](./?neutronen-berechnen=13#neutronen-berechnen): Wie viele Neutronen hat ein Atom Sauerstoff mit der Massenzahl 16 und der Ordnungszahl 8? → Lösung: 8
    - ✗ 16: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 24: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 14](./?neutronen-berechnen=14#neutronen-berechnen): Wie viele Neutronen hat ein Atom Kalium mit der Massenzahl 39 und der Ordnungszahl 19? → Lösung: 20
    - ✗ 39: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 58: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 15](./?neutronen-berechnen=15#neutronen-berechnen): Wie viele Neutronen hat ein Atom Lithium mit der Massenzahl 7 und der Ordnungszahl 3? → Lösung: 4
    - ✗ 7: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 10: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 16](./?neutronen-berechnen=16#neutronen-berechnen): Wie viele Neutronen hat ein Atom Neon mit der Massenzahl 20 und der Ordnungszahl 10? → Lösung: 10
    - ✗ 20: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 30: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 17](./?neutronen-berechnen=17#neutronen-berechnen): Wie viele Neutronen hat ein Atom Wasserstoff mit der Massenzahl 1 und der Ordnungszahl 1? → Lösung: 0
    - ✗ 1: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 2: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 18](./?neutronen-berechnen=18#neutronen-berechnen): Wie viele Neutronen hat ein Atom Schwefel mit der Massenzahl 32 und der Ordnungszahl 16? → Lösung: 16
    - ✗ 32: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 48: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 19](./?neutronen-berechnen=19#neutronen-berechnen): Wie viele Neutronen hat ein Atom Helium mit der Massenzahl 4 und der Ordnungszahl 2? → Lösung: 2
    - ✗ 4: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 6: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
  - [Aufgabe Nr. 20](./?neutronen-berechnen=20#neutronen-berechnen): Wie viele Neutronen hat ein Atom Magnesium mit der Massenzahl 24 und der Ordnungszahl 12? → Lösung: 12
    - ✗ 24: Das ist die Massenzahl. Sie zählt Protonen und Neutronen zusammen. Ziehe die Protonen ab.
    - ✗ 36: Du hast die Protonen dazugezählt. Du musst sie abziehen: Neutronen = Massenzahl − Ordnungszahl.
