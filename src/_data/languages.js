// The languages of the site, German first: the language's code, the root of its tree ("" for German, "en/" for
// English; see site-frame/nav.js) and its texts. Pages are generated once per language (pagination over this list).
import de from "./de.js";
import en from "./en.js";

export default [
  { code: "de", root: "", t: de },
  { code: "en", root: "en/", t: en },
];
