// The navigation of lernapps.net, the same on every site, in every language. German is the source and lives at
// the root of each site, English below /en/ of each site ("/en/", "/apps/en/", "/docs/en/"): the same page has the
// same address within each tree. Texts are plain language (ISO 24495-1). Paths are root-relative: all sites share
// the origin lernapps.net.

// Path prefixes served by other repos on the origin; everything else belongs to the home site ("/").
export const SITES = ["/apps/", "/docs/", "/tooling/", "/mathe-karte/"];

// The languages of the frame, German first, and the sites that have a tree for every language but German.
// A link to another site stays German if that site has no tree in the language of the page.
export const LANGUAGES = ["de", "en"];
export const TRANSLATED_SITES = ["/", "/apps/", "/docs/"];

/** The root of a language's tree below a site: "" for German, "en/" for English. */
export const languageRoot = (lang) => (lang === "de" ? "" : `${lang}/`);

/** How a language is named, in itself. */
export const languageName = { de: "Deutsch", en: "English" };

// Link texts by language. A link goes to the same page in the language of the page the reader is on, unless
//   href is { de, en }: a different address per language (the platform design is English only, so both point to it).
export const nav = {
  de: {
    ariaLabel: "Hauptnavigation",
    homeLabel: "lernapps.net – Startseite",
  },
  en: {
    ariaLabel: "Main navigation",
    homeLabel: "lernapps.net – home page",
  },
  links: [
    { label: { de: "Apps finden", en: "Find apps" }, href: "/apps/" },
    // Listing is a section of "App bauen" (/apps/build/#eintragen); /apps/enter/ stays, linked from there.
    { label: { de: "App bauen", en: "Build an app" }, href: "/apps/build/" },
    { label: { de: "Tooling", en: "Tooling" }, href: "/tooling/" },
    // What lernapps is made of: for users, for developers, and what makes the platform unique. The docs (/docs/)
    // are linked from there and from the footer.
    { label: { de: "Features", en: "Features" }, href: "/features/" },
    // One page per persona, with a prompt each for their AI assistant.
    { label: { de: "Mitmachen", en: "Get involved" }, href: "/join/" },
  ],
};

export const footer = {
  de: {
    ariaLabel: "Fußzeile",
    free: "lernapps.net ist kostenlos und ohne Werbung. Es lebt von deinem Danke.",
    sourceLabel: "Quellcode",
  },
  en: {
    ariaLabel: "Footer",
    free: "lernapps.net is free and has no ads. It lives on your thanks.",
    sourceLabel: "Source code",
  },
  links: [
    { label: { de: "Datenschutz", en: "Privacy" }, href: "/privacy/" },
    { label: { de: "Impressum", en: "Imprint" }, href: "/imprint/" },
    { label: { de: "So ist es gedacht", en: "How it is meant" }, href: "/docs/" },
    {
      label: { de: "Plattform-Design", en: "Platform design" },
      href: { de: "/docs/platform-design/", en: "/docs/platform-design/" },
    },
    // The source link of the site is added by footer({ source }).
  ],
};

export const texts = {
  de: {
    skipLink: "Zum Inhalt springen",
    preview: "Vorschau einer Änderung. Die echte Seite:",
    languageSwitch: "Sprache",
  },
  en: {
    skipLink: "Skip to content",
    preview: "Preview of a change. The real page:",
    languageSwitch: "Language",
  },
};
