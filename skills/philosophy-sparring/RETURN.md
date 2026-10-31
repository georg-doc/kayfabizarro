# RETURN · Philosophischer Sparringspartner v0.3 R2

**Stand:** 2026-10-31  
**Status:** R2 IMPLEMENTED / STATIC REVIEW PASS / G7 USER-FEEDBACK FAIL / R2 MODEL/HUMAN REVIEW PENDING / DRAFT PR  
**Owner:** Philosophischer Sparringspartner Sidequest (ein Inhalt-/Skill-Owner)  
**Repo:** `georg-doc/kayfabizarro` (public)  
**Branch:** `planning/philosophy-sparring-webchat-mvp-2026-10-31`  
**Draft PR:** https://github.com/georg-doc/kayfabizarro/pull/463 (main, UNMERGED)  
**Research/evidence checkpoint:** `f92324ce8c0879e007103a0d2f0fbec67872eccf`  
**Aktueller HEAD:** bei Wiederaufnahme **Branch-Ref neu lesen**; dieser Return-Write erzeugt einen weiteren Head.

## Was funktioniert

- Ein vollständiger kopierbarer deutschsprachiger Prompt zur Verwendung in gewöhnlichen Webchats (ChatGPT/Claude), ohne Plugin-Pflicht, unter `STARTER_PROMPT.md`.
- Neun Dialogmodi, kontextsensitiver Stil und quellenbewusste Regeln.
- R1: Gegenprüfung bedarfsorientiert, eigenes Essay-Material texttreu behandeln, stärkste Position/Gegenposition, Quellen- und Begriffsarbeit.
- R1: Community-/Forschungs-Prompt-Donors mit Adopt/Reject, identifizierte KFB-Author-Dossier-Strukturen und ein gemeinsamer Research-Core **als Vorschlag**, privater Intake-Plan.
- Sieben spezifizierte Golden Samples und zwei getrennte statische Testberichte.

## Geänderte/geprüfte Dateien in R1

- `README.md`, `STARTER_PROMPT.md`, `SKILL.md`, `RESEARCH_PROTOCOL.md`, `GOLDEN_SAMPLES.md`.
- `RESEARCH_PATTERNS_R1_2026-10-31.md` (neu).
- `DOSSIER_BRIDGE_R1.md` (neu).
- `INBOX_ROUTING_R1.md` (neu).
- `RESEARCH_TEST_REPORT_R1.md` (neu).
- `PROJECT_SSOT.md`, `CHANGELOG.md`, `RETURN.md` (Handoff aktualisiert).
- Alle übrigen Skill-Dokumente bleiben erhalten, darunter `MODES.md`, `ONBOARDING.md`, `SOURCES_SEED.md`, `SESSION_HANDOFF.md` und `PROFILE_TEMPLATE.md`.

## Echte Tests & Belege

- R1 Dokumenten-Readback: **8/8** relevante Implementierungs-/Recherchedateien; **12/12** statische Strukturprüfungen PASS, siehe `RESEARCH_TEST_REPORT_R1.md`.
- Voriger MVP Static Check: 8/8, dokumentiert in `TEST_REPORT.md`.
- Web-/Forschungsquellen mit URLs und Grenzen dokumentiert in `RESEARCH_PATTERNS_R1_2026-10-31.md`. Zwei existierende Google-Drive-Dossiers strukturell gelesen, nicht als wahrheitsgeprüfte externe Evidenz interpretiert.
- **G7 einmal mit einem privaten Word-Manuskript textgebunden durchlaufen**; **0/7** Fälle mit dem Verfasser evaluiert; G1–G6 nicht ausgeführt. Manuskript/identifizierende Inhalte **nicht** öffentlich persistiert.
- Kein Live/Site/Stage/Cloudflare; öffentlich ist lediglich der Branch-Quellcode. Keine visuelle QA/Screenshots für dieses reine Dokumentprojekt.

## Unresolved & Deferred

