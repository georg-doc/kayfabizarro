import { create } from 'zustand'
import { generateMaze, planetById } from './world'
import { randomCard, randomDeckIndex, cardsOfDeck, cardAt, DECKS } from './cards'

const KEY = 'kfb-planet-spike-r1-objects'
function load() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch (e) { /* ohne Speicher weiter */ }
  return null
}
function save(objs) { try { localStorage.setItem(KEY, JSON.stringify(objs)) } catch (e) { /* egal */ } }

const defaultObjects = () => generateMaze(planetById("prison"), 7, 3.0, 1337)

function dealPlanet(n) {
  const di = randomDeckIndex(); const pool = cardsOfDeck(di)
  const pick = []
  while (pick.length < Math.min(n, pool.length)) { const i = pool[Math.floor(Math.random() * pool.length)]; if (!pick.includes(i)) pick.push(i) }
  return { deck: DECKS[di], cards: pick.map(cardAt) }
}

export const useGame = create((set, get) => ({
  // --- Kayfabulieren (Regeln: Freestyle Rules v18-4 + Website Show/Spin/Sell) ---
  character: 'KayKit-Barbar',            // die Figur, die der Spieler steuert
  actor: null,                           // die Actor-Karte, die diese Figur spielt
  collection: [],                        // gesammelte Karten (Hand)
  discard: [],                           // Ablagestapel: ausgespielte Karten
  memories: [],                          // abgeschlossene Quests
  episode: null,                         // { quest, die, stage:[c|null x3], transcript:[], finale:false, turn }
  storyMode: null,                       // aktueller Story-Mode (Index 0..5) oder null
  stageFlash: 0,                         // Zeitstempel: Karte richtet sich auf
  planetCards: { home: dealPlanet(5), prison: dealPlanet(5) },
  collected: [],
  near: null,
  dialog: { kind: 'start', id: 1 },
  emote: null,
  choice: null,                          // offene Spielerwahl { id } (S5c), Ergebnis in lastChoice
  lastChoice: null,
  speech: null,                          // letzte Sprechblase als Ereignis { id, anchor, line, kind, color } (S5a/S5b)
  assisting: false,
  setNear: (near) => { const o = get().near; if ((o?.type || null) !== (near?.type || null) || o?.card?.idx !== near?.card?.idx) set({ near }) },
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
  collect: (card) => set({ collection: [...get().collection, card], collected: [...get().collected, card.idx], dialog: null, near: null }),
  addToCollection: (cards) => set({ collection: [...get().collection, ...cards] }),
  removeFromCollection: (idx) => set({ collection: get().collection.filter((c) => c.idx !== idx) }),
  toDiscard: (cards) => set({ discard: [...get().discard, ...cards.filter(Boolean)] }),
  setActor: (actor) => set({ actor }),
  setEpisode: (episode) => set({ episode }),
  patchEpisode: (patch) => set({ episode: { ...get().episode, ...patch } }),
  setStoryMode: (storyMode) => set({ storyMode }),
  flashStage: () => set({ stageFlash: performance.now() }),
  // line: Zeile aus dem Pool-Leser (poolReader.lineFor); andere Objekte zeigt der Host als „…“ (Vertrag §5)
  openChoice: () => set({ choice: { id: (get().choice?.id || get().lastChoice?.choiceId || 0) + 1 } }),
  closeChoice: () => set({ choice: null }),
  // result: { id: 'bingo'|'boggle'|'bongo'|'bloedsinn', label } oder { id: 'own', text }
  choose: (result) => set({ lastChoice: { ...result, choiceId: get().choice?.id ?? 0 }, choice: null }),
  say: (anchor, line, kind = 'speech', color) => set({ speech: { id: (get().speech?.id || 0) + 1, anchor, line, kind, color } }),
  playEmote: (name, ms = 1600) => { const e = { name, t: performance.now() }; set({ emote: e }); setTimeout(() => get().emote === e && set({ emote: null }), ms) },

  mode: 'play', // 'play' | 'build'
  flying: false,
  planetName: '',
  objects: load() || defaultObjects(),
  selected: null,
  tool: 'wall', // was beim Klick platziert wird
  gizmo: 'translate',
  buildFocus: null,
  toast: null,

  setMode: (mode) => set({ mode, selected: null, buildFocus: null }),
  setBuildFocus: (buildFocus) => set({ buildFocus, selected: null }),
  setFlying: (flying) => set({ flying }),
  setPlanetName: (planetName) => get().planetName !== planetName && set({ planetName }),
  setTool: (tool) => set({ tool }),
  setGizmo: (gizmo) => set({ gizmo }),
  select: (selected) => set({ selected }),
  showToast: (toast) => { set({ toast }); setTimeout(() => get().toast === toast && set({ toast: null }), 2200) },

  addObject: (o) => { const objects = [...get().objects, o]; save(objects); set({ objects, selected: o.id }) },
  updateObject: (id, patch) => {
    const objects = get().objects.map((o) => (o.id === id ? { ...o, ...patch, v: (o.v || 0) + 1 } : o))
    save(objects); set({ objects })
  },
  removeSelected: () => {
    const id = get().selected; if (!id) return
    const objects = get().objects.filter((o) => o.id !== id); save(objects); set({ objects, selected: null })
  },
  newMaze: () => {
    const rest = get().objects.filter((o) => o.tag !== 'maze')
    const objects = [...rest, ...generateMaze(planetById("prison"), 7, 3.0, Math.floor(Math.random() * 1e9))]
    save(objects); set({ objects, selected: null })
  },
  clearAll: () => { save([]); set({ objects: [], selected: null }) },
  importObjects: (objects) => { save(objects); set({ objects, selected: null }) },
}))
