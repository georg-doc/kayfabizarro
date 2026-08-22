# KICKOFF — KFB-Kanon für ein externes LLM (paste-ready, v2)

Kopiere diesen Block in einen fremden Chat/Agenten. Details je Fähigkeit: `00_INDEX.md` /
`kfb-embed-index.json`. **Ehrlichkeitszeile:** nur die als *on-github* markierten Fähigkeiten sind
jetzt live abrufbar (Ink, CardBuilder, Card-Format, Cube-Pet, Cartoon-Motion, Asset-Repo,
Session-Skills). Die *pending-push* (Cartoon-Deformer, Audio/Jukebox, TinySwords-Baukasten,
Voice-Engine, Sprechblasen) liegen noch lokal — **schick dich da nicht drauf, du bekommst 404.**

---

Du baust im **KayfaBizarro (KFB)**-Kanon. Repo: `github.com/georg-doc/kayfabizarro`. Halte dich an
diese Regeln — aus Schaden gelernt:

**Lade-Regeln**
1. **ES-Module** über **jsdelivr** (`cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/…`) — **nie** raw (liefert `text/plain`, Modul wird verweigert).
2. **Bytes** (`.json`, `.glb`, PNG) über **pages.dev** oder **raw**. **Listen** über die **GitHub-Tree-API** (cachen, 60/h).
3. **Verifiziere per Fähigkeit, nicht per Version** — den *Fähigkeitstest* ausführen, nicht den Dateinamen lesen.
4. **HTTP 200 ist nicht JavaScript.** Fehlt eine Datei, liefert Cloudflare eine Fallback-Seite mit **200 + `text/html`** — tarnt sich als Erfolg, reißt den Import-Graph mit. Nach jedem Deploy den Pfad öffnen, **echtes JS erwarten**.
5. **three GENAU 0.160, ein Build.** `crossOrigin='anonymous'` an Canvas-Bildern. **`scale=1`** für Pixel-Sprites.
6. **Keine zweite Wahrheit** — lokale Kopie ist Cache, die kanonische URL gewinnt.
7. **EINE Herkunft je Modul-Stack.** Ein Modul, das Geschwister relativ importiert (z. B. `kfb-card-builder.js` zieht `./kfb-ink-canon.js` + `./kfb-card-format.js`), MUSS mit ihnen aus **derselben** Herkunft geladen werden — sonst hast du die Tuschekante **zweimal** aus zwei Herkünften, zwei Instanzen, zwei Zustände.

**Kernstücke (Tests am echten Export geprüft):**
- **Ink-Outline:** `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js`. Test: `drawInk.length===7 && INK_CANON_VERSION>=2 && typeof measureInk==='function'`. **Echte Abnahme:** `measureInk(contour('card',seed,W,H),W,H,'card').ok`. Aufruf: `drawInk('card', g, pts, W, H, seed)`.
- **CardBuilder (+ Format + Ink, ein Stack, eine Herkunft):** `…/skills/kfb-card-builder.js`. Test: `typeof createCardBuilder==='function' && CARD_AR===1.74`. Nutzung: `createCardBuilder({THREE})`. Karten-Daten via raw `media/kfb/index.json`.
- **Cube-Pet:** `…/media/3D_Assets/kfb-pets.js` + Vertrag `kfb-pets.json` (fetch), three 0.160. Test: `makePet` & `loadPets`.
- **Cartoon-Motion:** Doku `skills/cartoon-motion_v1.md` (Formeln explizit übernehmen — Design-Canvas lädt keine Skills).
- **Assets:** `media/2D_Assets` + `media/3D_Assets` über die Tree-API.

**Spielkanon — brauchst du, um kanonkonform zu ENTWERFEN (nicht nur zu rendern):**
- **Nichts auf einer Karte ist eine Regel.** Eine Power ist ein **Stichwort, kein Wert** (K1). Eine Power als Mechanik zu erzählen ist **KayfaBONGO** (Foul).
- **Karten sind rollenlos** — jede Karte kann Actor, Scene oder Quest sein. **Nicht** in der JSON typisieren.
- **Quest-Die-Beats** + die Urteilsskala des Kings tragen den Zug; es gibt **vier Social Calls**.
- **Konflikt ist König**; Kayfabe als Ernst, Blödsinn als Methode. **Lizenz: CC BY-NC-SA 4.0 + Namensnennung.**
- SSOT der Regeln: `Kayfabizarro_Freestyle_Rules_v18-4.md` (+ RULES & HUB) — **die gewinnen.**

**Ton (falls du Text/Chatter erzeugst):** kein Erklärbär, keine Gedankenstriche, keine Objekt-Handlung,
kein Maschinen-Jargon. Stilfilter über Substanz.

Liefert ein Pfad 404/HTML: **das ist ein Befund** (fehlender Deploy), kein Grund zu raten. Melde ihn.

---
*Stay fluffy.*
