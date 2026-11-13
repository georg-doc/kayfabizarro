# Arena R1 · Wüstenstadt + 6 MiB-Gegner · WS0 11.11.2026 (Georg q613/q615/q616, V-1642/V-1646)

**Tier 0:** Trunk game/integration-r2 (≥ @b8b78978), Schalter `arena=r1` (aus), Beleg-Standard test/lib/beleg.mjs, ein Kritiker pro Runde. Nichts erfinden: Stadt = Demo-Szene 1:1, Gegner = MiB-Agenten mit ihren eigenen Clips as-is. Rückgabe an WS0, Fragen an Georg nur über WS0.

**Auftrag (ein Paket, drei Stufen, je Stufe Beleg im Spiel):**
1. **MiB-Agenten sauber (Georg q616, Pflicht vor allem anderen)**, im NPC-Weg (mibCast/eyeActor) und als Spielfigur (cardActor, char=agent…, figuren=alle):
   a) Kopf/Gesicht wirkt flach und dunkler als die Textur – Ursache klären (Knete/Palette/Füll-Licht), Gesicht wie bei FB plastisch;
   b) Lider = Hautfarbe etwas dunkler (Lid-Regel; WS0 hat den Karten-Darsteller @b8b78978 korrigiert, der sichtbare Lidrand der E2-Haut ist noch hell);
   c) unter dem Kopf Schatten statt heller Hals/Hemd-Kante;
   d) Bodenschatten muss da sein;
   e) Haarsträhnen ragen in die Augen (Augen R2 ×1,15) – Augen oder Haar so, dass nichts ineinander steckt;
   f) Mund: heute das Mund-Decal aus der WSB-Lieferung (Satz gpt_a_r2); prüfen gegen Figurenkarte agent_b40(.large) und Georgs Mund-Wahl, im Zweifel WS0 fragen.
2. **Arena-Viertel:** KFB_HUB/50_BLENDER/ARENA_R1 (README, parse_scene.py, build_scene.py, data/demo_scene.json, 261 Teile) → ein GLB der Stadt (instanzierte Netze, Paket-Farbtafel) nach assets/private (Quelle: lokales Unity-Paket, siehe README), im Spiel als Viertel an einer festen Stelle, unser Boden/Licht/Knete, Häuser und Mauern als Hindernisse.
3. **6 Gegner + Logik:** 6 MiB-Agenten (AG1–AG3 in Farbvarianten über Anzug/Krawatte, keine neuen Modelle; KayKit-Farbvarianten-Liste der WSA-Asset-Library als Hinweis) mit Zuständen Wache → Alarm (Sicht) → Deckung → Schießen (Blaster, eigene Clips: aim/shoot/reload/dodge/strafe/hit) → Treffer/Fallen; Wegenetz über die Gassen; Vorbild Yuka (three.js-Spiel-KI, MIT) + dessen Shooter-Beispiel, nur übernehmen was passt. Treffer über combatTargets, Waffen/VFX/Ton wie im Spiel. Parcours: Stadttor → Marktplatz.

**Beleg:** je Stufe Bilder/kurzes Video aus dem Spiel (front/seitlich, nie von hinten), Bildzeit p50/p95 mit/ohne arena=r1. Rückgabe mit Commit, Liste offener Punkte.
