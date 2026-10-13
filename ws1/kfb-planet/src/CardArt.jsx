// S1 · Kartenbild im DOM (Dialog, Sammlung): dieselbe Quelle cardImage(deckId, n), fit, ohne Tusche.
import { useEffect, useRef, useState } from 'react'
import { cardImage, fitCanvas, CARD_AR } from './cardImage'

export default function CardArt({ card, width = 320 }) {
  const ref = useRef(null)
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let alive = true
    setOk(false)
    cardImage(card.deck.id, card.num).then((img) => {
      const c = ref.current
      if (!alive || !img || !c) return
      const f = fitCanvas(img.canvas, CARD_AR, Math.round(width * 2))
      c.width = f.width; c.height = f.height
      c.getContext('2d').drawImage(f, 0, 0)
      setOk(true)
    })
    return () => { alive = false }
  }, [card, width])
  return <canvas ref={ref} className={'card-art' + (ok ? ' ok' : '')} data-card={card.deck.id + '#' + card.num} style={{ width, aspectRatio: String(CARD_AR) }} />
}
