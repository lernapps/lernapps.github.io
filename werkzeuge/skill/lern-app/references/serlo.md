# Finding and linking serlo.org articles

serlo.org belongs to the non-profit Serlo Education e.V.: free, ad-free, no login. A competency page may link one
serlo article as a second explanation in other words. It is a plain link, nothing else.

## Search

1. Per competency, browse the serlo taxonomy (e.g. `https://de.serlo.org/mathe`) or use the public GraphQL API
   `https://api.serlo.org/graphql`. A web search `site:de.serlo.org <Fachbegriff>` also works.
2. Verify each candidate with curl, never by title alone:
   ```bash
   curl -sL -o /tmp/serlo.html -w "%{http_code} %{url_effective}\n" "https://de.serlo.org/mathe/<id>/<slug>"
   grep -o "<title>[^<]*" /tmp/serlo.html; rm /tmp/serlo.html
   ```
   Accept only if: status 200; the final URL is the article itself (not a search, not a redirect to a generic
   page, not empty); it is an article or an exercise collection; and its content covers THIS competency. The
   Laplace page needs an article on Laplace probability, not on probability in general. If the HTML carries little
   text, check the `__NEXT_DATA__` JSON for title and content.
3. Prefer URLs with the stable numeric ID: `https://de.serlo.org/mathe/<id>/<slug>`.
4. Record per competency: URL, exact title found on the page, verified yes/no. No good match → no link. Never force
   a weak match; list the page as "no serlo match" in the PR.

## Linking (already in the layout)

Front matter of `src/<app>/<id>.md`: `serlo: { url: 'https://de.serlo.org/mathe/<id>/<slug>', titel: '<exact title>' }`.
`kompetenz.njk` renders `<section id="serlo">` after the video, inside the explanation: "Noch eine Erklärung:
<titel> bei serlo.org" with `rel="noopener"`. No iframe, no preview image, no request before the click. The build
fails if a link under `#serlo` does not start with `https://de.serlo.org/` (no network access in the build).

## Tutor rule (goes into llms.txt and tutor.md)

"Nenne den serlo-Link unter `#serlo` als zweite Erklärung in anderen Worten, wenn Regel, Beispiel und Video nicht
gereicht haben." Copy the bullet from `src/binom/llms.njk` and `src/binom/tutor.njk`.
