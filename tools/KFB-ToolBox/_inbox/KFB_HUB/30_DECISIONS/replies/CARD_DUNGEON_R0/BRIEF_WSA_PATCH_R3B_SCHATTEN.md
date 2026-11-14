# Für WSA Patch (Karten-Räume) · R3b: Schatten im Card Dungeon aus dem Spiel-Bestand · 14.11. (Georg, V-1729)

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:** Umgebung `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`); Figuren, Material und Licht: Proof-Stage-Module. Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:** mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7); dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`; Georg sieht nur Bestandenes.

**Anlass (Georg 14.11., wörtlich):** „(boden)schatten haben wir bei WSA patch auch noch nicht …“ und „auch der restliche schatten ist flackerig und buggy (auf kopf etc)“. Bezug: Card Dungeon R0 auf deiner InfiniteRooms-Site (`?dungeon=r0`).

**Ziel:** Schatten im Dungeon wie im Spiel: weiche Kontaktschatten am Boden unter Figuren, Füßen, Truhen, Säulen und Deckungen, ein ruhiger Sonnen- bzw. Raumlicht-Schatten ohne Flackern und ohne Schattenflecken auf Kopf und Körper der Figuren. Nichts neu erfinden: die Module aus dem Spiel-Repo `georg-doc/KFB-Stunt-Car-Race`, `game/integration-r2` @bed60d284ce303ac57df72b53ad5e15e171a941d unverändert importieren; nötige Anpassungen als Vorschlag mit Begründung zurück.

**Bestand, der das löst:**
- Licht und Schattenkasten: das eine Rig `src/vendor/light/kfb-stage-light.v1.1.js` (V-385, V-392, V-440) mit `fitShadow` – Kasten eng um den Inhalt, Mittelpunkt auf das Texelraster gerastet (kein Flackern beim Bewegen), normalBias und bias aus dem Texel abgeleitet statt fester Zahlen. Je Raum den Kasten auf den aktiven Raum einpassen.
- Kein Eigenschatten auf Figuren (Georg q300): `applyFigureShadow` aus `src/look/terrain3.js` mit `uFigSkip` wie in `src/m1/M1World.jsx` (Werfer nahe an der Figur zählen nicht) – das behebt die Flecken auf Kopf und Armen. Fußschattierung `applyFootShade` aus derselben Datei.
- Kontaktschatten: `src/modules/contactBlob.js` (der eine Kontaktfleck), `src/look/footContact.js` (je Fuß, verblasst beim Anheben), `src/look/kontaktSchatten.js` (Runde je stehendem Objekt, ans Boden-Gefälle geneigt); sie werden ersetzt, sobald das eine Kontaktschatten-Modul aus V-1701 im Stamm ist.
- Schattenrand und Schattenwerfer: `src/look/shadowEdge.js` (weicher Rand des Ausschnitts), `src/look/shadowCull.js` (nur sichtbare Teile werfen Schatten).
- Schatten-Art wie im Spiel-Stand: PCF (V-1729); ein Wechsel zwischen VSM und PCF nur mit Georg (V-643).

**Grenzen:** kein Blob-Schatten als Ersatz für echte Schatten der Werfer (Kanon), kein zweites Licht-Rig, keine eigene Spielschleife, kein Einbau ins Spiel, kein Merge.

**Rückgabe an WS0 als Kommentar in PR #49 (Zweig `wsa/patch-transfer-r1`):** Vorher/Nachher-Bildpaare von vorn oder seitlich (Figur im Raum, Truhe, Säule), je Bildpaar Gate G6: kein heller Spalt zwischen Fuß bzw. Truhen- oder Säulenfuß und Schatten (V-440), ein kurzes Video beim Laufen und Kämpfen (kein Flackern), Liste der übernommenen Module und Vorschläge, Zweig-SHA; danach Live-Stand auf der Site.
