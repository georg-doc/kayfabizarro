export const EARTH_RADIUS_M = 6378137;

export function makeLocalENU(origin, earthRadiusM = EARTH_RADIUS_M) {
  const lat0 = Number(origin.lat);
  const lon0 = Number(origin.lon);
  const phi0 = lat0 * Math.PI / 180;
  const cos0 = Math.cos(phi0);
  if (!Number.isFinite(lat0) || !Number.isFinite(lon0)) throw new Error('Invalid ENU origin');
  return {
    origin: { lat: lat0, lon: lon0, altM: Number(origin.altM || 0) },
    axes: { x: 'east', y: 'up', z: 'north' },
    units: 'metre',
    project(lat, lon, altM = 0) {
      const dLat = (Number(lat) - lat0) * Math.PI / 180;
      const dLon = (Number(lon) - lon0) * Math.PI / 180;
      return {
        x: earthRadiusM * dLon * cos0,
        y: Number(altM) - Number(origin.altM || 0),
        z: earthRadiusM * dLat
      };
    },
    unproject(x, z, y = 0) {
      return {
        lat: lat0 + (Number(z) / earthRadiusM) * 180 / Math.PI,
        lon: lon0 + (Number(x) / (earthRadiusM * cos0)) * 180 / Math.PI,
        altM: Number(origin.altM || 0) + Number(y)
      };
    }
  };
}
