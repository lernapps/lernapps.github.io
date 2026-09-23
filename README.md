# Lern-Apps

Interaktive Lern-Apps für Mathe, Physik und Chemie in einem Repository: ein gemeinsamer Kern, eine App je Thema,
gebaut mit [Eleventy](https://www.11ty.dev/) zu statischem HTML und ausgeliefert über GitHub Pages unter
<https://raifdmueller.github.io/lern-apps/>.

Jede Seite ist ohne JavaScript lesbar (Text und Bild); JavaScript treibt nur Übung, Test und Selbsteinschätzung.
Kein Server, kein Tracking, keine externen Requests vor dem Klick auf ein Video.

```bash
npm ci          # Eleventy (exakt gepinnt) installieren
npm test        # Unit- und Vertragstests
npm run build   # _site bauen; bricht bei Regelverstößen ab
npm run serve   # lokal ansehen: http://localhost:8080/lern-apps/
```

Apps: [Binomische Formeln](src/binom/) (Mathe, Klasse 8). Wie man eine App oder Kompetenz anlegt, steht in
[CLAUDE.md](CLAUDE.md).
