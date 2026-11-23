# KFB SOP · Äste R1 (23.11.2026, V-2100)

Stamm: `KFB_SOP_R1.md` (aktuell Version R2). Referenzen von außen: `KFB_REFERENZEN_R1.md`.
Jeder Auftrag nennt die Äste, die gelten. Jeder Ast hat dieselbe Form: **Regeln** (das Wichtigste, mit Quelle), **Golden** (so soll es aussehen), **Anti** (so nie), **Gate** (Prüfung im Code), **Lücke** (was noch fehlt).
Die Karten verweisen auf bestehende Dokumente und schreiben sie nicht neu. Bei Widerspruch gilt das Dokument mit der höchsten V-Nummer. Ein bekannter Widerspruch steht hier als „Klärung“.

Pfade: `R/` = `replies/`, `C/` = `CANON_3D/`, `T/` = Spiel-Repo `test/`, `O/` = Spiel-Repo `docs/`, `M:` = WS0-Gedächtnis.

## 1 · HUD und Interface
- **Regeln:**
  - `R/HUD_BELEGUNG_R1.md` (V-1035/1038), `R/HUD_LAYOUT_R3.md` (V-681), `R/HUD_UX_STATES_R1.md` (V-673/674), `O/hud-kit/HUD_SKIN_SPEC.md` (V-1419).
  - Kit-Teile 1:1 und nie über Originalgröße, kein Teil in fremdem Zusammenhang.
  - Positionen bleiben, außer Georg sagt es.
  - Flyouts ohne Überschrift und ohne X, Klick daneben schließt.
  - Diegetisch, aus dem Master-Kit.
  - Erst nachsehen, was definiert ist (HUD_BELEGUNG, Register).
- **Golden:**
  - `R/HUD_PROTOTYP_R1/` (V-2005).
  - `R/HUD_MIN_R14_EINBAU/` (Zustände h1–h4).
  - `R/HUD_PERGAMENT_R1/` (q773).
- **Anti:**
  - `R/POSTMORTEM_HUD_AKTIONSLEISTE_R1.md` (V-1519).
  - V-1379/1381/1400 (Vorhang, Plakette, Flickenteppich).
  - V-2004/2005 (q797/798).
  - Aqua r50: leere Fassungen, verzerrte Pille.
- **Gate:**
  - `T/hud-fit-r14.mjs`, `T/hud-skins-r1.mjs`, `T/_hudvorlage.mjs`.
  - Handwerks-Gate Kit-Teile (Stamm §4 B).
- **Hub-Karten:** Frage, 1–2 Sätze, Bild. Optionen = Bildbeschriftungen. Bewegung als Video. Keine Suchbilder.

## 2 · 3D, Material, Licht
- **Regeln:**
  - `C/CANON_3D_R1.md` (V-563; Tier-0-Zeilen in jeden Auftrag).
  - `R/LIGHT_MODEL_R2.md` (ein Rig, ein Tonweg, V-382/385).
  - `R/COLOR_CONCEPT_R1.md`.
  - `D/STYLE_GUIDE_3D_R1.md` (Hintergrund).
  - Clay im Vordergrund, realistischer Hintergrund (V-1171).
  - Keine gemalten Glanzpunkte.
  - Gerade gegen Rund auf jeder Größe.
  - Bilder fertig zusammensetzen, nicht neu beleuchten.
- **Golden:**
  - `R/CLAY_SSOT_R1/golden.v1.4.html` (V-1839/1853).
  - `R/CLAY_LICHTKANTE_R1/`.
  - `R/LOOKCAL_R2/gold_*.png` (V-1544).
  - `R/E2_REFERENCE/E2_approved_closed_lid_skin.png`.
  - Joyride J17 als Gesamt-Look-Maßstab.
- **Anti:** `R/KONTAKT_AO_R1–R4` (geparkt).
- **Gate:**
  - `C/CRITIC_3D_R1.md`.
  - `C/test/bpy_gate_smoke.py`.
  - Proof-Bühne `R/PROOF_STAGE_R1/` (Clay, Licht, Augen).
  - Hub-Bild-Gate.

