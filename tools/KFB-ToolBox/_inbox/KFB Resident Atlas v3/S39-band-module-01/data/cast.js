/* KFB Town Resident Atlas · local resident recipes (candidate-only)
   NOT a new global KFB schema. Each entry is an Atlas-local placement recipe whose
   asset paths and rig facts come from:
     · tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/
       kfb-asset-handoff-animation-lab (2).json   — kfb.asset-handoff.v1 @ 891eadf0
     · registry/assets/v1/packs/kaykit-character-animations-1-1.json
                                                  — kfb.asset-pack.v1 @ aa16a777
   Suitability for runtime, rig grafting and animation stays with the receiving consumer. */

/* HAND-REQUISITEN · STRUKTURREGEL (S18)
   Die `handslot.l`/`handslot.r`-Bones sind von Kay Lousberg als Befestigungspunkte gebaut:
   die Requisiten-Pivots sind auf genau diese Bone-Orientierung authored. Eine Requisite mit
   IDENTITÄTS-Transform (keine Drehung, kein Offset, keine Skalierung) sitzt deshalb von sich
   aus korrekt — in jeder Pose, weil sie rigide mit der Hand mitgeht.

   Der Atlas hat das lange gegen sich selbst gearbeitet: über gerechnete Weltrichtungen (`aim`),
   Roll-Winkel und `grip`-Verschiebungen wurde jede Requisite einzeln "hingedreht", was pro
   Figur mehrere Korrekturrunden kostete und bei Posenwechsel wieder brach. Alle 15 Hand-
   Befestigungen (S19: 14, nachdem das Witch-Pilzkörbchen abgesetzt wurde) sind jetzt auf
   `hand: { of, bone }` reduziert. Für neue Residents gilt:
   erst Identität probieren — eine Extra-Drehung braucht nur, was sichtbar nicht sitzt.

   DREI BELEGTE AUSNAHMEN (S19), jede aus einem sichtbaren Defekt begründet:
   · SCHILDE generell `push` — gemessen: der Pivot liegt auf der RüCKFLÄCHE des Schilds
     (Skeleton_Shield_Small_A: z von -0,045 bis +0,112). KayKits Anker ist also genau der,
     den man will — Schildrücken an der Hand. Die Faust ragt trotzdem durch, weil die Hand
     VOLUMEN vor dem Bone hat. Korrektur ist deshalb immer ein Schub entlang der Schild-
     Normale in Höhe der Handdicke, nie ein Neudrehen:
     Black Knight `push: 0.55` (große Panzerfaust), Skeleton Warrior `push: 0.18`.
   · Lorekeeper-Krummstab `aim` + `s: 0.65` — unter Identität lag er flach am Boden wie ein
     fallengelassener Stock; die Promo zeigt ihn aufgestützt. Einzige Requisite, die eine
     echte Richtungsvorgabe braucht.
   · Farmers-Forke `push: 0.62` entlang Bone-(-Y) — Zinken steckten 0,39 unter dem Boden.

   Gemessen über alle zehn Residents: kein Bodendurchstich mehr (Minimum y ≥ -0,014). */

/* VIERTE KLASSE · SCHUSSWAFFEN LIEGEN AUF LOKAL +Z (S31 Blaster, S33 gemessen und verallgemeinert)
   Die Identitätsregel wurde an Schwertern, Äxten, Streitkolben und Stäben belegt — und die haben
   alle ihre LANGACHSE auf lokal +Y. Schusswaffen haben sie auf lokal +Z:
     · UltraTurboHeroMan_Blaster  z von -0,246 bis +0,759
     · ToySoldier_Rifle           0,291 × 0,539 × 2,492, Langachse Z, Pivot 0,431 hinter dem Griff
     · Marksman_Rifle             0,495 × 1,035 × 2,271, Langachse Z, Pivot 0,585 hinter dem Griff
   Der handslot-Bone hat lokal Y = vorn und Z = oben (in Bind-Pose nachgemessen, siehe unten).
   Eine +Z-Waffe unter Identität zeigt deshalb auf Slot-OBEN — in T-Pose senkrecht nach oben, in
   jeder Standpose quer. Das ist kein Sonderfall, das ist eine zweite Pack-Konvention, und sie
   braucht die Zuordnung `slotAxis {from:[0,0,1], to:[0,1,0]}` plus einen Rollwinkel, der das
   Zielfernrohr nach oben dreht.

   DER ROLLWINKEL WIRD GERECHNET, NICHT PROBIERT. Für die Laufrichtung b und die Visier-Oben-
   Richtung s bei Roll 0 gilt s(θ) = cos θ · s + sin θ · (b × s); der senkrechte Anteil ist damit
   maximal bei θ = atan2((b×s)·ŷ, s·ŷ). Marksman-Gewehr → 90° (gemessen bestätigt: y-Anteil 1,000),
   Toy-Soldier-Gewehr → 105° (0,995). Zwei Wege zu einer Zahl, statt eines Winkel-Sweeps.

   GEGENPROBE, die die Zuordnung von einem Posenzufall unterscheidet: eine RICHTIGE Zuordnung ist
   eine feste lokale Drehung und muss deshalb in mehreren Clips halten. Marksman-Gewehr mit
   Z→vorn + Roll 90 in vier unabhängigen Posen — Idle_A, Idle_B, Crouching, Lie_Down:
   Vorwärtsanteil 0,965 / 0,990 / 0,930 / 0,989, Waagerechtigkeit |y| 0,000 / 0,102 / 0,141 / 0,000,
   Visier oben 1,000 / 0,959 / 0,990 / 1,000. Die Alternative Z→außen sah in Holding_B besser aus
   (Lauf 0,995 waagerecht) und lieferte in jeder anderen Pose Unsinn — genau das Muster eines
   Posenzufalls. */

/* LARGE-RIG-MASSSTAB · STRUKTURREGEL (S20, Georg-Befund an den Vorlagen)
   Rig_Large ist nicht "Rig_Medium, nur größer gerendert", sondern ein Skelett mit doppeltem
   Maß. Gemessen an derselben Pose (Idle_A): Handabstand 2,352 gegen 0,849, Kopf-Bone y=3,116
   gegen 1,228, Figurhöhe 4,1–4,7 gegen 2,3–2,6. Faktor ≈ 2.

   Genau deshalb liefern die Packs jede Waffe und jedes Schild ZWEIMAL: die Basisdatei für das
   Medium-Rig und `*_Large` für das große. Nachgemessen, exakt 2× in allen drei Achsen —
   Schwert 2,059/4,117 · Schild 1,245/2,490 · Scheunentor 1,539/3,079 · Mistgabel 1,646/3,292 ·
   Orc-Axt 0,836/1,672 · Orc-Banner 2,512/5,025. Das ist keine Deko-Variante, das ist die
   Größenzuordnung.

   Der Atlas hatte es umgedreht: Large-Residents trugen die MEDIUM-Ausführung in der Faust,
   die Large-Variante lag "zum Vergleich" daneben. In den drei Vorlagen (Black-Knight-Promo,
   October2025_Monstrosity.gif, August2025_OrcBrute.gif) hält jede Figur die Large-Variante —
   das Schwert reicht dem Ritter bis über den Kopf, das Scheunentor der Monstrosity bis zum
   Knie, das Banner des Brute ist so hoch wie er. Seit S20 ist die Zuordnung getauscht:
   `*_Large` in die Hand, die kleine Ausführung als abschaltbarer Größenvergleich daneben.

   EIN FREMDPACK-FALL: die Orc-Raider-Requisiten (Keule, Trommel, Schlägel, Horn, Rucksack)
   stammen aus dem Medium-Pack von 2023 und haben KEINE Large-Variante. Sie laufen auf `s: 2` —
   derselbe Faktor, den Kay Lousberg selbst für seine Large-Varianten verwendet, nicht ein
   nach Augenmaß gesetzter Wert. Ausgewiesen, weil es die einzige Atlas-Skalierung im Satz ist. */

export const SLOTS = {
  1: 'Identität / Ikone',
  2: 'Aktivität / Werkzeug',
  3: 'Zuhause / Möbel',
  4: 'Sozial / Performance',
  5: 'Lore / Narrativ',
  6: 'Lull / Eigenheit'
};

const P = 'media/3D_Assets/KayKit_Mystery_Series6/';
/* Mixed Bag 1 liegt AUSSERHALB der Mystery-Series und ist erst nach dem gepinnten
   Asset-Commit eingecheckt worden — die beiden E-Gitarren laufen deshalb auf commit: 'main'.
   Das ist die einzige unpinned Quelle im ganzen Cast und im Recipe als OPEN ausgewiesen. */
const MB = 'media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/';
const MB_COMMIT = 'main';
const T = P + '6 - December 2025 - Toy Soldier/';
const FA = P + '12 - June 2026 - Farmers/';
const CV = P + '8 - February 2025 - Caveman/';
const LK = P + '1 - July 2025 - Lorekeeper/';
const WI = P + '5 - November 2024 - Witch/';
const BK = P + '3 - September 2024 - Black Knight/';
const MM = P + '10 - April 2026 - Marksman/';
const HD = P + '8 - February 2026 - Hoarder/';
const PL = P + '5 - November 2025 - Plant Warrior/';
const GN = P + '7 - January 2026 - 4GTN/';
const HK = P + '11 - May 2025 - Hiker/';
const PG = P + '10 - April 2025 - Protagonists/';
/* ATLAS-EIGENE GEOMETRIE · kein Pack liefert ein Smartphone. Alles mit `gen:` ist von mir
   authored, nicht von Kay Lousberg, und trägt deshalb einen eigenen Pfad-Namensraum, damit
   es im Recipe-JSON und im Panel unterscheidbar bleibt. Siehe lib/props.js. */
const GEN = 'atlas://generated/';
const AV = P + '9 - March 2026 - Avian Swordsman/';
/* eigenständiger Pack außerhalb Series 6 \u2014 eigene Root, kein Handoff-Pfad */
const SK = 'media/3D_Assets/KayKit_Skeletons/';
const DL = P + 'DemonLord/';
const OB = P + '2 - August 2025 - Orc Brute/';
const MO = P + '4 - October 2025 - Monstrosity/';
/* Fremdpack: die Trommel-, Keulen- und Lager-Requisiten des Brute stammen aus dem
   zwei Jahre älteren Orc-Raider-Pack. Ausgewiesen, nicht stillschweigend gemischt. */
const OR = P + '1 - July 2023 - Orc Raider/assets/gltf/';
/* Legacy-Klasse: eigener Root AUSSERHALB Series 6, eigener Commit-Pin (der S5-Pin kennt den
   Ordner nicht). Figuren und Rig liegen in zwei getrennten Packs. */
const LG = 'media/3D_Assets/KayKit Legacy/';
const WB = LG + 'Orc Warband - legacy/';
const LEGACY_RIG_A = LG + 'KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';
const LEGACY_PIN = '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
/* Fremdpack-Sammelordner des Repos — nicht KayKit, ausgewiesen wo benutzt. */
const KFB = 'media/3D_Assets/KFB/';
const CE = P + '3 - September 2025 - Cleric/';
const UT = P + 'UltraTurboHeroMan/';
const AN = P + '5 - November 2023 - Animatronic/';
const AF = P + '6 - December 2023 - Action Figure/';
/* Beide Recap-GIFs liegen unter ref/atlas/ — aus Georgs Vorlagenordner kopiert, weil die
   Packs selbst im Repo kein Promo mitbringen. Sie sind die Vorlage für den S20-Maßstabsfix. */

