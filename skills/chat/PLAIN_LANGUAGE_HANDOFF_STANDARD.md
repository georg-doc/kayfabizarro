# KFB Klartext- und Handoff-Standard

Status: CURRENT BINDING STANDARD v1.0
Date: 2026-10-03
Owner: Georg / KFB

This standard applies to every KFB chat, agent, briefing, Return, Recovery, Hub card and handoff.

Georg is the product owner and visual/gameplay decision-maker. He is not expected to decode repository administration, reconstruct chat history or translate technical identifiers into the next production action.

## 1. Every user-facing update starts with the actual phase

Use these four headings in this order:

1. **Was ist der Stand?** — What works, what failed and what is not built yet, in ordinary language.
2. **Wer macht jetzt was?** — Name exactly one next executor and the concrete task.
3. **Was musst du tun?** — Give Georg one direct action or explicitly say `Nichts`.
4. **Was passiert danach?** — Name the next visible product result, not another administrative checkpoint.

End every turn with at most five compact next steps.

## 2. Technical identifiers are evidence, not instructions

Never lead with a PR number, commit hash, branch name, file ID, run ID, test counter, slice ID or gate name.

First explain the thing in plain language. Put technical identifiers at the end under:

`Technischer Nachweis — nur für die ausführenden Chats`

When an identifier must appear earlier, translate it immediately:

- Bad: `PR #344 is next.`
- Good: `Als Nächstes prüft Blender die originalen KayKit-Laufanimationen auf der echten Figur. Die technischen Quellen liegen im GitHub-Auftrag „KayKit Native Locomotion Baseline“.`

Never ask Georg to choose between hashes, branch names or unexplained internal labels.

## 3. Every handoff names the executor and gives a complete start message

Every handoff to Claude Design, Blender MCP, Web Chat, Codex/WSA or another tool must contain:

- **Executor:** the named environment/chat;
- **Model and reasoning:** when the environment exposes that choice;
- **Goal in one sentence:** the visible or audible result;
- **GitHub source:** direct clickable URL plus the exact read-first file;
- **Inputs included:** all source paths and decisions needed to begin;
- **Protected work:** what must not be rebuilt or replaced;
- **Expected return:** the concrete files, images, playable page or decision table;
- **Stop condition:** when to return instead of expanding scope;
- **Copy-ready start message:** Georg can paste it without finding files or adding context.

A Site link may be added as convenience, but never as the only source. Claude Design and external tools must receive GitHub-accessible sources and a self-contained briefing.

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

## 6. Required compact closing format

Every KFB production turn ends with:

```text
Jetzt:
- [Executor] macht [konkrete Aufgabe].

Du:
- [eine Aktion oder „nichts“].

Danach:
- [nächstes sichtbares/spielbares Ergebnis].
```

Only after that may a short technical evidence block follow.
