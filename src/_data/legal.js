// Controller and imprint data for /privacy/ and /imprint/. One place, used by both pages.
// `email` is required by § 5 DDG and Art. 13 GDPR. While it is missing, the pages show the marker
// `emailMissing` and scripts/check.mjs fails, so the pages cannot be deployed incomplete.

export default {
  name: "Oliver Jägle",
  street: "Am Wiesenteich 10",
  city: "64653 Lorsch",
  country: { de: "Deutschland", en: "Germany" },
  email: null,
  emailMissing: "TODO-EMAIL",
  // Date of the current version of the privacy notice. Update on every change of content.
  updated: { de: "28. September 2026", en: "28 September 2026" },
};
