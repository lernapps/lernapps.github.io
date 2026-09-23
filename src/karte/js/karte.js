// Rendert Baum und Detail der Karte in den DOM. Keine Datenlogik hier,
// die liegt in daten.js.
import {
  AKTIV_LEVEL, DSGVO, EXTERNE_ANFRAGEN, STATUS,
  baumFuer, jahrgangBadges, statusText, zuordnungenFuer,
} from './daten.js';

export function el(tag, attrs = {}, ...kinder) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  fuege(e, ...kinder);
  return e;
}

// Hängt Kinder an; verschachtelte Listen werden geglättet, null/false übersprungen.
export function fuege(ziel, ...kinder) {
  for (const k of kinder.flat(Infinity)) if (k != null && k !== false) ziel.append(k);
  return ziel;
}

// Minimaler Text→HTML-Renderer: Absätze durch Leerzeilen, Listen mit "- ".
export function absaetze(text) {
  return String(text ?? '').split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean).map((block) => {
    const zeilen = block.split('\n');
    if (zeilen.every((z) => /^[-*] /.test(z))) return el('ul', {}, zeilen.map((z) => el('li', { text: z.slice(2) })));
    return el('p', { text: zeilen.join(' ') });
  });
}

export function statusChip(k) {
  return el('span', { class: `chip ${STATUS[k.status]?.klasse ?? 'keine'}`, text: statusText(k) });
}

function badgeElemente(zeilen) {
  return jahrgangBadges(zeilen).map((b) => el('span', {
    class: `badge${b.pflicht ? '' : ' fakultativ'}`,
    title: b.pflicht ? undefined : 'fakultativ',
  }, b.text, b.einheit && b.einheit !== '-' ? el('span', { class: 'einheit', text: b.einheit }) : null));
}

function knotenElement(d, eintrag, land, aktiv, onWahl) {
  const k = eintrag.kompetenz;
  const zeilen = zuordnungenFuer(d, land, k.id);
  const knopf = el('button', {
    type: 'button', class: 'knoten-zeile', 'data-knoten': k.id, 'aria-expanded': String(aktiv === k.id),
  }, el('span', { class: 'titel', text: k.titel }), badgeElemente(zeilen), statusChip(k));
  knopf.addEventListener('click', () => onWahl(k.id));
  const li = el('li', { class: `knoten${eintrag.kontext ? ' kontext' : ''}`, id: `knoten-${k.id}` }, knopf);
  if (eintrag.kinder.length) li.append(el('ul', {}, eintrag.kinder.map((c) => knotenElement(d, c, land, aktiv, onWahl))));
  return li;
}

export function renderBaum(ziel, d, treffer, { land, aktiv, onWahl }) {
  ziel.replaceChildren();
  const baum = baumFuer(d, treffer);
  if (!baum.length) {
    ziel.append(el('p', { class: 'leer', text: 'Keine Kompetenz passt zu dieser Auswahl.' }));
    return;
  }
  for (const { leitidee, knoten } of baum) {
    const anzahl = knoten.reduce((s, n) => s + (n.kontext ? 0 : 1) + n.kinder.length, 0);
    ziel.append(el('section', { class: 'leitidee', id: `leitidee-${leitidee.id}` },
      el('h2', {}, leitidee.titel, el('span', { class: 'leise', text: `${anzahl} ${anzahl === 1 ? 'Kompetenz' : 'Kompetenzen'}` })),
      el('ul', { class: 'baum' }, knoten.map((n) => knotenElement(d, n, land, aktiv, onWahl)))));
  }
}

export function appKarte(e, { mitKompetenzen = null } = {}) {
  const meta = el('div', { class: 'meta' },
    el('span', { class: 'badge', text: `Aktiv-Level ${e['aktiv-level']} · ${AKTIV_LEVEL[e['aktiv-level']] ?? '?'}` }),
    el('span', { class: `chip dsgvo-${e.dsgvo}`, text: DSGVO[e.dsgvo] ?? e.dsgvo }),
    el('span', { class: 'leise', text: EXTERNE_ANFRAGEN[e['external-requests']] ?? e['external-requests'] }),
  );
  const links = el('p', { class: 'leise' },
    el('a', { href: e.url, rel: 'noopener', text: 'App öffnen' }),
    e.quellcode ? [' · ', el('a', { href: e.quellcode, rel: 'noopener', text: 'Quellcode' })] : null,
    e.stand ? ` · Stand ${e.stand}` : null,
  );
  return el('article', { class: 'app-karte', id: `app-${e.id}` },
    el('h3', {}, el('a', { href: e.url, rel: 'noopener', text: e.titel })),
    meta, mitKompetenzen, links);
}

function zuordnungTabelle(d, land, k) {
  const plan = d.lehrplanByLand.get(land);
  const zeilen = zuordnungenFuer(d, land, k.id);
  if (!plan || plan.erfasst === 'nein') {
    return el('p', { class: 'leise', text: `${plan?.landname ?? land}: Lehrplan noch nicht erfasst.` });
  }
  if (!zeilen.length) return el('p', { class: 'leise', text: `${plan.landname}: keine Zuordnung im Lehrplan.` });
  return el('div', { class: 'tabelle-scroll' }, el('table', {},
    el('caption', { class: 'leise', text: `${plan.landname} · ${plan.schulform} · ${plan.dokument}` }),
    el('thead', {}, el('tr', {}, el('th', { text: 'Jahrgang' }), el('th', { text: 'Einheit (G9)' }), el('th', { text: 'Pflicht' }))),
    el('tbody', {}, zeilen.map((z) => el('tr', {},
      el('td', { text: z.jahrgang }), el('td', { text: z.einheit === '-' ? '–' : z.einheit }),
      el('td', { text: z.pflicht === 'nein' ? 'fakultativ' : 'ja' }))))));
}

export function renderDetail(ziel, d, kompetenzId, { land, link }) {
  const k = d.kompetenzById.get(kompetenzId);
  ziel.replaceChildren();
  if (!k) { ziel.append(el('p', { text: 'Kompetenz nicht gefunden.' })); return; }
  const leitidee = d.leitideeById.get(k.leitidee);
  const parent = k.parent ? d.kompetenzById.get(k.parent) : null;
  const apps = k.abdeckung.map((id) => d.eintragById.get(id)).filter(Boolean);
  fuege(ziel,
    el('p', { class: 'leise', text: [leitidee?.titel, parent?.titel].filter(Boolean).join(' › ') }),
    el('h2', { id: 'detail-titel' }, k.titel, ' ', statusChip(k)),
    k['kmk-standard']
      ? el('blockquote', {}, el('strong', { text: 'KMK-Standard: ' }), k['kmk-standard'])
      : el('p', { class: 'leise', text: 'Kein KMK-Standard: landesspezifische Verfeinerung.' }),
    absaetze(k.beschreibung),
    k.schluesselwoerter?.length ? el('p', { class: 'leise', text: `Schlüsselwörter: ${k.schluesselwoerter.join(', ')}` }) : null,
    el('h3', { text: 'Im Lehrplan' }),
    zuordnungTabelle(d, land, k),
    el('h3', { text: apps.length ? `Apps (${apps.length})` : 'Apps' }),
    apps.length
      ? el('div', { class: 'app-liste' }, apps.map((e) => appKarte(e)))
      : el('p', {}, 'Noch keine App übt diese Kompetenz. ', el('a', { href: 'apps.html#eintragen', text: 'App eintragen' })),
    el('p', { class: 'leise' }, el('a', { href: link, text: 'Direktlink zu dieser Kompetenz' })),
  );
}
