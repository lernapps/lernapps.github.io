// Draft: which placement of the cat video the home page builds (a: under the hero, b: dialog, c: own section,
// d: two-column hero). Chosen at build time with CAT_VARIANT; remove this file once one is picked.
export default { variant: process.env.CAT_VARIANT || "b" };
