# ToolBox · Workflows und Recovery

## 1 · Session starten

GitHub-HEAD/PR und lokale Änderungen prüfen; zentralen Router-Delta lesen, dann lokalen START_HERE, Manifest und aktuellen Return. Den belegten letzten Stand fortsetzen. Keine fremde Sitzung als gelesen markieren. Autorenspezifische Altaufträge und Cleanup-Listen sind keine erneute Freigabe.

## 2 · Re-home ohne Neubau

1. Eingangsdateien bei Source-Commit pinnen; Checksums der tatsächlich erhaltenen Bytes erzeugen.
2. Unveränderte Standalones normal starten, Ressourcen-/Fehlerliste erstellen. Source-Housekeeping als Vergleich, nicht als Browser-PASS verwenden.
3. Originalen modularen Export mit der nötigen transitiven Closure erhalten. Gibt es nur Bundles: zuerst deren Ressourcenmanifest prüfen; Extraktion nur reproduzierbar, mit Pfad-/Hash-Zuordnung. Keine Rekonstruktion aus Beschreibung.
4. Einen Arbeitsbereich auf Branch einrichten, aktiven Source-Einstieg und Buildweg dokumentieren. Originalexport bleibt unverändert. Module nur einmal pflegen; Standalones daraus erzeugen.
5. Nur notwendige Hosting-/Font-/Adapterkorrekturen vornehmen. Wiederverwendung je Baustein REUSE UNCHANGED / ADAPT / DEFER / REJECT dokumentieren.

Fehlt eine Quelle für einen konkreten Fix, blockiert dies diesen Fix, nicht automatisch Navigation/Font-Fallback oder read-only Standalone-QA.

## 3 · Config bearbeiten

Profil bewusst auswählen; Herkunft und WIP anzeigen. Import nicht mit globalem Speichern verbinden. Bei Änderung Scope zeigen, Original bewahren, benannten Arbeitsstand exportieren. Semantischen Roundtrip und unveränderte andere Actors prüfen. Wechsel zwischen Tools zunächst explizit per Config; bestehende Session-Helfer nur nach Prüfung teilen.

## 4 · Font-Pass

Exakte CSS-/Template-/Canvas-/SVG-Nutzung inventarisieren. UI → normale Webfont/System-Fallback. Artwork → bisherige beabsichtigte Gestaltung bewahren oder optionales fehlendes Asset melden. Keine leeren 404-Referenzen weiter als erforderlichen UI-Pfad laden. Nach Font-Laden UND bei blockiertem Fontnetzwerk Panelmaße, Labels und Fokus testen. Nur tatsächlich weiter benötigte Gestaltungsschriften an Georg zurückgeben.

## 5 · Publizieren

Bestehenden Kayfabizarro-Kanal nutzen. Zunächst separate Vorschau, kein Überschreiben des Travel-B0/Bath-Mirrors. Gewählte URLs sind bis zum Abruf lediglich Ziele. Build-/Source-Identität, Pflichtdateien und echten Browser-Kaltstart prüfen. Keine allgemeine Hosting-Konfiguration für einen Tool-Fix umbauen.

Tool-Sites erhalten dezente Docs/LLM-Verlinkung auf diese Doku; keine doppelte Wissensdatenbank. `TOOLBOX_MANIFEST.json` liefert Discovery. Bei zusätzlich erzeugtem `llm-manifest.json` wird es aus diesem Manifest abgeleitet, nicht getrennt gepflegt.

## 6 · Consumer-Handoff

Actor/Config/Module nur gezielt exportieren, Quellen und Anpassung nennen. Travel/Combat/Podcast/Wissens-Pilli entscheiden Integration in ihrem Repo selbst. Kein pauschaler Automatismus v16→v17; keine Browser-Downloads aus privaten GitHub-URLs als gelösten Publishpfad behaupten. Nur ausdrücklich freigegebene Assets in öffentliche Builds.

## 7 · Intake / Archiv

`_inbox/<job-id>/` enthält zusammengehörige Anfrage, Originalquellen, Manifest, Notizen und Return-Links. Originale nicht bearbeiten. Nach bearbeitetem, angenommenem Ergebnis und aktualisierten Verweisen den vollständigen Job nach `_inbox/archiv/<job-id>/` verschieben. Wenn nötig am alten Pfad einen kleinen MOVED-Hinweis belassen.

`_archive/` hält ersetzte Release-/Dokumentationsstände der ToolBox; es ist nicht dasselbe wie das Jobarchiv. Nichts allein wegen einer Versionsnummer archivieren. Bestehenden Eingang vom 13.09. in T1 NICHT verschieben.

## 8 · Checkpoint / Abbruch

Vor riskantem Umbau und am Ende eines sinnvollen Arbeitsschritts committen bzw. Patch sichern, Return aktualisieren: exakte Revision, Source/Build/URL, geprüftes Ergebnis, offene Fehler, nächster konkreter Befehl oder Test. Uncommittierte lokale Dateien nicht als GitHub-gesichert ausgeben.

Frischer Chat: START_HERE → aktueller Return → GitHub-Abgleich → nur offene Arbeit. Kein Gesprächsdump und kein neuer Gesamtplan nötig.
