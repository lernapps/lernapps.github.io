/*
 * TD-3: llms.txt und tutor.md sind ein öffentlicher Vertrag mit dem KI-Tutor, aber von Hand geschrieben. Diese reinen
 * Funktionen gleichen sie mit dem ab, was die App wirklich annimmt: Seiten, Parameter (URL_ZAHLEN, URL_TEXTE der
 * Generatoren), Werte und Anker. eleventy.config.js bricht den Build bei mindestens einer Meldung ab.
 */
const AUFGABENNUMMER = ["seed", "nr"];
const PLATZHALTER = /[<…]/; // nr=<Nummer>, ereignis=<Reihenfolge>
const SEEDS_FUER_WIRKUNG = 30;

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function zerlege(roh) {
  const [ohneAnker, anker] = roh.split("#");
  const [pfad, query = ""] = ohneAnker.split("?");
  const parameter = query.split("&").filter(Boolean).map((p) => {
    const i = p.indexOf("=");
    return i < 0 ? [p, ""] : [p.slice(0, i), p.slice(i + 1)];
  });
  return { roh, seite: pfad || "index.html", parameter, anker: anker || undefined };
}

/** Deep Links auf die App: volle URLs im Text und Abfragen (`?…`) in Zeilen der Parameter-Übersicht (`| seite | … |`). */
export function findeLinks(text, basisUrl) {
  const links = [];
  for (const zeile of text.split("\n")) {
    const tabelle = zeile.match(/^\|\s*([\w.-]+\.html)\s*\|.*\|\s*(\?\S*)\s*\|\s*$/);
    if (tabelle) links.push(zerlege(tabelle[1] + tabelle[2]));
    for (const [, rest] of zeile.matchAll(new RegExp(`${escapeRegExp(basisUrl)}([^\\s)\`"']*)`, "g"))) {
      links.push(zerlege(rest.replace(/[.,;:]+$/, "")));
    }
  }
  return links;
}

/**
 * Seite, Parameternamen, Aufgabennummer, feste Werte und Anker eines Links.
 * seiten: Map seite → { parameter: [namen], werte?: { name: [erlaubt] }, anker?: Set<id> }
 */
export function pruefeLink(datei, link, seiten) {
  const seite = seiten.get(link.seite);
  if (!seite) return [`${datei}: ${link.roh} – die Seite ${link.seite} gibt es nicht`];
  const fehler = [];
  for (const [name, wert] of link.parameter) {
    if (!seite.parameter.includes(name)) {
      fehler.push(`${datei}: ${link.roh} – ${link.seite} kennt den Parameter ${name} nicht (erlaubt: ${seite.parameter.join(", ") || "keine"})`);
    } else if (PLATZHALTER.test(wert)) {
      continue;
    } else if (AUFGABENNUMMER.includes(name) && !/^\d+$/.test(wert)) {
      fehler.push(`${datei}: ${link.roh} – ${name}=${wert} ist keine ganze Zahl`);
    } else if (seite.werte?.[name] && !seite.werte[name].includes(wert)) {
      fehler.push(`${datei}: ${link.roh} – ${name}=${wert} (erlaubt: ${seite.werte[name].join(", ")})`);
    }
  }
  if (link.anker && seite.anker && !seite.anker.has(link.anker)) {
    fehler.push(`${datei}: ${link.roh} – den Anker #${link.anker} hat ${link.seite} nicht`);
  }
  return fehler;
}

const alsText = (aufgabe) => JSON.stringify(aufgabe);

/**
 * Jeder Wert eines Kompetenz-Links muss die App lesen (leseVorgaben) und der Generator verwenden: Ohne den Parameter
 * sieht die Aufgabe bei mindestens einer Aufgabennummer anders aus. Sonst verwirft der Generator den Wert still.
 * Ein Standardwert (die Aufgabe ist ohne ihn dieselbe) ist erlaubt, wenn ein anderer dokumentierter Wert desselben
 * Parameters (alternativen: Map name → Set<wert>) die Aufgabe ändert.
 * hilfen: { leseVorgaben, erzeugeZufall } aus dem Kern (Dependency Inversion, testbar).
 */
