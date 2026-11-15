# Acting-Katalog R1 · Körper-Clips für FrizzleBob und KayKit-NPCs (Recherche-Agent für WS0, 15.11.2026)

Baut auf RECHERCHE_MIMIK_R1 (Gesicht, Take-Timing nach Williams) und MENTALMODELL_BRAUEN_AUGEN_R1 auf. Das Gesicht wird hier nicht wiederholt, nur über die Schlüssel aus `ausdruck.js` angesprochen.
Legende: **[S]** = von der Quelle gesagt. **[I]** = Ableitung fürs Rig. Winkel in Grad wie in `haltung.js` (vor + = nach vorn, seite + = Kopf zu seiner Rechten, dreh + = zu seiner Linken). Frames bei 24 fps.
Ehrlich vermerkt: Blairs Buch selbst war nicht lesbar (PDF zu groß), Blair nur über Zweitquellen. Williams nur über die Seiten aus R1 und Inhaltsverzeichnis. Hooks nur über Kursnotizen.

## 1 · Kernregeln Körper-Acting

1. **Aktionslinie zuerst.** Eine Linie vom Nacken über die Wirbelsäule in die Beine trägt die Haltung, sie wird vor allem anderen gesetzt [S, Blair über Zweitquelle]. Am Extrem ist sie eine klare C- oder S-Kurve, nie gerade [I].
2. **Silhouette.** Eine Pose muss als schwarze Fläche lesbar sein [S, Spieldesign-Quellen]. Arme weg vom Rumpf, Luft zwischen Arm und Körper [I]. Spiele brauchen stärkere Posen und längere Halte als Film, weil jeder Winkel lesbar sein muss [S, Cooper].
3. **Squash und Stretch auf klobigen Rigs.** Viele Spiel-Rigs skalieren keine Knochen. Dann entsteht Stretch über gestreckte Glieder, Zehenspitzen und Kopf hoch, Squash über gebeugte Knie und Kopf zwischen den Schultern [S, Cooper]. [I] Wenn der Export Skalierung erlaubt: Rumpf und Kopf ±10 % (cartoon), ±20 % (extrem), Volumen erhalten (Stretch schmaler, Squash breiter).
4. **Kein Twinning.** Spiegelgleiche Arme und Beine und gleichzeitiges Timing wirken tot. Twinning ist fehlende Überlappung und fehlender Kontrast [S, Animation Mentor; Williams hat ein Kapitel dazu]. [I] Ein Arm führt 2–3 Frames vor, die Seiten bekommen verschiedene Höhen.
5. **Reihenfolge der Teile.** Bewegung läuft wie Strom durch die Gelenke, beim Zurückgehen umgekehrt [S, Babbitt über LeMay]. „Head leads“ bei Takes [S, Williams]. [I] Für Gefühlswechsel: Augen/Brauen → Kopf (+2 f) → Brust (+2 f) → Hüfte/Beine (+2–4 f). Für Kraftaktionen (Aufstampfen, Zeigen): Hüfte → Brust → Kopf → Arm.
6. **Status.** Hoch: Kopf still, Blick direkt, Zehen nach außen, ruhige glatte Bewegung. Tief: Kopf wackelt, Hände ans Gesicht, Zehen nach innen, ruckig [S, Johnstone und Hooks-Kursnotizen]. Hooks: Das Kraftzentrum unter dem Nabel; hoch = schneller Rhythmus, tief = langsamer [S].
7. **Denken → Gefühl → Handlung.** Gefühl führt zu Handlung, Denken zu Schlüssen [S, Hooks]. [I] Jeder Clip zeigt erst einen kurzen Wahrnehmungs-Beat (Blick), dann die Körperhandlung.
8. **Avery-Lesbarkeit.** Das Auge registriert eine Aktion in etwa 5 Frames, also muss die Reaktion fast sofort einschnappen [S, Avery über Cartoon Brew]. Die Haltepose steht mindestens 6 Frames [S, Williams/R1].

**Rig-Hinweis [I].** FrizzleBob: großer Kopf, kurze Arme. Arme erreichen nur Brust bis Scheitel, also tragen Kopfneigung, Ohren und Rumpfwinkel die Pose. Zeigen geht über das Lehnen des ganzen Körpers. KayKit Rig_Medium: keine Ohren, kurzer Hals, also mehr Weg über Arme, Schultern und Beine. Werte für KayKit etwa ×1,2 auf Arm- und Beinwinkel.

