# Lichtkegel, UFO, großer Wannen-Fahrer · Rückgabe an WS0 · 31.10.2026 (AFK-Plan V-1083)
Branch `game/ufo-licht-r1` von `game/integration-r2` @a119e385. Merge mit Georg. Schalter: `ufo=1`, `ufoauto=<s>`, `lightcone=1`, `tub=1`.

**Bestand Lichtkegel:**
| Nutzer | Vorher | Jetzt |
|---|---|---|
| Scheinwerfer | kfb-headbeam + groundfx beam2 | unverändert, schon dieselben zwei Bausteine |
| Laternen | groundfx cone | unverändert |
| Disco | eigener makeBeam-Kegel + groundfx cone | mit `lightcone=1` Volumen aus dem Modul |
| MiB-Tür | echte SpotLight + flacher Teppich | mit `lightcone=1` Projektion aufs Gelände, keine Lampe |
| MiB-Zielstrahl | headbeam ohne Bodenfleck | mit `lightcone=1` übers Modul, mit Fleck |
| UFO-Strahl | neu | immer übers Modul |
Modul: `src/look/lightCone.js`. Startvorhang und Laternen-Practicals behalten echte Lichter, sie waren nicht Teil des Auftrags.

**UFO:** `src/npc/ufoEvent.js`. Phasen, Bewegung, Zahlen aus dem Lab r2, Ende „keep“: erntet Fluff über fluffSuck. Regeln V-637 über `src/npc/worldEventGate.js`, gilt auch für MiB. Modell B34 r4 wie N38; Modul-Spitze 1,0 ms. Einfacher Kegel statt Lab-Shader mit Bändern, weil alles über ein Modul läuft.

**Große Fahrer:** verdrahtet, Clip je Rig, Lenkrad, Wanne 1,04. Nicht im Spiel getestet: Im Register ist keine große Figur spielbar.

**Offen:** Wannen-Einstieg r7c/r7d von WSB noch nicht eingebaut (kein Auftrag). Disco nur als Standbild geprüft. Hunky und Dory fehlen im UFO noch. Das UFO-Modell ist 15 MB groß.
