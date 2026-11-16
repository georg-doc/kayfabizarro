Für Claude Design (Chat „Claymation Look & Animations“) · kfb-clay v1.4: v1.1 + Körnung ×3 als Modul · 16.11. (Georg, V-1853)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept (WS0 bestätigt): keine Szene, sondern eine neue Stufe im einen Knete-Modul. An Stelle des Konzeptblatts stehen deine Übergabe und Georgs Wahl ×3 (wie bei v1.2: Modul-Stufen ohne Szene brauchen kein Szenen-Konzeptblatt).

**Kanon (neu, V-1853), Gebiet 8 wörtlich:** „Das eine Modul `kfb-clay` darf ab v1.4 eine Körnungs-Stufe mit einer Normal-Karte nutzen (ambientCG Ground026, CC0, Nennung in `replies/CLAY_REFERENZ_R2/assets/CREDITS.md`), triplanar im Objektraum, ohne UV; nur Profile `character` und `kit-figure`; Schalter standardmäßig aus; Relief bleibt prozedural; Augen, Lider, Brauen, Nase, Mund und Shirt ausgenommen.“ Gebiet 15 (3) nennt dazu die Ausnahme.

**Kern (3 Zeilen):**
1. Georg hat entschieden: v1.1 bleibt, dazu die Körnung ×3 aus deiner Übergabe `replies/CLAY_REFERENZ_R2/AN_WS0_KNETE_KOERNUNG.md`.
2. WS0 hat den Kanon geöffnet (V-1853): Das eine Modul `kfb-clay` darf eine Körnungs-Textur als eigene Stufe nutzen. Kein zweites Modul, das Relief bleibt prozedural.
3. Du baust die Stufe als Modul, weil du den Code aus deinem Prüfstand kennst. WS0 baut sie ins Spiel ein.

**Soll-Referenz (Georgs Wahl ×3, reist mit):** `replies/CLAY_REFERENZ_R2/evidence/combo_gesicht_heute_x1_x2_x3.jpg` und `evidence/combo_ganz_x3_c1.jpg`. Belege und Kritiker messen daran. Zuständigkeit für den Modulbau: V-1853.

**Was du baust:**
- `kfb-clay.v1.4.js` im Ordner `replies/CLAY_SSOT_R1/`: v1.1 byte-gleich übernommen, dazu die Stufe „Körnung“ mit genau den Werten aus deiner Übergabe (Ground026 triplanar im Objektraum, Kachel 1,5 Figurenhöhen, Stärke 0,35; Sprenkel 5 %, Zelle 1,05 %, 30 % dunkler, unter ≈ 1 px aus; OKLab-Verschiebung ±0,14 rad / ±5 %, Flecken 0,22/0,09).
- Die Stufe hat einen Schalter im Modul (Option `koernung`, Standard aus) und blendet mit dem Abstand aus wie die Bänder.
- Sie gilt nur für die Profile `character` und `kit-figure` (die Werte stehen in Figurenhöhen), nicht für `midground`, `background` und den Gelände-Adapter. Die Materialantwort dieser beiden Profile (V-566) ergänzt du um die Körnung.
- Die Karte `Ground026_1K-JPG_NormalGL.jpg` lädt das Modul über eine Adresse, die der Aufrufer übergibt (kein fester Pfad im Modul). Nennung bleibt in `assets/CREDITS.md`.
- Ausnahmen wie heute: Augen, Pupillen, Lider, Brauen, Nase, Mund und Shirt bekommen keine Körnung (SKIP_DEFAULT plus Figurenkarte).
- clayBake bleibt wie heute; die Körnung läuft live.
- Licht: das eine Rig, kein Randlicht, kein Fresnel (V-385). Die Clay-Testbühne `proof-kit.v1.js` bei der Gelegenheit auf `kfb-stage-light.v1.1` umziehen, damit der Nasensaum aus den Belegen verschwindet.

**Prüfung:**
- Unit wie bei v1.2 (Werte, Ausnahmen, Abstands-Ausblendung). Golden G0–G5: ohne `koernung` pixelgleich zu v1.1; mit `koernung` alle Gates außer der Pixelgleichheit grün, besonders G2 (Streifen) und G4 (Auflösung), dazu Determinismus (zwei Ladevorgänge identisch, fester Seed aus der Figurenkarte, V-429) für Sprenkel und Farbflecken. Proof-Stage G1–G7 grün, G6 nach dem Umzug auf `kfb-stage-light.v1.1`.
- FB nur aus der SSOT r1j mit Kanon-Wache (beide Augen, Lider, Brauen, Nase, Mund, beide Ohren, Schwanz); die Extras `userData.kfbClayOrig` beim Laden verwerfen.
- Ein blinder Kritiker-Lauf auf das Stilbild „v1.1 | v1.4 Körnung“ von vorn und aus Spielkamera-Abstand.

**Rückgabe:**
- `kfb-clay.v1.4.js`, Tests und Belege in `replies/CLAY_SSOT_R1/`, RETURN oben in `RETURN.md`.
- WS0 legt das Modul ins Spiel hinter den Schalter `knete14`, nimmt es im Spiel mit Spielkamera und von vorn ab und baut die Hub-Karte für Georg.
