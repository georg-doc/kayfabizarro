// deck-edit.js — Textfelder eines Deck-JSON aendern, ohne die Datei umzuschreiben.
//
// Die eine Regel: **der Rohtext bleibt der Rohtext.** Wir bauen kein Objekt und geben es mit
// `JSON.stringify` neu aus — das wuerfelt Schluesselreihenfolge und Einrueckung durcheinander und
// macht jeden Diff auf GitHub unlesbar. Stattdessen wird der Wert im Text an seiner Stelle
// ersetzt. Ein Deck ohne Aenderung kommt damit zeichengleich zurueck (Delta 0).
//
// Gilt fuer Felder auf der obersten Ebene: Strings und Listen von Strings.

(function () {
  'use strict';

  var FIELDS = [
    { key: 'deckTitle', label: 'Deck title', kind: 'line' },
    { key: 'deckType', label: 'Subline (deckType)', kind: 'line' },
    { key: 'marketingEdition', label: 'Edition', kind: 'line' },
    { key: 'blurb', label: 'Blurb', kind: 'text', rows: 4 },
    { key: 'marketingText', label: 'Marketing text', kind: 'text', rows: 14 },
    { key: 'deckFunction', label: 'Tags (deckFunction)', kind: 'list' },
    { key: 'exhibitionRole', label: 'Exhibition role', kind: 'line' }
  ];

  // Findet den Wert eines Schluessels auf Tiefe 1 und gibt [start, end) im Rohtext zurueck.
  // Zaehlt Klammern selbst, statt sich auf einen regulaeren Ausdruck zu verlassen — ein Wert
  // kann Anfuehrungszeichen, Klammern und Zeilenumbrueche enthalten.
  function span(raw, key) {
    var depth = 0, inStr = false, esc = false, i = 0, keyAt = -1;
    var needle = '"' + key + '"';
    for (; i < raw.length; i++) {
      var ch = raw[i];
      if (inStr) {
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') {
        if (depth === 1 && raw.substr(i, needle.length) === needle) {
          // Der Treffer muss ein SCHLUESSEL sein: nach dem Namen folgt ein Doppelpunkt.
          var j = i + needle.length;
          while (j < raw.length && /\s/.test(raw[j])) j++;
          if (raw[j] === ':') { keyAt = j + 1; break; }
        }
        inStr = true;
        continue;
      }
      if (ch === '{' || ch === '[') depth++;
      else if (ch === '}' || ch === ']') depth--;
    }
    if (keyAt < 0) return null;

    var s = keyAt;
    while (s < raw.length && /\s/.test(raw[s])) s++;
    var e = s, d = 0;
    inStr = false; esc = false;
    for (; e < raw.length; e++) {
      var c = raw[e];
      if (inStr) {
        if (esc) { esc = false; continue; }
        if (c === '\\') { esc = true; continue; }
        if (c === '"') { inStr = false; if (d === 0) { e++; break; } }
        continue;
      }
      if (c === '"') { inStr = true; continue; }
      if (c === '{' || c === '[') d++;
      else if (c === '}' || c === ']') { if (d === 0) break; d--; if (d === 0) { e++; break; } }
      else if ((c === ',' || c === '\n') && d === 0) break;
    }
    return [s, e];
  }

  // Wie ist die Datei eingerueckt? Aus der ersten eingerueckten Zeile abgelesen, damit eine neu
  // geschriebene Liste aussieht wie der Rest der Datei.
  function indentOf(raw) {
    var m = raw.match(/\n([ \t]+)"/);
    return m ? m[1] : '  ';
  }

  function encList(arr, pad) {
    if (!arr.length) return '[]';
    return '[\n' + arr.map(function (v) { return pad + pad + JSON.stringify(v); }).join(',\n') + '\n' + pad + ']';
  }

  // changes: { key: string | string[] }. Nur was sich wirklich unterscheidet, wird angefasst.
  // Fehlt ein Schluessel in der Datei, wird er hinter dem letzten bekannten Feld eingefuegt.
  function patch(raw, changes) {
    var pad = indentOf(raw);
    var out = raw;
    Object.keys(changes).forEach(function (key) {
      var val = changes[key];
      var next = Array.isArray(val) ? encList(val, pad) : JSON.stringify(val == null ? '' : String(val));
      var sp = span(out, key);
      if (sp) {
        if (out.slice(sp[0], sp[1]) === next) return;
        out = out.slice(0, sp[0]) + next + out.slice(sp[1]);
        return;
      }
      // Nicht vorhanden: hinter das erste Feld der Datei setzen, das es gibt.
      var anchor = null;
      for (var i = 0; i < FIELDS.length && !anchor; i++) {
        var a = span(out, FIELDS[i].key);
        if (a) anchor = a;
      }
      if (!anchor) return;
      out = out.slice(0, anchor[1]) + ',\n' + pad + JSON.stringify(key) + ': ' + next + out.slice(anchor[1]);
    });
    return out;
  }

  // Was steht heute drin? Liest die Werte aus dem Rohtext, nicht aus einem geparsten Objekt —
  // so sieht das Formular genau das, was auch zurueckgeschrieben wird.
  function read(raw) {
    var o = {};
    FIELDS.forEach(function (f) {
      var sp = span(raw, f.key);
      if (!sp) { o[f.key] = f.kind === 'list' ? [] : ''; return; }
      var txt = raw.slice(sp[0], sp[1]);
      try {
        var v = JSON.parse(txt);
        o[f.key] = f.kind === 'list' ? (Array.isArray(v) ? v : []) : (v == null ? '' : String(v));
      } catch (e) {
        o[f.key] = f.kind === 'list' ? [] : '';
      }
    });
    return o;
  }

  // Markdown, nicht HTML: das JSON-Feld ist Klartext. Markdown ueberlebt dort unbeschadet,
  // liest sich auch ungerendert und bleibt diffbar.
  var MARKS = [
    { id: 'bold', label: 'B', wrap: ['**', '**'], hint: 'bold' },
    { id: 'italic', label: 'I', wrap: ['*', '*'], hint: 'italic' },
    { id: 'mark', label: 'H', wrap: ['==', '=='], hint: 'highlight' },
    { id: 'link', label: '↗', wrap: ['[', '](url)'], hint: 'link' },
    { id: 'ul', label: '•', line: '- ', hint: 'bullet list' },
    { id: 'ol', label: '1.', line: '1. ', hint: 'numbered list' },
    { id: 'hr', label: '—', block: '\n\n---\n\n', hint: 'divider' }
  ];

  // Wendet eine Auszeichnung auf die Auswahl in einem Textfeld an und gibt den neuen Text plus
  // die neue Auswahl zurueck. Zeilenweise Marken (Listen) fassen jede Zeile der Auswahl an.
  function apply(text, from, to, m) {
    if (m.block) {
      return { text: text.slice(0, to) + m.block + text.slice(to), from: to + m.block.length, to: to + m.block.length };
    }
    if (m.line) {
      var ls = text.lastIndexOf('\n', from - 1) + 1;
      var le = text.indexOf('\n', to);
      if (le < 0) le = text.length;
      var body = text.slice(ls, le);
      var n = 0;
      var done = body.split('\n').map(function (line) {
        n++;
        var pre = m.id === 'ol' ? n + '. ' : m.line;
        return line.replace(/^(\s*)(?:[-*]\s+|\d+\.\s+)?/, '$1' + pre);
      }).join('\n');
      return { text: text.slice(0, ls) + done + text.slice(le), from: ls, to: ls + done.length };
    }
    var sel = text.slice(from, to);
    var a = m.wrap[0], b = m.wrap[1];
    // Schon ausgezeichnet? Dann abnehmen statt verdoppeln.
    if (sel.length > a.length + b.length && sel.slice(0, a.length) === a && sel.slice(-b.length) === b) {
      var bare = sel.slice(a.length, sel.length - b.length);
      return { text: text.slice(0, from) + bare + text.slice(to), from: from, to: from + bare.length };
    }
    var ins = a + sel + b;
    return { text: text.slice(0, from) + ins + text.slice(to), from: from + a.length, to: from + a.length + sel.length };
  }

  // ---- Markdown lesbar machen ----
  // Kein HTML im Umlauf: der Text wird in Bloecke und Stücke zerlegt, die die Vorlage als
  // gewoehnliche Elemente malt. So bleibt jedes Zeichen im JSON Klartext, und die Anzeige
  // kommt ohne `dangerouslySetInnerHTML` aus.
  var INLINE = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;

  function pieces(line) {
    var out = [];
    var parts = line.split(INLINE);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;
      if (p.slice(0, 2) === '**' && p.slice(-2) === '**') out.push({ kind: 'bold', text: p.slice(2, -2) });
      else if (p.slice(0, 2) === '==' && p.slice(-2) === '==') out.push({ kind: 'mark', text: p.slice(2, -2) });
      else if (p[0] === '*' && p.slice(-1) === '*' && p.length > 2) out.push({ kind: 'italic', text: p.slice(1, -1) });
      else if (p[0] === '[') {
        var m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) out.push({ kind: 'link', text: m[1], href: m[2] });
        else out.push({ kind: 'plain', text: p });
      } else out.push({ kind: 'plain', text: p });
    }
    return out.length ? out : [{ kind: 'plain', text: '' }];
  }

  function blocks(text) {
    if (!text) return [];
    var out = [];
    String(text).split(/\n\s*\n/).forEach(function (para) {
      var lines = para.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return;
      if (lines.length === 1 && /^(-{3,}|\*{3,}|_{3,})$/.test(lines[0])) { out.push({ kind: 'hr' }); return; }
      var listy = lines.every(function (l) { return /^([-*]\s+|\d+\.\s+)/.test(l); });
      if (listy) {
        lines.forEach(function (l, k) {
          var num = /^\d+\.\s+/.test(l);
          out.push({ kind: 'li', bullet: num ? (k + 1) + '.' : '\u2022', parts: pieces(l.replace(/^([-*]\s+|\d+\.\s+)/, '')) });
        });
        return;
      }
      out.push({ kind: 'p', parts: pieces(lines.join(' ')) });
    });
    return out;
  }

  window.KFBDeckEdit = {
    FIELDS: FIELDS, MARKS: MARKS,
    read: read, patch: patch, apply: apply, span: span, blocks: blocks
  };
})();
