# Startnachricht · Blender-MCP-Chat · KFB Racetrack Baukasten (RKIT-01)

Einfügen in einen **neuen** Claude-Chat mit Blender MCP (Blender offen, MCP-Add-on verbunden).

---

@GitHub @Dropbox

Du bist der Blender-Chat für den **KFB Racetrack-Baukasten**. Ziel: die Grundanatomie der Rennstrecke
sauber in Blender bauen, als wiederverwendbare Module, statt sie weiter im Browser-Code zu flicken.
Kein neues Streckendesign, keine neue Route.

## Aktueller Stand (nicht neu herleiten)

Owner-Repo: `georg-doc/KFB-Stunt-Car-Race` (privat), Draft-PR **#33**, Branch
`chat/racer-tarch0-sp13ktra-2026-09-23`, Head `71e7051b2eea1ad731912b634f44ce5ba0218736`,
Runtime/Test-Head `dad35bdf0f3e19fdc2c5902e154140353db590f9` (R3d, CI 24/24).

Relevante Laufzeit-Dateien in `KFB Cologne Race Option C-3/lab-v9/`:
- `cologne-route.v1.js` — Route: **598 Punkte · 2063.84 m**, Banking `bank = clamp(curv * 26)`. Nicht ändern.
- `cologne-track.v1.js` — R3d-Streckenkörper: **ein geschlossenes 12-Punkt-Profil** (Fahrbahn + Bankett +
  innere Bande + dicke Kappe + äußere Bande + Unterseite), Darstellung 4× dichter als Route/Physik.
- `cologne-tunnel-architecture.v1.js` — TARCH: durchgehende Straße, Bögen darüber, kein Tunnelschlauch.
  Bögen = runde Tube-Rahmen **0.96 m Radius, 14 Segmente**, Füße auf der Mitte der Bandenkappe.
- `cologne-world.v1.js` — Boden/„Void“ unter und neben der Strecke (ShapeGeometry entlang der Kontur).
- Stützen: **54**, 14 radiale Segmente, Endpunkte an der echten gebankten Unterseite.
- Visueller Donor für runde Cartoon-Formen: `cologne-landmarks.v1.js` (TubeGeometry statt Box-Ketten).

GitHub ist die einzige SSOT. Die Dropbox-Kopie `/CLAUDE/KFB Stunt Car Race/KFB Cologne Race Option C-3/` ist **älter**
als PR #33 (route/track/world abweichend, tunnel-architecture fehlt) und wird nicht benutzt.
Falls du das private Repo nicht lesen kannst: Georg lädt den Branch einmal als ZIP herunter
(github.com → Branch `chat/racer-tarch0-sp13ktra-2026-09-23` → Code → Download ZIP) nach
`/CLAUDE/KFB Racetrack Blender Kit/source_pr33/`. Nicht aus Erinnerung nachbauen.

## Georgs letzte Rückmeldung (R3d = TUNE)

- dunkles Gelände/tiefe Geometrie schneidet in die Bande;
- Bande wirkt treppig statt glatt;
- dunkle rechteckige Artefakte an Strecke/Unterseite;
- Stützen- und Bogenfüße wirken abgeschnitten statt aufgesetzt.

## Auftrag RKIT-01 (genau ein Ergebnis)

1. Profil und Maße **aus den Laufzeit-Dateien messen** (nicht schätzen) und als `track_profile.json` festhalten.
2. In Blender einen kleinen **Baukasten** modellieren, cartoonig-rund, sauber geschlossen:
   - Streckenstück gerade (Länge = Modul-Einheit),
   - Streckenstück Kurve mit Banking (2–3 Radien aus der Route, z. B. die ~35 m-Kurve),
   - Stütze (Fuß sitzt sichtbar auf dem Boden, Kopf sitzt an der Unterseite),
   - Bogen/Portal (Füße sitzen auf der Bandenkappe),
   - Übergangsstück zum Boden (kein Schnitt ins Gelände).
3. **Ein** repräsentativer Abschnitt der echten Route (gebankte Kurve + Stütze + Bogen) aus diesen Modulen
   zusammengesetzt, damit man sieht, dass es passt.
4. Export: `.blend`, Python-Skript (wo möglich), GLB je Modul, Vorschau (Front/¾/Unterseite), `RETURN.md`
   mit Maßen und bekannten Grenzen.

## Grenzen

- Route, Fahrgefühl, Kamera, Fahrzeug-Bodenkontakt: nicht anfassen.
- Keine Animation in diesem Auftrag.
- Zwei erfolglose Reparaturversuche am selben Punkt → STOP, exportieren, Georg fragen.
- Ergebnis gehört nach GitHub (SSOT): `georg-doc/KFB-Stunt-Car-Race`, eigener Branch/PR für RKIT-01.
  Dropbox `/CLAUDE/KFB Racetrack Blender Kit/RKIT-01/` nur als Übergabe, falls dein GitHub-Schreibweg fehlt;
  dann übernimmt der Coworker den Upload.

## Rückfragen an Georg am Ende (höchstens drei)

1. Sehen die Module nach KFB-Cartoon aus (rund, sauber, nicht klobig)?
2. Sitzen Stützen und Bögen glaubwürdig auf?
3. Passt der zusammengesetzte Abschnitt zur echten Kurve?
