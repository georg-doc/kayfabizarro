# HANDOVER WSA · Joyride J10

## Aktueller Kandidat
`KFB Joyride J05 · Knet-Racer.dc.html` → lädt `lab-drive/joyride-drive.j06.js` (Stand „J10“) · Rezept `lab-drive/joyride.j06.json`

## Was hält (Georg: „Fortschritt“)
| Baustein | Modul | Herkunft |
|---|---|---|
| Welt | `lab-track/track-look.v5.js` (T4, TD03, K2, M2, Übergänge, Clay-VFX) | T4 unverändert, additiv: Innenleben lesbar, `hooks`, Kamera `extern`, `st.fast`, LEAN-Dichte-Schalter (`window.__KFB_T4_LEAN`, ohne Schalter = alter Bau) |
| Fahrphysik | `lab-drive/kfb-drive.k2.js` | Race v0.8 FLOW/FEEL aus KFB-Stunt-Car-Race · Cologne Option C-3 `lab-v9/cologne-play.v1.js stepDriver`, Zahlen unverändert; KFB-Zusätze: Streckenrahmen, Spurhilfe, Knetgummi-Bande, Flug + Landehilfe, Q/E korrigiert |
| Kamera | in `joyride-drive.j06.js` | Verfolger auf der Streckenschiene (Verfahren `railClamp`), Looping-Rolle (Georg: gut), freie Orbit (Maus ziehen/Rad, Doppelklick zurück) |
| Leistung | `lab-drive/lean-pass.l2.js` | Kacheln für Culling, dünn wirft nicht, Sheen aus; T4-Dichte halb |
| Schatten | `lean-pass.l2.js makeShadowFollow` | Kanon `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md` (PR #290): Follow, Texel-Snap, normalBias 1,2 × Texel. **Beschattung hält, Kontakt-Naht nicht** (siehe FIXES) |
| Gelände | in `joyride-drive.j06.js` | rollendes Knet-Höhenfeld, T4-Deko aufgelegt |
| Autos | KayKit City Bits ×5 in K2-Knete, Räder gemessen | Kontaktbogen Stadt |
| Tafeln | `bb-scene.js` B0 (Karte / PD-Still / Cover) als Holz-/Pappaufsteller | Billboard B0 (abgenommen 24.09.) |
| Clay-VFX | an Hinterrad-Aufstandspunkten, Bande, Landung | `lab-vfx/clay-vfx.v1.js` Profile |

## Geteilte Dateien (nicht ohne Blick auf die anderen Konsumenten ändern)
`lab-track/track-look.v5.js` · `lab-track/transition-atlas.v1.js` (Hooks nur mit LEAN-Schalter) · `lab-clay/*` · `bb-scene.js`

## Gemessen (Preview, gedrosselt)
Laden ~12 s · 2,4 Mio. △/Bild · 14–30 fps · J02 lag bei 7,6 Mio. △ / 3 fps.

## Ein nächstes Tor
**FACADE-A/B-01**: K1-Standalone und J05 nebeneinander, gleiches KayKit-Haus, gleiche Kamera, gleiches Licht; K1-Hauspfad (`clay-catalog.v5 clayify` + `clay-material.v8` + K1-Uniforms) unverändert übernehmen; erst danach Kosten trimmen. Abnahme nur mit Pixelaufnahmen Quelle | K1 | J05.
