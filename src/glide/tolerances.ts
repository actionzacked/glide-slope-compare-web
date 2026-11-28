import { expect } from "vitest";

// One place for the tolerances the coding standards set on worked examples.
const distanceToleranceFt = 1;
const timeToleranceS = 0.1;
const sinkRateToleranceFpm = 1;

function expectWithin(
  actual: number | null,
  expected: number,
  tolerance: number,
) {
  expect(actual).not.toBeNull();
  expect(Math.abs((actual ?? Number.NaN) - expected)).toBeLessThanOrEqual(
    tolerance,
  );
}

export function expectDistanceFt(actual: number | null, expectedFt: number) {
  expectWithin(actual, expectedFt, distanceToleranceFt);
}

export function expectTimeS(actual: number | null, expectedS: number) {
  expectWithin(actual, expectedS, timeToleranceS);
}

export function expectSinkRateFpm(actual: number | null, expectedFpm: number) {
  expectWithin(actual, expectedFpm, sinkRateToleranceFpm);
}

export function expectSameTo4SignificantFigures(
  actual: number,
  expected: number,
) {
  const fourthFigurePlace =
    10 ** (Math.floor(Math.log10(Math.abs(expected))) - 3);
  expect(Math.abs(actual - expected)).toBeLessThan(fourthFigurePlace / 2);
}
