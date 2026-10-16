# ALIEN STALK E2 PLAN · Lord Hunky und Lady Dory · 2026-10-16

Status: **Plan, nichts gebaut.** E2 ist seit V-348 (Georg 16.10.) die KFB-Lidkonstruktion. Dieser Plan beschreibt, wie E2 in die
Stielaugen der beiden Aliens kommt. Er braucht die Hülle aus Schritt 7 (`attachClaySkin`, HANDOVER §5). Schritt 6 (Oval) braucht er nicht:
beide Rezepte haben `eye.oval: null`.

Quellen: `~/Dropbox/CLAUDE/MeshyModels/_alien_figures_toolbox_r1/{lordhunky,ladydory}-headpart-r1.ws0-2026-10-15.kfb-pets.json`
(`pets[0].eyeSocket`, `eyes[]`, `eyeHost`, `dangle`), `_work/proof.html`, `pet-eye-rig.v6.js` (nur gelesen), `clay-eyelid.v2.js`.

## 1 · Georgs Vorgabe (16.10.)
- Das E2-Auge sitzt in der vorhandenen, eingebackenen Augenhöhle (Socket-Schale) von Lord Hunky und Lady Dory. Die Höhle umschließt Auge und Lid.
  Die Höhle bewegt sich nicht mit dem Lid. Es gibt keinen Höhlen-Lidschlag.
- Der Stiel setzt hinten an, etwas unter der Mitte. Das Auge ist leicht nach vorn geneigt.
- Das Lid ist in der Höhlenöffnung lesbar. Weit offen zieht es sich hinter den Höhlenrand bzw. in den Kopf zurück. Keine Naht ist sichtbar.

## 2 · Was feststeht
| | Lord Hunky | Lady Dory |
|---|---|---|
| Augen | 2 · `KFB_Eye_R/L_anchor` an `eyestalk.r/.l` | 1 · `KFB_Eye_C_anchor` an `eyestalk.c` (Auge 1 unsichtbar) |
| R (m) | 0,12015 / 0,11972 | 0,15406 |
| Lage | `quat` = Identität, Blick +Z | Blick `gaze` (0,27972, 0,06127, 0,95813) |
| Socket-Schale (Rezept-Text) | 1,10 R · Öffnung 58° · Rollrand 0,075 R · Farbe = Stielfarbe | gleich |
| `eyes[].shellRadius` / R | 1,1000 | **1,0140** (passt nicht zu 1,10 R, klären) |
| v6-Lidschalen heute | lidFit 0 → 1,056 R | lidFit 0,9 → 1,011 R |
| `lids.use` / `clayLids.on` | false / false | false / false |

`clayLids.on` bleibt aus. E2 ist kein ToolBox-clayLid. E2 ersetzt die v6-Lidschalen in `e._lids`, also genau das, was `eyeSocket.lids` heute beschreibt.
Den Text in `eyeSocket.lids` zieht WS0 nach, wenn E2 hängt.

## 3 · Anbindung unter `e._lids` (HANDOVER §5)
1. Neues Modul neben v2, z. B. `clay-eyelid/clay-skin-attach.v1.js` mit `attachClaySkin(rig)` nach dem Muster `eyeoval.attach`.
   Es hängt sich an `rig.build`, weil v6 bei jedem `build()` die Augen neu baut.
2. Je Auge nach dem Bau: `e._up.visible = e._lo.visible = false`. Nicht löschen: v6 schreibt weiter `rotation.x`, daraus lesen wir den Lidwert.
   Achtung: Wimpern hängen als Kind an `_up` und verschwinden mit. Bei beiden Aliens ist `lashes.length` 0, also ohne Folgen.
3. Haut: `clayEyelidSkinGeometry(THREE, { radius: rig._R, aperture })` als Mesh, Kind von `e._lids`.
   Damit greifen die Schräge (`_lids.rotation.z`) und die Augenlage aus `eyes[]`/Stiel (`eyeFollow`) ohne eigenen Code.
   Die Flags wie bei v6 setzen: `userData.petOverlay = true`, leeres `raycast`, `frustumCulled = false`.
4. Je Bild nach `rig.update(dt)`:
   `cu = (1,30 + e._up.rotation.x) / 1,18`, `cl = (1,30 − e._lo.rotation.x) / 1,18` → `apertureV6(cu, cl)` → `updateClayEyelidSkin`.
   Die Topologie bleibt, nur die Positionen ändern sich. Der Node-Test belegt das für sechs Zustände.
5. Material: die Haut nimmt `e._up.material`. Ist `skin.material !== e._up.material` (etwa nach `reskinLids()`), übernehmen.
   Die E2-Geometrie hat nur `position` und `normal`, kein `uv`. Braucht der Clay-Shader der ToolBox `uv` oder `_CLAYSEED`,
   kommt das Attribut in eine neue Fassung (`clay-eyelid.v3.js`). v2 bleibt unverändert.

