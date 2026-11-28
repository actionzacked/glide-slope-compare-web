import { describe, expect, test } from "vitest";
import { glide, glideDistanceFt, glideTimeS, sinkRateFpm } from "./glide";
import { expectWithin } from "./tolerances";

const distanceToleranceFt = 1;
const timeToleranceS = 0.1;
const sinkRateToleranceFpm = 1;

describe("glide distance over flat terrain at 0 ft", () => {
  // AFH p. 3-21: glide distance = altitude above the terrain × glide ratio.

  test("glides 10,000 ft from 1,000 ft at 10:1", () => {
    // D1: 1,000 × 10 = 10,000 ft
    expectWithin(glideDistanceFt(1000, 10), 10_000, distanceToleranceFt);
  });

  test("glides 27,000 ft from 3,000 ft at 9:1", () => {
    // D2: 3,000 × 9 = 27,000 ft
    expectWithin(glideDistanceFt(3000, 9), 27_000, distanceToleranceFt);
  });

  test("glides 48,000 ft from 2,000 ft at 24:1", () => {
    // D3: 2,000 × 24 = 48,000 ft
    expectWithin(glideDistanceFt(2000, 24), 48_000, distanceToleranceFt);
  });

  test("glides 63,750 ft from 7,500 ft at 8.5:1", () => {
    // D4: 7,500 × 8.5 = 63,750 ft
    expectWithin(glideDistanceFt(7500, 8.5), 63_750, distanceToleranceFt);
  });

  test("gives no result for a glide ratio of 0", () => {
    expect(glideDistanceFt(3000, 0)).toBeNull();
  });
});

describe("glide time", () => {
  // PHAK p. 16-11: glide time = glide distance ÷ best-glide speed, with kt × 1.687810 = ft/s.

  test("glides for 91.15 s over 10,000 ft at 65 kt", () => {
    // T1: 65 × 1.687810 = 109.7076 ft/s; 10,000 ÷ 109.7076 = 91.15 s
    expectWithin(glideTimeS(10_000, 65), 91.15, timeToleranceS);
  });

  test("glides for 246.11 s over 27,000 ft at 65 kt", () => {
    // T2: 27,000 ÷ 109.7076 = 246.11 s
    expectWithin(glideTimeS(27_000, 65), 246.11, timeToleranceS);
  });

  test("glides for 568.78 s over 48,000 ft at 50 kt", () => {
    // T3: 50 × 1.687810 = 84.3905 ft/s; 48,000 ÷ 84.3905 = 568.78 s
    expectWithin(glideTimeS(48_000, 50), 568.78, timeToleranceS);
  });

  test("glides for 539.58 s over 63,750 ft at 70 kt", () => {
    // T4: 70 × 1.687810 = 118.1467 ft/s; 63,750 ÷ 118.1467 = 539.58 s
    expectWithin(glideTimeS(63_750, 70), 539.58, timeToleranceS);
  });

  test("gives no result for a best-glide speed of 0 kt", () => {
    expect(glideTimeS(27_000, 0)).toBeNull();
  });
});

describe("sink rate", () => {
  // GFH p. 5-10: sink rate = best-glide speed ÷ glide ratio in kt, then × 101.268591 for fpm.

  test("sinks 658.25 fpm at 65 kt and 10:1", () => {
    // S1: 65 ÷ 10 = 6.5 kt; × 101.268591 = 658.25 fpm
    expectWithin(sinkRateFpm(65, 10), 658.25, sinkRateToleranceFpm);
  });

  test("sinks 731.38 fpm at 65 kt and 9:1", () => {
    // S2: 65 ÷ 9 = 7.2222 kt; × 101.268591 = 731.38 fpm
    expectWithin(sinkRateFpm(65, 9), 731.38, sinkRateToleranceFpm);
  });

  test("sinks 210.98 fpm at 50 kt and 24:1", () => {
    // S3: 50 ÷ 24 = 2.0833 kt; × 101.268591 = 210.98 fpm
    expectWithin(sinkRateFpm(50, 24), 210.98, sinkRateToleranceFpm);
  });

  test("sinks 833.98 fpm at 70 kt and 8.5:1", () => {
    // S4: 70 ÷ 8.5 = 8.2353 kt; × 101.268591 = 833.98 fpm
    expectWithin(sinkRateFpm(70, 8.5), 833.98, sinkRateToleranceFpm);
  });

  test("sinks 212.66 fpm, the GFH's 2.1 kt, at 50 kt and 50 ÷ 2.1", () => {
    // S5: the GFH example backwards; 50 ÷ (50 ÷ 2.1) = 2.1 kt; × 101.268591 = 212.66 fpm
    expectWithin(sinkRateFpm(50, 50 / 2.1), 212.66, sinkRateToleranceFpm);
  });
});

