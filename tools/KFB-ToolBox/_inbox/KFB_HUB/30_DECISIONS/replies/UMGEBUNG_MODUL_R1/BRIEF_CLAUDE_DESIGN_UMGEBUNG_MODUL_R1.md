# Für Claude Design · Umgebungs-Modul R1: Patchworld-Stoffboden, Brettspiel-Teile, Kartenhaus und Dominosteine per WFC als einbaufertiges Paket · 17.11.2026 (Georg, V-1882)

**Tier 0 (3 Zeilen):**
1. **Ein Gelände, eine Haut:** Der Patchworld- und Stoff-Look ist eine Haut für unser vorhandenes Endlos-Gelände. Er läuft hinter einem Schalter, ohne zweiten Boden und ohne eigenes Licht.
2. **Bausteine statt Szene:** Brettspiel-Teile, Kartenhaus und Dominosteine kommen als Teile mit WFC-Regeln als Daten. Gesetzt werden sie vom Verteiler des Spiels.
3. **Liefern wie Infinite Rooms:** GitHub-Zweig mit Ordner, `HOST_CONTRACT.md`, README, Beispielseite und Tests. Zwischenstände sind willkommen.

## Warum
- **Georg (17.11.):** „Patchworld / Fabrics und Claude-Design-Environment & Boardgame-Bits per WFC fände ich im Game cool.“
- **Was wegfällt:** Papier-, Öl- und Aquarell-Durchgänge sind für das Spiel nicht relevant. Sie bleiben für Website und Szenen bei dir, kommen aber nicht in dieses Paket.

## Schnitt
**1. Boden-Haut `patchworld`**
- **Eingang** vom Gelände-Besitzer (`src/world/endlessTerrain.js`):
  - Höhe, Oberfläche und Neigung je Punkt;
  - Biom-Feld (`field.dominant(x, z)`);
  - die vorhandenen Farbrollen.
- **Ausgang:** Material- bzw. Shader-Bausteine, die der Gelände-Besitzer in sein eines Material einhängt, so wie heute `terrain3`. Dazu ein Parameter-JSON (Stoffarten, Nähte, Farbfelder je Biom).
- **Regeln:**
  - Nähte und Flicken sind gestaltet: Stiche, Kanten, leichte Wölbung. Keine sichtbare Kachel-Wiederholung, denn die hat Georg beim HyperNorm-Boden abgelehnt (q601).
  - Straßen, Plätze und Kartenviertel bleiben lesbar.
  - Kein eigenes Licht (ein Licht-Rig, V-385).
**2. Teile `brettspiel`**
- **Teile:** Meeple, Spielsteine, Würfel, Kartenhaus-Karten (KFB-Karten-Regel: flache Ebene, Tusche-Umriss, KFB-Rückseite) und Dominosteine. Jeweils als GLB oder prozedural, Größe in Metern, Ursprung am Boden.
- **WFC-Regeln** als JSON: Nachbarschaften, Gruppen und Formationen, also Dominoreihen, Kartenhaus-Türme und Spielfeld-Inseln. Das sind Zonen und Formationen, kein Streugut (V-797).
- **Kollision:** einfache Kollisionsformen je Teil. Dominosteine dürfen kippen und Ketten bilden; die Physik macht das Spiel (Rapier).
- **Look:** Knete und Figurenlicht des Spiels. Georgs Standard: Kollisions-Dummies wie Meeple bekommen Claymation-Knete in Figurenfarbe und -helligkeit.
**3. Gastgeber-Vertrag**
- `HOST_CONTRACT.md`: Was das Spiel liefert (Szene, Gelände-Adapter, Uhr, Verteiler-Haken, Rapier-Welt) und was das Paket zurückgibt.
- Kein eigener Renderer, kein Welt-Schritt, kein AudioContext.

## Lieferung
- Zweig im privaten Stamm-Repo `georg-doc/KFB-Stunt-Car-Race`, Ordner `src/modules/umgebung/` (Vorschlag), dazu eine Beispielseite ohne Spiel.
- RETURN mit Bildern: Draufsicht, Fahrkamera und Figur zu Fuß, jeweils mit Spiel-Licht.
- WS0 hängt das Paket hinter `boden=patchworld` bzw. `bits=r1` ein und zeigt es Georg im Hub.
- Ein Zwischenstand (WIP) ist jederzeit willkommen, Georg gibt ihn an WS0 weiter.

## Nicht
- Kein Papier-, Öl- oder Aquarell-Durchgang im Spiel.
- Kein zweites Gelände, keine eigenen Lampen.
- Keine eigenen Figuren-Shader.
