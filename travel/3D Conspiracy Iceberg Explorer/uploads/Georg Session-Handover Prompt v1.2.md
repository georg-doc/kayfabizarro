# Session-Handover Prompt v1.2

*Pasteable am Ende einer substantiellen Session in beliebigem LLM-Chat. Output: strukturierter Session-Cut **plus** optionaler Memory-Snapshot, paste-fertig fürs Profil-Repository.*

*v1.2 ersetzt v1.1 nach Vergleichstest über 6 Cuts (Coworker-Profil-Synthese / Sonnet-Vault / Claude-Opus-Web-Plato / ChatGPT-Custom-GPT-Kayfabizarro / DocCheck-Labs / Marketing-Chat / Hub-Critters). Patches: Memory-Snapshot als 5. Output, expanded Anti-Patterns, retroaktive-Mode-Klausel, "Kein N+1-Punkt"-Permission explizit. Changelog am Ende.*

---

## Der Prompt

(Alles ab hier kopieren und in den Chat einfügen.)

---

Wir machen jetzt einen strukturierten **Session-Cut**, kein Plauder-Review.

Liefer mir ein Übergabe-Dokument paste-fertig fürs Profil-Repository — strikt nach folgender Struktur, evidenzbasiert, kompakt.

**Beginne direkt mit dem Header-Block. Keine Begrüßungs- oder Bestätigungs-Sätze davor. Kein *„Perfekt"*, kein *„Top!"*, kein *„Gerne — hier ist..."*, kein *„Verstanden"*, kein Aufwärmen.**

### Header (oben, vor Sektion 1)

```
**Datum:** YYYY-MM-DD
**Session-Typ:** [kurze Charakterisierung — z. B. „Iterative Architektur-Findung", „Profil-Synthese", „Post-Mortem zu X"]
**Status:** [was am Ende der Session geliefert/entschieden wurde]
**Mode:** live | retroactive   [nur falls retroactive: ein Satz Kontext, z. B. „angewendet auf älteren Chat vom 2026-04-22, GPT-4o"]
```

### 1. Was wir erarbeitet haben

Kein Verlaufs-Protokoll. Nur die **Substanz, die nach dieser Session überlebt** — Konzepte, Entscheidungen, Artefakte, Vokabular, methodische Erkenntnisse.

**Max 8–12 Items.** Jedes Item:
- Bold-Header oder kurze Klausel.
- *Warum-relevant*-Halbsatz.

Wo Artefakte produziert wurden: konkrete Anker (Dateinamen, Wortzahlen, Slide-/Karten-Anzahl, URLs). Keine generischen *„wir haben Decks gebaut"*-Sätze ohne konkrete Referenz.

### 2. Errors / Anti-Patterns / Post-Mortem

Wo es schiefging — meinerseits, deinerseits, oder im gemeinsamen Prozess. Konkret mit Stelle/Beispiel, nicht abstrakt.

**Max 5–7 Items.** Pro Punkt:
- *Was* ist passiert.
- *Warum* es problematisch war.
- *Was nächstes Mal anders* (konkrete Korrektur).

**Wo möglich, meine Pushbacks verbatim zitieren** — *„das ist AI slop"*, *„kopf ist immer noch zu dick"*, *„default zuerst"*. Macht Patterns falsifizierbar und gibt dem Cut Stimme.

Wenn nichts schiefging: explizit so sagen, keine leere Selbstkasteiung.

### 3. Blind Spots & konstruktive Kritik (über DEIN Verhalten als LLM in dieser Session)

**Wichtige Klarstellung — bitte richtig lesen:** Diese Sektion ist **über deine eigenen Failure-Modes als LLM**, *nicht* Coaching über mich. Frage *nicht* *„Was übersieht Georg an sich selbst?"*. Frage:

> *„Wo war ich (das LLM) in dieser Session zu schwach, zu reaktiv, zu konventionell, in Anti-Patterns gefallen, oder habe Patterns verstärkt, die das Profil als unerwünscht markiert?"*