## 3 · Szenenkomposition und Welt
- **Regeln:**
  - `C/KONZEPTBLATT_R1.md` (V-561: keine Szene ohne Konzeptblatt und Kritik).
  - `R/SPEC_SCENELET_R2.md`.
  - `R/KONZEPTBLATT_KFB_PLACE_R1.md` mit `C/lib/kfb-place-*.mjs` (V-748/749).
  - `R/MENTALES_MODELL_WELT_R3.md`.
  - `R/SPEC_PLACEMENT_GRAMMAR_R2.md`.
  - `C/sources/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` (Erdung, Komposition).
  - `R/TRANSITION_INTENT_R1.md` (Speckle-Übergänge).
  - Jedes Objekt hat eine Geschichte.
  - Steine folgen der Fußkontur, nicht radial.
  - Pop-ups sitzen, sinken nicht.
  - KayKit als Zonen, nicht als Streugut.
- **Golden:**
  - `R/DIOBODEN_R1/` (q648/649).
  - `R/LOOKCAL_R2/`.
- **Anti:**
  - V-1561-Linie (Dioramen nach Messwerten).
  - Radiale Sternlinien.
- **Gate:** `T/design/props-gate.mjs`, `kit-gate`, `viertel-gen-gate`, `T/dioramen-naht.mjs`.
- **Klärung:** Die 10 Konzeptblätter in `65_SCENELETS/` sind R1 vom 20./21.10. Sie sind vor Clay v1.2 und V-1887 entstanden. Vor neuer Nutzung werden sie geprüft.
- **Lücke:** Kaum freigegebene Diorama-Bilder.

## 4 · Regie, Kamera, Belege
- **Regeln:**
  - `R/BELEG_STANDARD_R1.md` (V-1609).
  - Eine Bühne für Abnahmen (V-1887, Kampfbühne `T/lib/buehne.mjs`, Konzept `R/KAMPFBUEHNE_R1/`).
  - Die Proof-Bühne `R/PROOF_STAGE_R1/` ist Werkstatt für Blender-Look.
  - Kameras nur von vorn oder von der Seite, nie von hinten.
  - Feste Presets relativ zur Blickrichtung von FB.
  - Spiel-Look in jedem Beleg.
  - Fahrkamera 12°.
  - Genre-Grammatik nennen, zum Beispiel Produktfilm: Hero, Drehteller, Scan, Makro, Kamerafahrt.
- **Golden:**
  - `R/HERO_RUN_SHOTLIST_R1.md` (Referenz).
  - Abnahmelauf `R/ABNAHME_S01/`.
- **Gate:**
  - `T/lib/beleg.mjs` (belegVideo: eine Kamera für alle Belege).
  - `T/lib/fbKanon.mjs` (vor jedem FB-Beleg).
- **Lücke:** Kein freigegebener Satz „so sieht ein guter Beleg aus“ (Bild/Video). Wird mit dem nächsten PASS-Beleg angelegt.

## 5 · Cartoon-Animation, Mimik, Augen
- **Regeln:**
  - `ANIMATIONSBIBEL_R1.md` (V-919, maßgeblich; `MOTION_GUIDE_R1.md` ist älter).
  - `R/AUSDRUCK_R1/MENTALMODELL_BRAUEN_AUGEN_R1.md` und `ACTING_KATALOG_R1.md` (V-1785/1833).
  - Avery-Stufen fein, cartoon, extrem. Eye-Pop nur extrem.
  - Bewegung aus vorhandenen Clips (Motion Library, KayKit, Mixamo), keine eigenen.
  - Auswahl und Vorschau auf Extremposen Ausholung und Aufprall.
  - Keine Gliedmaßen im Körper.
  - Augen über den Augen-Pfad. Der Host ruft `setState('rest')` und `update(dt)`.
- **Golden:**
  - `R/AUSDRUCK_R1/a*.jpg`, `R/KAMPF_MIMIK_R1/q644`.
  - `R/MOTION_BLOCKS_KAMPF_R1/*.mp4` (V-1903).
  - `R/IDLE_R1/`, `R/LAUFSTUFEN_R1/`.
