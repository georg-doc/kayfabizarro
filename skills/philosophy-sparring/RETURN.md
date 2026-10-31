# RETURN · Philosophischer Sparringspartner Webchat MVP v0.1

Datum: 2026-10-31  
Status: **IMPLEMENTED / STATIC VERIFIED / DRAFT PR / REAL MODEL TEST PENDING**  
Owner: Philosophischer Sparringspartner Sidequest (ein Content-/Skill-Owner)  
Repository: **georg-doc/kayfabizarro** (öffentlich)  
Branch: **planning/philosophy-sparring-webchat-mvp-2026-10-31**  
Draft PR: **https://github.com/georg-doc/kayfabizarro/pull/463** (gegen main, unmerged)  
Verified implementation/evidence commit: **592bf786d2c996d1e06df7a8ca5f80c08858d481**  
Aktueller Branch-Head bei Wiederaufnahme: über GitHub-Ref prüfen (dieses Return-Commit selbst erhält eine neue SHA).

## Outcome

Eine eigenständige, deutschsprachige, plattformagnostische Skill-Basis existiert im bestehenden öffentlichen KFB-Repository, unmittelbar aus normalen ChatGPT-/Claude-Webchats nutzbar durch Copy/Paste des vollständigen STARTER_PROMPT.md. Keine GitHub-Plugin-Pflicht beim Endnutzer; keine automatische Persistenz vorgetäuscht.

## Dateien

- README.md — nutzerorientierter Einstieg
- SKILL.md — portabler Skill-Vertrag
- STARTER_PROMPT.md — selbsttragender Prompt mit neun Modi
- MODES.md — Moduswechsel und adaptive Gesprächsführung
- RESEARCH_PROTOCOL.md — A/B/C/D-Evidenz, Zitatprüfung
- SOURCES_SEED.md — 11 kuratierte Quelleneinstiege, keine Zitatverifizierung
- ONBOARDING.md — freiwilliges Gespräch zu Präferenzen
- PROFILE_TEMPLATE.md — unbefüllte private Vorlage
- SESSION_HANDOFF.md — manueller Cross-LLM-Sitzungstransfer
- GOLDEN_SAMPLES.md — fünf erwartete Verhaltensfälle
- PROJECT_SSOT.md — Scope und Owner
- TEST_REPORT.md — tatsächliche statische Checks
- RETURN.md — dieses Handoff
- CHANGELOG.md — additive Meilensteine

## Tests / Evidence

GitHub-readback: **11/11** Implementierungsdateien aus dem Branch gelesen; **8/8 statische Checks PASS**. Zwei Redaktionsfehler wurden im Evidenz-Checkpoint korrigiert und die betroffenen Dateien aus dem Branch zurückgelesen. Produkt-/Modelltest: **0/5 Golden Samples ausgeführt**, noch kein empirischer Dialog-PASS. Externe Quellenzugänge und Plattform-Hilfeseiten punktuell über Webrecherche bestätigt; keine globale Quellen-Zitatprüfung. Kein Code, keine Browser-App, kein CI-Lauf, keine Stage/Site, keine Screenshots notwendig.

## Geschützte Grenzen

- Kein neuer KFB-Runtime-Owner, kein ChatterBox-/NPC-/Audio-/World- oder Hub-Write.
- Keine Site, keine Cloudflare-Stage; das öffentlich erreichbare Repository ist eine Quellablage, keine KFB-Produktakzeptanzfläche.
- Kein auto-merge, keine Live-Promotion.
- Persönliche Essays, Gesprächsprotokolle und Familieninformationen werden nicht in das öffentliche Repo geschrieben, bevor Textrechte und ausdrückliche Einwilligung geklärt sind.

## Offen / deferred

- Tatsächlicher Sprachduktus und Irritationskorrigierbarkeit in ChatGPT Free und Claude Free nicht beobachtet.
- Vorlieben/Editionen des Vaters noch nicht erhoben; keine Annahmen über sein Glaubensprofil.
- Ausbau eines geprüften autoren- und werkbezogenen Primärtextkorpus folgt aus tatsächlichen Interessen, nicht aus vorschnell ungerichteter Massenrecherche.
- Persistenz: zunächst manueller Sitzungsnotiz-Transfer; spätere private Storage-/GitHub-Schreibintegration erst bei Bedarf.

## Genau ein nächster Gate

**Real-Dialog-Pilot:** Ein regulärer Webchat mit dem Vater bzw. ein begleiteter Test anhand GOLDEN_SAMPLES G1–G5; echte Antworten und Nutzerfeedback **privat** erfassen, besonders Formalismus, konstruktiver Widerspruch und Quellenredlichkeit beurteilen. Danach zielgerichtet v0.2 überarbeiten. Keine PR-Merge- oder KFB-Runtime-Freigabe durch diesen Test vorwegnehmen.
