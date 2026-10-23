// Figuren lesbar mit dem bestehenden Licht (Georg 23.10., FIGUREN_LESBARKEIT_R2): nur auf Figuren wird das gesamte eintreffende Licht multiplikativ
// verstärkt („Belichtung nur für Figuren“, wie Licht-Verknüpfung im Film) – nachts stärker, tags gar nicht. Erste Fassung nur auf dem Umgebungsanteil war
// nachts zu schwach (Hemisphäre dort sehr dunkel, gemessen). Kein neues Licht, keine Untergrenze: Albedo, Knet-Relief und Schattierung bleiben im selben
// Verhältnis (Multiplikation statt max()), der Boden bleibt unberührt, also bleiben die Bodenschatten. Eigenschatten auf Figuren ist schon gedämpft
// (applyFigureShadow 0,55, Georg 21.10.). Seit 23.10. Standard (Georg), figamb=0 schaltet ab.
export const FIGAMB_ON = !(typeof location !== 'undefined' && /(^|[#,])figamb=0(,|$)/.test(location.hash)) // Georg 23.10.: Standard; figamb=0 = alter Stand
export const FIG_AMB = Object.freeze({ day: 1.0, night: 2.6 }) // Belichtungsfaktor der Figuren, nach mood.glow (0 Tag … 1 Nacht); Georg 23.10.: „etwas kräftiger“ (1,9 → 2,6)
export const FIG_AMB_TEST = { off: false } // Prüfhilfe: A/B im selben Moment (Faktor 1)
const U = { uFigAmb: { value: 1 } }

export function applyFigureAmbient(mat) {
  if (!mat || mat.userData?.figAmb || mat.isShaderMaterial || mat.isMeshBasicMaterial) return false
  mat.userData.figAmb = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); Object.assign(sh.uniforms, U)
    sh.fragmentShader = 'uniform float uFigAmb;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight *= uFigAmb;
  #include <opaque_fragment>`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|figamb'; mat.needsUpdate = true; return true
}

// je Bild aus der Rig-Stimmung: glow 0 → Tag-Faktor, 1 → Nacht-Faktor
export function updateFigureAmbient(mood) {
  const g = Math.min(1, Math.max(0, mood?.glow ?? 0))
  U.uFigAmb.value = FIG_AMB_TEST.off ? 1 : FIG_AMB.day + (FIG_AMB.night - FIG_AMB.day) * g
  return U.uFigAmb.value
}
