# RETURN · E2_ATTACH_R1 · Clay-Lid E2 auf EyeRig v6 (ein Modul für WSA und WS1) · 2026-10-17

Status: **gebaut und maschinell geprüft. Georgs Sichturteil steht noch aus.**
Kein Push, kein Commit, nichts außerhalb dieses Ordners geschrieben. `pet-eye-rig.v6.js` und `clay-eyelid.v2.js` sind unverändert (sha256 unten).

## Kurz
- `clay-skin-attach.v1.js` blendet je Auge die dicken v6-Lidschalen aus (`e._up`/`e._lo`) und setzt **genau eine** E2-Lidhaut `lid_skin` als Kind von `e._lids` ein.
- Nichts anderes kommt an die Stelle der Schalen.
- Bau nach ALIEN_STALK_E2_PLAN §3 (Repo e1e60edff).
- Node-Test gegen das echte EyeRig v6: **89/89 PASS**. Unveränderter E2-Netztest: **103/103 PASS** (die Negativ-Gegenprobe wird übersprungen, weil `thin-clay-lid.v1.mjs` hier nicht liegt).
- Im Browser (headless Chromium) gemessen, beide Aliens r4:
  - v6-Schalen sichtbar 0, `lid_skin` 1 je Auge.
  - Abstand zur Höhlenschale +0,0059 R, 0 durchstoßende Stellen.
  - Pupille bei Lid zu 0 px in 8 Ansichten.
- Offen und **zu entscheiden**: Lady Dorys Höhle hat nicht 1,10 R, sondern **1,014 R**. Weg A macht ihr Auge deshalb um 10 % kleiner (s = 0,897). Siehe »Befunde« 2.

## API
```js
import { attachClaySkin } from './clay-skin-attach.v1.js';   // braucht ./clay-eyelid.v3.js → v2 → v1 daneben
const h = attachClaySkin(rig, THREE, {
  socketInnerR: null,   // Zahl | Zahl[] je Auge | (e, i) => Zahl, in R. null (Standard) = keine Skalierung
  socketPlay: 0.006,    // Spiel zur Schale, in R
  skin: {},             // E2-Überschreibungen (DEFAULTS2-Schlüssel). Standard = die abgenommene E2
  claySeed: 0,          // claySeed je Geometrie (+ Augenindex) für clay-material v8/v10
  autoUpdate: true,     // rig.update wird umhüllt: nach jedem rig.update(dt) läuft h.sync()
  epsilon: 0.1,         // Grad. Kleinere Lidänderungen wartet das Modul ab …
  settleFrames: 10,     // … und holt sie nach so vielen Bildern nach (kein bleibender Versatz)
});
h.skins    // [Mesh|null] je Auge      h.fit   // [s] je Auge
h.sync()   // nur nötig bei autoUpdate:false
h.detach() // stellt v6 wieder her (Schalen sichtbar, Haut weg, Skala zurück, Hooks weg)
```
Weitere Exporte:
- `lidValuesFromV6(e)` → `{cu, cl}`. Formel: `cu = (1,30 + e._up.rotation.x)/1,18`, `cl = (1,30 − e._lo.rotation.x)/1,18`, geklemmt auf −0,35…1.
- `fitScale(socketInnerR, socketPlay, skinOpts)`.
- `LID_SKIN_NAME = 'lid_skin'`, `CLAY_SKIN_ATTACH_SCHEMA = 'kfb.clay-skin-attach/1'`.

Verhalten:
- **Hook an `rig.build`:** Nach jedem Neubau kommt genau eine Haut je Auge. Die Geometrien verworfener Augen werden freigegeben. Ein zweiter `attachClaySkin`-Aufruf liefert denselben Griff zurück.
- **Je Bild:** Lidwerte aus den v6-Rotationen → `apertureV6` → `updateClayEyelidSkin`. Es ändern sich nur Positionen und Normalen, Index und Vertexzahl bleiben gleich.
- **Material:** `skin.material = e._up.material`. Tauscht `reskinLids()` das Material, zieht das Modul beim nächsten Bild nach.
- **Flags wie v6:** `userData.petOverlay = true`, `raycast` leer, `frustumCulled = false`, `castShadow = false`.
- **Passung (Weg A):** `s = min(1, (socketInnerR − socketPlay) / skinOuterMax)`. Bei 1,10 R: (1,10 − 0,006) / 1,124 = **0,97337**.
  - `e.scale` wird mit s multipliziert, Auge und Haut skalieren also gemeinsam.
  - Setzt der Wirt `e.scale` neu (`place()`), wendet das Modul s beim nächsten `update` wieder an.
