# WS0 → WSB · B39 Ein- und Aussteigen für die Dieselpunk-Fahrzeuge R1 (18.10.2026 · V-524)

Georg: „Die Ein-/Aussteige-Animation für die Dieselpunk-Modelle finetunen – die war bisher eher buggy und nicht sauber konzipiert.“
Grundlage: V-311 (hineinhüpfen, keine Cabrio-Sitzsituation, Fahrer verschwindet im Fahrzeug), V-315/dv02 (Größe; Ohren dürfen knicken), V-477 (Anker `entry` / `driver_hidden` / `hover|wheel`, Modus hop-in-hidden), V-481 (`kfb-vehicle-rig.json`).

## 1 · Erst das Konzept
Vor dem Bauen 6–10 Zeilen im RETURN: Wo steigt man bei welchem Fahrzeugtyp ein, und warum?
- **Typ A · Tür seitlich:** Tür schwingt auf, Figur hüpft im Bogen hinein, Tür schlägt zu.
- **Typ B · Dachluke / Cockpit-Haube:** Haube klappt, Figur springt von oben hinein, Haube schließt.
- **Typ C · offen** (Kart, Badewanne): Sitz bleibt sichtbar. Für die Badewanne gilt die abgenommene Sitzlösung (kt06), dieser Typ ist nur zur Vollständigkeit.

Je Fahrzeug den Typ festlegen. Die Figur verschwindet **nur durch eine echte Öffnung**, nie durch die Karosserie.

## 2 · Cartoon-Choreografie (12 Prinzipien, kurz und knackig)
- **Einsteigen** (≈ 0,8–1,1 s):
  1. zum `entry`-Punkt drehen;
  2. Antizipation (Hocke, Squash);
  3. Sprungbogen mit Stretch;
  4. Öffnung geht kurz vorher auf (Overlap);
  5. Figur taucht in die Öffnung und ist nach Verdeckung verborgen; Ohren knicken beim Durchtauchen;
  6. Fahrzeug federt ein (Squash der Karosserie ≤ 8 %, V-179) und nach;
  7. Öffnung schließt mit kleinem Nachschwingen;
  8. kleiner Staub-Puff nach der VFX-Spec V-499.
- **Aussteigen** (≈ 0,8–1,0 s): Öffnung springt auf, Figur schnellt im Bogen heraus, Landung mit Squash am `exit`-Punkt neben dem Fahrzeug, Fahrzeug federt hoch, Öffnung schließt.
- **Ton:** die Anker für Tür auf/zu, Sprung, Landung und Federn als Ereignismarken im Clip benennen. Den Ton selbst liefern WSA/WS0.

## 3 · Technik und Lieferung für WS1
- **Je Fahrzeug Anker:**
  - `KFB_entry` und `KFB_exit` am Boden;
  - `KFB_opening` als Öffnungsmitte mit Normale;
  - Scharnier `KFB_door_hinge` bzw. `KFB_hatch_hinge` falls vorhanden;
  - `KFB_driver_hidden` im Innenraum.
- **Fahrzeug-Clips:** `kfb_vehicle_open`, `kfb_vehicle_close`, `kfb_vehicle_bounce_in`, `kfb_vehicle_bounce_out`. Tür bzw. Haube als eigener, sauber getrennter Teil, mit Löcher-Prüfung (V-520).
- **Figuren-Clips** (KayKit-Rig, Medium und Large): `kfb_hop_in_side`, `kfb_hop_in_top`, `kfb_hop_out_side`, `kfb_hop_out_top`, mit Root-Bewegung von `entry` zur Öffnung. Clips aus dem Bestand (KayKit/Mixamo-Sprünge) zuerst prüfen und anpassen (V-511), dann ergänzen.
- **Zeitplan als JSON** `kfb.vehicle-enter-exit/1`: Phasen mit Frames, Ereignismarken, ab wann die Figur verborgen ist, Federweg. WS1 baut danach die Laufzeit.

## 4 · Testumfang
- **Fahrzeuge:** 02 Flammen-Dragster (erstes Auto, dv01), Rustwing Cruiser II und ein drittes Fahrzeug mit anderem Öffnungstyp.
- **Figuren:** FrizzleBob mit EyeRig (falls der Mund lädt, sonst Lorekeeper) und Orc Brute (Large).

## 5 · Belege (QA-Liste V-520 abgehakt im RETURN)
- Bildstreifen Einsteigen und Aussteigen je Fahrzeug × Figur, Seiten- und ¾-Ansicht.
- Nahaufnahme der Öffnung im Moment des Durchtauchens: nichts sticht durch die Karosserie.
- Tür/Haube ohne Löcher.
- Ein kurzes Video je Fahrzeug, wenn die Render-Seite das kann.
