# Development Plan: Tutor-Seite neu ordnen und neu texten

*Branch: claude/tutor-page-content-structure-8ba4vr*
*Hinweis: Der MCP-Server `workflows` war in dieser Sitzung nicht verbunden; dieser Plan ist von Hand geführt.*

## Goal
Die Seite /tutor/ soll den Nutzen erklären statt Funktionen zu beschreiben, und lockerer klingen.

## Entscheidungen (mit dem Nutzer abgestimmt)
- Datenschutz („Ein KI-Tutor und Datenschutz? Wie passt das zusammen?“) steht ganz oben; sein Text bleibt.
- „So funktioniert's“: Nutzen, Beispielgespräch, direkt darunter „So läuft es ab“ – ein Abschnitt.
- „Wie der Tutor arbeitet“ und Transparenz sind ein gemeinsamer Block.
- Übrige Texte nutzenorientiert neu, Deutsch und Englisch.
- Alle Anker-IDs bleiben, damit bestehende Links funktionieren.
- Mockup vorab gezeigt und freigegeben.

## Erledigt
- [x] Mockup
- [x] tutor.njk umgebaut, de.js und en.js neu getextet, llms.txt angepasst
- [x] npm run build, npm test, npm run check grün; Handybreite ohne horizontales Scrollen
