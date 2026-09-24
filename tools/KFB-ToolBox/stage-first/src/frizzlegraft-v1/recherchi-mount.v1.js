/* recherchi-mount.v1 · Recherchi als Bewohner (`kind:'htmlcube'`, `module:'Recherchi'`).
 *
 * EIN Aufruf für einen Wirt, der Szene, Kamera und Renderer schon hat — dieselbe Form wie
 * `lab-v6/carlrig-mount.v1.js` (mountCarl) und `frizzlegraft-v1/graft-mount.v1.js`. Recherchi
 * bringt genau die drei Bauteile mit, die er im Vertrag angemeldet hat (SPEC_recherchi-modul_v1 §2):
 * die HTML-FLÄCHEN, die EINGABE auf der Fläche (`face.input`) und die NASE als Knopf. Licht,
 * Kamera, Boden, Augen, Mund und Bewegung gehören dem Wirt — hier wird davon nichts nachgebaut.
 *
 * ⚠ GEMESSEN 14.09., der Grund für diese Datei: Recherchis eigener Weg (`recherchi-cube.js`)
 * hängt an `THREE.HTMLTexture` + `three-html-render`-Polyfill, und das gibt es erst ab three 0.185
 * im WebGPU-Bau. Die Bühne läuft **three r160 / WebGLRenderer** (in Georgs laufendem Studio
 * abgefragt: `THREE.HTMLTexture` → undefined, `requestPaint in HTMLCanvasElement.prototype` → false).
 * Der Texturweg ist also NICHT übertragbar. Übertragbar sind die zwei Teile, an denen die
 * Bedienbarkeit wirklich hängt, und die kommen unverändert mit:
 *   · `_align()`   — dieselbe matrix3d-Rechnung (recherchi-cube.js Z. 877–955): echtes DOM liegt
 *                    deckungsgleich über der Fläche, also sind Tastatur, Fokus und Caret NATIV.
 *   · `_hitAct()`  — Strahl → UV → Entwurfspixel → Bedienelement über Layout-Offsets (Z. 1000–1045).
 * Statt HTMLTexture rastert `raster()` dieselbe Fläche über SVG-foreignObject in eine CanvasTexture.
 * Zwei Darstellungen, EINE Quelle: der Entwurfsknoten. Wer zugewandt ist, sieht das DOM (scharf,
 * tippbar); die fünf abgewandten Seiten tragen die Rasterung, damit der Würfel aus jedem Winkel
 * gelesen wird. Der Übergang ist eine Blende, keine Umschaltung.
 *
 * ⚠ Der Entwurfsrahmen ist 470 px, quadratisch, fest. Jede Zahl im Flächen-HTML rechnet dagegen
 * (Regel 1 der Spec, einmal bezahlt: wer die Kante gegen die Canvas-Box auflösen lässt, bekommt
 * ein 16 % breit gezogenes Gesicht und Augen auf der Fase). Hier ist die Fläche IMMER 470 × 470 —
 * die Skalierung macht allein die matrix3d bzw. die UV-Streckung.
 */

export const SCHEMA = 'kfb.recherchi-mount/1';
export const DESIGN = 470;

/* Die drei Augenzahlen. EINE Quelle (Spec §6) — in Recherchi v4 hiessen sie `EYE`, im
   Vertrag `eye.anchor`. Wer sie ändert, ändert sie hier. */
export const EYE = { size: 0.26, gap: 0.55, topPct: 27 };
/* ⚠ GEMESSEN 14.09., und es war eine bezahlte Falle: der Vertragsentwurf trägt
   `anchor {dx 0.275, dy −0.23, ring 0.26}`, aber diese Zahlen beschrieben Recherchis EIGENES
   HTML-Gesicht, nicht den Anker des Studio-EyeRigs. Eingesetzt saßen die Augen 0,29 u zu tief
   und 0,07 u zu eng (Augenmitten bei ±0,144 statt ±0,211, Höhe 0,597 statt 0,887).
   Der EyeRig rechnet in HALBEN Wirtskanten. Damit sind es nicht drei übernommene Werte, sondern
   drei GERECHNETE — aus denselben drei Entwurfszahlen, die auch das HTML-Gesicht benutzt:
     dx   = Augenbreite × (1 + Abstand)        → 0,26 × 1,55 = 0,403
     dy   = 1 − 2 × Höhenanteil                → 1 − 0,54     = 0,46
     ring = Augenbreite                        → 0,26
   Eine Quelle, drei Zahlen (Spec §6). Wer EYE ändert, ändert den Anker mit. */
export const EYE_ANCHOR = {
  dx: +(EYE.size * (1 + EYE.gap)).toFixed(4),
  dy: +(1 - 2 * (EYE.topPct / 100)).toFixed(4),
  ring: EYE.size,
  track: 0.14,
};

/* Die Nase. Setzung 14.09. (Georg): »nase ist micro/send switch icon für chat« — der Knopf IST
   der Aktionsknopf der Eingabe: leer → Mikrofon, Text → senden. Damit hängt er an derselben Naht
   wie `face.input` und braucht keinen zweiten Weg.
   Bewegungsregeln aus dem Vertrag, sie gelten für ein Bedienelement und nicht für eine Figur:
   KEINE Anticipation (ein Knopf, der sich vor dem Druck bewegt, ist kaputt), rein hart in 70 ms,
   zurück über einen kritisch gedämpften Feder-Dämpfer ohne Überschwingen, Eintauchtiefe als
   ANTEIL des Ballradius. Der Körper antwortet mit — Knopf, dann Körper (`nudge`, apex 0.06). */
export const NOSE = { cx: 0.5, cy: 0.45, r: 0.105, color: '#99CC33', hot: '#CC0033',
  depth: 0.55, inMs: 70, omega: 22, bodyImpulse: 0.06, act: 'nose' };

/* Der Visem-Mund. GEMESSEN 14.09.: mit den Vorgaben von PetMouth (dy −0,52, size 0,44) saß er
   auf 76 % Höhe — genau auf der Zeile des EINGABEFELDS, und mit dem hochgesetzten Augenanker
   lief er dem Nasenball in die Kuppel. Das ist der Namenskonflikt aus dem Vertrag (_offen.2) in
   Geometrie: zwei Besitzer auf einer Linie. Die Entscheidung steht im Vertrag — das Feld heißt
   face.input und behält die 72-%-Zeile, der Visem-Mund zieht in das Band zwischen Nase und
   Feld (58–62 %) und wird kleiner. dy und size sind PetMouth-Einheiten (halbe Wirtshöhe). */
export const MOUTH_FIT = { dy: -0.2, size: 0.3, sx: 1.15, lift: 0.02 };

