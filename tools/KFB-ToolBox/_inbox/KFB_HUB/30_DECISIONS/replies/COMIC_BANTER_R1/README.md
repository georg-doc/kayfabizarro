# Banter R1 — source and test contract

Ship: C.O.M.I.C., **DESIGN only**. The dialogue is explicitly *card constraint performance*, not freeform improvisation. Three existing printed decks; 12 different cards; one card per 3-move round; each dialogue move repeats that card's normal-case printed title. POI annotations are not speech.

Source: register ref `docs/kfb-decisions-register-2026-10-11`; canonical card text from `media/kfb/*.pdf.json` only `cardName/power/lore`. 
- monomyth: `media/kfb/Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json`
- cosmic: `media/kfb/Cosmic_Grift_-_Dark_Journalism_-_ADD_web_ID.pdf.json`
- philosophy: `media/kfb/Kayfabizarro_Philosophy_-_ADD_web.pdf.json`

For exact Python gate, run from a checkout containing the registered `replies/triplet_set_check.py`:

```sh
python3 tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/triplet_set_check.py 'media/kfb/Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json' 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/COMIC_BANTER_R1/monomyth.check-input.csv'
python3 tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/triplet_set_check.py 'media/kfb/Cosmic_Grift_-_Dark_Journalism_-_ADD_web_ID.pdf.json' 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/COMIC_BANTER_R1/cosmic.check-input.csv'
python3 tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/triplet_set_check.py 'media/kfb/Kayfabizarro_Philosophy_-_ADD_web.pdf.json' 'tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/COMIC_BANTER_R1/philosophy.check-input.csv'
```

Every CSV includes 12 `card` records (36 total), each with `set`=round. No invented opener. The mechanical checker checks permissible words; an **independent blind semantic critic** still must judge joke quality and coherent Dory/Hunky conflict. No score is presumed. No Suno timing or live runtime implied.
