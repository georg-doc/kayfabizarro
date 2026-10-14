// Kartenvertrag der Registry (kfb-deck-registry/v2, media/kfb/index.json): Seite = coverOffset + 1 + floor((n-1)/4).
// Ohne three, ohne DOM. Festgenagelt auf denselben Stand wie die Bilder (MEDIA_COMMIT).
import audit from './data/mapping-audit.json'

export const MEDIA_COMMIT = 'ac9dbaed2e5966a537a4bb719e8cd847dcc5e099'

// Ob die Zuordnung Karte -> Viertelseite stimmt, steht nicht in der Registry. Sie ist je Deck geprüft:
// scripts/audit-mapping.py liest jede Viertelseite mit Apple Vision und vergleicht den Titel mit dem Kartennamen.
// Freigabe je KARTE: nur Karten, deren Titel im Viertel eindeutig belegt ist (Liste `ok` eines SAFE-Decks), zeigen
// das PDF-Bild; alle anderen behalten den Platzhalter mit dem wörtlichen Kartentext. Beispiele gesperrt:
// nibelungen_booster_pack_design (ganzes Deck um 4 verschoben, coverOffset 1 statt 0), big_bad_brain_wrestling #50/#51
// (vertauscht), romantic_kayfabe #54–#56 (Hochformat-Seite), anti_rules_toolkit (doppelter Name ab #50).
export const MAPPING_AUDIT = audit
const pinned = audit.media === MEDIA_COMMIT
export const isMappingSafe = (deckId) => pinned && audit.decks[deckId]?.status === 'SAFE'
export const isCardSafe = (deckId, n) => isMappingSafe(deckId) && audit.decks[deckId].ok.includes(n)
export const safeDecks = () => Object.keys(audit.decks).filter(isMappingSafe)
