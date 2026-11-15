# MINI_r1h · Web-Kanon r1h · RETURN (WSB, 15.11.2026, V-1818)

**Bundle:** `wsb-fb-web-kanon-r1h.bundle`, sha256 `84300c7dad0f8772270cffce716851bd66fd92c7cc003f195d721746c3fd653b`
- Zweig `assets/wsb-fb-web-kanon-r1h` @72d3701c, ab `assets/private` @2fde66e6, 40 Dateien, nur additiv.
- WSB pusht nicht.

**Messblatt:** `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1h.md`.

## Kurz
- `FB_WEB_KANON_agent_twin.r1h.glb`: 7,21 MB, 96 Clips = r1g 61 + 35. Kanon-Wache und Struktur wie r1g.
- **Tänze 17:** 13 nach der Spiel-Regel plus k7b, k7s, k8b und k8s, unverändert.
- **Debatten 6:** d1, d2, d5–d8, unverändert. d3/d4 sind eine Lücke (sitzt ohne Stuhl in der Luft).
- **Erklär-Clips 12:**
  - Ablauf: auf FB übertragen, Abspreizung 18° (V-1733), V-1752 auf ≤ 1,38 cm (roh 2,6–9,0 cm).
  - `pointing_a` lag schon repariert in r1g, ist also nicht doppelt drin.
- **Bodenausgleich FB je Bild:**
  - als JSON und CSV (`data/r1h/bodenausgleich_fb_r1h.*`);
  - bei den Erklär-Clips praktisch nicht nötig (tiefster Punkt ≤ 0,005 u unter dem Boden).

## Befunde, die WS0 entscheiden sollte
1. **Kopfgesten ohne Kopf:**
   - Die Kopfspur ist in der ganzen Gesprächsbibliothek und in d6–d8 starr (0,0–0,2°).
   - Nicken, Kopfschütteln, Kopf wiegen, d6 und d7 lesen sich nicht. Seufzen bewegt sich kaum.
   - Nötig ist der Kopf-Versatz aus `kfb-gaze` (N35) oder neue Kopfspuren. Liegen sie in r1h trotzdem drin, oder sollen sie in r1i raus?
2. **Klatschen:** Auf FB treffen sich die Hände nach V-1752 nicht mehr (Handgelenke 32–42 cm statt 9–21 cm). Es braucht eine eigene FB-Fassung.
3. **Schleife nicht geschlossen** (< 5°-Regel): dismissing 6,1° (durch die Reparatur, roh 3,9°) und shrug 11,5° (schon roh).
4. **Rollen der Erklär-Clips** sind abgeleitet (label_de/group) und im Messblatt markiert.
