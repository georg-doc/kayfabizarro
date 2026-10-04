# Arbeitsauftrag · frischer KFB ToolBox v1 Produktionschat

Status: DECISION / EXECUTION BRIEF · 2026-09-14

Du übernimmst die ToolBox-Produktion in `georg-doc/kayfabizarro/tools/KFB-ToolBox/`. Georg muss keine Git-/Branch-/Merge-Arbeit übernehmen. Die Spiele bleiben unberührt. Dieser Auftrag ist kein Neubau von Studio/Rigging/Animation und kein Auftrag, die ganze Produkt-Roadmap neu zu entwickeln.

## Zuerst

Lies zentral `skills/chat/START_HERE.md` und relevante Registry/SOP-Deltas. Dann lokal `START_HERE.md`, `MASTERPLAN.md`, `TOOLBOX_MANIFEST.json`, `docs/SOURCE_AUDIT.md`, `docs/SPEC.md`, `docs/CONTRACTS.md`, `docs/DELIVERABLES.md`, `docs/FONTS.md`. Lies einen neueren lokalen Return zuerst, sobald vorhanden. Aktueller GitHub-Zustand hat Vorrang vor diesem Snapshot.

## Lieferziel

Drei funktionierende, erhaltene Werkzeuge über einen dezenten ToolBox-Einstieg:

- FrankenStein Studio v17;
- Rigging Lab v1;
- Animation Lab v2, offen als WIP gekennzeichnet bis seine Gates bestanden sind.

Derselbe FrizzleBob Driver Graft und dieselbe Config sollen zwischen Studio und Animation verwendbar sein; CapsuleCarl bleibt eigenständiger Actor. Talk on/off und vorhandene Modifier/Viseme-Zuordnung reichen zunächst. Kein Pflicht-Lip-Sync, keine neue zwölfteilige Clip-Produktion.

## Arbeitsfolge

1. Aktuellen HEAD/PR prüfen, Arbeitsbranch anlegen, Eingangs-SHAs sichern. Unveränderte Standalones starten. Die Quellenlage zeigt nur 14 Exportdateien, keinen losen Modulbaum: vor nachhaltigen Codeänderungen Original-Source-Closure/Buildweg beschaffen oder Bundle reproduzierbar erschließen.
2. Bestehende Funktionen erhalten und erreichbar machen. Vorhandenen Kayfabizarro-Pages-Weg bevorzugen; keine neue Cloudflare-Verbindung als Vorbedingung. Originale nicht überschreiben.
3. UI-Font-Pass durchführen: normale lesbare Webfont (Referenz Roboto) + System-Fallback. Kein Special Elite/Fonteys/Brandfont für Controls. Logos/Poster/Artwork getrennt erhalten. Georg muss dafür zunächst keine Fontdateien nachliefern.
4. Config-Rundreise und Graft-Default prüfen, nur echte Lücken beheben. Onboarding kann älter als Bundle sein. Kein Schema-Split erzwingen; `kfb.pets/1` erhalten, keine WIP-Palette zum Kanon machen, keine fremden Drafts überschreiben.
5. Normale Browser-QA, Öffentlichkeit/Build-Identität, Readability, Talk/Mods/Clips/Reload/Focus nach DELIVERABLES prüfen. Fehlende Prüfungen NOT_TESTED nennen.
6. Vorschau + kompakter Return an Georg. Sichtbares T1-Ergebnis zur Abnahme, danach Merge/Release gemäß erteilter Projektbefugnis. Quellen und ToolBox-Docs mit Commit/Build-Pins aktualisieren.

## Freiheit und Stop-Grenze

Technische Detailplanung und Routinefixes innerhalb dieser Grenzen selbst übernehmen. Kein Stop nur weil ein Regler oder Fontpfad repariert werden muss. Bei fehlenden entscheidenden Originalquellen, Owner-/Formatwechsel, unklaren endgültigen Look-Entscheidungen oder wesentlicher Scope-Erweiterung den konkreten Punkt melden und unabhängige Arbeiten fortsetzen.

Kein Schreiben in Travel/Combat/Stunt/Wissens-Pilli. Keine globalen Material-/Physik-/Kamera-Fixes, um eine Tool-Vorschau passend aussehen zu lassen. Greenfield-Nachbauten und automatische Registry-Promotion sind nicht genehmigt.

## Rückgabe

`RETURN.md` hier anlegen (Template daneben). Exakte Quelle, bearbeitete Dateien, Buildweg, URL, Tests, offene WIP-Gates, nächste Handlung. Changelog additiv, kompletter geordneter Handoff-ZIP mit Manifest/Checksums; keine Font-Binaries/Secrets. Screenshots nur für konkrete Aussagen.

Beginne mit Quellen-/Startprüfung und setze danach T1 fort. Keine neue Vollübergabe von Georg verlangen, solange die benötigten Quellen hier verlinkt sind.
