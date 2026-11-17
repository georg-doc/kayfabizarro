# Für WSA Feuer (neuer WSA-Chat) · Feuer R1: ein Feuer-Baukasten aus einem Guss, vom Lagerfeuer bis zur sich ausbreitenden Feuerfront und dem Flammenwerfer · 17.11.2026 (Georg, V-1884)

**Georg (17.11.):** Feuer soll sauber gelöst werden. Das Lagerfeuer ist „okay-ish“, die Feuer an den Rändern der Destruction-Slice sind etwa bei 70 %. Die Patch-Feuer-Module und -Einstellungen sollen übernommen und durchdekliniert werden:
- Lagerfeuer und Fackeln optimieren, alles mit einer Einstellung;
- dieselben Feuer im Kampf nutzen;
- aus `touch-grass` die sich ausbreitende Feuerfront übernehmen, ohne das Gras. Sie kann an Wänden laufen, auf einem Stoff-Feld ausbrechen und Gegner töten oder schmelzen (Ende-Kaskade);
- später ein Flammenwerfer am Roboterarm, gepulst oder lang gehalten, mit Zündflamme und Schaden, der sich ausbreitet. In Infinite Rooms vernichtet er Voxel, sonst tötet er Gegner.

## Quellen
- **patch.gg/patch/fire:** campfire, brazier, fireplace, Kerze bis Holzstapel; Regler Größe, Intensität, Wind; „Stoke“.
  - Liegt im Stamm schon unverändert unter `src/vendor/fire/` (Stand 14.11., MIT, V-1721).
  - Die HDR-Naht ist `src/look/feuerNaht.js` (Georg q662 PASS).
- **patch.gg/blendi/touch-grass:** Feuer, das vom Wind getrieben über eine Fläche läuft und verbrannten Boden hinterlässt. Übernommen wird nur die Ausbreitung, nicht das Gras.
- Zuerst `https://patch.gg/llms.txt` lesen, dann `pch remix` bzw. Quellen holen, Lizenz notieren. Unverändert unter `src/vendor/` ablegen, wie bei patch-car und fire.
- Prüfen, ob die Ausbreitung einen WebGL-Weg hat; das Spiel rendert WebGL. Wenn nicht, sag es früh.

## Was du baust (ein Modul mit Einbau-Vertrag, wie Infinite Rooms)
1. **Feuer-Familie als Daten:** Kerze, Fackel, Lagerfeuer, Feuerschale, Kamin, großes Feuer, Brandherd an einer Wand oder Kante. Jedes ist ein Eintrag aus Größe, Intensität, Wind, Funken, Rauch und Licht-Anteil auf demselben `FireLayer`. Lagerfeuer und Fackeln im Spiel wechseln auf diese Einträge.
2. **Feuerfront (Ausbreitung):**
   - ein Feld auf dem Boden oder einer Fläche, das zündet, sich mit dem Wind ausbreitet, abbrennt und verbrannten Grund zurücklässt;
   - Untergrund aus dem Materialcode (`src/modules/materialContact.js`), damit Stoff-Feld, Holz, Papier und Karton anders brennen als Stein;
   - meldet je Bild, was brennt (Ort, Radius, Stärke).
3. **Schaden über die vorhandenen Wege:** Treffer über den einen Zielhaken `src/modules/combatTargets.js` (`blast` bzw. Fläche).
   - Gegner sterben über ihre Ende-Kaskade. Rezepte liegen in `src/data/choreo`, ein Feuer-Tod als eigenes Rezept ist willkommen, etwa schmelzen statt platzen.
   - Infinite Rooms bekommt Feuer als eigenes Waffenprofil (WSA Patch, V-1877).
4. **Kampf-Feuer:** Feuerball und Brand-Treffer aus derselben Familie; die vorhandenen Waffen-VFX bleiben Ausgangspunkt.
   - **Flammenwerfer** als Aufsatz am Roboterarm: Zündflamme, Strahl gepulst oder gehalten, Front am Ziel. Den Arm-Slot plant WS1 ein (Waffenkammer).
5. **Ton:** Feuer-Bett und Zischen über unseren einen Mischer (`src/audio/kfbAudio.js`), kein eigener AudioContext.
6. **Licht:** ein Licht-Rig (V-385); Feuerschein über den vorhandenen Bodenfleck-Kanal (wie Lichtinseln), keine echten Lampen.

## Belege
- Auf der Kampfbühne (`buehne=r1`, `test/lib/buehne.mjs`): Feuer-Familie nebeneinander, Front auf ebenem Boden und auf einem Stoff-Feld, Gegner im Feuer, Flammenwerfer gepulst und gehalten.
- Kosten gemessen: Bildzeit mit 1, 5 und 20 Feuern.

## Lieferung
- Zweig im privaten Stamm-Repo mit Modul, `HOST_CONTRACT.md`, Tests und RETURN in `KFB_HUB/30_DECISIONS/replies/FEUER_R1/`.
- WS0 baut ein und legt Georg die Hub-Karte vor.
