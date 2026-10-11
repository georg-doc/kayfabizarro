// IslandField facade on the R2D fields (STAGE1_R2D_PORT_PLAN §3): Environment, nature, probes and the road bed keep
// calling height / base / bed / free / isClear / pathDist / addEmbed; underneath, every answer comes from the analytic
// R2D plan. Composition (landmark, open zone, paths) is shared with the old terrain (composition.ts).
import { IslandField } from '../terrain';
import type { RoadBedField } from '../roadbed';
import type { IslandSpec } from '../spec';
import { signedDist } from '../shape';
import { R2D_BIOMES, type R2DBiome } from '../../palettes';
import { planFromSpec, type R2DMount } from './plan';
import { fields, type R2DEmbed, type R2DFields } from './fields';
import { roadFromBed, type RoadQuery } from './road';
import { sstep } from './math';
import { edgeFor, type EdgeParams } from './terrain-mesh';

/** R2D hill frequency 1 = 0.03 / unit (R2D `natural`); spec.terrain.hillScale is the lab's base frequency */
export const R2D_FQ0 = 0.03;

export class R2DIslandField extends IslandField {
  readonly biomeRow: R2DBiome;
  readonly plan: ReturnType<typeof planFromSpec>;
  readonly F: R2DFields;
  readonly roadQ: RoadQuery | null;
  /** rim rounding for this island's size (R2D cap / ov × mean radius / 34) */
  readonly edge: EdgeParams & { k: number };
  private embedAdapter: R2DEmbed[] = [];

  constructor(spec: IslandSpec, road: RoadBedField | null = null) {
    super(spec, road);
    this.biomeRow = R2D_BIOMES[spec.palette] ?? R2D_BIOMES.canyon;
    this.roadQ = road ? roadFromBed(road.spec) : null;
    const T = spec.terrain;
    this.plan = planFromSpec({
      spec, poly: this.poly,
      terr: { amp: T.hills, fq: T.hillScale / R2D_FQ0, terrace: this.biomeRow.terrace, roll: this.biomeRow.roll },
      plazas: spec.noComposition ? [] : this.plazas, paths: spec.noComposition ? [] : this.paths.map((pts, k) => ({ pts, w: this.pathW[k] })),
      road: this.roadQ, mount: T.mount as R2DMount | null,
    });
    this.F = fields(this.plan, () => this.embedAdapter);
    this.edge = edgeFor(this.biomeRow.edge, this.plan.edgeR);
  }

  /** positive inside (lab convention) = −R2D sdf, including R2D's clay wobble of the rim */
  override sd(x: number, z: number) { return -this.plan.sdf(x, z); }
  override raw(x: number, z: number, sd = this.sd(x, z)) { return { h: this.F.baseAt(x, z), hills: 0, mount: 0, basin: 0, sd }; }
  override base(x: number, z: number) { return this.F.heightAt(x, z); }
  /** R2D paths are not pressed in: they are paving speckle on the same height (aTW.y) */
  override height(x: number, z: number) { return this.F.heightAt(x, z); }
  /** §01: no contact darkening on the terrain (dark rings under objects are forbidden) */
  override contactShade() { return 1; }

  mask(x: number, z: number) { return this.F.maskAt(x, z); }
  weights(x: number, z: number) { return this.F.weightsAt(x, z); }

  /** embeds become analytic height (earth wedge / talus) + rock speckle at the foot of rocks */
  private syncEmbeds() {
    if (!this.embeds.size) { this.embedAdapter = []; return; }
    const rocks = [...this.embeds.values()].filter((e) => e.kind === 'boulder' || e.kind === 'outcrop' || e.kind === 'rim');
    this.embedAdapter = [{
      rise: (x, z, h) => this.embedRise(x, z, h),
      w: (x, z) => {
        let r = 0;
        for (const e of rocks) {
          if (x < e.x0 || x > e.x1 || z < e.z0 || z > e.z1) continue;
          const out = Math.max(0, -signedDist(x, z, e.poly));
          r = Math.max(r, 1 - sstep(0.2, e.falloff * 0.8 + 0.6, out));
        }
        return r > 0 ? [0, 0, r] : null;
      },
    }];
  }
  override addEmbed(e: Parameters<IslandField['addEmbed']>[0]) { const r = super.addEmbed(e); this.syncEmbeds(); return r; }
  override removeEmbed(id: string) { super.removeEmbed(id); this.syncEmbeds(); }
  override clearEmbeds() { super.clearEmbeds(); this.syncEmbeds(); }
}
