// UnoCSS presets (Tailwind-compatible utilities and typography). The CLI scans the built HTML in _site/ (see "build" in package.json).
import presetWind4 from "@unocss/preset-wind4";
import presetTypography from "@unocss/preset-typography";
import { darkUtilities } from "./site-frame/dark-utilities.js";

// The dark mode of the pages of this repository is the shared one of the site frame (site-frame/dark-utilities.js);
// here only what belongs to these pages alone.
const icons = `
svg.icon { flex: none; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
`;

export default {
  presets: [presetWind4(), presetTypography()],
  preflights: [{ getCSS: () => icons + darkUtilities }],
};
