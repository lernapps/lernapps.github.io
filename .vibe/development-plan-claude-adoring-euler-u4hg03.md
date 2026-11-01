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
