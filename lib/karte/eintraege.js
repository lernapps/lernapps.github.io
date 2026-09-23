/*
 * App-Einträge der Mathe-Karte. Eine App erscheint auf der Karte, wenn ihre Konfiguration (src/<app>/js/app.config.js)
 * APP.kartenEintrag (edugo-Felder) und je Kompetenz kartenKnoten (Knoten-ids der Karte) trägt. Apps, die noch nicht
 * im Monorepo liegen, stehen übergangsweise in src/karte/daten/externe-eintraege.js.
 */
const UEBERGANG = 'src/karte/daten/externe-eintraege.js';

const konfig = (app) => `src/${app.pfad}/js/app.config.js`;

function knotenDer(app) {
  return [...new Set((app.kompetenzen ?? []).flatMap((k) => k.kartenKnoten ?? []))];
}

/** Eintrag im Format von data.json (eintraege[]) oder null, wenn die App nicht auf die Karte gehört. */
export function eintragAusApp(app) {
  const f = app.kartenEintrag;
  if (!f) return null;
  return {
    id: app.id,
    titel: app.titel,
    url: app.basisUrl,
    quellcode: app.quellcode,
    kompetenzen: knotenDer(app),
    'aktiv-level': f['aktiv-level'],
    backend: f.backend,
    'external-requests': f['external-requests'],
    dsgvo: f.dsgvo,
    evidence: f.evidence,
    jahrgaenge: f.jahrgaenge ?? (app.klasse ? [app.klasse] : []),
    lizenz: f.lizenz,
    stand: f.stand,
    beschreibung: app.beschreibung,
  };
}

/** Fehler der Karten-Konfiguration einer App; knotenIds: Set aller Knoten der Karte. */
export function pruefeAppEintrag(app, knotenIds) {
  const fehler = [];
  const mitKnoten = (app.kompetenzen ?? []).filter((k) => k.kartenKnoten);
  if (!app.kartenEintrag && !mitKnoten.length) return fehler;
  if (!app.kartenEintrag) fehler.push(`${konfig(app)}: kartenKnoten gesetzt, aber APP.kartenEintrag fehlt`);
  if (!mitKnoten.length) fehler.push(`${konfig(app)}: APP.kartenEintrag gesetzt, aber keine Kompetenz hat kartenKnoten`);
  for (const k of mitKnoten) {
    if (!Array.isArray(k.kartenKnoten)) { fehler.push(`${konfig(app)}: kartenKnoten der Kompetenz "${k.id}" muss eine Liste sein`); continue; }
    for (const id of k.kartenKnoten) {
      if (!knotenIds.has(id)) fehler.push(`${konfig(app)}: kartenKnoten "${id}" der Kompetenz "${k.id}" ist kein Knoten der Karte (src/karte/daten/kompetenzen/)`);
    }
  }
  return fehler;
}

/** Alle Einträge der Karte, sortiert nach id: Apps mit kartenEintrag plus Übergangseinträge (externe). */
export function eintraegeFuerKarte(apps, externe = []) {
  const eintraege = apps.map(eintragAusApp).filter(Boolean);
  for (const { pfad, ...e } of externe) {
    const app = apps.find((a) => a.pfad === pfad);
    if (app?.kartenEintrag) {
      throw new Error(`${UEBERGANG}: Übergangseintrag "${e.id}" löschen – ${konfig(app)} trägt jetzt APP.kartenEintrag`);
    }
    eintraege.push(app ? { ...e, url: app.basisUrl, quellcode: app.quellcode } : e);
  }
  return eintraege.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
