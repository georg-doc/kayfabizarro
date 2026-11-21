# DocCheck parallel concept — Interactive Medical Case Stacks

**Date:** 2026-11-05  
**Status:** RESEARCH / PROPOSAL; **NOT** a DocCheck product commitment, no separate runtime or LMS migration.  
**Relation:** independent application of HyperCard/branching narrative grammar; KFB story/card implementation and brand are not to be imported into DocCheck.

## 1. Existing DocCheck baseline — reuse, do not compete

An existing in-repository source is **`travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/DocCheck_Interactive_Microlearning_Living_Doc_v0.9.md`**. This is an older/working authoring intake, not verified as the current DocCheck deployment SSOT (filename v0.9, internal header still v0.1). It proposes:
- embedded, fast single-page microlearning in DocCheck News/customer channels/posts/Flexikon;
- **Explore → Do → Check → Take away**, typically ~90 seconds–3 minutes for microlearning;
- reusable verbs like Explore/Sort/Build/Route/Sequence/Repair/Predict;
- separation of **medical content / interaction mechanics / presentation**;
- professional DocCheck visual identity and one memorable manipulable scientific object, not generic quiz/UI, mandatory avatar or default LLM/backend.

**Our addition:** Story/Choice/Consequence is one more **optional interaction grammar**, best when timing, uncertainty, diagnostic reasoning, communication, longitudinal change or treatment trade-offs matter. Do not replace a mechanism-first mini-simulation with an unnecessary branching narrative.

