// ============================================================================
// journey.js — KFB Travel · Slice S50 · das Gedächtnis der Reise
// ----------------------------------------------------------------------------
// Entschieden in `docs/DECISIONS_v10.md` (Frage 1: Journey zuerst), geplant in
// `docs/SPRINT_travel-v10.md` S50. Die Akademie hatte 31 Karten und keinen Faden;
// dieses Modul IST der Faden.
//
// DREI REGELN, die den Bau bestimmen:
//  1. **Fortschritt ist sichtbar, nicht gezählt.** Dieses Modul liefert deshalb
//     KEINE Prozentzahl und keinen Punktestand nach außen — es liefert Listen und
//     Zustände, aus denen die Welt etwas zeichnen kann (Route, Post-its, Zeichen).
//     Ein `chapterDone`-Flag ja, ein Score nein.
//  2. **Notizen sind der eigentliche Ertrag.** Sie sind hier gleichberechtigt mit
//     dem Besuch, nicht ein Anhang daran.
//  3. **Reiner Beobachter.** Das Modul ruft nie Physik, Kamera oder Modus — es
//     hört zu und merkt sich. Genau das fordert der v9-Audit („Academy als
//     Observer", Gemini §2B): Lehrstoff-Logik darf nicht ins Gameplay greifen.
//
// PERSISTENZ: ein einziger localStorage-Schlüssel, und **nur der eigene**. Beim
// Lesen wird jeder Fehler geschluckt (privater Modus, voller Speicher) — eine
// Reise, die nicht gespeichert werden kann, läuft weiter, sie erinnert sich nur
// nicht. Geschrieben wird gebündelt (`saveSoon`), nicht pro Ereignis: 31 Karten
// im Vorbeiflug wären sonst 31 Schreibvorgänge.
//
// WAS NICHT HIER LEBT: die Darstellung. Die Route (S52), das Notizfeld (S51), das
// Tagebuch (S54) lesen von hier — sie schreiben nichts zurück außer `note()`.
//
//   const journey = createJourney();
//   journey.visit(card);                     // aus onPass / onArrive
//   journey.note(card, 'Text');              // aus dem Notizfeld
//   journey.chapterState(3);                 // { total, seen, done }
//   journey.routeOf(3);                      // Lektionen der Zone in Besuchsfolge
//   journey.toMarkdown(meta);                // Reisetagebuch (S54)
// ============================================================================

const KEY = 'kfb-journey-v1';

