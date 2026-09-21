# FrizzleBob Comic Reader

Ein eigenständiges Web-Tool (Deutsch/Englisch), mit dem eine KI deine Comics **liest** – nicht zeichnet. 18 „Lesarten“ für deine eigenen Seiten, dazu der Essay hinter der Idee, eine Slideshow und das Cut-&-Play-Kartenspiel.

**Live:** https://kayfabizarro.pages.dev/FrizzleBob/

## Was in diesem Ordner liegt

- `index.html` – der Reader selbst (im Browser öffnen; keine Installation, kein Server).
- `01-….md` … `18-….md` – die versionierten Klartext-Originale aller 18 Prompts, in Essay-Reihenfolge. Der Reader lädt sie online live von GitHub und fällt offline auf eingebaute Kopien zurück.

## Reihenfolge

01 Die erste Lesung · 02 Das Auge · 03 Die kollegiale Kritik · 04 Der Finger in der Wunde · 05 Du selbst in fünf Jahren · 06 Der Verlagspitch · 07 Le Curateur · 08 Der Comic-Theoretiker · 09 Der Literalist · 10 Der Synästhet · 11 Der Doomscroller · 12 Der Superfan · 13 Der Heckler am Rand · 14 FrizzleBob im Carny-Modus · 15 Die Seite spricht zurück · 16 Die Archäologin aus dem Jahr 2525 · 17 Der Dialog-Doktor · 18 Der Konzept-Leser

## Wie es funktioniert

Eigener Anthropic-API-Key (im Reader eingetragen, bleibt nur im localStorage deines Browsers, geht direkt an Anthropic – nie an Dritte). Lesart wählen, Comic hochladen (PNG/JPG/PDF) oder Text (TXT/MD/JSON/CSV), lesen lassen.

## Lizenz

Text & Prompts © Georg Graf von Westphalen, CC BY-NC-SA 4.0. Siehe `LICENSE`.

---

# FrizzleBob Comic Reader (EN)

A self-contained web tool (German/English) that lets an AI **read** your comics – not draw them. 18 “readings“ for your own pages, plus the essay behind the idea, a slideshow, and the Cut-&-Play card game.

**Live:** https://kayfabizarro.pages.dev/FrizzleBob/

- `index.html` – the reader (open in any browser).
- `01-….md` … `18-….md` – versioned plain-text originals of all 18 prompts, in essay order; loaded live from GitHub, with offline fallbacks.

Bring your own Anthropic API key (stored only in your browser, sent directly to Anthropic). Pick a reading, upload comic (PNG/JPG/PDF) or text (TXT/MD/JSON/CSV), let it read.

Text & prompts © Georg Graf von Westphalen, CC BY-NC-SA 4.0. See `LICENSE`.