export const RESIDENTS = [
  {
    residentId: 'goth-girl',
    name: 'Goth Girl',
    display: 'Goth Girl · Novacyy-Kandidatin',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series · Character 3 (Series 7 Artwork)',
    townRole: 'Bühnen-Resident · Auftritt / Musik',
    habitatIntent: 'Ruinierte Stadtbühne (Promo). Kulissen-Kandidat noch offen.',
    activity: 'Sitzt auf dem Hocker am Mikrofonständer, Boxe links',
    relationships: ['Birthday-Set Elisa (Quelle des Handoffs)', 'Ensemble-Kandidatin Town-Bühne'],
    reference: { src: 'ref/atlas/GothGirl.gif', label: 'KayKit Monthly Mystery · Series 7 · Character 3', promoBackground: 0x585858 },
    keyArt: { dir: [0.12, 0.30, 1], pad: 1.12 },
    actor: {
      id: 'gothgirl', role: 'resident', a: P + 'GothGirl/characters/GothGirl.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Sit_Chair_Idle$/, poseFreeze: false,
      /* correct seating is a BONE problem, not a box problem — see lib/atlas.js sitOn */
      sitOn: { host: 'stool' },
      /* sitzt und winkt: der Sitz-Clip behält alles außerhalb des chest-Teilbaums,
         "Waving" treibt Brust, Arme und Kopf. Die Bibliothek hat kein "Wave" — nur "Waving". */
      layer: { from: /^Waving$/, mask: 'torso' },
      texture: P + 'GothGirl/textures/gothgirl_texture.png (Variante A · texture_b ist Alt-Variante)'
    },
    habitat: [],
    signatureProps: [
      { id: 'stool', slot: 3, role: 'Sitz / Möbel', a: P + 'GothGirl/assets/gltf/GothGirl_Stool.gltf', p: [0, 0] },
      { id: 'speaker', slot: 4, role: 'Bühne / Performance', a: P + 'GothGirl/assets/gltf/GothGirl_Speaker.gltf', p: [-0.85, -0.05], r: 14 },
      { id: 'micstand', slot: 2, role: 'Aktivität / Mikrofonständer', a: P + 'GothGirl/assets/gltf/GothGirl_MicStand.gltf', p: [0.8, 0.12], r: -28 },
      { id: 'microphone', slot: 1, role: 'Identität / Handmikro', a: P + 'GothGirl/assets/gltf/GothGirl_Microphone.gltf', optional: true, hand: { of: 'gothgirl', bone: 'handslot.r' } }
    ],
    notes: [
      'Alle vier Requisiten liegen in derselben Collection (GothGirl) — gleiche Textur gothgirl_texture.png, kein Cross-Pack-Risiko.',
      'Requisiten sind .gltf mit externem .bin + .png (dependencyStatus: complete im Handoff). Dependencies werden vom GLTFLoader relativ aufgelöst.',
      'Handmikro (Slot 1) steckt in handslot.r und ist standardmäßig aus: die Promo zeigt es nicht. Bewusste Abweichung, umschaltbar.',
      'Sitz-Pose: Sit_Chair_Idle aus Rig_Medium_Simulation.glb. Hockerhöhe 0.8 und die Sitzhöhe der Klammer passen zusammen, weil beide von Kay Lousberg für dasselbe Rig gebaut sind — geprüft am Bodenkontakt, nicht angenommen.',
      'S5-Korrektur: die Figur stand hinter dem Hocker, weil sie per Bounding-Box gegroundet wurde. Box3 sieht keine Skinning-Deformation — die Box war die stehende Rest-Pose. Jetzt wird der Hüft-Bone auf die gemessene Sitzfläche gesetzt.',
      'Gemessen: Hüft-Bone lag in der Sitz-Pose bei y=0.481, die Hockeroberfläche liegt bei y=0.800 — die Figur wurde um 0.319 gehoben. Das ist die ganze Korrektur, kein Augenmaß.',
      'Winken im Sitzen entsteht aus zwei echten Clips: Sit_Chair_Idle außerhalb von "chest", Waving innerhalb. Der Masken-Bone wird aus der Hierarchie ermittelt (gemeinsamer Vorfahre beider Armketten), nicht über einen fest verdrahteten Namen.'
    ],
    open: [
      'Promo-Kulisse (ruinierte grauskalierte Stadt) ist kein Handoff-Asset — Kandidat über Librarian noch offen.',
      'Sitz-Pose kommt aus der geteilten Rig_Medium-Bibliothek, nicht aus dem Charakter-GLB (animationCount 0). Endgültige Motion-Eignung gehört der Animation Lab.'
    ]
  },
  {
    residentId: 'clown',
    name: 'Clown',
    display: 'Clown · Zirkus-Resident',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series · 11 - May 2024 - Clown',
    townRole: 'Performer · Zirkus / Jahrmarkt',
    habitatIntent: 'Zirkus-Podest-Nummer (Promo-Artwork 1:1)',
    activity: 'Balanciert auf dem Podest, Hammer rechts, Jonglierkeule links',
    relationships: ['Birthday-Set-Kandidat (Ballons, Torte-Kontext)', 'Gegenstück zur Goth-Girl-Bühne'],
    reference: { src: 'media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/artwork.png', label: 'KayKit Clown · Promo-Artwork', promoBackground: 0xa974f0 },
    keyArt: { dir: [0.05, 0.22, 1], pad: 1.3 },
    actor: {
      id: 'clown', role: 'resident', a: P + '11 - May 2024 - Clown/characters/Clown.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.5, 0], r: 0, on: 'podium',
      pose: /^Idle_B$/, poseFreeze: false,
      texture: P + '11 - May 2024 - Clown/textures/clown_texture.png'
    },
    habitat: [
      { id: 'podium', role: 'landmark · Hauptpodest', a: P + '11 - May 2024 - Clown/assets/gltf/circus_podium.gltf', p: [-1.5, 0] }
    ],
    signatureProps: [
      { id: 'hammer', slot: 1, role: 'Identität / Clownhammer', a: P + '11 - May 2024 - Clown/assets/gltf/clown_hammer.gltf', hand: { of: 'clown', bone: 'handslot.r' } },
      { id: 'pin_blue', slot: 2, role: 'Aktivität / Jonglierkeule', a: P + '11 - May 2024 - Clown/assets/gltf/juggling_pin_blue.gltf', hand: { of: 'clown', bone: 'handslot.l' } },
      { id: 'ball', slot: 4, role: 'Nummer / Balancierball', a: P + '11 - May 2024 - Clown/assets/gltf/clown_ball.gltf', p: [1.5, -0.55] },
      { id: 'podium_hoop', slot: 6, role: 'Podest für Reifen', a: P + '11 - May 2024 - Clown/assets/gltf/circus_podium.gltf', p: [2.95, -0.95], s: 0.55, scaleNote: 'Vorschau-Korrektur: Promo zeigt ein kleineres Podest; das Pack hat nur circus_podium. s=0.55 ist bewusst gesetzt, kein Registry-Fakt.' },
      { id: 'hoop', slot: 5, role: 'Lore / Sprungreifen', a: P + '11 - May 2024 - Clown/assets/gltf/circus_hoop.gltf', on: 'podium_hoop', p: [2.95, -0.95] },
      { id: 'podium_dog', slot: 6, role: 'Podest für Ballonhund', a: P + '11 - May 2024 - Clown/assets/gltf/circus_podium.gltf', p: [0.15, 0.25], s: 0.5, scaleNote: 'Wie podium_hoop: bewusste Vorschau-Skalierung.' },
      { id: 'dog_yellow', slot: 3, role: 'Ballonhund auf Podest', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_dog_yellow.gltf', on: 'podium_dog', p: [0.15, 0.25], r: -18 },
      /* Promo-Füllung: gehört zum 1:1-Nachbau, nicht zum Sechs-Slot-Signatursatz */
      { id: 'dog_red', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_dog_red.gltf', p: [-2.35, 0.82], r: 62 },
      { id: 'dog_green', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_dog_green.gltf', p: [-1.8, 1.05], r: -40 },
      { id: 'bomb_a', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf', p: [-0.95, 1.25] },
      { id: 'bomb_b', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf', p: [1.15, 1.15], r: 30 },
      { id: 'pin_green', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/juggling_pin_green.gltf', p: [0.25, 0.95], r: 74, rx: 90 },
      { id: 'pin_red', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/juggling_pin_red.gltf', p: [0.65, 1.05], r: 108, rx: 90 },
      { id: 'bal_blue_l', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_blue.gltf', p: [-3.0, -2.45], float: 3.15 },
      { id: 'bal_green_l', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_green.gltf', p: [-3.5, -2.1], float: 2.35 },
      { id: 'bal_red_l', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_red.gltf', p: [-2.6, -2.15], float: 2.7 },
      { id: 'bal_green_r', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_green.gltf', p: [1.75, -2.35], float: 2.95 },
      { id: 'bal_blue_r', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_blue.gltf', p: [1.25, -2.0], float: 2.25 },
      { id: 'bal_yellow_r', role: 'promo-extra', a: P + '11 - May 2024 - Clown/assets/gltf/balloon_yellow.gltf', p: [2.2, -2.15], float: 2.6 }
    ],
    notes: [
      'Alle 18 Clown-Assets stammen aus einer Collection, eine Textur (clown_texture.png) — sauberster 1:1-Fall im Handoff.',
      'Das Promo-Artwork zeigt mehr Objekte als sechs. Sechs Slots sind belegt, der Rest ist explizit als promo-extra markiert und nicht als Signatur-Requisite gezählt.',
      'Zwei Podeste sind bewusst skalierte Instanzen desselben Meshes (siehe scaleNote) — kein zweites Modell erfunden.',
      'S32 · INSZENIERUNG: die erste Fassung lag auf einem flachen z-Band (-1,35 bis 1,3) und las sich als Reihe. Neu in drei Tiefenebenen gruppiert, ohne ein Objekt zu tauschen oder zu skalieren — nur Positionen: HINTEN die zwei Ballontrauben (z -2,0 bis -2,45, Schwebehöhen 2,25 bis 3,15 statt 2,0 bis 2,6); DAHINTER-MITTE Ball (z -0,55) und Reifen-Podest (z -0,95); MITTE Hauptpodest mit Figur und Ballonhund-Podest; VORN die zwei losen Ballonhunde am Podestfuß (z 0,82 / 1,05), davor Bomben (1,15 / 1,25) und lose Keulen (0,95 / 1,05) als Pointe. Die Stärke der Staffelung ist Bildabgleich gegen die Promo-Blende, keine gemessene Größe.',
      'S32b · DIE VORDEREBENE MUSS ÜBER DER CAPTION-BANDE BLEIBEN. Erste Fassung schob Bomben auf z 1,85 und Keulen auf 2,10 — projiziert lagen sie bei Bildschirm-y 482 und 505, und die HUD-Leiste (#dockrow) beginnt bei 475. Verdeckt war damit genau das, was als Pointe gedacht war. Die Leiste ist nicht wegschaltbar („Leiste ausblenden“ klappt die Seitenspalte, nicht die Caption). Vorderebene deshalb auf z 0,82 bis 1,25 zurückgenommen — gemessener Abstand zur Leistenoberkante danach: Ballonhunde +71/+76 px, Bomben +65/+68 px, Keulen +57/+60 px. Zwischenstand war +11 bzw. -8 px: die Keulen lagen nach dem ersten Zurücknehmen noch unter der Kante, weil sie flach liegen und ihr tiefster Punkt am Boden näher an die Kante reicht als eine stehende Bombe und pad von 1,2 auf 1,3 erhöht, weil die Vignette rund 1,7 tiefer geworden ist als beim Setzen des alten Werts. Geprüft wird das durch PROJEKTION gegen die Oberkante der Leiste, nicht nach Augenschein.',
      'Pose: Idle_B aus Rig_Medium_General.glb. Das Promo-Artwork zeigt eine Balance-Pose auf einem Bein; die geteilte Bibliothek hat keinen Balance-Clip. Abweichung bleibt stehen, statt sie zu erfinden.'
    ],
    open: [
      'Ballon-Schwebehöhen sind Bildabgleich, keine gemessene Registry-Größe.',
      'Die geteilte Bibliothek hat 119 Clips in 7 Sets, aber keinen Balance-Clip — über die vollständige Clip-Liste geprüft, nicht vermutet.',
      'Promo-Hintergrund ist ein Studio-Violett; die Atlas-Grundbeleuchtung bleibt neutral, damit Residents vergleichbar bleiben.'
    ]
  },
  {
    residentId: 'toy-soldier',
    name: 'Toy Soldier',
    display: 'Toy Soldier · Nussknacker',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 6 · 6 - December 2025 - Toy Soldier',
    townRole: 'Wach-Resident · Parade / Spielzeug',
    habitatIntent: 'Geschenk-Enthüllung: geschlossene Schachtel → aufgerissenes Papier → Figur',
    activity: 'Steigt aus der Geschenkbox, Gewehr rechts, Trompete links',
    relationships: ['Birthday/Weihnachts-Set (Santa-Präsente sind Nachbarkandidaten)', 'Paradegegenstück zu Clown und Goth Girl'],
    reference: { src: 'uploads/contents (9).png', label: 'KayKit Series 6 · Character 6 · The Toy Soldier · contents', promoBackground: 0x6f767e },
    keyArt: { dir: [0.16, 0.26, 1], pad: 1.06 },
    actor: {
      id: 'soldier', role: 'resident', a: T + 'ToySoldier.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Idle_B$/, poseFreeze: false, on: 'unwrapped',
      texture: T + 'toy_soldier_texture.png (im .glb eingebettet — format: glb, embedded)'
    },
    habitat: [
      { id: 'unwrapped', role: 'landmark · aufgerissenes Geschenkpapier', a: T + 'gltf/Present_UnwrappedBase.gltf', p: [0, 0] }
    ],
    signatureProps: [
      /* S33 · KORREKTUR, vom Marksman aufgedeckt: das Gewehr trug seit S18 reine Identität und
         zeigte damit zur Seite. Gemessen in Idle_B: Vorwärtsanteil der Laufrichtung -0,118 unter
         Identität gegen 0,990 mit der Zuordnung Lauf(+Z) → Slot-vorn(+Y). Der Rollwinkel ist
         gerechnet, nicht probiert: das Zielfernrohr steht senkrecht bei 105° (y-Anteil 0,995).
         Dieselbe +Z-Konvention wie Blaster und Marksman-Gewehr — siehe Kopf dieser Datei.
         A/B am gebauten Knoten, damit die Korrektur keine Verschlechterung erkauft: die Zahl der
         Gewehrpunkte im Wirtskörper bleibt praktisch gleich (13/262 unter Identität, 14/262 mit
         Zuordnung) — die Laufrichtung dreht sich, die Durchdringung nicht. */
      { id: 'rifle', slot: 1, role: 'Identität / Gewehr mit Bajonett', a: T + 'gltf/ToySoldier_Rifle.gltf',
        hand: { of: 'soldier', bone: 'handslot.r', slotAxis: { from: [0, 0, 1], to: [0, 1, 0] }, slotRoll: 105 } },
      { id: 'trumpet', slot: 2, role: 'Aktivität / Signaltrompete', a: T + 'gltf/ToySoldier_Trumpet.gltf',
        hand: { of: 'soldier', bone: 'handslot.l' } },
      { id: 'present', slot: 5, role: 'Lore / verschlossene Geschenkbox', a: T + 'gltf/Present_Base.gltf', p: [0, 0] },
      { id: 'present_side', slot: 4, role: 'Sozial / zweites Präsent', a: T + 'gltf/Present_Base.gltf', p: [2.75, -0.55], r: -24 },
      { id: 'present_back', slot: 6, role: 'Eigenheit / kleines Präsent', a: T + 'gltf/Present_Base.gltf', p: [-2.45, -0.75], s: 0.42, r: 38, scaleNote: 'Das Pack hat genau eine verschlossene Box (1,99 × 3,48 × 1,99). Das kleine Präsent ist eine bewusst skalierte Zweitinstanz, kein zusätzliches Modell.' }
    ],
    /* Geschenk-Enthüllung: Antizipation → Pop → Überschwingen → Setzen.
       Nur die fünf belegten Pack-Modelle, kein erfundener Deckel. */
    reveal: {
      duration: 4.8, loop: true,
      phases: [[0, 'Box geschlossen'], [0.45, 'Antizipation'], [1.0, 'Pop'], [1.35, 'Figur überschwingt'], [1.85, 'Requisiten'], [2.3, 'Idle']],
      tracks: [
        { node: 'present', prop: 'visible', keys: [[0, true], [1.0, false]] },
        { node: 'present', prop: 'scale', ease: 'inOutQuad', keys: [[0, [1, 1, 1]], [0.45, [1, 1, 1]], [0.64, [1.12, 0.84, 1.12]], [0.82, [0.9, 1.2, 0.9]], [1.0, [1.06, 0.94, 1.06]]] },
        { node: 'present', prop: 'rz', ease: 'inOutQuad', keys: [[0, 0], [0.48, 0], [0.62, -7], [0.74, 7], [0.86, -4], [1.0, 0]] },
        { node: 'unwrapped', prop: 'visible', keys: [[0, false], [1.0, true]] },
        { node: 'unwrapped', prop: 'scaleAll', ease: 'outBack', keys: [[1.0, 0.55], [1.26, 1.08], [1.42, 1]] },
        { node: 'soldier', prop: 'scaleAll', ease: 'outBack', keys: [[0, 0.001], [1.0, 0.001], [1.3, 1.18], [1.55, 0.95], [1.72, 1]] },
        { node: 'soldier', prop: 'y', ease: 'outQuad', keys: [[0, 0.3], [1.0, 0.3], [1.34, 0.05], [1.5, 0]] },
        { node: 'soldier', prop: 'ry', ease: 'outQuad', keys: [[1.0, -40], [1.7, 0]] },
        { node: 'rifle', prop: 'scaleAll', ease: 'outBack', keys: [[0, 0.001], [1.45, 0.001], [1.72, 1.2], [1.9, 1]] },
        { node: 'trumpet', prop: 'scaleAll', ease: 'outBack', keys: [[0, 0.001], [1.6, 0.001], [1.88, 1.2], [2.05, 1]] },
        { node: 'present_side', prop: 'scaleAll', ease: 'outElastic', keys: [[0, 1], [1.0, 1], [1.05, 0.88], [1.5, 1]] },
        { node: 'present_back', prop: 'y', ease: 'outQuad', keys: [[0, 0], [1.0, 0], [1.1, 0.35], [1.45, 0]] }
      ]
    },
    notes: [
      'Der Pack hat genau fünf Modelle: ToySoldier.glb, Present_Base, Present_UnwrappedBase, ToySoldier_Rifle, ToySoldier_Trumpet. Über den Registry-Shard (916 Assets) gezählt, nicht geschätzt.',
      'Gemessen: die Box ist 3,48 hoch, der Soldat 2,99 — die Figur passt tatsächlich hinein. Die Enthüllung ist damit maßstabstreu und nicht nur ein Effekt. Das aufgerissene Papier ist 4,93 × 4,93 flach.',
      'ToySoldier.glb ist das einzige Asset der Welle 1 mit eingebetteter Textur (format: glb, embedded) — die Requisiten sind .gltf mit externem .bin + .png.',
      'Die Enthüllung nutzt Present_Base und Present_UnwrappedBase als zwei echte Zustände. Ein öffnender Deckel existiert im Pack nicht und wurde nicht erfunden — der Wechsel passiert im Pop-Frame, verdeckt durch den Ausschlag.',
      'Timing nach Zeichentrick-Regel: 0,45 s Antizipation (Box staucht und kippelt), Pop bei 1,0 s, Überschwingen 1,18 → 0,95 → 1,0, Requisiten versetzt bei 1,45 s und 1,60 s. Keine linearen Interpolationen.',
    ],
    open: [
      'Das contents-Render zeigt die Bind-Pose (Arme waagerecht) und den Tschako separat. Der Atlas animiert stattdessen Idle_B — bewusste Abweichung, weil „animiert" gefragt war.',
      'Im Promo liegen zwei verschiedene Wickelpapiere (grün/rot). Der Pack hat eine verschlossene Box; die zweite Farbvariante ist nicht belegt.',
      'Die Trompete steckt in handslot.l. Ob ein Spielzeugsoldat beide Requisiten gleichzeitig halten soll, ist eine Town-Entscheidung, keine Atlas-Entscheidung.',
      'Santa-Präsente (Present_A…E) liegen im Nachbarordner und wären Set-Erweiterung — anderes Texture-Sheet, deshalb hier nicht vermischt.'
    ]
  },
  {
    residentId: 'farmers',
    name: 'Farmers',
    display: 'Farmers · Feldarbeit',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 12 · 12 - June 2026 - Farmers',
    townRole: 'Versorgungs-Residents · Feldarbeit',
    habitatIntent: 'Feldstück mit vier Beeten: Farmer_A grüßt, Farmer_B sticht mit der Forke',
    activity: 'Farmer_A winkt mit gehobenem Hut, Farmer_B arbeitet im Beet, beladene Schubkarre daneben',
    relationships: ['Zwei Bewohner in einer Vignette — erster Mehr-Aktor-Fall im Atlas', 'Gemüse-Lieferanten für Town-Markt-Kandidaten'],
    reference: { src: 'uploads/promo (1).png', label: 'KayKit Monthly Mystery · Series 6 · Character 12 · Farmers', promoBackground: 0x9aa87c },
    keyArt: { dir: [0.30, 0.26, 1], pad: 1.06 },
    actor: {
      id: 'farmer_a', role: 'resident · Feldarbeiter', a: FA + 'Farmer_A.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-2.2, 0.6], r: 26,
      pose: /^Waving$/, poseFreeze: false,
      texture: FA + 'farmer_texture_A.png (im .glb eingebettet)'
    },
    habitat: [
      { id: 'plot_a', role: 'Beet links', a: FA + 'gltf/dirt_plot.gltf', p: [-3.4, 2.1] },
      { id: 'plot_b', role: 'Beet mitte', a: FA + 'gltf/dirt_plot.gltf', p: [-1.2, 2.8], r: 24 },
      { id: 'plot_c', role: 'Beet vor Farmer_B', a: FA + 'gltf/dirt_plot.gltf', p: [1.6, 1.0], r: -16 },
      { id: 'plot_d', role: 'Beet rechts', a: FA + 'gltf/dirt_plot.gltf', p: [3.0, 2.6], r: 38 }
    ],
    signatureProps: [
      { id: 'farmer_b', slot: 4, role: 'Sozial / zweiter Bewohner', a: FA + 'Farmer_B.glb',
        rig: 'Rig_Medium', p: [1.5, -0.4], r: -8, pose: /^Digging$/, poseFreeze: false },
      { id: 'pitchfork', slot: 1, role: 'Identität / Forke', a: FA + 'gltf/pitchfork.gltf',
        hand: { of: 'farmer_b', bone: 'handslot.r', push: 0.62, pushAxis: [0, -1, 0] } },
      { id: 'wheelbarrow', slot: 2, role: 'Aktivität / beladene Schubkarre', a: FA + 'gltf/wheelbarrow.gltf', p: [4.0, -0.5], r: -62 },
      { id: 'barrow_empty', slot: 3, role: 'Hof / leere Schubkarre', a: FA + 'gltf/wheelbarrow_empty.gltf', p: [-4.3, -0.5], r: 104 },
      { id: 'lettuce_a', slot: 6, role: 'Eigenheit / Salat im Beet', a: FA + 'gltf/lettuce.gltf', on: 'plot_a', p: [-3.4, 2.1] },
      { id: 'lettuce_b', slot: 6, role: 'Eigenheit / Salat im Beet', a: FA + 'gltf/lettuce.gltf', on: 'plot_b', p: [-1.2, 2.8] },
      { id: 'carrot_a', slot: 5, role: 'Lore / Karotte im Beet', a: FA + 'gltf/carrot.gltf', on: 'plot_d', p: [3.0, 2.6] },
      { id: 'carrot_b', role: 'promo-extra', a: FA + 'gltf/carrot.gltf', p: [0.3, 2.3], r: 40 },
      { id: 'carrot_c', role: 'promo-extra', a: FA + 'gltf/carrot.gltf', p: [-2.5, 3.2], r: -70 },
      { id: 'lettuce_c', role: 'promo-extra', a: FA + 'gltf/lettuce.gltf', p: [2.0, 3.4], r: 18 }
    ],
    notes: [
      'Der Farmers-Pack hat genau acht Modelle: Farmer_A.glb, Farmer_B.glb, carrot, dirt_plot, lettuce, pitchfork, wheelbarrow, wheelbarrow_empty. Über den Registry-Shard gezählt.',
      'Gemessen: Farmer_A 2,41 hoch, Farmer_B 2,33 — beide 23 Bones, Rig_Medium, Clips binden 69/69. Ein erster Zählversuch ergab 161 Joints; das war ein Zählfehler über sieben Skin-Meshes desselben Skeletts, nicht ein zweites Rig.',
      'wheelbarrow.gltf (1,17 hoch) ist die BELADENE Variante, wheelbarrow_empty.gltf (1,04) die leere — die 13 cm Differenz ist die Ladung. Kein separates Gemüse nötig, um die Karre zu füllen.',
      'Erster Mehr-Aktor-Fall: Farmer_B läuft als regulärer Requisiten-Eintrag mit eigener Pose und eigenem Mixer durch denselben Builder. Kein Sonderpfad im Code.',
      'Traktor auf Georgs Entscheidung gestrichen (S8). Die Szene trägt sich über vier Beete, zwei Schubkarren und die arbeitende Forke — alles KayKit, kein Fremdpack.',
      'Farmer_B nutzt Digging (Set Tools) statt einer Haltepose. Das erledigt zugleich die unbelegte Schubkarren-Griff-Frage: die Karre steht als Ladung daneben, statt falsch gegriffen zu werden.',
      'Zum gestrichenen Traktor bleibt der Befund festgehalten, weil er wiederkehrt: ein Höhenprofil über 860 Vertices zeigte eine Mulde bei z=-0,2 (y=1,057), die ich für einen Fahrersitz hielt. Die Seitenansicht widerlegte es — die Mulde war Dachkontur, die Kabine rundum verglast. Ein Vertex-Höhenprofil kann Vertiefung und Hohlraum nicht unterscheiden.'
    ],
    open: [
      'Series 6 enthält kein Fahrzeug (alle 916 Assets geprüft). Falls später ein Traktor dazukommt, muss es ein Modell mit echtem Innenraum sein — der Kenney-Traktor hat einen geschlossenen Kabinenkörper.',
      'Kein Fahr-Clip in der Bibliothek — über alle 119 Clips geprüft. Bleibt relevant, falls ein offenes Fahrzeug dazukommt.',
      'Der Promo zeigt vier Farmer in zwei Farbvarianten (A und B je zweimal, unterschiedliche Haut und Kleidung). Der Pack hat zwei Modelle mit zwei Texturen — die vier Figuren des Renders sind nicht vier Assets.'
    ]
  },
  {
    residentId: 'caveman',
    name: 'Caveman',
    display: 'Caveman · Lagerfeuer',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 8 - February 2025 - Caveman',
    townRole: 'Ältester Resident · Feuer und Jagd',
    habitatIntent: 'Lagerfeuer mit Holzstapel, Waffen abgelegt',
    activity: 'Steht am Feuer, Keule in der Hand, Speer und Axt daneben',
    relationships: ['Ältester Bewohner der Kalibrierungswelle', 'Feuerstelle als Town-Treffpunkt-Kandidat'],
    reference: { src: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/artwork.png', label: 'KayKit Caveman · Promo-Artwork', promoBackground: 0x7a6a58 },
    keyArt: { dir: [0.22, 0.30, 1], pad: 1.12 },
    actor: {
      id: 'caveman', role: 'resident', a: CV + 'characters/Caveman.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.6, 0.4], r: 104,
      pose: /^Melee_Unarmed_Idle$/, poseFreeze: false,
      texture: CV + 'gltf/caveman_texture.png'
    },
    habitat: [
      { id: 'campfire', role: 'landmark · Feuerstelle', a: CV + 'assets/gltf/Campfire_Base.gltf', p: [0.5, 0.2] }
    ],
    signatureProps: [
      { id: 'logs', slot: 3, role: 'Zuhause / Brennholz in der Feuerstelle', a: CV + 'assets/gltf/Campfire_Logs.gltf', p: [0.5, 0.2], r: 18 },
      { id: 'club', slot: 1, role: 'Identität / Keule', a: CV + 'assets/gltf/Caveman_Club.gltf',
        hand: { of: 'caveman', bone: 'handslot.r' } },
      { id: 'spear', slot: 2, role: 'Aktivität / Speer', a: CV + 'assets/gltf/Caveman_Spear.gltf', p: [-3.0, -0.6], r: 72 },
      { id: 'axe', slot: 5, role: 'Lore / Steinaxt', a: CV + 'assets/gltf/Caveman_Axe.gltf', p: [2.3, -0.8], r: -38 }
    ],
    notes: [
      'Der Pack hat genau sechs Modelle: Caveman.glb, Campfire_Base, Campfire_Logs, Caveman_Axe, Caveman_Club, Caveman_Spear. Über den Registry-Shard gezählt.',
      'Anderer Ordneraufbau als beim Toy Soldier: die Requisiten liegen unter assets/gltf/, der Charakter unter characters/. Pfade deshalb einzeln belegt, nicht aus einem Muster abgeleitet.',
      'Sit_Floor_Idle war eine Fehlwahl: der Name klingt nach aufrechtem Sitzen, der Clip ist tatsächlich ein Zurücklehnen mit angezogenen Beinen — beim visuellen Check lag die Figur flach statt am Feuer zu sitzen. Melee_Unarmed_Idle (stehend, Keule vor dem Körper) ersetzt es.',
      'Campfire_Base und Campfire_Logs sind zwei Hälften eines Objekts: der Steinring und das Brennholz darin. Zuerst hatte ich die Scheite als separaten Holzstapel daneben gelegt — dann stand ein leerer Ring in der Szene. Beide teilen jetzt dieselbe Position.',
      'Die Figur ist auf r=104° zum Feuer gedreht: Richtung von der Figur zur Feuerstelle ist (1,6 / -0,3), das ergibt atan2 ≈ 100°. Gerechnet, nicht gedreht bis es passte.',
    ],
    open: [
      'Feuer ist unbewegt: der Pack liefert nur die Geometrie der Feuerstelle, keine Flammen-Textur-Animation und kein Partikelsystem.',
      'Die abgelegten Positionen von Speer und Axt sind Bildabgleich zum Promo, keine gemessenen Werte.'
    ]
  },
  {
    residentId: 'lorekeeper',
    name: 'Lorekeeper',
    display: 'Lorekeeper · Stab & Foliant',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 1 - July 2025 - Lorekeeper',
    townRole: 'Archiv-Resident · Wissen und Aufzeichnung',
    habitatIntent: 'Lesepult mit aufgeschlagenem Foliant, Kerzen und Schriftrollen — der Pack liefert die Kulisse mit',
    activity: 'Steht am Lesepult, Krummstab in der rechten Hand',
    relationships: ['Gegenstück zum Librarian-Werkzeug der ToolBox (namentlich, nicht technisch)', 'Archiv-Kandidat für Town-Lore'],
    reference: { src: 'ref/atlas/Lorekeeper.gif', label: 'KayKit Lorekeeper · Set 1 · Promo', promoBackground: 0x4a4658 },
    keyArt: { dir: [0.20, 0.24, 1], pad: 1.14 },
    actor: {
      id: 'lorekeeper', role: 'resident', a: LK + 'Lorekeeper.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0.75, 0], r: -18,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: 'im .glb eingebettet (format: glb)'
    },
    habitat: [
      { id: 'tome', role: 'landmark · Lesepult mit Foliant', a: LK + 'gltf/Lorekeeper_Tome.gltf', p: [-0.95, 0.15], r: 24 }
    ],
    signatureProps: [
      { id: 'staff', slot: 1, role: 'Identität / Krummstab', a: LK + 'gltf/Lorekeeper_Staff.gltf', s: 0.65,
        hand: { of: 'lorekeeper', bone: 'handslot.r', axis: [0, 1, 0], aim: [0.18, 0.97, 0.12], grip: 0.28 } }
    ],
    notes: [
      'Der Pack hat genau drei Modelle: Lorekeeper.glb, Lorekeeper_Staff.gltf, Lorekeeper_Tome.gltf. Über den Registry-Shard gezählt — der schlankste Resident der Welle.',
      'Dritter Ordneraufbau im selben Pack: hier liegen Figur und gltf/ direkt im Charakterordner, ohne characters/ oder assets/. Drei Residents, drei Strukturen — deshalb wird jeder Pfad einzeln belegt.',
      'Korrektur am Namen: "Tome" ist KEIN Handrequisit, sondern ein Lesepult (1,58 × 1,65 × 1,14) mit aufgeschlagenem Buch, Kerzen und Schriftrollen. Der Pivot sitzt am Pultboden, nicht an einem Griff — in die Hand gesteckt wuchs es der Figur über den Kopf. Der Dateiname hat mich in die falsche Richtung geführt; Maße und Referenzbild haben es korrigiert.',
      'Der Krummstab (2,20 lang, Pivot mitten im Schaft) steht schräg nach außen gelehnt, nicht senkrecht: mit Ziel-Richtung [0,04, 1, 0,08] verlief der Schaft direkt am Kopf-Bone vorbei (Abstand 0,18 auf Kopfhöhe) und steckte im Gesicht. Eine erste Korrektur auf [0,72, 0,62, 0,32] behob das Kopf-Problem, kippte den Stab aber quer durch den Raum bis zum Lesepult — zu weit gegengesteuert. Jetzt: fast senkrecht [0,18, 0,97, 0,12], auf 65% skaliert und mit grip=0,28 justiert. Fußpunkt bei y=0,15 (Bodenhöhe), Haken-Spitze bei y=1,62 (knapp über Kopfhöhe 1,23) — abgeglichen gegen die Vorlage, nicht nur nach Auge.'
    ],
    open: [
      'Nur zwei der sechs Signatur-Slots sind belegbar: der Pack hat drei Modelle, davon eines die Figur. Aktivitäts-, Sozial- und Eigenheit-Slot bleiben leer, statt sie mit Fremdpack-Objekten zu füllen.',
      'Die Kerzen am Pult sind unbewegt — keine Flammen-Animation im Pack.',
      'Idle_A ist eine neutrale Standhaltung, keine Leseanimation. Eine Schicht-Pose wäre möglich (Holding_C bindet 34/67), ist aber nicht gesetzt: die Promo zeigt den Stab gestützt, nicht das Buch gehalten.'
    ]
  },
  {
    residentId: 'witch',
    name: 'Witch',
    display: 'Witch · Kessel & Werkbank',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 5 - November 2024 - Witch',
    townRole: 'Alchemie-Resident · Tränke und Sammeln',
    habitatIntent: 'Werkbank mit Mörser, Kessel und dekorierter Trankstation',
    activity: 'Steht mit dem Besen in der Rechten; das Pilzkörbchen steht abgesetzt am Boden neben ihr',
    relationships: ['Nachbarin des Lorekeeper-Archivs (beide Wissens-Residents)', 'Kessel als Town-Alchemie-Kandidat'],
    reference: { src: 'media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/artwork.png', label: 'KayKit Witch · Promo-Artwork', promoBackground: 0x5a6a8a },
    keyArt: { dir: [0.24, 0.26, 1], pad: 1.1 },
    actor: {
      id: 'witch', role: 'resident', a: WI + 'characters/Witch.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 14,
      pose: /^Holding_B$/, poseFreeze: false,
      texture: WI + 'textures/ (im .glb eingebettet)'
    },
    habitat: [
      { id: 'table', role: 'landmark · Werkbank', a: WI + 'assets/gltf/Table_Small.gltf', p: [-1.9, 0.4], r: 12 },
      { id: 'potionstation', role: 'landmark · dekorierte Trankstation', a: WI + 'assets/gltf/Potionstation_decorated.gltf', p: [2.6, -0.3], r: -18 }
    ],
    signatureProps: [
      { id: 'broom', slot: 1, role: 'Identität / Besen', a: WI + 'assets/gltf/Broom.gltf',
        hand: { of: 'witch', bone: 'handslot.r' } },
      /* Nicht in der Hand: in der linken Hand hing das Körbchen (0,73 hoch) direkt vor dem
         Gesicht — der handslot.l sitzt bei Holding_B auf Brust-/Kinnhöhe, und das Körbchen
         ragt von seinem Pivot nach OBEN. Abgesetzt am Boden statt neu gedreht. */
      { id: 'basket', slot: 2, role: 'Aktivität / Körbchen mit Pilzen (abgesetzt)', a: WI + 'assets/gltf/Basket_Mushrooms.gltf', p: [0.72, 0.95], r: -16 },
      { id: 'cauldron', slot: 6, role: 'Eigenheit / Kessel', a: WI + 'assets/gltf/Cauldron.gltf', p: [-0.6, 1.3], r: 24 },
      { id: 'mortar', slot: 5, role: 'Lore / Mörser', a: WI + 'assets/gltf/Mortar.gltf', on: 'table', p: [-2.1, 0.5] },
      { id: 'pestle', role: 'promo-extra', a: WI + 'assets/gltf/Pestle.gltf', on: 'table', p: [-1.65, 0.65], r: -40 },
      { id: 'mushroom_a', role: 'promo-extra', a: WI + 'assets/gltf/Mushroom.gltf', on: 'table', p: [-1.55, 0.25] },
      { id: 'mushroom_b', role: 'promo-extra', a: WI + 'assets/gltf/Mushroom.gltf', on: 'table', p: [-1.75, 0.1], r: 60 },
      { id: 'basket_empty', slot: 4, role: 'Sozial / leeres Körbchen', a: WI + 'assets/gltf/Basket.gltf', p: [1.75, 0.55], r: -30 }
    ],
    notes: [
      'Der Pack hat genau elf Modelle: Witch.glb, Basket, Basket_Mushrooms, Broom, Cauldron, Mortar, Mushroom, Pestle, Potionstation, Potionstation_decorated, Table_Small. Über den Registry-Shard gezählt.',
      'Basket_Mushrooms ist die BELADENE Variante von Basket (identische Maße 0,64 × 0,73 × 0,60) — dieselbe Beladen/Leer-Systematik wie bei den Farmers-Schubkarren.',
      'Die Promo zeigt zwei Varianten: fliegend auf dem Besen, und stehend mit Körbchen. Für „fliegend" gibt es keinen Clip in der geteilten Bibliothek (119 Clips geprüft) — der Atlas zeigt die stehende Variante, beide Requisiten gleichzeitig in der Hand statt nur eine.',
      'Pilzkörbchen aus der Hand genommen (Georg, Bildbefund): unter Holding_B liegt handslot.l auf Kinnhöhe, und der Korb-Pivot sitzt am Boden des Korbs — die Requisite baute sich also nach oben ins Gesicht. Kein Dreh- oder Push-Fix, sondern ein Rollenwechsel: der Korb steht abgesetzt rechts vor ihr (p [0,72 / 0,95]), das leere Körbchen ist auf [1,75 / 0,55] verschoben, damit die beiden nicht ineinander stehen. Damit ist der Besen das einzige Handrequisit der Witch.',
      'Potionstation_decorated statt der leeren Potionstation gewählt: sie bringt Flaschen und Fass bereits mit, ohne dass der Atlas einzelne Trankfläschchen erfinden musste, die im Pack nicht als lose Assets existieren.'
    ],
    open: [
      'Kessel-Inhalt ist unbewegt — keine Flammen- oder Blubber-Animation im Pack.',
      'Der abgesetzte Korb ist die Notlösung für ein Posen-Problem: die Promo zeigt den Korb getragen. Ein echter „Korb am ausgestreckten Arm" bräuchte einen Clip mit gesenktem linken Arm (Holding_A/C prüfen) oder eine Bone-Korrektur am Unterarm — beides nicht gesetzt, bis eine Pose belegt ist.',
      'Holding_B ist eine generische Halte-Pose, keine Misch- oder Rührbewegung. Ob die Hexe rühren, fliegen oder stehen soll, ist eine Town-Entscheidung.',
      'Mörser- und Pilz-Positionen auf der Werkbank sind Bildabgleich, keine gemessenen Werte.'
    ]
  },
  {
    residentId: 'black-knight',
    name: 'Black Knight',
    display: 'Black Knight · Schwert & Schild',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 3 - September 2024 - Black Knight',
    townRole: 'Wach-Resident · Rüstung und Verteidigung',
    habitatIntent: 'Noch offen — der Pack liefert nur Figur, Schwert und Schild in zwei Größen',
    activity: 'Steht kampfbereit, Schwert rechts, Schild links; die großen Varianten liegen zum Vergleich daneben',
    relationships: ['Größter Bewohner der Welle — Large-Tier wie Orc Brute und Demon Lord', 'Wach-Gegenstück zum Toy Soldier'],
    reference: { src: 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/promo.png', label: 'KayKit Black Knight · Promo (Rückansicht, zwei Farbvarianten)', promoBackground: 0x8a7550 },
    keyArt: { dir: [0.34, 0.24, 1], pad: 1.05, manualCamera: { pos: [-3.2, 2.4, 8.5], target: [0.2, 1.8, 0.3] } },
    actor: {
      id: 'knight', role: 'resident', a: BK + 'characters/BlackKnight.glb',
      /* Rig_LARGE, nicht Rig_Medium \u2014 trotz identischer 23 Bone-Namen ein eigenes Skelett-Ma\u00df.
         Georg best\u00e4tigt: Black Knight geh\u00f6rt zur selben Gr\u00f6\u00dfen-Kategorie wie Orc Brute und
         Demon Lord. Rig_Large_CombatMelee bindet 69/69 UND deformiert korrekt \u2014 der fr\u00fchere
         Rig_Medium-Kollaps war ein Rig-Familien-Fehlgriff, keine generelle Inkompatibilit\u00e4t. */
      rigFamily: 'Rig_Large', rig: 'Rig_Large', p: [0, 0], r: 0,
      pose: /^Melee_Blocking$/, poseFreeze: false,
      texture: BK + 'textures/ (im .glb eingebettet)'
    },
    habitat: [],
    signatureProps: [
      { id: 'sword', slot: 1, role: 'Identität / Schwert (Large — Rig-Maßstab)', a: BK + 'assets/gltf/BlackKnight_Sword_Large.gltf',
        hand: { of: 'knight', bone: 'handslot.r' } },
      { id: 'shield', slot: 2, role: 'Aktivität / Schild (Large — Rig-Maßstab)', a: BK + 'assets/gltf/BlackKnight_Shield_Large.gltf',
        hand: { of: 'knight', bone: 'handslot.l', push: 0.55 } },
      { id: 'sword_s', slot: 5, role: 'Lore / Schwert (Medium-Ausführung, Größenvergleich)', a: BK + 'assets/gltf/BlackKnight_Sword.gltf',
        optional: true, p: [3.4, -1.2], r: -20, scaleNote: '2,06 gegen 4,12 lang — die Datei für das Medium-Rig. Liegt seit S20 nur zum Vergleich daneben, sie ist nicht mehr die getragene Waffe.' },
      { id: 'shield_s', slot: 6, role: 'Eigenheit / Schild (Medium-Ausführung, Größenvergleich)', a: BK + 'assets/gltf/BlackKnight_Shield.gltf',
        optional: true, p: [3.2, -2.0], r: 8, scaleNote: '1,25 gegen 2,49 Durchmesser — Medium-Rig-Datei.' }
    ],
    notes: [
      'Der Pack hat genau fünf Modelle: BlackKnight.glb, BlackKnight_Shield, BlackKnight_Shield_Large, BlackKnight_Sword, BlackKnight_Sword_Large. Über den Registry-Shard gezählt — der zweite schlankste Resident nach dem Lorekeeper.',
      'Der Waffen/Schild-Swap ist als Größenvergleich gebaut, nicht als gleichzeitige Zweitbewaffnung: getragen wird seit S20 die Large-Ausführung (Rig-Maßstab), die Medium-Datei liegt daneben und ist zuschaltbar.',
      'S20-Korrektur am Maßstab (Georg, Vorlagenbefund): der Ritter trug die Medium-Ausführung. Die Promo zeigt ein Schwert, das ihm bis über den Kopf reicht — das Large-Schwert ist 4,12 lang und reicht vom Griff 3,46 nach oben, bei Handhöhe ≈1,4 also bis y≈4,9 an einer 4,69 hohen Figur. Das kleine Schwert endete bei y≈3,1 und sah aus wie ein Kurzschwert.',
      'Idle_A aus Rig_Medium bindet 69/69 Tracks nach Namen — und kollabiert die Figur trotzdem zu einem Klumpen. Ursache gefunden: Black Knight läuft auf Rig_LARGE, nicht Rig_Medium — 23 identische Bone-Namen, aber andere Skelett-Proportionen. Rig_Medium-Clips überschreiben die Bone-Positionen mit Werten für das kleinere Skelett; Namen binden, Werte passen nicht.',
      'Rig_Large_CombatMelee.glb hat 34 Clips, darunter Melee_Blocking — bindet 69/69 UND deformiert korrekt: Schild hoch in der Linken, Schwert bereit in der Rechten. Georg bestätigt: Black Knight, Orc Brute und Demon Lord teilen sich diese eigene, größere Größenklasse — keine Pack-Inkonsistenz, sondern die Modell-Kategorie.',
      'Key-Art-Kamera ist fest gesetzt statt automatisch an die Vignette angepasst: Box3 misst bei SkinnedMesh nur die Rest-Pose-Vertexausdehnung, nie die Bone-Transformation — bei diesem größeren Rig liegt sie weit über der wahren Größe und hätte die Kamera falsch zentriert. Draufsicht/Raster/Maße nutzen weiterhin die automatische Anpassung und können bei diesem Resident daneben liegen.'
    ],
    open: [
      'Größenklasse bestätigt (Georg): Black Knight ist ein Large-Tier-Modell wie Orc Brute und Demon Lord — deutlich größer als Goth Girl, Clown & Co. Bewusst nicht auf die Welle-1-Normalgröße herunterskaliert.',
      'Rig_Large hat nur 34 Clips gegenüber 119 bei Rig_Medium — deutlich weniger Auswahl für spätere Posen (kein Sitzen, kein Winken; nur General/MovementBasic/MovementAdvanced/CombatMelee/Simulation/Special).',
      'Das Promo zeigt beide Figuren von hinten mit Schwert geschultert und Schild auf dem Rücken. Ohne benannten Rücken-Bone ist „geschultert" nicht belegbar — Melee_Blocking zeigt stattdessen die kampfbereite Variante: Schild vorn hoch, Schwert griffbereit.'
    ]
  },
  {
    residentId: 'avian-swordsman',
    name: 'Avian Swordsman',
    display: 'Avian Swordsman · Trainingspuppe',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 9 - March 2026 - Avian Swordsman',
    townRole: 'Wach-Resident · Klingenkunst und Training',
    habitatIntent: 'Übungsplatz mit Trainingspuppe (Zielscheibe)',
    activity: 'Springt zum diagonalen Hieb gegen die Trainingspuppe',
    relationships: ['Zweiter Klingen-Resident neben Black Knight — Rig_Medium statt Rig_Large, deutlich kleiner', 'Übungsplatz als Town-Trainingskandidat'],
    reference: { src: 'uploads/promo (7).png', label: 'KayKit Avian Swordsman · Promo', promoBackground: 0x6a8a72 },
    keyArt: { dir: [0.28, 0.24, 1], pad: 1.12 },
    actor: {
      id: 'avian', role: 'resident', a: AV + 'AvianSwordsman.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.0, 0], r: 16,
      pose: /^Melee_1H_Attack_Jump_Chop$/, poseTime: 0.35, poseFreeze: true,
      texture: AV + 'textures/ (im .glb eingebettet)'
    },
    habitat: [
      { id: 'dummy', role: 'landmark · Trainingspuppe', a: AV + 'gltf/Trainingdummy_Base.gltf', p: [1.3, -0.2], r: -12 }
    ],
    signatureProps: [
      { id: 'sword', slot: 1, role: 'Identität / Schwert', a: AV + 'gltf/AvianSwordsman_Sword.gltf',
        hand: { of: 'avian', bone: 'handslot.r' } }
    ],
    notes: [
      'Der Pack hat genau drei Modelle: AvianSwordsman.glb, AvianSwordsman_Sword, Trainingdummy_Base. Über den Registry-Shard gezählt — schlanker Pack wie Lorekeeper und Black Knight.',
      'Anders als Black Knight läuft dieser Charakter korrekt auf Rig_Medium: 23 Bones, Rest-Höhe 2,32 — in derselben Größenordnung wie Goth Girl, Farmer & Co, kein Large-Tier.',
      'Melee_1H_Attack_Jump_Chop bindet 69/69 UND deformiert korrekt (anders als beim Black-Knight-Fehlgriff). Pose bei t=0,35s eingefroren — der Ausholmoment kurz vor dem Treffer, wie im Promo (Sprung, Klinge diagonal erhoben).',
      'Die Trainingspuppe (Zielscheibe mit Strohkörper) ist ein eigenständiges Landmark-Asset, kein austauschbares Requisit — sie gibt der Szene ihr Ziel.'
    ],
    open: [
      'Nur zwei Signatur-Slots belegbar (Identität, kein zweites Requisit) — der Pack hat außer der Trainingspuppe nichts weiter. Aktivitäts-, Sozial-, Lore- und Eigenheit-Slot bleiben leer.',
      'Pose ist eingefroren am Ausholpunkt, keine laufende Animation — der Sprung selbst (Landung, Anlauf) ist nicht Teil dieser Vignette.',
      'Sprung-Timing (t=0,35s) ist Bildabgleich zum Promo, kein gemessener Trefferzeitpunkt.'
    ]
  },
  {
    residentId: 'skeleton-warrior',
    name: 'Skeleton Warrior',
    display: 'Skeleton Warrior · Axt & Schild',
    status: 'candidate-only',
    pack: 'KayKit Skeletons · The Warrior',
    townRole: 'Untot-Resident · Wache/Kampf',
    habitatIntent: 'Noch offen — eigener Pack, keine Kulisse enthalten',
    activity: 'Steht kampfbereit, Axt rechts, Schild mit Schädel-Emblem links',
    relationships: ['Erster Bewohner aus einem eigenständigen Pack außerhalb Series 6', 'Drei weitere Skeletons (Rogue, Mage, Minion) als nächste Kandidaten'],
    reference: { src: 'uploads/pasted-1789599785176-0.png', label: 'KayKit Skeletons · The Warrior', promoBackground: 0x2a2622 },
    keyArt: { dir: [0.2, 0.22, 1], pad: 1.15 },
    actor: {
      id: 'warrior', role: 'resident', a: SK + 'characters/gltf/Skeleton_Warrior.glb', commit: 'main',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: SK + 'texture/ (eigener Pack, außerhalb Series 6)'
    },
    habitat: [],
    signatureProps: [
      { id: 'axe', slot: 1, role: 'Identität / Axt', a: SK + 'assets/gltf/Skeleton_Axe.gltf', commit: 'main',
        hand: { of: 'warrior', bone: 'handslot.r' } },
      { id: 'shield', slot: 2, role: 'Aktivität / Schild (klein)', a: SK + 'assets/gltf/Skeleton_Shield_Small_A.gltf', commit: 'main',
        hand: { of: 'warrior', bone: 'handslot.l', push: 0.18 } },
      { id: 'shield_l', slot: 5, role: 'Lore / Schild (groß, Vergleich)', a: SK + 'assets/gltf/Skeleton_Shield_Large_A.gltf', commit: 'main',
        optional: true, p: [2.0, -0.5], r: -18 }
    ],
    notes: [
      'Erster Resident aus einem eigenständigen Pack (KayKit_Skeletons), nicht aus Series 6 — eigene Root, eigener Ordneraufbau (characters/gltf/, assets/gltf/), auf `main` gepinnt statt auf den Handoff-Commit.',
      'Gemessen: 23 Bones, Rest-Höhe 2,59 — normale Rig_Medium-Größenklasse, kein Large-Tier-Fall wie Black Knight.',
      'Der Pack liefert zwei Schildgrößen (Small/Large) und zwei Varianten je Größe (A/B) — dieselbe Klein/Groß-Systematik wie beim Black Knight. Large-Variante liegt als Vergleich daneben, über „Optional" zuschaltbar.'
    ],
    open: [
      'Kulisse fehlt komplett — der Pack liefert nur Figur und Waffen, keine Umgebung.',
      'Nur drei der sechs Signatur-Slots belegt (Identität, Aktivität, Lore) — keine Möbel/Requisiten für Sozial-, Habitat- oder Eigenheit-Slot vorhanden.',
      'Rogue, Mage und Minion (3 weitere Charaktere desselben Packs) sind noch nicht gebaut — als nächste Kandidaten vorgemerkt.'
    ]
  },
  {
    residentId: 'skeleton-rogue',
    name: 'Skeleton Rogue',
    display: 'Skeleton Rogue · Armbrust & Köcher',
    status: 'candidate-only',
    pack: 'KayKit Skeletons · The Rogue',
    townRole: 'Untot-Resident · Fernkampf',
    habitatIntent: 'Noch offen — eigener Pack, keine Kulisse enthalten',
    activity: 'Hält die Armbrust schussbereit, Köcher am Rücken, Klinge als Zweitwaffe',
    relationships: ['Zweiter Skeleton der Welle nach dem Warrior', 'Fernkampf-Gegenstück zum Avian Swordsman'],
    reference: { src: 'uploads/pasted-1789607766705-0.png', label: 'KayKit Skeletons · The Rogue', promoBackground: 0x241c20 },
    keyArt: { dir: [0.24, 0.2, 1], pad: 1.2 },
    actor: {
      id: 'rogue', role: 'resident', a: SK + 'characters/gltf/Skeleton_Rogue.glb', commit: 'main',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: SK + 'texture/ (eigener Pack, außerhalb Series 6)'
    },
    habitat: [],
    signatureProps: [
      { id: 'crossbow', slot: 1, role: 'Identität / Armbrust', a: SK + 'assets/gltf/Skeleton_Crossbow.gltf', commit: 'main',
        hand: { of: 'rogue', bone: 'handslot.r' } },
      { id: 'quiver', slot: 2, role: 'Aktivität / Köcher am Rücken', a: SK + 'assets/gltf/Skeleton_Quiver.gltf', commit: 'main',
        hand: { of: 'rogue', bone: 'chest', push: -0.42, pushAxis: [0, 0, 1] } },
      { id: 'blade', slot: 5, role: 'Lore / Klinge (Zweitwaffe)', a: SK + 'assets/gltf/Skeleton_Blade.gltf', commit: 'main',
        optional: true, hand: { of: 'rogue', bone: 'handslot.l' } },
      { id: 'arrow_a', role: 'promo-extra', a: SK + 'assets/gltf/Skeleton_Arrow.gltf', commit: 'main', p: [1.3, 0.4], r: 24 },
      { id: 'arrow_b', role: 'promo-extra', a: SK + 'assets/gltf/Skeleton_Arrow_Broken.gltf', commit: 'main', p: [1.7, -0.3], r: -40 }
    ],
    notes: [
      'Armbrust-Pivot sitzt am Schaft, die Waffe reicht 1,14 nach +Z — identisch attachiert zeigt sie von sich aus nach vorn, kein Nachdrehen nötig (KayKit-Konvention, gemessen).',
      'Der Köcher hängt nicht an einem Handslot, sondern am chest-Bone mit Schub nach hinten — der Rig hat keinen eigenen Rücken-Bone. Erster Nicht-Hand-Anker im Atlas.',
      'Der Pack liefert vier Pfeil-Varianten (ganz, halb, gebrochen, gebrochen-halb) — zwei davon als Bodenfunde in der Szene.'
    ],
    open: [
      'KEIN Lade-/Spann-Clip vorhanden. Über alle 119 Clips der geteilten Bibliothek UND die vier pack-eigenen Animationsdateien geprüft: die pack-eigenen sind reine Duplikate der General/MovementBasic-Sets, ein Armbrust-Zyklus (spannen, laden, zielen, schießen) existiert nirgends. Drei Kandidaten durchprobiert und per Screenshot verworfen: Melee_2H_Idle hebt die Hände vor den Schädel (Armbrust kreuzt das Gesicht), Running_HoldingBow beugt den Oberkörper so weit vor, dass die Waffe Kopf und Rumpf verdeckt. Gesetzt ist Idle_A — Armbrust hängt frei an der Seite, klar lesbar. Eine echte Schuss-/Spannhaltung bleibt offen.',
      'Köcher-Position am Rücken ist Bildabgleich zur Promo, kein gemessener Ankerpunkt — ohne Rücken-Bone bleibt das eine Atlas-Entscheidung.',
      'Kulisse fehlt komplett; nur drei der sechs Signatur-Slots belegbar.'
    ]
  },
  {
    residentId: 'skeleton-mage',
    name: 'Skeleton Mage',
    display: 'Skeleton Mage · Schädelstab',
    status: 'candidate-only',
    pack: 'KayKit Skeletons · The Mage',
    townRole: 'Untot-Resident · Magie',
    habitatIntent: 'Noch offen — eigener Pack, keine Kulisse enthalten',
    activity: 'Stützt sich auf den Schädelstab',
    relationships: ['Dritter Skeleton der Welle', 'Magie-Gegenstück zur Witch und zum Lorekeeper'],
    reference: { src: 'uploads/pasted-1789599794787-0.png', label: 'KayKit Skeletons · The Mage', promoBackground: 0x2b1c28 },
    keyArt: { dir: [0.22, 0.2, 1], pad: 1.18 },
    actor: {
      id: 'mage', role: 'resident', a: SK + 'characters/gltf/Skeleton_Mage.glb', commit: 'main',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: SK + 'texture/ (eigener Pack, außerhalb Series 6)'
    },
    habitat: [],
    signatureProps: [
      { id: 'staff', slot: 1, role: 'Identität / Schädelstab', a: SK + 'assets/gltf/Skeleton_Staff.gltf', commit: 'main',
        hand: { of: 'mage', bone: 'handslot.r' } }
    ],
    notes: [
      'Gemessen: 23 Bones, Rest-Höhe 2,63 — normale Rig_Medium-Klasse wie Warrior und Rogue.',
      'Der Stab (2,10 lang, Pivot mitten im Schaft) sitzt identisch attachiert. Anders als beim Lorekeeper-Krummstab ist hier keine Richtungsvorgabe nötig — gegengeprüft, nicht angenommen.',
      'Schlankster Resident der Welle: der Pack liefert für den Mage genau ein Requisit.'
    ],
    open: [
      'Nur ein Signatur-Slot belegbar (Identität). Kein Zauber-Effekt, kein Buch, keine Kulisse im Pack.',
      'Kein Zauber-Clip in der Bibliothek — die Skeletons-Clips (Skeletons_Idle, _Taunt, _Awaken) sind Untoten-Bewegungen, keine Magie.'
    ]
  },
  {
    residentId: 'demon-lord',
    name: 'Demon Lord',
    display: 'Demon Lord · Beschwörungskreis',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · DemonLord',
    townRole: 'Boss-Resident · Beschwörung',
    habitatIntent: 'Beschwörungskreis am Boden, Dämonenherz als Artefakt',
    activity: 'Steht im Beschwörungskreis, das Dämonenherz schwebt frei vor ihm',
    relationships: ['Zweiter Large-Tier-Resident nach dem Black Knight — gleiche Größenklasse', 'Boss-Gegenstück zu den Skeletons'],
    reference: { src: 'media/3D_Assets/KayKit_Mystery_Series6/DemonLord/artwork.png', label: 'KayKit Demon Lord · Artwork', promoBackground: 0x2a1418 },
    keyArt: { dir: [0.24, 0.26, 1], pad: 1.12, manualCamera: { pos: [-4.5, 3.4, 11.5], target: [0.2, 1.9, 0.3] } },
    actor: {
      id: 'demon', role: 'resident', a: DL + 'characters/DemonLord.glb',
      /* Rig_LARGE wie Black Knight — Georg hatte die Größenklasse vorab benannt, die Messung
         bestätigt sie: 5,79 × 4,62 gegen 5,77 × 4,69 beim Ritter. */
      rigFamily: 'Rig_Large', rig: 'Rig_Large', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: DL + 'textures/ (im .glb eingebettet)'
    },
    habitat: [
      { id: 'circle', role: 'landmark · Beschwörungskreis', a: DL + 'assets/gltf/SummoningCircle.gltf', p: [0, 0] }
    ],
    signatureProps: [
      /* S31 · KEIN HANDREQUISIT. Der Pivot liegt in ALLEN DREI Achsen mittig (x -0,469…+0,411,
         y -0,646…+0,576, z -0,369…+0,362) — dieselbe Aussage wie beim Lorekeeper-Lesepult,
         nur andersherum: ein zentral gepivotetes Objekt mit Halbausdehnung 0,44–0,65 kann in
         einer Faust mit Radius 0,269 nicht „sitzen“, es umhüllt sie. Der `push: 0,55` aus S22
         hat das Symptom verschoben, nicht die Rolle korrigiert. Georg liest es richtig als
         schwebendes Artefakt: es steht jetzt frei über der Kreismitte. */
      { id: 'heart', slot: 1, role: 'Identität / Dämonenherz (schwebend über dem Kreis)', a: DL + 'assets/gltf/DemonHeart.gltf',
        p: [0, 1.75], float: 1.9, r: 18 }
    ],
    notes: [
      'Zweiter Large-Tier-Fall, diesmal von vorn richtig behandelt: Rig_Large von Anfang an gesetzt, statt erst an einem kollabierten Mesh zu merken, dass Rig_Medium nicht passt (Black Knight, S9/S10).',
      'Der Pack bringt eigene Rig_Large-Animationen mit (General, MovementBasic) — dieselbe Struktur wie beim Skeletons-Pack, das seine Rig_Medium-Sets mitliefert.',
      'Der Beschwörungskreis ist 7,81 × 7,81 flach am Boden — das breiteste Einzel-Asset der ganzen Welle, breiter als die Figur hoch ist.',
      'Key-Art-Kamera ist fest gesetzt, wie beim Black Knight: Box3 ist bei diesem Rig unzuverlässig (siehe Strukturregel oben), die automatische Anpassung zentriert daneben.',
      'S31 · WIDERRUF DER S22-BEGRÜNDUNG. Das Herz lief bis S31 auf push=0,55 mit der Begründung „dieselbe Regel wie bei den Schilden, Handvolumen statt falscher Anker“. Falsch — es war der falsche ANKER. Der Pivot liegt in allen drei Achsen mittig (x -0,469…+0,411, y -0,646…+0,576, z -0,369…+0,362), Halbausdehnung 0,44–0,65 gegen Faustradius 0,269: das Objekt kann in dieser Faust nicht sitzen, es umhüllt sie. Der push hat das Symptom verschoben, nicht die Rolle erkannt. Zentraler Pivot bedeutet schwebendes Artefakt — dritter Fall der Pivot-Regel neben Boden (Standobjekt) und Griff (Handrequisit).'
    ],
    open: [
      'Kein Beschwörungs-Clip — Rig_Large hat 34 Clips, keiner davon ein Ritual. Idle_A ist gesetzt.',
      'Der Kreis liegt unbewegt am Boden: keine Glut-, Rauch- oder Rotationsanimation im Pack.',
      'Nur ein Signatur-Slot belegbar plus Kreis als Habitat — und der Slot ist seit S31 keine Hand-Befestigung mehr, sondern eine freie Schwebeposition (float 1,9). Höhe und Abstand sind gesetzt und gegen das Artwork geprüft, nicht gemessen: es gibt keine Größe im Pack, die sagt, wo ein schwebendes Herz hängen soll.'
    ]
  },
  {
    residentId: 'orc-brute',
    name: 'Orc Brute',
    display: 'Orc Brute · Kriegstrommel & Keule',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 2 - August 2025 - Orc Brute (+ Requisiten aus 1 - July 2023 - Orc Raider)',
    townRole: 'Kriegs-Resident · Lärm und Einschüchterung',
    habitatIntent: 'Trommellager: Kriegstrommel, gepflanztes Banner, abgestellter Tragerucksack',
    activity: 'Steht mit hängenden Armen, Keule rechts, Trommelschlägel links; die Trommel steht vor ihm',
    relationships: ['Dritter Large-Tier-Resident — gleiche Größenklasse wie Black Knight und Demon Lord', 'Erbt die Requisiten des älteren Orc Raider — dieselbe Fraktion, zwei Packs'],
    reference: { src: 'ref/atlas/August2025_OrcBrute.gif', label: 'KayKit Monthly Mystery · Series 6 · Character 2 · Orc Brute (Patreon-Recap)', promoBackground: 0xd8b27a },
    keyArt: { dir: [0.3, 0.26, 1], pad: 1.08, manualCamera: { pos: [-4.8, 3.2, 12.0], target: [0.1, 1.9, 0.3] } },
    actor: {
      id: 'brute', role: 'resident', a: OB + 'OrcBrute.glb',
      /* Rig_Large ist hier belegt, nicht vermutet: der Handoff nennt den Skin "Rig_Large"
         (Signatur d3658fc0…), und Idle_A aus Rig_Large deformiert ihn korrekt. */
      rigFamily: 'Rig_Large', rig: 'Rig_Large', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      texture: OB + 'orcbrute_texture_A.png (im .glb eingebettet; texture_B als Variante daneben)'
    },
    habitat: [],
    signatureProps: [
      { id: 'club', slot: 1, role: 'Identität / Orc-Keule (2× auf Large-Maßstab)', a: OR + 'Orc_Club.gltf.glb', s: 2,
        hand: { of: 'brute', bone: 'handslot.r' } },
      { id: 'wardrum', slot: 2, role: 'Aktivität / Kriegstrommel (2× auf Large-Maßstab)', a: OR + 'Orc_Wardrum.gltf.glb', s: 2, p: [2.75, 1.45], r: -16 },
      { id: 'drumstick', slot: 4, role: 'Sozial / Trommelschlägel (2× auf Large-Maßstab)', a: OR + 'Orc_WardrumStick.gltf.glb', s: 2,
        hand: { of: 'brute', bone: 'handslot.l' } },
      { id: 'banner', slot: 5, role: 'Lore / Orc-Banner (Large — Rig-Maßstab)', a: OB + 'gltf/Orc_Banner_Large.gltf', p: [-3.5, -0.6], r: 14 },
      { id: 'horn', slot: 6, role: 'Eigenheit / Trinkhorn (2× auf Large-Maßstab)', a: OR + 'Orc_DrinkingHorn.gltf.glb', s: 2, on: 'wardrum', p: [2.45, 1.75], r: 40 },
      { id: 'backpack', role: 'promo-extra · abgestellter Tragerucksack (2×)', a: OR + 'Orc_Backpack.gltf.glb', s: 2, p: [-2.5, 2.9], r: -34 },
      { id: 'axe', role: 'promo-extra · Pack-eigene Axt (Large — Rig-Maßstab)', a: OB + 'gltf/Orc_Axe_Large.gltf', p: [4.4, -1.0], r: 22 },
      { id: 'axe_s', role: 'Vergleich / Axt (Medium-Ausführung)', a: OB + 'gltf/Orc_Axe.gltf',
        optional: true, p: [5.1, -1.8], r: 18, scaleNote: '0,84 gegen 1,67 hoch — die Datei für das Medium-Rig, nur als Größenvergleich.' },
      { id: 'banner_s', role: 'Vergleich / Banner (Medium-Ausführung)', a: OB + 'gltf/Orc_Banner.gltf',
        optional: true, p: [-5.2, -1.4], r: 10, scaleNote: '2,51 gegen 5,03 hoch — Medium-Rig-Datei.' }
    ],
    notes: [
      'Der Brute-Pack selbst hat nur vier Modelle plus Figur: Orc_Axe, Orc_Axe_Large, Orc_Banner, Orc_Banner_Large. Trommel, Schlägel, Keule, Trinkhorn und Rucksack kommen aus dem Orc-Raider-Pack (Juli 2023) — dieselbe Fraktion, ausgewiesenes Fremdpack, keine Erfindung.',
      'Gemessene Maße (Sonde gegen die Raw-URLs am gepinnten Commit): Keule 1,62 hoch, Trommel 1,47 × 0,93 × 1,47, Schlägel 0,86, Banner 2,51 hoch, Trinkhorn 0,68, Rucksack 1,09 breit.',
      'Idle_A statt einer Kampfpose: Rig_Large hat 34 Clips und keinen Trommel-Clip. Idle_A hängt beide Arme seitlich herunter (handslot.r [-1,18 / 1,26 / 0,20], handslot.l [1,17 / 1,27 / 0,22]) — genau die Haltung, in der Keule und Schlägel ohne Drehkorrektur sitzen. Melee_2H_Idle führt beide Hände vor die Brust und hätte die beiden Requisiten gekreuzt.',
      'S20-Maßstabskorrektur: Keule, Schlägel, Trommel, Horn und Rucksack stammen aus dem Medium-Pack des Raiders und haben keine Large-Variante — sie laufen jetzt auf s=2, demselben Faktor, den Kay Lousberg für seine eigenen *_Large-Dateien benutzt (nachgemessen an sechs Paaren, exakt 2×). Keule 1,62→3,23, Schlägel 0,86→1,71, Trommel 1,47→2,95 breit. Banner und Axt brauchen keine Skalierung, das Pack liefert sie als *_Large.',
      'Beide Handrequisiten laufen auf reiner Identität — kein aim, kein push, kein roll; nur die Größe ist angepasst. Die Strukturregel oben gilt auch für dieses größere Rig.',
      'Key-Art-Kamera ist fest gesetzt wie bei Black Knight und Demon Lord: Box3 misst dieses Rig in der Rest-Pose 5,79 breit (T-Pose-Armspanne) bei echter Kopfhöhe 3,12 — die automatische Anpassung würde daneben zentrieren.'
    ],
    open: [
      'S20 gelöst (war offen): die Orc-Raider-Requisiten sind für das kleinere Rig gezeichnet und wirkten an der Large-Faust kurz. Jetzt auf s=2 — nicht nach Augenmaß, sondern mit dem Faktor, den das Pack selbst für seine Large-Varianten verwendet. Bleibt die einzige Atlas-Skalierung im Satz und ist als solche ausgewiesen.',
      'Trommel-, Rucksack- und Axt-Positionen sind gegen den Patreon-Recap-GIF gesetzt, nicht gegen ein Pack-Promo — der Pack selbst enthält im Repo nur Modelle und Texturblätter. Der Recap zeigt Axt und Banner in Large-Ausführung; Keule und Trommel sind Georgs Vorgabe, nicht die Promo-Ausstattung.',
      'Kein Trommel-Schlag-Clip in Rig_Large — der Schlägel hängt, er spielt nicht.',
      'Zweite Textur (orcbrute_texture_B.png) liegt im Pack, ist aber nicht als Farbvariante angelegt — der Atlas zeigt nur die eingebettete A-Variante.'
    ]
  },
  {
    residentId: 'monstrosity',
    name: 'Monstrosity',
    display: 'Monstrosity · Scheunentor & Mistgabel',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 4 - October 2025 - Monstrosity',
    townRole: 'Boss-Resident · Zusammengeflicktes Ungeheuer',
    habitatIntent: 'Noch offen — der Pack liefert nur Figur, Schild und Mistgabel in zwei Größen',
    activity: 'Steht in Blockhaltung: Scheunentor-Schild vorn hoch, Mistgabel in der Rechten',
    relationships: ['Vierter Large-Tier-Resident — Größenklasse Black Knight / Demon Lord / Orc Brute', 'Bauernwerkzeug als Waffe — Gegenstück zur Farmers-Vignette'],
    reference: { src: 'ref/atlas/October2025_Monstrosity.gif', label: 'KayKit Monthly Mystery · Series 6 · Character 4 · Monstrosity (Patreon-Recap)', promoBackground: 0x3c4a55 },
    keyArt: { dir: [0.32, 0.26, 1], pad: 1.06, manualCamera: { pos: [-3.6, 2.8, 9.5], target: [0.1, 1.9, 0.35] } },
    actor: {
      id: 'monster', role: 'resident', a: MO + 'Monstrosity.glb',
      rigFamily: 'Rig_Large', rig: 'Rig_Large', p: [0, 0], r: 0,
      pose: /^Melee_Blocking$/, poseFreeze: false,
      texture: MO + 'monstrosity_texture_A.png (im .glb eingebettet; texture_B als Variante daneben)'
    },
    habitat: [],
    signatureProps: [
      { id: 'shield', slot: 1, role: 'Identität / Scheunentor-Schild (Large — Rig-Maßstab)', a: MO + 'gltf/Monstrosity_BarndoorShield_Large.gltf',
        hand: { of: 'monster', bone: 'handslot.l', push: 0.5 } },
      { id: 'pitchfork', slot: 2, role: 'Aktivität / Mistgabel (Large — Rig-Maßstab)', a: MO + 'gltf/Monstrosity_Pitchfork_Large.gltf',
        hand: { of: 'monster', bone: 'handslot.r' } },
      { id: 'shield_s', slot: 5, role: 'Lore / Schild (Medium-Ausführung, Größenvergleich)', a: MO + 'gltf/Monstrosity_BarndoorShield.gltf',
        optional: true, p: [3.2, -1.2], r: -18, scaleNote: '1,54 gegen 3,08 hoch — die Datei für das Medium-Rig. Sie hing bis S20 in der Faust und sah dort aus wie ein Brotbrett.' },
      { id: 'pitchfork_s', slot: 6, role: 'Eigenheit / Mistgabel (Medium-Ausführung, Größenvergleich)', a: MO + 'gltf/Monstrosity_Pitchfork.gltf',
        optional: true, p: [3.8, -1.8], r: 12, scaleNote: '1,65 gegen 3,29 hoch — Medium-Rig-Datei.' }
    ],
    notes: [
      'Der Pack hat genau fünf Modelle: Monstrosity.glb, BarndoorShield, BarndoorShield_Large, Pitchfork, Pitchfork_Large — derselbe Zuschnitt wie beim Black Knight (Figur + Waffe + Schild, je in zwei Größen).',
      'Gemessen: Schild 0,82 × 1,54 × 0,25 (Medium) gegen 1,63 × 3,08 × 0,49 (Large), Gabel 0,38 × 1,65 × 0,19 gegen 0,76 × 3,29 × 0,39. Der Schild-Pivot liegt hinten (z von -0,15 bis +0,10 bzw. -0,30 bis +0,19) — genau der Fall aus der Schild-Regel oben, deshalb push statt Drehung.',
      'S20-Maßstabskorrektur (Recap-GIF): getragen wird die Large-Ausführung. Geprüft, nicht geschätzt — handslot.l liegt in Melee_Blocking bei y=1,94, das Large-Schild reicht 1,55 unter seinen Pivot und endet damit bei y≈0,39, also knapp über dem Boden und bis zum Knie hoch, wie im Recap. Die Large-Gabel hängt an handslot.r (y=1,37) 1,03 nach unten, Spitze bei y≈0,34 — kein Bodendurchstich.',
      'push=0,5 am Schild, eine Stufe unter den 0,55 des Black Knight: gleiches Rig, aber die Monstrosity-Faust ist flacher modelliert. Die Mistgabel braucht keinen push — handslot.r liegt in Melee_Blocking auf y=1,37, die Gabel reicht 0,51 unter ihren Pivot und bleibt damit 0,85 über dem Boden.',
      'Melee_Blocking gewählt, wie beim Black Knight: es ist der einzige Rig_Large-Clip, der den linken Arm mit dem Schild nach vorn hochführt (handslot.l [0,36 / 1,94 / 1,41]) und die Rechte gesenkt frei lässt.',
      'Key-Art-Kamera fest gesetzt — Box3 misst 5,83 Breite in der Rest-Pose gegen 3,12 echte Kopfhöhe.'
    ],
    open: [
      'Keine Kulisse im Pack. Habitat bleibt leer statt mit Fremdpack-Möbeln gefüllt zu werden — wie beim Black Knight. Der Recap-GIF zeigt eine Kopfsteinpflaster-Insel im Nadelwald; beides ist nicht Teil des Packs.',
      'Medium-Ausführungen liegen als Größenvergleich daneben und sind zuschaltbar; sie sind nicht als Zweitbewaffnung gedacht und seit S20 nicht mehr die getragene Ausrüstung.',
      'Zweite Textur (monstrosity_texture_B.png) liegt im Pack, ist aber nicht als Farbvariante angelegt.',
      'Ob das Ungeheuer ein Town-Bewohner oder ein Gegner ist, ist eine Erzählentscheidung — der Atlas führt es als Resident-Kandidaten wie alle anderen.'
    ]
  },
  {
    residentId: 'orc-warband',
    name: 'Orc Warband',
    display: 'Orc Warband · Legacy-Rig (6 Bones)',
    status: 'candidate-only',
    pack: 'KayKit Legacy · Orc Warband + Character Animations 1.2 (legacy)',
    townRole: 'Kriegs-Residents · zweite Orc-Generation, ältere Bauart',
    habitatIntent: 'Bannerplatz: gepflanztes Kriegsbanner mit Schädeln am Fuß',
    activity: 'Zwei Orcs am Banner: der kleinere mit Schwert, der größere mit Schild und Hammeraxt',
    relationships: ['Dritte Rig-Klasse des Atlas — Rig_Legacy, sechs Bones statt 23', 'Vorgänger-Generation von Orc Raider und Orc Brute: gleiche Fraktion, drei Bauarten'],
    reference: { src: 'uploads/pasted-1789653285466-0.png', label: 'KayKit Orc Warband · Promo (Legacy)', promoBackground: 0xe8e8e8 },
    keyArt: { dir: [0.26, 0.24, 1], pad: 1.14 },
    actor: {
      id: 'orcA', role: 'resident', a: WB + 'characters/gltf/character_orcA.gltf',
      commit: LEGACY_PIN, legacy: { rig: LEGACY_RIG_A },
      rigFamily: 'Rig_Legacy', rig: 'Rig_Legacy', p: [-1.1, 0.2], r: 14,
      pose: /^Idle$/, poseFreeze: true, poseTime: 0.3,
      texture: 'keine — Legacy arbeitet mit benannten Materialien (GreenLight, Red, Metal, …), nicht mit Texturblättern'
    },
    habitat: [
      { id: 'banner', role: 'landmark · Kriegsbanner', a: WB + 'props/gltf/orc_banner.gltf.glb', commit: LEGACY_PIN, p: [0.2, -0.5], r: -8 }
    ],
    signatureProps: [
      { id: 'orcB', slot: 4, role: 'Sozial / zweiter Orc (Helmträger)', a: WB + 'characters/gltf/character_orcB.gltf',
        commit: LEGACY_PIN, legacy: { rig: LEGACY_RIG_A },
        rigFamily: 'Rig_Legacy', rig: 'Rig_Legacy', p: [1.95, 0.35], r: -18,
        pose: /^Idle$/, poseFreeze: true, poseTime: 0.9 },
      { id: 'sword', slot: 1, role: 'Identität / Orc-Schwert', a: WB + 'props/gltf/orc_sword.gltf.glb',
        commit: LEGACY_PIN, hand: { of: 'orcA', bone: 'armRight', paw: 'ArmRight', axis: [0, 1, 0], aim: [-0.5, 0.85, 0.14], aimIn: 'BasePose', grip: 0.14 } },
      { id: 'shield', slot: 2, role: 'Aktivität / Orc-Schild', a: WB + 'props/gltf/orc_shield.gltf.glb',
        commit: LEGACY_PIN, hand: { of: 'orcB', bone: 'armLeft', paw: 'ArmLeft', axis: [0, 1, 0], aim: [0.56, 0.8, 0.18], aimIn: 'BasePose',
                                    roll: -90, grip: 0.14 } },
      { id: 'hammeraxe', slot: 5, role: 'Lore / Hammeraxt', a: WB + 'props/gltf/orc_hammerAxe.gltf.glb',
        commit: LEGACY_PIN, hand: { of: 'orcB', bone: 'armRight', paw: 'ArmRight', axis: [0, 1, 0], aim: [-0.76, 0.6, -0.22], aimIn: 'BasePose', roll: -90, grip: 0.14 } }
    ],
    notes: [
      'Dritte Rig-Klasse des Atlas, und die erste, die anders FUNKTIONIERT statt nur anders groß zu sein. Gemessen an KayKit_AnimatedCharacter_v1.2.glb: SECHS Bones (Body, Head, armLeft, handSlotLeft, armRight, handSlotRight) gegen 23 bei Rig_Medium/Rig_Large, und 30 Clips in EINER Datei statt in sieben Set-Dateien.',
      'Die Legacy-Figuren sind gar nicht geriggt: character_orcA.gltf hat 0 Bones und 0 Skins, dafür vier getrennte Teilgruppen (Body, Head, ArmLeft, ArmRight) in Bind-Pose-Weltlage. Eine Legacy-Figur wird deshalb ZUSAMMENGESETZT, nicht bespielt — Rig laden, Platzhalter PrototypePete ausblenden, die vier Teile an die passenden Bones hängen.',
      'Der Ausgleich ist gemessen, nicht getippt: skeleton.boneInverses[i] IST die Inverse der Bind-Weltmatrix des Bones. Ein Teil in Bind-Weltlage bekommt genau diese Matrix als lokale Transform und sitzt exakt. Kein einziger Offset-Wert in diesem Recipe.',
      'Erste Bindungsmessung war 0/16 Tracks — korrekt, nicht kaputt: die Clips adressieren Bone-Namen, die in der nackten Figur nicht existieren. Genau dieser Nullwert hat die Zusammensetz-Architektur belegt, statt sie zu vermuten.',
      'Handslot-Namen sind camelCase (handSlotRight), nicht handslot.r. findBone() normalisiert beide Schreibweisen auf dieselbe Form — kein Sonderfall nötig, dieselbe Regel wie beim Punkt, den der GLTFLoader entfernt.',
      'Eigener Commit-Pin (10a7fdce), weil der Legacy-Ordner am S5-Pin noch nicht existiert (404 geprüft, nicht angenommen). Erster Resident mit Pfaden aus zwei verschiedenen Commits.',
      'Kleinste Figurenklasse der Welle: Rig 1,90 hoch, gebaut und posiert orcA 1,81 / orcB 2,10 (unposiert im Pack 1,76 / 2,05) — gegen 3,12 Kopfhöhe bei Orc Brute. Drei Orc-Generationen im Atlas (Legacy, Raider 2023, Brute 2025), drei Bauarten, drei Maßstäbe.',
      'Legacy arbeitet ohne Texturblätter: die Farben kommen aus benannten Materialien (GreenLight, Red, WoodDark, Metal, Black). Deshalb fehlt hier die texture-Zeile, die jeder Series-6-Resident trägt.',
      'EINZIGE Rig-Klasse, in der die S18-Identitätsregel NICHT gilt — und der Grund ist gemessen, nicht geraten: an den Legacy-handSlot-Bones zeigt die lokale Z-Achse nach OBEN (Zw [0, 1, 0]) und Y nach VORN. Die Warband-Requisiten sind aber alle mit ihrer Langachse auf +Y gezeichnet (Schwert y von -0,31 bis 1,34). Gegenprobe an GEFRORENER Idle-Pose, Requisite mit reiner Identität: Schild 0,27 hoch statt 0,95 und eigene Y-Achse waagerecht nach vorn ([0, 0,02, 1]), Schwert 0,69 hoch statt 1,8 und nach vorn gekippt. Beides liegt also flach. Korrektur über `axis: [0,1,0]` + `aim` + `roll`, also gerechnet und posenfest, nicht als getippter Euler-Winkel.',
      'Die Freiprüfung gegen den Kopf läuft NICHT über Boxen. Box-gegen-Box meldete alle drei Waffen als „im Kopf", während das Schwert mit 0 von 711 Vertices im Kopfbereich komplett frei lag: ein diagonales, langes Objekt füllt seine achsenparallele Box kaum aus, und der Kopf ist eine gerundete Blase in einer eckigen Box — zwei leere Boxecken überlappen, die Objekte nicht. Geprüft wird deshalb der kleinste Abstand zwischen den echten Vertex-Wolken: Schwert 0,304, Schild 0,245, Axt 0,208 zum Kopf, Unterkanten 0,053 / 0,027 / 0,096 über Grund. Dritte Variante der Box3-Lehre dieses Projekts.',
      'Die erste Messung dieses Befunds war unbrauchbar, und das gehört hierher: sie lief gegen eine LAUFENDE Animation (poseFreeze war false). Requisitenlage mitten im Clip ist kein Beweis für die Attachment-Mechanik — sie ist ein Standbild aus einer Bewegung. Beide Orcs sind jetzt eingefroren (Idle, poseTime 0,3 bzw. 0,9), und erst die Messung danach zählt.',
      'Ursache ist eine Pack-Grenze, keine Schlamperei: Rig und Requisiten kommen aus ZWEI verschiedenen Legacy-Packs. Kay hat die Warband-Waffen für die statischen Warband-Arme gezeichnet, nicht für die handSlots des Animations-Packs. Series 6 liefert Figur und Requisiten im selben Pack — daher gilt dort Identität.',
      'Schild und Axt brauchen zusätzlich grip (0,24 bzw. 0,20) die eigene Achse hinauf: die Legacy-Handslots liegen auf y=0,21 (Stummelarme an einer 1,81 hohen Chibi-Figur), und beide Requisiten reichen deutlich unter ihren Pivot — ohne Hub standen sie unter dem Boden (Schild-Unterkante -0,026 gemessen). Mit Hub: Unterkanten 0,027 (Schild) und 0,096 (Axt) über Grund.'
    ],
    open: [
      'Die Promo zeigt rechts einen Orc mit BÄRENKOPF-Helm. Den gibt es im Pack nicht: die Tree-API listet genau zwei Figuren (character_orcA mit Narbe, character_orcB mit Haarknoten) und vier Requisiten. Der Helm ist Promo-Kunst ohne Modell — bewusst nicht nachgebaut.',
      'Zuordnung Schwert/Schild folgt der Promo und der Figurenhöhe (orcA 1,81 mit Narbe, orcB 2,10 mit Haarknoten — an der Figur ohne ihre Requisiten gemessen) — Bildabgleich, nicht aus den Dateien belegt. Wenn es umgekehrt ist, sind es zwei getauschte Zeilen.',
      'S28 · DIE REQUISITEN HÄNGEN AM ARM-BONE, NICHT AM handSlot — und das ist der Unterschied zwischen „hält" und „hängt daneben". Beim skinned Original folgt die gezeichnete Pfote dem handSlot per Gewichten; eine zusammengesetzte Legacy-Figur hat aber einen RIGIDEN Armklotz an genau einem Bone (armLeft/armRight). Animiert ein Clip den handSlot relativ dazu — und das tun die Legacy-Clips —, wandert der Bone und der Klotz nicht. Gemessen: Schild 0,513 und Hammeraxt 0,548 neben der Pfote, das Schwert zufällig 0,002. Jetzt am Arm-Bone befestigt, Griffpunkt im Klotz gemessen (Mittel der äußersten Vertices): Abstand zur Pfote 0,005 / 0,017 / 0,007 — und zwar in JEDEM Clip gleich, weil Requisite und Pfote rigide dasselbe Stück sind.',
      'Die Requisiten zeigen nach AUSSEN, nicht nach oben — und das ist keine Stilentscheidung, sondern Geometrie. Gemessen: die handSlots liegen auf y=0,21 und nur 0,35 von der Körpermitte, der Kopf ist 1,44 breit und beginnt bei y=0,62. Eine Requisite, die aus dieser Hand senkrecht nach oben zeigt, MUSS durch den Kopf gehen — sie muss 0,35 seitlich gewinnen, bevor sie 0,41 gestiegen ist, also mindestens 40° aus der Senkrechten. Seit S28 sitzen sie in der Pfote, also flacher gestellt als der reine Kopf-Freiraum verlangen würde (Schwert [-0,5 / 0,85 / 0,14], Schild [0,56 / 0,8 / 0,18], Axt [-0,76 / 0,6 / -0,22]) — damit liegen die Waffen wie in der Promo neben der Silhouette statt davor.',
      'orcB steht auf x=1,95 statt 1,5: mit der nach außen gekippten Axt in der INNEREN Hand reichte die Klinge vorher bis an den Bannerfuß. Jetzt 0,79 Abstand — gemessen, nicht geschätzt.',
      'Die 30 Legacy-Clips sind eine eigene Bibliothek, keine Teilmenge der 119 Rig_Medium-Clips. Ob Town-Posen über beide Klassen hinweg vergleichbar bleiben sollen, ist offen.',
      'Legacy-Figuren lassen sich prinzipiell mischen (Kopf des einen auf den Körper des anderen) — der Atlas nutzt das nicht, es ist aber die Bauart-Absicht des Packs.',
      'Die FBX-Einzelanimationen (30 Dateien) sind nicht ausgewertet; der Atlas liest ausschließlich die gltf-Sammeldatei.'
    ]
  },
  {
    residentId: 'prototype-pete',
    name: 'Prototype Pete',
    display: 'Prototype Pete · Käseblock & Bleistift',
    status: 'candidate-only',
    pack: 'KayKit Legacy · Character Animations 1.2 (legacy) + Käse aus media/3D_Assets/KFB',
    townRole: 'Werkstatt-Resident · die Testfigur, die selbst einzieht',
    habitatIntent: 'Vorratslager: ein Käseblock in Figurengröße, Federmappe abgestellt',
    activity: 'Steht mit dem Bleistift in der Rechten neben seinem Käseblock',
    relationships: ['Dieselbe Rig-Klasse wie die Orc Warband — Rig_Legacy, aber ohne Zusammensetzen: Pete IST das Rig', 'Die Figur, mit der KayKit seine Legacy-Animationen ausliefert — Werkzeug als Bewohner'],
    /* Kein Promo im Repo: das Legacy-Animations-Pack liefert Modelle, drei Implementierungs-
       PDFs und Logos. Statt ein fremdes Bild als Referenz auszugeben, ein leeres Pixel \u2014
       die Referenzblende bleibt f\u00fcr diesen Resident wirkungslos, und das Label sagt warum. */
    reference: { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                 label: 'Kein Promo im Repo \u2014 Legacy-Animations-Pack ohne Artwork' },
    keyArt: { dir: [0.24, 0.26, 1], pad: 1.16 },
    actor: {
      /* Kein legacyAssemble: diese Datei IST das gerigte Original der Legacy-Klasse
         (SkinnedMesh "PrototypePete", 6 Bones, 30 eingebettete Clips). Die Orcs mussten
         zusammengesetzt werden, weil sie nur Teile liefern — Pete nicht. */
      id: 'pete', role: 'resident', a: LEGACY_RIG_A, commit: LEGACY_PIN,
      rigFamily: 'Rig_Legacy', rig: 'Rig_Legacy', p: [-0.4, 0.4], r: 12,
      pose: /^Idle$/, poseFreeze: true, poseTime: 0.4,
      texture: 'keine Textur-Datei — ein benanntes Material (PrototypePete), wie bei der Orc Warband'
    },
    habitat: [
      { id: 'cheese', role: 'landmark · Käseblock in Figurengröße', a: KFB + 'Cheese Block by Quaternius - lUAEwQ0XFU.glb', commit: LEGACY_PIN, p: [1.9, -0.2], r: -18 }
    ],
    signatureProps: [
      { id: 'pencil', slot: 1, role: 'Identität / Bleistift', a: LG + 'KayKit Character Animations 1.2 - legacy/Models/gltf/Pencil.gltf.glb',
        commit: LEGACY_PIN,
        hand: { of: 'pete', bone: 'handSlotRight', axis: [0, 1, 0], aim: [-0.68, 0.72, 0.15], aimIn: 'BasePose', grip: 0.12 } },
      { id: 'case', slot: 2, role: 'Aktivität / Federmappe', a: LG + 'KayKit Character Animations 1.2 - legacy/Models/gltf/Case.gltf.glb',
        commit: LEGACY_PIN, p: [-1.5, 1.1], r: 24 },
      { id: 'bee', slot: 6, role: 'Eigenheit / Biene (Honig-Ersatz, Fremdpack)', a: 'media/3D_Assets/GLB_cube-pets/animal-bee.glb',
        commit: LEGACY_PIN, optional: true, p: [1.0, 1.5], r: -40,
        scaleNote: 'Gemessen 1,34 × 2,02 × 1,29 — größer als Pete. Nicht skaliert; steht als Maßstabs-Befund daneben.' }
    ],
    notes: [
      'Pete ist die Figur, mit der KayKit seine Legacy-Animationen ausliefert — der Platzhalter, den `legacyAssemble()` bei der Orc Warband ausblendet. Hier läuft er ohne Zusammensetzen als eigener Bewohner: SkinnedMesh, 6 Bones, 30 eingebettete Clips, 1,175 × 1,899 × 1,118.',
      'Damit stehen zwei Bauarten derselben Rig-Klasse nebeneinander: Pete geriggt und komplett, die Orcs ungeriggt in vier Teilen. Der Vergleich ist der eigentliche Wert dieses Residents.',
      'Der Bleistift folgt derselben Konvention wie die Warband-Waffen: Langachse auf lokal +Y (1,098 lang, Pivot 0,16 unter der Spitze), also wieder `axis: [0,1,0]` + `aim` nach außen, gerechnet gegen die Basispose. Ohne das läge er flach — dieselbe Pack-Grenze wie bei den Orcs.',
      'KÄSE-MASSSTAB, gemessen: der Block ist 1,87 × 1,87 × 1,87 — fast genau so hoch wie Pete (1,90). Er ist deshalb als LANDMARKE gesetzt, nicht als Requisite. Nicht herunterskaliert: dieselbe Regel wie überall im Cast, und der Maßstab ist hier der Witz, nicht der Fehler.',
      'Honig gibt es im Repo NICHT. Über die Tree-API gesucht (bee, hive, jar, honey, pot): kein Honigtopf, keine Wabe. Als nächstliegender Ersatz steht eine Biene aus GLB_cube-pets bereit — Fremdpack, ausgewiesen, und per „Optional" abschaltbar statt stillschweigend eingebaut.',
      'Federmappe (0,538 × 0,438 × 0,202) und Bleistift sind Petes eigene Pack-Requisiten — die einzigen zwei Modelle neben der Figur. Kein Fremdpack nötig für die belegbaren Slots.'
    ],
    open: [
      'Kein Promo, kein Artwork: das Legacy-Animations-Pack liefert Modelle, drei Implementierungs-PDFs und Logos. Die Aufstellung ist gesetzt, nicht gegen eine Vorlage geprüft.',
      'Käse und Biene kommen aus Fremdpacks (KFB-Sammelordner, GLB_cube-pets) und sind stilistisch nicht KayKit. Ob die Town solche Mischungen will, ist eine Erzählentscheidung.',
      'Die Biene bringt 8 eigene Clips mit, die der Atlas nicht abspielt — sie steht. Ein zweites Animationssystem in einer Vignette ist nicht gebaut.',
      'Pete hat kein eigenes Habitat im Pack. Der Käseblock ist eine Setzung des Atlas, keine Pack-Kulisse.'
    ]
  },
  {
    residentId: 'hero-man',
    name: 'Ultra Turbo Hero Man',
    display: 'Ultra Turbo Hero Man · Rot & Blau',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 7 · Character 2 · UltraTurboHeroMan (August 2026)',
    townRole: 'Helden-Resident · Sentai-Auftritt in zwei Farben',
    habitatIntent: 'Keine Kulisse im Pack — die Promo stellt die zwei Farbvarianten gegenüber',
    activity: 'Rot mit Schwert und Blaster, Blau mit Schwert; die Promo-Aufstellung der zwei Varianten',
    relationships: ['Zweiter Resident mit echter Farbvariante nach dem Cleric — hier Rot gegen Blau', 'Erster Pack mit EIGENEN Rig_Medium-Clips, die die geteilte Bibliothek nicht hat'],
    reference: { src: 'uploads/pasted-1789658364412-0.png', label: 'KayKit Monthly Mystery · Series 7 · Character 2 · Ultra Turbo Hero Man (Promo, August 2026)', promoBackground: 0x3f86c8 },
    keyArt: { dir: [0.2, 0.24, 1], pad: 1.12 },
    actor: {
      id: 'hero_red', role: 'resident · rote Variante', a: UT + 'characters/UltraTurboHeroMan.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.3, 0.3], r: 14,
      /* Pack-eigene Bibliothek zusätzlich geladen — sie trägt hier NICHTS bei: die Sets sind
         namensgleiche Duplikate der geteilten (General 15/15, MovementBasic 11/11), und
         `Spawn_Ground` wird aus der geteilten aufgelöst (source-Pfad geprüft). Steht als
         Vorbereitung für einen Pack, der wirklich eigene Clips mitbringt. Siehe notes[]. */
      animLib: UT + 'Animations/gltf/', animSets: ['General', 'MovementBasic'],
      pose: /^Idle_B$/, poseFreeze: true, poseTime: 0.4,
      texture: UT + 'textures/ultraturboheroman_texture_A.png (im .glb eingebettet)'
    },
    habitat: [],
    signatureProps: [
      /* Wie die Vorlage: Blaster rechts, Blade links — beide auf reiner Identität.
         Siehe notes[]: die S29-Behauptung, zwei rechtshändige Requisiten seien nicht
         belegbar, war ungeprüft. Gemessen sitzt das Schwert links wie rechts. */
      /* VORLAGE FÜR ALLE HANDFEUERWAFFEN: der Lauf läuft auf der eigenen +Z (gemessen: z von
         -0,246 bis +0,759), die Slot-Achse für „vorn“ ist +Y. Unter Identität zeigt der Lauf
         deshalb auf die Slot-Achse „oben“ — in T-Pose senkrecht nach oben, in Idle_B quer vor
         den Bauch. Die Zuordnung dreht ihn dorthin, wo die Hand hinzeigt, und bleibt in jedem
         Clip gültig. */
      { id: 'blaster', slot: 1, role: 'Identität / Blaster (rechts)', a: UT + 'assets/gltf/UltraTurboHeroMan_Blaster.gltf',
        hand: { of: 'hero_red', bone: 'handslot.r', slotAxis: { from: [0, 0, 1], to: [0, 1, 0] } } },
      { id: 'sword_red', slot: 2, role: 'Aktivität / Turbo-Blade (links)', a: UT + 'assets/gltf/UltraTurboHeroMan_Sword.gltf',
        hand: { of: 'hero_red', bone: 'handslot.l' } },
      { id: 'hero_blue', slot: 4, role: 'Sozial / blaue Farbvariante, zweiter Bewohner', a: UT + 'characters/UltraTurboHeroMan.glb',
        skin: UT + 'textures/ultraturboheroman_texture_B.png',
        rig: 'Rig_Medium', p: [1.5, 0.35], r: -16,
        animLib: UT + 'Animations/gltf/', animSets: ['General', 'MovementBasic'],
        pose: /^Spawn_Ground$/, poseFreeze: true, poseTime: 0.85 },
      { id: 'sword_blue', slot: 5, role: 'Lore / Turbo-Blade der blauen Variante', a: UT + 'assets/gltf/UltraTurboHeroMan_Sword.gltf',
        hand: { of: 'hero_blue', bone: 'handslot.r' } },
      { id: 'blaster_spare', slot: 6, role: 'Eigenheit / zweiter Blaster, abgestellt', a: UT + 'assets/gltf/UltraTurboHeroMan_Blaster.gltf',
        p: [3.1, 0.6], r: -28 }
    ],
    notes: [
      'Der Pack hat genau drei Modelle: UltraTurboHeroMan.glb, _Sword, _Blaster — und ZWEI Texturen (A rot, B blau). Zweiter Resident mit echter Farbvariante nach dem Cleric; `skin` tauscht die Karte auf der zweiten Instanz.',
      'Gemessen: Figur 1,943 × 2,288 × 1,131 (Rig_Medium, 23 Bones). Schwert 1,793 lang, Langachse lokal +Y, Pivot 0,303 unter dem Griff — Standardkonvention, Identität an handslot.r. Blaster 0,59 × 0,654 × 1,006 mit dem LAUF auf lokal +Z (z von -0,246 bis +0,759), also dieselbe Konvention wie das Toy-Soldier-Gewehr.',
      'DER PACK BRINGT EIGENE CLIP-DATEIEN MIT — UND SIE SIND DUPLIKATE. `Animations/gltf/Rig_Medium/` enthält General (15 Clips) und MovementBasic (11). Namensweise gegen die geteilte Bibliothek verglichen: **15/15 und 11/11 identisch**, kein einziger zusätzlicher Clip. Spawn_Air, Spawn_Ground, Use_Item, Death_B und Hit_B liegen also schon in der geteilten Bibliothek; die rote Variante nimmt `Spawn_Ground` von dort (source-Pfad geprüft). Ein pack-eigener Animations-Ordner ist damit KEIN Hinweis auf zusätzliche Clips — die Packs liefern die geteilten Sets unverändert mit. `loadClips` kann zusätzliche Wurzeln laden und entdoppelt nach Set/Name; hier trägt der Mechanismus deshalb null Clips bei und bleibt als Vorbereitung für einen echten Fall stehen.',
      'BLASTER-ANIMATIONEN: es gibt KEINE. Alle 119 Clips der geteilten Bibliothek gegen shoot/gun/aim/reload/blast geprüft (die Pack-Dateien tragen nichts bei, siehe oben — sie sind Duplikate) — Treffer sind ausschließlich `General/Throw` und `MovementAdvanced/Running_HoldingRifle`. Kein Schieß-Clip, kein Lade-Clip, keine Zielhaltung. Deshalb steht der Blaster abgestellt statt in der Hand: eine Waffe ohne Haltung in die Faust zu stecken hieße, die Pose zu erfinden.',
      'S30 · WIDERRUF: „zwei rechtshändige Requisiten sind ohne gerechnete Ausrichtung nicht belegbar“ war eine ungeprüfte Annahme — derselbe Fehler wie beim Cleric-Folianten, nur eine Runde später. Alle vier Kombinationen mit reiner Identität gemessen (Idle_B): Schwert-Langachse links [-0,07 / -0,09 / 0,99] gegen rechts [-0,09 / 0,02 / 1,00] — praktisch gleich, beide nach vorn. Blaster-Lauf rechts [-0,96 / 0,27 / -0,10], links [1,00 / 0,06 / 0,08], also jeweils zur Gegenseite: die Waffe zeigt aus dem hängenden Arm heraus quer, was anatomisch stimmt und keine Ausrichtung braucht. Kein Bodendurchstich in allen vier Fällen (Unterkanten 0,187 bis 0,274), Kopfabstand 0,589 bis 0,643. Jetzt wie die Vorlage: Blaster rechts, Blade links, beides Identität.',
      'Die Rollen der beiden Figuren sind getauscht, damit jede ihre Vorlage zeigt: Rot steht (Idle_B) mit beiden Requisiten wie im contents-Render, Blau landet (Spawn_Ground) wie in der Promo.'
    ],
    open: [
      'Kein Schieß- und kein Lade-Clip in irgendeiner verfügbaren Bibliothek (119 Clips — die Pack-Sets sind namensgleiche Duplikate und erweitern die Liste nicht). Eine Schusshaltung wäre eine Erfindung — Frage an die Animation Lab, nicht an den Atlas.',
      'Der Blaster wird getragen, aber nicht gezielt: `Idle_B` lässt den Arm hängen, der Lauf zeigt quer statt nach vorn. Eine Zielhaltung bleibt unbaubar, solange kein Schuss-Clip existiert — das ist eine Clip-Lücke, keine Attachment-Frage.',
      'Keine Kulisse im Pack. Habitat bleibt leer statt mit Fremdpack-Möbeln gefüllt zu werden.',
      '`Spawn_Air` ist nicht gebaut: eine Figur, die in der Luft steht, braucht eine Aussage über Höhe und Zeitpunkt, die der Atlas nicht hat. `Spawn_Ground` ist die bodenständige Hälfte desselben Paares.'
    ]
  },
  {
    residentId: 'cleric',
    name: 'Cleric',
    display: 'Cleric · Brunnen, Streitkolben & Folianten',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · 3 - September 2025 - Cleric',
    townRole: 'Heil-Resident · Segen, Brunnen und Schriften',
    habitatIntent: 'Weihbrunnen als Mittelpunkt, zwei Kleriker beidseits — die Aufstellung der Pack-Promo',
    activity: 'Links die hellhäutige Variante mit Streitkolben und Schild, rechts die dunkelhäutige mit aufgeschlagenem Folianten in der Rechten',
    relationships: ['Erster Resident mit einer echten FARBVARIANTE — zwei Texturen, eine Geometrie', 'Wissens-Nachbar der Witch und des Lorekeeper; Brunnen als Town-Heilkandidat'],
    reference: { src: 'uploads/pasted-1789657767582-0.png', label: 'KayKit Monthly Mystery · Series 6 · Character 3 · The Cleric (Promo, September 2025)', promoBackground: 0x7d8a86 },
    keyArt: { dir: [0.2, 0.26, 1], pad: 1.12 },
    actor: {
      id: 'cleric', role: 'resident · helle Variante', a: CE + 'Cleric.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.5, 0.3], r: 16,
      pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.2,
      texture: CE + 'cleric_texture.png (im .glb eingebettet)'
    },
    habitat: [
      { id: 'font', role: 'landmark · Weihbrunnen', a: CE + 'gltf/Cleric_Font.gltf', p: [0.15, -0.1], r: -12 }
    ],
    signatureProps: [
      { id: 'mace', slot: 1, role: 'Identität / Streitkolben', a: CE + 'gltf/Cleric_Mace.gltf',
        hand: { of: 'cleric', bone: 'handslot.r' } },
      { id: 'shield', slot: 2, role: 'Aktivität / Schild', a: CE + 'gltf/Cleric_Shield.gltf',
        hand: { of: 'cleric', bone: 'handslot.l', push: 0.16 } },
      { id: 'cleric_dark', slot: 4, role: 'Sozial / dunkelhäutige Farbvariante, zweiter Bewohner', a: CE + 'Cleric.glb',
        skin: CE + 'cleric_texture_B.png',
        rig: 'Rig_Medium', p: [1.85, 0.35], r: -18,
        pose: /^Holding_C$/, poseFreeze: true, poseTime: 0.3 },
      /* Identität an handslot.R — wie jede andere Series-6-Requisite. Siehe Notes: der
         Foliant ist für die RECHTE Hand authored, nicht für die linke. */
      /* IDENTITÄT — gemessen, nicht per Analogie zum Blaster. S31 hatte die Seitennormale auf
         Slot-„vorn“ gelegt, weil das beim Blaster-Lauf richtig war. A/B am gebauten Knoten:
         senkrechter Anteil der Seitennormale 0,53 mit Zuordnung gegen 0,85 unter Identität —
         die Zuordnung war schlechter, das Buch stand auf dem Buchrücken. Die Analogie war der
         Fehler: WELCHE Slot-Achse richtig ist, hängt an der Requisite, nicht am Nachbarfall. */
      { id: 'tome', slot: 5, role: 'Lore / aufgeschlagener Foliant', a: CE + 'gltf/Cleric_Tome.gltf',
        hand: { of: 'cleric_dark', bone: 'handslot.r' } },
      { id: 'mace_dark', slot: 6, role: 'Eigenheit / zweiter Streitkolben, abgestellt', a: CE + 'gltf/Cleric_Mace.gltf',
        p: [2.9, 0.9], r: 24 }
    ],
    notes: [
      'Der Pack hat genau fünf Modelle: Cleric.glb, Cleric_Font, Cleric_Mace, Cleric_Shield, Cleric_Tome — und ZWEI Texturen, cleric_texture.png und cleric_texture_B.png. Die zweite ist die dunkelhäutige Variante und im .glb nicht verdrahtet.',
      'ERSTE echte Farbvariante im Cast. Bisher hat der Atlas Zweittexturen nur erwähnt (animatronic_A, orcbrute_texture_B, monstrosity_texture_B) und die eingebettete gezeigt. Neu: `skin` tauscht die Karte auf der INSTANZ — Material geklont, damit die erste Instanz unberührt bleibt, Farbraum und Filter von der Originalkarte übernommen statt geraten.',
      'Gemessen: Figur 2,008 × 2,173 × 1,091 (Rig_Medium, 23 Bones — normale Größenklasse, nicht Large). Brunnen 1,438 × 0,805 × 1,437, Streitkolben 1,412 lang (Pivot 0,444 unter dem Kopf), Schild 0,749 rund und 0,174 dick, Foliant 0,864 × 0,653 × 0,267.',
      'Schild mit push=0,16 — dieselbe Regel wie bei Black Knight (0,55) und Skeleton Warrior (0,18): Pivot liegt auf der Rückfläche (z von -0,079 bis +0,095), die Faust hat Volumen davor. Kein Neudrehen, nur ein Schub entlang der Normale. Der Wert ist niedriger als beim Ritter, weil diese Hand kleiner ist.',
      'BUCH-POSE: es gibt in den 119 Clips KEINEN Lese-Clip — geprüft (nur Holding_A/B/C, Fishing_Cast, Running_HoldingBow/Rifle). Holding_C mit dem Folianten an handslot.r kommt der Promo am nächsten: Unterarm angewinkelt, Buch aufgeschlagen vor dem Körper. Die erste Fassung führte den zweiten Arm per CCD an die Buchkante nach (`pull`) — das ist wieder ausgebaut: der Arm blieb 0,334 vom Ziel, war dafür aber sichtbar verdreht. Eine Nachführung, die ihr Ziel nicht erreicht, ist keine Haltung, sondern ein verbogener Arm.',
      'DER FOLIANT IST KEINE AUSNAHME — ich hatte ihn an der FALSCHEN HAND. S28 hatte ihn an handslot.l gehängt, dort lag er hochkant mit der Seitenkante zum Betrachter (Weltbox 0,55 × 0,86 × 1,03, Seitennormale [0,96 / -0,23 / -0,15], also quer), und ich habe daraus eine „dritte Ausnahme von der Identitätsregel“ gemacht und eine Ausrichtung dazugerechnet. Gegenprobe an handslot.R, reine Identität: Seitennormale [-0,40 / 0,85 / 0,35] an der UNGEDREHTEN Sondeninstanz, in der gebauten Szene (Figur auf r=-18°) [-0,49 / 0,85 / 0,21] — beide Male y=0,85, also nach oben und leicht nach vorn: aufgeschlagen wie in der Promo. Die Regel galt, der Anker war falsch. Wie jede andere Series-6-Requisite: erst die andere Hand probieren, bevor man eine Ausnahme erfindet.',
      'Zwei Kleriker aus einer Datei: derselbe Aktor-Pfad zweimal instanziert, einmal mit getauschter Textur. Dieselbe Systematik wie die drei Gitarren des Animatronic oder die drei Geschenke des Toy Soldier — keine zweite Datei erfunden.'
    ],
    open: [
      'Kein Lese- oder Segens-Clip in der Bibliothek. `Holding_C` ist eine generische Haltepose; die Buchhaltung entsteht erst durch die Armnachführung. Ob die Town eine echte Lese-Animation braucht, ist eine Frage an die Animation Lab.',
      'Der Brunnen ist unbewegt — kein Wasser-Shader, keine Wellen-Animation im Pack. Die Promo zeigt ihn leuchtend blau gefüllt; das ist Material, nicht Animation.',
      'Die Aufstellung folgt der Promo (Figur – Brunnen – Figur), die Abstände sind gesetzt und gegen das Bild geprüft, nicht gemessen.',
      'Der zweite Streitkolben steht abgestellt statt in der linken Hand: Streitkolben und Foliant sind beide für die RECHTE Hand authored. Einen davon links zu führen heißt, die authored Drehung aufzugeben und wieder eine Ausrichtung zu rechnen — genau der Fehler, der die erste Buch-Fassung gekostet hat. Die Promo zeigt beides gleichzeitig; mit einem Paar rechtshändiger Requisiten ist es nicht belegbar darstellbar.'
    ]
  },
  {
    residentId: 'animatronic',
    name: 'Animatronic',
    display: 'Animatronic · Barrys Funhouse-Kapelle',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series · Series 4 · Character 5 · 5 - November 2023 - Animatronic',
    townRole: 'Bühnen-Residents · Maskottchen-Kapelle',
    habitatIntent: 'Noch offen — der Pack liefert nur die zwei Bärenzustände und eine Gitarre',
    activity: 'Der defekte Bär reißt die Gitarre über den Kopf, der intakte spielt sie im Takt; daneben eine abgestellte Akustik- und zwei E-Gitarren',
    relationships: ['Zweiter Mehr-Aktor-Fall nach den Farmers — zwei Zustände derselben Figur, nicht zwei Charaktere', 'Bühnen-Gegenstück zur Goth Girl: dieselbe Auftritts-Rolle, andere Tonlage'],
    reference: { src: AN + 'artwork.png', label: 'KayKit Animatronic · Promo-Artwork (Creepy links, Normal rechts)', promoBackground: 0x6b5fc0 },
    keyArt: { dir: [0.16, 0.24, 1], pad: 1.16 },
    actor: {
      id: 'creepy', role: 'resident · defekter Zustand', a: AN + 'characters/gltf/Animatronic_Creepy.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.5, 0], r: 12,
      pose: /^Waving$/, poseFreeze: false,
      texture: AN + 'textures/animatronic_B.png (im .glb eingebettet; animatronic_A als Alt-Skin daneben)'
    },
    habitat: [],
    signatureProps: [
      { id: 'guitar_creepy', slot: 1, role: 'Identität / Gitarre hochgerissen', a: AN + 'assets/gltf/Guitar.gltf',
        hand: { of: 'creepy', bone: 'handslot.r' } },
      { id: 'normal', slot: 4, role: 'Sozial / intakter Zustand, zweiter Bewohner', a: AN + 'characters/gltf/Animatronic_Normal.glb',
        rig: 'Rig_Medium', p: [1.2, -0.1], r: -14, pose: /^Holding_B$/, poseFreeze: false,
        /* dir wird NICHT gesetzt — der Atlas rechnet sie aus der Deckenlage des gehaltenen
           Instruments (Weltsenkrechte in die Deckenebene projiziert). Ergebnis: 99,9 %
           senkrechter Anteil, also hoch/runter über den Saiten statt seitlich. */
        strum: { arm: 'r', bpm: 96, beats: 4, travel: 0.16, sway: 1.5 } },
      { id: 'guitar_normal', slot: 2, role: 'Aktivität / Gitarre in Spielhaltung', a: AN + 'assets/gltf/Guitar.gltf',
        /* Konstruktiv gehalten statt an die Pfote gehängt. gripLocal/strumLocal/faceZ/backZ/
           bodyMid sind die in S28 gemessene Gitarren-Anatomie (Hals -0,28…+0,14, Korpus
           -0,92…-0,28, Decke z=+0,043, Rücken z=-0,10). Der Korpus wird mit 3 cm Abstand vor
           die gemessene Bauchfront gesetzt — nicht aus der Schulter heraus konstruiert, das
           hat ihn in S28 in den Bauch gesteckt. */
        hold: { of: 'normal', gripArm: 'l', strumArm: 'r',
                elevation: 36, azimuth: 4, roll: 0, front: 0.1, strumX: -0.34,
                gripLocal: -0.14, strumLocal: -0.56, faceZ: 0.043, backZ: -0.1, bodyMid: -0.6,
                bodyX: -0.1, bodyY: 0.8, bellyGap: 0.04 } },
      { id: 'guitar_ground', slot: 5, role: 'Lore / dritte Gitarre abgestellt', a: AN + 'assets/gltf/Guitar.gltf', p: [2.9, 0.7], r: -24 },
      { id: 'electric_pink', slot: 6, role: 'Eigenheit / E-Gitarre der Kapelle (Mixed Bag 1)', a: MB + 'guitar_A.gltf', commit: MB_COMMIT, p: [3.9, 0.15], r: -12 },
      { id: 'electric_blue', role: 'promo-extra · zweite E-Gitarre, gleiche Form andere UV-Lage', a: MB + 'guitar_B.gltf', commit: MB_COMMIT, p: [4.45, -0.5], r: 9 }
    ],
    notes: [
      'Der Animatronic-Pack hat genau drei Modelle: Animatronic_Creepy.glb, Animatronic_Normal.glb, Guitar.gltf. Die drei Akustikgitarren der Vignette sind drei Instanzen derselben Datei — wie die drei Geschenkboxen beim Toy Soldier, kein zweites Modell erfunden. Die zwei E-Gitarren kommen aus Mixed Bag 1.',
      'S28-KORREKTUR AN MIR SELBST: ich hatte gemeldet, Mixed Bag 1 sei „ohne Modelle eingecheckt, 0 von 7 Dateien“. Falsch. Die Baumansicht des Repos listet nur, was sie für importierbar hält, und filtert .gltf/.bin weg; ich habe dem Filter geglaubt statt dem Pfad. Über eine Inhaltssuche gezählt liegen dort 41 glTF-Dateien, darunter guitar_A und guitar_B. Lehre: ein Werkzeug, das „nichts gefunden“ sagt, hat nicht „nichts da“ gemessen — nur „nichts, was ich zeige“.',
      'Die beiden E-Gitarren sind GEOMETRISCH IDENTISCH — gleiche 1385 Vertices, gleiche Bounding-Box [-0,424 / -1,349 / -0,087] bis [0,424 / 0,534 / 0,083], gleiche Puffergröße 50428 Byte. Pink und Blau unterscheiden sich nur in der UV-Lage auf der gemeinsamen Palette-Textur kaykit_texture_A. Zwei Dateien, ein Modell, zwei Farben.',
      'Sie teilen die Konvention der Akustikgitarre: Längsachse ist die lokale Y, Pivot sitzt oben im Hals (0,534 über, 1,349 unter dem Pivot), Decke auf der lokalen Z. Georgs Einschätzung stimmt — die `hold`-Mechanik nimmt sie ohne Änderung. Was fehlt, ist ihr Querschnittsprofil: wo der Hals endet und der Korpus beginnt, ist bei einer Flying V eine andere Grenze als bei einer Akustikgitarre, und ohne diese Grenze wäre gripLocal geraten. Bis dahin stehen sie abgestellt.',
      'Maßstab gemessen: 1,883 lang gegen 1,272 der Akustikgitarre, Faktor 1,48. An einem 2,09 hohen Bären ist das ein großes Instrument — nicht skaliert, weil das eine Atlas-Erfindung wäre.',
      'Gemessen: Creepy 2,09 × 2,09 × 1,05, Normal 1,94 × 2,09 × 1,05 — die 15 cm Breitenunterschied sind die abstehenden Bruchstücke am defekten Kopf, nicht ein anderes Rig. Beide 23 Bones, Rig_Medium, Kopf-Bone y=1,228.',
      'Die Gitarre ist 1,27 lang. Ihr Pivot sitzt oben im Hals — genau das sagt, an welche Hand sie gehört: eine Rechtshänder-Gitarre wird am Hals von der LINKEN Hand gegriffen, die rechte schlägt an. S26 hängte sie an handslot.r, damit lief der Hals quer über die Brust in die Schnauze.',
      'ANATOMIE GEMESSEN (S28), nicht geschätzt — Querschnittsprofil entlang der Längsachse in 24 Scheiben: Hals liegt bei lokal y -0,28…+0,14 und ist dort nur 9–12 cm breit, Kopfplatte y +0,14…+0,36 mit 24,7 cm, Korpus y -0,92…-0,28 mit bis zu 50 cm. Decke bei z=+0,043, Rücken bei z=-0,10. Erst diese Tabelle macht „Hand am Hals“ prüfbar — und sie zeigte, dass der S27-Wert grip 0,42 die Pfote auf den KORPUS setzte, nicht an den Hals.',
      'S28 · DIE ABHÄNGIGKEIT IST UMGEKEHRT. Drei Anforderungen — Griffhand am Hals, Korpus nah am Bauch, Anschlagpfote über der Decke — lassen sich nicht erfüllen, solange das Instrument an der Pfote hängt, wo der Clip sie hinstellt: Holding_B setzt die linke Pfote 15 cm weiter nach vorn als die rechte, also kann eine Gitarre nie gleichzeitig in der einen Hand liegen und die Decke unter der anderen haben. Deshalb wird jetzt das Instrument im Körperraum gesetzt und BEIDE Arme per CCD nachgeführt (`hold` + `reachChain` in lib/atlas.js).',
      'Anker ist die gemessene BAUCHEBENE, nicht die Schulter: der Rückenpunkt der Korpusmitte wird mit dem Soll-Abstand bellyGap = 4 cm vor die an posierten Mesh-Vertices gemessene Bauchfront (z=0,333) gelegt. Das ist ein Parameter an EINEM Punkt — nachgemessen liegt die hinterste Korpuskante bei z=0,356, also 2,3 cm vor dem Bauch, weil der Korpus gegen die Bauchebene gekippt steht. Ein aus der Schulter heraus konstruierter Anschlagpunkt liegt zwar per Bau in Reichweite — in S28 lag er damit aber 45 cm im Rumpf.',
      'Ergebnis gemessen, nicht behauptet — Werte bei Bauzeit: Griffpfote bei lokal [0 / -0,14 / 0], mittig auf dem Hals, seitlich exakt null. Anschlagpfote bei [-0,001 / -0,561 / 0,090], mittig auf der Decke und 4,7 cm vor ihr. Deckennormale [-0,046 / -0,033 / 0,998], also frontal. Hinterste Korpuskante bei z=0,356 gegen Bauchfront 0,333, also 2,3 cm davor. Restfehler der Nachführung: Griffarm 0,000, Anschlagarm 0,003. Bodenfreiheit über echte Vertices und als Minimum über die Anschlagschleife: 0,471 tiefster Stand, 0,484 höchster. Box3 hätte hier 0,398 gemeldet — 7,2 cm zu tief, weil setFromObject die acht Ecken der um 36° gekippten lokalen AABB mitdreht. Ein Momentwert wäre zudem phasenabhängig.',
      'KEIN Gitarren-Clip in der geteilten Bibliothek — alle 119 Clips geprüft. Statt eine Pose zu erfinden, wurden sieben Kandidaten jeweils MIT angehängter Gitarre gemessen (Weltbox der Gitarre, Abstand zur zweiten Hand, Abstand zum Kopf-Bone, Bodenabstand):',
      'Normal → Holding_B, Griffhand links. Der Clip stellt die linke Pfote auf [0,18 / 0,85 / 0,54] — vorn und höher als die rechte — und ist damit der einzige geprüfte Clip, der eine Griffhand und eine freie Anschlaghand gleichzeitig anbietet. Holding_A stellt die Anschlagpfote 0,51 vom Korpus weg, Idle_A 0,72, Holding_C drückt den Hals in den Kopf (Boxabstand 0).',
      'ANSCHLAG-LOOP, prozedural (Toolbox: `strumClip` in lib/atlas.js). Die Bibliothek hat keinen Instrumenten-Clip — also gerechnet statt erfunden, und additiv auf die gemessene Haltung: die Bewegung liegt als Delta auf den lokalen Quaternionen, die Holding_B hinterlässt. Die geprüfte Pose bleibt dadurch erhalten.',
      'Die Drehachsen sind gerechnet, nicht gesucht: für eine Drehung um die Achse a durch den Bone-Ursprung fährt die Spitze im Abstand r mit a × r — gesucht ist also a mit a × r parallel zur Anschlagrichtung, und das ist genau a = normalize(r × d). Ein Suchlauf über x/y/z konnte nur Hauptachsen wählen und hat in S28 Bahnen mit 32–41 % Ausrichtung genommen; mit der Formel liegen alle drei Gelenke bei 88–94 %. Der Betrag von a × r liefert gleich den Faktor Grad → Zentimeter, deshalb ist die Amplitude eine STRECKE: 16 cm Pfotenweg sind nachprüfbar, „18° am Ellbogen“ nicht.',
      'Gelenke, deren Bahn quer zur Anschlagrichtung läuft, werden AUSGESCHLOSSEN statt mitgeschleift (Schwelle 60 % Ausrichtung) und die Strecke unter den brauchbaren neu verteilt. Gemessen nach der Nachführung: Ellbogen 94 % (10 cm, 13,4°), Schulter 88 % (3 cm, 2,7°), Handgelenk 94 % (2 cm, 7,4°). Zusätzlich eine Obergrenze von 26° pro Gelenk — ein Handgelenk, das pro Grad kaum Strecke liefert, würde sich sonst verrenken, um seinen Anteil zu erfüllen.',
      'Nachgemessen an der Bahn selbst, 25 Abtastpunkte über die Schleife: senkrechte Weglänge 1,19 gegen 0,01 seitlich — Verhältnis 111 zu 1, Ausschlag 16 cm. Die Pfote bleibt an allen 25 Punkten im Korpusfenster und an keinem hinter der Decke. „Hoch/runter, nicht seitlich“ ist damit gemessen, nicht behauptet.',
      'Das Wippen läuft auf der WIRBELSÄULE, nicht auf den Hüften: die Hüften tragen die Beine, eine Hüftdrehung würde die gepflanzten Füße verschieben. 1,5° pro Schlag um die Querachse des Körpers — diese eine Achse ist gesetzt statt gemessen, und zwar begründet: ein Wippen IST ein Nicken um die Querachse. Eine Bahnmessung lieferte hier 4 % Ausrichtung, weil eine Spine-Drehung den Kopf kaum senkrecht bewegt. Der Kopf hängt an der Wirbelsäule und nickt mit — ein eigener Kopf-Track wäre ein zweiter erfundener Wert.',
      'Abschlag 40 % der Periode, Rückweg 60 %: eine symmetrische Sinuskurve klingt wie ein Metronom, nicht wie eine Hand. 96 BPM, 4 Schläge, 2,50 s Schleife.',
      'Die beiden Clips sind DISJUNKT gesplittet: der Anschlag treibt Ellbogen, Handgelenk und Schulter rechts plus die Wirbelsäule, Holding_B behält 46 von 67 Tracks. Herausgenommen sind die getriebenen UND die nachgeführten Bones — sonst zieht der Clip die Arme samt Instrument in die Clip-Haltung zurück und die ganze Konstruktion wäre umsonst. Kein Blend-Gewicht, keine Frage welcher Clip gewinnt.',
      'S28-Reihenfolgefalle, teuer gelernt: `mixer.stopAllAction()` stellt in three.js die gecachten Ausgangswerte der gebundenen Eigenschaften wieder her — also die Bone-Werte von VOR der Nachführung. Das Bauprotokoll meldete Restfehler 0,000, und im Bild stand der Arm woanders: das Protokoll war zum Zeitpunkt der Messung richtig, eine Zeile später hat das Framework die Messung zurückgedreht. Der alte Mixer wird jetzt fallen gelassen statt gestoppt, ein frischer bindet die nachgeführte Pose.',
      'Creepy → Waving @ handslot.r: Gitarre steht bei y 0,33–1,70 über dem Kopf-Bone (1,23), flach in z (0,13–0,28), Kopfabstand 0,50. Genau die Promo-Haltung des defekten Bären — Instrument hochgerissen, der andere Arm ausgestreckt. Hier bleibt Identität richtig, und hier ist die rechte Hand korrekt die haltende.',
      'Verworfen und warum: Holding_C @ handslot.r legt die Gitarre 1,14 nach vorn aus dem Körper heraus und die zweite Hand steckt in ihr (Abstand 0). Holding_A hält sie senkrecht mit nur 0,12 Kopfabstand. Idle_A und Cheering lassen sie seitlich am Bein hängen (zweite Hand 0,51 bzw. 0,66 weit weg) — kein Spielen, nur Tragen.',
      'S26-Lehrsatz: die Weltbox einer Requisite sagt, WO sie ist, aber nicht, WIE sie liegt. „y 0,32–0,92 quer vor dem Körper“ klang nach Spielhaltung und war in Wahrheit eine waagerecht ausgestreckte Gitarre. Seit S26 wird bei jeder Ausrichtung zusätzlich die Längsachse als Weltrichtung und die Flächennormale mitgemessen — zwei Zahlen, die eine Box nicht liefert.',
      'S27-Nachtrag zum selben Lehrsatz: auch Längsachse und Normale reichen nicht, wenn die Requisite an der falschen Hand hängt. Der Pivot sagt, WELCHE Hand.',
      'S28-Nachtrag, der bittere: mein eigener Durchdringungstest im Rasterlauf hat die Gitarre im Bauch nicht gesehen — er maß den Abstand zum nächsten Rumpf-VERTEX, und ein Punkt tief im Körper ist von jeder Oberfläche weit entfernt. Der Test war blind für genau den Fall, den er prüfen sollte. Ersetzt durch einen Ebenenvergleich: Gitarrenrücken gegen gemessene Bauchfront, beides im Aktor-Frame. Und der Bauch wird an einer FRISCHEN, nur mit dem Basis-Clip posierten Figur gemessen — nach der Nachführung liegen Arme und Pfoten vor dem Bauch, ein max-z über alle Aktor-Vertices misst dann die Pfote.'
    ],
    open: [
      'Keine Kulisse im Pack. Das Artwork zeigt eine leere Studiofläche mit Farbteiler (Violett/Grün) — die Atlas-Grundbeleuchtung bleibt neutral, damit Residents vergleichbar bleiben.',
      'Die beiden E-Gitarren laufen auf commit: ‘main’ statt auf dem gepinnten Asset-Commit — Mixed Bag 1 ist erst danach eingecheckt worden. Das ist die einzige unpinned Quelle im Cast: sobald ein Commit-SHA für den Pack feststeht, gehört er in MB_COMMIT.',
      'E-Gitarren stehen abgestellt, nicht gespielt: dafür fehlt ihr Querschnittsprofil (Hals-/Korpusgrenze). Ein gripLocal ohne diese Messung wäre geraten — genau der Fehler, der in S27 die Pfote auf den Korpus gesetzt hat.',
      'Die Griffpfote greift keinen Akkord: die Finger stehen wie im Clip, nur der Anschlagarm bewegt sich. Ein Griffwechsel bräuchte Finger-Bones, die dieses Rig nicht hat (23 Bones, Hand endet am handslot).',
      'Anschlag ohne Saitenkontakt: die Pfote fährt 16 cm durch die Ebene der Decke, wird aber nicht an den Saiten gestoppt. Eine Kollisionsprüfung pro Frame wäre möglich, ist aber nicht gebaut.',
      'Zweiter Skin (animatronic_A.png) liegt im Pack und ist im Artwork als grüne Variante zu sehen; der Atlas zeigt nur die eingebettete B-Variante.',
      'Die dritte Gitarre steht aufrecht ohne Stütze — das Artwork zeigt sie an der rechten Figur angelehnt. Ein Anlehnen bräuchte eine Kippung nach Augenmaß; bis dahin steht sie gerade.'
    ]
  },
  {
    residentId: 'action-figure',
    name: 'Action Figure',
    display: 'Action Figure · Wechselköpfe & Gesichter',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series · Series 4 · Character 6 · 6 - December 2023 - Action Figure',
    townRole: 'Spielzeug-Resident · Sammelfigur mit Wechselteilen',
    habitatIntent: 'Noch offen — der Pack liefert Figur, vier Köpfe und ein Gesichtsblatt, keine Kulisse',
    activity: 'Trägt Kopf C (entschlossenes Grinsen); die drei anderen Köpfe schweben daneben, dazu ein vierter Ausdruck, den kein Auslieferungskopf benutzt',
    relationships: ['Erster Resident mit Wechselgeometrie am Kopf-Bone — Vorlage für jede künftige Varianten-Figur', 'Spielzeug-Gegenstück zum Toy Soldier: dort Enthüllung, hier Modularität'],
    reference: { src: AF + 'artwork.png', label: 'KayKit Action Figure · Promo-Artwork (vier Wechselköpfe schwebend)', promoBackground: 0xd8842c },
    keyArt: { dir: [0.14, 0.26, 1], pad: 1.16 },
    actor: {
      id: 'figure', role: 'resident', a: AF + 'character/gltf/ActionFigure.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [0, 0], r: 0,
      pose: /^Idle_A$/, poseFreeze: false,
      /* Der eigene Kopf (Schale + Gesichtsebene) wird abgeschaltet, weil Kopf C aufgesetzt wird.
         Zigarre und Stirnband bleiben stehen: sie sind eigene Geschwister-Meshes der Figur und
         sitzen unabhängig vom Kopfmodell an derselben Stelle. */
      hide: [/^ActionFigure_Head_\d+$/],
      /* Kopf C aufgesetzt: gehört zur Figur, nicht zu ihren Requisiten — siehe graft in lib/atlas.js */
      graft: [{ id: 'head_worn', slot: 1, role: 'Identität / getragener Kopf C (Grinsen)', bone: 'head',
                a: AF + 'assets/gltf/ActionFigure_Head_C.gltf', hide: [/Headband$/] }],
      texture: AF + 'textures/actionfigure_texture.png (Körper) + actionfigure_faces.png (Gesichter, 2×2-Atlas) — beide im .glb eingebettet'
    },
    habitat: [],
    signatureProps: [
      { id: 'head_d', slot: 2, role: 'Aktivität / Wechselkopf D (Schrei)', a: AF + 'assets/gltf/ActionFigure_Head_D.gltf', p: [2.1, 0.45], float: 1.6, r: -18 },
      { id: 'head_b', slot: 4, role: 'Sozial / Wechselkopf B (Lachen)', a: AF + 'assets/gltf/ActionFigure_Head_B.gltf', p: [3.15, 0.1], float: 1.28, r: -40 },
      { id: 'head_normal', slot: 5, role: 'Lore / Wechselkopf Normal (Veteran)', a: AF + 'assets/gltf/ActionFigure_Head_Normal.gltf', p: [2.3, -1.0], float: 0.7, r: -26 },
      { id: 'head_calm', slot: 6, role: 'Eigenheit / vierte Atlas-Kachel (ruhig) auf Kopf C', a: AF + 'assets/gltf/ActionFigure_Head_C.gltf', p: [1.05, 1.05], float: 1.48, r: -6, faceTile: [0, 0] }
    ],
    notes: [
      'Der Pack hat genau fünf Modelle: ActionFigure.glb und vier Kopf-Dateien (Normal, B, C, D). Über den Registry-Shard gezählt. Die Waffen und Granaten im Artwork gehören NICHT zu diesem Pack — sie sind nicht nachgebaut, statt sie aus einem Fremdpack zusammenzusuchen.',
      'ZWEI ACHSEN, zwei Mechaniken — das ist der Kern dieses Residents. Kopf = GEOMETRIE: jede Kopf-Datei enthält Schale, Gesichtsebene und Zubehör als getrennte Geschwister-Meshes und ist mit Pivot auf dem head-Bone authored, sitzt also mit Identität. Ausdruck = TEXTUR: die Gesichtsebene ist ein eigenes Mesh mit eigenem Material auf einem 2×2-Atlas.',
      'Gemessen, nicht angenommen: actionfigure_faces.png ist 1024² mit vier 512²-Kacheln. Die UV-Bereiche der drei Gesichtsebenen liegen jeweils vollständig in EINER Kachel — Kopf C in [0,1] (Grinsen, links oben), Kopf D in [1,1] (Schrei, rechts oben), Kopf B in [1,0] (Lachen, rechts unten). Kachel [0,0] (ruhig, geschlossene Augen) wird von KEINEM Auslieferungskopf benutzt.',
      'Genau diese freie Kachel ist der Beweis, dass das mentale Modell stimmt: head_calm ist dieselbe Datei wie head_worn, nur mit faceTile [0,0]. Der Versatz [-0,000 / -0,500] wird aus den eigenen UVs gerechnet, nicht aus einer Zuordnungstabelle — also funktioniert er auch auf jedem künftigen Kopf dieses Packs.',
      'Kopf Normal fällt aus dem Schema und ist deshalb als Lore-Slot gesetzt: er hat KEINE separate Gesichtsebene. Sein Gesicht (Veteran mit Schnauzer) ist in die Körpertextur gemalt (UV 0,011–0,328 / 0,047–0,588 auf actionfigure_texture.png). Bei ihm ist der Ausdruck Geometrie-gebunden — faceTile greift dort bewusst nicht.',
      'Gemessen: Figur 1,94 × 2,32 × 1,17, head-Bone bei y=1,228. Alle vier Köpfe sind exakt 1,085 × 1,205 in x/y und unterscheiden sich nur in der Tiefe (1,117–1,251) — die Differenz ist die Zigarre, die B und D mitbringen und C nicht. Identische Pivots, deshalb ist der Tausch verlustfrei.',
      'Der aufgesetzte Kopf C hängt als Wechselgeometrie am Aktor (`actor.graft`), nicht als Requisit: der eigene Kopf der Figur ist abgeschaltet, ein Requisit wäre über die Requisiten-Ebene wegschaltbar — und die Figur stünde kopflos da. Sichtbarkeit folgt jetzt dem Aktor.',
      'Der aufgesetzte Kopf blendet sein mitgeliefertes Stirnband aus: die Figur bringt ihr eigenes mit, beide sitzen an derselben Stelle. Ein zweites Stirnband wäre Z-Fighting, kein Detail. Umgekehrt bleibt die Zigarre der FIGUR stehen, weil Kopf C keine hat — das Artwork zeigt sie im Mund.',
      'Die vier schwebenden Köpfe reproduzieren das Artwork: dort hängen sie als Explosionszeichnung in Kopfhöhe neben der Figur, nicht am Boden. float-Höhen 1,60 / 1,48 / 1,28 / 0,70 gegen einen head-Bone auf 1,228.'
    ],
    open: [
      'Keine Kulisse im Pack. Das Artwork zeigt orangene Wüste und ein Waffenarsenal — beides sind Fremdassets, deshalb nicht nachgebaut.',
      'Die Schwebehöhen der Wechselköpfe sind Bildabgleich zum Artwork, keine gemessenen Werte — dieselbe Einschränkung wie bei den Clown-Ballons.',
      'Kein Kopf-Wechsel als BEWEGUNG: die Figur zeigt den Tausch als Aufstellung, nicht als Animation. Ein Abnehmen/Aufsetzen wäre eine Reveal-Sequenz wie beim Toy Soldier und ist nicht gebaut.',      'Idle_A ist eine neutrale Standhaltung. Das Artwork zeigt die Figur mit geschultertem Gewehr in Pose — ohne das Waffenpack nicht reproduzierbar, und die Bibliothek hat keinen passenden Halte-Clip für eine Waffe, die nicht da ist.',
      'Ob die vierte Kachel überhaupt gezeigt werden soll, ist eine Town-Entscheidung: der Pack liefert sie mit, benutzt sie aber nicht. Der Atlas führt sie, weil sie belegt vorhanden ist — nicht weil sie vorgesehen wäre.'
    ]
  },
  {
    residentId: 'marksman',
    name: 'The Marksman',
    display: 'Marksman · Ghillie, Netz & Scharfschützengewehr',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 10 · 10 - April 2026 - Marksman',
    townRole: 'Aufklärungs-Resident · Tarnung, Beobachtung, Distanz',
    habitatIntent: 'Keine Kulisse im Pack — die Promo stellt Nadelwald, der Atlas zeigt die Modulstufen',
    activity: 'Links kriechend mit umwickeltem Gewehr, daneben ohne Laub mit blankem Gewehr, dann nur Kapuze, rechts die Schneepalette — die Modulstufen der Tarnung nebeneinander',
    relationships: [
      'Zweiter Resident, dessen Varianten SICHTBARKEIT sind statt Geometrie oder Textur — nach der Action Figure',
      'Waffen-Nachbar von Toy Soldier und Ultra Turbo Hero Man: dritte Schusswaffe mit Langachse auf lokal +Z'
    ],
    reference: { src: 'uploads/pasted-1789683023199-0.png', label: 'KayKit Monthly Mystery · Series 6 · Character 10 · The Marksman · contents (April 2026)', promoBackground: 0x2f3a33 },
    keyArt: { dir: [0.3, 0.3, 1], pad: 1.1 },
    actor: {
      id: 'marksman', role: 'resident · volle Tarnung, kriechend', a: MM + 'Marksman.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-3.6, 1.0], r: 28,
      /* Georg-Befund: die Scharfschützenhaltung der Promo ist eine KRIECHPOSE, keine Hocke.
         Gegen den Clip gemessen statt gegen den Namen — `Crawling` über elf Phasen abgetastet:
         posierte Figurenhöhe 1,64–1,68 gegen 2,17 im Stand, also wirklich am Boden. Phase 0,32
         ist die beste des Zyklus: Lauf 0,75 nach vorn, waagerecht 0,09, freie Hand 0,21 von der
         Waffe, und Gewehrunterkante -0,12 gegen Figurunterkante -0,09 — die Waffe liegt drei
         Zentimeter tiefer als die Figur, also AUF dem Boden statt darin. Bei Phase 0,21 wäre die
         freie Hand näher (0,15), das Gewehr aber 0,15 unter der Figur: nach dem Aufsetzen
         schwebte die Figur. Der Kompromiss ist gerechnet, nicht gewählt. */
      pose: /^Crawling$/, poseFreeze: true, poseTime: 0.32,
      texture: MM + 'marksman_texture.png + marksman_foliage_texture.png + marksman_face_net_texture.png (alle drei im .glb eingebettet)'
    },
    habitat: [],
    signatureProps: [
      /* Zuordnung und Rollwinkel: siehe Kopf dieser Datei, Abschnitt „vierte Klasse“.
         Lauf(+Z) auf Slot-vorn(+Y), Roll 90 gerechnet — in vier Posen gegengeprüft. */
      { id: 'rifle', slot: 1, role: 'Identität / Scharfschützengewehr mit Ghillie-Wrap', a: MM + 'gltf/Marksman_Rifle.gltf',
        hand: { of: 'marksman', bone: 'handslot.r', slotAxis: { from: [0, 0, 1], to: [0, 1, 0] }, slotRoll: 90 } },
      { id: 'marksman_open', slot: 4, role: 'Sozial / zweite Modulstufe — Laub ab, Netz und Nachtsicht drauf', a: MM + 'Marksman.glb',
        rig: 'Rig_Medium', p: [-0.8, 0.0], r: -30,
        hide: [/GhillieSuit$/],
        pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.2 },
      /* Dieselbe Datei, dieselbe Zuordnung — nur der Wickel ist ausgeblendet. Das ist der
         „GHILLIE WRAP REMOVABLE“-Hinweis des contents-Blatts als Messung: der Wickel ist ein
         KIND-Knoten des Gewehrs (Marksman_Rifle_Ghilliewrap_1/_2, 832 + 54 Vertices), nicht
         eine zweite Datei. */
      { id: 'rifle_clean', slot: 2, role: 'Aktivität / dasselbe Gewehr ohne Wickel', a: MM + 'gltf/Marksman_Rifle.gltf',
        hide: [/Ghilliewrap/],
        hand: { of: 'marksman_open', bone: 'handslot.r', slotAxis: { from: [0, 0, 1], to: [0, 1, 0] }, slotRoll: 90 } },
      { id: 'marksman_hood', slot: 5, role: 'Lore / dritte Modulstufe — nur Kapuze, der modulare Kopf blank', a: MM + 'Marksman.glb',
        rig: 'Rig_Medium', p: [1.9, 0.5], r: -12,
        hide: [/GhillieSuit$/, /FaceNet$/, /Nightvision/],
        pose: /^Idle_B$/, poseFreeze: true, poseTime: 0.55 },
      /* FARBVARIANTE OHNE ZWEITE DATEI — gemessen, nicht gehofft. Der Körperatlas ist 1024²,
         gesampelt wird nur v 0,039–0,497; die obere Hälfte ist vollflächig belegt und in sechs
         von sechs Stichproben achromatisch, wo die genutzte Hälfte farbig ist (107,102,67 gegen
         210,210,209 · 134,97,77 gegen 165,165,164 · 84,160,60 gegen 165,165,164). Das ist die
         Schneevariante der Promo, im selben Blatt gestapelt. dv = +0,5 holt sie hervor.
         WARUM auf der Kapuzenstufe: Laub und Netz haben KEINE zweite Palette (freies Viertel der
         1024×336-Laubtextur ist zu 0,00 opak, also nur Transparenz). Auf der vollen Tarnung gebe
         es eine weiße Figur mit grünem Laub; die Stufe ohne Laub und Netz benutzt nur das
         Material `marksman` und ist damit die einzige, auf der die Variante VOLLSTÄNDIG ist. */
      { id: 'marksman_snow', role: 'promo-extra · Schneevariante aus der zweiten Palette desselben Atlas', a: MM + 'Marksman.glb',
        rig: 'Rig_Medium', p: [4.3, 0.9], r: -30,
        hide: [/GhillieSuit$/, /FaceNet$/, /Nightvision/],
        paletteShift: { marksman: [0, 0.5] },
        pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.7 },
      { id: 'rifle_ground', slot: 6, role: 'Eigenheit / drittes Gewehr abgelegt — Maßstabsvergleich', a: MM + 'gltf/Marksman_Rifle.gltf',
        p: [0.6, 3.0], r: 84 }
    ],
    notes: [
      'Der Pack hat genau ZWEI Modelle: Marksman.glb und Marksman_Rifle.gltf — und drei Texturen (marksman_texture, marksman_foliage_texture, marksman_face_net_texture), alle drei im .glb eingebettet. Über Inhaltssuche gezählt, nicht über eine Dateiliste: `github_get_tree` filtert .gltf/.bin weg (S28-Lehre, Mixed Bag 1).',
      'Gemessen: Figur 1,943 × 2,219 × 1,390 (Rig_Medium, 23 Bones — normale Größenklasse). Gewehr 0,495 × 1,035 × 2,271, Langachse lokal +Z, Pivot 0,585 hinter dem Griff und 1,686 davor. DAS GEWEHR IST LÄNGER ALS DIE FIGUR HOCH — 2,271 gegen 2,219, Faktor 1,02. Nicht skaliert; dieselbe Regel wie beim Käseblock: der Maßstab gehört zum Pack, nicht zu meiner Deko.',
      'DIE MODULSTUFEN SIND SICHTBARKEIT, nicht Geometrie und nicht Textur. Die Figur trägt zehn Geschwister-Meshes in EINER Datei: Body, Head, ArmLeft/Right, LegLeft/Right plus Body_GhillieSuit (396 Vertices), Head_GhillieSuit (36), FaceNet (42) und NightvisionGoggles (564). „HEAD IS MODULAR“ vom contents-Blatt heißt deshalb `hide`, nicht ein zweites Kopfmodell — anders als bei der Action Figure, die vier echte Kopf-DATEIEN mitbringt. Zweiter Fall derselben Pack-Systematik, zweite Ausprägung.',
      'Die drei Stufen gemessen an der Silhouette: volle Tarnung 1,943 × 2,219 × 1,390 → ohne Laub unverändert (Laub liegt innerhalb der Nachtsicht-Tiefe) → nur Kapuze 1,943 × 2,219 × 1,292. Der Tiefenunterschied von 0,098 ist genau das Nachtsichtgerät, das 0,767 nach vorn ragt. Dass „ohne Laub“ die Box NICHT ändert, ist der Beleg, dass das Laub eng am Körper liegt und nicht absteht.',
      'Das Laub läuft auf einem eigenen Material mit alphaTest 0,5 (marksman_ghillie) — Maskierung, keine Transparenz-Sortierung. Deshalb kostet das Ausblenden keine Render-Reihenfolge und die Stufen sind frei schaltbar.',
      'DAS GEWEHR HAT DEN WICKEL ALS KIND-KNOTEN: Marksman_Rifle (2929 Vertices) ist der Elternknoten, Marksman_Rifle_Ghilliewrap_1 (832, Doppelmaterial Metall + Laub) und _2 (54) hängen darunter. Ein `hide` auf /Ghilliewrap/ liefert damit die blanke Waffe aus derselben Datei — die zwei Gewehre auf dem contents-Blatt sind ein Modell in zwei Sichtbarkeiten.',
      'ZWEI ZAHLEN, die die Zuordnung tragen (Belege im Kopf dieser Datei): Vorwärtsanteil der Laufrichtung 0,965 statt -0,263 unter Identität, Visier-Oben-Anteil 1,000 bei Roll 90. Und die Gegenprobe über vier Posen, die eine feste lokale Drehung von einem Posenzufall unterscheidet.',
      'NEBENBEFUND, der den Toy Soldier betrifft: dieselbe Messung deckt auf, dass sein Gewehr seit S18 auf reiner Identität hängt und damit QUER zeigt (Vorwärtsanteil -0,118 in Idle_B). Es hat dieselbe +Z-Langachse. Korrigiert mit derselben Zuordnung und Roll 105 (gerechnet, y-Anteil 0,995). Der Atlas hat den Defekt drei Sprints lang nicht gesehen, weil der Prüfsatz nie nach der LAUFRICHTUNG gefragt hat — vierter Fall derselben Klasse „Prüfsatz mit Loch“.',
      'Geduckt oder kriechend — gegen den CLIP entschieden, nicht gegen den Namen. Georgs Hinweis auf die Promo war richtig: `MovementAdvanced/Crawling` über elf Phasen abgetastet gibt posierte Figurenhöhen von 1,64–1,68 gegen 2,17 im Stand (über `applyBoneTransform` gerechnet, nicht über Box3). `Crouching` kommt nur auf 1,99–2,04 — es ist ein Hock-Gehzyklus, keine Bodenhaltung. Gebaut ist Crawling bei Phase 0,32.',
      'IN DER KRIECHPOSE KIPPT DAS VISIER — und das ist kein Fehler, sondern die Folge einer festen Kopplung. Senkrechter Anteil des Visiers 0,49 statt 1,000 im Stand, weil der Clip das Handgelenk dreht und die Waffe rigide mitgeht. Der Rollwinkel bleibt bei 90°: eine Anpassung pro Pose wäre genau der Posenzufall, gegen den die Vier-Posen-Gegenprobe gebaut wurde. Wer das Visier in der Kriechpose senkrecht will, braucht einen Handgelenk-Eingriff, keine andere Zuordnung.',
      'S33b · WIDERRUF DER EIGENEN FARB-AUSSAGE. Ich hatte geschrieben: „der Pack liefert genau EINE Körpertextur, die drei Farbvarianten der Promo gibt es im Repo nicht“. Der Dateibefund war richtig, der Schluss falsch — ich hatte DATEIEN gezählt, statt den ATLAS zu messen. Der 1024²-Körperatlas wird von allen Meshes nur in v 0,039–0,497 gesampelt; die obere Hälfte ist vollflächig belegt (65536 von 65536 abgetasteten Pixeln opak) und in sechs von sechs Stichproben achromatisch, wo die genutzte Hälfte farbig ist (107,102,67 gegen 210,210,209 · 134,97,77 gegen 165,165,164 · 84,160,60 gegen 165,165,164). Zwei Paletten in einem Blatt — wie die Gesichter der Action Figure, nur gestapelt statt gekachelt.',
      'Die Schneevariante steht auf der KAPUZENSTUFE, nicht auf der vollen Tarnung: die Laubtextur (1024×336) hat in ihrem ungenutzten Viertel keine zweite Palette, sondern nur Transparenz (Anteil opak 0,00), und das Gesichtsnetz (512²) hat überhaupt keinen freien Bereich. Auf der vollen Tarnung gäbe die Variante eine weiße Figur mit grünem Laub. Der neue Mechanismus `paletteShift` nimmt den Versatz deshalb PRO MATERIALNAME — ein blindes dv über alle Blätter würde das Laub unsichtbar machen statt weiß.',
      'AM GEBAUTEN KNOTEN NACHGEMESSEN, nicht am Testaufbau: Gewehr ↔ Hand-Bone 0,037 (umwickelt) und 0,039 (blank) — beide innerhalb des Faustradius 0,269, also in der Faust. Durchdringungstest: 0 von 637 bzw. 0 von 489 Gewehrpunkten liegen im Wirtskörper.'
    ],
    open: [
      'KEINE LIEGENDE SCHIESSHALTUNG — gemessen, nicht vermutet. Die Bibliothek hat Lie_Down, Lie_Idle, Lie_StandUp, Crawling, Crouching; für Lie_Idle sind alle 20 Kombinationen aus fünf Achsen-Zuordnungen und vier Rollwinkeln durchgerechnet, und in JEDER steckt das Gewehr im Boden (Unterkante -0,125 bis -1,432). Grund: Lie_Idle ist eine Ruhepose auf dem Rücken, keine Bauchlage. `Crawling` ist der nächstliegende Ersatz und jetzt gebaut (Figurhöhe 1,66, Gewehr auf dem Boden) — aber es bleibt ein Kriechzyklus: kein Anschlag, keine Wange am Schaft, das Visier gekippt.',
      'KEIN SCHUSS-, ZIEL- ODER NACHLADE-CLIP. Über alle 119 geteilten Clips gegen rifle/gun/shoot/aim/snipe/scope/prone/reload geprüft: Treffer sind Crawling, Crouching, Running_HoldingBow, Running_HoldingRifle, Lie_Down/Idle/StandUp. Kein Anschlag, keine Wange am Schaft. Dritter Resident mit dieser Lücke (Armbrust, Blaster, Gewehr) — die Frage gehört ins Animation Lab.',
      'ZWEITE HAND NICHT AN DER WAFFE. Ein Scharfschützengewehr ist zweihändig; in der Kriechpose liegt die freie Hand 0,21 von der nächsten Gewehr-Oberfläche (im Stand 0,69). Eine CCD-Nachführung wäre möglich (`pull`), ist aber bewusst nicht gesetzt: beim Cleric hat genau das einen verdrehten Arm erzeugt, der sein Ziel um 0,334 verfehlte. Erst wenn ein Ziel erreichbar ist, wird nachgeführt.',
      'DIE DRITTE FARBVARIANTE DER REFERENZ FEHLT WEITER. Belegt sind ZWEI Paletten im Körperatlas (farbig genutzt, achromatisch frei) — die Promo zeigt drei (Wald, Wüste, Schnee). Die Wüstenpalette liegt in keinem der drei Blätter. Und die Schneevariante ist nur auf der Kapuzenstufe vollständig: für Laub und Netz gibt es keine zweite Palette.',
      'Keine Kulisse im Pack. Die Promo steht in einem Nadelwald; Bäume gibt es nur in Fremdpacks (Kit Lab · Forest). Ein Ghillie-Träger ohne Deckung ist inhaltlich schief — ob der Atlas dafür fremde Kulisse holt, ist eine Town-Entscheidung, keine Messung.',
      'DAS GEWEHR DER KRIECHPOSE LIEGT 0,038 UNTER GRUND. Die Figur selbst steht exakt auf 0,000 (posiert gemessen, nicht über Box3); in dieser Phase ist die Waffe der tiefste Punkt der Gruppe. Die Figur anzuheben würde sie schweben lassen — 4 cm Waffe im Boden ist die kleinere der beiden Abweichungen und steht hier, statt weggerechnet zu werden.',
      'Die vier Figuren stehen nach Bildabgleich, nicht nach gemessener Staffelung — dieselbe Einschränkung wie bei der Clown-Inszenierung.'
    ]
  },
  {
    residentId: 'hoarder',
    name: 'The Hoarder',
    display: 'Hoarder · Rucksack, Klinge & zwei Paletten',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 8 · 8 - February 2026 - Hoarder',
    townRole: 'Sammler-Resident · trägt alles mit sich, in zwei Ausführungen',
    habitatIntent: 'Keine Kulisse im Pack — die Promo teilt das Bild in Blau und Orange und stellt die zwei Farbvarianten gegenüber',
    activity: 'Links die erste Palette mit aufgesetztem Rucksack und verstauter Klinge, rechts die zweite mit gezogener Klinge und abgestelltem Rucksack — die Aufstellung der Pack-Promo',
    relationships: [
      'Dritter Resident mit einer echten Textur-FARBVARIANTE (zwei Dateien) nach Cleric und Hero Man',
      'Dritter Resident, dessen Ausrüstung als Geschwister-Meshes zuschaltbar ist — nach Action Figure (Köpfe als Dateien) und Marksman (Tarnstufen als Sichtbarkeit)'
    ],
    reference: { src: 'uploads/pasted-1789685292284-0.png', label: 'KayKit Monthly Mystery · Series 6 · Character 8 · The Hoarder (Promo, Februar 2026)', promoBackground: 0x3f6f9c },
    keyArt: { dir: [0.26, 0.28, 1], pad: 1.12 },
    actor: {
      id: 'hoarder', role: 'resident · erste Palette, Rucksack auf dem Rücken', a: HD + 'Hoarder.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.6, 0.4], r: 22,
      pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.25,
      texture: HD + 'hoarder_texture.png (im .glb eingebettet) + hoarder_texture_B.png (zweite Palette, nicht verdrahtet)'
    },
    habitat: [],
    signatureProps: [
      /* Langachse lokal +Y, Pivot 0,337 unter dem Griff — die Konvention, für die die
         Identitätsregel belegt ist. Keine Zuordnung, kein Rollwinkel. */
      { id: 'sword', slot: 1, role: 'Identität / gezogene Klinge', a: HD + 'gltf/Hoarder_Sword.gltf',
        hand: { of: 'hoarder_b', bone: 'handslot.r' } },
      { id: 'backpack_ground', slot: 2, role: 'Aktivität / abgestellter Rucksack', a: HD + 'gltf/Hoarder_Backpack.gltf',
        p: [3.5, -0.35], r: -34 },
      /* Zweite Palette als eigene DATEI (`skin`), nicht als Atlas-Versatz wie beim Marksman —
         dieser Pack liefert beides getrennt. Und die Ausrüstung ist Sichtbarkeit: sie zieht
         den Rucksack ab und die verstaute Klinge aus der Bauchtasche, weil sie sie in der
         Hand hält. Beides sind Geschwister-Meshes derselben Figur. */
      { id: 'hoarder_b', slot: 4, role: 'Sozial / zweite Palette, Rucksack abgesetzt und Klinge gezogen', a: HD + 'Hoarder.glb',
        skin: HD + 'hoarder_texture_B.png',
        rig: 'Rig_Medium', p: [1.5, 0.3], r: -20,
        hide: [/^Hoarder_Backpack$/, /FrontPouch_Sword$/],
        pose: /^Idle_B$/, poseFreeze: true, poseTime: 0.6 }
    ],
    notes: [
      'Der Pack hat genau drei Modelle — Hoarder.glb, Hoarder_Sword, Hoarder_Backpack — und ZWEI Texturen: hoarder_texture.png und hoarder_texture_B.png, beide 1024². Über Inhaltssuche gezählt, nicht über eine Dateiliste.',
      'Gemessen: Figur 1,943 × 2,416 × 1,860 (Rig_Medium, 23 Bones). Die Tiefe ist der Rucksack: z reicht von -1,272 bis 0,588, also 1,27 nach HINTEN — kein anderer Resident im Cast trägt so weit auf.',
      'DREIZEHN Geschwister-Meshes in einer Datei, und sie sind eine Ausrüstungsliste: Body, Head, ArmLeft/Right, LegLeft/Right plus Backpack (9633 Vertices — das größte Einzel-Mesh im ganzen Cast), CollarArmor, FaceMask, FrontPouch, FrontPouch_Sword, HipPouch_Left, HipPouch_Right. Dritter Fall der KayKit-Systematik nach Action Figure und Marksman, und der reichste: hier ist jedes Ausrüstungsstück separat zuschaltbar.',
      'DIE KLINGE EXISTIERT ZWEIMAL, und das ist die Pointe des Packs: einmal als Mesh IN der Bauchtasche der Figur (`Hoarder_FrontPouch_Sword`, 608 Vertices) und einmal als eigene Datei (`Hoarder_Sword.gltf`, ebenfalls 608 Vertices — dasselbe Modell). Verstaut und gezogen sind damit dieselbe Klinge in zwei Zuständen, und die rechte Figur zeigt genau das: Bauchtaschen-Klinge ausgeblendet, Datei-Klinge in der Hand.',
      'Klinge 1,605 lang, Langachse lokal +Y, Pivot 0,337 unter dem Griff — die Konvention, für die die S18-Identitätsregel belegt ist. Reine Identität an handslot.r, keine Zuordnung nötig. Gegenprobe zum Marksman-Gewehr im selben Sprint: dort +Z und deshalb zwingend eine Zuordnung, hier +Y und deshalb nichts.',
      'Der abgestellte Rucksack (1,614 × 2,035 × 1,059, Pivot 0,736 unter der Mitte) ist als eigene Datei ein STANDOBJEKT: Pivot nicht am Boden, aber tief — der Vignetten-Bau setzt ihn über die gemessene Unterkante auf, wie jedes andere Bodenobjekt. Die Promo stellt ihn genauso neben die zweite Figur.',
      'Zwei Figuren aus einer Datei, zweite Palette per `skin` auf der Instanz getauscht (Material geklont, Farbraum und Filter von der Originalkarte übernommen). Dieselbe Mechanik wie Cleric und Hero Man — im Unterschied zum Marksman, dessen zweite Palette im selben Blatt liegt und einen UV-Versatz braucht. Ein Sprint, zwei Bauarten von Farbvariante, beide gemessen.'
    ],
    open: [
      'Keine Kulisse im Pack. Die Promo teilt das Bild diagonal in eine blaue und eine orange Hälfte mit Nadelbäumen — eine Beleuchtungsinszenierung, keine Assets. Die Atlas-Grundbeleuchtung bleibt neutral, damit Residents vergleichbar bleiben.',
      'Kein Trage-, Absetz- oder Durchsuchen-Clip. Die Bibliothek hat Holding_A/B/C und Idle, aber nichts, was einen Rucksack abnimmt — der Wechsel zwischen aufgesetzt und abgestellt ist eine Aufstellung, keine Bewegung. Gleiche Lücke wie der Kopftausch der Action Figure.',
      'Die elf Ausrüstungs-Meshes sind nicht einzeln durchgeschaltet. Gezeigt sind zwei Zustände (voll ausgerüstet, Rucksack und Klinge ab); die anderen Kombinationen sind belegt möglich, aber nicht gebaut — das wäre eine eigene Aufstellung wie die vier Köpfe der Action Figure.',
      'Die Klinge der ersten Figur bleibt verstaut. Ein zweites Schwert in die Hand zu geben wäre möglich, widerspricht aber der Promo: dort hält nur die zweite Figur eine.'
    ]
  },
  {
    residentId: 'plant-warrior',
    name: 'The Plant Warrior',
    display: 'Plant Warrior · Speer, Bogen & Lilienschild',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 5 · 5 - November 2025 - Plant Warrior',
    townRole: 'Späher-Resident · die Vorhut der Pflanzenwesen',
    habitatIntent: 'Keine Kulisse im Pack — Kay empfiehlt das Forest Nature Pack, das liegt im Kit Lab und nicht hier',
    activity: 'Links Speer und Lilienschild, Mitte der Speer zweihändig, rechts die Herbstvariante mit Bogen — die Dreiergruppe der Promo',
    relationships: [
      'Vierter Resident mit Textur-Farbvariante — hier Sommergrün gegen Herbstorange, beides gelieferte Dateien',
      'Beschwörungs-Kandidat für den Druiden-Faden; Natur-Nachbar von Witch und Lorekeeper'
    ],
    reference: { src: 'uploads/pasted-1789685835110-0.png', label: 'KayKit Monthly Mystery · Series 6 · Character 5 · The Plant Warrior · contents (November 2025)', promoBackground: 0x4d6b4a },
    keyArt: { dir: [0.28, 0.28, 1], pad: 1.12 },
    actor: {
      id: 'plant_a', role: 'resident · Sommergrün, Speer und Schild', a: PL + 'PlantWarrior.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-2.5, 0.5], r: 20,
      pose: /^Idle_B$/, poseFreeze: true, poseTime: 0.3,
      texture: PL + 'plantcreatures_texture.png (im .glb eingebettet) + plantcreatures_texture_B.png (Herbstvariante, nicht verdrahtet)'
    },
    habitat: [],
    signatureProps: [
      /* Speer: Langachse lokal +Y, Pivot 1,105 UNTER dem Griff — Identität. Siehe open[]:
         eine senkrecht aufgestützte Haltung ist auf diesem Rig nicht erreichbar. */
      { id: 'spear', slot: 1, role: 'Identität / Blütenspeer', a: PL + 'gltf/PlantWarrior_Spear.gltf',
        hand: { of: 'plant_a', bone: 'handslot.r' } },
      /* Schild: Pivot auf der Rückfläche (z -0,057–0,275), Abstand zum Hand-Bone 0,011 — die
         Faust steckt in der Scheibe. Schub entlang der gemessenen Normale [0,995 / 0,063 /
         0,075], Betrag wie beim Cleric (0,16–0,18 für eine Medium-Hand). Kein Neudrehen. */
      { id: 'shield', slot: 2, role: 'Aktivität / Lilienblatt-Schild', a: PL + 'gltf/PlantWarrior_Shield.gltf',
        hand: { of: 'plant_a', bone: 'handslot.l', push: 0.18 } },
      { id: 'plant_guard', slot: 4, role: 'Sozial / zweiter Späher, Speer zweihändig', a: PL + 'PlantWarrior.glb',
        rig: 'Rig_Medium', p: [0.1, 0.1], r: -8,
        pose: /^Melee_2H_Idle$/, poseFreeze: true, poseTime: 0.3 },
      { id: 'spear_guard', role: 'promo-extra · zweiter Speer, zweihändig geführt', a: PL + 'gltf/PlantWarrior_Spear.gltf',
        hand: { of: 'plant_guard', bone: 'handslot.r' } },
      /* HERBSTVARIANTE — zweite gelieferte Textur, `skin` auf der Instanz. Anders als beim
         Marksman, dessen zweite Palette im selben Blatt liegt: hier sind es zwei Dateien. */
      { id: 'plant_fall', slot: 5, role: 'Lore / Herbstvariante mit Bogen', a: PL + 'PlantWarrior.glb',
        skin: PL + 'plantcreatures_texture_B.png',
        rig: 'Rig_Medium', p: [2.6, 0.45], r: -24,
        pose: /^Running_HoldingBow$/, poseFreeze: true, poseTime: 0.3 },
      /* BOGEN · S35, ZWEIMAL KORRIGIERT. (1) Erste Fassung Z→Slot-vorn an der RECHTEN Hand:
         quer vor den Beinen, falsch. (2) Zweite Fassung [1,1,1] an der linken: 48° Neigung —
         auch falsch, weil ich das Ziel aus dem losen Bogen-Render abgelesen hatte statt aus der
         GEHALTENEN Figur. Georgs Blick auf das contents-Blatt: der Bogen liegt WAAGERECHT quer
         vor dem Körper, gehalten in der linken Hand, die rechte an der Sehne.
         Aus den 270 gemessenen Kombinationen auf dieses Ziel neu sortiert — ohne neue Messung,
         nur mit einer korrigierten Zielgröße. Sieger: `Running_HoldingBow`, handslot.l,
         to [1,1,0]: Neigung 0,158 (9° aus der Waagerechten), Bogenhand 0,040, ZIEH-HAND 0,088
         (die Rechte liegt an der Sehne), Kopf 0,519, Unterkante +0,397. Gewinnt gegen die
         Gegenrichtung [-1,-1,0] in jeder Größe außer der Ebenenlage. */
      { id: 'bow', slot: 6, role: 'Eigenheit / bespannter Bogen in der Bogenhand', a: PL + 'gltf/PlantWarrior_Bow_withString.gltf',
        hand: { of: 'plant_fall', bone: 'handslot.l', slotAxis: { from: [0, 0, 1], to: [1, 1, 0] } } },
      /* PFEIL · gleicher Raster wie der Bogen, drittes Ziel. Identität stellte ihn senkrecht und
         0,087 UNTER Grund. Erste Wahl [1,-1,0] war nur halb richtig: waagerecht und in der Faust,
         aber 16° zum Bogen — also fast parallel, während ein aufgelegter Pfeil quer liegt. Meine
         Rangfolge hatte den WINKEL ZUM BOGEN gar nicht gemessen; nachgerechnet gegen die gebaute
         Bogenrichtung ist [-1,-1,-1] die beste in der Faust: 74° zum Bogen, Neigung 0,201 (12°
         aus der Waagerechten), Abstand zur Hand 0,188 (Faustradius 0,269), Unterkante +0,606.
         Die streng senkrechten Gitterrichtungen liegen 0,290 von der Hand, also daneben. */
      { id: 'arrow', slot: 3, role: 'Zuhause / Blütenpfeil in der Zieh-Hand', a: PL + 'gltf/PlantWarrior_Arrow.gltf',
        hand: { of: 'plant_fall', bone: 'handslot.r', slotAxis: { from: [0, 0, 1], to: [-1, -1, -1] } } },
      { id: 'bow_relaxed', role: 'promo-extra · unbespannter Bogen, abgelegt', a: PL + 'gltf/PlantWarrior_Bow.gltf',
        p: [1.3, 2.3], r: 76 },
      { id: 'arrow_ground', role: 'promo-extra · zweiter Blütenpfeil, abgelegt', a: PL + 'gltf/PlantWarrior_Arrow.gltf',
        p: [-0.9, 2.5], r: 62 }
    ],
    notes: [
      'Der Pack hat sechs Modelle — PlantWarrior.glb plus Spear, Bow, Bow_withString, Shield, Arrow — und ZWEI Texturen: plantcreatures_texture.png und _B.png (Herbst). Beide 1024². Der Dateiname sagt übrigens `plantcreatures`, nicht `plantwarrior`: der Pack ist als Familie angelegt, die Figur ist nur ihr Krieger.',
      'Gemessen: Figur 1,944 × 2,570 × 1,153 (Rig_Medium, 23 Bones). SIEBEN Meshes und kein einziges Wechselteil — ArmLeft/Right, Body, Cloak, Head (2509 Vertices, die Blattkapuze), LegLeft/Right. Nach Action Figure, Marksman und Hoarder ist das der Gegenfall: nicht jeder Series-6-Pack ist modular.',
      'ZWEI BESPANNUNGSZUSTÄNDE als eigene Dateien: Bow 0,582 × 0,241 × 2,082, Bow_withString 1,628 × 0,241 × 2,445. Die Differenz ist die gespannte Sehne — x wächst von 0,582 auf 1,628, weil die Sehne nach hinten ausbeult. Gebaut ist der bespannte in der Hand, der unbespannte abgelegt.',
      'BOGEN-PIVOT MITTIG, und das ist die Aussage: -1,041 bis +1,041 auf der Langachse. Nach der Pivot-Regel (Boden = Standobjekt, Griff = Handrequisit, mittig = schwebendes Artefakt) ist ein Bogen der Sonderfall, bei dem „mittig“ trotzdem Griff heißt — weil ein Bogen in der Mitte gehalten wird. Die Regel unterscheidet Rolle, nicht Griffpunkt.',
      'Speer 2,583 lang, Langachse lokal +Y, Pivot 1,105 unter dem Griff und 1,479 darüber — also mittig-unten gegriffen, wie eine Lanze. Identität an handslot.r. In `Melee_2H_Idle` liegt die freie Hand 0,098 vom Schaft: der Speer ist dort wirklich zweihändig geführt, ohne jede Nachführung.',
      'Schild 0,991 × 0,975 × 0,331, Pivot auf der Rückfläche — dieselbe Regel wie bei Black Knight (0,55), Cleric (0,16) und Skeleton Warrior (0,18): `push` entlang der gemessenen Normale, kein Neudrehen. Hier 0,18. Die Normale ist [0,995 / 0,063 / 0,075], also aus dem Arm heraus nach außen.',
      'BOGEN-ZUORDNUNG · S35, ZWEIMAL KORRIGIERT, und der zweite Fehler ist der lehrreichere. (1) Z→Slot-vorn an der rechten Hand ergab 24° und hing quer vor den Beinen — Ursache: mein Prüfraster kannte nur die sechs HAUPTACHSEN als Zuordnungsziel, und ich habe unter denen die am wenigsten schlechte genommen. `slotAxis.to` darf jede Richtung sein. (2) Nach der Neumessung über 270 Kombinationen (fünf Posen × zwei Hände × Identität + 26 Gitterrichtungen) habe ich auf 48° Neigung optimiert — weil ich das Ziel am LOSEN Bogen-Render abgelesen hatte, der senkrecht daneben liegt, statt an der gehaltenen Figur. Georgs Hinweis: die Figur hält ihn WAAGERECHT quer, links, die Rechte an der Sehne. Dieselben 270 Messungen mit der richtigen Zielgröße neu sortiert — ohne eine einzige neue Messung: handslot.l, to [1,1,0], Neigung 0,158, Bogenhand 0,040, Zieh-Hand 0,088, Kopf 0,519, Unterkante +0,397. Lehre: ein Optimierer ist nur so gut wie seine Zielgröße, und die kommt aus der Vorlage — aus der richtigen Stelle der Vorlage.',
      'ES GIBT GENAU EINEN BOGEN-CLIP in der ganzen Bibliothek — `MovementAdvanced/Running_HoldingBow`. Gegen bow/arrow/aim/shoot/draw/archer/quiver über alle 119 Clips geprüft. Jede Bogenhaltung des Atlas steht deshalb auf diesem einen Clip.'
    ],
    open: [
      'EINE AUFGESTÜTZTE SPEERHALTUNG IST AUF DIESEM RIG NICHT ERREICHBAR — gerechnet, nicht probiert. Der Pivot sitzt 1,105 unter dem Griff, der höchste Handslot der geprüften Posen steht auf 0,85: das Speerende liegt damit immer unter dem Boden. Beste senkrechte Kombination (`Holding_B` + Y→Slot-oben) erreicht Anteil 0,931 und kostet 0,28 Durchstich. Gebaut sind deshalb die Diagonalen ohne Durchstich. Die Vorlage zeigt die Figur aufgestützt — das braucht einen Clip mit höherer Hand, keine andere Zuordnung.',
      'KEIN SCHUSS- UND KEIN SPANN-CLIP. `Running_HoldingBow` ist ein Laufzyklus mit Bogen, kein Anschlag; der Pfeil wird nicht auf die Sehne gelegt. Vierter Resident mit dieser Lücke nach Armbrust, Blaster und Gewehr.',
      'Der Pfeil liegt in der Zieh-Hand, aber NICHT auf der Sehne: 74° zum Bogen statt 90°. Die streng senkrechten Gitterrichtungen liegen 0,290 von der Hand — außerhalb des Faustradius 0,269. Eine Dreierbeziehung Hand–Pfeil–Sehne braucht eine Nachführung, und die wird erst gesetzt, wenn ihr Ziel erreichbar ist (S29). Ein zweiter Pfeil liegt am Boden.',
      'Keine Kulisse im Pack. Kay verweist ausdrücklich auf das Forest Nature Pack — das liegt im Kit Lab, nicht in diesem Projekt. Ob der Atlas Fremdkulisse holt, ist eine Town-Entscheidung.',
      'Die Dreiergruppe steht nach Bildabgleich. Zwei Figuren tragen dieselbe Palette, weil der Pack nur zwei liefert — die Promo zeigt drei Figuren in einer.'
    ]
  },
  {
    residentId: 'gtn',
    name: '4GTN',
    display: '4GTN · Spähroboter, blank & vergessen',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 6 · Character 7 · 7 - January 2026 - 4GTN',
    townRole: 'Späh-Resident · Vorausgeschickt, sammelt Daten, geht dann schlafen',
    habitatIntent: 'Keine Kulisse im Pack — die Promo teilt Schneeplanet gegen Waldbiom',
    activity: 'Links die frische Einheit mit Katana in Wachstellung, rechts die vergessene, vom Biom überwachsene — die beiden Hälften der Promo',
    relationships: [
      'Erster Resident, dessen zwei Varianten ZWEI MODELLE sind — nicht Textur, nicht Sichtbarkeit',
      'Vierter Rig_Large-Bewohner nach Black Knight, Demon Lord, Orc Brute und Monstrosity'
    ],
    reference: { src: 'uploads/pasted-1789685793551-0.png', label: 'KayKit Monthly Mystery · Series 6 · Character 7 · 4GTN (Promo, Januar 2026)', promoBackground: 0x6d7a52 },
    keyArt: { dir: [0.24, 0.26, 1], pad: 1.1 },
    actor: {
      id: 'gtn', role: 'resident · frische Einheit', a: GN + '4GTN.glb',
      rigFamily: 'Rig_Large', rig: 'Rig_Large', p: [-3.4, 0.6], r: 18,
      pose: /^Melee_2H_Idle$/, poseFreeze: true, poseTime: 0.3,
      texture: GN + '4GTN_texture.png (im .glb eingebettet, von beiden Modellen geteilt)'
    },
    habitat: [],
    signatureProps: [
      /* Katana: 0,4 × 4,252 × 0,265, Langachse lokal +Y, Pivot 0,683 unter dem Griff — die
         Konvention, für die Identität belegt ist. Gemessen an Rig_Large/Melee_2H_Idle:
         Langachse [0,728 / 0,492 / 0,477], Hand 0,172, zweite Hand 0,375, Boden 0,987. */
      { id: 'katana', slot: 1, role: 'Identität / Leucht-Katana', a: GN + 'gltf/4GTN_Katana.gltf',
        hand: { of: 'gtn', bone: 'handslot.r' } },
      { id: 'gtn_forgotten', slot: 4, role: 'Sozial / die vergessene Einheit, vom Biom überwachsen', a: GN + '4GTN_Forgotten.glb',
        rig: 'Rig_Large', p: [3.6, 0.5], r: -16,
        pose: /^Idle_B$/, poseFreeze: true, poseTime: 0.4 },
      { id: 'katana_ground', slot: 5, role: 'Lore / zweites Katana, abgelegt', a: GN + 'gltf/4GTN_Katana.gltf',
        p: [0.3, 2.6], rx: -90, r: 22 }
    ],
    notes: [
      'ZWEI MODELLE, eine Textur: 4GTN.glb (896 KB) und 4GTN_Forgotten.glb (1,21 MB), beide auf `4GTN_texture.png`. Der Dateiname ist aus dem Promo-Text erraten („some have been long forgotten“) und dann GEPRÜFT — vier andere Kandidatennamen (Dormant, Overgrown, Nature, Mossy) gibt es nicht. Dritte Bauart von Variante im Cast: Cleric/Hoarder/Plant Warrior haben zwei Texturdateien, der Marksman zwei Paletten in einem Blatt, der 4GTN zwei Modelle.',
      'DER UNTERSCHIED IST GEOMETRIE, gemessen: gleiche Bind-Pose-Breite und -Höhe (5,698 × 4,156), aber die Tiefe wächst von 1,425 auf 1,749 — das ist der Aufwuchs. Die Vertexzahlen steigen durchgängig (Body 4222 → 4648, ein Arm 2835 → 3896/4154), und die vergessene Einheit hat ein Mesh MEHR: `4GTN_Forgotten_Hat` mit 1701 Vertices — die Moospolster-Haube der Promo. Nichts davon ist zuschaltbar; es sind zwei gebackene Modelle.',
      'RIG_LARGE, und der Beweis ist NICHT die Bindungsquote. Rig_Medium-Clips binden 69/69 und kollabieren die Figur trotzdem: Kopf-Bone auf y=1,223, posierte Höhe 2,619, Unterkante **-0,347** — die Figur steckt im Boden. Mit Rig_Large: 52/52 gebunden, Kopf-Bone 3,086, Höhe 4,014, Unterkante +0,003. Genau der Black-Knight-Fall aus S9/S10, diesmal von Anfang an gemessen statt nach drei Korrekturrunden.',
      'Zwölf bzw. dreizehn Meshes, und jedes Bauteil kommt DOPPELT: `_1` auf dem Material `4GTN`, `_2` auf `4GTN_glow` (emissive ffffff). Die Leuchtstreifen sind also eigene Meshes mit eigenem Material, nicht eine Textur-Maske — 17 bis 88 Vertices pro Streifen. Deshalb bleiben sie in jedem Zustand gleich hell, auch auf der überwachsenen Einheit.',
      'NAMENSSCHLAMPEREI IM PACK, festgehalten weil `hide`-Muster darauf angewiesen sind: die blanke Einheit hat `4GTN_ArmLeft_1`, aber für den rechten Arm `4GTN_Right_1` (ohne „Arm“). Die vergessene hat `4GTN_Forgotten_ArmLeft_1` und `_ArmRight_1` korrekt, dort heißt dafür das linke BEIN `4GTN_Forgotten_Left_1`. Ein Regex auf `/ArmRight/` trifft im einen File nichts und im anderen alles.',
      'Katana 4,252 lang gegen 4,16 Figurenhöhe — wie beim Marksman-Gewehr ist die Waffe so lang wie die Figur hoch. Langachse +Y, Pivot 0,683 unter dem Griff: reine Identität. In `Melee_2H_Idle` liegt die zweite Hand 0,375 von der Klinge, bei einem Large-Handradius von etwa 0,54 also daran — eine zweihändige Wachstellung ohne jede Nachführung.',
      'Die vergessene Einheit steht in `Idle_B`, gemessen die tiefste der drei verfügbaren Rig_Large-Haltungen: Kopf-Bone 2,604 gegen 3,086 in Idle_A, also 0,48 tiefer. Das ist der nächste erreichbare Zustand zu „dormant“ — siehe open[].'
    ],
    open: [
      'RIG_LARGE HAT NUR 34 CLIPS, und keiner davon ist eine Ruhe- oder Schlafhaltung: Sit_Floor_Idle, Lie_Idle, Crouching und Holding_B fehlen alle (in Rig_Medium vorhanden). Die zusammengesunkene, dormante Haltung der Promo ist damit eine Clip-Lücke. `Idle_B` ist die tiefste verfügbare (0,48 unter Idle_A) und bleibt ein Stand.',
      'DER AUFWUCHS IST GEOMETRIE, NICHT DEKOR — er ist im Modell gebacken. Ein Zwischenzustand (halb überwachsen) ist deshalb nicht baubar, und das Moos lässt sich nicht abschalten. Wer eine Verfallsstufe braucht, braucht ein drittes Modell.',
      'Keine Kulisse im Pack. Die Promo stellt Schneeplanet gegen Waldbiom, beides mit Fremdassets (Nadelbäume, Felsen). Die Atlas-Grundbeleuchtung bleibt neutral.',
      'Kein Schwertschlag, kein Erwachen, keine Datensammel-Geste. Rig_Large kennt `Melee_2H_Idle` und zwei Idles; alles, was die Erzählung des Packs ausmacht (spähen, aufzeichnen, einschlafen), ist nicht in der Bibliothek.',
      'Die Leuchtstreifen sind emissive weiß, aber der Atlas hat kein Bloom — in der Promo glühen sie sichtbar über die Silhouette hinaus. Ein Nachbrenner-Pass wäre eine Viewer-Änderung, keine Rezept-Änderung.'
    ]
  },
  {
    residentId: 'hiker',
    name: 'The Hiker',
    display: 'Hiker · Zelt, Rucksack & zwei Fassungen',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 5 · Character 11 · 11 - May 2025 - Hiker',
    townRole: 'Wander-Resident · Ausrüstung, Lager, Feldweg',
    habitatIntent: 'Das Zelt ist die Kulisse — das einzige Pack im Cast, das seine eigene mitbringt',
    activity: 'Links die erste Fassung ohne Hut, rechts die zweite mit Kappe; Zelt und Feldflasche als Lager',
    relationships: [
      'Fünfter Resident mit Textur-Farbvariante — und der erste, dessen Pack eine echte KULISSE mitbringt',
      'Kay verweist ausdrücklich auf das Lagerfeuer des Caveman als Ergänzung — Nachbar-Resident, schon im Cast'
    ],
    reference: { src: 'uploads/pasted-1789688984135-0.png', label: 'KayKit Monthly Mystery · Series 5 · Character 11 · The Hiker (Promo, Mai 2025)', promoBackground: 0x9fc46b },
    keyArt: { dir: [0.28, 0.28, 1], pad: 1.12 },
    actor: {
      id: 'hiker_a', role: 'resident · erste Fassung, ohne Hut', a: HK + 'characters/Hiker.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-2.2, 0.8], r: 22,
      hide: [/_Hat$/],
      pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.25,
      texture: HK + 'textures/hiker_texture.png (im .glb eingebettet) + hiker_texture_b.png (zweite Fassung, nicht verdrahtet)'
    },
    habitat: [
      { id: 'tent', role: 'landmark · Zelt', a: HK + 'assets/gltf/Tent.gltf', p: [1.9, -2.2], r: -24 }
    ],
    signatureProps: [
      /* Pivot am BODEN (y von 0 bis 0,432) — nach der Pivot-Regel ein Standobjekt, kein
         Handrequisit. Steht deshalb am Zelt statt in einer Faust. */
      { id: 'bottle', slot: 2, role: 'Aktivität / Feldflasche', a: HK + 'assets/gltf/Waterbottle.gltf',
        p: [0.7, -0.9], r: 14 },
      { id: 'hiker_b', slot: 4, role: 'Sozial / zweite Fassung mit Kappe', a: HK + 'characters/Hiker.glb',
        skin: HK + 'textures/hiker_texture_b.png',
        rig: 'Rig_Medium', p: [0.6, 0.6], r: -18,
        pose: /^Holding_C$/, poseFreeze: true, poseTime: 0.3 },
      /* HIER STAND EIN SMARTPHONE UND ES IST ENTFERNT. Georgs Entscheidung, S36: das Gerät
         ist ein Merkmal der Protagonists und sonst nirgends Default. Der Hiker hatte es per
         Analogie bekommen, nicht weil der Pack oder die Promo es hergibt — die Promo zeigt
         Rucksack, Kappe und Feldflasche. Ein atlas-eigenes Objekt in eine zweite Familie zu
         tragen, nur weil der Generator schon da war, ist Geometrie-Ausbreitung ohne Vorlage.
         Die Messungen bleiben in docs/TEST_REPORT.md stehen, der Requisit nicht im Rezept. */
    ],
    notes: [
      'Der Pack hat drei Modelle — characters/Hiker.glb, assets/gltf/Tent.gltf, assets/gltf/Waterbottle.gltf — und ZWEI Texturen: hiker_texture.png und hiker_texture_b.png (kleines b, anders als die `_B`-Konvention der übrigen Packs).',
      'DAS EINZIGE PACK IM CAST MIT EIGENER KULISSE. Das Zelt ist 2,568 × 2,101 × 2,983 — größer als die Figur (2,311) und mit Pivot am Boden, also ein echtes Standobjekt. Bei allen 24 anderen Residents steht im Habitat-Feld „keine Kulisse im Pack“ oder ein Fremdpack; hier liefert Kay sie mit.',
      'Gemessen: Figur 1,943 × 2,311 × 1,438 (Rig_Medium, 23 Bones). ACHT Meshes, davon zwei modular: `Hiker_Hat` (510 Vertices) und `Hiker_Backpack` (2334). Vierter Fall der KayKit-Sichtbarkeits-Systematik nach Action Figure, Marksman und Hoarder.',
      'Die Feldflasche hat ihren Pivot am BODEN (y 0 bis 0,432) — nach der Pivot-Regel ein Standobjekt. Sie steht deshalb am Zelt und nicht in einer Faust; dieselbe Entscheidung wie beim Lorekeeper-Lesepult (S8).',
      'ZWEI CONTENTS-BLÄTTER, `contents.png` und `contents_alt.png` — eines je Textur. Der Pack dokumentiert die Fassungen also selbst als gleichwertig, nicht als Haupt- und Nebenvariante.'
    ],
    open: [
      'DIE PROMO ZEIGT DINGE, DIE DER PACK NICHT ALS EIGENE OBJEKTE LIEFERT: die linke Figur hält einen roten Rucksack in der Hand und eine weiße Kappe liegt am Boden. Beide sind Geschwister-MESHES der Figur, keine Dateien — sie lassen sich abschalten, aber nicht ablegen oder in eine Faust geben. In Kays Render sind sie in Blender abgetrennt. Nachgebaut ist deshalb die Sichtbarkeits-Variante (Hut ab / Hut auf), nicht die Ablage.',
      'Kein Wander-, Auf- oder Abbau-Clip. Das Zelt steht, die Figuren stehen daneben. Ein Aufbau wäre eine Enthüllungssequenz wie beim Toy Soldier und ist nicht gebaut.',
      'Das Lagerfeuer des Caveman ist laut Kay die naheliegende Ergänzung und liegt schon im Cast — Objekte über Resident-Grenzen zu mischen ist aber eine Town-Entscheidung, keine Messung.'
    ]
  },
  {
    residentId: 'protagonists',
    name: 'The Protagonists',
    display: 'Protagonists · zwei Hauptfiguren',
    status: 'candidate-only',
    pack: 'KayKit Mystery Series 5 · Character 10 · 10 - April 2025 - Protagonists',
    townRole: 'Spieler-Resident · die zwei Hauptfiguren der Town',
    habitatIntent: 'Keine Kulisse im Pack — das Artwork zeigt eine leere violette Studiofläche',
    activity: 'Beide mit Handy und Rucksack: sie schaut hin (Kopfneigung), er hält es im gebeugten Arm',
    relationships: [
      'Erster Resident, der ZWEI vollständige Figuren aus zwei Dateien mit EINER geteilten Textur zeigt',
      'Erster Resident mit atlas-eigener Geometrie in der Hand — das Smartphone liefert kein Pack'
    ],
    reference: { src: 'uploads/pasted-1789689478663-0.png', label: 'KayKit Monthly Mystery · Series 5 · Character 10 · The Protagonists (Promo, April 2025)', promoBackground: 0x9b86d9 },
    keyArt: { dir: [0.22, 0.26, 1], pad: 1.1 },
    actor: {
      id: 'prot_a', role: 'resident · Protagonistin, schaut aufs Handy', a: PG + 'characters/Protagonist_A.glb',
      rigFamily: 'Rig_Medium', rig: 'Rig_Medium', p: [-1.3, 0.4], r: 16,
      pose: /^Holding_B$/, poseFreeze: true, poseTime: 0.3,
      /* KOPFNEIGUNG · die Bibliothek hat keinen Clip, der auf etwas in der Hand schaut.
         Additiv auf die fertige Pose (neuer `boneTweak`), in Grad und je Bone protokolliert.
         Achsen am posierten Kopf-Bone gemessen: lokal X liegt auf Welt-X (0,991), lokal Z
         zeigt nach vorn — eine Drehung um lokal X kippt das Gesicht nach unten. */
      boneTweak: { head: [14, -6, -5] },
      texture: PG + 'textures/protagonist_texture.png (im .glb eingebettet, von beiden Figuren geteilt)'
    },
    habitat: [],
    signatureProps: [
      /* SMARTPHONE · ATLAS-EIGEN (lib/props.js). Farbe zur Figur: Pink/Petrol für sie,
         Gelb/Blau für ihn.

         DER SCHUB GING IN DIE FALSCHE RICHTUNG UND DAS WAR DER GANZE ERSTE DEFEKT.
         S35 hat „innen“ gemessen (in Holding_B zu 85 % auf +Slot-X) und dann POSITIV
         dorthin geschoben — also das Gerät 0,13 tief in eine Faust mit Radius 0,323
         hineingedrückt. Sonde 12 zählt für diesen Stand 103 WIRTPUNKTE IM GERÄTEKÖRPER,
         0,056 tief: die Hand steckt vorne durch den Bildschirm.

         Warum es der alte Prüfsatz nicht gemeldet hat, ist der eigentliche Befund:
         Sonde 10 hat den Abstand Gerät→Hand-Bone MINIMIERT und damit genau diesen Fehler
         prämiert — „0,135 zur Hand“ stand als Gütezeichen im Rezept, war aber die Tiefe
         im Fleisch. Und geprüft wurde nur, ob GERÄTEPUNKTE im Wirt liegen; bei einer
         großen flachen Platte und dünnen Fingern ist das 0, während die Finger drinstecken.
         Beide Richtungen prüft erst Sonde 12.

         AUSWÄRTS ist jetzt gemessen statt hergeleitet: vom Faustmittelpunkt durch den
         Handslot, weil der Slot auf der Faustoberfläche sitzt. Ruheschub = Faustradius
         minus Slotabstand plus 0,02 Luft = 0,323 - 0,177 + 0,02 = 0,165. */
      { id: 'phone_a', slot: 1, role: 'Identität / Smartphone (Atlas-eigen) in der linken Faust', a: GEN + 'phone-prot-a',
        gen: 'phone', genOpts: { fistRadius: 0.323, height: 1.45, width: 1.12, color: '#e0679c', screen: '#d9fbff' },
        /* Die AUSRICHTUNG war richtig und bleibt unverändert — Identität + 90° Rollwinkel,
           Bildschirm 14° von der Richtung zum Kopf. Sonde 11 hat sie über 104 Kombinationen
           erneut als Sieger bestätigt, diesmal mit Durchdringung als hartem Kriterium.
           Geändert sind nur Schubrichtung und Länge. Gemessen: 0 Gerätepunkte im Wirt,
           0 Wirtpunkte im Gerät, Kontakt 0,047 (gehalten, nicht schwebend), Unterkante
           0,570 über Grund, Langachse 0,951 hochkant. */
        hand: { of: 'prot_a', bone: 'handslot.l', push: 0.165, pushAxis: [-0.949, 0.14, -0.282],
                slotAxis: { from: [0, 1, 0], to: [0, 1, 0] }, slotRoll: 90 } },
      { id: 'prot_b', slot: 4, role: 'Sozial / zweiter Protagonist', a: PG + 'characters/Protagonist_B.glb',
        rig: 'Rig_Medium', p: [1.5, 0.3], r: -14,
        pose: /^Idle_A$/, poseFreeze: true, poseTime: 0.2,
        /* ELLBOGENBEUGUNG, und sie ist eine ABWEICHUNG VON DER PROMO mit gemessenem Grund.
           In Idle_A hängt sein Arm gestreckt: die Hand steht auf 0,631 von 2,315, also
           auf 27 % der Figurhöhe — Oberschenkelhöhe. Ein Gerät in dieser Faust reicht
           zwangsläufig bis zum Knöchel; die einzige durchdringungsfreie Lage lag 0,05 über
           Grund und las sich im Bild als "liegt neben dem Schuh". Die Zahl war sauber, die
           Pose gibt keinen Platz her. Achse nicht geraten, sondern gemessen: von den drei
           lokalen Achsen des `lowerarm.l` hebt nur x (−60° → Hand 0,619 · +60° → 0,919),
           y bewegt sie gar nicht (0,63 über den ganzen Bereich), z hebt weniger (0,71).
           Mit +60° steht die Hand auf 0,919 und die Geräteunterkante auf 0,587 — praktisch
           gleich hoch wie bei ihr (0,569), also derselbe Lesewert.
           NEBENWIRKUNG, die zu notieren ist: die Beugung staucht die Handhaut, und der
           gemessene Faustradius fällt von 0,311 auf 0,244. Das Gerät wird dadurch kleiner
           (0,317 × 0,273 statt 0,405 × 0,349) — die Größe hängt am Radius, und der Radius
           hängt an der Pose. Keine Korrektur, sondern die Kette, die so gebaut ist. */
        boneTweak: { 'lowerarm.l': [60, 0, 0] } },
      /* SEIN GERÄT HATTE BEIDE DEFEKTE GLEICHZEITIG und es ist der schlimmere Fall:
         Sonde 12 zählt für den gebauten Stand 355 Wirtpunkte im Gerät UND 43 Gerätepunkte
         im Wirt. In `Idle_A` hängt der Arm am Oberschenkel — ein 0,746 langes Gerät an
         dieser Faust liegt zwangsläufig im Bein, Unterkante 0,167 über Grund.

         HIER IST AUCH DIE AUSRICHTUNG FALSCH, nicht nur der Schub. Die gebaute Richtung
         [1,0,1] + 90° erreicht in keiner Schub-/Längenvariante 0 (bestenfalls 9 Wirtpunkte
         im Gerät). Durchdringungsfrei in BEIDEN Richtungen ist an dieser Faust genau eine:
         [-1,-1,1] ohne Rollwinkel. Dass hier eine andere Richtung gewinnt als bei ihr, ist
         derselbe Befund wie bei „innen“ — die Handgelenkdrehung der Pose entscheidet.

         Der Schub ist größer als bei ihr (0,313 statt 0,165, also 0,10 über dem Ruhewert
         0,213): die Faust liegt am Oberschenkel, und auswärts schiebt hier gleichzeitig
         aus der Faust UND vom Bein weg. Mit dem reinen Ruhewert bleiben 8 Wirtpunkte. */
      { id: 'phone_b', slot: 5, role: 'Lore / sein Smartphone (Atlas-eigen)', a: GEN + 'phone-prot-b',
        gen: 'phone', genOpts: { fistRadius: 0.244, height: 1.3, width: 1.12, color: '#f0b429', screen: '#e8f4ff' },
        /* Alles hier ist an der GEBEUGTEN Pose gemessen, nicht an der gestreckten — die
           Beugung dreht das Handgelenk mit, und damit ändert sich auch "auswärts":
           ungebeugt [-0,943, 0,309, 0,121], gebeugt [-0,947, 0,209, -0,244]. Dieselbe
           Lehre wie bei "innen" in S35: die Richtung hängt an der Pose, nicht am Rig.
           Ruheschub in dieser Pose 0,118 (Faustradius 0,244 minus Slotabstand plus Luft),
           gebaut mit 0,05 Zugabe = 0,168.
           Abnahme (Sonde 14): 0 Gerätepunkte im Wirt · 0 Wirtpunkte im Gerät · Kontakt
           0,033 · Unterkante 0,587 · Bildschirm 5° von der Richtung zum Kopf · Langachse
           0,838 hochkant. Die aufrechteste der bestandenen Lagen. */
        hand: { of: 'prot_b', bone: 'handslot.l', push: 0.168, pushAxis: [-0.947, 0.209, -0.244],
                slotAxis: { from: [0, 1, 0], to: [0, 1, 1] }, slotRoll: 90 } }
    ],
    notes: [
      'ZWEI MODELLE, EINE TEXTUR: Protagonist_A.glb (511 KB) und Protagonist_B.glb (462 KB) teilen `textures/protagonist_texture.png`. Der Farbunterschied der beiden Figuren steckt also in den UVs, nicht in zwei Paletten — vierte Bauart von „Variante“ im Cast, nach zweiter Datei (Cleric, Hoarder, Plant Warrior, Hiker), zweiter Palette im selben Blatt (Marksman) und zwei Modellen mit eigener Geometrie (4GTN).',
      'Gemessen: sie 1,943 × 2,329 × 1,843, er 1,943 × 2,315 × 1,421 (beide Rig_Medium, 23 Bones). Die 0,42 Tiefendifferenz ist ihr Haar: ihr Kopf-Mesh reicht bis z = -1,068, sein bis -0,817.',
      'IHRE BRILLE IST ZWEITEILIG und das ist der einzige Fall im ganzen Cast: `Protagonist_A_Glasses_1` (642 Vertices, Material `protagonist`) für Rahmen und Bügel, `_Glasses_2` (32 Vertices, eigenes Material `glass` OHNE Textur) für die zwei Gläser. Ein Material ohne Map in einem Pack, das sonst alles über eine Atlas-Textur löst — der Pack macht hier bewusst eine Ausnahme.',
      'Beide tragen ihren Rucksack als Geschwister-Mesh (1374 bzw. 1373 Vertices, praktisch identisch). Die zwei frei stehenden Rucksäcke der Promo sind in Blender abgetrennte Kopien, keine eigenen Dateien — siehe open[].',
      'DAS SMARTPHONE IST ATLAS-EIGEN, nicht KayKit. Kein Pack im Repo liefert eines (über die Serien gesucht). Neues Modul `lib/props.js`, eigener Pfad-Namensraum `atlas://generated/`, und es wird genauso gemessen wie ein geladenes Asset — dieselbe Tabelle, dieselben Prüfungen. Größe abgeleitet aus dem gemessenen FAUSTRADIUS der jeweiligen Figur und Pose (0,311 bei ihm/Idle_A, 0,323 bei ihr/Holding_B, an der GEPOSTEN Haut gemessen). Verhältnisse jetzt 1,12 : 1,45 : 0,22 vom Radius statt 1,25 : 2,40 : 0,22 — siehe open[], die Länge ist nicht mehr gewählt, sondern durch die Durchdringungsmessung gedeckelt.',
      'DER FAUST-INNENPUNKT IST GEMESSEN, nicht geraten. Verfahren: alle Skinning-Weltpunkte, die näher am `hand.l`-Bone liegen als am Ellbogen und innerhalb 0,34 — daraus Mittelpunkt und Radius. Der Handslot sitzt 0,119 bis 0,177 vom Faustmittelpunkt, also auf der Faustoberfläche. DIE KONSEQUENZ DARAUS WAR IN S35 FALSCH GEZOGEN: aus „innen ist gemessen“ wurde ein POSITIVER Schub nach innen, also das Gerät in die Faust hinein. Richtig ist das Gegenteil — der Slot liegt auf der Oberfläche, gehalten wird AUSSERHALB. Auswärts ist damit selbst eine Messung: vom Faustmittelpunkt durch den Slot, bei ihr [-0,949, 0,14, -0,282], bei ihm [-0,943, 0,309, 0,121] in Slot-Achsen. Beide liegen fast ganz auf -Slot-X.',
      'DER PRÜFSATZ WAR ASYMMETRISCH UND DAS IST DER LEHRSATZ DIESER RUNDE. Sonde 11 hat gezählt, wie viele GERÄTEPUNKTE im Wirt liegen — für ihre Hand kam 0 heraus, obwohl im Bild die Faust vorne durch den Bildschirm sticht. Eine große flache Platte und dünne Finger ergeben genau diesen Befund: die Platte bleibt außen, die Finger stecken drin. Erst die Gegenrichtung (WIRTPUNKTE im Gerätekörper, Sonde 12) meldet den Fehler: 103 Punkte bei ihr, 355 bei ihm. Zwei Körper, die sich durchdringen, brauchen zwei Tests — ein Test prüft nur eine der beiden Hüllen.',
      'DIE GEWINNENDE AUSRICHTUNG WAR NICHT ÜBERALL DIESELBE. Bei ihr hat die alte Ausrichtung die Prüfung mit Durchdringung als hartem Kriterium erneut gewonnen (Identität + 90°, 14° zum Gesicht) — nur Schub und Länge waren falsch. Bei ihm nicht: die gebaute Richtung [1,0,1] + 90° erreicht in KEINER Schub-/Längenvariante null Durchdringung (bestenfalls 9 Wirtpunkte), durchdringungsfrei ist an dieser Faust nur [-1,-1,1] ohne Rollwinkel. Ein Defekt, den ein reiner Winkel-Prüfsatz nicht findet, weil beide Richtungen plausible Winkel liefern.',
      'KOPFNEIGUNG über den neuen `boneTweak`: 14° nach vorn, 6° gedreht, 5° seitlich, additiv auf die lokale Drehung des Clips. Die Bibliothek hat keinen Clip, der auf etwas in der Hand schaut — alle 119 geprüft. Vorbedingung ist `poseFreeze`: bei laufendem Mixer würde die Drehung beim nächsten Update zurückgesetzt, und genau das meldet der Mechanismus als OPEN-Punkt statt es stillschweigend zu verlieren.'
    ],
    open: [
      'DAS SMARTPHONE IST NICHT KAYKIT. Erste atlas-eigene Geometrie im ganzen Projekt — bis S35 hat der Atlas ausschließlich Pack-Assets platziert und gemessen. Ob die Town selbst authored Objekte will, ist eine Erzähl- und Stilentscheidung, nicht meine. Es ist als `gen:` ausgewiesen, damit es in jedem Export unterscheidbar bleibt.',
      'DIE LÄNGE IST JETZT GEDECKELT, DIE BREITE NOCH GEWÄHLT. Der erste Stand war 2,40 Faustradien lang — 0,72 bei einem gemessenen Unterarm von 0,334, also doppelt so lang wie der Unterarm, und deshalb steckte das Gerät am hängenden Arm im Oberschenkel. Gemessen pro Länge (durchdringungsfreie Varianten an seiner Faust): 1,35 Radien 18/18 · 1,55 15/18 · 1,75 13/18 · 1,95 12/18 · 2,40 12/18. Gebaut sind jetzt 1,45 (sie) und 1,30 (er). Das Seitenverhältnis 1,29 : 1 ist damit stämmiger als ein echtes Handy (etwa 2,1 : 1) — das bleibt eine Entscheidung, nicht eine Messung: der gemessene Faustradius 0,32 ist fast so groß wie der ganze Unterarm, ein maßstäblich schlankes Gerät wäre in dieser Faust unsichtbar.',
      'SEIN ARM IST GEBEUGT UND DAS WEICHT VON DER PROMO AB. Die Promo zeigt ihn mit hängenden Armen. Mit gestrecktem Arm steht seine Hand auf 27 % der Figurhöhe, und die einzige durchdringungsfreie Gerätelage lag 0,05 über Grund — im Bild lag das Handy neben dem Schuh. Entweder Promo-Haltung ohne Gerät oder Gerät mit gebeugtem Ellbogen; beides geht nicht. Gewählt ist die Beugung (+60° auf lowerarm.l), weil Georg das Gerät als Default für beide Protagonists wollte. Das ist eine Erzählentscheidung mit Messgrundlage, keine Messung.',
      'SEIN KOPF IST NICHT GENEIGT, obwohl der Bildschirm 5° von der Richtung zu seinem Kopf steht. Er hält das Gerät also so, als würde er hinschauen, schaut aber gerade. Eine Kopfneigung wie bei ihr wäre ein weiterer Eingriff in seine Haltung und ist nicht gebaut — offen.',
      'DAS GERÄT IST JETZT NUR NOCH AN DEN PROTAGONISTS. Der Hiker hatte es per Analogie bekommen (gleiche Rig-Familie, Generator schon vorhanden) — dafür gibt es weder im Pack noch in der Promo eine Vorlage. Entfernt, S36. Die Messungen zu den Hiker-Fäusten bleiben in docs/TEST_REPORT.md, damit der Fall rekonstruierbar bleibt, falls die Town ihn doch will.',
      'Der Bildschirm ist emissiv, aber der Atlas hat kein Bloom — er leuchtet flach statt zu strählen. Gleiche Einschränkung wie die Leuchtstreifen des 4GTN.',
      'DIE FREI STEHENDEN RUCKSÄCKE DER PROMO GIBT ES NICHT ALS DATEIEN. Sie sind Geschwister-Meshes der Figuren; abschaltbar, aber nicht ablegbar. Vierter Fall dieses Musters nach Marksman, Hoarder und Hiker — Kays Renders trennen Teile in Blender ab, der Pack liefert sie verbunden.',
      'Die zwei kleinen Laufposen der Promo (links und rechts außen) sind nicht gebaut: es sind dieselben Figuren in einem Laufzyklus. `Running` liegt in der Bibliothek, aber eine Laufpose einzufrieren ist ein Standbild aus einer Bewegung — als Aufstellung neben zwei stehenden Figuren wäre das eine Behauptung über Bewegung.',
      'Keine Kulisse im Pack. Das Artwork zeigt eine leere violette Studiofläche; die Atlas-Grundbeleuchtung bleibt neutral, damit Residents vergleichbar bleiben.'
    ]
  }
];

/* Ensemble: alle gebauten Vignetten auf einer Bodenebene, ohne Höhen-Normalisierung.
   Zweck: Maßstabs- und Look-Unterschiede sichtbar machen, nicht kaschieren. */
export const ENSEMBLE = { id: 'kfb-town-cast-wave-1', gap: 1.6, members: ['goth-girl', 'clown', 'toy-soldier', 'farmers', 'caveman', 'lorekeeper', 'witch', 'black-knight', 'avian-swordsman', 'skeleton-warrior', 'skeleton-rogue', 'skeleton-mage', 'demon-lord', 'orc-brute', 'monstrosity', 'animatronic', 'action-figure', 'orc-warband', 'prototype-pete', 'cleric', 'hero-man', 'marksman', 'hoarder', 'plant-warrior', 'gtn', 'hiker', 'protagonists'] };

export const SOURCES = {
  handoff: 'tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-asset-handoff-animation-lab (2).json',
  handoffCommit: '891eadf01e218f5fc21387e64cea1fec8332c5b6',
  animShard: 'registry/assets/v1/packs/kaykit-character-animations-1-1.json',
  animCommit: 'aa16a777a970f23d3f11fb3c23dc40718b04fa88',
  packShard: 'registry/assets/v1/packs/kaykit-mystery-series6.json (kfb.asset-pack.v1 · 916 Assets · Branch bot/asset-registry-update)',
  librarian: 'https://kayfabizarro.pages.dev/tools/asset_registry/librarian/'
};
