# Failure Export Intake · Hex Platformer 2026-09-19 r1

Status: **RECOVERY EVIDENCE · NICHT PROMOTED**  
Geprüft: 2026-09-19

## Quelle

Lokaler Recovery-Ordner (nicht im öffentlichen Repository veröffentlicht):

`KFB_Hex_Platformer_FAILURE_RECOVERY_EXPORT_2026-09-19_r1/`

Der Ordner ist ein vollständiger Claude-Design-Recovery-Export mit Root-Dokumentation, Quellständen, Proof-Bildern und Teilprojekten für Free Roam, Hex-Baukasten und Hex-Raster-Donors.

## Integritätsprüfung

- ungefähr 1,0 MB
- alle in `CHECKSUMS.sha256` gelisteten Dateien wurden lokal geprüft
- Ergebnis: **PASS für sämtliche gelisteten Dateien**

Dieser PASS belegt nur, dass der Export vollständig und unverändert vorliegt. Er belegt nicht, dass das darin enthaltene Spiel oder der Generator akzeptiert ist.

## Beobachtetes Ergebnis

- Inventar, Loader, Messung, Raster und mehrere kleine Proof-Ideen sind brauchbar.
- Die große generierte Insel ist kein bestandener Plattform-Generator.
- Die Komposition blieb formelgetrieben und nutzte die Packs nicht als verstandene Baukästen.
- Vier Reparaturschleifen verbesserten die Grundlage nicht ausreichend.
- Turm- und Sprungbelege zeigen eine brauchbare Richtung, müssen aber im aktuellen Runtime-Stand neu gemessen werden.

## Behalten

- Inventar-Harvesting, Deduplizierung und Familienbildung
- Loader-Warmup und Texturzuordnung
- Maße, Basis, Bounding Box und Dreiecksanzahl
- pack-first Klassifizierung
- Raster-/Kanten-/Road-Donors aus `hexrealm/lib/hex-grid.js`
- lazy Proof-/Kontakt-Sheets
- sechs Kameramodi
- Player-/Graft-Donor
- messbare Sprung-, Landungs- und Turmkontakte
- dokumentierte Tiny-Treats- und Resident-Skalierungsbeobachtungen

## Verwerfen oder neu bauen

- `generator.js` mit `planPlatform()` / `buildPlatform()` als Ganzes
- Blob-/Ring-/Spine-/Star-Generierung
- monotone Höhen- und Padding-Logik
- die große Vorschauinsel als Akzeptanzbeleg
- automatische Diorama-Komposition aus `diorama.js`
- ungeprüfte Namensfilter und daraus abgeleitete Vollständigkeitsbehauptungen

## Kleinster nächster Beleg

Eine Plattform aus genau drei Teilen:

1. zwei Nachbarn auf Höhe 0,
2. ein Nachbar auf Höhe 1,
3. exakter Rasterkontakt,
4. keine unzulässige Überlappung,
5. kein schwebender Träger,
6. Beleg von oben, Seite und schräg oben.

Scheitert dieses Gate, endet der Lauf mit Rückgabe. Es folgt im selben Lauf weder Insel noch Generator.

## GitHub-Entscheidung

Der komplette lokale Export wird durch dieses Intake **nicht** automatisch in den aktuellen Quellbaum kopiert. Das Hauptbriefing übernimmt nur belegte Erkenntnisse und verweist auf bereits vorhandene aktuelle Tool-/Projekt-Owner. Einzelne Donor-Dateien dürfen später nur nach Pfad-, Lizenz-, Versions- und Ownership-Prüfung übernommen werden.