## 2 · Katalog

Phasen-Kürzel: **A** Ausholen · **E** Extrem (Einschnappen) · **H** Halten · **Ü** Überschwingen/Setzen · **R** Erholung. Alle Winkel [I], Richtungen nach den genannten Quellen. Stufen: **fein** ≈ ×0,5, keine Glied-Skalierung, kürzere Halte · **cartoon** = Werte unten · **extrem** ≈ ×1,7, Stretch/Squash voll, Füße verlassen den Boden, Augen-Pop nur auf dem E-Frame.

**1 · Jubel · `cheer_jump`** (one-shot)
Nutzen: NPC freut sich über Fund oder Sieg · Website: Erfolgsmeldung.
A 6 f: Knie 40° gebeugt, Rumpf vor 15°, Arme unten hinten, Kopf runter. E 2 f: Sprung oder Zehenspitzen, Rumpf zurück 10°, Arme V hoch (ein Arm 10° höher), Kopf zurück 15°. H 8 f in der Luft bzw. oben. Ü 4 f: Landung in Squash, Knie 30°. R 10 f.
Gesicht: Lücke, kein Freude-Schlüssel; Behelf `entdecken` + `mund_smile`. Ohren hoch.
Stufen: fein = Arme bis Schulter, kein Sprung · extrem = 2 Hüpfer, Stretch 20 %.
Ersetzt/ergänzt: keins, fehlt in GEFUEHLE. Distanz: V-Arme = stärkste Silhouette.

**2 · Triumph · `triumph_pose`** (one-shot, Endpose hält)
Nutzen: Sieg nach Kampf · Website: Abschluss.
A 5 f: Rumpf kurz vor 10°, Faust an der Hüfte. E 2 f: Brust vor-oben (chest vor −11), Kinn hoch (head vor −13), eine Faust nach oben, andere Hand an die Hüfte. H 16 f. Ü 3 f: Faust federt 5° zurück. R 8 f oder Pose bleibt.
Gesicht: `triumph` (Ausrichtung schon da). Distanz: asymmetrische Arme lesen weit.
Stufen: extrem = Füße breit, Brust +20 % Stretch.
Ergänzt: HALTUNGEN.triumph, GEFUEHLE.stolz.

**3 · Doppel-Take · `double_take`** (one-shot)
Nutzen: NPC sieht FB erst beiläufig, dann richtig.
Beiläufiger Blick 4 f, Wegdrehen 8 f, Ausholen 4 f (Kopf dreht weg, Schultern hoch, Augen zu), 2 Kopfwechsel je 3 f, E auf Einern, H 9 f, Ü/Settle 7 f, R 10 f [S, School of Motion].
Körper: bei E Rumpf zurück 10°, Arme 20° gespreizt, Kopf vor zum Reiz.
Gesicht: `entdecken` auf E, `schreck` bei extrem.
Stufen: fein = nur Kopf · extrem = ganzer Körper springt hoch, Augen-Pop 1–2 f.
Ersetzt: REAKTIONEN.doppeltake (heute 24 f, zu kurz und überall weich).

**4 · Schreck · `startle_recoil`** (one-shot)
Nutzen: Explosion, Slop taucht auf.
A 1–2 f: unsichtbar, Kopf kurz vor [S, R1]. E 2 f: Rumpf zurück 15°, Schultern hoch, Arme vor die Brust, Hände offen, ein Fuß Schritt zurück. H 6 f mit Vibration (2-f-Wechsel) [S, School of Motion „moving hold“]. Ü 4 f. R 10 f.
Gesicht: `schreck`, Ohren flach zurück.
Stufen: extrem = Sprung nach oben, „shrink take“ vor E (2 f gestaucht) [S, Tyer über Cartoon Brew].
Ersetzt: REAKTIONEN.zucken für starke Reize.

