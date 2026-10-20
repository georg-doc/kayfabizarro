#!/usr/bin/env python3
"""Erzeugt die R4-Fixtures neu (deterministisch). Nur bei Änderungen am Fixture-Deck nötig; run_fixtures.py prüft."""
import copy, hashlib, json, os
H = os.path.dirname(os.path.abspath(__file__))
w = lambda n, t: open(os.path.join(H, n), "w", encoding="utf-8").write(t)
wj = lambda n, o: w(n, json.dumps(o, indent=2, ensure_ascii=False) + "\n")
sha = lambda n: hashlib.sha256(open(os.path.join(H, n), "rb").read()).hexdigest()

deck = {"schema": "kfb.asset-deck.v2", "deckId": "fixture_parade", "title": "The Fixture Parade", "cards": [
    {"cardNumber": 1, "cardName": "The Ringmaster", "lore": "Cracks the whip at the clock and sells tickets to the delay. Everyone pays twice.", "power": "Opens the parade.", "mappingVerified": True},
    {"cardNumber": 2, "cardName": "The Paper Elephant", "lore": "Looks enormous on the poster, folds flat when it rains. The crowd still applauds the poster.", "power": "Counts as two when dry.", "mappingVerified": True},
    {"cardNumber": 3, "cardName": "The Brass Accountant", "lore": "Counts the trumpets, never the tunes. Every note audited, nothing heard.", "power": "Silences one brass band.", "mappingVerified": True},
    {"cardNumber": 4, "cardName": "The Last Float", "lore": "Arrives after the street is empty and declares the parade a total success.", "power": "Ends the parade.", "mappingVerified": True}]}
wj("fixture_parade.json", deck)
wj("fixture_other.json", {"schema": "kfb.asset-deck.v2", "deckId": "fixture_other", "title": "Other Fixture", "cards": [
    {"cardNumber": 1, "cardName": "The Stranger", "lore": "Came for another parade entirely.", "power": "None.", "mappingVerified": True}]})
media = {"deckTitle": "The Fixture Parade", "cards": [
    {"cardNumber": 1, "cardName": "The Ringmaster", "artworkPrompt": "Style: Retro comic. Subject: Top-hatted ringmaster whipping a giant pocket watch."},
    {"cardNumber": 2, "cardName": "The Paper Elephant", "artworkPrompt": "Style: Retro comic. Subject: Folded paper elephant sagging in rain."},
    {"cardNumber": 3, "cardName": "The Brass Accountant", "artworkPrompt": "Style: Retro comic. Subject: Tuba with a ledger and reading glasses."},
    {"cardNumber": 4, "cardName": "The Last Float", "artworkPrompt": "Style: Retro comic. Subject: Lonely float with confetti cannon on empty street."}]}
wj("fixture_parade.pdf.json", media)

C1 = "The Ringmaster cracks the whip at the clock and sells tickets to the delay; everyone pays twice."
C2 = "The Paper Elephant looks enormous on the poster, folds flat when it rains; the crowd applauds."
C3 = "The Brass Accountant counts the trumpets, never the tunes; every note audited, nothing heard."
C4 = "The Last Float arrives after the street is empty and declares the parade a total success."
beats = ["[Spoken Word]",
         "Hey you at the back, yes you with the umbrella. Hold it up high, tonight you are the weather.",
         "I march this street every Sunday and I have never once seen it finish on schedule.",
         "First out of the gate, " + C1,
         "Behind him, " + C2,
         "[Crowd Cheering]",
         "Somebody always has to pay for the noise, and tonight it is the band.",
         C3,
         "Which leaves the sweepers. " + C4,
         "Keep the umbrella up, folks. The weather was the only act here that showed up on schedule.",
         "Stay Fluffy, Folks!"]
base_sl = {"schema": "kfb.songlines.r4", "deckId": "fixture_parade", "deckTitle": "The Fixture Parade", "revision": "fx1",
           "sourcePins": {"deck": {"path": "fixture_parade.json", "sha256": sha("fixture_parade.json")},
                          "media": {"path": "fixture_parade.pdf.json", "sha256": sha("fixture_parade.pdf.json")}},
           "performer": {"name": "The Ringmaster", "deckId": "fixture_parade", "cardNumber": 1, "stance": "tired parade veteran"},
           "selectionMode": "FULL_DECK", "bestOf": [1, 2, 3, 4], "bestOfReason": ["full deck"], "orderMode": "deck",
           "cards": [{"cardNumber": 1, "beats": [3], "cardText": C1}, {"cardNumber": 2, "beats": [4], "cardText": C2},
                     {"cardNumber": 3, "beats": [7], "cardText": C3}, {"cardNumber": 4, "beats": [8], "cardText": C4}],
           "songLineChanges": [], "cues": [{"afterBeat": 5, "cue": "crowd cheering swells under the band"}], "refrain": "",
           "visualMotifs": [{"cardNumber": 2, "motif": "folded paper elephant sagging in rain", "visualVerified": False}]}

def case(name, b=beats, mutate=None):
    w(name + ".suno.txt", "\n\n".join(b) + "\n")
    sl = copy.deepcopy(base_sl)
    if mutate:
        mutate(sl)
    wj(name + ".songlines.json", sl)

