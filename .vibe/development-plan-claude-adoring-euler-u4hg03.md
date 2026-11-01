# Development Plan: lernapps.github.io (claude/adoring-euler-u4hg03 branch)

*Workflow: epcc, kept by hand (the workflows MCP server was not reachable in this session)*

## Goal
Feedback: the landing page does not pick up its visitors, above all at the start. Teachers, parents and students are to
see at a glance that they are addressed and what they get. The motivators of each role are worked out on a page of
its own. The platform design follows in lernapps/docs on the same branch.

## Key Decisions
- Entry by role: tabs "I teach / I'm a parent / I go to school" with a panel each (variant 2 of three mockups; user).
  Headline "Lern-Apps, die sofort helfen" (user, instead of "sofort laufen").
- Tabs and panel form one card; on a phone the tabs share one row with short labels (user: buttons and panel looked
  detached).
- Per role four motivators on the home page, the others on the role page (user chose; L2 "attend to children who
  need you" moved to the page as too complex, L4 "class does something itself" on the home page).
- Never imply that teachers or parents want to avoid effort (user).
- Buttons in the panel are equal: catalog for all; exam preparation (/practice/) for parents and students. No
  "build" button: a quiet line under the card addresses everyone who has worked with a coding agent (user).
- Exam preparation is individual, building is for others (user): role pages have two parts, "Apps nutzen" (including
  apps made just for oneself) and "Eine App für andere bauen" on its own tinted band. Students have the first only.
- Addresses in English only: /teachers/, /parents/, /students/, /en/… (user). Anchors #use, #build.
- The cat video is dropped for now (user); it stays in the history.
- The section "Was du davon hast" is dropped: the role card replaces it.

- Review round (simulated teacher, parent, student; user, 2026-11-01): points address the reader actively,
  alternating a statement ("Du findest …") and a request ("Lass …"); teachers' points have the students as subject.
  No promises such as "ohne Bedenken"; no overly concrete examples. The building points leave the home page (they
  stay on the role pages). Buttons: "App-Katalog" stays (our term); "Prüfungsvorbereitung" becomes "Für eine Arbeit
  üben". Role name "Schüler" stays for now ("Lernende" is the neutral option).
- No red accent: ticks are a dark check on a stroke of the highlighter; the chosen tab has a yellow edge (user).
- Next: the same texts in a square with the roles on three corners and a slow change while the page stands still
  (10 s per role, stops on scroll or click), to compare with the tabs (user).

- Headline "Sinnvolle Apps, die etwas bei[[bringen]]." (user, 2026-11-01): not only learning apps (explainers),
  also training (Textcheck) and play (Kniffel). "sofort helfen" read as advertising; "ohne Haken" stressed the
  negative. The highlighter on "bringen" carries the second meaning; a mark inside a word starts flush.
- The square (#112) was closed after a review with simulated users; its screenshots are in that PR's comment.

## Explore
- [x] Platform design (E2, D3, D7, D8), landing page, mockups as artifacts

## Plan
- [x] Role card in the hero (radio inputs, no JavaScript), coding-agent line
- [x] Role pages from one include, texts in de.js and en.js
- [x] Remove the cat video and "Was du davon hast"; llms.txt lists the role pages

## Code
- [x] Build, tests (role card, role pages in step), site-check
- [x] Screenshots light/dark, 390 and 1440 px: no horizontal overflow

## Commit
- [ ] Squash the branch, open the pull request
