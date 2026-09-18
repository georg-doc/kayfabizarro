# SimBlood · Frank Golden Sample Demo

Purpose: management-facing / design-review UI slice derived from the Cell & Asset Coverage Matrix.

Visible UI rule:

> image + cell name first; everything else earns disclosure through interaction.

The demo intentionally removes the production matrix's visible metadata:
- no IDs
- no priority labels
- no source lanes
- no licences
- no counts/stats
- no explanatory paragraphs
- no status copy

Progressive disclosure:
1. resting gallery = image + name
2. hover/focus = micro feedback only
3. open = reference / candidate comparison
4. source link appears only inside the focused sample
5. candidate cycling via thumbnails or arrow keys

Golden sample set:
- RBC-NORM
- RBC-SPH
- RBC-ECHINO
- WBC-NEUT-SEG
- WBC-LYMPH-SMALL
- WBC-MONO
- PLT-NORM
- PLT-GIANT

Data is a presentation projection of `cell-atlas-progressive-template/coverage.v0.2.json`, not a new morphology SSOT.
