// Pictures the world is dressed with: the real ones come from files, the rest (road paint, kerbs, container ribs, banners) are
// drawn once on a canvas when the game starts, so there is nothing more to download.
import { CanvasTexture, ClampToEdgeWrapping, LinearMipmapLinearFilter, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';

const loader = new TextureLoader();
const cache = new Map();

export function image(name, { colour = false, wrap = true, anisotropy = 8 } = {}) {
	const key = `${name}|${colour}|${wrap}`;
	if (cache.has(key)) return cache.get(key);
	const promise = loader.loadAsync(`stage/${name}.webp`).then((t) => {
		if (colour) t.colorSpace = SRGBColorSpace;
		if (wrap) t.wrapS = t.wrapT = RepeatWrapping;
		t.anisotropy = anisotropy;
		return t;
	});
	cache.set(key, promise);
	return promise;
}

function canvasTexture(w, h, draw, { repeat = true, colour = true, anisotropy = 8 } = {}) {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	draw(canvas.getContext('2d'), w, h);
	const t = new CanvasTexture(canvas);
	if (colour) t.colorSpace = SRGBColorSpace;
	t.wrapS = repeat ? RepeatWrapping : ClampToEdgeWrapping;
	t.wrapT = repeat ? RepeatWrapping : ClampToEdgeWrapping;
	t.anisotropy = anisotropy;
	t.minFilter = LinearMipmapLinearFilter;
	t.generateMipmaps = true;
	return t;
}

/** Lane paint across the road (u) repeating along it (v: one repeat is 12 m): edge lines and a dashed centre line. */
export function roadPaint({ centre = '#ffd25a', edge = '#f2f2f2', dashed = true, worn = 0.25 } = {}) {
	return canvasTexture(
		512,
		512,
		(g, w, h) => {
			g.clearRect(0, 0, w, h);
			const line = (x0, x1, y0, y1, colour) => {
				g.fillStyle = colour;
				g.fillRect(x0 * w, y0 * h, (x1 - x0) * w, (y1 - y0) * h);
			};
			// Edge lines 0.4 m wide at roughly 0.9 m from each edge, for a road about 13 m wide: given as fractions of the width.
			line(0.045, 0.062, 0, 1, edge);
			line(0.938, 0.955, 0, 1, edge);
			if (dashed) {
				line(0.4935, 0.5065, 0, 0.5, centre);
			} else {
				line(0.488, 0.4965, 0, 1, centre);
				line(0.5035, 0.512, 0, 1, centre);
			}
			// Wear: speckles of the road coming through the paint.
			const data = g.getImageData(0, 0, w, h);
			for (let i = 0; i < data.data.length; i += 4) {
				if (data.data[i + 3] > 0 && Math.random() < worn) data.data[i + 3] = Math.floor(data.data[i + 3] * (0.25 + Math.random() * 0.5));
			}
			g.putImageData(data, 0, 0);
		},
		{ colour: true },
	);
}

/** Red and white kerb stripes, one repeat per 2 m. */
export function kerb() {
	return canvasTexture(64, 128, (g, w, h) => {
		g.fillStyle = '#d9d9d9';
		g.fillRect(0, 0, w, h);
		g.fillStyle = '#d02020';
		g.fillRect(0, 0, w, h / 2);
	});
}

/** A corrugated shipping container side: grey ribs the colour then tints. */
export function containerSide() {
	const t = canvasTexture(256, 256, (g, w, h) => {
		g.fillStyle = '#d0d0d0';
		g.fillRect(0, 0, w, h);
		for (let x = 0; x < w; x += 16) {
			const grad = g.createLinearGradient(x, 0, x + 16, 0);
			grad.addColorStop(0, '#bcbcbc');
			grad.addColorStop(0.45, '#f2f2f2');
			grad.addColorStop(1, '#a4a4a4');
			g.fillStyle = grad;
			g.fillRect(x, 0, 16, h);
		}
		g.fillStyle = 'rgba(60,40,20,0.22)';
		for (let i = 0; i < 400; i++) g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 6, 1 + Math.random() * 2);
		g.fillStyle = 'rgba(30,30,30,0.5)';
		g.fillRect(0, 0, w, 6);
		g.fillRect(0, h - 6, w, 6);
	});
	return t;
}

/** The chequered start banner with the track's name. */
export function banner(title, sub) {
	return canvasTexture(
		1024,
		192,
		(g, w, h) => {
			g.fillStyle = '#0c0d11';
			g.fillRect(0, 0, w, h);
			const s = 24;
			for (let x = 0; x < w; x += s) {
				for (let y = 0; y < 2; y++) {
					g.fillStyle = (x / s + y) % 2 ? '#f4f4f4' : '#15161a';
					g.fillRect(x, y * s, s, s);
					g.fillRect(x, h - (y + 1) * s, s, s);
				}
			}
			g.fillStyle = '#ffffff';
			g.font = '900 78px "Segoe UI", Arial, sans-serif';
			g.textAlign = 'center';
			g.textBaseline = 'middle';
			g.fillText(title.toUpperCase(), w / 2, h / 2 - 8);
			g.fillStyle = '#ff8a2a';
			g.font = '700 28px "Segoe UI", Arial, sans-serif';
			g.fillText(sub.toUpperCase(), w / 2, h / 2 + 46);
		},
		{ repeat: false },
	);
}

/** A soft round glow, for lights and for the pools they put on the road. */
export function glow() {
	return canvasTexture(
		128,
		128,
		(g, w, h) => {
			const grad = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
			grad.addColorStop(0, 'rgba(255,255,255,1)');
			grad.addColorStop(0.25, 'rgba(255,255,255,0.5)');
			grad.addColorStop(1, 'rgba(255,255,255,0)');
			g.fillStyle = grad;
			g.fillRect(0, 0, w, h);
		},
		{ repeat: false, colour: false },
	);
}

/** Windows lit at random on a warehouse wall. */
export function windows(lit = '#ffcf7a') {
	return canvasTexture(256, 128, (g, w, h) => {
		g.fillStyle = '#1b1d24';
		g.fillRect(0, 0, w, h);
		for (let y = 8; y < h - 8; y += 24) {
			for (let x = 8; x < w - 8; x += 20) {
				g.fillStyle = Math.random() < 0.3 ? lit : '#2a2e3a';
				g.fillRect(x, y, 12, 14);
			}
		}
	});
}
