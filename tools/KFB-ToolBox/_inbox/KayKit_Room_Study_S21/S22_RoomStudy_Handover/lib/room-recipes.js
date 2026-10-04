/* KFB · S21.2 · Raumrezept R02 — 1:1 nach dem Promobild, nicht heuristisch gestreut
   ---------------------------------------------------------------------------------
   Vertrag: docs/MENTAL_MODEL_DIORAMA.md. Die sieben Punkte dort sind die Bauregeln, und jede
   Abweichung von der Vorlage steht unten in ABWEICHUNGEN — nicht stillschweigend im Code.

   Was gegenüber der ersten Fassung ANDERS ist, und warum:
   · Zwei Wandzüge à ZWEI VOLLE Module, Ecke `wall_corner_small`. Mit `wall_corner` (Schenkel 2,0)
     wäre jedes anschliessende Modul ein `wall_half` — im Vorbild ist kein halbes Teil.
   · Keine Wandfackel. In S02 ist keine, und eine Fackel über einem Holzbalken ist Unsinn.
   · Das TÜRBLATT bleibt. `wall_doorway` bringt es mit; im Generator wird es entfernt, weil man
     durch die Fuge laufen muss — hier ist die Tür ein geschlossenes Blatt mit Ring, wie im Bild.
     Auf/Zu ist eine Gruppe, kein Bauentscheid.
   · Requisiten stehen in WELTKOORDINATEN (`pos`), nicht als Zellversatz. Ein Nachbau ist eine
     Abmessung, keine Streuregel.

   In dieser Datei steht weiterhin KEINE Zahl, die ein BAUTEIL beschreibt (Modul, Wandhöhe,
   Plattenmitte, Eckgelenk, Bodenkontakt kommen gemessen aus `kit`). Die Zahlen hier sind
   Positionen auf dem Boden — das ist die Komposition, und die ist der Zweck des Nachbaus. */

import { DIR, DIRLIST, wallRot, cornerRot, dirRot } from './dungeon-grid.js';

