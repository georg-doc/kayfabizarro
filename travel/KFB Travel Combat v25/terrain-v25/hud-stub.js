// ============================================================================
// hud-stub.js — KFB Travel Combat v25.1 · Der Tacho-Würfel ist AUS
// ----------------------------------------------------------------------------
// Georg, 05.09.: „den Tacho-Würfel würde ich mal zur Disposition stellen, weil er sowieso noch
// nicht sauber funktioniert und eigentlich eher die Immersion und das Flug- und Kampfgefühl stört."
//
// Die Begründung, die über „gefällt nicht" hinausgeht: **Tempo soll man an der WELT fühlen** —
// Speedlines, Kondensstreifen, die Kamera, die bei Tempo zurückgeht — nicht an einem Zeiger
// ablesen. Eine Anzeige lädt dazu ein, von dem wegzuschauen, was man steuert. Der Würfel war
// zusätzlich ein MENÜ (sechs Seiten = sechs Panel-Sektionen); diese Aufgabe hat jetzt das Zahnrad
// oben rechts (`gear-icon.js`), und die ist dort besser aufgehoben, weil ein Menü kein Instrument
// sein muss.
//
// **Warum eine Stub-Datei und nicht zwanzig Löschungen.** `hud-cube` hängt an 14 Aufrufstellen im
// Runner (`setPalette`, `flash`, `sizePx`, `setEnabled`, `preWarm`, `update`, `render`, `spin`,
// `home`, `spinTo`, `safeZone`, …). Jede einzeln zu entfernen heißt, den Runner an 14 Stellen zu
// ändern, um ein Element zu verstecken — und jede dieser Stellen ist ein Ort, an dem beim nächsten
// Umbau etwas kaputtgeht. Ein Adapter mit derselben Oberfläche, der nichts zeichnet, ist EINE
// Änderung und vollständig zurücknehmbar: `?tacho=1` baut den echten Würfel wieder.
// Der Würfel-Code bleibt unangetastet in `hud-cube.js` liegen — das ist keine Altlast, sondern der
// Vergleichsmaßstab, falls die Entscheidung zurückgedreht wird.
// ============================================================================

export function createHudStub(o) {
  const P = Object.assign({ size: 0 }, (o && o.params) || {});
  let enabled = true;
  const SAFE = { x: 0, y: 0, w: 0, h: 0 };
  return {
    name: 'hud-stub', aus: true,
    // Zwei leere Uhren: der Runner ruft sie je Bild, und ein `if (hud)` an jeder Stelle wäre
    // dieselbe Streuung, die dieser Adapter vermeidet.
    update() {}, render() {},
    scene: null, camera: null, cube: null, body: null,
    get faces() { return []; },
    get sizePx() { return 0; },
    get growth() { return 0; },
    get safeZone() { return SAFE; },
    spinTo() {}, home() {}, spin() {}, flash() {},
    setPalette() {},
    get edgeGain() { return 0; },
    setEdgeGain() {},
    get hasEdge() { return false; },
    setFaceImage() {},
    setEnabled(on) { enabled = !!on; },
    get enabled() { return enabled; },
    preWarm() {},
    dispose() {},
    params: P,
    zeile() { return 'hud-cube · AUS (v25.1 · ?tacho=1 baut ihn wieder)'; },
  };
}
