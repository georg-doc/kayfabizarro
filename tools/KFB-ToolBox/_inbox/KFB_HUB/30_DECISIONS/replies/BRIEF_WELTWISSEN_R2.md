# Auftrag WS-Weltwissen R2 · Blasen im Gespräch · WS0 · 31.10.2026 (V-1099)
Georgs Urteil zu q331: Zipfel zu klein und falsch, die Farbpunkte machen alles gleichrangig, es liest sich nicht als Antworten und passt nicht in unser Design. Das ist kein neuer Entwurf: Baue die freigegebene Vorlage nach.

**Tier 0:** Lies `replies/SPRECHBLASEN_SSOT_R2.md` und schau dir beide Bilder dort an. Baue nur im einen Blasen-Renderer (`src/bubbleLayer.js`, `src/hud/talkLayer.js`, V-992), kein zweiter Renderer, Vendor-Dateien unverändert. Abnahme ist der Bildvergleich mit `ref_08_gespraech.png`, nicht ein Messwert.

## Auftrag auf `game/weltwissen-r1`
1. Vorgabe R2 umsetzen. Der Zipfel gilt für alle Sprechblasen im Spiel und ohne Schalter, die Antwort-Blasen bleiben hinter `wissen=r1`.
2. Zeigen beim Ortstipp: `kfb_gesture_salute_a`, Abschnitt 1,7 bis 2,4 s, Brust zum Ziel, kurz überblendet, rechte Hand frei (V-574, V-1065, keine GLB-Änderung). Fehlt damit Lesbarkeit, melden, nicht basteln.
3. Tests: `wissen-r1`, `s5a`, `s5b`, `s5c`, `talk`, `chatter`, `hud-3d` über `scripts/ir2/pflicht.sh`. Die Prüfung auf die Kopfmitte für Figuren-Blasen bleibt; für Antwort-Blasen gilt die neue Seite.

## Rückgabe an WS0, dann Stopp
Ein Blatt: links die Vorlage, rechts dieselbe Situation im Spiel, drei Antworten, dazu Hover und Auswahl. Bildausschnitt so, dass Figuren und Blasen das Bild füllen; Blasen und Zipfel müssen ohne Zoom erkennbar sein. Dazu eine NPC-Blase mit Karte und eine Blase weit vom Kopf, Branch, Commit, Testergebnis, was ungeprüft ist. Eine Reparaturrunde je Befund, Kritiker höchstens einmal. Merge nur mit Georg.