case("title_omitted_pass")
case("title_spoken_pass", [beats[0], "The Fixture Parade, and I am the one who has to march it. Hold your umbrella up high, tonight you are the weather."] + beats[2:])
case("wrong_card_fail", mutate=lambda s: s["cards"][3].update(cardNumber=9) or s["bestOf"].__setitem__(3, 9))
case("swapped_card_fail", mutate=lambda s: (s["cards"][1].update(cardText=C3, beats=[7]), s["cards"][2].update(cardText=C2, beats=[4])))
case("wrong_deck_fail", mutate=lambda s: s.update(deckId="fixture_other", deckTitle="Other Fixture"))
case("missing_mapping_fail", mutate=lambda s: s["cards"].pop(2))
case("bestof_no_reason_fail", mutate=lambda s: (s.update(bestOf=[1, 2, 4], bestOfReason=[], selectionMode="BEST_OF"), s["cards"].pop(2)))
case("pin_mismatch_fail", mutate=lambda s: s["sourcePins"]["deck"].update(sha256="0" * 64))
case("visual_unverified_fail", mutate=lambda s: s["visualMotifs"][0].update(visualVerified=True))
case("unverified_performer_fail", mutate=lambda s: s["performer"].update(name="The Grand Marshal"))
case("named_figure_no_performer_fail", [beats[0], "Uncle FrizzleBob here, hold your umbrella up high, tonight you are the weather."] + beats[2:],
     mutate=lambda s: s.update(performer=None))
case("sung_bracket_fail", beats[:6] + ["Somebody always has to pay for the noise (crowd boos), and tonight it is the band."] + beats[7:])
case("unknown_tag_fail", beats[:5] + ["[Confetti Explosion]"] + beats[6:])
case("over_5000_fail", beats[:9] + ["Keep the umbrella up, folks, keep it up through every wet Sunday this town ever scheduled." * 1] * 0
     + [("Keep the umbrella up, folks, and count the puddles slowly while the drums go quiet, " * 60).strip()] + beats[10:])
case("short_card_warn_pass", beats[:8] + ["Which leaves the sweepers. The Last Float declares the parade a total success."] + beats[9:],
     mutate=lambda s: s["cards"][3].update(cardText="The Last Float declares the parade a total success."))
case("edited_order_review_pass", beats[:3] + ["Behind him, " + C2, "First out of the gate, " + C1] + beats[5:],
     mutate=lambda s: (s.update(orderMode="edited"), s["cards"][0].update(beats=[4]), s["cards"][1].update(beats=[3])))
case("names_unsung_card_warn_pass", beats[:9] + ["Keep the umbrella up, folks. Even the paper elephant would agree with you."] + beats[10:],
     mutate=lambda s: (s.update(bestOf=[1, 3, 4], bestOfReason=["elephant cut: it only repeats the ringmaster joke"], selectionMode="BEST_OF"),
                       s["cards"].pop(1), s.__setitem__("visualMotifs", [])))

# STYLE
w("style_ok.style.txt", "STYLE A: Cumbia rebajada groove at 108 BPM, accordion, guacharaca, rubbery bass, timbales, warm tape mix, dry male baritone talk-singing with lazy swagger.\n\nSTYLE B: Ska at 126 BPM, upstroke guitar, walking bass, trombone and trumpet section, organ bubble, snappy snare, bright female voice, clipped and cheeky.\n")
w("style_same_family.style.txt", "STYLE A: Cumbia at 112 BPM, accordion, guiro, bass, congas, female voice.\n\nSTYLE B: Funk at 110 BPM, slap bass, clavinet, drums, horns, male voice.\n")
w("style_names_performer.style.txt", "STYLE A: Ska at 124 BPM, upstrokes, horns, Ringmaster voice barking, snare.\n\nSTYLE B: Funk at 112 BPM, slap bass, clavinet, male voice.\n")
w("style_no_bpm.style.txt", "STYLE A: Surf rock, reverb guitar, tom-heavy drums, bass, organ, deadpan male voice.\n\nSTYLE B: Disco, four-on-floor, strings, bass, female voice.\n")

# CRITIC v2
lyr = "title_omitted_pass.suno.txt"
w("title_omitted_pass.synopsis.txt", "A tired parade performer walks the audience through four parade figures, from the ringmaster to the last float, on a rainy Sunday.\n")
crit = {"schema": "kfb.song-critic.v2", "song": lyr, "lyricsSha256": sha(lyr), "styleSha256": sha("style_ok.style.txt"),
        "critic": "fixture/hand-written", "blind": True, "inputs": ["lyrics", "style", "synopsis"],
        "questions": {"standalone": {"answer": "yes", "observation": "The umbrella setup gives the listener a role at once."},
                      "performer": {"answer": "partly", "observation": "Weariness is clear, but the voice has little edge after beat 2."},
                      "storyBetweenCards": {"answer": "partly", "observation": "Beat 6 links the band to the noise; other links are thin."},
                      "individuality": {"answer": "partly", "observation": "Parade satire is legible but conventional."},
                      "outro": {"answer": "yes", "observation": "\"showed up on schedule\" pays off the opening complaint."},
                      "transferable": {"answer": "no", "observation": "Weather and parade imagery are specific."}},
        "flags": [{"beat": 6, "observation": "Only bridge with causality; rhythm drops here."}], "recommendation": "REVISE"}
wj("critic_v2_ok.critic.json", crit)
c = copy.deepcopy(crit); c["flags"][0]["observation"] = "Better: replace this bridge with a joke about the tuba."
wj("critic_v2_rewrite.critic.json", c)
c = copy.deepcopy(crit); c["lyricsSha256"] = "f" * 64
wj("critic_v2_stale.critic.json", c)
c = copy.deepcopy(crit); c["inputs"] = ["lyrics", "style", "synopsis", "source"]
wj("critic_v2_unblind.critic.json", c)
c = copy.deepcopy(crit); c["recommendation"] = "READY_FOR_WS0"; c["questions"]["transferable"]["answer"] = "yes"
wj("critic_v2_inconsistent.critic.json", c)
c = copy.deepcopy(crit); c["questions"]["outro"]["observation"] = "\"the parade ends in glory\" lands flat."
wj("critic_v2_fake_quote.critic.json", c)
print("fixtures geschrieben")
