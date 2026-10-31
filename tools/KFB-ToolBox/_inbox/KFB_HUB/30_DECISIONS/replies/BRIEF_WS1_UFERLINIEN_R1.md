# Auftrag WS1 · Uferlinien im Wasser · WS0 · 31.10.2026 (V-1102, N-015)
Georg: Am Ufer fehlen die cartoonigen auslaufenden Linien. Das ist eine zusätzliche Ebene neben dem Fluid, keine Änderung am Fluid.

**Vorlage (Logik, kein Code übernehmen, V-092):** TinySkies `client/src/game/Globe.ts`, Abschnitt „Coastline contour foam“. Eine `fract()`-Kontur aus dem Abstand zum Land, leicht verwellt, wandert mit der Zeit, wird zum Tiefen hin ausgeblendet. Das ist dieselbe Grundlogik wie unser Farbband in `terrain3`. Georgs Kopie liegt im Dropbox-Ordner `KFB VoxelWorld`; hast du sie nicht, reicht diese Beschreibung.

**Bau:**
- In `src/look/kfbWater.js`, `kitFluid`, aus dem vorhandenen Uferabstand `vShore` plus Fließrichtung, hinter `shore=lines` als eigener Schalter. Ohne Schalter bleibt das Wasser unverändert.
- Linien in heller, weißlicher Fluidfarbe (V-1084), wenige und breit, sie folgen der echten Uferlinie aus dem Gelände. Keine aufgemalten Linien, keine Textur.
- Reihenfolge: mit Wasser R2 (Nähte). Georgs direkte Korrekturen an dich gehen vor.

**Beweis (V-1100):** Einzelbilder aus dem Spiel, kein Sammelblatt: nahes Ufer am See, Fluss, Spielkamera, je mit und ohne Schalter, dazu ein kurzes Video, weil die Bewegung das Entscheidende ist. Meldung im Kanal, Georg urteilt.
