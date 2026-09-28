# HANDOVER · T4 + Markierung M2 · 2026-09-28 r1

**Owner:** Claude Design (Look) · **Receiving:** WSA-Lead / nächster Claude-Design-Chat.

## Was steht
- Markierung ist jetzt ein Regelwerk-Modell: echte deutsche Maße (RMS/StVO), zwei Faktoren (Länge × 2, Strichbreite × 2,5), gerade Enden, echte Stöße. Vollständig in `docs/ROAD_MARKINGS_M2.md`.
- Vertrag `lab-track/road-markings.m2.json` ist die Quelle der Wahrheit. Blatt und 3D lesen beide daraus.
- T4 baut Markierungen mit `buildRoadMarkingsM2`. M1 bleibt als Fallback importierbar (`makeAtlas` ohne `M2` → M1).

## Was nicht steht
- Tune-Pass (Liniendicke, Übergang Punktraster im 3D, Anschlussstücke).
- M2-Situationen ohne Ort auf TD03 (Einmündung, Parkbucht, Linksabbieger, Parkdeck, Boxengasse, Start/Ziel).
- US-Schalter in T4 (`rulebook` ist im Builder vorhanden, im UI nicht verdrahtet).

## Regeln für den nächsten Chat
- Kein Element erfindet eine Form. Neue Markierung = Regel aus RMS/StVO + die zwei Faktoren. Erst ins JSON, dann Blatt, dann 3D.
- Farbe der Mitte gilt für alles, was Gegenrichtungen trennt. Querlinien bleiben hell.
- Änderungen an `transition-atlas.v1.js` / `track-look.v5.js` nur additiv, Cache-Buster hochzählen (`atlas ?r=14`, `track-look ?r=18`, `m2.js ?r=1`, `m2.json ?r=4`).

## Next Gate
**Tune-Pass M2.1 mit Georg am Bild: Liniendicke (S/B/Q-Faktor 2,5 prüfen), Einmündung inkl. Anschlussstücke, dann Punktraster-Übergang in T4 von M1 auf M2 umstellen.**
