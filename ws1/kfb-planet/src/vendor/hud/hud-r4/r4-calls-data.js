/* KFB HUD R4 · Ruf-Daten (Social Calls). Bedeutungen sind DATEN, nicht Design (Brief §3.2).
 * Quelle heute: Kayfabizarro_Freestyle_Rules_v18-4.md (main), §8 „Social Feedback“ (Datei-Stand v18.1).
 * Ein Web-Chat-Entwurf definiert BONGO und Blödsinn! neu; Georg hat noch nicht entschieden. Dann nur `meaning`/`hint` hier tauschen.
 * Icon und Form folgen dem NAMEN (Klang), nicht der Bedeutung: so überleben sie eine Umdeutung.
 * color = V-292 Ruf-Farbe (fest). shape = Silhouette der Knet-Marke (G3: ohne Farbe unterscheidbar). */
export const CALLS = [
  { id: 'bingo', label: 'KayfaBINGO', short: 'BINGO', key: '1', color: '#4f6029', shape: 'circle', icon: 'star',
    line: 'KayfaBINGO!',
    meaning: 'Das hat gesessen. Spontan, ohne Erklärung.',
    hint: 'Ruf es, wenn dir eine Geschichte gefallen hat.',
    source: 'v18.1 §8: „That landed. Spontaneous, no explanation needed.“' },
  { id: 'bongo', label: 'KayfaBONGO', short: 'BONGO', key: '2', color: '#8a6f3e', shape: 'squircle', icon: 'drum',
    line: 'KayfaBONGO! Erzähl das bitte als Geschichte.',
    meaning: 'Klang wie Spielmechanik. Bitte als Geschichte nacherzählen.',
    hint: 'Ruf es, wenn jemand eine Kraft wie eine Regel abrechnet.',
    source: 'v18.1 §8: Power resolved like a mechanic → restate as story.' },
  { id: 'boggle', label: 'KayfaBOGGLE', short: 'BOGGLE', key: '3', color: '#5a6b76', shape: 'triangle', icon: 'eyes',
    line: 'KayfaBOGGLE! Wem gehört eigentlich die zweite Last?',
    meaning: 'Eine konkrete Frage, kein Urteil. Antwort in 1–2 Sätzen.',
    hint: 'Ruf es, wenn dir in der Geschichte etwas fehlt.',
    source: 'v18.1 §8: „One concrete question — not a judgment, a gap.“' },
  { id: 'bloedsinn', label: 'Blödsinn!', short: 'BLÖDSINN', key: '4', color: '#b8361f', shape: 'octagon', icon: 'bang',
    line: 'Blödsinn! Die Szenenkarte fehlt.',
    meaning: 'Regel gebrochen: aus der Rolle, Szene vergessen, Modus ignoriert.',
    hint: 'Ruf es, wenn eine Regel gebrochen wurde. Die Mehrheit entscheidet.',
    source: 'v18.1 §8: rule broken · majority decides · Quest Die does not move.' }
];
export const OWN_TEXT = { id: 'own', label: 'Eigener Text', short: 'EIGENER TEXT', key: '5', shape: 'pill', icon: 'pencil',
  meaning: 'Sag etwas Eigenes. Deine Figur spricht es aus.', hint: 'Tippen, Enter: deine Figur sagt es (später mit Stimme).', max: 80 };
/* Kontext-Aktionen: nur wenn die Szene sie anbietet (0–2). Neutraler Knet-Ton, kleiner, innerer Bogen. */
export const CONTEXT_ACTIONS = [
  { id: 'take', label: 'Nehmen', short: 'NEHMEN', icon: 'grab', meaning: 'Requisit aufheben.' },
  { id: 'ask', label: 'Erbitten', short: 'ERBITTEN', icon: 'ask', meaning: 'Um das Requisit bitten.' }
];
export const FIRST_USE = {
  title: 'Rufe',
  body: 'Nach jeder Geschichte darfst du rufen. Ein Ruf ist dein Feedback an die Erzählerin.',
  more: 'Gedrückt halten (oder Maus drauf) zeigt die Erklärung.',
  ok: 'Verstanden'
};
