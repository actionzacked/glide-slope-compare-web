import { convertDistance } from "../glide/units";

const noResult = "—";

function orDash(value: number | null, format: (value: number) => string) {
  return value === null ? noResult : format(value);
}

export function formatGlideDistance(glideDistanceFt: number | null) {
  return orDash(
    glideDistanceFt,
    (distanceFt) => `${convertDistance(distanceFt, "ft", "NM").toFixed(1)} NM`,
  );
}

export function formatGlideTime(glideTimeS: number | null) {
  return orDash(glideTimeS, (timeS) => {
    const wholeSeconds = Math.round(timeS);
    return `${String(Math.floor(wholeSeconds / 60))} min ${String(wholeSeconds % 60)} s`;
  });
}

export function formatSinkRate(sinkRateFpm: number | null) {
  return orDash(
    sinkRateFpm,
    (rateFpm) =>
      `${rateFpm.toLocaleString("en-US", { maximumFractionDigits: 0 })} fpm`,
  );
}
