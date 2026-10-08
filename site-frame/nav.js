// The navigation of lernapps.net, the same on every site. Texts are German (they are read by teachers,
// parents and creators), plain language. Paths are root-relative: all sites share the origin lernapps.net.

// Path prefixes served by other repos on the origin; everything else belongs to the home site ("/").
export const SITES = ["/apps/", "/docs/", "/mathe-karte/"];

export const nav = {
  ariaLabel: "Hauptnavigation",
  homeLabel: "lernapps.net – Startseite",
  links: [
    { label: "Apps finden", href: "/apps/" },
    { label: "App eintragen", href: "/apps/eintragen/" },
    { label: "So ist es gedacht", href: "/docs/" },
    { label: "Mitmachen", href: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md" },
  ],
};

export const footer = {
  ariaLabel: "Fußzeile",
  free: "lernapps.net ist kostenlos und ohne Werbung. Es lebt von deinem Danke.",
  links: [
    { label: "Datenschutz", href: "/privacy/" },
    { label: "Impressum", href: "/imprint/" },
    { label: "Plattform-Design", href: "/docs/platform-design/" },
    // The source link of the site is added by footer({ source }).
  ],
  sourceLabel: "Quellcode",
};

export const texts = {
  skipLink: "Zum Inhalt springen",
  preview: "Vorschau einer Änderung. Die echte Seite:",
};