- **Anti:**
  - V-1783 (q683, Brauen heuristisch).
  - `R/KRITIK_KAMPF_ANIM_R1/BERICHT.md`, `R/BLINDE_KRITIK_R2_ANIMATION`.
- **Gate:** `T/limbClip.mjs`, `T/anim-takt-audit.mjs`, `T/_ausdruck-blatt.mjs`, `T/fb-canon.mjs`.
- **Lücke:** Kein als PASS markierter Golden-Clip-Satz. Ihn bilden die nächsten Abnahmen.

## 6 · VFX, Treffer, Zerstörung
- **Regeln:**
  - `R/KRATER_MENTALMODELL_R1.md` (V-862/863).
  - `C/sources/ETHERINGTON_ZERSTOERUNG_R1.md`.
  - `R/KAMPF_VFX_R1/VFX_ART_DIRECTION_R1.md` und `BENCHMARK_HANDWERK_R1.md` (V-1508: Profi-Benchmarks, keine selbst gebauten VFX-Formen).
  - `R/VFX_VIDEOS_R1/TREFFER_GRAMMATIK_R1`.
  - `R/SPEC_CARTOON_VFX_SHAPES_R1.md`.
  - Zuerst ein physikalisches Modell, daraus 2–3 getimte Effekte am selben Objekt.
  - Effekt nur, wo sich etwas berührt, und er fliegt mit der Kraft.
  - Komponieren statt maskieren.
  - Treffer, Kollision und Tod als eine Kaskade im Rezept-Format.
  - Visceraler Cartoon-Wrestling-Stil, kein erzwungenes Papier oder Tusche.
- **Golden:**
  - Krater (`75_REFS/crater_golden_r1`).
  - `R/ENDE_KASKADE_R1/` (V-1875/1876).
- **Anti:** V-1896 (Schmelzen aus Würfeln), V-1621, V-1904.
- **Gate:** `T/design/crater-gate`, `fracture-gate`, `T/_ende-gate.mjs`, Treffer- und Kaskadenrezept-Tests.
- **Klärung:** Combat-VFX baut der Stamm bzw. WS0. WSA veröffentlicht nur (V-2019 ersetzt V-1520).
- **Lücke:** Aus `O/vfx/VORBILDER_R1.md` ist noch kein Treffer- oder Explosions-Golden gewählt.

## 7 · Ton und Musik
- **Regeln:**
  - `R/AUDIO_ROUTING_R1.md` (V-841, ein Audio-Owner).
  - Sound-Atlas zuerst, ElevenLabs für echte Lücken (V-1989). Erzeugt wird durch WS0 über das vorhandene Skript, bis Georg „eng“ sagt.
  - `R/SUNO_SSOT_R1.md` (V-689) und `R/SONG_SPEC_R3.md`.
  - `R/MUSIK_UEBERGAENGE_R1.md`.
- **Golden:** `R/ARENA_TON_R1/*.mp4`, `R/BODENTON_R1` (alt/neu).
- **Gate:** `R/song_gate.py`, `T/_ton-bestand.mjs`, A/B-Hörbelege.
- **Klärung:** Der Merksatz „WS0 macht SFX“ und V-1989 widersprechen sich nicht. Die Reihenfolge ist Atlas, dann ElevenLabs.
- **Lücke:** Keine freigegebene Referenzmischung.

## 8 · Text, Stimme, Dialog
- **Regeln:**
  - Texte nie aus dem Nichts (V-2098). Quellen sind Georgs Zeilen, Kartentexte und Golden Samples.
  - `R/TRIPLET_SSOT_R1.md` (V-698) und `R/TRIPLET_SET_SPEC_R2.md` (Form nach V-700).
  - `R/BNWN_TON_R1.md`.
  - `R/SPRECHBLASEN_SSOT_R2.md`.
  - `R/VOICE_CASTING_R1.md`.
  - HeyGen:
    - offizielle Audio-Tags;
    - keine getippten Pausenlängen, eine Szene je Clip;
    - eine Einfüge-Box;
    - Kennungen nur in einer Tabelle.
  - Spieler geschlechtsneutral ansprechen.
