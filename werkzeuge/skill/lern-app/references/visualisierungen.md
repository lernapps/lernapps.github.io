# Visualisations that teach

A visualisation earns its place when the learner can change a value and see the idea respond. Draw it as SVG from `src/<app>/js/vis/<id>.js` with `svgEl` (`src/kern/js/svg.js`); the same function renders the static picture at build time and redraws it in the browser, so it never touches `document`. No canvas libraries, no external assets. It updates with the current task and has a text caption that states what it shows.

## Patterns that worked

| Idea | Picture | Reference |
|---|---|---|
| Product of brackets | rectangle split into a², ab, ab, b²; lengths from the task | `src/binom/js/vis/erste-binomische.js` |
| Difference of squares | a² − b² as an L-shape, rearranged into (a + b)(a − b) | `src/binom/js/vis/dritte-binomische.js` |
| Part of a whole | 10×10 grid, highlighted squares | `src/prozent/js/vis/prozentwert.js` |
| Before/after change | two bars with labels | `src/prozent/js/vis/veraenderung.js` |
| Outcome set | die faces / wheel sectors / balls, favourable ones marked | `src/zufall/js/vis/laplace.js` |
| Multi-stage experiment | tree with branch fractions, clickable paths | `src/zufall/js/vis/baumdiagramm.js`, `pfadregel-2.js` |
| Drawing without replacement | urn before/after, ball removed | `src/zufall/js/vis/ohne-zuruecklegen.js` |

## Ideas for Physik

- Linear motion: s-t and v-t graphs side by side, slider for v, a dot moving along a line.
- Lever / Drehmoment: beam with draggable weights, balance tilts.
- Optics: ray diagram for a convex lens, draggable object distance, image forms.
- Circuits: series vs parallel with resistor values, current arrows scale with I.
- Density: blocks of equal mass, volumes differ; float/sink in a liquid of chosen density.

## Ideas for Chemie

- Particle model: states of matter as dots whose spacing and speed follow a temperature slider.
- Atom model: shells with electrons for element 1–20, valence electrons highlighted.
- Reaction equations: balance by adjusting coefficients; atom counts left/right as bars that turn green when equal.
- Stöchiometrie: mol ↔ g ↔ particles as a three-box conversion with the molar mass in the middle.
- pH scale: coloured bar, concentration slider, logarithmic steps labelled.

## Rules

- Mobile first: works at 360 px; if a diagram must scroll horizontally, say so in the caption.
- Every interactive element is reachable by keyboard; SVG has `role="img"` and `aria-label`, or a text alternative next to it.
- The exercise must not depend on the picture being visible; the picture explains, the checker checks.
