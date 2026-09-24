/*
 * Eleventy-Daten der Mathe-Karte: liest src/karte/daten/ (Leitideen, Kompetenzen, Lehrpläne, Zuordnungen), nimmt die
 * Einträge aus den App-Konfigurationen (lib/karte/eintraege.js), prüft alles und liefert
 *   daten   – Inhalt von data.json (öffentlicher Vertrag, siehe src/karte/llms.njk), ohne Zeitstempel
 *   json    – data.json als Text, deterministisch
 *   ansicht – vorbereitete Werte für die statischen Seiten (dieselben Funktionen wie die interaktive Karte)
 */
import fs from 'node:fs';
import path from 'node:path';
import { leseFrontmatter, leseTabelle, pruefeReferenzen, berechneAbdeckung } from './daten.js';
import { eintraegeFuerKarte, pruefeAppEintrag } from './eintraege.js';
import { indiziere, baumFuer, kompetenzenFuer, jahrgangBadges, statusText, zuordnungenFuer, zusammenfassung } from '../../src/karte/js/daten.js';

const TYPEN = ['leitideen', 'kompetenzen', 'lehrplaene', 'zuordnungen'];
const LAND = 'HE';

function ladeOrdner(ordner, typ) {
  const dir = path.join(ordner, typ);
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => {
    try {
      const { data, body } = leseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return typ === 'zuordnungen' ? { lehrplan: data.lehrplan, zeilen: leseTabelle(body) } : { ...data, beschreibung: body };
    } catch (err) {
      throw new Error(`${dir}/${f}: ${err.message}`, { cause: err });
    }
  });
}

function ansichtAus(daten) {
  const d = indiziere(daten);
  const knoten = (n) => ({
    kompetenz: n.kompetenz,
    jahrgaenge: jahrgangBadges(zuordnungenFuer(d, LAND, n.kompetenz.id)).map((b) => b.text).join(', '),
    status: statusText(n.kompetenz),
    apps: n.kompetenz.abdeckung.map((id) => d.eintragById.get(id)),
    kinder: n.kinder.map(knoten),
  });
  const plaene = [...daten.lehrplaene].sort((a, b) => a.landname.localeCompare(b.landname, 'de'));
  return {
    baum: baumFuer(d, d.kompetenzen).map(({ leitidee, knoten: k }) => ({ leitidee, knoten: k.map(knoten) })),
    zusammenfassung: zusammenfassung(d, { land: LAND }).text,
    lehrplaene: plaene.map((p) => ({ ...p, zeilen: (d.zeilenByLand.get(p.land) ?? []).length })),
    erfasst: plaene.filter((p) => p.erfasst !== 'nein').length,
    eintraege: daten.eintraege.map((e) => ({ ...e, knoten: e.kompetenzen.map((id) => d.kompetenzById.get(id)) })),
    anzahl: kompetenzenFuer(d, { land: LAND }).length,
  };
}

/** ordner: src/karte/daten; apps: Ergebnis von ladeApps; externe: Übergangseinträge; version: Site-Version. */
export async function ladeKarte({ ordner, apps, externe = [], version }) {
  const [leitideen, kompetenzen, lehrplaene, zuordnungen] = TYPEN.map((t) => ladeOrdner(ordner, t));
  const knotenIds = new Set(kompetenzen.map((k) => k.id));
  const fehler = apps.flatMap((a) => pruefeAppEintrag(a, knotenIds));
  const eintraege = fehler.length ? [] : eintraegeFuerKarte(apps, externe);
  fehler.push(...pruefeReferenzen({ leitideen, kompetenzen, lehrplaene, zuordnungen, eintraege }));
  if (fehler.length) throw new Error(`Mathe-Karte: Datenprüfung fehlgeschlagen:\n- ${fehler.join('\n- ')}`);
  const abdeckung = berechneAbdeckung(kompetenzen, eintraege);
  const daten = {
    version,
    leitideen: leitideen.sort((a, b) => a.reihenfolge - b.reihenfolge),
    kompetenzen: kompetenzen.map((k) => ({ ...k, ...abdeckung[k.id] })),
    lehrplaene,
    zuordnungen,
    eintraege,
  };
  return { daten, json: JSON.stringify(daten, null, 2) + '\n', ansicht: ansichtAus(daten) };
}