- **Golden:**
  - `R/META_TEXTE/GOLDEN_SAMPLES_AQUA_R1.md`.
  - `T/ref/V204_plain_bubble_reference.jpg`.
- **Anti:**
  - `R/META_TEXTE/ANTI_SAMPLES_R1.md` (Falkenstein).
  - `fail_lauf_A_5.jpg` (Sprechblasen).
- **Gate:**
  - `R/triplet_set_check.py`, `T/chatter.mjs`.
  - Blind-Text-Kritik (ein Slop-Marker = FAIL).

## 9 · Metanarrativ und Kanon
- **Regeln:**
  - `R/SLOP_METANARRATIV_R1.md` (V-1483), `R/META_NARRATIVE_R1.md` (V-294/295).
  - `R/CHARACTER_SSOT_R2.md` und `CHARACTERS_R1/` (V-1611).
  - Würfelmonster sind Schöpfungen von Hunky und MiB (V-1705).
  - Aqua-Metanarrativ (V-2050).
  - **Auffangen statt basteln:** Eine bekannte technische oder gestalterische Schwäche geht als Vorschlag an Georg, sie metanarrativ zu framen (Kayfabe, Glitch, Alpha/Omega). Sie wird nicht verdeckt.
- **Golden:** Golden-Sample-Slops (V-1485, PR #469).
- **Lücke:**
  - Normalisierungsamt, Hunky & Dory und BNWN haben keine Golden-Beispiele.
  - Das Regiebuch der Buchmaschine (`R/buchmaschine/REGIEBUCH_BUCHMASCHINE_R1.md`) ist nicht freigegeben.

## 10 · Beschaffung (Use What Works)
- **Regeln:**
  - Leiter im Stamm §2a.
  - Kit-Assets unverändert (V-574).
  - Quellen-Vorrang KayKit > Tiny Treats > Quaternius > Kenney.
  - Zuerst die 3D-Suche (mcp 3d-assets), dann Asset-Librarian und patch.gg.
  - Keine selbst gebastelten Requisiten (V-511).
  - Ein bezahltes Pack nur nach Georgs Ja.
  - Keine Lizenz-Floskeln.
  - Meshy erst bei echtem Bedarf mit Georgs Freigabe (V-2099, `R/TOOLS/MESHY_MCP_WORKFLOW_R1.md`).
  - Fünf Werkzeug-Orte (`R/TOOL_MAP_R1.md`, V-390).
- **Gate:** `tools/package_check.py`, `tools/brief_gate.py`.

## 11 · Spielschleife, Kampf, Waffen
- **Regeln:**
  - `R/GAME_LOOPS_R1/SPIELSCHLEIFEN_R1.md`.
  - `R/SPIELMODI_R1.md` (V-1665).
  - `R/WEAPON_GRIP_MODELS_R1.md` und `O/konzepte/WAFFENHALTUNG_R2.md`.
  - `O/waffen/WAFFENKAMMER_R1.md`.
  - Waffen-Standard R1 (Anker `KFB_Grip_R/L`, `KFB_Head`).
  - Jede Waffe hat eigene Farbe, und die VFX-Farbe folgt dem Meta-Typ.
  - I ist die einzige Interaktionstaste.
  - Begegnungs-Taktung.
- **Golden:** `R/WAFFEN_NACHWEIS_R1/`, `O/*-reference-r1/`.
- **Anti:** `R/GAMEPLAY_CRITIC_R1.md` (V-825).
- **Gate:**
  - `T/waffenHalt.mjs`.
  - Referenz- und Video-QA je Waffe.
  - `T/combat-cascade*.mjs`.
- **Lücke:** Kein freigegebener Golden-Gameplay-Clip.

## Pflege
Neue Erkenntnisse kommen über den Rückkanal (Stamm §8). Sie werden in eine dieser Karten oder den Stamm eingeordnet, es entsteht kein neues Einzeldokument. Golden und Anti wachsen mit jeder Abnahme: Was Georg mit PASS abnimmt, kommt als Golden in den Ast, was er mit FAIL ablehnt, als Anti.
