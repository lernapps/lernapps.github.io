# Stoffeigenschaften – Tutor-Datei

> Aggregatzustand, Schmelz- und Siedetemperatur: Daran erkennst du Stoffe und schließt auf ihre Verwendung.

App: Anorganische Chemie – Einstieg. Seite: [Stoffeigenschaften](./)

Diese Datei ist für einen KI-Tutor. Sie enthält die Lösungen: Nutze sie, um anzuleiten und Fehler zu erkennen, nicht um vorzusagen. Die Regeln stehen in llms.txt. Kannst du eine Datei der App nicht abrufen, bitte die lernende Person, den Text der Seite oder diese Datei einzufügen oder anzuhängen.

## Abschnitte

- [Warum](./#warum)
- [Regel](./#regel)
- [Beispiel](./#beispiel)
- [Übung](./#uebung)

## Übungen

### zustand-bestimmen (generated, choice)

- Link: [./#zustand-bestimmen](./#zustand-bestimmen), im Abschnitt „Übung“
- Antwortformat: eine Antwort wählen
- Tipp, den die App zeigt (Vorlage: {{…}} sind die Werte der Aufgabe): Vergleiche 20 °C mit der Schmelztemperatur und der Siedetemperatur von {{e.name}}.
- Lösungsweg (Vorlage: {{…}} sind die Werte der Aufgabe):
  - {{e.name}} schmilzt bei {{e.schmelz}} °C und siedet bei {{e.siede}} °C.
  - Bei 20 °C ist {{e.name}} also {{answer}}.
- Aufgaben nach Nummer, 1 bis 9: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?zustand-bestimmen=1#zustand-bestimmen): Ist Eisen bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: fest
  - [Aufgabe Nr. 2](./?zustand-bestimmen=2#zustand-bestimmen): Ist Aluminium bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: fest
  - [Aufgabe Nr. 3](./?zustand-bestimmen=3#zustand-bestimmen): Ist Kupfer bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: fest
  - [Aufgabe Nr. 4](./?zustand-bestimmen=4#zustand-bestimmen): Ist Quecksilber bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: flüssig
  - [Aufgabe Nr. 5](./?zustand-bestimmen=5#zustand-bestimmen): Ist Sauerstoff bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: gasförmig
  - [Aufgabe Nr. 6](./?zustand-bestimmen=6#zustand-bestimmen): Ist Kochsalz (Natriumchlorid) bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: fest
  - [Aufgabe Nr. 7](./?zustand-bestimmen=7#zustand-bestimmen): Ist Ethanol bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: flüssig
  - [Aufgabe Nr. 8](./?zustand-bestimmen=8#zustand-bestimmen): Ist Wasser bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: flüssig
  - [Aufgabe Nr. 9](./?zustand-bestimmen=9#zustand-bestimmen): Ist Stickstoff bei Zimmertemperatur (20 °C) fest, flüssig oder gasförmig? Zur Wahl: fest; flüssig; gasförmig. → Lösung: gasförmig

### siedetemperatur-ordnen (generated, order)

- Link: [./#siedetemperatur-ordnen](./#siedetemperatur-ordnen), im Abschnitt „Übung“
- Antwortformat: die Einträge in die richtige Reihenfolge bringen (die App zeigt sie gemischt)
- Tipp, den die App zeigt (Vorlage: {{…}} sind die Werte der Aufgabe): Der Stoff, der am leichtesten gasförmig wird, hat die niedrigste Siedetemperatur.
- Lösungsweg (Vorlage: {{…}} sind die Werte der Aufgabe):
  - Sortiere nach der Siedetemperatur, von niedrig nach hoch.
- Aufgaben nach Nummer, 1 bis 67: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?siedetemperatur-ordnen=1#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Wasser und Kupfer. → Lösung: 1. Ethanol, 2. Wasser, 3. Kupfer
    - ✗ Kupfer, Wasser, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 2](./?siedetemperatur-ordnen=2#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Aluminium und Quecksilber. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Aluminium
    - ✗ Aluminium, Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 3](./?siedetemperatur-ordnen=3#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Sauerstoff, Stickstoff und Kochsalz (Natriumchlorid). → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 4](./?siedetemperatur-ordnen=4#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Wasser und Quecksilber. → Lösung: 1. Wasser, 2. Quecksilber, 3. Eisen
    - ✗ Eisen, Quecksilber, Wasser: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 5](./?siedetemperatur-ordnen=5#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Quecksilber und Stickstoff. → Lösung: 1. Stickstoff, 2. Quecksilber, 3. Aluminium
    - ✗ Aluminium, Quecksilber, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 6](./?siedetemperatur-ordnen=6#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Quecksilber und Kupfer. → Lösung: 1. Quecksilber, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 7](./?siedetemperatur-ordnen=7#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Aluminium und Quecksilber. → Lösung: 1. Quecksilber, 2. Aluminium, 3. Eisen
    - ✗ Eisen, Aluminium, Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 8](./?siedetemperatur-ordnen=8#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Stickstoff und Wasser. → Lösung: 1. Stickstoff, 2. Wasser, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Wasser, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 9](./?siedetemperatur-ordnen=9#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Stickstoff und Sauerstoff. → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Eisen
    - ✗ Eisen, Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 10](./?siedetemperatur-ordnen=10#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Quecksilber und Ethanol. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 11](./?siedetemperatur-ordnen=11#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Stickstoff und Quecksilber. → Lösung: 1. Stickstoff, 2. Ethanol, 3. Quecksilber
    - ✗ Quecksilber, Ethanol, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 12](./?siedetemperatur-ordnen=12#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Kochsalz (Natriumchlorid) und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Ethanol, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Ethanol, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 13](./?siedetemperatur-ordnen=13#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kupfer, Quecksilber und Aluminium. → Lösung: 1. Quecksilber, 2. Aluminium, 3. Kupfer
    - ✗ Kupfer, Aluminium, Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 14](./?siedetemperatur-ordnen=14#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Kochsalz (Natriumchlorid) und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Wasser, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Wasser, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 15](./?siedetemperatur-ordnen=15#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Eisen und Stickstoff. → Lösung: 1. Stickstoff, 2. Kochsalz (Natriumchlorid), 3. Eisen
    - ✗ Eisen, Kochsalz (Natriumchlorid), Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 16](./?siedetemperatur-ordnen=16#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Aluminium und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Quecksilber, 3. Aluminium
    - ✗ Aluminium, Quecksilber, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 17](./?siedetemperatur-ordnen=17#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Sauerstoff und Kochsalz (Natriumchlorid). → Lösung: 1. Sauerstoff, 2. Wasser, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Wasser, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 18](./?siedetemperatur-ordnen=18#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Eisen und Aluminium. → Lösung: 1. Stickstoff, 2. Aluminium, 3. Eisen
    - ✗ Eisen, Aluminium, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 19](./?siedetemperatur-ordnen=19#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Wasser und Kochsalz (Natriumchlorid). → Lösung: 1. Wasser, 2. Quecksilber, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Quecksilber, Wasser: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 20](./?siedetemperatur-ordnen=20#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Kupfer und Eisen. → Lösung: 1. Kochsalz (Natriumchlorid), 2. Kupfer, 3. Eisen
    - ✗ Eisen, Kupfer, Kochsalz (Natriumchlorid): Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 21](./?siedetemperatur-ordnen=21#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Kochsalz (Natriumchlorid) und Kupfer. → Lösung: 1. Ethanol, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 22](./?siedetemperatur-ordnen=22#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kupfer, Quecksilber und Kochsalz (Natriumchlorid). → Lösung: 1. Quecksilber, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 23](./?siedetemperatur-ordnen=23#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Stickstoff und Wasser. → Lösung: 1. Stickstoff, 2. Ethanol, 3. Wasser
    - ✗ Wasser, Ethanol, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 24](./?siedetemperatur-ordnen=24#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Sauerstoff, Kupfer und Kochsalz (Natriumchlorid). → Lösung: 1. Sauerstoff, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 25](./?siedetemperatur-ordnen=25#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Ethanol und Quecksilber. → Lösung: 1. Stickstoff, 2. Ethanol, 3. Quecksilber
    - ✗ Quecksilber, Ethanol, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 26](./?siedetemperatur-ordnen=26#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Stickstoff und Kupfer. → Lösung: 1. Stickstoff, 2. Aluminium, 3. Kupfer
    - ✗ Kupfer, Aluminium, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 27](./?siedetemperatur-ordnen=27#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Stickstoff und Ethanol. → Lösung: 1. Stickstoff, 2. Ethanol, 3. Quecksilber
    - ✗ Quecksilber, Ethanol, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 28](./?siedetemperatur-ordnen=28#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Aluminium und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Wasser, 3. Aluminium
    - ✗ Aluminium, Wasser, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 29](./?siedetemperatur-ordnen=29#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Aluminium und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Aluminium, 3. Eisen
    - ✗ Eisen, Aluminium, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 30](./?siedetemperatur-ordnen=30#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Kochsalz (Natriumchlorid) und Aluminium. → Lösung: 1. Kochsalz (Natriumchlorid), 2. Aluminium, 3. Eisen
    - ✗ Eisen, Aluminium, Kochsalz (Natriumchlorid): Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 31](./?siedetemperatur-ordnen=31#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Quecksilber und Sauerstoff. → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Quecksilber
    - ✗ Quecksilber, Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 32](./?siedetemperatur-ordnen=32#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Wasser und Kochsalz (Natriumchlorid). → Lösung: 1. Wasser, 2. Kochsalz (Natriumchlorid), 3. Aluminium
    - ✗ Aluminium, Kochsalz (Natriumchlorid), Wasser: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 33](./?siedetemperatur-ordnen=33#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Ethanol und Wasser. → Lösung: 1. Ethanol, 2. Wasser, 3. Aluminium
    - ✗ Aluminium, Wasser, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 34](./?siedetemperatur-ordnen=34#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Quecksilber und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Quecksilber, 3. Eisen
    - ✗ Eisen, Quecksilber, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 35](./?siedetemperatur-ordnen=35#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Aluminium und Kupfer. → Lösung: 1. Kochsalz (Natriumchlorid), 2. Aluminium, 3. Kupfer
    - ✗ Kupfer, Aluminium, Kochsalz (Natriumchlorid): Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 36](./?siedetemperatur-ordnen=36#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Kupfer und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Quecksilber, 3. Kupfer
    - ✗ Kupfer, Quecksilber, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 37](./?siedetemperatur-ordnen=37#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Sauerstoff, Kupfer und Aluminium. → Lösung: 1. Sauerstoff, 2. Aluminium, 3. Kupfer
    - ✗ Kupfer, Aluminium, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 38](./?siedetemperatur-ordnen=38#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Ethanol und Quecksilber. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Eisen
    - ✗ Eisen, Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 39](./?siedetemperatur-ordnen=39#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kupfer, Ethanol und Kochsalz (Natriumchlorid). → Lösung: 1. Ethanol, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 40](./?siedetemperatur-ordnen=40#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Quecksilber und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Ethanol, 3. Quecksilber
    - ✗ Quecksilber, Ethanol, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 41](./?siedetemperatur-ordnen=41#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Kochsalz (Natriumchlorid) und Kupfer. → Lösung: 1. Wasser, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Wasser: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 42](./?siedetemperatur-ordnen=42#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Kochsalz (Natriumchlorid) und Ethanol. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 43](./?siedetemperatur-ordnen=43#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Eisen und Kupfer. → Lösung: 1. Quecksilber, 2. Kupfer, 3. Eisen
    - ✗ Eisen, Kupfer, Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 44](./?siedetemperatur-ordnen=44#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Quecksilber und Ethanol. → Lösung: 1. Ethanol, 2. Wasser, 3. Quecksilber
    - ✗ Quecksilber, Wasser, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 45](./?siedetemperatur-ordnen=45#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Sauerstoff und Ethanol. → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Ethanol
    - ✗ Ethanol, Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 46](./?siedetemperatur-ordnen=46#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Kupfer und Wasser. → Lösung: 1. Ethanol, 2. Wasser, 3. Kupfer
    - ✗ Kupfer, Wasser, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 47](./?siedetemperatur-ordnen=47#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Stickstoff und Wasser. → Lösung: 1. Stickstoff, 2. Wasser, 3. Eisen
    - ✗ Eisen, Wasser, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 48](./?siedetemperatur-ordnen=48#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Ethanol, Sauerstoff und Kochsalz (Natriumchlorid). → Lösung: 1. Sauerstoff, 2. Ethanol, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Ethanol, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 49](./?siedetemperatur-ordnen=49#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Eisen und Stickstoff. → Lösung: 1. Stickstoff, 2. Quecksilber, 3. Eisen
    - ✗ Eisen, Quecksilber, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 50](./?siedetemperatur-ordnen=50#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kupfer, Stickstoff und Aluminium. → Lösung: 1. Stickstoff, 2. Aluminium, 3. Kupfer
    - ✗ Kupfer, Aluminium, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 51](./?siedetemperatur-ordnen=51#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Quecksilber und Kochsalz (Natriumchlorid). → Lösung: 1. Quecksilber, 2. Kochsalz (Natriumchlorid), 3. Aluminium
    - ✗ Aluminium, Kochsalz (Natriumchlorid), Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 52](./?siedetemperatur-ordnen=52#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Ethanol und Quecksilber. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 53](./?siedetemperatur-ordnen=53#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Sauerstoff, Aluminium und Quecksilber. → Lösung: 1. Sauerstoff, 2. Quecksilber, 3. Aluminium
    - ✗ Aluminium, Quecksilber, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 54](./?siedetemperatur-ordnen=54#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Sauerstoff und Stickstoff. → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Kochsalz (Natriumchlorid)
    - ✗ Kochsalz (Natriumchlorid), Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 55](./?siedetemperatur-ordnen=55#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Wasser und Aluminium. → Lösung: 1. Stickstoff, 2. Wasser, 3. Aluminium
    - ✗ Aluminium, Wasser, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 56](./?siedetemperatur-ordnen=56#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Stickstoff und Quecksilber. → Lösung: 1. Stickstoff, 2. Wasser, 3. Quecksilber
    - ✗ Quecksilber, Wasser, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 57](./?siedetemperatur-ordnen=57#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Kupfer und Kochsalz (Natriumchlorid). → Lösung: 1. Stickstoff, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 58](./?siedetemperatur-ordnen=58#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Kupfer und Sauerstoff. → Lösung: 1. Stickstoff, 2. Sauerstoff, 3. Kupfer
    - ✗ Kupfer, Sauerstoff, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 59](./?siedetemperatur-ordnen=59#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Sauerstoff, Quecksilber und Ethanol. → Lösung: 1. Sauerstoff, 2. Ethanol, 3. Quecksilber
    - ✗ Quecksilber, Ethanol, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 60](./?siedetemperatur-ordnen=60#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Kochsalz (Natriumchlorid) und Eisen. → Lösung: 1. Kochsalz (Natriumchlorid), 2. Aluminium, 3. Eisen
    - ✗ Eisen, Aluminium, Kochsalz (Natriumchlorid): Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 61](./?siedetemperatur-ordnen=61#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Quecksilber und Eisen. → Lösung: 1. Quecksilber, 2. Kochsalz (Natriumchlorid), 3. Eisen
    - ✗ Eisen, Kochsalz (Natriumchlorid), Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 62](./?siedetemperatur-ordnen=62#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Kochsalz (Natriumchlorid), Kupfer und Sauerstoff. → Lösung: 1. Sauerstoff, 2. Kochsalz (Natriumchlorid), 3. Kupfer
    - ✗ Kupfer, Kochsalz (Natriumchlorid), Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 63](./?siedetemperatur-ordnen=63#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Aluminium, Kochsalz (Natriumchlorid) und Quecksilber. → Lösung: 1. Quecksilber, 2. Kochsalz (Natriumchlorid), 3. Aluminium
    - ✗ Aluminium, Kochsalz (Natriumchlorid), Quecksilber: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 64](./?siedetemperatur-ordnen=64#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Stickstoff, Kupfer und Wasser. → Lösung: 1. Stickstoff, 2. Wasser, 3. Kupfer
    - ✗ Kupfer, Wasser, Stickstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 65](./?siedetemperatur-ordnen=65#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Eisen, Sauerstoff und Ethanol. → Lösung: 1. Sauerstoff, 2. Ethanol, 3. Eisen
    - ✗ Eisen, Ethanol, Sauerstoff: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 66](./?siedetemperatur-ordnen=66#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Wasser, Kupfer und Quecksilber. → Lösung: 1. Wasser, 2. Quecksilber, 3. Kupfer
    - ✗ Kupfer, Quecksilber, Wasser: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.
  - [Aufgabe Nr. 67](./?siedetemperatur-ordnen=67#siedetemperatur-ordnen): Ordne diese Stoffe nach ihrer Siedetemperatur, den mit der niedrigsten zuerst: Quecksilber, Ethanol und Eisen. → Lösung: 1. Ethanol, 2. Quecksilber, 3. Eisen
    - ✗ Eisen, Quecksilber, Ethanol: Du hast von hoch nach niedrig geordnet. Gefragt ist die niedrigste Siedetemperatur zuerst.

### kupfer-kabel (single-choice)

- Link: [./#kupfer-kabel](./#kupfer-kabel), im Abschnitt „Übung“
- Aufgabe: Warum werden Stromkabel aus Kupfer gemacht?
- Antwortformat: eine Antwort wählen
- Antworten zur Wahl (✓ richtig, ✗ falsch, mit der Meldung der App):
  - ✓ Kupfer leitet den elektrischen Strom gut. – Kupfer ist ein Metall, das den Strom sehr gut leitet. Deshalb steckt es in Leitungen und Kabeln.
  - ✗ Kupfer ist bei Zimmertemperatur flüssig. – Kupfer ist bei 20 °C fest. Es schmilzt erst bei etwa 1085 °C.
  - ✗ Kupfer hat eine sehr niedrige Siedetemperatur. – Kupfer siedet erst bei etwa 2595 °C. Eine niedrige Siedetemperatur wäre für ein Kabel auch kein Vorteil.
- Lösung: Kupfer leitet den elektrischen Strom gut.
- Erklärung: Man wählt einen Stoff nach der Eigenschaft, die man braucht. Ein Kabel muss den Strom gut leiten, und das kann Kupfer.