export function pruefeVorgaben(datei, link, modul, { leseVorgaben, erzeugeZufall }, alternativen = new Map()) {
  const eigene = link.parameter.filter(([name, wert]) => !AUFGABENNUMMER.includes(name) && !PLATZHALTER.test(wert));
  if (!eigene.length) return [];
  const query = new URLSearchParams(eigene).toString();
  const vorgaben = leseVorgaben(query, modul.URL_ZAHLEN || [], modul.URL_TEXTE || []);
  const fehler = [];
  const erzeuge = (seed, v) => alsText(modul.erzeugeAufgabe(erzeugeZufall(seed), v));
  for (const [name, wert] of eigene) {
    if (!(name in vorgaben)) {
      fehler.push(`${datei}: ${link.roh} – ${name}=${wert} verwirft die App (keine positive Zahl bzw. kein Kurzwort)`);
      continue;
    }
    const ohne = { ...vorgaben };
    delete ohne[name];
    const andere = [];
    for (const anders of alternativen.get(name) || []) {
      const v = leseVorgaben(new URLSearchParams([[name, anders]]).toString(), modul.URL_ZAHLEN || [], modul.URL_TEXTE || []);
      if (name in v && v[name] !== vorgaben[name]) andere.push({ ...vorgaben, [name]: v[name] });
    }
    try {
      const seeds = Array.from({ length: SEEDS_FUER_WIRKUNG }, (_, i) => i + 1);
      const mit = seeds.map((s) => erzeuge(s, vorgaben));
      // Wirkt: ohne den Parameter ändert sich die Aufgabe. Standardwert: ein anderer dokumentierter Wert ändert sie bei
      // JEDER Nummer – ein verworfener, durch Zufall ersetzter Wert träfe den anderen irgendwann.
      const wirkt = seeds.some((s, i) => erzeuge(s, ohne) !== mit[i])
        || andere.some((v) => seeds.every((s, i) => erzeuge(s, v) !== mit[i]));
      if (!wirkt) fehler.push(`${datei}: ${link.roh} – ${name}=${wert} ändert die Aufgabe nicht; der Generator nimmt den Wert nicht an`);
    } catch (e) {
      return [...fehler, `${datei}: ${link.roh} – der Generator wirft: ${e.message}`];
    }
  }
  return fehler;
}

/** Abschnitt `### … <basisUrl><seite>` bis zur nächsten Überschrift. */
function abschnitt(text, basisUrl, seite) {
  const zeilen = text.split("\n");
  const start = zeilen.findIndex((z) => z.startsWith("### ") && (z.endsWith(`${basisUrl}${seite}`) || z.includes(`${basisUrl}${seite} `)));
  if (start < 0) return undefined;
  const ende = zeilen.findIndex((z, i) => i > start && /^#{1,3} /.test(z));
  return zeilen.slice(start, ende < 0 ? undefined : ende).join("\n");
}

const FUELLWOERTER = new Set(["oder", "und"]);

/** Zeilen der Parameter-Übersicht: seite → Parameternamen aus der zweiten Spalte (`nr (oder seed), modus=voll/schnell`). */
function uebersicht(text) {
  const zeilen = new Map();
  for (const [, seite, spalte] of text.matchAll(/^\|\s*([\w.-]+\.html)\s*\|([^|]*)\|/gm)) {
    const namen = [...spalte.matchAll(/(?<![=/\w])([a-z][a-z0-9]*)/g)].map((m) => m[1]).filter((n) => !FUELLWOERTER.has(n));
    zeilen.set(seite, [...(zeilen.get(seite) || []), ...namen]);
  }
  return zeilen;
}

/** Jede Zeile der Parameter-Übersicht nennt nur Parameter, die ihre Seite annimmt. */
export function pruefeUebersicht(datei, text, seiten) {
  const fehler = [];
  for (const [seite, namen] of uebersicht(text)) {
    const erlaubt = seiten.get(seite)?.parameter;
    if (!erlaubt) { fehler.push(`${datei}: Parameter-Übersicht nennt die Seite ${seite}, die es nicht gibt`); continue; }
    for (const name of namen) if (!erlaubt.includes(name)) fehler.push(`${datei}: Parameter-Übersicht, ${seite}: Parameter ${name} nimmt die Seite nicht an`);
  }
  return fehler;
}

/** Abschnitt `## URL-Parameter …` (gilt für alle Seiten). */
const abschnittAlle = (text) => text.match(/^## URL-Parameter[^\n]*\n[\s\S]*?(?=^#{1,3} |(?![\s\S]))/m)?.[0] || "";

/**
 * Jeder Parameter, den der Generator annimmt, ist dokumentiert: im Abschnitt seiner Seite (`name`, `name=…` oder in
 * einem Link), im Abschnitt `## URL-Parameter …` für alle Seiten oder in der Zeile der Parameter-Übersicht.
 */
export function pruefeParameterDoku(datei, text, basisUrl, seite, parameter) {
  const teil = abschnitt(text, basisUrl, seite);
  if (teil === undefined) return [`${datei}: kein Abschnitt "### … ${basisUrl}${seite}"`];
  const tabelle = new Set(uebersicht(text).get(seite) || []);
  const genannt = (name, t) => new RegExp(`\`${escapeRegExp(name)}[\`=]|[?&]${escapeRegExp(name)}=`).test(t);
  return [...new Set(parameter)]
    .filter((name) => !genannt(name, teil) && !genannt(name, abschnittAlle(text)) && !tabelle.has(name))
    .map((name) => `${datei}: ${seite}: Parameter ${name} nimmt der Generator an, llms.txt nennt ihn nicht`);
}

/** Werte aus Listen wie `zuege=2|3` oder `experiment=urne|muenze` (Alternativen für pruefeVorgaben). */
export function dokumentierteWerte(text) {
  const werte = new Map();
  for (const [, name, liste] of text.matchAll(/`([a-z][a-z0-9]*)=([a-z0-9][a-z0-9|-]*)`/g)) {
    const menge = werte.get(name) || werte.set(name, new Set()).get(name);
    for (const w of liste.split("|")) menge.add(w);
  }
  return werte;
}
