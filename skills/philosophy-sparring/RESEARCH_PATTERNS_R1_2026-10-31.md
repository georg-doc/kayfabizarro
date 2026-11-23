# Research R1 — Philosophische KI-Dialoge und Prompt-Donors

Datum: 2026-10-31  
Status: **RESEARCH / DONOR AUDIT / PROPOSED ADOPTION**. Kein experimenteller Nachweis der Wirksamkeit des KFB-Skills.

## Quellenbefunde

| Donor | Beobachtung und Eingrenzung | Konsequenz für diesen Skill |
| --- | --- | --- |
| [r/ChatGPT Anti-Sycophancy-Prompt, 2025](https://www.reddit.com/r/ChatGPT/comments/1ijr08f/a_prompt_to_avoid_chatgpt_simply_agreeing_with/) | Fünf Prüffragen: Annahmen, Gegenargumente, Schlusslogik, alternative Perspektiven, Vorrang von Wahrheit. Stark geteilte Community-Vorlage, kein kontrollierter Wirksamkeitsnachweis. | **ADAPT**: sachliche Prüfung; nicht bei jedem Satz eine fünffache Schablone. |
| [r/ClaudeAI: Recent anti-sycophancy, 2026](https://www.reddit.com/r/ClaudeAI/comments/1uhabkj/recent_antisycophancy/) | Nutzer berichten über formelhafte automatische Einwände („I want to push back“). Anekdotisch und modellabhängig. | **NEGATIVE GOLDEN**: kein erzwungener Widerspruch pro Antwort. |
| [r/ChatGPT: philosophize with ChatGPT?, 2026](https://www.reddit.com/r/ChatGPT/comments/1vmqnmc/do_you_guys_ever_philosophize_with_chatgpt/) | Einige Teilnehmende bevorzugen offene, nicht voreilig abschließende Exploration; lose Gedanken statt ausgearbeiteter Fragen. Anekdoten. | **ADAPT**: freie Gedankenbewegung und argumentative Wanderung zulassen, kein voreiliges Fazit. |
| [r/PromptEngineering: Co-Dialectic, 2026](https://www.reddit.com/r/PromptEngineering/comments/1s2ro0s/everyones_talking_about_socratic_prompting_heres/) | Vorschlag einer fünfteiligen Multi-Task-Architektur; keine robuste unabhängige Effektivitätsmessung im Thread. | **IDEA ONLY**: als rationale Teilfunktionen umformulieren; kein Multi-Agent-Pflichtsystem oder Hintergrundprozess im Free-Webchat. |
| [University of Connecticut: Socratic Questions](https://cetl.uconn.edu/resources/teaching-your-course/leading-effective-discussions/socratic-questions/) | Kategorien für Prämissen-, Klärungs-, Evidenz-, Konsequenz- und Perspektivfragen. Lehrressource, nicht Skill-Test. | **ADAPT**: je nach Gespräch eine tragende Frage, niemals ein Fragefeuerwerk. |
| [Manzocco et al. (2025), Educational Debate Bot](https://eric.ed.gov/?id=EJ1484875) | Strukturierte KI-Debatte als Lernsetting mit studentischen Teilnehmern. Nicht 1:1 auf persönliche philosophische Gespräche übertragbar. | **RESEARCH CONTEXT**: Bewertung echter Argumentationsqualität sinnvoll, keine Performance-Zusage. |
| [Xi et al., Computers & Education (2026)](https://doi.org/10.1016/j.compedu.2025.105494) | Untersuchung eines LLM-basierten sokratischen Gesprächsagenten und reflektierenden Denkens. Methodik/Sample separat bei Vertiefung prüfen. | **RESEARCH CONTEXT**: eine dialogorientierte Evaluation ist plausibel; keine Behauptung eines empirischen PASS für diesen Prompt. |
| [Anthropic: Prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables) | Klarer Kontext, wiederverwendbare Beispiele, konsistente Abschnittsstruktur, Dokumenten-Provenienz in langen Kontexten. | **ADAPT**: eigenständiger Starter-Prompt, Golden Samples, Quellencontainer für Essays. |
| [Claude Projects](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) | Free-Projekte möglich (derzeit bis fünf); Projektwissen geteilt, Chat-Kontext nicht automatisch über alle Unterhaltungen geteilt. | **OPTIONAL**: Projekteinrichtung als Komfort, kein Kernabhängigkeitsmodell. |
| [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) | Für Free nutzbar; derzeit bis fünf Projektdateien. Projektanweisungen und Quellen, aber keine garantierte GitHub-Synchronisierung. | **OPTIONAL**: kleines geladenes Projektpaket, sonst Copy-Paste. |
| [Google Notebook Help: Quellen](https://support.google.com/gemininotebook/answer/16215270) | Import von DOCX, Google Docs, PDF, Markdown etc.; Drive-Dateien können synchronisiert werden. Bei Docs werden Fußnoten/Kommentare nicht importiert. | **ADAPT**: Notebook als Arbeitsansicht für Quellen, nicht als revisionssichere Masterkopie oder editionskritischen Fußnotenparser. |

## Aus mehreren Quellen abgeleitete Designentscheidungen

1. **Kooperative Gegenprüfung, nicht Pflichtwiderspruch:** Das Modell prüft selbst, *ob* eine tragende Gegenposition existiert. Einwände müssen argumentativ etwas verändern; wenn nicht, inhaltlich fortschreiten.
2. **Sokratische Dosierung:** Höchstens eine entscheidende Rückfrage, wenn ohne sie eine falsche Interpretation droht. Auf Wunsch echter sokratischer Modus.
3. **Argumentkontinuität:** Vorläufige These und offene Spannung folgen dem Gespräch; ein Wechsel der Perspektive ist kein Verrat an der ursprünglichen Frage.
4. **Dokumententreue:** Besonders bei Essays nach Originaltext, Interpretation, Rekonstruktion, produktivem Gegenvorschlag unterscheiden; Originalzitat erst nach konkreter Sichtprüfung.
5. **Quellen- und Tool-Ehrlichkeit:** Weblinks nicht als gelesene Primärtexte ausgeben. Kein behaupteter Zugriff auf Google Drive, Notebook, GitHub oder Dateien ohne echte Verfügbarkeit.
6. **Menschliche Steuerbarkeit:** „Bleib bei meiner These“, „Mach den stärksten Einwand“ und „Keine Recherche, nur Begriffsarbeit“ sind natürliche Overrides. Keine Ritualsätze nötig.

## Nicht übernommen

- Pflichtschema „5 checks bei jeder Nachricht“ (ermüdet und verlässt die Hauptthese).
- Mehrere versteckte Agenten im Free-Webchat (nicht verifizierbar, unnötige Komplexität).
- Simulierte psychiatrische Sentimentdiagnosen (nur Textsignale für Stilveränderung beobachten).
- Erfundene personenbezogene Profile bzw. automatisches Hochladen privater Essays.
- Pauschale Behauptung, akademische Studien bewiesen die Wirksamkeit dieses konkreten KFB-Prompts.

## Offener Evaluationspunkt

Golden Samples G6 (keine mechanische Opposition) und G7 (Essayauslegung/Quelle) werden als Testspezifikation ergänzt. **Kein Live-Test ausgeführt.**
