import { formatGlideDistance, formatGlideTime, formatSinkRate } from "./format";

interface AircraftCardProps {
  name: string;
  glideDistanceFt: number | null;
  glideTimeS: number | null;
  sinkRateFpm: number | null;
}

export function AircraftCard({
  name,
  glideDistanceFt,
  glideTimeS,
  sinkRateFpm,
}: AircraftCardProps) {
  return (
    <article className="aircraft-card">
      <h2>{name}</h2>
      <dl>
        <dt>Glide distance</dt>
        <dd>{formatGlideDistance(glideDistanceFt)}</dd>
        <dt>Glide time</dt>
        <dd>{formatGlideTime(glideTimeS)}</dd>
        <dt>Sink rate</dt>
        <dd>{formatSinkRate(sinkRateFpm)}</dd>
      </dl>
    </article>
  );
}
