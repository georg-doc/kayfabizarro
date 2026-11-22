# Auftrag an WSB (über WS0) · Buch „Hilfe, ich bin ein Mensch!“ als 3D-Asset · R1 · 22.11.2026

Georg 22.11. (Chat Buchmaschine): WSB baut das Buch als echtes Taschenbuch-Asset, einmal geschlossen, einmal aufgeklappt. Georg hat WSB parallel direkt gefragt; das hier ist die technische Ergänzung aus Sicht der Buchmaschine. Ersetzt den Platzhalter in der Buchmaschine und erfüllt den älteren Auftrag in WS0_AN_WSB_2026-11-17.

## Quellen (Druckdaten)
- Umschlag: `Dropbox/(DB) CS 2020 Krazy Karnikl/Menschenbilderbuch/Exporte/SEITEN LAYOUTS/RZ Westend/Marketing/Westend Archiv (PDFs)/Hilfe ich bin ein Mensch ARCHIV Umschlag.pdf` – ganzer Bogen 549 × 230 mm: Klappe | Rückseite mit Klappentext | Rücken | Vorderseite | Klappe (Klappenbroschur, die beiden Klappen haben bedruckte Innenseiten).
- Innenseiten: gleiche Ordner, `Hilfe ich bin ein Mensch ARCHIV Innenseiten.pdf`. Leseprobe mit 8 Doppelseiten: `~/Downloads/Leseprobe_hilfe_ich_bin_ein_mensch.pdf/`.
- Maße aus dem PDF ableiten: Höhe 230 mm, Breite der Seite aus der Doppelseite (Seitenverhältnis der Leseprobe ≈ 0,717 → ≈ 165 mm), Rückenbreite = 549 − 2 × Seite − 2 × Klappe (bitte aus den Falzmarken messen, nicht schätzen).

## Was gebraucht wird
1. **Geschlossen:** Klappenbroschur mit Vorderseite, Rücken, Rückseite aus dem Umschlag-PDF, Klappen eingeschlagen. Buchblock sichtbar an Kopf, Schnitt und Fuß mit Papierkanten-Textur (feine Blattlinien, leicht unregelmäßig), keine Box.
2. **Aufgeklappt:** natürliche Wölbung der Seiten zum Bund hin, Buchblock links und rechts mit sichtbarer Dicke und Blattkanten, Rücken leicht gerundet. Eine echte Doppelseite lesbar (Leseprobe Doppelseite 1). Klappen wahlweise aufgeklappt (Innenseiten der Klappen sichtbar).
3. **Bewegung (wichtig für die Buchmaschine):** das Buch muss cartoonig weich nachfedern können (Anticipation, Überschwingen, Einpendeln). Bitte ein schlankes Rig: Knochen für Rücken (2–3 Glieder), Deckel links/rechts, Klappen links/rechts, Buchblock-Hälften, dazu 3–5 Seitenpakete, die einzeln umblättern. Clips: öffnen, blättern, schließen.
4. **Seitenfläche für das Schälen:** die aufgeschlagene Doppelseite als eigenes Netz mit eigener UV (0…1 über die ganze Doppelseite), damit die Buchmaschine dort die Schäl-Kacheln auflegen und die Seiten aus einem Atlas tauschen kann.
5. **Look:** Druckgrafik bleibt Original (keine Knete, kein Rost auf Umschlag und Seiten). Papier matt, leicht abgegriffene Kanten und Ecken als Geometrie bzw. Eckenfarbe sind willkommen.

## Ausgabe
- `.blend` + `.glb` (geschlossen, offen, Rig mit Clips), benannte Knoten (`cover_front`, `cover_back`, `spine`, `flap_l`, `flap_r`, `block_l`, `block_r`, `page_pack_1…`, `spread_surface`), Ursprung in der Mitte des Rückens unten, Maßstab 1 Einheit = 1 m.
- Belege: vorn, seitlich, hinten, Dreiviertel, offen; Nahaufnahme Schnitt (Blattkanten) und Bund (Wölbung).
- Größe im Spiel skaliert die Buchmaschine selbst (dort ist das Buch übergroß).
