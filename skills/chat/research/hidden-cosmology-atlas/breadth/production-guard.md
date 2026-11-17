# Independent Production Guard — institution and Solari intake

Date: 2026-11-01. Reviewer: `/root/postwar_profiles`. Reviewed drafts were authored by other executors. This is a bounded source-scope/identity review, not a full historical audit. No GitHub writes and no edits to the reviewed files were made.

## Verdict: CONTINUE with narrow corrections; QUARANTINE affected records from automatic projection

The parent breadth outcome should continue. These packets add meaningful coverage: C08–C10 obtains institutional identity and narrowly framed governance passages, while Solari obtains attributable author text, accounting-rule context and actual publication relationships. They do not establish a covert supernetwork. No outcome-wide STOP is warranted.

Before automatic Site/graph promotion, correct the specific metadata and attribution seams below. Retain unreviewed/unavailable source labels and do not certify all records because a subset was independently checked.

## Required corrections

1. **SOL-C05 actor mismatch — quarantine this claim’s author-model projection.** Its proposition concerns a FASAB rule, but `entityId` is `catherine-austin-fitts`. The cited source is the standard, not Fitts. Preserve her as the dossier’s editorial owner/context, with `assertedBy`/issuer FASAB and `subjectWorkId` for SFFAS56 (or no actor entity until a properly registered work exists). Mark this as document text rather than Fitts’s own assertion. SOL-C01 correctly names both Skidmore and Fitts in prose; structured coauthor attribution would also prevent a Fitts-only consumer from losing Skidmore.

2. **SOL-E02 / SOL-S07 date semantics — correction required.** The current records put 2017-04-27 into `publicationDate`, while the packet’s own archive source distinguishes interview date April 27 from public availability June 20. Set `eventDate: 2017-04-27`; use `publicationDate: 2017-06-20` with explicit public-availability basis, or leave publication unknown and keep a separate `publicAvailabilityDate`. Keep the publisher page’s displayed date separately. SOL-C03 prose already makes the distinction correctly.

3. **Preserve proposed identity split and aggregate scope.** Nine of ten institution entity IDs match the R4 census exactly, including `federal-open-market-committee`. Only `theosophical-society-england` is absent and already carries an explicit proposed-split status: retain that status until the writer registers the new national legal-body identity. All four Solari participant IDs match exactly. `federal-reserve-banks` remains an aggregate of 12 banks, not one incorporated bank; preserve that identity scope in downstream display. This is an integration guard, not an error in the existing packet.

4. **Pin provenance and complete the edge envelope before projection.** Institution packet and all BIN edges have null source Git SHA, explicitly awaiting the writer. Pin the actually used input revision and record resulting revision separately. SOL edges lack `identityStatus` and `originalSourceScope`; add the already known publisher-transcript/synopsis/listing scope. Solari sources lack per-source retrieval date; record actual 2026-11-01 access, separately from publication dates. These are fixable integration gaps, not reasons to reopen historical research.

## Independent evidence spot checks

