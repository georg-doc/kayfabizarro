# SEAT-FIT-01 · Resident Atlas als Character-, Cockpit- und Sitz-Rig-Werkstatt

## Entscheidung

**Ja:** Der Resident Atlas ist die richtige Autorierungsoberfläche für Character-Look, Clay-Profil, statische Pose und gemessenen Sitz-/Cockpit-Fit.

**Nein:** Er wird nicht Vehicle-Physics-, Wheel-, Camera- oder Movement-Owner.

## Warum das passt

Der bestehende Atlas besitzt bereits:

- Rig-Introspektion für Medium/Large/Legacy;
- eine gemeinsame Editor-Schicht und einen Transform-Handle;
- Gliederpuppe, IK, Bodenpins und gemessene Restfehler;
- Requisiten-/Attachment-Regeln;
- geprüfte Patch-/Recipe-Exporte;
- `Sitzen und Greifen` als bereits vorgesehenes E4-Gate.

Motion Lab besitzt Clip-Bindung und Übergänge. Vehicle Lab besitzt `carrig.v3.js`, Rad-/Achsmessung und Vehicle-Orientierung. Diese Owners werden nur verbunden.

## Kleinster Beweis

1. Vehicle: echter `kart-oobi.glb`-Donor aus dem World/Race-Stand.
2. Actor: FrizzleBob Driver Graft, Rig_Medium.
3. Gegenprobe: GothGirl, Rig_Medium, ohne neue Sonderlogik.
4. Posen: neutral seated + drive/grip.
5. Clay: Original/Clay-A/B über dasselbe `figure`-/`vehicle`-Profil.

Rig_Large, Legacy, Türanimation, cartooniger Ein-/Ausstieg und Hot-Swap sind spätere Gates.

## Gemessene Anker

Vehicle-Seite liefert:

- `seat.origin`, `seat.forward`, `seat.up`, Sitzbreite/-tiefe/-höhe;
- `backrest.point/normal`;
- `grip.left/right` oder Lenkrad-/Handle-Ziele;
- `footrest.left/right`;
- `eyeTarget` und optional `cameraReference`;
- Clearance-Volumen für Kopf, Knie, Ellbogen und Hände.

Actor-Seite liefert:

- Pelvis/Hip, Chest, Head/Eyes;
- linke/rechte Handspitze und Fußspitze;
- Rig-Familie, Figurenhöhe und Skinning-Bindung;
- Pose-Restfehler und Clipping-Bericht.

Keine Anker werden aus einem Namen allein geraten. Fehlende Anker bleiben `SOURCE_REQUIRED` oder werden im Atlas sichtbar gesetzt und als manuelle Messung markiert.

## Fit-Vertrag

Schema `kfb.resident-seat-fit/1`:

```json
{
  "schema": "kfb.resident-seat-fit/1",
  "actor": {"id": "frizzlebob-driver", "rigFamily": "Rig_Medium"},
  "vehicle": {"id": "kart-oobi", "rigSchema": "kfb.carrig/3"},
  "seat": {
    "actorRoot": [0, 0, 0],
    "pelvis": [0, 0, 0],
    "hands": {"left": [0, 0, 0], "right": [0, 0, 0]},
    "feet": {"left": [0, 0, 0], "right": [0, 0, 0]}
  },
  "poseProfile": "cockpit-drive-v1",
  "lookProfile": "figure-clay-v1",
  "measured": {
    "headClearanceM": 0,
    "handErrorM": 0,
    "footErrorM": 0,
    "bodyIntersections": 0
  }
}
```

## Bedienung

- Vehicle auswählen und durch Vehicle Lab messen lassen;
- Actor auswählen;
- `Seat Fit` aktivieren;
- Pelvis zum Sitz, Füße zu Footrests, Hände zu Grips – mit sichtbaren IK-Zielen und Restfehlern;
- Front/Seite/Heck sowie Cockpit-/Eye-View prüfen;
- Original/Clay vergleichen;
- Pose-/Fit-Patch exportieren.

## Owner-Grenze im Consumer

- Atlas exportiert Look/Pose/Fit.
- Vehicle/Racer lädt das Fit-Profil, bleibt aber alleiniger Fahrzeug-/Kontakt-/Kamera-Owner.
- Motion Lab liefert bindbare Clips und Übergangsparameter.
- Consumer entscheidet aktiv sitzend/fahrend; Atlas entscheidet nicht Gameplay-State.

## Abnahme

- FrizzleBob passt ohne sichtbares Durchdringen in `kart-oobi`;
- Hände und Füße bleiben innerhalb der definierten Fehlergrenze;
- Kopf/Ohren/Augen bleiben sichtbar und im Clearance-Volumen;
- GothGirl nutzt denselben Vertrag ohne eigenen Codepfad;
- Export ist deterministisch und benennt manuelle vs. gemessene Werte;
- Original/Clay verändert keine Bones, Skinning oder Contact-Geometrie.

## Später

- cartooniger E-Einstieg: Character hüpft ins Fahrzeug / Fahrzeug setzt sich auf Character;
- Ausstieg als Bounce/Spit-Out;
- Rig_Large/Legacy-Adapter;
- Cockpit-Blick, Reactions und Eye/Eyebrow/Eyelid-Actors;
- Sitz-/Vehicle-Fit-Auswahl im Racer/WorldBuilder.

