# VFX-Katalog · Effekt-Spender und Effekte (WS0; R1 23.11.2026, R2 24.11.2026)

## Zweck
Eine zentrale Stelle für alle Effekte, die KFB nutzt oder nutzen könnte. Je Effekt stehen hier die Einstellungen, Presets, Dauer, grobe Kosten, KFB-Einsätze, Stolpersteine und der Status. Die Datei `vfx_katalog.r1.json` ist die SSOT dafür. `KFB_MODULE_KATALOG_R1.md` bleibt die Übersicht aller Spender und Reste; dieser Katalog geht bei den Effekten eine Ebene tiefer.

Stand R1: 10 Spender, 127 Effekte. Davon 20 im Spiel, 72 liegen im Stamm, sind aber ungenutzt, 35 gibt es nur extern.

## Schema `kfb.vfx-katalog/1`
```
{ schema, version, stand, gepflegt_von, quellen[], regeln{}, zahlen{},
  spender: [ {
    id, name, quelle_url, lizenz, version,
    im_stamm: { pfad, naht, schalter } | null,      // Pfade relativ zum Spiel-Repo
    einbauweg,                                      // feuerNaht, elementeNaht, effekseerSchicht, quarksHost, tintenKarte, plasmaKugel …
    renderer, vorschau{ url | datei }, caveats[], globale_parameter[]?, api[]?,
    effekte: [ {
      id,                                           // <spender-kurz>.<effekt>, z. B. effekseer.spark-hit
      name, art,                                    // Treffer, Strahl, Feuer, Portal, Zauber, Spur, Fläche, Umgebung, Projektil, Einschlag, Aura, Schild
      parameter: [ { name, bereich, standard, wirkung } ],
      presets: [ { name, werte } ], kfb_presets[]?,  // kfb_presets = von uns geprüfte Werte (z. B. VFX-Bühne)
      dauer_s, kosten: { stufe: leicht|mittel|schwer|unbekannt, worauf },
      use_cases[], caveats[],
      status: "im Spiel" | "vendored ungenutzt" | "nur extern", schalter,
      vorschau: { url?, datei?, flipbook? },
      quelle_datei?, …                              // je Spender Zusatzfelder (element, phasen_s, groesse_m_bei_scale_1, zielen …)
    } ]
  } ] }
```
Regeln:
- **„unbekannt“** heißt: weder Code noch Quelle belegen den Wert. Nichts ist geraten.
- **`wirkung`** ist aus der Quelle übernommen und übersetzt. Bei Ultra Elements beschreibt der Spender die 411 Einzelwerte nicht, darum steht dort „unbekannt“. Name, Bereich, Standard und die drei Looks sind belegt.
- **Bei Elements ist `dauer_s`** die Summe der Phasen ohne Flugzeit. Die einzelnen Phasen stehen in `phasen_s`.
- **Vorschau-URLs** zeigen auf die Bilder der Spender (git.patch.gg, fest auf einen Commit, oder cdn.patch.gg). **`datei`** ist ein Pfad im Stamm oder unter `replies/`. Neu gerendert ist nichts.

## R2 · Schema `kfb.vfx-katalog/2` (24.11.2026, V-2151)
Datei: `vfx_katalog.r2.json`. R1 bleibt daneben liegen.

Georgs Regel: Einen Effekt nicht so einsetzen, wie wir ihn uns vorstellen. Erst verstehen, wie der Spender ihn gedacht hat, dann bei uns den Kontext finden, der ihn mit möglichst wenig Anpassung nutzt.

R2 ergänzt jeden Effekt und jeden Spender um diese Felder:
- `gedachter_einsatz`: wofür der Spender ihn gebaut hat (Demo, Steuerung, Arena-Logik). Belegt aus Spender-Seite, README oder Kopfkommentar im Code; die Datei steht in Klammern dahinter.
- `einordnung_tech`: passt er zu unserem Stack? WebGL oder WebGPU, HDR über feuerNaht, Aqua-Artefakt (dort kein Effekseer, nur Flipbook), Leistung, Abhängigkeiten wie eigene Arena, Puppen oder Physik.
- `passt_bei_uns`: 1–3 KFB- bzw. Aqua-Kontexte, die dem gedachten Einsatz am nächsten kommen. Der nächstliegende steht zuerst.
- `warum_nicht`: wo er bei uns nicht wie gedacht funktioniert, und warum.
- `anpassung`: `{ stufe: keine | klein | mittel | groß, was }`. Die Stufe gilt für den **ersten** Eintrag in `passt_bei_uns`.
- `idee` (optional): eine kurze Gestaltungs- oder Nutzungsidee.

Weitere Neuerungen:
- Der Spender Ultra Elements hat zusätzlich `elements_einordnung`: Park-Grund V-1732, Kontexte, in denen die Zauber wie gedacht laufen, und eine Reihenfolge.
- `zahlen.nach_anpassung` zählt die Effekte je Stufe.
- Was nicht belegt ist, steht als „unbekannt“ da.

## So nutzen externe Chats den Katalog
Ein externer Chat (Claude Design, ChatGPT, WSA) bekommt diese Datei oder ihren Link. Ab R2 liest er zuerst `gedachter_einsatz` und `passt_bei_uns` und nimmt den Kontext mit der kleinsten `anpassung`. Erst danach sucht er über `art` oder `use_cases`. Er übernimmt dann `id`, `einbauweg` und die Parameter-Werte des Effekts wörtlich in seinen Auftrag. Neue Effekt-Formen erfindet er nicht. Was `status: "nur extern"` hat, braucht vorher einen Übernahme-Schritt durch WS0. Was „vendored ungenutzt“ ist, läuft über die genannte Naht, ohne neuen Effekt-Code. Die Stolpersteine (`caveats`) gehören in jeden Auftrag mit hinein, zum Beispiel den Flipbook-Weg für Effekseer im Aqua-Artefakt oder HDR nur über feuerNaht.

## Pflege
- **Eigentümer: WS0.** Nur WS0 schreibt in `vfx_katalog.r1.json`. Andere Stationen melden neue Effekte oder geänderte Werte an WS0, etwa über den Kanal oder die Rückgabe.
- **Neuer Spender:** zuerst eine Zeile in `KFB_MODULE_KATALOG_R1.md` (SOP §2, Schritt 8), dann hier ein Spender-Block mit Lizenz-Zeile aus der Quelle.
- **Neuer Einsatz im Spiel:** beim Effekt `status`, `schalter` und `kfb_presets` nachtragen, und zwar im selben Schritt, der ihn einbaut.
- **Werte nur aus Code oder Quelle:** Für Spender von patch.gg gilt die API `https://patch.gg/api/v1/projects/<owner>/<slug>/repo/file?path=recipe.json` (bzw. `spells.json`, `src/effects.baked.json`), nur lesen.
- **Großer Wechsel** (neues Schema, Umbau): als R2 neben R1 ablegen, R1 nicht überschreiben.
- R1 ist einmalig aus den Quellen erzeugt worden, Generator in WS0s Scratch. Ab jetzt wird die Datei von Hand gepflegt.
