#!/usr/bin/env python3
"""R4-Fixtures für song_gate.py (SONG_SPEC_R4 / V-576). Aufruf aus beliebigem Ordner: python3 run_fixtures.py
Prüft Exit-Code und eine erwartete Ausgabezeile je Fall; dazu Regression gegen echte R3.7-Songs und R2-Unverändertheit."""
import hashlib, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(H)                       # replies/
ROOT = os.path.abspath(os.path.join(R, "../../../../../.."))   # Repo-Wurzel
GATE = os.path.join(R, "song_gate.py")
DECK, MEDIA = os.path.join(H, "fixture_parade.json"), os.path.join(H, "fixture_parade.pdf.json")


def lyr(name):
    return ["lyrics", os.path.join(H, name + ".suno.txt"), "--deck", DECK, "--media", MEDIA, "--registry", H,
            "--songlines", os.path.join(H, name + ".songlines.json")]


CASES = [  # (Name, Argumente, erwarteter Exit, erwartete Zeichenkette)
    ("Titel weggelassen = PASS", lyr("title_omitted_pass"), 0, "REVIEW C9: Decktitel"),
    ("Titel gesprochen = PASS", lyr("title_spoken_pass"), 0, "INFO C9: Decktitel-Wörter in Beat [1]"),
    ("falsche Karte (ID nicht im Deck) = FAIL", lyr("wrong_card_fail"), 1, "FAIL S4: bestOf enthält Kartennummern"),
    ("vertauschte Karte (Text gehört anderer Karte) = FAIL", lyr("swapped_card_fail"), 1, "FAIL A2: Karte 2: Kartentext nicht aus dieser Karte"),
    ("falsches Deck = FAIL", lyr("wrong_deck_fail"), 1, "FAIL S1: songlines.deckId"),
    ("Karte ohne Zuordnung = FAIL", lyr("missing_mapping_fail"), 1, "FAIL S5: Karten aus bestOf ohne Beat-Zuordnung: [3]"),
    ("Best-of ohne Begründung = FAIL", lyr("bestof_no_reason_fail"), 1, "FAIL S4: Best-of ohne bestOfReason"),
    ("Pin passt nicht = FAIL", lyr("pin_mismatch_fail"), 1, "FAIL S2: sourcePins.deck.sha256 passt nicht"),
    ("visualVerified ohne Beleg = FAIL", lyr("visual_unverified_fail"), 1, "FAIL S3"),
    ("Performer nicht verifiziert = FAIL", lyr("unverified_performer_fail"), 1, "FAIL C9P: Performer-Name"),
    ("Figur im Rahmen ohne Performer = FAIL", lyr("named_figure_no_performer_fail"), 1, "FAIL C9P: Rahmen nennt Figur"),
    ("Klammer im gesungenen Text = FAIL", lyr("sung_bracket_fail"), 1, "FAIL A6: Klammer im gesungenen Text"),
    ("unbekannter Cue-Tag = FAIL", lyr("unknown_tag_fail"), 1, "FAIL A6: Beat 5: Cue-Tag"),
    ("über 5000 Zeichen = FAIL", lyr("over_5000_fail"), 1, "FAIL C12: "),
    ("Kartenzeile zu kurz = nur WARN", lyr("short_card_warn_pass"), 0, "WARN A4: Karte 4"),
    ("Reihenfolge geändert = REVIEW", lyr("edited_order_review_pass"), 0, "REVIEW C10: Reihenfolge redaktionell geändert"),
    ("Rahmen nennt nicht gesungene Karte = WARN", lyr("names_unsung_card_warn_pass"), 0, "WARN S5: Rahmen-Beat 9 nennt Karte 2"),
    ("STYLE ok", ["style", os.path.join(H, "style_ok.style.txt"), "--deck", DECK, "--songlines", os.path.join(H, "title_omitted_pass.songlines.json")], 0, "Familie A latin"),
    ("STYLE Hauptgenre doppelt im Batch = FAIL", ["style", os.path.join(H, "style_same_family.style.txt"), "--batch", os.path.join(H, "style_ok.style.txt")], 1, "FAIL D13b: Hauptgenre-Familie 'latin'"),
    ("STYLE nennt Performer = FAIL", ["style", os.path.join(H, "style_names_performer.style.txt"), "--deck", DECK, "--songlines", os.path.join(H, "title_omitted_pass.songlines.json")], 1, "FAIL V-362"),
    ("STYLE ohne BPM = nur WARN", ["style", os.path.join(H, "style_no_bpm.style.txt")], 0, "WARN D13b: Variante 1: keine BPM-Angabe"),
]
CRIT = lambda n: ["critic", os.path.join(H, n + ".critic.json"), "--lyrics", os.path.join(H, "title_omitted_pass.suno.txt"),
                  "--style", os.path.join(H, "style_ok.style.txt"), "--synopsis", os.path.join(H, "title_omitted_pass.synopsis.txt")]