## 4 · Lidfarbe je Figur
Die Farbe kommt aus dem Rig bzw. aus dem `makeMat` des Wirts. E2 legt keine Farbe fest.
- Lord Hunky: `eyeHost.lidColour` #147663 · Stiel/Socket R #147763, L #147663.
- Lady Dory: `eyeHost.lidColour` #fb650e = `socketColour`. `eye.baseColor` ist #fca840; das färbt bei Dory nur die Wimpern, und die sind aus.
- **Widerspruch, WS0 entscheidet:** `eyeSocket.lids` sagt »stalk tone × 0,72« (das wäre v6 `_lidColor`). `_work/proof.html` übergibt aber
  `makeMat: () => color: E.lidColour`, also die Stielfarbe ohne × 0,72. E2 folgt in beiden Fällen dem `_up.material`. Die Entscheidung bleibt im Wirt.

## 5 · Passung in der Höhle (Rechnung, noch nicht gemessen)
- E2 Innenfläche 1,012 R, Außenfläche 1,112 R, mit Randwulst (bulge 0,12) bis 1,124 R.
- Ist 1,10 R die Innenfläche der Socket-Schale, steht E2 außen 0,012 bis 0,024 R in die Schale hinein. Das gibt sichtbare Durchdringung.
- Weg A: Auge und Haut gemeinsam skalieren, mit `s ≤ (r_innen − Spiel) / 1,124`. Bei 1,10 R und 0,006 R Spiel ist s ≤ 0,973.
  Die E2-Form bleibt dabei genau die abgenommene, das Auge wird knapp 3 % kleiner. **Vorschlag.**
- Weg B: nur `thickness` senken. Das braucht H ≤ 0,073 R. Bei H < 0,097 R schrumpfen aber Rundung und Lippe mit (`fv` in v2).
  Die Lippe käme dann auf etwa 0,057 R statt 0,075 R. Das ist eine Formänderung gegenüber dem PASS.
- Die Socket-Schale wird nie versteckt, ersetzt oder verdeckt (Rezept: »Do not hide, replace or cover it«).

## 6 · Lid in der Öffnung, Stielansatz
- Lidrand nach EyeRig v6 (Node-Test, Grad von der Blickachse): weit 87,348 · Ruhe oben 55,571 / unten 59,628 · 25 % 46,782 · 50 % 29,880 · 75 % 12,978 · zu 0,060.
- Wenn 58° der Halbwinkel der Öffnung ist und die Höhlenachse auf E2-+Z liegt, dann gilt:
  - Ruhe: oben liegt ein Lidstreifen von 2,4° in der Öffnung, unten liegt der Rand 1,6° hinter dem Höhlenrand.
  - Weit: beide Ränder liegen 29° hinter dem Rand. Das Lid ist ganz unter der Schale, keine Naht.
  - Ab Lidwert c ≈ 0,084 kommt der Rand in die Öffnung.
  - Die Rezept-Emote `lidUpper −0,4` legt den Oberlidrand in Ruhe auf 82,6°. Dann sieht man das Lid erst beim Blinzeln.
  - Die Lidwinkel A (Ruhe 105°, weit 117,9°, zu 80°) liegen immer hinter dem Rand. In der Öffnung erscheinen nur die Randbögen.
- Stiel: Die E2-Haut bleibt geschlossen (χ = 2). Pol und Stielansatz liegen in der Schale. Eine zweite Öffnung oder ein Einstecken
  (`docs/STIELAUGEN_ALIENS.md`) ist für die Aliens nicht nötig. Die Neigung des Auges legt die eingebackene Höhlenachse fest; E2-+Z kommt auf diese Achse.
- Erste Schätzung aus den Rezepten (Knochen-Pivot, nicht der Loft-Ansatz):
  - Hunky: Richtung Auge → Stielpivot 27,7° / 27,4° unter der Waagrechten, 54,1° / 53,3° gegen die Blickachse.
  - Dory: Stiel kommt von fast senkrecht unten (82,7° unter der Waagrechten, 90,6° gegen den Blick).

## 7 · Auf den Alien-GLBs messen (vor dem Bau)
1. Socket-Schale je Auge: Mittelpunkt gegen Augenmitte, Innen- und Außenradius in R, Öffnungsachse gegen E2-+Z bzw. `gaze`,
   Öffnungs-Halbwinkel am inneren Rollrand (der Rollrand 0,075 R kann die sichtbare Öffnung kleiner machen als 58°).
2. Lady Dory: warum `shellRadius` = 1,014 R und nicht 1,10 R.
3. Loft-Ansatz an der Schale: Richtung und Winkel unter der Mitte. Muss hinten und unter der Mitte liegen (Georg).
4. Gewichte der Schale (an `eyestalk.*` oder an `head_part`). Größte Abweichung Schalenmitte gegen Augenmitte über Idle_A und Walking_A
   mit Dangle an, je 25 Bilder wie in der README-Messung. Sonst schneidet das Auge die Schale, wenn der Stiel schwingt (maxDeg 18).
5. Nach dem Einhängen: Abstand E2-Außenfläche gegen Schalen-Innenfläche über den ganzen Lidschlag, Ziel > 0.
   Dazu Pixel-Prüfung: Pupille 0 px bei Lid zu, Lid sichtbar in Ruhe bzw. beim Blinzeln, 0 px Lidrand außerhalb der Öffnung bei weit.
   Ansichten: vorn, ¾, seitlich, oben.
6. Die Netzprüfung (`tests/clay-eyelid-skin.test.mjs`) läuft weiter unverändert. Die Skalierung aus Weg A ändert am Netz nichts.