export function createJourney(opts = {}) {
  const P = Object.assign({ storageKey: KEY, saveDelay: 400 }, opts.params || {});
  const api = { onVisit: null, onNote: null, onChapter: null };

  // Zustand: EINE Karte pro Beispiel-Id. `seq` ist die Besuchsfolge — daraus zeichnet S52 die Route,
  // und sie ist der Grund, warum hier eine Liste steht und kein Zähler: eine Zahl kann man nicht
  // zeichnen, eine Reihenfolge schon.
  let started = 0, lessons = {}, seq = [], chapters = {};
  let dirty = false, saveT = 0, loaded = false;

  const now = () => Date.now();

  function load() {
    loaded = true;
    try {
      const raw = localStorage.getItem(P.storageKey);
      if (!raw) { started = now(); return false; }
      const d = JSON.parse(raw);
      if (!d || d.v !== 1) { started = now(); return false; }
      started = d.started || now();
      lessons = d.lessons || {};
      seq = Array.isArray(d.seq) ? d.seq : [];
      chapters = d.chapters || {};
      return true;
    } catch (e) { started = now(); return false; }
  }

  function save() {
    dirty = false;
    try {
      localStorage.setItem(P.storageKey, JSON.stringify({ v: 1, started, lessons, seq, chapters }));
      return true;
    } catch (e) { return false; }
  }

  // Gebündelt schreiben: im Vorbeiflug feuern mehrere Besuche in wenigen Frames.
  function saveSoon() {
    dirty = true;
    clearTimeout(saveT);
    saveT = setTimeout(save, P.saveDelay);
  }

  const idOf = (card) => (card && card.data ? String(card.data.example || card.data.nr || '') : '');

  function entry(card, create) {
    const id = idOf(card);
    if (!id) return null;
    if (!lessons[id] && create) {
      const d = card.data || {};
      lessons[id] = {
        title: d.title || id, nr: d.nr || '', chapter: d.chapter != null ? d.chapter : -1,
        chapterTitle: d.chapterTitle || '', tag: d.tag || '',
        at: 0, note: '', noteAt: 0,
      };
    }
    return lessons[id] || null;
  }

  // ---- Ereignisse hinein (aus der Ereignis-Tabelle des Runners)
  function visit(card) {
    if (!loaded) load();
    const e = entry(card, true), id = idOf(card);
    if (!e) return false;
    const first = !e.at;
    if (first) {
      e.at = now();
      if (seq.indexOf(id) < 0) seq.push(id);
      saveSoon();
      if (api.onVisit) { try { api.onVisit(card, e); } catch (err) {} }
      checkChapter(card);
    }
    return first;
  }

  function note(card, text) {
    if (!loaded) load();
    const e = entry(card, true);
    if (!e) return false;
    const t = String(text == null ? '' : text);
    if (e.note === t) return false;
    e.note = t; e.noteAt = now();
    // Eine Notiz IST ein Besuch: wer schreibt, war da.
    if (!e.at) { e.at = e.noteAt; const id = idOf(card); if (seq.indexOf(id) < 0) seq.push(id); }
    saveSoon();
    if (api.onNote) { try { api.onNote(card, e); } catch (err) {} }
    return true;
  }

  // Kapitel-Abschluss ist ein EINMALIGES Ereignis (S53 hängt daran) — der Zustand merkt sich das,
  // damit ein Wiederbesuch nicht dieselbe Kayfabulation zweimal auslöst.
  function checkChapter(card) {
    const ch = card && card.data ? card.data.chapter : -1;
    if (ch == null || ch < 0) return;
    const total = (opts.chapterTotal ? opts.chapterTotal(ch) : 0);
    if (!total) return;
    const seen = seenIn(ch).length;
    if (seen >= total && !chapters[ch]) {
      chapters[ch] = { at: now(), title: card.data.chapterTitle || '' };
      saveSoon();
      if (api.onChapter) { try { api.onChapter(ch, chapters[ch]); } catch (err) {} }
    }
  }

  const seenIn = (ch) => Object.keys(lessons).filter((id) => lessons[id].chapter === ch && lessons[id].at);

  return {
    name: 'journey',
    load, save, visit, note,
    get loaded() { return loaded; },
    get started() { return started; },
    get pendingSave() { return dirty; },
    seen(card) { const e = entry(card, false); return !!(e && e.at); },
    noteOf(card) { const e = entry(card, false); return e ? e.note : ''; },
    // Besuchsfolge einer Zone — die Vorlage für die gezeichnete Route (S52).
    routeOf(ch) { return seq.filter((id) => lessons[id] && lessons[id].chapter === ch); },
    get order() { return seq.slice(); },
    // Zustand einer Zone. `done` ist ein Flag, kein Score — bewusst kein Prozentwert.
    chapterState(ch) {
      const total = (opts.chapterTotal ? opts.chapterTotal(ch) : 0);
      return { total, seen: seenIn(ch).length, done: !!chapters[ch], at: chapters[ch] ? chapters[ch].at : 0 };
    },
    get chaptersDone() { return Object.keys(chapters).map(Number); },
    lessonsOf(ch) { return seq.filter((id) => lessons[id] && lessons[id].chapter === ch).map((id) => Object.assign({ id }, lessons[id])); },
    get notes() { return seq.filter((id) => lessons[id] && lessons[id].note).map((id) => Object.assign({ id }, lessons[id])); },

    // Reisetagebuch (S54 rendert es, hier entsteht der Text — eine Quelle, ein Format).
    toMarkdown(meta) {
      const m = meta || {};
      const dur = Math.max(0, Math.round((now() - started) / 60000));
      const out = ['# Reisetagebuch · KFB Würfelakademie', ''];
      out.push('Begonnen: ' + new Date(started).toISOString().slice(0, 16).replace('T', ' '));
      out.push('Unterwegs: ' + (dur >= 60 ? Math.floor(dur / 60) + ' h ' + (dur % 60) + ' min' : dur + ' min'));
      out.push('');
      const chs = {};
      for (const id of seq) { const l = lessons[id]; if (!l || !l.at) continue; (chs[l.chapter] = chs[l.chapter] || []).push(Object.assign({ id }, l)); }
      const keys = Object.keys(chs).sort((a, b) => Number(a) - Number(b));
      if (!keys.length) out.push('_Noch keine Lektion besucht._');
      for (const k of keys) {
        const list = chs[k], head = list[0].chapterTitle || ('Kapitel ' + k);
        const st = this.chapterState(Number(k));
        out.push('## ' + head + (st.done ? ' — abgeschlossen' : ''));
        out.push('');
        for (const l of list) {
          out.push('- **' + (l.nr ? l.nr + ' · ' : '') + l.title + '**' + (l.tag ? '  [' + l.tag + ']' : ''));
          if (l.note) for (const line of String(l.note).split('\n')) out.push('  > ' + line);
        }
        out.push('');
      }
      if (m.footer) out.push(m.footer);
      out.push('_' + (m.sign || 'Stay fluffy.') + '_');
      return out.join('\n');
    },

    // **Der Rückweg für EINEN Besuch** (Befund der Abnahme zu S61b, Fehlerklasse v8 „jeder Auftrag
    // braucht einen Rückweg"): bisher gab es nur `reset()` — alles oder nichts. In einer Welt, in der
    // ein Blick aus 22 u schon einen Besuch schreibt, muss man einen einzelnen zurücknehmen können.
    // Die Notiz wiegt schwerer als der Besuch: steht eine da, bleibt der Eintrag stehen (`force`
    // räumt auch die).
    forget(card, force) {
      const id = idOf(card);
      if (!id || !lessons[id]) return false;
      if (!force && String(lessons[id].note || '').trim()) return false;
      const ch = lessons[id].chapter;
      delete lessons[id];
      seq = seq.filter((x) => x !== id);
      // Zone nur entkrönen, wenn keine besuchte Lektion mehr übrig ist.
      if (chapters[ch] != null && !seenIn(ch).length) delete chapters[ch];
      saveSoon();
      return true;
    },

    reset() {
      lessons = {}; seq = []; chapters = {}; started = now();
      saveSoon();
    },
    get onVisit() { return api.onVisit; }, set onVisit(f) { api.onVisit = f; },
    get onNote() { return api.onNote; }, set onNote(f) { api.onNote = f; },
    get onChapter() { return api.onChapter; }, set onChapter(f) { api.onChapter = f; },
    get params() { return P; },
  };
}
