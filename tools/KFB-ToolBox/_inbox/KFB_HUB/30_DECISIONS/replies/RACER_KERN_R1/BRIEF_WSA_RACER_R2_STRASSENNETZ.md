# Für WSA Racer · Racer R2: Straßennetz als Modul, Fahrzeugprofile einbaufertig, Tests im Stamm · 17.11.2026 (WS0, Georg „was sollten wir dem Racer mitgeben“)

Danke für Wald, Fahrzeugprofile und Owner-Anschluss (7/7). Jetzt geht es darum, dass deine Bausteine im Spiel laufen. Drei Stücke, in dieser Reihenfolge sinnvoll:

## 1. Straßennetz als ein Modul (das wichtigste Stück)
Deine Track-Logik für ein prozedurales Straßennetz ist Georgs Straßen-Idee vom 16.11.: ruhige Fahrstrecken mit Kurven, Kreuzungen und Abzweigen, endlos, Begegnungen am Rand. Im Spiel braucht es dafür **eine** Quelle für Straßenlinien, die alle lesen:
- **Gelände:**
  - Unter der Straße wird es eben, über `endlessTerrain` (Schneise wie `reserveOpening` / `gelaendeOeffnung.js`).
  - Die Fahrbahn liegt bündig, mit Rand wie `viertelZufahrt.js` (Sprenkel-Auslauf).
  - Bordsteine und Banden über den einen Besitzer `src/modules/kfb-curb/`.
- **Claude Design** setzt seine Stoff-Felder neben Straßenlinien (Umgebungs-Modul, Zweig `claude/umgebung-r1`). Dein Netz liefert diese Linien.
- **Der Verteiler** setzt Begegnungen, Props und Pop-ups am Rand. Er braucht dazu `strassenUm(x, z, r)` mit Linien, Breite und Kreuzungen.
- **Untergrund:** Asphalt über `surfaceAt` bzw. den Materialcode, damit Haftung und Reifenton stimmen.

Lieferung als Modul mit `HOST_CONTRACT.md` (wie Infinite Rooms): kein eigener Renderer, kein Welt-Schritt. Deterministisch aus dem Seed, gestreamt in Kacheln wie das Gelände.

## 2. Fahrzeugprofile einbaufertig
- Die Profile für Rennwagen und Dieselpunk werden Daten für unseren Patch-Wagen (`src/m2/M2Car.jsx`, `fahrphysik=patch1`, `patchHaftung.js`, `patchStunt.js`).
- Bitte als Kandidat-Zweig auf dem aktuellen Stamm, mit deinem Anschlusstest im Stamm laufend.
- Was im Profil schon im Patch-Wagen steckt (Haftung, Drift, Sprung), bleibt dort. Das Profil liefert nur die Unterschiede.
- `toy`/`gummi`-Meldungen gehen an die Hartgummi-Tabelle `src/world/gummiTabelle.r1.json`. Der Wagen-Anstoß auf Figuren ist `autoPuppenTempo` (Arena und Kampfbühne).

## 3. Testen auf der Kampfbühne
- Im Stamm gibt es seit heute die Kampfbühne: Schalter `buehne=r1`, ebener Platz, Anlauf-Bahn, Ziel auf Z.
- Prüfzugang `__kfbBuehne.wagen()`, Soldat und Würfelmonster über `setze('soldat' | 'wuerfelmonster')`, Kameras und geteilte Aufnahme in `test/lib/buehne.mjs`.
- Für Wagen gegen Figur oder Prop ist das der Prüfort. Fahrbelege laufen sonst mit der Fahrkamera auf freier Strecke.

Öl, Buntstift und Aquarell brauchst du für das Spiel nicht weiter (Georg).
Rückgabe wie gewohnt: Zweig, RETURN, Georg bekommt die Hub-Karte über WS0.
