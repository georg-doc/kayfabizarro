# Project SSOT · Philosophischer Sparringspartner

Status: **PILOT v0.9 R8 / candidate** (kein veröffentlichtes Chat-Produkt, kein KFB-Runtime-Modul)  
Owner: Philosophie-Sparringspartner Sidequest · **ein** Inhalt-/Skill-Owner  
Repository: georg-doc/kayfabizarro (public)  
Branch: planning/philosophy-sparring-webchat-mvp-2026-10-31  
Outcome: Ein **vollständig kopierbarer, modellübergreifender deutschsprachiger Startprompt**, einen quellenbewussten Wissens-/Evaluationspool und ein **research-basiertes, vorsichtiges Adapter-/Intake-Konzept** für technisch unerfahrene ChatGPT- und Claude-Nutzer.

## Entscheidungen

- Public ist für **generische Skill-Anweisungen und freigegebene Quellenlisten** geeignet; nicht für die persönlichen Rohtexte.
- Vorerst **Unterverzeichnis** im bestehenden öffentlichen Repo, kein weiteres Repository.
- Webchat-first; keine API, keine App, kein Site/Stage, keine automatische GitHub-Persistenz.
- Bibliografie klein und benutzbar, Ausbau erst nach bevorzugten Autoren und tatsächlich genutzten Editionen.
- R1: Gegenprüfung nur bei sachlichem Mehrwert (kein Widerspruchs-Automat), essaybasierte Hermeneutik ohne unbeauftragtes Lektorat; Golden Samples G1–G7.
- R1: KFB Author Dossiers als in Drive nachgewiesene **Quellen-/Struktur-Donors**. Kein Transfer privater Dokumentinhalte in Public GitHub; Quellenkern und KFB Satire-Adapter getrennt.
- R1: Für Essays ein **privates, noch nicht existierendes/zugänglich bestätigtes** GitHub-Inbox-Repo `georg-doc/philosophy-sparring-inbox` empfehlen; private Google Drive Ablage als Alternative. Öffentlich nur freigegebene Ableitungen.
- Sprachduktus: Deutsch, kenntnisreich, dialogisch, weder pädagogisierend noch sycophantisch.
- R2: **Nontriviality Gate** für gehaltvolle Essay-Diskussionen; lehrbuchartige Fragen ohne zusätzliche argumentative Konsequenz als Fehlverhalten markiert. G8/G9 als neue Negativtests, insgesamt G1–G9.
- R2: Manuell gesetzte Endnoten in DOCX als vorhandene Quellenhinweise erkennen, auch wenn die technischen Word-Fußnoten-Parts fehlen. Einzelne bibliografische Einträge bleiben bis zur Prüfung offen.
- Nutzerfeedback zum vorigen G7-Gesprächseinstieg = **FAIL / TOO TRIVIAL**, nicht als Autorenfeedback umdeuten. Privat eingelesene Manuskripte bleiben privat.
- KFB später nur mögliche Content-/Design-Quelle. Bestehende ChatterBox/NPC/Lore/World-Owners bleiben unverändert.

- R3: Wenn die vom Nutzer bezeichnete Originalfassung eine vorherige Bearbeitung ersetzt, müssen Deutungen und Belegstatus der Bearbeitung explizit superseded werden. Methodik: `SOURCE_FIDELITY_R3.md`, `TEST_REPORT_R3.md`. Keine Veröffentlichung privater Originale.
- R3: 11 Golden-Cases dokumentiert, G10 Original vs. Derivat, G11 Fußnoten pro Version. Strukturelle R3 Checks 12/12; keine neuen Autor-Abnahmen.

- R4: Für KI-/Bioethik-Sparring technisch realisierte, hypothetische und normative Ebenen trennen. Therapie, freiwilliges Enhancement, Zwang/Selektion, Verantwortlichkeit, Anfechtbarkeit und spätere Autonomie nicht in einer Mensch/Maschine-Gegenüberstellung auflösen. `TECH_ANTHROPOLOGY_R4.md` ist allgemeine Methodik, kein privates Autorenprofil.
- R4: `GOLDEN_SAMPLES.md` G1–G13 (13 spezifizierte Fälle); `TEST_REPORT_R4.md` dokumentiert 14/14 statische Checks. Autor-/Human-PASS: weiterhin keine neue Abnahme.

- R5: Medizinethik und relationale Autonomie differenzieren: Einwilligungsfähigkeit ist nicht gleich Zustimmung oder medizinische Vorteilhaftigkeit; Patientenwiderspruch nie pauschal psychologisch deuten. Rechts-/Leitlinienstand und Jurisdiktion beachten. Siehe `RELATIONAL_AUTONOMY_R5.md`.
- R5: `GOLDEN_SAMPLES.md` G1–G15, neues `TEST_REPORT_R5.md` mit 16/16 Strukturchecks. 0 neue Autor-Abnahmen, private Quelltexte bleiben privat.

- R6: Wirksamkeitserwartung, tatsächlichen Einfluss, Erfolgsgarantie und normative Erlaubnis auseinanderhalten. Bei Theoriekritik den stärksten belegten Text prüfen; direkte, stellvertretende und kollektive Agency sowie Vulnerabilität unterscheiden. Öffentliche Methodik in AGENCY_VULNERABILITY_R6.md.
- R6: Golden Samples G1–G17; TEST_REPORT_R6.md dokumentiert 16/16 statische Checks. Keine neue Autor-Abnahme; privates Manuskript nur im Chat.

- R7: Metaanalyse prüft Denkbewegung, argumentative Last, Textton, Duktus, Referenzen und Denktraditionen neben Themen; `THOUGHT_STYLE_R7.md`, `UNCERTAINTY_DECISIONS_R7.md`, `TEST_REPORT_R7.md`. Vier neue synthetische Goldens G18–G21; 20/20 Strukturprüfungen PASS.
- R8: **Retrospektiver symmetrischer Vergleich aller sechs vom Nutzer als Originale bezeichneten Texte**, nicht bloß letzter Essay. Eine Bearbeitung ausdrücklich als Derivat ausgenommen. Acht identische Kategorien pro Original, Gegenbelege, O1/O2/I1/P1/X, Stil/Genre-/Recency-Vorbehalte, getrennte bestätigte Präferenzen. Öffentliche generische Methode: `BALANCED_CROSS_CORPUS_R8.md`; konkrete Korpusmatrix und Kontextkarte **privat, eigentümergeführtes Google Doc** ohne öffentliche URL im GitHub.
- R8: Starter v0.9, 24 Golden-Samples spezifiziert; 7/7 Readback und 24/24 statische Tests PASS (`TEST_REPORT_R8.md`). Keine neue Autor-/Human-Abnahme, kein Profil- oder Manuskript-Public-Write.

## Scope-Grenzen

Kein Profil des Vaters, keine nicht autorisierten Essays, kein personenbezogenes Gesprächsarchiv. Keine Behauptung, dass LLMs öffentliche URLs zuverlässig laden, dauerhaft erinnern oder ohne Berechtigung auf GitHub schreiben. Keine Modell-/Free-Tier-Zusage jenseits verifizierter offizieller Hilfeseiten.

## Next gate

**Ein vom Nutzer/Autor begutachteter, quellengebundener Cross-Corpus-Dialog**, der zwei verschiedene Originale und ein Gegenbeispiel integriert, echte argumentative Neuerkenntnis und nicht bloß Themenaggregation liefert. Kein Merge ohne ausdrückliche Freigabe.
