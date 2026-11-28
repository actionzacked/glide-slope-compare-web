import { describe, expect, test } from "vitest";
import { formatGlideDistance, formatGlideTime, formatSinkRate } from "./format";

describe("numbers on the aircraft card", () => {
  test("shows glide distance in NM to one decimal place", () => {
    // 27,000 ft ÷ 6,076.115486 = 4.4436 NM
    expect(formatGlideDistance(27_000)).toBe("4.4 NM");
  });

  test("shows glide time in whole minutes and seconds", () => {
    expect(formatGlideTime(246.11)).toBe("4 min 6 s");
  });

  test("rounds glide time to the second before splitting off minutes", () => {
    expect(formatGlideTime(119.6)).toBe("2 min 0 s");
  });

  test("shows sink rate in whole fpm", () => {
    expect(formatSinkRate(731.38)).toBe("731 fpm");
  });

  test("shows a dash for no result", () => {
    expect(formatGlideDistance(null)).toBe("—");
  });
});