**5 · Wut · `angry_stomp`** (one-shot)
Nutzen: NPC wird provoziert.
A 6 f: Bein hoch (Knie 70°), Rumpf zurück 8°, Fäuste hoch. E 1 f: Fuß knallt, Rumpf vor 12°, Kopf vor 11° und gesenkt, Fäuste runter neben die Hüfte. H 8 f mit Zittern. Ü 3 f: Rumpf federt. R 8 f.
Gesicht: `grimmig`, Zähne. Hoher Status: Kopf still während H.
Stufen: fein = Fuß nur angedeutet · extrem = 3 Stampfer, Squash beim Aufprall, Dampf-VFX nur, wenn Kanon.
Ergänzt: HALTUNGEN.drohend, GEFUEHLE.wut.

**6 · Frust · `frustration_throw`** (one-shot)
Nutzen: Fehlversuch, Kiste klemmt.
A 5 f: Arme hoch über den Kopf, Rumpf zurück. E 2 f: Arme schlagen nach unten, Kopf in den Nacken (head vor −20), Knie leicht weich. H 8 f. Ü 4 f: Schultern sacken. R 10 f.
Gesicht: Lücke; Mischung `grimmig` mit Augen zu, Mund `ah`.
Stufen: extrem = Faust auf den Boden. Ersetzt: nichts vorhanden. Distanz: Arme-runter-Schlag lesen weit.

**7 · Trauer · `sad_slump`** (one-shot, Endpose als Loop möglich)
Nutzen: verlorene Karte · Website: Fehlerseite.
A 4 f: kurz Luftholen, Brust hoch. E langsam 10 f: Rumpf vor 8°, Brust vor 10°, Kopf vor 15°, Schultern fallen, Arme hängen. H 20 f+ mit Atem. R 12 f.
Gesicht: `besorgt`, Blick nach unten, Ohren hängen.
Stufen: extrem = Knie weich, Kopf fast auf der Brust. Distanz: hängende Ohren tragen am meisten.
Ergänzt: HALTUNGEN.traurig.

**8 · Angst · `fear_tremble`** (Loop)
Nutzen: NPC vor Boss · Website: kaum.
Einstieg 6 f in Pose: Rumpf vor 10°, Knie zusammen (Zehen innen = tiefer Status), Hände vor dem Mund, Kopf eingezogen. Loop 8 f: Zittern ±2° auf Zweiern, Kopf leicht seitlich weg. Ausstieg 10 f.
Gesicht: Lücke, kein eigener Angst-Schlüssel (Brauen 1+2+4); Behelf `schreck` mit kleineren Lidern.
Stufen: fein = nur geduckt · extrem = Knie schlottern ±6°.
Ergänzt: HALTUNGEN.geduckt/zurueck, GEFUEHLE.angst.

**9 · Neugier · `curious_lean`** (one-shot, H als Loop)
Nutzen: NPC beäugt FB · Website: Hover.
A 3 f: Kopf kurz zurück. E 6 f weich: Rumpf vor 10°, Brust vor 7°, Kopf seitlich 14°, Hände hinter dem Rücken, ein Fuß auf Zehen. H 24 f, Kopf kippt 1× zur anderen Seite. R 8 f.
Gesicht: `entdecken` schwach, Ohren vor.
Ergänzt: HALTUNGEN.neugierig. Distanz: Lehnen zum Ziel plus Kopfkippen.

**10 · Skepsis · `skeptic_lean`** (one-shot)
Nutzen: NPC glaubt FB nicht.
A 3 f: Kinn kurz runter. E 4 f: Rumpf zurück 6°, Kopf weggedreht 10°, Seitenblick zurück, Arme verschränkt (FB: Hände an die Hüften, Arme zu kurz). H 16 f. R 8 f.
Gesicht: `kameraL`/`kameraR` (Welle), ein Ohr zuckt.
Ersetzt: HALTUNGEN.skeptisch um Arme ergänzt.

**11 · Stolz · `proud_chest`** (one-shot)
Nutzen: Händler preist Ware.
A 4 f: Luft holen, Rumpf leicht vor. E 3 f: Brust raus (chest vor −10), Kinn hoch, Hände an die Hüften, Füße breit, Zehen außen. H 20 f, Kopf still. R 8 f.
Gesicht: `triumph`. Status hoch: keine Kopfwackler. Distanz: Ellbogen-Dreiecke an der Hüfte.
Ergänzt: HALTUNGEN.stolz.

