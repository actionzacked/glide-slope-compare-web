import { convertSpeed } from "./units";

// Comparisons are written as "not above 0" so a value that is not a number gives no result too.

// Flat terrain at 0 ft MSL, so the starting altitude is the altitude above the terrain.
export function glideDistanceFt(startAltitudeFt: number, glideRatio: number) {
  if (!(startAltitudeFt >= 0 && glideRatio > 0)) return null;
  // AFH p. 3-21: glide distance = altitude above the terrain × glide ratio.
  return startAltitudeFt * glideRatio;
}

export function glideTimeS(glideDistanceFt: number, bestGlideSpeedKt: number) {
  if (!(bestGlideSpeedKt > 0)) return null;
  // PHAK p. 16-11: time = distance ÷ speed, with distance along the ground as pilots are taught.
  return glideDistanceFt / convertSpeed(bestGlideSpeedKt, "kt", "ft/s");
}

export function sinkRateFpm(bestGlideSpeedKt: number, glideRatio: number) {
  if (!(bestGlideSpeedKt > 0 && glideRatio > 0)) return null;
  // GFH p. 5-10: glide ratio = best-glide speed ÷ sink rate, rearranged.
  return convertSpeed(bestGlideSpeedKt / glideRatio, "kt", "fpm");
}

export interface GlideInputs {
  startAltitudeFt: number;
  glideRatio: number;
  bestGlideSpeedKt: number;
}

export function glide({
  startAltitudeFt,
  glideRatio,
  bestGlideSpeedKt,
}: GlideInputs) {
  const distanceFt = glideDistanceFt(startAltitudeFt, glideRatio);
  return {
    glideDistanceFt: distanceFt,
    glideTimeS:
      distanceFt === null ? null : glideTimeS(distanceFt, bestGlideSpeedKt),
    sinkRateFpm:
      distanceFt === null ? null : sinkRateFpm(bestGlideSpeedKt, glideRatio),
  };
}
