# RETURN · WB-W0 · World Scale + Traversability Proof · 2026-09-24

Status: **CANDIDATE · alle 10 Gates PASS im Preview · Georgs Abnahme offen**

## File tree
```
WB-W0_2026-09-24/
├── RETURN.md · CHANGELOG.md · SOURCE.json
├── evidence/                               Screenshots dieses Laufs
└── code/
    ├── KFB WB-W0 · World Scale + Traversability.dc.html   Einstieg
    ├── support.js
    ├── w0-boot.js      Host: Massquellen → Route → Pads → Rampentest → Gelände → Inhalt → Läufe → Globus
    ├── w0-region.js    WB2-Rauschen wörtlich · Biome · Erosion · Route/Korridor/Zonen · Racer-Band
    ├── w0-globe.js     Globus-Übersicht (eigener Massstab) · Landmaske · Fernfläche mit Erdkrümmung
    ├── w0-actor.js     GothGirl: Vermessung, EyeRig v6, KayKit-Clips
    ├── w0-ink.js       wd-ink.js wörtlich + Entfernungsblende (Delta)
    ├── wd-registry.js · wd-donors.js       Registry/Owner-Lader (unverändert)
    └── bb-scene.js                         B0-Billboard-Owner (unverändert)
```

## Was im Bild anders ist
1. **Ein Massstab, aus Quellen:** GothGirl 2,211 m · KayKit-Tür 2,80 m · Haus-Tür (Tiny Treats ×1,12) 2,80 × 1,81 m · Route 18,0 m · Billboard (Kenney ×14,286) 14,29 × 14,29 m. Figur, Tür, Haus, Straße und Tafel stehen sichtbar im richtigen Verhältnis.
2. **Route zuerst:** Racer-Strecke Start · Domplatte Nord → Bahnhofsvorplatz, 241 m, konstant 18,0 m + 2,7 m Schulter; das Gelände ist um sie geformt (flacher Korridor, Böschung, Hügel dahinter).
3. **Begehbar gemessen:** Spawn 0°, Route max 3,0°, Routenlauf Spawn → Billboard 43 s ohne Hüpfer, Einsinken oder Kollision; Türlauf bis zur Schwelle (Stufe 0,45 m).
4. **Rampentest** mit dem unveränderten Travel-walk-controller: stabil bis **25°**, ab 30° Auto-Hops → `controllerWalkSlopeMax = 25°`, Weltgrenze von 30° auf 25° abgesenkt; Erosion arbeitet mit genau diesem Talus. Steileres Gelände (0,9 %) ist als Fels sichtbar und nicht freigegeben.
5. **Sperrzonen:** 5 Props (2 Bäume, 2 Felsen, 1 Laterne) außerhalb Korridor (≥ 13,14 m) und Pads; Platzierung mit Belegungs-, Abstands-, Hang- und Auflagetest (abgelehnte Kandidaten gezählt).
6. **Globus ⇄ Region:** Übersichtsglobus mit weicher Küste (Natural Earth, Shader-AA), Zonenmarke Köln; beim Anflug Überblendung 60 → 6 km auf die ENU-Region; Globusland an der Zone = eingestrahlte Farbe von Fernfläche und Regionsrand (kein Farbsprung).
7. **Tusche** nur auf Objekten, bildschirmbezogen, blendet 25 → 150 m aus; Gelände, Route, Fernfläche ausgeschlossen; keine animierte Linie.
8. **Billboard-Flackern** (Georg) behoben: Kartenfläche 6 cm vor + polygonOffset (Host-Delta), Schattenbox in Texelschritten.

## Maße und Methoden
| Wert | Zahl | Quelle / Methode |
|---|---|---|
| visualMeshHeight GothGirl | 2,211 m | Box3 precise über Skin-Vertices, Ruhepose, vor jedem Clip, Füße auf y 0 |
| Kopf-Oberkante | 2,211 m | GothGirl_Head-Mesh; Haare sind Teil des Kopfmeshes |
| Augen-Rig Oberkante | 1,694 m | Box3 des EyeRig-v6-Knotens nach Montage |
| Breite | 1,943 m | Ruhepose-AABB (Arme) — nicht für die Skalierung benutzt |
| Kollisionskapsel | r 0,55 m · h 2,211 m | walk-controller.js `radius` (unverändert) · Höhe = sichtbare Oberkante |
| KayKit-Tür | 2,80 m (door_A) · 2,75 m (Dungeon wall_doorway_door) | Registry-Assets gemessen |
| Tiny-Treats-Faktor | 1,12 | house_door 2,50 m → 2,80 m |
| Kenney-Faktor | 14,286 | roadStart-Hülle 1,26 u → 18,0 m (Racer-Weg, dort ×16,434 → 20,7 m) |
| Fahrbahn / Schulter / Gehbereich / Sperrkorridor | 18,0 / 2,7 / ±11,7 / ±13,14 m | cologne-route TRACK_WIDTH.STANDARD · cologne-track crossPoint u 1,0/1,30/1,46 |
| Spawn-Radius | 8 m | 2 × controller `probeMax` 4,0 |
| Böschung | 26 m | **W0-Setzung** (keine Quelle), Hang begrenzt durch Erosion |

## Offen
- Das Haus hat **kein Inneres**: die Tür wird bis zur Schwelle erreicht, nicht durchschritten. Ein begehbares Haus braucht ein Asset mit Öffnung (z. B. Dungeon `wall_doorway`).
- Racer-Schulter fällt dort 0,9 m ab (18°); in W0 flach wegen ≤ 10°-Regel — benannte Abweichung.
- Routenende und -anfang sind gerade Abschnitte ohne Start-/Zielbauteil.
- Globus-Übersicht zeigt nur Land/Meer/Pole; keine Wolken, kein Tageslauf (Gate verbietet Wetter).
- WB2-Sculpt/edit-layer sind in W0 nicht verdrahtet (nur WB2-Geländeformel); Editor folgt nach W0-PASS.
- TinySkies-Himmel ist ein Bildschirmverlauf der Quelle — am Boden sitzt die Horizontfarbe am Bildrand, nicht am Horizont.
