# Für WSB (Mac mini, Blender MCP) · Web-Kanon r1h: Tänze für Leerlauf und Erklär-Gesten für den Regel-Guide · 15.11. (Georg, V-1818)

**Kern (3 Zeilen):**
1. Georg: Auf der Website tanzt FB in Pausen, wenn er gerade nichts erklärt, und für Spielregeln, FAQ und Onboarding braucht er Gesten zum Erklären.
2. Beides gibt es im Bestand. Tänze und d1–d8 kommen unverändert in die Web-Datei, wie die Katana-Clips in r1g; die Gesprächsclips werden vorher auf FB übertragen und repariert.
3. Lieferung `FB_WEB_KANON_agent_twin.r1h.glb` = r1g plus die Clips unten, sonst nichts geändert, mit Messblatt.

**Grundlage:** `assets/private` @2fde66e6. Pfade ohne Präfix liegen dort.

| Teil | Bestand (geprüfter Pfad) |
|---|---|
| Web-Datei heute | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON_agent_twin.r1g.glb`, Messblatt `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1g.md` |
| Tänze FB (Georgs Wahl q686, q695, q696) | `50_BLENDER/KULTURTECHNIKEN_R1/clips_fb/KFB_Kultur_tanz.Rig_Medium.fb.glb`, `…/KFB_Kultur_tanz2.Rig_Medium.fb.glb`; Felder im Manifest `50_BLENDER/KULTURTECHNIKEN_R1/data/teilB2/clips.kulturtechniken_r1.json` |
| Erklär-Gesten | Gesprächsbibliothek `50_BLENDER/N35/out/talk_library_r2/KFB_Talk_Library_Rig_Medium.glb` (Katalog `KFB_Talk_Library.catalog.Rig_Medium.json`); Debatten d1–d8 `50_BLENDER/KULTURTECHNIKEN_R1/clips_fb/KFB_Kultur_debatten.Rig_Medium.fb.glb` |

**Auswahl:**
- Tänze: alle Clips mit `technik: tanz`, `rigs` ∋ `fb`, `schleife.geschlossen` und ohne Partner (dieselbe Regel wie im Spiel, V-1816). Die Posen-Übergänge k7b/k7s/k8b/k8s kommen als Ein- und Ausstieg mit.
- Erklären: die 13 Clips der Gesprächsbibliothek und d1–d8. Sitz-Clips (d3, d4, d5) nur, wenn sie ohne Stuhl lesbar bleiben; sonst als Lücke melden.

**Regeln:**
- Tänze und d1–d8 aus KULTURTECHNIKEN: auf FB schon nach V-1752 repariert, unverändert übernehmen (V-574).
- Die 13 Clips der Gesprächsbibliothek gibt es nur auf KayKit Rig_Medium: mit `50_BLENDER/IDLE_R1/scripts/clips_auf_figur.mjs` auf FB übertragen, nach V-1752 reparieren (≤ 1,5 cm im Rumpf), FB-Abspreizung wie in IDLE_R1 (V-1733), Messwert vorher/nachher ins Messblatt. Für diese 13 Clips den FB-Bodenausgleich messen wie K12 (oder „nicht nötig“ mit Messwert) und ein Vorschaublatt vorn oder seitlich mit Kanon-Wache mitliefern.
- Arme frei wie im Spiel (V-1733), FB-Kanon-Wache (beide Ohren, Schwanz).
- Gleiche Packung wie r1g; Größe im Messblatt nennen.

**Messblatt `RETURN_r1h.md`:** je Clip Name, Länge, Schleife ja/nein, Takt (bpm, beatsPerLoop, downbeatS) aus dem Manifest und der Bodenausgleich für FB (`bodenausgleich.frizzlebob` → `data/floorlift/frizzlebob.floorlift.json`, als Tabelle je Bild zum Anwenden auf der Website; die Clip-Spur bleibt unverändert, V-596). Bei Erklär-Clips dazu eine Rolle (zeigen, zählen, abwägen, zustimmen, widersprechen …), abgeleitet aus `label_de` und `group` des Katalogs und als abgeleitet gekennzeichnet.

**Rückgabe:** Git-Bundle mit Zweig `assets/wsb-fb-web-kanon-r1h` von `assets/private` @2fde66e6, RETURN in `KFB_HUB/30_DECISIONS/replies/WEB_KANON_R2/MINI_r1h/`. WS0 pusht und gibt r1h an Claude Design weiter.
