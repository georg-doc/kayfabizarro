# T1 · Owner- und Datenverträge

Status: bestehende Verträge bewahren; die folgenden Integrationsgates gelten für T1.

## Owner

| Teil | Zuständig | Nicht zuständig |
|---|---|---|
| Studio / gemeinsamer Actor-Bauweg | Graft, Look, Face-/Material-Module, vorhandene Pose-/Exportlogik | Weltbewegung, Damage, Kamera eines Spiels |
| Rigging-Linie | vorhandene Part-/Anchor-/Carl-Kalibrierung und dokumentierte Übersetzung | alle Vehicle-Funktionen pauschal besitzen; fremde Rigs anhand Carl-Indizes durchsuchen |
| Animation Lab | Clip-Wahl, Playback, Audit, Acting-Tests auf derselben Actor-Komposition | einen eigenen Kopf, EyeRig, Mund oder Look erfinden |
| ToolBox-Hülle | Einstieg, Config-Auswahl, Docs, Versionsanzeige, Veröffentlichung | zweiter Owner der Rig-/Material-/Motion-Werte |
| Consumer | aktive Runtime, Input, Clock, Bewegung, Kamera, Audio-Timing, Combat/Lernlogik | importierte Daten still als neue globale Defaults speichern |

Gemeinsam verwendete Module bleiben gemeinsam; genaue Quellen und Zuständigkeit vor Bearbeitung prüfen. Dokumentierte Quellpfade stehen in MODULES.json, nicht als behauptete lose Dateien im Eingang.

## Bestehende Formate

- `kfb.pets/1` bleibt Studio-/Actor-Input und -Output. Global-/Pet-Overrides, unbekannte Felder, `null`, `false`, `0` und Modzustände erhalten.
- `kfb.carl.rig/6` bleibt Originaleingang. Übersetzung nach `kfb.pets/1` durch den vorhandenen `carl-contract`-Weg prüfen und Feldzuordnung dokumentieren; niemals Carl-Werte mit FB-Ankern ersetzen.
- Bath/Rover/Cockpit-Fixtures separat lesen. Ihre tatsächlichen Schemata, Einheiten und Frames aus Daten/Code bestimmen, nicht aus dieser Spec erfinden.
- Single-Pet-Export nicht über eine vollständige Bibliothek schreiben. Explizit ausgewählten Actor nach ID behandeln; andere Pets und globale Defaults unverändert lassen.

**Actor + Rolle + Fit** ist in T1 eine logische Trennung. Bestehende JSONs dürfen vollständig bleiben. Rollen-/Fit-Referenzen oder ein Begleitmanifest können den Zweck erklären; keine neue Version des Exportvertrags ohne Bedarf und freigegebene Migration.

WIP-Dateien `(1)`/`(4)` bleiben unverändert. Ein neuer sprechender Profilname benötigt Herkunft, Hash und Status; Name/Nummer beweist weder Aktualität noch Georg-Abnahme. Version, meta.contract und petVersion getrennt erfassen.

## Datenrundreise

Import → unverändert exportieren → erneut importieren. Vergleich semantisch, inklusive unbekannter Felder und aller nicht bearbeiteten Actors. Nur ausdrücklich dokumentierte Export-Metadaten wie Timestamp/Exportzähler dürfen abweichen. Keine pauschale Ignorierliste für echte Profildaten.

Canon/gelieferte Vorlage, Arbeitsentwurf und temporäre UI-/Playback-Session unterscheiden. Ein anderer Tool-Tab darf weder ungespeicherte Änderungen noch Auswahlscope unbemerkt überschreiben. Expliziter Import/Export funktioniert als Mindestweg auch ohne Live-Sync; automatische Cross-Origin-Synchronisation wird nicht behauptet.

## Runtime-Lebenszyklus

Pro Actor genau ein zuständiger Body-/Head-/Eye-/Mouth-Owner. Pro animiertem Skelett eine verantwortliche Mixer-Instanz, soweit der vorhandene Bauweg dies vorsieht. Statische Actors erhalten nicht künstlich Skelett/Mixer. Gemeinsame Face-Module einmal pro Frame aktualisieren, nicht aus Lab und Host doppelt.

Ein Scene-/Realm benutzt einen kompatiblen Three-Build; keine Objekte aus verschiedenen Builds ungeprüft mischen. Original `three@0.160`-Annahmen zuerst prüfen, kein implizites Versionsupgrade. Bei Toolwechsel Listener, Playback und Audio korrekt beenden/pausieren; letzte gültige Config bei Ladefehler behalten.

## Talk jetzt, Lip-Sync später

MVP: vorhandenen Mouth-Owner über Talk an/aus und dokumentierte Modifikatoren steuern. Exakte Methodensignaturen aus dem Modul übernehmen, nicht diese Prosa als bereits vorhandene API ausgeben. Amplitude/Tempo/Restzustand nur anbieten, wenn implementiert oder gezielt ergänzt und geprüft.

Talk aus, Audioende, Abbruch und Actorwechsel führen in definierten Restzustand; keine zurückbleibende Talk-Schleife. Playback/TTS darf später dieselbe Mouth-Steuerung speisen. Viseme-Namen/Mapping aus Profil und realen Mouth-Assets; vorhandene `visemeMap` beweist noch kein Audio-Lip-Sync. Zeitcodierte Viseme-Eingabe ist DEFERRED und benötigt keinen zweiten Mund.

## Mods und Consumer

Nose/Brow/Mouth/Weapon-Mods müssen sauber an/aus schaltbar und wiederherstellbar sein. Beim Kopieren Materialcaches nicht global verändern. Carl-Parts aus dem verifizierten Spender extrahieren und an Zielanker montieren, nicht am Zielrig nach identischen Inselnummern suchen.

Travel erhält später Actor plus Bath-Fit; Combat Grip/Muzzle/Readiness nach eigenem Vertrag; Podcast erhält denselben FB als Presenter ohne ungewollte Standardwaffe; Wissens-Pilli erhält Carl mit eigenen Face-Maßen. Keine Integration in fremde Repos durch T1.
