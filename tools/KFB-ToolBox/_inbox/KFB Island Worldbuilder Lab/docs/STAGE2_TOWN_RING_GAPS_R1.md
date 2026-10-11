# Stufe 2 „Town + Ring“ · Lücken-Liste R1 (nur lesend vorbereitet)

Stand: 2026-10-10 nachts · Bau-Sitzung MVP-1 · Auftrag der Steuerung: was für Stufe 2 laut Masterplan §5 noch fehlt, je mit Vorlage-zuerst-Zeile.
Kein Bau, keine Insel-Gestaltung (die wartet auf Claude Design bzw. die Asset-Kandidaten).

Quellen:
- `KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` §3, §3b, §5;
- `MVP1_DONOR_AND_MODEL_MAP_R1.md` §1, §3;
- Lab-Code, Stand Messung 07.

## 1 · Ring geschlossen
- **Stand:**
  - `rkit_hub.roadbed.v2.json` hat zwei offene Straßen: `hub_town` (213 Schnitte, beide Enden Brückenköpfe; befahren wird nur s 41–116, die Enden sind abgesperrt) und `hub_ring_cut` (91 Schnitte, 61 Strecken-m).
  - `drive.ts` ruft `makeFrame(S, ds, false)` auf.
  - k2b kann Rundkurs schon: Δ2 „Rundkurs-Naht“ aus K3, s läuft über L → 0 weiter, die Runde zählt.
- **Fehlt:**
  - Ein geschlossenes Ring-Straßenbett für Town an der Inselkante, um die Stadt herum, nicht hindurch. Das steht als „Ringstraßen-Profile für Town“ in der RKIT-Reihe (§5b).
  - Die Kreuzungs-Mindestgeraden nach §3 an Ring-Einfahrt, Markt-Querung und Brückenkopf (TOWN 1+1).
  - Im Lab:
    - Flag `closed` aus dem Straßenbett lesen.
    - Nahtprüfung bei s = L → 0: Fahrbahn, Bett, Kamera, und an der Naht keine Absperrung.
    - Rundenzeit messen (Georgs Feel-Zahl „Ziel-Dauer einer Ringrunde“).
- **Vorlage zuerst:**
  - k2b `makeFrame(…, closed)` (vendored, unverändert);
  - Track Core 0.16.1, Familie TOWN;
  - Schema `kfb.road-bed/1`;
  - RKIT besitzt die Ring-Geometrie.
  - Neu ist nur eine Adapter-Zeile im Lab (`closed` durchreichen).

## 2 · Auffahrt
- **Stand:**
  - Im Lab gibt es weder Rampe noch Ortseingang. In `rkit_hub.parts` liegt kein Rampenteil.
  - Familie A hat keine Treppe zum Plateau (Spender-Karte: „fehlt“).
  - k2b folgt der Höhe des Straßenbetts; das ist an den Brückenköpfen von `hub_town` gemessen.
  - Der Läufer sperrt Hänge über 35°.
- **Fehlt:**
  - Ortseingang bzw. Rampenfuß (RKIT-Reihe §5b) mit höchstens 8 % Steigung.
  - Ein Familienwechsel Bande → Bord braucht 19,2 Gerade vor der Mündung.
  - Zu Fuß: Ton-Treppe in Familie A (RKIT) mit Stufenmaß in H und Q9.
  - Im Lab: Gefälle-Messung entlang s (max. %), Kamera-Messung auf der Rampe, Läufer-Messung auf der Treppe.
- **Vorlage zuerst:**
  - RKIT Bauweise-Blatt + Track Core (Ortseingang, Rampenfuß);
  - k2b-Höhenführung aus dem Straßenbett (läuft);
  - Seed-World-Kamera.
  - Rennstück-Rampen (Rampensprung) sind MVP-2 und nicht nötig.
  - Neu im Lab nur eine Gefälle-Probe (Werkzeug, kein Bauteil).

## 3 · Kollision Burg / Mauern / Bäume
- **Stand:**
  - Läufer:
    - Das Flächenfeld macht Bandenkronen und steile Flanken zu Wänden.
    - Die Auto-Grundfläche ist eine Wand (+0,35).
    - Der walk-controller gleitet an Wänden entlang (Radius, Sonden).
  - Auto: Der weiche Bandenprall von k2b (softStart 0,76, Knetgummi-Prall) hält das Auto im Fahrbahnband. Objekte kennt er nicht.
  - Kamera: Verdeckung gibt es nur gegen Insel-Boden, Unterseite, Band, Relikte und Gebäude (`userData.buildingId`). Das Spielerauto ist ein weiches Hindernis.
  - Hüllen für Burg, Mauern und Bäume gibt es nicht. Die Environment-Erdung liefert aber schon Fußpolygone (`grounding.ts` `footRadii` / `footPolygon` für `field.addEmbed`).