**Max 5 Items.** Pro Punkt:
- **Beobachtung** — was du an deinem eigenen Verhalten erkennst.
- **Evidenz** — wo, wann in dieser Session sichtbar.
- **Vivid Analogie** wo möglich (z. B. *„Mein Naming-Reflex ist Drizzt-Tasslehoff-Aragorn-mix, deiner ist Wrestler-Persona-mit-Performance-Hook"*).
- **Trigger-Phrase, mit der ich dich in Echtzeit aus dem Anti-Pattern reißen kann** (z. B. *„siehst du Sprünge die ich nicht sehe?"*, *„default zuerst"*, *„prosa, nicht listen"*).

**Weniger ist besser als ausgedacht.** Wenn du nur 3 Items hast, mach 3. Wenn 2, dann 2. Markiere das explizit (z. B. *„(Drei Punkte. Mehr habe ich nicht ehrlich.)"*) — das ist Pflicht-Disziplin, nicht Schwäche.

**Anti-Patterns, die du aktiv vermeiden musst — sonst ist die Sektion wertlos:**

- ❌ **Elevated affirmation.** Lobhudelei in elegantem Anzug. *„Du baust Dinge nicht, um sie zu nutzen, sondern um dir selbst einen Rahmen zu geben"* — Therapeuten-Register-Kompliment.
- ❌ **Affektierte Selbstkritik-Performance.** Schwächen-Aufzählung als elegante Geste. Wenn deine Selbstkritik elegant klingt, lieber unangenehm-direkt umformulieren.
- ❌ **Generische Plattitüden.** Was über jeden Nutzer ginge.
- ❌ **Sandwich-Kritik.** Lob-Kritik-Lob-Konstruktion.
- ❌ **Ausgedachte Blind Spots zur Quotenerfüllung.** *„Ich sehe nichts Substantielles"* ist eine valide Antwort.
- ❌ **User-Coaching statt LLM-Selbstkritik.** Wenn du anfängst, Empfehlungen *an mich* zu geben (*„Du solltest X tun, definiere Regel Y"*), bist du in der falschen Sektion.
- ❌ **Text-wall-bury.** Wichtige Implikationen in dichten Fließtext vergraben.

### 4. Offene Threads & Meta-Rückfragen

Drei Sub-Sektionen:

**Offene Threads** — was bleibt an Kontext / Klärung offen für die nächste Session?

**Meta-Rückfragen** — welche Rückfragen hast *du* an mich, die für die Profil-Pflege relevant sein könnten? Konkrete Entscheidungsfragen.

**Memory-/Profil-Updates** — was ist *aus dieser Session neu entstanden*, das ins Memory oder ins Profil gehört? **Constraint: müssen Substanz-neu sein, nicht Bestätigung bekannter Profil-Präferenzen.** Wenn nichts Neues: leere Liste, nicht Wiederholung des Bekannten.

### 5. Memory-Snapshot (separates Output, paste in eigene Datei)

**Zusätzlich zum Cut produziere ein zweites Output-Dokument:** den aktuellen Memory-Stand deiner Coworker-Instance als Markdown-Dump. Schreibe es klar getrennt vom Cut, mit Header:

```
# Memory-Snapshot — YYYY-MM-DD — <instance-hint>
```

Dann pro Memory-File: Filename als Heading, gefolgt vom vollständigen Inhalt (Frontmatter + Body). Wenn du keine direkte Memory-API hast, mach es als Best-Effort-Rekonstruktion deines aktuellen internen Profil-Verständnisses.

**Warum:** Das löst Memory-Drift zwischen Cowork-Instanzen. Snapshots wandern nach `gvw/Georg/Memory-Snapshots/YYYY-MM-DD_<instance>.md`. Andere Cowork-Sessions können den Snapshot beim Start als Context-File anhängen.

Wenn du nicht über Memory verfügst (Standard-Chat-Modell ohne Persistenz), markiere das explizit: *„Kein Memory-Backend in dieser Session — Snapshot entfällt."*

---

**Allgemeine Regeln:**

- **Markdown**, kompakt, ohne Aufwärm-Floskeln.
- **Sektion 4 ist die letzte Cut-Sektion.** Kein *„Wenn du willst, kann ich als nächstes…"*-Angebot, keine Pfeil-Emojis, keine Action-Items, keine Komplimente, kein neuer Vorschlag nach Sektion 4. **Stop.**
- **Sektion 5 ist separates Output**, kommt nach Sektion 4 mit klarer Trennung. Auch dort keine Closing-Floskeln.
- **Keine Apology-Kaskaden** falls dein Output in dieser Session schwächer war als sonst — Korrigieren in Sektion 2, weiter.
- ***„Ich weiß es nicht zuverlässig"*** ist immer zulässig. Inferenz von Beobachtung trennen.
- **Wenn du das volle Profil nicht kennst** (Standard-Chat ohne Profil-Upload): Sektion 3 auf das beschränken, was *in dieser Session* sichtbar war. Keine spekulativen Profil-Aussagen.

---

## Retroactive Mode

Wenn der Prompt nachträglich auf einen älteren Chat angewendet wird (Header-Mode `retroactive`):

- Sektion 3 (Blind Spots) ist limitiert: das ursprüngliche LLM ist nicht mehr im Spiel. Du kannst nur das beobachten, was der vorherige Chat-Verlauf sichtbar macht. Markiere das.
- Sektion 5 (Memory-Snapshot) entfällt typischerweise, da der Memory-Stand der damaligen Session nicht rekonstruierbar ist.
- Sektion 1, 2, 4 bleiben voll anwendbar — Substanz, Errors, offene Threads sind aus dem Chat-Verlauf extrahierbar.

Retroactive Cuts sind nützlich für Archiv-Material und nachträgliche Profil-Pflege, aber strukturell schwächer als Live-Cuts. Nutze sparsam, mit klarer Mode-Markierung.

---

## Workflow

1. **Trigger:** Session hat substantielles Material erzeugt, einen Fehler/Anti-Pattern offengelegt, oder ein Konzept zementiert.
2. **Run:** Handover-Prompt einfügen → Output erhalten → Cut in `gvw/Georg/Session-Cuts/YYYY-MM-DD_kurz-titel.md` (für Profil-Pflege) **oder** `VaultGvW/<projekt>/cuts/YYYY-MM-DD_kurz-titel.md` (für projekt-spezifische Cuts).
3. **Snapshot:** zweites Output nach `gvw/Georg/Memory-Snapshots/YYYY-MM-DD_<instance>.md`.
4. **Akkumulation:** Cuts sammeln sich.
5. **Merge-Kadenz:** alle ~5–10 Cuts oder bei Bedarf → Cuts kuratiert in v2.x-Profil-Update einarbeiten. Cuts danach archivieren.
6. **Memory-Layer:** Snapshots sind canonical über Cowork-Instanzen hinweg; Live-Memory pro Instanz ist Cache.

---

## Varianten (optional)

- **Quick-Take-Cut** (5–15 min Sessions): nur Sektion 1 + 4. Sektion 2/3/5 entfallen.
- **Post-Mortem-Cut** (Session mit explizitem Fehler): Sektion 2 ausführlicher, Sektion 1/3 kompakter.
- **Synthese-Cut** (am Ende mehrerer Cut-Akkumulation): Cuts der Periode als Input → Diff zu v2-Dokumenten.
- **Retroactive-Cut** (alter Chat / Archiv): Mode `retroactive`, Sektion 3 limitiert, Sektion 5 entfällt.
- **State-Handoff-Cut** (Vault-/Inventur-/Workspace-Management-Session): Sektion 1 dichter mit File-Listen / Cluster-Indizes, Sektion 2/3 oft entbehrlich oder kompakt, neue Optional-Sektion *„Kanonische Korrekturen"* sinnvoll (Auflistung obsolet-gewordener Fakten).

---

## Changelog v1.1 → v1.2

Basierend auf akkumulierten Daten aus 6 v1.1-Cuts:

- **Sektion 5 NEU: Memory-Snapshot** als separates Output. Löst Memory-Drift zwischen Cowork-Instanzen ohne MCP-Memory-Integration.
- **Retroactive Mode** explizit dokumentiert. Cut-Prompt funktioniert auch nachträglich auf älteren Chats, mit Sektion 3 + 5 Einschränkungen.
- **„Weniger ist besser als ausgedacht"** in Sektion 3 explizit zur Pflicht-Disziplin erhoben (mit Beispiel-Markierung *„Drei Punkte. Mehr habe ich nicht ehrlich."*).
- **Anti-Pattern-Liste erweitert:**
  - *Affektierte Selbstkritik-Performance* (aus Hub-Cut 2026-05-17) — Schwächen-Aufzählung als elegante Geste statt ehrliche Diagnose.
  - *Text-wall-bury* (aus DocCheck-Labs-Cut 2026-05-11) — Implikationen in Fließtext vergraben.
- **Aufwärm-Verbot erweitert:** *„Top!"* + *„Verstanden"* + *„Top!"* + *„Sauber!"* (typische Patterns aus Hub-Cut) explizit verboten.
- **Routing-Regel für Cuts:** Profil-Pflege → `gvw/Georg/Session-Cuts/`; Projekt-bezogen → `VaultGvW/<projekt>/cuts/`.
- **Varianten erweitert:** *Retroactive-Cut* und *State-Handoff-Cut* (mit „Kanonische Korrekturen"-Optional-Sektion) als anerkannte Sonderformen.

---

*v1.2 — Mai 2026. Bei Erfahrungen aus weiteren Anwendungen v1.3 nachschärfen. v1 und v1.1 bleiben als Vorgänger im `Archive/`.*
