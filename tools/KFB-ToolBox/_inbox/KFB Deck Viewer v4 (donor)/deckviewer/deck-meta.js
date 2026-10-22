// KFB Deck-Overlay — die eine Stelle, an der Nicht-Repo-Daten stehen.
//
// Die Registry (media/kfb/index.json) kennt weder Gumroad-Links noch Marketing-Text.
// Bis die Registry-Felder aus Briefing v5 §9 additiv drin sind, wohnen sie hier.
//
// GEORG: hier eintragen.
//   gumroadUrl — leer lassen heisst: der Viewer bietet stattdessen das PDF direkt an.
//   tags       — leer lassen heisst: der Viewer nimmt deckFunction + deckType aus dem Deck-JSON.
//   blurb      — Entwurf, gerne ersetzen. Ein Satz, kein Verkaufsdruck.
//
window.KFB_DECK_META = {
  forget_utopia: {
    gumroadUrl: '',
    tags: ['exhibition', 'utopia', 'manipulation'],
    blurb: 'The polished future, taken apart one promise at a time.'
  },
  ignore_dystopia: {
    gumroadUrl: '',
    tags: ['exhibition', 'media critique', 'dystopia'],
    blurb: 'How the endless almost-collapse keeps everybody watching and nobody moving.'
  },
  embrace_protopia: {
    gumroadUrl: '',
    tags: ['exhibition', 'protopia', 'invitation'],
    blurb: 'The ugly first draft as a method. Erasable lines, open notebooks.'
  },
  sonic_slaughterhouse: {
    gumroadUrl: '',
    tags: ['satire', 'music industry', 'exploitation'],
    blurb: 'The record deal as a food chain, drawn in phases.'
  },
  epistemic_sabotage: {
    gumroadUrl: '',
    tags: ['workshop', 'critique', 'AI tools'],
    blurb: 'Hand your comic to a machine and watch what it gets wrong.'
  },
  mind_traps: {
    gumroadUrl: '',
    tags: ['performative', 'education', 'influence'],
    blurb: 'Influence techniques as exhibits, not as advice.'
  },
  protopia_web: {
    gumroadUrl: '',
    tags: ['satire', 'education', 'tabletop'],
    blurb: 'Mirage, apathy, extraction. The three futures in one deck.'
  },
  reality_redrawn: {
    gumroadUrl: '',
    tags: ['investigation', 'satire', 'education'],
    blurb: 'Secret histories with Uncle FrizzleBob as the unreliable guide.'
  },
  shadow_politics: {
    gumroadUrl: '',
    tags: ['game', 'satire', 'politics'],
    blurb: 'The cold monster and its many private friends.'
  },
  what_work_was_for: {
    gumroadUrl: '',
    tags: ['investigative', 'education', 'labour'],
    blurb: 'A field report on the shared burden, filed too late.'
  },
  museum_of_modern_mess: {
    gumroadUrl: '',
    tags: ['satire', 'party', 'domestic'],
    blurb: 'Your kitchen table, curated.'
  }
};