**12 · Verlegenheit · `embarrassed_shy`** (one-shot)
Nutzen: NPC ertappt.
A 3 f: Blick hoch. E 6 f: Kopf runter 10° und seitlich, Schultern hoch, Hand an den Hinterkopf oder Nacken, Fußspitze dreht im Boden, Zehen innen. H 16 f, Blick kurz hoch, wieder weg. R 8 f.
Gesicht: Lücke; Behelf `warten` + `mund_smile`, Blick weg.
Distanz: Hand am Kopf ist das Lesezeichen. Ersetzt: nichts.

**13 · Langeweile/Ungeduld · `bored_tap`** (Loop)
Nutzen: Leerlauf NPC und Website-Idle.
Einstieg 8 f: Gewicht auf ein Bein, Hüfte seitlich, Arme hängen oder verschränkt. Loop 24 f: Fuß klopft auf Zweiern (4 Klopfer), Kopf seitlich 5°, alle 3 Loops ein Seufzer (Schultern hoch 6 f, runter 10 f). Ausstieg 8 f.
Gesicht: `gelangweilt` bzw. `warten` (Ungeduld). Distanz: schiefe Hüfte und Seufzer, das Klopfen nur nah.
Ergänzt: Leerlauf, ersetzt nichts.

**14 · Nachdenken · `think_chin`** (Loop)
Nutzen: Rätsel-NPC · Website: „lädt“.
Einstieg 8 f: Hand ans Kinn (KayKit) oder an die Wange (FB), anderer Arm stützt den Ellbogen, Kopf seitlich 8°, Blick nach oben-seitlich [S, Etherington: Grübeln = Augen weg]. Loop 32 f: Kopf wiegt, Finger tippt alle 8 f. Ausstieg: optional Idee-Take (Finger hoch, 2-f-Einschnappen).
Gesicht: Lücke, kein Denk-Schlüssel (Blick-Kanal fehlt). Distanz: Hand am Kopf, Kopf schräg.

**15 · Erklären/Zeigen · `explain_point`** (one-shot)
Nutzen: NPC weist den Weg · Website: Feature erklären.
A 6 f: Arm über die Gegenseite zurückgezogen, Rumpf dreht weg 15°. E 2 f: Arm schießt zum Ziel, Rumpf dreht hin und lehnt 10° vor, Kopf folgt 2 f später, Blick zum Ziel, dann zum Gegenüber. H 12 f. Ü 3 f: Finger federt. R 8 f.
Gesicht: `entdecken` schwach + `mund_oh`.
Hinweis: Reihenfolge Schulter → Ellbogen → Hand [S, LeMay]. FB lehnt ganz, weil der Arm kurz ist.

**16 · Ja/Nein · `yes_body` / `no_body`** (one-shot)
Ja: A 3 f Kinn hoch, dann 2 Nicker (16°, 9°), Brust geht mit 2–3°, Knie federn beim ersten Nicker. 20 f gesamt.
Nein: A 3 f Kopf leicht vor, Kopf dreht ±18 → ±8, Schultern drehen gegen 4°, eine Hand wedelt flach. 20 f.
Gesicht: Ja `mund_smile`, Nein `besorgt` schwach oder `grimmig` schwach.
Ergänzt: REAKTIONEN.nicken/kopfschuetteln um Brust, Knie und Hand. Distanz: ohne Brust und Hand liest sich der Kopf allein nicht [I].

## 3 · Reaktions-Hierarchie und Kombi-Regeln

- **Reihenfolge:** Blick führt, dann Brauen/Lider, dann Kopf, dann Brust, dann Hüfte und Beine, je 2 f versetzt [S Williams/Avery für Kopf vor Bauch; Abstände I].
- **Was trägt wo:** Nah trägt das Gesicht. Mittlere Distanz trägt die Körpersilhouette, bei FB vor allem Ohren und Kopfwinkel [I, deckt sich mit dem Kommentar in ausdruck.js]. Deshalb jeder Clip zuerst ohne Gesicht lesbar.
- **Gelesen wird die Settle-Pose,** nicht der Akzent [S, Williams, School of Motion]. Settle ≥ 6 f, Akzent darf 1 f sein.
- **Kein toter Halt:** Halte mit Mikro-Drift oder 2-f-Vibration (Angst/Wut) [S, moving hold].
- **Ein Gefühl pro Beat [I].** Wechsel nur über neuen A-Beat.
- **Unterbrechbar:** Jeder Clip muss aus jedem Frame zurück ins Idle blenden; Reaktionen als additive Oberkörper-Schicht über Fortbewegung [S, MoCap Online]. Für Gegner: längere Ausholphase = besser lesbare Absicht [S, Cooper].
- **Status hält:** Hochstatus-Figuren (Händler, Boss) bewegen den Kopf im Halt nicht [S, Johnstone].

