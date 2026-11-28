// Every factor derives from the exact definitions 1 ft = 0.3048 m, 1 NM = 1,852 m and 1 SM = 5,280 ft.
const feetPerMetre = 1 / 0.3048;
const secondsPerHour = 3600;

const feetPerDistanceUnit = {
  ft: 1,
  NM: 1852 * feetPerMetre,
  SM: 5280,
  km: 1000 * feetPerMetre,
};

const feetPerSecondPerSpeedUnit = {
  kt: feetPerDistanceUnit.NM / secondsPerHour,
  mph: feetPerDistanceUnit.SM / secondsPerHour,
  "km/h": feetPerDistanceUnit.km / secondsPerHour,
  fpm: 1 / 60,
  "ft/s": 1,
};

type DistanceUnit = keyof typeof feetPerDistanceUnit;
type SpeedUnit = keyof typeof feetPerSecondPerSpeedUnit;

export function convertDistance(
  distance: number,
  from: DistanceUnit,
  to: DistanceUnit,
) {
  return (distance * feetPerDistanceUnit[from]) / feetPerDistanceUnit[to];
}

export function convertSpeed(speed: number, from: SpeedUnit, to: SpeedUnit) {
  return (
    (speed * feetPerSecondPerSpeedUnit[from]) / feetPerSecondPerSpeedUnit[to]
  );
}
