// Every factor derives from the exact definitions 1 ft = 0.3048 m, 1 NM = 1,852 m and 1 SM = 5,280 ft.
const feetPerMetre = 1 / 0.3048;
export const secondsPerMinute = 60;
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
  fpm: 1 / secondsPerMinute,
  "ft/s": 1,
};

type DistanceUnit = keyof typeof feetPerDistanceUnit;
type SpeedUnit = keyof typeof feetPerSecondPerSpeedUnit;

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
) {
  return (value * feetPerDistanceUnit[from]) / feetPerDistanceUnit[to];
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit) {
  return (
    (value * feetPerSecondPerSpeedUnit[from]) / feetPerSecondPerSpeedUnit[to]
  );
}
