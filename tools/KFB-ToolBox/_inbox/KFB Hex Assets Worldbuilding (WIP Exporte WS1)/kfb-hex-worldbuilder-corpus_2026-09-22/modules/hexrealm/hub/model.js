/* MENTALES MODELL · Gebäude, Bewohner, Requisiten
   ------------------------------------------------------------------
   Im Geist von S12 (mentales Modell der Kacheln): erst lesen, was ein Teil IST, dann daraus
   ableiten, wofür es steht. Die Zuordnung Sektion → Gebäude → Bewohner ist deshalb kein
   Geschmacksurteil, sondern fällt aus drei Fragen heraus:

     1 WAS TUT DAS GEBÄUDE?   Jedes Gebäude des Packs ist eine Funktion, kein Dekor. Eine Kirche
       verwahrt Verbindliches, eine Schmiede stellt Werkzeug her, eine Kaserne übt. Das ist die
       Bedeutungsachse — sie kommt aus dem Modell, nicht aus dem Aussehen.

     2 WAS TUT DER BEWOHNER?  Ein Atlas-Rezept ist nicht „eine Figur", sondern eine Figur MIT
       einer Tätigkeit und den Requisiten dieser Tätigkeit. Der Lorekeeper ist nicht „ein alter
       Mann", sondern „liest an einem Pult". Diese Tätigkeit muss zur Gebäudefunktion passen.

     3 BRINGT ER DIE KULISSE MIT?  Ein Bewohner, dessen Requisiten die Gebäudefunktion sichtbar
       machen, ist die bessere Wahl als einer, der nur thematisch danebenliegt. Deshalb steht die
       Witch an der Schmiede: sie ist die Einzige im Cast, die eine WERKBANK mitbringt.

   Was hier NICHT steht, steht bewusst nicht hier: Gebäude ohne Station sind Stadt, nicht Rest.
   Eine Sektion mehr im Hub bekommt ein Gebäude aus BUILDING_MODEL zugewiesen, kein neues. */

/* ---------- 1 · Gebäude ----------
   `affords` ist die Funktion, `reads` die Lesart im Hub-Zusammenhang. Beides ist Modell, nicht
   Messung — die Messung (Höhe, Grundfläche) kommt zur Laufzeit aus `measured` dazu. */
export const BUILDING_MODEL = {
  building_castle:     { affords: 'Sitz, Befehl, Fernsicht', reads: 'Lage und Kurs — wo man sich orientiert', weight: 'größtes Gebäude der Insel' },
  building_tower_A:    { affords: 'Verwahren, beobachten', reads: 'Abgelegtes, das noch dasteht', weight: 'schmal, hoch' },
  building_tower_B:    { affords: 'Wache, Vorposten', reads: 'Beobachtung am Rand', weight: 'schmal, hoch' },
  building_church:     { affords: 'Kanon, Verbindliches, Versammlung', reads: 'Quellen der Wahrheit', weight: 'mittel, markant' },
  building_market:     { affords: 'Umschlag, Öffentlichkeit, Vielfalt', reads: 'Stadt, Figuren, Drumherum', weight: 'breit, offen' },
  building_blacksmith: { affords: 'Werkzeug herstellen und schärfen', reads: 'Werkzeuge und Werkbänke', weight: 'Esse, Amboss' },
  building_barracks:   { affords: 'Üben, ausbilden, bereitstehen', reads: 'Handwerk, das geübt wird', weight: 'mittel' },
  building_watermill:  { affords: 'Dauerbetrieb am Wasser', reads: 'Etwas läuft von selbst weiter', weight: 'am Fluss gebunden' },
  building_windmill:   { affords: 'Dauerbetrieb am Wind', reads: 'Laufender Hintergrundprozess', weight: 'hoch, sichtbar' },
  building_lumbermill: { affords: 'Rohstoff zu Material', reads: 'Zulieferung, Vorprodukt', weight: 'breit' },
  building_mine:       { affords: 'Fördern, Bestand heben', reads: 'Registry, Bestand', weight: 'nicht auf dieser Insel gesetzt' },
  building_tavern:     { affords: 'Austausch, Erzählen, informell', reads: 'Was besprochen, nicht beschlossen wird', weight: 'mittel' },
  building_well:       { affords: 'Gemeinsame Quelle', reads: 'Geteilte Ressource', weight: 'klein, niedrig' },
  building_home_A:     { affords: 'Wohnen, privat', reads: 'Persönliche Ablage', weight: 'klein' },
  building_home_B:     { affords: 'Wohnen, privat', reads: 'Persönliche Ablage', weight: 'klein' }
};

/* ---------- 2 · Bewohner ----------
   `does` ist die Tätigkeit aus dem Rezept (nicht erfunden — sie steht dort als `activity`),
   `brings` die Kulisse, die er selbst mitbringt, `fits` die Gebäudefunktion, zu der das passt. */
