# KFB Klartext- und Handoff-Standard

Status: CURRENT BINDING STANDARD v1.0
Date: 2026-10-03
Owner: Georg / KFB

This standard applies to every KFB chat, agent, briefing, Return, Recovery, Hub card and handoff.

Georg is the product owner and visual/gameplay decision-maker. He is not expected to decode repository administration, reconstruct chat history or translate technical identifiers into the next production action.

## 1. Use the four-part format only for substantial handoffs/closures

For a substantial handoff, recovery return, phase change or final closure, use:

1. **Was ist der Stand?**
2. **Wer macht jetzt was?**
3. **Was musst du tun?**
4. **Was passiert danach?**

For ordinary progress updates, answer directly and briefly. Do not add the four headings merely to satisfy format.

End substantial handoffs with at most five compact next steps.

## 2. Technical identifiers are evidence, not instructions

Never lead with a PR number, commit hash, branch name, file ID, run ID, test counter, slice ID or gate name.

First explain the thing in plain language. Put technical identifiers at the end under:

`Technischer Nachweis — nur für die ausführenden Chats`

When an identifier must appear earlier, translate it immediately:

- Bad: `PR #344 is next.`
- Good: `Als Nächstes prüft Blender die originalen KayKit-Laufanimationen auf der echten Figur. Die technischen Quellen liegen im GitHub-Auftrag „KayKit Native Locomotion Baseline“.`

Never ask Georg to choose between hashes, branch names or unexplained internal labels.

## 3. Handoffs stay self-contained but compact

A handoff to another executor must contain only the delta needed to start safely:

- **Executor**
- **Outcome**
- **Owner**
- **Read first / exact GitHub source**
- **Protected boundary**
- **Done when**
- **INDEPENDENT EXECUTION** role block when the job is substantial

Reference existing SSOTs/contracts for unchanged context instead of copying their contents.

Include a copy-ready start message only when Georg actually has to start/paste into another environment. Do not generate duplicate start messages for work that continues automatically in the same run.

A Site link may be convenience, never the only source.

## 4. Do not hand unfinished repository work back to Georg

The producing chat remains responsible for repository bookkeeping inside its authorized scope:

- write and verify its Return/Recovery;
- classify a timeout as `UNKNOWN` and resolve it by reading the actual state;
- identify superseded work;
- provide the next executor with the complete briefing;
- state plainly when a result is only prepared, not built.

Georg may be asked for a visual, audible or gameplay decision. He must not be asked to reconstruct file paths, reconcile duplicate branches or determine which technical attempt is current.

## 5. Status words must describe product reality

Use these plain-language meanings:

- **Fertig und nutzbar:** works in the intended product surface and has the required human approval.
- **Zum Anschauen bereit:** built and testable, but Georg has not accepted the product result.
- **Vorbereitet, noch nicht gebaut:** briefing and sources exist; the named executor has not produced the result.
- **Fehlgeschlagen, nicht weiterverwenden:** the candidate is frozen as evidence only.
- **Blockiert:** a named missing source, permission or product decision prevents useful work.

Automated tests, uploaded files or a successful commit do not by themselves mean `Fertig und nutzbar`.

## 6. Compact closing format for handoffs

Use this only when a real phase/executor handoff occurs:

```text
Jetzt:
- [Executor] macht [konkrete Aufgabe].

Du:
- [eine Aktion oder „nichts“].

Danach:
- [nächstes sichtbares/spielbares Ergebnis].
```

Ordinary progress updates do not require this ceremony.
