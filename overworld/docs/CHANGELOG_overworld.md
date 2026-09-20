# Changelog — KFB Overworld (2D Mini-RPG)

## V10-S25 · Drei Ebenen je Begriff, und ein Standalone, der die Tusche lädt · 2026-08-10

**A1 geschlossen** (Georg, 10.8.). `Kayfabe` ist player-facing der **Wert**, intern bleibt »kayfabe«
der Realitätsrahmen — die zweite Ebene wird ausdrücklich behalten, weil sie der nützlichste Operator
gegen »aber der Kanon sagt XYZ« ist. Daraus die allgemeine Regel **K7** (ID · Label · Short: ein
String macht nicht drei Jobs) und **K8** (`docs/GLOSSAR_KFB.md` ist die eine Begriffstabelle, Quelle
je Zeile). `K-Fabe` gestrichen — nachgezählt: kein Treffer im Masterplan, keiner im Runner, einzige
Quelle Living Concept §16. Schmähruf-Stufen heißen jetzt `P1/P2`, `K1/K2` gehören den Kanon-Regeln.

**Der Befund, der die Label-Entscheidung beinahe gekostet hätte.** Das HUD-Kürzel war
`name.slice(0,3)` — abgeleitet, nirgends gesagt. Mit den kanonischen Etiketten hätte das
**Kay · Kay · Kay** geliefert: KayfaBingo, KayfaBongo, KayfaBoggle und Kayfabe fangen gleich an. Vier
identische Kürzel in einem Panel mit sechs Zahlen, ohne eine einzige Fehlermeldung. `short` ist
deshalb jetzt ein eigenes Feld in `STAT_INFO`; das HUD liest es, der Schnitt bleibt nur als Rückweg.
*Ein Etikett zu ändern, das jemand anders zerschneidet, ist keine Textkorrektur.*

Dieselbe Klasse zweimal weiter: das **zweite, kompakte Panel** des Runners setzte die vollen Namen
und schnitt sie ab (jetzt `short` + Tooltip). Und `.v7-hero .lab` setzte Versalien über das Kürzel —
im Feld stand `Blö`, im Bild `BLÖ`; die Regel gilt jetzt nur noch außerhalb des Werteraster.
`BLÖ` war dabei nie eine Kennung: die Zeichenfolge stand in keiner Zeile Code, die ID heißt
`bloedsinn`.

**Selbst gebaut, selbst bezahlt:** ein Kommentar mit Backticks in `hud-v7.js` — die Datei baut ihr
Stylesheet als Template-Literal. Der erste Backtick beendete den String, die Datei parste nicht mehr,
**das ganze Papier-HUD fiel aus**. Codenamen stehen dort ab jetzt in »…«. Hausregel: *ein Kommentar
in einem Template-Literal ist kein Kommentar, sondern Inhalt.* Dieselbe Klasse traf am selben Tag den
Masterplan-Leser, dem der Zaun-Zweig fehlte — beide Male hat eine Zeichensetzung eine Ebene verlassen,
die niemand geprüft hatte.

**Standalone-Fehler gefunden und geschlossen (`OW_SRC.rel`, src-v1.1).** Drei Module lösten
Nachbardateien gegen `location.href` bzw. die eigene `script.src` auf. Im Standalone ist beides
`blob:` — ein opakes Schema ohne Pfad, `new URL('./x','blob:…')` **wirft**. Die Tusche des HUD kam
im Auslieferungszustand deshalb **gar nicht**; im Projekt lief alles. Gemessen: S22 hatte eine
unbehandelte Zurückweisung in `loadInk` und keine Kanon-Zeile, S25 hat `[hud-v7] Kanon:
kfb-ink-canon.js · opt ja`. Der Rückweg braucht den **Repo-Pfad** als drittes Argument — der erste
Versuch riet die Wurzeladresse und lieferte die nächste stille 404.
*Ein Fehler, der nur im Auslieferungszustand auftritt, ist genau der, den der andere Workspace sieht.*

**Export `export/overworld-v10-S25_2026-08-10/`** — 39/39 Module, 0 Fehler, 3 Warnungen (alle drei
fehlende Bytes im Repo, keine Auflösung: `sheet-02.png`, `card-grids.json`, `drop_002.ogg`).
Ersetzt S22 als Fork-Punkt für WS0; `KFB Pet Studio v4.dc.html` liegt darin.

## V10-S24 · Der Heiler stand am Bildtakt · 2026-08-10

WS0-Befund (Handover 10.8., §3.1): **dieselbe Fehlerklasse zum zweiten Mal.** Bei ihnen war es
`reconcile()`, bei uns **`loadZoneCard()` im Zeichenpfad**. Drosselt der Browser die Bilder —
Hintergrundtab, Vorschau ohne Fokus, Screenshot-Lauf —, heilt eine geräumte Zone ihre fehlende
Kartenkunst nie und zeigt dauerhaft die Rückseite. Der zweite Aufrufer (beim Sieg) griff, der
Reparaturpfad nicht.

Jetzt in `step()`, höchstens eine Ladung je Sekunde. WS0s Merksatz steht als Kommentar an der
Stelle: **was einen Zustand zeigt oder heilt, gehört nicht ans Bild. Animation ja, Zustand nein.**

**Drei eigene Fehler aus demselben Handover, alle angenommen:**

1. **Augengröße war aus einem Beispiel geschlossen.** Ich hatte eine Einheit gemessen (bodyH 72,8)
   und daraus »72–86« gemacht; WS0 hat alle 31 gemessen: **31–111 px**. Ein 13-px-Auge ist auf dem
   Schaf 42 % der Körperhöhe und auf dem Bären 12 %. Gilt jetzt: `0.16 × bodyH`, geklemmt 6…14.
   *Eine Spanne aus einem Beispiel ist keine Spanne.*
2. **Das Food-Emote-Pack gibt es im Repo so nicht** — ich hatte aus einem Screenshot geschlossen.
   WS0s Gegenvorschlag ist besser: **eine Zwiebel in zehn Stimmungen** als Running Gag statt einer
   Requisitenkiste.
3. **»Kein Menü« war zu pauschal.** Gemeint war *keine Werte-Tabelle*, verstanden wurde *keine
   Preisliste* — und WS0s Einwand sticht: *ein Automat ohne Preisschild ist ein Glücksspiel.*
   Preise zu zeigen ist nicht dasselbe wie Werte anzuzeigen. Die Liste bleibt, bekommt die
   **Anmutung** des Automaten; die Tüte ist HUD-Möbel, nicht zweite Bedienstelle.

Antwort: `docs/ANTWORT_WS0_2026-08-10_handover.md`. `KFB Pet Studio v4.dc.html` liegt für sie in
`export/fuer-WS0/` — es war in unserem Projekt, nicht im Repo, deshalb fanden sie nur den 3D-Editor.

## V10-S23 · Der dritte Sprecher — Therefore/But läuft zwischen den Panels · 2026-08-10

**Georgs Korrektur, und sie sitzt tiefer als mein Einwand.** Ich hatte Therefore/But als
**Satzform** verstanden. Richtig ist: es läuft **zwischen Sprechern** — South-Park-Closure über
drei Panels, also über drei Karten, also über drei Mobs:

```
Goblin A: These      »Kayfabe-Kant!«
Goblin B: Antithese  »Blödsinn!«
Goblin C: Synthese   »Then let us get a snack.«
```

Die Kausalität entsteht **im Kopf des Zuhörers**, nicht in einem Bindewort. Improv-Ping-Pong statt
Dialogbaum — und der Dritte macht aus zwei Sätzen erst ein Gespräch.

**Gebaut:** `OW_PHRASES.SYNTHESE` (neun Register) und der dritte Zug in `mob-ai.js` — wer
antwortet, sucht einen Dritten in der Nähe (nicht den Ersten) und reicht weiter. Die stärkste
Synthese kippt in eine **Handlung**: nicht »interessant«, sondern »dann lass uns«. Deshalb tragen
die meisten ein Vorhaben statt eines Urteils.

**Nachtrag S23b — die Ursache war eine andere, als ich vermutet hatte.** Mein erster Eintrag sagte,
die Kette scheitere am seltenen `chat`-Zustand. Falsch: die Prüfung hat sie achtmal ausgelöst —
These 8/8, Antithese 8/8, dritter Sprecher 7/8 gewählt, `syntheseIn` zählt sauber herunter. Sie
brach **beim dritten Zug am eigenen Präsentationsbudget**: These und Antithese hatten es gefüllt,
und die Synthese fiel in den gewöhnlichen Pfad. Die Gegenprobe nagelt es fest — dieselbe Lage, nur
die Lebensdauer der These verändert: mit `life=6` bleibt die Synthese aus, mit `life=1.2` kommt
sie. *Die Kette schloss sich nur, wenn die These zufällig vorher auslief: ein Rennen, kein
Verhalten.*

Dieselbe Klasse wie beim Schmähruf (S19b/c), zum dritten Mal: **ein Zug, der zu einem Wortwechsel
gehört, fällt unters gewöhnliche Budget — ausgerechnet dann, wenn der Wortwechsel es selbst
gefüllt hat.** Diesmal an der Wurzel: Blasen tragen eine `chatId`, und `weltVoices()` zählt eine
Kette als **einen** Eintrag. Georgs Regel nennt »kurze social calls« ausdrücklich als Ausnahme, und
eine Dreier-Kette ist genau das: *ein Gespräch ist ein Angebot, nicht drei.*

**Status: `PARTIAL`** — die Ursache ist behoben und begründet, die Kette in einem Durchlauf habe
ich selbst noch nicht gesehen (mein Prüfaufbau löst den zweiten Zug nicht aus, die Prüfung schon).
*Eine Kette, die ich nicht gesehen habe, ist nicht belegt* — auch wenn die Rechnung stimmt.

## V10-S22 · Der Haken für die Lulls-Skins · 2026-08-10

WS0s Befund zum Skin-Briefing: »wer ruft `draw()`?« — und das war die einzige echte Blockade. Der
Zeichenpfad gehört dem Runner, also gehört der Haken hierher; sonst wären »kein DOM-Overlay« und
»kein Eingriff im Runner« nicht gleichzeitig erfüllbar.

Er sitzt **nach der Einheit und vor dem Etikett**: ein Skin liegt über der Figur, aber unter ihrer
Beschriftung. Getragen wird er von `u.skin`. Zwei Uhren, wie WS0 richtig anmerkte — `dt` fürs
Schweben (es schwebt auch im Stand), `moved` für alles, was am Laufen hängt; für den Helden wird die
Strecke jetzt eigens gemerkt, weil er kein `ai.moved` hat. Eine werfende `draw()` wird **einmal**
gemeldet statt das Bild zu töten.

**Abnahme:** mit einer Probe-Implementierung 123 Aufrufe in 1,3 s, `dt` und `moved` kommen beide an
(109 Aufrufe mit Strecke > 0 beim Laufen), und nach dem Entfernen von `OW_SKINS` läuft die Schleife
ohne Fehler weiter.

**Drei weitere Löcher im Briefing geschlossen** (Zustand gehört WS0 mit Schlüssel Einheit × skinId ·
zwei Uhren im Vertrag · Luftballon wird gezeichnet, nicht eingekauft) und zwei Ergänzungen von WS0
übernommen — die beste: **die K1-Regel braucht einen Testfall statt einer Absichtserklärung.** Im
Showroom den Skin neben einen echten Effekt stellen und einen Dritten fragen, welcher etwas kann.
*Wer den Skin nennt, hat den Beweis geliefert.*

## V10-S21b · Zwei Übernahmen aus dem Konzept-Workspace · 2026-08-10

**Statusvokabular für Handoffs** (Masterplan §6): `BUILT · PARTIAL · OPEN · HOOK · DEFERRED ·
REJECTED`. Ein Handoff, das Produktion auslöst, muss den tatsächlichen Runtime-Stand kennen — am
10.8. beinahe teuer geworden.

**Leichenfledderer bleibt deutsch.** Nicht als Übersetzungslücke, sondern als **Eigenname** —
dieselbe Klasse wie BLÖDSINN! und Kayfabulation. Übersetzt (»Grave Robber«) verlöre er, was ihn zum
Titel macht. Jetzt sechster Titel, verdient mit der ersten geborgenen Karte.


## V10-S21 · Zwei Übernahmen aus der Voice Engine · 2026-08-10

Aus dem NIE-Kompass (`KFB_ChatGPT_VoiceEngine_NIE+FrizzleBob.md`) zwei Regeln, die sofort auf den
Code trafen.

**1 · Layer Zero: keine Gedankenstriche im Gesprochenen.** Gegen den Vorrat gehalten — **zwei** von
143 Spielzeilen hatten einen (`»{X}« — that is how they get you.` und `Arbeitstiere — das sind
wir…`). Beide umgebaut. Die Regel gilt für das, was eine **Figur sagt**; Dokumentation und
Code-Kommentare bleiben, wie sie sind — das ist keine Ausnahme, sondern der Geltungsbereich.

**2 · Die Karte schlägt die Schlagzeile** (Handoff C1). Bisher wurde der Feed zuerst befragt (30 %),
auch wenn eine Karte in der Zone lag. Aber die Karte **ist** der semantische Kern, wenn es eine gibt
— sie ist das Beweisstück, die Schlagzeile ist Beiwerk. Jetzt kommt der Feed erst danach dran.
Gemessen in einer Kartenzone: 2 von 16 Zeilen nennen den Kartentitel, der Rest verteilt sich auf
Haltung und Tätigkeit — die Karte drängt sich nicht vor, sie hat nur Vortritt.

**Und ein Befund fürs Handoff, kein Code:** dessen »build now«-Liste (P 1–4, 11) beschreibt
größtenteils **unseren gebauten Stand als Auftrag** — Blasengeometrie, Denk- und Schreiblase,
Emote-Integration, Name/Titel-Zeile sind seit S18/S20 fertig. Würde WS0 danach loslegen, entstünden
zwei Blasenzeichner. Antwort mit Ist-Spalte: `docs/ANTWORT_Handoff_und_VoiceEngine.md`.
*Ein Handoff, das Produktion auslöst, braucht eine Spalte »existiert bereits«.*


## V10-S20 · Name, Titel, Schmähung — die Welt kennt den Spieler persönlich · 2026-08-09

Drei Dinge, die zusammengehören, deshalb in einer Datei: `overworld/identity.js` (`OW_IDENT`).

**Der Name** steht beim Avatar, nicht in einem eigenen Fenster (ChatterBox §10) — eine Zeile über
Fluff und den sechs Werten. **Der Titel** ist eine **Trophäe, kein Wert**: K1 gilt, er ändert nichts
am Kampf, er ändert, wie über einen geredet wird. Start ist **Newbie**, »kein Titel« ist eine
gültige Wahl. Fünf Titel, bewusst wenige — *ein Titel, den jeder hat, ist kein Titel*: Newbie ·
Scourge of Swine (drei Schweine ohne Grund) · Keeper of Evidence · The Unwelcome (irgendwo tief
unten im Ruf) · Professionally Loud.

**Und dann die Stelle, um die es Georg ging:** wer eine Fraktion beleidigt, wird beleidigt — mit
**Namen und Titel**. Das Schwein, das dreimal grundlos abgestochen wurde, denkt beim vierten Mal
nicht »ein Mensch«, sondern »Here comes Scourge of Swine Georg again. The old dirt-SOW.« Das ist die
erste Stelle, an der die Welt den Spieler **persönlich** kennt, und sie kostet fast nichts: Ruf
(`journey.js`) und Plauderei (`chatter-2d.js`) laufen beide schon, sie wussten nur nichts
voneinander.

**Die Eskalationskette ist eine Schwelle, kein Automat** (KISS): ab Ruf **−3** wird geschmäht, ab
**−9** wird angegriffen. Der Spieler hört es also mehrfach, bevor es weh tut, und der Angriff
entsteht wie jede andere Aggro — nur mit anderem Anlass. Kein zweiter Zustandsautomat, keine
Timer-Kette.

**Sechs Schmähregister** nach Fraktion, damit ein Hofbeamter anders schimpft als ein Schwein:
»{who} is in the file. Twice.« · »Hide the buckets.« · »Even the echo is tired of {who}.«

**Abnahme:** `wer()` = »Scourge of Swine Georg«, HUD zeigt »Georg · Scourge of Swine« sichtbar beim
Avatar; bei Ruf **−5** kommen Schmährufe (»Scourge of Swine Georg. Again. Again. Again.«), bei Ruf
**0** keine; `greiftAn(−5)` false, `greiftAn(−9)` true; `verdient()` gibt bei drei toten Schweinen
Newbie **und** Scourge of Swine.

**Nachtrag S20b — drei Befunde, alle in derselben Ecke.**

1. **Der Standard-Spieler hieß »Newbie Newbie«.** `STANDARD` setzte Name *und* Titel auf »Newbie«,
   und `wer()` setzt beides zusammen — die Welt hätte einem frischen Spieler »Here comes Newbie
   Newbie again« nachgerufen. ChatterBox §10 meint es anders: der **Titel** ist per Vorgabe
   »Newbie«, der **Name** gehört dem Spieler. Jetzt steht dort »Someone«, bis er ihn setzt.
   Aufgefallen ist es nur, weil meine Abnahme über einen **selbst gesetzten** Namen lief — den
   Standardzustand hatte ich nie geprüft.

2. **Der Schmähruf wurde vom eigenen Budget verschluckt** — ausgerechnet im Moment, für den er
   gebaut ist. Der Eskalationspfad hing an `frei && potty`, aber **`potty` heißt »Glyph statt
   Wort«, nicht »Eskalation«**. Der Schmähruf kommt ohne `potty`, fiel also unters normale Budget,
   und wenn ein Kampf beginnt, ist das Budget am vollsten. Jetzt sagt der Aufrufer, was es ist
   (`eskalation` als eigenes Argument) — und weil auch die Eskalationsgrenze voll sein kann,
   **verdrängt** ein Schmähruf die erste gewöhnliche Blase, wie Sprechen einen Gedanken verdrängt.
   *Ein Vorrang, der nur bei freiem Platz gilt, ist keiner.* Und: *ein Merkmal, das man als
   Stellvertreter für ein anderes benutzt, trägt genau einmal.*

3b. **Und dann konnten sie wieder verloren gehen** (S20c). `pruefe()` schrieb
   `verdienteTitel = alle` — also die Momentaufnahme dessen, was **gerade** qualifiziert. Damit
   fiel ein Titel wieder heraus, sobald seine Bedingung nicht mehr galt: `hunt` ist ein
   Sitzungszähler und steht nach jedem Neuladen auf 0, `unwelcome` hängt am Ruf und der erholt
   sich. Gemessen: Besitz `[newbie, pigsbane]` → nach einem anderen Titel `[newbie, evidence]`,
   pigsbane still weg — und beim nächsten Mal wurde er ein zweites Mal »verdient«, mit zweitem
   Logbuch-Eintrag. Jetzt wird **ergänzt statt ersetzt**.
   *Eine Trophäe, die man wieder verlieren und noch einmal gewinnen kann, ist keine.*
   Gegenprobe: pigsbane erworben → `hunt` auf 0 zurück → anderen Titel ausgelöst → Besitz
   `[newbie, evidence, pigsbane, loud]`, **kein** doppelter Eintrag.

3. **Titel konnten nie verdient werden.** `verdient()` war eine Rechnung **ohne Aufrufer** — die
   Doku sagte »werden verdient«, im Spiel entstand keiner. Die Vergabe hängt jetzt am **Autosave**:
   er läuft nach jeder Tat, die etwas ändert, und nirgends sonst muss dafür Buch geführt werden.
   `pruefe()` meldet nur die **neu** dazugekommenen; getragen wird ein Titel **nicht automatisch**
   — er ist eine Wahl, kein Aufkleber. (Dafür zählt der Runner jetzt auch seine Schreie, sonst wäre
   »Professionally Loud« an einer Zahl gehangen, die niemand führt.)

**Abnahme:** Standard = `Someone` / `Newbie` · drei tote Schweine → Logbuch »Earned the title
»Scourge of Swine««, Besitz `newbie → newbie, pigsbane` · Schmähruf bei **4** belegten Blasen kommt
durch und verdrängt eine (4 vorher, 4 nachher), eine gewöhnliche Zeile im selben Moment nicht.

**Offen und bewusst nicht gebaut:** ein Fenster zum Namen-Ändern und Titel-Wählen. `setName`,
`setTitel` und `besitz()` liegen bereit, die Oberfläche gehört zu WS0s Heldenblatt (Paket 3).


## V10-S19d · Zwei Gehirne, zwei Zähler — und eine Schnittstelle, die warf · 2026-08-09

Das Budget aus S19 hatte einen Preis, den ich nicht gesehen habe: **`speak()` wurde von einem
versteckten Modulzustand abhängig.** `g0` wird nur in `step()` gesetzt; wer `OW_AI.speak()` von
außen ruft, bevor ein Takt lief — WS0s HUD zum Beispiel —, bekam
`TypeError: can't access property "mobs", g is null`. Vor S19 war `speak` selbstgenügsam.
Jetzt guardet es: **ohne Spiel gibt es kein Budget**, dann gilt die Blase. *Eine Schnittstelle darf
ablehnen; werfen darf sie nicht.*

**Der zweite Teil war schlimmer und älter.** `this.OWA=window.OW_AI` fing die Instanz ein, die beim
Weltaufbau zufällig da war. Wird das Modul später erneut ausgewertet, zeigt `window.OW_AI` auf eine
andere — und dann laufen **zwei Gehirne mit zwei Zählern**: gemessen `report().bubbles` **0** gegen
**219** im selben Augenblick. Genau die Klasse, die uns in dieser Session beim HUD fünfmal getroffen
hat, diesmal in unserem eigenen Code. Jetzt ist `OWA` ein **Getter** — er schlägt nach, statt
einzufangen, und kann nicht veralten. Auf »läuft« gaten bleibt: ohne `step()` gibt es kein Gehirn.

**Abnahme:** `g.OWA === window.OW_AI` → **true**; `OW_AI.speak()` von außen wirft nicht mehr und
gibt `true`; beide Zähler melden dieselbe Zahl (10 = 10).

*Wer eine Referenz zwischenspeichert, friert einen Zeitpunkt ein — und merkt es erst, wenn zwei
Wahrheiten nebeneinander zählen.*


## V10-S19 · Blasen sind Pull-Angebote, keine Beschriftung · 2026-08-09

Georgs Faustregel, und sie ist die wichtigste aus dem ganzen ChatterBox-Material: **höchstens ein
bis zwei Blasen in freier Wildbahn**, als Points of Interest, an denen der Spieler hängenbleibt —
nicht als Untertitel für alles.

Der Deckel gab es schon, aber **an fünf Stellen verstreut** (`zoneVoices(...)<2` an drei,
`<3` an zwei) — fünf Zahlen für eine Regel. Jetzt eine Stelle, `darfSprechen()`, und die Regel
ist schärfer:

- **höchstens zwei Blasen in der ganzen Welt** (vorher galt der Deckel nur je Zone, sechs Zonen
  konnten also sechsmal reden)
- **höchstens eine je Zone**
- **Sprechen schlägt Denken:** ist das Budget voll und will jemand sprechen, verdrängt er eine
  Denkblase. Umgekehrt nie — *ein Gedanke unterbricht kein Gespräch.*
- **`frei` umgeht alles.** Das ist die Ausnahme, die Georg benannt hat: Antwort, Fluch, Schmährufe,
  der eskalierende Streit. Wer im Kampf beschimpft wird, wartet nicht auf ein Kontingent.

**Nachtrag S19b/c — der Ausnahmepfad war unbegrenzt, und meine Abnahme lief daran vorbei.**
Zwei Fehler in einem:

1. `if(frei)return true` hieß **keine** Grenze statt einer höheren. Und `frei` steht nicht an
   Sonderstellen, sondern bei `reply` und `curse` — den zwei häufigsten Ereignissen im Kampf. Bei
   sechs Mobs war der Deckel damit faktisch aufgehoben: gemessen **4** gleichzeitige Blasen, in
   **38 von 50** Kampfproben über dem Budget.
2. `frei` sagte **zwei Dinge auf einmal**, und nur eines davon stimmte: »umgeht Abkühlung« ist
   richtig für Antwort und Fluch, »umgeht das Budget« nur für den Fluch. Eine Antwort ist normale
   Plauderei, keine Eskalation — deshalb stiegen auch **in Ruhe** bis zu 4 Blasen auf.

Jetzt trennt das Budget die beiden: **Fluch** (`potty`) ist Eskalation und darf bis
`BUDGET_ESKALATION=4`; **Antwort** darf den **Zonendeckel** überschreiten (ein Zwiegespräch ist eine
Zone mit zwei Stimmen), aber nicht das **Weltbudget**. Abkühlung und Dubletten-Sperre umgeht `frei`
weiterhin für beide — das war nie das Problem.

**Und über der Eskalationsgrenze verliert ein Fluch seine Blase**, nicht seine Stimme: er bleibt als
**nackter Pottymouth-Glyph** stehen, überlappend, 0,9 s. Das ist Georgs Bild vom Handgemenge
(»wilde, sich überlappende Glyphs«) und nicht vier volle Sprechblasen übereinander.

**Abnahme, diesmal in beiden Lagen** (die erste lief in einer kampffreien Phase, also genau nicht
durch den Fehlerpfad):
· **Ruhe**, 28 Proben: max **2**, Verteilung 0/1/2 = 5/1/22, **0** über dem Budget.
· **Kampf** mit sechs Aggro-Mobs und wiederholten Treffern, 32 Proben: max **4**, Verteilung
0/1/2/3/4 = 24/3/1/2/2, **0** über der Eskalationsgrenze; dazu bis zu 4 nackte Glyphs.

*Ein Schalter, der zwei Dinge auf einmal sagt, wird irgendwo für das falsche gelesen.*

*Zwei Blasen sind ein Angebot, sechs sind eine Wand.*


## V10-S18 · ChatterBox S1: Geometrie vor Streaming · Schrei · Denken · 2026-08-09

Die drei Dinge aus dem ChatterBox-Slice S1, die ohne weitere Absprache baubar waren.

**1 · Geometrie vor dem Streaming — die harte Regel.** Der vollständige Text wird **einmal**
gemessen, daraus entstehen Kontur, Zipfel und Jitter, und erst dann läuft der Text hinein. Ohne das
wüchse die Box mit jedem Zeichen, der Pfad würde 40× je Sekunde neu gebaut, und die Tuschekontur
zappelte beim Lesen. *Streaming ändert den Inhalt, nie die Form.* Streamtempo 55 Zeichen/s —
deutlich über Lesetempo, denn die beiden Uhren sind verschieden (S1 §5).
**Gemessen:** Blase bleibt **308×139**, während der Text von 9 auf 59 Zeichen wächst.

**2 · Der Schrei.** Vierter Typ neben `speech · thought · whisper`, und wieder **kein zweiter
Zeichner** (zur Verdrahtung siehe S18b unten): derselbe Zug wie `rectPath`, nur wird jede Kante gezackt statt gejittert — **der Zipfel
bleibt Teil derselben Fläche**. Zackentiefe hängt an der Kantenlänge, damit ein einzelnes Wort nicht
zum Seeigel wird. Schrift **Bangers**, ausdrücklich **nicht** Irish Grover: die trägt schon HUD und
Karten, und eine Schrift mit zwei Bedeutungen ist eine zweite Wahrheit über »laut«.
**Gemessen an BLÖDSINN!:** 36 Zacken, ein Pfad, Strich 3,2 (1,6× der normalen Feder), 29 px Bangers.

**3 · Denkblasen für Tiere und Arbeitende.** Der Typ hängt jetzt am **Wesen**, nicht am Satz: ein
Tier denkt immer, alle anderen denken, wenn sie niemanden ansprechen. Auf der Leinwand dieselbe
Grammatik wie im Overlay — Scallop-Wolke plus zwei atmende Kreise statt Zipfel, damit »denken«
überall gleich aussieht. Dazu **Tätigkeitsgedanken** (`OW_PHRASES.TAETIGKEIT`): vier Sätze je Lage
(critter · arbeit · wache · knochen), die von der **Tätigkeit** handeln statt vom Plot — »This grass
again.« · »Arbeitstiere — das sind wir…« · »I miss having knees.« Sie werden nur bei jedem dritten
Zug gezogen: wenn jedes Wesen dauernd denkt, wird die Welt zu Untertiteln.
**Gemessen:** `pig → thought`, `snake → speech`.

**Ein selbst gebauter Fehler:** die erste Typ-Erkennung prüfte `critter` und den Zustand `pause` —
das Schwein ist beides nicht (es trägt `critter:false` und stand auf `chat`) und sprach deshalb wie
ein Söldner. Jetzt entscheidet die **Art**, mit derselben Liste wie `chatter-2d.js`.

**Nebenbei:** Comic-Lettering ist **zentriert** (S1 §11) — links ausgerichtet las es wie UI-Text.

**Nachtrag S18b — die Kontur war toter Code.** »Kein zweiter Zeichner« stimmte für die Kontur und
nicht fürs Spiel: `type:'shout'` kam in `bubble-ts.js` fünfmal vor, in `mob-ai.js` und
`chatter-2d.js` **null mal** — kein Aufruf im ganzen Projekt übergab ihn. Geschrien wird an drei
Stellen über `say(…, 'shout')` (Ringsprecher-Ansagen und die BLÖDSINN!-Regie), und die landeten in
einem **dritten** Blasenzeichner im Runner: goldenes Rechteck, Dreieck-Zipfel, 17-px-Courier — ohne
Zacken, ohne Feder, ohne Bangers. Abgenommen hatte ich über einen direkten `OW_BUBBLE.zeigen()`-Ruf
aus dem Prüffenster, also genau nicht über den Bedienweg.
Jetzt leitet `say()` den Stil `shout` ins Overlay; alles andere bleibt, wo es war. Und weil ein
Schrei keine Knöpfe trägt, bekommt **er** eine Uhr — die bedienbare Blase behält ihre nicht (S1 §4).
**Abnahme über den echten Weg:** Held stirbt → BLÖDSINN! in Bangers, 32 Zacken, **0** Goldpixel des
alten Rechtecks; Ringsprecher-Ansage → »FINAL ROUND!« im selben Register; nach 1,2 s von selbst weg.
*Eine Kontur, die niemand ruft, ist kein Feature, sondern ein Kommentar.*

**Und eine Korrektur an meiner eigenen Beweisführung:** die Denkblasen-Abnahme lief über
`OW_AI.speak(g, tier, …)` — die Signatur ist aber `speak(m, text, life, frei)`. Beide Aufrufe gaben
`false` zurück; die Blase, die ich abgelesen habe, kam vom Spieltakt. Das Ergebnis stimmt
(mit richtiger Signatur nachgeprüft), die Messung war Zufall. *Ein Rückgabewert, den man nicht
liest, ist keine Abnahme.*

**Nicht gebaut, absichtlich:** Speaker's Corner, Abyss, Karaoke, Disco. Im Doc korrekt als Hooks
markiert, jeder ein eigener Slice.


## V10-S6h · Die Wurzel statt der fünften Kopie · 2026-08-09

Nach Werteliste (S6e), Anzeigeslots (S6f) und Farbtabelle (S6g) stand im Charakterblatt noch
**»Borromean skills · 1 to spend«** — bei 29 POP im Beutel und 8 POP für die billigste Anhebung.
Der Spieler hätte dreimal kaufen können; das Blatt behauptete einmal.

**Diesmal nicht die Anzeigestelle repariert, sondern die Quelle.** `openPts(h)` las
`hero.skillPoints` — die **Brücke**, die 1 wird, sobald irgendetwas bezahlbar ist, und 0, sobald
nichts mehr geht. Jede Stelle, die davon anzeigte, zeigte eine tote Zahl. Vier davon einzeln zu
fassen wäre die fünfte Kopie gewesen. Jetzt gibt `openPts` den **Kontostand** zurück, wenn es einen
gibt, und ein neues `waehrung(h)` liefert das passende Wort — damit sind Überschrift und
Claim-Siegel automatisch richtig, und das Claim-Siegel konnte seine Sonderrechnung wieder abgeben.

**Abnahme am geladenen Stand:** jede »to spend«-Stelle im Shadow-Text nennt POP —
`Borromean skills · 29 POP to spend` · `+29 POP to spend` · Vitals `29 POP to spend`. Keine Zahl
mehr, die aus der Brücke stammt.

*Fünf Runden, eine Klasse: das HUD führte für jede Eigenschaft des Wertemodells eine eigene Kopie —
Liste, Slots, Farben, Zähler. Die ersten vier habe ich einzeln repariert; erst die fünfte hat mich
zur gemeinsamen Quelle geführt. Wer ein Modell ändert, sucht besser einmal alle Leser, als viermal
den nächsten.*


## V10-S6g · Die dritte Kopie derselben Liste · 2026-08-09

S6e machte die Werteliste im Charakterblatt zur Ableitung, S6f das Dauerpanel — und die
**Farbtabelle** blieb eine HUD-eigene Kopie mit den drei alten Schlüsseln. Bingo, Bongo, Boggle und
BLÖDSINN! fielen deshalb alle vier auf `cfg.colors.utility` (#7a6844): **vier identische Farben**,
in beiden Ansichten.

Das wiegt genau dort am schwersten, wo S6f hingebaut hat: im Dauerpanel stehen Drei-Buchstaben-
Kürzel, und BIN/BON/BOG sind als Wort fast gleich — **die Farbe ist dort der Unterschied**. Im
Charakterblatt ist der farbige Punkt ohnehin das einzige Merkmal je Zeile.

`col(k)` liest jetzt zuerst `game.STAT_INFO[k].color`. Eine Falle dabei: die Farbe steht dort als
`var(--stat-bingo,#7fd6a2)`, und `onPaper()` erkennt nur reines Hex — ohne den Rückfallwert
herauszuziehen wäre wieder keine Tönung angekommen. `cfg.colors` bleibt Rückweg.

**Abnahme am geladenen Stand:** sechs Zahlenfarben im Panel, **sechs verschiedene**; sechs Punkte im
Charakterblatt, **sechs verschiedene**.

*Dreimal in Folge dieselbe Klasse: das HUD führte eine eigene Kopie einer Liste, die dem Runner
gehört — Werte, Anzeigeslots, Farben. Wer ein Modell ändert, muss jede Kopie suchen, nicht die
erste reparieren.*


## V10-S6f · Das Dauerpanel zeigt alle sechs Werte · 2026-08-09

S6e hatte das **Charakterblatt** repariert — das aufgeklappte Fenster. Übersehen blieb das
`.v7-hero`-Panel oben links, und das ist der einzige HUD-Block, den der Spieler **immer** sieht.
Es zeigte `Fluff 8 · Kayfabe 3 · Bizarro 4`: zwei von sechs Werten, plus die abgeleitete
Lebenszahl. Bingo, Bongo, Boggle und BLÖDSINN! kamen dauerhaft nirgends vor — ein Kauf war
**unsichtbar**.

**Die Ursache war strukturell, nicht kosmetisch:** im Markup standen zwei fest eingebaute Slots
(`<b class="kfn">`, `<b class="bzn">`). Das Panel konnte deshalb nie mehr als zwei Werte zeigen,
egal was `renderHero` hineinschrieb. *Ein Behälter für zwei Zahlen fasst keine sechs — da hilft
kein Nachjustieren am Inhalt.* Der Block ist jetzt leer im Markup und wird aus `game.STAT_KEYS`
gefüllt, dieselbe Ableitung wie bei `RAF` in S6e.

**Sechs Zahlen passen nicht als Wörter in 214 px**, also **Kürzel aus drei Buchstaben** in zwei
Reihen à drei: `Biz · Kay · Bin · Bon · Bog · BLÖ`. Zwei Buchstaben gingen nicht — Bingo, Bongo
und Boggle kollidieren alle auf »B«/»Bo«. Der volle Name samt Beschreibung steht im Tooltip.
Kayfabe zeigt weiter die **Ladungen** statt des Rohwerts: das ist die Zahl, die im Kampf zählt.

**Und das letzte Wort aus dem alten Modell ist weg:** der Claim-Knopf sagte »+1 skill point to
spend«. Er sagt jetzt »+5 POP to spend« — und er hängt nicht mehr an `hero.skillPoints`. Diese
Brücke wird 0, sobald nichts mehr bezahlbar ist; das Siegel wäre also verschwunden, obwohl Geld im
Beutel liegt. Jetzt entscheidet der Kontostand.

**Abnahme am geladenen Stand** (nicht aus dem Quelltext abgelesen — dieser Schritt hatte in dieser
Runde schon zweimal gefehlt): **6** Wert-Einträge sichtbar, Positionen (25,49) (89,49) (152,49) /
(25,67) (89,67) (152,67), Block 182 px breit in einem 214-px-Panel — **kein Überlauf**. Kauf über
`popSpend('stat','boggle')`: Panel springt `Bog1 → Bog2`, POP 11 → 5. Claim folgt dem Konto
(`+5 POP to spend`), und ein Kauf, für den das Geld nicht reicht, wird abgelehnt, ohne dass die
Anzeige lügt. »skill point« und »Level« sind im gesamten Shadow-Text nicht mehr auffindbar.


## V10-S6e · Das Heldenblatt zeigt sechs Werte — und die Level-Reste sind wirklich weg · 2026-08-09

Drei Reste des abgeschafften Level-Modells standen sichtbar im Charakterblatt, und **für einen davon
behauptete der Changelog das Gegenteil**. Der Reihe nach:

**1. »Frequency« war nicht versteckt — der Selektor traf nichts.** V10-S6c hatte
`.v7 .skill:has(.dot[style*="stat-fluff"])` gesetzt und geschrieben, die Zeile verschwinde. Das HUD
schreibt in den Punkt aber den **aufgelösten Hexwert** (`background:#c8622a`), nicht den
Variablennamen: **null Treffer**. Die Zeile stand da, mit funktionierendem »+«-Knopf, den der Kern
grundsätzlich ablehnen muss. *Eine CSS-Regel, deren Trefferzahl man nicht gemessen hat, ist eine
Vermutung.*

**Und Verstecken war ohnehin die falsche Antwort.** Die Ursache lag eine Ebene tiefer: die
Werteliste im HUD war eine **eingetippte Kopie** (`RAF` = Resonance · Amplitude · Frequency) und
wusste nichts von den sechs Werten. Jetzt ist sie eine **Ableitung** aus `game.STAT_KEYS` /
`game.STAT_INFO` — neu als Getter im Runner, damit es eine Liste an einem Ort gibt. Das Blatt zeigt
**sechs** Zeilen (Bizarro · Kayfabe · Bingo · Bongo · Boggle · BLÖDSINN!), und »Frequency«
existiert nicht mehr, statt unsichtbar zu sein.

**2. »Level 1 · 0 / 10 XP«** stand in der Vitals-Zeile — bei eingefrorenem `lv=1` und `xp=0` las sie
für immer dasselbe. Jetzt `17 POP to spend · 60 earned`, wenn der Runner POP führt.

**3. »sealed (LV 3 / 6)«** versprach Act-Slot 3 über ein Level. Jetzt `sealed (40 POP)` — und der
Preis kommt aus `game.popCost('slot')`, nicht aus einer nachgebauten Zahl. Derselbe Satz im Tooltip
mit.

**Abnahme über den echten Bedienweg:** Heldenblatt geöffnet, »+« bei **Bingo** geklickt →
POP 17 → 11, Bingo 1 → 2. Kein »Level«, kein »LV 3 / 6«, kein »Frequency« mehr im Blatt.

**Ein selbst gebauter Fehler auf dem Weg, und es war derselbe wie in V10-S13:** mein
`replaceText`-Anker für die Getter war die **einzeilige** Fassung von `spendSkillPoint`, die Methode
ist mehrzeilig — die Einfügung passierte still nicht, und `game.STAT_KEYS` blieb undefiniert.
Diesmal habe ich es selbst gemessen (`runnerHatKeys: false`), statt es der Prüfung zu überlassen.
Der Anker wird jetzt vorher geprüft und wirft, wenn er fehlt. *Nicht raten, nachsehen.*

**Für WS0:** die Eingriffe liegen in `overworld/hud-v7.js` an vier Stellen, alle mit
`WS1-Eingriff 9.8.` gekennzeichnet, alle **fähigkeitsgeprüft** (ohne `popCost`/`popSpend` läuft der
alte Weg weiter). Sie fallen weg, sobald das neue HUD aus Paket 3 hier ankommt — es ersetzt genau
diese Zeilen.


## V10-S17 · Mini-Story je Zone — das Gerüst, nicht die Geschichte · 2026-08-09

Georgs Auftrag: eine Card- oder Mob-Zone soll eine kleine Erzählung tragen; die **Story-Logik
kommt aus der NIE** (mit ChatGPT und Coworker). Deshalb ist `overworld/zone-story.js`
(`OW_STORY`, story-v1) ausdrücklich **leer an Inhalt** — es liefert nur, was die Laufzeit können
muss: den richtigen Satz im richtigen Moment, durch den richtigen Mund, ohne Doppelung. Dieselbe
Arbeitsteilung wie bei der Plauderei: **Laufzeit hier, Inhalt dort.**

**Sechs Anlässe, und mehr werden es nicht ohne Grund:** `enter · guard · fight · win · reveal ·
leave`. Sechs sind eine Dramaturgie, zwanzig sind ein Skript — und ein Skript will jemand pflegen.
Alle sechs hängen an Übergängen, die es **ohnehin schon gibt** (Zonenwechsel, Drohgebärde des
Wächters, erster Treffer, Zone geräumt); die Story erfindet keine eigenen Ereignisse.

**Zwei Entscheidungen, die man im Betrieb merkt:**
- `reveal` kommt **1,6 s nach** `win`, nicht im selben Augenblick. Die Rückseite zieht sich 1,4 s
  zurück, und ein Satz über die Karte, bevor man sie sieht, verrät die Pointe.
- **Wer spricht, entscheidet die Zone**, nicht der Autor: Wächter, wenn es ihn gibt und er lebt;
  sonst der **nächste** Mob; sonst niemand — dann geht der Satz ins Logbuch statt in eine Blase.
  *Ein Satz ohne Sprecher ist eine Bildunterschrift, keine Figur.*

**Nachtrag S17b — und ein Sprecher, den niemand sieht, ist schlechter als das Logbuch.** Der erste
Anlauf nahm `da[0]`, also die Array-Reihenfolge, und prüfte nur, ob ein Mob **existiert**. Das
traf den Normalfall, nicht den Sonderfall: eine Zone ist 18×10 Felder (1152×640 Weltpixel), das
Sichtfeld bei Zoom 1 rund 924×540 — wer am Rand eintritt, hat die andere Zonenhälfte grundsätzlich
nicht im Bild, und `enter` feuert genau dort. Gemessen: Sprecher **12,1 Felder** entfernt,
Bildschirmposition (1093,715) bei Viewport 924×540, Blase von der Klemmung in die **linke obere
Ecke** geschoben, Zipfel ins Nichts. Der Satz hatte einen Sprecher, den es gibt und den niemand
sieht — er behauptet eine Figur. Jetzt zwei Bedingungen, für Wächter wie für jeden anderen: **der
Nächste**, und er muss **im Bild** sein (7 Felder, derselbe Temperament-Radius wie in v10-S2d — wer
weiter weg ist, reagiert ohnehin nicht auf den Helden).
Gegenprobe: Mobs 18,2 Felder entfernt → **kein Sprecher, keine Blase**, Satz im Logbuch; ein Mob
direkt daneben → Blase bei ihm, Bildschirmposition (532,280) mitten im Viewport.

**Mehrere Beats auf denselben Anlass sind kein Fehler, sondern eine Folge:** beim ersten Betreten
spielt der erste, beim zweiten der nächste. Eine Zone kann beim Wiederkommen etwas anderes sagen,
ohne dass jemand einen Zähler führt.

**Abnahme:** sechs Beats eingereicht, **vier angenommen** (einer mit unbekanntem Anlass und einer
ohne Text wurden mit Begründung verworfen, nicht stillschweigend geschluckt), `once` greift, eine
Zone ohne Story bleibt still (gültiger Zustand, kein Fehler), und mit anwesendem Mob spricht die
Schlange in einer echten Blase.

**Nicht hier, ausdrücklich:** Georgs Idee, dass jedes gekaufte Deck einen **Avatar-Skin als Trophäe**
freischaltet (kein Skill), gehört in die Fortschritts- und Besitzschicht. Eine Story darf einen Skin
erwähnen; sie darf ihn nicht vergeben.


## V10-S16 · Vier Kartenrückseiten — und der Befund, der sie erst richtig macht · 2026-08-09

Bis eben lag **eine** Zeichnung unter allen sechs Zonen: sechs verdeckte Karten sahen aus wie
sechsmal dasselbe Blatt. Georg wollte den Satz aus dem Anti-Rules-Deck.

**Seite 16 sind 2×2 Kartenrückseiten** (Georg) — aber sie sind **nicht** als vier Kacheln angelegt,
sondern als **eine durchgehende Fläche**: Kaffeeringe, BLÖDSINN!-Stempel, »PRINT. CUT. PLAY.« quer
über die Mitte. Zu vier Rückseiten werden sie erst durch den Schnitt, und zwar durch **denselben
Kartenraster**, der auch die Vorderseiten schneidet — *ein Schnitt für beide Seiten*, sonst passen
die Seiten einer Karte nicht aufeinander. Genau das steht im Namen: print, cut, play.

Mein erster Anlauf hat die Seite stumpf halbiert und damit das falsche Raster genommen: heraus kamen
vier Ausschnitte, von denen einer die Wortmarke mittendurch schnitt und keiner das Kartenformat
hatte. Gesehen hat man es erst im Bild. *Eine Aufteilung, die man nicht am Blatt geprüft hat, ist
geraten — auch wenn sie »offensichtlich« ist.*

Neu geschnitten mit `x .0831 · y .1339 · w .8364 · h .8533 · gapX .0335 · gapY .0127` (V10-S7):
**4 × 623×364 px = 1,712**, dasselbe Format wie die Vorderseiten. Jede Rückseite zeigt eine andere
Stelle des Musters, alle gehören sichtbar zusammen.

**`overworld/card-backs.js`** (`OW_BACKS`, backs-v1) hält die Sätze. Die Wahl ist
**deterministisch** aus dem Zonen-Seed — sonst wechselte das Blatt bei jedem Neuzeichnen und die
Zone flackerte. Gemessen: derselbe Seed gibt zweimal dasselbe Blatt, sechs Zonen belegt, drei der
vier Varianten kamen bei diesem Weltseed vor.

**MED ist vorgesehen, aber nicht erfunden:** der Satz ist leer, und `set:'med'` fällt **sichtbar**
auf `kfb` zurück (mit Konsolenzeile), statt eine Rückseite zu behaupten, die es nicht gibt.

**Nebenbei aufgeräumt:** die Rückseite wurde an **zwei** Stellen geladen (Zone und Reader), jede mit
eigenem Rückweg. Jetzt eine Stelle — und der Reader nimmt die Rückseite **seiner Zone**, sonst zeigt
dasselbe Blatt im Viewer eine andere Rückseite als im Terrain.


## V10-S15 · Die gestrichelte Feder — dieselbe Kante, die zwischendurch abhebt · 2026-08-09

Georgs Vorgabe war eine Absage an die naheliegende Lösung: *»es dürfen keine einzelnen Linien sein;
es muss eine durchgehende, leicht irreguläre Linie mit Taper und dezenter Lichtlogik sein — als
direkte Outline der Form.«* Also **kein `setLineDash`**: das erzeugt Stummel mit konstanter Breite
und harten Enden, und es hängt an `lineWidth` statt an der Feder.

Stattdessen ein neues Kanon-Preset **`card-dash`** (Familie `band-dash`) in
`cardbuilder/kfb-ink-canon.js`: dieselbe Kontur, dieselbe Halbbreitenfunktion, dieselbe
Schattenachse wie `card` — nur wird das Band **entlang seiner Lauflänge** unterbrochen, und jeder
Strich läuft an beiden Enden spitz aus. *Es ist nicht eine gestrichelte Linie, es ist dieselbe
Feder, die zwischendurch abhebt.*

**Vier Kennzahlen, und nur die vier:** `dash` (Strichlänge) · `gap` (Lücke) · `shoulder` (Anteil
des Strichs, über den die Feder zu null ausläuft — 0 wäre ein Stummel, 0,5 eine Linse) · `phase`
(seed-gestreuter Startversatz, damit zwei Blasen nebeneinander nicht an derselben Stelle aufhören).
Alle **relativ zu min(W,H)**, nicht in Pixeln — sonst hinge das Muster an der Auflösung des
Zeichnenden, derselbe Fehler wie `baseW` bei der Strich-Familie. Dazu `dashLight` (0,18) als die
»dezente Lichtlogik«: an der Sonnenseite wird der Strich eine Spur heller. Sie moduliert die
**Farbe**, nicht die Breite — die Breite macht schon `edge`, und zwei Regler für einen Eindruck
geraten auseinander.

**Der Beweis, dass es dieselbe Feder ist**, steht in den Messzahlen: gestrichelt und voll liefern
**Bauchung 0,28 %** und **Feder 1,4 %** — identisch. Nur die Unterbrechung ist neu: 44 Striche à
25,9 px auf 15,5 px Lücke, Tintenanteil **62,5 %** (Fenster 50–75).

**Eine Rechnung, zwei Ausgaben.** `dashedBands()` liefert die Polygone, `inkRibbonDashed2D()`
malt sie auf Canvas, `dashedPathD()` gibt sie als SVG-`d`. Ohne diese Trennung hätte die
Sprechblase (SVG) einen zweiten Zeichner gebraucht — und zwei Zeichner für eine Kante laufen beim
nächsten Fork auseinander.

**Erste Anwendung: das Flüstern.** Die Blase hatte `stroke-dasharray:'7 5'`. Jetzt trägt sie die
echte Feder als **Fläche** über derselben Punktliste, die auch die Füllung begrenzt, und die
Kontur-Strichbreite geht auf 0 — kein doppelter Rand. Gemessen: 65 Teilstriche im Flüsterpfad.

**Zwei selbst gebaute Fehler, beide gemessen gefunden:**
1. Die ersten Zahlen (`dash 0,022 / gap 0,014`) ergaben bei einer 600-px-Karte **147 Striche à
   7,6 px** — Punkte statt Strichelung. Eine Kante liest sich als gestrichelt bei zehn bis fünfzehn
   Strichen **je Kante**, nicht je Bild.
2. `measureInk` meldete »falsche Familie — Strich statt Band« für eine Kante, die genau richtig
   gezeichnet war: die Prüfung schlägt ihren Satz über `preset.for` nach, und `card-dash` trägt
   `for:'card'` — der eigens angelegte `INK_CHECK['card-dash']` wurde **nie erreicht**. Jetzt erst
   der Presetname, dann die Absicht. *Ein Prüfsatz, den niemand nachschlägt, prüft nichts.*

**Offen und absichtlich noch nicht gebaut:** Schnittlinien im Terrain (surreale Blueprints) und die
Scheren-Animation. Das Preset trägt beides — es fehlt nur der Ort, an dem sie stehen sollen.


## V10-S14 · Die Kopplung stimmte, die Zahl nicht — Einheiten gehen wieder · 2026-08-09

Georgs Befund: »alle schweben eher als dass sie gehen«. Der erste Verdacht war die Kopplung aus
V8-S1 (Laufbilder an der gelaufenen Strecke statt an der Uhr) — **die war tadellos**:
`worstUnitRatio 1,000` über acht Einheiten, `stillRun 0`, kein einziges Laufbild ohne Weg. Der Fuß
rutschte bei jedem Tempo **gleich viel**.

**Nur: gleich viel war zu viel.** Der Schlupf, also der Boden je Animationsbild, lag beim Bären bei
**31,2 px**, beim Skelett bei 20,2, beim Helden bei 10,5. Ein Bild, das 31 px Boden abdeckt, liest
das Auge nicht als Schritt, sondern als Gleiten. *Eine Kopplung kann richtig sein und trotzdem
falsch aussehen — sie sagt, dass der Fuß gleichmäßig rutscht, nicht dass er greift.*

Zwei Ursachen, beide in der Formel:

1. **`STRIDE_REL 1,15` war zu großzügig.** `bodyH` ist die gemessene **Tintenhöhe** — sie enthält
   erhobene Waffen, Hörner, Ohren. Als Maß für die Beinlänge ist sie zu groß, also war die
   Schrittlänge zu lang und die Beine drehten zu langsam. Jetzt **0,62**.
2. **`stride / frames`:** eine Einheit mit vier Laufbildern rutscht doppelt so weit je Bild wie eine
   mit acht. Rechnerisch korrekt, optisch falsch — die Bilderzahl ist eine Eigenschaft des
   **Blattes**, keine des Ganges. Deshalb neu: **`MAX_SLIP 9`**, eine Obergrenze für den Boden je
   Bild. *Ein Animationsbild darf höchstens so viel Boden abdecken, wie ein Auge noch als einen
   Schritt liest.*

Der Deckel greift an der **Schrittlänge**, nicht am Ergebnis — so bleibt `stride/frames` die eine
Rechnung und die Prüfzahl misst weiter, was sie messen soll. Die Regel selbst ist unangetastet:
Laufen hängt weiter an der gelaufenen Strecke, gedeckelt wird nur, wie weit ein Bild trägt.

**Abnahme** (2,5 s Lauf über den echten Bedienweg, aclock-v1.1): Boden je Bild im Mittel
**11,95 → 5,94 px**, Bär **31,15 → 9,0**, Skelett 20,21 → 8,93, Held 10,46 → 5,64 — bei
unverändertem Ausschlag **1,000** je Einheit und weiterhin **0** Laufbildern ohne Weg. Also doppelt
so viele Bildwechsel auf derselben Strecke, ohne die Kopplung anzufassen.


## V10-S13 · Die RSS-Leitung liegt — die Welt verdaut Nachrichten, statt sie vorzulesen · 2026-08-09

Der Anschluss wartete seit v10-S3b (`OW_CHATTER.setFeed`), die Leitung fehlte. Jetzt
`overworld/rss-2d.js` (`OW_RSS`, rss-v1).

**Ground.news scheidet aus** (geprüft): die Artikel sind hinter einem Abo, öffentliche Feeds gibt es
nicht mehr — auch Open RSS hat seine Ground-Feeds deshalb eingestellt. Die Quellenliste ist deshalb
**austauschbar** aufgebaut: sechs Adressen, jede an eine Fraktion gebunden. Die Zuordnung ist die
halbe Miete — *wer eine Quelle tauscht, tauscht eine Haltung*: Politik geht an den Hof, Wirtschaft
an die Städter, Technik in die Höhle, Umwelt in die Wildnis.

**Der Browser kann RSS nicht direkt lesen.** Fast kein Feed schickt CORS-Kopfzeilen; deshalb geht
die Leitung über einen **Vermittler** (zwei Adressen, damit ein Ausfall nicht das Ende ist). Das ist
der eigentliche Grund für diese Datei — nicht das Parsen (RSS und Atom liest der eingebaute
DOMParser).

**Der Vorrat ist der Normalfall, nicht der Notnagel.** Acht Fraktionen tragen einen festen Satz
gewöhnlicher Schlagzeilen — absichtlich gewöhnlich: *die Komik entsteht daraus, dass eine Höhle
darüber redet, nicht daraus, dass die Zeile schon lustig ist.* Er liegt beim Start immer; das Netz
überschreibt ihn nur, wenn es antwortet. Damit läuft der Export offline und liefert bei der Abnahme
dieselben Zeilen. Regler `rss`, Standard **off** — eine Welt, die beim Start auf fremde Server
wartet, ist keine Welt.

**Nachtrag S13b — der Einbau hatte still nichts getan.** Der `replaceText`-Anker
(`if(window.OW_CHATTER)OW_CHATTER.reset();`) existierte im Runner **nicht**, und `replaceText` wirft
nicht, wenn es nichts findet: das Modul lag geladen daneben, `feedKeys` war leer, und der Regler
`rss` schaltete nichts. Meine ersten Abnahmezahlen kamen aus manuellen Aufrufen im Prüffenster —
also genau der Fall, den unsere eigene Hausregel ausschließt (*über den echten Bedienweg testen,
nicht über die API*). Gefunden hat es die Prüfung, nicht ich. Der Aufruf hängt jetzt hinter
`this.ready=true`. **Neue Hausregel:** *eine Ersetzung, die nichts findet, meldet nichts — geprüft
wird am geladenen Stand, nicht am geschriebenen Code.*

**Abnahme über den echten Bedienweg** (Seite geladen, kein manueller Aufruf, Fraktion `cave`):
`feedKeys` **8**, `stand().vorrat` **8**, Regler `rss` off — und die Höhle sagt von selbst
»Say »Update rolled back after…« again. It comes back wrong.« und »Say »Nobody can reproduce the…«
again.«. Mit `rss:'on'` antworteten im Test 5 von 6 Quellen mit echten Schlagzeilen.
Was ankommt, ist **kein Zitat**: die Schlagzeile geht als Bruchstück durch `OW_PHRASES`, also sagt
der Hof »We have a file on »{X}«.«, wo die Höhle sie zurückhallen lässt. Die Welt liest keine
Nachrichten vor, sie verdaut sie.


## V10-S12 · Vier Befunde aus Georgs Blick · 2026-08-09

**1. Das Etikett stand zu hoch — in zwei Anläufen.** Es hing seit V10-S8 an `anchorY × scale`, also
an der **Rahmen**höhe; Tiny-Swords-Blätter haben Leerraum über dem Kopf, die Marke schwebte
(~103 px). Erster Anlauf: Umstellung auf `bodyH`, die **gemessene Tintenhöhe** (probeBox über alle
nicht-transparenten Pixel, erhobenes Schwert eingeschlossen) — sah besser aus, war aber **17 px**
statt der geforderten 1: der Aufrufer gab `bh+1`, und `drawUnitTag` zog intern **nochmal 16 ab**.
Die Prüfung hat es gemessen, nicht ich.
Zweiter Anlauf: der Abstand steht an **einer** Stelle — die Methode bekommt die Tintenhöhe roh, der
Block wird darüber gesetzt. Aber die Blockhöhe war **11**, und das war wieder gerechnet statt
gemessen: das tiefste gezeichnete Pixel gehört nicht der Leiste (`y+7`) und nicht der Kerbe
(`y+9`), sondern dem **Lv-Kasten** — er beginnt bei `y−2` und ist 14 hoch, endet also bei `y+12`.
Im Ruhezustand berührte er damit exakt die Tinte: **0 px Luft**. Auch das hat die Prüfung gefunden,
und zwar an den Rechtecken, während ich aus der Formel abgelesen hatte.

Dritter Anlauf, **an den Rechtecken gemessen**: `fillRect` mitgeschrieben, tiefster Wert genommen.
`snake`, bodyH 72,8 — Tinten-Oberkante 8835,9, tiefstes Tag-Pixel 8834,9: **Luft = 1,0 px**.
*Wer zwei Abstände addiert, hat keinen — und eine Blockhöhe, die man nicht am tiefsten Rechteck
geprüft hat, ist geraten.*

**2. Die Mobs schwebten.** Ursache war mein eigener Schattenclip aus V10-S8c: er griff im
**Umkreis von 96 px** um das Kartenblatt, also auch für Figuren, die **daneben** standen — und
schnitt ihnen die gebackene Auflage weg. Jetzt entscheidet der **Fußpunkt**: steht er auf dem Blatt,
bleibt der Schatten drauf; steht er daneben, gehört er dem Boden, auf dem die Figur steht.

**3. Blase und Zipfel sind EINE Fläche** (Georgs Regel, jetzt ausdrücklich im Code vermerkt):
ein Pfad, eine Füllung, eine Kontur — der Zipfel entsteht **in** `rectPath`, nicht daneben.
Gegengeprüft am laufenden Bild: **ein** `<path>` im Blasen-Element, kein zweiter.

**4. Die Denkblase hat keinen Pfeil, sondern Atem.** Zwei Kreise, die zum Kopf hin kleiner werden —
und sie stehen nicht mehr still: jeder wandert auf seiner Achse und pulst leicht, versetzt, damit es
wie Aufsteigen liest und nicht wie Zittern. Dieselbe Luftballon-an-Schnur-Logik wie die Blase
selbst, nur eine Ebene tiefer. Gemessen: beide Kreise ändern ihre Lage über die Zeit.


## V10-S11 · Wegelagerer — Kämpfen lernen ohne Umweg · 2026-08-09

Georg 9.8.: Kämpfen soll man am Wegesrand lernen, nicht über Tutorial und Card Zone. Jetzt stehen
**drei Lager mit zwei bis drei Gegnern** an der Straße. Drei Eigenschaften trennen sie vom
Zonenwächter:

- **Kein Fortschritt** — ihre Pseudo-Zone trägt `noProgress`, es gibt keine Karte zu räumen.
- **Kurze Leine** — Temperament `sentinel` (2,8 Felder) statt Zonen-Temperament. Sonst folgt ein
  Trainingsgegner dem Neuling über die halbe Insel, und »hier kann ich üben« wird zur Verfolgungsjagd.
- **Sie stehen am WEG, nicht im Nirgendwo** — gesetzt neben `this.paths` (auf der Straße wären sie
  eine Blockade), mit Abstand zu Orten (10 Felder) und Zonen (4).

**Niedrig heißt niedrig:** 16 HP, 3 Schaden. Sie sollen den Schlagabtausch zeigen, nicht den ersten
Spieler erschlagen. Und sie **laden nichts nach**: die Gruppe nimmt Einheiten, die für die Zonen
ohnehin im Speicher liegen — *ein Trainingsgegner, der eine eigene Ladezeit kostet, ist keiner.*

Da die Blase seit V10-S9 an jeder Einheit hängt, sind sie zugleich die ersten Figuren, die man
**anreden** kann, ohne dass etwas auf dem Spiel steht.

**Nachtrag, gefunden von der Prüfung: »neben dem Weg« stand im Changelog, nicht im Code.**
`spawnRoadside` prüfte nur `walk()` und die Abstände — **nicht, ob das Zielfeld selbst im Wegenetz
liegt**. Der Versatz ±2 reicht dafür nicht: an L-aufgefüllten Kreuzungen und Doppelspuren (316
Wegfelder) landet er wieder auf der Straße, und Lager 3 saß auf **194,95**, einem Wegfeld. Jetzt wird
die Frage direkt gestellt, für das Lager **und** für jeden einzelnen Platz.
*Eine Zeile im Changelog, die der Build nicht einhält, ist die teuerste Sorte Dokumentation.*

**Abnahme nach dem Fix:** 3 Lager (170,75 · 125,40 · 156,55), **0 davon auf einem Wegfeld** ·
8 Gegner, **7 im Umkreis von drei Feldern** um das Netz, **1 auf** einem Wegfeld — und das ist kein
Fehler: die Lager stehen frei, die Gruppe **wandert** (Lenkung statt Standposten). Wer die Straße
dauerhaft frei will, müsste das Wegenetz zur Sperre machen; das wäre eine andere Entscheidung.
Dazu: alle 16 HP / 3 Schaden · alle Pseudo-Zonen `noProgress` · Leine 2,8 · fünf Arten ohne Nachladen.

**Dazu ein Blatt, das fehlte:** `docs/MOB_GRUPPEN_assets.md` — welche Mob-Gruppe aus welchem Ordner
kommt (Goblins · Verlies · Höhle · Wildnis · Wasser, 20 Gegner), plus die fünf Regeln, die aus dem
Bestand folgen: nur vier Blätter haben `guard` · `pig` bekommt nie eine Angriffsanimation · vier
von 20 sind `ranged` und warten auf Projektile · Größe aus `SIZE_REL` · Temperament aus `tempers`.
Aus dem Katalog gezogen, nicht abgeschrieben.


## V10-S10 · Die Fraktionen bekommen eine Stimme · 2026-08-09

Bis heute lagen drei Platzhalter-Zeilen je Biom in `chatter-2d.js` — die Insel redete, aber alle
klangen gleich, und `ask` gab Kartentext statt Charakter. Jetzt: `overworld/chatter-phrases.js`
(`OW_PHRASES`, phrases-v1) mit **acht Fraktionen** und je acht Feldern — `ton` (der Satz, der
später den LLM-Prompt trägt) · `idle` · `ueber` (`{X}` = das Bruchstück) · `antwort` · `frage` ·
`philo` · `spott` · `handel` · `emote`.

**Die Regel, die den Vorrat klein hält:** keine ganzen Gespräche, sechs kurze Zeilen je Feld. Die
Vielfalt entsteht aus **Quelle × Fraktion × Anlass**, nicht aus Länge. *Wer hundert Zeilen schreibt,
baut ein Drehbuch; wer sechs schreibt, baut eine Stimme.*

**Erst die Fraktion, dann das Biom** — wer keine Fraktion hat, spricht die Haltung des Ortes.
Und die Quelle wird jetzt **durch** die Stimme gesprochen statt gerahmt: eine Schlagzeile oder ein
Kartentitel geht als Bruchstück in `ueber`, also sagt der Höhlenbewohner »Say »{X}« again. It comes
back wrong.«, wo der Hof »We have a file on »{X}«.« sagt. Bei Karten zur Hälfte zitiert, zur Hälfte
kommentiert — nur zitieren klang wie ein Vorleser, nur reden wie ein Kommentator.

**Die drei Knöpfe der Blase holen sich ihre Sprache hier**: `ask` → `frage`, `philo` → `philo`,
`taunt` → `spott`, `trade` → `handel`. Abnahme in der Höhle: »Did you count the turns?« ·
»Every echo is a smaller lie.« · »Even the drip is bored.« · »Nothing here is for sale. It is just
here.« — vier Anlässe, eine Haltung.

**Eigentum:** der Vorrat ist **Inhalt** und darf von WS0 erweitert werden (§6b); die Laufzeit bleibt
hier. Deshalb steht in der Datei kein Code, nur benannte Listen.

## Runde 3 mit WS0 — Paket 3 angenommen, Signaturen nachgereicht · 2026-08-09

WS0 hat Paket 3 geliefert (vier Abnahmepunkte belegt) und `paper-atlas.js` über den Auftrag hinaus
abgelöst — die letzte Stelle war **eine Zeile fürs Zahnrad**. Beide geänderten Dateien kommen als
Diff zurück, nicht als stiller Fork; `units-catalog.js` mit 31/31 und `pig` ohne Angriff.

**Nachgereicht, weil sie fehlten: die genauen Signaturen** (Masterplan §6). `popCost(kind,key)`
nimmt **Art und Kennung**, nicht Wert plus Stufe — die aktuelle Stufe steckt im Helden, sonst gäbe
es zwei Rechnungen für einen Preis. `popSpend` gibt **immer ein Objekt** (`{ok,note}`), nie einen
Restbetrag; der steht in `hero.pop`. `pop` ist der **Kontostand**, `popTotal` die **Lebenssumme**.
`hero.skillPoints` ist eine **Brücke, kein Vorrat**.

**Die Shadow-Regel bleibt vorerst**, und zwar mit Grund: sie blendet die Level- und die
Frequency-Zeile in **unserer** Kopie von `hud-v7.js` aus, und die ist noch die alte. Sie fällt in
derselben Runde, in der das neue HUD hier ankommt. Antwort: `docs/ANTWORT_WS0_2026-08-09_runde3.md`.


## V10-S9 · Die Sprechblase aus Pet Studio v4 — und sie ist bedienbar · 2026-08-09

**Portiert, nicht nachgebaut** (Georgs Regel; die Quelldateien liegen seit heute im Projekt).
`overworld/bubble-ts.js` (`OW_BUBBLE`, bubble-ts-v1) übernimmt aus Pet Studio v4 wörtlich:
`_rectPath` (jittriges Rechteck, ±1,3 px, vier Zwischenpunkte je Kante, **keine runden Ecken**),
den **getaperten Pfeil** (Schulterpunkte bei 55 %, keine Kerbe), den Fuß im **zentralen Band**
(32…68 % der Kante), die **kurze Schnur** (`clamp(14, 34, Abstand−8)`), `_blobPath` (Scallop-Wolke,
11–13 Lappen) mit `_thinkTail`, und die Ankerphysik: **Totzone 44 px**, **Trägheit 0,10**. Getönt
wird nur das Papier, Linie und Schrift bleiben schwarz. Drei Register, kein viertes.

**Ersetzt ist nur der Anker:** statt des Pet-Kopfes in einer 3D-Szene hängt die Blase an einer
Einheit in Weltkoordinaten (`w2s` rechnet mit Kamera und Zoom, das Overlay liegt in CSS-Pixeln über
der Leinwand).

**Und sie ist bedienbar** (Georg 9.8.): Linksklick auf eine Figur öffnet ihre Blase mit sechs
Knöpfen — **attack · ask · taunt · philo · trade · leave**. Was gesagt wird, kommt aus `OW_CHATTER`
(Quelle → Fraktionston → Laune); `ask` und `philo` antworten in der Blase weiter (philo als
Denkwolke), `taunt` macht wütend, `attack` setzt das Ziel. Damit ist jeder Mob ein Point of
Interest, **ohne dass ein Dialogsystem entsteht**: die Antwort ist eine Blase, die Aktion eine Zeile
im Verhalten. Die linke Maustaste durfte im Spiel bisher nichts — gehen und schlagen bleiben rechts.

**Zwei Wege, zwei Aufgaben:** die Umgebungs-Plauderei bleibt auf der **Leinwand** (viele Blasen,
kurz, ohne Bedienung), das Overlay trägt die **eine bedienbare**. Der Kanon »immer nur EINE Blase«
gilt für diese hier.

**Selbst gebauter Fehler:** `offsetWidth` misst **ohne** Rand — ich habe die 2×30 px Rand ein
zweites Mal abgezogen. Die Blase war 60 px zu klein, der Text lief oben heraus, und die Klemmung
schob sie an den Bildrand. *Wer eine Zahl vom Layout bekommt, muss wissen, was schon drin ist.*


## Export-Lücke, Reihenfolge und ein Vertragsdetail — Runde 2 mit WS0 · 2026-08-09

**Der Export war unvollständig, und zwar unsichtbar.** `overworld/hud-slots.json` fehlte;
`hud-v7.js` holt die Datei per `fetch` und fängt den Fehlschlag in einem **leeren catch** — keine
Konsolenzeile, das HUD läuft auf eingebauten Vorgaben weiter und sieht dabei richtig aus. WS0 hat es
über einen einzelnen 404 unter 104 Ressourcen gefunden. Unsere Prüfung zählte nur die **38
DC-Referenzen**; `hud-slots.json` und `card-grids.json` sind aber **Nachlader** ohne Skript-Tag und
fielen durch. Beide liegen jetzt im Export, dazu `docs/EXPORT_PRUEFLISTE.md` mit der automatisch
ermittelten Tabelle (welches Modul lädt welche Datei nach).
**Zwei Regeln, von WS0 formuliert, übernommen:** *Ein leeres `catch` um einen `fetch` macht eine
fehlende Datei unsichtbar* — und: ein Export zählt nicht nur, was das DC referenziert.

**Reihenfolge korrigiert: WS0 macht Paket 3 (HUD) vor Paket 6 (Map).** Unsere Antwort widersprach
sich (Tabelle »3 jetzt frei«, Fließtext »nehmt 6«), und ihr Einwand ist besser als unsere
Empfehlung: solange `paper-atlas.js` und der neue Baukasten nebeneinander leben, gibt es **zwei
Wahrheiten über dieselben Grafikblätter**. Ein Paket, das die zweite Wahrheit beseitigt, schlägt
eines, das an nichts hängt.

**Der Strand-Teleport ist gefunden — in WS0s Modul, aber die Schuld liegt bei unserem Vertrag.**
`card-rail-v9b.js` rief `travelPoint(x,y,label)` **ohne das vierte Argument**; der Runner nimmt dann
drei Felder Nachsicht, und auf der 112 px breiten Insel-Karte sind ein Pixel zwei Felder. Das vierte
Argument stand nur im Code, nicht in der Beschreibung — jetzt in Masterplan §6 als Tabelle, zusammen
mit `popCost/popSpend`, `hudCardAward` und `zone._plate`. **Die Nachsicht gehört dem Anker, nicht
dem Klick** (Hausregel 10), jetzt mit einem Beleg aus einer zweiten Datei.

Antwort an WS0: `docs/ANTWORT_WS0_2026-08-09_runde2.md` — inklusive der Änderungen, die ihr Paket 3
betreffen (POP statt Level, sechs Werte, Fluff-Leiste aus **ihren** Bauteilen, `paper-atlas.js`
entfernen wir auf ihren Vorschlag hin) und dem Hinweis für den `units-catalog.js`-Diff: `pig` behält
**nur** idle+run.


## V10-S8 · Die Kante der Kartenzone — Karte · Feder · Wasser · dünne Feder · 2026-08-09

Georgs Befund am Bild: zwischen Tuschelinie und Wasser stand ein heller Streifen, der Graben hatte
keine Kante, und die Mobs warfen ihren Schatten über den Rand.

**Der Streifen war die Feder selbst.** `canon.contour('card',…)` liefert eine Kontur, die rund
**1,3 % eingerückt** ist — gemessen bei einem 1152 × 662-Blatt: Kasten 14,2 … 1137,1 und
14,4 … 647,8, also ~15 px je Seite. Die Füllung ist auf diese Kontur geklippt, also blieb ringsum
ein 15-px-Ring **Zonenboden** stehen; beim Dungeon-Biom ist der papierbeige, und genau den sah man.
Jetzt wird das Blatt so viel größer gebaut, dass die **Kontur** auf der Zonenkante landet (einmal
messen, Verhältnis merken, größer neu bauen — je Blattgröße gecacht, die Kontur ist deterministisch).
Gemessen danach: Blatt 1181 × 691 gegen Zone 1152 × 640, also −15/+14 px waagerecht — die Feder
deckt die Kante, statt daneben zu liegen.

**Das Wasser beginnt jetzt an der Karte.** Der Graben nahm bisher das **Feldrechteck** als Loch;
die Karte trägt aber 1,74 und das Raster 1,80. Die Differenz stand als Bodenstreifen im Bild. Jetzt
ist das Loch das gemerkte Blatt (`zone._plate`) — die beiden Formate stoßen im Wasser aneinander,
nicht auf dem Boden. Ohne gemerktes Blatt (erstes Bild) gilt wieder das Feldrechteck.

**Der Graben hat eine Kante bekommen:** außen eine Tuschelinie in **Küstenstärke** (T·0,07 ≈ 4,5 px
gegen die ~10 px der Kartenfeder), Farbe aus dem Kanon. Die **innere** Uferlinie ist ersatzlos weg —
dort liegt seit heute die Kartenfeder, und zwei Linien auf derselben Kante sind zwei Wahrheiten.

**Nachtrag V10-S8b — zwei Reparaturen hoben sich gegenseitig auf.** Nach dem Aufweiten war
`zone._plate` das **Blatt** (um den Konturrand größer), die sichtbare Kante aber die **Kontur**.
Der Graben nahm das Blatt als Loch und schnitt das Wasser damit ~15 px zu früh ab: im Pixel-Scan
quer über die Kante stand `Gras → Tusche → Wasser → **Gras 9 px** → Kartenfeder → Karte`. Der
Spalt war also nicht weg, nur grün statt beige. Jetzt trägt das Blatt **zwei benannte Rechtecke**:
`x/y/w/h` = das gezeichnete Blatt (trägt die Kunst), `kante` = wo die Feder liegt. Wasser und
Schattenclip hängen an der **Kante**; gemessen liegt sie jetzt bündig auf der Zonenkante
(Versatz 0 waagerecht, −11 senkrecht = die 1,74 gegen 1,80). *Zwei Rechtecke brauchen zwei Namen —
sonst nimmt der nächste Leser das falsche.*

**Der Schatten bleibt auf dem Blatt — im dritten Anlauf.** Eine Einheit darf die Feder überlappen
(sie steht davor), aber ihr Bodenkontakt gehört auf den Untergrund, auf dem sie steht. Der erste
Clip saß um den `ellipse`-Zweig — **und der läuft hier nie**: alle 24 Einheiten und der Held tragen
`shadow:'baked'`, die Auflage steckt **im Sprite** (die Konsole sagt es seit V7-S6 selbst:
»Einheiten mit eigener Auflage 0/10 — alle Blätter backen selbst«). Jetzt liegt der Clip um die
**Sprite-Zeichnung**, in Weltkoordinaten, aus **zwei** Rechtecken: dem Blatt der Zone **plus** allem
oberhalb der Fußlinie. Der Körper bleibt frei, alles ab dem Fußpunkt abwärts endet an der
Kartenkante. *Ein Clip um einen Zweig, den kein Blatt betritt, ist ein Kommentar, keine Regel.*

**Etikett und Leiste über dem gezeichneten Rahmen.** Sie hingen an `bodyH` — dem Rumpf. Ein
erhobenes Schwert oder Ohren ragen darüber hinaus, und dort saß die Leiste. Jetzt an `anchorY`
(gemessener Abstand Fußpunkt → Rahmenoberkante) plus **1 px**.

**Entschieden dabei:** `byPage`-Raster **wird** gelernt (es trägt später Skalierung und einen
DocCheck-Fork für CME-Folien), aber nicht jetzt — falsch beschnittene Karten sind kein Verlust,
weil die Karte im Almanach vollständig liegt: **Zoom und Blättern auf HUB-Ebene, ohne
Einheiten-Interaktion**, im TS-UI-Layer als Buch- bzw. Schriftrollen-Variante, gleicher Aufbau für
Quest-Log und Almanach.

**Zur Frage »hier oder WS0«:** die Fluff-Leiste wird **hier** gezeichnet (sie steht in der Welt über
einer Einheit, das ist Lead-Gebiet) — die **Bauteile** dafür kommen aus WS0s Baukasten
(`Bars/BigBar_Base+Fill`, `SmallBar_*`). Also: WS0 liefert, der Lead zeichnet. Steht als offener
Punkt in Masterplan §4.2b.


## V10-S6d · Zwei Reparaturen, die vorher am falschen Ort saßen · 2026-08-09

Beide Punkte der vorigen Runde waren geschrieben, aber wirkungslos — **eine Regel, die nicht
matcht, ist keine Reparatur.**

1. **Die lügende Meldung.** Der Selektor `.v7 .skill:has(.dot[style*="stat-fluff"])` konnte nie
   greifen: `hud-v7.js` schreibt die Farbe **aufgelöst** ins Inline-Style (`background:#c8622a`),
   nicht als `var(--stat-fluff)`. Gefangen wird jetzt dort, wo der Lead Eigentümer ist:
   `spendSkillPoint` merkt sich die Ablehnung, und `msg()` tauscht die unmittelbar folgende
   Fremdzeile (»Skill point spent — fluff is now 8«) gegen den echten Grund.
   **Abnahme über den echten Bedienweg:** `C` → »+« neben Frequency → POP 17 → **17**, Logbuch sagt
   **»Fluff follows from the six — raise one of those.«**
2. **`P` stand nirgends im Bild.** Der Zusatz saß im Runner-Element `.hint` — beim v7-Skin
   `display:none`. Sichtbar ist `.hintw`, und die gehört WS0. Jetzt angehängt statt
   hineingeschrieben: `.v7 .hintw::after{content:" · P spend POP"}`.
   Nachtrag zum Nachtrag: die CSS-Escape `\00b7` **frisst das folgende Leerzeichen** — im Bild stand
   »·P spend POP«. Zeichen jetzt direkt gesetzt.

**Regel dazu:** wer eine Regel in fremdes Shadow-DOM schreibt, muss sie **am laufenden Bild**
gegenprüfen — ein Selektor, der auf eine Farbe zeigt, zeigt auf etwas, das der Skin jederzeit ändert.


## V10-S7 · Anti-Rules-Raster gemessen — und ein Befund, der die Annahme kippt · 2026-08-09

**Das Deck:** `Anti-Rules_Toolkit - ADD web ID.pdf`, **16 Seiten**, 745,091 × 415,636 pt (AR 1,793),
jede Seite ist **ein einziges Bild** (1553 × 866 px) — es gibt also keine Vektor-Rahmen zum
Auslesen, gemessen wird an Pixeln. Kein Cover, wie Georg sagte.

**Seite 1 (der häufige Typ), an den dunklen Rahmenlinien gemessen** — nicht an Tinte geraten:
waagerecht y 116 · 430 · 491 · 822, senkrecht x 129 · 752 · 804 · 1428.

```
x 0.0831 · y 0.1339 · w 0.8364 · h 0.8533 · gapX 0.0335 · gapY 0.0127
```

**Georgs »etwas tiefer schneiden« ist messbar richtig — und es geht in beide Richtungen:** oben
beginnt die Karte **unter** der Überschriftzeile (y 0,1339, sonst hängt »THE ANTI-RULES MANIFESTO«
in der oberen Reihe), unten reicht sie **bis unter die Bildunterschrift** (»THE WARNING« endet bei
y 480). Der Beweis steckt im Format: mit Unterschrift ist die Zelle 623 × 364 px = **1,712**, ohne
sie 1,99. **1,712 liegt dicht an CARD_AR 1,74** — die Unterschrift gehört zur Karte, das Blatt sagt
es selbst.

**Seite 16 sind die vier Rückseiten** (nicht 15, wie vermutet): Vollanschnitt, BLÖDSINN!-Stempel,
»PRINT. CUT. PLAY.« in der Mitte. Über die Panelflächen gemessen: Spalten 0,0103–0,499 und
0,5003–0,9987, Zeilen 0–0,4919 und 0,5058–0,9988 — **glatte Viertel ohne Rand**. Das ist zugleich
der Asset-Satz für den geplanten Rückseiten-Wechsel (§4.4d).

**Der Befund, der die Annahme kippt: dieses Deck hat mehr als ein Seitenlayout.** Die Schnittprobe
über drei Seiten (`docs/captures/antirules-schnittprobe.png`) zeigt es: mit dem Seite-1-Raster
sitzen **Seite 7 und 15 falsch** — ihre Panels sind breiter (links und rechts angeschnitten:
»HE SHARED ATTENTION«, »THE CONTROLLED VOI«) und ihr Kopfband ist höher, also fangen sie oben die
Überschrift. Georgs Vermutung (»ca. 10 % der Decks haben Seiten mit irregulärem Layout«) trifft
hier **innerhalb eines Decks** zu. Ein Deck-Raster allein trägt nicht.

**Was daraus folgt, statt es zu überbauen:** die gemessenen Zahlen stehen als `anti_rules_toolkit`
in `overworld/card-grids.json`, dazu die Rückseiten und ein **Vorschlag** `byPage` — ausdrücklich
als Notiz markiert, weil der Reader ihn nicht liest. Eine Struktur, die niemand liest, ist keine
zweite Wahrheit; eine, die halb gelesen wird, wäre eine.

**Was am Messen teuer war (für den nächsten, der es tut):** vier Anläufe waren Sackgassen —
Tintendichte (die ganze Seite ist getönt, alles ist »Tinte«), Panel-Helligkeit (auf Pergament sind
Karte und Grund gleich hell), Kantenenergie global (findet die Illustration, nicht den Rahmen) und
Kantenenergie in Fenstern (bei zwei Layouts kollabieren die Mittelkanten). Getragen hat erst die
**Rahmenlinie als lange, dunkle, gerade Linie** — plus eine Schnittprobe, die man **ansieht**.
*Ein Raster, das man nicht am Blatt gegengeprüft hat, ist geraten.*


## V10-S6b · Der Bedienweg zu POP — die eigene Hausregel getreten · 2026-08-09

**Der Befund kam aus der Prüfung, nicht von mir:** V10-S6 war über die API grün (`popSpend()` per
Konsole) und **über den Schalter tot**. Das v7-HUD hängt seine »+«-Knöpfe an `hero.skillPoints` —
das gab es nicht mehr, also stand da »‹leer› skill points to spend«, ein Knopf ohne Zahl, der
nichts tut. **Es gab in der ganzen Oberfläche keinen Weg, POP auszugeben.** Das ist die S20-Klasse,
gegen die Hausregel 4 geschrieben ist (»auf ›läuft‹ gaten, nicht auf ›existiert‹ · über den echten
Bedienweg testen«) — und der Masterplan behauptete bereits `LÄUFT`.

**Drei Reparaturen:**

1. **Ein eigenes POP-Blatt auf Taste `P`.** Sechs Werte, ein Slot, Preis daneben, zu teure Knöpfe
   sind stumpf. Es gehört dem Runner — WS0s Heldenblatt kennt nur die alten drei Werte, und auf
   fremdem Grund zu reparieren wäre der zweite Fehler gewesen. Fällt weg, wenn Paket 3 POP anzeigt.
2. **`hero.skillPoints` als Getter** (1, sobald die billigste Anhebung bezahlbar ist, sonst 0).
   Damit greifen die vorhandenen Knöpfe des v7-HUD und laufen über `spendSkillPoint` → `popSpend`
   mit **echtem Preis** statt frei zu erhöhen.
3. **`popSpend('stat','fluff')` wird abgefangen** — Fluff ist ein Getter, eine Zuweisung darauf
   **wirft** in diesem Modul ('use strict'), und genau diesen Knopf bietet das alte Heldenblatt noch
   an. Antwort jetzt: »Fluff follows from the six — raise one of those.«

Dazu **verschwindet die Level-Zeile aus dem Bild**: das v7-Heldenblatt zeigte weiter »Level 1« mit
leerem Balken, obwohl es kein Level mehr gibt. Verborgen per Regel im Shadow-Root — dieselbe
Übereinkunft wie beim Logbuch: eine Regel im Shadow-Root ist kein Eingriff in fremden Code.

**Abnahme jetzt über den echten Bedienweg:** Tastendruck `P` → Blatt offen (`display:flex`, sieben
Knöpfe mit Preisen, zwei davon stumpf) → Klick auf »Kayfabe · 2 / 8 POP« → Kayfabe **3**, POP 9 → 1,
Fluff bleibt 7, Level-Balken `display:none`.


## V10-S6 · Fortschritt nach dem Beschluss: sechs Werte, Fluff abgeleitet, POP · 2026-08-09

Der Code hing seit gestern hinter dem Masterplan: dort stand das neue Modell, im Runner liefen noch
Puste/Witz/Schneid mit XP-Tabelle, Level-Cap 8 und Slots auf Stufe 3 und 6. Jetzt gilt beides
dasselbe.

**Sechs Werte** — Bizarro · Kayfabe · Bingo · Bongo · Boggle · BLÖDSINN!. Start
`3 · 2 · 1 · 1 · 1 · 0`.

**Fluff ist kein Wert mehr, sondern die Folge aller sechs:** `4 + Summe/3`. Mit dem Startprofil
sind das **6** — nah am alten Wert 5, also bleibt das Kampfgefühl dort, wo es abgenommen wurde.
Gespeichert wird sie **nicht**: `fluffOf()` rechnet, und `stats.fluff` ist ein
**nicht-aufzählbarer Getter**. Damit lesen fremde Oberflächen (das v7-HUD gehört WS0) unverändert
weiter, ohne dass eine abgeleitete Zahl im Spielstand landet und sich beim nächsten Laden selbst
widerspricht. *Ein Getter ist kein zweiter Wert, er ist derselbe Wert an einer zweiten Tür.*

**POP statt XP, kein Level.** Kein Level-Up-Blatt mehr, das den Bildschirm anhält und sechs
Entscheidungen verlangt — POP liegt bereit, ausgegeben wird im Charakterblatt. Gemeldet wird nur
der Übergang: sobald man sich das Billigste leisten kann, sagt es die Zeile einmal.

**Die Preise** (Georg bat um einen Vorschlag): Wert anheben = `4 + 2 × aktueller Wert` — ein
frischer Wert kostet 4, Bizarro von 3 auf 4 kostet 10. Action-Slot 2 = **15**, Slot 3 = **40**.
Maßstab: eine geräumte Zone gibt 8 POP plus Mobs, also 11–13. Nach der Tutorial-Runde ist genau
**ein** frischer Wert drin: die erste Entscheidung kommt sofort, die zweite kostet eine Zone.

**Der Vertrag nach außen** (auch für WS0): `game.popCost(kind,key)` · `game.popSpend(kind,key)` →
`{ok,note}` · `game.spendSkillPoint(k)` als Brücke, damit der »+«-Knopf im v7-HUD jetzt echten POP
kostet statt frei zu erhöhen. Preise stehen **nur im Menü** — K1 (keine Zahlen im Bild) bleibt.

**Alte Spielstände migrieren statt zu verfallen:** erspielter Fluff wird Bingo/Bongo (er war
erarbeitet), Level und XP werden POP. Gemessen am vorhandenen Save: `lv 2 → 19 POP`.

**Abnahme über die echte Transaktion:** `popSpend('stat','bloedsinn')` −4 → Fluff 6 → 7, maxhp
120 → 140 · `spendSkillPoint('bongo')` (die HUD-Brücke) −6 · `popSpend('slot')` bei 9 POP korrekt
abgelehnt (»Not enough POP — 15 needed«) · Anzeige zeigt **Fluff 7 · evidence 2/6** statt eines
Levels.

**Nebenbefund fürs Audio:** ein **zweites** Interface-Ogg dekodiert nicht — `confirmation_001.ogg`
(gemappt auf `confirm`), gleicher Fehler wie `drop_002.ogg`. Also kein Einzelfall, sondern das
Encoding dieser Familie. Gehört in die Decode-Probe, die im Manifest schon als Verfahren steht.


## Komplett-Export v10-S5 für WS0 · 2026-08-09

`export/overworld-v10-S5_2026-08-09/` — **59 Dateien**: 38 Runner-Module, drei Design Components,
Standalone (**578 KB**, im Export geprüft: 6 Zonen, 24 Mobs, **120 fps**, keine Konsolenfehler,
Fluchschrift eingebettet), zehn Dokumente, drei Bilder, README.

**Gegenprobe zum Audio-Manifest:** WS0 meldete, unter `media/3D_Assets/Audio/` liege nichts
Lesbares. Nachgeprüft — **die Datei ist da und byteweise identisch** mit dem Coworker-Stand
(`raw.githubusercontent.com/…/refs/heads/main/media/3D_Assets/Audio/sfx.json`, 26 Ereignisse); die
laufende Konsole meldet `[audio] sfx 26 · announcer 12/12`. Es war ein Abrufpfad, kein fehlender
Upload. Die Zwischenkopie, die ich schon im Export angelegt hatte, ist wieder **gelöscht** — sie
wäre die zweite Wahrheit gewesen, gegen die dieses Projekt seine halben Hausregeln geschrieben hat.

**WS0-Stand aufgenommen:** Paket 2 (UI-Baukasten `ui-kit-ts.js`) ist `LÄUFT` — 19 Blätter, dasselbe
Bauteil in drei Größen, **12/12 ohne Pixelabweichung**, Menü und Welt aus demselben Code. Vier
Messbefunde korrigieren unser Briefing (Banner ist **9-Slice**, Schriftrollen **dehnbar** mit
wiederkehrender Falte, Bars in **jeder** Länge, `paper-atlas.js` **überholt**) — als §2a
eingearbeitet. **Gemessen schlägt Papier, auch wenn das Papier von uns ist.**

**Kollision abgewendet:** WS0 wollte als Nächstes den Card-Acquisition-Screen bauen — der steht seit
heute hier (V10-S4). Paket 5 ist im Briefing durchgestrichen, Übernahme später über
`game.hudCardAward`. Nächstes WS0-Paket ist der **Map-Layer**. Antwort an WS0:
`docs/ANTWORT_WS0_2026-08-09.md`.

**Masterplan beim Packen gezählt:** LÄUFT 34 · GEBAUT 8 · ENTSCHIEDEN 28 · OFFEN 7 · GEPARKT 3 ·
VERWORFEN 1.


## V10-S5 · BLÖDSINN!-Regie — der Tod ist ein Ereignis · 2026-08-09

Der Tod war ein Teleport: ein Satz im Log, und der Held stand am Friedhof. **Ein Teleport ist ein
Menü ohne Fenster.** Jetzt drei Takte, alle in der Welt, keiner in einem Overlay:

1. **Blinken** (0,6 s) — der Held flackert auf der Stelle (12 Hz, gemessene Folge `0110011001100`,
   sechs Wechsel in 0,56 s) und ruft **BLÖDSINN!**. Der Ausruf ist der Kanon-Name, nicht »you died«.
2. **Zackiger Flug** (1,15 s) — fünf Zacken **quer zur Strecke**, Amplitude min(150 px, 22 % der
   Strecke) und **fallend** zum Ziel (sonst überschießt der letzte Zack die Landung), dazu ein Bogen
   von 46 px: er fliegt, er rutscht nicht. Die Tempolinie wird als Zickzack-Pfad hinter ihm
   gezeichnet — der Sprite allein sähe aus, als würde er geschoben.
3. **Landung** (0,4 s) — Stauchen, zehn Staubflocken mit Schwerkraft, Bildruck im HUD.

**Die Uhr läuft in `step`, nicht in `setTimeout`** — ein Fensterwechsel darf die Regie nicht
zerschneiden (dieselbe Regel wie beim Wächter-Respawn, v10-S2d). Die Regie hat **Vorfahrt vor der
Eingabe**: wer stirbt, läuft nicht mitten im Flug los. Kamera folgt mit Faktor 9 und wird bei der
Landung hart gesetzt.

**Abnahme** (Held 22×14 Felder vom Friedhof entfernt gestorben): Phasenfolge blink → fly → land
beobachtet, Zickzack in den Zwischenständen sichtbar (235,124 → 231,124 → 226,120 → 221,114 →
216,111 → 213,110), **Landung exakt auf dem Respawn-Punkt (Abstand 0 px)**, `sizeMul` wieder 1.

## V10-S4b · Feedback ChatGPT: Audio-Ebene angenommen, Produktion geschnitten · 2026-08-09

Zwei Dokumente eingearbeitet (Masterplan-Feedback + kombiniertes WS0-Briefing Chatter/Soundscape).
**Angenommen** als Konzept: die seed-getriebene Audio-Ausdrucksebene (Karte/Seite/Zone/Deck →
Audio-Seed → Manifest → Wiedergabe), die fraktale Staffelung und die Lull-Regel — neu als
Masterplan **§4.4c**. **Geschnitten** für die erste Scheibe: LLM, User-Chat und Sonderwesen (Oracle,
Speaking Abyss) — der vorgeschlagene MVP enthielt sie, das ist ein zweites System; Howler bleibt
offen, bis `audio-2d.js` nachweislich nicht reicht; und der Demonstrator kommt **nach** dem
HUD-Paket, nicht davor.

**Eine Grenze wurde dabei nachgezogen:** der Vorschlag hätte WS0 `chatter-seeds.js`,
`chatter-factions.js` und `chatter-injections.js` bauen lassen — das wäre eine **zweite
Chatter-Laufzeit im Spiel**. Jetzt steht es in Masterplan §4.4c und Briefing §2d: **Laufzeit gehört
dem Lead, Inhalt gehört WS0** (Phrasenvorrat als Daten, Emote-PNGs, Blasen-Darstellung, Assets).


## V10-S4 · Die Tutorial-Runde ist ganz (Sieg → Aufdecken → Übergabe → Almanach) · 2026-08-09

**Der Sieg übergibt die Karte.** Vorher wanderte sie still in `collected`, das HUD ließ sie eine
Sekunde später in den Almanach fliegen — den Moment hat niemand gesehen. Jetzt die Kette aus
Masterplan §4.2: **Wächter fällt → die Rückseite zieht sich in der Welt zurück (1,4 s) →
Übergabe-Blatt mit Kontext → OK → Karte in `collected` → Einflug des HUD → Almanach.**
Danach erst die Caption-Frage; zwei Blätter gleichzeitig wären keins.

**Ein Möbel, drei Anlässe.** `awardCard(card, reason, zone)` kennt `zone` · `king` · `hidden` —
Unterschied sind **Rahmen und Copy** (»EVIDENCE SECURED« · »THE KING ACCEPTS« · »FOUND IN THE
GRASS«), die Mechanik ist identisch. In der Tutorial-Zone kommt eine Zeile dazu: *»Your first one.
The others are the same, only louder.«* Das Blatt zeigt **dieselbe Kunst, die in der Welt liegt**
(`zone.art`); ist sie noch nicht geladen, zeichnet der Kanon-Zeichner das Ersatzblatt.

**WS0-Haken, damit hier nichts doppelt entsteht:** liegt `game.hudCardAward({card,reason,zone,done})`
vor, bekommt WS0 den Auftrag samt Rückweg und dieses Blatt tritt zurück. Ohne Haken läuft der
Lead-Stand. Dazu ein Notausgang: ein Blatt, das niemand schließt, gibt die Karte nach 30 s trotzdem
frei — die Karte darf nicht an einem Klick hängen bleiben.

**Abnahme über den echten Bedienweg** (seed 41, Tutorial-Zone auf 69,131): Wächter `skull` fällt →
Blatt sichtbar (`display:flex`), Titel »The Beneficiary«, Kunst im Rahmen → OK → `collected` 0 → 1,
Blatt zu, **ein** Einflug beobachtet (MutationObserver auf `.v7-fly`), Almanach-Stapel steht auf
»The Beneficiary« 1/6, danach öffnet die Caption-Frage.

**Zwei selbst gebaute Fehler, beide im Stylesheet:**
1. **Ein Backtick im CSS-Kommentar beendet die Datei.** Der Runner-Stil steht in einem
   Template-String; ein `code`-Zitat im Kommentar schloss ihn, und der ganze Runner lud nicht mehr
   (`x-import: FAILED`, kein `overworld-game` registriert). **Zweimal hintereinander passiert** —
   deshalb steht die Warnung jetzt als Kommentar an der Stelle.
2. **Die nackte Regel `canvas{position:absolute;inset:0}` gilt für die Spielfläche — und erwischte
   das Kartenblatt.** Gemessen: Rahmen 396×**4** px, das Blatt selbst 564×324 quer über der Box.
   Behoben mit `position:static` + `aspect-ratio:392/225` (= 1,742, die Kanon-Zahl).
   **Hausregel dazu:** wer ein Element in ein fremdes Stylesheet stellt, erbt dessen Grundregeln —
   ein Selektor ohne Klasse ist eine Falle, die erst beim zweiten Nutzer zuschnappt.


## V10-S3c · Ein Emote je Blase · Zeichenschlüssel · 2026-08-09

**Der Schlüssel ist abgelesen, nicht geraten.** `KFB Pottymouth Key.dc.html` setzt jede Taste in der
Schrift und schreibt den ASCII-Buchstaben darunter — das Blatt IST der Schlüssel (das mitgelieferte
Key-PDF enthält nur Bilder, kein Text). Daraus 18 benannte Zeichen in `chatter-2d.js`:
Totenkopf `A` · Knochen `N` · Grinsen `L` · Blitz `O` · Knall `T` · Funken `Q` · Wolke `F` ·
Hirn `H` · Wirbel `C` · Strudel `U` · Frage `K` · Ausruf `J` · Hammer `V` · Axt `X` · Grab `W` ·
Zacken `S` · Kette `R` · Wurm `E`. Gruppiert nach Absicht (fluch · wut · schmerz · verwirrt ·
schreck · gedanke) — die Aufrufstelle nennt die **Absicht**, nicht die Taste.

**Ein Zeichen statt drei** (Georg 9.8.). Drei gewürfelte Buchstaben ergaben drei Symbole
nebeneinander; das liest sich als Wort, nicht als Ausruf. Jetzt ein Zeichen, dafür groß: 32 px
gegen 22, Blasenhöhe 38 gegen 28.

**Und die Blasen selbst sind entschieden:** Georgs Handover aus **Pet Studio v4** ist Kanon —
DOM/SVG-Overlay, jittriges Rechteck ohne runde Ecken, getaperter Pfeil, Anker an der größten
Body-Schale, Totzone + Trägheit, **immer nur EINE Blase**, eigene Ink (nicht die Karten-Feder).
Reuse, kein Neubau; im Masterplan §4.4b eingetragen. Die heutige Overworld-Blase ist Canvas —
die Portierung ist ein eigener Slice und steht als `OFFEN` daneben.

## V10-S3b · Die Insel redet (Plauderei · Pottymouth) · 2026-08-09

**`overworld/chatter-2d.js` (chatter-v1).** WANN jemand redet, entscheidet `mob-ai.js`; **WAS**
gesagt wird, steht ab jetzt hier — zwei Aufgaben, zwei Dateien, sonst wandert beim nächsten
Deck-Wechsel das halbe Gehirn mit. Vier Quellen in dieser Reihenfolge: **Feed** (§59) · **Karte der
Zone** · **Ton der Fraktion/des Bioms** · **Fluch**. Dazu: eine Plauderei ist jetzt **Satz und
Antwort** (der Angesprochene antwortet nach 0,9–1,6 s; vorher sagte einer etwas und der andere stand
daneben), und wer getroffen wird, flucht — einmal je Treffer-Serie, nicht dreimal je Sekunde.

**Living Concept §59 (RSS-Plauder-Seed) ist als Anschluss gebaut, nicht als Leitung.**
`OW_CHATTER.setFeed(schlüssel, zeilen)` nimmt Schlagzeilen entgegen; geholt wird nichts (der Browser
liest kein fremdes RSS ohne Proxy). Die Schlagzeile ist **Rohstoff, kein Zitat**: sie wird auf ein
Bruchstück gekürzt und gerahmt (»They say »Council delays vote on harbou…«.«).

**Zwei Befunde, beide im Bild sichtbar geworden:**

1. **Die Kartenzeile war zu lang.** `speak` schneidet bei 44 Zeichen hart ab; die erste Lore-Zeile
   von »The Convert Bonus« hat 118 und endete als »…makes visib…«. Jetzt kürzt `kurz()` an einer
   Fuge und an einer Wortgrenze: gemessen 34 · 34 · 22 · 30 Zeichen statt 118.
2. **»PottyMouth BB« ist keine Textschrift.** Sie bildet **Buchstaben** auf Fluchzeichen ab. Der
   erste Einbau setzte sie über **alle** Blasen — »Bones do not gossip« stand als Reihe von Blitzen
   und Totenköpfen im Bild. Zweiter Fehler direkt danach: der Fluch `#$@!` trifft in dieser Schrift
   **keine Glyphe** und fiel auf Monospace zurück. Jetzt bekommt die Fluchschrift die Flüche, und
   der Fluch besteht aus **gewürfelten Buchstaben** — die Schrift macht die Zeichen daraus.
   Und drittens: `document.fonts.check` meldete `false`, obwohl die @font-face angemeldet war
   (`status: unloaded`) — eine Schrift, die nie benutzt wurde, lädt der Browser nicht.
   **Hausregel bestätigt, neue Fassung:** *auf »läuft« gaten — und `check()` ist kein »läuft«;
   erst `load()`, dann fragen.*

Regler im DC: `chatter` (on/off) und `bubbleFont` (potty/mono). **Lizenz:** die Schrift ist gekauft,
der Live-Einsatz ist ungeklärt (Georg) — ohne sie fällt der Fluch auf `#$@!` zurück, das Spiel hängt
nie an einer Schrift. Der Emote-Satz (`OW_CHATTER.EMOTE`, zehn Bedeutungen) ist die semantische
Vorlage für ein späteres PNG-Set.

## V10-S3a · Skelett/Graveyard als Tutorial-Zone · 2026-08-09

**Zone 0 ist die Tutorial-Zone** (Georg 9.8.): Biom `dungeon`, Besetzung **ein `skull` am Tor**
(34 HP, 6 Schaden, `guard`-Clip) und **ein `pig` als Übungsgegner** — sonst niemand. Keine drei
Wellen, kein Elite, kein Mob-Teppich. Gemessen bei seed 23: `[tutorial] Zone 0 · skull am Tor
142,19 · Übungsgegner pig · alive 1`.

**Das Schwein ist neutral und schlägt zurück.** In `mob-ai.js`: ein `trainee`-Kritter rennt nicht
weg, sondern wird beim ersten Treffer feindlich und bleibt es. Es zählt nicht zur Zone (die Karte
hängt am Wächter) und kostet **keinen Ruf** — wer zurückschlägt, ist kein Vieh.

**Die ganze Runde an einem Ort:** der Friedhof (= Respawn und Startpunkt) zieht an das Tor der
Tutorial-Zone. Gesetzt wird nur der Wunschpunkt, fünf Felder vor dem Tor; `snap` sucht sich von dort
einen freien Platz wie für jeden anderen Ort. Gemessen: Zone 0 auf 133…151/10…20, Tor 142,19,
**Friedhof 141,23**. Fällt die Zone aus, gilt wieder der Ringwinkel.

**Kanon-Ausnahme, notiert** (§2): die Startzone war `camp` (»der erste Ort soll lesbar sein«) und ist
jetzt `dungeon` — das Skelett ist in dieser Rolle das einzige Blatt mit `guard`-Clip. Lesbarkeit
kommt hier aus dem Ort (Friedhof, toter Baum, Knochen), nicht aus dem Biom.

**Dabei gefunden: das Tor stand seit V5 auf der falschen Zone.** `addZone` schrieb
`this.zones[this.zones.length-1].gate = {bx,by}` — die neue Zone ist dort aber **noch nicht
gepusht**, die Zeile traf also die **vorherige** Zone. Gemessen bei seed 7: Zone 0 liegt auf
206…224/95…105, ihr `gate` stand auf **200,124** — dem Brückenfeld von Zone 1. Folge: Wächter und
Staffelung spawnten am falschen Ort, und `gutter-2d.js` schnitt sein Torloch woanders in den Strich
(bei der letzten Zone mitten ins Innere). Aufgefallen ist es erst, als die Tutorial-Zone ihren
Wächter ans Tor stellen sollte — sichtbar war es nie.
**Behoben mit zwei Begriffen statt einem:** `gate` = das innere Feld am Tor (Spawn, Staffelung),
`bridgeAt` = das Brückenfeld im Graben (Torloch). Gegenprobe über alle sechs Zonen:
**gate innen 6/6 · Brücke auf dem Ring 6/6.**
**Hausregel dazu:** *ein Begriff, eine Bedeutung* — »zwei Wahrheiten« braucht keine zwei Zahlen, zwei
Bedeutungen für dasselbe Wort genügen.


## V10-Fork · Masterplan-Patch 9.8. · 2026-08-09

**Der Arbeitsstand heißt jetzt v10.** `KFB Overworld v10.dc.html` + `overworld/overworld-game-v10.js`,
geforkt aus v9 (Stand V10-S2d). v9 ist eingefroren und bleibt Vergleichsmaßstab. Der Runner trägt
einen Fork-Stempel im Kopf (Hausregel 5: Versionsnummern gehören dem Runner). Inhaltlich ist der
Fork eine Kopie — keine Verhaltensänderung, deshalb keine Messzahl.

**Masterplan: der Redaktionspatch des Coworkers ist eingearbeitet** (P1–P9), plus die zwei Blöcke
aus `KFB UI embed v1.md`, die dem Lead gehören:

- **P1 Status-Vokabular:** `GILT` ist raus. Neu `LÄUFT` (gebaut **und** über den echten Bedienweg
  abgenommen, mit Beleg) und `GEBAUT` (existiert, keine Abnahme). Grund: »GILT« wurde als
  »fertig und abgenommen« gelesen. Gezählt am fertigen Blatt: **LÄUFT 25 · GEBAUT 1 ·
  ENTSCHIEDEN 22 · OFFEN 2 · GEPARKT 2 · VERWORFEN 1**. Die eine `GEBAUT`-Zeile nennt die vier
  Systeme ohne Abnahme (Journey-Save · Diary · Re-Captioning · Wirtshaus) — sie standen vorher
  als `GILT` da.
- **P2 K5:** eine KFB-Ink für alle Outlines; »bend«/»torn« sind künftige benannte Presets desselben
  Kanons. Dazu die **K5-Grenze**: die Tiny-Swords-UI ist ein externer Kunst-Layer und wird **nicht**
  mit der KFB-Feder eingefasst.
- **P3 §4.4 Fortschritt neu:** sechs Werte (Bizarro · Kayfabe · Bingo · Bongo · Boggle · BLÖDSINN!),
  Fluff = HP, POP = XP, kein sichtbares Level, Action Slots werden mit POP im Menü gekauft.
  Puste/Witz/Schneid + XP-Tabelle stehen als `VERWORFEN` (im Code noch vorhanden).
- **P4** Card-Acquisition-Screen (drei Anlässe, ein Ablauf) · **P5** drei Wellen erst ab Card Zone,
  Tutorial nur Wächter + ein Kampf · **P6** 18×10 ist das Feld-Raster, 1,74 die Karte, dazwischen
  ist Boden (kein zweiter Wert, kein weißer Rand) · **P7** Kanon-Ausnahmen werden mit Grund notiert ·
  **P8** Audio-Defekt `drop_002.ogg` (Codec, nicht Pfad) · **P9** zwölf neue Zeilen im
  Entscheidungs-Log.
- **Neu vom Lead übernommen:** Content-Surfaces (`MediaSurface`, freie AR, Rickroll-Kayfabe) in
  §4.2 · Welt-Definition »1 Deck = 56 Karten = 1 Welt, sparse erlaubt« in §4.1 · zwei Karten-Register
  (Cartography + Tactical) und die Audio-Wahrheit in §4.5.

**Der Leser musste mit.** `KFB Overworld Masterplan.dc.html` kannte nur die alten fünf Marken —
`LÄUFT`/`GEBAUT` ergänzt, `GILT` entfernt. Und die Legende ist jetzt eine **Tabelle**, also ein
eigener Block: die alte Sperre (`/Status-Vokabular/`) hätte sie nicht mehr erwischt und die Zählung
um sechs zu hoch gemeldet. Zweite Sperre auf die Kopfzeile `| Status | Bedeutung |`.
Und noch eine Zahl, die log: zwei **Prosa**-Erwähnungen (»ohne Beleg ist es GEBAUT«, §7 Punkt 1)
trugen Backticks und zählten als Statuszeilen mit — 26 · 2 statt 25 · 1. Backticks raus; Marken
tragen nur noch Tabellenzeilen. Gefunden hat es die Prüfung, nicht ich.
Dieselbe Fehlerklasse wie beim ersten Anlauf — eine Zahl, die lügt, ist schlimmer als keine.

**WS0 freigegeben:** `docs/BRIEFING_WS0_v10.md` — sechs Pakete in Reihenfolge (sfx.json →
UI-Baukasten → HUD-Rework → Signature-Sounds → Card-Acquisition-Screen → Map-Layer), der
Runner-Vertrag, das Sync-Ritual (eine Richtung je Runde, immer ein Session-Export mit Zahlen) und
die Nicht-Liste. Neu darin gegenüber dem Coworker-Briefing: **Banner und Schriftrollen brauchen von
Anfang an zwei Zeichenwege** — Screen und Welt. Sonst wird der Welt-Weg später nachgebaut, und das
ist »zwei Wahrheiten«.


## Living Masterplan · 2026-08-09

`docs/MASTERPLAN_overworld.md` neu geschrieben, `KFB Overworld Masterplan.dc.html` als Leser.

**Warum ein Umbau und keine Fortschreibung:** der alte Masterplan war ein Ablagerungsstapel —
37 Abschnitte, **§22 zweimal vergeben**, §30 vor §26, Kanon und Spekulation im selben Register. Genau
deshalb verteilte sich die Wahrheit auf vier Dokumente. Die Inhalte sind vollständig erhalten
(`docs/MASTERPLAN_konzepte_archiv.md`) — sie sind das Ideenreservoir, nicht der Plan.

**Der neue Aufbau:** North Star · Kanon K1–K6 · zwölf Hausregeln · **alle Systeme mit Status**
(`GILT` gebaut und gemessen · `ENTSCHIEDEN` · `OFFEN` · `GEPARKT` · `VERWORFEN`) ·
Entscheidungs-Log mit Datum und Urheber · Arbeitsteilung WS0/hier mit Sync-Regel · Reihenfolge ·
offene Fragen an Georg · Risiken · Karte der Dokumente. Gezählt beim Öffnen: **30 × GILT ·
10 × ENTSCHIEDEN · 3 × OFFEN · 3 × GEPARKT**.

**Der Leser hat keine eigenen Inhalte.** Er holt die `.md` und setzt sie — sonst gäbe es das
Dokument zweimal, und das ist die Fehlerklasse, gegen die es geschrieben wurde. Register aus den
H2-Überschriften, Statusmarken farbig, Zähler in der Spalte. Die Legende zählt sich nicht selbst mit
(eine Zahl, die lügt, ist schlimmer als keine).

**Und genau das hat der erste Anlauf getan** — die Prüfung hat es gefunden, nicht ich. Gezählt wurde
je Quellzeile an **zwei** Stellen (oben in der Setz-Schleife und noch einmal im jeweiligen Zweig),
also zählte die erste Zeile jedes Absatzes doppelt: **GILT 28 statt 27**. Und die Legenden-Sperre
griff nur auf der ersten von zwei Zeilen, auf die der Vokabular-Satz umbricht — deshalb meldete die
Spalte **»VERWORFEN 1«, obwohl nichts verworfen ist**. Der Kommentar daneben behauptete das Gegenteil.
Jetzt wird **einmal** gezählt, über Blöcke statt Zeilen, und die Legende fällt als ganzer Block raus.
Gegengeprüft gegen das Dokument: 27 · 8 · 2 · 2, kein VERWORFEN.
**Regel dazu:** wer an zwei Stellen zählt, zählt falsch — und ein Kommentar, der eine Eigenschaft
behauptet, ist kein Beleg dafür.


## Komplett-Export · 2026-08-09 · `export/overworld-v10-S2_2026-08-09/`
**52 Dateien — Fork-Basis für WS0.** Code (36 Module + Runner), **Standalone-HTML (505 KB)**,
Masterplan-Leser, 8 Dokumente unter `docs/`, Tusche-SSOT, README mit Einstieg in zwei Minuten.

Im DC geprüft: 13/13 Bodenblätter, Relief 7 von 9, 6 Zonen à 18×10, Reader @112,36, 11 Einheiten,
Kartenrückseite 1872×1045, `gut-v1.1` — keine Konsolenfehler.
**Standalone einzeln geöffnet und gemessen:** 6 Zonen à 18×10, Graben 354 Felder, Rückseite
1872×1045, 24 Einheiten, **120 fps**, Held auf 129,47 — ebenfalls fehlerfrei. Sie bündelt den Code,
nicht die Bilder: Assets kommen zur Laufzeit über `asset-source.js` von pages.dev, also braucht sie
Netz, aber keine Projektdateien.


## V10-S2d · 2026-08-09 · Der Wächter: Drohung, Tuschelinie, Auferstehung

**Die Warnhaltung.** Vier Einheiten im Katalog haben einen echten `guard`-Clip (minotaur · skull ·
panda · turtle) — `un.has('guard')` fragt das Blatt, nicht eine Liste. Ein Wächter, der einen hat,
**droht erst**: er steht, sieht hin und hebt die Deckung, 0,6 s lang. Das ist der Unterschied zwischen
einem Posten und einer Falle — der Spieler bekommt einen Wimpernschlag, in dem er zurücktreten kann.
Wer keinen Clip hat, steht ruhig da; es wird nichts erfunden.

**Die Aggro hängt an der Tusche.** Ein Zonenwächter reagiert nicht auf Entfernung, sondern auf eine
Überschreitung: wer das Kartenrechteck betritt, steht auf der Karte, die er bewacht. Damit ist die
Regel **im Bild erklärt** (die Kanon-Feder, seit S1b kräftig geführt) und nicht in einem Radius
versteckt. Dieselbe Linie hebt seine Leine auf: sie kommt aus dem Temperament (rund sieben Felder),
das Kartenrechteck ist aber 18×10 — wer die Karte bewacht, darf sie auch durchqueren.

**Aus der Asche.** Ein Rise-Sprite gibt es in keinem der 20 Blätter. Also wird nicht eingeblendet (das
sähe aus wie ein Fehler im Bild), sondern **beschnitten**: die Bodenlinie läuft über 0,9 s nach oben,
die Figur schiebt sich heraus, dazu ein Stauchen, das beim Auftauchen ausläuft, und ein Tritt
(`OW_MOTION.poke`), sobald sie steht. Der Aschekranz ist kein Partikelsystem, sondern zwölf Flocken
auf einem gesäten Ring, die steigen, kleiner werden und verblassen — zwölf `fillRect` statt eines
Puffers über 2000 Stück. Darunter eine Glut, die zuletzt verschwindet.
Nach 60 s (Uhr in `step`, damit Turm oder Neuladen sie nicht abschneiden) steht der Wächter an einem
**zufälligen begehbaren Punkt im Zonenrechteck**, mindestens 150 px vom Helden entfernt: die Karte
soll keine Todesstelle bekommen, die man auswendig lernt. Die Karte bleibt aufgedeckt — der zweite
Kampf gibt XP, keinen Loot.

Gemessen (Skull als Wächter, ganze Kette über den echten Weg): außerhalb `roam` → Held tritt auf die
Karte → `alert/guard` → nach 0,6 s `chase` → quer über das Blatt (825 → 74 px) → `attack`.
Auferstehung: `alive` 4 → 3 → 4, neuer Standort im Rechteck geprüft, Aufsteigen am Bild.

### Drei selbst gebaute Fehler, alle gemessen statt geraten
1. **Die Haltung klebte.** Gesetzt in `alert`, aufgeräumt nirgends — der Wächter blieb in Deckung
   stehen, nachdem die KI längst auf `pause` war. *Wer eine Haltung setzt, räumt sie auch weg.*
2. **Die Leine war kürzer als die Karte.** Er drohte, wechselte auf `chase` und zog sich sofort
   zurück, dann von vorn. Nicht die Wahrnehmung war schuld, sondern die Reichweite.
3. **Eine Zeile zu tief.** Die Anhebung der Wahrnehmung stand **hinter** ihrer Auswertung — der
   Wächter flackerte im Zehntelsekundentakt zwischen Drohen und Vergessen (gemessen: 50 Wechsel in
   5 s). *Wer einen Wert anhebt, muss das tun, bevor jemand ihn liest.*


## V10-S2c · 2026-08-09 · Eine Einheit sagt eine Sache

**Der Held war komplett weg — mein Fehler aus S2b, und ein lehrreicher.** `drawReader` hatte nach dem
Umbau ein offenes `ctx.save()` mit Translate, und der `return` des geparkten Titelstreifens sprang
darüber hinweg. Alles, was danach gezeichnet wurde — Deko, Mobs, der Held — lag um die Blattposition
verschoben, also weit außerhalb des Bildes. Gemessen war der Held korrekt bei Feld 129,47, begehbar,
mit geladenem Sprite: die Daten waren in Ordnung, nur die Matrix nicht (`transform e/f = −15660/−5324`).
**Regel:** *ein `return` zwischen `save()` und `restore()` ist ein Leck, und es äußert sich nicht dort,
wo es sitzt.*

**Unit-Etiketten (Georgs Auftrag).** `drawUnitTag()` ersetzt die alte rote Leiste, die jede
angeschlagene Einheit trug und sonst nichts sagte.

- **Wer nichts zu sagen hat, sagt nichts.** Voll, unbeteiligt, kein Wächter → kein Etikett. Das ist
  der häufigste Fall auf der Insel, und er war vorher am lautesten.
- **Die Farbe ist die Haltung, nicht der Rang.** Rot = greift an · Bernstein = hat mich bemerkt
  (`ai.notice > 0,35`) · Blassgrün = neutrale Kreatur · Grün = verbündet (`OW_FACTIONS`).
- **Wächter und Elite tragen eine Kerbe**, keinen zweiten Farbton: an ihnen hängt die Karte, und zwei
  Bedeutungen auf einem Kanal sind eine zu viel.
- **`Lv` weicht der Leiste.** Unversehrt und nicht harmlos → die Stufe als Zahl, in der Farbe der
  Haltung. Sobald verwundet oder im Kampf → Leiste, und **keine** Ziffer daneben: Zahlen sind keine
  Beweisstücke (Kanon).
- **Eine Ablage.** Sprechblasen ankern auf `y-bh-30`, das Etikett sitzt auf `y-bh-16` — vierzehn
  Pixel Luft, also stapelt sich nichts über einem Kopf.

Am Bild geprüft: vier Zustände nebeneinander (aggro+Wächter mit Kerbe · `Lv 2` bernstein · `Lv 3`
Wächter · Elite verwundet mit Kerbe), 81 fps.


## V10-S2b · 2026-08-09 · Die Karte IN der Zone — verdeckt, und der Sieg deckt auf

Georgs Befund war: *»die Zone zeigt einfach eine andere Textur im Card Field statt ein Biom mit dem
umgebenden Terrain«* — und *»es wurde kein PDF/Card angezeigt«*. Beides ist behoben, und zwar mit
**einem** Zeichner statt einem zweiten.

**Ein Kartenteller, zwei Aufrufer.** `drawCardPlate(ctx,o)` malt Schatten, Grube, Papier, Bild,
Aufdeck-Übergang und Kanon-Tusche. Reader **und** Kampfzone rufen ihn. Der Reader behält nur, was er
eigen hat (Zellen-Hervorhebung, jetzt als `after`-Rückruf innerhalb des Clips, also vor der Tusche;
plus die geparkten Trittsteine). Zwei Zeichner für dasselbe Objekt wären beim nächsten Fork
auseinandergelaufen.

**Die Feder trägt das Format, die Felder tragen den Tritt.** Zonen jetzt **18×10** statt 10×8. Ganze
Felder treffen `CARD_AR` 1,74 nicht — 18×10 ist 1,80, die nächsten ganzzahligen Treffer wären 19×11
(1,727) oder 26×15 (1,733). Also läuft die Tusche auf Feldbruchteilen im echten Format und ragt oben
und unten je 11 px über das begehbare Rechteck. Begehbar bleibt das ganze Rechteck: die Kontur ist die
Kante eines Ortes, kein Zaun.

**Verdeckt ist ein Zustand, kein Platzhalter.** Ungeräumte Zonen tragen die Kartenrückseite
(1872×1045, über `OW_SRC.kfb()`) — eine Datei für alle Zonen und den Reader. Kartenkunst kommt als
Viertelseite (`quarter()`, nicht `art()`: eine Halbierung kann nicht falsch sitzen, V9-B4g) und wird
**erst bei Bedarf** geladen, eine Zone nach der anderen: sechs PDF-Seiten beim Weltbau wären sechs
Sekunden Stillstand für Bilder, die man erst nach dem Kampf sieht.

**Der Sieg deckt auf, in der Welt.** Kein Overlay, keine Lightbox. Die Rückseite **zieht sich zurück**
statt auszublenden — ein Alpha-Übergang sieht wie ein Fehler im Bild aus, ein Rückzug wie ein Vorgang.
Die Kante läuft schräg (eine gerade Kante liest als Wischmaske, eine schräge als Papier, das sich
löst) und trägt einen Glanz, damit sie gerissen wirkt und nicht geschnitten. 1,4 s, läuft in `step`
weiter, auch wenn man weggeht. Damit ist eine geräumte Zone **von weitem erkennbar**, weil sie ein
Bild trägt statt einer Farbe.

Gemessen: 6 Zonen à 18×10 (1,800 im Feld, 1,74 in der Tusche) · Rückseite 1872×1045 · Graben
0,03 ms je Bild · 57 fps · zwei aus dem Spielstand geräumte Zonen zeigen ihre Karte, vier zeigen die
Rückseite · Aufdeck-Zwischenstand am Bild geprüft.


## V10-S2a · 2026-08-09 · Der Graben ist ein eigener Baustein

Georgs Urteil war die Lösung: *»die Konzeption der Konstruktion als Meer war falsch.«* Neues Modul
`overworld/gutter-2d.js` (`OW_GUTTER`, `gut-v1.1`).

**Was sich geändert hat:** `addZone` schrieb den Ring als `land = 0`, also Ozean — damit übernahmen
ihn Sandsaum, Schaum und Autotiling, und bei einem Feld Breite (92 von 234) fraßen die von beiden
Seiten die Linie auf. Jetzt behält der Ring den Bodenwert seiner Umgebung (**gemessen: 0 von 234
Grabenfeldern sind noch Ozean**, 232 Gras, 2 Sand) und ist für den Maler gewöhnliches Land. Gesperrt
wird er als Rolle, nicht als Bodentyp.

**Gezeichnet wird ein Strich, keine Kachelfläche.** Äußeres Rechteck, inneres Rechteck, `evenodd` —
ein Clip, eine Füllung, zwei Uferkonturen, **je Zone**. Deshalb trägt er ein Feld Breite, was ein
Kachelsystem grundsätzlich nicht kann. Gemessen: **0,09 ms je Bild** bei einer sichtbaren Zone, 78 fps.

**Die Farbe ist eine Palette, kein neues System.** `OW_SHADE.PALETTES` führt die Fluide schon
(wasser · bubblegum · oel · saeure) — der Graben nimmt eine davon, später die des gewürfelten
Story-Modes. Ohne `OW_SHADE` füllt ein Verlauf aus zwei Tönen: das Spiel läuft mit Farbe weiter statt
gar nicht.

**Das Tor ist ein Loch im Strich**, ausgeklipst, damit die Brücke darüber liegt. Gemessen: 6 von 6
Zonen haben ihr Tor, Grabenfeld nicht begehbar, Torfeld begehbar.

### Ein selbst gebauter Fehler, gleich gemessen
Erster Versuch setzte die Sperre in `addZone` auf `blocked` — und `populate()` ruft danach
`blocked.fill(0)`. Gemessen: 234 Grabenfelder, **0 davon gesperrt**, man lief hindurch. Jetzt fragt
`walk()` die Menge `gutter` selbst. **Regel:** wer eine Sperre in ein Feld schreibt, das jemand
anders leert, hat keine Sperre.

### Nebenbei
Die Kartenrückseite kommt in **1872×1045** (vorher 800×447, also 2,3× zu klein und beim Aufdecken
weich) und läuft jetzt über `OW_SRC.kfb()`, also über pages.dev statt über einen relativen Pfad —
mit der Projektdatei als Rückweg.


## V10-S1h · 2026-08-09 · Der Strand-Teleport, richtig gefunden — und die Rule of Three

**Mein S1f-Fix saß auf der falschen Tür.** Er prüfte den Klick auf die große Übersicht; der Kompaß im
v7-Möbel ruft `travelPoint` aber direkt (`hud-v7.js:855`). Die eigentliche Ursache lag eine Ebene
tiefer und galt **global für jede Reise**: das Ausweichen mit **drei Feldern** Umkreis. Für einen
benannten Ort ist das richtig — der Klickpunkt liegt 70 px unter dem Anker, also fast zwei Felder
tiefer. Für einen freien Klick ist es fatal: der Kompaß ist 112 px breit für 240 Felder, **ein Pixel
sind zwei Felder**. Die Nachsicht war größer als die Genauigkeit, also fand jeder Klick irgendein
Ufer — und die Meldung sagte zufrieden »Travelled to the map«.
Jetzt trägt `travelPoint(x,y,label,snap)` die Nachsicht als Argument: **Anker 3** (Vorgabe, alle
Ortsknöpfe unverändert), **Klick 1** — ein Feld für die Rundung, sonst eine Absage. Gemessen: Klick
mitten in die Lagune → der Held bleibt stehen (129,47 vor und nach).

**Regel:** *die Nachsicht gehört dem Anker, nicht dem Klick.* Und: ein Ausweichradius, der größer ist
als die Auflösung des Bedienelements, macht aus jedem Fehlklick einen Erfolg.

**Requisiten: Dichte halbiert, Streuung durch Dreiergruppen ersetzt.** Der Kleinprop-Zweig nahm 8 %
aller Grasfelder und setzte **je eines** — Rauschen mit Mindestabstand, das wie verstreute Reste
aussieht. Jetzt entscheidet ein Wurf über eine **Gruppe**: ein großes Stück, ein mittleres (0,82), ein
kleines (0,66), dicht beieinander als schiefes Dreieck (drei in einer Reihe wären eine Hecke), und
der Umkreis von drei Feldern hält die Gruppen auseinander. Bäume: Annahmefaktor 1,25 → 0,44.
Gemessen: **1345 → 738 Requisiten** (55 %, 50,8 je 1000 Grasfelder), **109 fps**.

### Befund zum Graben, gemessen — noch nicht behoben
`addZone` schreibt den Grabenring als `land = 0`, also **Ozean**. Von 234 Grabenfeldern sind **92
genau ein Feld breit**. Ein Feld Wasser kann keine Küste sein: Sandsaum und Autotiling greifen von
beiden Seiten und fressen die Linie auf — übrig bleiben die Ecken, wo der Ring umbiegt und 2×2 Wasser
entsteht. Georgs »buggy Artefakte« sind der ganze Graben. Dazu: die Zone ist **10×8** (Verhältnis
1,25), das Kartenformat ist **1,74** — sie kann die Karte nicht zeigen, weil sie nicht ihre Form hat.
Auflösung ist v10-S2 und braucht Georgs Entscheidung (Form · Grenze · Biom).


## V10-S1g · 2026-08-09 · Ein Eigentümer je Auskunft

Vier Befunde aus dem Bildschirmfoto, alle dieselbe Klasse wie der C-Streit aus V8-S4: **wenn zwei
Stellen dasselbe dürfen, störtdie zweite.**

- **Das Overlay über den Units war das Zonen-Banner.** Es stand mitten im Bild über den Bären und
  sagte Titel, Biom und Wächterzahl — genau das, was das v7-Möbel oben rechts unter »Nearest«
  ohnehin sagt. Das Skin gewinnt (es sitzt an der Kante, nicht in der Szene); ohne Skin bleibt das
  Banner als Notausgang.
- **Zwei Wächter, ein Satz.** Zwei identische Blasen »The Assumption Stack« übereinander: der
  Zonendeckel erlaubt zwei Stimmen, prüfte aber nur die *Zahl*, nicht den *Inhalt* — und
  `cardLine` gibt beiden denselben Titel. Die Zone merkt sich jetzt den letzten Satz; wer ihn
  wiederholen will, schweigt.
- **In-fight dialogue = OFF** (neu in den Settings, Standard aus). Ein Wächter, der beim Zuschlagen
  seine Kartenzeile zitiert, nimmt dem Schlag die Zeit, und die Blase steht ausgerechnet dort, wo man
  hinsieht. Außerhalb des Kampfes reden sie weiter.
- `1 steps` → `1 step`.


## V10-S1f · 2026-08-09 · Die Übersicht aufgeräumt, der Strand-Teleport erklärt

**»Bei Klick auf die Map werde ich immer wieder zum Strand teleportiert.«** Nachgestellt statt
geraten: der Klick wurde protokolliert, und die Umrechnung Bildschirm → Welt stimmt exakt (Mitte der
Minikarte → Feld 120,90 bei einer 240×180-Welt). Der Fehler saß eine Zeile weiter. Traf der Klick
keinen Ort und keine Zone, lief `setMoveTarget(wx,wy)` — ein **Laufbefehl**. In der Lagune liegt
dieser Punkt im Wasser, der Wegfinder nimmt das nächste erreichbare Feld, und das ist die Küste. Die
Karte sagte nichts, der Held stand am Strand. Jetzt: begehbares, verbundenes Land ist ein Ziel, alles
andere bekommt eine Meldung und sonst nichts.

**Die M war unübersichtlich, weil jede Marke ihren Namen trug.** Sechs Zonentitel, sechs Untertitel,
neun Ortsnamen, dazu die Ausweichlogik, die sie auseinanderschiebt — achtzehn Kästen auf einer Insel.
Jetzt zeichnet die Übersicht **Marken**, und **einen** Namen: den unter dem Zeiger (Titel + Zustand,
am Cursor). Zonen behalten ihr Rechteck und bekommen einen Zustandspunkt an der Ecke; »you« bleibt
beschriftet, weil eine Karte ohne dich ein Bild ist. Aufräumen, nicht gestalten — das Design der
Übersicht ist ein eigener Slice.

**Die Wasser-Textur war nicht buggy, sie war Aliasing.** Eine 512er Rauschkachel, mit Nearest auf ein
Zehntel gezogen, greift je Bildzeile andere Quellpixel — das sind die Streifen. Unter derselben
Schwelle wie Relief und Bodenkorn (V9-B6, Zoom 0,7) bleibt die Fläche jetzt glatt: auf dieser
Entfernung ist Wasser eine Farbe.

**Und ein selbst gebauter Fehler, der zwei Reparaturen brauchte.** Die neue Naht-Blende (V10-S1e)
lief in `bake()`, aber `bake()` läuft je Bild, solange der Kachel-Cache gesperrt ist — drei
Leinwände und zwei ImageData zu 512² je Aufruf. Ergebnis: `NS_ERROR_OUT_OF_MEMORY`, gemeldet drei
Funktionen später im Decal. **Wer knapp am Speicherdeckel arbeitet, sieht den Verursacher nie im
Stacktrace.** Jetzt: Ergebnis je Quellbild gecacht (WeakMap), eine Leinwand statt drei, ein
Rücklesen statt zwei — und wenn das Rücklesen scheitert, läuft das Spiel mit Naht weiter statt gar
nicht.


## V10-S1b · 2026-08-09 · Die Karte ist ein Ort, kein Foto

Drei billige Mittel, die sich gegenseitig tragen — Georgs Befund war die **saubere Kante**, nicht die
Schattenstärke.

**I · Die Tusche sieht man jetzt.** Auf dem Blatt in der Hand ist die Feder Zierde und darf dünn sein
(`OW_CARD.inkGain` 0,82); im Terrain ist sie die **Kante eines Ortes** und zugleich die Zonengrenze,
an der die Aggro hängen wird. Der Reader zeichnet dieselbe Kanon-Feder mit Faktor 1,8 auf die
Halbbreite — kräftiger geführt, mit ihrer Schwellung und ihrem Auslauf, kein zweiter Strich. Solange
der dünne Rahmen aus dem PDF gewann, gewann das Foto.

**F · Die Kante gehört dem Terrain.** `dressReader()` setzt acht Requisiten aus **demselben
Prop-Blatt wie die Landschaft** (`OW_PROPS`) mit dem Fuß AUF die Tuschelinie: drei oben, drei unten,
je eines links und rechts, außen dichter als in der Mitte. Gezeichnet werden sie im Sprite-Durchgang,
also **über** der Tusche — Verdeckung ist der stärkste Tiefenhinweis, den es gibt. Gewählt wird
benannt (`Busch`/`Blueher`), nicht gewürfelt: an einer Kante, die Terrain sein soll, hat ein Kürbis
nichts verloren. Fehlt das Blatt, fällt es auf den Tiny-Swords-Vorrat zurück.

**C · Ein Anker überlappt.** Ein `Stein` steht mit dem Fuß auf der oberen linken Ecke des Blatts.
Eines, nicht zwei: zwei wären Deko, eines ist ein Ort.

**Nichts davon sperrt ein Feld.** Das Blatt bleibt vollständig begehbar — der Charakter ist der
Cursor (V9-B3), und ein gesperrtes Feld mitten auf der Karte würde genau diese Mechanik brechen.

Am Bild geprüft: die Karte liegt in der Wiese statt darauf. Offen bleibt E (ausgefranster Grubenrand
mit Erdlippe) und B (Gutter mit Zugängen) — beides eigene Slices.


## V10-S1a · 2026-08-09 · Renderskala: gemessen, und die Fläche erklärt nur die Hälfte

Die offene Frage aus S1 (»weniger Pixel«) ist beantwortet, diesmal mit einem echten Regler statt
eines ungültigen Versuchs: `resize()` liest jetzt `att.renderScale` (Regler `renderScale`,
1 · 0,75 · 0,5, Standard 1). Die Leinwand wird kleiner gerechnet und vom Browser hochgezogen —
`image-rendering:pixelated`, bei Pixelkunst also gröberes Korn statt Weichzeichner. Nur die Dichte
ändert sich: der Faktor sitzt in `dpr`, und Kamera, Zoom, Rasterung und Physik hängen ohnehin daran.
Die Welt bleibt gleich groß.

Wechselvergleich, 4 Runden à 40 Bilder, Zeichenzeit mit Spülung:

| Skala | freies Feld | Stadtmitte |
|---|---|---|
| 1,0 | 19 ms | 14 ms |
| 0,75 | 16 ms (**−3**) | 13 ms (im Rauschen) |
| 0,5 | 15 ms (**−4**) | 12 ms (**−2**) |

**Halbe Auflösung ist ein Viertel der Pixel und spart ein Fünftel der Zeit.** Die Flächen-These aus
S1 stimmt also nur zur Hälfte: unter der Fläche liegt ein Sockel von rund 12 ms, der nicht aus
Pixeln besteht (Befehle abgeben, Sprites, Spülung selbst). Damit ist der Regler eine ehrliche
Notbremse für schwache Rechner, aber **kein Standard** — 4 ms sind den Verlust an Schärfe nicht wert,
solange der Sockel nicht kleiner ist.

Nächste Frage, wenn Performance wieder dran ist: **woraus besteht der Sockel?** Er ist an beiden
Standpunkten fast gleich groß und wächst nicht mit der Fläche.


## V10-S1 · 2026-08-09 · Die Stadt war es nicht. Ein Messgerät mit festem Standpunkt, und die Naht ist zu.

**Das Messgerät zuerst** (`overworld/spot-probe.js`, `OW_SPOT`, spot-v1.3). Hausregel 1 aus v9 in
Code: benannte Standpunkte (`stadt` · `markt` · `turm` · `karte` · `feld` · `kueste`), die aus der
Welt gelesen und nicht gesetzt werden (das freie Feld ist das Landfeld mit dem größten Abstand zu
allen Orten, Zonen und zum Blatt), der Held wird dorthin gesetzt und **nach jedem gemessenen Bild
wieder dorthin gepinnt**. Dazu im Runner: eine Abschnittsuhr (`_t`/`dbgT`) und 16 Schichtschalter
(`dbg`), mit denen sich jede Zeichenschicht einzeln abschalten lässt.

### Drei Messfehler, die diese Nacht selbst produziert und selbst widerlegt hat

1. **Zeichenzeit ohne Spülung ist keine Zeichenzeit.** Erste Messreihe: `draw()` kostet an *jedem*
   Standpunkt 1 ms, das Bild aber 17–26 ms. `performance.now()` um `draw()` misst nur, wie lange
   wir Canvas-BEFEHLE abgeben; gezeichnet wird danach. Mit `getImageData(0,0,1,1)` als Spülung
   (wartet, bis das Bild wirklich fertig ist) sind es 18–30 ms — und erst diese Zahl ist die Sache.
2. **Eine einzelne Messung ist keine Messung.** Dieselbe Variante, derselbe Standpunkt, zwei Läufe:
   28 und 22 ms. Das Rauschen liegt bei ±6 ms. Seitdem misst `OW_SPOT.vergleich()` die Varianten
   **im Wechsel** (A B A B A B), je Runde ein Median, und schreibt in die Tabelle, ob sich die
   Spannen überlappen — `sicher: nein — im Rauschen` ist eine gültige Antwort.
3. **Ein defekter Prüfaufbau liefert trotzdem Zahlen.** Ein Isolationstest fütterte
   `createPattern(undefined)`; die Ausnahme brach die Zeichnung ab, und das Ergebnis sah aus wie
   ein Befund (»Musterfüllung kostet nichts«). Es war nur ein Absturz mit Uhr daneben.

### Der Befund: **die Stadt ist nicht die Bremse — die Fläche ist es**
Zeichenzeit mit Spülung, gleicher Zoom, je 70 Bilder:

| Standpunkt | Zeichnen |
|---|---|
| vor dem Turm | 18 ms |
| auf dem Blatt | 19 ms |
| Marktplatz | 22 ms |
| **Spawn (Stadtmitte)** | **22 ms** |
| Küste | 29 ms |
| **freies Feld** | **30 ms** |

Also genau andersherum als vermutet: am teuersten ist das leere Land. Schichten im Wechselvergleich
(freies Feld, 5 Runden, Spannen überlappen nicht):

| Schicht aus | Zeichnen | Gewinn |
|---|---|---|
| alles an | 29 ms | — |
| **Boden** | 17 ms | **−12 ms** |
| Deko (13 Sprites) | 24 ms | −5 ms |
| Kontaktschatten | 25 ms | −4 ms |

**Wegenetz, Bauten und Mobs liegen im Rauschen.** Die drei Verdächtigen aus dem Onboarding sind
damit erledigt, ohne dass eine Zeile Stadt angefasst werden musste.

### Und die Bodenschicht kostet nicht durch ihre Pfade, sondern durch Pixel
Drei Eingriffe gebaut, gemessen, **alle drei wieder ausgebaut**:
· **Kurzweg im Landesinneren** (kein Clip, kein Wurfschatten, kein Bevel, wenn im ganzen Ausschnitt
keine Kante liegt): −1 ms bei ±6 ms Rauschen. Nichts.
· **Kacheln statt Muster** (`drawImage` im Raster gegen `createPattern`+`fillRect`): identisch,
30 gegen 31 ms. Die Füllart ist als `OW_TERRAIN.fuellart` stehengeblieben, damit man es nachmessen
kann, Standard bleibt `muster`.
· **Auflösung** (dpr 2 → 1): **nicht gemessen** — `resize()` holt sich das dpr selbst zurück, die
Leinwand blieb 1576×1256. Der Versuch war ungültig, die Frage bleibt offen und ist die nächste.

Was bleibt: eine vollbildgroße texturierte Füllung kostet in diesem Kontext ~12 ms, egal wie sie
gezeichnet wird. **Wer hier optimieren will, muss Pixel sparen, nicht Pfade** — weniger Fläche,
weniger Überdeckung, oder der Boden in geringerer Auflösung mit Hochskalierung.

### Die Naht ist zu — im zweiten Anlauf (Georgs Befund am Bildschirmfoto)
`seamless()` in `ground-paint.js` konnte gar nicht funktionieren: die alte Fassung legte den
rechten Streifen mit einem Verlauf über die **linke** Kante. Danach ist Spalte 0 = Quelle(size−F),
die rechte Kante bleibt Quelle(size) — beim Kacheln stoßen zwei verschiedene Werte aufeinander. Die
Kante war weichgezeichnet, nicht geschlossen.

**Erster Versuch: Spiegelkachel. Sofort zurückgenommen.** Mathematisch nahtlos, aber vier
gespiegelte Quadranten sind eine Rorschach-Figur mit zwei Achsen — am Bildschirmfoto sofort
sichtbar. Georg: »KISS, aber nicht lazy/billig.« Richtig.

**Jetzt: Halbversatz mit Kreuzblende am Rand** (der klassische Weg). Die Kachel wird um die Hälfte
versetzt kopiert; der Versatz schiebt die schlechte Kante der Quelle in die Mitte und holt
Innenmaterial an den Rand. Geblendet wird nur in einem Band von 12 % um die Kanten, getrennt in x
und y (vier versetzte Kopien, Gewichte f(x)·f(y), f = 1 innen, 0 an der Kante, smoothstep):
am Rand zählt allein die versetzte Kopie — dort ist ihr Inhalt stetig, also schließt die Kachel exakt
gegen sich selbst; in der Mitte zählt allein das Original, dort bleibt das Korn scharf; die Naht der
versetzten Kopie liegt genau dort, wo ihr Gewicht null ist. Kein Spiegel, keine Achse, kein
verkleinertes Korn. Gerechnet **einmal je Textur im Backvorgang** (`seamless()`), Kosten in der
Zeichenkette: null. Am Bild geprüft: Gras und Sand sind durchgehende Flächen.

### Tuschestärken (Georg, 9.8.)
· **Karten dünner:** `OW_CARD.inkGain = 0,82` als Faktor auf die Halbbreite der Kanon-Feder. Der
Kanon selbst bleibt unangetastet — `drawInk` nimmt den Faktor entgegen, und er gehört dem Aufrufer.
Eine Zahl, ein Ort: Blatt, Rückseite, Artwork und das Blatt im Terrain lesen dieselbe.
· **Terrain dicker:** `INK_STYLES.feather.half` 0,015 → 0,019 (`hard` 0,018 → 0,022). Die dickste
Stelle der Küstenfeder geht damit von gut 3 auf knapp 4 px bei Zoom 1.
· **Offen:** Weg, Graben und Pfützen haben heute **keine** eigene Tuschelinie — Wege werden im
`paint`-Modus gar nicht gezeichnet, das Pfützenmodul ist seit V8-S2 aus. Es gibt dort also nichts
zu verdicken, bis diese Kanten gebaut werden (Gutter mit Zugängen ist v10-S1b).


## V9-B7 · 2026-08-09 · Zonenschatten drin, Naht-Fix zurückgenommen, und eine Lehre über Messen

**Der Zonenschatten ist da** (Georgs Lichtlogik). Eine Karte, die auf dem Gras liegt, wirkt wie ein
Aufkleber; ein Schatten gibt ihr Höhe, und die Richtung sagt, was sie ist:
**oben links innen = tief** (Grube) · **unten rechts außen = hoch** (Hügel). Der Höhenunterschied ist
die **Größe** des Schattens, nicht seine Farbe — so bleibt eine Lichtquelle für alles, was später
dazukommt (Tor, Truhe, Anker, Mauer). Regler `cardLift`: negativ Grube (Standard −1,4), positiv Hügel.
Gezeichnet als Verlauf, **nicht** mit `shadowBlur` — weiche Schatten auf Pfaden mit vielen Stützpunkten
waren die Bremse aus V9-B6. Kosten gemessen: 2 fps.

**Der Naht-Fix ist zurückgenommen.** Idee: eine 2×2-Spiegelkachel, mathematisch nahtlos bei jeder
Textur. Drei Anläufe, drei Verschlechterungen — doppelte Kachelgröße kostete 44 ms je Bild
(`createPattern` zahlt für die Fläche), das Spiegeln lief je Bild mit, und ein Cache am Canvas-Objekt
traf nie, weil jeder Backvorgang ein neues Canvas liefert. Die Funktion `spiegeln()` bleibt stehen und
wird nicht gerufen; der Kommentar sagt, wo sie hingehört: **in `bake()`, einmal je Textur, nicht in
die Zeichenkette.** Eine sichtbare Naht ist Kosmetik. 47 fps sind es nicht.

### Die Lehre dieses Blocks: **die Bildrate hängt am ORT, nicht nur an den Schichten**
Am Ende dieser Runde stand die entscheidende Messung — dieselbe Szene, zwei Standpunkte:

| Standort | fps |
|---|---|
| an der Karte, freies Feld | 46–52 |
| Spawn / Stadtmitte | **18** |

Damit sind meine Zwischenmessungen (17 · 20 · 27 · 30 · 31) **wertlos**: ich habe an verschiedenen
Stellen gemessen und die Unterschiede meinen Änderungen zugeschrieben. Die Spiegelkachel war
wahrscheinlich nie die Ursache der 20 fps — der Held stand nur woanders.
**Regel für v10: eine Messung ohne festen Standpunkt ist keine Messung.** Erst Position setzen, dann
zählen, und immer dieselbe Position über alle Varianten.

**Was das für v10 heißt:** die Bremse sitzt in der **Stadt**, nicht in der Landschaft. Acht große
Bauten, das Wegenetz als dritte Kachelschicht und die Deko drumherum — dort ist zu suchen, mit einem
festen Standpunkt und einer Schicht nach der anderen. Nicht bei den Texturen.

## V9-B6 · 2026-08-09 · weit weg braucht keine Details — 40 → 56 fps

Georgs Befund: »das ist alles so unerträglich langsam … selbst die fackel-animation ist ruckelig«.

**Es gab keinen einzelnen Schuldigen.** Vier Messungen bei Zoom 0,4 (40 fps): Terrain-Fläche
abschalten bringt +10, Küstentusche 0, Wasser 0. Der Unterschied liegt allein am Ausschnitt — bei
Zoom 0,4 sind **1110 Felder** im Bild, bei Zoom 1 **288**. Sechsmal so viel Welt, und jede Schicht
zahlt mit. Kein Bug, sondern eine Rechnung.

**Also fällt weg, was man auf dieser Entfernung nicht sieht** (unter Zoom 0,7):
das Relief der Küste — weiche Schatten auf einer Silhouette mit 6150 Punkten, mehrfach je Bild —
und die Bodentextur samt Band. Ein Regler an drei Stellen, kein Eingriff in die Logik; wer heranzoomt,
bekommt alles zurück.

| Zoom | vorher | jetzt |
|---|---|---|
| 0,4 | 40 | **56** |
| 0,6 | — | 58 |
| 0,8 | — | 61 |
| 1,0 | 60 | 64 |

**Nicht nötig:** zurück auf v4. Die fünf Tage bleiben.
## V9-B5b · 2026-08-09 · Gebäude sperren ihre gezeichnete Fläche

Georgs »man kann durch gebäude durchlaufen« war **kein fehlender Gummi, sondern Kollision an der
falschen Stelle**. Die Sperrfläche war ein fester Stummel — `tw = round(w/TILE) − 1`, `th = 2` —
begründet mit: in der Draufsicht sei nur die Grundfläche Körper, der Rest des Blattes Höhe.

**Die Begründung stimmt für eine echte Draufsicht. Tiny Swords zeichnet aber schräg von vorn, und da
ist die gezeichnete Wand Fläche, nicht Höhe.** Ein Satz, der einmal richtig war, bleibt im Code stehen
und wird falsch, wenn sich die Perspektive ändert.

Gemessen vorher: Wirtshaus-Sprite 128×192 = 2×3 Felder, gesperrt **1×2**. Quer durch die obere Hälfte
lief der Held **4,69 von 4,69 Feldern ohne jeden Widerstand** — mitten durch das Haus. Bei der Kirche
(3×5 Felder) war ein Fünftel gesperrt, beim Turm (5×4) knapp ein Zehntel.

Jetzt kommt die Fläche aus der Sprite-Geometrie: `tw = round(w/TILE)`, `th = round(h/TILE) − 1`. Die
unterste Reihe bleibt frei — das ist der Fußsaum, auf dem man vor der Tür steht — und das Türfeld
darunter wie bisher.

| Bau | Sprite | gesperrt vorher | jetzt |
|---|---|---|---|
| Wirtshaus | 2×3 | 1×2 | **2×2** |
| Kirche | 3×5 | 1×2 | **3×4** |
| Turm | 5×4 | 1×2 | **5×3** |
| Arena | 2×4 | 1×2 | **2×3** |

Abnahme mit derselben Fahrt, die den Fehler gezeigt hat — quer durch die **obere** Hälfte der Kirche,
150 px/s, 120 Frames: **1,80 von 4,50 möglichen Feldern** (vorher 4,69 von 4,69). Der Held steht an
der Kante, nicht im Bau.

Der Gummi-Stoß aus V9-B5a wirkt damit auf der ganzen Wand statt auf einem Viertel. Er schaukelt nicht
auf, obwohl `applyKnock → moveEntity → knock` ein Kreis ist: gegen die Wand gedrückt stabilisiert er
bei 74–94 px/s, die Position hält, der Held landet nicht im Gebäude.

## V9-B4g/B5a · 2026-08-08 · die Viertelseite, und drei Kampfbefunde waren ein Fehler

### Die Karte: vierter Anlauf, und Georg hatte von Anfang an die Antwort
»statt einfach die entsprechende 2x2 ecke des PDFs in der aspect ratio der page zu zeigen!« — genau
das macht der Reader jetzt: `OW_ART.quarter()` halbiert die Seite und nimmt die Ecke. **Eine
Halbierung kann nicht falsch sitzen.** Das Feld ist deshalb **9×5 Felder** (1,80) statt 7×4, weil die
Viertelseite 700×390 = 1,795 hat — der Boden ist keine gedruckte Karte, sondern der Ausschnitt einer
Seite. Abnahme mit dem Test, den ich dreimal versäumt hatte: **ist Titel UND LORE im Bild?** Tinte in
allen zehn Höhenbändern (0,095…0,321), Titel oben, POWER/LORE unten, nichts fehlt.

**Warum drei Messungen scheiterten — eine Lehre, die ich mir teuer erkauft habe:**
**Kartengrenzen sind Weißraum, nicht Tinte.** Jede meiner drei Messungen hat dunkle Linien verfolgt
und dabei Illustrationsrahmen, Unterstreichungen und Textkästen für Kartenkanten genommen. Der Test
auf durchgehend **leere** Zeilen hat auf dieser Seite genau **eine** Lösung: y 374–397. Daraus folgt,
dass die Seite im **Vollanschnitt** bis zur Blattkante läuft (Karte ~683×378) — und dass mein
»sauber gemessenes« Fenster den Kartentitel und den ganzen POWER/LORE-Block abschnitt.
Ehrlich festgehalten: die **26.7.-Zahlen lagen bei y/h/gapY näher an der Wahrheit als alle drei
meiner Nachmessungen.** Zwei Anläufe davon waren Regressionen, keine Verbesserungen.
Und: mein eigener Screenshot hat den Fehler gezeigt (Titel angeschnitten, kein POWER) — ich habe ihn
als »unzuverlässiger Screenshot-Kanal« abgetan. **Das Bild hatte recht, die Messung war schöner.**
Alle vier Vorgänger-Werte samt Begründung stehen additiv in `overworld/card-grids.json`; das Raster
bleibt für das **Blatt in der Hand** (`art()`) zuständig, wo kein Fremdinhalt an den Rand darf.

### Der Kampf: drei von vier Befunden waren EIN Fehler
Georg: »a) unit dreht sich nicht korrekt in laufrichtung · c) man schlägt immer in die gleiche
richtung · d) man wird von hinten angegriffen (was super und gewollt ist), aber man kann sich nicht
umdrehen.« Alle drei kamen aus **einer Zeile** in `moveEntity`:
`if(Math.abs(dx)>6 …) u.face=Math.sign(dx)` — die Hysterese gegen Sprite-Flackern. Die **Wegfindung**
liefert Pixelabstände (oft über 60) und kam über die Hürde; die **Tastatur** liefert `dx = ±1` und kam
nie darüber. Wer selbst lief, behielt sein Gesicht — und schlug damit immer in dieselbe Richtung.
Jetzt entscheidet der **normierte** Anteil (`ux = dx/l`, Schwelle 0,30): eine Einheit, in der Tastatur
und Pfad dasselbe sagen. Abnahme über `moveEntity` mit Tastatur-Einheiten: links → `face −1`,
rechts → `+1`, runter → `dir down`, hoch → `up`, diagonal → `face −1`.

**b) »so träge, dass man sich im kampf gar nicht bewegen kann«:** `tryAttack` rief bei **jedem**
Schlag `OW_FEEL.breakFlow()` — der Antritt (0,18 s) fing jedes Mal bei null an, und im Kampf schlägt
man dauernd. Die Regel aus S12c (»wer zuschlägt, verliert die Fahrt«) bleibt für den **Klick**-Angriff,
gilt aber nicht mehr, während eine Laufrichtung gedrückt ist: wer die Taste hält, hat sich entschieden.

**Gebäude sind jetzt Gummi:** »man kann durch gebäude durchlaufen, statt bouncy leicht abzuprallen.«
Eine gesperrte Kante hielt nur an; jetzt gibt sie einen Stoß zurück — über `OW_FEEL.knock`, also in die
**Geschwindigkeit** und nicht in die Position, dieselbe Kinetik wie beim Treffer-Rückstoß. **Eine**
Kinetik im Spiel, nicht zwei.

### Offen, ausdrücklich nicht geraten
»nach dem kampf werde ich erratisch auf eine andere karte bewegt« — nicht reproduziert und deshalb
**nicht** angefasst. Verdacht: ein `attackTarget`/`path`, das den Tod des Ziels überlebt, oder der
Respawn. Ich brauche einen Schritt zum Nachstellen (welche Zone, hat der Held gewonnen oder verloren),
sonst rate ich am Symptom vorbei — und geraten wurde in diesem Sprint schon genug.
Die Card-Zone-Dramaturgie (Sand · Aggro an der Tusche · Win · BLÖDSINN! · Stay fluffy) steht
unverändert als nächster Slice in **V9-B4** und muss nicht neu erklärt werden.

## V9-B4f · 2026-08-08 · das Raster, dritter Anlauf — Linien verfolgen statt Anteile zählen

Drei Anläufe für sechs Zahlen. Der Fehler war jedes Mal derselbe im Kern: **ich habe Tinte gezählt,
statt Linien zu verfolgen.** Ein Profil aus »Anteil dunkler Pixel je Spalte/Zeile« findet auch
Bilderrahmen in der Illustration, Unterstreichungen und Textzeilen — und liefert damit Kanten, die
keine Kartenkanten sind.

| Anlauf | Fehler | Folge |
|---|---|---|
| 26.7. | nur an der **oberen** Reihe abgenommen (Karten 5–8) | Fenster der unteren Reihe 35 px links, 21 px hoch, 27 px zu lang |
| 8.8. (1) | `gapX` aus der **Symmetrie hergeleitet**, nicht gemessen | jede Zelle 78 px (14 %) zu schmal, rechte Rahmenlinie fehlte |
| 8.8. (2) | `y` aus Zeile 62 — einer **Textlinie**, keiner Kartenkante | Fenster 6 px zu tief, Kartentitel angeschnitten |

**Das Verfahren, das trägt:** die Rahmenlinien als **durchgehende dunkle Bänder** verfolgen
(zusammenhängend über >60 px), nicht als Anteil. An der inneren senkrechten Linie x=670 ergeben beide
Reihen dann gleich lange Bänder — **y 51–333 (283 px) und y 421–704 (284 px)** —, und an der unteren
waagerechten y=704 liegen zwei Bänder von je **569 px** (x 103–671 und 728–1296). Zwei gleiche Zahlen
aus zwei unabhängigen Richtungen: das ist die Kontrolle, die den ersten beiden Anläufen fehlte.

**Ergebnis:** `{x 0,0736 · y 0,0653 · w 0,8521 · h 0,8361 · gapX 0,0407 · gapY 0,1127}` —
Karte 569×283, Bundsteg 57, Reihensteg 88. Berechnete Zelle 568×282,5 deckt beide Reihen exakt.
Abnahme an **allen vier** Quadranten von Seite 10: Zellen einheitlich 567×282; bei #33 trägt jede der
vier Kanten Rahmentinte (0,95 · 0,67 · 0,69 · 0,90), kein Sprung auf Fremdinhalt.

**Zwei Lehren, in `card-grids.json` festgeschrieben:**
1. *Wer ein Raster misst, verfolgt Linien, statt Anteile zu zählen.*
2. *Ein Zellformat nahe `CARD_AR` ist **kein** Beweis.* Im ersten Anlauf sah 1,771 gegen 1,74
   bestätigend aus — die Zelle war nur 78 px zu schmal. `CARD_AR` ist das Sollformat des **Blattes**,
   in das `fitCell` die Zelle mittig einlegt; der Fehlbetrag wird Creme-Rand. Das echte Zellformat
   dieses Decks ist **2,011**.

**Damit ist `_offen_1` wieder offen, aber richtig gestellt:** die Frage »warum gehen die Zellformate
auseinander?« lässt sich nicht beantworten, solange nur A neu gemessen ist. `ignore_dystopia` (1,740)
und `embrace_protopia` (1,969) stehen weiter auf der 26.7.-Messung — der Messung, die bei A **dreimal**
falsch war. Sie müssen mit dem Band-Verfahren nachgemessen werden, bevor irgendjemand daraus
schließt, die Decks seien unterschiedlich gesetzt. Alle drei Vorgänger-Werte stehen additiv mit
Begründung in `overworld/card-grids.json`.

**Nicht verifizierbar in dieser Runde:** der Bildschirm-Screenshot kommt über einen DOM-Nachbau und
meldet »canvas read back blank« — er zeigt teils einen älteren Frame. Alle Aussagen oben stammen
deshalb aus Pixelmessungen am `reader.img` und am gerenderten Blatt, nicht aus dem Bild.

## V9-B4e · 2026-08-08 · das Kartenraster war falsch gemessen — auch das »gemessene«

Der zweite Abnahme-Durchgang hat den Anschnitt am echten Zellbild vermessen und meine Erklärung aus
V9-B4b widerlegt: **die Deckwahl war nicht die Ursache.** Auch mit `forget_utopia` — dem Deck, dessen
Raster als gemessen gilt — saß das Fenster falsch: 35 px zu weit links (die Illustrationsspalte mit
»…WING TO SEE HERE« und dem Tentakel kam mit ins Bild), 21 px zu hoch, und unten lief es 27 px über
die Kartenunterkante in die Nachbarzeile.

**Der Grund stand in der eigenen Fundort-Notiz:** die Zahlen wurden am 26.7. an der **oberen**
Kartenreihe von Seite 3 abgenommen (»Karten 5–8«). Für die **untere** Reihe trägt das `y`/`gapY`-Paar
nicht — und Karte #35 ist Quadrant 2, also untere Reihe. Eine Zahl, die nur an einer von zwei Reihen
geprüft wurde, ist halb gemessen.

**Neu gemessen** (Seite 10, Karten 33–36, Rahmenlinien-Detektion am gerenderten Blatt 1400×781):
horizontale Rahmen bei y 61/332 (obere Reihe) und 423/704 (untere), linke Kartenkante x 104, rechte
x 1294. Daraus:

| | alt (26.7.) | neu (8.8.) |
|---|---|---|
| x · y | 0,050 · 0,037 | **0,074 · 0,078** |
| w · h | 0,899 · 0,947 | **0,850 · 0,823** |
| gapX · gapY | 0,135 · 0,010 | **0,153 · 0,117** |
| Zellformat | 1,462 | **1,768** |

**Damit ist `_offen_1` erledigt** — die Frage, warum die Zellverhältnisse der drei Decks auseinander
gehen (A 1,462 · B 1,740 · C 1,969). Bei A war es ein **Messfehler, kein Satzunterschied**: neu
gemessen liegt A bei 1,768 gegen B 1,740, die Decks sind gleich gesetzt. Damit ist
`embrace_protopia` (1,969) der nächste Verdächtige, nicht der Beweis für unterschiedliche Sätze.
Der alte Wert steht als `_vorgaenger` in `overworld/card-grids.json` samt Begründung — additiv,
nicht überschrieben.
Abnahme am neuen Zellbild (487×275, AR **1,771**): linke Spalte 0 trägt **87 %** Tinte, das IST die
gedruckte Rahmenlinie; rechts 38–55 % über die letzten Spalten; unten kein Sprung auf Fremdinhalt.

**Und: die Anreise hat jetzt EINE Wahrheit.** Der Klick auf »the card« in der Übersicht setzte den
Helden mitten auf das Blatt — der kommende Aggro-Trigger hängt aber am Überschreiten der Tusche, und
wer darauf landet, überspringt ihn. Klick und Sprungmarke nehmen jetzt dasselbe Ziel: **zwei Felder
unter der Unterkante**, außerhalb der Tusche, mit der Karte im Blick.

**Die Lehre, teuer bezahlt:** *»gemessen« ist kein Zustand, sondern eine Frage — gemessen woran?*
Der Fundort-Vermerk hat den Fehler gerettet, weil er die Karten benannte, an denen geprüft wurde.
Ohne ihn hätte ich wieder die Deckwahl verdächtigt. Ab jetzt wird jede Rasterzahl gegen **beide**
Reihen geprüft, und der Fundort nennt die Seite und die Kartennummern.

## V9-B4b/c/d · 2026-08-08 · der Anschnitt war die Deckwahl, und M hörte auf die falsche Taste

**Der Anschnitt kam nicht vom Reader, sondern vom Deck.** Georg: »die karte ist zu stark im
anschnitt…?« Der Kanon ist eindeutig (EMBED §5/§9): die `cardGrid`-Zahlen stehen **im Manifest**,
geraten wird nicht. Gemessen sind die drei Decks der Trilogie — `trust_and_betrayal`, das der Runner
gewürfelt hatte, ist **nicht** dabei, und mein Rückfallwert schnitt jede Zelle falsch.
Jetzt wählt `loadDeck()` **nur aus Decks mit gemessenem Raster**, und in der Utopia-Welt beginnt die
Reise mit `forget_utopia` — kein neuer Vertrag, nur die Reihenfolge aus **§3.4** (Utopia → Dystopia →
Protopia), die längst feststeht. Fehlt jede Messung, sagt die Konsole es und der Rückfallwert greift.
Abnahme: Deck `forget_utopia`, Karte #35 »The Missing Receipt« liegt vollständig im Terrain —
Titel, Illustration, POWER- und LORE-Zeile, nichts abgeschnitten.

**`M` hörte auf die rechte Maustaste.** Der Abnahme-Befund war präzise: `if(e.button!==2…)return;`
stand **über** dem ganzen Übersichts-Zweig, also lief mein »jeder Ort ist ein Reiseziel« aus V9-B4 bei
einem Linksklick nie. Der eigene Hinweistext der Übersicht sagt seit immer »click a place to travel,
shift+click to drop yourself« — **die Anweisung auf dem Bildschirm war richtig, der Code war es
nicht**, und Georg klickt links. Jetzt hört die Karte auf beide Tasten; im Spiel bleibt die rechte,
was sie war. Abnahme mit echtem `pointerdown`, `button:0`, auf den Marktplatz-Pin: Held 129,47 →
116,36, Übersicht schließt.
Dazu **drei toten Zweige entfernt** (tavern r=200 · places r=150 · spawn r=200): der neue Test fängt
dieselbe Entscheidung schon ab, und zwei Wahrheiten für eine Frage laufen beim nächsten Fork
auseinander.

**Zwei Sprungmarken im Abnahmeblatt (`F`)** — Georgs »der char soll nicht auf der card starten,
sondern anreise, trigger etc als kompletten flow testen können«:
`Karte · Anreise` setzt ihn **drei Felder unter die Unterkante**, außerhalb der Tusche, mit Blick
darauf — von dort läuft man hinein und der Trigger gehört dem Spiel. `Karte · drauf` ist der Kurzweg
für die Ansicht selbst.

**Der Titelstreifen ist geparkt** (`R.showLabel`, Standard aus). Georg: »cooles feature, sollte aber
hier nicht angezeigt werden, da titel etc ja auch auf der card zu sehen ist.« Die Karte sagt ihren
Namen selbst. Der Code bleibt stehen, weil er im Seitenmodus wieder Sinn hat — dort stehen vier Titel
auf einem Blatt. Im Kommentar steht, wohin die Zeile gehört, wenn sie zurückkommt: **über** die
Oberkante, nie darunter, weil dort die Stadt zeichnet.

## V9-B4 · 2026-08-08 · eine Karte als Boden, Blättern geparkt, M reist wieder

Georgs Korrekturen nach dem ersten Blick, alle vier umgesetzt:

**1. Der Standard ist EINE Karte, nicht die Seite.** »dein page view (4 cards) ist der
(mini)dungeon-modus · erstmal single card viewer, keine blätter-funktion · der default view ist eine
karte.« Der Reader liegt jetzt als **7×4 Felder** (448×256 px) im Gras — Verhältnis 1,75 gegen das
Sollformat CARD_AR 1,74, dieselben zwei Zahlen, mit denen der Loot-Zaun schon »als Karte daliegt«
(`PEN_COLS`/`PEN_ROWS`). Das Bild ist die **Zelle** aus dem 2×2-Raster über `OW_ART.art()`, also
derselbe Adress- und Crop-Vertrag wie im CardBuilder. Abnahme: »FALSE INNOCENCE TRICK« (#35, die
Karte der ersten Zone) liegt formatfüllend im Terrain, Titel auf dem Papierstreifen darüber.

**2. Die Blätter-Trittsteine sind geparkt, nicht gelöscht.** »die blätter buttons sind viel zu groß
und sollten geparkt werden · PDF blätter-funktion bauen wir später.« `mode:'page'` zeichnet weiter
die ganze Seite mit Steinen, Zellraster und Hervorhebung — der Weg für den Mini-Dungeon steht,
er ist nur nicht der Standard. **Den funktionierenden Fallback nicht wegwerfen** (Hausregel).

**3. `M` reist wieder.** »M triggert die map, alter! danach bin ich wieder am strand…?« — belegt und
behoben: der Klick auf der Übersichtskarte prüfte **nur Kampfzonen und das Wirtshaus**. Ein Klick auf
Marktplatz, Archiv, Turm, Kirche, Arena, Garten oder Friedhof traf ins Leere, die Karte schloss, und
man stand wieder da, wo man war. Jetzt ist **jeder Ort** ein Reiseziel (nächster Treffer in
Weltpixeln, Radius 10 Felder, damit es bei jeder Zoomstufe gleich groß ist) — **und die Karte selbst
ist eines**, sie heißt »the card«. Der Weg zum Reader ist damit ein Klick, kein Spaziergang.

**4. Die Kartenrückseite ist der Fallback.** `overworld/card-backside.png` (Georgs Anhang) liegt
unter dem Artwork: ohne Verbindung liegt die Karte **verdeckt** im Gras statt als leeres Rechteck mit
Ladetext. Das ist gleichzeitig der Zustand »noch nicht aufgedeckt«, den der Sand-Kampf braucht.

**Nachgezogen:** das Bild bekommt 4,5 % Rand, damit es die eigene Kontur nicht zudeckt. Formatfüllend
sah man nur die harte Schnittkante des PDF — die Tuschelinie ist hier aber nicht Zierde, sondern die
**Zonengrenze, an der die Aggro hängen wird**. Was das Spiel als Regel benutzt, muss man sehen.

### Als nächstes, aus Georgs Briefing (noch nicht gebaut)
Die Kartenzone als Kampf, in dieser Reihenfolge:
1. **Ein Card-Owner** (das Schwein am Bauernhof, rechteckiges Zonenfeld) — `E` **oder** das
   Überschreiten der Ink-Outline zieht **100 % Aggro**.
2. **Sand als Verschluss:** Partikel bedecken die Karte vor dem Kampf fast vollständig und werden
   durch den Kampf mit plausibler Kinetik zerstäubt — die Karte wird durch Kämpfen sichtbar.
3. **Win-Animation** nach dem Besiegen des Owners (»juicy«).
4. **BLÖDSINN!-Animation** wenn der Held down und gefreezt ist, mit »Stay fluffy«-Knopf →
   Revive am Friedhof.
5. **Später:** Mob-Wellen als Aufskalierung; ein Gebäude/Anker (Turm, Truhe, Stein, Busch) mit der
   Kartenrückseite irregulär schräg darunter.

## V9-B3b · 2026-08-08 · lesbar gemacht: drei Befunde aus der Abnahme

Der Reader war mechanisch fertig und **an der gebauten Stelle nicht lesbar** — Lesbarkeit ist aber
der ganze Zweck des Objekts. Drei belegte Defekte, alle behoben:

**1. Die Beschriftung lag im Streifen, in dem die Stadt steht.** Sie saß unter dem Blatt bei
`y+h+TILE*0.75`. Dort steht der Marktplatz (ty 34) und Requisiten auf ty 33,9…35,3 — und Gebäude
zeichnen **zwei Felder nach oben von ihrer Basis**. Vom Titel war »…Y PARTY« übrig, hinter einem
Brunnen. Das Label sitzt jetzt **über der Oberkante**, auf einem Papierstreifen mit Tuschelinie
darunter: Text auf Gras liest niemand.

**2. Die Kamera hing am Helden, also lag die halbe Seite außerhalb.** Wer auf der unteren
Kartenreihe stand, schob Oberkante und Label aus dem Bild und die obere Reihe unter das HUD.
Zwei Änderungen, beide an vorhandenen Mechaniken statt an neuen:
- **Auf dem Blatt zielt die Kamera auf das Blatt**, nicht auf die Führungsfigur — gleiche Dämpfung,
  kein Schnitt, **kein zweiter Kamera-Eigentümer** (die Lehre aus S73). Beim Lesen hält die Kamera
  still, das ist auch die richtige Regie. Gemessen: `cam` = Blattmitte 7360,1920 exakt.
- **Auf dem Blatt gehört der Bildschirm dem Blatt:** `this.minimal` wie bei Tab, die eigene Wahl des
  Spielers wird gemerkt und beim Verlassen zurückgegeben. Kein zweiter Weg zum HUD.

**3. Die Quadranten-Zuordnung war geraten.** Sie rechnete auf dem Blattrechteck
(`(hx-R.x)/R.cw`) und ignorierte, dass die gedruckte Seite einen Rand und zwischen den Karten einen
Gutter hat: am Blattrand stand man auf »einer Karte«, obwohl man auf dem Seitenrand stand.
`OW_ART.meta()` liefert das Raster längst — jetzt wird es benutzt. Neu: `readerCells(R)` ist
**eine** Geometrie für Treffer UND Hervorhebung (vorher zwei Rechnungen, die auseinanderlaufen
konnten). Gemessen bei Seite 10: vier Zellen 267×157 px auf 32/341 × 31/196 — Hervorhebung sitzt
auf der gedruckten Kartenkante, der Seitenrand wählt nichts.
Das war wörtlich die Falle aus CLAUDE.md: *»ein Kachelindex, den man nicht am Blatt geprüft hat,
ist geraten«* — hier war es ein Zellraster, und es stimmte nur zufällig.

**Nicht angefasst, weil geprüft und in Ordnung:** Blättern über die Trittsteine (10 → 11 → 10 mit
korrektem Nachladen und greifender Sperre), Tusche aus `kfb-ink-canon.js` über `OW_CARD.canon`,
PDF-Weg nach dem Vertrag aus `cardbuilder/kfb-card-builder.js`. Kosten des Blattes: ~4,5 ms je Bild
im Ausschnitt, außerhalb nicht messbar.

## V9-B3 · 2026-08-08 · der PDF-Viewer liegt im Terrain, der Charakter bedient ihn

**Georgs Befund, wörtlich:** »ist dir überhaupt klar, was ich mit in-game-in-terrain-PDF-card-viewer
meine?! sicherlich nicht ein lightbox-slice ohne terrain-bezug«. Er hatte recht, und die Antwort stand
seit dem 6.8. verbindlich im Masterplan **§3.2**: *»Die Zone ist die Kartensilhouette … der begehbare
Boden ist das Kartenbild.«* Ich hatte in V9-B2 ein Overlay auf eine Taste gelegt — technisch die
richtige Pipeline, an der falschen Stelle im Spiel. **Die Lehre gehört zu den bezahlten Fallen:
eine Pipeline ist keine Mechanik. Wo etwas im Spiel steht, ist die Hälfte der Arbeit.**

**Was jetzt steht.** Ein Blatt **im Gras**, 10×6 Felder (640×384 px), die echte Deck-Seite als 2×2 —
so wie sie aus dem Drucker kommt. Kanon-Tusche (`kfb-ink-canon`, Preset `card`) als Rand, Papierton
darunter, das Seitenbild mittig eingelegt (`fitCell`, nie `cover`).
**Der Charakter ist der Cursor** — kein Tastendruck, keine Pause, kein Overlay:
- Er steht auf einem Quadranten → **diese Karte hebt sich**, die anderen drei treten in den Schatten,
  der Titel steht als Zeile unter dem Blatt. Reine Ortsabfrage in `stepReader(dt)`.
- **Zwei Trittsteine** links und rechts (Tuschekasten, Preset `chip`, mit Pfeil) blättern die Seite.
  Gesperrt bis zum Verlassen des Steins — das Verlassen ist das Ereignis, nicht eine Uhr; sonst
  blättert ein Frame 60 Seiten weiter. Am Anfang und Ende des Hefts wird der Stein blass und stumm.
Abnahme über den echten Bedienweg: Seite 10 von 15, Deck `trust_and_betrayal`, Held auf dem
rechten unteren Quadranten → »NASTY PARTY« hervorgehoben, die drei Nachbarkarten gedimmt.

**Warum Georg nichts fand** (zweiter Befund: »ich laufe vom strand herum und finde weder mobs noch
wege noch sprites«). Zwei Ursachen, eine davon meine:
1. Das Blatt hing zuerst am **Spawnpunkt**. Ein Spielstand setzt den Helden aber dorthin, wo er
   aufgehört hat — bei Georg an den Strand, 40+ Felder von der Stadt. Anker ist jetzt der
   **Marktplatz** (§3.3: »every road starts here«). Gemessen: @96,38, das Blatt liegt im Wegenetz.
2. Die Insel ist 240×180 Felder und alles Gebaute (Wege, Gebäude, Reader) steht **in der Stadt**;
   die Mobs stehen in den sechs Zonen. Wer am Strand aufwacht, sieht leeres Gras. Das ist kein Bug,
   sondern eine fehlende Anreise — **M** (Übersichtskarte, Fast Travel) ist heute der einzige Weg
   dorthin. Offen und benannt: die Welt braucht einen Zeiger auf die Stadt, nicht nur auf die
   nächste Zone.

**Zurückgenommen:** die Taste **V** (Lightbox-Vorschau aus V9-B2) ist weg. Der Reveal bleibt dort,
wo er Kanon ist — an der Lootbox (§Lootbox, »Portal-Auflösung statt eckigem Panel«).

**Behoben:** `card-grids.json` wurde gegen `document.baseURI` aufgelöst, also gegen die
Projektwurzel statt gegen den Modulordner. Das Ergebnis war eine 404-Seite und
`JSON.parse: unexpected keyword`. Der Modulpfad wird jetzt beim Laden aus `document.currentScript`
festgehalten. **Ein relativer Pfad in einem Modul ist nicht relativ zum Modul** — das kostet jedes
Mal dieselbe halbe Stunde.

**`OW_ART` ist auf art-v1.1:** `pageOf(packId,num)` liefert die ganze Seite, `meta()` Cover-Offset
und Seitenzahl, `cardAt`/`pageFor` sind die beiden Richtungen des Adress-Vertrags an **einer** Stelle.

**Offen:** die Zone selbst ist noch das v1-Rechteck. §3.2 will die **Kartensilhouette als Grundriss**
(unregelmäßiger Schnittrand, Ink-Outline, Gutter außen, Pixel-Brücke als Zugang). Der Reader beweist
jetzt, dass Blatt und Tusche im Terrain tragen — der Schritt von »Blatt liegt im Gras« zu »Blatt IST
der Boden der Arena« ist der nächste, nicht ein anderer.

## V9-B1/B2 · 2026-08-08 · sechs Biome, und die Karte zeigt das PDF

**V9-B1 — sechs Welten statt drei.** `BIOMES` enthielt fünf Einträge mit drei echten Werten
(`camp,camp,wilds,wilds,cave`) und wurde je Zone **gewürfelt**. Eine Ziehung mit Zurücklegen kann
keine Vielfalt garantieren: gemessen zeigten sechs Zonen `camp · camp · wilds · cave · camp · wilds`
— drei Biome, zwei davon doppelt, zwei Böden gleich. Georgs Befund »ich sehe keine sechs Welten« war
also kein Bodenfehler, sondern ein Würfelfehler.
Jetzt trägt der **Zonenindex** das Biom (`BIOMES[zi%6]`), der `zseed` nur noch die Bodenvariante.
Abnahme über den echten Bedienweg: `camp/grass · wilds/wilds · cave/highland · frost/winter ·
shore/waste · dungeon/paper` — sechs Biome, sechs verschiedene Böden.
Neu bestückt aus dem vorhandenen Katalog, ohne einen einzigen neuen Asset-Ladevorgang:
`frost` (bear+turtle+spider) und `shore` (paddle_shark+pig+torch_goblin_ep); `dungeon` bekommt
`paper` als Boden (Papier-Verlies, Kanon). Gemessen: **11 Mob-Typen gleichzeitig**, 25 Mobs.
Ranged bleibt draußen (4 im Katalog) — Projektile sind ihr eigener Slice, §8.

**V9-B2 — das Artwork aus dem Deck-PDF, in 2D.** `card-ink-2d.js` schrieb selbst, das Artwork sei
»ein eigener Slice«. Der ist jetzt da, und zwar **ohne zweiten Builder**: die 3D-SSOT
(`cardbuilder/kfb-card-builder.js`) verlangt `THREE` und liefert eine `THREE.Group` — im Overworld
gibt es nur ein Canvas. `overworld/card-art-2d.js` (art-v1.0) ist der schmale Ausschnitt, der ohne
3D auskommt, mit **demselben Vertrag Zeile für Zeile**: Seite = `coverOffset+1+floor((n-1)/4)`,
Quadrant = `(n-1)%4`, Zelle = `(w−gapX)/2 × (h−gapY)/2` — **sechs Rasterzahlen, nicht vier**.
Der Wachhund gegen hängendes pdf.js (Tab inaktiv → Promise settelt nie) steht von Anfang an drin;
im 3D-Builder war er ein bezahlter Fehler.
Blatt und Tusche bleiben, wo sie hingehören: `OW_CARD.paintArt(sheet, art)` malt in **dasselbe**
Canvas, das `draw()` geliefert hat (die Enthüllung zeichnet ihre Quelle jeden Frame neu, also
erscheint das Bild von selbst), Reihenfolge Kontur → Clip → Papier → Bild → Tusche, Kontur aus
demselben `seed`. Mittig eingelegt, **nie `cover`** (Kanon `fitCell`).
Das Blatt liegt jetzt **querformat** (`portrait:false`): die echte Cut-&-Play-Karte liegt, ein
hochkant gestelltes Blatt hätte für das Bild nur ein Band in der Mitte übrig.
Abnahme: Deck `trust_and_betrayal`, Karte #42 »POISONED CHALICE« — Titel, Illustration, POWER- und
LORE-Zeile vollständig, keine Nachbarzelle im Bild. `OW_ART.stats` = `{pages:1, crops:1, misses:0}`.
**Nicht abgewartet:** das Textblatt ist sofort da, das Bild kommt hinein, wenn es kommt; fällt es
aus, bleibt das Textblatt stehen (auf »läuft« gaten, nie auf »existiert«).

**Prüfweg `V`** — zeigt der Reihe nach die Karten der eigenen Zonen, ohne hinzulaufen. Sonst müsste
man erst eine Zone räumen und eine Truhe finden, um ein Blatt zu sehen. Kein Spielzug: kein Fund,
kein XP, kein Diary, kein Save. (`C` war belegt — ein Eigentümer je Taste, V8-S4.)

**Offen, eine Zahl:** `trust_and_betrayal` steht nicht in `card-grids.json` und läuft auf dem
benannten Rückfallwert (5 % Rand, gapX 0,065) — geraten, und die Konsole sagt es. Bei dieser Karte
sitzt es gut, das ist Glück und kein Beweis. `tools/cardgrid-pick.html`, 20 Sekunden.
Ebenso ungemessen: `sonic_slaughterhouse` (Altlast aus S61).

## V9-P1 — Gemessen: Textur und Ink sind unschuldig, der Shader vergiftet die Leinwand (2026-08-08)

Georgs Fragen: *»ink outline mal auskommentieren? was ist sonst verdächtig? sonst erstmal textur
raus?«* — Antwort auf alle drei: **nein**, und zwar mit Zahlen. Gemessen über Wrapper um die
Zeichenphasen, im laufenden Spiel, Zoom 1, ungestört (keine Screenshots, keine Abfragen während der
Messung).

### Ungestört, Shader AUS — das Spiel ist schnell

    Bildzeit           20,3 ms   49,3 fps
    terrain.draw        0,04 ms je Bild   (25 ms auf 592 Bilder)
    terrain.drawInk     0,06 ms je Bild   (33 ms auf 592 Bilder)
    terrain.drawWater   0,02 ms je Bild
    terrain.fillZone    0,02 ms je Bild
    drawUnit            0,09 ms je Bild   (15 392 Aufrufe)

**Die Ink-Outline auskommentieren würde 0,06 ms bringen.** Die Textur ebenso wenig: der gesamte
Bodenweg kostet unter einer Zehntel-Millisekunde je Bild — er ist gecacht und tut, was er soll.

### Ungestört, Shader AN — dieselben Phasen, andere Welt

    Bildzeit          108,2 ms    9,2 fps
    terrain.draw       77,23 ms je Bild   ← DIESELBE Funktion, die ohne Shader 0,04 ms braucht
    terrain.drawWater   9,69 ms je Bild   ← vorher 0,02 ms
    shade.draw         10,15 ms je Bild
    terrain.clipWater   0,07 ms je Bild   ← mein Küsten-Clip ist NICHT das Problem
    terrain.drawInk     0,17 ms je Bild

**Der Befund:** die Kosten liegen nicht im Shader (10 ms), sondern in **allem, was danach gezeichnet
wird**. `terrain.draw` wird um den Faktor **1900** langsamer, ohne selbst verändert worden zu sein.

**Die Ursache, so weit belegt:** der Shader legt eine bildschirmgroße Fläche mit
`globalCompositeOperation: overlay` über die Leinwand. Ein Composite-Modus über die ganze Fläche
zieht die Leinwand aus dem schnellen Pfad; jede folgende Zeichenoperation zahlt dann. Dass die
Nachbarn (`draw`, `drawWater`) explodieren und der Verursacher billig bleibt, ist genau die
Signatur dieses Effekts. **Der zweite Teil (welcher Pfad genau) ist nicht gemessen und wird nicht
behauptet.**

### Was das für den geparkten Waber bedeutet

Georg (8.8.): *»dein shader ist scheiße & schlampig gebaut«* — die Messung gibt ihm recht, und sie
nennt den Baufehler: **eine bildschirmgroße Auflage mit Composite-Modus je Bild.** Wenn der Waber
zurückkommt, dann nicht so:

- Die Tönung gehört **in die gebackene Bodenkachel**, nicht als Auflage darüber — genau das, was
  Georg von Anfang an gesagt hat (»festbacken«). Gebacken kostet sie null je Bild.
- Bewegung darf **nur dort** liegen, wo sie hingehört: auf dem Wasser, als kleine Fläche, ohne
  Composite-Modus über Land.
- **Regel für alles Weitere:** kein `globalCompositeOperation` über eine bildschirmgroße Fläche je
  Bild. Wer eine ganze Leinwand mischen will, backt das Ergebnis.

### Und eine Korrektur an V9-W1

Die dort notierten »102,2 ms Grundlast (shade off)« sind **falsch**. Sie entstanden, während ich mit
Screenshots und Abfragen auf die Seite eingeschlagen habe. Ungestört sind es 20,3 ms. Die Zahl war
echt gemessen — nur nicht an dem Zustand, den sie beschreiben sollte. **Auch eine ehrliche Uhr misst
falsch, wenn man während der Messung im Bild steht.**

Damit ist auch der Satz »die 102 ms sind älter als dieser Sprint« zurückgenommen: es gibt keine
Grundlast-Krise. Das Spiel läuft mit 49 fps, und der einzige teure Posten war der Shader, der jetzt
aus ist.

**Nicht geändert:** keine Zeile Zeichencode. Dieser Eintrag ist eine Messung, kein Umbau.


## V9-W1 — Kirche und Marktplatz; und die Bildrate war die ganze Zeit gelogen (2026-08-08)

### Der Fehler, der alle Messungen dieses Sprints entwertet hat

`stats.fps` rechnete `1/dt` — und `dt` ist auf 0,05 s geklemmt, damit ein langer Frame die Physik
nicht zerreißt. Die Anzeige meldete also **die Klemme, nicht die Wirklichkeit**: exakt 20,0 fps in
jeder Lage, mit und ohne Shader. Deshalb sah jede Messung gleich aus, und deshalb habe ich vier
Runden lang nicht gesehen, was Georg beim Spielen sofort gesehen hat.

Jetzt wird die **ungeklemmte** Bildzeit geführt (`stats.msFrame`, gleitend) und die Pille zeigt beide
Zahlen. Die erste ehrliche Messung, Zoom 1, über den Tweak umgestellt:

    shade off   102,2 ms   9,8 fps      1365 Sprites · 1341 Deko · 280 Kacheln
    shade on    142,0 ms   7,0 fps      → der Shader kostet ~40 ms
    zoom 0,42   150,4 ms   6,6 fps      1040 Kacheln

**Georgs Urteil war richtig, meine Probe war falsch.** `scraps/shade-probe.html` meldete 0,33 ms je
Bild — auf einer kleinen Leinwand, über zwölf Bilder, ohne Clip. Im Spiel sind es 40 ms: großer
Ausschnitt (Gitter bis 88×60), zwei Schichten, Küsten-Clip. **Eine Messung außerhalb des Spiels ist
keine Messung des Spiels.** Das ist dieselbe Fehlerklasse wie »über den echten Bedienweg testen«,
nur auf die Leinwand angewandt.

**Waber geparkt** (Georg): `shade` steht auf `off`, der v8-Wasser-Shader ist wieder Standard. Der
Modus bleibt wählbar, das Modul bleibt liegen — Backlog, nicht gelöscht.

**Was NICHT gemessen ist:** woher die 102 ms Grundlast kommen. Sprites sind geculled (Zeile 3356,
geprüft), also ist es nicht die Deko-Menge. Verdacht auf `OW_TERRAIN.draw` (Vektorkonturen je Bild)
oder das Relief — **Verdacht, keine Aussage.** Wer hier eine Ursache in den Changelog schreibt, ohne
je Phase gemessen zu haben, wiederholt den Fehler vom 7.8.

### W1 · Die Königsstadt (gebaut, per Screenshot belegt)

Der Kranz stand schon (Wirtshaus · Turm · Archiv · Arena · Friedhof · Garten). Georgs Liste nennt
zusätzlich Kirche und Marktplatz — **acht Orte statt sechs**:

- **Marktplatz** (neu): existierte schon als Wegeknoten, war aber unsichtbar — ein Ort, den man nicht
  sieht, ist kein Ort. Jetzt zwei versetzte Stände mit einer Lücke, durch die der Weg läuft (drei
  gleich große Stände in einer Reihe wären eine Mauer). Und der Knoten liegt **auf** ihm statt
  daneben: gemessen `hub {115,35}` = Markttür. »Jede Straße beginnt hier« ist damit wahr, nicht Deko.
- **Kirche** (neu): bekommt das Kloster — das einzige sakrale Blatt im Pack gehört an den sakralen
  Ort. Das **Archiv** zieht in ein Stadthaus (House2): ein Archiv ist ein Haus voller Papier, keine
  Kapelle.
- **Friedhof = Respawn, als Standard.** Bisher musste man ihn per `E` setzen; jetzt zeigt der Spawn
  beim Weltbau dorthin (gemessen: `spawn` und Friedhofstür identisch, 6112,3014). Das `E`-Setzen
  bleibt — wer ihn verlegen will, kann das (jeder Auftrag braucht einen Rückweg). Hinweis geändert:
  »you come back here«.

    Abnahme   8 Orte · Knoten auf dem Markt · 169 Wegfelder · Respawn = Friedhofstür
    Bilder    scraps/01..03-w1-stadt.png (Markt mit Ständen · Kirche · Friedhof, je mit Prompt)

### Zwei Befunde des Verifiers, beide behoben

**`OW_SHADE.stats` war global**, und die Statuszeile klebte den Namen der Terrain-Palette davor. Weil
die Schichten gestaffelt in verschiedenen Bildern rechnen, stand dort je Bild die Zahl der anderen
Schicht unter dem falschen Namen. Jetzt `stats.pro[name]` je Palette und zwei Zeilen im Runner. Das
war dieselbe Zeile, in der eine Runde vorher der erfundene `²`-Exponent saß — **eine Zeile, die zweimal
gelogen hat, ist ein Hinweis auf die Bauart, nicht auf den Tippfehler.**

**Dateien:** `overworld/overworld-game-v9.js` (TOWN +2, Markt-Knoten, Respawn, `msFrame`, zwei
Statuszeilen) · `overworld/skyshade-2d.js` (Statistik je Palette, `API.zeile`) ·
`KFB Overworld v9.dc.html` (`shade` Standard `off`) · `docs/ONBOARDING_v10.md`.


## V9-T2 — Der Waber-Shader liegt, und zwei Fehler waren meine (2026-08-08)

`overworld/skyshade-2d.js` (shade-v1.0): der Skydome aus `terrain-v12/skydome-shader.js` (Modus S),
auf Canvas 2D portiert. **Dieselbe Mathematik, andere Abtastung** — dort ein Fragment-Shader je
Bildpunkt, hier ein grobes Gitter, das geglättet hochskaliert wird: Vektor-Warp aus drei fbm-Kanälen,
Feld plus Detail, Rampe `smoothstep(0.15,0.62)` über drei Farben. Ein Skydome ist genau die Art Bild,
die man grob rechnen und weich vergrößern darf.

Zwei Schichten je Bild, nicht sieben: **eine** Terrain-Palette (die des Bioms, in dem der Held steht —
die Welt verfärbt sich beim Reisen, statt je Fläche zu springen) und **eine** Fluid-Palette. Über Land
gedämpft (`overlay`), über Wasser deckend: dort IST der Shader das Material.

### Gemessen, über den echten Bedienweg (Tweaks umgestellt, nicht per API)

    Rechnung        1–2 ms   (Gitter 33×29 bis 87×60, je Ausschnitt und Maßstab)
    Neu gerechnet   jedes 3. Bild, gestaffelt: höchstens EINE Schicht je Bild
    clipWater       true am echten paintOpt (key w7_240x180, 240×180, TILE 64)
    terrain-paint   tp-v4.4

**Belegt per Screenshot** (`scraps/01..04-v9-fluid2.png`): `fluid: wasser` dunkles Türkis mit
Struktur → `bubblegum` rosa → `oel` fast schwarz → `shade: off` flaches Türkis. Vier Bilder, vier
sichtbare Zustände, Küste in allen vier glatt.

**Nicht belegt:** die Bildrate. Mein Rahmen zeigt konstant 20 fps mit UND ohne Shader — das ist eine
gedrosselte Vorschau, keine Messung. Die Zahl fehlt und wird nicht geschätzt.

### Die vier Fehler dieser Runde, drei davon meine

**(1) Das Fluid lag als Kachel-Treppe über der Küste** (Georgs Screenshot). Ich hatte auf
`land[]`-Rechtecke geclippt, während die Küste eine geglättete Vektorkontur ist — **zwei Wahrheiten
für dieselbe Kante.** `terrain-paint.js` exportiert jetzt `clipWater`/`clipLand`, die denselben
gecachten `Path2D` benutzen wie `drawWater` und die Feder. Kostet nichts extra.

**(2) Das Wasser war flach — und der Shader war nicht schuld.** Gemessen am Bildpunkt: er zeichnete
genau den Türkis, den man sah (43,147,169). Der Fehler war der **Maßstab**: ein Merkmal 1400
Weltpixel = 22 Felder breit, der sichtbare Wasserstreifen drei Felder hoch. Man sah einen einzigen
Wert. Fluide haben jetzt ihren eigenen Maßstab (300–420 px, fünf bis sieben Felder) und mehr
Kontrast; der Abtastschritt folgt dem Maßstab (rund 14 Punkte je Merkmal), sonst zerfällt das
Morphen in Karos. **Merke: »flach« ist eine Aussage über den Maßstab, nicht über die Schicht.**

**(3) Das Gitter klebte am Bildschirm statt an der Welt.** Die erste Fassung rechnete über den
aktuellen Ausschnitt und blittete zwei von drei Bildern dasselbe kleine Bild in den inzwischen
verschobenen Ausschnitt: das Muster zog mit der Kamera mit und sprang beim Neurechnen zurück — eine
Tapete vor der Welt. Jetzt ist der Abtastabstand eine **Weltlänge**, der Ursprung darauf gerastert,
und geblittet wird an dem Weltort, an dem gerechnet wurde. Dazu die Zuordnung: Punkt i sitzt auf
`qx+i*s`, also Zielbreite `gw*s` und Ursprung eine halbe Zelle zurück (vorher ein halber Zellversatz
und 1,7 % Streckung).

**(4) Die Staffelung war geraten.** Der Versatz kam aus der Zeichensumme des Palettennamens — und
die ist Zufall: `hof` und `oel` liegen beide auf 2. Bei diesen Paaren rechneten BEIDE Gitter im
selben Bild, also genau die doppelte Spitze, die die Staffelung verhindern sollte. Jetzt eine
laufende Nummer je Schicht; auch der Erstaufbau wartet auf seinen Takt, sonst ist der teuerste
Moment der erste, den der Spieler sieht.

**Außerdem gegatet:** der Shader liegt im Zeichenpfad. Wirft er dort, stirbt die Schleife und der
Bildschirm ist weiß. Jetzt: einmal melden, abschalten, Spiel läuft weiter.

**Dateien:** `overworld/skyshade-2d.js` (neu) · `overworld/terrain-paint.js` (tp-v4.4, Clip als
Dienst) · `overworld/overworld-game-v9.js` (Tweaks `shade`, `fluid`) · `KFB Overworld v9.dc.html` ·
`scraps/v9-diagnose.html` (netzfreie Prüfseite) · `docs/MASTERPLAN_overworld.md` §36/§37 ·
`KFB Masterplan.dc.html` (Leser über die Datei, keine Kopie).


## V9-T1 VERWORFEN — Bauart Nr. 10 war Bauart Nr. 9 mit anderen Farben (2026-08-08)

Georgs Befund, wörtlich: *»exakt der gleiche AI Slop mit exakt den gleichen Anti-Pattern aus WS0 —
und einfach umgefärbt für Biome«.* Er trifft, und der Fehler ist eindeutig zuzuordnen.

**Sein Auftrag war:** die Texturen, die schon gut sind, **festbacken** in sechs Terrains, dazu ein
Shader zum Atmen, ein paar runde Fraktalmuster und ein paar geschwungene Ink-Linien. Ausdrücklich
*ohne* Vektor- und Parameterrechner.

**Gebaut habe ich:** den WS0-Generator, portiert, mit einer Gewichtung je Biom davor. Also genau die
Reihe, die schon achtmal durchgefallen ist — Bänder statt Ovale, aber dasselbe Verfahren: *ein
Grundelement erzeugen und vervielfältigen.* Die eigene Anti-Pattern-Liste steht in derselben Datei,
Punkt 1, und ich habe zwei Befunde daran abgearbeitet (Streifung, Tarnmuster), statt zu merken, dass
die **Bauart** das Problem ist und nicht ihre Parameter.

**Die Fehlerklasse, die neu ist und aufgeschrieben gehört:** *ich habe eine vorhandene, laufende
Lösung gegen einen Generator getauscht, den ich selbst als gescheitert dokumentiert hatte.* Zwei
Runden vorher stand hier, dass 382 ms je Eimer zu teuer sind — und meine Antwort darauf war, denselben
Generator schneller zu machen statt ihn zu ersetzen. **Ein Werkzeug, das man aus der eigenen
Fehlerliste holt, prüft man gegen die Liste, nicht gegen seine Laufzeit.**

`KFB Terrain Backstube.dc.html` liegt als `scraps/VERWORFEN_Terrain Backstube (Bandbauart).dc.html.txt`.
`overworld/ground-band.js` bleibt liegen (Modus `band` ist nicht Standard), wird aber nicht
weitergebaut.

**Was stattdessen gilt** (Georgs Transkript vom 8.8.): die Texturen aus `KFB Texture Lab.dc.html` —
seine eigene Auswahl vom 7.8., echte analoge Blätter — je Biom festgebacken. Darüber drei dünne
Schichten: Atem-Shader, seltene runde Retro-Muster, hell-farbige Ink-Schwünge. Der Rest des Sprints
ist die **Welt**: Schloss im Zentrum mit Marktplatz, Wirtshaus, Kirche, Graveyard · sechs Biome ·
Sternwege mit streunenden Mobs und Ressourcen-Microstories · sechs Kartenzonen mit Boss · Regen,
Nebel, Fog of War, Schnee, Tag/Nacht als plane Ebenen darüber · alle drei Tiny-Swords-Repos verbaut.


## V9-T1 — Die Backstube: der Generator läuft einmal, nicht je Bild (2026-08-08)

Georgs Schnitt vom 8.8. umgesetzt (`docs/SPRINT_overworld-mvp.md`): die Bandbauart wird vom
Laufzeit-Generator zum **Werkzeug**. `KFB Terrain Backstube.dc.html` backt sieben nahtlose Blätter
(sechs Biome plus den Sandsaum, der kein Biom ist, sondern eine Rolle) zu 1024 px.

**Eine Feder, zwei Verwendungen.** Die Backstube malt mit `OW_BAND.mal` — denselben Strichen, die
der Boden im Spiel benutzt. Ein zweiter Satz derselben Regeln wäre eine zweite Implementierung, und
die laufen beim ersten Fork auseinander (Lehre S13b).

**Nahtlos ist konstruiert, nicht nachbearbeitet.** Jeder Strich wird neunfach gezeichnet, um
± Blattbreite versetzt. Was rechts hinausläuft, kommt links herein; weil die Verschiebung ein
Vielfaches der Blattbreite ist, passt die Kante per Konstruktion. Zwei Feinheiten, die sonst eine
Naht öffnen:

- **Tupfer brauchen den Torus auch.** Ohne ihn ist die Schwammdichte am Rand niedriger, und eine
  gekachelte Fläche zeigt ein Gitter aus lichten Fugen.
- **`trocken` zieht selbst am Zufallsstrom.** Jede der neun Kopien braucht einen FRISCHEN Strom mit
  demselben Keim — sonst zeichnen die neun Kopien neun verschiedene Spuren, und die Naht klafft
  genau dort, wo sie zusammenpassen müsste.

### Zwei Befunde aus der ersten Abnahme, beide echt und beide behoben

1. **Senkrechte Streifung.** Das Schwungfeld variiert über ~2400 px. In einem Blatt von 1024 ist die
   Richtung damit fast konstant, und drei breite Züge werden parallele Latten. Im Weltmaßstab ist das
   der gewollte Schwung, im Blattmaßstab ein Muster. Das Blatt spreizt die Richtung jetzt selbst
   (`streu` 2,2–3,4) und legt **jeden zweiten Zug quer** — die Bahnen kreuzen sich statt zu stapeln.
2. **Tarnmuster.** Die Nebenfamilien nahmen Fläche wie die Hauptfamilie. Gewichtung heißt aber: die
   dominante Familie trägt die **Fläche**, die Nebenfamilien kommen als kleinere Einsprengsel. Die
   großen Lagen nehmen jetzt nur die dominante Familie und nur drei benachbarte Wertstufen — die
   Sprünge über die ganze Leiter waren die Flecktarnung.

**Nicht im Blatt: Feldbänder und die lange KFB-Tusche.** Beide arbeiten auf Weltmaßstab und würden
sich in 1024 px als Muster wiederholen — also als genau das Grundelement, das die Bandbauart
abgeschafft hat. Sie gehören zur Laufzeit: groß, selten, über mehrere Kacheln.

**Abnahme im Werkzeug selbst**, nicht als Behauptung: Farbspanne über den mittleren Bildviertel
(ein flaches Blatt hat Spanne 0 und ist der Fehlschlag aus V9-S1, den man sonst erst in der
gekachelten Welt sieht), Nahtprobe 2×2 mit zwei Haarmarken am Stoß (sie zeigen, WO man sucht — wer
die Kante nur wegen der Marke findet, hat keinen Befund), Backzeit je Blatt, Gewichtung als Balken.

**Offen:** die sieben PNGs müssen über »Alle sieben« + »PNG holen« nach `media/2D/terrain/` ins
Repo — der Standalone hat kein `./assets/` neben sich. Bis dahin kann T2 die Blätter nicht laden.

**Dateien:** `KFB Terrain Backstube.dc.html` (neu) · `overworld/ground-band.js` (`API.mal`
exportiert) · `docs/MASTERPLAN_overworld.md` §36 (Tusche gebacken gegen Gummi als Arena).


## V9-S1 — Das Band läuft, und die Messung beendet den Sprint (2026-08-08)

Die neunte Bauart aus der WS0-Bodenwerkstatt ist portiert: `overworld/ground-band.js` (band-v1.0).
Kein Grundelement mehr — die Fläche ist ein quantisiertes Wertefeld, die Kontur eine Summe von fünf
Wellen über der Bogenlänge, und die Wellenlänge läuft in **Bandbreiten** statt in Objektlängen.

**Neu gegenüber WS0**, aus Georgs zwei Fragerunden vom 8.8.:

- **Sechs Biome als Gewichtung, nicht als Palette.** Fünf Terrain-Familien (Gras · Sand · Fels ·
  Moos · Staub); jedes Biom enthält alle, nur anders gewichtet. Der Sandsaum ist kein Biom, sondern
  eine **Rolle** (`__saum`) — er muss an jeder Küste derselbe bleiben, sonst wandert die Küste mit
  der Zone.
- **Zwei Amplituden, ein Feld** (§28.3): `OW_BAND.waberDx(y,t,faktor)`. Boden 4,5 px bei Zoom 1
  (»deutlich wahrnehmbar«), Requisiten ×0,45, Einheiten und Gebäude gar nicht. Ein wabernder Boden
  unter starr stehenden Bäumen liest sich als Fehler; wabernde Einheiten lesen sich als Bug.
- **Das Fraktal verzerrt, es färbt nicht.** Die Verschiebung kommt aus dem domänenverzerrten Feld,
  die Farbigkeit bleibt in der Familie plus EIN komplementärer Akzent. Volle Sättigung auf dem Boden
  frisst die Einheiten — genau das »Absuppen«, das verhindert werden soll.
- **Dritter Terrain-Modus, kein Ersatz.** `band` benutzt denselben Weg wie `paint`: Silhouette,
  Relief, Wasser und Küstentusche bleiben bei OW_TERRAIN. Wer den Boden ersetzt, baut Sandsaum,
  Schaum und Klippenfront nach — und zwei Implementierungen derselben Regel laufen auseinander (S13b).

### Gemessen (Georgs Ansicht, Leinwand 1848×1080)

    Eimer gebacken    60 · Warteschlange danach 0
    Backzeit          382 ms Mittel je Eimer (460 px bei halber Auflösung)
    Streifenblits     112 je Bild für das Wabern  ← billig, nicht das Problem
    bis vollständig   ~34 s vom Umschalten bis zur leeren Schlange
    Farbspanne        184,142,104 auf der Landfläche  ← Beleg, dass das Band wirklich liegt

### Berichtigung noch in derselben Runde: die erste Messung war an einem flachen Boden

Der erste Lauf meldete 386 ms je Eimer und »~23 s«. Die Abnahme hat nachgewiesen, dass dabei
**gar kein Band zu sehen war**: Farbspanne 0,0,0 auf der Landfläche, reine Ersatzfüllung, obwohl
alle Eimer gebacken waren.

**Ursache in `API.floor`:** die Eimerfläche wurde nur bei geändertem Kamera-Ursprung neu aufgebaut.
Beim ersten Bild ist noch kein Eimer fertig, also wurde die flache Grundton-Füllung geschrieben
**und gecacht**. `f.fertig=false` wurde gesetzt — und **nie gelesen**. Solange der Held stillsteht
(genau der Zustand nach dem Laden), änderte sich der Ursprung nie: der Boden blieb für immer flach.
Das ist wörtlich die Fehlerklasse, die im Kopf dieses Moduls zitiert wird — *auf »läuft« gaten, nie
auf »existiert«*. Der Zustand war da, er wurde nur nicht gelesen.

Behoben durch `||f.fertig===false` in der Neuaufbau-Bedingung. **Die Zahlen oben sind die nach dem
Fix**; die 386 ms/23 s aus dem ersten Lauf sind ungültig. Ein Changelog, der eine Zahl aus einem
kaputten Lauf zitiert, behauptet etwas, was der Code nicht tut (Falle Nr. 1 aus
`docs/HANDOVER_coworker_v5.1.md`).

An der Schlussfolgerung ändert sich nichts, sie wird stärker: 382 ms je Eimer und eine halbe Minute
bis zum vollständigen Bild sind zu teuer zum **Erzeugen**.

> ⚠ **`band` ist ein Werkstatt-Modus, kein Spielmodus.** Er steht im Tweaks-Panel, blockiert aber
> beim Umschalten sekundenlang. Solange die Backstube (Slice T1) fehlt, ist `paint` der Standard.

**Das ist der Befund, der den Sprint beendet:** die Bauart ist nicht zu teuer zum Anschauen, sie ist
zu teuer zum **Erzeugen**. Ein Generator, der eine halbe Minute braucht, ist dieselbe Fehlerklasse wie
das Relief mit seinen 36 Sekunden (V8-S3b) — nur an einer anderen Stelle.

Verdächtig ist die Ebene `feld`: ~54 000 Feldanfragen je Eimer, je Anfrage 21 Oktaven. **Gerechnet,
nicht gemessen** — wer das als Ursache notiert, ohne die Ebene einzeln zu messen, wiederholt den
Fehler vom 7.8. Die Konsequenz hängt aber nicht daran: eine Fläche, die **einmal gebacken** und dann
gekachelt wird, kostet zur Laufzeit ein `drawImage`. Der teuerste Generator ist gratis, wenn er nicht
läuft, während man spielt.

**Deshalb steht v9 auf `terrain: paint`** (der v8-Look). `band` bleibt wählbar — ein Vergleich, den
man nicht mehr ziehen kann, ist keiner.

**Weiter geht es nach `docs/SPRINT_overworld-mvp.md`** (Georgs Schnitt vom 8.8., »Baked + Alive«):
das Band wandert in eine **Backstube**, die sechs nahtlose Blätter abliefert; die Lebendigkeit kommt
danach aus Wabern, seltenen Rundmustern, Ink-Bahnen, Mobs, Wetter und Tag/Nacht.

**Dateien:** `overworld/ground-band.js` (neu) · `overworld/overworld-game-v9.js` (Fork, Modus `band`)
· `KFB Overworld v9.dc.html` (Tweaks `terrain`/`waber`/`waberProps`) · `docs/SPRINT_overworld-mvp.md`
(neu) · `scraps/WS0_Boden-Konzept.dc.html.txt` (Lesekopie der Werkstatt).

## V8-S3b — Das Relief brauchte 36 Sekunden, in denen der Boden flach blieb (2026-08-08)

**Berichtigung zu V8-S3.** Die Abnahme hat gemessen, was ich nicht gemessen habe: `OW_RELIEF.probe()`
suchte die Zusatzkarten **seriell** über **14 Schreibweisen je Material**, von denen **4 existieren**.
Ein Treffer kommt in 1–2 ms, ein Fehlschlag kostet **347–521 ms**. Kalt hat das Relief damit
**36 006–36 254 ms** gebraucht.

Die Zahlen in V8-S3 (171–535 ms) waren **warm** gemessen — sie unterboten den ersten Lauf um zwei
Größenordnungen. Ich habe den zweiten Lauf für den ersten gehalten.

**Und der Folgeschaden war genau das Symptom, das V8-S3 beheben sollte:** solange `reliefSettled`
false ist, sperrt `tileFor` den Cache. 36 Sekunden lang lief die Welt also **ohne Relief** — flach,
wie vor der Änderung — und backte jede Kachel jedes Bild neu: **640 Backvorgänge gegen 8 im Cache**.
Georgs »die Texturen sind weg« wäre beim Kaltstart wieder richtig gewesen.

### Behoben, zwei Änderungen die zusammengehören

1. **Auf die belegten Namen kürzen.** `_normal.jpg` · `_ao.jpg` · `_roughness.jpg` + `_diffuse.jpg`
   = **4 URLs je Material statt 14**. Die zehn nie treffenden Schreibweisen stehen als `ALT` daneben
   und werden **nur** befragt, wenn die belegten Namen für ein Material leer ausgehen — auf
   *Ergebnis* gaten, nicht auf Verdacht.
2. **Parallel laden.** Ein `Promise.all` über alle Kandidaten, je Art der erste Treffer in
   Listenreihenfolge. Der alte Kommentar (»was nicht lädt, fällt aus — deshalb dürfen es ruhig
   mehrere Schreibweisen sein«) galt **nur** für paralleles Laden; seriell kostet jede ungenutzte
   Schreibweise eine halbe Sekunde.

### Gemessen (rel-v1.3, kalter Lauf)

    URLs je Material     14  →  4
    Relief kalt      36 006  →  1 210 ms          Faktor 29,8
    Kachel-Backen       640  →      8             = imCache, kein verworfener Backvorgang mehr
    ms je Backvorgang  0,42  →  14,13             (echte Bakes, nicht 632 weggeworfene)

**Die Wahl ist identisch** — alle sieben Materialien wie vorher (Ground049A→normal 15,53 ·
forest_ground_05→ao 24,53 · Ground012→normal 20,12 · Ground087→rough 14,18 · Ground037→diffuse 21,30 ·
Ground026→normal 14,45 · Ground071→diffuse 21,15), Kornwerte unverändert (grass 7,34 · wilds 7,93 ·
swamp 10,47), `clay_floor_001` und `Paper004` weiter unter der Schwelle.

### Und die Lehre für jede Messung in diesem Projekt

**Die Startphase war in keiner der fünf Benchmark-Größen enthalten.** Ein Benchmark, der nur den
eingelaufenen Zustand kennt, verschweigt den Zustand, in dem der Spieler ankommt. Neu:
`OW_RELIEF.report()` gibt `firstBuildMs` (Gesamtdauer bis zum letzten Relief) und `probeMs`
(Summe der Netzsuche) heraus, `OW_BENCH` nimmt sie als `start` auf, und `ground-paint` schreibt die
kalte Gesamtdauer ins Log: `[ground] Relief: 7 von 9 · … · gesamt 1210 ms (kalt)`.

**Warm ist nicht kalt** — die Zeile fehlte in den Hausregeln und steht jetzt im Session-Cut.


## V8-S4d — Der Kanon lag lokal und wurde remote geladen (2026-08-08)

**Berichtigung zu V8-S4b und V8-S4c. Beide Einträge behaupteten eine Wirkung, die der Code nicht
hatte** — die Fehlerklasse, die *dieselbe Sitzung* als Falle #1 und #7 aufgeschrieben hat. Gefunden hat
es die Abnahme, nicht ich. Zum achten Mal in vier Nächten.

### Was wirklich lief

`overworld/card-ink-2d.js` importierte `base + 'skills/kfb-ink-canon.js'` über `OW_SRC`, also
**pages.dev** — die Repo-Fassung. Meine Änderung lag in `cardbuilder/kfb-ink-canon.js` und wurde nie
geladen. Gemessen am geladenen Modul: `drawInk` hatte **7 Parameter statt 8**, `inkHalfWidth` kannte
weder `edgeJitter` noch `edgeGain`. **Ein `drawInk` ohne 8. Argument verwirft `opt` stillschweigend:**
kein Fehler, keine Warnung, nur die alte Kante.

Damit sind die Zahlen aus V8-S4b/S4c **falsch zugeordnet.** Live wirkten:
- `penPx` (verändert `gain`, das **7.** Argument) — deshalb ist die Fensterkante echt von ~15 px auf
  ~5 px gefallen. Diese Zahl stimmt.
- die neuen Fenster-Seeds 41/64/87 — daher die veränderte Verteilung. **Ohne jeden Jitter.**

### Behoben

1. **Lokal zuerst, Repo als Fallback** — in `card-ink-2d.js` (`./cardbuilder/kfb-ink-canon.js` vor
   `base+'skills/…'`) und in `hud-v7.js` `loadInk()` (vier Kandidaten, lokal an erster Stelle).
   Der Fallback bleibt: im Standalone-Export ist die Repo-Adresse die richtige.
2. **Auf Fähigkeit gaten, nicht auf Existenz** (Hausregel): `drawInk.length >= 8`. Wer `opt` nicht
   kann, wird als solcher behandelt, es wird weitergesucht, und das Log sagt es —
   `[hud-v7] Kanon: kfb-ink-canon.js · opt ja`.
3. Die Optionen werden nur übergeben, wenn der geladene Kanon sie kennt.

**Und dabei sofort der nächste selbstgebaute Fehler:** der Merker stand als `INK.__canOpt` am Modul.
Ein ES-Modul-Namensraum ist **eingefroren** → `"__canOpt" is read-only`, `loadInk()` wurde abgewiesen,
und gezeichnet wurde wieder ohne Optionen. *Der Versuch, die Fähigkeit zu merken, hat sie
ausgeschaltet.* Der Merker liegt jetzt im Modul-Gültigkeitsbereich.

### Was jetzt gemessen gilt

Am geladenen Kanon, Fläche 900×560 (groß genug, dass `minHalf 1,2` nicht klemmt), Halbbreiten:

    ohne opt   ol 2,54 · or 4,23 · ul 5,27 · ur 7,05   Achse 54,1°   ur/ol = 2,78×
    mit  opt   ol 3,42 · or 4,66 · ul 4,84 · ur 6,17   Achse 45,0°   ur/ol = 1,80×

Schattenseite bleibt schwerer (der Code lebt), Ausprägung fällt von 2,78 auf 1,80.

**Aber an den HUD-Flächen ändert sich messbar nichts** (11 von 12 Schattenseite dicker, Verhältnis
1,00–1,71, Mittel 1,27 — identisch zu vorher). Der Grund ist `minHalf: 1,2`: bei `penPx 2,1` liegt die
Halbbreite so nah an der Untergrenze, dass die dünne Seite abgeschnitten wird und die Streuung im
Rauschen der Messauflösung verschwindet (0,5-px-Schritte bei dpr 2).

**Die ehrliche Bilanz also:** `edgeJitter`/`edgeGain` sind jetzt wirksam und bei Kartengröße belegt.
Bei HUD-Federbreite sind sie eine Vorsichtsmaßnahme für später, kein sichtbarer Unterschied heute —
das sichtbare Ergebnis kommt von `penPx` und den Seeds. Wer die Streuung am HUD sehen will, muss
zusätzlich `minHalf` senken; ungemessen, ob die Kante das trägt.

### Für den Coworker

`docs/HANDOVER_coworker_ink-outline.md` §8 sagt es jetzt ausdrücklich: **die Karten-Strecke bekommt die
Änderung erst nach dem Repo-Update.** Solange `skills/kfb-ink-canon.js` im Repo die alte Fassung ist,
läuft jede Szene, die über `OW_SRC` importiert, ohne `opt` — nur eben nicht mehr stillschweigend.


## V8-S5 — Ein Messgerät für zwei Runner (2026-08-08)

Georg: die Animationen seien ruckeliger und die Bewegung träger als in v4 mit dem alten Terrain — mit
der Bitte, das drüben vergleichen zu können. **`overworld/bench.js` (bench-v1.0)**: eine Datei, keine
Abhängigkeiten, läuft in beiden Runnern. Fehlt ein System (v4 hat kein `OW_GROUND`, `OW_RELIEF`,
`OW_ACLOCK`), steht `null` — **das ist der Vergleich, kein Ersatzwert.**

Fünf Größen, weil »ruckelig« und »träge« nicht derselbe Fehler sind: Bildzeit · Zeichenzeit ·
**Bildstillstand** · Eingabe-Latenz · Anlauf. Bildstillstand zählt die Bilder, in denen der Held
gemessen läuft und das Bild stehen bleibt — die Größe, die dieses Projekt gebaut und nie gemessen hat.
Latenz gegen Anlauf trennt »der Code antwortet spät« von »es fährt absichtlich weich an«.

### Drei Fehler im eigenen Messgerät, alle drei am selben Abend bezahlt

**1 · Eine Attrappe ist schlimmer als eine fehlende Zahl.** `bakeCount()` gab fest `0` zurück, und
»0 Kachel-Backvorgänge« sah wie ein Befund aus — es war nur ein Stub. `ground-paint` zählt jetzt selbst
(`gp-v1.8`, `bakeReport()`: Anzahl, Millisekunden, Cache-Größe); fehlt das Modul, steht `null`.

**2 · Ein Messgang, der nichts bewegt, ist kein Messwert.** Erste Fassung lief blind nach rechts, stand
nach 240 Bildern am Ufer — und die nächsten drei Läufe meldeten brav `verschiebung 0`, `latenz null`,
`tempo 0`, als wäre das ein Ergebnis. Ich hatte daraus schon geschlossen, die Bildzeit sei von der
Auflösung unabhängig. Jetzt probiert der Lauf vier Richtungen, nimmt die erste, die den Helden wirklich
vom Fleck bringt, und schreibt `fehlschlag`, wenn keine es tut.

**3 · Wo gemessen wird, entscheidet mit.** Dieselbe Fassung, dieselbe Welt, derselbe Code:

    Vorschau (Rahmen, kein Fokus)      Bild 53–58 ms · Zeichnen  0–1 ms
    Georgs Ansicht (Rahmen, kein Fok.) Bild 82 ms    · Zeichnen 78 ms
    Georgs Ansicht, kleine Leinwand    Bild  8 ms    · Zeichnen  0 ms

Drei Läufe, drei Geschichten. **Ein gedrosselter `requestAnimationFrame` sieht genauso aus wie ein
langsames Spiel**, und im Rahmen ohne Fokus kann der Browser die Leinwand zusätzlich in Software
rastern. `OW_BENCH` prüft deshalb seinen eigenen Kontext (`umgebung.vertrauenswuerdig`) und warnt,
statt der Zahl zu glauben. **Ein Vergleich v4 gegen v8 gilt nur, wenn beide Läufe `true` melden** —
also im Standalone, eigener Reiter, Fenster im Vordergrund.

### Was schon jetzt ausgeschlossen ist, unabhängig von der Drosselung

    nicht die Rasterung      anteilStill 0,0 % bei 117 Bewegungsbildern
    nicht die Animationsuhr  Schlupf-Verhältnis 1,000 für ALLE Einheiten (vorher bis 90,3×)
    nicht das Kachel-Backen  0 Backvorgänge im Lauf, 8 Kacheln im Cache
    nicht die Eingabe        1 Bild bis zur ersten Bildbewegung
    sondern das Zeichnen     78 von 82 ms — 95 % der Bildzeit

**Arbeitshypothese für den Vergleich** (`docs/BENCHMARK_v4-gegen-v8.md` §5): v4 zeichnete eine Kachel
je Feld, ein `drawImage`. v8 legt im `paint`-Pfad mehrere **bildschirmgroße** Schichten übereinander.
Der eine Ausweg, der das Aussehen nicht anfasst: die sichtbare Bodenschicht **einmal je
Kamera-Kachelschritt** in eine bildschirmgroße Nebenleinwand backen statt je Bild zu füllen —
dieselbe Ersparnis wie die 512er-Kachel, eine Ebene höher. **Nicht vorschlagen, bevor gemessen ist:**
Auflösung senken, Sprites weglassen, Relief abschalten. Alle drei kosten Aussehen, keiner ist belegt.

### Deliverables dieser Sitzung

    docs/SESSION_CUT_overworld_v8.md       Session-Export (§2: sieben bezahlte Fallen)
    docs/BRIEFING_ui-sprint_WS0.md         UI-Neuordnung — mit §1.7 zur Feder
    docs/BENCHMARK_v4-gegen-v8.md          Anleitung + Ausgangsstand + Hypothese
    docs/HANDOVER_coworker_ink-outline.md  **ins Repo** — Feder betrifft Karten UND Interfaces


## V8-S4c — Die Schattenseite ist Bedeutung, nicht Zufall (2026-08-08)

**Korrektur zu V8-S4b: der Eintrag oben ist der falsche Fix, additiv berichtigt.** Georg:

> »die idee war, dass Schatten = dickere Outline heißt/codiert; daher sind meist rechts/unten die
> gedachten Schattenseiten von UI-Elementen; daher ist eine dicke unten rechts intendiert — aber
> nicht ausgeprägt und nicht so gleichförmig umgesetzt«

Ich habe die Achse **gedreht** und damit die Bedeutung weggeworfen. Falsch war nie die Richtung,
sondern die Gleichförmigkeit. Die dicke Kante unten rechts ist ein Code: **dick = Schatten,
dünn = Licht** — der comic-typische Übergang von Strich zu Form. Ein gesäter Zufallswinkel macht aus
einem Beleuchtungsmodell ein Rauschen.

`edgeSpin` ist weg. Statt dessen zwei Zahlen, die beides trennen:

- **`edgeJitter`** (Radiant) streut die Achse **um** die Kanon-Richtung (54,1°), ohne die Seite zu
  wechseln. HUD: 0,70 rad ≈ ±40°.
- **`edgeGain`** nimmt die Ausprägung zurück, ohne sie aufzugeben. HUD: 0,62.

Gemessen an 12 Flächen (mittlere Bandbreite Lichtseite oben/links gegen Schattenseite unten/rechts):

    Schattenseite dicker auf   11 von 12
    Verhältnis                 1,00 – 1,71   (Mittel 1,27)
    dickste Stelle             unten rechts 6 · rechts 3 · unten links 2 · oben rechts 1

Vorher lag sie auf **12 von 13** an derselben Stelle, mit demselben Verhältnis — auf den Grad genau.
Jetzt dieselbe Seite, andere Stelle, andere Menge: ein Stapel Blätter unter *einem* Licht.

**Der Karten-Kanon bleibt unangetastet:** ohne `edgeJitter`/`edgeGain` rechnet `inkHalfWidth` Zeile
für Zeile wie vorher; `cardbuilder/` und `card-ink-2d.js` rufen ohne Optionen.

### Offen, von Georg im selben Zug benannt

Die Terrain-Kontur folgt derselben Logik (Licht dünn oder farbig — wie die Tannen —, Schatten dick),
**aber die Terrain-Schattenlogik läuft heute oben/unten statt rechts/unten.** Zwei Beleuchtungen in
einem Bild. Ungemessen, welche der beiden näher am Kanon liegt und ob die Küste der UI folgen soll
oder umgekehrt. Gehört vor die nächste Bodenschicht — nicht danach.


## V8-S4b — Die Schreibhand wird gesät (2026-08-08)

Georg: »ist das eigentlich immer die gleiche ink-outline? … die dicke untere rechte Ecke ist schon oft
störend und in gleicher Anmutung aufgetaucht«. **Ja — aber nicht die Kontur, die Schreibhand.**

Die Seeds sind alle verschieden (7 · 11 · 17 · 19 · 29 · 37+13i · 41 · 53+17k · 71), also wackelt die
Form je Fläche anders. Der Gradient in `inkHalfWidth` ist dagegen **gar nicht gesät**:

    diag = 1 + edge · ((x/W·0,42 + y/H·0,58) − 0,5)      edge = 1,05

Das ergibt oben links **0,475**, unten rechts **1,525** — auf *jeder* Fläche dieselbe Ecke. An 13
HUD-Flächen nachgemessen (Bandbreite in CSS-px): oben links durchweg **~2,5 px**, unten rechts
**2,5–6,5 px**, und die dickste Stelle lag auf **12 von 13** unten oder rechts. Der Seed änderte immer
nur das Zittern, nie die Hand.

Für **eine** Karte ist das genau richtig: eine Hand, ein Licht. Für dreizehn Blätter nebeneinander
liest es als Muster statt als Handarbeit. Ein Stapel von Hand getuschter Blätter hat je Blatt eine
andere Schreibrichtung.

**`opt.edgeSpin` dreht die Richtung aus demselben Seed.** Die **Stärke** bleibt unangetastet: die
Gewichte werden auf |cx|+|cy| = 1 normiert (wie 0,42+0,58 = 1) und um ihre eigene Mitte zentriert
statt um die feste 0,5 — die Spanne der Modulation ist damit identisch, nur ihre Achse wandert.
**Ohne `edgeSpin` verhält sich alles wie vorher**, der Karten-Kanon bleibt Wort für Wort gültig
(`cardbuilder/` und `card-ink-2d.js` rufen ohne Option und sind unverändert).

Gemessen, wo die dickste Stelle jetzt liegt (12 Flächen):

    vorher   unten/rechts 12 von 13
    nachher  oben links 3 · unten links 3 · rechts 2 · links 2 · oben rechts 1 · unten rechts 1

**Nebenbefund:** alle drei Fenster standen auf `seed: 41` — sie hatten **dieselbe Kontur**, nur
verschieden groß skaliert. Jetzt `41 + n·23`.


## V8-S4 — Rasterung, Standfläche, ein Eigentümer je Taste (2026-08-08)

Vier Befunde von Georg, und **jeder war etwas anderes als er aussah.**

### 1 · »Die Bewegung ist träge und ruckelig« — die Bildrate war einwandfrei

Erst gemessen: Median **8 ms**, größtes Bild **18 ms**, **kein einziges Bild über 20 ms** in 150
Frames. Kein Rechenproblem. Der Held stand bei x 10764,**05**, die Kamera auf demselben Wert — *er*
ist stabil, die **Welt** landet auf Bruchteilen von Pixeln. Mit `imageSmoothingEnabled=false` greift
Nearest dann jedes Bild andere Quellpixel: genau die »1- und 2-px-Streifen«, die `prop-sheet.js`
schon für die Requisiten beschreibt. Deshalb sah Georg **beides** — flackernde Umgebungssprites *und*
Ruckeln, obwohl nichts ruckelte.

Behoben mit einer Zeile: die Verschiebung rastet auf ganze **Gerätepixel**.

    ctx.setTransform(z,0,0,z,Math.round(-ox*z),Math.round(-oy*z));

Gerundet wird das **Bild**, nicht die Weltposition — Trittfrequenz, Kollision und A\* bleiben
stufenlos. Gemessen in Bewegung: rohe Werte −15660,**07** / ,**12** / ,**20** → alle gerastet,
größte Abweichung **0,489 px** bei dpr 2, Schritte in ganzen Pixeln.

### 2 · »FrizzleBobs Schatten ist zu groß und zu weich« — und braucht keine Ausnahme

Georg fragte, ob es eine Sonderregel *Einheit gegen Requisite* braucht. Braucht es nicht. Es war
derselbe Fehler wie »der Rahmen ist kein Standpunkt« (§21.5), eine Ebene höher: Streuung, Höhe und
Weichzeichnung waren Anteile von `tw` — der **Rahmenbreite** (im Spiel `ia.fw*s`).

Gemessen, wie viel Rahmen ein Sprite überhaupt füllt (`rahmenAnteil` = Aufsatzbreite / Rahmen):

    gnome   40 von 192 = 0,21      panda   109 von 256 = 0,43
    lizard  66 von 192 = 0,34      thief    76 von 192 = 0,40

Beim Gnom war die Weichzeichnung damit **17,3 px statt 3,6 — Faktor 4,8.** Ein Hase, der auf zwei
Stiefeln steht, bekam den Schatten seines leeren Rahmens.

`cs-v1.2`: die drei Maße hängen an der **gemessenen Aufsatzbreite**. Ein breiter Busch ändert sich
kaum (seine Standfläche *ist* der Rahmen), eine schmale Figur wird schmal und scharf — **dieselbe
Regel für beide, kein Sonderfall.** `probe()` gibt `contactW` und `rahmenAnteil` mit aus.

### 3 · »C triggert noch einen legacy modal« — wörtlich richtig, zwei Listener

`hud-v7.js:1396` bindet C auf das Character-Fenster, `overworld-game.js:434` band C auf das alte
Roster — **beide feuerten**. Zwei Fenster auf einen Tastendruck. Dieselbe Klasse wie »ein
Kamera-Eigentümer« (v9-Plan A): wenn zwei Stellen dasselbe dürfen, streiten sie, und der Streit sieht
wie ein Fehler aus. Jetzt hat das Skin Vorrang, gefragt wird das **installierte** `this.HUD.version`
(geladen ist nicht montiert). Geprüft: C öffnet 1 Fenster, Roster bleibt `none`.

**Nebenbefund, dabei gefunden:** `openWindow` rief `showWin(win,true)` — fest auf offen. C und N
waren Einbahnknöpfe: drücken, drücken, nichts passiert. Jetzt umschaltend, geprüft 1 → 0.

**Und die Antwort auf »die alten Optionen sind weg«:** sie sind nicht weg und die Einstellungen sind
auch nicht abgeschnitten (Körper 487 px, Überlauf **0**, `overflow-y: auto`). Der Avatar-Wechsel
steht im **Character**-Fenster unter *AVATAR / ACTOR*, nicht in den Einstellungen — er war nur nicht
dort, wo Georg ihn suchte. Das ist ein Konzeptproblem, kein Fehler, und gehört in den UI-Sprint.

### 4 · »Die Ink-Outline ist zu dick, gerade unten rechts« — der Kanon zieht dort absichtlich satter

`inkHalfWidth`: `diag = 1 + edge·((x/W·0,42 + y/H·0,58) − 0,5)` mit `edge 1,05` — unten rechts
**1,525**, oben links **0,475**, also **3,2× dicker**. Das ist die geführte Hand und für eine Karte
richtig. Nur hängt `hb` an `min(W,H)`, und ein Fenster ist groß: bei 720 px Breite 5,0 px
Halbbreite, unten rechts 7,6 px — ein **15-px-Band**.

**Ein Fenster ist keine Karte.** Neu: `penPx` gibt eine **absolute** Federbreite, aus der der Gain
zurückgerechnet wird; Form, Wobble und Diagonale bleiben unangetastet. Fenster nehmen 2,1 px.
Gemessen am fertigen Rand (Bandbreite in CSS-px): oben links 2,5 · rechts Mitte 4,0 · unten links
6,5 · **unten rechts 5,0** statt ~15.

Dazu der Innenabstand, wie gewünscht großzügiger: Kopf 14/13/9 → **26/30/14**, Körper 13/14 →
**30/28**, Zeilenabstand 12 → 14 px.

### Struktur-Befund für den UI-Sprint (nicht behoben, gemessen)

**19 Overlay-Felder, zwei parallele Systeme.** `settingsEl` und `deadSheet` sind v7-Objekte, die
anderen 15 sind alte `<div>`s — und vier davon (`panel`, `zoneEl`, `kfEl`, `poolEl`) stehen auf
`display` sichtbar mit **Höhe 0**: sie werden weiter befüllt, nur nicht mehr gezeigt. Das ist der
organisch gewachsene Wildwuchs, den Georg benannt hat. Briefing:
`docs/BRIEFING_ui-sprint_WS0.md`.


## V8-S3 — Das Relief kommt aus der Karte, die es trägt (2026-08-08)

Georg: »die texturen sind auch weg«. Waren sie nicht — sie waren **nie sichtbar**. Am Bestand
gemessen statt vermutet:

| Material | diffuse | die Karte mit dem Relief |
|---|---|---|
| `Ground049A` (Gras) | **5,86** | normal **15,53** |
| `forest_ground_05` | 4,94 | **ao 24,53** |
| `Ground087` (Asche) | 6,64 | rough 14,18 |
| `Ground071` (Sand) | **21,15** | — das Diffuse ist hier selbst das Relief |

Bei `a: 0.30` bleibt von Korn 5,86 nichts übrig. Der Fehler war nicht die Deckung, sondern die
Karte: **ein Diffuse ist Farbe, ein Normal ist Form.** Und die Karte ist je Material eine andere —
eine feste Wahl wäre wieder geraten, dieselbe Falle wie der Kachelindex im Dungeon Editor.

**Neu: `overworld/relief.js` (rel-v1.2).** Lädt für jedes Material alle Kandidaten
(normal · ao · rough · height, mehrere Schreibweisen, was nicht lädt fällt aus), **misst das Korn**
und nimmt die körnigste. Normal-Maps werden beleuchtet (n·L, Licht von oben links wie die ganze
Welt, §21.2); die Grünachse wird nicht nach Konvention gewählt, sondern **beide Varianten gerechnet
und die genommen, deren Licht oben links heller ist** (bei `Ground026` gedreht). Ergebnis ist immer
eine entfärbte Leinwand um Mittel 128 — eine Schicht darf nur Helligkeit modulieren, sonst kippt der
Farbton (die Lehre von gp-v1.1, »giftig gelbgrün«).

**Gemessen am gebackenen Blatt** (Korn der 512er-Kachel, ohne → mit Relief):

    grass    2,01 → 7,34   ×3,65        highland 5,19 → 11,29  ×2,18
    wilds    1,77 → 7,93   ×4,48        winter   1,90 →  2,91  ×1,53
    swamp    6,07 → 10,47  ×1,72        sand     2,56 →  6,03  ×2,36
    ash      2,56 → 5,51   ×2,15

### Drei Dinge, die dabei schiefgingen — alle drei gemessen, nicht geahnt

**1 · Eine Reliefschicht ohne Korn macht flacher.** Erste Fassung legte auf jedes Material eine
Schicht. `waste` wurde dadurch **schlechter: 1,90 → 1,14**. `clay_floor_001` hat in *jeder* Karte
nur Korn 4,67 — eine graue Fläche unter `overlay` drückt das Bild zusammen. Jetzt gilt eine
Schwelle (`MIN_SD 8`): unter ihr wird nichts aufgelegt. Verworfen: `clay_floor_001` (4,67) und
`Paper004` (7,51), beide messbar unverändert bei ×1,00 statt ×0,60.

**2 · Der Regler war am Modul grün und am Bedienweg tot.** `OW_GROUND.reliefTex` wirkte, aber
`el.getAttribute('relief-tex')` gab `null`: der Wert ging als **Zahl** an das Element, und Zahlen
kommen dort nicht als Attribut an. Der Runner löst das seit je durch Stringifizieren (`sound`,
`ground`) — jetzt auch hier. Wieder der S20-Fall, und wieder hätte die API-Messung ihn durchgelassen.

**3 · Die Helmet-Skripte laufen beim zweiten Mount erneut — und legen eine leere Instanz über die
gefüllte.** Das Log sagte »Blätter geladen: 13 von 13«, während `OW_GROUND.loaded` **0** war und die
Graskachel Korn **1,17** statt 7,34 hatte. Der Boden war flach, ohne eine einzige Fehlermeldung.
**Dieser Fehler steckte seit V6 in `ground-paint.js`** und war nur nie sichtbar, weil niemand die
Instanz gefragt hat. `gp-v1.7` und `rel-v1.2` überspringen die zweite Ausführung, wenn die eigene
Version schon liegt; eine neue Version darf übernehmen, dieselbe nicht.
Nach dem Neuladen geprüft: 13 Blätter, 7 Materialien mit Relief, alle Kornwerte wieder oben.

### Was die Naht angeht: mein Verdacht war falsch

Im Bild sah es nach sichtbarer Kachelwiederholung aus. Gemessen (mittlere Differenz je Pixel an der
Kachelkante gegen das Korn in der Mitte):

    ohne Relief   Naht 2,24 · Korn innen 0,79  →  Naht ist 2,84× das Korn
    mit Relief    Naht 11,92 · Korn innen 6,97 →  Naht ist 1,71× das Korn

Die Naht wird absolut größer, **relativ zum Korn aber unauffälliger** — der Überblendrand in
`seamless()` trägt. Offen und ungemessen bleibt die andere Frage: ob sich das **Muster** mit der
Periode 512 px (8 Felder) erkennbar wiederholt. Das ist nicht dasselbe wie eine Naht und braucht
eine eigene Messung.

**Regler:** `reliefTex` 0…1, Standard 0,55 (Tweaks → Ground). Monoton geprüft:
0 → grass 2,01 · 0,35 → 4,96 · 0,55 → 7,34 · 1 → 12,89.


## V8-S2 — zwei Befunde am Boden, beide gemessen (2026-08-08)

Georg: »irgendwie sind die Texturen des Terrains weg? und da sind ganz schlimme Konstrukte drin
(ist von dir?!)«. Beides nachgemessen, statt zu vermuten.

### 1 · Das Konstrukt ist eine Pfütze — ja, von mir (V7-S4). Standard aus.

Eine Pfütze fünffach vergrößert mit denselben Funktionen nachgebaut, die das Spiel benutzt
(`shapePath` · `tintOf` · dieselben Konstanten). Das Bild ist Georgs Bild: ein organischer Fleck
mit einem **hart abgesetzten waagerechten Balken** darin. Gemessen an der Unterkante des Balkens:
**Sprung 16 Helligkeitsstufen in einer Pixelzeile**.

Ursache in `puddles.js`: der Glanz ist ein `fillRect(-r, -r·sq·0,72, 2r, r·sq·0,42)`, in die Form
geclippt. Ein Rechteck hat vier harte Kanten; die Form ist an den Seiten schmaler, also endet der
Balken senkrecht abgeschnitten. Das ist kein Licht auf Wasser, das ist ein aufgeklebter Streifen —
474 Stück auf der Welt.

`enabled = false`. Das Modul bleibt liegen. Wer es zurückholt: weicher Verlauf statt Kante, und den
Glanz **der Form entlang** führen, nicht quer darüber.

Nebenbei die alte Krankheit gleich mitgenommen: die Meldung sagte weiter »474 auf 120×90 Feldern«,
obwohl keine mehr gezeichnet wird. Sie sagt jetzt `AUS · 474 gesät … gezeichnet wird keine`.

### 2 · Die Texturen sind nicht weg — sie waren nie sichtbar. Wir überlagern die falsche Karte.

Gemessen an der gebackenen Kachel (512 px, ganze Fläche): **Gras SD 1,63 · Korn 0,84** bei 255
Stufen, Spanne 115–132. Praktisch eine Fläche. Die Blätter sind da (13 von 13 geladen), der
Backvorgang läuft — also lag der Verdacht auf dem Cache-Fehler vom 7.8. Falsch.

Die **Quelltextur selbst** ist flach: `Ground049A_diffuse.jpg` hat Korn 2,57. Bei `a: 0.3` bleiben
davon die gemessenen 1,6 — die Rechnung geht auf, es fehlt nichts.

Dann alle Karten des PBR-Satzes gemessen:

| Material | diffuse | normal | roughness | ao |
|---|---|---|---|---|
| `Ground049A` (Gras) | Korn **2,57** | Korn **18,75** | 2,39 | 3,27 |
| `Ground071` (Sand) | Korn **16,98** | 10,90 | 4,95 | 12,77 |
| `forest_ground_05` | Korn 3,42 | 10,91 | 0,88 | SD **23,68** |

**Das Relief eines PBR-Materials steckt nicht im Diffuse.** Bei Gras liegt es in der Normal-Map
(7× mehr Korn), bei `forest_ground_05` in der AO (SD 23,68 gegen 4,67). Nur `Ground071` hat
zufällig ein strukturiertes Diffuse — **deshalb** ist Sand messbar körniger als Gras (SD 2,73
gegen 1,63), und deshalb sah es aus, als sei am Gras etwas kaputt.

Und: die Struktur liegt **je Material in einer anderen Karte**. Eine feste Wahl wäre wieder geraten.

Konsequenz für den nächsten Slice (noch nicht gebaut, weil es eine Entscheidung braucht): die
Normal-Map als Licht mit der Weltlichtrichtung auswerten (§21.2, von oben links) und die AO als
`multiply` darunter — statt das Diffuse als `overlay`. Die Karte je Material nach dem gemessenen
Korn wählen, nicht nach Namen.


Additiv: neuer Eintrag oben, alte bleiben unverändert.

## V7-S7 · 2026-08-08 · Sprite Fusion: Georg malt, wir lesen — plus eine Palette gegen das Pixelproblem

Georgs Frage: »es gibt da spezifisch für tiny swords offenbar viele ressourcen online — vieles von
dem, was wir gestern mühsam gebastelt haben. könnten wir das nutzen? also ohne dass ich stundenlang
pixel schubse im editor?« Ja, in drei Punkten — jeder löst einen offenen Posten.

### 1 · Der Kachel-Editor, den wir nicht bauen müssen

HOUSEKEEPING führte als Baustelle: »der Dungeon Editor exportiert gültiges JSON, aber die
Kachelindizes sind **geraten**. Vereinbarter Ausweg: der Editor zeigt das Blatt als Palette, Georg
wählt die Kachel, das Autotiling wird aus dem Gemalten abgeleitet.« Sprite Fusion **ist** dieser
Editor — Browser, Autotiling, Ebenen, Kollisions-Häkchen.

**Neu: `overworld/sf-map.js` (sf-v1.1) + `KFB Sprite Fusion Bridge.dc.html`.** Zwei Dinge an der
Doku geprüft statt angenommen:

- **`id` ist der Kachelindex im exportierten Blatt, ab 0, links nach rechts.** Die Spaltenzahl wird
  aus der Blattbreite **gemessen** (`sheet.width / tileSize`). Wer sie aus der Kartenbreite
  schließt, hat den Fehler des Dungeon Editors nur verschoben.
- **Der Export ist eine `map.zip`**, nicht zwei lose Dateien. Meine erste Fassung erwartete zwei
  Dateien und hätte Georg einen Umweg über den Finder gekostet. Das ZIP wird jetzt selbst gelesen
  (lokale Dateiköpfe, `DecompressionStream('deflate-raw')`, keine Bibliothek).

**Und dabei sofort in dieselbe Falle getappt, die §2 des Handovers führt.** Das Modul konnte das ZIP,
die Bedienoberfläche nicht: `accept=".json,.png"` zeigte die Datei im Dialog gar nicht an, und
`take()` suchte die Dateinamen weiter selbst statt `fromFiles` zu rufen. Der Eintrag oben behauptete
trotzdem »das ZIP wird jetzt gelesen« — **der Changelog sagte, was der Code nicht tat**, zum siebten
Mal in drei Nächten. Gefunden hat es die Abnahme, nicht ich.

Behoben und **am echten Bedienweg geprüft**, nicht über die API (der S20-Fall »über `start()` grün,
über den Schalter tot«): ein 1.569-Byte-ZIP mit `map.json` + `spritesheet.png` erzeugt und per
`drop` auf das Ablagefeld geworfen. Ergebnis: 6×4 Felder, 28 Kacheln, drei Ebenen, Leinwand 384×256
bemalt, das Attribut `zip-test` erscheint als Chip. Ein Weg, eine Stelle — `OW_SFMAP.fromFiles`
kann ZIP und lose Dateien, und nur noch sie entscheidet.

Bedeutung kommt aus `attributes`, nicht aus der Kachel — dieselbe Regel wie bei den Requisiten: das
Bild sagt, wie es aussieht, die Daten sagen, was es ist. Und es gibt einen Rückweg (`toJSON`): eine
im Spiel erzeugte Welt kann in den Editor zurückwandern. Die Gegenprobe im DC schreibt eine gültige
Karte aus dem **echten** Tiny-Swords-Blatt und liest sie mit demselben Leser zurück — die Kette ist
belegt, bevor Georg eine Minute im Editor verbringt.

### 2 · Pixel Snapper: das Werkzeug für genau unser Problem von gestern

Sprite Fusion hat ein zweites, MIT-lizenziertes Werkzeug: **Pixel Snapper** snappt Off-Grid-Pixelart
zurück aufs Raster und **recoloriert mit einer eigenen Palette** (PNG oder `--palette`-CLI). Das sind
genau die zwei Defekte, die an Georgs generiertem Blatt gemessen wurden (kein Pixelgitter, 260.742
Farben) — und der graue Saum verschwindet mit, weil seine Farben nicht in der Palette sind.

**Die Zahl, die den Unterschied trägt:** Tiny Swords benutzt in **535.625 deckenden Pixeln über 17
Blätter genau 66 verschiedene Farben.** Georgs Blatt: 260.742.

Gebaut: `assets-lab/kfb-palette-64.png` (64×1-Streifen für Pixel Snapper) und
`docs/img/kfb-palette-64.png` (lesbar). Auswahl nicht nach Häufigkeit allein — das wären 64
Grüntöne — sondern **häufig UND weit auseinander**, Abstand in Oklab.

### 3 · Mönch und Lancer existieren doch

Aus `github.com/ZieIony/TinySwords`: **Monk** (Idle 6 · Run 4 · Heal 11 Frames à 192) und **Lancer**
(Idle 12 · Run 6 Frames à **320**), dazu **Monastery**, **Archery**, **Barracks**. Maße in
`docs/BESTAND_tiny-swords_2026-08-08.md` §8, Stand in `github.md`.

**Kein Superset, eine andere Generation:** Einzeldateien statt Zeilenblatt, `Tilemap_color1`
(576×384) statt `Tilemap_Flat` (640×256), Lancer auf 320. *Selbst gestellte Falle:* mein
Zell-Detektor nahm den **kleinsten** passenden Teiler und meldete für Monk Idle »Zelle 64, 18×3«.
Der kleinste passt immer und sagt nichts — der **größte** ist die Antwort.

## V7-S6 · 2026-08-08 · Wer einen Schatten bekommt, ist eine Messung — keine Liste

Georg: »unser schatten macht mehr probleme bei tiny swords als nutzen — ggf. nur für unser
chatGPT/custom assets ohne schatten? also auch heros & frizzlebob (haben keine schatten)«

**Belegt: jedes geprüfte Tiny-Swords-Blatt backt seinen Schatten ein.** Halbtransparente dunkle Pixel
im unteren Drittel — Troll 3129 · Burg 3322 · Bear 910 · Warrior 342 · Pawn 279 · Schaf 207. Wer da
noch eine Auflage darunter legt, zeichnet zwei Schatten; bei den Gebäuden fiel es am stärksten auf,
weil die Ellipse gegen die **Bildbreite** rechnete statt gegen den Körper.

Die Regel steckte im `unit-loader` bereits richtig (`shadow = baked ? 'baked' : 'ellipse'`,
gemessen mit `probeShadow`, überschreibbar im Katalog) — sie war nur **nirgends belegt**. Jetzt
schreibt der Runner die Abnahmezahl selbst:

    [shadow] contact · Einheiten mit eigener Auflage 0/9 · alle Blätter backen selbst

Damit bleiben genau unsere eigenen Sachen: die fünf Helden aus `hero-frames.js`, Uncle FrizzleBob,
und die Requisiten aus Georgs generierten Blättern. Punkt 1 des Re-Briefings (»kein Schatten«) war
also richtig — ohne gebackenen braucht es unseren.

**Warum keine Liste:** eine Aufzählung von Ausnahmen lügt, sobald ein Blatt dazukommt. Die Messung
nie. Als Kanon im Kopf von `contact-shadow.js` (cs-v1.1) festgeschrieben, mit den Zahlen dahinter.

## V7-S5g · 2026-08-08 · Zwei Befunde aus Georgs Screenshots

**1 · Doppelte Schatten in der Mob-Übersicht.** Die Übersicht prüfte nicht, ob das Blatt seinen
Schatten mitbringt, und legte ihre Ellipse darunter — beim Troll und bei den Gebäuden deutlich
sichtbar. Jetzt misst `Component.box` es mit (`baked`), und die eigene Auflage ist die Ausnahme.

**2 · Der Barrel Goblin ist keiner — und meine Notiz war geraten.** Georg: »barrel goblin scheint
eher ammunition/dynamit oder so? sehe da keine goblin im loop?« Am Blatt gemessen (768×768, 4×4
Zellen à 192):

| Zeile | Zellen |
|---|---|
| 0 | **163 px Figur**, dann 54 · 42 · 45 px flach |
| 1 | 166 · 39 · 38 · 38 px |
| 2 | 177 · 184 · 76 · 76 px |
| 3 | 163 · 163 px, dann **zwei leere** |

Zeile 0 ist keine Ruheschleife: eine Figur, dann drei flache Formen. Meine Notiz »versteckt sich im
Fass und rennt dann« war **erfunden** — zurückgenommen. Die Karte heißt jetzt **Barrel (ungeklärt)**,
Rolle `unknown`, und nennt die Messung statt einer Deutung. Dieselbe Fehlerklasse wie sechsmal
zuvor, nur diesmal in einer Bildunterschrift.

**Und dann selbst wieder hineingetappt:** um es besser zu zeigen, ließ ich die Karte Zeile 3 laufen
(`row`-Offset). Das zerlegte den Loop — vier Frames gleichzeitig in einer Kachel. Georg: »der
barrel-loop ist jetzt kaputt, sah vorher plausibel aus«. **Zurückgenommen statt nachgebessert:** der
Offset ist weg, Zeile 0 für alle. Wer eine bestimmte Zeile braucht, baut es mit einer Messung.

**Der Befund, der Georgs Deutung widerspricht:** `Barrel` liegt in **vier Fraktionsfarben** (Red ·
Blue · Purple · Yellow, alle 768×768) — wie Warrior, Archer und Pawn. Munition hätte keine.
Ein `Cauldron`/`Bomb`/`Keg`/`Dynamite`-Asset gibt es nicht. Beide Befunde stehen jetzt auf der
Karte, keiner wird zur Wahrheit erklärt. Nebenbei: die Goblin-Fraktion hat im Repo **keine Bauten**.

## V7-S5f · 2026-08-08 · Das Flackern: Frames wurden gerechnet statt gezählt

Georgs Befund: »etliche sprites wie der archer blinken«, später »TNT Goblin flackert auch«. Sein
Verdacht war richtig — **leere Frames**. Die Anzahl kam aus `Breite ÷ Zelle`, aber die Zeilen der
Update-010-Blätter sind nicht voll belegt: **Archer 6 von 8, TNT Goblin 6 von 7**. Jede leere Zelle
ist ein schwarzes Bild im Loop.

Behoben: ein Frame gilt als belegt, wenn mehr als 0,3 % der Zelle deckend sind (darunter ist es
Streupixel, keine Figur); die Schleife läuft nur über die belegten Indizes. Gemessen danach:
**0 leere Kacheln von 35**, und die Karte weist die Lücke aus (»6 Frames (2 leer)«).

Dieselbe Fehlerklasse wie das geratene Kachelraster: **was man rechnen kann, muss man trotzdem am
Blatt zählen.** Und: die Zellzahl ist NICHT einheitlich — Warrior 6×8, Archer 8×7, Pawn 6×6,
Torch 7×5, TNT 7×3, Barrel 4×4. 192er-Zellen annehmen ist richtig, Zeilen- oder Spaltenzahl annehmen
ist falsch.

**Offen für WS0:** ob `unit-loader.js` dieselbe Lücke hat. Das ist der erste Ort, an dem die
unruhigen In-Game-Loops zu suchen sind.

Vollständige Bestandsprüfung (Mönch/Lancer fehlen im Repo · Feuer und Zerfall sind da · Terrain
komplett · das UI-Slice-System entschlüsselt): **`docs/BESTAND_tiny-swords_2026-08-08.md`**.

## V7-S5c/d · 2026-08-08 · Peasants und Ressourcen fehlten — und eine Notiz zu den Loops

**Georgs Frage:** »da fehlen units wie zb. die peasants (zusammen mit den ressourcen wie gold etc)?«
Ja. Die Übersicht zog nur `enemies` und `critters` aus dem Katalog. Am Repo geprüft (nicht aus dem
Gedächtnis notiert), gefunden und ergänzt — 21 → **35 Karten**, zwei neue Gruppen plus Ressourcen:

| Gruppe | Inhalt | Maße am Repo geprüft |
|---|---|---|
| **Hof** | Pawn *(das ist der Peasant)* · Warrior · Archer | 1152×1152, 192er-Zellen |
| **Goblins (Update 010)** | Torch · TNT · Barrel | 1344×960 · 1344×576 · 768×768 |
| **Ressourcen** | Gold · Holz · Fleisch (je 7 Frames à 128) · Goldmine (3 Zustände) · Baum 4×3 · Burg · Haus · Turm | 896×128 · 192×128 · 768×576 |

Wichtig für den Katalog: der **Pawn steht längst unter `playable`**, die **Ressourcen gar nicht** —
sie sind hier zum Ansehen geladen, nicht angeschlossen. Die Fußzeile der Seite sagt das, statt einen
Bestand zu behaupten, den das Spiel nicht kennt. Ebenfalls neu im Blick: die Goblins aus Update 010
sind eine zweite Fraktion, die im Katalog fehlt; `Goblin_House_Red.png` liegt **nicht** unter dem
erwarteten Pfad.

**Vier Blattformen, jede mit ihrer eigenen Zellregel** — `strip` (quadratisch aus der Höhe) ·
`rowsheet` (feste Zelle, Zeile 0) · `sheet` (Zelle angegeben) · `plain` (ein Bild). Dieselbe Lehre
wie beim Prop-Blatt: ein Zellmaß, das man annimmt, schneidet quer durch die Figur.

**V7-S5d, selbst gefunden:** die Alpha-Box wurde an **Frame 0** gemessen, aber alle Frames wurden
gezeichnet. Am Barrel Goblin fiel es auf — Frame 0 ist das versteckte Fass, die späteren zeigen den
Goblin, also sprang der Maßstab je Bild. Jetzt gilt die **Vereinigung über alle Frames**: ein Maßstab,
eine Bodenlinie über die ganze Schleife. (Dass der Barrel dennoch klein erscheint, ist der Bestand und
kein Fehler — er sitzt im Fass.) Dazu: Ressourcen und Bauten werden in die Kachel **zentriert** statt
auf die Bodenlinie gesetzt und sind vom Heldenmaß ausgenommen — eine Burg ist kein Körper, und
`sizeRel` wäre für sie erfunden. Gemessen: **0 von 35** Sprites berühren noch den Kartenrand
(vorher hingen Gold, Holz und Fleisch bei 149 von 150 px).

### Notiert, nicht angefasst: die Loops laufen hier flüssiger als im Spiel

Georgs Beobachtung vom 8.8.: »die loops/animationen der units sehen hier sauberer und besser/flüssiger
aus als in-game« — er prüft es parallel in WS0. Für die Fehlersuche dort der Unterschied zwischen den
beiden Stellen, ohne Deutung:

- **Diese Seite** taktet die Frames an einer festen Uhr (`Math.floor(t/110)`, also 9,1 Bilder je
  Sekunde), gleichmäßig, unabhängig von allem anderen.
- **Das Spiel** taktet an der **gelaufenen Strecke** — und genau dort steht der offene Punkt aus dem
  v6-Nachtrag: *»die Mob-Animationsrate hängt an der Uhr statt an der gelaufenen Strecke; deshalb
  schwebt der Troll«.* Ein Mob, der langsamer läuft als seine Bildrate, gleitet; einer, der schneller
  ist, stapft auf der Stelle.
- Dritter Kandidat, hier nicht ausgeschlossen: diese Seite zeichnet **immer den Lauf-Streifen**, das
  Spiel wechselt zwischen Ruhe, Lauf und Angriff. Ein Wechsel, der den Frame-Zähler nicht mitnimmt,
  springt bei jedem Zustandswechsel auf Bild 0 zurück.

Kein Eingriff in dieser Runde — der Befund gehört zu der Messung, die in WS0 läuft.

## V7-S5 · 2026-08-07 · Mob-Übersicht: 21 Einheiten, gemessen statt behauptet

**Neu: `KFB Mob Übersicht.dc.html`.** Georg kannte den Bestand nicht — jetzt liegt er als eine Seite
vor: alle Gegner und Kreaturen aus `units-catalog.js`, gruppiert nach Biom (Lager · Höhle · Wildnis ·
Verlies · Wasser · Kreaturen), mit laufendem Sprite, Rolle, Temperament, Biom-Vorschlag und einer
Zeile, warum das Wesen dort hingehört.

**Nicht aus den Definitionen abgelesen, sondern am Blatt gemessen** — dieselbe Kette wie im
unit-loader: Framezahl aus der Streifenbreite, Körperhöhe und Fußpunkt aus der Alpha-Box. Ergebnis:
Körperhöhen **38–211 px** in Zellen von 64 bis 256, Größen **0,72×** (Pig) bis **1,95×** (Troll)
relativ zum Helden. **15 von 21** haben ein Temperament; der Rest fällt im Gehirn auf die
Rollenvorgabe zurück, und die Seite sagt das statt es zu verschweigen. Wer keine Angriffsanimation
hat, steht namentlich in der Fußzeile.

**V7-S5b, zwei Fehler aus der Abnahme:**

*Der Schalter »auf Heldenmaß skalieren« hielt nicht Wort.* Die Klemmung rechnete gegen die
**Framebreite** (192–320 px, größtenteils leeres Futter um die Figur), also entschied für fast jeden
Mob die Zellgröße über die Bildhöhe statt `sizeRel`: Pig Rider (1,18×) und Troll (1,95×) kamen beide
auf **78 px** heraus — genau die Lüge, die der Schalter verhindern soll. Jetzt gibt es **einen**
Faktor für die ganze Liste: der größte bekommt die verfügbare Höhe, alle anderen ihren Anteil daran.
Gemessen danach: Pig **46 px** → Troll **134 px**, Faktor 2,91 gegen sizeRel-Verhältnis 2,71 (der Rest
ist Laufbewegung, die den Körper je Frame streckt).

*Die Lizard stand 14 px zu tief, die Füße am Kartenrand abgeschnitten.* Zwei Annahmen, beide falsch:
der Fußpunkt wurde am Idle gemessen und am gezeichneten Lauf-Frame angewandt, und die Lauf-Zelle
wurde als quadratisch angenommen — **das Lauf-Blatt der Lizard ist keines.** Jetzt wird die Alpha-Box
für den Frame gemessen, der wirklich gezeichnet wird, die Zellbreite aus der gerundeten Frame-Anzahl
abgeleitet, und der Fußpunkt direkt gesetzt (Oberkante = Bodenlinie − bottomRel·Höhe) statt über einen
Versatz nach unten. Bodenlinie danach 137–145 px bei allen 21 — die Streuung ist der angehobene Fuß
im Laufbild, nicht ein Versatz.
Zwei Schalter: laufen lassen, und auf Heldenmaß skalieren (sonst füllt jedes Sprite seine Kachel und
alle sehen gleich groß aus — genau die Lüge, die `sizeRel` verhindern soll).

## V7-S4 · 2026-08-07 · Pfützen als eigene Schicht

**Neu: `overworld/puddles.js` (pd-v1.0), Masterplan §31.2b.** Georgs Trennung umgesetzt: die flachen
Ovale sind kein Schatten, sondern Fläche. Ein Schatten hängt an einem Sprite, eine Pfütze an der Senke.

1. **Sie liegen, wo Wasser läge.** Ein Feuchtefeld aus zwei Rauschskalen (23 Felder für
   Landschaftsteile, 6,5 für einzelne Senken) statt eines Würfels je Feld — nasse Flecken treten in
   Gruppen auf, der Weg dazwischen bleibt lesbar. Dazu die **Nähe zum echten Wasser** als Ringsuche
   bis 4 Felder: am Ufer ist der Boden feucht.
2. **Organisch, nicht oval.** Radius je Winkel aus drei Harmonischen mit gesäten Phasen. Eine Ellipse
   hat zwei Zahlen und sieht gestempelt aus, sobald zwei nebeneinanderliegen.
3. **Farbliche Variation ist der Beitrag** (Georgs Punkt). Jede Pfütze nimmt aus ihrer Position eine
   Tönung entlang einer Achse feuchte Erde → moorig → algig und einen eigenen Grad Spiegelung.
   `multiply` für das Nasse, ein knapper `screen`-Streifen für das Licht darauf — der Boden bleibt
   in beiden Fällen sichtbar.
4. **Ein Rand, kein Umriss.** Der Saum ist dieselbe Form, 11 % größer und dunkler. Die Kanon-Tusche
   gehört der Küste und den Karten, nicht einer Bodenpfütze.

Gebacken in Flecken von 8×8 Feldern, gezeichnet als ein `drawImage` je Fleck, deterministisch aus
dem Weltseed (Journey-kompatibel). Geclippt auf Grasfelder außerhalb der Zonen — die führen ihre
eigene Palette. Tweak `puddles` (on/off).

Gemessen: **474 Pfützen auf 120×90 Feldern, 43,9 je 1000**, Tönung 0,03…1,00 (Median 0,70).

*Selbst eingerissen und in derselben Runde gefunden:* die erste Fassung meldete Tönung **−0,17**…1,00.
Ein Feld kann auch über die Ufernähe nass werden, dann ist `w − wet` negativ und der Wert fällt am
Rand der Palette heraus. Die Klemmung sitzt jetzt in `toneAt`, an einer Stelle für Zeichnen und
Messen — nicht zweimal. Zugleich die Grundwahrscheinlichkeit von 0,052 auf 0,030 gesenkt: 75 Pfützen
je 1000 Felder waren jedes dreizehnte Feld, das ist ein Sumpf, keine Senke.

**Zweiter Fund beim Einhängen:** `inZone` war im Boden-Zweig deklariert und für die Pfützenschicht
nicht sichtbar — sie lag eine Ebene zu tief. Jetzt gemeinsam eine Ebene höher. Und die Schicht wird
beim Weltbau neu gesät (`reset`), sonst behält sie die Pfützen der vorigen Welt: **wer neu baut,
muss auch neu säen.**

## V7-S3 · 2026-08-07 · Der Schatten hat die Form des Dings

Georgs Befund: die eine Ellipse unter allem ist »für die meisten falsch«, extrem flach platzierte
Ovale sehen aus wie Pfützen. Drei Forderungen, wörtlich: Form und Breite des Assets nehmen,
abgerundet, und **nicht grau, sondern so durchlässig, dass die Textur darunter sichtbar bleibt**.
Global, also auch für Einheiten ohne gebackenen Schatten.

**Neu: `overworld/contact-shadow.js` (cs-v1.0).** Der Schatten wird aus dem Sprite gemessen:

1. **Standfläche.** Im unteren Viertel (`band` 0,26 der Körperhöhe, gemessen ab der untersten
   deckenden Zeile — nicht ab der Rahmenkante) wird je Spalte die Deckung gezählt. Ein Baumstamm
   bekommt eine schmale, ein liegender Stamm eine lange Fläche.
2. **Streuung.** Profil dilatiert und geglättet über 0,16 der Breite: Licht ist nicht punktförmig.
3. **Form.** Die halbe Höhe folgt der Wurzel der Deckung — in der Mitte breit, an den Enden rund
   auslaufend. Keine Ellipse.
4. **Farbe.** `multiply` in einem warmen Dunkelton (#5b4a33, Alpha 0,46). Multiplikation rechnet
   die Textur mit, statt sie zu übermalen. Grau wäre ein Deckel, und ein Deckel ist kein Schatten.

Gebacken wird einmal je Sprite und Zielbreite, gezeichnet wird ein `drawImage` — die Messung liegt
nicht im Frame. Für Einheiten wird die Standfläche am **Idle-Frame** genommen, nicht am aktuellen:
ein Schatten, der je Laufbild seine Form wechselt, ist ein Flackern mit Begründung.

**V7-S3c, Georgs Befund am Bild:** die Auflage saß überall zu tief, die Sprites schienen zu schweben.
Ursache war banal — das Zentrum lag genau auf dem Fußpunkt, also die halbe Schattenhöhe darunter.
Das Zentrum gehört knapp ÜBER die untere solide Baseline: `K.lift` 0,55 der halben Auflagenhöhe,
gemessen **78 % der Auflage über der Baseline** (Totholz +13,1 px · Zypresse +9,5 · Pilz +7,3 — der
Wert skaliert mit, weil er relativ ist). Das Belegbild führt die falsche Fassung als eigene Spalte
mit, damit der Unterschied nachprüfbar bleibt.

Tweak `shadow`: **contact** (Standard) · **ellipse** (die alte, zum Gegenprüfen) · **off** (Georgs
Frage, ob wir verzichten — die Antwort steht im Bild: ohne Auflage kleben die Requisiten).
Belegbild: `docs/img/prop-schatten-vergleich.png`.

**Die Pfützen sind nicht gestrichen, nur getrennt** (Georg): organische Ovale mit farblicher
Variation, verteilt wie die Requisiten — sie gehören zu den Materialcodes, §31.2, nicht zum Schatten.

## V7-S2 · 2026-08-07 · Der graue Saum ist ins Blatt gemalt

Georg sah nach dem Freistellen weiterhin graue Kanten — Steinoberseiten, Büsche, Stämme. Gemessen in
der 2-px-Zone um jede Silhouette (71.487 px): **53,5 % sind grau-hell**, Median-Sättigung **6 %**,
Median-Luma **154**. Das ist **kein Freistell-Rest** — eine feinere Weiß-Schwelle kann daran nichts
ändern, weil die Pixel nicht weiß sind. Punkt 4 des Re-Briefings ist nicht befolgt.

Fünf Wege, am selben Blatt verglichen (`docs/img/prop-saum-vergleich.png`):

| Weg | Befund |
|---|---|
| **Saum entgraut** (genommen) | 38.223 px fallen weg, Silhouette unangetastet, kein Halo |
| Farbe von innen nachziehen | sauber, aber die Kontur wird dicker und dunkler |
| 4-px-Gitter | genau Georgs »arg verpixelt« — die Fassung ist damit erledigt |
| echte Auflösung 384×256 | die Blockmehrheit zieht die Kontur nach Schwarz, Kanon-Bruch |
| Photoshop von Hand | bester Kontrollgrad, skaliert aber nicht auf neue Biome |

Genommen ist `OW_PROPS.degrey`: was in der Randzone liegt UND grau ist (Sättigung < 18 %,
Luma > 120), wird transparent. Die Regel greift nur am Rand, damit graue Steine mitten im Objekt
bleiben. **Standard für `propGrid` ist wieder `smooth`** — der Vergleich glatt gegen Gitter ist
entschieden.

Ein von Hand freigestelltes Blatt läuft unverändert durch dieselbe Kette; `degrey` findet dann
nichts mehr.

## V7-S1 · 2026-08-07 · Georgs generiertes Prop-Blatt wird zu Requisiten — und die eine Messung, die den Weg entscheidet

**Neu: `KFB Overworld v7.dc.html`** (Fork von v6), `overworld/prop-sheet.js` (ps-v1.0),
`overworld/prop-sheets.json` (Kontrakt), `KFB Prop Sheet Lab.dc.html` (das Labor).

### Der Befund, der zuerst kommen musste

Der Handover nannte das Pixelraster den einen Punkt, an dem der ganze Weg scheitern kann. Gemessen
an `assets-lab/sheet-02.png`:

| Messung | Ergebnis | was ein Gitter zeigen würde |
|---|---|---|
| Farben im Blatt | **260 742** | einige Dutzend je Zelle |
| mittlere Blockabweichung | 2 px **52,6** → 4 px **88,0** → 8 px **116,0** | Einbruch bei 4 px |
| Farbsprünge 1 px weit | **71 %** | nahe 0 |
| Kantenpositionen mod 8 | gleichverteilt (15 300…16 827) | Spitzen auf einem Rest |

**Das Blatt liegt auf keinem Pixelgitter.** Es ist gemalte Glätte im Pixel-Art-Stil; Punkt 4 des
Re-Briefings wurde nicht befolgt. Punkt 2 auch nicht ganz: nur **13,7 %** des Hintergrunds sind rein
weiß, **63,8 %** sind fast weiß — eine Gleichheitsprüfung auf #FFFFFF hinterlässt Löcher und einen
grauen Saum. Deshalb Luma-Schwelle mit weichem Saum und Unpremultiply: **76,3 %** der Fläche fällt
weg, der halbtransparente Saum bleibt unter einem Prozent, kein Halo auf dunklem Gras.

Weil die Entscheidung im Bild fällt und nicht in der Tabelle, liefert das Modul **beide Fassungen**:
glatt, und aufs 4-px-Gitter gezwungen (Blockmittel, sechs Stufen je Kanal, nearest hoch).

### Das Raster wird gemessen, nicht vorgegeben

Rechnerisch wären es bei 1536×1024 und 8×6 Zellen von 192×171. Die Alpha-Projektion findet Reihen
bei **28…217 · 268…382 · 421…523 · 567…669 · 728…841 · 892…978**. Ein Schnitt bei y = 171 läuft also
mitten durch die Bäume der ersten Reihe, die bis 217 reichen. Dieselbe Fehlerklasse wie die
geratenen Kachelindizes im Dungeon Editor: **ein Index, den man nicht am Blatt geprüft hat, ist
geraten.** Bänder finden, Streupixel unter 8 px verwerfen, Lücken unter 14 px vereinen → **6×8
Bänder, 48 von 48 Zellen belegt**, enge Box je Zelle, Fußpunkt ist ihre Unterkante.

Der Schatten zeichnet die Engine auf diesem gemessenen Fußpunkt — genau dafür war »kein Schatten«
Punkt 1 des Re-Briefings. Für ein Blatt MIT Schatten liegt der Schalter `trim.body` bereit
(deckend UND gesättigt statt Alpha allein).

### Im Spiel, zwei Quellen nebeneinander

Georgs Entscheidung war »beides bauen und nebeneinander vergleichen«, nicht »eines wählen«. Also:
Tweak `propSheet` (mix · sheet · tiny) und `propGrid` (both · smooth · pixel). Bei `mix`
entscheidet ein grobes Feld über Regionen, welche Quelle streut — Regionen, nicht Streuung, sonst
stehen die Stile durcheinander und man sieht keinen Unterschied. Bei `both` läuft die Naht durch
die Weltmitte: links glatt, rechts Gitter.

Gemessen im Lauf (Welt 240×180, seed 7, layout utopia), beide Zähler an derselben Stelle gezogen —
nach `sprites.sort`, über `sprites.filter(d=>d.src)`: **463 Requisiten vom Blatt** (glatt 249 ·
Gitter 214) gegen **879 von Tiny Swords**, 1342 gesamt, davon 479 Bäume und 185 Wasserfelsen.
37/37 Assets, keine Konsolenfehler.

*Selbst eingerissen und vom Verifier gefunden:* der erste Zähler zählte auf der Blatt-Seite alles
und auf der Tiny-Swords-Seite nur den Kleinprop-Zweig — die 479 Bäume und die Felsen fehlten darin,
und dieser Changelog behauptete daraufhin »463 gegen 346«. Dieselbe Falle wie fünfmal in v6: **eine
Zahl gehört an die Stelle gemessen, um die es geht.**

Häufigkeit ist ab jetzt **Datum, nicht Code**: Gewicht, Höhe in Feldern, Biom und Reihenbedeutung
stehen in `prop-sheets.json`. Blüher 40 · Büsche 34 · Totholz 22 · Steine 18 · Bäume 14 ·
Tümpel 3. Georgs Kürbisproblem (»Wegweiser so oft wie Grasbüschel«) ist damit an der Quelle gelöst,
nicht im Code — ein neues Biom ist ein Bild plus eine Zeile.

### Was das Labor kann

`KFB Prop Sheet Lab.dc.html`: Schwellen und Bandregeln am Regler, Bänder und Boxen und Fußpunkte
im Blatt eingezeichnet, Zuschnitt im Spielmaßstab auf Gras (ein Feld = 64 px, mit unserem eigenen
Schatten), Streuprobe mit Gewichten, Hainen, Mindestabstand und Verformung je Instanz, und der
Kontrakt als JSON zum Speichern. Die Gitter-Messung steht als Urteil daneben, mit Zahlen.

### Zwei Nachbesserungen, ebenfalls aus der Abnahme (V7-S1b)

**Die Gitter-Fassung wurde beim Zeichnen zerstört.** `imageSmoothingEnabled=false` allein rettet
nichts: `scale = hTiles·64/h` liegt zwischen 0,385 und 1,7, also landete der 4-px-Block mit
**1,54 · 1,94 · 2,03 · 2,37 · 2,44 · 2,75 · 3,10 · 6,80** Bildpunkten auf dem Schirm, und Nearest
machte daraus abwechselnd 1- und 2-px-Streifen. Verglichen wurde damit glatt gegen
kaputt-resampelt, nicht glatt gegen Gitter. Jetzt wird die Zielgröße auf ein Vielfaches von 1/Block
gerundet und die Zelle **einmal vorgebacken** (`OW_PROPS.bakeCell`, gecacht); gezeichnet wird die
gebackene Leinwand bei scale 1, sodass nur noch die Verformung je Instanz resampelt — und die
trifft beide Fassungen gleich.

**Deckel bei scale 1.** `Stein 8` ist im Blatt 50×32 und wurde über die Reihenhöhe (hTiles 0,85)
auf 85×54 hochgezogen, während die Nachbarzellen derselben Reihe 107–119 px breit sind. Generierte
Art hochzuziehen sieht matschig aus. Die Höhe je Reihe bleibt die Absicht, ist aber kein Zwang mehr
nach oben — kleine Zellen bleiben klein, und die Reihe behält Größenvarianz.

### V7-S1c · Die Requisiten vom Blatt schwebten

Der Modulkopf und der Eintrag oben behaupteten beide, den Schatten setze die Engine auf dem
gemessenen Fußpunkt. **Der Deko-Zweig in `draw()` enthielt keinen einzigen Schatten-Aufruf.**
Aufgefallen ist es niemandem, weil die Tiny-Swords-Deko ihren mitbringt: `deco1` (64×64) trägt 41
halbtransparente Pixel, alle dunkel — ein gebackener Kontaktschatten. Georgs Blatt hat auf
ausdrücklichen Wunsch keinen. Folge: an genau der Naht, an der verglichen werden soll, stand eine
Hälfte auf dem Boden und die andere darüber.

Jetzt zieht der Deko-Zweig für alle 457 Requisiten mit `d.src` dieselbe Auflage wie die Einheiten
(`OW_SHADOW.draw`, Anker Fußpunkt, Breite mit `D.sx` der Verformung skaliert) — nicht eine zweite
Ellipse mit eigenen Zahlen. Das Labor hatte es von Anfang an richtig, und genau daran ließ sich der
Unterschied sehen: das Labor grundiert, das Spiel nicht.

Das ist der sechste Fall derselben Klasse in zwei Nächten: **der Changelog behauptete etwas, was der
Code nicht tat.** Und wieder war der Beleg nicht dort gezogen, wo die Behauptung steht.

### Offen, unverändert übernommen

Die 144°-Ecken an kleinen Wasserformen (Verdacht Sattelfälle, `case 5`/`case 10`) und die
Mob-Animationsrate an der Uhr statt an der gelaufenen Strecke — der schwebende Troll. Beides steht
in dieser Runde nicht.

## V6-S15 · 2026-08-07 · Haine sind jetzt Haine — und was offen bleibt

**Die Verteilung aus S13 machte keine Haine.** Der Changelog behauptete es, die Messung widerlegte
es: Varianz/Mittel **1,22** über 53 Zellen à 15×15 Felder — statistisch nicht von reinem Zufall zu
unterscheiden. Schlimmer: 65 % aller Bäume saßen dicht am harten Minimum von 192 px, also
**regelmäßiger** als Zufall.

**Ursache: zwei Skalen, die sich auslöschen.** Das Dichtefeld hatte 5 Felder Wellenlänge, die
Reservierung sperrte 2 Felder in jede Richtung — jede Hain-Blase fasste damit rechnerisch genau
EINEN Baum. Jetzt: Hain rund 20 Felder, Reservierung 1 Feld, und die Annahmeschwelle hängt am
Feldwert — im Hain dicht, draußen gar nicht.

| | S13 | jetzt | Haine wären |
|---|---|---|---|
| Varianz/Mittel je Zelle | 1,22 | **11,59** | über 2 |
| Bäume | 318 | **477** | — |
| Props gesamt | 988 | **1 340** | — |

**Eckige Wassergräben** (Georgs Bild): kleine Ringe wurden vom festen Mindestabstand zu Vier- und
Fünfecken ausgedünnt. Das Ausdünnen hat jetzt eine Untergrenze — wer zu wenig Punkte behält, dünnt
mit halbem Abstand nochmal aus. Kleinster Ring 21 statt 8 Punkte.

**Offen für v7, gemessen und nicht geraten:** die schärfsten Richtungswechsel liegen weiterhin bei
**144 / 139 / 135 Grad** (Median 76). Vier Chaikin-Durchgänge statt zwei ändern daran **nichts** —
die Ecke steckt also im Feld, nicht in der Glättung. Verdacht: Sattelfälle in Marching Squares
(case 5/10) an sehr kleinen Formen. Nicht weiter geraten, sondern übergeben.

**Das Logbuch schnitt die neueste Zeile ab.** Gemessen: clientHeight 103 gegen scrollHeight 122
bei overflow: visible — der Inhalt ragte 19 px aus dem Papier und wurde am Canvasrand gekappt,
ausgerechnet die Meldung, die gerade passiert (»Journey restored — the island is…«). Dieselbe
Klasse in v7-mid (103/114) und v7-hand (89/100). Jetzt unten bündig und oben abgeschnitten: was
herausläuft, ist das Älteste. Als Regel im Shadow-Root — hud-v7.js bleibt unangetastet, sein
README sagt, die Module blieben unverändert. Gemessen danach: client = scroll bei allen dreien,
Unterkante 522 px innerhalb des 540er Bildes.

*Selbst gebaut und wieder eingerissen:* der erste Versuch legte dieselbe Regel auch auf v7-mid
und v7-hand, weil die Messung dort denselben Überlauf zeigte. Die Hand ist aber eine REIHE von
Karten und das mittlere Feld ein Banner — flex-direction: column hat beide gestapelt und die
Texturen zerlegt (Georg: »die Cards sind jetzt gestackt und ich sehe die Texturen nicht mehr«).
Ein Messwert sagt, DASS etwas überläuft, nicht, dass dieselbe Behandlung passt.

**Der Standalone hatte keine Texturen** (Georg, 7.8., am Export gesehen — im Chat waren
sie da). `tileFor()` cachte die gebackene Kachel **bedingungslos**: war das Tiny-Swords-Blatt beim
ersten Aufruf noch nicht geladen, entstand eine flache Kachel aus dem Grundton allein, und die
blieb für immer im Cache. Im Chat gewinnt das Laden das Rennen, im Standalone nicht. Jetzt wird nur
gecacht, wenn Texturen vorliegen — ein Ergebnis aus leerem Vorrat hebt man nicht auf. Das ist die
Hausregel »auf läuft gaten, nie auf existiert«, diesmal in einem Cache statt in einem Schalter.

**Im Standalone lief das alte HUD** (Georg, 7.8.: »das schwarze Chrome statt unserem
Ink-Interface, und die Minimap fehlt«). Der Runner wählt den Skin EINMAL beim Mount. Im Chat liegen
die Module als `<script src>` im Helmet und sind vorher da; gebündelt nicht — dort war
`OW_HUD_V7` beim Mount noch nicht definiert, der Runner nahm v6 und fragte nie wieder. Jetzt fasst
er 4 s lang alle 100 ms nach und tauscht, sobald v7 eintrifft. Dieselbe Hausregel wie beim
Textur-Cache eine Zeile höher: wer beim ersten Versuch leer ausgeht, fragt nach, statt den Ersatz
für das Ergebnis zu halten.

**Ebenfalls offen:** Georg berichtet, dass Bewegung und Sprite-Animationen langsamer laufen als
gewohnt, obwohl der Frame hier bei **0,5 ms** liegt und die Zeichenlast nachweislich weg ist. Der
Troll schwebt beim Gehen — die Laufanimation passt nicht zur Schrittweite. Beides gehört in
denselben v7-Slice: **Animationsrate an die gelaufene Strecke koppeln**, wie es game-feel.js für
den Helden schon tut (»die Füße hängen an der gefahrenen Strecke statt an der Uhr«, S79 in Travel
v12) — für Mobs steht das noch aus.


## V6-S14 · 2026-08-07 · Der Pfad wird gebaut, nicht sechsmal gebaut

Georg: »Die Bewegung ist extrem langsam, das wirkt, als hätten wir ein Performance-Problem.«
Hatte es.

**Gemessen, bevor irgendetwas geändert wurde:** Frame **7,7 ms**, davon `OW_TERRAIN.draw` allein
**4,8 ms** — Wasser 0,4, Feder 0,1, Federkette 0,0. Die Last lag also an einer Stelle.

**Ursache:** der Vektorpfad über 5 173 Punkte wurde **sechsmal je Frame** neu aufgebaut — Schatten-
Clip und Flächen-Clip je Ebene, dazu zwei Bevel-Durchgänge, jedes Mal fünftausend `lineTo`. Die
Kontur ändert sich aber nur, wenn das Gummiband arbeitet; in jedem anderen Frame ist sie dieselbe
wie im letzten. Das war der Preis des Umbaus von S9, den wir bis jetzt nicht bezahlt gesehen haben.

**Jetzt ein `Path2D`-Paar je Ringsatz** (Fläche und Inverses), gebaut wenn sich etwas ändert,
sonst wiederverwendet. `ctx.clip(path)` und `ctx.fill(path)` nehmen es direkt.

| | vorher | jetzt |
|---|---|---|
| `OW_TERRAIN.draw` | 4,8 ms | **0,1 ms** |
| ganzer Frame (`draw`) | 7,7 ms | **0,7 ms** |

Mit aktiver Beule wird der Pfad neu gebaut — `step`+`draw` zusammen dann 11,1 ms Median gegen
8,3 ms in Ruhe, also **90 fps** im Kollisionsmoment. Der Terrain-Anteil daran ist 0,1 ms; der Rest
sind die 988 Deko-Sprites und 36 Mobs, und das ist eine andere Baustelle.


## V6-S13 · 2026-08-07 · Props nach Regeln · Cartoon-Verformung · Gestaltwandlung

**Der Befund.** Georg am Bild: »gestackte Assets = Anti-Pattern, vor allem, wenn es das gleiche
ist« · ein Fels direkt vor einem Baum · »die Elemente sind nicht so schlau verteilt, dass man ein
Konzept erkennen könnte«.

**Die Ursache war eine Zeile.** Ein einziger Zufallswert je Feld entschied über Ja/Nein **und**
über die Sorte (`r<0.08 ? tree1 : tree2`). Benachbarte Felder haben ähnliche Werte — also standen
zwei gleiche Tannen nebeneinander, systematisch und nicht zufällig.

**Vier Regeln statt eines Würfels:**
1. Ein Prop **reserviert** seine Nachbarschaft (Baum und Fels Radius 2, Deko 1).
2. Kein Prop auf einer **Terrainkante** — Georg: »das bricht die Illusion, dass da wirklich ein
   Höhenunterschied wäre.«
3. Die Sorte kommt aus einem **eigenen** Hash und weicht dem zuletzt gesetzten Nachbarn aus.
4. Haine statt Gleichverteilung: das Dichtefeld entscheidet, die Reservierung dünnt aus.

| | vorher | jetzt |
|---|---|---|
| Baumpaare unter 70 px | mehrere gestapelt | **0** |
| kleinster Abstand zweier Bäume | ~0 px | **192 px** (3 Felder) |
| gleiche Sorte unter 100 px | systematisch | **0** |

**Cartoon-Verformung je Instanz** (§31.7): Breite **0,94–1,06**, Höhe 0,965–1,04, Scherung und
Neigung mit `tall` gewichtet — bei hohen Props trägt eine Biegung, bei flachen liest sie als
Fehler. **495 von 979** Sprites gespiegelt. Aus der Position gesät, also steht derselbe Baum immer
gleich. Der Anker ist der **gemessene Fußpunkt**, nicht die Bildmitte — sonst wandert das Ding beim
Skalieren vom Boden weg (§21.5: »der Rahmen ist kein Standpunkt«).

**Gestaltwandlung.** `heroUnit: random` ist der neue Standard: bei jedem Laden ein anderes Wesen.
Taste **V** wandelt zur Laufzeit. Der Pool sind **21 Einheiten** — alles außer den Heldenklassen
(die kennt man schon) und FrizzleBob (dessen Blatt läuft noch nicht rund). Die Liste steht im
Katalog, nicht im Runner; gewandelt wird über dasselbe Attribut wie im Wahlblatt, also über
denselben Ladeweg und mit derselben Doppelgänger-Regel.
Gemessen: `random` → `hero_skull` (Körper 86 px), **V** → `hero_thief`, keine Heldenklasse im Pool.


## V6-S12 · 2026-08-07 · Die Küste ist ein Gummiband

Georgs Idee, wörtlich: »Wenn wir die Sandfläche mit der Outline als mathematische Funktion sehen —
könnte sich das bei Kollision nicht wie ein Gummiband erst ausdehnen, ab einem gewissen Punkt
zurückschnappen und den Helden mit bouncy Cartoon-Physik wegkatapultieren?«

**Warum das hier billig ist.** Die Kontur IST schon eine Punktliste, und seit V6-S9 teilen sich
Fläche, Tuschefeder und Schlagschatten dieselbe. Eine Auslenkung je Punkt wirkt deshalb auf alle
drei zugleich: der Strand beult aus, die Linie beult mit, der Schatten auch. Es gibt keine zweite
Geometrie, die man synchron halten müsste. Der Umbau von S9 zahlt sich hier zum ersten Mal aus.

**Das Modell** (`overworld/rubber-coast.js`, rc-v1.0): je Konturpunkt eine Feder mit Ruhelage 0,
ausgelenkt entlang der Normalen. Eindrücken mit einer Glocke über die Nachbarn (die Breite der
Glocke IST die Steifheit des Geländes), Rückstellung leicht unterdämpft, Kopplung an die zwei
Nachbarn — ohne sie entstünde eine Zacke statt einer Welle. Über der Schwelle reißt die Kante und
gibt den aufgestauten Weg als **Geschwindigkeit** zurück, nicht als Positionssprung.
Gerechnet werden nur wache Punkte: eine Insel hat 5 173, und 5 160 davon liegen still.

**Zahlen am Bedienweg, nicht geraten.** Erste Fassung stand auf K = 42 / D = 5,2 — die Beule kam
auf **0,19 Felder (12 px)** und der Reißpunkt bei 1,35 wurde nie erreicht: die Kante war zu hart,
um sie überhaupt zu sehen. Im Gleichgewicht steht die Beule bei etwa v·D/K, das ist nachrechenbar
und war es auch. Weicher gestellt (K = 12, D = 2,6), Reißpunkt auf 0,62:

| Anlauf | Beule | reißt |
|---|---|---|
| 1,2 Felder/s (Schleichen) | **15 px** | nein, auch nach 300 Frames |
| 3,9 Felder/s (volles Tempo) | **40 px** | nach **18 Frames** (0,30 s) |

Die Kante gibt also nach, wenn man sich anlehnt, und wirft zurück, wenn man rennt. Ausschwingen
189 bzw. 275 Frames — sie wippt nach, statt satt zu stoppen.

**Zwei Fehler, die erst der Bedienweg zeigte** — die Zahlen oben stammen aus einer isolierten
Schleife über `push()`, und die belegt die Beule, aber nicht das Katapult:

1. *Der Kick schrieb in tote Felder.* `h.vx`/`h.vy` gibt es am Helden nicht; Stöße laufen in
   diesem Projekt über `OW_FEEL.knock` → `_kx`/`_ky` → `applyKnock` (dort gilt auch die
   Kollision weiter). Gemessen vorher: der Held bewegte sich in zwei Sekunden um **3,9 px**.
2. *Die Kante riss in JEDEM Frame.* Der Reiß-Zweig gab den Kick zurück, setzte die Auslenkung aber
   nicht zurück — die Schwelle blieb überschritten. Gemessen: **120 Aufrufe → 105 Kicks.** Jetzt
   wird die Spanne beim Reißen entspannt (Rest schwingt aus) und der Ring 0,45 s gesperrt.

**Abnahme über den echten Bedienweg** (Held an eine Südkante gesetzt, `keys={s}`, 130 Frames
`step(1/60)`): **130 Aufrufe → 1 Kick** · Spitzenrückstoß **1247 px/s** (ein Treffer stößt mit
150) · zurückgeworfener Weg **95,8 px** gegen einen weiterlaufenden Helden, also anderthalb Felder.

**Und noch drei, die erst beim Spielen auffielen** (Georg: »die ersten beiden Kollisionen
funktionieren gut, beim dritten ist er ganz nah dran, wird aber gerechnet, als wäre er mit Full
Speed gelaufen — und die Linie schnappt so zurück, dass eine Zacke entsteht«):

1. *Die Dehnung war nach oben offen.* Steht der Held schon an der Kante, ist der gemessene Weg
   null, also zählt die Wunschgeschwindigkeit — und die ist nach zwei Anläufen auf Vollgas. In
   einem Frame schoss die Auslenkung weit über den Reißpunkt, und weil der Kick aus `stored`
   kommt, wurde der Wurf zufällig riesig. Ein Gummiband hat eine maximale Dehnung; jetzt ist sie
   eine Zahl (`MAXDISP · 1,04`).
2. *Die Zacke.* Entspannt wurde über dieselbe schmale Glocke, mit der gedrückt wird — die Lösung
   war punktuell und hinterließ einen Riss in der Mitte statt einer auslaufenden Welle. Jetzt eine
   **doppelt so breite** Glocke, und die Rückstoß-Geschwindigkeit bekommt dieselbe Verteilung wie
   die Entspannung.
3. *Die Sperre hing an der Wanduhr.* `performance.now()` statt Spielzeit — in einer Prüfschleife,
   die schneller läuft als Echtzeit, feuerte nur der erste von drei Anläufen. Was in Spielsekunden
   gedacht ist, muss in Spielsekunden gezählt werden; die Uhr läuft jetzt in `step(dt)` mit.

Drei Anläufe hintereinander, gemessen: **1 / 1 / 1 Kick** · Rückstoß **1236 / 1236 / 1236 px/s** ·
Beule **41 px** · Weg **93,4 / 92,8 / 92,7 px**. Vorher: der dritte Anlauf war der Ausreißer.

**Und der Deckel selbst war die nächste Zacke.** Er stand in der Schleife, deckelte also JEDEN
Punkt einzeln — bei anhaltendem Druck lief damit die ganze Glocke in denselben Anschlag, und aus
der Kurve wurde ein Tisch: gemessen sechs Nachbarpunkte auf exakt 41,3 px (dem Deckelwert), dann
in einem Schritt auf 0. Ein Sprung von **100 %** der Höhe. Genau die Zacke, gegen die er gebaut war.
Jetzt wird die **Spitze** gedeckelt und das Profil aus ihr geschrieben — die Glockenform bleibt bei
jeder Druckstärke:

```
0 · 1,8 · 2,9 · 4,1 · 5,2 · 5,9 · 6,2 · 5,9 · 5,2 · 4,1 · 2,9 · 1,8 · 0   (px)
```

Größter Sprung 29,8 % statt 100 % — das ist die normale Abtastung einer Glocke bei 16 px
Punktabstand, keine Kante.

**Die dritte Zackenquelle war das Fenster selbst.** Die Schleife lief von −SPREAD bis +SPREAD, und
bei k = ±SPREAD stand die Gaußkurve noch bei **19 %** — dort sprang die Auslenkung in einem Schritt
auf 0. Nicht die Kurve war falsch, sondern ihr Abschneiden; das ist die »rechteckige Begrenzung«,
die Georg beschrieben hat. Das Fenster reicht jetzt über **drei Sigma** (Rest 1,1 %) und wird
zusätzlich mit einem Hann-Fenster multipliziert, das am Rand exakt null ist. Sigma selbst von 2,75
auf 4,4 Punkte: die Beule wird breiter und flacher, also organischer.

```
0 · 0,1 · 0,2 · 0,5 · 1,0 · 1,6 · 2,4 · 3,4 · 4,3 · 5,4 · 7,4 · 11,5 · 16,5 · 21,6 · 26,3 · 29,5
· 30,7 · 29,5 · 26,3 · 21,6 · 16,5 · 11,5 · 7,4 · 4,3 · 2,3 · 1,1 · 0,4 · 0,1 · 0        (px)
```

29 Punkte, größter Sprung **16,9 %**, größte Krümmung **7,5 %** (vorher 100 %). Georgs Regel
»Wellen sind okay, Zacken nicht« ist damit eine messbare Schwelle geworden.

**Der v6-Debug-Text lag noch über HUD v7** (»32 fps · 266 tiles …« unter dem Kompass). Ausgeblendet
wird er jetzt per **Regel**, nicht per Zuweisung: der Runner setzt `pill.style.display` beim
Aktualisieren selbst wieder auf `block`, eine einmalige Zuweisung hielt nicht. Gemessen: `.pill`
und `.pillslot` beide `none`, 0 × 0 px.


## V6-S11 · 2026-08-07 · Blauer Überläufer weg · HUD v7 als zweiter Skin · Wasser · Export

**Der blaue Überläufer an der Tuschekante** (Georgs Zoom): `fill()` mit Schatten füllt auch die
FLÄCHE in der Schattenfarbe — ein blaues Duplikat unter dem Sand. Wo der Sand an der Kante nur zu
90 % deckt (Antialiasing), blitzte es durch. Der Schatten wird jetzt mit einem **Clip auf das
Inverse** gezeichnet: die blaue Fläche liegt außerhalb und existiert nicht mehr im Bild.

**Die Feder skalierte mit dem Zoom** — und verletzte damit die eine Regel des Kanons: »Die Tusche
liegt auf der BILDEBENE, nicht in der Welt. Eine gezeichnete Linie auf Papier hat überall dieselbe
Feder.« Die Halbbreiten stehen in Feldern, also war die Linie bei Zoom 0,65 nur 1,3 statt 2 px und
verschwand neben dem Schatten. Der Zoom wird jetzt herausgerechnet.

**HUD v7 als zweiter Skin** (`hudSkin`: v7 Standard, v6 bleibt). Aus dem Übergabepaket:
`hud-v7.js` · `hud-slots.json` · `kfb-paper-atlas.js` (setzt `KFB_PAPER`, nicht `OW_PAPER` — zwei
Atlanten nebeneinander). *Falle:* beide HUD-Module melden sich als `OW_HUD` an, und die
Inline-Skripte im Helmet laufen **vor** den externen — die Sicherung unter zweitem Namen ging
deshalb ins Leere (gemessen: `OW_HUD_V7` war `hud-v5.0`). Jetzt meldet sich jedes Modul selbst
unter seinem Namen an. Beleg: `OW_HUD_V6 = hud-v5.0`, `OW_HUD_V7 = hud-v7.0`.

**Wasser: ein Wabern — nach zwei widerlegten Versuchen.**

*Versuch 1: parallele weiße Spiegelstriche.* Georgs Urteil: »genau das, was ich nicht wollte —
unabhängig von der Konstruktionsform weitere Konstrukte hineingebastelt.« Er hat recht: ein Strich
ist eine Behauptung über eine Form, und Wasser hat keine.

*Versuch 2: drei reine Sinuswellen, zweimal gekachelt und gegenläufig driftend.* Der Changelog-
Eintrag behauptete »eine Schwebung ohne Periode, die das Auge fassen kann«. **Am Bild gemessen kam
das Gegenteil heraus:** Streifenabstand 37,6 / 36,9 / 45,2 px bei Amplitude 131–143 Luma über drei
Zeilen im offenen Meer — ein diagonaler Cord. Der erste Term dominierte mit halber Amplitude alles
andere. Zwei regelmäßige Gitter übereinander bleiben zwei regelmäßige Gitter.
**Vierter Fall dieser Nacht, in dem der Changelog etwas behauptet, was der Code nicht tut** — und
der erste, den nicht Georg, sondern die Abnahme gefunden hat.

*Was jetzt gilt:* kachelbares Wertrauschen in drei Oktaven, zwei Lagen in verschiedenem Maßstab,
gegenläufig driftend, geclippt auf das Inverse der Landkontur. Keine Raumfrequenz dominiert, also
gibt es keinen Abstand, den man messen könnte. Kachelbar wird es dadurch, dass der Hash seine
Koordinaten modulo der Zellenzahl nimmt — sonst hätte die Kachel eine Naht, und eine Naht ist
wieder ein Gitter.
*Und die dritte Korrektur, an derselben Stelle.* Die erste Nachmessung lief über Bildzeilen, die
quer durch Küstenlinie, Strand und Sprites gehen — sie belegte gar nichts über das Wasser.
Gemessen wird jetzt **isoliert**: beide Lagen auf ein schwarzes 512er-Canvas über einem Feld ohne
jedes Land. Dabei fiel der eigentliche Fehler auf: die erste Fassung war von einem Gitter direkt
in die **Unsichtbarkeit** überkorrigiert (Maximalwert **5 von 255**, alle 262 144 Pixel im
untersten Achtel) — vier Reduktionen auf einmal statt einer.

| | Gitter (Sinus) | überkorrigiert | jetzt |
|---|---|---|---|
| Maximalwert auf Schwarz | — | **5** | **38** / 255 |
| Amplitude nach Trendabzug | 137 | 0–0,8 | **8,0** |
| Nulldurchgänge je 512 px | ~27 | — | **53** |

38 von 255 liest als Schimmer; 8 Luma Ausschlag bei 53 Nulldurchgängen ist ein Korn, kein Cord.
Kosten 0,5–0,9 ms.

**Export:** `export/overworld-v7_2026-08-07/` — 31 Dateien, Runner + beide HUD-Skins + Kartenkanon.

## V6-S10 · 2026-08-07 · Drop Shadow und Bevel — die zwei Photoshop-Griffe

Georg hat sein Rezept präzisiert: »Die Sandfläche duplizieren, mit einem Gaußschen Weichzeichner
versehen und ein paar Steps nach rechts und nach unten verschieben — oder in Photoshop direkt die
Drop-Shadow-Funktion nehmen.« Und danach: »Man könnte mit Bevel and Emboss auch eine gewisse Tiefe
erzeugen, obwohl man eigentlich nur Flächen hat.«

Beides hat Canvas eingebaut. Kein zweites Canvas, kein Nachbau.

**Drop Shadow** (`shadowColor/OffsetX/OffsetY/Blur`) statt der Stufenlösung aus S9. Höhe ein
Drittel größer: Sand 0,20 → **0,27** Felder, Gras 0,14 → **0,19**.
`lean: 0,34` gibt dem Versatz einen seitlichen Anteil — das Licht steht oben-links. Damit wird der
Schatten an waagerechten Kanten breit, an senkrechten schmal und an Nordkanten unsichtbar (er
fällt unter die eigene Fläche). Das ist Georgs »nach hinten dünner als wenn er von rechts oben
nach links unten läuft«, und es ergibt sich aus der Richtung — es muss nicht je Punkt gerechnet
werden.

*Fallstrick:* `shadowOffsetX/Y` werden von der Canvas-Transform **nicht** erfasst. Ohne den
Kamera-Zoom von Hand hineinzurechnen, wandert die behauptete Höhe beim Zoomen.

**Bevel & Emboss** als Regler `relief` (Standard an). Derselbe Schatten, nach innen: auf die
Fläche clippen, dann das INVERSE der Kontur füllen (Riesenrechteck mit der Kontur als Loch,
evenodd). Das Rechteck liegt außerhalb des Clips und ist unsichtbar — nur sein Schlagschatten
fällt nach innen. Zweimal: hell von oben-links, dunkel von unten-rechts.
Gezeichnet wird es **über** der Textur: es ist Licht auf der Fläche, nicht unter ihr.

Kosten: `draw` **1,0 ms** ohne, **1,2 ms** mit Bevel.

Bilder: `docs/img/terrain-drop-v6s10.png` · `docs/img/terrain-bevel-v6s10.png`.

## V6-S9 · 2026-08-07 · Terrain als Ebenenstapel — Georgs Modell, wörtlich

Georg: »Verabschiede dich mal von dem Grunddesign, das du jetzt iterativ in Richtung unserer Idee
zu bringen versuchst. Überleg mal, wie die Cartoon-Logik mit Outlines funktioniert, und bau ein
mehrschichtiges Modell — Ebene, Ebene, Ebene, jeweils mit einer Schattenfunktion, wenn es eine
Erhöhung gibt, und einer Outline, wenn man abgrenzen will. Das kann ich dir in Photoshop mit drei
Klicks anlegen.«

Er hat recht, und das Modell ist **weniger** Code, nicht mehr. Bis v3 war es verkehrt herum
gedacht: eine einzige Küstenkante, überladen mit Feder, Weichzeichnung und Tiefenverlauf — und der
Übergang Gras→Sand hatte gar keinen Schatten. Die Höhe kam aus einem Gradienten statt daraus, dass
jede Stufe ihren Schatten auf die darunter wirft.

**Drei Entscheidungen:**

1. **Flächen sind Vektor, nicht Maske.** Gemessen: der Clip auf die Kontur kostet **0,6 ms** je
   Frame (der Fill 0,7). Es gab nie einen Grund, die Kante an eine Backauflösung zu binden. Genau
   das war Georgs Zoom-Befund — das Wasser lief über die Outline, weil die Fläche eine 8-px-Maske
   war und die Linie ein Vektor. Zwei Genauigkeiten in einem Bild.
2. **Schatten sind hart.** Kein Blur, kein Verlauf: eine versetzte Kopie derselben Kontur in einer
   dunkleren Variante der Fläche darunter. Sand wirft 0,20 Felder auf Wasser, Gras 0,14 auf Sand.
3. **Die Outline ist optional** und liegt obenauf — eine Markierung, keine Konstruktion.

**Der Rahmen ist Wasser.** Ein Feld Rand wird erzwungen, damit jeder Ring geschlossen ist. Vorher
waren 2 von 28 offen, und ein offener Ring kippt die evenodd-Füllung des ganzen Stapels — der
gemessene Unsinn aus S7 (Landfläche kleiner als die Grasfläche darin). Jetzt: **0 offene Ringe.**

**Ersatzlos gestrichen:** `fieldMask`, `shallowFrom`, `shadowFrom`, `fill`, `scratchFor` und die
beiden 1920×1440-Masken. Das Backen der Flächen (474 ms je Welt) entfällt vollständig — es bleiben
die Konturen (258 ms). Modul von 528 auf **433 Zeilen**.

Der Tiefenverlauf im Wasser ist weg: er war ein Farbverlauf, und Georgs Regel lautet
»Schattenflächen, die keinen Farbverlauf haben, sondern einfach Höhe modellieren«. Den Tiefen-
eindruck macht jetzt der harte Sandschatten.

Bild: `docs/img/terrain-stack-v6s9.png`. Datei: `overworld/terrain-paint.js` (tp-v4.0).

## V6-S8 · 2026-08-07 · Kantenlogik: bündig, dünner, mit Tiefe — und der Cursor

Georgs Abnahme zu S7: »die Outline sieht jetzt tatsächlich ganz gut aus.« Vier Nachträge.

**Halb so dick.** `half` 0,030 → **0,015** Felder. »Sie darf dicker sein als die Baumkonturen, aber
nicht ganz so fett.« Bei TILE 64 sind das rund 2 px an der Licht- und 3,7 px an der Schattenkante;
eine Tiny-Swords-Baumkontur misst etwa 2.

**Keine Blitzer.** Das Wasser lief über die Outline hinaus, weil die Landmaske eine weiche Kante
hat und die Feder mittig auf der Iso-Linie liegt. Jetzt weitet `grow` die Landfläche **unter** die
Feder (0,011 Felder) und die Maskenkante ist von 0,18 auf **0,09** geschärft. Das ist `maskGrow`
aus dem Kanon: die Fläche geht bis unter die Tusche, nicht bis zu ihrer Mitte.

**Die Farbe ist abgeleitet, nicht erfunden.** `#4a3218` ist der Sandton `#d9bc8a` auf ein Viertel
Helligkeit. Georgs Regel: »eine dunklere Farbe von der entsprechenden Terrainfarbe ableiten, dann
haben wir eine klare Logik.« Was bei Biom-Übergängen passiert, steht noch offen — heute hat die
Küste eine Farbe.

**Tiefenverlauf im Wasser.** Ein Saum außerhalb der Küste, hell an der Kante, ins tiefe Wasser
auslaufend; er liegt **unter** dem Sand, nicht darüber. *Bezahlte Falle:* der erste Versuch nahm
den Feldwert als Abstand — aber `field` fällt draußen gegen −0,5 und nicht weiter, also war bei
einer Sollbreite von 1,7 selbst die offene See noch zu 70 % eingefärbt und das ganze Meer wurde
hell. Eine Alpha-Differenz ist keine Distanz. Jetzt aus der geblurten Maske.

**Der Maus-Cursor** war beim letzten Mal gemeint, nicht die HUD-Knöpfe: 28 → **40 px**
(`cursors-2d.js`). 40 ist die obere Grenze, die Browser noch als Cursor annehmen.

Feder 0,5 ms je Frame, 144 Quads. Bild: `docs/img/coast-v6s8.png`.

## V6-S7 · 2026-08-07 · EINE Kontur, und die Feder kommt aus dem Kanon

Georgs Befund zu S6: »die Linie ist offenbar in Stücken gedacht … keine Liniendicken-Variation,
kein Tapering … entspricht nicht mal annähernd der Küstenform … überhaupt keine Tusche-Dynamik,
und der Schatten fehlt komplett.« Vier Fehler, alle echt, alle behoben — und der Hinweis, der
alles löste, stand im selben Absatz: **beim CardBuilder funktioniert das schon extrem gut.**

**1 · Fläche und Linie waren zwei Konturen.** Die Fläche kam aus einem Canvas-Blur (8 px je Feld,
Rauschperiode 17,6), die Linie aus einem eigenen 3×3-Kasten (4 Punkte je Feld, Periode 8,8). Zwei
Modelle, zwei Formen — deshalb lief die Linie neben dem Sand her. Genau die Falle, die der Kanon
in Builder-Regel 4 benennt, und mein eigener Kommentar behauptete, sie zu vermeiden. **Dritter
Fall dieser Nacht, in dem der Kommentar etwas behauptet, was der Code nicht tut.**
Jetzt wird die Kontur einmal getract und die Flächenmaske aus **derselben Feldfunktion**
abgetastet — nicht aus den Polygonen. Gemessen: **1569 von 1569 Konturpunkten** liegen auf der
Alpha-Kante der Landmaske (vorher 244 von 1569).

*Zwischenfehler, bezahlt:* der erste Versuch hat die Ringe mit `evenodd` gefüllt. Bei 43 Ringen,
von denen einige am Kartenrand offen sind, kippt die Füllung — Landanteil 0,075 gegen Grasanteil
0,339, das Land war kleiner als das Gras darin. Eine Funktionsauswertung kann nicht kippen.
*Und noch einer:* die Kantenweichheit stand auf 1,3 statt 0,18, weil ich `field` für eine Distanz
hielt statt für eine Alpha-Differenz — der Übergang lief über 2,6 Felder ≈ 166 px, die Fläche
wurde nirgends deckend, der Sandsaum verschwand.

**2 · Falsche Familie.** S6 hat eine Polylinie in sieben Neigungsstufen gestrichelt — daher die
Brüche. Der Kanon sagt es in seinem eigenen Kopf: »Eine gestrichene Polylinie mit Punktrauschen
kann nie wie ein Pinselband aussehen — egal, wie man die Parameter dreht.« Jetzt ein **Band**:
Quad je Segment zwischen innerer und äußerer Offsetkurve, alle Quads in einem Pfad, ein `fill()`.

**3 · Tapering.** `inkHalfWidth` zählt Perioden **pro Umfang** (k ≈ 3–13). Auf einer Kartenkante
ist das die Dynamik; auf einem Inselumfang von hunderten Feldern ist eine Periode so lang, dass
die Linie im Ausschnitt gleich dick läuft. Die Halbbreite zählt hier in **Feldern**: lange
Schwellung alle 7, kurze alle 2,4, mal Neigung, mal Auslauf an offenen Enden.
Gemessen: **0,4 bis 11,7 px, Spanne 26 : 1** (vorher konstant).

**4 · Der Schatten ist zurück.** Dieselbe Maske, 0,22 Felder nach unten, 0,30 weich, unter dem
Land ausgestanzt. Einmal gebacken, nicht je Frame geblurt.

**Und der Preis, der beinahe alles gekostet hätte.** Chaikin vervierfacht je Durchgang: die
Inselkontur hatte **16 644 Punkte**, ein Pfad mit so vielen Quads kostete **1350 ms je Frame** —
das Spiel stand. Zwei Hebel: Ausdünnen auf einen Punkt alle 0,22 Felder (feiner als die Feder
breit ist) → 26 312 auf **5 173 Punkte**; und Sichtbarkeit in Kacheln zu 24 Punkten, sodass nur
der Lauf im Bild gezeichnet wird → **96–192 Quads** statt 16 644.
**1350 ms → 0,7 ms je Frame.**

Backen: Konturen 258 ms · Flächen 474 ms, einmal je Welt. Der Stilwechsel backt nur noch den
Schatten neu (Masken hängen nicht vom Stil ab — der erste Entwurf hat alles neu gebacken und das
Umschalten unbedienbar gemacht).

Bild: `docs/img/coast-canon-v6s7.png`. Datei: `overworld/terrain-paint.js` (tp-v3.0).

## V6-S6 · 2026-08-07 · Die Küste ist ein PFAD — S5 war ein Regress

Georgs Urteil zu V6-S5, am Bild: »die Küstenlinie ist noch pixeliger geworden, das wird verstärkt
durch diesen Schaum … das ist ein totales Anti-Pattern, das ist ein Regress.« Er hat recht, und
der Fehler war nicht die Feinabstimmung, sondern **der Kompromiss selbst**.

**Was falsch war.** S5 hat die Linie als Alphaband in die 8-px-Maske gebacken und beim Zeichnen
achtfach hochgezogen (Maske 8 px je Feld, Bild 64 px je Feld). Jede Weichzeichnung, die das Backen
braucht, wird dabei mitvergrößert. Ergebnis auf dem Schirm: ein verwaschenes braunes Kabel. Und der
Schaum, in **halber** Maskenauflösung gebacken, kam sechzehnfach hoch — ein Nebelstreifen. Alle
Messwerte aus S5 waren richtig; sie wurden nur an der Maske genommen, nicht am Bild. Eine Zahl aus
der falschen Auflösung ist keine Messung.

**Was jetzt gilt: eine Feder ist ein Pfad, kein Band.** Ein Pfad ist bei jedem Zoom scharf; ein
Band trägt die Weichzeichnung seiner Backauflösung mit sich herum.

- Marching Squares auf demselben weichen Feld, aus dem auch die Fläche kommt (eine Kontur für
  beides — Builder-Regel 4 aus dem Kartenkanon), 4 Abtastpunkte je Feld.
- Das Rauschen wandert aus der Schwelle **ins Feld**: `f = alpha − thr(x,y)`, Iso konstant 0.
  Marching Squares braucht einen festen Iso-Wert; dieselbe Kurve, nur anders aufgeschrieben.
- Chaikin 2× glättet die Zellentreppe zu einer Kurve.
- Gestrichen wird je Segment, in sieben Neigungsstufen gruppiert: Breite und Farbe folgen der
  Neigung. Licht von oben, Schattenkante breit und tief warm, Lichtkante dünn und hell — die
  Tannen-Logik, jetzt auf einem Pfad statt auf Alphapixeln.

**Gemessen** (240 × 180 Felder, Seed 7): 53 Linien · 27 476 Punkte · Zeichnen **1,1 ms Median /
1,8 ms Max** je Frame bei 62 fps. Flächenmaske 543 → **350 ms** (das Linienband entfällt).
Bild: `docs/img/coast-path-v6s6.png`.

**Schaum ist aus.** Er kommt wieder, wenn er ein Federstrich ist — kurze Züge entlang derselben
Kontur —, nicht als weichgezeichnetes Band. Der Backcode bleibt liegen, mit `foamPhases: 0`.

**Toter Code entfernt**, nicht auskommentiert: der ganze Alphaband-Zweig in `bakeMask` (`lw`,
`ink`, `WMAX`, `alphaAt`, die Linien-Leinwand). `hard` ist jetzt derselbe Pfad, nur schwarz und
ohne Neigungs-Bias — der Vergleichsmaßstab bleibt, das alte Verfahren nicht.

Datei: `overworld/terrain-paint.js` (tp-v2.0) · `overworld/overworld-game.js` (drawFoam raus).

## V6-S5 · 2026-08-07 · Die Küste als Federstrich — farbig, nicht schwarz

Georgs Befund am Bild: »diese abgesoffene Kante … das bricht in einer Pixeligkeit auf, die viel
größer ist als die des Sprites, und das würde ich als Design-Pattern ablehnen.« Und der Ausweg
stand im selben Absatz: »schau dir die Tannen an — da macht man die Outline oben farbig und nicht
schwarz.«

**Drei Regeln aus einer Zahl.** Die Neigung der Kante (Gradient desselben weichen Bildes, aus dem
auch die Schwelle kommt — keine zweite Kontur, kein zweites Modell) steuert alles:

1. Licht von oben. Wo das Land nach unten endet, liegt der Schatten: dort ist die Feder **dick und
   tief warm**. Die dem Licht zugewandte Nordkante läuft **dünn und hell** aus.
2. Kein Schwarz. Zwei Farben — `#40281a` und `#f2d6a0` — zwischen denen die Neigung mischt.
3. Die Breite atmet über die Länge (langsames Rauschen). Eine Feder, kein Offset-Pfad.

**Gemessen** (Nordkante = die 24 px über der obersten Landzeile jeder Spalte, Südkante entsprechend
darunter; 240 × 180 Felder, Seed 7):

| | Nord-Luma | Süd-Luma | Nord-Deckung | Süd-Deckung | Masse Süd : Nord |
|---|---|---|---|---|---|
| **feather** | **184** | **61** | 51 | 115 | **7,64 : 1** |
| hard (alt) | 22 | 22 | 125 | 123 | 1,03 : 1 |

Die alte Linie war an beiden Enden dasselbe Schwarz und dieselbe Dicke. Insgesamt **65 781 → 37 672
Linienpixel (−43 %)** — genau die Masse, die als »abgesoffen« auffiel.
Vergleichsbild: `docs/img/coast-feather-vs-hard.png`.

**Schaum ist an.** `drawFoam` lag seit V6-S2 fertig im Modul, wurde aber nie gerufen und mit
`foamPhases: 0` gebacken — drei Phasen tote Codezeilen. Jetzt drei Phasen, Sequenz 0→1→2→1
(das Wasser läuft auf und zieht zurück), gezeichnet vor der Feder: Schaum liegt auf dem Wasser,
die Kontur liegt obenauf.

**Der Sandsaum hat keine Kontur mehr** (`lw: 0`). Ein Saum ist ein Übergang, keine Grenze — und die
innere Linie lief auf dem 8-px-Maskenraster, also genau die gestufte Kante, um die es hier geht.

**Regler `coastInk`:** `feather` (Standard) · `hard` (der alte Stand als Vergleichsmaßstab —
ein Vergleich, den man nicht mehr ziehen kann, ist keiner) · `off`.

Preis: Backen 510 → **543 ms** je Welt (der Gradient), einmalig. Der Maskensatz wird beim
Stilwechsel freigegeben — ein Satz ist rund 22 MB.

Datei: `overworld/terrain-paint.js` (tp-v1.5) · `overworld/overworld-game.js` (`coast-ink`, drawFoam).

**Nachtrag, bezahlte Falle: ein Regler, den niemand erreicht.** Der neue `coastInk` war zunächst
tot. Die DC-Laufzeit schreibt Attribute **kleingeschrieben und ohne Bindestrich** — am Element
liegt `coastink`, nicht `coast-ink`. `observedAttributes` kannte nur die Bindestrich-Form, also
feuerte `attributeChangedCallback` nie und `att.coastInk` blieb für immer auf dem Konstruktor-Wert.
Der Präzedenzfall stand zwei Einträge weiter oben in derselben Liste: `hero-color`/`herocolor`
sind aus genau diesem Grund **beide** eingetragen — übernommen wurde stattdessen das Muster von
`town-color`/`world-size`, und die waren aus demselben Grund seit jeher tot.
Beide Schreibweisen sind jetzt registriert, für alle vier. Gemessen über den echten Bedienweg
(Attribut ohne Bindestrich): `coastink` hard/off/feather → `paintOpt.inkStyle` folgt jedes Mal ·
`worldsize=medium` → `att.worldSize` **medium** (vorher: blieb large) · `towncolor=Red` → **Red**.

## V6-S4 · 2026-08-07 · Den Spieler gibt es einmal · Blätter schließen daneben · Knöpfe zurück auf Maß

Drei Befunde von Georg zum Wahlblatt, alle klein, alle gemessen.

**Kein Doppelgänger.** Wer als Panda spielt, trifft keinen zweiten Panda. Gefiltert wird an drei
Stellen über **eine** Funktion (`notMe`): Zonen-Bestiarium, Elite, und die beiden Einzelwächter
(Turmtor, Kammer). Der Heldenwechsel baut die Welt nicht neu — der Zonenfortschritt hängt dran —,
also tauscht `purgeHeroTwins()` die schon stehenden Zwillinge gegen einen anderen Typ derselben
Zone. Gemessen: Held Panda → 36 Mobs vorher, **36 nachher**, `panda` in 0 davon.
Gefiltert wird gegen den Roster von **vor** dem ersten Wechsel (`z.roster0`) — sonst verlöre die
Insel bei jedem Wechsel einen Typ.

**Blätter schließen per Klick daneben.** Ein Zuhörer in der Erfassungsphase auf dem Shadow-Root
für Settings, Wahlblatt und Tagebuch. `composedPath()` statt `contains()` — im Shadow-DOM ist
`target` der Host, `contains` hätte immer falsch geantwortet. Der Klick wird gestoppt: wer ein
Menü wegklickt, will nicht gleichzeitig über die Karte losreisen. Gemessen: außen `flex → none`,
innen `flex → flex`.

**HUD-Knöpfe 30 → 40 px**, Glyphe 12 → 17. Sie waren gegenüber der 132er-Karte zu klein geraten.
Die Größe ist in allen drei Zuständen dieselbe, nur die Farbe wechselt — sonst springt der Knopf
unter dem Zeiger weg.

## V6-S3 · 2026-08-07 · Jede Einheit ist ein Held — Wahlblatt auf **C**

Georgs Wunsch: »ich hätte gerne die Option, dass ich als Charakter alle vorhandenen Entities
spielen kann — alles, was als animiertes Sprite mit Kampfbewegung verfügbar ist.« Umgesetzt als
**ein** Blatt, das zugleich die Mob-Übersicht ist, die im Handover offenstand.

**Die eine Liste.** `OW_UNITS.roster()` ist ab jetzt die Stelle, an der steht, wen es gibt.
Vorher stand sie **dreimal**: im Runner (`attributeChangedCallback`, Fallback auf `warrior`),
im HUD (Zyklus-Schalter, fünf Namen fest verdrahtet) und in den DC-Props (fünf Optionen). Drei
Listen, die beim nächsten Zugang auseinanderlaufen. Jetzt lesen alle drei von derselben Stelle.

**Was dazukam.** 5 → **28** spielbare Einheiten: Knights ×3 Klassen (Warrior · Archer · Pawn,
farbabhängig) · KFB ×4 (FrizzleBob · Rogue · Knight · Mage) · 20 Gegner aus dem Enemy Pack ·
das Schaf. Gemessen am echten Bedienweg (`setAttribute('hero',…)`, nicht über die API):

| Held | Ladeschlüssel | Körperhöhe |
|---|---|---|
| Troll | `hero_troll` | **177 px** |
| Warrior | `warrior_blue` | **91 px** (= HERO_REF) |
| Schaf | `hero_sheep` | **31 px** |

Die Größe bleibt die des Wesens — sonst wäre die Fraktionswahl ein Kostüm. Bezugsgröße der Welt
bleibt `HERO_REF = 91`; das Bestiarium skaliert nicht mit dem Helden mit (die Falle aus V5-S7).

**Eigener Cache-Schlüssel für Helden-Wesen** (`hero_` + id). Derselbe Goblin als Mob und als Held
sind zwei Einträge — `role` unterscheidet sich, und `loadUnit` cacht auf `id|refBody`. Ein
gemeinsamer Schlüssel hätte den zuerst geladenen für beide festgeschrieben.

**Der Zyklus-Schalter ist weg.** Bei fünf Namen war Durchklicken ein Bedienweg, bei 28 ist es eine
Strafe. Die HUD-Zeile öffnet jetzt das Blatt.

**Bezahlte Falle: eine geerbte CSS-Regel ist kein Zufall.** Die Vorschau-Kacheln lagen alle
**850 × 454 px** übereinander statt 96 × 108 im Raster — der Runner hat im selben Shadow-DOM ein
generisches `canvas{position:absolute;inset:0;width:100%;height:100%}` für die Spielfläche, und
jedes neue Canvas erbt es. Gemessen (28/28), nicht geraten; Gegenwehr steht als Kommentar in
`roster-sheet.js`, damit der nächste Zugang nicht dieselbe halbe Stunde zahlt.

**Abnahme:** 28/28 Kacheln gezeichnet (Alpha-Zählung je Canvas, keine leer), Wechsel Troll → Schaf
→ Warrior über den Bedienweg, Held lebt danach.

Dateien: `overworld/roster-sheet.js` (neu) · `overworld/units-catalog.js` (roster/isHero/heroDef)
· `overworld/overworld-game.js` (loadHeroUnit über den Katalog, Taste C) · `overworld/hud-skin.js`.

## V7-S1 · 2026-08-07 · Terrain Bake Lab — der Boden als Geometrie

`KFB Terrain Bake Lab.dc.html` (three.js 0.160, Masterplan §30). **Georgs Neudenken:** die Pixelkanten
sind ein Relikt — wir haben kein Raster, an das wir gebunden sind, sondern Pixel-Assets auf einer
Oberfläche. Diese Oberfläche ist jetzt Geometrie.

Was das Labor zeigt: Höhenfeld aus demselben Wasser/Sand/Gras-Modell (der Hang entsteht aus der
**Nachbarschaft**, nicht aus einem Filter über dem Bild) · Küste als Geometrie, kein Autotiling,
kein Schwellwert · Wasser mit Toon-Bändern und **Schaum aus einem echten Abstandsfeld** (Breitensuche
über das Wassergitter) — genau die Zahl, die dem 2D-Schaum gefehlt hat: *ein Abstand in Pixeln statt
einer Alpha-Differenz* · Tiny-Swords-Sprites als kameraparallele Flächen mit gemessenem Fußpunkt.
Regler: Kippung 15–72°, Ausschnitt in Feldern, Textur, Wasser, Besetzung.

### Vier bezahlte Fehler, alle dieselbe Familie
1. **`MeshToonMaterial` frisst die Palette** — Toon-Schattierung multipliziert, also war Gras bei
   Rampe 0,6 ein Braunoliv. Zweimal nachgeregelt, dann verworfen.
2. **Seit three r155 sind Lichtintensitäten physikalisch** — »etwas heller« ist keine Zahl mehr, die
   man raten kann. Konsequenz: die Schattierung wird **selbst in die Vertexfarben gebacken**, drei
   Stufen (0,86 · 1,00 · 1,10), ohne eine einzige Lichtquelle. Vorhersagbar, und der Toon-Look ist
   genau der gewollte.
3. **PBR-Texturen sind dunkel** — als `map` fressen sie die Palette wie in 2D (gp-v1.4). Also
   entfärbt und auf Mittel 232 gezogen: die Textur gibt Korn, die Palette gibt Farbe.
4. **`THREE.Sprite` ist bei orthografischer Kamera im Maßstab nicht vorhersagbar** (gemessen: 1,7×
   zu klein). Bei fester Kamera ist eine kameraparallele **Fläche** exakt — Ausrichtung ist eine
   Konstante (Drehung um X um −Kippung), und dann ist eine Welteinheit eine Welteinheit.

Dazu zwei Maßzahlen, die man sonst rät: **Zellenhöhe und Fußpunkt sind zwei Zahlen** (Warrior
192/96, Burg 320×256/249 — §21.5, der Rahmen ist kein Standpunkt), und **Spielmaßstab sind ~7,5
Felder Bildhöhe**, nicht 22 — wer die Optik beurteilen will, muss sie in dieser Größe sehen.

Offen: die Tuschekante als Kantenerkennung im Bild (ein Sobel über der Tiefe) — der eigentliche
Gewinn von §30, und der Grund, warum das in 2D dreimal misslang.

### V7-S1b · Nachtrag: drei Befunde aus der Abnahme, alle gemessen
1. **Das Bodenkorn war unter der Wahrnehmungsschwelle** — und der erste Fix war es auch noch.
   `Ground049A` hat selbst nur **Streuung 5,7** (das flachste der sechs Blätter), der Code dämpfte
   auf 45 %, also 2,6. Dazu **zweimal weggemittelt**: 512er-Backblatt auf ~128 px gezeichnet plus
   Mipmaps — genau der Fehler, der im Changelog schon steht (1024→64, 16:1), zum zweiten und dritten
   Mal.
   Der erste Nachbesserungsversuch war ebenfalls eine Behauptung: `repeat.set(W/2,H/2)` heißt
   »eine Wiederholung über zwei Felder«, aber **auf dem Schirm sind zwei Felder 53 px** — also
   weiter 2,4:1 verkleinert. Am Bild gemessen kam Gras bei sd 2,8/3,5/1,8 heraus.
   Was jetzt gilt: Backblatt **128 px**, `generateMipmaps=false`, **`NearestFilter`** (dieselbe Regel,
   nach der die Sprites scharf sind), die Wiederholung wird **aus Ausschnitt und Canvashöhe
   gerechnet** (eine Wiederholung = 128 *Bildpunkte*, zieht beim Zoomen mit), und die Zielstreuung
   ist **am Bild** eingestellt, nicht am Backblatt: 30 ergab Luma-Spanne 36 (zu wenig), 42 ergibt
   über mehrere sprite-freie Grasflächen **sd 8,0–9,9 / 10,2–12,6 / 5,2–6,4 · Luma-Spanne 48–52**
   (Sand 23,7–32,0 · Spanne 74–82). Abnahmemarke (sd ≥ 8 · Spanne ≥ 45) erfüllt. Der Blau-Kanal
   bleibt bei ~5,5 — arithmetisch zwingend, weil das Korn multiplikativ moduliert und Gras-Blau bei
   Mittel 71 gegen Grün 153 liegt (relativ 7,7 % gegen 7,1 %).
   Damit das überhaupt prüfbar ist, läuft der Renderer mit `preserveDrawingBuffer` — ohne ihn gibt
   `readPixels` nach dem Frame Nullen, und ein Labor, dessen Bild man nicht messen kann, ist eine
   Behauptung.

### V7-S1c · Der Rebuild-Pfad war unkontrolliert
Drei Defekte, eine Ursache: `rebuild()` hing an einem Regler, der nur die Kamera betrifft, gab nichts
frei und hatte keine Sperre über seinem `await`.

- **`tilt` baute die Welt neu** — Schieber 15–72 in Schritten von 1, und jeder Schritt fuhr `island()`,
  zweimal BFS über 10 800 Felder, eine 120×90-Geometrie mit Vertexschattierung und einen **Netzabruf
  der Textur**. Von der Kippung hängen genau zwei Dinge ab: Kameraausrichtung und Billboard-Drehung
  (samt Fußpunktverschiebung, sonst wandert der Stand). `retilt()` macht jetzt nur das.
- **Nichts wurde freigegeben.** `scene.remove()` löst die Verknüpfung, gibt aber Geometrie, Material,
  Shaderprogramm und Texturen nicht frei — bei einem Schieberzug dutzende Sätze auf der GPU, mit
  `preserveDrawingBuffer` zusätzlich Druck. `clearScene()` traversiert und gibt frei.
- **Keine Generationssperre.** Zwei schnelle Regleränderungen liefen ineinander: der zweite Durchgang
  leerte die Szene, der erste hängte danach seinen veralteten Boden wieder ein und überschrieb
  `groundTex` — womit `applyRepeat()` auf eine verworfene Textur zeigte und **genau der Korn-Fix
  still ausfiel**. Jetzt: Zähler vor dem `await`, Abbruch danach.
2. **Der Baum-Fußpunkt war geraten** (`cell*0.78` = 150 px). Am Alphakanal gemessen: **178 px**
   (92 % der Zelle). 28 px Fehler = 0,44 Welteinheiten — auf flachem Boden unsichtbar, am Hang nicht.
   Dieselbe Fehlerklasse wie `faceLeft:true`, in derselben Nacht.
3. **Das Standardbild zeigte die Kernaussage nicht.** Kamera und Besetzung standen in der Ringmitte,
   also war kein Wasser im Bild — der Schaum aus dem Abstandsfeld, der eigentliche Gewinn, ließ sich
   nicht beurteilen. Der Kamerapunkt wird jetzt **an der gemessenen Küstenlinie** gesetzt (erstes
   Landfeld von Nord in der Mitte, fünf Felder landeinwärts); Boden, Sprites, Küste und Schaum liegen
   in einem Bild.



## V6-S3 · 2026-08-07 · Die Kante hört auf, das Gitter zu verraten (und der Schaum wurde verworfen)

**Georgs Frage war die Diagnose:** »wieso ist die schräge Kante denn überhaupt so pixelig? wenn das
Gras ist, müsste die horizontale Kante auch irregulär sein.« Genau — eine Schwelle bei **konstant
0,5** gibt die Rasterkante zurück: waagerecht schnurgerade, diagonal als 8-px-Treppe. Weichzeichnen
machte daraus nur eine ausgefranste Treppe.

`terrain-paint.js` schwellt jetzt gegen ein **Rauschfeld**: grobe Bucht (Periode ~2 Felder, Amplitude
0,30) plus feine Franse (~0,7 Felder, 0,11), davor echte Weichzeichnung (`blur 4 px`). Die Kante ist
in beide Richtungen gleich unruhig — und **nur das Bild**: begehbar bleibt das Feldgitter, die Küste
darf wackeln, ohne dass die Wegfindung mitwackelt.

Dazu: Feldkanten (Licht oben / Schatten unten) sind im Malmodus **aus** — in einer Fläche, die gerade
deshalb gebaut wurde, damit man kein Raster sieht, wären sie waagerechte Linien
(`OW_GROUND.tileFor(key,seed,neutral,flat)`). Und der innere Tuschesaum Gras/Sand ist weg: ein
Übergang braucht keine Kontur, nur die Küste bekommt Tusche.

### Verworfen: Schaum aus der Maske
Die Tiny-Swords-Schaumkacheln sind 64er-Quadrate an einer Küste, die keine Quadrate mehr hat. Der
Versuch, den Saum als Band aus derselben Maske zu ziehen (drei Phasen, gestuft geschaltet), ist
**gescheitert und ausgebaut** — Georgs Urteil: eine weiße gezackte Linie, die über den Rand läuft und
den Effekt zerstört, der vorher gut war. Der Code bleibt als `drawFoam`/`foamPhases` im Modul, wird
aber mit 0 Phasen gebacken und nicht gezeichnet.

Zwei Befunde daraus sind trotzdem wahr und teuer bezahlt — *ein Abstand in Alpha ist kein Abstand in
Pixeln*: Bänder aus der scharfen Maske liegen alle innerhalb weniger Pixel übereinander, und Schaum
vor dem Land gezeichnet verschwindet unter der Sandfüllung. Wer es später erneut versucht, fängt
dort an — und **nicht**, während der Rest gerade gut aussieht.


## V6-S3 · 2026-08-07 · Die Kante hört auf, das Gitter zu verraten — und der Schaum kommt aus der Maske

**Georgs Frage war die Diagnose:** »wieso ist die schräge Kante denn überhaupt so pixelig? wenn das
Gras ist, müsste die horizontale Kante auch irregulär sein.« Genau — eine Schwelle bei **konstant
0,5** gibt die Rasterkante zurück: waagerecht schnurgerade, diagonal als 8-px-Treppe. Weichzeichnen
machte daraus nur eine ausgefranste Treppe.

`terrain-paint.js` (tp-v1.4) schwellt jetzt gegen ein **Rauschfeld**: grobe Bucht (Periode ~2 Felder,
Amplitude 0,30) plus feine Franse (~0,7 Felder, 0,11), davor echte Weichzeichnung (`blur 4 px` auf
der Maske). Die Kante ist in beide Richtungen gleich unruhig — und **nur das Bild**: begehbar bleibt
das Feldgitter, die Küste darf wackeln, ohne dass die Wegfindung mitwackelt.

### Der Schaum: eckige Wellen an einer runden Küste
Georg, 06:33: »nur die eckigen Wellen wirken noch odd.« Das waren die Tiny-Swords-Schaumkacheln —
64er-Quadrate an einer Küste, die keine Quadrate mehr hat. **Kein Shader nötig, der Schaum steckt in
derselben Maske:** drei Bänder auf der Wasserseite der Schwelle, in halber Auflösung gebacken, von
der Uhr **gestuft** durchgeschaltet (0→1→2→1, wie Pixelkunst es tut, nicht überblendet).

Zwei bezahlte Fehler auf dem Weg, beide dieselbe Ursache — *ein Abstand in Alpha ist kein Abstand in
Pixeln*:
1. Bänder aus der **scharfen** Maske lagen alle innerhalb weniger Pixel übereinander → fleckiger
   Saum. Sie brauchen eine eigene, kräftiger weichgezeichnete Vorlage (`blur S×1,6`).
2. Schaum **vor** dem Land gezeichnet verschwindet unter der Sandfüllung. Er gehört danach: Schaum
   schlägt über den Strand, er endet nicht davor.

Dazu: Feldkanten (Licht oben / Schatten unten) sind im Malmodus **aus** — in einer Fläche, die
gerade deshalb gebaut wurde, damit man kein Raster sieht, wären sie waagerechte Linien
(`OW_GROUND.tileFor(key,seed,neutral,flat)`). Und der innere Tuschesaum Gras/Sand ist weg: ein
Übergang braucht keine Kontur, nur die Küste bekommt Tusche.


## V6-S2 · 2026-08-07 · Terrain als Form statt als Raster — und FrizzleBob lief verkehrt

**Georgs Vorschlag hat den Knoten gelöst:** »die Texturen fürs Terrain ausprobieren, ohne die
Tiny-Swords-Tiles — dann sind wir visuell nicht an die Quadrate gebunden.« Genau so.

`overworld/terrain-paint.js` (tp-v1.0), umschaltbar über den Tweak `terrain` (`tiles` · `paint`):

Das **Landgitter wird bilinear ×8 hochskaliert und dann geschwellt**. Die Interpolation rundet die
Ecken, die Schwelle macht daraus wieder eine harte Kante — organische Küsten ohne Marching Squares,
ohne Splines, **ohne eine einzige geratene Zahl**. Und aus demselben Zwischenbild fällt die
Tuschelinie ab: sie ist das Band um die Schwelle. Zwei Maskenpaare je Welt, einmal gebacken
(gemessen: 240×180 → 1920×1440, unter 200 ms), danach drei Pattern-Füllungen je Frame statt
~350 `drawImage`.

Zonen füllen jetzt **an der Landmaske beschnitten** (`fillZone`) — ein Biom hat kein Rechteck mehr.
Das ist §27.1 in seiner billigsten Form: die Zone endet, wo das Land endet.

### Was die Bodenschicht davor kostete (gp-v1.1 → v1.4, alles Georgs Auge)
1. **Die pfahlen Rauten** waren `*_alpha`-Blätter, als Bild gezeichnet. Ein `_alpha`-Blatt ist eine
   **Graustufen-Maske ohne Transparenz** — `maskToDecal()` macht daraus jetzt Deckung, die Farbe
   kommt von uns, und die Polarität wird am Mittelwert **gemessen** statt geraten.
2. **»Giftig gelbgrün«**: die Schicht lag als `overlay` mit sattem Grundton auf der Pixelkunst. Korn
   darf nur **Helligkeit** modulieren — die Kachel wird jetzt entfärbt und auf Mittel 128 gezogen,
   dann färbt sie nichts mehr.
3. **Zwei Modi statt einem**: `grain` (soft-light, die Tiny-Swords-Kunst bleibt lesbar) und `wash`
   (deckend, für den Palettentausch). Wer alles als Wash zeichnet, löscht das, wofür er Tiny Swords
   gekauft hat.

### FrizzleBob lief immer verkehrt — und es war eine geratene Zahl
Georg: »nur FB läuft immer falsch rum«. Im Katalog stand `faceLeft:true`. **Am Blatt gemessen**
(Laufzeile, Zeile 1): FrizzleBob zeigt nach **rechts**, wie jedes Tiny-Swords-Blatt. Flag entfernt.

Dieselbe Fehlerklasse wie die Kachelindizes der ganzen Nacht: *eine Eigenschaft eines Bildes
behauptet, statt sie am Bild abzulesen.* Fünf Minuten Messen hätten Wochen Schielen gespart.


## V5-S15d · 2026-08-07 · Georgs Auge fand, was meine Messung nicht sah

Zwei Befunde von ihm, beide zutreffend.

**»da sind doppelte chars«** — der Mob wurde als ganzer 8-Frame-Strip gezeichnet, in allen 17
Vorschauen, quer über die Bodenfläche. Regression aus dem Fußpunkt-Edit: vorher stand
`fw: c.cell || img.height`, und `img.height` (192) traf die Frame-Breite eines waagerechten Strips
zufällig genau; der Edit nahm `img.width` — beim Torch Goblin **1536 = 8 × 192**. Die Frame-Breite
wird jetzt hergeleitet (`img.width % img.height === 0` → Strip), wie es die `probeStrip`-Regel im
`unit-loader` schon tut.

**»genau zwei, die eben nicht passen«** — das ist der eigentliche Fund. Bei `marble_cliff_03` steht
Naht 8,7 und Muster 28,5, beides gut, und **man sieht das Gitter trotzdem**. Der Grund: Naht prüft nur
die Kantenspalten. Ein großflächiger Fleck **in** der Kachel wiederholt sich beim Kacheln und wird zum
Gitter, ohne dass eine Kante etwas verrät. Meine zwei Zahlen konnten das nicht sehen, sein Auge schon.

Also eine fünfte Zahl: **Raster** = Streuung der Mittelwerte über 4 × 4 Blöcke. Über 9 sieht man es
immer, unter 5 nie — und sie **schlägt alles**: eine Fläche, deren Gitter man sieht, ist als Boden
erledigt, egal wie gut die übrigen Zahlen sind. Wirkung auf die Noten: vorher 1× A, jetzt **8× A,
3× B**, und die Reihenfolge stimmt mit dem Bild überein. `Onyx015` fällt auf B (Richtung 0,17 — die
Wellenlinien), `checkered_pavement_tiles` auf D (Naht 32).

**Was daraus für §26 folgt** — und es dreht die Erwartung: eine richtungslose, rasterfreie Fläche ist
per Konstruktion **unauffällig**. Das Interessante kann nicht aus der Grundtextur kommen, sondern nur
aus der Streuschicht (Decals) und der Licht-/Schattenkante je Feld. Wer eine »interessante« Basis
sucht, sucht das Gitter, das er nachher bekämpft.


## V5-S15c · 2026-08-07 · Georgs Haus, und zwei Fehler derselben Familie

**Schräg statt frontal, aber als Asset — nicht als Drehung.** Mein erster Versuch drehte das frontale
Haus um 11° im Bild (§17-Argument: verformt wird im Bild, nie in der Physik). Georg: »nein. ein
anderes asset, nicht das frontal haus drehen.« Mein zweiter Versuch nahm ein Top-Down-Vector-Prop —
ein Fremdpack, also Stilbruch. Seine Antwort war die Lösung:
`Tiny Swords (Free Pack)/Buildings/Black Buildings/House2.png` zeigt zwei Dachseiten und bleibt im
Bestand. Beide Häuser liegen jetzt im Labor, der Schalter wechselt.

**Größen: Zielhöhe in Feldern statt geratener Faktor.** Ich hatte `scale: 0.86`, dann `0.42`, dann
`tiles: 3` gesetzt — jedes Mal geraten, jedes Mal falsch (das Summer-Haus füllte die ganze Vorschau,
der Held war doppelt so groß wie im Spiel). Jetzt steht die **Zielhöhe in Spielfeldern** in den
Daten, und die Skalierung rechnet sich aus der gemessenen Körperhöhe: Held `91/64` und Goblin `84/64`
sind die Zahlen aus den `unit-loader`-Logs, nicht meine Schätzung. Häuser 2,1 und 2,0 Felder.

**Zwei Befunde des Prüfers, beide echt:**

*Die Kartenprobe war leer* — und der Changelog behauptete sie als geliefert. `items` ist kein State:
der Push allein rendert nichts, also existierte das Canvas noch nicht und `refs[name]` war
`undefined`. `drawAll()` im selben Tick übersprang deshalb **immer den jüngsten Eintrag** — maskiert,
weil Kandidatin *i* beim Messen von *i+1* nachgezeichnet wurde; sichtbar nur am letzten, dem
Kartenrücken. Jetzt `setState(…, () => this.drawAll())`: erst rendern, dann zeichnen.

*Der Fußpunkt war die Rahmenunterkante* — und der Kommentar berief sich auf §21.5, der genau das
verbietet. Gemessen standen die Figuren **62 px über** ihrer Bodenlinie, die unterste Kachelreihe
(25 % der Vorschau) blieb leer. Untereinander waren sie konsistent, deshalb sah man es nicht; §21.5
führt aber selbst die Zahlen, die das gleich brechen (CraftPix −20 px, FrizzleBob +11 px). Der
Fußpunkt wird jetzt gemessen wie im Loader — tiefster deckender Pixel, mit Log je Asset — und die
Zielhöhe zählt für den **Körper**, nicht den Rahmen.

**Beide Fehler sind dieselbe Familie wie die drei Kachelindizes dieser Nacht:** ein Zahlenwert
gesetzt, ohne ihn am Gegenstand zu prüfen. Der einzige Unterschied ist die Einheit.


## V5-S15b · 2026-08-07 · Georgs Kriterium war präziser als meine Messung

Seine Auswahl: `floor_tiles_06` · `rock_wall_16` · `PavingStones150` · `Ground049A` ·
`chipped_concrete`. Sein Grund, und das ist der Teil, der zählt: **»non-repetitive und mit klarer
Textur ohne Richtung passt am besten«** — plus Schachbrett als Sonderfall, weil es gegen die
Draufsicht arbeitet und deshalb in Escher-Räume gehört.

Meine zwei Zahlen (Naht, Ruhe) trafen das nicht. Papier gewann bei mir, weil es nahtlos und ruhig
ist — es ist aber auch flach und gerichtet. Beide fehlenden Kriterien sind rechenbar, also werden sie
gerechnet:

- **Richtung** = |gx − gy| / (gx + gy) über die Kantenenergie. 0,00 richtungslos, ab 0,25 zeigt die
  Fläche eine Achse — und eine Achse liest das Auge als Perspektive, die eine Draufsicht nicht hat.
  Das ist der Grund, warum gestreifte Böden in der Overworld falsch aussehen, und er ist jetzt eine
  Zahl statt eines Gefühls.
- **Muster** = mittlere Differenz der Kachel gegen sich selbst, um eine halbe Kachel diagonal
  verschoben. Niedrig heißt Raster, hoch heißt eigenwillig. Genau Georgs »non-repetitive«.

Die Note folgt jetzt seiner Reihenfolge: **erst richtungslos, dann nahtlos, dann ruhig** — ein
gerichteter Boden ist auch dann falsch, wenn er nahtlos ist. 17 Kandidatinnen, 1× A, 12× B; seine
fünf sind als »DEINE WAHL« markiert und über einen Schalter allein sichtbar. Aussortiert wird nichts:
ohne die Vergleichsfläche kann man ein Urteil nicht prüfen.

**Und die KFB-Karte als Terrain (sein Sonderwunsch).** `OW_CARD.back()` liefert sie ohne Deck-PDF —
Papier, Kanon-Kontur, Wortmarke. Sie wird **nicht gekachelt**: eine Karte hat ein Format
(`CARD_AR 1,74`) und liegt als Blatt, wie die Loot-Zone es vormacht (Zaun in Kartenform, 7 × 4
Felder). Naht gibt es deshalb keine, und die Tabelle sagt »—« statt eine Zahl zu erfinden; gemessen
wird nur die Ruhe, also ob Figuren darauf lesbar bleiben.

**Zwei Defekte aus S15 mit behoben** (Prüfer): das Hausdach war in allen 20 Vorschauen 13 px
abgeschnitten — die Vorschau ist jetzt vier Reihen hoch (256 px), weil ein 135 px hohes Haus in drei
Reihen nur passt, wenn es unten steht. Und der Goblin stand nach meiner letzten »Korrektur« **im**
Haus (Überlappung 55 px): er steht jetzt im freien Mittelband, das Haus eine Reihe weiter hinten, und
die y-Sortierung trennt sie wie im Spiel. Die Verschiebung vorher war eine Behauptung ohne Messung —
dieselbe Falle wie dreimal in dieser Nacht, nur in Pixeln statt in Zeilen.


## V5-S15 · 2026-08-07 · Textur-Labor — der Boden wird erzeugt, nicht geraten

Georgs Urteil nach drei Runden Kachelraten: farbige Blöcke tragen nicht, es fehlt ein
Texturkonzept — und zwar innerhalb des gegebenen Settings, nicht als Ersatz. Seine Formulierung ist
der Ansatz: *nichts aus fremden Blättern raten, den Boden erzeugen.*

**Neu: `KFB Texture Lab.dc.html`.** 20 Kandidatinnen aus `media/3D_Assets/Textures`, jede auf
**64 px verkleinert gemessen** — eine Textur, die als 1K-Bild nahtlos ist, kann es nach dem
Verkleinern verlieren, und gespielt wird auf 64.

Zwei Zahlen entscheiden:
- **Naht** = mittlere Farbdifferenz rechte gegen linke Kantenspalte plus oben gegen unten. Unter 8
  unsichtbar, über 20 immer sichtbar.
- **Ruhe** = Standardabweichung der Helligkeit. Darüber laufen Sprites mit 1-Pixel-Kontur: unter 18
  ruhig, über 35 frisst die Fläche die Figuren.

**Ergebnis: 15× A, 3× B von 20.** Papier führt — `Paper005`, `Paper001`, `Paper006`, alle Naht < 8
und Ruhe < 18. Zwei Funde über die Zahlen hinaus: **`Carpet016`** gibt dem Thronsaal ein echtes
Material statt umgefärbtem Gras, **`hessian_230`** (Sackleinen) ist altes Comicpapier für Asche-Zone
und brennendes Dorf. Und `Textures/decals/` liegt bereit: Kaffeering, Tintenspritzer, Kratzer,
Klebeband, Fingerabdruck — Papier-Vokabular, on-brand.

**Die Probe wird nicht am leeren Boden entschieden.** Auf Georgs Ansage setzt das Labor **Held, Mob
und Haus** aus dem echten Bestand in jede Vorschau (Pfade aus `units-catalog.js` übernommen, nicht
getippt — der erste getippte Skull-Pfad lud nicht), Raster und Besetzung je als Schalter. Erst mit
den Figuren darauf ist die Frage »trägt das?« überhaupt gestellt.

**Warum das die Fehlerquelle beseitigt:** eine Textur ist eine Fläche, keine Position in einem Blatt.
Die drei falschen Kachelindizes dieser Nacht waren Lesefehler, keine Materialfehler — und Lesefehler
kann man nur abschaffen, indem man nichts mehr zu lesen hat. Konzept als Masterplan **§26**, die
Absage an echtes 3D mit Begründung als **§26.2**.


## V5-S14 · 2026-08-07 · Dungeon-Editor — Georg baut, ich setze um

Georgs Befund: »deine Pixel-Architektur scheint immer erratischer zu werden«. Er hatte recht, und der
Grund ist messbar: das 16er-Pack legt **alles in ein Blatt** (`walls_floor`, 13 × 23 Kacheln), und ich
musste die Blockstruktur aus dem Bild ableiten. Ich habe sie zweimal falsch gelesen — Podest für
Mauer gehalten, Vorderwand falsch herum.

**Das 32er-Pack aus dem Repo löst das an der Wurzel**, und der Dateiname sagt schon, warum:
`wall-tiles-32x32.png` · `wall-transition-tiles-32x32.png` (die Übergänge, die ich mir bisher
zusammengereimt habe) · `ground-tiles` · `water-tiles` · `assets-all`. Getrennte Blätter statt eines
Bilderrätsels. Gemessen: Wand 4 × 9 Kacheln (Zeilen 0–1 Krone, 2–4 Wandfläche, 6–8 dieselbe Wand mit
Türbogen), Boden 7 × 14, Props 14 × 14.

**Die Maßstabsfrage, die Georg gestellt hat, und ihre Antwort:** Pixelgröße und Feldgröße sind zwei
verschiedene Dinge. 32er-Kacheln ×2 zu ziehen macht jeden Kachelpixel zu einem 2×2-Block — neben
Tiny Swords, das 1:1 gezeichnet ist, doppelt so grob. Ein 32er-Spielfeld wiederum machte den Helden
(91 px) 2,8 Felder hoch. Der dritte Weg ist der richtige: **vier 32er-Kacheln in ein Spielfeld.**
Kacheln 1:1, Gitter bleibt 64 px, Pixeldichte identisch — und das Autotiling läuft auf dem feineren
Raster, also können Mauern **halbe Felder** dick sein. Genau daran scheiterte das Bild vorher.

**Neu: `KFB Dungeon Editor.dc.html`.** Raster 28 × 20 Kacheln = 14 × 10 Spielfelder, zwei Gitter
(Kachel dünn, Spielfeld hell), Pinsel für Boden · Wand · Tür · Leer, Presets »Raum + Tür« (jeder
Dungeon beginnt damit) und »Arena«, Zoom 1–3×, Export als JSON.

**Set-Wechsel ist Daten, nicht Code** (Georgs FrizzleFrankensteining): die Blattnamen und
Kachelindizes je Pack stehen in einer Tabelle, ein Eingabefeld nimmt jeden anderen Pfad unter
`2D_Assets/`. Wer ein Set probieren will, tippt es ein.

**Der Editor ist auch Bühne:** Spawn-Marker plus sechs Signature-Mobs aus dem echten Katalog (Skull ·
Thief · Gnome · Bear · Spider · Minotaur) werden mitgesetzt und mitexportiert. Der Runner lädt den
Export als Arena, und der neue Kampf aus S12 (Fahrt · Kampfbremse · Bloodlust · Treffer-Stopp ·
Rückstoß) läuft darin — Probe-Kampf ohne Reisewege.

**Ein Fehler beim Bauen, sofort gemessen:** das Bodenblatt ist selbst ein Autotile-Set (Zeilen 0–3
glatte Fläche, 4–6 Pflaster), und ich hatte (1,1) genommen — die **texturlose** Fläche. Deshalb sah
der Boden nach einfarbigem Rot aus. Jetzt (1,5) mit einer zweiten Variante deterministisch gestreut.

**Offen:** die `wall-transition`-Kacheln sind noch ungenutzt (5 × 3, sie tragen die Innenecken) ·
Props aus `assets-all` als Pinsel · und der Runner muss den Export lesen lernen.

### S14b · Drei Nachbesserungen, alle vom Prüfer gefunden

**Die zweite Bodenvariante war eine Randkachel.** `(2,5)` gehört zum Boden-Autotile und zog einen
schwarzen Balken durch jede fünfte Kachel — im Bild regelmäßige Striche im Raster. Derselbe Fehler wie
`(1,1)` eine Stunde vorher: ein Kachelindex gesetzt, ohne ihn am Blatt zu prüfen. Die Streuung ist
raus, bis eine Vollkachel **gemessen** ist. Ein Index, den man nicht am Blatt geprüft hat, ist geraten.

**Der Set-Wechsel wechselte keine Sets.** `RF Catacombs` trug `wall: null` — ein Knopf, der eine
Auswahl versprach und nichts lieferte, weil ich das Verzeichnis nie aufgelistet hatte. Jetzt
aufgelistet (2026-08-07): **ein** Sammelblatt `mainlevbuild.png` plus `decorative.png` und animierte
Einzelteile (Kerzen A/B je 4 Frames, Fackeln 4, Spikes 5) — keine getrennten Wand- und Bodenblätter.
Die Blattnamen stehen jetzt drin, die Kachelindizes sind ungeprüft und **im Label als solche
benannt**. Und das Pfad-Feld nimmt jetzt Verzeichnis **und** Blattnamen (`dir/ | wand.png |
boden.png`) — vorher ersetzte es nur das Verzeichnis und lud weiter die caves-Dateinamen, taugte also
nur für einen Klon derselben Ordnerstruktur.

**Der Export trug keine Wände.** Die Legende führte `W: wall`, aber Wände entstanden nur im Zeichner
über die `isWall`-Heuristik — ein Runner hätte sie nachbauen müssen, genau die Doppelung, die in S13b
die Wandregel auseinanderlaufen ließ. Die abgeleiteten Wände gehen jetzt mit in den Export, samt
Zähler (`derivedWalls`). Wer den Export liest, sieht die Wände, die er sieht.


**Dritter Nachtrag: `tunnelLength: 0` wirkte nicht** — `const tunH=o.tunnelLength||6` schluckt jede
explizite Null, also kam mit 0 derselbe Raum heraus wie mit 6 (H = 17 statt 11), der Treppenschacht
blieb sechs Felder lang und 41 % der Abbildung standen leer. Dass der Changelog »und kein Tunnel«
behauptete, war die dritte Falschaussage derselben Klasse in dieser Session.

`??`-Semantik jetzt von Hand: `const num=(v,d)=>(v==null?d:v|0)` für `roomW`, `roomH`, `tunnelWidth`
und `tunnelLength` — ein Vorgabewert springt nur ein, wenn **nichts** übergeben wurde, nicht wenn
eine Null übergeben wurde. Ohne Tunnel liegt der Ausgang in der Südwand der Kammer selbst.
Gemessen: `tunnelLength:0` → **H 11** (Soll 11), `tunnelLength:6` → H 17, Tunnelhöhe 0.

## V5-S13 · 2026-08-07 · Biome-Labor — ein Kachelsatz, sieben Welten

Georgs KISS-Fund war der Ausgangspunkt und er trägt: **Gras königlich rot, Sand grau — und die
Overworld-Engine ist ein Thronsaal.** Kein zweiter Renderer, kein zweiter Maßstab, kein neues
Tileset. `KFB Biome Lab.dc.html` zeigt es an zwei Bildern nebeneinander: links Gelände mit
Autotiling (dieselbe Formel wie im Spiel, damit das Bild nicht lügt), rechts derselbe Ort als
Innenraum — Boden aus dem umgefärbten Gras, Wände aus dem Dungeon-Pack nach der Regel aus
`SSOT_Dungeon_Tileset` §3 (Krone von oben, Vorderwand nur unter der Nordkante).

**Die Technik ist ein Palette-Swap, kein CSS-Filter.** Jedes Pixel geht einmal nach HSL, Farbton
verschoben, Sättigung und Helligkeit skaliert, zurück nach RGB — **außer** es ist dunkler als die
Tusche-Schwelle. Damit bleibt die 1-Pixel-Kontur, von der Pixelart lebt, unangetastet. Ein
`hue-rotate` verschiebt sie mit und macht aus schwarzen Linien farbige; das war der Grund, den
CSS-Weg zu verwerfen. Die Schwelle ist ein Regler (0–120), damit man die Grenze selbst sieht.

**Sieben Presets, jedes mit Besetzung statt nur mit Farbe:** Utopia (Original) · **Thronsaal**
(−74°, 0,82, 0,78 auf Gras · Sand entsättigt auf 0,06) · Sumpf · Asche (das ewig brennende Dorf —
Warzone, Hölle oder Feuerquest) · Winter · Psychedelisch (BLÖDSINN! als Landschaft) · Graustufen
(alle Farbe heraus bis auf die Fackeln — was leuchtet, ist wichtig). Zu jedem stehen drei
Signature-Mobs, die Bauten, die Schrittklänge und der Farbakzent — Georgs Punkt, dass ein Biom
eine Persönlichkeit braucht und nicht nur einen Farbton.

**Was ohne Engine-Eingriff dazukommen kann** (aus Georgs Liste, im Labor als Weg benannt): Decals
über den Boden · Texturen aus `media/3D_Assets/Textures` als Overlay mit niedriger Deckung ·
Fackeln in Biomfarbe (das Feuerblatt ist gemessen) · Schrittklänge je Biom, auch absurd kombiniert.
Eine absurde Kombination ist billiger als ein neues Tileset und trägt weiter.

**Offen und als nächstes sinnvoll:** den Palette-Swap in den Runner ziehen (ein Tweak `biome`, der
`Tilemap_Flat` beim Laden einmal umfärbt) · der DIY-Drafter für Mini-Arenen, den Georg
vorgeschlagen hat — er hat ohne Palette nichts zu setzen, deshalb kommt er danach.

### S13b · Die Wandregel wird benutzt, nicht nachgebaut

Georg, direkt: »du hast die Wand-Logik immer noch nicht verstanden, oder?« — und er hatte recht. Der
Fehler war aber nicht Verständnis, sondern Bauart: **ich hatte die Wandregel im Labor nachgebaut,
statt sie zu benutzen.** Zwei Implementierungen derselben Regel driften auseinander; genau das war
passiert, während `dungeon-2d.js` sie korrekt hielt.

Behoben: `drawFloor` nimmt jetzt ein `override` für umgefärbte Blätter, und das Labor ruft es auf —
eine Implementierung für alle, die die Wand zeichnen. Dasselbe Prinzip wie beim Wegenetz, das mit
demselben A\* gelegt wird, das den Helden führt.

Und Georgs KISS-Idee liegt sichtbar **auf** dem Steinboden: der Dungeon-Boden bleibt Stein, das
umgefärbte Gras wird zum Teppich in der Kammer — und stößt nicht an die Wand, weil ein Teppich das
nicht tut. Zwei Materialien, ein Raum, ein Kachelsatz.

**Nachtrag (Prüfer):** das Innenraum-Panel stand im Wasser — `paint()` füllte die **ganze** Leinwand
in Wasserfarbe, und der Raum deckte sein Rechteck nicht aus (der 3 Felder breite Tunnel unter einer
7 Felder breiten Kammer ließ neun Felder frei, 9,8 % der Fläche). Zwei Hälften, zwei Gründe: links
Meer, rechts `OW_DUNGEON.DARK` — der Innenraum-Ton des Spiels, nicht ein erfundener. Und kein Tunnel,
denn ein Thronsaal braucht keinen Treppenschacht.

Im selben Zug die zweite Doppelung beseitigt, die derselbe Fehlertyp war: die **Autotile-Formel** lag
als Kopie im Labor, während der Runner sie modul-privat hielt. Ab `dg-v2.1` liegt sie als
`OW_DUNGEON.autoTile` an einer Stelle und wird exportiert. Wer eine Regel nachbaut, hat beim nächsten
Fork zwei Wahrheiten.


## V5-S12 · 2026-08-07 · Bewegung und Kampf sind Kurven, keine Schalter

Georgs Befund: »Animation und Kampf wirken noch sehr bulky und roh«. Der Grund war nicht die
Animation, sondern dass es dazwischen nichts gab — der Held wurde mit **fester** Geschwindigkeit
geschoben (`moveEntity(h,dx,dy,250,dt)`), ein Treffer war ein Zustand mit einer Uhr, und der Rückstoß
ein Positionssprung. Also nichts, woran das Auge Wucht ablesen könnte.

**Neu: `overworld/game-feel.js` (gf-v1.0).** Eine Tabelle statt Zahlen im Runner. Die Leitregel ist
Cartoon-Physik: **Anfahren dauert, Stoppen nicht** — ein Zeichentrickläufer nimmt Fahrt auf und steht
dann auf einen Schlag. Gemessen im Spiel:

| Kurve | Zahl | gemessen |
|---|---|--:|
| Antritt (0 → Basis) | 1400 px/s² | 250 px/s nach **0,18 s** |
| Auslauf (Basis → 0) | 2600 px/s² | 318 → 0 in **0,13 s** |
| **Fahrt aufnehmen** (Georg) | ab 1,1 s, Rampe 2,6 s, max ×1,45 | 250 → **361 px/s**, Faktor 1,44 |
| **Kampfbremse** (Georg) | ×0,62 bei Feind < 260 px | 363 → **225 px/s** |
| Betäubt | ×0,42 solange Treffer-Stopp läuft | — |
| **Bloodlust** (Georg, WoW-Logik) | +9 % je Kill, Deckel 34 %, Abbau 42 %/s | 2 Kills → **+18 %** |
| **Treffer-Stopp** | 70 ms · 110 ms ab Streak 3 · **140 ms** beim Kill | 0,07 / 0,14 s |
| Rückstoß | 230 px/s am Mob, 150 am Helden, Abbau 9,5/s | abklingend, nicht versetzt |

**Warum der Rückstoß eine Geschwindigkeit ist und kein Versatz:** ein Sprung sieht wie ein Fehler
aus, eine Bewegung wie ein Schlag. Geschoben wird über denselben `moveEntity`, also gilt die
Kollision weiter — niemand wird in eine Wand gestoßen.

### S12b · Der Rückstoß am Gegner war tot — im Slice für Trefferwucht

Selbst gebaut und vom Prüfer gefunden: `applyKnock` lief nur innerhalb von `drive()`, und `drive()`
gilt nur für den Helden. Die auf Mobs gespeicherte Geschwindigkeit wurde also **nie integriert** —
gemessen blieb `_kx` nach 600 ms exakt bei 230, der Gegner stand still. Das war schlechter als vor
S12, wo eine einzige Zeile im Trefferfenster ihn wenigstens versetzte, und es traf genau den Zweck
des Slices.

Behoben mit `OW_FEEL.tick(g,dt)`: ein Durchgang für Held **und** alle lebenden Mobs, aufgerufen nach
der Mob-Lenkung — sonst rechnet die KI gegen einen Schlag an. Die Kurve liegt jetzt wirklich an einer
Stelle, wie der Modulkopf es verspricht.

**Abnahme:** Impuls 230 px/s an einem stillgelegten Mob → **26 px Versatz**, `_kx` nach 520 ms auf
**1** abgebaut (vorher 230, unverändert).

### S12c · Die Fahrt brach nicht, wo sie brechen sollte

Zweiter selbst gebauter Fehler derselben Bauart: `_flow` wurde nur in `drive()` zurückgesetzt — und
`drive()` läuft nicht, solange der Held angreift. Gemessen blieb die Fahrt über den ganzen Angriff
auf voll, das Zieltempo im Kampf lag bei **225 px/s statt 155**: 45 % zu schnell, und damit genau
gegen Georgs Auftrag »verringerte Fluchtgeschwindigkeit im Kampf«. Modulkopf und Changelog
behaupteten beide, Angriff und Treffer setzten die Fahrt auf null — zwei von vier Fällen taten es
nicht. In einem Projekt mit der Hausregel »messen statt behaupten« ist das der schlimmere Teil.

Behoben mit `OW_FEEL.breakFlow()`, gerufen **wo das Ereignis entsteht**: in `tryAttack` und in
`damage`, wenn das Ziel der Held ist. Wer sich auf einen Frame verlässt, der in diesem Zustand nicht
läuft, dokumentiert eine Regel, die es nicht gibt.

**Abnahme:** Fahrt voll (Ziel 363) → Angriff → `_flow` **0**, Ziel **250**. Treffer am Helden →
`_flow` **0**. Kampfbremse ohne Fahrt: **155 px/s**, genau der Sollwert 250 × 0,62.

**Was die Fahrt unterbricht:** Stillstand, Angriff, Treffer und jeder Kill setzen sie auf null. Wer
Tempo will, muss ungestört laufen — genau Georgs Bild.

Das Abnahme-Blatt (`F`) zeigt die Werte live: Tempo, Fahrt, Kampf- und Betäubungsfaktor, Bloodlust,
Rückstoß. Damit ist die Choreografie messbar, statt nur gefühlt.

**Noch nicht gebaut, aber vorgesehen** (Georgs Kontext): Schleichen als Gegenstück zur Fahrt ·
Blut-Partikel und SFX auf den vorhandenen Treffer-Stopp legen · »golden sample fights« als Blaupause
für die Kampfchoreografie, aus der sich später die Afterglow-Nachstellung ableiten lässt
(Bullet-Time in 2D beim Kayfabulieren des Quest-Finales).

## V5-S11b · 2026-08-07 · Das Abnahme-Blatt schrieb in den echten Spielstand

Die Schalter gehen absichtlich über den echten Bedienweg — und `damage()` erreicht `killMob`, das
`autosave()` ruft. `autosave()` kannte aber nur den Innenraum als Grund zu schweigen. Damit
überschrieb ein Werkzeug, dessen Zweck »sehen statt spielen« ist, bei jeder Benutzung Georgs Datei:
gemessen wurde ein Stand mit **21 Diary-Einträgen, 6 Abilities und aufgebautem Ruf** durch einen
Testlauf ersetzt.

Behoben: jeder Schalter markiert die Sitzung als Prüflauf (`auditDirty`), und `autosave()` respektiert
das Flag genauso wie `interior`. Beim Öffnen des Blattes wird der echte Stand als Schnappschuss
gehalten und beim Schließen zurückgeschrieben. Wer einen hergestellten Zustand behalten will,
exportiert ihn — den Knopf gibt es.

### S11c · Der Schnappschuss war toter Code — und die Sperre unsichtbar

Der Wächter hieß `window.OWJ`, und **dieses Global existiert nicht**: der Journey-Modul heißt
`OW_JOURNEY` und ist im Runner über die lokale Konstante `OWJ` erreichbar. Beide Bedingungen waren
also immer falsch — es wurde nie ein Schnappschuss genommen und nie etwas zurückgeschrieben, während
der Changelog genau das behauptete. Dieselbe Klasse von Falschaussage wie in S12c, und diesmal in der
Zeile, die den Spielstand schützen sollte.

Was übrig blieb, war schlimmer als die Lücke: `auditDirty` sperrte den Autosave für die **ganze
Sitzung, ohne jede Anzeige**. Wer das Blatt einmal benutzte und weiterspielte, verlor jeden weiteren
Fortschritt lautlos.

Drei Änderungen: der Wächter benutzt die lokale `OWJ`-Referenz · das Blatt trägt im Prüflauf eine
sichtbare Zeile (»Prüflauf — nichts wird gespeichert. Dein Stand kommt beim Schließen zurück«) ·
und `askCaption()` schweigt im Prüflauf. Letzteres war ein Folgeschaden derselben Ecke: »Zone räumen«
löste das »LETTER THE PANEL«-Modal aus, setzte `paused=true` — und danach öffnete `F` das Blatt nicht
mehr, weil der Key-Handler bei `paused` aussteigt.

**Abnahme über den echten Bedienweg:** Blatt öffnen → Schnappschuss **gesetzt** · »Zone räumen«
klicken → Warnzeile erscheint, `ow_journey` bleibt bei 1360 Bytes, kein Modal, `paused` false ·
Blatt schließen → Save **identisch** mit dem Ausgangsstand.


## V5-S11 · 2026-08-07 · Abnahme ohne Reisewege + eine Statusseite statt Messprotokolle

Georgs Befund: »ich habe den Überblick verloren bei den Fixes & Iterationen« und »ich sehe am Ende
immer nur deine Mess-Protokolle«. Beides mein Fehler in der Darstellung, nicht im Code — Messzahlen
belegen eine Änderung, sie orientieren aber niemanden.

**`KFB Overworld Status.dc.html`** — eine Seite statt Changelog: was läuft (14 Punkte, jeder mit der
Zahl, die ihn belegt), was auf eine Entscheidung wartet (5 Fragen, ausformuliert statt angedeutet),
was bewusst offen liegt (7 Punkte, jeder mit Grund). Oben die nächste Entscheidung als Aufmacher,
unten die Tastenbelegung. Kein Verlauf, kein Beweis — Orientierung.

**Abnahme-Blatt im Spiel, Taste `F`.** Wer prüfen will, ob etwas gut ist, soll es sehen können —
nicht erst hinlaufen und kämpfen. Sechs Sprungmarken (Turm mit lebendem Türsteher · Turm-Inneres ·
nächste Kampfzone · Loot-Zone · Wirtshaus · Marktplatz), jede mit ihrem aktuellen Zustand als Notiz,
und vier Schalter, die den Zustand herstellen, den man sehen will (Türsteher fällt · Zone räumen ·
Level 6 · voll heilen). Darunter die Weltzahlen auf einen Blick.

**Es geht über dieselben Wege wie der Spieler** (`travelPoint`, `enterPlace`, `travelTo`, `damage`) —
eine Abnahme, die an einer API vorbeigeht, prüft nicht das Spiel. Das ist die Hausregel »über den
echten Bedienweg testen«, jetzt als Werkzeug statt als Vorsatz.

**Abnahme:** `F` öffnet, 10 Knöpfe, Klick auf »Turm · Türsteher« setzt den Helden **3 Felder** vor
das Tor auf begehbares Feld (vorher 27 Felder entfernt am Marktplatz).

**Nachtrag (Prüfer):** die Taste `F` stand nur auf der Statusseite, nicht im Spiel — ausgerechnet
das Werkzeug für »Freigabe ohne Reisewege« war nur auffindbar, wenn man ein zweites Dokument liest.
Jetzt in der Hinweiszeile (`F audit`, dazu das schon länger fehlende `H help`) und als eigene Zeile
im Settings-Blatt von `hud-skin.js`, wo die Tastenübersicht wohnt. Die Slice-Badges auf der
Statusseite waren mit Deckung 0,4 bei 10 px nur 3,27:1 kontrastiert — sie tragen die Nummer, mit der
man den Changelog-Eintrag findet, also 11 px und 0,68.

**Zweiter Nachtrag (Prüfer):** der Knopf »Level 6« machte **Level 8**, setzte `paused=true` und
hinterließ ein bildschirmfüllendes Level-Up-Blatt mit sechs offenen Entscheidungen — genau das
Mikromanagement, das das Werkzeug abschaffen soll. Ursache war die Bauart: er fuhr `gainXp(400)` in
einer Schleife, also **eine Spielhandlung statt eines Zustands**. Jetzt wird der Zielzustand direkt
gesetzt (Level, Slots nach `SLOT_LEVELS`, Stats, `maxhp` aus Fluff, Ladungen), kein Overlay, keine
Pause. Gemessen: LV 1 → **LV 6**, 1 → 3 Slots, 100/100 Fluff, `paused` false, Overlay `display:none`;
ein zweiter Klick meldet »Already level 6« statt weiterzulaufen.

**Die Lehre, die über diesen Knopf hinausgeht:** ein Abnahme-Schalter stellt einen Zustand her. Wer
ihn als Spielhandlung baut, erbt jede Nebenwirkung der Handlung — hier Pause, Modal und Überschuss.


## V5-S10 · 2026-08-07 · Nicht rauszoomen — die Welt vergrößern (Georgs Auflösungsbefund)

Georg: bei dem Zoom, bei dem der Raum gut verteilt wirkt, stören die repetitiven Muster und die
Outlines sind nicht mehr zu erkennen. **Der Befund ist richtig und die Schlussfolgerung auch:**
Tiny Swords ist für 1:1 gezeichnet — die Kontur ist ein bis zwei Pixel breit und überlebt keine
Skalierung, und das Grasmuster wiederholt sich alle 64 px, was beim Verkleinern zum Moiré wird.
Der Ausschnitt gehört also der Zeichnung, die Weite gehört der Karte.

**Zoom zurück auf 1** (der Wert, für den die Blätter gezeichnet sind) — und stattdessen die Welt
vervierfacht: **240 × 180 Felder** statt 120 × 90, umschaltbar über den Tweak `worldSize`
(small · medium · large · huge).

**Alles, was in Feldern gerechnet wird, wächst mit** (`worldK = W/120`) — sonst hätte die große
Welt feinere Buchten, einen dünneren Fluss und einen kleineren Wachturm als die kleine, und die
Form wäre eine andere Insel: Rauschfrequenzen, Küstenamplituden, Gate-Tiefe, Flussbreite,
Turmradius, Stadtradien, das Zonen-Kandidatenraster. Das A\*-Limit steigt von 6 000 auf 26 000
Schritte — ein Weg quer über die große Insel hätte sonst stumm aufgegeben.

**Gemessen bei `large`:** 240 × 180 Felder · 17 694 Landfelder · 6 Zonen im Abstand **61 bis 193
Feldern** (vorher 19 bis 32) · 162 Wegfelder · 393 Kacheln je Frame · **91 fps**. Die Reise ist
jetzt eine Strecke, kein Marktplatz.

**Offen und als nächstes sinnvoll:** das Grasmuster ist bei Zoom 1 als 64er-Kachelung sichtbar —
die Abhilfe ist Streudeko (Blumen, Steine, Büschel aus `Terrain/Deco`), nicht der Zoom. Die sechs
Stadt-Orte klumpen weiterhin am Nordufer; Georgs Bild von mehreren organisch gewachsenen,
kreisförmig verteilten Siedlungen ist ein eigener Slice.

### V5-S10b · Eine Insel, die zerfällt, ist keine Insel (Regression aus S10, sofort behoben)

Die vervierfachte Welt zerbrach: bei seed 7 zerfiel das begehbare Land in **vier Komponenten mit
13 753 · 3 085 · 251 · 7 Feldern**, eine Kampfzone lag auf der abgeschnittenen. Zwei Folgen, beide
schwer: die Insel konnte nie geräumt werden, und ein Klick auf die Zone in der Übersichtskarte
**teleportierte den Helden dorthin, ohne Rückweg**. Ursache war das Mitskalieren selbst — der
Gate-Einschnitt wurde doppelt tief, der Anydrus fünf statt drei Felder breit, und die Südwesthälfte
der Sichel hing an nichts mehr.

**Behoben an der Wurzel, nicht an den Formzahlen** (die beim nächsten Seed wieder kippen):
`connectLand()` zählt die Landkomponenten per Flood-Fill und bindet jede an, die eine Zone tragen
könnte (≥ 50 Felder) — 0-1-BFS über das Wasser zur nächsten Insel, die getroffene Strecke wird
**Brücke** (bis 6 Felder) oder **Sandbank** (darüber). Der Brückenmechanismus lag seit V1 im Runner
und hatte nur nie diese Aufgabe.

**Zwei Durchgänge, und der zweite ist der wichtige:** die Zonengräben werden erst nach dem Formen
geflutet, jeder mit genau einer Brücke — trifft die auf Wasser oder eine Ecke, liegt die Zone hinter
ihrem eigenen Gutter. Mit nur einem Lauf waren **8 von 16 geprüften Welten** kaputt.

**Abnahme über 20 Welten (4 Größen × 5 Seeds): 20 von 20 intakt** — genau eine große Landmasse,
0 abgeschnittene Zonen, 0 abgeschnittene Orte, der Held immer verbunden. Vorher: 8 von 16 kaputt.

Dazu zwei kleinere Sicherungen: `travelTo` lehnt ein Ziel ab, das nicht auf derselben Landmasse
liegt (»No way over« statt Teleport ohne Rückweg — die Hausregel gilt auch für die Karte), und der
Held startet **neben** dem Wegeknoten statt darauf: dort liefen alle sechs Speichen zusammen und das
erste Bild des Spiels war zu 19,3 % Sand, jetzt **9,2 %**.

### V5-S10c · Der zweite Verbindungslauf war die schlechtere Hälfte

Der zweite `connectLand()`-Lauf hat mehr angerichtet als geholfen, und der Grund ist strukturell:
ein Zoneninneres hängt **nur über seine Torbrücke** am Ufer. Für einen Flood-Fill sieht das aus wie
eine Insel — also »rettete« der zweite Lauf jede Zone mit einem zweiten Zugang. Im Log sichtbar als
sechs Komponenten von exakt **80 Feldern** (= Zonen-Innenmaß 10 × 8) und sechs `Brücke 1F`.
Spielseitig: sechs unbewachte Hintertüren, der Spieler läuft an jedem Torwächter vorbei (V3-S1),
und der Gutter der Comicseite bekommt Löcher (§3.2).

Brücken und `blocked` in den Begriff von »begehbar« aufzunehmen hat das nicht geheilt — also fliegt
der zweite Lauf raus. An seine Stelle tritt eine **Notbremse mit demselben `walk()`, das den Helden
führt**: ein Flood-Fill vom Helden aus markiert, was wirklich erreichbar ist; Zonen außerhalb werden
aus der Liste genommen. Lieber eine Zone weniger als eine Insel, die nie räumbar ist.

Zusätzlich: der Torsteg wird ausgebaut, bis er **echtes Ufer** trifft (ein Nachbarfeld quer zur
Richtung muss auch Land sein) — bei seed 13 war der Vorplatz selbst eine Sandbank im Meer und die
Zone hing an 81 Feldern Nichts. Und das A\*-Limit steigt auf 60 000 Schritte, weil ein Weg quer über
`huge` (320 × 240) sonst stumm aufgibt.

**Der Zonenverlust ist behoben, und die Ursache war eine andere als vermutet.** Zwei Fehlschüsse
vorweg, weil sie die Diagnose erzählen: die Torseite zu wählen statt zu würfeln half nicht (Schnitt
5,63 → 5,56), die Stege von Deko zu befreien auch kaum (→ 5,60). Erst die Messung an einer kaputten
Welt zeigte es: bei den verworfenen Zonen waren **Brücke, Vorplatz und Inneres alle begehbar** —
aber die ganze Gegend dahinter war vom Helden getrennt.

**Der Grabenring einer Zone ist ein geschlossener Wassergürtel. Sitzt die Zone auf einer Engstelle
des Utopia-Rings, zerschneidet ihr eigener Graben die Insel.** Bei small/2024 lagen drei Zonen so.
Der Gutter der Comicseite (§3.2) war die ganze Zeit auch ein Messer.

Behoben in `fits()`, wo es hingehört: der Rand wird **vier Felder** weit geprüft statt zwei, und mit
**94 % Land** statt 88 %. Viel Land ringsum heißt: keine Engstelle. Zwei Zahlen, eine Zeile.

**Abnahme über 48 Welten (4 Größen × 12 Seeds): 48 von 48 mit allen sechs Zonen** — 0 wegen
Platzmangel, 0 wegen fehlender Verbindung, 0 unerreichbare Zonen, 0 abgeschnittene Orte, 0
durchlässige Gebäude, genau ein Tor je Zone. Vorher: Schnitt 5,56 von 6, Minimum 3.
**Nachtrag:** diese Formulierung war zu absolut — gegen einen anderen Seed-Satz fand der Prüfer
`small/8080` mit einer verlorenen Zone. Der `fits()`-Fix drückte die Rate von ~10/24 auf ~1/24,
geschlossen hat ihn erst S10f.

Die Notbremse bleibt als Netz stehen — sie greift jetzt nur nicht mehr.

### V5-S10f · Der zweite Verbindungslauf gilt doch — und die Begründung dagegen war ein stale Log

Der schwerste Befund der Reihe, und er trifft mein Urteil, nicht den Code: in S10c habe ich den
zweiten `connectLand()`-Lauf entfernt, weil das Log »10 Komponenten ( …80/80/80… ) · Brücke 1F ×6«
zeigte — sechs unbewachte Zweittore. **Dieses Log stammte aus einem Stand vor dem Gutter-Guard.**
Ich hatte im selben Zug einen Startabsturz für einen Ladezustand gehalten und danach alte
Konsolenlogs gelesen. Eine Entscheidung auf veralteten Zahlen ist keine Messung.

Mit `if(gutter.has(j)) continue` kann der zweite Lauf die Zoneninneren nicht mehr für Inseln halten,
baut also keine Zweittore (gegengeprüft über 32 Welten: **0**). Nötig ist er, weil `addZone` die
Gutter erst nach dem Formen flutet und ein Gutter an einer Engstelle die Insel zerschneidet: bei
`small/8080` waren **832 von 4057 begehbaren Feldern — 20,5 % der Insel — unerreichbar.** Nicht
»eine Zone«, sondern ein Fünftel der Welt samt Bäumen und Deko, und nichts davon wurde sichtbar.
Eine einzige neue Brücke heilt es.

**Abnahme über 48 Welten (inkl. `small/8080`):** 0 kaputt · alle sechs Zonen und alle sechs Orte in
jeder Welt · **0 Zweittore** · unerreichbare Felder in Summe **81** über alle 48 Welten, schlimmste
Einzelwelt **6 Felder** (vorher 832 in einer). Die Notbremse greift nie mehr.

**Lehre für den Changelog selbst:** »48 von 48« war zu absolut formuliert. Eine Messreihe belegt den
Seed-Satz, den sie geprüft hat — nicht die Regel.

### V5-S10g · Ein Innenraum überlebt den Weltbau nicht

`buildWorld()` löschte `this.interior` und `this._outside` nicht. Stand der Held im Turm und drehte
man einen weltbauenden Regler (**seed · worldSize · zones · layout** — vier von zehn Tweaks), blieb
der Innenraum stehen: der Zeichenzweig malte den alten 13 × 17-Raum in ein 240 × 180-Kamerafenster,
`tiles` fiel von 108 auf **0**, der Bildschirm war schwarz. Und das nächste Betreten des veralteten
Ausgangsfeldes stellte `land`, `blocked`, `zones`, `places` und `decos` der **verworfenen** Welt
wieder her — der Seed-Wechsel wurde stillschweigend zurückgenommen.

Behoben mit zwei Zeilen am Anfang von `buildWorld()`: `interior`, `_outside`, `_exitArmed`, `king`,
`towerGuard` und `nearPlace` fallen weg. Die Hausregel gilt hier umgekehrt — **fällt der Rückweg
weg, wird der Auftrag abgebrochen**, statt auf einen Speicherstand von vorgestern zurückzukehren.

**Abnahme über den echten Bedienweg:** im Turm stehen, Seed 7 → 21 drehen. Vorher schwarzer
Bildschirm und stiller Rollback; jetzt `interior` und `_outside` leer, Welt 240 × 180, 262 Kacheln
gezeichnet, 6 Zonen, 6 Orte, Held auf begehbarem Feld.

### V5-S10h · `layout: noise` verlor die halbe Stadt — und alle Messreihen davor waren blind dafür

Bei `layout=noise` fehlten bis zu drei von sechs Orten, darunter der **Turm** (der ganze
Dungeon-Slice dieser Session), das **Archiv** (Seitenwechsel) und der **Friedhof** (Respawn) —
sichtbar nur als `console.warn`. Grund: ohne `cityAt` fällt die Stadtmitte auf `best` zurück, die
Radien 9–13 × `worldK` zeigen auf einer Rauschkarte ins Meer, und `snap()` gab nach 14 Feldern auf.

Der eigentliche Befund ist aber methodisch: **alle Messreihen dieser Session variierten nur `seed`
und `worldSize`.** »0 fehlende Orte« und »48 von 48« galten nur für `utopia` — die Achse, die den
Fehler trug, war nie in der Reihe. Ab jetzt ist `layout` Teil des Sweeps.

Zwei Änderungen: `snap()` sucht, bis die Insel abgesucht ist (Ringreihenfolge hält den Ort trotzdem
so nah am Wunschpunkt wie möglich — ein Ort weiter draußen ist besser als keiner), und ein fehlender
Systemzugang wird **im Spiel gemeldet** (Beat + Diary), nicht nur in der Konsole.

**Abnahme über 48 Welten mit `layout` als Achse (2 Layouts × 4 Größen × 6 Seeds):
0 fehlende Orte** (vorher 5 bei noise), 0 Zweittore, 1 fehlende Zone.

**Restfall, bewusst offen:** bei `noise` bleiben in 3 von 48 Welten 22–47 begehbare Felder
unerreichbar — Rauschkarten produzieren viele kleine Inseln, und `connectLand` bindet nur an, was
mindestens 20 Felder hat. Bei `utopia` (dem Spielmodus) sind es maximal 7 Felder je Welt. Die
Schwelle zu senken hieße Brücken zu Sandbänken bauen; das ist der schlechtere Tausch.

### V5-S10e · Jedes Reiseziel wird geprüft, nicht nur die Kampfzonen

Derselbe Soft-Lock wie eine Runde vorher, an der zweiten Tür: der Schutz saß in `travelTo`, aber die
sechs Stadt-Orte, das Wirtshaus und der Marktplatz gehen über `travelPoint` — und das setzte
`hero.x/y` **ungeprüft**. Gemessen bei small/66666: Klick auf den Garten in der Übersichtskarte,
Held landet im Wasser, 0 erreichbare Felder, kein Weg zurück, keine Meldung. Beim Turm hätte
derselbe Fall den ganzen Dungeon-Slice unerreichbar gemacht.

Drei Änderungen, eine Regel — **ein Ziel ohne Rückweg ist kein Ziel**:
- `travelPoint` prüft das Zielfeld und **weicht aus, statt abzulehnen**: das Klickziel liegt 70 px
  unter dem Ortsanker, also fast zwei Felder tiefer, wo Wasser oder ein Baum stehen kann. Erst wenn
  im Umkreis von drei Feldern nichts erreichbar ist, gibt es keinen Weg. (Der erste Versuch lehnte
  strikt ab — und wies damit auch erreichbare Orte zurück; gemessen und korrigiert.)
- `sameLand` fragt jetzt `this.reachable` (der Flood-Fill vom Helden aus), nicht mehr die
  Komponenten-Tabelle des Landformers. Ein Begriff von »erreichbar«, ein Ort.
- Die Notbremse prüft **Orte wie Zonen**: ein Ort, dessen Türfeld nicht erreichbar ist, wird auf
  erreichbares Land verschoben (Ringsuche bis 8 Felder) und nur entfernt, wenn sich keins findet.

**Abnahme: 48 Welten × 12 Reiseziele = 576 Reisen über den echten Bedienweg.** 0 Ziele im Wasser,
0 fälschlich abgelehnt, 0 fehlende Zonen, 0 fehlende Orte.

`_zonesPlaced` bleibt als Messpunkt im Stand (Zonen platziert, vor der Notbremse); die
Array-Kopie `_zonesAll` aus der Diagnose ist entfernt.

**Selbst gebauter Fehler in dieser Runde, gefunden vom Prüfer:** `connectLand()` liest `this.blocked`,
das erst 40 Zeilen später alloziert wurde — `undefined[97]` warf und brach die ganze `boot()`-Kette
ab, das Spiel startete nicht mehr. `blocked` wird jetzt gleich mit `land` angelegt. Lehre, die im
Projekt schon zweimal stand: eine Prüfung, die einen anderen Begriff von »begehbar« hat als
`walk()`, ist keine Prüfung — und wer sie nachrüstet, muss auch prüfen, ob ihre Daten zu diesem
Zeitpunkt existieren.


## V5-S9 · 2026-08-07 · Die Welt bekommt Luft (Georgs vier Befunde)

Georg: man läuft durch die Gebäude, der Türsteher ist hinter dem Kloster nicht zu sehen, die Welt
ist zu eng, und die Gebäude stehen beziehungslos herum. Alle vier gemessen, alle vier behoben —
und zwei davon hatten dieselbe Ursache.

**1. Der Ausschnitt war zu klein — nicht die Welt.** Bei Zoom 1 und 64er-Feldern sah man
**11 × 9 Felder**, bei einem Helden von 1,42 Feldern. Default jetzt **0,65 → 16,9 × 13,8 Felder**;
die Zoomstufen sind nach unten auf 0,4 und 0,5 erweitert. Georgs Instinkt vom Vortag war richtig,
und mein Gegenargument (»der Dungeon passt bei 0,8«) war das falsche Maß: der Dungeon ist ein
Zimmer, die Insel ist eine Reise.

**2. Die Orte standen 4 Felder auseinander — bei einer Burg von 5 Feldern Breite.** Mindestabstand
jetzt **9**; `snap` darf dafür bis 14 Felder weit suchen (vorher 5 — mit dem größeren Abstand hätte
sonst der zweite Ort keinen Platz mehr gefunden und wäre ersatzlos ausgefallen). Gemessen: engster
Abstand 4 → **9 Felder**.

**3. Man lief durch Turm und Wirtshaus — und der Grund war Punkt 2.** Jeder Ort setzte seinen
Fußabdruck und der nächste Bau räumte ihn mit `clearArea` wieder ab, weil die Aufräumzone (halbe
Sprite-Breite + 26 px ≈ 3 Felder) bei 4 Feldern Abstand über den Nachbarn reichte. Behoben durch
**zwei Durchgänge**: erst alle Orte setzen und aufräumen, dann alle Fußabdrücke sperren.
Der Abdruck ist zwei Felder tief (in der Draufsicht steht das Gebäude auf seiner Grundfläche, der
Rest des Blattes ist Höhe), das Feld vor der Tür bleibt frei. Gemessen: `walk()` auf dem Turmfeld
war `true` → jetzt für alle sechs Orte `false`.

**4. Wege statt Streusiedlung.** `buildPaths()` legt ein Speichenrad vom Marktplatz zu jedem Ort —
mit **demselben A\*, das den Helden führt**: was der Weg zeigt, ist genau das, was man gehen kann.
Ein zweiter Wegfinder hätte irgendwann eine andere Meinung als die Füße. Gezeichnet als Sandkachel
über dem Gras, dritte Schicht in der bestehenden Autotile-Schleife — kein neues Tileset.
Ein Feld breit gelegt: bei zwei Feldern wurde daraus mit den Autotile-Kanten eine Sandstraße.
**Nachtrag am selben Tag (Georgs Bild):** die Wege waren unterbrochen. A\* läuft achtfach, und zwei
diagonal versetzte Felder berühren sich nur an der Ecke — das Autotiling sieht dort keinen Nachbarn
in N/E/S/W und malt zwei abgeschnittene Stücke statt eines Weges. Jede Diagonale wird jetzt zum L
aufgefüllt. Gemessen: 77 Wegfelder, **0 ohne orthogonalen Nachbarn** (vorher isolierte Stücke),
6 von 6 Orten angebunden.

**5. Eine Stadt, eine Farbe.** Vorher stand ein rotes Haus neben einer blauen Burg, einem lila
Kloster und einem gelben Turm — vier Fraktionen auf einem Marktplatz. Amaurotum gehört dem Hof,
also trägt es dessen Farbe; Tweak `townColor` (Blue · Red · Yellow · Purple), Default Blue.

**Offen und ausdrücklich nicht angefasst:** der Innenraum aus S8b. Georgs Urteil steht
(»so nicht brauchbar«), und ich habe ihn nur in Screenshots gesehen, nicht gespielt — weiterbauen
hieße raten. Entscheidung dazu steht aus.


## V5-S8b · 2026-08-07 · Die Wand ist zwei Ebenen (Raum nach der Vorlage, §24)

Georgs Einwand: »lieber einen Raum sehen als die Assets« — und dazu zwei Promo-Bilder des Packs.
Die Bilder waren die Bauanleitung; eine Genre-Recherche hätte weniger geliefert, weil sie nicht
**dieses** Blatt zeigt. Was sie zeigen, ist ein Fehler in meinem eigenen Raum:

**Die Wand stand falsch herum.** Man blickt von unten auf den Raum, also zeigt die **Nord**wand ihre
Vorderseite (gemauert, mit Bögen, Türen, Fackeln) und die **Süd**wand nur ihre Krone von oben.
dg-v1.0 hatte es umgekehrt — und benutzte für die Mauer den Nine-Slice bei (0–2 × 5–7), der in
Wahrheit eine **zweite Höhenstufe** ist (Podest: Fläche, Sims, Vorderwand). Deshalb sah die Kammer
aus wie eine helle Platte mit hellem Rand.

**Zweiter Befund, größer als erwartet: `decorative_cracks_floor.png` heißt Risse und ist die
Bodentextur.** Zeilen 3–6 sind 32 vollflächige Steinplatten im Ton des Grundbodens, Zeilen 8–10
halbtransparente Flecken. Ohne sie ist der Boden eine leere Fläche — genau der Unterschied zur
Vorlage. Dichte gemessen am Bild: **38 % Platten, 16 % Flecken**; bei 100 % wird der Boden ein
Flickenteppich, bei 0 % eine Fläche.

**Dritter Befund: `fire_animation.png` ist ein Atlas, kein Filmstreifen.** Gemessen an den
Alpha-Läufen: vier Typen in den Spaltenläufen [5,28] [41,68] [87,121] [133,167], sechs Frames in
den Zeilenläufen ab y = 4 · 51 · 98 · 148 · 195 · 242, Höhe 39. Die Zellen sind **unterschiedlich
breit** — ein gleichmäßiges Raster hätte drei von vier Typen angeschnitten.

**Gebaut** (dg-v2.0): Wand als Aufdickung des begehbaren Bereichs (nach Norden 3 Felder, sonst 1) ·
drei getrennte Zeichendurchgänge Boden → Vorderwand → Krone · Bodentextur · Fackeln an der
Nordwand mit Lichtschein (Radialverlauf über 2,6 Felder — er macht mehr für den Raum als die
Flamme) · neun Requisiten aus `Objects.png`, nur einfeldrige Kacheln · Stufen **nur in der
Gangmitte** (drei nebeneinander lasen sich als Rost).

**Der Deko-Zeichner kann jetzt `sx` und `scale`** — ein 16er-Blatt auf ein 64er-Feld, ohne dass der
Renderer wüsste, aus welchem Pack die Kachel kommt. Fußpunktmessung und `dy` gelten unverändert.

**Abnahme:** Raum betreten, 13 × 17 Felder, 126 Kacheln im Bild, 9 Requisiten, 3 Fackeln, Rückweg
über das Ausgangsfeld → Welt vollständig zurück (120 × 90, 6 Zonen, 36 Mobs, 288 Dekos).

**Neu als Dokument:** `skills/SSOT_Dungeon_Tileset.md` — der Guide, den Georg vorgeschlagen hat,
entstanden beim Bauen: Maßstab, Blattmaße, die Wandregel, das Boden-Rezept, der Feuer-Atlas, die
Reihenfolge der Durchgänge und was noch brachliegt.

**Nebenbei entschärft:** der Türsteher hatte 34 HP und 7 Schaden und hat Georg erschlagen. Jetzt
24 HP, 4 Schaden, LV 1 — er steht im Weg, er tötet nicht.


## V5-S8 · 2026-08-07 · Der Turm hat ein Inneres (Mini-Dungeon, §24)

Der erste Innenraum steht: **Türsteher → Tor → Treppentunnel → Kammer mit Wächter → Rückweg an
dieselbe Tür.** Etagen, Boss, Schlüssel und Karten-Puzzle bleiben draußen (§24, Reihenfolge).

**Befund vorweg, der die Planung korrigiert:** §24 sprach von »einem Raum aus dem
Enemy-Pack-Interieur«. Den gibt es nicht. Gemessen am GitHub-Baum (2152 Dateien unter
`media/2D_Assets`): kein Pack mit Innenräumen — das Enemy Pack liefert Gegner, Zaun, Hütte und ein
Höhlen-*Sprite*, keine begehbaren Wände. Gebaut wird stattdessen auf dem Pack, das Georg am
7.8. nachgereicht hat: **`free-2d-top-down-pixel-dungeon-asset-pack`**.

**Der Maßstab ist eine Messung, keine Meinung.** Das Pack liefert 16er-Kacheln, die Overworld läuft
auf 64 (Tiny Swords). 16 × 4 = 64 — **ein Dungeon-Feld ist ein Overworld-Feld**, kein zweiter
Maßstab, keine zweite Kollision. Gegenprobe am Körper:

| Größe | gemessen | Verhältnis |
|---|--:|--:|
| Feld | 64 px | 1,00 |
| Held (`HERO_REF`) | 91 px | **1,42 Felder** |
| Kammerwächter (`skull`) | 86 px | 1,34 Felder |
| Türöffnung im Blatt (2 Kacheln) | 128 px | Held zu Tür **0,71** |

Damit ist Georgs Frage nach kleinerem Default-Zoom **nicht nötig**: der ganze Innenraum (13 × 18
Felder) passt bei Zoom 0,8 ins Bild. Der Zoom bleibt, wo er ist.

**Der Kachelvertrag** — abgelesen an `walls_floor.png` (13 × 23 Kacheln à 16 px), nicht geraten:
Boden-Nine-Slice (0–2 × 9–11) · Mauer-Nine-Slice (0–2 × 5–7) · Vorderwand (0–2 × 8) · dunkles
Tunnelset (0–2 × 0–2) · Treppe (2, 13). Die Treppe wurde **verglichen**, nicht gegriffen: (2,15)
sitzt in der Kachel links, (2,13) mittig — im Spiel war der Versatz sichtbar.

**Neu:** `overworld/dungeon-2d.js` (dg-v1.0). Es besitzt Grundriss und Bodenbild, sonst nichts.
Der Innenraum tauscht nur die zwei Felder aus, aus denen die Welt besteht (`land`, `blocked`);
A*, Fußpunkt, Mob-KI, Schatten, y-Sortierung und Kamera laufen unverändert weiter.

**Zwei Wächter, zwei Aufgaben.** Der **Türsteher** (`thief`, LV 2, 34 HP) steht draußen vor dem Tor
und lässt niemanden vorbei — `E` antwortet mit »The doorman stands where he stands«, statt zu
öffnen. Der **Kammerwächter** (`skull`, LV 3, 48 HP) steht oben. VIP-Kayfabe und Fluff-Bestechung
als zweiter und dritter Weg hinein sind notiert, nicht gebaut (§24.3).

**Der König steht oben auf dem Turm** — als Figur, nicht als Menüpunkt. Gezeichnet an seinem
eigenen y (Kronenmitte), einsortiert am Fußpunkt des Turms: sonst verschwände er hinter der Mauer,
auf der er steht. Höhe **gemessen** an der Burggrafik (320 × 256, Fußpunkt 249, Krone 148 →
**101 px über dem Boden**), nicht geraten. Sprite ist ein **Platzhalter** (Warrior Purple):
einen König gibt es im Bestand nicht.

**Zwei selbst gebaute Fehler, beide vor der Abnahme gefunden:**
1. *Der Türsteher war ein Beweisstück.* Seine Pseudo-Zone lief durch dieselbe Abschluss-Logik wie
   eine Kampfzone — ihn zu töten öffnete den Caption-Dialog und buchte eine Karte. Behoben mit
   `noProgress` auf der Pseudo-Zone; XP und Drops bleiben, der Fortschritt nicht.
2. *Ein Autosave hinter der Tür hätte die Insel gelöscht.* `captureJourney()` liest `this.zones` —
   im Innenraum ist das leer. `autosave()` setzt drinnen aus und buchte beim Verlassen nach.
   Gefunden durch Nachdenken über den Vertrag, nicht durch den Schaden.

**Abnahme über den echten Bedienweg:** `E` am Turm mit lebendem Türsteher → abgewiesen (Innenraum
bleibt aus). Türsteher gefallen → `E` → drinnen, 13 × 18 Felder, Kammer 11 × 9, Tunnel 3 × 7,
Wächter auf Position. Ausgangsfeld erst scharf, nachdem man es einmal verlassen hat (kein Umkehren
beim Eintreten). Zurück durch dieselbe Tür → Welt vollständig wieder da: 120 × 90 Felder, 6 Zonen,
36 Mobs, Held 72 px unter dem Tor.

**Offen:** die Kammer ist leer (Fässer, Kisten, Fackeln liegen in `Objects.png` bereit, die
`decoSpots` sind schon berechnet) · Türen als Sprite (`doors_lever_chest_animation.png`) ·
der Türsteher lebt nach jedem Laden wieder (nicht im Save-Vertrag) · der König tut nichts —
das Absetzen durch die Peasants nach jeder Entscheidung ist Spielinhalt, kein Rendering.


## V5-S7d · 2026-08-06 · Der Rahmen ist kein Standpunkt (Schattenkonzept korrigiert, §21)

Georgs Befund: die Schatten der drei neuen Helden sitzen **exzentrisch** und sehen aus wie ein
Weichzeichner; bei FrizzleBob leicht versetzt. Beides bestätigt, beides an der Wurzel behoben.

**Die Ursache war der Ankerpunkt, nicht der Schatten.** Der Sprite hing an `anchorX = fw/2` — der
**Mitte des Rahmens**. CraftPix legt die Figur aber nicht mittig ins 128er-Feld. Gemessen:

| Held | Fußpunkt | Rahmenmitte | Versatz |
|---|---|---|---|
| Rogue · Knight · Mage | 44 px | 64 px | **−20 px** |
| FrizzleBob | 107 px | 96 px | **+11 px** |
| Warrior (Tiny Swords) | 96 px | 96 px | **0 px** |

−20 px bei ~1,4facher Vergrößerung sind die 25–30 px, die man im Bild sieht. Und der Fehler war
größer als ein Schatten: **Trefferpunkt, Lebensbalken und Kollision** hingen an derselben Mitte.

- **Neu `unit-loader.probeFoot()`:** Mitte des **Fußbands** (dasselbe untere 8 % wie beim
  Schattentest). Nicht die Mitte des Körperkastens — ein erhobener Dolch oder ein Umhang zieht die
  quer, die Füße nicht. Ergebnis wird der Ankerpunkt (`footCx`), für jedes Feld mit der Breite des
  Idle-Felds; `footDx/footW` liegen am Unit-Objekt und stehen in der Konsolenzeile.
- **Kante statt Nebel:** der Verlauf lief ab 0,62 aus — das las sich als Weichzeichner. Jetzt bis
  `edge 0,84` voll deckend, dann in einem Schritt aus. Größe bleibt gemessen (0,30 · bodyW).
- **`dx` ist 0.** Die −2 px Versatz waren gegen die *Körpermitte* gemessen; der Ursprung ist jetzt
  der Fußpunkt, also gibt es keinen Grund mehr für einen Bias. Eine Korrektur, deren Bezug wegfällt,
  muss weg — sonst addiert sie sich still.
- **FrizzleBob sieht nach vorn:** `rows.idle = [0,0,1]` statt Spalte 6. Spalte 0 der Drehung ist die
  Frontansicht. Eine Fackel-Animation von vorn gibt es im Blatt **nicht** — je Ansicht ein Feld;
  ein flackerndes Front-Idle wäre erfunden, nicht geladen.

**Regel für alle künftigen Importe (Masterplan §21.5): der Rahmen ist kein Standpunkt.** Wo eine
Figur steht, wird am Fußband gemessen. Wer die Rahmenmitte nimmt, hängt Schatten und Treffer neben
die Figur — und zwar bei jedem fremden Pack anders, weil jedes Pack anders zentriert.
Beleg: `screenshots/0*-ow-v5-s7d-shadow.png`.

## V5-S7c · 2026-08-06 · Die drei sind da — und man kann sie im Spiel wählen (§19)

**Knight und Mage laufen**, und die Heldenwahl steht dort, wo sie hingehört: im **Settings-Blatt**
(⚙ neben der Minimap) als Zeile `Character`, die durch den Bestand blättert. Vorher lag sie nur im
Tweaks-Panel des Editors — für den Spieler unsichtbar. Die Liste wird **gelesen**
(`OW_HERO.HEROES` + Warrior/FrizzleBob), nicht im HUD zum zweiten Mal aufgezählt.

Gemessen: **Knight** `idle 12 · run 8 · attack 4 · hit 4 · dead 10`, 38 Anfragen / 470 ms,
Körper 56 → 91 px, `bodyW 99` · **Mage** `idle 14 · run 8 · attack 9 · hit 4 · dead 10`,
45 Anfragen / 619 ms, 56 → 91 px, `bodyW 81`; beide Schatten `ellipse`.
Beleg: `screenshots/0*-ow-v5-s7c-three.png`.

**Drei Packs, drei Namensregeln** — vorher geprüft, nicht angenommen (Rogue-Lehre aus S7):
- **Rogue:** `Attack1.png` **groß**, sonst klein. `Idle` 17 Dateien, Nummern 1…18 (11 fehlt).
- **Knight:** alles klein, aber `Attack` hat **vier** Dateien `attack0 · attack1 · attack2 · attack4` —
  die Zählung fängt bei **0** an **und 3 fehlt**. Wer zählt, lädt zwei 404.
- **Mage:** alles klein, `Attack_Extra` zählt ab **0** (0…6). Er hat zwei Ordner, die kein anderer hat:
  `Fire` (9) und `Fire_Extra` (9) — **`Fire` ist sein Angriff**, der Stab (`Attack` 7) bleibt für den
  Nahkampf im Vertrag. Das ist die Resonanz-Zuordnung aus §19, nicht meine Erfindung.
Fehlerklasse, die daraus folgt: **Dateinamen sind Daten, keine Konvention.** Drei Packs derselben
Familie widersprechen sich in Groß-/Kleinschreibung *und* Startindex — jeder Name gehört in den
Vertrag, jede Nummer wird gelesen.

Offen bleibt (unverändert aus S7): fertige Blätter gehören ins Repo (38–46 Anfragen je Held und
Sitzung), Lizenzdateien fehlen im Baum, und der Register-Split (§19.1) ist ein **Ort**, kein Modus —
die drei laufen bis dahin als Seitenansicht in der Draufsicht.

## V5-S7b · 2026-08-06 · Der Held bestimmt nicht die Größe der Welt (Review-Fix)

Befund aus dem Review: der Rogue las als **Mook** — 50 px Körper neben 71–111 px hohen Gegnern.
Kein Pixel-Symptom, ein Fundamentfehler: `reloadHero` lud den Helden **ohne** `refBody` (Maßstab 1,
also die rohe Körperpixelzahl des Packs — Rogue-Frames sind 128 × 128 mit viel Luft) und setzte
danach `this.refBody = heroUnit.srcBodyH`. Damit hing die Bezugsgröße der ganzen Welt am gerade
geladenen Held: in derselben Sitzung blieb er zu klein, in einer frischen wäre stattdessen **das
Bestiarium** auf ihn geschrumpft.

Jetzt ist die Referenz **eine Zahl an einer Stelle**: `HERO_REF = 91` — der gemessene Warrior-Körper,
gegen den das Bestiarium eingestellt ist. `reloadHero` lädt gegen sie und schreibt sie zurück, nie
`srcBodyH`. Nachgemessen über den Schalter: Rogue `src 50 → bodyH 91`, FrizzleBob `src 111 → 91`,
`refBody` bleibt in beiden Fällen **91**. Beleg: `screenshots/ow-v5-s7b-scale.png`.

**Und die Abnahmezahl aus V5-S7 war meine eigene Falle:** »Körper 50 → 91 px« stammte aus einem
Testaufruf mit `{refBody: 112}` — nicht aus dem Weg, den das Spiel geht. Die Hausregel »über den
echten Bedienweg testen« gilt auch für die **Messung**, nicht nur für die Bedienung: eine Zahl, die
über die API entsteht, belegt die API. Fehlerklasse dazu: **eine Bezugsgröße, die einem
austauschbaren Objekt gehört, skaliert beim Tausch die Welt** — Referenzen sind Konstanten.

## V5-S7 · 2026-08-06 · Held Nr. 1: der Rogue läuft (§19)

Der Rogue ist spielbar (Tweak `heroUnit: rogue`). Sein Pack liegt als **Einzelframes** im Repo, der
Loader will Streifen — `overworld/hero-frames.js` (**hf-v1.0**) legt sie zur Laufzeit **einmal**
zusammen und gibt Leinwände statt URLs. Gemessen: `idle 17 · run 8 · attack 7 · hit 4 · dead 10`,
**46 Anfragen in 644 ms**, Körper 50 → 91 px, `bodyW 84`, Schattenmodus **ellipse** (S4 zeichnet ihn —
der Held schwebt nicht).

**Drei Fallen, alle gemessen, keine geraten:**
1. **Nummern lesen, nicht zählen.** `Idle` hat 17 Dateien, nummeriert **1…18** — `idle11.png` fehlt.
   Wer aus der Anzahl die Nummern ableitet, lädt eine 404 und bekommt ein Loch im Lauf. Der Vertrag
   nennt die vorhandenen Nummern.
2. **Die Dateinamen sind nicht einheitlich:** `idle1` · `run1` · `hurt1` · `death1` klein, aber
   **`Attack1.png` groß**. Mit dem geratenen `attack1` lud der ganze Angriff nicht — **still**,
   weil ein fehlender Frame nur gezählt wird. Jetzt geprüft.
3. **Eigene Streifen werden nicht gemessen, sondern deklariert.** `probeStrip` liefert am
   Rogue-Idle (2176 × 128, 17 Frames) `fw 2176 / frames 1` — die Figur berührt an mehreren Nahtstellen
   den Rand, es gibt keine freie Grenzspalte. Bei `run` (1024 × 128) trifft die Messung 128/8 richtig.
   Der Loader nimmt jetzt `frameW` aus dem Vertrag, wenn es da ist: **Raten ist für fremde Blätter,
   für eigene ist es ein Fehler mit Zwischenschritt.**

**Ein eigener Fehler im Schalter:** der `hero`-Zweig kannte `'frizzlebob'` und sonst `'warrior'` —
fest verdrahtet. Ein neuer Held kam über den Tweak **nie** an (gemessen: `hero="rogue"` →
`att.hero 'warrior'`). Jetzt gilt, was es gibt: die Helden aus Einzelframes melden sich selbst an.
Nebenbei den fehlenden `loot`-Zweig ergänzt — das Attribut stand in `observedAttributes`, hatte aber
keine Wirkung.

**Offen und ehrlich offen:**
- **Lizenzdateien gibt es im ganzen Baum nicht** (Suche nach `licen|readme|terms`: **0 Treffer**).
  Die Guardrail §19.3 »Lizenzen zuerst« ist damit aus dem Repo nicht erfüllbar — Wunsch ans Repo
  steht in `github.md`. `KFB Rogue` liegt in einem KFB-eigenen Ordner und wird als Georgs Asset
  behandelt.
- **Die Blätter gehören ins Repo** (§19.3): 46 Anfragen je Sitzung sind der Preis des Zwischenwegs.
  Der Vertrag in `hero-frames.js` ist die Vorlage für den Sheet-Bau im Lab.
- **Register-Split** (§19.1) ist nicht gebaut: der Rogue läuft als Seitenansicht in der Draufsicht —
  wie FrizzleBob heute. Der Side-View bleibt ein **Ort**, kein Modus.
- `Attack_Extra 11 · High_Jump 12 · Jump 7 · Climb 4 · Push 4 · Run_Attack 8 · Walk 6 · Walk_Attack 6`
  stehen im Vertrag und warten auf ihren Ort. Knight und Mage folgen jetzt, wo der Weg steht —
  borromäisch heißt nicht: drei gleichzeitig anfangen.
Beleg: `screenshots/0*-ow-v5-s7-rogue.png`.

## V5-S6b · 2026-08-06 · Der Auslöser saß in der falschen Schleife (Review-Befunde)

Zwei Löcher in Variante A, beide im laufenden Spiel gemessen und beide dieselbe Ursache: **ein Test,
der an einer fremden Bedingung hängt.**

- **Ein Band von 61 px, in dem nichts geschah.** Der Betreten-Test hing in der Nähe-Berechnung, und
  deren Radius ist **118 px** — der innere Rahmen ist aber **179 px halbbreit** (`inner 358 × 166`).
  Wer von der Seite hereinlief, stand mitten auf der Karte, und die Regel schwieg. Beleg vorher:
  `x = p.x − 150` → `drin true`, `nearPlace false`, `reveal false`. Jetzt läuft der Test über **alle**
  Orte, unabhängig von der Sprechzeile; nachgemessen an derselben Stelle: `reveal true` im nächsten
  Frame.
- **Die Sprechzeile kam zu spät.** Auch der Hinweis hing an den 118 px, erschien also erst, wenn das
  Reveal schon lief. Die Reichweite ist jetzt **je Ort** bemessen: ein Gebäude ruft auf 118 px, eine
  Loot-Zone auf `max(w,h) · 0,6 + 80`. Gemessen: `Loot zone: walk in — the evidence lies inside` steht
  vor dem Tor.
- **Kein Riegel vor dem `await`.** `openLoot` wartet auf den Kanon-Import (mehrere hundert ms in der
  ersten Sitzung); geprüft wurde nur `!OW_REVEAL.open`, also rief die Schleife in **jedem Frame**
  erneut auf. Jetzt setzt `p.opening = true` **vor** dem ersten `await`. Abnahme: 1,5 s im offenen
  Reveal drin stehen → Diary `3 → 3`; schließen → `4`; weiter drin stehen → `4`. **Eine Zeile je Kiste.**

Fehlerklasse für die Liste: **wer eine Bedingung in eine fremde Schleife hängt, erbt deren Radius** —
und ein `async`-Auslöser braucht seinen Riegel vor dem ersten `await`, nicht danach.

## V5-S6 · 2026-08-06 · Die Loot-Zone IST die Karte (Variante A, §22.4)

Statt eines Möbelstücks liegt die Beute jetzt als **Ort** da: ein Zaun in **Kartenform**, innen die
**Kartenrückseite**, und **Betreten ist die Handlung** — kein Knopf. Tweak `lootStyle` schaltet zurück
auf die Kiste (`pen` ist Standard).

**Gemessen, bevor gelegt wurde:** das Zaun-Blatt ist **kein Streifen, sondern ein Rahmen** —
4 × 3 Kacheln à 64 px: Zeile 0 `Ecke · Riegel · Riegel · Ecke`, Zeile 1 `Pfosten · LEER · LEER ·
Pfosten` (die Mitte ist mit 0,00 Deckung wirklich leer), Zeile 2 `Ecke · halber Riegel (44 px, links
angeschlagen) · halber Riegel (42 px, rechts) · Ecke`. **Die zwei halben Riegel unten SIND das Tor** —
das Blatt bringt seine Öffnung mit. Hätte ich eine Kachel geraten, wäre ein Zaun ohne Tür entstanden.

**Kartenform aus einer Zahl:** `PEN_COLS 7 / PEN_ROWS 4 = 1,75` gegen `CARD_AR 1,74` — die Zone liegt
als Karte auf dem Boden, Tor unten in der Mitte.

**Die Rückseite gibt es im Repo nicht**, also zeichnet `OW_CARD.back()` sie (ci-v1.1): dasselbe Papier,
dieselbe **Kanon-Kontur**, in der Mitte die Wortmarke `KFB` + `cut & play`. Kommt ein echtes Blatt
ins Repo, ersetzt es die Funktion — der Builder malt heute nur die Vorderseite (Bauanleitung §8).
Sie liegt **flach** und wird deshalb mit dem Boden gezeichnet, nicht mit den Sprites.

**Ein eigener Fehler, im Bild sofort sichtbar:** die erste Zaun-Karte stand **mitten in der Lagune** —
die Zonenmitte ist bei `utopia` oft Wasser. Jetzt wird ein Platz **gesucht** (Ring um die Mitte, alle
Kacheln des Rahmens müssen begehbar sein); findet sich keiner, gibt es die Kiste. Lehre für die Liste:
**ein Ort, den man betritt, braucht Boden — Mitte ist keine Zusage.**

**Abnahme:** Zaun 7×4 auf Land, Tor Spalte 3, Rückseite innen, Hineinlaufen löst das Reveal aus
(`Evidence secured »ET TU, BRUTE?« · cave`), die Zone bleibt als Ort stehen, nur die Karte ist heraus.
Sprechzeile ohne `E` (Betreten statt Drücken), 59–80 fps.
Beleg: `screenshots/0*-ow-v5-s6-pen.png`.

## V5-S5b · 2026-08-06 · Drei Zeiger — und ein NaN, das eine ganze CSS-Regel kippt

`overworld/cursors-2d.js` (**cur-v1.0**): **default** (gelblich, `UI/Pointers/01`) · **hint** (etwas ist
erreichbar, `Cursor_02`) · **locked** (gesperrt, `Cursor_03`). Die Blätter sind 64 px — als Zeiger ein
Wandbild, und CSS kann einen Cursor **nicht** skalieren. Also wird jedes Bild einmal auf **28 px**
gezeichnet und als Data-URL gesetzt, der Griffpunkt **gemessen** (`probeBox`): default @10,7 ·
hint @9,7 · locked @7,6. Im Spiel gesetzt bei Nähe zu einem Ort (`hint`) und während eines Reveals
(`locked`).

**Zwei eigene Fehler, beide von der Sorte »die Szene besitzt ihre Leinwand«:**
- Erst hing der Zeiger an der **Leinwand** — die bekommt beim Ändern der Fenstergröße neue Styles,
  danach stand wieder `auto`. Jetzt hängt er am **Wirtselement** und wird geerbt.
- Dann war der Griffpunkt `NaN`, weil ich das Feld der Messbox geraten habe (`x0` statt `x`; die Box
  heißt `{x,y,w,h,bottom,cx}`). **Ein NaN im `cursor`-Wert macht die ganze Regel ungültig** — der
  Browser meldet nichts, es bleibt bei `auto`. Lehre: ein geratener Feldname fällt nicht dort auf, wo
  er steht, sondern zwei Ebenen weiter als »funktioniert einfach nicht«.
Abnahme: drei verschiedene Data-URLs am Element, 66 fps.

## V5-S5 · 2026-08-06 · Lootbox · Reveal-Schnittstelle · Vorhang — und die Karte ist die Kanon-Karte

Eine geräumte Zone legt jetzt eine **Kiste** auf den Boden. Wer sie mit **E** öffnet, sieht die Karte
der Zone als Blatt mit **der** KFB-Tuschekante — importiert, nicht nachgebaut.

**1 · Die Karte kommt aus dem Kanon** (`overworld/card-ink-2d.js`, **ci-v1.0**). `skills/kfb-ink-canon.js`
(Kanon-Version 2) und `skills/kfb-card-format.js` (`CARD_AR`) werden zur Laufzeit als ES-Module
importiert. **Gemessen:** über die Rohadresse schlägt der Import fehl, über `pages.dev` kommt er
sauber (`cdnOk true / rawOk false`) — die S3c-Regel gilt also auch für Code, nicht nur für Bytes.
Abnahme der Kante mit der Messvorschrift des Kanons selbst (`measureInk`):
**Familie Band · Bauchung 0,33 % (≤ 0,5) · Feder 1,39 % (1,2–1,8) · ok**, Blatt 517 × 900 bei
`CARD_AR 1,74`. Damit ist die Bauanleitung des Coworkers **in 2D validiert** — ohne Bug.
Was fehlt und ehrlich fehlt: das **Artwork aus dem Deck-PDF** (Builder-Regel 1: Text zuerst, Bild
später). Ohne Verbindung gibt es ein Blatt **ohne** Tusche und eine Warnung — keine selbstgebaute
Jitter-Schleife, das verbietet der Kanon zu Recht.

**2 · Eine Schnittstelle für jedes Aufdecken** (`overworld/reveal-2d.js`, **rv-v1.0**):
`OW_REVEAL.show({host, canvas, title, sub, mask, onClose})`. Lootbox heute, Ability und Level-Up als
nächstes, Dungeon-Seite später. Das Modul **pausiert nicht, sperrt keine Tasten, spielt keinen Ton** —
das gehört dem Aufrufer, sonst ist das Reveal in der nächsten Szene falsch.
**Maske #5 »Vorhang«:** eine Schwelle läuft von unten nach oben, die Kante ist **gerissen statt
geschnitten** (zwei langwellige Sinus + Rauschen je Spalte, gesät), an der Reißkante fliegen
Papierflocken. Zeitplan: Blatt steigt 0 → 0,42 s, Vorhang 0,18 → 1,25 s.

**3 · Die Lootbox ist ein ORT, kein neues System.** Sie hängt in `this.places` — damit gelten der
E-Weg, die Nähe-Erkennung und die Sprechzeile, die es längst gibt. Auf dem Boden liegt eine Kiste als
Deko mit gemessenem Fußpunkt; sie wirft den Schatten aus **S4**.

**Zwei eigene Fehler, beide gemessen gefunden — und beide dieselbe Klasse:**
*eine fremde Leinwand erbt die Regeln der Szene.*
- Das Blatt stand mit **Attribut 242 × 421**, aber **CSS-Box 924 × 540** da: die Spielszene stylt ihren
  Weltcanvas (`canvas{width:100%}`), und die Regel griff auf mein Blatt. Jetzt setzt das Reveal seine
  Maße **auch in CSS**.
- Danach saß die Karte **links oben statt mittig** (x 0 statt x 341): dieselbe Regel pinnt den
  Weltcanvas mit `position:absolute;inset:0`. Jetzt setzt das Reveal `position:relative`.
Lehre für die Liste: **wer eine Leinwand in eine fremde Szene hängt, muss Größe UND Lage selbst
setzen** — Attribute allein sind keine Geometrie.

**Save 2.3.0:** je Zone ein Feld `looted`. Ohne das wüsste ein geladener Stand nicht, ob die Kiste
schon offen war — sie stand entweder immer oder nie da. Alte Stände gelten als **geöffnet**: die
Karte war schon im Log, eine Kiste nachträglich hinzustellen wäre eine erfundene Belohnung.
Migrator `2.2.0 → 2.3.0` additiv.

**Abnahme über den echten Weg:** Zone mit `damage()` geräumt (4 Wächter) → Kiste liegt da
(`[loot] Kiste bei 4120,1310`) → `E` → Vorhang läuft → Karte steht, Ton, Diary-Zeile,
Kiste verschwindet, `paused` zurück auf den Stand davor, **91 fps**. Beleg:
`screenshots/0*-ow-v5-s5-reveal.png` (Kiste mit Schatten · Vorhang halb offen · Karte mit Bauchbinde).

**Offen:** das Kisten-Sprite kommt aus dem Summer-Tileset (Tiny Swords hat keine Kiste) — Stilbruch,
eine Zeile zu tauschen. Und die Lootbox gibt **nichts** außer der Karte: Beweisstücke sind keine
Powers.

## V5-S3g · 2026-08-06 · Der Browser im Splitscreen: dieselbe Liste dreimal

Georg arbeitet im halben Fenster — dort zeigte die Wurzelebene die Pack-Liste **dreifach**
(Leiste links, Chip-Reihe oben, Ordnerkarten im Grid). Behoben durch Zuständigkeiten statt Kosmetik:
- **Chips erst ab Ebene 1.** Auf der Wurzel gehört die Pack-Liste der Leiste. Innerhalb eines Packs
  zeigen die Chips genau das, was die Leiste nicht kann: die Animationen (`Attack 7 · Attack_Extra 11 ·
  Climb 4 · Death 10 · High_Jump 12 · Hurt 4 · Idle 17 · Jump 7 · Push 4 · Run 8 · Run_Attack 8 ·
  Walk 6 · Walk_Attack 6` beim Rogue).
- **Ordnerkarten nur, wenn nicht rekursiv gezeigt wird** — sonst stünde die Navigation zweimal im Grid.
- **Responsiv:** Leiste 196 → 150 px unter 1180 px, unter 900 px tritt sie ab und wird ein
  Auswahlfeld im Kopf (dieselbe Liste, ein Ort). Die Wortmarke weicht unter 1080 px.
- **Sortierung** nach Name (natürlich, `idle2` vor `idle10`), **Dateigröße** (die Tree-API liefert sie)
  oder Ordner. Filtern ist die Suche; ein Filter nach Messurteil bleibt Backlog — er würde 1713
  Blätter vorab messen.

## V5-S4 · 2026-08-06 · Bodenkontakt — der Schatten ist die Auflage, nicht der Schmuck (§21)

Georgs Befund: FrizzleBob und die drei Helden schweben, weil ihre Blätter keinen Schatten mitbringen.
Neu: `overworld/shadow-2d.js` (`OW_SHADOW`, **sh-v1.0**) zeichnet die Auflage zur Laufzeit — für
Blätter, die keine haben, und **nur** für die. Wer sie hat, bekommt nichts dazu (zwei Schatten wären
einer zu viel).

**Zuerst gemessen, dann gebaut — und die Messung hat das Konzept korrigiert:**
- **Mittig, keine Lichtrichtung.** Schattenmitte gegen Körpermitte an sechs Tiny-Swords-Blättern:
  −4,5 · −3,1 · −1,0 · −2,3 · +2,4 · −3,7 px bei Körperbreiten 43–115 px → Mittel ≈ −2 px. Das Pack
  zeichnet senkrecht von oben. Also **kein erfundenes Licht**, nur `DX = −0,02 · bodyW`.
- **Breite 0,49–0,56 der Körperbreite** bei Zweibeinern (Warrior 0,49 · Goblin 0,56), 0,80–0,93 bei
  Vierbeinern. §21 hatte `rx = 0,42 · bodyW` geschätzt (Durchmesser 0,84) — **falsch geraten**,
  korrigiert auf **0,30** (Durchmesser 0,60, gemessen 23,4 px bei 78 px Körper).
- **Deckung 0,30** in der Mitte, nach außen auslaufend; die gebackenen Bänder liegen bei 69–174.

**Die Erkennung ist eine Messung mit einer Schwelle in der Lücke** (`OW_LOADER.probeShadow`, im
Loader, wo auch der Fußpunkt gemessen wird — eine Messung, ein Ort). Band = unteres **8 %** des
Körpers: bei 16 % verwässern deckende Körperteile das Ergebnis (Pig Rider 0,25 — die Beine des
Schweins), bei 5 % liegt das Band unter dem Schatten (Spear Goblin fällt auf 0,24). Bei 8 % trennt es:
**gebacken 0,44–1,00** (Deckung 69–174) gegen **ohne 0,00–0,27** (Deckung 215–255). Schwelle:
halbtransparent ≥ 0,35 **und** Deckung ≤ 200.

**Abnahme (gemessen im laufenden Spiel):**
- **25 Einheiten geprüft: 23 gebacken, 2 gezeichnet** — `spider` (0 % halbtransparent, Deckung 255 —
  das Blatt hat wirklich keinen) und `frizzlebob` (0,27 / 215). Kein Sonderfall im Code: der Modus ist
  ein Feld (`shadow: 'baked' | 'ellipse' | 'none'`), Vorgabe aus der Messung, überschreibbar im Katalog.
- **Kopplung an die Physik, nicht an die Verformung** (§21.3): Ruhe `rx 23,4 · Deckung 0,300` →
  Höhe `z=1`: `rx 12,87` (**−45 %**), Deckung `0,135` (**−55 %**) → Aufprall `press=1`: `rx 28,55`
  (**×1,22**). Damit hat `land` aus §17 zum ersten Mal etwas zu zeigen.
- **Rückweg belegt:** `OW_SHADOW.enabled=false` → keine weiteren Zeichnungen, Held unverändert bei
  `x 4000 · y 1248 · hp 100`, **80 fps**. Die Physik wird nicht angefasst; der Schatten liest nur
  `x, y, bodyW`.
- **Im Browser sichtbar, bevor es im Spiel steht:** neue Zeile »Shadow« (gebacken/keiner mit den
  Zahlen), Umschalter »Shadow« in der Vorschau — bei gebackenen Blättern **gesperrt** mit Begründung.
  Der Kopier-Eintrag trägt `shadow:'ellipse'` mit, wenn das Blatt keinen hat.
  Belege: `screenshots/0*-ow-v5-s4-shadow.png` (Rogue mit und ohne Auflage, Goblin gebacken).

**Nicht in diesem Slice:** Requisiten und Deko (Tiny Swords bringt dort Schatten mit) · ein echter
Sprung (`z` ist verdrahtet und gemessen, aber die Draufsicht hat noch keinen Sprung — kommt mit
Arena/Papier-Riss) · Schatten im Seitenregister (§19.1).

## V5-S3f · 2026-08-06 · Null ist eine Framenummer

Ein Filter, der »größer als null« verlangt, wirft in einer Bildfolge den **ersten** Frame weg:
`KFB Mage/Attack_Extra` (`attack_extra0…6`) meldete »7 Einzelframes, Nummern 1…6« — in sich
widersprüchlich, und die Lückenrechnung wurde negativ, unterdrückte also die Warnung still.
Behoben mit `Number.isFinite` statt `n>0`; die Lücke wird geklammert (`Math.max(0,…)`).

**Abnahme, jetzt als Invariante gemessen** (Ansage muss in sich stimmen: `hi − lo + 1 − Anzahl ===
genannte Lücken`): **0 widersprüchliche Ansagen** über alle Einzelframe-Ordner.
Stichproben: Mage `Attack_Extra` »7 Einzelframes, Nummern **0…6**« · Rogue `Idle` »17, Nummern 1…18
(1 fehlen)« (es fehlt `idle11.png`) · Rogue `Attack_Extra` »11, Nummern 1…11« · alle `Run_Attack`
»8, Nummern 1…8«.

Fehlerklasse: **ein Wahrheitswert-Filter auf Zahlen verliert die Null.** `if(n)` und `n>0` sind keine
Prüfung auf »ist eine Zahl da« — bei Frame-Indizes, Koordinaten und Zählern ist die Null gültig und
oft der wichtigste Wert. Und: **eine Ansage, die sich selbst widerspricht, ist ein Testfall** — die
Invariante steht jetzt in der Abnahme, nicht im Auge des Lesers.

## V5-S3e · 2026-08-06 · Dieselbe Annahme, dritter Anlauf: der Unterstrich trennt nichts

S3d hat den Fall »kein Unterstrich« behoben und dabei den Fall »Unterstrich mitten in der Bildfolge«
liegen lassen. Gemessen über **alle 215 Ordner**: `KFB Knight/Run_Attack` (8 Dateien `run_attack1…8`)
lieferte einen Eintrag mit **acht gleichen Schlüsseln** in einem Objektliteral — der letzte gewinnt,
sieben Zeilen still weg, Einheit hieß »run« und hatte einen stehenden Frame. `High_Jump` und
`Fire_Extra` bekamen den falschen Hinweis. **40 von 40** Einzelframe-Ordnern mit Unterstrich waren
falsch behandelt.

Alle drei Fehler kamen aus **einer** Annahme: »der Unterstrich trennt den Namen«. Jetzt gilt:
- **Nummerierung erkennt man am Ziffernschwanz, nicht am Unterstrich** (`run_attack1` → Basis
  `run_attack`). Drei Dateien mit derselben Basis und verschiedenen Nummern = Bildfolge.
- **Figurenname = alles vor dem ersten Unterstrich, aber nur wenn der Rest eine bekannte Animation
  benennt** (`Bear_Attack` → Bear, `Turtle_Guard_In` → Turtle, `Pirate Tower_Ground` bleibt ganz).
  Blind schneiden war Falle 1; blind **nicht** schneiden machte in der Zwischenfassung aus jeder
  Datei eine eigene Einheit (`bear_attack:{name:'Bear_Attack'}`). Geprüft, nicht geraten.
- **Doppelte Schlüssel werden abgewiesen** und als Kommentar ausgewiesen, statt sich im Objekt
  gegenseitig zu überschreiben. Ein stiller Verlust ist schlimmer als eine sichtbare Lücke.

**Abnahme über alle 215 Ordner:** 76 Einzelframe-Hinweise (die drei Held-Packs) · 52 Katalog-Einträge,
davon **40 mit zwei oder mehr Animationen** · 87 ehrliche »Namen erst klären«-Hinweise (Requisiten,
Porträts, Tower-Teile) · **0 doppelte Schlüssel · 0 leere `anims` · 0 Ausnahmen**.
Stichproben: `Caveborn/Bear` → `bear:{name:'Bear'}` · `Caveborn/Turtle` → `turtle` (mit
`guardIn/guardOut`) · `Pig Rider Spear Goblin` → `pig_rider` · `KFB Rogue/Idle` → »17 Einzelframes,
Nummern 1…18 (1 fehlen)« — die Lücke wird **genannt**, nicht geglättet.

Fehlerklasse für die Liste: **eine Annahme, die an einem Pack stimmt, ist keine Regel.** Der
Unterstrich trennt bei Tiny Swords Figur und Animation, bei CraftPix gehört er zum Namen der
Bildfolge. Wer sie an einem Bestand prüft, prüft nichts.

## V5-S3d · 2026-08-06 · »Entry: folder« log bei genau den Packs, die als nächstes dran sind

Abnahme von S3c: der Ordner-Eintrag lieferte für `KFB Rogue/Idle` ein leeres `anims:{}` und die Zeile
»0 Dateien«, obwohl **17** im Ordner liegen. Zwei Fehler in einer Funktion:

1. **Stamm ohne Endung, Vergleich mit Endung.** `stem='idle1'` gegen `'idle1.png'.split('_')[0]` —
   bei Tiny Swords fällt das nicht auf (`Bear_Idle.png` → `Bear`), bei jeder Datei **ohne
   Unterstrich** war die Gruppe immer leer. Die Endung gehört auf **beide** Seiten. Klassenlehre:
   ein Vergleich, dessen zwei Seiten unterschiedlich normalisiert sind, funktioniert nur zufällig.
2. **Ein Ordner aus Einzelframes ist keine Einheit, sondern Rohstoff.** Selbst mit korrektem Stamm
   wäre `idle1…idle17` zu einer Figur mit **einem stehenden Frame** geworden. Der Browser sagt jetzt,
   was fehlt, statt etwas Falsches anzubieten: erkannt wird ein Einzelframe-Ordner (≥ 3 durchnummerierte
   Dateien ohne Unterstrich, ≥ 60 % des Ordners), die Ausgabe verweist auf §18.3 (Sheet legen, Contract
   schreiben) und nennt die Zahl der Anfragen, die der Einzelweg kosten würde.
   Dritter Fall dazu: lässt sich aus den Namen **keine** Animation ableiten, sagt der Browser genau das
   — »Namen erst klären, dann Eintrag — nicht raten«.

**Abnahme über den echten Bedienweg (fünf Ordner):** `KFB Rogue/Idle` 17 Dateien → Einzelframe-Hinweis ·
`KFB Knight/Attack` 4 → Einzelframe-Hinweis · `Caveborn/Bear` 3 → `bear:{…anims:{attack,idle,run}}` ·
`Goblin Raiders/Spear Goblin` 4 → `spear_goblin:{…}` · `Enemy Avatars` (Porträts) → ehrlicher Hinweis
statt Eintrag. Kein Ordner liefert mehr einen leeren Block.

## V5-S3c · 2026-08-06 · Quellen an einen Ort — und zwei Fehler aus Georgs Sicht

**Zwei Bugs zuerst, beide am Grund behoben.**

1. **Ein leeres zweites Feld war kein Feld.** `KFB Knight/Attack/attack1.png` (128×128) wurde als
   **Streifen mit 2 Feldern** ausgegeben und mit einem leeren Frame abgespielt. Ursache: die
   Schnittsuche kennt zwei Strengegrade — der lockere erlaubt **Leerfelder**, weil Rowsheet-*Zeilen*
   kurz sein dürfen. Für Streifen war das falsch angewandt. Jetzt macht **nur der strenge Schnitt**
   einen Streifen; der lockere bleibt dem Raster. Der Befund verschwindet nicht, er wird ehrlich:
   `Single image · no cut without empty fields — 64 px would split into 2 fields, 1 of them empty`.
   Gegenprobe: attack1 **Single image** · attack0 Single image · Spear Goblin_Attack Fast weiter
   **Strip, 7 Felder** · FrizzleBob weiter **Grid 192, Zeilen [7,6,6,6,6]**.
2. **Der Kopierknopf log.** Er hing an `this.sh.activeElement` — im ShadowRoot beim Klick **null**
   (gemessen), also blieb die Rückmeldung aus; und im eingebetteten Fenster sind Clipboard-API **und**
   `execCommand` gesperrt. Jetzt kommt der Knopf als Argument, und es gibt drei Wege in dieser
   Reihenfolge: Clipboard-API → Textfeld am **Dokument** (nicht im ShadowRoot, dort liefert
   `execCommand` false) → **Auswahl** des Textfeldes mit der Meldung »Selected — press ⌘C«.
   Gemessen im iframe: 78 Zeichen markiert, `scrollTop` **0** — nichts springt mehr.

**V5-S3c: eine Datei sagt, woher der Bestand kommt.** `overworld/asset-source.js` (`OW_SRC`,
**src-v1.0**) trennt die zwei Kanäle des Addendums (§20b): **Bytes** über
`kayfabizarro.pages.dev` (CDN, kein Kontingent), **Listen** über die GitHub-API (ein Aufruf, gecacht).
Rückweg eingebaut: `?src=raw` oder `OW_SRC.use('raw')` schaltet auf die Rohadresse, wenn ein Deploy
hinterherhängt — jeder Auftrag braucht einen Rückweg.

Umgestellt: `units-catalog` · `paper-atlas` · `overworld-game` · `audio-2d` · `repo-tree` ·
`asset-browser-2d`. Der Runner gatet zusätzlich auf `OW_SRC` (auf »läuft« gaten, nicht auf
»existiert«), und `asset-source.js` steht als erstes Skript in allen vier Runnern.

**Zwei Manifeste, die ihren eigenen Kanal bestimmen wollten — beide entmachtet.** Der Katalog nennt
ein `github_base`, die Deck-Registry ein `baseUrl`; beide zeigen auf die Rohadresse und hätten uns aus
dem CDN gezogen. Die Registry-Zeile war nachweislich die **letzte** raw-Anfrage im Spiel.
**Regel dahinter: ein Manifest liefert Daten, nicht den Kanal.**

**Abnahme (gemessen, im Spiel und im Browser):** verbleibende Rohadressen in `overworld/` = **2, und
zwar nur in `asset-source.js`** (dort gehören sie hin) · Spiel-Anfragen **72 über pages.dev, 0 über
raw** (vorher 71/1) · **0** GitHub-API-Aufrufe im Spiel · 384 Kacheln, 288 Sprites, **70 fps**,
ai-v4.2, hud-v5.0, keine Konsolenfehler · Browser lädt Bytes von `pages.dev` (Status 200) und
misst unverändert. **Hinweis zur Messung:** `transferSize` ist bei fremder Herkunft ohne
`Timing-Allow-Origin` **0** — das ist ein Messartefakt, kein leerer Download; gezählt wird die
Anzahl der Anfragen und was auf dem Schirm steht.

## V5-S3b · 2026-08-06 · Der Fehler, den ich gerade abgeschafft hatte, stand in meiner eigenen Kopfzeile

Abnahme von V5-S3: die Zählzeile lief aus dem Kopf heraus und wurde am Fensterrand **geclippt**
(»… 1713 in tre«) — genau das, was an v1 zu Recht bemängelt war. Ursache war nicht die Pixelbreite,
sondern die Flex-Verteilung: Suche `flex:1`, Werkzeuge `flex:none`, Zählzeile `flex:none` — bei
Platzmangel gibt niemand nach, also überläuft das letzte Element das Padding.

- **Zählzeile darf schrumpfen** (`flex:0 1 auto; min-width:0; ellipsis`) und ist **kürzer**: der
  Gesamtbestand steht in der Pack-Leiste, im Kopf nur Ordner und Bilder der Ebene.
- **Wortmarke weicht** unter 1080 px Fensterbreite; `.top` bekommt `min-width:0`, damit die
  Flex-Kette überhaupt nachgeben kann.
- **Der Bericht schließt die Detailspalte**, weil die Tabelle fünf Spalten breit ist — bei 321 px
  wurde »uncatalogued« gekappt.

**Nachgemessen bei 924 px Fensterbreite:** Kopfzeile innen 908 px, Zählzeile endet bei **882 px**
(Studio, 26 px Luft) bzw. **862 px** (Papier mit Special Elite, 46 px Luft), `scrollWidth ===
clientWidth` in beiden Themes — **kein Clipping**. Bericht: Mitte **728 px**, Tabelle 696 px,
kein waagerechter Überlauf, letzte Spalte vollständig lesbar.

Lehre, die zu den Fehlerklassen passt: **eine Zeile, die nicht nachgeben darf, schiebt** — in Flex
braucht jedes Element einen erklärten Anteil, nicht nur das, das wachsen soll. Und: ein Werkzeug
gegen abgeschnittene Labels prüft man **am schmalen** Fenster, nicht am breiten.

## V5-S3 · 2026-08-06 · Der Browser bekommt ein Studio (ab-v2.0) — das Werkzeug tritt zurück

Georgs Befund an v1: für visuelles Arbeiten war die Tiny-Swords-Deko Gegenwind. Sie stand vor den
Assets, das Schachbrett machte Schatten unlesbar, und die Navigation zwang zum Lesen der Krümelspur.
**Die Regel für Werkzeuge dieses Projekts: das Werkzeug tritt zurück, der Bestand steht vorn.**
Der Papier-Look bleibt — als Theme, nicht als Arbeitsmodus.

- **Zwei Themes, ein Layout.** `theme="studio"` (Standard) ist neutral: warmes Off-White, Haarlinien,
  **ein** Akzent (`oklch(0.55 0.12 250)`), Warnung in Rost (`oklch(0.55 0.16 32)`), System-Sans für
  Text und Mono für Zahlen. `theme="paper"` schaltet dieselben Variablen auf Tiny-Swords um und zieht
  die Teile aus `paper-atlas.js` an; zurück heißt: sie werden wieder ausgezogen (`undress()`).
  Kein zweites Layout, kein Fork.
- **Navigation in drei Stufen, sichtbar statt gelesen:** Pack-Leiste links (immer da, mit Zahlen) ·
  Unterordner als Chips oben (Ketten gefaltet, `Enemy Pack › Enemies`) · Assets in der Mitte.
  **»Recursive« ist jetzt Standard an** — man landet nie mehr auf einer leeren Hülle.
- **Ordner zeigen, was drin ist:** gestapelte Vorschau aus bis zu **drei** Assets (Vordergrund voll,
  dahinter 55 % und 30 %, versetzt). 1, 2 oder 3+ ist ablesbar, ohne zu klicken.
- **Bühnengrund umschaltbar:** hell · **mittel (Standard)** · dunkel · Schachbrett. Pseudo-Transparenz
  ist als Grund untauglich, wenn man gebackene Schatten beurteilen will — mittelgrau zeigt hellen und
  dunklen Pixelrand gleich gut.
- **UI-Sprache Englisch** wie im Spiel; die Urteile der Messung heißen jetzt `Grid` · `Strip` ·
  `Atlas with gaps` · `Single image` (vorher deutsch — Kommentare und Doku bleiben deutsch).
  Keine abgeschnittenen Labels mehr: die Suche hat eine feste Spanne, Zahlen stehen in Mono.

**Ein eigener Fehler, gemessen gefunden:** das Raster war halb automatisch platziert — die Pack-Leiste
war **40 px hoch** statt volle Höhe, und die Detailspalte lag mit 406 px Breite in einer 0-px-Spalte
über der Mitte. Ursache: `grid-row` ohne `grid-column` überlässt die Spalte dem Autofluss. Jetzt hat
**jeder** Bereich eine `grid-area`, und die Detailspalte ist eine Spaltenbreite (`--pw`), kein
Element mit eigener Breite. Nachgemessen: Leiste 196 × volle Höhe, Spalten `196px · 1fr · 420px`.

**Entschieden (Georg):** der **Repo-Baum ist die Wahrheit**; das Katalog-Update kommt vom Coworker.
Der Bericht im Browser bleibt die Stelle, an der die Differenz sichtbar ist.
**Nächste Schicht, absichtlich noch nicht gebaut:** ein Editor über der Ansicht (umfärben, einzelne
Pixel richten — FrizzleBobs weiße Augenlöcher als Anlass), damit eine kleine Korrektur keinen
Photoshop-Umweg braucht. Aufgenommen als Masterplan §18.4.

## V5-S2b · 2026-08-06 · „Es fehlen Einheiten" — es fehlte die Sicht, nicht der Baum

Georgs Befund am laufenden Browser: im Enemy Pack sah es leer aus. Nachgemessen: der Baum hat
**alle 123 Dateien und 31 Ordner** des Packs. Der Grund war die Anzeige — `Enemy Pack` hat genau
**ein** Kind (`Enemies`), also stand dort eine leere Hülle, und die 18 Avatare liegen eine Ebene
höher. Zwei Handgriffe, kein neues System:

- **Ordnerketten werden zusammengefaltet:** eine Kette aus Ordnern mit nur einem Kind und ohne
  eigene Bilder erscheint als **eine** Karte (`Enemy Pack › Enemies`, 105). Hüllen kosten keinen
  Klick mehr; die Krümelspur bleibt vollständig.
- **Knopf »alles darunter«:** zeigt alle Bilder unterhalb des Pfades statt nur die der Ebene.
  Gemessen: `Tiny Swords (Enemy Pack)` → 2 Ordner / **0** Bilder auf der Ebene, mit dem Knopf
  **123** Bilder.

Lehre für die Fehlerklassen: **„leer" heißt zweierlei** — nichts da, oder nichts an dieser Stelle
gezeigt. Ein Werkzeug, das Bestand zeigt, muss den Unterschied selbst sichtbar machen.

## V5-S2 · 2026-08-06 · Asset-Katalog + 2D-Browser: erst sehen, dann verbauen (Masterplan §18)

Vier neue Dateien, ein Werkzeug: **`KFB Asset Browser 2D.dc.html`** zeigt jedes 2D-Blatt des Repos
und legt die **gemessenen** Zahlen daneben. Zwei der sieben Fallen der v4-Sitzung waren Blätter, die
niemand angesehen hatte — dieser Slice ist die Gegenmaßnahme.

- `overworld/sheet-probe.js` (`OW_PROBE`, **sp-v1.0**) — die eine Frage an ein Bild: *wie ist dieses
  Blatt geschnitten?* Vier Urteile **mit Grund**: **Raster** · **Streifen** · **Atlas mit Lücken** ·
  **Einzelbild**. Grenzregel aus dem unit-loader (Spalte x−1 UND x durchgängig frei) plus die neue
  Bedingung, dass **jedes Feld Farbe enthält** — sonst zerschneidet man eine Figur in Luft. Fußpunkt,
  Körperhöhe und Felder je Zeile kommen aus `OW_LOADER` (dieselbe Messung, die das Spiel benutzt).
- `overworld/repo-tree.js` (`OW_REPO`, **rt-v1.0**) — was **wirklich** im Repo liegt: zwei Anfragen
  (`contents/media` → SHA, dann `git/trees?recursive=1`), danach 12 h aus dem localStorage. Nicht
  205 Einzelabfragen; unangemeldet gibt die GitHub-API 60 pro Stunde.
- `overworld/paper-atlas.js` (`OW_PAPER`, **pa-v1.0**) — die Tiny-Swords-UI-Teile und der
  9-Teil-Composer, herausgelöst aus `hud-paper.js`. Ein Werkzeug darf Papier sein, das Spiel bleibt
  Ink (§14).
- `overworld/asset-browser-2d.js` (**ab-v1.0**) — Drilldown, Suche, gemessene Vorschau (Feld 0
  **freigestellt** statt gequetschter Streifen), Abspielen an der gemessenen Feldbreite, Zeilenwahl
  bei Rastern, Fußlinie und Körperkasten als Auflage, Kopierknopf für den Katalog-Eintrag
  (Datei **oder** ganzer Ordner, Animationsschlüssel aus dem Dateinamen).

**Der Befund dieser Runde: der Katalog stimmt nicht mit dem Repo überein.** Gemessen im Bericht des
Browsers: Katalog **1654** Bilder, Repo-Baum **1713**; **87 Katalog-Leichen** (Pfade, die es im Repo
nicht gibt → 404) und **146 unkatalogisierte** Dateien. Die Ursache ist eine fehlende Ebene:
`Tiny Swords (Enemy Pack)/Enemy Pack/**Enemies/**Goblin Raiders/…` — im Katalog fehlt `Enemies/`,
also zeigen 87 von 123 Einträgen dieses Packs ins Leere. Ebenso: `KFB_Custom` (FrizzleBobs Sheet)
kennt der Katalog überhaupt nicht, und `KFB Knight` hat im Repo **94** Dateien statt 39.
Konsequenz im Code: **der Baum gewinnt, der Katalog ist der Index**, die Differenz ist ein sichtbarer
Bericht statt einer stillen Lücke (Masterplan §18.1 — dieselbe Vorrangregel wie bei `cardGrid`).
Ohne Baum (Kontingent, kein Netz) fällt der Browser auf den Katalog zurück und sagt es an.

**Abnahme (gemessen über den echten Bedienweg, nicht über die API):**
| Blatt | Bild | Urteil | Feld | gemessen | naive Schätzung (w/h) |
|---|---|---|---|---|---|
| `FrizzleBob_SpriteSheet_192` | 1344×960 | Raster | 192² | Zeilen **[7,6,6,6,6]**, Fuß 22 px, Körper **112 px**, Schwankung 0 | 1 ✗ |
| `Warrior_Blue` | 1152×1536 | Raster | 192² | 6×8 Zellen, Fuß 56 px, Körper 91 px | 1 ✗ |
| `Spear Goblin_Idle` | 2048×256 | Streifen | 256² | 8 Felder, Fuß 80 px, Schwankung 1 px | 8 ✓ |
| `HappySheep_Bouncing` | 768×128 | Streifen | 128² | 6 Felder, Fuß 42 px, Körper 38 px | 6 ✓ |
| `RegularPaper` | 320×320 | **Atlas mit Lücken** | — | Teile quer 52 · 64 · 52, zwei Lücken | 1 (Zufall) |

**2 von 5 Proben hätte der alte Browser falsch geraten** — genau die zwei Rowsheets, aus denen
Helden gebaut werden. Der Körperwert 112 px für FrizzleBob deckt sich mit der V4-S2-Messung im
Spiel: dieselbe Zahl aus demselben Messweg.

**Nebenarbeit, weil sonst eine Liste an zwei Orten stünde (Falle 7):** `hud-paper.js` hat seine
eigene Teileliste abgegeben und liest sie jetzt aus `paper-atlas.js` (421 → **319 Zeilen**).
Belegt am Modul: `OW_HUD.SHEETS === OW_PAPER.SHEETS` ist **true**, 19 Teile geschnitten, 8 Elemente
angezogen, das Panel bekommt seine Papier-Data-URL. Fehlt das Modul, läuft das HUD mit den
Rückfallfarben weiter — auf „läuft" gaten, nie auf „existiert".

**Zwei eigene Fehler:** (1) der Sichtbarkeits-Beobachter (`IntersectionObserver` mit dem Scroll-Feld
als Wurzel) hat **nie** gemeldet, weil das Feld beim ersten Rendern noch keine Höhe hatte — 0 von 14
Vorschaubildern gezeichnet. Ersetzt durch eigenes Nachrechnen bei Rendern, Scrollen und Größenwechsel
(14/14). (2) Die Wurzel des Baums hatte einen Ordner **ohne Namen**, weil lose Dateien direkt in
`media/2D_Assets` liegen; leere Namen fallen jetzt raus.

**Offen (nicht gebaut, benannt):** Katalog neu erzeugen (`build_catalog.py` gegen den Repo-Baum, nicht
gegen den lokalen Ordner) · Lizenz-Dateien je `free-*`-Pack im Browser anzeigen (§19.3: Lizenz zuerst)
· Sheets aus Einzelframes zusammenlegen + Contract schreiben (§18.3, das eigentliche Lab) ·
Referenz-Held neben der Vorschau, damit `sizeRel` nicht geraten wird.

## V4-S8 · 2026-08-06 · Cartoon-Verformung: mehr Bewegung, kein neuer Frame (Masterplan §17)

`overworld/cartoon-motion-2d.js` (`OW_MOTION`, motion-v1.0) nach `skills/cartoon-motion_v1.md`.
**Die eine Regel: verformt wird im Bild, nie in der Physik.** Ort, Kollision, Gehirn und Treffer
rechnen unverformt weiter; das Modul liefert nur Zahlen für `ctx.transform` um den **gemessenen
Fußpunkt** — deshalb bleibt die Figur beim Stauchen am Boden, und ein abgeschaltetes Modul
(`OW_MOTION.enabled=false`) ändert am Spiel nichts.

- **Drei Kanäle je Einheit** als Feder-Dämpfer mit Überschwingen: `sq` (Squash, flächenerhaltend
  `sx = 1/sy` — 2D, nicht `1/√` wie in 3D), `lean` (Scherung), `spin` (Restdrehung).
- **Sieben Anlässe, ein Eingang** `poke(unit, kind, force, dirx)`: `step` (Bob an der **gelaufenen
  Strecke**, nicht an der Uhr) · `land` · `hit` (Stauchung entgegen der Schlagrichtung, Stärke aus
  dem Schaden) · `bump` (am Gebäude/Baum) · `stumble` · `cast` (Anticipation: erst strecken) ·
  `streak` (Pop, wächst mit der Kill-Kette, verfällt nach 4 s).
- **Prellen wird am Weg gemessen, nicht an einer Kollisionsmeldung:** wer laufen wollte und unter
  35 % der Strecke kam, prallt ab (Sperre 0,55 s, damit Anliegen nicht ruckelt).
- **Zwei Ebenen statt Rig** (§17.4): Sprite + **Akzent** (Staub · Sternchen · Ausruf) mit 0,12 s
  Verzug — die Reaktionskaskade des Skills, so weit sie in 2D geht.

**Zwei eigene Fehler, in den Screenshots gesehen und behoben:**
1. **Das Extrem wurde gehalten.** Die Feder drückte weiter gegen die Klammer, also stand die Figur
   eine halbe Sekunde verbogen da. Jetzt **prallt** es am Anschlag ab (`v *= −0,25`) — das Extrem
   hält **2 Frames** (Soll 1–3, §17.3).
2. **Drei Kanäle gleichzeitig am Anschlag lesen sich als kaputtes Modell.** Grenzen gesenkt:
   Squash **12 % → 9 %**, Scherung 0,10 → 0,055, Drehung **6° → 4°**; `spin` bei `stumble`/`bump`
   fast halbiert. Das Ergebnis ist der Unterschied zwischen „cartoonig" und „defekt".

**Abnahme (gemessen, nicht behauptet).** Lauf 554 px: **14 Schritt-Bobs** (Soll 16 = 554/34) ·
**1 Stolperer** (Sperre 520 px, 16 %; Mobs 1400 px / 5 %). Treffer: leicht (6 Schaden) **5,2 %**
Squash gegen schwer (40 Schaden) **9,0 %** — die Stärke ist ablesbar, nicht immer Anschlag.
Drehung **2,28°** (Grenze 4°), **0** Frames über der Klammer, **2** Frames am Anschlag, nach 420 ms
vollständig ausgeschwungen. Belege: `screenshots/01…04-ow-v4-cartoon.png` (Ruhe · Treffer-Squash ·
Ausruf-Akzent beim Stolpern · Neigung).
**Offen:** `land` ist gebaut, aber noch nicht angeschlossen (es gibt keinen Sprung in der
Draufsicht) — es wartet auf den Papier-Riss und die Arena.

## V4-S7c · 2026-08-06 · Der Scrim war zu dünn (und die Messung zu bequem)

Zwei Fehler, einer im Code, einer in der Methode.

- **Im Code:** `.panel` lag auf `rgba(16,22,19,.62)`, also bestimmte das **Gelände** den Hintergrund
  mit. Auf hellem Gras (aus dem Canvas abgetastet, nicht angenommen) standen zwei der drei Stats
  unter 4,5:1 (**3,38 · 4,24 · 4,81**). Der Gegenbeweis lag im eigenen HUD: die Beats-**Chips**
  (`.72`) waren dort lesbar. Der Panel-Scrim ist jetzt `rgba(14,20,17,.8)`, die Modale `.88` —
  damit hängt der Grund nicht mehr am Zufall der Kachel darunter.
- **In der Methode:** die Zahlen in V4-S5b entstanden gegen eine **angenommene** Grasfarbe. Ab jetzt
  wird der Untergrund **hinter dem Element aus dem Canvas abgetastet**. Der Eintrag V4-S5b ist an
  der Stelle richtiggestellt (additiv, nicht überschrieben).
- **Ruhe heißt gedämpft, nicht unlesbar:** die Untergrenze im Ruhezustand ist von 0,42 auf **0,62**
  gestiegen; volle Deckkraft kommt bei Zeigerkontakt und bei jeder Änderung (Treffer, XP, Level,
  Ladung, Beweisstück) für 2,4 s.

**Abnahme (Untergrund aus dem Canvas abgetastet, Panel-Grund `rgb(39,42,38)`):**
„5 Fluff" **5,97:1** · „2 Kayfabe" **7,48** · „3 Bizarro" **8,49** · LV-Zeile **9,77** — alle über
4,5. Im Ruhezustand (0,62) liegen die Stats bei 2,98–3,83; das ist die **gewollte** Dämpfung, und
sie hebt sich bei Zeigerkontakt oder Änderung selbst auf.

## V4-S7b · 2026-08-06 · Zwei Fraktionen gab es nur im Modul

Der Befund war richtig und trifft eine Hausregel: `OW_JOURNEY.FACTIONS` führte weiter **vier**
Namen, also baute `freshRep()` eine Tabelle ohne `townsfolk` und `audience`, und die Ruf-Zeile im
Diary zeigte vier Zeilen. Die Fraktion, die der neue Slice bestraft, war für den Spieler unsichtbar.

- **Eine Liste, ein Ort:** der Save-Vertrag führt jetzt alle sechs
  (`kingCourt · townsfolk · camp · wilds · cave · audience`), `factions.js` **liest** ihn
  (`ORDER = OW_JOURNEY.FACTIONS`), und `freshRep()` wie `renderDiary()` gehen über dieselbe Liste.
- **Vertrag additiv erhöht: `journey-v2.1.0 → 2.2.0`** mit Migrator (`townsfolk:0, audience:0`
  dazu, keine Daten verloren). Eine Versionsnummer, die den Umfang verschweigt, lügt beim nächsten Fork.
- **Die Begründung ist jetzt die Meldung.** Vorher stand die Floskel („You killed a sheep…") über der
  informativen Zeile; jetzt sagt eine Zeile, wer es gesehen hat und was es gekostet hat
  (»A sheep less. the townsfolk −1.« / »Someone saw that. the townsfolk −2.«).

**Abnahme:** `OW_JOURNEY.FACTIONS` 6 Namen · `journeyVersion 2.2.0` · `Object.keys(freshRep()).length`
**6** · Diary-Ruf-Zeile **6 Zeilen** (`kingCourt 0 · townsfolk −2 · camp 0 · wilds 0 · cave 0 ·
audience 0`) · letzte Log-Zeile ist die Begründung (»Someone saw that. the townsfolk -2.«).

## V4-S7 · 2026-08-06 · `factions.js` — der Ruf beißt (Runner: `KFB Overworld v4.dc.html`)

Masterplan §13/§15 gebaut, in **einer** Datei und ohne zweites KI-System.

- **`overworld/factions.js` (`OW_FACTIONS`, fac-v1.0):** sechs Fraktionen mit Label und Zuhause —
  kingCourt · townsfolk · camp · wilds · cave · audience. Daraus fällt alles andere:
  `stance(f) = clamp(rep/20, −1…+1)` · `nerve(f) = 1 + max(0,−stance)·1,6` ·
  `leash(f) = 1 + max(0,−stance)·0,8` · `hostile` ab **−0,35** · `friendly` ab **+0,5**
  (die Schwelle, ab der Verbündete denkbar sind, §15.3).
- **Das Gehirn liest zwei Zahlen.** `sense()` streckt die Wahrnehmungsreichweite mit `nerve`,
  die Leine wird mit `leash` multipliziert. `repAggro()` im Runner ist nur noch der Rückweg,
  falls das Modul fehlt — **eine Zahl, ein Ort.**
- **`peaceful` wird zu `peacefulUnless(hostile)`:** ist die eigene Fraktion feindlich, beißt eine
  Kreatur zuerst (Wachheit springt bei 260 px auf 1,1). Kreaturen haben dafür jetzt **3 Schaden** —
  Feindschaft ohne Zähne wäre eine Behauptung.
- **Stadttiere gehören den Städtern** (`faction:'townsfolk'`), nicht dem Biome der nächsten Zone.
- **Zeugen-Regel:** `witnesses()` zählt lebende Einheiten derselben Fraktion in 380 px;
  `blame()` **verdoppelt** den Abzug, wenn jemand zusieht. Beim dritten Schaf kostet es −3 statt −1,
  gesehen also −6. Die Meldung nennt den Grund (»Someone saw that. the townsfolk −6.«).
- **Schwierigkeitsgrad ist derselbe Faktor:** `OW_FACTIONS.difficulty` (0,5–2,5) multipliziert
  `nerve` — kein zweiter Codeweg, keine Elite-Variante je Gegner.

**Abnahme.** Ruf townsfolk 0 → **−30**: `stance` **−1,00** · `nerve` 1,00 → **2,60** ·
`leash` **×1,80** (Kreatur: 320 → 576 px) · `hostile` **true**. Das Stadtschaf gehört
`townsfolk` und geht die Kette **`chat → roam → alert → chase`** (Wachheit 1,05) — vorher lief es
nur weg. Fraktions-Übersicht: `kingCourt 0 · townsfolk −30 ✕ · camp 0 · wilds 0 · cave 0 · audience 0`.
**Offen:** die Leine einer Kreatur hängt an ihrem Spawnpunkt, nicht am Ort — ein feindliches
Stadttier gibt die Jagd auf, wenn es weit von seinem Fleck weg ist. Für Wachen und Stadtvolk sollte
die Leine am **Ort** hängen (Slice V5-S1 zusammen mit `sentinel`-Patrouillen). Und `audience` hat
noch keine Quelle: sie wird erst mit der Caption-Bewertung beschrieben.

## V4-S6c · 2026-08-06 · Der Anlauf rannte durch den Helden

Der neue Anlauf hob die Abstandsregel aus V4-S1b auf: gemessen **0,01 Körperhöhen** Abstand
(Sprites exakt übereinander) und **79 Frames ≈ 490 ms** unter 0,4 Körperhöhen; im Zonenkampf fiel
`minHeroGapPerBody` auf **0,10** gegen die dokumentierte Schwelle 0,75. Zwei Ursachen, beide behoben:

- **Es wurde in den Helden gezielt.** Der Dash läuft jetzt auf einen Punkt **`ring` px vor dem
  Helden** und drosselt auf 20 %, sobald er dort ist.
- **Die geerbte Geschwindigkeit schob nach.** 317 px/s im `chase` umzudrehen dauert bei
  ACC 360 px/s² rund 0,9 s — genau die gemessene halbe Sekunde. Beim Verlassen von `charge` wird
  die Geschwindigkeit jetzt auf 15 % gedämpft.
- **Nachgezogen:** die Abstoßung vom Helden war mit 120 px/s schwächer als die Trennung der Nachbarn
  (bis 78 px/s je Paar, im Gedränge summiert) — sie hält jetzt mit **1,5 × Anlauftempo** dagegen.
- **Versionsnummer korrigiert:** das Modul meldet `ai-v4.2` (Housekeeping sagte es schon, der Code
  nicht — eine Version, die lügt, ist schlimmer als keine).

**Abnahme.** Anlauf isoliert (781 Frames): kleinster Abstand **0,81** Körperhöhen · **0 Frames**
unter 0,4 · Anlaufstrecke **129 px** · 5 Angriffe · Held −50 Fluff.
Zonenkampf (24,8 s, 4–5 Angreifer): `minHeroGapPerBody` 0,10 → **0,59** · **68 Angriffe** ·
Held −579 Fluff · `back` 58 Frames · `alert` 58 Frames · Laufframes ohne Weg **0 %**.
**Offen:** der kleinste **Mob↔Mob**-Abstand liegt im Gedränge bei 0,29 Körperhöhen (Vorbeigehen,
kein Stapel) — dieselbe Grenze wie in V4-S1b.

## V4-S6b · 2026-08-06 · Die Aktionen liefen nur eine Bildlänge

Drei Ursachen, alle gemessen — und alle vom selben Muster: **eine Regel, die zwei Zustände nicht kannte.**

1. **Der Verlobungsblock löschte die Aktionen.** `if(a.st==='chase'||a.st==='alert')` war eine
   hartcodierte Liste; `charge` und `back` standen nicht darin, also setzte der else-Zweig im nächsten
   Frame wieder `alert` — gemessen **1,0 Frame je Eintritt** statt ~126 bzw. ~50, und `alert` wurde
   dauernd neu betreten (600 Frames / 9 Eintritte). Jetzt gibt es die Menge
   `ENGAGED={alert,chase,charge,back}` (später `lob`) — eine Stelle, alle Aktionszustände.
2. **Eine Uhr für zwei Dinge.** `set(m,'charge')` setzte `m.cool=5,2` — dieselbe Uhr, die den Schlag
   freigibt. Ein brute, der einmal anlief, konnte 5,2 s **nicht zuschlagen** (isoliert: 0 Angriffe,
   0 Fluff verloren). Der Anlauf hat jetzt `a.chargeCool`, `m.cool` bleibt der Schlagtakt.
3. **Ein Anlauf ist ein Ruck, kein Anfahren.** Die Beschleunigungsbremse (`ACC` 360 px/s²) hätte
   330 px/s erst nach 0,9 s erreicht — in den 0,5 s Anlauf wären **45 px** herausgekommen. Während des
   Anlaufs wird die Geschwindigkeit jetzt direkt gesetzt.

**Der Zähler misst jetzt das Ergebnis, nicht die Absicht:** `probe.charges` wird erst erhöht, wenn der
Anlauf wirklich > 60 px gelaufen ist, und der Report führt `framesPerVisit` je Zustand
(Eintritte gegen Frames) sowie `chargeDistAvg`.

**Abnahme (120 fps):** `charge` **133 Frames je Eintritt** (Soll ~126) · zurückgelegte Strecke
**132 px** · Spitzentempo **317 px/s** · Abstand 210 → 78 px · Held verliert **66 Fluff** ·
`back` (Rückschritt des skirmisher) **56,7 Frames** (Soll ~50) · `alert` **42 Frames** (0,35 s,
kein Dauer-Neueintritt mehr) · 19 Angriffe im selben Fenster.
**Nebenbefund aus dem ersten Testlauf, nicht im Code:** ein Held jenseits des Zonengrabens ist für
den Mob unerreichbar (nur über die Brücke) — der Anlauf sah dadurch tot aus, obwohl die Ursache die
Testaufstellung war. Messungen an Mobs gehören **in** die Zone.

## V4-S6 · 2026-08-06 · Temperamente und Aktionen (Runner: `KFB Overworld v4.dc.html`)

Option B aus Masterplan §11 ist gebaut: **acht Zahlen je Klasse plus 0–2 benannte Aktionen** —
und keine Zeile Sondercode je Gegner.

- **Sieben Temperamente** (`TEMPER` in `mob-ai.js`): brute · skirmisher · kiter · zombie ·
  sentinel · elite · critter. Die acht Zahlen: `pace · nerve · leash · standoff · courage ·
  curiosity · social · patrol`. Zuordnung je Gegnertyp als **Daten** in
  `units-catalog.js` (`OW_UNITS.tempers`, 15 Einträge); Torwächter und Elite überschreiben sie im
  Gehirn (sentinel/elite).
- **Wirkung, alles über vorhandene Regeln:** `nerve` streckt die Wahrnehmungsreichweite ·
  `leash` ist das Revier in Tiles · `standoff` ist der Wunschabstand **in Körperhöhen** (Kiter 2,2 →
  er hält Abstand, brute 0,62 → er klebt) und ersetzt den Festwert aus V4-S1b · `pace` skaliert das
  Anlauftempo · `courage` ist die Fluchtschwelle · `curiosity`/`social` sind die Gewichte in der
  Zielwahl (der Zombie läuft zur Blume, der Wächter patrouliert).
- **Drei Aktionen mit je drei Zahlen** (Reichweite · Vorlauf · Abkühlung) in `ACTS`:
  **charge** (130–300 px, 0,55 s Vorlauf, 5,2 s Abkühlung, 330 px/s — man sieht ihn kommen, das ist
  die Fairness) · **call** (Radius 430, hebt `notice` der Nachbarn, sichtbar als Sprechblase
  »Reinforcements!«, einmal je 14 s) · **hop** (Schlag und Rückschritt, 0,42 s — die Signatur des
  skirmisher).
- **Die drei Lull-Regeln:** höchstens **zwei** Angreifer handeln gleichzeitig je Zone, und nach jedem
  Kill hält die Zone **1,2 s** die Luft an (`actSlotFree()`). Wer warten muss, hält Abstand statt
  im Helden zu stehen.
- **Abnahme (35 Einheiten, 23,8 s, Kampf in einer Zone):** sechs Temperamente gleichzeitig im Feld
  (sentinel 6 · skirmisher 7 · brute 4 · elite 5 · kiter 3 · critter 10) · **61 Angriffe** ·
  1 Verstärkungsruf · Spiegelungen 0,151 je Mob je Sekunde · Laufframes ohne Weg 0 % ·
  Heldenlücke 0,61 Körperhöhen (= der brute-Standoff, wie vorgesehen).
  **Anlauf einzeln geprüft** (Held 230 px entfernt): Zustandskette `alert → chase → charge`,
  1 Anlauf, 2 Treffer, Endabstand 83 px.
- **Konzept nachgezogen:** Masterplan **§16 Cartoon-Physik** (3D-Requisiten in der Pixelwelt:
  eine `z`-Zahl, Kreis-gegen-Kreis, Stufe A als vorgebackene Sprite-Winkel, Stufe B three.js
  orthografisch — und der Würfel als wörtlicher Richter) und **§15.6** (Deckgröße als Rangleiter:
  4 · 36 · 56).
**Offen:** `lob` (Bombenleger, Dynamit) wartet auf Projektile — die Aktion ist in §11 beschrieben,
aber nicht gebaut. Der Report mittelt `avgDistTiles` über die ganze Insel; für eine Kampfmessung
müsste er auf die kämpfenden Mobs eingeschränkt werden.

## Session-Cut V4 · 2026-08-06 · `export/overworld-v4_2026-08-06/`

Eigenständig lauffähig, geprüft **im Export selbst**: bereit ✔ · 35 Einheiten (25 Mobs + 10 Kreaturen) ·
6 Zonen · `hud-v5.0` · `ai-v4.1` · Minimap da · keine Konsolenfehler. Standalone **198 KB**, ein File.
Manifest (nach Georgs Freigabe): Runner + `support.js` + **10 Module** (overworld-game · mob-ai ·
hud-skin · **hud-paper** · unit-loader · units-catalog · kayfabe-abilities · journey · narrator-2d ·
audio-2d) + Masterplan + Changelog + Tilemap-SSOT + Housekeeping + `github.md` + `README.md`.
Keine Datei über 2 MB; Assets laden zur Laufzeit per RAW-URL.
**Nächste Slices im Export benannt:** V4-S6 Temperamente + Aktionen, V4-S7 `factions.js` + Ruf-Aggro.

## V4-S5b · 2026-08-06 · Drei Nachbefunde am Ink-HUD

- **Die Stat-Farbe hatte den falschen Eigentümer.** Sie stand seit V4-S3c als Papierton im Runner;
  auf dem dunklen HUD ergab das **1,02–1,09:1**. Jetzt kommt sie als **CSS-Variable aus dem Skin**
  (`--stat-fluff/-kayfabe/-bizarro`, Rückfallwert im Runner) — Ink liefert helle Töne, das geparkte
  Papier die dunklen. Gemessen gegen den Panel-Grund über Gras: 5,89 · 7,37 · 8,37 — **aber gegen eine angenommene
  Grasfarbe** (`rgb(67,83,51)`). Auf hellem Gelände waren es real 3,38 · 4,24 · 4,81.
  **Richtiggestellt in V4-S7c** (Scrim statt Textton).
  Damit kippt der Kontrast beim nächsten Wechsel der HUD-Sprache nicht mehr.
- **Die Beats brauchten ihre Chips zurück.** `text-shadow` ist kein Kontrast: die Zeilen standen bei
  **1,54–1,63:1** auf Gras. Jede Zeile hat wieder ihre dunkle Fläche (wie in der alten Fassung, die
  Georg gemeint hat). Gemessen: **7,05 · 9,80 · 10,49**. Und die Spalte sitzt jetzt 62 px hoch,
  damit Beats, Steuerungsband und Debug-Streifen nicht übereinander liegen.
- **Zwei Eigentümer für dieselbe Eigenschaft.** `syncHudMode()` im Runner setzte `display:'flex'` auf
  das Steuerungsband, der Skin `display:block` — nach jedem Tab-Zyklus war der Flex-Fehler zurück
  (Flex verwirft die Leerzeichen zwischen den `<b>`-Tags). Der Runner schaltet jetzt nur noch
  **Sichtbarkeit über eine Klasse** (`.hint.on`), die Anzeigeart bleibt Sache des Skins.
  Gemessen: vor und nach dem Tab-Zyklus `display:block`.

## V4-S5 · 2026-08-06 · Ink-HUD, Minimap, Papier geparkt (Runner: `KFB Overworld v4.dc.html`)

Georgs Urteil nach dem Papier-Umbau: zu massiv, schlecht lesbar, das Blatt nimmt die Immersion.
Also zurück auf die **dunkle, durchsichtige** Sprache — aber aufgeräumt statt gestapelt.

- **`overworld/hud-skin.js` ist jetzt das Ink-HUD (hud-v5.0).** Ein Block links oben (Fluff · XP ·
  Stand · Stats · Kayfabe-Kacheln), 196 px Balkenbreite, 9 px hoch, XP als 5-px-Linie darunter —
  eine Karte, kein Stapel. Die Geschichte steht unten links **ohne Kasten** (Text mit Schatten,
  älteste Zeilen blasser, neueste in Gold). Bänder unten sind schmale, durchsichtige Karten.
- **Minimap oben rechts (KISS, neu):** die Insel wird **einmal gebacken** (sie ändert sich nur beim
  Weltbau), je Takt kommen nur Zonen, Wirtshaus und Held darüber — 8 Takte je Sekunde, eigene Uhr,
  kein Frame-Kostenpunkt. Beim Überfahren wächst sie auf 155 % und zeigt eine Fußzeile
  (»camp · 4 left«). Klick reist. **Die zwei Knöpfe (Hilfe · Settings) hängen daran** — sie stehen
  nicht mehr frei im Nichts.
- **Settings ist dieselbe dunkle Karte**, nur größer: Ton · Steuerungshilfe · **Immersion (Tab)** ·
  Jukebox/Drones als gesperrt (gestrichelt, grau — jetzt sichtbar anders als aktiv) · Build · Place ·
  Evidence · Diary · Übersicht. `box-sizing:border-box` überall, damit nichts mehr aus dem Bild hängt.
- **Der Flex-Fehler im Band ist weg:** `.hint` war ein Flex-Container, und Flex verwirft die reinen
  Leerzeichen-Textknoten zwischen den `<b>`-Elementen (»right-clickwalk«). Das Band ist jetzt ein
  **Textstreifen** (`display:block`, umbruchfähig) — Wortabstände und das Ende der Liste sind zurück.
- **Der Schüttler bleibt** (Treffer → Fluff-Block, neuer Beat → Beats, Karte gesichert → volle Wucht).
- **Das Papier ist geparkt, nicht weg:** `overworld/hud-paper.js` (hud-v4.3) enthält den vollständig
  **gemessenen** Free-Pack-Atlas samt Composer. Bestimmung laut Masterplan §14: NPC-Dialoge, Quests,
  Karten-Sheets, Wirtshaus-Buch, Level-Up-Zeremonie — Momente, in denen das Spiel steht.
- **Konzept nachgezogen:** Masterplan **§13 Ruf treibt Aggro** — `stance(faction)` aus dem Ruf,
  daraus `nerveFactor` (bis ×2,6) und `leashFactor` (bis ×1,8), Schwelle `hostile` bei −0,35, ab der
  auch Friedliche angreifen (`peaceful` → `peacefulUnless(hostile)`), Zeugen-Regel beim Töten, und
  ein späterer Schwierigkeitsgrad als **derselbe** Faktor. Vier Fraktionen: kingCourt · townsfolk ·
  faction:<biome> · audience.

## V4-S4 · 2026-08-06 · Die UI-Teile waren ein Atlas, kein Bild (Runner: `KFB Overworld v4.dc.html`)

Georgs Befund war vollständig richtig: Schriftrollen-Kanten fehlten, das Band saß auf rotem Kasten,
das Papier skalierte falsch, die Knöpfe standen ohne Halt. **Eine Ursache, gemessen:** ich hatte die
falsche Quelle benutzt (Update-010-Einzeldateien statt Free Pack) **und** die Free-Pack-Blätter als
zusammenhängende Grafiken geschnitten. Sie sind aber **Atlanten aus neun Teilen** auf einem 64er-Raster
mit 64 px Lücke: 320er-Blatt = Ecke 64 · Lücke 64 · Mitte 64 · Lücke 64 · Ecke 64 · (dito senkrecht),
448er-Blatt = Ecke **128** · Lücke 64 · Mitte 64 · Lücke 64 · Ecke 128. Bänder (Ribbons, Bars) sind
dieselbe Regel in einer Zeile; SmallRibbons hat **10** Bandzeilen (5 Farben × 2), BigRibbons 5.
Wer den Atlas als ein Bild schneidet, bekommt genau das Kachelchaos, das im Screenshot zu sehen war.

- **`border-image` ist raus, die Flächen werden selbst gemalt.** `compose()` baut je Element eine
  Fläche in genau seiner Größe: Ecken 1:1, Kanten und Mitte **ganzzahlig gekachelt**, Ergebnis als
  `background-image`. Das ist nachprüfbar (es liegt ein Bild vor, keine CSS-Interpretation), und es
  überlebt den Screenshot-Weg. Neu gemalt wird nur bei Größenwechsel (Cache je Größe,
  ResizeObserver + MutationObserver für die neu gebauten Slots).
- **Blätter halbiert (0,5, Nearest Neighbour)** — ganzzahlig, also scharf. Alle Maße in der
  Skin-Tabelle sind halbe Maße (Ecke 32 bzw. 64, Mitte 32).
- **Zuordnung:** Papier (RegularPaper) für Stats und Beats · **Banner** mit Schriftrollen-Kanten für
  Settings, Diary, Afterglow, Level-Up, Caption · **Wood Table** als Brett unter den Knöpfen oben
  rechts (sie stehen nicht mehr im Nichts) · **Big Buttons** für alle Schalter · **Small Square
  Buttons** 1:1 für Werkzeug- und Kayfabe-Kacheln · **Small Ribbons** für Steuerungshilfe (rot),
  Zone (gelb) und Aufforderung (blau) — **ohne Kasten dahinter**, die Grafik bringt ihre Form mit ·
  **Big Bar** als Rahmen für Fluff und XP, die Füllung bleibt Farbe (sie muss messbar wachsen).
- **Der Schüttler ist drin (Georgs Prio »Welt als Spielzeug«):** `OW_HUD.shake(ziel, wucht)` —
  0,32 s, Amplitude 1,6–6,4 px, Drehung ≤ 0,35°, stapelt nicht. Angeschlossen: Treffer am Helden
  rüttelt das **Fluff-Blatt** (Wucht aus dem Schaden), ein neuer Story-Beat rüttelt das **Beats-Blatt**,
  eine gesicherte Karte rüttelt mit voller Wucht. Der Einschlag geht damit durch die Fläche, nicht
  nur durch die Welt.

**Drei Bugs mitgenommen:**
- **W war doppelt belegt** — Laufrichtung **und** Kayfabe-Slot 2. Deshalb steuerte W nicht nach oben.
  Abilities liegen jetzt auf **1 · 2 · 3**, WASD gehört dem Laufen.
- **FrizzleBob drehte sich im Kreis und schaute immer gleich:** Zeile 0 seines Sheets ist eine
  **Drehung** (Front → Rücken → Seite), keine Ruhe — und das Sheet ist **nach links** gezeichnet.
  Der Loader kann jetzt `[Zeile, Startspalte, Anzahl]` (Ruhe = nur die Seitenansicht, 1 Frame) und
  kennt `faceLeft`; der Renderer dreht danach. Gemessen: idle 1 Frame ab Spalte 6, `faceSign −1`.
- **Das Schaf war zu groß:** `sizeRel` 0,52 → **0,34**; gemessen Körper **31 px** gegen Held 111 px.

**Abnahme:** 10 Flächen angezogen, keine Konsolenfehler, Kayfabe-Tasten zeigen 1 · 2 · 3,
FrizzleBob steht still und läuft in Blickrichtung, Schaf 31 px.
**Offen:** die Icons kommen weiter aus dem Update-010-Kit (die 12 Free-Pack-Icons sind noch nicht
zugeordnet) · Sword-Banner, Avatare und die zweite Papiersorte sind ungenutzt · das Zonen-Band
steht noch nicht auf dem Ribbon-Maß der Zonentitel (lange Titel werden abgeschnitten).

## V4-S3d · 2026-08-06 · Der Marker konnte nicht auf dem Papier sitzen

**Ursache in einem Satz:** der Slot hat `overflow:hidden` **und** 10 px Rahmen — negative Offsets
werden gegen die Padding-Box gerechnet, der Punkt landete also 4 px **innerhalb** der Knopffläche
(gemessen: Versatz +49/+4 bei 62×54), und außerhalb wäre er ohnehin abgeschnitten worden. Auf dem
Knopf erreichte kein Rarity-Farbton mehr als **1,56:1**, fünf Stufen sahen gleich aus.

- **Neuer Marker statt neuer Zahl:** ein **Streifen innen am Kopf des Knopfs**, gerahmt in
  Knopfschrift-Creme. Der **Rahmen trägt die Sichtbarkeit** (Helligkeit gegen den Knopf), die
  **Füllung trägt die Stufe** (Farbton gegen den Creme-Rahmen). Damit hängt nichts mehr an der
  Knopffarbe — der Marker funktioniert auch auf der roten, grauen und Hover-Variante.
- Der Slot bekommt `padding:9px 0 0`, damit der Streifen den Text nicht berührt.
- **Gemessen (drei belegte Slots):** Marker 40×9 px, vollständig in der Inhaltsfläche
  (`insideContent: true`) · Füllung gegen Rahmen **5,77 · 6,72 · 7,00** · Rahmen gegen Knopf
  **4,49** · Slot-Text gegen Knopf **5,06** · kein Text-Clipping · `.kf` ohne Überlauf (236/236).

## V4-S3c · 2026-08-06 · Die Rarity war eine Textfarbe (Runner: `KFB Overworld v4.dc.html`)

Gleiche Ursachenfamilie wie S3b: der belegte Kayfabe-Slot setzte `color` **und** `border-color` auf
die Rarity-Farbe. Auf dem blauen Knopf standen die Kürzel damit bei **1,78–3,61:1** (Slot 1 gemessen
**2,22:1**), und die `border-color` lag ohnehin unsichtbar unter dem 9-Slice-Rahmen — die Rarity war
als Information verschwunden.

- **Der Text ist Knopfschrift, die Rarity ist ein eigener Marker.** Slot-Ink `#fdf6e6` (gemessen
  **5,06:1** gegen den Knopf). Der Titel im `title`-Attribut nennt die Rarity im Klartext.
  **Richtigstellung (S3d):** der Satz „der Punkt sitzt auf dem Papier" war falsch — er saß auf dem
  Knopf und trug damit nichts. Siehe V4-S3d.
- **Rarity-Töne aus einer Quelle** (`OW_KAYFABE.RARITY`), jetzt für drei Untergründe gemischt —
  Papier, Gras (Floater) und Knopf: common `#41504a` · uncommon `#17663a` · rare `#1f4f8f` ·
  epic `#6a3a9e` · legendary `#7a4d0c`. Gemessen gegen das Papier: **4,71 · 3,89 · 4,53 · 4,30 ·
  4,03** (vorher bis 1,78). Dieselben Werte gelten für die Drop-Floater und den Diary-Text.
- Kein Clipping in den drei Slots (`scrollH = clientH`).

## V4-S3b · 2026-08-06 · Zwei Nachbefunde am Papier-HUD

- **Der Rahmen fraß den Text.** `.kf .slot` war 44×38 px mit 14 px 9-Slice-Rahmen — Inhaltsfläche
  **16×10 px** bei 14 px Inhaltshöhe, also abgeschnitten. Der Slice darf auch auf 10 skaliert werden:
  jetzt 62×54 px mit 10 px Rahmen. Gemessen: Inhalt **42×34 px**, `scrollW/H = clientW/H` (kein
  Clipping), Kürzel und Taste lesbar. Enge Bildschirme: 54×48 bei 9 px.
- **Die Stat-Farben waren für das dunkle Panel gemischt.** Auf Papier (`#d9bd93`) stand Bizarro bei
  **1,21:1**, Kayfabe bei 1,45:1. `STAT_INFO` führt jetzt Papiertöne — Fluff `#8a2114`,
  Kayfabe `#1f4f8f`, Bizarro `#6b4413`. Gemessen: **5,05 · 4,53 · 4,73** gegen die Papierfläche.
  Die Farbe kommt aus einer Quelle, also stimmt sie auch im Level-Up-Overlay.

## V4-S3 · 2026-08-06 · HUD auf Papier (Runner: `KFB Overworld v4.dc.html`)

Das HUD war eine Sammlung dunkler Kästen; jetzt ist es Papier mit Holzrahmen — aus dem
**Tiny-Swords-UI-Kit**, nach denselben Regeln wie das Gelände (SSOT: 192er-Sheets, Slice **64**,
gezeichnet auf **32** = halber, ganzzahliger Maßstab, damit die Pixel scharf bleiben).

- **Neues Modul `overworld/hud-skin.js` (`OW_HUD`, hud-v4.1).** Das Aussehen wohnt dort, nicht im
  Runner: 9-Slice-Rahmen über `border-image` (`Carved_9Slides`, `Button_*_9Slides`), 3-Slice-Bänder
  (`Ribbon_*_3Slides`) für Zone, Aufforderung und Steuerungshilfe, Icons aus `UI/Icons`
  (01 ✕ · 02 Zahnrad · 03 Ton · 08 Hilfe · 10 Schloss). Der Runner ruft eine Zeile:
  `OW_HUD.install(this, shadowRoot)`.
- **Gemessen, nicht geraten:** Carved_9Slides 192×192 · Button_*_9Slides 192×192 ·
  Button_*/Icons/Pointers 64×64 · Ribbon_*_3Slides 192×64. Slice-Werte folgen daraus.
- **Rückfallebene:** kommt das Rahmenbild nicht (Netz, RAW langsam), zeigen Panels Papierfarbe und
  Knöpfe ihre Grundfarbe — vorher wäre eine 32-px-Kante in Textfarbe stehen geblieben (schwarz).
  Der Rahmen ist Schmuck, die Lesbarkeit ist Pflicht.
- **Story Beats sind eine Spalte, keine Blende.** Unten links, scrollbar, **40** statt 4 Zeilen
  Gedächtnis, neuester Beat unten und in Rost-Rot; ein MutationObserver hält die Ansicht am Ende.
  Gemessen: 16 Einträge, Inhalt 512 px in 147 px Fenster, nach einem neuen Beat wieder am Ende.
- **Steuerungshilfe ist standardmäßig aus** (Georgs Wunsch). **H** schaltet sie, dazu ein roter
  Knopf oben rechts; die Zeile steht auch im Settings-Blatt.
- **Settings-Blatt rechts** (Zahnrad, **Esc** schließt): Ton an/aus, Steuerungshilfe, Jukebox und
  Drones als **gesperrt** ausgewiesen (Schloss-Icon — ehrlich, statt sie zu verstecken), dazu die
  Lesefelder **BUILD** (Level, XP, Fluff/Kayfabe/Bizarro, Slots, Ladungen), **BIOME** (Zone, Karte,
  Wächter, offene Zonen) und **COLLECTION** (gesicherte Beweisstücke), sowie Diary (J) und
  Übersicht (M). Gemessen: 9 Zeilen, Werte aktualisieren sich alle 0,5 s, solange offen.
- **Schrift:** Irish Grover für Überschriften, Special Elite für alles andere (aus dem
  Masterplan-Kanon); die Kopfzeile des Debug-Streifens bleibt Monospace und sitzt jetzt unten rechts.
- **Responsiv:** unter 760 px Breite schrumpfen Panel, Beats und Settings, der Debug-Streifen
  verschwindet. Gemessen: Tab blendet Panel, Beats, Zahnrad und Hilfe zusammen aus und wieder ein.
- **Konzept nachgezogen:** Masterplan **§11** (Mob-Persönlichkeit KISS: fünf Optionen, Empfehlung
  **Option B** = Temperamente + acht benannte Aktionen + drei Lull-Regeln, mit Tabelle für
  Bombenleger, Dynamit, Fernschütze, Torch Goblin, Wächter, Boss) und **§12** (Partikel-Runde:
  ein Regler `gore` von blood/gore bis watercolor/cute, dazu `intensity` — eine Effekt-Familie,
  zwei Zahlen, kein zweiter Effektsatz).

## V4-S2 · 2026-08-06 · Die Welt als Spielzeug + FrizzleBob als Held (Runner: `KFB Overworld v4.dc.html`)

- **Georgs Schaf lag auf der Tanne — und der Grund war der Fußpunkt.** Deko-Streifen wurden mit der
  **Zellunterkante** als Boden gezeichnet; ein Sprite mit leerem Rand unten schwebt dadurch über
  allem, was dahinter steht. Jetzt wird der Fußpunkt je Deko **gemessen** (`probeBox`, einmal je
  Bild gecacht) — eine Regel für alle Requisiten, nicht ein Sonderfall für das Schaf.
- **Und das Schaf ist jetzt kein Bild mehr, sondern eine Kreatur.** `units-catalog.js` bekommt
  `critters` (Schaf: idle + Bouncing als Laufbild, 0,52 Körper), das Schaf läuft über den
  Unit-Loader (gemessener Fußpunkt) und **denkt mit dem Gehirn aus V4-S1**: es wandert, besucht
  Fundstücke, trifft andere Schafe. Gemessen: **10 Kreaturen**, Körper 47 px, Zustände
  roam · pause · chat · visit · look · mingle.
- **Friedlich heißt nicht unantastbar.** Kreaturen liegen in `mobs`, sind also angreifbar und
  tötbar — sie wehren sich nicht, sie **rennen** (`flee` 3,5 s nach dem Treffer, Tempo 158 px/s,
  also einholbar). Sie zählen **nicht** zum Zonenfortschritt: `z.alive` bleibt unberührt, es gibt
  **0 XP**, dafür **−1 Ruf** bei der Fraktion des Ortes. Bei drei Schafen schreibt die Insel mit:
  „Sheep hunter. The island is taking notes." (Diary-Eintrag `hunt`). Gemessen: 3 Kills →
  `hunt 3`, XP 0 → 0, `z.alive` unverändert, zwei Meldungen + ein Diary-Eintrag.
- **Uncle FrizzleBob ist spielbar** (Tweak `heroUnit`: warrior / frizzlebob). Sein Sheet liegt im
  Repo (`media/2D_Assets/KFB_Custom`, 192er-Zellen, Zeilen 0 idle · 1 walk · 2–4 Angriff) und
  **bringt seine Zeilen selbst mit**: der Loader kennt jetzt `def.rows` + `def.framesPerRow` und
  rät nicht mehr am fremden Raster. Gemessen: Körper **112 px** (Knight 91), idle 7 · run 6 ·
  attack 6 Frames, Fußpunkt auf dem Boden (Beleg `screenshots/ow-v4-frizzlebob.png`).
  **Offen:** die Kette attack_wind → attack_hit → attack_recover (18 Frames über drei Zeilen)
  braucht einen mehrzeiligen Clip im Loader — vorerst spielt nur die Trefferzeile.
- **Konzept nachgezogen:** Masterplan **§9 Temperamente — Boids mit Absicht** (acht Zahlen je
  Klasse, sieben Archetypen, drei neue Bausteine, zwei Fairness-Regeln für Kiter).

## V4-S1b · 2026-08-06 · Der Klumpen war ein Festwert (Runner: `KFB Overworld v4.dc.html`)

Nachbefund zu V4-S1: die Angreifer standen zwar nicht mehr zitternd, aber **auf dem Helden**.
Ring (46) und Kampf-Trennung (40) waren Festwerte — ein Bär bekam denselben Platz wie eine Ratte.
Zweiter, eigentlicher Grund: wer einmal in Schlagweite war, **blieb stehen, wo er war** — auch
mitten im Helden (gemessen: ein Reiter bei **21 px**, Heldenlücke 0,21 Körperhöhen).

- **Abstände rechnen sich aus den Daten:** `sepFight = 0,58 · mittlere Körperhöhe` (44–104 px),
  `ring = max(52; 0,72 · (eigener + Heldenkörper)/2; sep / (2·sin(π/n)))` — der Ring weiß, wie
  viele auf ihm stehen (`ringN`, alle 0,4 s neu). Schlagweite `ring + 12`, Trefferprüfung
  `ring + 22`: die Reichweite wächst mit dem Körper, also schlägt niemand ins Leere.
- **Eine Regel für alle Zustände:** unterhalb von `0,62 · mittlere Körperhöhe` schiebt eine Kraft
  vom Helden weg — auch im Schlagabstand, nur nicht mitten im Schlag. Kein Sonderfall im `chase`.
- **Ankommen statt Überschießen:** innerhalb von 30 px zum Ringplatz wird der Wunsch auf 30 %
  gedämpft.
- **Lesbarkeit wird jetzt am Körper gemessen, nicht in Tiles:** `minHeroGapPerBody` und
  `minPairPerBody` stehen im Report.

**Abnahme (25 Mobs, 20,8 s, vier Angreifer in einer Zone):** Heldenlücke **0,21 → 0,75**
Körperhöhen (Held frei sichtbar, Beleg `screenshots/ow-v4-ring.png`) · Angreifer bei
**74–92 px** auf Ringen 64–80 (Körper 86–131) · **Angriffe 54 in 20,8 s** (Held verliert 478 Fluff)
— die Schlagkette bleibt also heil · Spiegelungen 0,154 je Mob je Sekunde · Laufframes ohne Weg
0,0 % · 12 Blasen, 0 mussten ausweichen, 0 verdeckt.
**Offen:** der kleinste **Mob↔Mob**-Abstand geht beim Kreuzen kurz auf 0,33 Körperhöhen — sichtbar
ist das ein Vorbeigehen, kein Stapel; dauerhaft stehen sie auf ihren Ringplätzen.

## V4-S1 · 2026-08-06 · Mob-Eigenleben (Runner: `KFB Overworld v4.dc.html`)

**Der Befund zuerst, gemessen am eingefrorenen v3-Standalone (25 Mobs, 3,01 s / 361 Frames):**
**37,96 Sprite-Spiegelungen je Mob je Sekunde** — bei 120 Hz kippt die Figur fast jeden dritten
Frame — und **50,1 % aller Laufframes ohne Weg** (Zustand `run`, Ortsveränderung < 0,12 px).
Das war Georgs Bild: sie zappeln auf der Stelle. Dazu der offene v3-Bug, jetzt nachgewiesen:
Torwächter, Held 190 px entfernt → **0 Angriffe in 6 s**, der Mob endet bei 118 px Abstand und
125 px Leine, dauerhaft in `run`. Nicht die `cool`-Uhr war schuld, sondern **zwei Regeln, die
gegeneinander ziehen**: der Zweig `leash>60 && !sees` schickt nach Hause, während `sees` bei
großem Heimabstand abschaltet — der Mob pendelt zwischen Anlauf und Rückweg und schlägt nie zu.
Dritte Ursache: die Trennung war ein **Positions-Sprung** je Frame (kein Weg, aber Versatz), und
die Spiegelung hatte keine Haltezeit.

- **Ein Gehirn je Mob: `overworld/mob-ai.js` (`OW_AI`, ai-v4.1).** Der Runner behält Kampfwerte,
  Schaden, Beute und Welt; das Modul entscheidet und bewegt. Die 80 Zeilen if-Kette und der
  Separations-Durchgang im Runner sind ersatzlos weg — **eine Zahl, ein Ort.**
- **Lenkung statt Teleport.** Wunsch → Kraft (≤ 360 px/s²) → Geschwindigkeit → Ort. Trennung ist
  eine Kraft, keine Verschiebung; deshalb kann sie nicht mehr gegen den Anlauf zittern.
- **Zustände mit Mindestverweildauer:** pause · roam · visit · look · mingle · chat · alert ·
  chase · strike · flee · retreat. Die Leine wirkt **nur** im Kampfwunsch, mit Hysterese
  (aufgeben bei 430 px / Wächter 170, wieder anbeißen erst bei 55 %).
- **Boid-Anteile, nicht Schwarm-Show:** Trennung (58 px Alltag, 40 px Kampf, 72 px wenn einer
  redet), leichte Ausrichtung nur im Anlauf, und **Whisker** — 0,34 s vorausgeschaut, dann an der
  Küste vorbei statt gegen das Wasser.
- **Eigenleben statt Wandern:** Fundstücke in der Nähe werden besucht und **angesehen** (`look`),
  Nachbarn werden angelaufen (`mingle` → `chat`, beide drehen sich zu), und man geht **auseinander**
  statt auf denselben Fleck zurück. Revier ist die Karte, auf der der Mob spawnt; der Torwächter
  hat einen Kreis von 3,2 Tiles um den Brückenkopf — er wandert also auch vor der Karte herum.
- **Wahrnehmung mit Anlauf statt Schalter (`notice`).** Nähe × Blickfeld × (Tempo des Helden +
  Lautstärke: wer schlägt, ist laut). Damit ist **Vorbeischleichen** eine Folge der Regel, kein
  eigenes System — gemessen: stehend, 158 px, im Rücken → `notice` **0,12 von 1,0** nach 3 s.
  Heldentempo ist auf 260 px/s gedeckelt: ein Fast Travel ist kein Trommelwirbel.
- **Anti-Flacker als Regel:** Spiegelung und Laufbild haben Haltezeiten (0,20 s / 0,18 s), der
  Frame-Zähler wird nur beim echten Bildwechsel neu gesetzt, das Laufbild hängt am **gemessenen**
  Tempo (6–14 fps), und die Richtungszeile braucht 1,25× Übergewicht plus 0,24 s.
  Das Umsehen im Stand ist gewollt getaktet (0,9–2,7 s), nicht zufällig je Frame.
- **Stillstand-Erkennung:** Sollwert da, Weg nicht → nach 0,6 s neues Ziel (oder Ringplatz weiter),
  statt weiter zu drücken. Das ist die Stelle, an der v3 hängen blieb.
- **Sprechblasen mit Ablage (Vorbereitung Karten-Texte).** `OW_AI.speak()`, Blasen messen sich,
  weichen **nach oben** aus und behalten ihren Zeiger auf den Sprecher; höchstens zwei Stimmen je
  Zone. Beim Entdecken ruft der Mob den Kartentitel (»…«), im Gespräch die Lore-Zeile.
  Gemessen: 12 Blasen, **2 mussten ausweichen**, keine verdeckt.
- **Ringplätze nach Winkel** (alle 0,4 s neu, sortiert nach Ist-Winkel) — niemand kreuzt, niemand
  verschmilzt. Ordnung: Trennung 40 < Ring 46 < Schlagreichweite 56.

**Abnahme v4-S1 (25 Mobs, 22,12 s / 3010 Frames, Kampf in einer Zone):**
Spiegelungen **37,96 → 0,145** je Mob je Sekunde (Faktor 262) · Laufframes ohne Weg
**50,1 % → 0,0 %** · KI-Zustandswechsel **0,35** je Mob je Sekunde (also gut zwei Sekunden je
Entscheidung) · Eigenbewegung 26,9 px je Mob je Sekunde · kleinster Paarabstand 0,52 Tiles
(drei Angreifer am Ring, kurzzeitig) · **Angriffe 0 → 56**, Held verliert 495 Fluff, drei Mobs
stehen bei 54–55 px · Zustandsbild eines Frames: 9 roam · 5 pause · 4 visit · 3 chase ·
2 chat · 2 mingle. Messung selbst: `window.__owAi.report()` / `.reset()`.

**Offen:** der kleinste Paarabstand geht im Ring kurz auf 0,52 Tiles (Überschwingen), Blasen
können hinter dem HUD liegen (Tab hilft), und Fernkämpfer warten weiter auf Projektile.

## V3-S1 · 2026-08-06 · Bewachte Zonen statt Mob-Teppich (Runner: `KFB Overworld v3.dc.html`)

- **Das Flackern kam vom Übereinanderliegen.** Die Spawnpunkte waren zwei unabhängige
  Zufallszahlen je Mob — mehrere landeten auf demselben Fleck, und gleich hohe Sprites tauschten
  in der y-Sortierung jeden Frame die Reihenfolge. Zwei Ursachen, zwei Fixes: **Spawnpunkte mit
  Mindestabstand** und ein **stabiler Tiebreaker** in der Sortierung (`a.y-b.y || a.x-b.x`).
- **WoW-Logik: die Zone ist bewacht, nicht bevölkert.** `spawnPoints()` setzt den ersten Mob als
  **Torwächter** an den Brückenkopf (kurze Leine 150 statt 420, +40 % Fluff — er verlässt die
  Brücke nicht), die übrigen staffeln sich in die Tiefe der Zone. Der Elite steht am weitesten
  hinten. Alles deterministisch aus `zoneSeed`.
- **Drei als Regel, sechs als Obergrenze** — mehr nur, wo ein Elite steht.
  Gemessen: 4–5 Mobs je Zone, Mindestabstand **2,05 Tiles**, ein Wächter, Torabstände
  1,9 → 3,2 → 4,7 → 6,4.
- Das Tor liegt jetzt als `zone.gate` vor (innerer Nachbar der Brücke) — Grundlage für mehrere
  Zugänge und für die Wellen aus Masterplan §5.3.
- **Nachgezogen (Georgs Screenshots): Bäume standen in den Gebäuden.** Die Deko wächst vor dem Bau
  der Stadt, und ein 320-px-Schloss überdeckt fünf Tiles, in denen längst Bäume standen — geblockt
  war nur die Fußzeile. Jetzt räumt jeder Ort seine Fläche frei (Sprites raus, Kollision der
  entfernten Bäume zurückgesetzt), die stadteigene Deko ist als `town` markiert und bleibt stehen,
  und zwischen zwei Orten liegen mindestens 4 Tiles. Der Marktplatz vor dem Helden wird
  ebenfalls freigeräumt.
- **Nachgezogen: sie klumpten weiterhin, nur später.** Der Abstand galt bisher nur beim Setzen;
  im Kampf steuerten alle Mobs denselben Punkt an (die Heldenmitte) und verschmolzen bei 0,54
  Tiles zu einem Blob. Zwei Ergänzungen: jeder Mob hat einen **festen Platz am Ring um den
  Helden** (er flankiert, statt aufzulaufen), und ein **Separations-Durchgang** schiebt Paare
  unter 1,25 Tiles auseinander — der Torwächter ausgenommen, er bewacht ja etwas.
  Gemessen nach 3,4 s Verfolgung: kleinster Abstand **0,54 → 2,89 Tiles**, Paare unter 0,8 Tiles
  **2 → 0**, Wächter-Drift 1,86 → **0,13 Tiles**.
- **Und der eigentliche Grund fürs Zittern (Georg, 07:15):** Ring-Radius 46 px und Angriffsschwelle
  46 px waren derselbe Wert, und der Separationsabstand (80 px) war größer als der Abstand zweier
  Nachbarn auf diesem Ring. Anlauf, Angriffsprüfung und Auseinanderschieben zogen jeden Frame
  gegeneinander — die Mobs standen fest und flackerten. Jetzt gilt die Ordnung
  **Separation (70) < Ring (64·2·sin) < Angriffsreichweite (78)**, der Push ist auf 0,3 gedämpft.
  Gemessen über 90 Frames: Eigenbewegung **0,13 px/Frame**, Richtungswechsel **0**.
- **Offen (Bug):** in derselben Messung schlug in 90 Frames kein Mob zu (`attackFrames 0`),
  obwohl drei bei 54–61 px standen. Verdacht: die Leine des Torwächters (150 px) und die
  `cool`-Uhr — noch nicht nachgewiesen. **Zuerst prüfen in v4.**
- **Stufenweiser Zoom** über **+** und **−**: sieben feste Stufen (0,5 · 0,65 · 0,8 · 1 · 1,25 ·
  1,5 · 1,9). Rastend, damit Pixelart nicht zwischen den Stufen matscht; die Übersichtskarte (M)
  bleibt davon unberührt.
- Garten räumt jetzt 195 × 205 px frei statt 110 × 140 — das Schaf stand halb in einer Waldtanne
  und wurde durch die Fußpunkt-Sortierung davor gezeichnet.
- **Und noch ein Flackern, andere Ursache:** die Mobs zappelten um ihren Ringpunkt und klappten
  dabei jeden Frame die Blickrichtung um. Zwei Bremsen: **Hysterese beim Facing** (erst ab 6 px
  seitlichem Versatz drehen) und **Stehenbleiben am Platz** (unter 16 px zum Ringpunkt wird nicht
  weitergesteuert). Gemessen über 90 Frames Verfolgung: Richtungswechsel je Mob **0 · 1 · 0 · 0**.
- **Tab blendet das HUD aus.** Immersionsmodus: Panel, Log, fps-Zeile, Tastenhilfe und
  Zonen-Banner verschwinden, übrig bleibt eine schmale Leiste unten mit Fluff-Balken und
  Kayfabe-Ladungen. Ein Rework des HUD bleibt ein eigener Slice.

## V2-S5b · 2026-08-06 · Amaurotum: die Stadt als Hub + Utopia nachgeschärft

- **Sechs Orte am Innenufer der Lagune**, keiner davon eine Kampfzone — jeder ist die Adresse
  eines Systems, das es schon gibt:
  **Wirtshaus** (Afterglow, House1 aus dem Free Pack — die geliehene Goblin-Hütte ist raus) ·
  **Turm des Königs** (Castle; nennt den Stand bei Hof und Fraktionen) ·
  **Archiv** (Monastery; **blättert die Seite um** — nächster Seed, neue Insel, die Reise bleibt) ·
  **Arena** (Tower; hält den Platz für das Quest-Finale) ·
  **Friedhof** (Dead Tree + Bones; setzt den Respawn) ·
  **Garten** (Baum + Schaf; füllt Fluff und Kayfabe auf).
  Annähern zeigt den Hinweis, **E** betritt. Alle sechs sind in der Übersicht als Pins anklickbar.
- **Das Umblättern ist damit spielbar** (§3.1): das Archiv erhöht den Seed, die Welt wird neu
  gebaut, Journey und Diary reisen mit — „a new island, the same journey".
- **Utopia nachgeschärft:** die erste Fassung war eine gleichmäßige Ringscheibe. Holbeins Insel ist
  eine **Mondsichel** — drei Kniffe bringen sie: die Lagune sitzt tiefer als die Inselmitte (Land
  oben breit, unten dünn), die Außenkontur wird nach unten eingezogen, und ein schmaler
  Gate-Sektor (0,22 rad) schneidet den Kanal auf. Küste jetzt in zwei Oktaven — sie zackt, statt
  zu wellen. Zwischenschritt notiert: mit GATE 0,42 riss die Insel auf und die Lagune wurde
  offene See.
- Nachgezogen: **der Fußabdruck der Gebäude kommt aus der Sprite-Breite**, nicht aus einem festen
  ±1 — das Schloss ist 5 Tiles breit, der Held lief vorher durch seine Außendrittel, während
  Wirtshaus und Arena je ein Tile leere Wiese sperrten. Und der **Marktplatz ist jetzt einer:**
  die Radien lagen bei 5–14 Tiles, `snap()` durfte bis zu 14 weitere driften — der Friedhof landete
  18 Tiles westlich, fünf von sechs Orten waren beim Start außerhalb des Bildschirms.
  Radien auf 5–7, Suchradius hart auf 5 begrenzt, Fehlschlag wird geloggt statt weggedriftet.
  Gemessen: größter Abstand 18 → **8,1 Tiles**, alle sechs auf einem Schirm.

## V2-S4e · 2026-08-06 · Die Starter-Welt ist Utopia

- **Weltform nach Holbeins Utopia-Holzschnitt (1518)**, Georgs Vorlage: ein fast geschlossener
  Landring um eine Lagune, unten die schmale Einfahrt mit der **Wachturm-Insel** im Wasser,
  die Stadt **Amaurotum** am inneren Ufer, der **Anydrus** von der Quelle im Westen in die Lagune.
- Gerechnet wird in *Tiles bis zur nächsten Kante* statt in Noise-Schwellen — dadurch greifen
  Sandsaum, Schaumkanten und Autotiling unverändert weiter. Ein Noise-Term auf der Kante sorgt
  dafür, dass die Insel nie wie ein Donut aussieht.
- **Die Lagune ist zugleich der große Gutter der Seite** — die Insel ist das Panel-Band, das
  Innere die Lücke.
- Das Wirtshaus (und später die Stadt) sitzt jetzt an der Amaurotum-Position statt irgendwo;
  der Held startet davor.
- **Zonen als Kranz:** die Rastersuche lief zeilenweise und drängte alle Zonen nach oben. Jetzt
  werden Kandidaten gesammelt und Winkel für Winkel um die Inselmitte vergeben — sechs Kastelle
  rund um die Lagune, wie auf dem Holzschnitt.
- Tweak `layout`: **utopia** (Standard) oder **noise** (die alte Form bleibt als Rückweg).
- Kontext: die Trilogie steht schon im Deck-Regal — `forget_utopia` → `ignore_dystopia` →
  `embrace_protopia` ist die Hero's Journey als drei Hefte (Masterplan §3.4).

## V2-S4d · 2026-08-06 · FLUFF · KAYFABE · BIZARRO + God-Mode-Übersicht

- **Die drei Ressourcen heißen jetzt nach der Marke.** Puste → **Fluff** (»Stay fluffy« — Fluff ist
  das menschliche Sur-plus, also das, was man aushält), Witz → **Kayfabe**, Schneid → **Bizarro**.
  Damit bleibt **BLÖDSINN! eindeutig beim König** und ist kein HUD-Wort mehr.
  Save-Migration `2.0.0 → 2.1.0` benennt die Felder mit — der erste echte Beleg für die
  Migrator-Tabelle aus S4a. Gegenprobe: 0 Restvorkommen der alten Namen im Code.
- Das Denkmodell dahinter (Resonanz · Frequenz · Amplitude, borromäisch verflochten) steht im
  Masterplan §4.0 — als **Boss-Regel** gedacht, nicht als System.
- **God-Mode-Übersicht (Taste M):** die ganze Insel auf einen Blick, jede Zone mit Kartentitel,
  Biome und Wächterzahl beschriftet; Pins für Wirtshaus, Lagerplatz und Held. **Klick reist**
  dorthin, Shift-Klick setzt den Helden ab (Bauhilfe). In der Übersicht gehört der Bildschirm der
  Karte — HUD, Banner und Prompt blenden sich aus.
- **Der Held startet jetzt vor dem Wirtshaus**, nicht in der Wildnis. Der Hub ist der Anfang.
- Damit ist die Übersicht zugleich der Vorläufer des Hub-Screens (Masterplan §3.3) und der Minimap
  als Seitenspiegel — kein zweites UI.
- Nachgezogen: die Beschriftungen sind 2–3× breiter als die Zonen, die sie meinen — Nachbarn
  überschrieben sich. Jetzt prüft jede Beschriftung vor dem Setzen, ob der Platz frei ist, und
  weicht sonst in 16-px-Schritten aus (Titel nach oben, Biome-Zeile nach unten, Pins ebenso);
  ein dünner Strich zeigt die Zuordnung, wenn eine Beschriftung ausweichen musste. Titel werden
  auf 16 Zeichen gekürzt. Gegenprobe bei 10 Zonen auf einem zweiten Seed: keine Überlappung.

## V2-S4b · 2026-08-06 · Afterglow: Re-Captioning, Wirtshaus, Erzähler ohne LLM

- **Der Spieler ist der Letterer.** Nach jeder geräumten Zone hält das Spiel an und fragt nach der
  Bildunterschrift: drei Vorschläge (heroic · cynic · absurd, aus `zoneSeed` gesät) **plus freies
  Feld** — drei vorgekaute Optionen wären das Gegenteil von Kayfabulieren. Die Caption landet in
  `JourneySave.captions[zoneSeed]` und im Diary.
- **`overworld/narrator-2d.js` erzählt ohne LLM.** Der Ton des Afterglow ist der **häufigste
  Caption-Ton** des Runs — dieselbe Reise, andere Lesart, anderer Text. Kein Satz ohne Deckung:
  jede Zeile steht auf einer Zahl oder einem Diary-Eintrag aus dem Save. Die LLM-Ebene kommt später
  **darüber, nie darunter** (Lehre aus Travel S70/S80: leeres Fach heißt, diese Ebene spricht).
- **Uncle FrizzleBob's Wirtshaus** steht als Hütte auf der Insel, nahe dem Lagerplatz, außerhalb
  jeder Kampfzone. Annähern zeigt den Hinweis, **E** öffnet den Afterglow: der erzählte Text plus
  **Hall of KayfaBizarro Fame** (jede Karte mit der Unterschrift, die ihr der Spieler gegeben hat)
  und ein Export-Knopf.
- Gefunden und behoben: die zuletzt gesetzte Caption erschien zweimal im Afterglow (der
  `acts`-Filter ließ `caption`-Einträge durch). Nachgezogen: **Biome-Ids standen im Satz**
  („the guards of wilds") — es gibt jetzt Anzeigenamen (`the camp` · `the wilds` · `the caves`),
  der Pool ist auf sieben Zeilen je Ton gewachsen, und schon vergebene Unterschriften werden nicht
  erneut angeboten, damit die Hall of Fame nicht kopiert klingt.
- Hinweis: das Wirtshaus benutzt die Goblin-Hütte aus dem Enemy Pack. Ein eigenes Gebäude wäre
  schöner, ist aber kein Slice wert, solange kein Innen-Tileset da ist.

## V2-S3c · 2026-08-06 · Der Held ist sein eigener Ringsprecher

Georgs Einspruch, und er hat recht: die Arcade-Ansagen gehören nicht ins Off. Ein Wrestler, der
seinen eigenen Move kommentiert und seine Kill-Streak feiert, **ist** die Kayfabe-Nummer.

- Jede Ansage erscheint jetzt zusätzlich als **Sprechblase am Helden** (fett, gold), synchron zum
  Klang. Der Blasentext ist der **Dateiname** der Ansage (`flawless_victory.ogg` → „FLAWLESS
  VICTORY!") — kein zweiter Datensatz, der auseinanderlaufen kann.
- Die Off-Stimme bleibt für den Königshof reserviert: dort spricht die Halle, nicht der Held.
- Zwei Blasen-Stile: `talk` (Kayfabe-Zitat, hell) und `shout` (Ansage, gold, größer).

## V2-S4a · 2026-08-06 · Journey: Save, Export/Import, Diary, Ruf

- **Die Welt wird nie gespeichert.** `overworld/journey.js` hält Seeds und Fakten: `runSeed`,
  Held (Stats, Level, Slots, freigeschaltete Akte), Zonen-Status je `zoneSeed`, Diary, Ruf,
  gesammelte Karten, `pages[]`, `hallOfFame[]`, `quests`. Beim Laden entsteht die Insel neu aus dem
  Seed — zurück kommen nur die Beweisstücke. **Ein Schema, kein zweites** (kein PageManifest).
- **Migratoren ab dem ersten Export:** `version` + `MIGRATORS`-Tabelle. Fehlt ein Pfad, wird der
  Import **abgelehnt** statt halb geladen.
- **Auto-Save** (throttled 900 ms) nach Zone-Clear, Level-Up und Ability-Drop; beim Start wird ein
  Save nur übernommen, wenn sein `runSeed` zum eingestellten Seed passt.
- **Diary-Panel (Taste J):** Einträge mit Typ-Tag, Ruf je Fraktion, Buttons Export / Import / New run.
- **Ruf ist die zweite Währung** (Masterplan §4.1): eine geräumte Zone bringt +2 beim Hof und −3 bei
  der Fraktion des Biomes. Negativer Ruf macht die Fraktion **wachsamer** (Sichtweite ×1 bis ×2,2) —
  die Stelle, an der Ruf heute schon beißt, lange bevor es Quests gibt.
- **Abnahme:** Zone geräumt, Level 2, ein Drop, drei Diary-Zeilen, Ruf +2/−3 → Welt komplett neu
  gebaut → **identischer Stand** („the island is new, the evidence is not"). Der Datei-Weg nutzt
  denselben capture/apply-Pfad; der Dialog selbst ist von Hand zu prüfen.
- Offen für S4b: Wirtshaus-Zone, narrator-2d, Re-Captioning, Hall of Fame als Ansicht.

## V2-S3b · 2026-08-06 · Audio: der Ringsprecher

- **Fund statt Annahme:** das Kenney-Fighter-Voiceover-Pack ist **kein Grunt-Pack, sondern ein
  Arcade-Announcer** („fight", „combo", „flawless victory", „round 1–5", Zählansagen 1–10).
  Für ein Kayfabe-Universum mit einem König als Richter ist das der bessere Ton: nicht der Held
  stöhnt, die Halle kommentiert. Das Mapping wurde entsprechend umgebaut.
- **Gemessen, nicht geraten:** die Dateinamen stehen in keinem Manifest. `audio-2d.js` holt das
  Verzeichnis-Listing einmal (GitHub-API, in localStorage gecacht) und schneidet es gegen die
  Ereignis-Map — was fehlt, bleibt still. **Abnahme: 12/12 Announcer-Ereignisse belegt,
  5 Runden-Ansagen, 10 Zählansagen.**
- Ereignisse: Kampfbeginn · Kayfabe (`combo_breaker`) · Kill-Streak (2 = combo, 3 = Zählansage,
  ≥4 = multi kill) · Elite gefallen (`flawless_victory`) · anderer Mob unter 20 % (`kill_him/her/it`)
  · Zone geräumt · Insel geräumt · Held am Boden · Level-Up · Puste unter 28 % (`sudden_death`) ·
  Zone als Runde (`round_1..5`), letzte offene Zone als `final_round`.
- **SFX** aus dem vorhandenen `sfx.json` (Treffer, Karten, Jingles, Münzen). **Schritte hängen an
  der gelaufenen Strecke, nicht an der Uhr** (Lehre aus Travel S79) und kennen schon Wasser vs.
  Boden. Der Sprecher duckt die SFX-Ebene, solange er redet.
- Kein Autoplay: der AudioContext startet bei der ersten Geste. Tweak `sound` schaltet alles aus.
- Reserviert für S7: `arcade_mode` · `story_mode` · `battle_mode` · `championship_mode` als
  Story-Mode-Ansagen.

## V2-S3 · 2026-08-06 · Kayfabe Abilities + Umstellung auf EN

- **Registry getrennt von Wirkung.** `overworld/kayfabe-abilities.js` enthält nur Daten (sechs
  Abilities, Rarity, Drop-Tabellen); die **Effekt-Handler-Familie** `EFFECTS` liegt im Spiel.
  Jeder Handler liefert `{ok,note}` — sagt er nein, wird **keine Witz-Ladung verbraucht**
  (jeder Auftrag braucht einen Rückweg).
- **Sechs Akte:** `monologue` (freeze) · `kant` (distract, zündet bei Kampfbeginn, 3 Kämpfe) ·
  `chair` (heal 1 Puste, dafür 1,6 s wehrlos) · `gutter_bridge` (Tusche-Brücke über den Graben,
  7 s, pulsiert vor dem Verschwinden) · `fourth_wall` (meta: alles hält still, das HUD kippt) ·
  `peer_review` (mark: jeder dritte Treffer stunnt, Ring + Trefferpunkte am Ziel).
- **Trigger-Trennung:** `active` wirkt sofort, `onFightStart` wird scharf gestellt und zündet,
  wenn ein Kampf beginnt (`inFight`-Wechsel). Slot zeigt ● wenn scharf.
- **Drops nach Spec §4:** Drop-Rate je Quelle (Mob 14 % · Elite 60 % · Zone 100 %), darunter die
  Rarity-Verteilung. Gibt es in der gewürfelten Rarity nichts mehr, wird **einmal nach unten**
  ausgewichen, nie nach oben. Gesät am Kill-Zähler — ein Verlauf ist reproduzierbar.
- **Slots:** Q W E lösen aus, Rechtsklick (oder Shift-Klick) dreht den Slot durch die
  freigeschalteten Akte; darunter listet das Panel, was im Pool liegt.
- **Sprechblase:** jede Ability sagt einen Satz, bevor sie wirkt („The gap is a matter of
  interpretation.") — perform, don't announce.
- **Abnahme:** alle sechs über die Tasten ausgelöst, Diary =
  `monologue · kant · chair · gutter_bridge · fourth_wall · peer_review`.
- **Sprache auf EN umgestellt** (UI, Meldungen, Diary, Ability-Texte). Eigennamen bleiben deutsch:
  Puste · Witz · Schneid · BLÖDSINN! · Stay fluffy.
- **HUD aufgeräumt** (Georgs Screenshot): die fps-Zeile lag über dem Panel — sie sitzt jetzt klein
  oben rechts, das Panel ist schmaler (214 px) und kompakter. Responsives HUD, Progressive
  Disclosure und der Language-Switch stehen als eigener Slice im Masterplan §7.

## V2-S2 · 2026-08-06 · RPG-Kern: Puste / Witz / Schneid

- **Drei Stats statt einer HP-Zahl** (Spec §2). Start Puste 5 · Witz 2 · Schneid 3. Puste ist die
  Anzeige-Einheit, intern ×20 gerechnet — der Balken zeigt Segmente, nicht 100 Punkte.
  Schaden des Helden `6 + 4·Schneid` (18 bei Start). **Zahlen am Helden bleiben selten:** Treffer
  am Helden erzeugen keinen Ziffern-Floater mehr, sondern einen roten Randblitz.
- **Poise an der Puste:** die Unterbrechung nach einem Treffer wird kürzer, je mehr Puste
  (0,09 s − 0,008·Puste, min 0,03).
- **Schneid schreckt ab:** angeschlagene Nicht-Elites (< 30 % HP) verlieren ab Schneid 4 die
  Fassung und fliehen. Meldung einmalig je Mob.
- **XP nach Spec:** Mob 1 · Elite 3 · Zone 8 (Secret 2, Boss 12 vorbereitet). Schwelle
  `10 + 5·(lv−1)`, Cap 8. Witz beeinflusst XP nicht (kein Snowball).
- **Level-Up-Wahl als Overlay:** Spiel pausiert, drei Stat-Karten mit Flavor. Auf Level 3 und 6
  gibt es stattdessen einen **Kayfabe-Slot** (Start 1, max 3).
- **Slot → Ladung → Effekt → Diary an einer Ability vorgeführt:** `monologue` (Q oder Klick auf den
  Slot) friert alle Mobs im Umkreis 1,2 s ein („…" über dem Kopf), der Held steht dabei 0,8 s still.
  Kostet eine Witz-Ladung; Ladungen füllen sich **beim Betreten einer Zone**, nicht pro Kampf.
  Die Registry mit sechs Abilities bleibt S3 — hier ging es um die Kette, nicht um den Katalog.
- **Abnahme (echter Bedienweg, Auto-Attack):** Level 1 → **3**, Stats `{puste:6, witz:2, schneid:3}`,
  **Slots 2**, 2 Zonen geräumt, Diary schreibt mit. Level-Up-Overlay pausiert korrekt.
- **Balance-Fund:** Social Aggro zog die *ganze* Zone — mit Puste 5 ist das der sichere Tod, und es
  macht die Rechtsklick-Logik (einzeln anspielen) sinnlos. Jetzt nur noch Nachbarn im Umkreis 230 px.
- Nebenbei: identische Log-Meldungen wiederholen sich nicht mehr („Kein Weg zum Ziel." ×4).

## V2-S1 · 2026-08-06 · unit-loader + Bestiarium je Zone (Runner: `KFB Overworld v2.dc.html`)

- **Ein Zeichenweg für alle Einheiten.** `overworld/unit-loader.js` vereinheitlicht die zwei
  Sheet-Formate des Repos (rowsheet 192er-Raster · strips eine Datei je Animation) zu einem
  Unit-Objekt mit `pick(state,dir,combo) → anim(key) → {img,fw,fh,sy,frames,fps,anchorX,anchorY}`.
  `drawUnit` fragt nur noch das Objekt — die Fallunterscheidung ist aus dem Renderer verschwunden.
- **Größe ist eine Entscheidung, kein Zufall des PNG.** `sizeRel` (Körperhöhe relativ zum Helden)
  steht im Katalog, der Loader misst die Körperhöhe am Idle-Frame 0 (`probeBox`) und rechnet den
  Maßstab: Bär ×1,22 · Minotaur ×1,75 · Spinne ×0,78 · Held = Referenz 1,0. Gemessen z. B.
  Warrior 100 px Quellkörper → Skalierung 1,00; Bear-Strip eigene Höhe → auf 1,22 gezogen.
- **Fußpunkt statt Rateoffset:** der Anker kommt aus der gemessenen Fußlinie (`footFromBottom`),
  nicht mehr aus `-CELL/2-26`. Streifen mit abweichender Framehöhe bekommen eine eigene Messung,
  sonst schwebt die Figur. Kein eigener Schatten (Falle 3 bleibt beachtet).
- **Bestiarium je Zone.** `zoneSeed = hash(Insel-Seed · cardId)` bestimmt Biome (camp/wilds/cave)
  und daraus zwei Grundtypen + ab Zone 2 einen **Elite** (×1,22 Größe, ×1,9 HP, ×1,5 Schaden,
  ×2,6 XP, goldener Ring, ★ im Banner). Elite wird bevorzugt aus einem Typ gezogen, der noch nicht
  im Roster steht — sonst kostet er Varianz (im Test einmal „Panda · Panda ★" gesehen und behoben).
- **Abnahme:** seed 7 → **9 Gegnertypen gleichzeitig** auf einer Insel (Ziel ≥4); Probes je Sheet
  in der Konsole (`[unit-loader] <id> <kind> · Körper …px → ×… · Anims idle:n run:n attack:n`),
  Bestiarium-Zeile mit Biome/Roster/Elite je Zone. Zonen-Banner nennt die lebenden Typen.
- **Bewusst nicht drin:** Ranged-Gegner (Hex Shaman, Gnoll, Bomb Fish, Harpoon Shark) werden
  geladen, aber nicht gesät — sie brauchen Projektile, und das ist ein eigener Slice
  (Masterplan §8). Der Loader loggt, wie viele im Katalog warten.
- Nebenbei: das Log rutscht unter das HUD-Panel (überlappte das dreizeilige Zonen-Banner);
  Goblin-Sheets sind aus der Ladeliste des Spiels raus, alle Einheiten kommen aus dem Katalog.

## v1-Check-in · 2026-08-06 · Masterplan + Export + Session-Cut

- `docs/MASTERPLAN_overworld.md`: Kanon, Ist-Stand, skalierbare Architektur (Seed-Hierarchie,
  geplante Modul-Schnitte, EventBus ab v2), RPG-Spec übernommen aus Georgs Skizze
  (`uploads/kfb-overworld-rpg-system.md` = verbindlich), Comic-Theorie-Backlog mit technischen
  Ankern (Inline Cards, Blasen-Entities, ungezeichnete Zonen, Vierte Wand, Retro-Kausalität,
  Multiverse-Portale), Asset-Bewertung (reicht; Dungeon-Lücke via dunkle Palette + Feder),
  v2-Roadmap mit 8 Slices + Abnahmen.
- Check-in: `export/overworld-v1_2026-08-06/` (DC + support.js + overworld/ + docs) — läuft solo.
- `docs/SESSION_CUT_overworld_v1.md`: sieben bezahlte Fallen, offene Punkte, Entscheidungen.
- Stuck-Key: Schutz drin (blur/visibility/Cmd-Kombis/Linksklick-Reset/Esc), einmal danach noch
  aufgetreten — Fokus-Klick heilt; Reproduktionsweg gesucht.

## S4b · 2026-08-06 · Leichen-Fix + Enemy-Pack-Katalog (Vorarbeit)

- **Weiße Bälle erklärt und behoben:** `Dead.png` ist ein Raster-Sheet (Skelett-Varianten + Geist);
  die Streifen-Probe fand keine transparente Rahmengrenze und zeichnete das ganze Sheet — daher
  auch der zweite „Schatten“. Jetzt: Zellenraster (128/64 per Maß), Zeile per Leichen-Index,
  Todesanimation spielt einmal durch (8 fps) und bleibt liegen. Schatten-Ellipse leicht verkleinert
  und auf die Füße gesetzt (+22).
- **Enemy Pack gekauft und indexiert:** `overworld/units-catalog.js` (`window.OW_UNITS`) —
  19 Gegner (melee/ranged/boss/critter, Biome-Vorschlag camp/cave/wilds/water/dungeon, Projektile,
  Troll-Club-Teile), 13 Requisiten (Cave, Goblin Hut, Zaun-Tile 64, Fish Hut, Boote, Türme, Kanone,
  Knochen), 6 benannte Avatare gemappt, 12 nummerierte Avatare als ungemessen markiert (erst am
  Bild klären). Zwei Sheet-Formate dokumentiert: rowsheet (Update-010-Troops) vs. strips (Enemy
  Pack, eine Datei je Animation). Gefundener Repo-Tippfehler: `Archer_Purlple.png`.
- **Offen für die nächste Session:** strips-Format in der Engine (Einheiten-Lader statt
  Warrior-Sonderfall), Charakterwahl aus `playable` (Avatar = Idle-Frame 0), Zonen-Bestiarium je
  Biome aus dem Katalog, Boss-Zonen (Troll/Minotaur), Requisiten in Zonen (Hut, Zaun als Mauer-Gutter).

## S3+S4 · 2026-08-06 · Karten-Zonen mit Gutter + Mobs & Kampf, dazu Klick-Steuerung

- **Karten-Zonen (S3):** echtes Deck aus `media/kfb/index.json` (gesät gewählt, MedKayfab im
  KFB-only-MVP ausgenommen), Karten-Daten aus dem Deck-JSON (keyMap n/t/l). Je Zone ein 10×8-Rechteck
  auf Gras: Graben geflutet (Gutter = Wasser, Schaum kommt automatisch), eine Brücke als playable
  closure (Bridge_All, am Bild vermessen: H-Teile Zeile 0, V-Teile Spalte 0), Zonen-Tönung als Panel-
  Lesbarkeit. Karte = Beweisstück: Name/Deck im Banner, keine Werte. Cleared → gesammelt.
- **Mobs & Kampf (S4):** Torch-Goblins (4 Farben) als Z onen-Wächter, State-Machine
  idle/wander/chase/attack/return mit Leash + Heimweg-Heilung, Social Aggro in der Zone.
  Kampf-Gefühl nach Bauhandbuch: Hit-Stop 45 ms, Knockback, Brightness-Flash, Schadenszahlen.
  HP/XP/Level am Helden (Kanon), Regeneration nach 4 s, Tod → Respawn am Lagerplatz.
- **Klick-Steuerung:** Rechtsklick = hinlaufen (A* auf dem Tile-Grid, 8 Richtungen, kein
  Eckenschneiden, Ausweich-Suche ums Ziel) · Rechtsklick auf Gegner = Auto-Attack (verfolgen,
  Repath 0,7 s, angreifen bis tot — WoW-Logik). Tastatur schlägt Klick-Auftrag.
- **Küsten-Glitch:** Freischwimm-Regel — steht die Figur auf unpassierbarem Grund, darf sie sich
  in jede Richtung lösen statt in der Sonde festzuhängen.
- **Abnahme:** Konsole loggt Zonen (Anzahl, Versuche, Kartennummern), Mob-Zahl, Deck-ID und
  Kartenzahl im Datenfach; HUD-Zähler unverändert. Tweak `zones` (2–10).
- **Bauhandbuch (Perplexity, `uploads/kfb-overworld-bauhandbuch.md`) gesichtet:** übernommen
  Layer-Kanon, Kampf-Gefühl-Maßnahmen, A*, Lizenzhinweis (keine Redistribution — Assets bleiben
  im Repo). Nicht übernommen: Vite/TS-Projektgerüst (läuft hier ohne Build-Step).
- **Offen:** Kartenbild als Boden (cardbuilder-Zelle, S3b) · Dungeons (S5) · Journey/Export (S6).

## S1+S2 · 2026-08-06 · Wanderkern + Tiny-Swords-Pipeline

`KFB Overworld.dc.html` + `overworld/overworld-game.js`. Assets zur Laufzeit aus dem Repo
(`media/2D_Assets/`, RAW-URLs), nichts lokal — derselbe Weg wie Asset Lab v4.

- **Welt:** 120×90 Tiles, gesätes Value-Noise (2 Oktaven) mit Wasserrahmen; drei Schichten
  Wasser → Sand → Gras, Blob-Autotiling (4×4-Block, Zeile 3 = H-Streifen, Spalte 3 = V-Streifen).
  Sand-Block-Ursprung wird zur Laufzeit aus der Tilemap-Breite bestimmt, nicht geraten.
- **Schaum:** animierte Foam-Frames unter jeder Landkante (Frame-Zahl per Streifen-Probe,
  Phase je Tile versetzt).
- **Held:** Tiny-Swords-Warrior (Farbe wählbar per Tweak), Idle/Run/Angriff (Space, Richtung +
  Kombo-Wechsel), Frames je Zeile per Alpha-Probe gezählt statt hartkodiert. Kollision gegen
  Wasser und Bäume, Achsen getrennt aufgelöst.
- **Deko:** Bäume (Free Pack, animiert per Streifen-Probe), Kleindeko (Update 010), Wasserfelsen;
  y-sortiert mit dem Helden gezeichnet.
- **Abnahme:** HUD-Zähler oben (`fps · tiles · sprites · seed`), Konsole loggt Sheet-Probes
  (hero rows, foam frames, sandBX) und Weltzahlen (Land-Tiles, Schaumkanten, Baum-/Deko-Zähler).
  `window.__ow_stats` für Prüfskripte.
- **Nicht drin (bewusst):** Karten-Zonen/Gutter (S3), Mobs/Kampf-Treffer (S4), Dungeons (S5),
  Journey/Export (S6), Sound/Tag-Nacht (S7). Kein Multiplayer im MVP.

Entscheidungen aus `docs/EVAL_rpg2d-mvp.md` §Offene Entscheidungen, beantwortet 2026-08-06:
¾-Schräge (wie gezeichnet) · TS-UI erstmal (KFB-Brand später) · KFB-only · Warrior als Default,
Einheit/Farbe wählbar · Enemy Pack (18 Gegner) wird ggf. gekauft, wenn das Base Game trägt.
