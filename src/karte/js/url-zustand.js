// URL-Zustand der Karte: ?land=HE&jahrgang=8&leitidee=…&luecken=1&knoten=…
// Öffentlicher Vertrag für Verlinkung aus Tutor-Apps und edugo; nie umbenennen.

export const LAENDER = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'ST', 'SN', 'SH', 'TH'];

export const STANDARD = Object.freeze({ land: 'HE', jahrgang: null, leitidee: null, luecken: false, knoten: null });

const ID_MUSTER = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function leseZustand(search) {
  const p = new URLSearchParams(search ?? '');
  const land = (p.get('land') ?? '').toUpperCase();
  const jahrgang = Number(p.get('jahrgang'));
  const leitidee = p.get('leitidee') ?? '';
  const knoten = p.get('knoten') ?? '';
  const luecken = p.get('luecken');
  return {
    land: LAENDER.includes(land) ? land : STANDARD.land,
    jahrgang: Number.isInteger(jahrgang) && jahrgang >= 5 && jahrgang <= 10 ? jahrgang : null,
    leitidee: ID_MUSTER.test(leitidee) ? leitidee : null,
    luecken: luecken != null && luecken !== '0' && luecken !== '',
    knoten: ID_MUSTER.test(knoten) ? knoten : null,
  };
}

export function schreibeZustand(z) {
  const p = new URLSearchParams();
  p.set('land', z.land ?? STANDARD.land);
  if (z.jahrgang != null) p.set('jahrgang', String(z.jahrgang));
  if (z.leitidee) p.set('leitidee', z.leitidee);
  if (z.luecken) p.set('luecken', '1');
  if (z.knoten) p.set('knoten', z.knoten);
  return `?${p.toString()}`;
}
