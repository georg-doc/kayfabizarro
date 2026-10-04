/** Preview only: consumes City Lab's existing frame and override entry shape.
 * Does NOT edit its manifest, hide a base building, mutate roads or own collision.
 */
import {makeLocalENU} from '../../../osm-city-lab/src/osm/projection.js';
export function preparePlacement(entry,source,frame){
 const no=reason=>({status:'BLOCKED',reason,keepBaseBuilding:true});
 if(!entry?.osm||!['way','relation'].includes(entry.osm.type)||!Number.isSafeInteger(entry.osm.id)||entry.osm.id<=0)return no('Missing verified OSM way/relation identity');
 if(source?.osm?.type!==entry.osm.type||source?.osm?.id!==entry.osm.id)return no('OSM identity mismatch');
 if(entry?.asset?.repo!=='georg-doc/kayfabizarro'||!entry.asset.path||!(/^[0-9a-f]{40}$/i.test(entry.asset.sourceCommit||'')))return no('Asset needs exact GitHub path and commit');
 if(entry?.baseBuilding?.policy!=='hide-only-after-asset-loaded-and-validated')return no('Missing fallback contract');
 if(entry?.placement?.originPolicy!=='osm-footprint-centroid')return no('Unsupported origin policy');
 const {scale,yawDeg,yOffsetM}=entry.placement;
 if(!Number.isFinite(scale)||scale<=0||!Number.isFinite(yawDeg)||!Number.isFinite(yOffsetM))return no('Invalid placement transform');
 if(frame?.units!=='metre'||frame.axes?.x!=='east'||frame.axes?.y!=='up'||frame.axes?.z!=='north')return no('Receiver frame mismatch');
 const c=source.centroidWgs84;
 if(!c||!Number.isFinite(c.lat)||!Number.isFinite(c.lon)||!Number.isFinite(source.groundY))return no('Receiver must supply footprint centroid and ground Y');
 const b=frame.bboxWgs84;
 if(!b||!['south','west','north','east'].every(k=>Number.isFinite(b[k])))return no('Missing receiver bbox');
 if(c.lat<b.south||c.lat>b.north||c.lon<b.west||c.lon>b.east)return no('Outside receiver bbox; do not relocate a real landmark');
 const point=makeLocalENU(frame.origin).project(c.lat,c.lon);
 return {status:'PLACEMENT_PREVIEW_ONLY',position:{x:point.x,y:source.groundY+yOffsetM,z:point.z},scale,yawRadians:yawDeg*Math.PI/180,keepBaseBuilding:true,requires:['asset-load','footprint-fit','orientation','scale-review','consumer-acceptance']};
}
