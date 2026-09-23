/*
 * Datenschicht der Mathe-Karte (früher scripts/build-data.mjs): flacher Frontmatter-Parser (edugo-kompatibel: nur
 * Strings, Zahlen und [a, b]-Listen), Tabellen-Parser, Referenz- und Enum-Prüfung, Abdeckung. Reine Funktionen;
 * lib/karte/laden.js liest damit src/karte/daten/ als Eleventy-Daten.
 */
export const ENUMS = {
  dsgvo: ['green', 'amber', 'red', 'unknown'],
  'external-requests': ['none', 'on-consent', 'always'],
  backend: ['none', 'optional', 'required'],
  evidence: ['anecdotal', 'community-validated', 'research-backed'],
  erfasst: ['nein', 'teilweise', 'vollstaendig'],
  pflicht: ['ja', 'nein'],
};

export const REQUIRED = {
  leitideen: ['id', 'titel', 'quelle', 'reihenfolge'],
  kompetenzen: ['id', 'titel', 'leitidee', 'kmk-standard', 'schluesselwoerter'],
  lehrplaene: ['id', 'land', 'landname', 'schulform', 'stufe', 'dokument', 'url', 'stand', 'erfasst'],
  zuordnungen: ['lehrplan'],
  eintraege: ['id', 'titel', 'url', 'quellcode', 'kompetenzen', 'aktiv-level', 'backend',
    'external-requests', 'dsgvo', 'evidence', 'jahrgaenge', 'lizenz', 'stand'],
};

// --- Parser -----------------------------------------------------------------

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '') return '';
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function stripComment(raw) {
  // Kommentar nur außerhalb von Anführungszeichen entfernen.
  let quote = null;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(raw[i - 1]))) return raw.slice(0, i);
  }
  return raw;
}

function parseList(inner) {
  const items = [];
  let cur = '';
  let quote = null;
  for (const c of inner) {
    if (quote) { if (c === quote) quote = null; else cur += c; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === ',') { items.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '' || items.length) items.push(cur);
  return items.map((x) => x.trim()).filter((x) => x !== '').map(parseScalar);
}

export function leseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') throw new Error('Frontmatter fehlt: Datei muss mit --- beginnen');
  const end = lines.indexOf('---', 1);
  if (end < 0) throw new Error('Frontmatter nicht geschlossen (zweites --- fehlt)');
  const data = {};
  for (const line of lines.slice(1, end)) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (!m) throw new Error(`Ungültige Frontmatter-Zeile: "${line}"`);
    const key = m[1];
    const raw = stripComment(m[2]).trim();
    if (raw.startsWith('[') && raw.endsWith(']')) data[key] = parseList(raw.slice(1, -1));
    else data[key] = parseScalar(raw);
  }
  const body = lines.slice(end + 1).join('\n').trim();
  return { data, body };
}

export function leseTabelle(body) {
  const lines = body.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('|'));
  if (lines.length < 2) return [];
  const cells = (l) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const header = cells(lines[0]);
  const rows = [];
  for (const line of lines.slice(2)) {
    const c = cells(line);
    if (c.length !== header.length) {
      throw new Error(`Tabellenzeile hat ${c.length} statt ${header.length} Spalten: "${line}"`);
    }
    rows.push(Object.fromEntries(header.map((h, i) => [h, c[i]])));
  }
  return rows;
}

// --- Prüfung ----------------------------------------------------------------

export function pruefeReferenzen(d) {
  const errors = [];
  const ids = (list) => new Set(list.map((x) => x.id));
  const checkDupes = (list, typ) => {
    const seen = new Set();
    for (const x of list) {
      if (seen.has(x.id)) errors.push(`${typ}: id "${x.id}" ist doppelt`);
      seen.add(x.id);
    }
  };
  const checkRequired = (list, typ) => {
    for (const x of list) {
      for (const f of REQUIRED[typ]) {
        if (!(f in x)) errors.push(`${typ} "${x.id ?? x.lehrplan ?? '?'}": Pflichtfeld "${f}" fehlt`);
      }
    }
  };
  const checkEnum = (obj, field, label) => {
    if (field in obj && !ENUMS[field].includes(obj[field])) {
      errors.push(`${label}: ${field} "${obj[field]}" ungültig (erlaubt: ${ENUMS[field].join(', ')})`);
    }
  };

  for (const typ of ['leitideen', 'kompetenzen', 'lehrplaene', 'eintraege']) {
    checkDupes(d[typ], typ);
    checkRequired(d[typ], typ);
  }
  checkRequired(d.zuordnungen, 'zuordnungen');

  const leit = ids(d.leitideen);
  const komp = ids(d.kompetenzen);
  const plan = ids(d.lehrplaene);
  const byId = Object.fromEntries(d.kompetenzen.map((k) => [k.id, k]));

  for (const k of d.kompetenzen) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(k.id ?? '')) errors.push(`kompetenz "${k.id}": id ist nicht kebab-case`);
    if (!leit.has(k.leitidee)) errors.push(`kompetenz "${k.id}": leitidee "${k.leitidee}" unbekannt`);
    if (k.parent) {
      if (!komp.has(k.parent)) errors.push(`kompetenz "${k.id}": parent "${k.parent}" unbekannt`);
      else if (byId[k.parent].parent) errors.push(`kompetenz "${k.id}": parent "${k.parent}" hat selbst einen parent – nur eine Ebene erlaubt`);
    }
  }
  for (const l of d.lehrplaene) checkEnum(l, 'erfasst', `lehrplan "${l.id}"`);
  for (const z of d.zuordnungen) {
    if (!plan.has(z.lehrplan)) errors.push(`zuordnung: lehrplan "${z.lehrplan}" unbekannt`);
    for (const row of z.zeilen ?? []) {
      if (!komp.has(row.kompetenz)) errors.push(`zuordnung "${z.lehrplan}": kompetenz "${row.kompetenz}" unbekannt`);
      checkEnum(row, 'pflicht', `zuordnung "${z.lehrplan}" Zeile "${row.kompetenz}"`);
    }
  }
  for (const e of d.eintraege) {
    for (const f of ['dsgvo', 'external-requests', 'backend', 'evidence']) checkEnum(e, f, `eintrag "${e.id}"`);
    if (!Array.isArray(e.kompetenzen)) errors.push(`eintrag "${e.id}": kompetenzen muss eine Liste sein`);
    else for (const c of e.kompetenzen) if (!komp.has(c)) errors.push(`eintrag "${e.id}": kompetenz "${c}" unbekannt`);
    if ('aktiv-level' in e && !(Number.isInteger(e['aktiv-level']) && e['aktiv-level'] >= 1 && e['aktiv-level'] <= 5)) {
      errors.push(`eintrag "${e.id}": aktiv-level muss 1–5 sein`);
    }
  }
  return errors;
}

// --- Abdeckung --------------------------------------------------------------

export function berechneAbdeckung(kompetenzen, eintraege) {
  const result = {};
  for (const k of kompetenzen) {
    const treffer = eintraege.filter((e) => (e.kompetenzen ?? []).includes(k.id));
    let status = 'keine';
    if (treffer.length) status = treffer.some((e) => e.dsgvo === 'green') ? 'gruen' : 'ungeprueft';
    result[k.id] = { abdeckung: treffer.map((e) => e.id), status };
  }
  return result;
}