- `georg-doc/philosophy-sparring-inbox` ist **NICHT ANGELEGT**; verwendete GitHub-App bietet hier keine Repo-Erstellung. Der zuvor benannte KFB-Production-Inbox ist für diesen GitHub-Connector nicht erreichbar (404 = keine sichere Existenz-Aussage).
- Für persönliche Texte **nicht** das öffentliche Repository verwenden, sofern Autor und Rechte/Freigaben nicht eindeutig geklärt sind.
- Google-Drive- und NotebookLM-Sync ist eine mögliche Quellenarbeitsansicht, **kein** eingerichteter Prozess. Bei Google-Dateiimport können Fußnoten/Kommentare fehlen; im Original gegenprüfen.
- Bestehende KFB Author Dossiers weiterhin bei ihren derzeitigen Eignern. Kein neuer Dossier-Kanon oder KFB/ChatterBox-Owner.
- Später: autorenspezifisch verifizierte Primärtexte/Editionen sowie Freigabe-/Kontextschema, bevor satirische KFB-Adaption erfolgt.

## Additiver G7-Nachweis vom 2026-10-31

- Erste private DOCX-Vorlage in diesem Chat gelesen; im Original keine OOXML-Fußnoten, Kommentare oder redigierten Änderungen. **Privater Inhalt und Dateiname nicht in diesem öffentlichen Return.**
- Regelkorrektur in `RESEARCH_PROTOCOL.md` und `GOLDEN_SAMPLES.md`: Bei fehlenden Fußnoten zwei Quellenanker **vorschlagen**, nicht angeblich vorhandene Fußnoten zitieren.
- Ergebnis bleibt **Modell-Selbsttest / HUMAN_UNREVIEWED**, nicht Golden-PASS. Der private Detailbericht liegt als separat übergebenes Chat-Artefakt, nicht im GitHub-Repo.
- Die Änderungen sind auf dem aktuellen Branch eingecheckt; technische Grundlage: `320871d46aac6ad2c8d8d9e94a3adf648b989baa`.

## Genau ein nächstes Gate

**Ein echtes vertieftes, quellenbewusstes Gespräch nach R2/G8 testen und durch den Nutzer oder Verfasser bewerten lassen.** Entscheidender Maßstab: mindestens eine argumentative Konsequenz, die über eine geläufige Lehrbuchunterscheidung hinausgeht. Keine automatische Profilübernahme, kein PR-Merge.

## Additiver R2-Nachweis vom 2026-10-31

- Vorheriger G7-Frageeinstieg durch Georg als zu trivial beurteilt: **HUMAN FEEDBACK FAIL**, niemals als Verfasserurteil behandeln.
- Zweites privates DOCX methodisch geprüft; sichtbarer **manuell nummerierter Schlussapparat** trotz fehlender Word-OOXML-Fußnotenstruktur. Weder Manuskript, bibliografische Liste, Titel noch identifizierende Inhalte öffentlich übernommen.
- R2-Skilländerungen: echte argumentative Tiefenprüfung, eigene Voraussetzungen testen, historische Gegenquelle nur bei konkretem Mehrwert; G8 und G9 als Negativtests (neun Fälle insgesamt).
- `QUALITY_DEEP_DIALOGUE_R2.md` dokumentiert das öffentliche, abstrakte Design und **nur öffentliche externe Quellen**.
- `TEST_REPORT_R2.md`: 6/6 Dateireadbacks, 12/12 statische Checks PASS. Keine R2-Gesprächs- oder Autor-Abnahmen (0).
- Implementationscheckpoint `1e2f36cdd26b5effb5d0796f1e8584b5affae7a2`; Evidence-Checkpoint `bd767e2198d0c93f466b92dbb9327c7c65be17a3`.
- Private Analyse ist nur als separates Chat-Artefakt vorhanden; keine öffentliche Übertragung personenbezogener Notizen.
- Project Owner und Draft PR #463 bleiben unverändert, keine Runtime-/Hub-/Site-/Stage-Änderung.