- **Wimpern** hängen an `_up` und verschwinden mit der Schale. Bei beiden Aliens ist `lashes` 0.

## Einbau beim Wirt (ToolBox `kind: 'headpart'` / Spiel)
1. Vier Dateien vendorn: `clay-skin-attach.v1.js`, `clay-eyelid.v3.js`, `clay-eyelid.v2.js`, `clay-eyelid.v1.js`. Pfade relativ, ohne Build-Schritt.
2. EyeRig v6 wie bisher bauen (Proxy-Quader, `place()`-Hülle um `rig.build`). **Vor** `rig.build()` `attachClaySkin(rig, THREE, { socketInnerR })` aufrufen. So macht es `proof.html`.
3. Lidfarbe (WS0-Entscheidung): `makeMat` gibt die Rezept-`lidColour` unverändert zurück, ohne × 0,72. v6 übergibt in `o.color` den ×-0,72-Ton; den ignoriert der Wirt. E2 übernimmt das Material von `_up`.
4. Höhle aus dem Rezept: `socketInnerR = eyes.map(q => q.shellRadius / q.R)`. Das ergibt Hunky 1,1001 und Dory 1,0140 (gemessen bestätigt, siehe unten).
5. `clayLids.on` bleibt `false`, `lids.use` bleibt `false`. Den Text in `eyeSocket.lids` zieht WS0 nach (jetzt: »E2 skin via clay-skin-attach.v1«).

## WS0-Entscheidungen, umgesetzt
- **Weg A:** Auge und Haut skalieren gemeinsam. `socketInnerR` ist eine Option; ohne sie wird nicht skaliert.
- **Lidfarbe:** Host-lidColour, ohne × 0,72. Das bleibt beim Wirt: Test und Proof nutzen `makeMat` mit `lidColour`.
- **Clay-Shader:** clay-material v8/v10 liest `attribute vec3 claySeed` und rechnet im Objektraum. `uv` liest er nicht.
  - Darum fügt `clay-eyelid.v3.js` nur `claySeed` hinzu. Es nutzt denselben Hash wie `seedGeometry`.
  - Kein `uv`: Kein KFB-Lid-Shader braucht es, und es bräuchte eine nicht abgenommene Naht.
  - v2 bleibt unverändert und wird importiert, nicht kopiert.

## Was geprüft ist

### Node: `node tests/clay-skin-attach.test.mjs` (89/89)
Läuft gegen das echte v6 mit three r186 und einem Proxy-Wirt wie in proof.html.
- Je Auge:
  - Schalen unsichtbar.
  - Genau 1 `lid_skin`, Kind von `_lids`.
  - Material === `_up.material`, Farbe = Host-lidColour.
  - Flags, Raycast leer.
  - Sichtbar nur Sklera, Pupille und `lid_skin`.
  - 5 Meshes (4 von v6 + 1).
  - `claySeed` vorhanden.
- Sechs v6-Zustände über die öffentliche Emote-API: weit, Ruhe, 25, 50, 75, zu.
  - Lidwerte richtig zurückgerechnet, Lidspalt = `apertureV6(cu, cl)`.
  - χ = 2, geschlossen, 1 Körper, 0 Randkanten, 0 nicht-mannigfaltige Kanten, 0 Windungskonflikte.
  - Selbstdurchdringung 0 (Ruhe, zu).
  - **Vertexzahl 15 682 und Indexpuffer byte-gleich** über alle Zustände.
  - Zusätzlich c = −0,35, direkt in die Schalen geschrieben: Kante 87,348°, χ 2.
- `blinkNow()` erreicht die Haut.
- Neubau (`setEye`): weiter genau 1 Haut je Auge, alte Geometrien freigegeben (2).
- `reskinLids()` wird übernommen. Ganzes Rig: 10 Meshes, keine Streuschalen.
- Weg A:
  - `skinOuterMax` = 1,1240 R, s = 0,97331.
  - Haut-Außenradius ≤ 1,0940 R in allen sechs Zuständen.
  - Überschreibt der Wirt die Skala, wird s wieder angewendet.
- `detach()` stellt v6 wieder her.

### Node: `node tests/clay-eyelid-skin.test.mjs` (103/103)
Der E2-Test aus e1e60edff, unverändert. Er beweist, dass die gevendorte v2 die abgenommene Geometrie ist.