export const ROOMS = [
  {
    id: 'R02', titel: 'Schatz- und Esskammer', quelle: 's02',
    /* Kanonische RAW-URL statt relativem Pfad: im Standalone-Export gibt es kein ref/ daneben,
       und das Promobild liegt ohnehin im Asset-Repo (Pfad-Hygiene, session-export Schritt 6).
       ACHTUNG (S22, gemessen): die Nummern des Atlas sind NICHT die Nummern des Packs.
       Atlas `s02` ist `Dungeon_sample1.png` — die Packbilder liegen um eins versetzt, weil s01
       das Übersichtsbild ist. Bis S21 zeigte die Deckungssicht deshalb das FALSCHE Promobild
       (sample2 = zweigeschossiges Lager), ohne dass eine Prüfung anschlug: die Zielwerte der
       Silhouette sind aus der lokalen Datei gemessen, die Überlagerung kam aus dem Netz. */
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample1.png',
    vorlageLokal: 'ref/samples/s02_gold_dining.png',
    untertitel: '1:1 nach Promobild 2 · zwei Wandzüge à zwei Module, Ecke hinten, offene Seite zur Kamera',
    /* DREI Module je Wandzug, Platte 3 × 3 = 12 × 12. Georgs Befund in der Deckungssicht:
       unser Raum steht HÖHER im Bild, weil die Grundfläche zu klein ist — bei kleinerer Platte
       muss die Kamera näher heran, also wachsen die Wände im Bild. Zwei Folgen, beide im Vorbild
       sichtbar: das Modul AN DER ECKE ist eine glatte Wand (kein Holzbalken in der Ecke), und
       die Truhe bekommt Platz für den aufgeklappten Deckel. */
    w: 3, h: 3,
    /* Kamera auf der Winkelhalbierenden, lange Brennweite — so steht die Vorlage. */
    /* Die Kamera ist aus der VORLAGE gemessen, nicht gewählt: das Motiv füllt dort 0,72 der Breite
       und 0,57 der Höhe seines 16:9-Bildes, Mitte 0,00 / −0,04. Die Kamerahöhe wird daraus
       gelöst (flacher Winkel → flachere Silhouette), nicht getippt. */
    kamera: { dir: [1, 0.46, 1], fov: 19, zielBreite: 0.72, zielHoehe: 0.57, zielVersatz: [0, -0.04] },
    ecke: 'wall_corner_small',
    boden: { standard: 'floor_tile_large', sonder: [] },
    /* Wand A (N, Bildschirm links): Durchgang · Regal — Wand B (W, rechts): Banner · Wappen.
       Ein Ereignis je Modul, keins doppelt, keins leer. */
    /* SEITEN GETAUSCHT (S21.2): im Vorbild liegt der Durchgang auf der BILDLINKEN Wand.
       Bei Kamera aus +x/+z zeigt +z nach rechts — also ist die W-Wand die linke.
       Die erste Fassung hatte beide Züge vertauscht; alle Requisiten sind mitgespiegelt
       (Diagonale x↔z, Drehung θ → 90−θ). */
    waende: [
      /* Kein Regal als Ersatz: die Vorlage zeigt eine WANDNISCHE mit Holzrahmen, in der die
         Münzstapel stehen — das ist ein eigenes Bauteil (wall_window_closed_scaffold). Zwei
         übereinandergesetzte `shelves` waren das Bastelteil-Antipattern, und die Streben landeten
         dabei in der Ecke. Die Tür trägt in der Vorlage denselben Holzrahmen. */
      /* `drehen: 180` — das Teil ist einseitig: Bretterrücken auf der einen, EINSCHUB mit Bank
         auf der anderen Seite. Ohne Drehung zeigt die Bank nach draussen und die Münzen schweben
         vor einer Bretterwand. Die Seite folgt nicht aus dem Überstand, also steht sie im Rezept. */
      { at: [0, 0], dir: 'W', part: 'wall', rolle: 'Eckmodul · glatt, kein Balken in der Ecke' },
      { at: [0, 1], dir: 'W', part: 'wall_window_closed_scaffold', rolle: 'Nische mit Beute', drehen: 180 },
      { at: [0, 2], dir: 'W', part: 'wall_doorway_scaffold', rolle: 'Durchgang' },
      { at: [0, 0], dir: 'N', part: 'wall', rolle: 'Eckmodul · glatt' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Bannerwand' },
      { at: [2, 0], dir: 'N', part: 'wall', rolle: 'Wappenwand' }
    ],
    props: [
      /* ---------- ZONE ECKE · das Ziel ----------
         Die Sehachse dieser Kamera läuft entlang x = z: zwei Dinge mit gleichem x−z liegen auf
         DEMSELBEN Strahl. Truhe (0,0) und Tisch (0,1) taten genau das — der Blickfang der
         ganzen Komposition stand hinter dem Gedeck und war unsichtbar.
         Jetzt getrennt: Truhe x−z = +1,6 (bildrechts, hinten), Tisch x−z = −1,2 (bildlinks,
         vorn) — dieselbe Staffelung wie in der Vorlage. */
      { id: 'truhe_zu', part: 'chest', pos: [1.8, 0.2], rot: 60, g: 'schatz', s: 'zu' },
      /* Der Deckel ist ein EIGENES MESH im Bauteil (`chest_gold_lid`, Scharnier bei y 0,50 /
         z −0,56) — dieselbe Bauart wie das Türblatt in `wall_doorway`. „Offen" ist also kein
         zweites Modell und keine Eigengeometrie, sondern eine Drehung am Teil des Packs.
         Gegenprobe im Körper: chest_gold reicht bis y 1,04, chest nur bis 0,60 — die Differenz
         IST das Gold in der Truhe. */
      { id: 'truhe_auf', part: 'chest_gold', pos: [1.8, 0.2], rot: 60, g: 'schatz', s: 'auf', funke: 1, deckel: -105 },
      { part: 'coin_stack_large', pos: [5.2, -0.7], g: 'schatz', s: 'auf' },
      { part: 'coin_stack_medium', pos: [0.3, 2.3], g: 'schatz', s: 'auf' },
      /* Der AUFGEKLAPPTE Deckel gehört zur Truhe: er schwenkt rund 1,3 nach hinten und braucht
         seinen Platz. Ein dritter Stapel stand genau dort — er ist entfallen statt verschoben,
         weil die Ecke schon zwei Stapel und den Haufen trägt. */
      { part: 'coin', pos: [0.9, 3.5], g: 'schatz', s: 'auf' },

      /* ---------- ZONE MITTE · das Leben ---------- */
      { id: 'tisch', part: 'table_medium_tablecloth', pos: [4.0, 5.2], rot: 90, g: 'tafel', s: 'gedeckt' },
      { part: 'chair', pos: [4.2, 7.0], rot: 0, g: 'tafel', s: 'gedeckt' },
      { part: 'chair', pos: [2.5, 6.8], rot: 270, g: 'tafel', s: 'gedeckt' },
      /* Tischfläche 2,00 × 2,00 um (2,8 / 2,7). Fünf Auflagen, Abstände gegen die gemessenen
         Radien gerechnet — Teller 0,50, Essteller 0,51, Krug 0,19, Kerze 0,17, Tellerchen 0,25. */
      { part: 'plate_stack', pos: [3.45, 4.75], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'bottle_A_green', pos: [3.50, 5.70], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'candle_lit', pos: [3.98, 5.45], auf: 'tisch', g: 'tafel', s: 'gedeckt', flamme: 1 },
      { part: 'plate_food_A', pos: [4.48, 4.80], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'plate_small', pos: [4.50, 5.75], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { id: 'tisch_leer', part: 'table_medium', pos: [4.0, 5.2], rot: 90, g: 'tafel', s: 'abgeraeumt' },
      { part: 'chair', pos: [4.2, 7.0], rot: 0, g: 'tafel', s: 'abgeraeumt' },
      { part: 'chair', pos: [2.5, 6.8], rot: 270, g: 'tafel', s: 'abgeraeumt' },

      /* ---------- ZONE RAND · das Echo ----------
         Wandfuss rechts (Wand B): graue Kiste mit Fässchen, dann Truhe mit Beute, dann Stapel. */
      { id: 'kiste_grau', part: 'trunk_medium_A', pos: [8.8, -0.9], rot: 0, g: 'rand' },
      /* Fass auf den BODEN neben die Kiste: ein Fass auf einer Truhe ist kein Bild, sondern ein
         Stapelunfall. */
      /* Links der Truhe an der N-Wand: zwischen Goldhaufen (x 4,0, halb 0,72) und Kiste
         (x 5,4, halb 0,48) ist für ein Fass mit Radius 0,50 kein Platz — dort hineingesetzt
         steckte es in der offenen Truhe. */
      { part: 'barrel_small', pos: [-0.8, 1.2], g: 'rand' },
      { part: 'coin_stack_small', pos: [8.6, 0.9], g: 'rand' },
      /* Der Türweg bleibt FREI. Niemand stapelt Gold in den eigenen Eingang, und der Raum muss
         begehbar gedacht sein — die Tür liegt bei z ≈ 4, davor bleibt eine Gasse. */
      { part: 'coin_stack_medium', pos: [-0.9, 2.2], g: 'rand' },
      /* Offener Vordergrund: Kerzengruppe mit Russflecken — im Bild der einzige helle Punkt
         auf freiem Boden. */
      { part: 'candle_triple', pos: [7.8, 6.0], g: 'licht' },
      { part: 'candle_lit', pos: [7.5, 6.5], g: 'licht', flamme: 1 },

      /* ---------- WANDZIER · ein Ereignis je Modul ---------- */
      /* Auf der GEMESSENEN Fensterbank, nicht auf einer geschätzten Höhe. */
      /* EIN Stapel, vorn auf der Bank. Zwei hintereinander verdeckten sich gegenseitig
         (Sichtprobe: 20 % und 0 %), und auf der Mittelebene der 1,0 dicken Wand steckt der
         hintere im Rahmen. `tiefe: 0.75` = vorderes Viertel der gemessenen Bankspanne. */
      { part: 'coin_stack_small', bank: { at: [0, 1], dir: 'W' }, seitlich: 0, tiefe: 0.75, g: 'regal' },
      { part: 'banner_yellow', wand: { at: [1, 0], dir: 'N' }, frac: 0.55, g: 'banner' },
      /* Die Vorlage zeigt dort KEIN Tuchbanner, sondern eine flache Wappen-Applikation:
         Schild mit gekreuzten Schwertern. Das Pack hat sie als `sword_shield_gold` — ein
         Tuchbanner an dieser Stelle ist ein sichtbarer Griff daneben. */
      { part: 'sword_shield_gold', wand: { at: [2, 0], dir: 'N' }, frac: 0.58, g: 'banner' }
    ],
    fackeln: [],
    /* Der Entzerrer ist Prüfung, kein Werkzeug: er MELDET Überlappungen, verschiebt aber nichts.
       Sonst überschreibt die Automatik genau die Abmessung, die der Nachbau sein soll. */
    entzerren: false,
    gruppen: [
      { id: 'schatz', titel: 'Truhe', zustaende: [['zu', 'verschlossen'], ['auf', 'offen + Beute']], start: 'auf',
        sfx: { auf: 'truhe', zu: 'deckel' }, vfx: { auf: 'funken' } },
      { id: 'tafel', titel: 'Tafel', zustaende: [['gedeckt', 'gedeckt'], ['abgeraeumt', 'abgeräumt']], start: 'gedeckt',
        sfx: { abgeraeumt: 'geschirr' } },
      { id: 'tuer', titel: 'Tür', zustaende: [['zu', 'zu'], ['auf', 'offen']], start: 'zu',
        sfx: { auf: 'truhe', zu: 'deckel' } },
      { id: 'rand', titel: 'Randstücke', schalter: true, start: true },
      { id: 'licht', titel: 'Kerzen', schalter: true, start: true },
      { id: 'regal', titel: 'Nische', schalter: true, start: true },
      { id: 'banner', titel: 'Wandzier', schalter: true, start: true }
    ],
    abweichungen: [
      'Grauer Keil rechts der offenen Truhe (Strebepfeiler oder Treppenwange) — im Pack nicht zugeordnet, deshalb NICHT durch ein ähnliches Teil ersetzt.',
      'Die Sockelplatte der Vorlage (floor_foundation_*) fehlt: der Nachbau steht auf den Bodenkacheln, damit das Raster sichtbar bleibt. Messbare Folge: die Silhouette ist ~0,02 NDC flacher als die Vorlage.',
      'Die offene Truhe steht auf dem Boden, in der Vorlage auf einem grauen Block — trunk_medium_A misst 0,95 × 0,88 und ist kleiner als die Truhe (1,70 × 1,45), also trüge er sie nicht.',
      'Die zweite Truhe an der rechten Wand ist entfallen: an dieser Stelle hätte sie die graue Kiste und den Münzstapel überlappt. Im Vorbild steht sie weiter hinten in der Nische.'
    ]
  },

  /* ================= R07 · Grosse Halle (Bild S07) =================
     Der Raum, der die NEUEN Knotenteile beweist: zwei Stummelwände mit `wall_endcap`, zwei
     T-Knoten in der Nordwand, eine Innenecke. Die Platzierungsregel dafür ist vor dem Bau
     gemessen worden (`tools/probe-wall-nodes.html`), nicht im Bau geraten — das war der Grund,
     warum R07 in S21 zurückgezogen wurde.

     Zweite Besonderheit: S07 ist KEINE Bühne. Die Vorlage ist eine nahe Draufsicht auf einen
     GESCHLOSSENEN Grundriss; Regel 1 des mentalen Modells gilt hier ausdrücklich nicht, und das
     steht unten in ABWEICHUNGEN statt stillschweigend im Code. Der Raum trägt fast keine
     Requisiten — er lebt vom Bodenwechsel (Fliese ⇄ Erde) und von einem einzigen Ziel in der
     Mitte. Genau das ist die Lehre, die S07 im Atlas trägt. */
  {
    id: 'R07', titel: 'Grosse Halle', quelle: 's07',
    /* Atlas s07 = Packbild `Dungeon_sample6.png` (Versatz um eins, siehe R02). */
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample6.png',
    vorlageLokal: 'ref/samples/s07_hall_topdown.png',
    untertitel: 'Nahe Draufsicht · geschlossener Grundriss, zwei Stummelwände mit Endstück, ein Hort in der Mitte',
    /* Grundfläche ZUERST (pm7): acht Module in der Breite, fünf in der Tiefe → 32 × 20.
       Gegengeprüft an der Deckungssicht, nicht gezählt und gehofft: bei 7 × 5 lagen beide
       Trennwände und der Durchgang messbar zu weit rechts (Stummelwand bei 0,41 statt 0,30 der
       Bildbreite). Mit acht Modulen fallen Stummelwand (0,25 gegen 0,30), Trennwand (0,63 gegen
       0,61) und Durchgang (0,44 gegen 0,46) auf die Vorlage — und in der Nordwand wird eine
       volle Fuge für das Gitterfenster frei. */
    w: 8, h: 5,
    /* Aus der Vorlage gemessen: das Motiv füllt 0,67 der Bildbreite und 0,76 der Höhe,
       Mitte +0,02 / −0,02. Die Kamerahöhe löst der Fit daraus.
       Die BRENNWEITE ist der zweite Messwert: mit fov 20 liefen die Seitenwände sichtbar
       zusammen, in der Vorlage stehen sie fast senkrecht. fov 12 deckt sich. */
    kamera: { dir: [0.10, 1.9, 1], fov: 12, zielBreite: 0.67, zielHoehe: 0.76, zielVersatz: [0.02, -0.02] },
    ecke: 'wall_corner',
    enden: 'wall_endcap',
    /* Boden als Raumsprache: Fliesenfeld in der Mitte, Erde an den Rändern und in den beiden
       Taschen hinter den Stummelwänden. Zwei Kacheln mit Geröll als Abwechslung — mehr nicht,
       sonst wird aus der Sprache ein Muster. */
    boden: {
      standard: 'floor_tile_large',
      sonder: [
        { part: 'floor_dirt_large', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, 1], [5, 1], [6, 1], [7, 1], [7, 2], [7, 3], [7, 4]] },
        { part: 'floor_dirt_large_rocky', cells: [[1, 0], [7, 2]] }
        /* `floor_tile_large_rocks` ist hier NICHT gesetzt: die Kachel bringt einen dunklen
           Felsriegel mit, der in der Draufsicht wie ein liegender Balken auf dem Boden steht.
           In der Vorlage ist er nicht. */
      ]
    },
    waende: [
      { at: [0, 0], dir: 'N', part: 'wall', rolle: 'Nordwand' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Nordwand' },
      { at: [2, 0], dir: 'N', part: 'wall_cracked', rolle: 'Nordwand · Riss wie in der Vorlage' },
      { at: [3, 0], dir: 'N', part: 'wall_doorway', rolle: 'Durchgang · Türblatt bleibt' },
      { at: [4, 0], dir: 'N', part: 'wall', rolle: 'Nordwand' },
      { at: [5, 0], dir: 'N', part: 'wall', rolle: 'Nordwand' },
      { at: [6, 0], dir: 'N', part: 'wall_gated', rolle: 'Gitterfenster' },
      { at: [7, 0], dir: 'N', part: 'wall', rolle: 'Nordwand' },
      { at: [0, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [1, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [2, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [3, 4], dir: 'S', part: 'wall_cracked', rolle: 'Südwand' },
      { at: [4, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [5, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [6, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [7, 4], dir: 'S', part: 'wall', rolle: 'Südwand' },
      { at: [0, 0], dir: 'W', part: 'wall', rolle: 'Westwand' },
      { at: [0, 1], dir: 'W', part: 'wall', rolle: 'Westwand' },
      { at: [0, 2], dir: 'W', part: 'wall', rolle: 'Westwand' },
      { at: [0, 3], dir: 'W', part: 'wall', rolle: 'Westwand' },
      { at: [0, 4], dir: 'W', part: 'wall', rolle: 'Westwand' },
      { at: [7, 0], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      { at: [7, 1], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      { at: [7, 2], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      { at: [7, 3], dir: 'E', part: 'wall_cracked', rolle: 'Ostwand' },
      { at: [7, 4], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      /* Stummelwand A: hängt an der Nordwand (T-Knoten bei 2,0) und endet frei bei 2,1 —
         dort setzt der Bau `wall_endcap`. */
      { at: [2, 0], dir: 'W', part: 'wall', rolle: 'Stummelwand A · Vorratsecke' },
      /* Stummelwand B: zwei Module nach Süden (T bei 5,0), Innenecke bei 5,2, zwei Module nach
         Osten, freies Ende bei 7,2 mit Endstück. Die Lücke zur Ostwand ist der Durchlass. */
      { at: [5, 0], dir: 'W', part: 'wall', rolle: 'Stummelwand B' },
      { at: [5, 1], dir: 'W', part: 'wall', rolle: 'Stummelwand B' },
      { at: [5, 2], dir: 'N', part: 'wall', rolle: 'Stummelwand B · Riegel nach Osten' },
      { at: [6, 2], dir: 'N', part: 'wall', rolle: 'Stummelwand B · Riegel nach Osten' }
    ],
    props: [
      /* ---------- ZONE MITTE · das einzige Ziel ----------
         Ein Fass, umringt von Beute. In der Vorlage ist das der gesamte Inhalt der Halle. */
      { id: 'hort', part: 'barrel_large', pos: [13.5, 8.0], rot: 20, g: 'hort' },
      { part: 'coin_stack_large', pos: [11.3, 6.9], g: 'hort', s: 'voll' },
      { part: 'coin_stack_medium', pos: [15.3, 8.9], g: 'hort', s: 'voll' },
      { part: 'coin_stack_small', pos: [12.6, 10.0], g: 'hort', s: 'voll' },
      { part: 'coin_stack_small', pos: [15.0, 6.4], g: 'hort', s: 'voll' },
      { part: 'coin', pos: [13.7, 10.6], g: 'hort', s: 'voll' },
      { part: 'coin', pos: [11.3, 9.1], g: 'hort', s: 'voll' },

      /* ---------- ZONE ECKE · die Vorratstasche hinter Stummelwand A ---------- */
      { id: 'fass_gross', part: 'barrel_large_decorated', pos: [0.8, 0.6], rot: 25, g: 'lager' },
      { part: 'bottle_A_green', pos: [0.5, 0.3], auf: 'fass_gross', g: 'lager' },
      { part: 'bottle_B_green', pos: [1.2, 0.9], auf: 'fass_gross', g: 'lager' },
      { part: 'bottle_A_brown', pos: [2.3, 1.7], rot: 70, g: 'lager' },
      { part: 'barrel_small_stack', pos: [4.4, 0.9], rot: 15, g: 'lager' },

      /* ---------- ZONE RAND · ein Felsnest, kein Schutt-Teppich ----------
         Gemessen: `rubble_large` ist 8,13 × 3,18 (ZWEI Module breit) und `rubble_half` 4,00 ×
         3,00 — das sind Felsformationen, keine Kiesel. Die Steinchen der Vorlage gehören zur
         Erdkachel, nicht zu einem Requisit. Sechs gestreute Brocken waren deshalb wieder die
         Streuregel statt der Abmessung (pm1): zwei Nester bleiben, dort wo im Bild welche
         liegen — in der Osttasche und an der Südostkante. */
      { part: 'rubble_half', pos: [26.4, 3.2], rot: 20, g: 'schutt' },
      { part: 'rubble_half', pos: [26.4, 14.8], rot: 250, g: 'schutt' }
    ],
    fackeln: [
      { at: [0, 1], dir: 'W' }, { at: [0, 3], dir: 'W' },
      { at: [7, 1], dir: 'E' }, { at: [7, 3], dir: 'E' }
    ],
    entzerren: false,
    blickfang: ['hort'],
    gruppen: [
      { id: 'hort', titel: 'Hort', zustaende: [['voll', 'Beute liegt'], ['leer', 'geplündert']], start: 'voll',
        sfx: { voll: 'muenzen', leer: 'fass' }, vfx: { voll: 'funken' } },
      { id: 'tuer', titel: 'Tür', zustaende: [['zu', 'zu'], ['auf', 'offen']], start: 'zu',
        sfx: { auf: 'truhe', zu: 'deckel' } },
      { id: 'lager', titel: 'Vorrat', schalter: true, start: true },
      { id: 'schutt', titel: 'Schutt', schalter: true, start: true },
      { id: 'licht', titel: 'Fackeln', schalter: true, start: true }
    ],
    abweichungen: [
      'S07 ist kein Bühnendiorama: die Vorlage zeigt einen GESCHLOSSENEN Grundriss aus der Draufsicht. Regel 1 des mentalen Modells (zwei Wandzüge, offene Seite zur Kamera) gilt für diesen Raum ausdrücklich nicht.',
      'Die Grasbüschel der Vorlage fehlen: im freien Pack sitzt Grün nur auf kleinen Bodenkacheln (floor_tile_small_weeds_A/B, halbes Modul). Die passen nicht ins 4,00-Raster dieses Bodens und werden NICHT durch ein ähnliches Teil ersetzt.',
      'Der zweite pyramidenbedeckte Pfosten auf dem östlichen Riegel der Vorlage ist nicht zugeordnet (T-Knoten ohne sichtbaren Abzweig oder Pfeiler). Er fehlt im Nachbau.',
      'Sprint 22 nennt für R07 zusätzlich ein Falltür-Paar und floor_tile_big_spikes. Beides kommt in Bild S07 nicht vor und ist deshalb nicht gebaut — die Teile liegen gemessen bereit (Werkbank), der Raum dafür ist S09 oder ein eigener Gefahren-Raum.',
      'Die Sockelplatte der Vorlage (floor_foundation_*) fehlt wie in R02: der Nachbau steht auf den Bodenkacheln, damit das Raster sichtbar bleibt.'
    ]
  },

  /* ================= R08 · Vorratskeller (Bild S08) =================
     KORREKTUR nach Bildvergleich (crop_stairs/crop_pillar_door/crop_farright2): die erste
     Fassung hat das Bild als einfache Bühne (zwei Wandzüge, EINE Ecke) gelesen — falsch. S08
     zeigt DREI echte Ecken (hinten-links, hinten-rechts an der Treppe, vorne-rechts) und ist nur
     an der vorderen LINKEN Seite offen. Die Tür sitzt LINKS von der Bildmitte auf der Rückwand,
     die Treppe an der HINTEN-RECHTEN Ecke — beides war in der ersten Fassung vertauscht.
     Der freistehende T-Pfeiler in der Mitte ist jetzt versucht als `wall_doorway_sides`
     (Türrahmen ohne Wandkörper) — eine WERKSTATT-VERMUTUNG, keine Messung; schlägt der Name im
     Pack fehl, bleibt die Stelle leer (Notiz „fehlt im Pack"), es steht KEIN Ersatzteil dort.
     Genau das war der Vorwurf an die erste Fassung: ein Fels stand an der Stelle, wo weder Fels
     noch irgendetwas Ähnliches in der Vorlage ist. */
  {
    id: 'R08', titel: 'Vorratskeller', quelle: 's08',
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample7.png',
    vorlageLokal: 'ref/samples/s08_cellar.png',
    untertitel: 'Drei Ecken, ein offenes Vorderlinks · Fassecke, Durchgang, Treppen-Ecke, Frontriegel',
    /* Rückwand (N) sechs Module lang, Ostwand (Treppenseite, E) vier Module tief, Westwand (W)
       nur zwei Module bevor sie frei endet, Frontriegel (S) zwei Module ab der Ostecke bevor ER
       frei endet — das Offene liegt vorne-links, wo Tisch und Fässer zur Kamera stehen. */
    w: 6, h: 4,
    kamera: { dir: [1, 0.55, 1.1], fov: 20, zielBreite: 0.76, zielHoehe: 0.62, zielVersatz: [0.01, -0.03] },
    ecke: 'wall_corner',
    enden: 'wall_endcap',
    boden: {
      standard: 'floor_tile_large',
      sonder: [
        { part: 'floor_dirt_large', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [0, 1], [5, 1], [5, 2], [5, 3], [4, 3]] },
        { part: 'floor_dirt_large_rocky', cells: [[5, 0]] }
      ]
    },
    waende: [
      { at: [0, 0], dir: 'N', part: 'wall', rolle: 'Rückwand · Eckmodul, Kronenkerzen' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Rückwand · vor dem T-Pfeiler' },
      { at: [2, 0], dir: 'N', part: 'wall_doorway', rolle: 'Durchgang' },
      { at: [3, 0], dir: 'N', part: 'wall_cracked', rolle: 'Rückwand · Riss wie in der Vorlage' },
      { at: [4, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [5, 0], dir: 'N', part: 'wall', rolle: 'Rückwand · Eckmodul zur Treppe' },
      { at: [0, 0], dir: 'W', part: 'wall', rolle: 'Westwand · Eckmodul' },
      { at: [0, 1], dir: 'W', part: 'wall', rolle: 'Westwand · offenes Ende, Tisch steht davor' },
      { at: [5, 0], dir: 'E', part: 'wall', rolle: 'Ostwand · Eckmodul, Treppe lehnt an' },
      { at: [5, 1], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      { at: [5, 2], dir: 'E', part: 'wall', rolle: 'Ostwand' },
      { at: [5, 3], dir: 'E', part: 'wall', rolle: 'Ostwand · Eckmodul zum Frontriegel' },
      { at: [5, 3], dir: 'S', part: 'wall', rolle: 'Frontriegel · Eckmodul' },
      { at: [4, 3], dir: 'S', part: 'wall', rolle: 'Frontriegel · offenes Ende' }
    ],
    props: [
      /* ---------- ZONE ECKE · Fassecke hinten-links, das Ziel ---------- */
      { part: 'box_stacked', pos: [1.1, 1.0], rot: 0, g: 'lager' },
      { id: 'fass_gross', part: 'barrel_large_decorated', pos: [1.7, 2.5], rot: 15, g: 'lager' },
      { part: 'bottle_A_green', pos: [0.5, 2.6], rot: 10, g: 'lager' },
      { part: 'bottle_B_green', pos: [2.9, 3.0], rot: 340, g: 'lager' },

      /* ---------- ZONE MITTE · T-Pfeiler (Vermutung) + je ein Fass an jeder Seite ---------- */
      { part: 'wall_doorway_sides', pos: [8.0, 4.4], rot: 0, g: 'mitte' },
      { part: 'barrel_large', pos: [11.0, 7.4], rot: 10, g: 'mitte' },
      { part: 'barrel_small', pos: [5.6, 7.6], rot: 30, g: 'mitte' },
      { part: 'barrel_small', pos: [3.8, 8.4], rot: 80, g: 'mitte' },
      /* Fass mit Kerze und Flasche rechts der Tür, vor dem Eckmodul zur Treppe. */
      { part: 'barrel_large', pos: [13.6, 2.2], rot: 350, g: 'mitte' },
      { part: 'bottle_A_brown', pos: [14.9, 3.3], rot: 40, g: 'mitte' },

      /* ---------- ZONE TREPPE · hinten-rechte Ecke ---------- */
      { id: 'treppe', part: 'stairs_wood', pos: [19.5, 1.6], rot: 90, g: 'treppe' },
      { part: 'box_stacked', pos: [14.8, 4.0], rot: 10, g: 'treppe' },
      { part: 'barrel_small', pos: [16.4, 5.4], rot: 15, g: 'treppe' },
      { part: 'barrel_large_decorated', pos: [17.6, 7.2], rot: 340, g: 'treppe' },
      { part: 'bottle_A_green', pos: [18.4, 6.6], rot: 20, g: 'treppe' },

      /* ---------- ZONE RAND · Tisch vorne-links (offene Seite) ---------- */
      { id: 'tisch', part: 'table_small', pos: [1.6, 10.6], rot: 90, g: 'rand' },
      { part: 'bottle_A_brown', pos: [1.0, 10.1], auf: 'tisch', g: 'rand' },
      { part: 'bottle_B_green', pos: [2.1, 10.9], auf: 'tisch', g: 'rand' },
      { part: 'barrel_small', pos: [0.9, 8.6], rot: 20, g: 'rand' },
      { part: 'barrel_small', pos: [2.0, 9.2], rot: 300, g: 'rand' },

      /* ---------- ZONE FRONTRIEGEL · Kiste + Truhe vorne-rechts ---------- */
      { part: 'box_stacked', pos: [16.8, 10.6], rot: 5, g: 'front' },
      { part: 'chest', pos: [18.6, 10.4], rot: 340, g: 'front' },

      /* ---------- KRONE · Kerzen auf der Mauer, an BEIDEN Rückwand-Ecken ---------- */
      /* Wandkrone: die Rückwand-Fuge liegt bei z=-2 (Fugenmitte, MOD·(r-0,5)), NICHT bei z≈0 wie
         in der ersten Fassung geraten — dort ist Raumboden, kein Wandkörper. Bug Nr. 2 fürs
         Postmortem: y='krone' traf, x/z lag zwei Module ausserhalb der Wand, im offenen Nichts. */
      { part: 'candle', pos: [0.4, -2.0], rot: 0, y: 'krone', g: 'krone' },
      { part: 'candle', pos: [1.0, -1.95], rot: 0, y: 'krone', g: 'krone' },
      { part: 'candle', pos: [19.6, -2.0], rot: 0, y: 'krone', g: 'krone' },
      { part: 'candle', pos: [19.0, -1.95], rot: 0, y: 'krone', g: 'krone' },
      /* ---------- ECHO · zwei einzelne Kerzen im offenen Vordergrund ---------- */
      { part: 'candle_lit', pos: [10.0, 11.2], g: 'licht', flamme: 1 },
      { part: 'candle_lit', pos: [15.6, 10.8], g: 'licht', flamme: 1 }
    ],
    fackeln: [],
    entzerren: true,
    blickfang: ['fass_gross'],
    gruppen: [
      { id: 'tuer', titel: 'Tür', zustaende: [['zu', 'zu'], ['auf', 'offen']], start: 'zu',
        sfx: { auf: 'truhe', zu: 'deckel' } },
      { id: 'lager', titel: 'Fassecke', schalter: true, start: true },
      { id: 'mitte', titel: 'Mitte · Pfeiler', schalter: true, start: true },
      { id: 'treppe', titel: 'Treppen-Ecke', schalter: true, start: true },
      { id: 'rand', titel: 'Tisch vorne-links', schalter: true, start: true },
      { id: 'front', titel: 'Frontriegel', schalter: true, start: true },
      { id: 'krone', titel: 'Kronenkerzen', schalter: true, start: true },
      { id: 'licht', titel: 'Kerzen (Boden)', schalter: true, start: true }
    ],
    abweichungen: [
      '`wall_doorway_sides` für den freistehenden T-Pfeiler ist eine VERMUTUNG aus dem Namen, keine Messung — lädt das Teil nicht oder passt die Form nicht, steht dort nach Regel „kein Ersatzteil" NICHTS, nicht wieder ein falscher Platzhalter.',
      'Die Holztreppe steigt in der Vorlage sichtbar weiter, hier ist sie ein Bühnenrequisit ohne begehbares Obergeschoss.',
      'Kamera-Zielwerte sind aus der Bildkomposition geschätzt, noch nicht Pixel für Pixel an der Vorlage gemessen wie bei R02/R07 — die Deckungszeile im Editor zeigt den Ist-Wert nach dem Bau.',
      'Die Sockelplatte der Vorlage (floor_foundation_*) fehlt wie in R02/R07: der Nachbau steht auf den Bodenkacheln, damit das Raster sichtbar bleibt.'
    ]
  },

  /* ================= R09 · Zellen (Bild S09) =================
     Sprint-22-Auftrag: `wall_gated` als eigene Raumsorte, minimale Möblierung. Erster Bau
     (w=2, h=2, Trennwand zwischen zwei 1-Modul-Zellen) ist am selben Fehler gescheitert wie die
     erste R07-Fassung: `wall_doorway`/`wall_gated` sind NICHT halbierbar, und ein 1-Modul-Lauf
     mit einem Knoten an JEDEM Ende (Ecke UND T-Knoten der Trennwand) frisst das ganze Modul
     („beidseitig gedeckt") oder überlappt es. Fix: KEINE Trennwand, ein durchgehender Raum mit
     ZWEI Türen im Rücken (die Illusion zweier Zellen) — ohne Trennwand gibt es keinen T-Knoten,
     nur die vier Aussenecken, und `wall_corner_small` (Schenkel 0,76, unter der Fress-Schwelle
     MOD/4) frisst gar nichts, also bleibt jedes Rand-Modul ganz. Gemessen nachvollzogen, nicht
     wieder geraten (Regel R3, Postmortem R08). */
  {
    id: 'R09', titel: 'Zellen', quelle: 's09',
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample8.png',
    vorlageLokal: 'ref/samples/s09_prison.png',
    untertitel: 'Ein Zellenraum, zwei Türen im Rücken · durchgehendes Gitter zur Kamera',
    w: 4, h: 2,
    kamera: { dir: [0, 0.32, 1.3], fov: 24, zielBreite: 0.74, zielHoehe: 0.5, zielVersatz: [0, -0.02] },
    ecke: 'wall_corner_small',
    boden: { standard: 'floor_tile_large', sonder: [] },
    waende: [
      { at: [0, 0], dir: 'N', part: 'wall_doorway', rolle: 'Zelle 1 · Tür im Rücken' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [2, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [3, 0], dir: 'N', part: 'wall_doorway', rolle: 'Zelle 2 · Tür im Rücken' },
      { at: [0, 1], dir: 'S', part: 'wall_gated', rolle: 'Gitter zur Kamera' },
      { at: [1, 1], dir: 'S', part: 'wall_gated', rolle: 'Gitter zur Kamera' },
      { at: [2, 1], dir: 'S', part: 'wall_gated', rolle: 'Gitter zur Kamera' },
      { at: [3, 1], dir: 'S', part: 'wall_gated', rolle: 'Gitter zur Kamera' },
      { at: [0, 0], dir: 'W', part: 'wall', rolle: 'Seitenwand' },
      { at: [0, 1], dir: 'W', part: 'wall', rolle: 'Seitenwand' },
      { at: [3, 0], dir: 'E', part: 'wall', rolle: 'Seitenwand' },
      { at: [3, 1], dir: 'E', part: 'wall', rolle: 'Seitenwand' }
    ],
    props: [
      { id: 'bett1', part: 'bed_frame', pos: [0.3, 1.4], rot: 0, g: 'zelle1' },
      { part: 'table_small', pos: [-1.5, 1.0], rot: 0, g: 'zelle1' },
      { part: 'candle_lit', pos: [-1.8, 0.5], rot: 0, g: 'zelle1', flamme: 1 },
      { part: 'bottle_A_brown', pos: [-1.0, 0.5], rot: 30, g: 'zelle1' },
      { part: 'box_small', pos: [1.3, 2.6], rot: 10, g: 'zelle1' },
      { part: 'bed_floor', pos: [12.5, 2.3], rot: 0, g: 'zelle2' }
    ],
    fackeln: [],
    entzerren: true,
    blickfang: ['bett1'],
    gruppen: [
      { id: 'zelle1', titel: 'Zelle 1', schalter: true, start: true },
      { id: 'zelle2', titel: 'Zelle 2', schalter: true, start: true }
    ],
    abweichungen: [
      'Keine Trennwand zwischen den beiden Zellen (Motor-Grenze: `wall_gated`/`wall_doorway` sind nicht halbierbar, eine Trennwand hätte einen T-Knoten erzeugt, der das angrenzende Gitter-/Türmodul frisst oder überlappt — siehe Baukommentar). Zwei Türen im Rücken geben die Zellentrennung als Andeutung, der Raum ist strukturell EIN offener Zellenblock.',
      '`wall_corner_gated` ist damit nicht im Bau: alle vier Ecken sind gemischt (Tür/Wand oder Gitter/Wand), keine ist Gitter+Gitter — `wall_corner_small` (plain, frisst nichts) passt für alle vier.',
      'Nur ein Zellenraum statt der versetzten drei aus der Vorlage (die dritte steht im Bild um einen Modulversatz nach vorn, ausserhalb des Rechteckrasters) — bewusste Vereinfachung nach dem R08-Abbruch.',
      'Kamera-Zielwerte sind aus der Bildkomposition geschätzt, nicht Pixel für Pixel gemessen — die Deckungszeile im Editor zeigt den Ist-Wert nach dem Bau.'
    ]
  },

  /* ================= R03 · Zweigeschossiges Lager (Bild S03) =================
     Sprint-22-Auftrag: Ebenenlogik aus S13.2 übernehmen, nicht neu erfinden. S13.2 kennt zwei
     Ebenen über `kit.HUB` (gemessener Treppenhub `stairs_wood`, NICHT die Wandhöhe — Lehre aus
     `docs/HANDOFF_dungeon_S13.md`) und die Fugenklasse `rail` für `barrier` an einer offenen
     Balkonkante. Hier als HANDPLATZIERTE Teilfläche statt generiertem Grundriss: die Galerie hat
     KEINE eigenen Wände (die Bühnenwände sind schon hoch genug für beide Ebenen), nur eine
     Brüstung an der offenen Kante. `buildRoom()` bekommt dafür zwei neue, schmale Felder:
     `boden.ober` (Teilfläche bei y = kit.HUB) und `props[].level` (Requisit auf der oberen
     Ebene). Jede Rotation eines neuen Teils (`barrier`, `barrier_corner`, `stairs_wood`) ist am
     Screenshot geprüft, nicht angenommen (Regel R3, Postmortem R08). */
  {
    id: 'R03', titel: 'Zweigeschossiges Lager', quelle: 's03',
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample2.png',
    vorlageLokal: 'ref/samples/s03_storage_twolevel.png',
    untertitel: 'Bühne · Galerie über der hinteren Hälfte, Treppe und Brüstung an der offenen Kante',
    w: 4, h: 4,
    kamera: { dir: [1, 0.55, 1], fov: 20, zielBreite: 0.68, zielHoehe: 0.56, zielVersatz: [0, -0.02] },
    ecke: 'wall_corner_small',
    boden: {
      standard: 'floor_tile_large',
      sonder: [],
      ober: [
        { cell: [0, 0], part: 'floor_wood_large', rot: 0 }, { cell: [1, 0], part: 'floor_wood_large', rot: 0 },
        { cell: [0, 1], part: 'floor_wood_large', rot: 0 }, { cell: [1, 1], part: 'floor_wood_large', rot: 0 }
      ]
    },
    waende: [
      { at: [0, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Rückwand · Regal mit Kerzen' },
      { at: [2, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [3, 0], dir: 'N', part: 'wall', rolle: 'Rückwand' },
      { at: [0, 0], dir: 'W', part: 'wall_doorway', rolle: 'Durchgang · Fackeln' },
      { at: [0, 1], dir: 'W', part: 'wall', rolle: 'Seitenwand · Fasslager' }
    ],
    props: [
      { part: 'box_stacked', pos: [0.8, 3.0], rot: 5, g: 'eg' },
      { part: 'barrel_large_decorated', pos: [2.2, 5.8], rot: 15, g: 'eg' },
      { part: 'bottle_A_green', pos: [1.0, 6.4], rot: 20, g: 'eg' },
      { part: 'bottle_B_green', pos: [1.7, 6.6], rot: 340, g: 'eg' },
      { id: 'truhe', part: 'chest_gold', pos: [3.4, 2.0], rot: 70, g: 'eg', funke: 1 },
      { part: 'table_medium_broken', pos: [9.0, 10.4], rot: 15, g: 'eg' },
      { id: 'treppe', part: 'stairs_wood', pos: [8.0, 10.4], rot: 180, fest: true, g: 'treppe' },
      { part: 'table_small', pos: [2.0, 1.0], rot: 90, level: 1, g: 'galerie' },
      { part: 'plate_stack', pos: [1.5, 0.6], rot: 0, level: 1, g: 'galerie' },
      { part: 'bottle_A_green', pos: [2.3, 0.7], rot: 30, level: 1, g: 'galerie' },
      { id: 'truhe_ob', part: 'chest', pos: [5.6, 1.4], rot: 20, level: 1, g: 'galerie' },
      { part: 'coin_stack_small', pos: [5.9, 2.2], rot: 0, level: 1, g: 'galerie' },
      { part: 'candle_lit', pos: [1.0, 5.6], rot: 0, level: 1, g: 'galerie', flamme: 1 },
      { part: 'barrier', pos: [2.0, 8.0], rot: 0, level: 1, fest: true, g: 'brüstung' },
      { part: 'barrier', pos: [6.0, 8.0], rot: 0, level: 1, fest: true, g: 'brüstung' },
      { part: 'barrier', pos: [8.0, 2.0], rot: 90, level: 1, fest: true, g: 'brüstung' },
      { part: 'barrier', pos: [8.0, 6.0], rot: 90, level: 1, fest: true, g: 'brüstung' },
      { id: 'eckpfosten', part: 'barrier_corner', pos: [8.0, 8.0], rot: 0, level: 1, fest: true, g: 'brüstung' }
    ],    fackeln: [{ at: [0, 0], dir: 'W' }],
    entzerren: true,
    blickfang: ['truhe'],
    gruppen: [
      { id: 'schatz', titel: 'Truhe (EG)', zustaende: [['zu', 'zu'], ['auf', 'offen']], start: 'auf',
        sfx: { auf: 'truhe', zu: 'deckel' }, vfx: { auf: 'funken' } },
      { id: 'eg', titel: 'Erdgeschoss', schalter: true, start: true },
      { id: 'galerie', titel: 'Galerie', schalter: true, start: true },
      { id: 'brüstung', titel: 'Brüstung', schalter: true, start: true },
      { id: 'treppe', titel: 'Treppe', schalter: true, start: true }
    ],
    abweichungen: [
      'Die Galerie hat keine eigenen Wände — nur die Brüstung an der offenen Kante. Ein Wandregal AUF der Galerie (die Vorlage zeigt eins) ist deshalb nicht gesetzt: der `wand`-Requisitenmechanismus kennt keine Ebene, nur die Bodenkrone der Erdgeschosswand. Ersatz: eine Kerze auf dem Galerieboden.',
      'Blindarkaden/Sockelverzierung der Rückwand sind im freien Pack nicht als eigenes Wandteil identifiziert — plain `wall` steht dort, keine Ersatzgeometrie.',
      'Kamera-Zielwerte sind aus der Bildkomposition geschätzt, nicht Pixel für Pixel gemessen — die Deckungszeile im Editor zeigt den Ist-Wert nach dem Bau.'
    ]
  }
];

/* ---------- Rezept → Platzierungen ---------- */
export function buildRoom(rec, kit) {
  const { MOD, box, frame } = kit;
  const out = [], notes = [];
  const have = (n) => !!box[n];
  const rotA = ([x, z], deg) => {
    const a = ((deg || 0) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, -x * s + z * c];
  };
  const put = (name, anchor, target, deg, y, extra) => {
    if (!have(name)) { notes.push(`fehlt im Pack: ${name}`); return null; }
    const a = rotA(anchor, deg || 0);
    const it = { a: 'dungeon:' + name, p: [target[0] - a[0], y, target[1] - a[1]], r: deg || 0, ...extra };
    out.push(it);
    return it;
  };
  const boxMid = (n) => { const b = box[n]; return [(b.min[0] + b.max[0]) / 2, (b.min[2] + b.max[2]) / 2]; };
  const faceOf = (nm) => {
    const f = nm ? frame[nm] : null;
    return f && f.faceFront != null ? Math.max(f.faceFront, f.faceBack) : kit.WALL_THICK / 2;
  };

  /* ---------- Boden ---------- */
  const sonderOf = new Map();
  for (const s of (rec.boden.sonder || [])) for (const [c, r] of s.cells) sonderOf.set(`${c},${r}`, s.part);
  for (let r = 0; r < rec.h; r++) for (let c = 0; c < rec.w; c++) {
    const part = sonderOf.get(`${c},${r}`) || rec.boden.standard;
    const nm = have(part) ? part : rec.boden.standard;
    put(nm, boxMid(nm), [c * MOD, r * MOD], (c * 7 + r * 13) % 4 * 90, -box[nm].max[1],
      { layer: 'floor', cell: [c, r] });
  }
  /* Obere Ebene (S22, R03): eine TEILFLÄCHE, keine zweite Grundfläche — nur die Zellen der
     Galerie/Balkon, bei y = kit.HUB (gemessener Treppenhub). Keine eigenen Wände: die
     Aussenwände der Bühne sind schon hoch genug für beide Ebenen, nur die offene Kante braucht
     eine Brüstung (als Requisite mit `level:1`, siehe unten — `barrier` hat keine Eckvariante,
     Fugensystem wäre hier Aufwand ohne Gegenwert). */
  for (const c of (rec.boden.ober || [])) {
    const nm = have(c.part) ? c.part : rec.boden.standard;
    put(nm, boxMid(nm), [c.cell[0] * MOD, c.cell[1] * MOD], c.rot || 0, kit.HUB - box[nm].max[1],
      { layer: 'floor', cell: c.cell, level: 1 });
  }

  /* ---------- Fugen · Knoten · Länge ----------
     S22: Ecke, T, Kreuz und freies Ende sind DERSELBE Fall — ein Gitterpunkt mit n Armen.
     Für jedes Knotenteil ist gemessen (`nodeFrame`, `tools/probe-wall-nodes.html`), wie weit
     seine Arme vom Gelenk reichen; daraus folgt, ob die anschliessende Fuge halbiert werden muss.
     Gemessen: wall_corner und wall_Tsplit und wall_crossing je 2,00 → Nachbarfuge halbieren.
     wall_corner_small 0,76 und wall_endcap 0,00 → Nachbarmodul bleibt ganz (das Endstück kragt
     1,07 nach AUSSEN aus, nicht in die Wand hinein). Die Länge folgt also weiter dem gemessenen
     Schenkel — nur nicht mehr nur dem der Ecke. */
  const eckTeil = have(rec.ecke) ? rec.ecke : 'wall_corner';
  const knotenTeil = (n) => (n === 1 ? (rec.enden || null) : n === 2 ? eckTeil
    : n === 3 ? (rec.tTeil || 'wall_Tsplit') : (rec.kreuzTeil || 'wall_crossing'));
  const rahmenVon = (part) => (part ? (kit.node && kit.node[part]) || frame[part] : null);
  const schenkelVon = (part) => {
    const nf = rahmenVon(part), b = box[part];
    if (!nf || !b || !nf.arms || !nf.arms.length) return MOD / 2;
    return Math.max(...nf.arms.map(([ax, az]) => (ax
      ? (ax > 0 ? b.max[0] - nf.joint[0] : nf.joint[0] - b.min[0])
      : (az > 0 ? b.max[2] - nf.joint[1] : nf.joint[1] - b.min[2]))));
  };
  const eckSchenkel = schenkelVon(eckTeil);
  notes.push(`Ecke ${eckTeil}: Schenkel ${eckSchenkel.toFixed(2)} → ${eckSchenkel > MOD / 4 + 0.05 ? 'Nachbarfuge halbiert' : 'Nachbarmodule bleiben ganz'}`);

  const armsAt = new Map();
  const seams = [];
  for (const w of rec.waende) {
    const [dx, dz] = DIR[w.dir];
    const c = w.at[0], r = w.at[1], nc = c + dx, nr = r + dz;
    const gc = Math.max(c, nc), gr = Math.max(r, nr);
    const run = dx ? 'z' : 'x';
    const pts = dx ? [`${gc},${gr}`, `${gc},${gr + 1}`] : [`${gc},${gr}`, `${gc + 1},${gr}`];
    const s = { ...w, run, pts, mid: [c + dx / 2, r + dz / 2], into: [-dx, -dz] };
    seams.push(s);
    const add = (k, d) => { if (!armsAt.has(k)) armsAt.set(k, new Set()); armsAt.get(k).add(d); };
    if (run === 'z') { add(pts[0], 'S'); add(pts[1], 'N'); } else { add(pts[0], 'E'); add(pts[1], 'W'); }
  }
  const cornerAt = new Set(), corners = [], freeEnds = [], knoten = [], frisst = new Map();
  for (const [k, set] of armsAt) {
    const a = [...set];
    const gerade = a.length === 2
      && ((a.includes('N') && a.includes('S')) || (a.includes('E') && a.includes('W')));
    if (gerade) continue;
    const [i, j] = k.split(',').map(Number);
    const art = a.length === 1 ? 'ende' : a.length === 2 ? 'ecke' : a.length === 3 ? 't' : 'kreuz';
    let part = knotenTeil(a.length);
    if (part && !have(part)) { notes.push(`Knoten ${art} an ${k}: ${part} nicht im Pack`); part = null; }
    const kn = { i, j, pt: k, dirs: a, arms: a.map((d) => DIR[d]), art, part, nf: rahmenVon(part) };
    if (art === 'ende') freeEnds.push({ pt: k, dir: a[0], part });
    if (art === 'ecke') { corners.push(kn); cornerAt.add(k); }
    /* Nur ein Knoten, der WIRKLICH gesetzt wird, deckt Fugenlänge. Ein freies Ende ohne
       Endstück (R02) lässt das letzte Modul ganz — sonst klaffte dort eine halbe Fuge. */
    if (part && kn.nf) frisst.set(k, schenkelVon(part) > MOD / 4 + 0.05);
    knoten.push(kn);
  }
  for (const s of seams) {
    const gedeckt = s.pts.filter((k) => frisst.get(k)).length;
    let part = s.part, shift = 0;
    if (gedeckt === 2) { notes.push(`Fuge ${s.at} ${s.dir}: beidseitig gedeckt`); continue; }
    if (gedeckt === 1 && !/doorway|gated/.test(part)) {
      part = have('wall_half') ? 'wall_half' : part;
      shift = frisst.get(s.pts[0]) ? 1 : -1;
    } else if (gedeckt === 1) {
      notes.push(`Fuge ${s.at} ${s.dir}: ${part} ist nicht halbierbar und überlappt den Knoten`);
    }
    const f = frame[part], b = box[part];
    if (!f || !b) { notes.push(`kein Rahmen für ${part}`); continue; }
    const sh = shift * (MOD / 4);
    const target = s.run === 'z' ? [s.mid[0] * MOD, s.mid[1] * MOD + sh] : [s.mid[0] * MOD + sh, s.mid[1] * MOD];
    put(part, f.anchor, target, (wallRot(f, s.run, s.into) + (s.drehen || 0)) % 360, -b.min[1], {
      layer: 'wall', seam: `${s.at}|${s.dir}`, seamPart: part, rolle: s.rolle,
      /* Das Türblatt BLEIBT — auf/zu ist eine Gruppe, kein Bauentscheid. Der Blattname folgt
         dem TEIL, nicht einem festen String: mit dem Wechsel auf `wall_doorway_scaffold` war das
         Blatt sonst wieder weg (derselbe Fehler wie in Post mortem pm2, einen Umbau später). */
      tuerblatt: /doorway/.test(part) ? part + '_door' : null
    });
  }
  for (const kn of knoten) {
    if (!kn.part || !kn.nf) continue;
    const deg = cornerRot(kn.nf, kn.arms);
    if (deg === null) { notes.push(`Knoten ${kn.art} ${kn.pt}: keine Drehung gefunden`); continue; }
    put(kn.part, kn.nf.joint, [(kn.i - 0.5) * MOD, (kn.j - 0.5) * MOD], deg, -box[kn.part].min[1],
      { layer: kn.art === 'ende' ? 'endcap' : 'corner', knoten: kn.art });
  }

  /* ---------- Fackeln (in R02 keine) ---------- */
  const tb = box.torch_mounted;
  if (tb) for (const t of (rec.fackeln || [])) {
    const [dx, dz] = DIR[t.dir];
    const into = [-dx, -dz];
    const asym = (i) => Math.abs(tb.min[i] + tb.max[i]) / Math.max(1e-6, tb.size[i]);
    const pi = asym(2) >= asym(0) ? 2 : 0;
    const sgn = Math.sign(tb.min[pi] + tb.max[pi]) || 1;
    const nat = pi === 0 ? [sgn, 0] : [0, sgn];
    const backLocal = sgn > 0 ? tb.min[pi] : tb.max[pi];
    const latLocal = pi === 0 ? (tb.min[2] + tb.max[2]) / 2 : (tb.min[0] + tb.max[0]) / 2;
    const anchor = pi === 0 ? [backLocal, latLocal] : [latLocal, backLocal];
    const seam = seams.find((s) => s.at[0] === t.at[0] && s.at[1] === t.at[1] && s.dir === t.dir);
    const off = faceOf(seam && seam.part) + 0.02;
    const mid = [t.at[0] + dx / 2, t.at[1] + dz / 2];
    put('torch_mounted', anchor, [mid[0] * MOD + into[0] * off, mid[1] * MOD + into[1] * off],
      dirRot(nat, into), kit.WALL_H * 0.55 - (tb.min[1] + tb.max[1]) / 2,
      { layer: 'torch', flamme: 1, g: 'licht' });
  }

  /* ---------- Requisiten ----------
     Zwei Durchgänge nach dem Setzen der Weltposition:
       1. Klemmen gegen die GEMESSENE Wandfläche der Nachbarfugen (nicht gegen die Nenndicke),
       2. Auseinanderschieben, wo sich zwei Requisiten überlappen.
     Beides war in der ersten Fassung nicht da — neun Teile steckten in der Wand, sieben
     ineinander, und die Prüfzeile sah es nicht. */
  const byId = new Map();
  const fl = [];
  for (const p of rec.props) {
    if (!have(p.part)) { notes.push(`fehlt im Pack: ${p.part}`); continue; }
    const b = box[p.part];
    if (p.bank) {
      /* Auf der gemessenen Fensterbank: Höhe aus `kit.sill`, Tiefe aus der Wandfläche,
         seitlich in Modulanteilen entlang der Fuge. Ohne Messung wird nichts gesetzt. */
      const [dx, dz] = DIR[p.bank.dir];
      const into = [-dx, -dz];
      const seam = seams.find((s) => s.at[0] === p.bank.at[0] && s.at[1] === p.bank.at[1] && s.dir === p.bank.dir);
      const bankY = seam && kit.sill ? kit.sill[seam.part] : null;
      if (bankY == null) { notes.push('keine gemessene Fensterbank an ' + (seam ? seam.part : '?') + ' — ' + p.part + ' nicht gesetzt'); continue; }
      const mid = [p.bank.at[0] + dx / 2, p.bank.at[1] + dz / 2];
      const laengs = dx ? [0, 1] : [1, 0];
      /* Tiefe aus der GEMESSENEN Bankfläche, nicht aus der Wandfläche: die Bank liegt IM
         Einschub, also hinter der Plattenfläche. Mit der Wandrequisiten-Rechnung
         (faceOf + halbe Eigentiefe) stand der Stapel davor in der Luft — genau der Befund. */
      const tiefe = kit.sillTiefe && kit.sillTiefe[seam.part];
      /* `p.tiefe` 0 = hinten an der Nischenrückwand, 1 = vorn an der Raumkante. */
      const anteil = p.tiefe ?? 0.5;
      const lokalMitte = tiefe ? tiefe.von + (tiefe.bis - tiefe.von) * anteil : 0;
      /* Das Teil ist gedreht gesetzt; die lokale Tiefenachse zeigt dann entgegen `into`. */
      const vz = (seam.drehen === 180 ? -1 : 1);
      const off = tiefe ? -vz * lokalMitte : faceOf(seam.part) + 0.02 + Math.max(b.size[0], b.size[2]) / 2;
      put(p.part, boxMid(p.part), [
        mid[0] * MOD + into[0] * off + laengs[0] * (p.seitlich || 0) * MOD,
        mid[1] * MOD + into[1] * off + laengs[1] * (p.seitlich || 0) * MOD
      ], 0, bankY - b.min[1], { layer: 'prop', propKind: 'bank', g: p.g, zs: p.s, propId: p.id });
      continue;
    }
    if (p.wand) {
      const [dx, dz] = DIR[p.wand.dir];
      const into = [-dx, -dz];
      const seam = seams.find((s) => s.at[0] === p.wand.at[0] && s.at[1] === p.wand.at[1] && s.dir === p.wand.dir);
      const asym = (i) => Math.abs(b.min[i] + b.max[i]) / Math.max(1e-6, b.size[i]);
      const pi = asym(2) >= asym(0) ? 2 : 0;
      const sgn = Math.sign(b.min[pi] + b.max[pi]) || 1;
      const nat = pi === 0 ? [sgn, 0] : [0, sgn];
      const centred = asym(pi) < 0.4;
      const back = centred ? (b.min[pi] + b.max[pi]) / 2 : (sgn > 0 ? b.min[pi] : b.max[pi]);
      const lat = pi === 0 ? (b.min[2] + b.max[2]) / 2 : (b.min[0] + b.max[0]) / 2;
      const anchor = pi === 0 ? [back, lat] : [lat, back];
      const off = faceOf(seam && seam.part) + 0.02 + (centred ? b.size[pi] / 2 : 0);
      const mid = [p.wand.at[0] + dx / 2, p.wand.at[1] + dz / 2];
      const y = kit.WALL_H * (p.frac ?? 0.6) - (b.min[1] + b.max[1]) / 2;
      put(p.part, anchor, [mid[0] * MOD + into[0] * off, mid[1] * MOD + into[1] * off],
        dirRot(nat, into), y, { layer: 'prop', propKind: 'wall', g: p.g, zs: p.s, propId: p.id });
      if (p.id) byId.set(p.id, { top: y + b.max[1], item: null });
      continue;
    }
    const target = p.pos ? [p.pos[0], p.pos[1]]
      : [(p.cell[0] + (p.off?.[0] ?? 0)) * MOD, (p.cell[1] + (p.off?.[1] ?? 0)) * MOD];
    const base = p.auf ? byId.get(p.auf) : (p.y === 'krone' ? null : typeof p.y === 'string' ? byId.get(p.y) : null);
    /* `y: 'krone'` — Requisit auf der WANDKRONE (Mauerkrone), nicht auf dem Boden. Kein Ratenmass:
       kit.WALL_H ist die gemessene Wandhöhe (box.wall.size[1]), also die reale Oberkante.
       `p.level` (S22, R03): Requisit auf einer OBEREN Ebene — Ebenenabstand ist `kit.HUB`
       (gemessener Treppenhub `stairs_wood`, NICHT die Wandhöhe angenommen — S13.2-Lehre). */
    const y = (p.y === 'krone' ? kit.WALL_H - b.min[1] : base ? base.top - b.min[1] : -b.min[1]) + (p.level || 0) * kit.HUB;
    /* Halbe Ausdehnung der GEDREHTEN Box, nicht der umschriebene Kreis: eine 1,70 × 1,45 grosse
       Truhe auf 60° misst quer 2,10 — mit max/2 = 0,85 gerechnet steckte der Goldhaufen 0,37 in
       ihr, und die Prüfung meldete es. Formel für die achsparallele Hülle einer gedrehten Box. */
    const deg = ((p.rot || 0) % 360 + 360) % 360;
    const rad = (deg * Math.PI) / 180;
    const ca = Math.abs(Math.cos(rad)), sa = Math.abs(Math.sin(rad));
    const hx = (b.size[0] * ca + b.size[2] * sa) / 2;
    const hz = (b.size[0] * sa + b.size[2] * ca) / 2;
    const item = { p, b, target, y, hx, hz, auf: p.auf || (typeof p.y === 'string' ? p.y : null) };
    item.deckel = p.deckel;
    fl.push(item);
    if (p.id) byId.set(p.id, { top: y + b.max[1], item });
  }

  let geklemmt = 0;
  const klemme = (it) => {
    if (it.auf || it.p.fest) return;
    const c = Math.round(it.target[0] / MOD), r = Math.round(it.target[1] / MOD);
    for (const [d, [dx, dz]] of DIRLIST) {
      const s = seams.find((s2) => (s2.at[0] === c && s2.at[1] === r && s2.dir === d)
        || (s2.at[0] === c + dx && s2.at[1] === r + dz && DIR[s2.dir][0] === -dx && DIR[s2.dir][1] === -dz));
      if (!s) continue;
      const vz = dx || dz;
      const grenze = (dx ? c : r) * MOD + vz * (MOD / 2 - faceOf(s.part) - 0.06);
      const i = dx ? 0 : 1, h = dx ? it.hx : it.hz;
      const rand = it.target[i] + vz * h;
      if (vz > 0 ? rand > grenze : rand < grenze) { it.target[i] += grenze - rand; geklemmt++; }
    }
  };
  for (const it of fl) klemme(it);

  /* `p.fest`: Architektur, keine Requisite (Brüstung, Treppe) — der Entzerrer darf sie NICHT
     verschieben. War der Bug in R03: `barrier`/`barrier_corner` bekamen 0,3–2,6 Einheiten
     Versatz vom Kollisions-Push (kollidierten mit der Treppe/anderen Segmenten), die Brüstung
     zerfiel in eine verzogene Form statt einer geraden Linie. Gemeldet von Georg per Screenshot,
     nicht von der Prüfzeile — sie zählt nur Überlappungen, nicht ob ein Architekturteil noch an
     seiner Rezept-Position steht. */
  const kollision = (a, b2) => {
    /* Zwei Auflagen auf DERSELBEN Unterlage liegen auf einer Ebene und müssen sich vertragen;
       eine Auflage gegen ein Bodenteil nicht — die liegt darüber. */
    if ((a.auf || b2.auf) && a.auf !== b2.auf) return null;
    if (a.p.g && a.p.g === b2.p.g && a.p.s && b2.p.s && a.p.s !== b2.p.s) return null;
    const ox = a.hx + b2.hx - Math.abs(a.target[0] - b2.target[0]);
    const oz = a.hz + b2.hz - Math.abs(a.target[1] - b2.target[1]);
    if (ox <= 0.02 || oz <= 0.02) return null;
    return ox < oz ? { i: 0, d: ox } : { i: 1, d: oz };
  };
  let geschoben = 0;
  if (rec.entzerren !== false) {
    for (let pass = 0; pass < 8; pass++) {
      let hits = 0;
      for (let i = 0; i < fl.length; i++) for (let j = i + 1; j < fl.length; j++) {
        if (fl[i].p.fest || fl[j].p.fest) continue;
        const k = kollision(fl[i], fl[j]);
        if (!k) continue;
        hits++;
        const sgn = Math.sign(fl[j].target[k.i] - fl[i].target[k.i]) || 1;
        fl[j].target[k.i] += sgn * (k.d + 0.03);
        klemme(fl[j]);
      }
      geschoben += hits;
      if (!hits) break;
    }
  }
  let rest = 0;
  for (let i = 0; i < fl.length; i++) for (let j = i + 1; j < fl.length; j++) {
    if (fl[i].p.fest && fl[j].p.fest) continue;   // Architektur darf sich an der Fuge berühren
    if (kollision(fl[i], fl[j])) rest++;
  }
  notes.push(`Requisiten: ${geklemmt}× an der Wandfläche geklemmt · Entzerrer ${rec.entzerren === false ? 'aus (Positionen sind die Abmessung)' : geschoben + '× geschoben'} · ${rest} Überlappung${rest === 1 ? '' : 'en'}`);

  for (const it of fl) {
    /* Was auf etwas steht, folgt dem Versatz seiner Unterlage. */
    if (it.auf) {
      const base = byId.get(it.auf);
      if (base && base.item) {
        const orig = base.item.p.pos || [(base.item.p.cell[0]) * MOD, (base.item.p.cell[1]) * MOD];
        it.target[0] += base.item.target[0] - orig[0];
        it.target[1] += base.item.target[1] - orig[1];
      }
    }
    put(it.p.part, boxMid(it.p.part), it.target, it.p.rot || 0, it.y,
      { layer: 'prop', propKind: 'floor', g: it.p.g, zs: it.p.s, propId: it.p.id,
        auf: it.auf, funke: it.p.funke, flamme: it.p.flamme, deckel: it.p.deckel });
  }

  return { placements: out, corners, freeEnds, knoten, notes, seams, eckTeil, eckSchenkel };
}
