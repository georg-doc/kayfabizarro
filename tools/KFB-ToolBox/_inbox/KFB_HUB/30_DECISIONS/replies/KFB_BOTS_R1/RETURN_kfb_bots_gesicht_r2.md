# KFB Bots · Gesicht r2 (Start-Einträge) · RETURN (WSB, 18.11.2026 spät)

**Auftrag:** Georg im Chat zu den Gesichtern. Am X Bot (männlich) sind die falschen Brauen („angeschnittene Tubes“), er bekommt Blockbrauen; der Y Bot (weiblich) behält seine. Die Brauen stecken teils im Kopf. Die Münder sind sehr klein. Die Lidränder stehen mit Abstand vom Augapfel, die Augen sitzen nicht sauber.
Georg stellt das Gesicht danach im Studio selbst fein; das hier sind die Startwerte.

## Ursache Lidabstand
- pet-eye-rig v6 baut die Lider als Kugelschalen mit fast demselben Radius wie der Augapfel (R · 1,01).
- Bei `inset` 0,4 setzt face-mount die Augenmitte R · (0,24 + 0,4 · 1,15) = 0,70 R hinter die Haut. Die Haut schneidet dann Augapfel und Lider an verschiedenen Stellen, und die Lidränder stehen mit Abstand.
- Mit `inset` 0 (wie FrizzleBob) liegen die Lider eng am Augapfel.

## Geändert (`toolbox/q_*bot.kfb-pets.json`, meta.r2)
| | X Bot | Y Bot |
|---|---|---|
| eye.inset | 0,4 → 0 | 0,4 → 0 |
| Brauen | Blockbrauen: die 3D-Brauen der KayKit-Figuren wie bei FrizzleBob (`Carl_Brow_L/R`), parts.brows = original | Tube bleibt, lift 0,3 → 0,45 |
| mouth.size | 0,5 → 0,8 | 0,5 → 0,8 |
| source.glb | r1c → r1e (= r1d Verschleiß + Blockbrauen) | r1c → r1d |

- **Mund:** Bei 1,0 wird er auf X Bots schmalem Gesicht zu hoch, weil sich das Decal um die Rundung legt. 0,8 ist der Kompromiss. Für einen breiteren Mund bräuchte X Bot eine breitere Gesichtsfront (Kopf anpassen oder anderen Kopf nehmen, Georgs Entscheidung).

## Blockbrauen X Bot (Körper r1e)
- **Was:** Georg im Chat, die Blockbrauen sind die 3D-Brauen der KayKit-Figuren, die auch FrizzleBob als schwarze Brauen trägt. Ein erster Versuch mit flachgedrücktem Balken (brow-rig, round 0,45, cap 0) war falsch.
- **Übernahme:** `Carl_Brow_L/R` aus `FB_TEMPLATE_LOOK_v5b.glb` (65 Ecken je Braue, Farbe wie FB), unverändert übernommen. Skript `scripts/bot_blockbrauen.py`, Bericht `data/q_xbot_blockbrauen.r1e.json`.
- **Sitz:** Maßstab = Bot-Ankerabstand / FB-Brauenabstand × 1,5 (0,22), Mitte am Anker `KFB_Brow_L/R_anchor`, 35 % der Tiefe vor der Stirn, Eltern = Kopfknochen.
  - Bei Faktor 1,0 waren sie zu klein und halb hinter den Augen.
- **Einstellbar im Studio:** face-mount findet sie über den Namen (`ORIGINAL_NAMES.brows`), Georg stellt sie über `original.brows` ein (scale, spread, lift, depth, tilt, yaw).
- **Körper:** `_privat_kauf_asset/KFB_q_xbot_facemount.r1e.glb` (r1d + 2 Brauen-Meshes, sonst gleich).

## Geprüft
- **Bühne:** WS1s Abnahme-Bühne (vfx-buehne @a9432e0f), Körper r1d. Die Werte wurden per Routing im Bühnen-Bündel ersetzt, je Ersetzung genau 1 Treffer.
- **Varianten:** A jetzt, B Tiefe 0, C Tiefe 0,2 + Block + Mund 0,8, D Tiefe 0 + Block + Mund 1,0, E = geliefert.
- **Ergebnis:** beide Darsteller OK, 0 Fehler.
- **Belege** `belege/gesicht_r2/`:
  - `BOTS_gesicht_vorher_nachher.jpg`;
  - Variantentafeln X und Y;
  - Nahbilder X 35° und Y −35°.
- **Skript:** `scripts/bot_gesicht_buehne.mjs`, Daten `data/gesicht_r2_*.json`.

## Für WS1
- Der Bühnen- und Spielweg liest den Start-Eintrag über `botCast.js` (Glob auf `toolbox/q_*bot.kfb-pets.json`). Die neuen Werte greifen nach dem Push ohne Code-Änderung.
- Der Körper bleibt r1c, bis `botCast.js` auf X r1e und Y r1d zeigt. Ohne r1e fehlen dem X Bot die Brauen-Meshes; parts.brows = original zeigt dann keine Brauen. Deshalb Eintrag und Körper zusammen umstellen.

## Nachtrag r2b (Georg, 18.11. spät)
- **Münder vorerst aus:** `parts.mouth = off` in beiden Einträgen. Das Decal wirkte am schmalen Gesicht abgeschnitten. Die Werte `mouth.*` bleiben als Rückweg.
- **Pupillen zu hell:** Die Farbe ist schon fast schwarz (#070707). Grau macht sie der Klarlack des EyeRig-Materials (clearcoat 1, clearcoatRoughness 0,11, envMapIntensity 1), weil er den hellen Himmel spiegelt. Im Eintrag ist das nicht einstellbar.
  - **Probe zur Laufzeit,** nur für das Bild: clearcoat 0,25, clearcoatRoughness 0,35, envMapIntensity 0,2, roughness 0,6. Damit sind die Pupillen tief schwarz mit weichem Glanzlicht. Beleg `belege/gesicht_r2/X_ohne_mund_pupille_matt_probe_35.jpg` gegen `X_ohne_mund_35.jpg`.
  - Eigentümer der Änderung ist EyeRig bzw. WS0. Georg will das global für alle Figuren, siehe Kanal (105).
- **Belege:** `BOTS_ohne_mund_pupille_vergleich.jpg`, `X_ohne_mund_35.jpg`, `Y_ohne_mund_-35.jpg`.
