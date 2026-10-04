// ============================================================================
// zwischenablage.js — kopieren, das sagt, ob es geklappt hat
// ----------------------------------------------------------------------------
// Anlass (Georg, 2.9., zum dritten Mal in zwei Tagen): „kopieren funktioniert mal wieder nicht".
// Ursache in beiden Seiten dieselbe: `navigator.clipboard.writeText(t).then(fertig, fertig)` —
// der Fehlerzweig rief DENSELBEN Handler wie der Erfolgszweig, also stand „Kopiert ✓" da,
// während die Zwischenablage leer blieb. In einem eingebetteten Rahmen ohne
// `clipboard-write`-Erlaubnis lehnt die API zuverlässig ab; das ist der Normalfall, nicht die Ausnahme.
// **Ein Knopf, der Erfolg meldet, den er nicht hatte, ist schlimmer als einer, der nichts sagt.**
//
// Drei Stufen, und der Rückgabewert nennt die, die getragen hat:
//   'clipboard'   — die moderne API hat zugestimmt
//   'execCommand' — Textarea markiert, altes document.execCommand('copy') hat true geliefert
//   false         — nichts davon; der Aufrufer zeigt den Text zum Selbermarkieren oder bietet Download
// ============================================================================

export async function kopieren(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(text); return 'clipboard'; } catch (e) { /* weiter */ }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand && document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) return 'execCommand';
  } catch (e) { /* weiter */ }
  return false;
}

/** Datei anbieten — der Weg, der immer geht. */
export function herunterladen(text, name, typ) {
  const b = new Blob([text], { type: typ || 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name || 'export.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
