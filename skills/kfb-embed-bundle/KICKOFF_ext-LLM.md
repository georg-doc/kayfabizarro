# KICKOFF — KFB-Kanon für ein externes LLM (paste-ready)

Kopiere diesen Block in einen fremden Chat/Agenten. Er macht ihn **plug&play-fähig** für den
KayfaBizarro-Kanon, ohne dass du etwas erklären musst. Details je Fähigkeit: `00_INDEX.md` /
`kfb-embed-index.json`.

---

Du baust im **KayfaBizarro (KFB)**-Kanon. Repo: `github.com/georg-doc/kayfabizarro`. Halte dich an
diese Regeln — sie sind aus Schaden gelernt, nicht aus Geschmack:

**Lade-Regeln**
1. **ES-Module** immer über **jsdelivr** (`cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/…`) oder
   **pages.dev** — **nie** über `raw.githubusercontent.com` (das liefert `text/plain`, der Browser
   verweigert das Modul → schwarzer Schirm).
2. **Bytes** (`.json`, `.glb`, PNG, Sounds) über **pages.dev** oder **raw**. **Datei-Listen** über die
   **GitHub-Tree-API** (der Baum ist die Wahrheit, kein gebackener Katalog; cachen, 60 Anfragen/h).
3. **Verifiziere per Fähigkeit, nicht per Version im Dateinamen** — z. B. `drawInk.length >= 8`, nicht
   „heißt es v2?".
4. **200 ist nicht JavaScript.** Fehlt eine Datei, liefert Cloudflare eine Fallback-Seite mit **HTTP
   200 und MIME `text/html`** — tarnt sich als Erfolg und reißt den Import-Graph mit. Nach jedem Deploy
   den Import-Pfad öffnen und **echtes JS erwarten**.
5. **three GENAU 0.160, ein Build.** `crossOrigin='anonymous'` an jedem Canvas-Bild. **`scale = 1`**
   für Pixel-Sprites (krumme Skalierung frisst die Outline-Pixel).
6. **Keine zweite Wahrheit.** Eine lokale Kopie ist Cache/Fallback; die kanonische URL gewinnt und darf
   sie nicht überleben.

**Ton/Haltung (falls du Text/Chatter erzeugst):** Kayfabe als Ernst, Blödsinn als Methode, kein
Erklärbär. Stilfilter über Substanz, Konflikt ist die Invariante. Keine Gedankenstriche, keine
Objekt-Handlung, kein Maschinen-Jargon.

**Fähigkeit holen (Muster):** willst du Fähigkeit *X*, importiere/fetche die kanonische URL aus dem
Index und prüfe den Fähigkeitstest. Kernstücke:
- **Ink-Outline (Karten+UI):** Modul `https://kayfabizarro.pages.dev/skills/kfb-ink-canon.js`, Test `drawInk.length>=8`.
- **Cube-Pet (Rig):** `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/kfb-pets.js` + Vertrag `kfb-pets.json` (fetch), three 0.160. Voll-Doku `EMBED_CUBE_PET_FULL_v2.2.md`.
- **CardBuilder:** `kfb-card-builder.js`/`kfb-card-format.js` (CARD_AR 1.74). Voll-Doku `EMBED_KFB_CardBuilder_Ink_FULL.md`.
- **Cartoon-Motion:** Doku `cartoon-motion_v1.md` (Formeln explizit übernehmen — Design-Canvas lädt keine Skills).
- **Assets:** `media/2D_Assets` + `media/3D_Assets` über die Tree-API; TreasureHunters, Pirate_Bomb, Tiny Swords, GLB-Pet-Kits.
- **Audio:** zwei Manifeste getrennt — `sfx.json` (Welt/Voice) und `ui-sfx.json` (UI).

Wenn ein Pfad 404/HTML liefert: **das ist ein Befund** (fehlender Deploy/Ordner), kein Grund zu raten.
Melde ihn, rate keine Endung und keinen Nachbarpfad.

---
*Stay fluffy.*