/* Flächenbelegung. Reihenfolge = Belegung, wie im Vertrag (`_faces`). Georgs Wahl 14.09.:
   alle sechs. Achsen wie in recherchi-cube.js, damit die Rechnungen übertragbar bleiben. */
export const FACE_DEF = [
  { id: 'scan',     l: 'Gesicht' },
  { id: 'board',    l: 'Board' },
  { id: 'quellen',  l: 'Quellen' },
  { id: 'filter',   l: 'Filter' },
  { id: 'material', l: 'Material' },
  { id: 'brief',    l: 'Brief' },
];
export const FACE_N  = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 1, 0], [0, -1, 0]];
export const FACE_UP = [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
/* Materialschacht m einer BoxGeometry ([+X,−X,+Y,−Y,+Z,−Z]) trägt die Fläche MAT_OF[m]. */
export const MAT_OF = [1, 3, 4, 5, 0, 2];

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SANS = "'Roboto','Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "'Roboto Slab',Georgia,'Times New Roman',serif";
const SVG = 'http://www.w3.org/2000/svg';

/* ---------------------------------------------------------------- die sechs Flächen
   Alles inline gestylt und XML-fest (jedes Tag geschlossen, jedes Attribut in Anführungszeichen,
   jedes `<svg>` mit eigenem Namensraum) — sonst bricht die foreignObject-Rasterung an EINEM
   fehlenden Schrägstrich still weg und die Fläche kommt weiss zurück. Geprüft wird das, nicht
   vermutet: `report.xml` zählt, wie viele Flächen als XML durchgehen. */

const MIC = (ink, px) => `<svg xmlns="${SVG}" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"></path><path d="M12 18v3"></path></svg>`;
const SEND = (ink, px) => `<svg xmlns="${SVG}" width="${px}" height="${px}" viewBox="0 0 24 24" fill="${ink}"><path d="M3.2 20.4 21.4 12 3.2 3.6l.1 6.6 12 1.8-12 1.8z"></path></svg>`;
const PLUS = (ink, px) => `<svg xmlns="${SVG}" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`;

const head = (t) => `<div style="font-family:${SERIF};font-weight:600;font-size:42px;line-height:1.16;color:#1B1E21">${esc(t)}</div>`;
const sub = (t) => `<div style="font-size:24px;line-height:1.4;color:#6B7280">${esc(t)}</div>`;
const chip = (act, label, on) => `<button data-act="${esc(act)}" style="border:1px solid ${on ? '#8CBF2B' : '#E5E7EB'};background:${on ? '#F1F8E2' : '#fff'};color:${on ? '#4F7A16' : '#6B7280'};border-radius:999px;padding:11px 20px;font:500 22px ${SANS};cursor:pointer">${esc(label)}</button>`;
const field = (act, val, ph) => `<input data-act="${esc(act)}" value="${esc(val)}" placeholder="${esc(ph)}" style="flex:1;min-width:0;box-sizing:border-box;height:56px;border:1.5px solid #E3E6E9;border-radius:16px;padding:0 20px;font:400 22px ${SANS};color:#222;outline:none"></input>`;

export function faceHtml(id, s, opts) {
  s = s || {}; opts = opts || {};
  if (id === 'scan') {
    /* Vorderseite = Gesicht. Proportionen am Mockup gemessen, in Prozent der 470er Kante:
       Augen 26 % breit, Mitte auf 27 % Höhe · Nase 21 %, Mitte 45 % · Eingabefeld 81 %, Mitte 72 %.
       Die Augen HIER sind das Ruhegesicht der Fläche. Die lebenden Augen sind entweder diese
       (Quelle `html`) oder die Studio-Module vor der Fläche (Quelle `modules`) — nie beide sichtbar. */
    const txt = String(s.chatText || '');
    const E = Math.round(DESIGN * EYE.size), GAP = Math.round(E * EYE.gap), PU = Math.round(E * 0.4);
    const GL = Math.round(PU * 0.3), BD = Math.round(E * 0.075);
    const eye = `<div style="width:${E}px;height:${E}px;border-radius:50%;background:#fff;box-sizing:border-box;border:${BD}px solid #141618;position:relative;box-shadow:inset 0 ${Math.round(E * 0.07)}px ${Math.round(E * 0.14)}px rgba(20,24,28,.13)"><div style="position:absolute;left:50%;top:50%;width:${PU}px;height:${PU}px;margin:${-PU / 2}px 0 0 ${-PU / 2}px;border-radius:50%;background:#17191B"><div style="position:absolute;left:${Math.round(PU * 0.16)}px;top:${Math.round(PU * 0.14)}px;width:${GL}px;height:${GL}px;border-radius:50%;background:rgba(255,255,255,.92)"></div></div></div>`;
    const eyes = s.faceSource === 'modules' ? ''
      : `<div data-part="eyes" style="position:absolute;left:0px;right:0px;top:${EYE.topPct}%;display:flex;justify-content:center;gap:${GAP}px">${eye}${eye}</div>`;
    /* Der Ball liegt NICHT hier: er ist Geometrie vor der Fläche (Vertrag §4b — läge er in der
       Fläche, rasterte jeder Druck den ganzen Würfel neu). Was hier steht, ist sein Loch:
       eine Aussparung, damit die Fläche unter dem Ball nicht durchscheint. */
    /* ⚠ NUR FÜR DIE TEXTUR. Das Loch liegt UNTER dem Knopf, und die Textur liegt unter dem 3D —
       in der DOM-Ebene wäre dasselbe Loch eine deckende grauweiße Scheibe ÜBER dem grünen Ball.
       Genau so sah es 14.09. aus: der Ball war grün (am Pixel gemessen), man sah ihn nur nicht.
       Zwei Darstellungen aus EINER Vorlage heißt nicht: beide zeigen alles. */
    const hole = opts.raster
      ? `<div style="position:absolute;left:50%;top:45%;width:21%;height:21%;margin:-10.5% 0px 0px -10.5%;border-radius:50%;background:#F3F5F6"></div>`
      : '';
    const LH = 36, PAD = 14, BDm = 2.5, MAX = LH * 3 + PAD * 2 + BDm;
    const lines = Math.max(1, txt.split('\n').length, Math.ceil(txt.length / 30));
    const th = Math.min(MAX, LH * lines + PAD * 2 + BDm);
    const rec = !!s.listening;
    const input = `<div style="position:absolute;left:9.5%;top:72%;width:81%;margin-top:${-th / 2}px"><textarea data-act="chat" rows="1" placeholder="Frag Recherchi …" style="display:block;width:100%;box-sizing:border-box;height:${th}px;max-height:${MAX}px;overflow-y:${th >= MAX ? 'auto' : 'hidden'};resize:none;border:0px;border-bottom:${BDm}px solid ${rec ? NOSE.hot : '#2A2E32'};border-radius:12px 12px 4px 4px;background:#F1F3F4;padding:${PAD}px 18px;font:400 25px ${SANS};line-height:${LH}px;color:#222;outline:none;text-align:${txt.trim() ? 'left' : 'center'}">${esc(txt)}</textarea></div>`;
    const foot = s.scanning
      ? `<div style="position:absolute;left:20%;top:88%;width:60%"><div style="height:6px;background:#F0F0F0;border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.round((s.scanPct || 0) * 100)}%;background:#99CC33"></div></div><div style="margin-top:12px;font:400 20px ${SANS};color:#8A9099;text-align:center">${esc(s.scanLabel || '')}</div></div>`
      : '';
    return eyes + hole + input + foot;
  }

  if (id === 'board') {
    const items = (s.board || []).slice(0, 4);
    const rows = items.map((t) => `<div style="display:flex;gap:12px;align-items:baseline;width:100%;font:400 22px ${SANS};color:#3C4249;border-bottom:1px solid #F1F2F4;padding:9px 0px"><span style="color:#99CC33;font-weight:700">·</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t)}</span></div>`).join('');
    return head('Board') + (items.length
      ? `<div style="display:flex;flex-direction:column;width:88%;margin-top:8px">${rows}</div>`
      : sub('Noch nichts gemerkt.')) +
      `<div style="height:10px"></div>` + chip('board:open', items.length ? 'Board öffnen' : 'Themen suchen', items.length > 0);
  }

  if (id === 'quellen') {
    const on = s.quellen || {};
    const list = [['pubmed', 'PubMed'], ['cochrane', 'Cochrane'], ['awmf', 'AWMF'], ['trials', 'Studien'], ['dez', 'Fachpresse'], ['foren', 'Fachforen']];
    const chips = list.map(([k, l]) => chip('q:' + k, l, !!on[k])).join('');
    return head('Quellen') +
      `<div style="display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:96%;margin-top:6px">${chips}</div>` +
      `<div style="display:flex;gap:10px;align-items:center;width:88%;margin-top:10px">${field('eigene', s.eigeneText || '', 'Eigene Quelle …')}<button data-act="eigene:add" style="width:56px;height:56px;flex:none;border:0px;background:#99CC33;border-radius:16px;display:grid;place-items:center;cursor:pointer">${PLUS('#fff', 22)}</button></div>`;
  }

  if (id === 'filter') {
    const sel = s.fFach || [];
    const list = [['ortho', 'Orthopädie'], ['diabeto', 'Diabetologie'], ['kardio', 'Kardiologie'], ['infekt', 'Infektiologie'], ['mental', 'Psyche'], ['apo', 'Apotheke']];
    const chips = list.map(([k, l]) => chip('fach:' + k, l, sel.indexOf(k) >= 0)).join('');
    return head('Filter') +
      `<div style="display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:96%;margin-top:6px">${chips}</div>` +
      `<div style="display:flex;width:88%;margin-top:10px">${field('fachq', s.fachQuery || '', 'Fachgebiet suchen …')}</div>` +
      (sel.length ? `<button data-act="scan" style="margin-top:14px;border:0px;background:#99CC33;color:#fff;border-radius:14px;padding:14px 36px;font:700 24px ${SANS};cursor:pointer">Recherchi</button>` : '');
  }

  if (id === 'material') {
    const fs = (s.files || []).slice(0, 5);
    const items = fs.map((n, i) => `<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;width:100%;font:400 21px ${SANS};color:#3C4249;border-bottom:1px solid #F1F2F4;padding:7px 0px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(n)}</span><button data-act="file:del" data-val="${i}" style="border:0px;background:transparent;color:#B0B6BD;font:400 22px ${SANS};line-height:1;cursor:pointer">×</button></div>`).join('');
    return head('Material') +
      (fs.length ? `<div style="display:flex;flex-direction:column;width:88%;margin-top:6px">${items}</div>` : sub('PDF, Text oder Link. Bis zu fünf.')) +
      `<div style="display:flex;gap:12px;align-items:center;justify-content:center;margin-top:14px"><button data-act="file" style="height:58px;padding:0px 28px;border:1.5px solid #E3E6E9;background:#fff;color:#3C4249;border-radius:14px;font:500 23px ${SANS};cursor:pointer">Dateien wählen</button><button data-act="scan" style="height:58px;padding:0px 34px;border:${fs.length ? '0px' : '1.5px solid #D8DCE0'};background:${fs.length ? '#99CC33' : '#fff'};color:${fs.length ? '#fff' : '#8A9099'};border-radius:14px;font:700 24px ${SANS};cursor:pointer">Scan</button></div>`;
  }

  if (id === 'brief') {
    const t = String(s.brief || '');
    return head('Auftrag') + sub('In eigenen Worten. Recherchi liest mit.') +
      `<div style="width:88%;margin-top:12px"><textarea data-act="brief" rows="4" placeholder="Was soll ich herausfinden?" style="display:block;width:100%;box-sizing:border-box;height:168px;resize:none;border:1.5px solid #E3E6E9;border-radius:16px;background:#fff;padding:16px 18px;font:400 23px ${SANS};line-height:32px;color:#222;outline:none">${esc(t)}</textarea></div>`;
  }
  return '';
}

/* ---------------------------------------------------------------- Rasterung ohne HTMLTexture */
function svgDoc(inner, px) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">` +
    `<foreignObject x="0" y="0" width="${px}" height="${px}">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${px}px;height:${px}px;box-sizing:border-box;` +
    `background:#fff;color:#222;font:400 22px ${SANS};padding:38px;display:flex;flex-direction:column;` +
    `align-items:center;justify-content:center;text-align:center;gap:14px;position:relative;overflow:hidden">` +
    inner + '</div></foreignObject></svg>';
}

