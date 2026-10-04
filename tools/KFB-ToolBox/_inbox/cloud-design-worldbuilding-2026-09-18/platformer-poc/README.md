# KFB Free Roam · Platformer Hub POC v0

Ein browserfähiger 3D-Platformer, der gleichzeitig ein Eingang in die KFB-Projekte ist:
man springt von Plattform zu Plattform über eine schwebende **KFB Project Island**, und
einzelne Plattformen sind Projektportale.

Produkt-ID: `KFB_FREE_ROAM_PLATFORMER_POC_v0` · Status: **CANDIDATE**
Öffentliche Veröffentlichung: **NOT PERFORMED** · Georg-Abnahme: **OPEN**

## Zwei Modi, eine Welt

Dieselben Plattformen, dieselbe Kollision, derselbe Bewegungs-Besitzer, dieselben
Aktor-Adapter. Der Moduswechsel ändert **Assist-Regel, Gefahren und Fall-Behandlung** — sonst
nichts.

**Chill & Fun** — kein Geschicklichkeitstest. Das nächste plausible Ziel wird hervorgehoben
(zwei Alternativen blass daneben), **Space** springt dorthin: Anticipation → Absprung →
sichtbarer Bogen → Airborne-Acting → Landung → Recovery. Die Bahn ist ballistisch gerechnet,
nicht geschoben; die Landung ist sicher, solange das Ziel beim Absprung gültig war. Wer
trotzdem fällt, landet auf der letzten sicheren Plattform. Optional „Flow Hop": nach der
Landung wird das nächste Ziel schon vorgeschlagen — vorgeschlagen, nicht gesprungen.

**KFB Game Mode** — gleiche Geometrie, kein garantiertes Ziel. Anlauf, Absprungpunkt und
Sprungweite gehören dem Spieler. Säge und Spikes sind scharf, Fall setzt auf den letzten
Checkpoint zurück. Kein Game Over.

## Steuerung

| | |
|---|---|
| W / S | vor / zurück |
| A / D | drehen (KFB-Preset) · seitwärts im kamera-relativen Preset |
| Q / E | seitwärts |
| Shift | rennen |
| Space | springen |
| Strg / C | ducken |
| Ziehen / Rad | freier Orbit / Zoom |
| F | Kamera hinter die Figur (der einzige Selbstlauf der Kamera) |
| R | Rettung auf die letzte sichere Plattform |
| G | Emote |
| Enter | Portal der Plattform öffnen, auf der man steht |
| L / M | Motion Lab / Modus umschalten |

Zwei Eingabe-Presets, im Lab umschaltbar: `KFB_TRAVEL` (Voreinstellung, A/D drehen — wie im
Travel-Contract) und `PLATFORMER_CAMERA_RELATIVE` (WASD relativ zur Kamera, Figur dreht sich
in die Bewegung). Der geteilte Standard wird nicht still umgeschrieben.

## Aktoren

Das Roster ist manifest-getrieben (`data/actors.json`), lazy geladen, und es lebt immer genau
**ein** Spieler-Aktor — der vorherige wird entsorgt. Sechs Gruppen (Platformer · KFB ·
Residents · KayKit · Legacy), heute 15 Einträge, erweiterbar ohne Codeänderung.

Vier davon sind die geforderten Adapter-Nachweise:

1. **Platformer Character** (Referenz-Kontrolle, eigene eingebettete Clips)
2. **Skeleton Warrior** (gewöhnlicher KayKit/Resident-Biped, geteilte Rig_Medium-Bibliothek)
3. **FrizzleBob** über `mountGraft()` mit `animation:'host'`
4. **CapsuleCarl** über `mountCarl()`, prozedurale Präsentation (0 Knochen)

## Welt und Portale

`data/level.json` beschreibt 17 Plattformen in **Zellen**; die Zellkante wird zur Laufzeit am
Pack-Würfel GEMESSEN (2,000 Einheiten) statt angenommen. Neun Plattformen tragen Portale
(`data/hub-portals.json`) — Kandidaten-URLs, ausdrücklich als solche beschriftet. Kein
Laufzeit-Scraping des öffentlichen Hubs.

## Motion Lab

Eine einklappbare Schublade, kein Dauer-Dashboard: Aktor, Adapter, semantischer Zustand,
tatsächlicher Clip, Bindungsquote, Skalierung (gemessen → Faktor), Horizontalgeschwindigkeit,
grounded/airborne, Assist-Ziel samt Teilbewertungen, Zellmaß, Ladeprotokoll, FPS. Dazu ein
manuelles Clip-Dropdown und ein Tempo-Regler — Diagnose, nicht der normale Spielweg.

## Persistenz

Namensraum `kfb.free-roam.platformer-poc.v0`: Aktor, Modus, Preset, Assist-Grad, eingesammelte
Pickups, Kameraabstand. Kein `localStorage.clear()`, keine Behauptung von Kompatibilität mit
Travel- oder Race-Ständen.