### Browser: `proof.html?measure=1`
Headless Chromium, `evidence/measure_socket-recipe.json`. Beide Aliens r4, Bindungspose, Höhle nach Rezept.

| | Lord Hunky (2 Augen) | Lady Dory |
|---|---|---|
| Höhlenschale gemessen (Außenseite, Kugel) | 1,1000 R (p1 1,0999) | **1,0139 R** |
| Öffnungsachse / Halbwinkel am Rollrand | +Z · 54,1° | +Z · 52,9° |
| Passung s | 0,97337 | **0,89676** |
| Haut außen max | 1,0941 R | 1,0080 R |
| Abstand Haut ↔ Schale (offen/Ruhe/50/zu) | +0,0059 R, 0 Stellen durch | +0,0059 R, 0 Stellen durch |
| v6-Schalen sichtbar / lid_skin je Auge | 0 / 1 | 0 / 1 |
| Pupille px bei **zu**, 8 Ansichten | **0** | **0** |
| Pupille px bei Ruhe, vorn | 7 460 | 6 172 |

Die 8 Ansichten: vorn, 40° links/rechts, 30° oben/unten, 75° seitlich, oben, hinten.

Bilder liegen in `evidence/stage_*.png`. Ich habe sie mir angesehen (Pixelaufnahmen aus WebGL, kein DOM-Nachbau):
- Ruhe/zu vorn, 50 % ¾, offen und zu seitlich, ganze Figur.
- Zwei große Nahaufnahmen.

## Befunde (bitte lesen)
1. **v6 öffnet nie weiter als c = 0.** `update()` rechnet `cu = min(1, max(P.u, blink))` mit blink ≥ 0.
   - Weit offen zeigt v6 also eine Lidkante bei 63,7°, nicht bei 87,3°. Die Klemme −0,35 erreicht nur ein Wirt, der die Schalen selbst dreht.
   - Die Rezept-Emote `lidUpper −0,4` ergibt deshalb Oberlid c = 0, nicht −0,28 (Plan §6 nahm 82,6° an).
   - In der Höhle heißt das: Ruhe oben 55,6° gegen Öffnung 54,1° (Hunky). Vom Lid sieht man in Ruhe nur einen ~1,5°-Streifen. Ab 50 % ist es klar lesbar.
2. **Lady Dorys Höhlenschale hat 1,014 R, nicht 1,10 R.** Gemessen auf der GLB; Rezept-`shellRadius`/R = 1,0140. Der Rezepttext »1,10 R« stimmt für Dory nicht.
   - Weg A nach Rezept gibt s = 0,897: Dorys Auge wird 10 % kleiner. So zeigt es der Proof standardmäßig.
   - Mit »1,10 R für beide« (Knopf im Proof) bleibt s = 0,973. Dann steht die Haut bis ~0,08 R **außerhalb** der Schale (sichtbar als zweiter Ring).
   - **Entscheidung WS0/Georg:** (a) Dory-Auge 10 % kleiner akzeptieren, (b) Dorys Höhle in einem r5 auf 1,10 R backen, oder (c) Weg B (dünnere Haut, Formänderung gegen den PASS).
3. **Rollrand gegen geschlossene Haut.** Der eingerollte Rand der Schale (innen gerichtete Vertices vorn, r 0,9…1,1 R) liegt bei Ruhe, 50 % und zu teilweise innerhalb des Haut-Außenradius.
   - Grob gemessen: Hunky bis 0,068 R tief, Dory bis ~0,10 R.
   - Das ist die Stelle, an der das Lid »unter den Rand« gleitet. Die v6-Schalen (1,056 R) schneiden denselben Ring.
   - Im Bild lese ich keine Kante. Bei streifendem Blick auf den Rand habe ich es aber nicht gezielt geprüft (Messung über 2°×4°-Zellen, keine echte Schnittprüfung).
4. **Kosten:** Ein Neubau der Haut kostet ~5,2 ms je Auge (Node, Apple silicon).
   - Bei v6-`life` (wander/tremor an) ändern sich die Lider dauernd. Darum gilt `epsilon` 0,1° mit Nachholen nach 10 Bildern.
   - Beim Blinzeln laufen 2 Augen × ~5 ms je Bild. Für WS1 auf schwacher Hardware messen.

