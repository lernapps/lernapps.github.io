// Datenzugriff der Mathe-Karte: lädt data.json, baut Index-Maps und liefert
// reine Auswahlfunktionen (Filter, Baum, Zusammenfassung). Keine DOM-Zugriffe:
// der Build (lib/karte/laden.js) rendert mit denselben Funktionen die statischen Seiten.

export const AKTIV_LEVEL = { 1: 'Create', 2: 'Solve', 3: 'Collaborate', 4: 'Reflect', 5: 'Receive' };

export const STATUS = {
  keine: { klasse: 'keine', text: 'keine App' },
  ungeprueft: { klasse: 'ungeprueft', text: 'ungeprüft' },
  gruen: { klasse: 'gruen', text: 'geprüft' },
};

export const DSGVO = {
  green: 'DSGVO grün',
  amber: 'DSGVO gelb',
  red: 'DSGVO rot',
  unknown: 'DSGVO offen',
};

export const EXTERNE_ANFRAGEN = {
  none: 'keine externen Anfragen',
  'on-consent': 'externe Anfragen nur nach Klick',
  always: 'externe Anfragen immer',
};

// data.json liegt neben js/ und trägt dasselbe ?v=<Hash> wie dieses Modul (setzt der Build, lib/versionierung.js):
// nach einem Deployment nie alte Daten aus dem Cache zu neuen Modulen.
export function datenUrl(modulUrl) {
  const url = new URL('../data.json', modulUrl);
  url.search = new URL(modulUrl).search;
  return url.href;
}

export async function ladeDaten(url = datenUrl(import.meta.url)) {
  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error(`data.json nicht ladbar (${antwort.status})`);
  return indiziere(await antwort.json());
}

export function indiziere(roh) {
  const kompetenzById = new Map(roh.kompetenzen.map((k) => [k.id, k]));
  const eintragById = new Map(roh.eintraege.map((e) => [e.id, e]));
  const leitideeById = new Map(roh.leitideen.map((l) => [l.id, l]));
  const lehrplanByLand = new Map(roh.lehrplaene.map((l) => [l.land, l]));
  const lehrplanById = new Map(roh.lehrplaene.map((l) => [l.id, l]));
  const zeilenByLand = new Map();
  for (const z of roh.zuordnungen) {
    const plan = lehrplanById.get(z.lehrplan);
    if (plan) zeilenByLand.set(plan.land, z.zeilen);
  }
  const kinderVon = new Map();
  for (const k of roh.kompetenzen) {
    if (!k.parent) continue;
    if (!kinderVon.has(k.parent)) kinderVon.set(k.parent, []);
    kinderVon.get(k.parent).push(k);
  }
  return { ...roh, kompetenzById, eintragById, leitideeById, lehrplanByLand, zeilenByLand, kinderVon };
}

// "7" → [7], "5/6" → [5, 6], "-" → []
export function jahrgaengeAus(text) {
  return String(text).split('/').map((t) => Number(t.trim())).filter((n) => Number.isInteger(n) && n >= 5 && n <= 10);
}

export function zuordnungenFuer(d, land, kompetenzId) {
  return (d.zeilenByLand.get(land) ?? []).filter((z) => z.kompetenz === kompetenzId);
}

export function statusText(kompetenz) {
  const n = kompetenz.abdeckung?.length ?? 0;
  if (kompetenz.status === 'ungeprueft') return `${n} ${n === 1 ? 'App' : 'Apps'} · ungeprüft`;
  return STATUS[kompetenz.status]?.text ?? kompetenz.status;
}

export function istErfasst(d, land) {
  const plan = d.lehrplanByLand.get(land);
  return Boolean(plan && plan.erfasst !== 'nein' && d.zeilenByLand.has(land));
}

// Für ein nicht erfasstes Land gibt es keine Jahrgänge; der Jahrgangsfilter
// greift dann nicht, statt eine leere Karte zu zeigen.
export function kompetenzenFuer(d, { land = 'HE', jahrgang = null, leitidee = null, nurLuecken = false } = {}) {
  if (!istErfasst(d, land)) jahrgang = null;
  return d.kompetenzen.filter((k) => {
    if (leitidee && k.leitidee !== leitidee) return false;
    if (nurLuecken && k.status !== 'keine') return false;
    if (jahrgang != null) {
      const zeilen = zuordnungenFuer(d, land, k.id);
      if (!zeilen.some((z) => jahrgaengeAus(z.jahrgang).includes(jahrgang))) return false;
    }
    return true;
  });
}

// Gruppiert eine Trefferliste zu Leitidee → Wurzelknoten → Kinder.
// Ein Elternknoten ohne eigenen Treffer erscheint als Kontext (kontext: true),
// wenn eines seiner Kinder getroffen wurde.
export function baumFuer(d, treffer) {
  const getroffen = new Set(treffer.map((k) => k.id));
  const baum = [];
  for (const leitidee of d.leitideen) {
    const knoten = [];
    for (const k of d.kompetenzen) {
      if (k.leitidee !== leitidee.id || k.parent) continue;
      const kinder = (d.kinderVon.get(k.id) ?? []).filter((c) => getroffen.has(c.id));
      const selbst = getroffen.has(k.id);
      if (!selbst && !kinder.length) continue;
      knoten.push({ kompetenz: k, kontext: !selbst, kinder: kinder.map((c) => ({ kompetenz: c, kontext: false, kinder: [] })) });
    }
    if (knoten.length) baum.push({ leitidee, knoten });
  }
  return baum;
}

export function jahrgangBadges(zeilen) {
  const gesehen = new Map();
  for (const z of zeilen) {
    if (!gesehen.has(z.jahrgang)) gesehen.set(z.jahrgang, { text: z.jahrgang, einheit: z.einheit, pflicht: z.pflicht !== 'nein' });
  }
  return [...gesehen.values()].sort((a, b) => (jahrgaengeAus(a.text)[0] ?? 0) - (jahrgaengeAus(b.text)[0] ?? 0));
}

export function zusammenfassung(d, filter = {}) {
  const treffer = kompetenzenFuer(d, filter);
  const mitApp = treffer.filter((k) => k.status !== 'keine').length;
  const plan = d.lehrplanByLand.get(filter.land ?? 'HE');
  const teile = [plan?.landname ?? filter.land, plan?.schulform ?? 'Gymnasium'];
  if (plan && plan.erfasst === 'nein') teile.push('noch nicht erfasst');
  else teile.push(filter.jahrgang != null ? `Jahrgang ${filter.jahrgang}` : 'alle Jahrgänge');
  if (filter.leitidee) teile.push(d.leitideeById.get(filter.leitidee)?.titel ?? filter.leitidee);
  const gesamt = treffer.length;
  const text = `${teile.join(' · ')}: ${gesamt} ${gesamt === 1 ? 'Kompetenz' : 'Kompetenzen'}, ${mitApp} mit App, ${gesamt - mitApp} ohne`;
  return { gesamt, mitApp, ohne: gesamt - mitApp, text };
}
