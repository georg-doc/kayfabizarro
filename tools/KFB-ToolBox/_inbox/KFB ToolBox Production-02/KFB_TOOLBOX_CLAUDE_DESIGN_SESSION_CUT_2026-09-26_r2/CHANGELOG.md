# CHANGELOG (additiv, neueste oben)
## 2026-09-26 r2 (abends)
**Shell / UI**
- Untere Leiste »ohne Klick da« nach v18 V2BOTTOM: Emotes · Viseme (+ Talk · Grin · Pout · Rest) · Anim (Idle · Walk · Run · Jump · Eat · Dance · Pos · Neg). Sie steht in Studio und Rigging, im Animation Studio oben im Dock. Pets spielen die pet-library-Trigger, Bipeds die Rolle aus State, sonst den ersten passenden Clipnamen.
- Die redundante untere Werkzeugleiste (Studio: Move/Rotate/Scale/Drop/Snap · Rigging: Face cam/Dots) ist entfernt. Das Objektmenü des Edit-Layers hat dazu Snap ⌗ und Reset ↺ bekommen. »Dots« steht jetzt in der Kamera-Leiste.
- Der Reiter »Animation Lab« heißt jetzt **Animation Studio** (schmal: »Anim«).
- Jede Reglerzahl ist klick-editierbar: Enter, Esc, ↑↓, Shift ×10, geklemmt auf den Bereich.
**Rigging › Face**
- Studio-v18-Parität: Brauen turn/pitch, gemalte Teile Lean/Turn/XYZ, Mund yaw + slope, Blink, Life, Emotes, Kinetik (Test), Blick folgt Cursor, converge. Cube Pets im Rigging über `face-mount.v1#mountPetFace`.
- Brauen XYZ-Skalierung · **Brauen-Leben** (Schweben, Blick-Folge, Sakkaden-Zucken, Blinzel-Dip, Reaktionen; Stärke/Tempo/Asymmetrie), gezeichnet UND gemalt.
- Lider (`clay-lids.v1` → Schema 0.2): **Auto-Fit** auf die gemessene Sklera (Mitte, Halbachsen, Iris/Pupille-Überstand) · Mechanik **Glide · contact** / **Fold · clamshell** · Stil Shell (EyeRig) / Thin shell / Clay volume · Kontaktlinie · Ecken · volle Schließung. Slant ist normalisiert (»Slant drift« 0 = sauber gespiegelt).
- Talk mit gemaltem Mund: der Rig-Mund springt beim Sprechen ein.
**Rigging › Ears (neu)** · Dangle 0…2 + Presets, Feder, Kräfte, Pose, Platzierung (Abstand, vor/zurück, Höhe, Einstecktiefe), Basis-Drehung. `kfb-lib/ear-base.v1.js` setzt einen Basis-Knochen ein, damit die Ohrwurzel mitgeht.
**Rigging › Body (neu)** · `kfb-lib/body-shape.v1.js`: Dicke Torso/Arme/Beine · Bein-/Torso-Länge · Höhe · Presets, in funktionalen Grenzen.
**Rigging › Import · Export** · Import zuerst. Er geht auch ohne Face-Host (Ohren, Body). Export trägt ears und body mit.
**Schatten** · Frustum auf den Darsteller zugeschnitten und aufs Texelraster eingerastet, Map bis 4096, normalBias 1,5 Texel, dünne Overlays werfen nicht. Regression behoben: DoubleSide-Körper werfen wieder Schatten. `docs/LESSONS_SHADOWS.md` + Projektregel (docs/PROJECT_RULES.md).
**Doku** · `docs/PET_STUDIO_FEATURE_MAP.md` (vollständiges v18-Mapping, Schwundformen, V18+, Sprintplan S1–S8).
## 2026-09-26 r1
Orbit frei · Lip-sync 13 Decals · Ruhe-Münder · partrig-Spannen · Lid-Schalen + Clay-Lider (PR #159) · Haare · Blender-Briefing v2 · Selbsttest 27/27.