export async function mountRecherchi({ THREE, scene, camera, renderer, mods, pet, state, onAction, log }) {
  const say = log || (() => {});
  const S = Object.assign({ faceSource: 'modules', chatText: '', brief: '', board: [], files: [],
    quellen: { pubmed: true, cochrane: true, awmf: true }, fFach: [], eigeneText: '', fachQuery: '' }, state || {});
  const faces = FACE_DEF.slice();
  const half = 0.5;
  const report = { schema: SCHEMA, three: THREE.REVISION, htmlTexture: !!THREE.HTMLTexture,
    texturePath: THREE.HTMLTexture ? 'HTMLTexture' : 'foreignObject → CanvasTexture',
    xml: { ok: 0, total: faces.length, bad: [] }, rasterMs: {}, face: [] };

  /* ---- Körper: eine Box mit sechs Materialschächten. Weiss, wie im Vertrag (`color #FFFFFF`,
     Körper und Flächen beide reinweiss — der Eindruck ist eine durchgehende Oberfläche). */
  const group = new THREE.Group(); group.name = 'recherchi';
  const pivot = new THREE.Group(); pivot.name = 'recherchi-pivot'; group.add(pivot);
  const canvases = {}, textures = {}, els = {};
  const mats = new Array(6);
  for (let m = 0; m < 6; m++) {
    const f = faces[MAT_OF[m]];
    const cv = document.createElement('canvas'); cv.width = cv.height = 512;
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    canvases[f.id] = cv; textures[f.id] = tex;
    mats[m] = new THREE.MeshStandardMaterial({ map: tex, color: 0xffffff, roughness: 0.62, metalness: 0 });
    mats[m].userData.faceId = f.id;
  }
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mats);
  cube.name = 'recherchi-cube'; cube.castShadow = true;
  pivot.add(cube);

  /* ---- Gesicht des Wirts: eine UNSICHTBARE Box namens `body` vor der Gesichtsfläche.
     Das ist die Rolli-Regel, wörtlich (KloRolli.buildFaceHosts, übernommen in frizzlebob.v4a
     Z. 323): `buildFace` erwartet eine Gruppe mit genau EINEM Netz namens 'body' und hängt
     Augen, Brauen, Nase, Bart und Mund selbst daran. Deckkraft 0, NICHT visible:false —
     sonst verschwindet das Gesicht als Kind mit. */
  const hostGroup = new THREE.Group(); hostGroup.name = 'recherchi-facehost';
  const hostBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.36),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hostBox.name = 'body'; hostGroup.add(hostBox);
  /* GEMESSEN: mit 0,34 lag die Augenmitte bei local z 0,483, also 0,017 hinter der Fläche —
     ein Auge, das im Würfel steckt. 0,38 setzt sie auf die Oberfläche; die Kugel schaut heraus,
     wie ein Auge in einer Höhle sitzt. */
  hostGroup.position.z = half - 0.12;
  pivot.add(hostGroup);

  let face = { eyeRig: null, browRig: null, noseRig: null, moustache: null, mouth: null, report: [] };
  try {
    const CR = await import(new URL('../lab-v4/carlrig.js', import.meta.url).href);
    const pe = (pet && pet.eye) || {};
    /* ⚠ EIN EIGENTÜMER JE ZAHL, und der Anker gehört der Rechnung, nicht der Datei. GEMESSEN
       14.09.: der Eintrag trug `eye.anchor {dx 0.275, dy −0.23}` — die Zahlen von Recherchis
       gemaltem HTML-Gesicht — und überschrieb damit still den gerechneten Anker; die Augen
       standen wieder bei ±0,144 und 61 % Höhe statt bei ±0,211 und 27 %. Ein Eintrag darf den
       Anker nur setzen, wenn er SAGT, dass seine Zahlen Rig-Einheiten sind (`anchorUnits:'rig'`).
       Entwurfszahlen gehören nach `eye.design` und werden hier umgerechnet — dieselbe Formel wie
       oben, damit es die eine Quelle bleibt. */
    const dsg = pe.design || null;
    const anchor = dsg
      ? { dx: +(dsg.size * (1 + dsg.gap)).toFixed(4), dy: +(1 - 2 * (dsg.topPct / 100)).toFixed(4), ring: dsg.size, track: EYE_ANCHOR.track }
      : { ...EYE_ANCHOR, ...(pe.anchorUnits === 'rig' ? (pe.anchor || {}) : {}) };
    if (pe.anchor && pe.anchorUnits !== 'rig') report.face.push('eye.anchor im Eintrag IGNORIERT (Entwurfszahlen, keine Rig-Einheiten) — gerechnet aus EYE');
    face = CR.buildFace({ THREE, partsGroup: hostGroup, mods: mods || {}, opts: {
      baseColor: 0xffffff, mouthSet: (pet && pet.mouth && pet.mouth.set) || 'red',
      eyeAnchor: anchor,
      pupilStyle: pe.pupilStyle || 'matte-cute', lidFit: pe.lidFit != null ? pe.lidFit : 0.92,
      pupilSize: pe.pupilSize != null ? pe.pupilSize : 0.3, inset: pe.inset != null ? pe.inset : 0.04,
      gloss: 0.88,
    } });
    face.setVisible = (on) => CR.setFaceVisible(face, on);
    /* ⚠ Reihenfolge: ERST übernehmen, dann ergänzen. Vorher stand `report.face = face.report`
       hinter den eigenen Einträgen und hat sie verworfen — der Bericht war still unvollständig. */
    report.face = report.face.concat(face.report || []);
    if (face.mouth && face.mouth.setParams) face.mouth.setParams({ ...MOUTH_FIT, ...((pet && pet.mouth) || {}) });
    /* ⚠ EINE NASE. Der Baukasten des Hauses bringt eine gezeichnete Nase und einen Schnauzer mit
       — bei FrizzleBob und Carl richtig, hier falsch: Recherchi HAT eine Nase, und die ist ein
       Knopf. Gemessen 14.09. stand die gezeichnete Nase zwischen den Augen und der grüne Ball
       darunter; zwei Nasen auf einem Gesicht. Wer ein Bauteil selbst mitbringt, bekommt das des
       Wirts nicht dazu. Der Schnauzer ist ohnehin aus — er steht hier, damit niemand ihn sucht. */
    if (face.noseRig && face.noseRig.set) face.noseRig.set({ enabled: false });
    if (face.moustache && face.moustache.set) face.moustache.set({ enabled: false });
    report.face.push('nose: gezeichnete Nase AUS — Recherchi bringt den Knopf mit');
  } catch (e) {
    report.face = ['buildFace: FAILED ' + e.message];
    say('Gesichtsmodule nicht gebaut: ' + e.message);
  }

  /* ---- Die Nase als Knopf. Halbkugel VOR der Gesichtsfläche, am Flächenmittelpunkt nach
     cx/cy aus dem Vertrag. Anteile der Entwurfskante, nicht Pixel. */
  const nr = NOSE.r;
  const noseBall = new THREE.Mesh(
    new THREE.SphereGeometry(nr, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: NOSE.color, roughness: 0.42, metalness: 0.02 }));
  noseBall.name = 'recherchi-nose';
  noseBall.rotation.x = Math.PI / 2;                       // Kuppel zeigt nach +Z, aus der Fläche heraus
  const noseHome = new THREE.Vector3((NOSE.cx - 0.5), (0.5 - NOSE.cy), half + 0.004);
  noseBall.position.copy(noseHome);
  pivot.add(noseBall);
  /* Das Zeichen auf dem Knopf: Mikrofon, solange nichts getippt ist, Pfeil sobald etwas steht.
     Eine kleine Scheibe mit eigener Textur vor der Kuppel — sie dreht mit dem Ball, kostet aber
     keine Rasterung des Würfels. */
  const glyphCv = document.createElement('canvas'); glyphCv.width = glyphCv.height = 128;
  const glyphTex = new THREE.CanvasTexture(glyphCv); glyphTex.colorSpace = THREE.SRGBColorSpace;
  /* alphaTest, nicht nur transparent: fällt die Textur aus irgendeinem Grund aus, ist die Scheibe
     eine WEISSE FLÄCHE vor dem grünen Ball — genau so sah es im Bild aus. Mit alphaTest verwirft
     der Rasterer die durchsichtigen Stellen, und ein Ausfall der Textur bedeutet »kein Zeichen«
     statt »weißer Knopf«. Ein Fehler soll das Bild nicht übernehmen. */
  const glyph = new THREE.Mesh(new THREE.CircleGeometry(nr * 0.55, 40),
    new THREE.MeshBasicMaterial({ map: glyphTex, transparent: true, alphaTest: 0.06, depthWrite: false }));
  glyph.name = 'recherchi-nose-glyph';
  /* ⚠ Die Scheibe sitzt im Raum DES BALLS, und der ist um +90 Grad um X gedreht: sein lokales +Y
     zeigt nach Welt +Z. Erste Fassung setzte die Scheibe auf lokales +Z — das ist Welt −Y, also
     UNTER den Ball statt davor; im Bild stand eine weisse Scheibe über dem Mund und der grüne
     Ball war verdeckt. Verschiebung UND Drehung müssen dieselbe Achse benutzen. */
  /* GEMESSEN: bei 0,92 r lag die Scheibe IM Ball — die Kuppel hat auf dieser Höhe nur noch
     0,041 Radius, die Scheibe 0,069, also steckte ihre Mitte in der Kugel und man sah einen
     Punkt statt eines Mikrofons. 1,06 r setzt sie knapp VOR die Kuppel. */
  glyph.position.set(0, nr * 1.06, 0); noseBall.add(glyph);
  glyph.rotation.x = -Math.PI / 2;                          // Kreisnormale (+Z) auf lokales +Y = Welt +Z
  let glyphMode = null;
  const drawGlyph = (mode) => {
    if (mode === glyphMode) return; glyphMode = mode;
    const g = glyphCv.getContext('2d'); g.clearRect(0, 0, 128, 128);
    g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 9; g.lineCap = 'round';
    if (mode === 'send') { g.beginPath(); g.moveTo(30, 96); g.lineTo(102, 64); g.lineTo(30, 32); g.lineTo(34, 60); g.lineTo(78, 64); g.lineTo(34, 68); g.closePath(); g.fill(); }
    else { g.beginPath(); g.roundRect ? g.roundRect(52, 26, 24, 44, 12) : g.rect(52, 26, 24, 44); g.stroke();
      g.beginPath(); g.arc(64, 62, 26, 0, Math.PI); g.stroke();
      g.beginPath(); g.moveTo(64, 90); g.lineTo(64, 104); g.stroke(); }
    glyphTex.needsUpdate = true;
  };
  drawGlyph('mic');

  /* ---- Die Flächen als echtes DOM. Fest am Viewport, NIE im Layoutfluss (Reihenfolgefehler
     der ersten Recherchi-Fassung: ein 470er Block im Fluss verschob beim Start das Layout und
     sah wie ein »Einfliegen« aus). Die Ecke setzt `align()` auf die Canvas-Ecke. */
  if (!document.getElementById('kfb-recherchi-faces-css')) {
    const st = document.createElement('style');
    st.id = 'kfb-recherchi-faces-css';
    /* Die EINE Regel, die nicht inline gehen kann: sie gilt für die Kinder der Fläche. Ohne sie
       müsste `align()` in jedem Bild über alle Bedienelemente laufen — und ein durchsichtiges
       Rechteck mit `pointer-events:auto` würde den Klick auf den Nasenball abfangen. */
    st.textContent = '[data-kfb="recherchi-faces"] > div{pointer-events:none}' +
      '[data-kfb="recherchi-faces"] > div[data-live="1"] [data-act]{pointer-events:auto}';
    document.head.appendChild(st);
  }
  const host = document.createElement('div');
  host.setAttribute('data-kfb', 'recherchi-faces');
  host.style.cssText = 'position:fixed;left:0px;top:0px;width:0px;height:0px;z-index:3;pointer-events:none';
  document.body.appendChild(host);
  faces.forEach((f) => {
    const el = document.createElement('div');
    el.dataset.face = f.id;
    el.style.cssText = 'position:absolute;left:0px;top:0px;width:' + DESIGN + 'px;height:' + DESIGN + 'px;' +
      /* ⚠ background NICHT deckend. Erste Fassung war weiss — und hat damit die Augen, den
         Nasenball und den Mund verdeckt, obwohl alle drei gebaut und sichtbar waren (gemessen
         14.09.: eyeRig 2 Augen, world z 0,507 vor der Fläche, und trotzdem kein Auge im Bild).
         Eine deckende Ebene ÜBER dem Canvas kann nichts durchlassen. Die weisse Oberfläche
         liefert die Rasterung; hier stehen nur die Bedienelemente. */
      'box-sizing:border-box;transform-origin:0 0;background:transparent;color:#222;opacity:0;' +
      'padding:38px;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'text-align:center;gap:14px;font:400 22px ' + SANS + ';border-radius:2px;pointer-events:none';
    host.appendChild(el);
    els[f.id] = el;
  });

  /* ---- Zeigerereignisse auf dem echten DOM. Sie laufen NATIV — das ist der ganze Sinn der
     Ausrichtung. Zugestellt wird nach oben als EIN Ereignis, wie bei jedem Bedienelement der
     Fläche: {face, act, value, key}. */
  const fire = (d) => {
    if (onAction) { try { onAction(d); return; } catch (e) { console.warn('[recherchi] onAction', e); } }
    handle(d);
  };
  faces.forEach((f) => {
    const el = els[f.id];
    el.addEventListener('click', (e) => {
      const t = e.target.closest('[data-act]'); if (!t) return;
      const act = t.getAttribute('data-act');
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return;
      fire({ face: f.id, act, value: t.getAttribute('data-val') });
    });
    el.addEventListener('input', (e) => {
      const t = e.target.closest('[data-act]'); if (!t) return;
      fire({ face: f.id, act: t.getAttribute('data-act'), value: t.value, live: true });
      rasterSoon(f.id);        // die Fläche zeigt, was getippt wurde — ohne das DOM neu zu bauen
    });
    el.addEventListener('keydown', (e) => {
      const t = e.target.closest('[data-act]'); if (!t) return;
      if (e.key === 'Enter' && !e.shiftKey && t.tagName !== 'TEXTAREA') {
        e.preventDefault(); fire({ face: f.id, act: t.getAttribute('data-act') + ':submit', value: t.value, key: 'Enter' });
      }
    });
  });

  /* Fläche neu schreiben. Die EINE Quelle für beide Darstellungen. Wer gerade tippt, bekommt
     sein Feld NICHT untergeschoben (Fokus und Caret wären weg) — dann wird nur gerastert. */
  /* Eine Rasterung kostet gemessen 85 ms. Bei jedem Anschlag zu rastern hieße, den Tastendruck
     hinter die Rasterung zu stellen; die Verzögerung sammelt die Anschläge stattdessen ein. */
  const rasterT = {};
  function rasterSoon(id) {
    clearTimeout(rasterT[id]);
    rasterT[id] = setTimeout(() => raster(id), 70);
  }
  function render(id) {
    const el = els[id]; if (!el) return;
    const focused = document.activeElement;
    if (focused && el.contains(focused)) { rasterSoon(id); return; }
    el.innerHTML = faceHtml(id, S);
    raster(id);
  }

  const parser = new DOMParser();
  const xs = new XMLSerializer();
  const serialize = (el) => Array.from(el.childNodes).map((n) => xs.serializeToString(n)).join('');
  /* Der Zwilling. Er wird nie gezeigt und nie getroffen — er ist nur der Knoten, aus dem die
     Rasterung ihr XML zieht (der Browser macht aus einem HTML-String erst beim Setzen von
     innerHTML wohlgeformte Knoten; der Serialisierer macht daraus gültiges XML). */
  const twin = document.createElement('div');
  function raster(id) {
    const el = els[id], cv = canvases[id]; if (!el || !cv) return;
    const t0 = performance.now();
    /* ⚠ NICHT innerHTML. GEMESSEN 14.09.: die Flächen `quellen` und `filter` fielen durch die
       XML-Prüfung und blieben weiss — `<input …></input>` kommt aus innerHTML als `<input …>`
       zurück, und ein leeres Element ohne Schrägstrich ist kein XML. Der XMLSerializer schreibt
       genau das, was foreignObject lesen kann. Der Fehler saß nie im Flächen-HTML. */
    twin.innerHTML = faceHtml(id, S, { raster: true });
    const doc = svgDoc(serialize(twin), DESIGN);
    /* Erst prüfen, dann rastern: ein einziges nicht geschlossenes Tag macht die ganze Fläche
       weiss, und zwar STILL. Der Fehler steht damit im Bericht statt im Bild. */
    const bad = parser.parseFromString(doc, 'image/svg+xml').querySelector('parsererror');
    if (bad) {
      if (report.xml.bad.indexOf(id) < 0) report.xml.bad.push(id);
      say('Fläche ' + id + ': XML-Fehler, nicht gerastert');
      return;
    }
    const img = new Image();
    img.onload = () => {
      const g = cv.getContext('2d');
      g.clearRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      g.drawImage(img, 0, 0, cv.width, cv.height);
      textures[id].needsUpdate = true;
      report.rasterMs[id] = +(performance.now() - t0).toFixed(1);
    };
    img.onerror = () => say('Fläche ' + id + ': Rasterung fehlgeschlagen');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(doc);
  }

  faces.forEach((f) => render(f.id));
  /* Die Prüfung läuft auf dem, was WIRKLICH gerastert wird (dem serialisierten DOM), nicht auf
     dem Quelltext der Vorlage — sonst zählt sie sechs gültige Flächen, während zwei weiss sind. */
  faces.forEach((f) => {
    twin.innerHTML = faceHtml(f.id, S, { raster: true });
    const ok = !parser.parseFromString(svgDoc(serialize(twin), DESIGN), 'image/svg+xml').querySelector('parsererror');
    if (ok) report.xml.ok++; else if (report.xml.bad.indexOf(f.id) < 0) report.xml.bad.push(f.id);
  });

  /* ---- Ausrichtung des echten DOM über der Fläche. Übernommen aus recherchi-cube.js
     `_align()` (Z. 877–955), Zeile für Zeile dieselbe Rechnung: Flächenbasis → Würfelraum →
     Ansicht → Viewport, und das Ergebnis als matrix3d. Der einzige Unterschied: hier ist die
     Fläche SICHTBAR, sobald sie zugewandt ist (das DOM ist unsere scharfe Darstellung), und
     die Rasterung liegt darunter. */
  const vp = new THREE.Matrix4(), mvp = new THREE.Matrix4(), p2l = new THREE.Matrix4(), scl = new THREE.Matrix4();
  let vpW = 0, vpH = 0, org = null;
  const wq = new THREE.Quaternion(), camDir = new THREE.Vector3();
  let facingOf = {};
  function align() {
    const cv = renderer.domElement;
    const W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    if (W !== vpW || H !== vpH) { vp.set(W / 2, 0, 0, W / 2, 0, -H / 2, 0, H / 2, 0, 0, 1, 0, 0, 0, 0, 1); vpW = W; vpH = H; }
    const cr = cv.getBoundingClientRect();
    if (!org || Math.abs(org.x - cr.left) > 0.5 || Math.abs(org.y - cr.top) > 0.5) {
      org = { x: cr.left, y: cr.top };
      host.style.left = cr.left + 'px'; host.style.top = cr.top + 'px';
      host.style.width = cr.width + 'px'; host.style.height = cr.height + 'px';
      host.style.clipPath = 'inset(0px)';    // nichts ragt über die Bühne hinaus
    }
    cube.getWorldQuaternion(wq);
    camDir.subVectors(camera.position, group.position).normalize();
    faces.forEach((f, i) => {
      const el = els[f.id]; if (!el) return;
      const n = new THREE.Vector3(...FACE_N[i]);
      const up = new THREE.Vector3(...FACE_UP[i]);
      const right = new THREE.Vector3().crossVectors(up, n).normalize();
      p2l.makeBasis(right, up, n);
      p2l.setPosition(n.clone().multiplyScalar(half + 0.003)
        .add(right.clone().multiplyScalar(-half)).add(up.clone().multiplyScalar(half)));
      scl.set((half * 2) / DESIGN, 0, 0, 0, 0, -(half * 2) / DESIGN, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      p2l.multiply(scl);
      mvp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      mvp.multiply(cube.matrixWorld).multiply(p2l).premultiply(vp);
      el.style.transform = 'matrix3d(' + mvp.elements.join(',') + ')';
      const facing = n.clone().applyQuaternion(wq).dot(camDir);
      facingOf[f.id] = facing;
      /* Blende statt Umschaltung: ab 0,80 zugewandt übernimmt das DOM, darunter trägt die
         Rasterung. Beim Ziehen bleibt das DOM aus — ein rechteckiges Overlay über einer
         schrägen Silhouette sieht falsch aus, und ein Klick soll nicht im Drehen landen. */
      /* ⚠ DIE DOM-EBENE BLEIBT UNSICHTBAR — und das ist eine Entscheidung, keine Bequemlichkeit.
         Zwischenschritt 14.09.: sie war sichtbar, damit die Schrift scharf steht. Ergebnis im Bild
         ein Doppelbild an jeder Überschrift — nicht versetzt, sondern in ZWEI SCHRIFTEN: das DOM
         bekommt Roboto Slab über das Stylesheet, die foreignObject-Rasterung kann keine Webschrift
         nachladen und setzt Georgia. Zwei Darstellungen derselben Quelle dürfen nicht beide
         sichtbar sein. Also wie in Recherchis eigenem Würfel (`.rc-face{opacity:0}`): sichtbar ist
         die Rasterung, das DOM nimmt Tasten, Fokus und Klicks.
         Der Preis, benannt: kein sichtbarer Schreibzeiger. Der getippte Text erscheint mit der
         nächsten Rasterung (≈ 85 ms nach dem letzten Anschlag). */
      const live = !dragging && facing > 0.8;
      el.style.opacity = '0';
      if (live) el.setAttribute('data-live', '1'); else el.removeAttribute('data-live');
      el.style.visibility = live ? 'visible' : 'hidden';
    });
  }

  /* ---- Treffer auf der Fläche, für alles, was NICHT über das ausgerichtete DOM läuft
     (abgewandte Seiten, der Nasenball, und die Selbstprüfung der Messbank). Übernommen aus
     `_hitAct` (Z. 1000–1045): Strahl → UV → Entwurfspixel → Bedienelement über Layout-Offsets. */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(clientX, clientY) {
    const cv = renderer.domElement, r = cv.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -(((clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const onNose = ray.intersectObject(noseBall, false)[0];
    const hit = ray.intersectObject(cube, false)[0];
    if (onNose && (!hit || onNose.distance <= hit.distance)) return { nose: true };
    if (!hit || !hit.uv) return null;
    const n = hit.face.normal.clone();
    let slot = -1, bd = -2;
    FACE_N.forEach((v, i) => { const d = n.dot(new THREE.Vector3(...v)); if (d > bd) { bd = d; slot = i; } });
    const f = faces[slot]; if (!f) return null;
    const px = hit.uv.x * DESIGN, py = (1 - hit.uv.y) * DESIGN;
    const el = els[f.id];
    let found = null;
    if (el) el.querySelectorAll('[data-act]').forEach((t) => {
      let x = 0, y = 0, node = t;
      while (node && node !== el) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
      if (px >= x && px <= x + t.offsetWidth && py >= y && py <= y + t.offsetHeight) found = t;
    });
    return { face: f.id, slot, px, py, el: found, facing: facingOf[f.id] || 0 };
  }

  /* ---- Bewegung eines PROPS, nicht einer Figur (Georgs Wahl: keine Beine). Drei Dinge:
     ruhiges Schweben, Drehen auf eine Fläche, Hüpfen. Volumenerhaltender Squash beim Aufsetzen —
     das ist die Kaskade aus dem Vertrag, nicht Zierrat. */
  let t = 0, dragging = false, squash = 1, squashV = 0;
  let hop = null, spinTarget = null, spinFrom = null, spinT = 0, yaw = 0, pitch = 0;
  let press = 0, pressV = 0, pressing = false, pressT0 = 0;
  const SLOT_YAW = { scan: 0, board: -Math.PI / 2, quellen: Math.PI, filter: Math.PI / 2 };

  function setActive(id) {
    const i = faces.findIndex((f) => f.id === id); if (i < 0) return;
    /* ⚠ VORZEICHEN, von der Selbstprüfung gefunden (17 von 20 Bedienelementen, die zwei
       Deckelflächen 0 von 3): eine Drehung um X mit −90° schickt +Y nach −Z, also NACH HINTEN.
       Damit stand nach »Material« die Fläche »Brief« vorn — der Trefferweg war in Ordnung, er
       suchte nur auf der falschen Seite. R_x(θ)·(0,1,0) = (0, cosθ, sinθ): für +Y nach vorn
       braucht es sinθ = +1, also +90°; für −Y entsprechend −90°. */
    /* ⚠ Die Drehung nach oben oder unten braucht eine NULL-GIER. Gemessen 14.09.: nach »Filter«
       (Gier +90°) stand »Material« zwar vorn, aber um 90° gekippt — die Schrift lief senkrecht.
       Das ist keine Texturfrage, das ist die Verkettung zweier Drehungen: X um 90° auf Y um 90°
       ergibt eine Rolle. Ein Deckel kommt gerade nach vorn, also nur EINE Achse. */
    if (id === 'material') { spinFrom = { yaw, pitch }; spinTarget = { yaw: 0, pitch: Math.PI / 2 }; }
    else if (id === 'brief') { spinFrom = { yaw, pitch }; spinTarget = { yaw: 0, pitch: -Math.PI / 2 }; }
    else { spinFrom = { yaw, pitch }; spinTarget = { yaw: SLOT_YAW[id] || 0, pitch: 0 }; }
    spinT = 0;
  }
  function doHop() { if (!hop) hop = { t: 0, dur: 0.52, h: 0.34 }; }
  function pressNose(down) {
    if (down) { pressing = true; pressT0 = performance.now(); squashV -= NOSE.bodyImpulse * 9; }
    else pressing = false;
  }

  function update(dt) {
    dt = Math.min(dt || 0, 0.05); t += dt;
    if (spinTarget) {
      spinT = Math.min(1, spinT + dt / 0.55);
      const e = spinT < 0.5 ? 4 * spinT * spinT * spinT : 1 - Math.pow(-2 * spinT + 2, 3) / 2;
      yaw = spinFrom.yaw + (spinTarget.yaw - spinFrom.yaw) * e;
      pitch = spinFrom.pitch + (spinTarget.pitch - spinFrom.pitch) * e;
      if (spinT >= 1) spinTarget = null;
    }
    let y = 0.04 * Math.sin(t * 1.35);
    if (hop) {
      hop.t += dt;
      const u = Math.min(1, hop.t / hop.dur);
      y += hop.h * Math.sin(Math.PI * u);
      if (u >= 1) { hop = null; squashV -= 3.4; }          // Aufsetzen: Squash, dann Feder
    }
    /* Kritisch gedämpfte Feder, dieselbe Form wie `sd()` im Haus — kein Überschwingen. */
    const k = 190, c = 2 * Math.sqrt(k);
    squashV += (-(squash - 1) * k - squashV * c) * dt;
    squash = Math.max(0.7, Math.min(1.25, squash + squashV * dt));
    const inv = 1 / Math.sqrt(squash);
    pivot.position.y = y;
    pivot.scale.set(inv, squash, inv);
    pivot.rotation.set(pitch, yaw, 0);

    /* Nase: rein hart (70 ms, linear — keine Anticipation), zurück federnd. */
    if (pressing) press = Math.min(1, (performance.now() - pressT0) / NOSE.inMs);
    else { pressV += (-press * NOSE.omega * NOSE.omega - pressV * 2 * NOSE.omega) * dt; press = Math.max(0, press + pressV * dt); }
    noseBall.position.copy(noseHome).addScaledVector(new THREE.Vector3(0, 0, -1), press * NOSE.depth * nr);
    drawGlyph(String(S.chatText || '').trim() ? 'send' : 'mic');
    if (face.eyeRig && face.eyeRig.update) face.eyeRig.update(dt);
    if (face.browRig && face.browRig.sync) face.browRig.sync();
    if (face.noseRig && face.noseRig.sync) face.noseRig.sync();
    if (face.mouth && face.mouth.update) face.mouth.update(dt);
    align();
  }


  /* ---------------------------------------------------------------- Vorgabe-Verhalten
     Der Vertrag sagt: die BEDEUTUNG eines Drucks gehört der Anwendung, nicht dem Modul. Richtig —
     und ein Wirt, der nichts mitbringt, darf trotzdem keine tote Fläche bekommen. Also liegt hier
     eine Vorgabe, die jeder Wirt mit \`onAction\` überstimmt. Das Studio überstimmt sie nicht:
     es hat für Recherchi keine eigene Bedeutung, und eine erfundene wäre schlechter als diese. */
  const scan = { iv: null, steps: ['Quellen prüfen', 'Evidenz wiegen', 'Debatte lesen', 'Winkel finden'] };
  function startScan(q) {
    if (scan.iv) return;
    S.scanning = true; S.scanPct = 0; S.scanLabel = scan.steps[0];
    setActive('scan'); doHop(); render('scan');
    if (face.mouth && face.mouth.talk) { try { face.mouth.talk(true); } catch (e) {} }
    let i = 0;
    scan.iv = setInterval(() => {
      i++;
      if (i >= scan.steps.length) {
        clearInterval(scan.iv); scan.iv = null;
        S.scanning = false;
        if (q && q.trim()) S.board = (S.board || []).concat(q.trim().slice(0, 48));
        S.chatText = ''; S.listening = false;
        if (face.mouth && face.mouth.talk) { try { face.mouth.talk(false); } catch (e) {} }
        render('scan'); render('board'); doHop();
        return;
      }
      S.scanPct = i / scan.steps.length; S.scanLabel = scan.steps[i];
      render('scan');
    }, 620);
  }
  function handle(d) {
    const a = (d && d.act) || '';
    if (a === 'chat') { S.chatText = d.value || ''; rasterSoon('scan'); return; }
    if (a === 'brief') { S.brief = d.value || ''; rasterSoon('brief'); return; }
    if (a === 'eigene') { S.eigeneText = d.value || ''; rasterSoon('quellen'); return; }
    if (a === 'fachq') { S.fachQuery = d.value || ''; rasterSoon('filter'); return; }
    /* Die Nase: steht Text im Feld, schickt sie ihn; ist es leer, schaltet sie das Diktat.
       EIN Knopf, zwei Zustände, ein Zeichen (Georgs Setzung 14.09.). */
    if (a === 'nose') {
      const t = String(S.chatText || '').trim();
      if (t) startScan(t); else { S.listening = !S.listening; render('scan'); }
      return;
    }
    if (a === 'scan' || a === 'chat:submit') { startScan(String(S.chatText || '')); return; }
    if (a.indexOf('q:') === 0) { const k = a.slice(2); S.quellen[k] = !S.quellen[k]; render('quellen'); return; }
    if (a.indexOf('fach:') === 0) {
      const k = a.slice(5), list = S.fFach || (S.fFach = []);
      const i = list.indexOf(k); if (i >= 0) list.splice(i, 1); else list.push(k);
      render('filter'); return;
    }
    if (a === 'eigene:add' || a === 'eigene:submit') {
      const v = String(S.eigeneText || '').trim();
      if (v) { S.board = (S.board || []).concat(v); S.eigeneText = ''; render('quellen'); render('board'); }
      return;
    }
    if (a === 'file') { S.files = (S.files || []).concat('Notiz ' + ((S.files || []).length + 1) + '.pdf'); render('material'); return; }
    if (a === 'file:del') { S.files.splice(Number(d.value), 1); render('material'); return; }
    if (a === 'board:open') { setActive('board'); return; }
  }

  function setFaceSource(mode) {
    S.faceSource = mode;
    const showMods = mode === 'modules' || mode === 'both';
    if (face.setVisible) face.setVisible(showMods);
    /* ⚠ GEMESSEN 14.09.: `set({enabled:false})` blendet die gezeichnete Nase korrekt aus — und
       `setFaceVisible` des Baukastens schaltet sie eine Zeile später WIEDER sichtbar (es fragt
       beim Schnauzer nach `params.enabled`, bei der Nase nicht). Wer nach einem Sammelschalter
       noch eine eigene Regel hat, muss sie DANACH setzen. */
    if (face.noseRig && face.noseRig.mesh) face.noseRig.mesh.visible = false;
    if (face.moustache && face.moustache.mesh) face.moustache.mesh.visible = false;
    noseBall.visible = true;
    render('scan');
  }
  setFaceSource(S.faceSource);
  scene.add(group);

  return {
    SCHEMA, group, pivot, cube, faces, els, textures, host, face, nose: noseBall, report, state: S,
    setState(patch) { Object.assign(S, patch || {}); Object.keys(patch || {}).length && faces.forEach((f) => render(f.id)); },
    setFaceHtml(id, html) { const el = els[id]; if (!el) return; el.innerHTML = html; raster(id); },
    render, raster, setActive, setFaceSource, hop: doHop, pressNose, pick, align, update, handle, startScan,
    setDragging(on) { dragging = !!on; },
    spinBy(dy) { yaw += dy; spinTarget = null; },
    facing() { return { ...facingOf }; },
    dispose() {
      const d = (fn) => { try { fn(); } catch (e) {} };
      if (scan.iv) clearInterval(scan.iv);
      Object.values(rasterT).forEach((t) => clearTimeout(t));
      for (const r of [face.eyeRig, face.browRig, face.noseRig, face.moustache, face.mouth]) if (r && r.dispose) d(() => r.dispose());
      Object.values(textures).forEach((x) => d(() => x.dispose()));
      d(() => glyphTex.dispose());
      group.traverse((o) => { if (!o.isMesh) return; d(() => o.geometry.dispose()); [].concat(o.material || []).forEach((m) => m && d(() => m.dispose())); });
      d(() => host.remove());
      d(() => group.removeFromParent());
    },
  };
}