## Was ich NICHT prüfen konnte (ehrlich)
- **Georgs Sichturteil.** Ich habe die headless Aufnahmen selbst angesehen; ein menschliches Abnahme-Auge war nicht dran. Die Referenz-PNG steht im Proof daneben.
- **Bewegung:**
  - Kein Clip (Idle/Walk), kein Dangle/Stielschwingen, kein Mund-Decal.
  - Bindungspose: ob das Auge bei schwingendem Stiel (maxDeg 18) die Schale schneidet, ist ungeprüft (Plan §7.4).
- **ToolBox und Spiel:** Kein Test in der echten ToolBox (WSA) und im echten Spiel (WS1). Nur Proxy-Wirt (Node) und Proof-Lader.
- **Clay:** Der Proof nutzt clay-material **v8** (profile `figure`, wie WS1/proof_r2). Mit der ToolBox-Fassung **v10** ist die Haut nicht gerendert; `claySeed` ist nur strukturell geprüft.
- **Pixel und Ansichten:**
  - Die Pixelprüfung »0 px Lidrand außerhalb der Öffnung bei weit« ist nicht gemacht.
  - Von oben und hinten nur in der Pupillenzählung, nicht als Bild.
  - Blick-Auslenkung (Pupille ±0,5 rad) gegen die skalierte Haut ist ungeprüft; der Proof hält den Blick fest.
- `eyeoval` (Ovalform) ist nicht getestet. Beide Rezepte haben `oval: null`.
- Bekannte E2-Schwächen bleiben: Kerbe am Nahtende bei zu, Pol mit 160 Dreiecken.

## Proof starten
```
cd ~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS/replies/E2_ATTACH_R1 && python3 -m http.server 8000
# Browser: http://localhost:8000/proof.html     (?socket=recipe|1.10|none · ?measure=1)
```
- Knöpfe: offen / Ruhe / 50 % / zu / Blinzeln · vorn / ¾ / seitlich / ganze Figur · Passung (Rezept / 1,10 R / ohne).
- Rechts: Referenz-PNG und Live-Werte (sichtbare v6-Schalen, lid_skin-Zahl, s, cu/cl, U/L/A).
- Licht: Hemisphäre + ein Frontlicht. Kein Rim-, kein Gegenlicht, keine Shadow-Maps (keine Eigenschatten), weicher Kontaktfleck am Boden. Lid-Clay-Sheen 0,04.
- three r180 kommt per Importmap von jsDelivr (Internet nötig), alles andere relativ aus dem Ordner.

## Dateien (sha256)
| Datei | sha256 | Herkunft |
|---|---|---|
| `clay-skin-attach.v1.js` | 9a22279a… | **neu** |
| `clay-eyelid.v3.js` | eb751a5b… | **neu** (v2 + claySeed) |
| `clay-eyelid.v2.js` | 7f1cf72f… | e1e60edff, unverändert |
| `clay-eyelid.v1.js` | 4e186697… | e1e60edff, unverändert (liefert V6-Maße) |
| `mesh-qa.v1.js` | 8df5c686… | e1e60edff, unverändert (nur Test) |
| `tests/clay-skin-attach.test.mjs` | bc46dbad… | **neu** |
| `tests/clay-eyelid-skin.test.mjs` | 6187f72f… | e1e60edff, unverändert |
| `proof.html` | 65ef5ec6… | **neu** |
| `vendor/pet-eye-rig.v6.js` | 3129bb7b… | = ToolBox kfb-lib / `_alien_head_parts_r1/vendor`, unverändert |
| `vendor/clay-material.v8.js`, `clay-profiles.v2.js`, `clay-relief.v2.js`, `Fingerprints01_3K.png` | 2a7a1a54… (v8) | = `_blender_run_r2/vendor`, nur für den Proof |
| `assets/LordHunky_RigMedium.toolbox.r4.glb` | c90f6509… | `git show gh/assets/kfb-blender-run-r1-2026-10-16:media/3D_Assets/MeshyModels/alien_figures_toolbox_r1/…` |
| `assets/LadyDory_RigMedium.toolbox.r4.glb` | 74420ad9… | dito (= Rezept-sha256) |
| `assets/{lordhunky,ladydory}-headpart-r4.ws0-2026-10-16.kfb-pets.json` | | dito, r4-Rezepte passend zu den r4-GLBs |
| `assets/E2_approved_closed_lid_skin.png` | | Kopie aus `E2_REFERENCE/` |
| `evidence/` | | Testausgaben, Messung, Aufnahmen |

Die Tests brauchen Node ≥ 22.12 und three.js. Sie suchen three in dieser Reihenfolge: Umgebungsvariable `KFB_THREE`, dann `three`, dann die lokale Kopie `kfb-dungeon-poc`.
