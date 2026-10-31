// UnoCSS presets (Tailwind-compatible utilities and typography). The CLI scans the built HTML in _site/ (see "build" in package.json).
import presetWind4 from "@unocss/preset-wind4";
import presetTypography from "@unocss/preset-typography";

// Dark mode of the pages of this repository: it follows the system (prefers-color-scheme), with no switch and no
// script. The pages use utility classes with fixed colours, so the light sections get dark values here instead of a
// "dark:" twin on every class. Only descendants of a light section (bg-white or bg-slate-50) are changed; the dark
// and blue sections (hero, rules, final call to action) and the links and buttons in them stay as they are; only the blue block at the end of a page changes (below).
const dark = `
svg.icon { flex: none; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
:root { color-scheme: light dark; }
@media (prefers-color-scheme: dark) {
  .bg-white:not(a, button) { background-color: #0b1220; }
  .bg-slate-50:not(a, button) { background-color: #111a2e; }
  .bg-slate-50 .bg-white:not(a, button) { background-color: #17233b; }
  /* A white button or link in a light section (the copy button, the address links of a dialog) gets the colour of a
     card, so that its text, which is light here, stays readable. */
  :is(.bg-white, .bg-slate-50) :is(a, button).bg-white { background-color: #17233b; }
  :is(.bg-white, .bg-slate-50) img.avatar { filter: brightness(0.78) contrast(1.08); } /* a photo is dimmed, not inverted */
  :is(.bg-white, .bg-slate-50) .bg-blue-50 { background-color: #172554; }
  :is(.bg-white, .bg-slate-50) .border-blue-200 { border-color: #1e3a8a; }
  :is(.bg-white, .bg-slate-50) .border-slate-200 { border-color: #2a3a52; }
  :is(.bg-white, .bg-slate-50) .border-slate-300 { border-color: #3b4a61; }
  :is(.bg-white, .bg-slate-50) .text-slate-900 { color: #f1f5f9; }
  :is(.bg-white, .bg-slate-50) .text-slate-800 { color: #e2e8f0; }
  :is(.bg-white, .bg-slate-50) .text-slate-700 { color: #cbd5e1; }
  :is(.bg-white, .bg-slate-50) .text-slate-600 { color: #b8c4d6; }
  :is(.bg-white, .bg-slate-50) .text-slate-500 { color: #a3b1c6; }
  :is(.bg-white, .bg-slate-50) .text-blue-600,
  :is(.bg-white, .bg-slate-50) .text-blue-700,
  :is(.bg-white, .bg-slate-50) .text-blue-800 { color: #93c5fd; }
  /* The blue block at the end of a page: dark blue, not the bright blue of the light mode, with a blue button instead
     of a white one that would glare on a dark page. */
  section.bg-blue-700 { background-color: #1e3a8a; }
  section.bg-blue-700 a.bg-white { background-color: #2563eb; color: #fff; }
  section.bg-blue-700 a.bg-white:hover { background-color: #1d4ed8; }
  section.bg-blue-700 a.bg-blue-600 { background-color: transparent; border-color: #93c5fd; }
  section.bg-blue-700 a.bg-blue-600:hover { background-color: #1d4ed8; }
  :is(.bg-white, .bg-slate-50) .hover\\:text-blue-700:hover,
  :is(.bg-white, .bg-slate-50) .hover\\:text-blue-800:hover { color: #bfdbfe; }
}
`;

export default {
  presets: [presetWind4(), presetTypography()],
  preflights: [{ getCSS: () => dark }],
};
