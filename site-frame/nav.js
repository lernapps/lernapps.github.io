// The navigation of lernapps.net, the same on every site, in every language. German is the source and lives at
// the root of each site, English below /en/ of each site ("/en/", "/apps/en/", "/docs/en/"): the same page has the
// same address within each tree. Texts are plain language (ISO 24495-1). Paths are root-relative: all sites share
// the origin lernapps.net.

// Path prefixes served by other repos on the origin; everything else belongs to the home site ("/").
export const SITES = ["/apps/", "/docs/", "/tooling/", "/mathe-karte/"];

// The languages of the frame, German first, and the sites that have a tree for every language but German.
// A link to another site stays German if that site has no tree in the language of the page. A page of such a site
// whose text exists in one language only is in every tree all the same, with the frame of that tree (lernapps-frame
// copies it there): the tooling is English, and /tooling/ and /tooling/en/ both serve it.
export const LANGUAGES = ["de", "en"];
export const TRANSLATED_SITES = ["/", "/apps/", "/docs/", "/tooling/"];

/** The root of a language's tree below a site: "" for German, "en/" for English. */
export const languageRoot = (lang) => (lang === "de" ? "" : `${lang}/`);

/** How a language is named, in itself. */
export const languageName = { de: "Deutsch", en: "English" };


/** Where the language the reader chose by the switch is kept, if it is not their browser's (frame.js). */
export const LANGUAGE_KEY = "lernapps-lang";

// Link texts by language. A link goes to the same page in the language of the page the reader is on, unless
//   href is { de, en }: a different address per language.
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
    // What lernapps is made of: for users, for developers, and what makes the platform unique.
    { label: { de: "Features", en: "Features" }, href: "/features/" },
    // The platform as a whole (/docs/): its vision, how it works, and its models.
    { label: { de: "Plattform", en: "Platform" }, href: "/docs/" },
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
    {
      label: { de: "Plattform-Design", en: "Platform design" },
      href: "/docs/platform-design/",
    },
    // The source link of the site is added by footer({ source }).
  ],
};

export const texts = {
  de: {
    skipLink: "Zum Inhalt springen",
    preview: "Vorschau einer Änderung. Die echte Seite:",
    languageSwitch: "Sprache",
    fallback: "Diese Seite gibt es nicht auf Deutsch.",
  },
  en: {
    skipLink: "Skip to content",
    preview: "Preview of a change. The real page:",
    languageSwitch: "Language",
    fallback: "This page is not available in English.",
  },
};
