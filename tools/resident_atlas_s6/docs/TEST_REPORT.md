# TEST_REPORT · Export 2026-09-17-r1

Umgebung: Claude-Design-Vorschau (Chromium-basiertes Webview), three.js 0.184.0 von unpkg, Assets von `raw.githubusercontent.com`. Getestete Revision: Projektstand 2026-09-17, Sprint S32. Kein Git-SHA verfügbar.

| Prüfung (aus Exportauftrag §7) | Ergebnis | Beleg |
|---|---|---|
| Sauberer Start aus entpacktem Paket über HTTP | **NOT_RUN** | Das Paket wurde in dieser Umgebung nicht entpackt und nicht über einen eigenen HTTP-Server gestartet. Der Atlas läuft hier aus dem Projektverzeichnis, was nicht dasselbe ist. |
| Start im Projektverzeichnis, Konsole sauber | **PASS** | Auswahlliste 22 Einträge (21 Residents + Ensemble), `window.__atlas` vorhanden, Status „5 Objekte geladen · alle Pfade auflösbar". Konsole: zwei three.js-Deprecation-Warnungen (Clock, PCFSoftShadowMap), keine Fehler. |
| Asset-Laden, Soll/Ist mit Fehlpfaden | **TEILWEISE** | Pro Resident meldet das Panel geladene Objektzahl und „alle Pfade auflösbar". Ein systematischer Lauf über alle 21 mit Soll/Ist-Tabelle ist **nicht** gelaufen. Bekannter Fehlpfad: `Rig_Large_Tools.glb` existiert nicht (404, abgefangen, im Log als Warnung). |
| Szenenwechsel | **PASS** | Wechsel zwischen Goth Girl, Clown, Cleric, Hero Man, Demon Lord, Orc Warband, Prototype Pete, Animatronic und Ensemble durchgeführt. Sequenz-Guard gegen doppelte Vignetten greift (S20). |
| Ensemble | **PASS** | 21 Vignetten auf einer Bodenebene, Ebenen-Schalter verteilt nach sichtbaren Maßen neu. |
| Reset | **NOT_RUN** | Kein expliziter Reset-Pfad getestet. |
| Transform-/Preset-Erhalt | **TEILWEISE** | Studio-Korrekturen überleben einen Reload (localStorage). Ein Export→Import→Reload-Zyklus ist **nicht** getestet; ein Import-Pfad ist nicht gebaut. |
| Export→Import→Reload | **NOT_RUN** | Es gibt nur Export (`studio-patch.json`), keinen Import. |
| Generator-Reproduzierbarkeit | **N/A** | Dieses Projekt hat keinen Seed-Generator. |
| Mobile Bedienung | **NOT_RUN** | Nicht getestet. Die UI ist nicht responsiv, siehe `KNOWN_ISSUES.md` Punkt 5. |
| Unterpfad / Deep-Link | **NOT_RUN** | Nicht getestet. Die Seite hat keinen Router; Assets laufen über absolute Raw-URLs, ein Unterpfad sollte sie nicht betreffen — ungetestet ist das aber eine Erwartung, kein Ergebnis. |
| Fehlende Modellabhängigkeiten | **PASS (als Verhalten)** | Fehlende Clip-Sets werden abgefangen und als Konsolenwarnung gemeldet, der Bau läuft weiter. Fehlende Modelle erscheinen als OPEN-Punkt im Panel statt als Platzhalter. |

## Fachliche Messungen dieser Session (gegen die gebaute Szene, nicht gegen Prosa)

| Gegenstand | Messung |
|---|---|
| Orc Warband · Requisite ↔ Pfote | 0,005 / 0,017 / 0,007; ≤0,017 über sieben Clips |
| Orc Warband · Requisite ↔ Kopf | 0,228 / 0,024 / 0,026 |
| Animatronic · Anschlagarm ↔ Korpus | 5/5 Gelenke frei, 0,024–0,092 außerhalb der Silhouette |
| Cleric · Foliant | Identität an `handslot.r`, lokale Drehung 0,00°, Seitennormale senkrechter Anteil 0,85 |
| Hero Man · Blaster | `slotAxis` 90° lokal, Lauf [0,15 / 0,02 / 0,99] bei Blickrichtung +Z |
| Demon Lord · Herz | schwebend, 0,685 von der Figur, kein Faustdurchstich |
| Clown · Vorderebene ↔ HUD-Leiste | +57 bis +76 px über der Leistenoberkante |
| Bodenkontakt | Szenen-Minimum y = 0,000 in allen geprüften Vignetten |

Diese Werte sind von einem Prüf-Subagenten unabhängig nachgemessen und reproduziert worden. Ein **wiederverwendbares** Prüfskript existiert nicht — jede dieser Messungen wurde von Hand geschrieben. Das ist Scheibe D in `ATLAS_NEXT_SLICES.md` und die wichtigste offene Arbeit.