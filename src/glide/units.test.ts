import { describe, test } from "vitest";
import { convertDistance, convertSpeed } from "./units";
import { expectSameTo4SignificantFigures } from "./tolerances";

// Exact definitions: 1 NM = 1,852 m, 1 ft = 0.3048 m, 1 SM = 5,280 ft,
// so 1 NM = 6,076.115486 ft, 1 kt = 101.268591 fpm and 1 kt = 1.687810 ft/s.

describe("speed conversions", () => {
  test("100 kt is 115.0779 mph", () => {
    // C1: 100 × 6,076.115486 ÷ 5,280
    expectSameTo4SignificantFigures(convertSpeed(100, "kt", "mph"), 115.0779);
  });

  test("100 mph is 86.89762 kt", () => {
    // C2: 100 × 5,280 ÷ 6,076.115486
    expectSameTo4SignificantFigures(convertSpeed(100, "mph", "kt"), 86.89762);
  });

  test("100 kt is 185.2 km/h", () => {
    // C3: 100 × 1.852
    expectSameTo4SignificantFigures(convertSpeed(100, "kt", "km/h"), 185.2);
  });

  test("100 km/h is 53.99568 kt", () => {
    // C4: 100 ÷ 1.852
    expectSameTo4SignificantFigures(convertSpeed(100, "km/h", "kt"), 53.99568);
  });

  test("100 mph is 160.9344 km/h", () => {
    // C5: 100 × 1.609344
    expectSameTo4SignificantFigures(convertSpeed(100, "mph", "km/h"), 160.9344);
  });

  test("100 km/h is 62.13712 mph", () => {
    // C6: 100 ÷ 1.609344
    expectSameTo4SignificantFigures(convertSpeed(100, "km/h", "mph"), 62.13712);
  });

  test("1 kt is 101.2686 fpm", () => {
    // C7: 6,076.115486 ÷ 60
    expectSameTo4SignificantFigures(convertSpeed(1, "kt", "fpm"), 101.2686);
  });

  test("100 fpm is 0.9874730 kt", () => {
    // C8: 100 ÷ 101.268591
    expectSameTo4SignificantFigures(convertSpeed(100, "fpm", "kt"), 0.987473);
  });

  test("100 kt is 168.7810 ft/s", () => {
    // C9: 100 × 1.687810
    expectSameTo4SignificantFigures(convertSpeed(100, "kt", "ft/s"), 168.781);
  });

  test("100 ft/s is 59.24838 kt", () => {
    // C10: 100 ÷ 1.687810
    expectSameTo4SignificantFigures(convertSpeed(100, "ft/s", "kt"), 59.24838);
  });
});

describe("distance conversions", () => {
  test("100 NM is 115.0779 SM", () => {
    // C11: 100 × 6,076.115486 ÷ 5,280
    expectSameTo4SignificantFigures(convertDistance(100, "NM", "SM"), 115.0779);
  });

  test("100 SM is 86.89762 NM", () => {
    // C12: 100 × 5,280 ÷ 6,076.115486
    expectSameTo4SignificantFigures(convertDistance(100, "SM", "NM"), 86.89762);
  });

  test("100 NM is 185.2 km", () => {
    // C13: 100 × 1.852
    expectSameTo4SignificantFigures(convertDistance(100, "NM", "km"), 185.2);
  });

  test("100 km is 53.99568 NM", () => {
    // C14: 100 ÷ 1.852
    expectSameTo4SignificantFigures(convertDistance(100, "km", "NM"), 53.99568);
  });

  test("100 SM is 160.9344 km", () => {
    // C15: 100 × 1.609344
    expectSameTo4SignificantFigures(convertDistance(100, "SM", "km"), 160.9344);
  });

  test("100 km is 62.13712 SM", () => {
    // C16: 100 ÷ 1.609344
    expectSameTo4SignificantFigures(convertDistance(100, "km", "SM"), 62.13712);
  });

  test("10,000 ft is 1.645788 NM", () => {
    // C17: 10,000 ÷ 6,076.115486
    expectSameTo4SignificantFigures(
      convertDistance(10_000, "ft", "NM"),
      1.645788,
    );
  });

  test("1 NM is 6,076.115 ft", () => {
    // C18: 1,852 ÷ 0.3048
    expectSameTo4SignificantFigures(convertDistance(1, "NM", "ft"), 6076.115);
  });

  test("10,000 ft is 1.893939 SM", () => {
    // C19: 10,000 ÷ 5,280
    expectSameTo4SignificantFigures(
      convertDistance(10_000, "ft", "SM"),
      1.893939,
    );
  });

  test("1 SM is 5,280 ft", () => {
    // C20: by definition
    expectSameTo4SignificantFigures(convertDistance(1, "SM", "ft"), 5280);
  });

  test("10,000 ft is 3.048 km", () => {
    // C21: 10,000 × 0.3048 ÷ 1,000
    expectSameTo4SignificantFigures(convertDistance(10_000, "ft", "km"), 3.048);
  });

  test("1 km is 3,280.840 ft", () => {
    // C22: 1,000 ÷ 0.3048
    expectSameTo4SignificantFigures(convertDistance(1, "km", "ft"), 3280.84);
  });
});

describe("round trip", () => {
  test("65 kt to mph to km/h and back is 65.00 kt", () => {
    // R1: 65 kt → 74.80066 mph → 120.38 km/h → 65.00 kt, keeping every digit between steps
    const speedMph = convertSpeed(65, "kt", "mph");
    const speedKmh = convertSpeed(speedMph, "mph", "km/h");
    expectSameTo4SignificantFigures(convertSpeed(speedKmh, "km/h", "kt"), 65);
  });
});
