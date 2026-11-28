import { expect } from "vitest";

// Tolerances for glide-math worked examples, as the coding standards set them.

export function expectWithin(
  actual: number | null,
  expected: number,
  tolerance: number,
) {
  expect(actual).not.toBeNull();
  expect(Math.abs((actual ?? Number.NaN) - expected)).toBeLessThanOrEqual(
    tolerance,
  );
}

export function expectSameTo4SignificantFigures(
  actual: number,
  expected: number,
) {
  const fourthFigurePlace =
    10 ** (Math.floor(Math.log10(Math.abs(expected))) - 3);
  expect(Math.abs(actual - expected)).toBeLessThan(fourthFigurePlace / 2);
}
