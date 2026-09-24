# Finding and embedding videos

## Search

1. Web search per competency: `<Kanal> <Fachbegriff> youtube` (e.g. `Lehrerschmidt Grundwert berechnen youtube`).
2. Verify each candidate:
   ```bash
   curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"
   ```
   Accept only if `author_name` is the intended channel and `title` matches the competency. WebFetch on youtube.com usually returns only the footer; oEmbed is reliable.
3. Record per competency: exact title, ID, verified yes/no. One video may cover two competencies. Report how many were verified.
4. Other channels' hits for the same topic are excluded unless the user approves the channel.

## Embedding (already in the kern)

Front matter of `src/<app>/<id>.md`: `video: { id: <id>, titel: '<exact title>', kanal: <Kanal> }`. The layout `kompetenz.njk` renders the card with a plain watch link (no-JS fallback) and the hint that starting sends data (including the IP address) to YouTube/Google. `src/kern/js/video.js` draws a local placeholder; only a click loads `youtube-nocookie.com` (two-click embed).

## Pages without a video

No verified video for a page → no `video`. Then pick one of two options, never a note about the missing video:

- **A related page has a video** (the page builds on it): set `videoVerweis` to ONE learner-facing sentence with a real
  link to that page's `#video`, e.g.
  `videoVerweis: 'Wie man einen Baum aufbaut, zeigt das Video auf der Seite <a href="baumdiagramm.html#video">Baumdiagramm</a>.'`
  The sentence says what the video shows, not that this page lacks one.
- **No related video**: set nothing. The page then has no "Video dazu" section at all.

Never write meta phrases such as "die Erklärung oben reicht", "kein <Kanal>-Video" or "kein passendes Video": they read
like an internal note, not like a teacher. `test/build/video-verweis.test.js` rejects them and checks every link.
Document the choice in the app's `llms.njk` ("Video: keines; `#video` verweist auf …" or "Video: keines, kein
Abschnitt `#video`").

## Tutor rule (goes into llms.txt and tutor.md)

"Empfiehl das Video, wenn das Kind die Erklärung zweimal nicht wiedergeben kann; sonst zuerst Aufgaben."
