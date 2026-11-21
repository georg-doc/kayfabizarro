# R9 · Webchat → Work → Site — bounded feasibility and handoff

Status: **PLAN / SOURCES / NOT A BUILT OR VERIFIED SITE**  
Owner: existing `skills/philosophy-sparring` content owner.  
No public route, Site owner identity, model backend, authenticated storage or acceptance claim has been created.

## Product intent

Offer an intellectual dialogue partner suitable for a technically inexperienced reader who may use ChatGPT Free. The accessible **first product** is an ordinary ChatGPT conversation or Project containing portable instructions and deliberately shared private reference materials, not an embedded KFB game runtime.

## Delivery options, separated

1. **Free webchat:** Paste public `STARTER_PROMPT.md` and a privately chosen portable context card. Can work without plugins; long-term memory and source ingestion are not automatic.
2. **ChatGPT shared Project:** As documented by OpenAI, Free plans can participate in Projects and use up to 5 files per Project; Project instructions, files and chats can be shared with authorized people. Do not expose private writings merely by generating a share URL.
3. **Work** (authoring/engineering): Suitable for examining an authorized private corpus, maintaining GitHub, building/testing a Site. Availability depends on plan; excludes Free/Go.
4. **GPT Site** (optional visitor interface): A possible research index, reading mode selector, source locator, private-access guide and session export. Building a Site requires Work/Codex and eligible account. Site visitors' connected apps, when supported, act with **their own permissions**, not the site author's. An ordinary public Site URL is *not itself* an LLM backend, GitHub write grant, OpenAI API entitlement or persistent chat memory.
5. **Public GitHub reference:** versioned model-agnostic skills, research methods and legally shareable sources. A visiting LLM must actually be capable of fetching the page; link-only retrieval may fail and should be test-proven. Private corpus remains outside.
6. **External Claude or another LLM:** consume a **standalone public prompt** via paste and optional explicit retrieval; use a privately approved user-initiated handoff, not presumed cross-vendor memory.

## Current OpenAI public documentation (verified 2026-10-31)

- Sites: https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites
- Work: https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex
- Free Projects: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
- Sites launch/regional restrictions: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

**Regional and entitlement gate:** OpenAI's public Sites beta launch documentation excluded public publishing in the EEA/Switzerland/UK *at launch*. Newer Help Center documentation describes public/named viewer sharing generally but does not establish eligibility for any particular user account. Before committing to a public URL, a Sites-capable executor must check the actual account's create and Share controls. Free users cannot **author** Sites. A publicly accessible Site could be opened without login if truly published to everyone; if named-viewer sharing, sign-in with invited account is required. AI-assisted conversations and saving state inside the Site require independent supported runtime/feature tests.

## KISS staged concept, not implementation

**P0 — no Site required:** one public GitHub entrypoint linking standalone starter, source index and example situations; one **private** author-controlled corpus with an explicitly permitted portable card. Test with the reader in normal ChatGPT Free.

**P1 — Site discovery/reading surface when eligible:** a simple interface with philosophy/question exploration, source citations, modes, a readable public prompt and session-note export. It should link back to canonical GitHub source, avoid second content owner and never expose the private corpus by default. No generic KFB chrome or replacement branding.

**P2 — genuine interactive model/continuity only after technical acceptance:** choose an actually available permitted model execution layer and test Free/anonymous visitor rights, quotation verification, data isolation, private session storage, export and deletion. If a model is not supplied, transparently present a launch/copy-paste experience rather than pretending to host a chatbot.

## Proposed proof gates for a future Work/Sites executor

- Exact plan/region has Sites authoring capability; exact audience setting supports intended visitors.
- Public source links open in a normal browser and the independent LLM can actually load named text (or copy/paste fallback shown).
- Reader on Free sees intended modes and can use the intended interaction, **without** exposing owner-only documents.
- A real model conversation preserves user privacy, source provenance and nuanced philosophical dissent.
- Site revision visibly confirmed at the exact hosting URL and user explicitly accepts it.
- Neither GitHub main nor KFB Live gets silently promoted.

## Current decision

Remain **WEBCHAT_FIRST + PRIVATE_CORPUS + PUBLIC_GITHUB_METHOD** for actual conversations. Recommend a **separate bounded Work/Sites feasibility slice** if account permissions/region allow it. A preparation handoff is not an authorization to publish a public Site or implement a second chat runtime.
