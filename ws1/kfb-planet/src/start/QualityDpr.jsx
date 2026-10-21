// MVP-Startseite: Qualitätswechsel ohne Neuladen (R3F setDpr), hört auf 'kfb:quality' aus der Startseite bzw. dem Spiel-Menü
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
export default function QualityDpr() {
  const setDpr = useThree((s) => s.setDpr)
  useEffect(() => { const on = (e) => setDpr(e.detail.dpr); window.addEventListener('kfb:quality', on); return () => window.removeEventListener('kfb:quality', on) }, [setDpr])
  return null
}
