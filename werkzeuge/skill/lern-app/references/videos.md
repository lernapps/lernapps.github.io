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

No verified video → `ohneVideo: "Zu dieser Frage gibt es kein <Kanal>-Video; die Erklärung oben reicht."` instead of `video`.

## Tutor rule (goes into llms.txt and tutor.md)

"Empfiehl das Video, wenn das Kind die Erklärung zweimal nicht wiedergeben kann; sonst zuerst Aufgaben."
