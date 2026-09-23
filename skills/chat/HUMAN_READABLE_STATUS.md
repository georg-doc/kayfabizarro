# KFB · Human-readable status rule

Status: **CURRENT COMMUNICATION RULE**

Purpose: Web Lead, Claude Coworker and other KFB production agents must translate technical state back into short language Georg can act on.

## Default answer order

### 1 · Für Georg

Start with:
- what changed;
- what Georg needs to look at or decide;
- what happens next.

Use ordinary language.

Example:

**Für Georg:**  
„Bitte öffne die neue WorldBuilder-HTML. Prüfe nur drei Dinge: Kannst du ein Objekt verschieben, drehen und skalieren? Bleibt das nach Speichern und Neuladen erhalten? Verdeckt das kleine Menü die Szene?“

### 2 · Technical detail only if useful

After the plain-language part, technical names may follow:
- PR / branch / SHA;
- test counts;
- schema/module names;
- unresolved implementation detail.

Do not make Georg decode these to understand the decision.

## Translation rules

Prefer:
- „deine Sichtprüfung ist noch offen“
instead of:
- `HUMAN_R2_PENDING`.

Prefer:
- „der Code ist geprüft, aber die HTML wurde noch nicht von dir ausprobiert“
instead of:
- „STATIC PASS / BROWSER 0 / HUMAN HOLD“.

Prefer:
- „wenn diese zweite Reparatur wieder scheitert, stoppen wir“
instead of:
- „Repair Pass 2 stop condition“.

## Acronyms

Explain once in plain language.

Example:
„WSA/Work = die aufwendigere Arbeitsumgebung für lokale oder repo-übergreifende Integration.“

Do not use an acronym as the main explanation.

## Length

Default status reply:
- one short paragraph;
- at most five useful bullets;
- one clear next action.

Long technical evidence belongs in GitHub, not in the user-facing chat reply.

## Review requests

Never say only:
„R2 Human Pass needed.“

Say what Georg actually does:
„Öffne die HTML und teste Verschieben, Drehen, Skalieren und Speichern/Neuladen.“

## Internal agent language

Agents may use precise schemas/status labels in GitHub documents and between technical steps.

Every user-facing handoff must contain the plain-language translation first.

## No fake simplification

Do not hide:
- uncertainty;
- failed tests;
- missing source;
- conflicts.

Translate them rather than omitting them.


## Direct clickable review link

Whenever Georg is asked to inspect or approve a visual/browser result, the same chat reply must contain a **direct clickable review artifact link**.

Do not say only:
- "open PR #186";
- "go to the Hub";
- "R2 Human Pass needed";
- "find the review file under this path".

Say:
- what Georg should check;
- provide the directly clickable `REVIEW.html` attachment/link in that same reply;
- then optionally add the PR/source link underneath.

If the review artifact cannot be attached directly, state that clearly and create the smallest zero-install chat artifact first. Do not make Georg hunt through GitHub or the Hub for the file.
