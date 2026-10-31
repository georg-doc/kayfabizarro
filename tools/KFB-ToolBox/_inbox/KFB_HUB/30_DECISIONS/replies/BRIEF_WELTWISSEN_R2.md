# Auftrag WS-Weltwissen R2 · Blasen im Gespräch · WS0 · 31.10.2026 (V-1099)
Georgs Urteil zu q331: Zipfel zu klein und falsch, die Farbpunkte machen alles gleichrangig, es liest sich nicht als Antworten und passt nicht in unser Design. Das ist kein neuer Entwurf: Baue die freigegebene Vorlage nach.

**Tier 0:** Lies `replies/SPRECHBLASEN_SSOT_R2.md` und schau dir beide Bilder dort an. Baue nur im einen Blasen-Renderer (`src/bubbleLayer.js`; `src/hud/talkLayer.js` zeichnet über dessen `bubbleBodySvg`, V-992), es bleibt ein Zeichenpfad, Vendor-Dateien unverändert. Abnahme ist der Bildvergleich mit `ref_08_gespraech.png`, nicht ein Messwert.

## Auftrag auf `game/weltwissen-r1`
1. Vorgabe R2 umsetzen. Der Zipfel gilt für alle Sprechblasen im Spiel und ohne Schalter, die Antwort-Blasen bleiben hinter `wissen=r1`.
2. Zeigen beim Ortstipp: `kfb_gesture_salute_a`, Abschnitt 1,7 bis 2,4 s, kurz überblendet (V-1093). Die ganze Figur dreht sich mit der Brust zum Ziel, ohne Knochen-Versatz (V-1065, V-956). Ist die rechte Hand besetzt, entfällt die Geste (V-729). Keine GLB-Änderung (V-574). Fehlt damit Lesbarkeit, melden, nicht basteln.
3. Tests: `scripts/ir2/pflicht.sh`, dazu `wissen-r1`, `s5a`, `s5b`, `s5c`, `talk`, `chatter`, `combat`, `s1-travel`, `c3b` (V-887). Die Prüfung auf die Kopfmitte für Figuren-Blasen bleibt; für Antwort-Blasen gilt die neue Seite. Vergleichsbilder dieser Tests ändern sich durch den Zipfel absichtlich und werden neu aufgenommen.
4. Papier `#fbf2df` ist der Standardwert der Tönungslogik aus V-519, kein neuer Festwert. Zwei bis vier gesprochene Antworten bleiben möglich (V-1067), die Szene zeigt drei.

## Rückgabe an WS0, dann Stopp
Einzelbilder aus dem Live-Stand mit Site-Hash, kein Sammelblatt (V-734, V-1100), je Bild ein Satz, was abzunehmen ist: Vorlage und Spiel nebeneinander mit drei Antworten, Hover, Auswahl, eine NPC-Blase mit Karte, eine Blase weit vom Kopf. Das Vorlagen-Bild zeigt keinen NPC-Sprecher, für NPC-Zipfel gilt weiter V-887. Figuren und Blasen füllen das Bild; Zipfel müssen ohne Zoom erkennbar sein. Prüfe vor der Abgabe jedes gezeigte Gesicht gegen seine Figurenkarte (V-1045, V-1046, V-1098). Dazu Branch, Commit, Testergebnis, was ungeprüft ist. Eine Reparaturrunde je Befund, Kritiker höchstens einmal. Merge nur mit Georg.
