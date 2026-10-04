# RETURN · ToolBox Production-06 · Knete für Figuren + Kontaktschatten · 30.09.2026

**Datei:** `KFB ToolBox Production-06.dc.html` (05 bleibt unverändert, eigener Speicher-Schlüssel, einmal aus P05 übernommen).

## 1 · Knete · K2 für Figuren (Studio › Body › Material)
- Dritte Familie in `kfb-lib/body-surface.v2.js` (v1 + Knete). Es gibt weiterhin nur einen Eigentümer für die Material-Slots, keinen zweiten Deformer.
- Quelle ist die K2-Basis aus dem Joyride-Cut 29.09.: `kfb-lib/clay/clay-material.v10.js`, `clay-relief.v4.js` (Werkzeuge), `clay-relief.v2.js`, `clay-profiles.v2.js`, `clay-toolmix.v1.js`, `Fingerprints01_3K.png` (CC0, H0 `external/`).
- Profil `figure`. Das Handmaß richtet sich nach der echten Größe des Darstellers: H0 hatte bei einer Figur von 1,2 Einheiten ein Handmaß von 0,5; FB Ear Rig v5 ist 2,86 Einheiten groß, daraus folgt Handmaß 1,19. Werkzeugmischung `KNETE_MIX.figure` / `.face`, nach Auge gesetzt.
- **Georg 30.09.:** Brauen (auch die dicken Blockbrauen), Nase, Bart und Ohren bekommen Knet-Rillen. Augen, Lider, Pupillen, Mund und Zähne bleiben glatt. Die Gesichtsteile kommen vom Face-Owner, `sync()` prüft sie alle 20 Frames nach, weil die Owner ihre Geometrie neu bauen.
- Die Rillen hängen an der Ruhelage (`clayRest`). Sie kleben an der Haut und wandern nicht mit, wenn sich Brauen oder Mimik bewegen.
- **Befund:** Die H0-Handspurkarte (`uClayLegacyStroke`) erzeugt auf kleinen runden Teilen Querstreifen, deutlich sichtbar an der Nase. Das ist derselbe Befund wie in K2, deshalb ist sie standardmäßig aus und bleibt als Schalter erhalten.
- Regler: Knet-Stärke, Knet-Größe, Gesichtsteile an/aus, Fingerabdrücke, Handspuren. »Surface scale« wirkt bei Knete als Faktor auf das Handmaß: Character ×1, Midground ×1,8, Large object ×3.
- Die Werkzeugkarten werden einmal pro Seite gebaut (≈ 4,5 s CPU, gemessen). Solange läuft das Original-Material weiter.

## 2 · Kontaktschatten Kopf/Hals (Studio › Body › Contact shadow)
- `kfb-lib/contact-ao.v1.js`. Die helle Naht ist **kein Bias-Fehler**, es fehlt die Verdeckung, wo ein Teil in einem anderen steckt (Joyride F2, `aoNote`). Das Schattenrezept aus LESSONS_SHADOWS war in P05 schon umgesetzt.
- Das Ergebnis wird in Vertexfarben gebacken und kostet pro Frame nichts. Der Kopf mit Ohren, Nase, Haaren und Bart dunkelt alles ab, was unter ihm liegt. Der Rumpf dunkelt nur die Kopfunterseite ab. Arme und Beine dunkeln nichts ab, sonst entstünden Streifen, sobald sie sich bewegen.
- Welche Gruppe ein Teil bekommt, entscheidet sein eigener Name. Teile ohne sprechenden Namen übernehmen die Gruppe vom nächsten Knochen darüber, z. B. die Nase vom Kopfknochen. Wrapper wie »FrizzleBob Ear Rig v5« entscheiden nie mit, sonst wäre alles »Kopf«.
- Standard: Stärke 0,8, Reichweite 2 × 3,5 % der Höhe. Gesetzt in der Seitenansicht Kopf/Hals von FB Ear Rig v5. Backen ≈ 0,5 s, in Scheiben geschnitten, die Seite friert nicht ein. Nach jedem Body-Shape-Regler wird automatisch neu gebacken, außerdem gibt es einen Knopf »Rebake«.
- Grenze: Gebacken wird in der aktuellen Pose. Neigt sich der Kopf stark, stimmt die Naht nur ungefähr.

## Offen
- Georgs Bildurteil zu Stärke und Größe der Knete, besonders bei den Brauen: Sie sind dunkel, die Rillen lesen dort schwach.
- Cube Pets bestehen aus einem einzigen Mesh. Dort gibt es keine Paare, also auch keine Kontaktschatten.
- Resident Atlas / WSA: Beide Libs sind Eigentümer-Module mit `dispose()` und können dort genauso eingehängt werden.


## 30.09. · FB-EYE-SOCKET-CLAY-LIDS-01 + nose shadow
- **Seat:** `eye.socket = 'surface'` (face-mount `socketEyes`): S on CharacterTemplate_Head along the view axis, n = area-weighted normal within 1.2 R, hinge = up × n, oval tilt about n, C = S − n·R·(0.24 + inset·1.15). Measured 28.8°/28.9° out, 11.5°/11.4° up (Blender: 28.9° / 11.4°). `legacy` = unchanged build. `eye.splay` stays as extra on top; new `eye.turnL` / `eye.turnR` turn each eye further out (°). Pupils: node `kfb-pupil-free` cancels the socket rotation → gaze stays head-forward. `eyeFrame()` still reports the legacy position, so brows and nose do not move.
- **Lids:** `clayLids.mech = 'hinge'` (clay-lids `hingePositions`), start values from START_HERE as sliders `hOpenU/hOpenL/hSeam/hOverlap/hCurve/hCurveLo/hThick/hBead/hSpan/hTaper`. Receive shadows, cast none.
- **Acceptance 1–7** (button in Rigging › Eyes › Hinge): 1 corners −0.09…−0.10 R, Δ ≤ 0.012 R · 2 corner gap 0 · 3 0/2836 rays · 4 min clearance 0.0043 R · 5 = unwrapped build (float noise only) · 6 Δ 0.098° · 7 eyeFrame/brow/nose/mouth Δ < 1e-15. Screens: `screenshots/review_socket_before_after.png`, `screenshots/review_hinge_lid_states.png`.
- **Nose shadow:** contact AO from the nose/moustache is now its own class: `face` 0.15, `faceReach` 0.3 (sliders in Studio › Body › Contact shadow). The mouth receives no shadow.
- **Open:** the painted mouth `FB_Mouth_Smile` sticks out past the cheek in the ¾ view, and its soft decal edge reads as a grey smudge. That is placement or texture, not shadow (Rigging › Mouth › Depth / Wrap). Checked with alphaTest 0.25: most of the smudge goes, a fringe stays. Not applied.