External DocCheck precedents verified:
- [DocCheck CME profile](https://www.doccheck.com/de/profile/channels/485-doccheck-cme-scout/content-pages/419) describes accredited modules/EFN reporting for its offering; accreditation belongs to the provider process, not to a game format.
- [Martha fällt immer hin: Eine interaktive Fallgeschichte](https://www.doccheck.com/de/detail/trainings/7350-martha-faellt-immer-hin-eine-interaktive-fallgeschichte) already describes an interactive longitudinal diagnostic CME case. This proves **editorial/product-format precedent**, not its implementation technology or a license to reuse the case.
- [DocCheck alternative CME formats](https://more.doccheck.com/de/doccheck-cme/) describes individual knowledge formats.

**Differentiation:** rather than calling this "DocCheck HyperCard", position it as **case navigation and decisions integrated with current DocCheck microlearning**.

## 2. Formats worth testing

| Format | Learner action | Best-fit use | Proof of learning |
| --- | --- | --- | --- |
| **Diagnostic crossroads** | Choose next diagnostic question/test and receive findings and consequence | differential diagnosis, reasoning, avoiding premature closure | explain rationale, compare alternate route |
| **Longitudinal case** | Revisit patient at multiple stages; earlier decisions influence available evidence | longitudinal care, diagnostic delay, prevention | temporal reasoning and feedback |
| **Therapeutic decision trail** | Select a management path and inspect consequences/uncertainty | guideline decisions, patient preferences, follow-up | source-anchored feedback; no simplistic all-or-nothing score |
| **Clinical communication scene** | Choose phrasing and observe patient/relative reactions | consent, shared decision making, disclosure, adherence | contextual feedback, not empathy-by-points |
| **Mechanism-first explainer** | Manipulate a model, then branch to "what if..." | physiology, pharmacology, pathogen lifecycle | predict/repair/transfer action |

Use one meaningful core action per 1–3 min microlearning; longer longitudinal cases are separate CME/editorial experiences and must not be forced into the short format.

## 3. Tools for the DocCheck lane

- **H5P Branching Scenario**: mature authoring tree, mixed media, optional scoring and feedback; [H5P guide](https://help.h5p.com/hc/en-us/articles/7506761308957-Branching-Scenario-Guide), [H5P content demo](https://h5p.org/branching-scenario). [H5P.com reporting](https://help.h5p.com/hc/en-us/articles/21862472151965-H5Ps-supporting-reporting) lists detailed reporting for Branching Scenario; **this does not establish integration with DocCheck authentication or CME tracking**. Evaluate embedding/analytics/licensing before commitment.
- **Twine**: fast editorial branch maps and HTML preview. Strongest *content/prototyping* candidate, not necessarily final DocCheck renderer.
- **ink + inkjs**: compile editorial scripts into JS experience behind an existing DocCheck SPA; candidate for a lightweight self-hosted interactive case, conditional on a real integration test.
- **Ren'Py**: strong reference for dialogue writing but overlarge for article-embedded microlearning; Web/WASM constraints documented. No runtime recommendation.
- **Gardepe Hypercard asset pack**: CC BY-NC-SA; **do not use in commercial DocCheck output**.
- **Adapt/H5P ecosystems**: evaluate if LMS/SCORM or certified reporting is actually required; not a reason to replace existing DocCheck content workflow.

## 4. Medical editorial and technical acceptance questions

A later DocCheck executor should resolve, using actual embedding host and subject-matter editor:
1. **Editorial evidence:** every clinical branch and feedback claim has medical source/version/date and reviewer; guideline changes are updateable without rewriting entire case.
2. **Truthful consequences:** learners may choose plausible options; feedback explains trade-offs and uncertainty. Branch outcomes must not masquerade as validated clinical prediction.
3. **Cases:** use fictional or properly authorized/de-identified material. Do not route identifiable patient/learner health details into analytics by default.
4. **Accessibility:** keyboard, screen reader, mobile sizing, readable alternatives to images/audio; avoid requiring color or sound alone.
5. **Tracking:** "completed", "understood", "earned CME credit" are distinct product outcomes. Formal accreditation/EFN reporting needs an approved integration with the existing provider workflow.
6. **Embedding:** CSP, JS sandbox/iframe, responsive layout, load budget, cookie/analytics contract, and optional offline author review remain explicit future tests.
7. **Maintenance:** deterministic versions, content QA, link/branch checker, source history and regression sample paths.
8. **Rights:** externally authored example cases, illustrative assets and packages require individual rights review.

## 5. Research on clinical learning — measured, not overclaimed

- [Jay et al., Academic Medicine 2025, systematic review](https://pubmed.ncbi.nlm.nih.gov/39485118/): investigates feedback by virtual patients for clinical reasoning. Supports evaluating **quality/timing/type of reasoning feedback** rather than treating branching alone as a learning outcome.
- [García-Torres et al., 2024, review](https://pubmed.ncbi.nlm.nih.gov/39595439/): discusses virtual patients and clinical reasoning; relevant for design/assessment review, not a guarantee that any UI improves competence.
- [GenAI-supported virtual patients, 2026 systematic review](https://pubmed.ncbi.nlm.nih.gov/42098926/): limited study base, varied outcomes. **Do not make generative patient dialogue an MVP dependency.** Carefully authored deterministic case branches remain a strong initial comparison.
- [EACCME E-Learning accreditation](https://eaccme.uems.eu/applywithus-accreditation) is a separate formal provider/eligibility process. A published HTML interactive story does not itself confer CME credit.

## 6. Proposed first DocCheck pilot — only if separately commissioned

Take a **new synthetic medical case** based on a named approved source, with **2–3 consequential decisions** and feedback, no identifiable cases and no login dependency for initial editorial review. Run the exact same editorial flow as:
- A) existing DocCheck SPA pattern/interaction verb;
- B) H5P Branching Scenario (if embedding and licensing fit);
- C) Twine prototype or inkjs compiled lightweight web proof.

Compare editorial authoring time, medical reviewability/source tracking, mobile accessibility, exact article embedding, actual learner use/feedback and analytic integration. Avoid a superficial "three demo UIs" competition: content and objective must be identical, with one editor and one medical reviewer.

**Next product ownership gate:** separate DocCheck owner reviews this as an addon to its *current* microlearning/CME stack and decides whether to commission a bounded, source-backed case pilot. The KFB/WS0 planning branch has **no mandate** to implement or deploy into DocCheck.