## 4 · Lücken in den Tabellen

**ausdruck.js:** kein Freude-Gesicht (nur `mund_smile`), keine eigene Angst (Brauen 1+2+4), keine Verlegenheit, kein Nachdenken, kein Frust. Kein Blick-Kanal relativ zum Kopf (für Seitenblick, Grübeln, Verlegenheit nötig). Kein Pupillen-Kanal („shrink for intensity“, R1). Kein Augen-Pop für extrem. Kein Blinzeln im Take-Timing (Augen zu im Ausholen).
**haltung.js:** keine Beine, Hüfte, Füße (Aufstampfen, Zehen innen/außen, Knie, Gewicht auf ein Bein). `arme` ist ein einziger Wert, also keine Armposen (Hände an Hüfte, Faust hoch, Zeigen, Hand an Kopf, verschränkt). Kein Root-Versatz (Sprung, Schritt zurück). Kein Squash/Stretch. Alle REAKTIONEN laufen mit smoothstep; es fehlen lineare Einschnapper, 1-f-Pops und Halte mit Vibration. Keine Loops. Zeit in Sekunden statt Frames. GEFUEHLE fehlt: freude, frust, verlegenheit, langeweile, nachdenken, erklaeren; ueberraschung nutzt `zucken` statt Doppel-Take.

## 5 · Quellen

- Williams, *The Animator's Survival Kit* (Seiten über R1; Kapitel Anticipation, Breaking Joints, Twinning laut Inhaltsverzeichnis): https://dn721807.ca.archive.org/0/items/taskav-01/The__Animator%27s_Survival_Kit%5B1%5D_text.pdf
- School of Motion, Takes und Doppel-Takes, Frames je Phase [S]: https://www.schoolofmotion.com/blog/how-to-animate-character-takes
- Cartoon Brew, Geschichte der Wild Takes, Avery 5 Frames, Tyer-Shrink-Take [S]: https://www.cartoonbrew.com/classic/a-thrilling-tour-through-the-history-of-wild-takes-in-animation-243744.html
- J. Cooper, *Game Anim*, Auszug zu den 12 Prinzipien im Spiel [S]: https://www.gamedeveloper.com/production/the-12-principles-of-animation-in-video-games
- Hooks, Prinzipien (Blognotizen): https://adweaver.blogspot.com/2012/12/7-acting-principle-ed-hooks.html · Kraftzentrum, Status: https://adamthomson.blogspot.com/2010/11/ed-hooks-lecture-notes.html · Buch: https://www.routledge.com/Acting-for-Animators/Hooks/p/book/9781032266473
- Johnstone, Status (Zweitquellen): https://medium.com/@fortelabs/the-introvert-s-guide-to-status-games-f4632043397e · https://performativebafflement.substack.com/p/improv-techniques-to-be-better-at
- Aktionslinie nach Blair (Zweitquelle): https://animateducated.blogspot.com/2013/10/the-jump-and-take.html · https://floobynooby.blogspot.ch/2011/01/lines-of-action-mickeys-christmas-carol.html
- Babbitt, Successive Breaking of Joints: https://brianlemay.com/Pages/animationschool/animation/1stsemesteranimation/successivebreaking.html
- Twinning (Animation Mentor, nur Suchauszug, Seite gesperrt): https://animationmentor.com/?p=4836
- Emotes unterbrechbar, additive Oberkörper-Schicht: https://mocaponline.com/blogs/mocap-news/dance-animation-games-guide
- Körpersprache je Gefühl (Trauer, Stolz, Scham): https://posemy.art/blog/drawing-emotions-body-language/
- Sherm Cohen, „Push your Poses“: https://www.deviantart.com/shermcohen/art/Tutorial-8-Push-your-Poses-144376728
- Etherington, Grübeln/Blick (über R1): https://theetheringtonbrothers.blogspot.com/2021/08/brand-new-tutorial-how-to-think-when_8.html
