// Use Case: Mathe-Karte – Beschreibungen aus Markdown-Body als sicheres HTML auf den statischen Seiten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, absaetzeHtml } from '../../lib/karte/html.js';

test('escapeHtml: maskiert &, <, >, "', () => {
  assert.equal(escapeHtml('a & <b> "c"'), 'a &amp; &lt;b&gt; &quot;c&quot;');
});

test('absaetzeHtml: Absätze durch Leerzeilen, Listen mit "- ", Zeilen im Absatz zusammengefügt, maskiert', () => {
  assert.equal(absaetzeHtml('Erster\nTeil.\n\n- a < b\n- c'), '<p>Erster Teil.</p>\n<ul><li>a &lt; b</li><li>c</li></ul>');
  assert.equal(absaetzeHtml(''), '');
  assert.equal(absaetzeHtml(undefined), '');
});
