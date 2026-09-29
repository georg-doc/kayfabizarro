# CHANGELOG · 2026-09-27 r2 (seit Cut 27.09. r1)
## Regressen behoben
- Viseme in Rigging › Mouth auch bei Source »Model mesh« (vorher hinter `mode === 'rig'` versteckt).
- »Zu« verschwand: M-Decal = hautfarbene Falte ohne Tuschelinie. Georg: Zu → Neutral. Nur die unberührte Owner-Vorgabe wird umgestellt.
- Bühne liegt nicht mehr unter Dock und Inspektor (Stage endet davor, Dock-Höhe gemessen).
- Clay-Lider: `clay.sync` läuft jetzt NACH `rig.update` (Vertrag clay-lids.v1 Z. 183); Test 27 prüft den richtigen Träger. PASS.
- Mundregler 105–130 ms → 14–29 ms (face-mount.v1: 52 Strahlen gegen ein Hautstück statt den ganzen Kopf, Rückfall auf den vollen Kopf unter 90 % Treffern).
## Parität nachgezogen (v18 · Pet Studio v12 · Animation Lab v1/v3)
- Notes-Schalter gegen Metatext (v18 »Erklärtexte«).
- Rigging: Abschnitte klappbar, Köpfe kleben, Fold all / Open all, gemerkt (v18 V2OPEN0). Kurze Slider-Labels, voller Text als Tooltip.
- Studio › Face: »Shape for X« (Visem → eines der 13 Decals).
- Eigene Emote-Werte je Ausdruck speichern, ★, Back to contract, Export/Import `emotes`.
- Animation Studio: Front · Side · ¾ · Back · Reframe · Grid · Sheet · Restart · Clip-Leiste mit Gruppen-Auswahl.
- States: 24 Spielzustände auf echte Clips (anim-map.v1), Klick spielt, Overrides ★, Export Map JSON + MISSING.md.
- Strip · 8 frames (auf die Figur zugeschnitten, PNG).
- Clip-Sheet: Clips der Gruppe als 4-Frame-Loops (max. 48).
- Loco: Jump chain · Jump full · Trail.
- Motion-Profil Export / Import (`kfb.motion-profile/1`, mit State-Overrides).
## Selbsttest neu
21c · 21d · 21e · 21f · 26b. Gesamt 33/33.

## WSA Intake · 2026-09-27
- `zipcheck.py` erstmals ausgeführt: PASS.
- Frischer HTTP-Kaltstart und vollständiger Browser-Selbsttest: 33/33 PASS, 0 Errors, 0 Warnings.
- Test 22 macht die gemessene Augenabstandsbewegung jetzt innerhalb des tatsächlichen Profilbereichs; dadurch kein falscher FAIL bei einem Ausgangswert nahe `max`.
- Früher Boot-`TypeError` beseitigt: die erste React-Ausgabe nutzt vor Initialisierung des Animationsruntimes einen inerten lokalen Zustand.
- Status von `GEORG ACCEPTANCE PENDING` auf `TECHNICAL INTAKE PASS · PROCEED PASS · OWNER ADOPTION NEXT` präzisiert. Keine Live-/Stage-Promotion behauptet.
