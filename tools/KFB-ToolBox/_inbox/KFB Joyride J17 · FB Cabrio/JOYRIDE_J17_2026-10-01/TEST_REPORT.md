# TEST_REPORT · J17 · FB-CABRIO-JOYRIDE-01

PASS steht nur da, wo der Test gelaufen ist. Messwerte: `lab-track/evidence/j17-seat-evidence.json`, `lab-track/evidence/j17-round-gate.cabrio.json`.

| # | Test | Ergebnis | Messung |
|---|---|---|---|
| 1 | Cabrio lädt als Standard | **PASS** | Dach `C4D Animation Take` bei Frame 52 (t = 2,167 s bei 24 fps) · `Window2`/`Window` ausgeblendet · Karosserie #D73800 über Knete »vehicle« (Quellfarbe) · Glas Originalmaterial · `info.errors` leer, keine Konsolenfehler in der Vorschau |
| 2 | FB sichtbar beim Fahren, Hüfte ≤ 0,05 Rig am Sockel | **PASS** | Chase, Orbit, Totale, Übersicht: FB sichtbar (visuals-Override) · Platzierung 0,000 Rig · mit Bounce max 0,049 Rig (Runde, Bounce ±3 cm gedeckelt) |
| 3 | Handgelenk–Griff ≤ 0,05 Rig über eine Runde · Lenkrad dreht | **FAIL** (Runde) / PASS (26 km/h) | 26 km/h: L 0,000 · R 0,032 · Runde: L 0,197 · R 0,249 · Lenkrad ±120° mit A/D, ±105,9° per Gierrate, Winkel im steerLog |
| 4 | Keine Durchdringung beim Fahren (10 Bilder) | **FAIL** | im Stand: nur Kranz/Nabe (Unterarm 43+10, Körper 10) · Runde: 34–306 unerlaubte Kanten je Bild, vor allem Ohren gegen Sitz/Tür/Innenraum und Körper gegen Kranz bzw. Sitz bei voller Lehne |
| 5 | Hop rein/raus nach Zeitplan, Flug ohne Durchdringung | **teils** | Zeitplan PASS (Log in der Evidence) · Flug rein 0/8 · Flug raus 105 Treffer in 7 Proben (Ohren 156 Kanten, Hand/Körper je ≈ 10) · Landung rein Unterschenkel/Sitz 84 · andere Autos: J14-Schnitt unverändert (Code-Pfad, nicht eigens gemessen) |
| 6 | Gesicht wie ToolBox P06 r2 | **PASS (Bild)** | facehost OK auf `head` (6274 Punkte) · Rig-Augen + `kfb-clay-lid · upper/lower` + `KFB single-curve eyebrow` + PetMouth sichtbar, Originale aus · Bilder: chase, tunnel, face · Loop-Nahbild NOT_RUN (Auto kippt im Stand auf die Loop-Wand) |
| 7 | Ohren: Wind live, Spitzen 10–35° bei 25 km/h, kein Ohr im Kopf | **PASS / NOT_RUN** | Wind 7,55 m/s bei 26 km/h · Spitzen L 22,5° R 22,6° Mittel, p10–p90 10,9–37,2° · Ohr-im-Kopf-Audit der ToolBox NOT_RUN (hier nur Ohr gegen Auto gemessen, siehe 4/5) |
| 8 | Runde mit Cabrio | **PASS** | headless k2b 1/60 s: 91,60 s (J16: 91,60 s), 7/7 Sprünge, 0 Bande, halfWidth 1,08 / 1,389 / 1,110 identisch · Browser-Autopilot 90,85 s Spielzeit, 7/7, 0 Bande |
| 9 | fps auf Georgs Gerät | **NOT_RUN** | Vorschau 6–35 fps |

## Bilder (`pictures/`)
- Verfolger: `chase-straight`, `chase-tunnel`, `chase-loop-a/b`, `chase-curve`
- Hop rein: `hop-in-1…4` · Hop raus: `hop-out-1…4`
- Gesicht im Stand (Scheibe für diese Kamera ausgeblendet): `face-standstill` · Tunnel: `face-tunnel` · ¾ mit Händen am Kranz: `three-quarter-hands` (noch mit gemalten Originalen, vor dem Gesichts-Default)
- Maßstab: `scale-fb-next-to-cabrio`, `scale-cabrio-fb-kaykit-sedan` (4,3-m-Limousine dahinter)
- Beine seitlich, Karosserie ausgeblendet: `legs-side-body-hidden`