- **BIN-E01 / BIN-C01:** Independently read the [Federal Reserve structure FAQ](https://www.federalreserve.gov/faqs/about_12593.htm), paragraphs 1–3 and last-update field. Board/FOMC/Reserve Banks are distinguished; the oversight edge is supported at the exact official-account scope. No privately owned unified-control conclusion follows.
- **BIN-E02 / BIN-C05:** Independently read [Praedicate Evangelium](https://www.vatican.va/content/francesco/en/apost_constitutions/documents/20220319-costituzione-ap-praedicate-evangelium.html), arts.219–221 in HTML. Art.219 §3 supplies the stated APSA–IOR normative channel. Its March 2022 text is not evidence of any particular transfer or present compliance. Existing packet language preserves this limit.
- **BIN-E03 / BIN-C07:** Independently read the [Charity Commission decision](https://www.gov.uk/government/publications/charity-registration-decision-the-theosophical-society-in-england/charity-registration-decision-the-theosophical-society-in-england), Background/Decision/objects passages. The national-body description, 2015 incorporation and 2016 decision fit the packet. The 2020 web publication date is distinct. No spiritual-truth certification is claimed.
- **SOL-C01:** Independently read the [May 2020 update](https://missingmoney.solari.com/missing-money-update-may-2020/) introduction and Uses section through the start of its table. Authors explicitly describe possibilities and preliminary debt analysis. Packet preserves that conditionality and does not equate adjustments with stolen cash. The underlying OIG report remains outside this independent check.
- **SOL-C05:** Independently read parsed text from the [FASAB standard](https://files.fasab.gov/pdffiles/handbook_sffas_56.pdf), summary and paragraphs9–13 (printed pages1,5–6; PDF indices0,4–5). Classified-reporting modifications and neutral disclosures are real provisions; they do not identify a particular payment. Original standard issued 2018-10-04; inspected handbook is version24, September2025. No PDF image was viewed.
- **SOL-C03:** Independently read the [Dark Journalist episode page](https://darkjournalist.com/s-fitts17.php) header/synopsis and [Solari event archive](https://solari.com/archived-events/) 2017 entry. The appearance is documented, but the event/public-availability distinction must flow into the structured dates. Synopsis is not a verbatim guest transcript.

## Critic assessment and retained limits

Strongest value is anti-conflation: System versus components, IOR versus APSA, English legal body versus international tradition, accounting adjustments versus cash loss, and program appearance versus agreement. This is meaningful breadth even though it is not a complete institutional history or four-paper audit.

Keep the labels visible to consumers. The “A_DOCUMENTARY” label on interview/listing edges means an appearance is documented, not the guest’s underlying allegations. Institution self-description is documentary evidence of that account, not an independent conduct audit. Empty `counterEvidence` arrays must not render as “no contrary evidence exists.” Unavailable SOL-S11/S12 remain discovery leads only. No causal funding/control edge is justified here; all seven edges currently have `causality:false`.

Structural check passed: source/claim references resolve inside each packet and all comparison/publication edges retain noncausal flags. This reviewer did not inspect all 20 source bodies, listen to audio, view PDF images, authenticate ledgers, check all amendments or resolve historical financing. Reviewer status should be attached to the named checked records and this review, not converted into blanket source verification.

One next gate: writer applies corrections 1–4 and reruns entity/reference checks before persisting the bounded research milestone. Continue the parent outcome while source-unavailable and deep financial questions remain explicitly open.

## Reviewed-file fingerprints

- `institution-coverage.json` SHA-256 `c7cb4ba274f0ed37e3797207801b4944c5e35c63eccee469231a0301367e756f`
- `institution-coverage.md` SHA-256 `1470c194ebb07f86c57f30ce14c0a7a995594fb2c28fc6ffe288315575c6f798`
- `solari-intake.json` SHA-256 `10cd9f54636fbd980cadb6ae28cf156f6249b0331b23f5efa3353b2b547452fc`
- `solari-intake.md` SHA-256 `24b737c3e262f966e103d7bf416f0d14543b00296b271e0ff07fc2662b0b69e5`

## Corrected publish-candidate readback — 2026-11-01

**ACCEPT / CONTINUE for bounded source-scoped persistence.** Independently read the corrected `publish/breadth/solari-intake.json` and `institution-coverage.json` after the initial guard. SOL-C05 now identifies FASAB as issuer and links the SFFAS56 source work rather than attributing the rule to Fitts. SOL-S07 and SOL-E02 now separate April 27 interview date from June 20 public availability, with publication date left unknown and SOL-S10 retained as the availability source. All BIN provenance fields now pin the stated input revision `7b9afcfb38993589c6110d77eeeb32cec89d54aa`; SOL edges now carry exact participant identity and the relevant transcript/synopsis/listing read scope. Per-source Solari retrieval dates are present. Source/claim references and all seven noncausal flags pass readback checks.

The narrow quarantine for actor/date errors is lifted for these corrected candidates. This accepts the correction and source scope, not all historical claims or unavailable original bodies. Retain the proposed status for any new issuer/coauthor identity and resolve work/actor references in the final integrated entity registry. No automatic Site release, historical-financing certification or GitHub-write claim is made by this reviewer. Draft originals and their prior fingerprints remain unchanged.

Corrected candidate fingerprints at readback:
- `solari-intake.json` SHA-256 `37822a0af7daacf074a758d63469c091159acd1148e30a3d2ae34d30982d0ddf`
- `institution-coverage.json` SHA-256 `6c386099ffad9ebfe0e1b70ae2eb323183c2d6650f47c88063001eeb12a67bd8`
