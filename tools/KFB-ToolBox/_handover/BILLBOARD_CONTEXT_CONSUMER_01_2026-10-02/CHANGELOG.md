# CHANGELOG · BILLBOARD-CONTEXT-CONSUMER-01

## 2026-10-02 · Source lock
- stacked consumer branch on R11 closure head;
- locked current Travel v25 world-context, zone-ring, deck registry and real Forget Utopia card JSON;
- explicitly kept Town island/resident IDs nullable.

## 2026-10-02 · Adapter
- added a non-owning Travel -> R11 adapter;
- real `forget_utopia#7` zone identity;
- real Travel semantic vector, card palette and WorldContext values;
- R11 presentation owner unchanged.

## Attempt 1
- 13/13 consumer checks passed;
- duplicated upstream FOCUS/PDF regression timed out;
- no first-party failure.

## Repair pass 2/2
- removed redundant upstream PDF/card re-test;
- adapter runtime unchanged;
- run `37045278414`: **16/16 PASS**;
- 0 page errors, 0 first-party failures;
- artifact `11244073528`.

Next: existing World/Look owner applies physical Billboard body palette/accent.
