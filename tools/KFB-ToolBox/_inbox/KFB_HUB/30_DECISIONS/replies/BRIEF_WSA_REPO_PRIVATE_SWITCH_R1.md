# BRIEF · `georg-doc/kayfabizarro` auf privat umstellen, ohne dass Seiten brechen · R1 · 2026-10-21 · WS0
**Register:** V-599. Grundlage: `replies/REPO_PRIVATE_MIGRATION_INVENTORY_R1.md` (WSA, 17.10.).
**Owner:** WSA work (Vorbereitung und Prüfung). Den Schalter legt Georg selbst um (GitHub-Einstellungen). Merge nur mit Georg.

**Tier 0**
1. **Ziel:** Das Repo wird privat, damit gekaufte Dateien (KayKit Mystery, Cozy Tunes, Meshy usw.) nicht mehr öffentlich sind. **Georgs öffentliche Seiten bleiben voll funktionsfähig.**
2. **Weg:** Die Seiten laden ihre Medien und Daten von **Cloudflare** statt von `raw.githubusercontent.com`, jsDelivr oder GitHub Pages. Die rund ein Dutzend Basis-Konstanten werden umgestellt, nicht 125.000 Zeilen.
3. **Abnahme:** Jede Seite unten läuft gegen eine Kopie mit gesperrten GitHub-Raw-Zugriffen (Test: Raw/jsDelivr/github.io blockiert) und zeigt dasselbe Bild wie vorher. Erst dann gibt Georg den Schalter frei.

## Block
**Müssen öffentlich weiterlaufen (Georg 21.10.):**
- **`https://kayfabizarro.pages.dev/FrizzleBob/`**: Regeln, Essays bzw. Lesarten (`01-first-reading.md` … `18-the-concept-reader.md`), `LERNEN_MIT_MASCHINE.html`, Ausstellung, Avatar. `FrizzleBob/index.html` hat 2 Raw/jsDelivr-Verweise.
- **KFB PDF-Viewer bzw. Deck-Viewer**, die PDFs und JSON über GitHub lesen: `KFB Comic Card Deck Viewer v4 (WS0)/` (v3/v4/v5, standalone, `deckviewer/kfb-corpus.js`, `PDF_SOURCES.md`). Laut Inventur liegen alle 135 PDFs schon bei Cloudflare; etwa 4 Adressen ändern und das Bundle neu bauen.
- **Alle übrigen öffentlich verlinkten Seiten** auf `kayfabizarro.pages.dev`: Liste aus dem Inventar §1, mit Georgs Hub-Links abgleichen.
- **chatgpt.site-Werkzeuge** (Asset Library inkl. Dramatis Personae, Audio, ToolBox, Staging): Sie lesen ohne Token aus Raw/API. Umstellen auf Cloudflare-Daten bzw. den serverseitigen Abruf mit Token-Secret (wie WS1-Staging).

**Technik:**
- **Cloudflare-Build** (`.github/scripts/build-cloudflare-pages.mjs`): Er schließt `media/2D_Assets` und `media/3D_Assets` aus.
  - Nur die **öffentlich nötigen, freien** Medien (CC0, eigene Werke) aufnehmen bzw. nach R2 legen. Gekaufte Dateien nie.
  - Wo eine öffentliche Seite gekaufte Medien zeigt: melden, Georg entscheidet.
- **Basis-Konstanten** für `…/main/media/3D_Assets`, `…/<sha>/media/3D_Assets`, `…/main/media/2D_Assets`, `…/main/media/kfb`, jsDelivr `@main/…` auf Cloudflare- bzw. R2-Adressen umstellen. Dazu `registry/assets/v1` `rawLatest`/`rawPinned` per Build-Abbildung, nicht per Hand.
- **GitHub Pages** (`georg-doc.github.io/kayfabizarro`) entfällt. Verweise darauf (11 Dateien) auf `kayfabizarro.pages.dev` umstellen.
- **Workflows:** laufen mit `GITHUB_TOKEN` weiter. Das Actions-Minuten-Kontingent für private Repos prüfen. Die 11 Public-Proof-Skripte anpassen.
- `raw.githack.com` (2 Code-Dateien im `_inbox`) entfernen.

**Grenzen:**
- Nichts löschen und nichts aus der History entfernen; das entscheidet Georg getrennt.
- Kein Umschalten der Sichtbarkeit durch WSA.
- Arbeit auf `wsa/*`, ein PR. Meldung über WS0 mit einer Liste „Seite → Prüfung PASS“ und einer Liste der Medien, die öffentlich bleiben (mit Lizenz).

**Danach (WS0):** Der private Branch `KFB-Stunt-Car-Race/assets/private` zieht nach `kayfabizarro` um, ein Ort für alles.
