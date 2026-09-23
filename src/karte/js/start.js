// Startseite: lädt Daten, verdrahtet Filter, Baum, Detail und URL-Zustand. Progressive Verbesserung: ohne JS
// bleibt die statische Liste im HTML stehen; start() blendet den Filter ein und ersetzt die Liste durch den Baum.
import { ladeDaten, kompetenzenFuer, zusammenfassung, istErfasst } from './daten.js';
import { leseZustand, schreibeZustand } from './url-zustand.js';
import { el, renderBaum, renderDetail } from './karte.js';

const $ = (id) => document.getElementById(id);

let d;
let zustand = leseZustand(location.search);

function filterAusZustand() {
  return { land: zustand.land, jahrgang: zustand.jahrgang, leitidee: zustand.leitidee, nurLuecken: zustand.luecken };
}

function fuelleAuswahl() {
  const land = $('land');
  for (const plan of [...d.lehrplaene].sort((a, b) => a.landname.localeCompare(b.landname, 'de'))) {
    const nichtErfasst = plan.erfasst === 'nein';
    land.append(el('option', {
      value: plan.land, class: nichtErfasst ? 'nicht-erfasst' : undefined,
      text: nichtErfasst ? `${plan.landname} (noch nicht erfasst)` : plan.landname,
    }));
  }
  const leitidee = $('leitidee');
  for (const l of d.leitideen) leitidee.append(el('option', { value: l.id, text: l.titel }));
}

function zeigeZustandInFeldern() {
  $('land').value = zustand.land;
  $('jahrgang').value = zustand.jahrgang == null ? '' : String(zustand.jahrgang);
  $('leitidee').value = zustand.leitidee ?? '';
  $('luecken').checked = zustand.luecken;
  $('jahrgang').disabled = !istErfasst(d, zustand.land);
}

function zeigeLandHinweis() {
  const box = $('hinweis-land');
  const plan = d.lehrplanByLand.get(zustand.land);
  box.replaceChildren();
  if (!plan || plan.erfasst !== 'nein') { box.hidden = true; return; }
  box.append(
    el('p', {}, el('strong', { text: `${plan.landname}: Lehrplan noch nicht erfasst.` }),
      ' Die Karte zeigt deshalb alle Kompetenzen ohne Jahrgang. Das Dokument ist bekannt: ',
      el('a', { href: plan.url, rel: 'noopener', text: plan.dokument }), '.'),
    el('p', { style: 'margin:0' }, el('a', { href: $('karte').dataset.mithelfen, text: 'Mithelfen: Lehrplan erfassen' }),
      ' – ein PR mit zwei Dateien genügt.'),
  );
  box.hidden = false;
}

function schreibeUrl() {
  history.replaceState(null, '', `${location.pathname}${schreibeZustand(zustand)}${location.hash}`);
}

function waehleKnoten(id) {
  zustand = { ...zustand, knoten: id };
  schreibeUrl();
  const dialog = $('detail');
  renderDetail($('detail-inhalt'), d, id, { land: zustand.land, link: schreibeZustand(zustand) });
  for (const b of document.querySelectorAll('button.knoten-zeile')) b.setAttribute('aria-expanded', String(b.dataset.knoten === id));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function schliesseDetail() {
  const dialog = $('detail');
  if (dialog.open) dialog.close();
  const zuletzt = zustand.knoten;
  zustand = { ...zustand, knoten: null };
  schreibeUrl();
  for (const b of document.querySelectorAll('button.knoten-zeile')) b.setAttribute('aria-expanded', 'false');
  document.querySelector(`button.knoten-zeile[data-knoten="${zuletzt}"]`)?.focus();
}

function render() {
  const filter = filterAusZustand();
  $('jahrgang').disabled = !istErfasst(d, zustand.land);
  const treffer = kompetenzenFuer(d, filter);
  $('zusammenfassung').textContent = zusammenfassung(d, filter).text;
  zeigeLandHinweis();
  renderBaum($('karte'), d, treffer, { land: zustand.land, aktiv: zustand.knoten, onWahl: waehleKnoten });
}

function liesFelder() {
  zustand = {
    ...zustand,
    land: $('land').value,
    jahrgang: $('jahrgang').value === '' ? null : Number($('jahrgang').value),
    leitidee: $('leitidee').value || null,
    luecken: $('luecken').checked,
  };
  schreibeUrl();
  render();
}

async function start() {
  try {
    d = await ladeDaten();
  } catch (err) {
    $('zusammenfassung').textContent = `Daten konnten nicht geladen werden: ${err.message}`;
    return;
  }
  fuelleAuswahl();
  $('filter').hidden = false;
  zeigeZustandInFeldern();
  $('filter').addEventListener('change', liesFelder);
  $('filter').addEventListener('submit', (ev) => ev.preventDefault());
  $('detail-schliessen').addEventListener('click', schliesseDetail);
  $('detail').addEventListener('close', () => { if (zustand.knoten) schliesseDetail(); });
  schreibeUrl();
  render();
  if (zustand.knoten && d.kompetenzById.has(zustand.knoten)) waehleKnoten(zustand.knoten);
}

start();