CASES += [
    ("Kritiker v2 gültig", CRIT("critic_v2_ok"), 0, "critic v2"),
    ("Kritiker v2 mit Ersatztext = FAIL", CRIT("critic_v2_rewrite"), 1, "klingt nach Textvorschlag"),
    ("Kritiker v2 für alte Fassung = FAIL", CRIT("critic_v2_stale"), 1, "lyricsSha256 passt nicht"),
    ("Kritiker v2 sah Quelle = FAIL", CRIT("critic_v2_unblind"), 1, "inputs nur aus"),
    ("Kritiker v2 READY trotz Übertragbarkeit = FAIL", CRIT("critic_v2_inconsistent"), 1, "READY_FOR_WS0 trotz"),
    ("Kritiker v2 erfundenes Zitat = FAIL", CRIT("critic_v2_fake_quote"), 1, "steht nicht im Kandidaten"),
]
# Regression: Altbestand (R3.7 PASS) bleibt PASS unter R4, Titel-Zuordnung
REG = [("grimms_kayfabe_legends_expansion_set_02", "SONG_CRITICS_R3/r46/grimms_kayfabe_legends_expansion_set_02.r5.2", "GRIMMS_KAYFABE_LEGENDS_EXPANSION_SET_02_-_ADD_web.pdf.json"),
       ("dream_wrestling_with_kayfabe_freud", "SONG_CRITICS_R3/r46/dream_wrestling_with_kayfabe_freud.r4.6", "Dream_Wrestling_with_Kayfabe_Freud_-_ADD_web_ID.pdf.json"),
       ("the_carnival_of_unsolved_problems_therapy", "SONG_CRITICS_R3/r46/the_carnival_of_unsolved_problems_therapy.r4.6", "The_Carnival_of_Unsolved_Problems_-_THERAPY_-_ADD_web.pdf.json"),
       ("the_biological_metropolis", "SONGS_BESTOF_R1/the_biological_metropolis/the_biological_metropolis", "The_Biological_Metropolis_-_ADD_web_ID.pdf.json")]
for deck, stem, media in REG:
    m = os.path.join(ROOT, "media/kfb", media)
    if not os.path.isfile(m):
        print(f"SKIP Regression {deck}: {m} fehlt (sparse checkout?)")
        continue
    CASES.append((f"Regression R3.7 -> R4: {deck}", ["lyrics", os.path.join(R, stem + ".suno.txt"), "--deck",
                  os.path.join(ROOT, "registry/assets/v1/decks", deck + ".json"), "--songlines", os.path.join(R, stem + ".songlines.json"),
                  "--media", m], 0, "Titel-Zuordnung"))

R2_SHA = "e04de05adb5911e88be242ea489d4a6adb20171190530e8a2c653626c9d0f812"   # triplet_set_check.py darf sich nicht ändern (R2 unangetastet)
ok = 0
for name, args, exp, needle in CASES:
    p = subprocess.run([sys.executable, GATE] + args, capture_output=True, text=True)
    good = p.returncode == exp and needle in p.stdout
    ok += good
    print(f"{'ok  ' if good else 'FEHL'} {name}  (exit {p.returncode}, erwartet {exp})")
    if not good:
        print("     erwartet:", needle)
        print("     " + "\n     ".join(p.stdout.strip().splitlines()[:14]))
r2 = hashlib.sha256(open(os.path.join(R, "triplet_set_check.py"), "rb").read()).hexdigest()
r2ok = r2 == R2_SHA
print(f"{'ok  ' if r2ok else 'FEHL'} R2 triplet_set_check.py unverändert ({r2[:12]})")
total = len(CASES) + 1
print(f"{ok + r2ok}/{total} Fixtures bestanden")
sys.exit(0 if ok + r2ok == total else 1)
