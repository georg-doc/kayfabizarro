/* recherchi-cube.js — <recherchi-cube>
   Weißer Navigationswürfel mit ECHTEN HTML-Flächen (THREE.HTMLTexture + HTML-in-Canvas-
   Polyfill). Kein Overlay, kein CSS-Hack: die sechs Flächen sind reale DOM-Knoten, werden
   als Textur auf die Würfelseiten gerendert und bekommen native Pointer-Events über eine
   matrix3d-Ausrichtung (der three.js-InteractionManager kann nur die Frontfläche, deshalb
   hier generalisiert für alle sechs).

   Würfelkörper und Flächen sind beide reinweiß — der Eindruck ist eine durchgehende
   Oberfläche ohne aufgesetzte Panels.

   Verwendung:
     <script type="importmap">{ "imports": {
       "three": "https://unpkg.com/three@0.185.1/build/three.webgpu.js",
       "three/tsl": "https://unpkg.com/three@0.185.1/build/three.tsl.js",
       "three/addons/": "https://unpkg.com/three@0.185.1/examples/jsm/",
       "three-html-render/polyfill": "https://cdn.jsdelivr.net/npm/three-html-render/dist/polyfill.mjs"
     }}</script>
     <script src="./recherchi-cube.js"></script>
     <recherchi-cube face-size="300"></recherchi-cube>

   API:  el.faces = [{id,l,sub}, …]   (max 6, Reihenfolge = Flächenbelegung)
         el.setFaceHtml(id, html)     Inhalt einer Fläche setzen (live)
         el.active = 'scan'           Fläche nach vorn drehen
         el.spin()                    einmaliger Auftritt
         el.setGroundLift(px)         Flughoehe der Buehne gegenrechnen (Boden bleibt am Boden)
         el.setLean(x, z)             Neigung zum Zeiger (additiv auf das Idle-Wabern)
   Events (bubbles, composed):
         facechange {id}              andere Fläche vorn
         faceaction {face, act, value, key}  Klick/Eingabe auf einer Fläche
         cubeready {mode:'3d'|'flat'} Renderer bereit oder Fallback aktiv
*/
(function () {
  if (window.customElements && customElements.get('recherchi-cube')) return;

  const FACE_N  = [[0,0,1],[1,0,0],[0,0,-1],[-1,0,0],[0,1,0],[0,-1,0]];
  const FACE_UP = [[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,0,-1],[0,0,1]];
  // Materialindex einer BoxGeometry: [+X,-X,+Y,-Y,+Z,-Z] → Position in FACE_N
  // Anteil der UI, der ohne Lichteinfluss steht (0 = alles beleuchtet, 1 = komplett flach).
  const FLAT = 0;   // 0 = kein Eigenleuchten. Siehe Post-Mortem: der Regler löst Lesbarkeit
                    // und Plastizität gegeneinander auf und wurde deshalb stillgelegt.
  const MAT_OF  = [1, 3, 4, 5, 0, 2];

  const CSS = `
    :host{display:block;position:relative;width:100%;height:100%;
          -webkit-tap-highlight-color:transparent}
    canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
    .rc-face{width:var(--fs,470px);height:var(--fs,470px);background:#fff;color:#222222;
      box-sizing:border-box;position:relative;overflow:hidden;touch-action:none;
      user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
      font-family:Roboto,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;
      font-size:22px;line-height:1.45}
    /* Textur-QUELLE = RASTERBOX. Deckkraft NICHT anfassen — der Polyfill setzt hier inline
       opacity:0, um den Quellknoten aus dem Bild zu nehmen (2026-08-28 verifiziert).
       Ihre Groesse gehoert NICHT uns: nach der Uebernahme durch HTMLTexture liegt der Knoten im
       Canvas-Teilbaum, inset:0 loest also gegen die CANVAS-Box auf (gemessen 348x404) — und genau
       diese Box wird auf die quadratische Flaeche gezogen. Ein festes 470er Quadrat hier hilft
       nicht, es wird nur beschnitten (v4 gemessen). Deshalb bleibt die Rasterbox, wie sie ist,
       und der Entwurf bekommt einen eigenen Rahmen: .rc-des. */
    .rc-rot{background:#fff;position:absolute;inset:0;box-sizing:border-box;overflow:hidden;
      transform-origin:50% 50%}
    /* ENTWURFSRAHMEN (v4, 2026-08-28). Hier gelten die 470 Entwurfspixel, gegen die faceHtml()
       jede Zahl rechnet — Augen, Nase, Mundhoehe, Schriftgroessen. _desFit() skaliert ihn EINMAL
       an der Grenze auf die Rasterbox (scale W/470, H/470); die UV-Streckung auf das Quadrat hebt
       das genau wieder auf. Vorher rechneten alle px gegen eine 470er Flaeche, die es zur Laufzeit
       nicht gab: das Gesicht wurde mit dem Viewport enger UND 16 % breit gezogen, die Augen landeten
       auf der Fase. Ein Ort fuer die Umrechnung, statt 40 Zahlen nachzuziehen. */
    .rc-des{position:absolute;left:50%;top:50%;width:var(--fs,470px);height:var(--fs,470px);
      margin-left:calc(var(--fs,470px) / -2);margin-top:calc(var(--fs,470px) / -2);
      box-sizing:border-box;padding:38px;transform-origin:50% 50%;
      display:flex;flex-direction:column;gap:16px;align-items:center;justify-content:center;
      text-align:center}
    /* Im 3D-Modus ist die Flaeche nur Trefferflaeche — unsichtbar, aber treffbar. Die Textur
       kommt aus .rc-rot und ist davon unberuehrt. Deklarativ statt per JS, damit kein Codepfad
       den Zustand versehentlich umschreibt. */
    .rc-face{opacity:0}
    /* AUSSERHALB DES LAYOUTFLUSSES, von Anfang an (v4, 2026-08-28). Der Quellknoten der Textur
       ist ein 470-px-Block. Stand er im Fluss von document.body, verschob er beim Start das
       Layout und wanderte danach in den Canvas-Teilbaum — sichtbar als "Einfliegen" am Anfang.
       Kein Animationsfehler, ein Reihenfolgefehler. Die tatsaechliche Ecke setzt _align() auf
       die Canvas-Position; hier zaehlt nur, dass die Flaeche NIE Platz im Dokument beansprucht.
       Deckkraft NICHT anfassen (siehe Post-Mortem: die Deckkraft ist die Tarnung, nicht die Ursache). */
    .rc-face{position:fixed;left:0;top:0;margin:0;z-index:0}
    .rc-flat .rc-face,.rc-face[data-mode="flat"]{opacity:1;position:relative;left:auto;top:auto}
    .rc-face *::selection{background:transparent}
    .rc-face input,.rc-face textarea{user-select:text;-webkit-user-select:text}
    .rc-flat{position:absolute;inset:0;display:grid;place-items:center}
    .rc-flat .rc-face{border:1px solid #E5E7EB;border-radius:14px;
      box-shadow:0 10px 30px rgba(20,28,40,.10)}
    /* L2: lebendes Overlay einer Fläche. Liegt ÜBER dem Canvas und wird mit derselben
       matrix3d ausgerichtet wie das gerasterte Flächen-DOM — Inhalte hier kosten KEINE
       Rasterung (Pupillen, Lider, Transkript). */
    .rc-ov{position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none;
      will-change:transform,opacity;backface-visibility:hidden}
  `;

  class RecherchiCube extends HTMLElement {
    static get observedAttributes(){ return ['active','face-size']; }

    constructor(){
      super();
      const root = this.attachShadow({ mode:'open' });
      const st = document.createElement('style'); st.textContent = CSS;
      root.appendChild(st);
      if (!document.getElementById('rc-face-css')){
        const gs = document.createElement('style'); gs.id = 'rc-face-css'; gs.textContent = CSS;
        document.head.appendChild(gs);
      }
      this._root = root;
      this._faces = [];
      this._els = {};
      this._active = 0;
      this._mode = null;
      this._reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._pending = {};
      this._ovs = {};
      this._squash = 1;
      // Upgrade-Sicherung: Steht das Element schon im DOM, bevor diese Klasse definiert ist
      // (Standalone-Bundle, andere Skript-Reihenfolge), landen Zuweisungen wie el.faces = […]
      // als EIGENE Property auf der Instanz und verdecken nach dem Upgrade den Setter für immer
      // — der Würfel bleibt dann leer weiß. Deshalb hier einmal einsammeln und neu durchsetzen.
      ['faces','active'].forEach(k => {
        if (!Object.prototype.hasOwnProperty.call(this, k)) return;
        const v = this[k]; delete this[k]; this[k] = v;
      });
    }

    /* ---------- Daten ---------- */
    set faces(list){
      this._faces = (list || []).slice(0, 6);
      this._buildFaceEls();
      // Der Koerper heisst _cube. `this._mesh` gab es nie — der Vertipper hiess: neue Flaechen
      // wurden gebaut, aber nie auf den Wuerfel gelegt (weisse Flaechen, nur Schatten sichtbar).
      if (this._cube) this._attachTextures();
    }
    get faces(){ return this._faces.slice(); }

    setFaceHtml(id, html){
      const el = this._els[id];
      if (!el) { this._pending[id] = html; return; }
      if (el.__html === html) return;
      el.__html = html; (el.__des || el.__rot).innerHTML = html;
      // Merken, wie viele Rasterungen es zum Zeitpunkt dieses Inhalts gab: der Boot-Nag unten
      // hoert erst auf, wenn NACH dem letzten Inhalt wirklich gerastert wurde. Ein leerer
      // erster Snapshot heilt damit von selbst, statt bis zum Reload weiss zu bleiben.
      this._paintsAtContent = this._paints | 0;
      this._dirty = true;
      if (this._touch) this._touch(el);
    }

    /* ---------- L2-Overlay: mitausgerichtetes DOM über einer Fläche ---------- */
    overlay(id){
      let ov = this._ovs[id];
      if (ov) return ov;
      ov = document.createElement('div');
      ov.className = 'rc-ov';
      ov.dataset.face = id;
      const fs = parseInt(this.getAttribute('face-size'), 10) || 470;
      ov.style.width = ov.style.height = fs + 'px';
      ov.style.visibility = 'hidden';
      this._ovs[id] = ov;
      if (this._mode === 'flat' && this._els[id]){
        this._els[id].appendChild(ov);
        ov.style.cssText += ';inset:0;width:auto;height:auto;transform:none;visibility:visible;opacity:1';
      } else {
        this._root.appendChild(ov);
      }
      return ov;
    }

    /* ---------- Cartoon-Naht: Squash und Dauerdrehung, beide auf dem Pivot ---------- */
    setSquash(k){ this._squash = Math.max(0.55, Math.min(1.6, k == null ? 1 : k)); }
    setSpin(rate){
      const r = rate || 0;
      if (r){ this._spinSettle = false; this._spinWasOn = true; }
      else if (this._spinRate) this._spinSettle = true;   // zurück auf die nächste ganze Umdrehung
      this._spinRate = r;
    }
    /* Flughoehe der BUEHNE (px, vom Host aus der Motion-Schicht) gegenrechnen. Die Motion-Schicht
       verschiebt das ganze DOM-Element — also auch den Boden im Canvas. Ohne Gegenrechnung stiege
       der Schatten mit dem Wuerfel: wieder Sticker-Verhalten. Der Boden sinkt daher um dieselbe
       Weltstrecke; der Schatten bleibt auf der Bodenlinie und wird mit der Hoehe schwaecher
       (Richtungslicht → die Groesse bleibt, die Dichte nimmt ab). */
    setGroundLift(px){
      const g = this._ground, cam = this._camera;
      if (!g || !cam || !this._dist) return;
      const perPx = 2 * Math.tan(cam.fov * Math.PI / 360) * (this._dist / (this._zoom || 1)) / (this._vh || 1);
      const lift = Math.max(0, px || 0) * perPx;
      if (Math.abs((this._lift || 0) - lift) < 0.0015) return;
      this._lift = lift;
      g.position.y = this._groundY - lift;
      const k = Math.min(1, lift / 0.85);
      g.material.opacity = this._shadowOpa * (1 - k * 0.6);
    }

    /* Neigung zum Zeiger (v4c). Die Motion-Schicht dämpft, hier wird nur abgelegt — eine
       zweite Glättung an dieser Stelle würde die Reaktion träge machen, ohne sie ruhiger
       zu machen. Sie läuft auf dem PIVOT, nie auf der Würfel-Quaternion (Flächenlogik). */
    setLean(x, z){ this._leanX = x || 0; this._leanZ = z || 0; }

    /* Freier Spin aus einer Wischgeschwindigkeit: Achse senkrecht zur Wischrichtung,
       ~turns Umdrehungen, danach rastet die bestehende Ausrollung auf die Fläche ein. */
    spinFlick(vx, vy, turns){
      if (this._mode !== '3d') return;
      const t = Math.max(0.5, turns || 2);
      const sp = Math.hypot(vx || 0, vy || 0) || 1;
      const k = (t * Math.PI * 2 * 3.0) / sp;
      this._target = null; this._down = false; this._dragging = false;
      this._vel.x = (vx || 0) * k; this._vel.y = (vy || 0) * k;
      this._needSnap = true;
    }

    get active(){ return (this._faces[this._active] || {}).id; }
    set active(id){
      const i = this._faces.findIndex(f => f.id === id);
      if (i < 0 || i === this._active) return;
      this._active = i;
      if (this._mode === '3d') this._face(i);
      else this._renderFlat();
      this.dispatchEvent(new CustomEvent('facechange', { detail:{ id }, bubbles:true, composed:true }));
    }

    attributeChangedCallback(n, o, v){
      if (n === 'active') this.active = v;
      if (n === 'face-size') this.style.setProperty('--fs', (parseInt(v,10)||470) + 'px');
    }

    /* ---------- Flächen-DOM ---------- */
    _buildFaceEls(){
      for (const k in this._els) this._dropFace(this._els[k]);
      this._els = {};
      this._faces.forEach(f => {
        const el = document.createElement('div');
        el.className = 'rc-face';
        el.dataset.face = f.id;
        const rot = document.createElement('div'); rot.className = 'rc-rot';
        // --fs auch auf den Quellknoten: nach der Uebernahme haengt er nicht mehr unter .rc-face
        // und wuerde die Variable sonst nicht mehr erben (dann griffe still der 470er Default).
        rot.style.setProperty('--fs', (parseInt(this.getAttribute('face-size'),10)||470) + 'px');
        const des = document.createElement('div'); des.className = 'rc-des';
        rot.appendChild(des); rot.__des = des;
        des.innerHTML = this._pending[f.id] || '';
        el.appendChild(rot); el.__rot = rot; el.__des = des;
        el.__html = this._pending[f.id] || '';
        el.dataset.mode = this._mode || '';
        el.style.setProperty('--fs', (parseInt(this.getAttribute('face-size'),10)||470) + 'px');
        // bewusst im Light-DOM: der HTML-in-Canvas-Polyfill misst im Hauptdokument
        document.body.appendChild(el);
        this._els[f.id] = el;
        this._bindFace(el, f.id);   // bindet intern an el.__rot
      });
      this._pending = {};
    }

    /* Flaeche samt verschobenem Inhaltskind entfernen. __rot liegt nach der Uebernahme durch
       HTMLTexture im Canvas-Teilbaum, nicht mehr im Face — es muss eigens abgeraeumt werden. */
    _dropFace(el){
      if (!el) return;
      try { if (el.__rot) el.__rot.remove(); } catch(_){}
      try { el.remove(); } catch(_){}
    }

    _bindFace(face, id){
      // An __rot binden, nicht ans Face: der Inhalt wird verschoben, das Face bleibt leer
      // zurueck. Listener am Face bekaemen weder Klick noch Eingabe noch Enter zu sehen.
      const el = face.__rot || face;
      const emit = (act, value, key) => this.dispatchEvent(new CustomEvent('faceaction',
        { detail:{ face:id, act, value, key }, bubbles:true, composed:true }));
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-act]'); if (!t) return;
        e.preventDefault(); e.stopPropagation();
        emit(t.dataset.act, t.dataset.val ?? null);
        this._dirty = true;
      });
      el.addEventListener('input', e => {
        const t = e.target.closest('[data-act]'); if (!t) return;
        emit(t.dataset.act, t.value);
        this._dirty = true;
      });
      el.addEventListener('keydown', e => {
        const t = e.target.closest('[data-act]'); if (!t) return;
        if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); emit(t.dataset.act + ':submit', t.value); }
        this._dirty = true;
      });
      // Ziehen geht auch auf der aktiven Fläche: alles außerhalb eines Bedienelements dreht den Würfel
      el.addEventListener('pointerdown', e => {
        if (e.target.closest('[data-act]')) { e.stopPropagation(); return; }
        this._startDrag(e);
      });
    }

    /* ---------- Lebenszyklus ---------- */
    async connectedCallback(){
      // Wiederanhaengen nach einem Umzug im DOM: der Abbau unten lief bereits (Hot-Reload der
      // Host-Logik haelt das Element laenger als einen Macrotask draussen). connectedCallback
      // kam dann zurueck, sprang aber ueber _booted heraus — Animationsschleife tot, Flaechen
      // entfernt, Wuerfel dauerhaft unsichtbar. Das war der "Recherchi ist weg"-Fall.
      if (this._booted){ if (this._stopped) this._revive(); return; }
      this._booted = true; this._stopped = false;
      this.style.setProperty('--fs', (parseInt(this.getAttribute('face-size'),10)||470) + 'px');
      try { await this._init3d(); }
      catch (e){ console.warn('[recherchi-cube] 3D nicht verfügbar:', e && e.message); this._initFlat(); }
    }

    /* Alles abraeumen und von vorn hochfahren. Teurer als _revive(), aber der einzige Weg,
       wenn Renderer und Szene auseinandergelaufen sind. */
    _hardReset(){
      this._teardown();                 // setzt _booted = false, _mode = null, sichert Flaechen-HTML
      this._stopped = false;
      this._buildFaceEls();             // Quellen muessen VOR _attachTextures() dastehen
      this.connectedCallback();          // faehrt dadurch WIRKLICH neu hoch
    }

    /* Der gemeinsame Abbau — frueher nur im disconnectedCallback, jetzt auch fuer _hardReset. */
    _teardown(){
      clearInterval(this._guardIv);
      clearInterval(this._nagIv);
      if (this._onVis){ document.removeEventListener('visibilitychange', this._onVis); this._onVis = null; }
      if (this._onVisTex){ document.removeEventListener('visibilitychange', this._onVisTex); this._onVisTex = null; }
      this._texArmed = false; this._texArm = [];
      this._stopped = true;
      if (this._unbind) this._unbind();
      const keep = {};
      Object.entries(this._els || {}).forEach(([k, el]) => {
        keep[k] = (el && el.__html) || '';
        this._dropFace(el);
      });
      // Texturen freigeben, sonst haelt jede alte HTMLTexture ihren Quellknoten am Leben.
      (this._mats || []).forEach(m => {
        if (m && m.__tex){ try { m.__tex.dispose(); } catch(_){} m.__tex = null; m.map = null; m.__faceId = null; }
      });
      this._pending = Object.assign({}, keep, this._pending || {});
      this._els = {};
      if (this._ro){ try { this._ro.disconnect(); } catch(_){} this._ro = null; }
      if (this._renderer){
        try { this._renderer.setAnimationLoop(null); } catch(_){}
        try { this._renderer.dispose(); } catch(_){}
        this._renderer = null;
      }
      const cv = this._root.querySelector('canvas'); if (cv) cv.remove();
      // Szene UND Koerper mitnehmen. Blieben sie liegen, erbte der Neustart einen halben
      // Zustand — Lichter da, Mesh weg, Schleife laeuft, Buehne leer.
      // Auch die Material-Liste mitnehmen. Blieb sie stehen, lief _attachTextures() nach dem
      // Neustart gegen die ALTEN Materialien des abgeraeumten Wuerfels — der neue bekam keine
      // Texturen (gemessen: maps 0 von 6 nach _hardReset).
      this._mats = null; this._cv3d = null; this._ground = null; this._sun = null; this._org = null;
      this._scene = null; this._cube = null; this._pivot = null; this._camera = null;
      this._booted = false; this._mode = null;
    }

    /* Historie: hier stand eine Klammer, die die Flaechen fuer die Dauer der Rasterung opak
       hielt. Sie ist entfallen, weil die Textur jetzt aus .rc-rot kommt (immer opak) und die
       Deckkraft der Trefferflaeche sie nicht mehr beruehrt. Stubs bleiben, damit Aufrufe an
       dieser Naht nicht brechen — und als Merkzeichen fuer den Fehler: eine Rolle pro Element. */
    _holdOpaque(){}
    _releaseOpaque(){}

    /* Sorgt dafuer, dass die rAF-Schleife des Renderers wirklich laeuft. Immer NACH
       setAnimationLoop() rufen. Mehrfachaufruf ist unschaedlich — start() ist idempotent. */
    _pump(){
      const r = this._renderer, a = r && r._animation;
      if (a && typeof a.start === 'function'){ try { a.start(); } catch(_){} }
    }

    /* Nach dem Abbau wieder hochfahren, ohne den Renderer neu zu bauen. */
    _revive(){
      this._stopped = false;
      // Kein Koerper in der Szene -> nichts zu wiederbeleben. Komplett neu hochfahren,
      // sonst laeuft die Schleife weiter und malt eine leere Buehne (gemessen: 94 021 Frames
      // ohne Mesh). Genau der Zustand, den der Nutzer als "Recherchi ist weg" sieht.
      if (this._mode === '3d' && (!this._cube || !this._cube.parent)){
        this._hardReset();
        return;
      }
      this._buildFaceEls();
      if (this._mode === '3d' && this._renderer){
        this._attachTextures();
        if (this._ro) this._ro.observe(this);
        this._resize();
        this._renderer.setAnimationLoop(t => this._frame(t));
        this._pump();
      } else if (this._mode === 'flat'){
        this._renderFlat();
      }
      // KEIN erneutes 'cubeready': das ist ein Wiederanlauf, kein Erststart. Der Host haengt
      // daran Erstauftritt (Platzhalter ausblenden, messen, hopSmall) — beim Umzug im DOM waere
      // das ein zweiter Auftritt mitten im Betrieb.
      this.dispatchEvent(new CustomEvent('cuberevived', { detail:{ mode:this._mode }, bubbles:true, composed:true }));
    }

    disconnectedCallback(){
      // Ein Verschieben im DOM meldet erst disconnected, dann connected — deshalb verzögert
      // prüfen und nur wirklich abbauen, wenn das Element draußen bleibt. renderer.dispose()
      // gibt das GPU-Device frei und würde eine parallel laufende Instanz mitreißen.
      setTimeout(() => {
        if (this.isConnected) return;
        this._teardown();
      }, 0);
    }


    /* Raeumt 3D ab und baut die flache Ansicht. Lieber ein flaches Recherchi als gar keins. */
    forceFlat(){
      if (this._mode === 'flat') return;
      clearInterval(this._guardIv);
      this._stopped = true;
      if (this._renderer){ try { this._renderer.setAnimationLoop(null); } catch(_){}
        try { this._renderer.dispose(); } catch(_){} this._renderer = null; }
      if (this._ro){ try { this._ro.disconnect(); } catch(_){} this._ro = null; }
      const cv = this._root.querySelector('canvas'); if (cv) cv.remove();
      this._stopped = false;
      this._initFlat();
      this.dispatchEvent(new CustomEvent('cubeready', { detail:{ mode:'flat' }, bubbles:true, composed:true }));
    }

    /* Selbstheilung statt Fremdueberwachung. Der alte Watchdog im Host zaehlte nur Frames und
       schaltete gesunde Wuerfel ab, sobald die Vorschau kurz nicht zeichnete. Dieser hier
       (a) laeuft nur, wenn das Fenster wirklich sichtbar und das Element verbunden ist,
       (b) versucht ZUERST die Pumpe nachzuarmen — billig und folgenlos, falls sie schon laeuft,
       (c) gibt erst nach einem gescheiterten Nacharmen auf und wechselt auf flach.
       Damit kann er nicht mehr falsch-positiv ausloesen, deckt aber den echten Fall ab. */
    _guard(){
      clearInterval(this._guardIv);
      let last = -1, armed = 0;
      this._guardIv = setInterval(() => {
        if (this._mode !== '3d' || this._stopped || !this.isConnected) return;
        if (document.visibilityState !== 'visible') { last = this._frames | 0; return; }
        // Malt die Schleife auf eine Szene ohne Koerper? Dann hilft kein Nacharmen.
        if (!this._cube || !this._cube.parent){ clearInterval(this._guardIv); this._hardReset(); return; }
        const n = this._frames | 0;
        if (n !== last){ last = n; armed = 0; return; }   // malt — alles gut
        if (armed === 0){ armed = 1; this._pump(); return; }
        clearInterval(this._guardIv);
        this._hardReset();
      }, 1500);
    }

    _initFlat(){
      this._mode = 'flat';
      Object.values(this._els).forEach(e => { e.dataset.mode = 'flat'; });
      const wrap = document.createElement('div'); wrap.className = 'rc-flat';
      this._root.appendChild(wrap); this._flat = wrap;
      this._renderFlat();
      this.dispatchEvent(new CustomEvent('cubeready', { detail:{ mode:'flat' }, bubbles:true, composed:true }));
    }
    _renderFlat(){
      if (!this._flat) return;
      Object.values(this._els).forEach(el => { if (el.parentNode !== this._root) this._root.appendChild(el); el.style.display = 'none'; });
      const f = this._faces[this._active]; if (!f) return;
      const el = this._els[f.id]; if (!el) return;
      el.style.display = 'flex'; this._flat.appendChild(el);
    }

    async _init3d(){
      const THREE = await import('three');
      if (!THREE.HTMLTexture) throw new Error('HTMLTexture fehlt (three < 0.185)');
      const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      if (!('requestPaint' in HTMLCanvasElement.prototype)){
        const { installHtmlInCanvasPolyfill } = await import('three-html-render/polyfill');
        installHtmlInCanvasPolyfill();
      }
      this._THREE = THREE;

      // Canvas selbst anlegen: layoutsubtree muss stehen, BEVOR der Renderer seinen Kontext
      // holt — sonst registriert der HTML-in-Canvas-Polyfill den Paint-Handler nicht
      // ("setting onpaint on a canvas without layoutsubtree").
      const cv = document.createElement('canvas');
      cv.setAttribute('layoutsubtree', '');
      cv.style.position = 'absolute'; cv.style.inset = '0'; cv.style.width = '100%'; cv.style.height = '100%';
      this._root.appendChild(cv);

      const renderer = this._renderer = new THREE.WebGPURenderer({ canvas: cv, antialias:true, alpha:true });
      await renderer.init();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      // Ohne Tone Mapping clippt jedes Licht > 1 hart: Weiß brennt aus, Dimmen macht alles grau.
      renderer.toneMapping = THREE.NoToneMapping;
      const W = this.clientWidth || 300, H = this.clientHeight || 300;
      renderer.setSize(W, H, false);

      const scene = this._scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      // Beleuchtungskonzept: die Textur IST die UI, jede Lichtsumme verzerrt sie.
      // Also Grundlicht so wählen, dass jede zugewandte Fläche bei rund 1,0 landet
      // (Weiß bleibt Weiß, hellgraue Flächen bleiben unterscheidbar), und die Plastizität
      // aus dem Gefälle zwischen den Flächen plus den Fasen-Glanzlichtern holen.
      // Der Löwenanteil der Flächenhelligkeit kommt aus FLAT (Eigenleuchten, siehe Material).
      // Die Lichter modellieren nur noch: klein gehalten, sonst überstrahlen sie die UI wieder.
      // Hauptlicht steht vorn und leicht UNTER der Kamera — die zugewandte Fläche ist damit
      // die hellste, die Oberseite fällt ab. Der Schatten unten ist eine eigene Scheibe
      // (_shadow) und hängt nicht am Lichtstand, bleibt also, wo er ist.
      // Kalibriert gegen den Benchmark-Screenshot (Grün gemessen: Soll 155,183,106).
      // Diese vier Zahlen sind abgenommen — nicht ohne Messung gegen den Benchmark ändern.
      // Das Environment liefert den weichen Grundton (und damit Weiß, das Weiß bleibt),
      // die gerichteten Lichter nur die Form.
      scene.environmentIntensity = 0.45;
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      // Einzige Abweichung zum abgenommenen Stand: der Hauptlicht-STANDORT wandert nach vorn
      // (statt 2.2/4.4/3.2 hoch oben), damit die Oberseite nicht heller liest als die Front.
      // Intensität unverändert 0.35 — die Gesamthelligkeit bleibt also, wie sie war.
      const key = new THREE.DirectionalLight(0xffffff, 0.35); key.position.set(1.8, 1.1, 4.2); scene.add(key);
      const fill = new THREE.DirectionalLight(0xeef3ff, 0.14); fill.position.set(-3, 1.2, 2); scene.add(fill);

      const camera = this._camera = new THREE.PerspectiveCamera(30, W/H, 0.1, 100);
      this._camDir = new THREE.Vector3(0.40, 0.30, 5.85).normalize();
      this._camBase = new THREE.Vector3();
      this._lookAt = new THREE.Vector3();
      this._zoom = 1; this._zoomTarget = 1;
      this._fit(W, H);
      const hz = parseFloat(this.getAttribute('hover-zoom')) || 1.06;
      this.addEventListener('pointerenter', () => { this._zoomTarget = hz; });
      this.addEventListener('pointerleave', () => { if (!this._down) this._zoomTarget = 1; });

      const D = 1.4; this._half = D/2;
      const geo = new RoundedBoxGeometry(D, D, D, 7, 0.13);
      // Zwei Anteile pro Fläche, bewusst getrennt:
      //   emissiveMap  = die UI, lichtunabhängig (Weiß bleibt 255, Grün bleibt #99CC33)
      //   map          = dieselbe UI, aber beleuchtet — liefert NUR noch die Modellierung
      //                  der Fasen und Kanten, damit der Körper Volumen behält.
      // Beide Anteile multiplizieren dieselbe Textur, deshalb bleibt die Sättigung exakt.
      this._mats = new Array(6).fill(null).map(() => new THREE.MeshStandardMaterial({
        color:0xffffff, roughness:0.52, metalness:0.02, transparent:true,
        emissive:0xffffff, emissiveIntensity:FLAT
      }));
      const cube = this._cube = new THREE.Mesh(geo, this._mats);
      // Weißer Innenkörper: zeigt eine noch nicht gerasterte (also transparente) Fläche als
      // Weiß statt als Schwarz. Ohne ihn multipliziert eine leere Textur die Fläche auf RGB 0.
      const inner = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:0xffffff, roughness:0.6, metalness:0, emissive:0xffffff, emissiveIntensity:FLAT }));
      inner.scale.setScalar(0.992);
      cube.add(inner);
      // Eigener Träger für die Idle-Bewegung: der Würfel selbst behält seine Orientierung
      // (daran hängt die Flächenlogik), das Schweben passiert eine Ebene darüber.
      const pivot = this._pivot = new THREE.Group();
      pivot.position.y = 0.30;                       // Ruhe-Flughoehe, siehe _hover
      pivot.add(cube);
      scene.add(pivot);

      /* ECHTER BODEN statt gemalter Scheibe (v4, 2026-08-28).
         Vorher: eine kamerazugewandte PlaneGeometry mit gemalter Radial-Textur — ein Sticker im
         Raum. Die Drehung lief optisch darueber, und jedes Verschieben/Skalieren des Wuerfels
         im Interface haette den Schatten von Hand nachluegen muessen.
         Jetzt: unsichtbare Bodenebene (ShadowMaterial nimmt NUR den Schatten auf) + ein Licht
         mit castShadow. Der Schatten ist damit Konsequenz der Geometrie: er kippt mit jeder
         Drehung und folgt dem Koerper, wohin er auch gesetzt wird.
         Der frueher gefuerchtete perspektivische Horizont entfaellt — die Ebene selbst ist
         unsichtbar, sie hat keine sichtbare Kante.
         Kosten: eine zweite Renderpass pro Frame (ein Wuerfel, eine Ebene — vernachlaessigbar). */
      renderer.shadowMap.enabled = true;
      // VSM statt PCF: PCF liefert im WebGPU-Pfad eine harte Kante, und eine harte Kante liest
      // als Platte, nicht als Schatten. VSM blurrt die Schattenkarte (blurSamples/radius) und
      // gibt genau den weichen Rand, den die gemalte Scheibe frei hatte.
      renderer.shadowMap.type = THREE.VSMShadowMap;
      /* Eigenes Licht NUR fuer den Schatten. Intensitaet nahe Null, damit die abgenommene
         Kalibrierung (environment .45 / ambient .75 / key .35 / fill .14) unberuehrt bleibt:
         ShadowMaterial liest die SCHATTENMASKE, nicht die Lichtstaerke. Die Tiefe des Schattens
         steuert deshalb material.opacity — nicht die Intensitaet dieses Lichts. */
      const sun = this._sun = new THREE.DirectionalLight(0xffffff, 0.02);
      // Fast senkrecht von oben, minimal nach vorn versetzt: der Schatten sitzt UNTER dem Koerper
      // (kein langer Schlagschatten, der als zweites Objekt liest) und verraet die Drehung trotzdem.
      sun.position.set(0.42, 4.4, 0.95);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -1.7; sun.shadow.camera.right = 1.7;
      sun.shadow.camera.top = 1.7; sun.shadow.camera.bottom = -1.7;
      sun.shadow.camera.near = 1.2; sun.shadow.camera.far = 8;
      sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.02;
      // Weich und schwach: der Wurfschatten ist Atmosphaere, nicht Information (Pet-Studio
      // KONZEPT_groundplane §2/§3). Bei VSM macht radius*blurSamples die Weichheit — eine harte
      // Kante unter einer schwebenden Figur liest als aufgeklebte Platte.
      sun.shadow.radius = 14; sun.shadow.blurSamples = 24;
      sun.shadow.camera.updateProjectionMatrix();
      scene.add(sun);
      cube.castShadow = true;
      this._shadowOpa = 0.26;
      const ground = this._ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14),
        new THREE.ShadowMaterial({ color:0x121A22, opacity:this._shadowOpa, transparent:true, depthWrite:false }));
      ground.rotation.x = -Math.PI / 2;
      // Bodenlinie etwas unter der Ruhe-Unterkante (-0.7): der Wuerfel steht nicht auf dem Boden,
      // er schwebt knapp darueber — deshalb ein Wurfschatten mit Abstand, kein Kontaktfleck.
      /* FLUGHOEHE (v4b, 2026-08-29). Recherchi schwebt, er steht nicht — also braucht er Luft
         unter sich. Der Boden bleibt, wo er ist; der Koerper geht hoch. Weil das Licht fast
         senkrecht steht, bleibt der Schatten dabei an seinem Platz und wird nur groesser und
         schwaecher: genau die Aussage "ich bin hoch", einmal erzaehlt, nicht zweimal. */
      this._hover = 0.30;
      this._groundY = -0.90;
      ground.position.y = this._groundY;
      ground.receiveShadow = true;
      ground.renderOrder = -1;
      scene.add(ground);

      this._fit(this.clientWidth || 300, this.clientHeight || 300);
      this._attachTextures();
      this._quatFor = i => {
        const T = this._THREE;
        const n = new T.Vector3(...FACE_N[i]), up = new T.Vector3(...FACE_UP[i]);
        const r = new T.Vector3().crossVectors(up, n).normalize();
        const q = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(r, up, n).invert());
        // Ruhepose leicht gekippt: die aktive Fläche bleibt lesbar, der Würfel bleibt ein Würfel
        const tilt = new T.Quaternion().setFromEuler(new T.Euler(0.20, -0.42, 0, 'XYZ'));
        return tilt.multiply(q);
      };
      cube.quaternion.copy(this._quatFor(this._active));
      this._target = null;
      this._vel = { x:0, y:0 };
      this._clock = new THREE.Clock();
      this._ray = new THREE.Raycaster(); this._ndc = new THREE.Vector2();
      this._bindInput(cv);
      this._ro = new ResizeObserver(() => this._resize()); this._ro.observe(this);
      this._mode = '3d';
      Object.values(this._els).forEach(e => { e.dataset.mode = '3d'; });
      renderer.setAnimationLoop(t => this._frame(t));
      this._pump();
      this._guard();
      // Ein verstecktes Dokument bekommt KEINE rAF-Ticks — der Zaehler steht dann voellig zu
      // Recht still. Beim Zurueckkommen die Pumpe sicherheitshalber nacharmen.
      this._onVis = () => { if (document.visibilityState === 'visible') this._pump(); };
      document.addEventListener('visibilitychange', this._onVis);
      /* Paint-Kette. WICHTIG (2026-08-28, Ursache des weissen Wuerfels): HTMLTexture setzt
         auf ihrer Eltern-Canvas SELBST einen onpaint-Handler, der needsUpdate hochzieht.
         Wer hier `cv.onpaint = …` schreibt, loescht genau diesen Handler — die Textur wird
         danach nie wieder hochgeladen und der Wuerfel bleibt beim ersten, leeren Snapshot:
         weiss. Deshalb wird der vorhandene Handler GEKETTET, nie ersetzt. Das Zuschalten der
         Maps passiert nicht mehr hier (siehe _attachTextures), armAll() ist nur Diagnose. */
      const armAll = () => {
        if (this._texArmed) return;
        this._texArmed = true;
        // Diagnose-Beleg. NICHT die Deckkraft: die Rasterung ist davon unabhaengig (der Polyfill
        // setzt auf seinem Quellknoten selbst inline opacity:0, und der Wuerfel zeigt Inhalt).
        // Aussagekraeftig ist, ob die Textur wirklich an unserem Inhaltsknoten haengt.
        try {
          // Paarweise: jedes Material traegt seine __faceId — nur so vergleicht man dieselbe
          // Flaeche. Der Polyfill wickelt den Knoten ein, deshalb Enthaltensein statt Identitaet.
          const pairs = (this._mats || []).filter(m => m && m.__faceId && m.__tex && m.__tex.isHTMLTexture);
          this._texSrcOk = pairs.length > 0 && pairs.every(m => {
            const f = this._els[m.__faceId]; if (!f) return false;
            const own = f.__rot || f;
            const src = m.__tex.source && m.__tex.source.data;
            return !!(src && (src === own || src.contains(own) || own.contains(src)));
          });
        } catch(_){ this._texSrcOk = null; }
        (this._texArm || []).forEach(fn => fn());
        this._texArm = [];
      };
      if ('requestPaint' in cv){
        this._cv3d = cv;
        const prevPaint = cv.onpaint;
        cv.onpaint = (...a) => {
          if (typeof prevPaint === 'function') { try { prevPaint.apply(cv, a); } catch(_){} }
          this._paints = (this._paints | 0) + 1;
          this._lastPaintAt = performance.now();
          /* WANN traegt die Flaeche Bild? (v4d — die Zaehlschwelle war falsch geraten.)
             Erst hiess es "drei Rasterungen nach dem letzten Inhalt". Gemessen passieren in
             dieser Umgebung genau ZWEI — die Schwelle war unerreichbar, `cubepainted` feuerte
             nie und der Host nahm jedes Mal den 3,4-s-Notausstieg. Die Zahl war nie die Frage:
             gesucht ist der Moment, in dem die Rasterung ZUR RUHE gekommen ist. Also mindestens
             eine Rasterung nach dem Inhalt, und dann entweder drei (schnelle Bahn) oder eine
             Pause von 700 ms ohne weitere — das ist "fertig", unabhaengig davon, wie oft die
             Umgebung rastert. Die Pause prueft `_bootNag`. */
          this._maybePainted();
          armAll();
          this._refresh = 2;
          (this._mats || []).forEach(m => { if (m.__tex) m.__tex.needsUpdate = true; });
        };
        armAll();
        try { cv.requestPaint(); } catch(_){}
        // Erste Rasterung kann hinter Fonts, Bildern oder einem noch nicht sichtbaren
        // Container liegen. Deshalb länger nachfordern und an den bekannten Bereitschafts-
        // signalen noch einmal — das war die Ursache für "Würfel erst nach dem 2. Reload".
        let boots = 0;
        const bootIv = setInterval(() => {
          this._needPaint = true;
          this._maybePainted();                     // die 700-ms-Ruhe kann lange vor dem Nag greifen
          if (this._stopped || this._painted) return clearInterval(bootIv);
          if (++boots > 24){ clearInterval(bootIv); this._bootNag(); }
        }, 180);
        const kick = () => { if (!this._stopped){ this._needPaint = true; this._dirty = true; this._resize(); } };
        if (document.readyState !== 'complete') window.addEventListener('load', kick, { once:true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(kick).catch(()=>{});
        if ('IntersectionObserver' in window){
          const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) kick(); });
          io.observe(this); this._io = io;
        }
        // Notnagel, falls onpaint gar nicht feuert: erst rastern lassen, dann armen —
        // ein Upload ohne Snapshot wirft im Polyfill.
        setTimeout(() => { try { cv.requestPaint(); } catch(_){} }, 1500);
        // Und ein Notnagel HINTER dem Notnagel, ohne rAF. Laedt die Seite in einem versteckten
        // oder gedrosselten Tab, feuert requestAnimationFrame nie — die Kette oben bleibt genau
        // dort stehen, die Texturen werden nie angehaengt, und der Wuerfel rendert danach
        // unbegrenzt WEISS auf heller Buehne (sichtbar bleibt nur sein Schatten). Genau der
        // Zustand "Recherchi ist weg" bei laufender Schleife. Uhr statt Frame, plus ein
        // Nachfassen, sobald das Dokument wieder sichtbar wird.
        setTimeout(() => { try { cv.requestPaint(); } catch(_){} }, 3000);
        this._onVisTex = () => {
          if (document.visibilityState !== 'visible' || this._stopped) return;
          this._needPaint = true; this._dirty = true;
          try { cv.requestPaint(); } catch(_){}
        };
        document.addEventListener('visibilitychange', this._onVisTex);
      } else armAll();
      this.dispatchEvent(new CustomEvent('cubeready', { detail:{ mode:'3d' }, bubbles:true, composed:true }));
      if (!this._reduced) this.spin();
    }

    /* Entwurfsrahmen -> Rasterbox. EINE Umrechnung an EINER Stelle: die 470 Entwurfspixel werden
       auf die tatsaechliche Rasterbox skaliert, die UV-Streckung auf das Quadrat hebt es auf.
       Die Roll-Korrektur (aufrechter Inhalt) laeuft hier mit — rotiert wird das QUADRAT, danach
       skaliert; anders herum waere jede gedrehte Flaeche verzerrt. */
    _desFit(one){
      const fs = parseInt(this.getAttribute('face-size'), 10) || 470;
      const list = one ? [one] : this._faces.map(f => this._els[f.id]);
      list.forEach(el => {
        if (!el || !el.__des || !el.__rot) return;
        const W = el.__rot.offsetWidth || fs, H = el.__rot.offsetHeight || fs;
        const k = el.__roll || 0;
        el.__des.style.transform = 'scale(' + (W / fs).toFixed(5) + ',' + (H / fs).toFixed(5) + ')' +
          (k ? ' rotate(' + (-k * 90) + 'deg)' : '');
      });
    }

    _maybePainted(){
      if (this._painted || this._paintsAtContent == null) return;
      const n = (this._paints | 0) - (this._paintsAtContent | 0);
      if (n < 1) return;
      /* Zwei Wege, und die Reihenfolge ist Absicht (v4d, beide Male gemessen):
         DREI Rasterungen nach dem Inhalt ist der Normalfall — die ersten ein bis zwei sind hier
         nachweislich noch leer, deshalb reicht "eine" nicht (Probe: bei 1 Rasterung stand der
         Wuerfel weiss im Bild, waehrend der Platzhalter schon weg war).
         Das RUHEFENSTER ist der Notausstieg fuer traege Umgebungen, in denen es ueberhaupt nur
         zwei Rasterungen gibt — dort feuerte das Signal sonst nie und der Host nahm jedes Mal
         den 3,4-s-Timeout. 2,5 s, weil die Luecke zwischen zwei Rasterungen hier ueber eine
         Sekunde betragen kann: ein kuerzeres Fenster meldet mitten in die Boot-Kette hinein. */
      const quiet = performance.now() - (this._lastPaintAt || 0) > 2500;
      if (n < 3 && !quiet) return;
      this._painted = true;
      clearInterval(this._nagIv);
      this.dispatchEvent(new CustomEvent('cubepainted', { bubbles:true, composed:true }));
    }

    /* Nachfassen, bis der Inhalt WIRKLICH im Bild ist (v4, 2026-08-28).
       Der weisse Wuerfel kam zurueck, obwohl die Verdrahtung gruen meldete: maps 6, _texSrcOk
       true, texture.version steigend — und trotzdem 1481 Frames ohne Flaecheninhalt. Der Grund
       ist nicht die Verdrahtung, sondern dass die ersten Rasterungen LEER waren; nach 6 s
       forderte niemand mehr eine an. Deshalb: weiter nachfordern, bis nach dem letzten
       Inhaltswechsel mindestens drei Rasterungen gelaufen sind. Hart begrenzt, kostet also
       nur im Bootfenster etwas. */
    _bootNag(){
      clearInterval(this._nagIv);
      let n = 0;
      this._nagIv = setInterval(() => {
        if (this._stopped || this._mode !== '3d'){ clearInterval(this._nagIv); return; }
        this._maybePainted();                       // prueft auch die 700-ms-Ruhe
        if (this._painted || ++n > 40){ clearInterval(this._nagIv); return; }
        this._needPaint = true; this._dirty = true;
      }, 600);
    }

    setVideoFace(id, src){
      if (this._vid && this._vidFace === id) return;
      this._vidFace = id;
      const v = this._vid = document.createElement('video');
      v.src = src; v.playsInline = true; v.preload = 'auto'; v.muted = false;
      v.style.cssText = 'position:fixed;width:2px;height:2px;opacity:0;pointer-events:none;left:0;top:0';
      v.addEventListener('ended', () => { this._vidPlaying = false; });
      v.addEventListener('loadeddata', () => { this._vidDrawn = null; });
      document.body.appendChild(v);
      const cv = this._vcv = document.createElement('canvas'); cv.width = cv.height = 560;
      const f = (this._faces || []).find(x => x.id === id) || {};
      this._vidLabel = f.l || ''; this._vidSub = f.sub || '';
      this._vidPlaying = false; this._vidDrawn = null;
      this._drawVideo();                       // Flaeche ist ab der ersten Sekunde nie blank
      if (this._mats) this._attachTextures();
    }
    toggleVideo(){
      const v = this._vid; if (!v) return;
      if (this._vidPlaying){ v.pause(); this._vidPlaying = false; }
      else v.play().then(() => { this._vidPlaying = true; }).catch(() => {});
    }
    _drawVideo(){
      const cv = this._vcv, v = this._vid; if (!cv || !v) return;
      const S = cv.width, g = cv.getContext('2d');
      g.setTransform(1,0,0,1,0,0);
      // Rand frei lassen: die Rundung der Box zieht die Textur sonst um die Kante
      const pad = Math.round(S * 0.085), R = Math.round(S * 0.075), IW = S - pad * 2;
      g.fillStyle = '#fff'; g.fillRect(0,0,S,S);
      g.save();
      g.beginPath();
      if (g.roundRect) g.roundRect(pad, pad, IW, IW, R);
      else g.rect(pad, pad, IW, IW);
      g.clip();
      g.fillStyle = '#EEF2F5'; g.fillRect(pad, pad, IW, IW);
      if (v.readyState >= 2 && v.videoWidth){
        const vw = v.videoWidth, vh = v.videoHeight, sw = vw * 0.72, sx = vw * 0.14, sy = vh * 0.27;
        g.drawImage(v, sx, sy, sw, sw, pad, pad, IW, IW);
      } else if (this._vidLabel){
        g.textAlign = 'center';
        g.fillStyle = '#2B3034';
        g.font = '700 62px Roboto,system-ui,sans-serif';
        g.fillText(this._vidLabel, S / 2, S * 0.40);
        g.fillStyle = '#7C848C';
        g.font = '400 34px Roboto,system-ui,sans-serif';
        g.fillText(this._vidSub || '', S / 2, S * 0.40 + 52);
      }
      g.restore();
      if (!this._vidPlaying){
        g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.arc(S/2, S/2, 62, 0, 7); g.fill();
        g.fillStyle = '#2A3A1E'; g.beginPath();
        g.moveTo(S/2-17, S/2-31); g.lineTo(S/2-17, S/2+31); g.lineTo(S/2+35, S/2); g.closePath(); g.fill();
      }
      this._vidDrawn = this._vidPlaying;
      if (this._vidTex) this._vidTex.needsUpdate = true;
    }

    _attachTextures(){
      if (!this._mats || !this._THREE) return;
      const THREE = this._THREE;
      this._faces.forEach((f, i) => {
        const el = this._els[f.id]; if (!el) return;
        const mi = MAT_OF.indexOf(i) >= 0 ? MAT_OF.indexOf(i) : i;
        const mat = this._mats[mi]; if (!mat) return;
        if (mat.__faceId === f.id) return;
        mat.__faceId = f.id;
        if (f.id === this._vidFace && this._vcv){
          const vt = this._vidTex = new THREE.CanvasTexture(this._vcv);
          vt.colorSpace = THREE.SRGBColorSpace; vt.anisotropy = 8;
          mat.__tex = vt; el.__mat = mat; el.__slot = i;
          mat.map = vt; mat.emissiveMap = vt; mat.needsUpdate = true; vt.needsUpdate = true;
          return;
        }
        // Quelle ist der INHALT, nicht die Trefferflaeche (siehe Wurzelfix oben).
        const tex = new THREE.HTMLTexture(el.__rot);
        tex.colorSpace = THREE.SRGBColorSpace;

        tex.anisotropy = 8;
        mat.__tex = tex;
        el.__mat = mat; el.__slot = i;
        /* Map SOFORT setzen — wie im three-Beispiel (webgpu_materials_texture_html). Die
           HTMLTexture haengt ihren eigenen onpaint-Handler an ihre Eltern-Canvas und setzt
           needsUpdate selbst; ein verzoegertes Zuschalten braucht sie nicht. Gegen die noch
           leere erste Rasterung schuetzt der weisse Innenkoerper, nicht ein Warteschritt. */
        mat.map = tex; mat.emissiveMap = tex; mat.needsUpdate = true; tex.needsUpdate = true;
      });
      // Der Entwurfsrahmen muss VOR der ersten Rasterung auf die Rasterbox passen — sonst ist
      // der erste Snapshot beschnitten und die Flaeche zeigt einen halben Entwurf.
      this._desFit();
      // Inhalt geändert: NICHT direkt needsUpdate setzen (der Upload läse eine noch nicht
      // gerasterte Fläche und die käme schwarz zurück), sondern eine Rasterung anfordern.
      this._touch = () => { this._needPaint = true; };
    }

    /* ---------- Inhalt jeder sichtbaren Fläche aufrecht stellen ---------- */
    _upright(){
      const T = this._THREE, vd = new T.Vector3();
      this._roll = this._roll || new Array(6).fill(0);
      const HYST = 0.20; // ~11°, verhindert Flackern genau auf der Kippgrenze
      for (let i = 0; i < this._faces.length; i++){
        const upW = new T.Vector3(...FACE_UP[i]).applyQuaternion(this._cube.quaternion);
        vd.copy(upW).transformDirection(this._camera.matrixWorldInverse);
        const roll = Math.atan2(vd.x, vd.y);
        const cur = this._roll[i];
        let d = roll - cur * (Math.PI / 2);
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        if (Math.abs(d) < Math.PI / 4 + HYST) continue;
        const k = ((Math.round(roll / (Math.PI / 2)) % 4) + 4) % 4;
        if (cur === k) continue;
        this._roll[i] = k;
        const f = this._faces[i], el = this._els[f.id];
        if (el && el.__rot){
          el.__roll = k;
          this._desFit(el);
          this._dirty = true; this._rollPaint = true;
        }
      }
    }

    /* ---------- Ausrichtung der HTML-Flächen (native Pointer-Events) ---------- */
    _align(){
      const T = this._THREE, cv = this._renderer.domElement;
      const W = cv.clientWidth, H = cv.clientHeight;
      if (!this._vp || this._vpW !== W || this._vpH !== H){
        this._vp = new T.Matrix4().set(W/2,0,0,W/2, 0,-H/2,0,H/2, 0,0,1,0, 0,0,0,1);
        this._vpW = W; this._vpH = H;
      }
      // Flaechen liegen fix am Viewport (siehe CSS). Ihre Ecke muss auf der Canvas-Ecke sitzen,
       // sonst zeigt die matrix3d-Ausrichtung ins Leere — und eine unsichtbare Trefferflaeche
       // saesse irgendwo im Dokument statt ueber dem Wuerfel.
      const cr = cv.getBoundingClientRect();
      if (!this._org || Math.abs(this._org.x - cr.left) > 0.5 || Math.abs(this._org.y - cr.top) > 0.5){
        this._org = { x: cr.left, y: cr.top };
        this._faces.forEach(f => {
          const el = this._els[f.id];
          if (el && this._mode !== 'flat'){ el.style.left = cr.left + 'px'; el.style.top = cr.top + 'px'; }
        });
      }
      // Rasterbox beobachten: sie gehoert dem Canvas-Teilbaum und aendert sich zweimal ohne
      // unser Zutun — bei der Uebernahme durch HTMLTexture und bei jedem Resize. Aendert sie
      // sich, muss der Entwurfsrahmen neu darauf abgebildet werden (sonst sitzt das Gesicht
      // falsch, ohne dass ein Wert im Code falsch waere).
      const src = this._els[(this._faces[0] || {}).id];
      if (src && src.__rot){
        const sw = src.__rot.offsetWidth, sh = src.__rot.offsetHeight;
        if (sw && (sw !== this._srcW || sh !== this._srcH)){
          this._srcW = sw; this._srcH = sh;
          this._desFit(); this._needPaint = true; this._dirty = true;
          // Direkt rastern lassen, nicht erst im naechsten Frame-Gate: dieser Moment ist der
          // erste, in dem der Entwurf ueberhaupt richtig auf der Quelle sitzt.
          try { if (this._cv3d) this._cv3d.requestPaint(); } catch(_){}
        }
      }
      const half = this._half;
      // Sichtbare Orientierung = WELT-Quaternion: die Pivot-Drehung (Spin, Idle) muss mitzählen,
      // sonst gated das Overlay gegen eine Fläche, die gar nicht vorn steht.
      const wq = this._wq = this._wq || new T.Quaternion();
      this._cube.getWorldQuaternion(wq);
      const camDir = new T.Vector3().subVectors(this._camera.position, this._cube.position).normalize();
      const mvp = new T.Matrix4(), p2l = new T.Matrix4(), scl = new T.Matrix4();
      this._faces.forEach((f, i) => {
        const el = this._els[f.id]; if (!el) return;
        const n = new T.Vector3(...FACE_N[i]);
        let up = new T.Vector3(...FACE_UP[i]);
        let right = new T.Vector3().crossVectors(up, n).normalize();
        const k = (this._roll && this._roll[i]) || 0;
        if (k){
          const a = k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
          const r2 = right.clone().multiplyScalar(ca).add(up.clone().multiplyScalar(sa));
          const u2 = right.clone().multiplyScalar(-sa).add(up.clone().multiplyScalar(ca));
          right = r2; up = u2;
        }
        const w = el.offsetWidth || 1, h = el.offsetHeight || 1;
        p2l.makeBasis(right, up, n);
        p2l.setPosition(n.clone().multiplyScalar(half + 0.002)
          .add(right.clone().multiplyScalar(-half)).add(up.clone().multiplyScalar(half)));
        scl.set((half*2)/w,0,0,0, 0,-(half*2)/h,0,0, 0,0,1,0, 0,0,0,1);
        p2l.multiply(scl);
        mvp.multiplyMatrices(this._camera.projectionMatrix, this._camera.matrixWorldInverse);
        mvp.multiply(this._cube.matrixWorld).multiply(p2l).premultiply(this._vp);
        el.style.transformOrigin = '0 0';
        el.style.transform = 'matrix3d(' + mvp.elements.join(',') + ')';
        const facing = n.clone().applyQuaternion(wq).dot(camDir);
        // Jede ausreichend zugewandte Fläche ist bedienbar — nicht nur die aktive. Sonst
        // müsste man den Würfel erst fertig drehen, um einen sichtbaren Knopf zu treffen.
        const pe = (facing > 0.55 && !this._dragging && !this._down) ? 'auto' : 'none';
        el.style.pointerEvents = pe;
        if (el.__rot) el.__rot.style.pointerEvents = pe;   // hier liegt der Inhalt wirklich
        const ov = this._ovs[f.id];
        if (ov && this._mode !== 'flat'){
          ov.style.transform = el.style.transform;
          // Nur nahezu frontal einblenden. Beim Ziehen aus (das rechteckige Overlay stände dann
          // schräg über der Silhouette); beim Spin entscheidet allein der Winkel.
          const moving = this._down || this._dragging;
          const vis = moving ? 0 : Math.max(0, Math.min(1, (facing - 0.78) / 0.06));
          ov.style.opacity = String(vis);
          ov.style.visibility = vis > 0.01 ? 'visible' : 'hidden';
        }
      });
    }

    /* Zeigerpunkt in Flächenkoordinaten (−1..1), aus demselben Strahl wie _hitAct.
       Ohne Treffer: face null plus Bildschirm-Normalkoordinaten, damit die Augen dem
       Zeiger auch außerhalb des Würfels folgen können. */
    _facePt(e){
      if (!this._ray || !this._cube || !this._renderer) return null;
      const cv = this._renderer.domElement, r = cv.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const sy = -(((e.clientY - r.top) / r.height) * 2 - 1);
      this._ndc.set(sx, sy);
      this._ray.setFromCamera(this._ndc, this._camera);
      const hit = this._ray.intersectObject(this._cube, false)[0];
      if (!hit || !hit.uv) return { face:null, x:0, y:0, facing:0, sx, sy };
      const T = this._THREE, n = hit.face.normal.clone();
      let slot = -1, bd = -2;
      FACE_N.forEach((v, i) => { const d = n.dot(new T.Vector3(...v)); if (d > bd){ bd = d; slot = i; } });
      const f = this._faces[slot];
      if (!f) return { face:null, x:0, y:0, facing:0, sx, sy };
      let x = hit.uv.x * 2 - 1, y = (1 - hit.uv.y) * 2 - 1;
      const k = (this._roll && this._roll[slot]) || 0;
      if (k){ const a = -k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
        const nx = x * ca + y * sa, ny = -x * sa + y * ca; x = nx; y = ny; }
      const camDir = new T.Vector3().subVectors(this._camera.position, this._cube.position).normalize();
      const facing = new T.Vector3(...FACE_N[slot]).applyQuaternion(this._cube.quaternion).dot(camDir);
      return { face:f.id, x, y, facing, sx, sy };
    }

    /* ---------- Eingabe ---------- */
    _pick(e){
      const cv = this._renderer.domElement, r = cv.getBoundingClientRect();
      this._ndc.set(((e.clientX-r.left)/r.width)*2-1, -(((e.clientY-r.top)/r.height)*2-1));
      this._ray.setFromCamera(this._ndc, this._camera);
      const hit = this._ray.intersectObject(this._cube, false)[0];
      if (!hit) return -1;
      const n = hit.face.normal.clone();
      let best = -1, bd = -2;
      FACE_N.forEach((v, i) => { const d = n.dot(new this._THREE.Vector3(...v)); if (d > bd){ bd = d; best = i; } });
      return best;
    }
    /* Der HTMLTexture-Polyfill hängt die Flächen in den Fallback-Teilbaum des Canvas —
       dort werden sie weder gerendert noch getroffen. Also treffen wir selbst: Strahl auf
       den Würfel, UV der getroffenen Fläche in Entwurfspixel umrechnen, das Bedienelement
       über die Layout-Offsets suchen und den Klick synthetisch zustellen. */
    _hitAct(e){
      if (!this._ray || !this._cube) return null;
      const cv = this._renderer.domElement, r = cv.getBoundingClientRect();
      this._ndc.set(((e.clientX-r.left)/r.width)*2-1, -(((e.clientY-r.top)/r.height)*2-1));
      this._ray.setFromCamera(this._ndc, this._camera);
      const hit = this._ray.intersectObject(this._cube, false)[0];
      if (!hit || !hit.uv) return null;
      const n = hit.face.normal.clone();
      let slot = -1, bd = -2;
      FACE_N.forEach((v, i) => { const d = n.dot(new this._THREE.Vector3(...v)); if (d > bd){ bd = d; slot = i; } });
      const f = this._faces[slot]; if (!f) return null;
      const el = this._els[f.id]; if (!el) return null;
      const fs = el.offsetWidth || 470;
      let px = hit.uv.x * fs, py = (1 - hit.uv.y) * fs;
      const k = (this._roll && this._roll[slot]) || 0;
      if (k){ // Sichtpunkt in das ungedrehte Layout zurückrechnen
        const a = -k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), h = fs / 2;
        const dx = px - h, dy = py - h;
        px = h + dx * ca + dy * sa; py = h - dx * sa + dy * ca;
      }
      let found = null;
      // Inhalt liegt in __rot (von HTMLTexture in den Canvas-Teilbaum verschoben); die
      // Flaechen-GROESSE bleibt am Face, weil dort --fs sitzt.
      const root = el.__des || el.__rot || el;
      root.querySelectorAll('[data-act]').forEach(t => {
        let x = 0, y = 0, node = t;
        while (node && node !== root){ x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
        if (px >= x && px <= x + t.offsetWidth && py >= y && py <= y + t.offsetHeight) found = t;
      });
      return found ? { el: found, face: f.id, slot } : null;
    }

    _startDrag(e){
      try { const sel = getSelection(); if (sel && sel.removeAllRanges) sel.removeAllRanges(); } catch(_){}
      this._down = true; this._dragging = false; this._target = null; this._needSnap = false;
      this._vel.x = this._vel.y = 0; this._tm = performance.now();
      try { (this._cv3d || this).setPointerCapture && (e.pointerId != null) && this.setPointerCapture(e.pointerId); } catch(_){}
      this._lx = this._dx0 = e.clientX; this._ly = this._dy0 = e.clientY; this._t0 = performance.now();
      this.style.cursor = 'grabbing';
    }
    _bindInput(cv){
      cv.style.cursor = 'grab';
      this.style.cursor = 'grab';
      cv.addEventListener('pointerdown', e => this._startDrag(e));
      const move = e => {
        if (!this._down){
          if (performance.now() - (this._fpAt || 0) > 33){
            this._fpAt = performance.now();
            const p = this._facePt(e);
            if (p) this.dispatchEvent(new CustomEvent('facepoint', { detail:p, bubbles:true, composed:true }));
          }
          if (!this._target && performance.now() - (this._hoverAt || 0) > 90){
            this._hoverAt = performance.now();
            const h = this._hitAct(e);
            const cur = h ? 'pointer' : 'grab';
            if (cur !== this._cur){ this._cur = cur; cv.style.cursor = cur; this.style.cursor = cur; }
          }
          return;
        }
        const dx = e.clientX - this._lx, dy = e.clientY - this._ly;
        if (Math.hypot(e.clientX - this._dx0, e.clientY - this._dy0) > 3) this._dragging = true;
        if (this._dragging){
          const T = this._THREE;
          const right = new T.Vector3().setFromMatrixColumn(this._camera.matrixWorld, 0);
          const up = new T.Vector3().setFromMatrixColumn(this._camera.matrixWorld, 1);
          const k = 4.0 / Math.max(160, this._vh || 340);   // Empfindlichkeit an die Bühne gekoppelt
          const kx = dx * k, ky = dy * k;
          this._cube.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(up, kx)
            .multiply(new T.Quaternion().setFromAxisAngle(right, ky)));
          const now = performance.now();
          const dts = Math.max(0.008, Math.min(0.06, (now - (this._tm || now - 16)) / 1000));
          const a = 0.35;                                     // geglättete Winkelgeschwindigkeit
          this._vel.x = this._vel.x * (1 - a) + (kx / dts) * a;
          this._vel.y = this._vel.y * (1 - a) + (ky / dts) * a;
          this._tm = now;
        }
        this._lx = e.clientX; this._ly = e.clientY;
      };
      const up = e => {
        if (!this._down) return;
        this._down = false;
        this.style.cursor = 'grab';
        const quick = performance.now() - this._t0 < 420;
        const moved = Math.hypot(e.clientX - this._dx0, e.clientY - this._dy0);
        // Flick/Schnipp: kurz, weit genug, mit Restschwung. Die Engine wertet nicht, sie meldet —
        // was ein Flick bedeutet (Scan oder zurück), entscheidet die Shell.
        const sp = Math.hypot(this._vel.x, this._vel.y);
        if (performance.now() - this._t0 < 250 && moved > 18 && sp > 2.2){
          this.dispatchEvent(new CustomEvent('flick', { bubbles:true, composed:true,
            detail:{ vx:this._vel.x, vy:this._vel.y, speed:sp, face:this.active } }));
        }
        if (quick && moved < 6){
          this._dragging = false;
          const h = this._hitAct(e);
          if (h){
            const t = h.el, tag = t.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA'){ try { t.focus(); } catch(_){} }
            else t.click();          // die Fläche delegiert click -> faceaction
            this._dirty = true;
            return;
          }
          const i = this._pick(e);
          if (i >= 0 && this._faces[i]){
            const fid = this._faces[i].id;
            if (fid === this._vidFace && fid === (this._faces[this._active]||{}).id){ this.toggleVideo(); return; }
            this.active = fid;
          }
          return;
        }
        // Schwung ausrollen lassen, dann auf die nächstliegende Fläche einrasten
        this._dragging = false;
        this._needSnap = true;
      };
      addEventListener('pointermove', move, { passive:true });
      addEventListener('pointerup', up);
      addEventListener('pointercancel', up);
      this._unbind = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
    }
    _snap(){
      const T = this._THREE;
      const camDir = new T.Vector3(0,0,1);
      let best = this._active, bd = -2;
      this._faces.forEach((f, i) => {
        const d = new T.Vector3(...FACE_N[i]).applyQuaternion(this._cube.quaternion).dot(camDir);
        if (d > bd){ bd = d; best = i; }
      });
      if (best === this._active || !this._faces[best]) this._face(this._active);
      else this.active = this._faces[best].id;
    }
    _face(i){
      this._target = this._quatFor(i);
      this._vel.x = this._vel.y = 0;
    }
    spin(){
      if (this._mode !== '3d' || this._reduced) return;
      const T = this._THREE;
      const q = this._quatFor(this._active);
      this._cube.quaternion.copy(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0), -1.9).multiply(q));
      this._target = q;
    }

    _resize(){
      if (!this._renderer) return;
      const W = this.clientWidth || 300, H = this.clientHeight || 300;
      this._renderer.setSize(W, H, false);
      this._camera.aspect = W/H; this._camera.updateProjectionMatrix();
      this._desFit();
      this._fit(W, H);
    }

    /* ---------- Kameradistanz aus dem Seitenverhältnis: der Würfel wird nie angeschnitten ---------- */
    _fit(W, H){
      if (!this._camera || !this._camDir) return;
      const fov = this._camera.fov * Math.PI / 180;
      const aspect = Math.max(0.35, W / Math.max(1, H));
      const R = 1.255;             // halbe Raumdiagonale + Rand
      this._dist = Math.max(R / Math.tan(fov / 2) / Math.min(1, aspect), 3.0);
      this._vw = W; this._vh = H;
      this._lookAt.set(0, 0, 0);
      this._place();
    }

    _place(){
      const d = this._dist / (this._zoom || 1);
      this._camBase.copy(this._camDir).multiplyScalar(d).add(this._lookAt);
      this._camera.position.copy(this._camBase);
      this._camera.lookAt(this._lookAt);
      this._camera.updateMatrixWorld();
    }

    _frame(){
      if (this._stopped) return;
      // Zaehler fuer den Watchdog des Hosts: cubeready('3d') heisst nur, dass der Renderer
      // INITIALISIERT ist. Auf Geraeten, wo WebGPU zwar startet, aber nichts auf den Canvas
      // bringt, blieb der Wuerfel unsichtbar — der Platzhalter war da schon ausgeblendet.
      this._frames = (this._frames | 0) + 1;
      const T = this._THREE, dt = Math.min(this._clock.getDelta(), 0.05);
      if (this._target){
        this._cube.quaternion.slerp(this._target, 1 - Math.pow(0.0009, dt));
        // Restwinkel merken: das Idle fragt danach, nicht nach der blossen EXISTENZ des Targets.
        // Ein konvergiertes Target ist keine laufende Bewegung — wer das verwechselt, haelt die
        // Figur fuer beschaeftigt, solange die Referenz noch herumliegt (v4d, gemessen).
        this._tRest = this._cube.quaternion.angleTo(this._target);
        if (this._tRest < 0.003){
          this._cube.quaternion.copy(this._target); this._target = null; this._tRest = 0;
        }
      } else if (!this._dragging){
        this._tRest = 0;
        const decay = Math.pow(0.12, dt);
        this._vel.x *= decay; this._vel.y *= decay;
        const speed = Math.abs(this._vel.x) + Math.abs(this._vel.y);
        if (speed > 0.05){
          const right = new T.Vector3().setFromMatrixColumn(this._camera.matrixWorld, 0);
          const up = new T.Vector3().setFromMatrixColumn(this._camera.matrixWorld, 1);
          this._cube.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(up, this._vel.x * dt)
            .multiply(new T.Quaternion().setFromAxisAngle(right, this._vel.y * dt)));
        } else if (this._needSnap && !this._down){
          this._vel.x = this._vel.y = 0;
          this._needSnap = false; this._snap();
        }
      }
      if (this._dist){
        const z = this._zoom + (this._zoomTarget - this._zoom) * Math.min(1, dt * 7);
        if (Math.abs(z - this._zoom) > 0.0005){ this._zoom = z; this._place(); }
      }
      // Cartoon-Schicht: Squash volumenerhaltend, Dauerdrehung additiv zur Idle-Schwebe.
      // Läuft VOR updateMatrixWorld, damit _align() die tatsächlich sichtbare Orientierung liest.
      if (this._pivot){
        const p = this._pivot, sq = this._squash || 1, inv = 1 / Math.sqrt(sq);
        p.scale.set(inv, sq, inv);
        if (this._spinRate) this._spinPhase = (this._spinPhase || 0) + this._spinRate * dt;
        else if (this._spinSettle){
          // Einpendeln auf die nächste ganze Umdrehung, sonst ruht der Würfel verdreht.
          const tgt = Math.round((this._spinPhase || 0) / (Math.PI * 2)) * Math.PI * 2;
          this._spinPhase += (tgt - this._spinPhase) * (1 - Math.exp(-6 * dt));
          if (Math.abs(tgt - this._spinPhase) < 0.004){ this._spinPhase = 0; this._spinSettle = false; }
        }
        if (this._spinWasOn){
          p.rotation.y = (this._idleRotY || 0) + (this._spinPhase || 0);
          if (!this._spinPhase && !this._spinSettle) this._spinWasOn = false;
        }
        p.updateMatrixWorld(true);
      }
      this._cube.updateMatrixWorld();
      if (this._vid && (this._vidPlaying || this._vidDrawn !== this._vidPlaying)) this._drawVideo();
      this._upright();
      this._align();
      if (this._refresh > 0){
        this._refresh--;
        (this._mats || []).forEach(m => { if (m.map) m.map.needsUpdate = true; });
      }
      // Idle: leichtes Schweben, solange nichts anderes passiert. Amplituden bewusst unter
      // einem Grad — die zugewandte Fläche darf sich nicht spürbar wegdrehen, sie soll nur
      // nicht tot stehen. Läuft auf dem Pivot, nicht auf dem Würfel.
      if (this._pivot){
        /* RUHE ist eine Frage der Bewegung, nicht des Zustands (v4d). Vorher stand hier
           `!this._target` — und weil die Ausrichtungs-Referenz nach dem Einpendeln haengen
           bleiben kann, war `still` dauerhaft false: `_idleAmp` lief gegen 0 und der ganze
           Wabern-Block hat nie ausgefuehrt. Recherchi stand still, wo v4b Leben versprochen hat.
           Jetzt entscheidet der RESTWINKEL: wer noch mehr als ~1,7° zu drehen hat, dreht;
           alles darunter ist angekommen und darf treiben. */
        const still = !this._down && !this._dragging && !this._reduced
          && (this._tRest || 0) < 0.03
          && (Math.abs(this._vel.x) + Math.abs(this._vel.y) < 0.05);
        const amp = this._idleAmp = (this._idleAmp || 0) + ((still ? 1 : 0) - (this._idleAmp || 0)) * Math.min(1, dt * 2.2);
        if (amp > 0.001){
          const it = this._idleT = (this._idleT || 0) + dt * (still ? 1 : 0.35);
          const p = this._pivot;
          /* WABERN statt Zucken (v4b). Vorher: winzige Amplituden unter einem Grad plus alle
             1,6–3,4 s ein Idle-Huepfer aus der Motion-Schicht — zusammen las das als Schluckauf:
             tot stehen, kurz zappeln, tot stehen. Jetzt eine einzige langsame Bewegung, die nie
             aufhoert: driften und um die eigene Achse pendeln (±6°, ~26 s Umlauf), drei Perioden
             ohne gemeinsamen Teiler, damit sich die Schleife nicht hoerbar wiederholt.
             Das Huepfen bleibt dem Ereignis vorbehalten — wenn er wirklich irgendwo hin will. */
          p.position.y = this._hover + Math.sin(it * 0.44) * 0.055 * amp;
          p.position.x = Math.sin(it * 0.31 + 1.3) * 0.030 * amp;
          this._idleRotX = Math.sin(it * 0.37 + 0.4) * 0.032 * amp;
          this._idleRotZ = Math.sin(it * 0.29 + 2.1) * 0.026 * amp;
          p.rotation.y = Math.sin(it * 0.24) * 0.105 * amp;
          this._idleRotY = p.rotation.y;
          // Kein Nachluegen des Schattens mehr: die Schwebe passiert im Raum, der Boden nimmt
          // sie von selbst auf. Genau das war der Punkt am echten Boden.
        }
      }
      // Cartoon-Schicht: Squash volumenerhaltend, Dauerdrehung additiv zur Idle-Schwebe.
      if (this._pivot){
        const p = this._pivot, sq = this._squash || 1, inv = 1 / Math.sqrt(sq);
        p.scale.set(inv, sq, inv);
        // Neigung ADDIERT sich auf das Wabern — sie ersetzt es nicht. Zwei Gründe, eine Achse:
        // die Figur treibt weiter und wendet sich dabei zu. Getrennt gehalten, damit keiner
        // den anderen überschreibt (das war der Fehler, als beide direkt auf rotation schrieben).
        p.rotation.x = (this._idleRotX || 0) + (this._leanX || 0);
        p.rotation.z = (this._idleRotZ || 0) + (this._leanZ || 0);
        if (this._spinRate) this._spinPhase = (this._spinPhase || 0) + this._spinRate * dt;
        if (this._spinPhase) p.rotation.y = (this._idleRotY || 0) + this._spinPhase;
      }
      // Rastern: INHALTS-Änderungen (_needPaint via _touch) müssen auch während einer Dauerdrehung
      // durch — sonst friert der Fortschritt auf der Fläche ein. Nur die Roll-Korrektur aus
      // _upright() wird aufgeschoben; die feuert beim Drehen dauernd und war die Ruckelquelle.
      if (this._cv3d){
        const busy = this._down || this._dragging ||
          (Math.abs(this._vel.x) + Math.abs(this._vel.y) > 0.2);
        if (this._needPaint && !busy){
          this._needPaint = false; this._rollPaint = false;
          try { this._cv3d.requestPaint(); } catch(_){}
        } else if (this._rollPaint && !busy && !this._spinRate && !this._target){
          this._rollPaint = false;
          try { this._cv3d.requestPaint(); } catch(_){}
        }
      }
      try { this._renderer.render(this._scene, this._camera); }
      catch (e){ this._needPaint = true; }
    }
  }

  customElements.define('recherchi-cube', RecherchiCube);
  window.RecherchiCube = RecherchiCube;
})();
