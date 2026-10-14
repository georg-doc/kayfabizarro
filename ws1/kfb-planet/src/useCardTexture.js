// S1 · Host-Seite: liefert für eine Karte zuerst den Platzhalter (Spike-Canvas) und tauscht ihn gegen
// das echte Kartenbild, sobald cardImage() es hat. Der Tausch ist ein Ereignis (setState), nie pro Frame.
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { cardTexture, fitCanvas, makeTexture, CARD_AR, getRetryEpoch, subscribeRetry } from './cardImage'

export function useCardTexture(card, { open = true, ar = CARD_AR, placeholder }) {
  const ph = useMemo(() => {
    const t = placeholder(card, open); const tex = makeTexture(fitCanvas(t.image, ar, 512)); t.dispose()
    return tex
  }, [card, open, ar, placeholder])
  const [real, setReal] = useState(null)
  const epoch = useSyncExternalStore(subscribeRetry, getRetryEpoch)
  useEffect(() => {
    setReal(null)
    if (!open) return
    let alive = true
    cardTexture(card.deck.id, card.num, ar).then((t) => { if (alive && t) setReal(t) })
    return () => { alive = false }
  }, [card, open, ar, epoch])
  useEffect(() => () => ph.dispose(), [ph])
  return real || ph
}
