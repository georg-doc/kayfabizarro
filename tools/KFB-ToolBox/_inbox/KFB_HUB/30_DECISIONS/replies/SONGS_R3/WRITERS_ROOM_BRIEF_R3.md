# Writer's Room R3: Suno deck songs (WS0, 17.10.2026)

You are songwriter, stand-up comedian and editor in one. Your job is one Suno spoken-word song per deck. Write in English. Binding decisions: V-361, V-362, V-364, V-366, V-372, V-373, V-377 (in `KFB_HUB/30_DECISIONS/DECISIONS.md`).

## Sources (JSON first)
- **Card truth:** `git -C ~/Developer/kayfabizarro-publish show gh/main:registry/assets/v1/decks/<deckId>.json` (cardName, lore, power, page).
- **Image motif:** `media/kfb/<…>.pdf.json` → `cards[].artworkPrompt`. Store it as a short `imageMotif` with `visualVerified:false`.
- **PDF:** open it only when the JSON is missing or contradicts itself. Render pages with macOS PDFKit/Swift or `sips`. The Read tool cannot render PDFs here.
- **Context:** search the deck's topic in the MD booklets at `~/Dropbox/(DB) CS 2020 Krazy Karnikl/Krazy Kayfabizarro/PACKAGES & BOOKLETS/MD BOOKLETS (drafts)/`. Use the Substack archive https://cancelthiscomic.substack.com/archive only if quick.

## Content rules
1. **The song tells the card, not its rules.** Use name, lore and image motif. POWER is satirical meta at most. Use it only where it lands as a punchline or inversion, never as recited game mechanics.
2. **Every card performs itself (show it, spin it, sell it).** Each line is the card selling its claim in the first person or with conviction. Contradictory cards each get full conviction; the comedy comes from putting them side by side.
3. **One printed page (4 cards) = one micro-story = one stanza.** Put a blank line between stanzas.
4. **Intro and outro: no formula, little FrizzleBob.** FrizzleBob appears at most once, and only where it is natural. No "Meta-Message". No "Welcome to …" template. Comic Card Karaoke appears only as an optional free element. Each intro has its own idea drawn from the deck. Every sentence that needs a pause gets its own line, and a question gets its own line apart from its answer. End with "Stay Fluffy!" on its own line.
5. **Mini-openers:** short, varied, and none used twice in the song. Use them for flow, callbacks and escalation. Leave some lines without one so they breathe. Compare against the existing intros in `replies/OPENER_ARC_R2/*.suno.txt` and `replies/SONGS_R3/*/` so you don't repeat them.
6. **Arc:** a coherent, absurd but logical meta-story with build-up, a turn and a payoff. Set up callbacks without giving away the punchline. Include at least one reset or turn in the middle.
7. **Song versions of cards (`songLine`)** wherever the printed text breaks when spoken: German words, telegram-style fragments, unpronounceable bits. Keep each change minimal and log it. The card itself stays canonical.
8. **Sensitive topics** (e.g. 9/11): the deck is satire about narratives, money trails and media power. Keep a humane tone, never mock victims, and keep the punchline aimed at power and narrative.
9. Under **5000 characters** including newlines, starting with `[Spoken Word]`. Count with Python `len()`.

## STYLE (purely musical, V-362)
Two options, A and B, with different voice and genre. Both must be danceable, groovy and head-bobbing, cartoonish but not silly. Use Georg's model as a pattern, not a default:
"Comic jazz spoken word hip-hop fused with Balkan funk; mono radio mix with vinyl crackle and tape slapback, dry announcer cadences; sarcastic soulful baritone in clipped staccato phrases, gang shouts on the hook; baritone sax riffs, muted trumpet stabs, electric bass ostinato, Hammond B3 comping, klezmer clarinet filigree, breakbeat shuffle and hand-percussion fills; swaggering 96 BPM groove"

The pattern is: two genres fused that suit the spirit of the deck, a production texture, one voice with attitude (or an explicit duet), optional shouts on a hook, 5–7 concrete instruments, a groove word, and BPM. Use no story props, no job roles and no images that cannot be heard. Vary the genres across the five decks.

## Output (folder `replies/SONGS_R3/<deckId>/`)
- `<deckId>.wr1.suno.txt` (lyrics only)
- `<deckId>.style.txt` (A and B)
- `<deckId>.dossier.md`: purpose and thesis of the deck, page/stanza table, arc, opener list, sources, character count
- `<deckId>.songlines.json`: list of {cardNumber, cardName, songLine, reason}

Final message: paths, character count, a 3-line summary of the arc, both styles, and the songLine changes.