- **Fehlt:**
  - Einfache Hüllen für Burg, Mauern, Bande, Bäume und Brüstung (Spender-Karte §3): Figur und Auto gleiten ab statt hängenzubleiben.
  - Läufer: Fußpolygone als Wand in `walkHeight`, nach dem Muster der Auto-Wand.
  - Auto: Im Band stehen keine Objekte. Nötig nur, falls geparkte NPC-Autos oder Markt-Stände ins Band ragen.
  - Kamera: Burg und Bäume in die Verdeckung aufnehmen; Bäume weich wie das Auto oder per Dither.
- **Vorlage zuerst:**
  - Fußpolygone aus `src/environment/grounding.ts` (Besitzer Environment);
  - Wand-Muster `carHop.inFootWorld` + `walkHeight` (Lab);
  - walk-controller-Gleiten (vendored);
  - Seed-World-Arm-Regel.
  - Neu nur eine kleine Hüllen-Liste (Polygon + Höhe je Objekt), braucht Freigabe.
  - Burg-Hülle aus `CS_Big_Castle_Stage01` × 2,2 (`spec.ts` Z. 197) über deren Box bzw. Fußlinie.

## 4 · Leistungsbudget ≥ 30 fps
- **Stand:**
  - `__kfb.stats()` liefert fps, Draw Calls, Dreiecke und Inseln.
  - Die Probe-Videos laufen im Headless-Chrome mit 57–58 fps bei 1600×1000, aber nur mit Hub, Auto und Figur: ohne Burg, Bewohner, Natur, Wasser.
  - Eine fps-Messung je Lieferung gibt es noch nicht.
- **Fehlt:**
  - Eine Perf-Probe auf fester Route (Markt zu Fuß, eine Ringrunde):
    - fps-Median und p5, längster Frame;
    - Draw Calls, Dreiecke, Geometrien, Texturen.
  - Gemessen auf Georgs MacBook (M1 Max) in sichtbarem Chrome, nicht headless, mit voller Szene: Burg × 2,2, Bewohner mit Augen-Rig, Natur, Wasser F0–F2.
  - Budget-Vorschlag zur Freigabe: p5 ≥ 30 fps, Median ≥ 55, längster Frame < 50 ms außerhalb des Ladens.
- **Vorlage zuerst:**
  - `__kfb.stats()` + `renderer.info` (Lab);
  - Frame-Log aus `tools/stage2/video.mjs` (erweitern, nicht neu).
  - Vorher in Joyride bzw. Seed World nach einem vorhandenen Perf-Harness suchen.

## 5 · Kamera: Zoom und gesperrter Modus (klein, später; Steuerung 10.10.)
- **Stand:** Im Spielmodus gibt es nur Orbit per Maus-Ziehen (±149°).
- **Fehlt:** Zoom und der Modus „gesperrt“ (fest hinter der Figur).
- **Vorlage zuerst:** Joyride-Kamera-Abstand nach Fahrzeuglänge; Seed-World-Arm.

**Entscheidungen der Steuerung (10.10. abends):**
- Masterplan §5 und §3b angepasst (nur Retro-Auto, Dither 35 %, 0,15-s-Regel nur beim freien Laufen und Fahren).
- Ring, Auffahrt und Treppe bleiben bei RKIT bzw. WSA.
- Kollision und Leistungsprobe kommen, sobald Town steht.

## Widersprüche im Masterplan, die die Steuerung klären sollte
- **§5 Stufe 2:** Dort steht noch „Fahren mit Retro-Auto **und Cabrio-FB**“. Georg hat am 10.10. entschieden: Cabrio ist Post-MVP. §3 ist schon angepasst, §5 noch nicht.
- **§3b Verdeckung:** Dort steht „Sicht-Loch mit weichem Knetrand“. Gebaut ist der von der Steuerung entschiedene Dither (35 %). Der Masterplan sollte nachgezogen werden.
- **§3b harte Regel „kein Nachlaufen länger als 0,15 s“:** Die Drehraten-Grenze aus Kritiker-Runde 2 (≤ 36°/s in Schnitten und Übergaben) lässt die Kamera bewusst länger nachdrehen. Vorschlag: Die Regel gilt fürs freie Laufen und Fahren; Schnitte und Übergaben sind ausgenommen.
- **§3b Kamera:** Im Spielmodus gibt es nur Orbit per Maus-Ziehen, begrenzt auf ±149° (`camera.ts` `orbit`, also nicht ganz von vorn). Es fehlen Zoom und der Modus „gesperrt“.

## Nicht in dieser Liste (wartet auf Gestaltung bzw. Assets)
- Plateau, Burg-Stellung, Markt-Komposition, Clown (J5 unverändert übernehmen), Farmersfrau, Caveman-Mine.