describe("a whole glide over flat terrain at 0 ft", () => {
  test("from 3,000 ft at 9:1 and 65 kt glides 27,000 ft in 246.11 s, sinking 731.38 fpm", () => {
    // E1: D2, T2 and S2 joined: 3,000 × 9; 27,000 ÷ 109.7076; 65 ÷ 9 × 101.268591
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 9,
      bestGlideSpeedKt: 65,
    });
    expectWithin(result.glideDistanceFt, 27_000, distanceToleranceFt);
    expectWithin(result.glideTimeS, 246.11, timeToleranceS);
    expectWithin(result.sinkRateFpm, 731.38, sinkRateToleranceFpm);
  });

  test("from 2,000 ft at 24:1 and 50 kt glides 48,000 ft in 568.78 s, sinking 210.98 fpm", () => {
    // E2: D3, T3 and S3 joined: 2,000 × 24; 48,000 ÷ 84.3905; 50 ÷ 24 × 101.268591
    const result = glide({
      startAltitudeFt: 2000,
      glideRatio: 24,
      bestGlideSpeedKt: 50,
    });
    expectWithin(result.glideDistanceFt, 48_000, distanceToleranceFt);
    expectWithin(result.glideTimeS, 568.78, timeToleranceS);
    expectWithin(result.sinkRateFpm, 210.98, sinkRateToleranceFpm);
  });

  test("from 7,500 ft at 8.5:1 and 70 kt glides 63,750 ft in 539.58 s, sinking 833.98 fpm", () => {
    // E3: D4, T4 and S4 joined: 7,500 × 8.5; 63,750 ÷ 118.1467; 70 ÷ 8.5 × 101.268591
    const result = glide({
      startAltitudeFt: 7500,
      glideRatio: 8.5,
      bestGlideSpeedKt: 70,
    });
    expectWithin(result.glideDistanceFt, 63_750, distanceToleranceFt);
    expectWithin(result.glideTimeS, 539.58, timeToleranceS);
    expectWithin(result.sinkRateFpm, 833.98, sinkRateToleranceFpm);
  });

  test("answers the FAA glider test: 2,113.43 ft at 23:1 glides 8 NM", () => {
    // P1: PGL sample test Q28; 2,113.43 × 23 = 48,608.89 ft, within 1 ft of 8 × 6,076.115486 = 48,608.92 ft
    const result = glide({
      startAltitudeFt: 2113.43,
      glideRatio: 23,
      bestGlideSpeedKt: 50,
    });
    expectWithin(result.glideDistanceFt, 48_608.89, distanceToleranceFt);
  });
});

describe("no result for a whole glide from 3,000 ft over flat terrain", () => {
  test("gives no result at all for a glide ratio of 0", () => {
    // N1
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 0,
      bestGlideSpeedKt: 65,
    });
    expect(result).toEqual({
      glideDistanceFt: null,
      glideTimeS: null,
      sinkRateFpm: null,
    });
  });

  test("gives no result at all for a glide ratio of -5", () => {
    // N2
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: -5,
      bestGlideSpeedKt: 65,
    });
    expect(result).toEqual({
      glideDistanceFt: null,
      glideTimeS: null,
      sinkRateFpm: null,
    });
  });

  test("gives no glide time or sink rate for a best-glide speed of 0 kt", () => {
    // N3: its glide distance is still an open question, so it is not checked.
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 9,
      bestGlideSpeedKt: 0,
    });
    expect(result).toMatchObject({ glideTimeS: null, sinkRateFpm: null });
  });

  test("gives no glide time or sink rate for a best-glide speed of -10 kt", () => {
    // N4: its glide distance is still an open question, so it is not checked.
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 9,
      bestGlideSpeedKt: -10,
    });
    expect(result).toMatchObject({ glideTimeS: null, sinkRateFpm: null });
  });

  test("gives no result at all for a glide ratio of 0 and a best-glide speed of 0 kt", () => {
    // N5
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 0,
      bestGlideSpeedKt: 0,
    });
    expect(result).toEqual({
      glideDistanceFt: null,
      glideTimeS: null,
      sinkRateFpm: null,
    });
  });

  test("gives no result at all for a glide ratio that is not a number", () => {
    // N6
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: Number.NaN,
      bestGlideSpeedKt: 65,
    });
    expect(result).toEqual({
      glideDistanceFt: null,
      glideTimeS: null,
      sinkRateFpm: null,
    });
  });

  test("gives no glide time or sink rate for a best-glide speed that is not a number", () => {
    // N7: its glide distance is still an open question, so it is not checked.
    const result = glide({
      startAltitudeFt: 3000,
      glideRatio: 9,
      bestGlideSpeedKt: Number.NaN,
    });
    expect(result).toMatchObject({ glideTimeS: null, sinkRateFpm: null });
  });
});
