// Baumdiagramm als reine Datenstruktur (kein DOM). Ein Knoten:
// {id, stufe, ergebnis, name, wahrscheinlichkeit, pfad, pfadWahrscheinlichkeit, kinder}

import { bruch, multipliziere, summe, EINS } from "../../../kern/js/bruch.js";
import { entferne, gesamtAnzahl } from "./experimente.js";

function baueKnoten(exp, stufe, zuege, mitZuruecklegen, pfad, pfadW, elternId) {
  const kinder = [];
  if (stufe < zuege) {
    const gesamt = gesamtAnzahl(exp);
    for (const e of exp.ergebnisse) {
      const w = bruch(e.anzahl, gesamt);
      const naechster = mitZuruecklegen ? exp : entferne(exp, e.id);
      const neuerPfad = [...pfad, e.id];
      const id = `${elternId}-${e.id}`;
      const kind = {
        id, stufe: stufe + 1, ergebnis: e.id, name: e.name, farbe: e.farbe,
        anzahl: e.anzahl, gesamt, wahrscheinlichkeit: w, pfad: neuerPfad, pfadWahrscheinlichkeit: multipliziere(pfadW, w),
        kinder: [],
      };
      if (stufe + 1 < zuege && naechster) kind.kinder = baueKnoten(naechster, stufe + 1, zuege, mitZuruecklegen, neuerPfad, kind.pfadWahrscheinlichkeit, id);
      kinder.push(kind);
    }
  }
  return kinder;
}

export function baueBaum(experiment, zuege, mitZuruecklegen = true) {
  if (!experiment.ohneZuruecklegenMoeglich) mitZuruecklegen = true;
  const wurzel = { id: "w", stufe: 0, ergebnis: null, name: "Start", wahrscheinlichkeit: EINS, pfad: [], pfadWahrscheinlichkeit: EINS, kinder: [] };
  wurzel.kinder = baueKnoten(experiment, 0, zuege, mitZuruecklegen, [], EINS, "w");
  return { experiment, zuege, mitZuruecklegen, wurzel };
}

export function alleKnoten(baum) {
  const liste = [];
  const gehe = (k) => { if (k !== baum.wurzel) liste.push(k); k.kinder.forEach(gehe); };
  gehe(baum.wurzel);
  return liste;
}

export function blaetter(baum) {
  return alleKnoten(baum).filter((k) => k.stufe === baum.zuege);
}

export function findeKnoten(baum, pfad) {
  let k = baum.wurzel;
  for (const id of pfad) {
    k = k.kinder.find((c) => c.ergebnis === id);
    if (!k) return null;
  }
  return k;
}

// Wahrscheinlichkeit eines vollständigen Pfades (1. Pfadregel).
export function pfadWahrscheinlichkeit(baum, pfad) {
  const k = findeKnoten(baum, pfad);
  return k && k.stufe === baum.zuege ? k.pfadWahrscheinlichkeit : null;
}

// Zweige entlang eines Pfades: [{ergebnis, wahrscheinlichkeit}, …]
export function zweigeEntlang(baum, pfad) {
  const liste = [];
  let k = baum.wurzel;
  for (const id of pfad) {
    k = k.kinder.find((c) => c.ergebnis === id);
    if (!k) return null;
    liste.push(k);
  }
  return liste;
}

export function ereignisPfade(baum, ereignis) {
  return blaetter(baum).filter((k) => ereignis.praedikat(k.pfad));
}

// Summe der Pfadwahrscheinlichkeiten (2. Pfadregel).
export function ereignisWahrscheinlichkeit(baum, ereignis) {
  return summe(ereignisPfade(baum, ereignis).map((k) => k.pfadWahrscheinlichkeit));
}