export const RESIDENT_MODEL = {
  'lorekeeper':        { does: 'liest an einem Lesepult', brings: 'Lesepult mit offenem Foliant, Krummstab', fits: ['Kanon', 'Verwahren'] },
  'black-knight':      { does: 'steht kampfbereit, Schild vor', brings: 'Schwert und Schild (Large)', fits: ['Sitz, Befehl', 'Wache'] },
  'avian-swordsman':   { does: 'schlägt im Sprung auf die Trainingspuppe', brings: 'Trainingspuppe, Schwert', fits: ['Üben'] },
  'clown':             { does: 'steht auf dem Podest, jongliert', brings: 'Podest, Reifen, Ball', fits: ['Öffentlichkeit'] },
  'witch':             { does: 'steht an der Werkbank, Besen in der Hand', brings: 'Werkbank, Mörser, Kessel, Körbe', fits: ['Werkzeug', 'Mischen'] },
  'farmers':           { does: 'winkt und sticht im Beet', brings: 'Beete, zwei Schubkarren, Forke', fits: ['Rohstoff', 'Dauerbetrieb'] },
  'caveman':           { does: 'steht am Lagerfeuer', brings: 'Feuerstelle, Keule, Speer', fits: ['Ursprung', 'Fördern'] },
  'goth-girl':         { does: 'sitzt am Mikrofon und winkt', brings: 'Hocker, Mikrofonständer, Box', fits: ['Austausch'] },
  'toy-soldier':       { does: 'steigt aus der Geschenkbox', brings: 'Geschenkboxen', fits: ['Persönliche Ablage'] },
  'skeleton-warrior':  { does: 'steht untot, Axt und Schild', brings: 'Axt, Schild', fits: ['Verwahren', 'Verworfenes'] }
};

/* ---------- 3 · Requisitenklassen ----------
   Die Platzierung folgt der Klasse, nicht dem Einzelfall. Das ist der Grund, warum eine
   Schubkarre im Fluss stand: sie lag im Rezept 4,0 vom Aktor entfernt — in einer Vignette ohne
   Nachbarn völlig richtig, auf einer 2,0 breiten Hexkachel zwei Zellen weiter. */
export const PROP_CLASS = {
  hand:     'steckt im handslot-Bone, bewegt sich mit — keine eigene Position',
  landmark: 'die Kulisse der Tätigkeit (Pult, Puppe, Podest, Werkbank) — muss neben den Aktor',
  ground:   'abgestellt (Fass, Korb, Schubkarre) — darf weiter weg, aber nie von der Kachel',
  stacked:  'liegt auf einem Wirt (`on:`) — Höhe ist die SKALIERTE Oberkante des Wirts'
};

/* ---------- 4 · Das abgeleitete Mapping ----------
   Sechs Sektionen des Hubs, sechs Gebäude, sechs Bewohner. `why` ist die Ableitung aus 1+2+3,
   nicht die Begründung im Nachhinein. */
export const STATION_MAP = [
  {
    section: 'Recovery & coordination', cell: [5, 2], building: 'building_castle',
    resident: 'black-knight', label: 'Die Burg', sub: 'Lage, Kurs, Wiederaufnahme',
    why: 'Die Burg ist der Ort mit Übersicht, und der Black Knight steht in Deckung bereit — Funktion und Tätigkeit sagen dasselbe: hier verschafft man sich Lage, bevor man weitergeht.'
  },
  {
    section: 'Live tools & workbenches', cell: [5, 8], building: 'building_blacksmith',
    resident: 'witch', label: 'Die Schmiede', sub: 'Werkzeuge, die laufen',
    why: 'Die Schmiede ist das einzige Werkstattgebäude der Insel, und die Witch ist die einzige Bewohnerin, die eine WERKBANK mitbringt — Tisch, Mörser, Stößel, Kessel. Vorher stand hier ein Höhlenmensch mit Keule: Werkzeug ja, Werkbank nein.'
  },
  {
    section: 'KFB Town & meta', cell: [6, 5], building: 'building_market',
    resident: 'clown', label: 'Der Markt', sub: 'Stadt, Figuren, Drumherum',
    why: 'Der Markt ist die Öffentlichkeit der Insel, der Clown ihre Vorführung. Er bringt sein Podest selbst mit — die Station steht buchstäblich auf ihrer eigenen Bühne.'
  },
  {
    section: 'Project SSOTs & previews', cell: [3, 4], building: 'building_church',
    resident: 'lorekeeper', label: 'Die Kirche', sub: 'Quellen der Wahrheit',
    why: 'Die Kirche verwahrt das Verbindliche, der Lorekeeper liest es vor. Sein Lesepult trägt einen aufgeschlagenen Foliant: die Quelle steht offen da, statt weggeschlossen zu sein.'
  },
  {
    section: 'Core production skills', cell: [2, 5], building: 'building_barracks',
    resident: 'avian-swordsman', label: 'Die Kaserne', sub: 'Handwerk und Übung',
    why: 'Die Kaserne übt, der Avian Swordsman schlägt auf eine Trainingspuppe ein. Können wird hier geübt, nicht behauptet — die Puppe ist der Beweis, dass geübt wird.'
  },
  {
    section: 'Archived / rejected history', cell: [4, 2], building: 'building_tower_A',
    resident: 'skeleton-warrior', label: 'Der Archivturm', sub: 'Verworfenes, aufbewahrt',
    why: 'Ein Turm verwahrt und überblickt, ein Skelett ist das, was nicht mehr läuft und trotzdem noch dasteht. Genau das ist verworfene Historie: aufgehoben, nicht gelöscht.'
  }
];

/* Bewohner ohne Station bleiben Kandidaten, keine Lücke: Farmers (Rohstoff, passte zur Mühle),
   Caveman (Ursprung, passt zur Mine — die auf dieser Insel nicht gesetzt ist), Goth Girl
   (Austausch, passt zur Taverne). Sie stehen bereit, sobald der Hub eine Sektion dafür hat. */
export const BENCH = ['farmers', 'caveman', 'goth-girl', 'toy-soldier'];
