// The usage counter of the platform sites (src/lernapps-count.njk, served as /lernapps-count.js).
// endpoint: the GoatCounter endpoint, "https://<code>.goatcounter.com/count"; empty means off everywhere.
// Turning it on changes the privacy notice (src/privacy.njk), so set legal.updated in src/_data/legal.js in the same
// commit. See "Usage counter" in README.md.
export default {
  endpoint: "",
  script: "/lernapps-count.js",
};
